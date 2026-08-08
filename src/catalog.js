// Catalog: fetch + cache catalog payload from the Dota2Skins site or a local file.
const fs = require('fs');
const path = require('path');
const { loadSiteCatalog } = require('./catalog-site-adapter');

const DEFAULT_BASE = 'https://raw.githubusercontent.com/artem-prime42/dota2-mod-manager-catalog/main';
const DEFAULT_CATALOG_URL = `${DEFAULT_BASE}/catalog.json`;
const DEFAULT_DATA_FILE = 'catalog.json';
const RAW_BASE = DEFAULT_BASE;

function normalizeModName(name) {
  if (name === null || name === undefined) return null;
  const text = String(name).trim();
  if (!text) return null;
  return text.replace(/^!+\s*/, '').trim();
}

function normalizeCatalogPayload(data) {
  if (!data || typeof data !== 'object') return data;

  const normalizeValue = (value) => {
    if (Array.isArray(value)) return value.map(normalizeValue);
    if (!value || typeof value !== 'object') return value;

    const shouldNormalizeName = Object.prototype.hasOwnProperty.call(value, 'name') || Object.prototype.hasOwnProperty.call(value, 'title');
    if (shouldNormalizeName) {
      const copy = { ...value };
      if (Object.prototype.hasOwnProperty.call(copy, 'name')) copy.name = normalizeModName(copy.name);
      if (Object.prototype.hasOwnProperty.call(copy, 'title')) copy.title = normalizeModName(copy.title);
      return copy;
    }

    const out = {};
    for (const [key, child] of Object.entries(value)) {
      out[key] = normalizeValue(child);
    }
    return out;
  };

  if (data.mods && typeof data.mods === 'object') {
    if (data.mods.modsData) data.mods.modsData = normalizeValue(data.mods.modsData);
    if (data.mods.recentlyAddedMods) data.mods.recentlyAddedMods = normalizeValue(data.mods.recentlyAddedMods);
  }

  return data;
}

function stripDownloadCounts(value) {
  if (Array.isArray(value)) return value.map(stripDownloadCounts);
  if (!value || typeof value !== 'object') return value;

  const out = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === 'downloads' || key === 'downloadCount' || key === 'downloadsCount') continue;
    out[key] = stripDownloadCounts(child);
  }
  return out;
}

function isSameCatalogPayload(a, b) {
  try {
    const strippedA = stripDownloadCounts(a);
    const strippedB = stripDownloadCounts(b);
    return JSON.stringify(strippedA) === JSON.stringify(strippedB);
  } catch {
    return false;
  }
}

function mergeDownloadCounts(target, source) {
  if (Array.isArray(target) && Array.isArray(source)) {
    const len = Math.min(target.length, source.length);
    for (let i = 0; i < len; i += 1) {
      mergeDownloadCounts(target[i], source[i]);
    }
    return;
  }
  if (!target || !source || typeof target !== 'object' || typeof source !== 'object') {
    return;
  }
  for (const [key, targetValue] of Object.entries(target)) {
    if (key === 'downloads' || key === 'downloadCount' || key === 'downloadsCount') {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
      continue;
    }
    const sourceValue = source[key];
    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      mergeDownloadCounts(targetValue, sourceValue);
    } else if (targetValue && typeof targetValue === 'object' && sourceValue && typeof sourceValue === 'object') {
      mergeDownloadCounts(targetValue, sourceValue);
    }
  }
}

const GITHUB_RELEASE_URL_RE = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/releases\/download\/([^/]+)\/(.+)$/i;
const GITHUB_RELEASE_CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function parseGithubReleaseAssetUrl(value) {
  if (!value || typeof value !== 'string') return null;
  const match = value.match(GITHUB_RELEASE_URL_RE);
  if (!match) return null;
  return {
    owner: match[1],
    repo: match[2],
    tag: match[3],
    asset: decodeURIComponent(match[4]),
  };
}

function parseGithubLinkHeader(linkHeader) {
  if (!linkHeader || typeof linkHeader !== 'string') return {};
  return linkHeader.split(',').reduce((acc, part) => {
    const [urlPart, relPart] = part.split(';').map((item) => item.trim());
    const relMatch = relPart && relPart.match(/rel="(.+)"/);
    if (urlPart && relMatch) {
      const url = urlPart.replace(/^<|>$/g, '');
      acc[relMatch[1]] = url;
    }
    return acc;
  }, {});
}

async function fetchGithubReleases(owner, repo, cacheDir, forceRefresh = false) {
  const cacheFile = path.join(cacheDir, `github-releases-${owner}-${repo}.json`);
  if (!forceRefresh) {
    try {
      const info = fs.statSync(cacheFile);
      if (Date.now() - info.mtimeMs < GITHUB_RELEASE_CACHE_TTL_MS) {
        return JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      }
    } catch {
      // ignore missing or stale cache
    }
  }

  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'dota2-mod-manager',
  };
  if (token) headers.Authorization = `token ${token}`;

  const releases = [];
  let page = 1;
  let nextUrl = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=100&page=${page}`;

  while (nextUrl) {
    const res = await fetch(nextUrl, { headers });
    if (!res.ok) {
      throw new Error(`GitHub API failed for ${owner}/${repo}: HTTP ${res.status}`);
    }
    const pageReleases = await res.json();
    if (!Array.isArray(pageReleases)) break;
    releases.push(...pageReleases);

    const link = res.headers.get('link');
    const parsedLinks = parseGithubLinkHeader(link);
    nextUrl = parsedLinks.next || null;
    if (nextUrl && page >= 10) break;
    page += 1;
  }

  fs.writeFileSync(cacheFile, JSON.stringify(releases));
  return releases;
}

async function enrichGithubDownloadCounts(payload, cacheDir, forceRefresh = false) {
  if (!payload || !payload.mods || !payload.mods.modsData) return payload;
  const mods = [];
  for (const group of Object.values(payload.mods.modsData)) {
    if (Array.isArray(group)) {
      mods.push(...group);
    } else if (group && Array.isArray(group.groups)) {
      for (const sub of group.groups) {
        mods.push(...(sub.mods || []));
      }
    }
  }

  const repoResources = new Map();
  for (const mod of mods) {
    const candidates = [mod.file, mod.downloadUrl, mod.download_url, mod.url, mod.source, mod.repo].filter(Boolean);
    for (const candidate of candidates) {
      const parsed = parseGithubReleaseAssetUrl(candidate);
      if (parsed) {
        const repoKey = `${parsed.owner}/${parsed.repo}`;
        if (!repoResources.has(repoKey)) repoResources.set(repoKey, new Map());
        const releaseKey = `${parsed.tag}|${parsed.asset}`;
        repoResources.get(repoKey).set(releaseKey, { parsed, mod });
        break;
      }
    }
  }

  if (!repoResources.size) return payload;

  const downloadMap = new Map();
  for (const [repoKey, assets] of repoResources.entries()) {
    const [owner, repo] = repoKey.split('/');
    let releases;
    try {
      releases = await fetchGithubReleases(owner, repo, cacheDir, forceRefresh);
    } catch (err) {
      console.error('Failed to fetch GitHub releases for', repoKey, err.message || err);
      continue;
    }
    const assetCounts = new Map();
    for (const release of releases) {
      if (!release || !Array.isArray(release.assets)) continue;
      const tagName = release.tag_name;
      for (const asset of release.assets) {
        if (!asset || !asset.name) continue;
        assetCounts.set(`${tagName}|${asset.name}`, asset.download_count || 0);
      }
    }

    for (const [releaseKey, data] of assets.entries()) {
      const count = assetCounts.get(releaseKey);
      if (count != null) {
        downloadMap.set(releaseKey, count);
      }
    }
  }

  if (!downloadMap.size) return payload;

  for (const group of Object.values(payload.mods.modsData)) {
    if (Array.isArray(group)) {
      for (const mod of group) {
        const parsed = parseGithubReleaseAssetUrl(mod.file || mod.downloadUrl || mod.download_url || mod.url || mod.source || mod.repo);
        if (!parsed) continue;
        const releaseKey = `${parsed.tag}|${parsed.asset}`;
        const count = downloadMap.get(releaseKey);
        if (Number.isFinite(count) && count > 0) {
          mod.downloads = count;
        }
      }
    } else if (group && Array.isArray(group.groups)) {
      for (const sub of group.groups) {
        for (const mod of sub.mods || []) {
          const parsed = parseGithubReleaseAssetUrl(mod.file || mod.downloadUrl || mod.download_url || mod.url || mod.source || mod.repo);
          if (!parsed) continue;
          const releaseKey = `${parsed.tag}|${parsed.asset}`;
          const count = downloadMap.get(releaseKey);
          if (Number.isFinite(count) && count > 0) {
            mod.downloads = count;
          }
        }
      }
    }
  }

  return payload;
}

class Catalog {
  constructor(userDataDir, opts = {}) {
    this.cacheDir = path.join(userDataDir, 'catalog-cache');
    fs.mkdirSync(this.cacheDir, { recursive: true });
    const defaultSource = process.env.DOTA2SKINS_CATALOG_URL
      ? { type: 'remote', url: process.env.DOTA2SKINS_CATALOG_URL }
      : {
          type: 'site',
          repoRoot: process.env.DOTA2SKINS_SITE_REPO || 'https://github.com/artem-prime42/dota2-mod-manager-catalog',
          dataUrl: process.env.DOTA2SKINS_SITE_CATALOG_URL || DEFAULT_CATALOG_URL,
        };
    this.source = opts.source || defaultSource;
  }

  cachePath(name) {
    return path.join(this.cacheDir, name);
  }

  cacheInfo() {
    const metaFile = this.cachePath('meta.json');
    try {
      return JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
    } catch {
      return { fetchedAt: null };
    }
  }

  hasCache() {
    return fs.existsSync(this.cachePath(DEFAULT_DATA_FILE));
  }

  async refresh(forceRefresh = false) {
    let parsed;
    let text;
    if (this.source.type === 'file') {
      text = fs.readFileSync(this.source.filePath, 'utf-8');
      parsed = JSON.parse(text);
    } else if (this.source.type === 'site') {
      const dataUrl = this.source.dataUrl || this.source.fileUrl;
      if (dataUrl) {
        try {
          const res = await fetch(dataUrl);
          if (!res.ok) throw new Error(`HTTP ${res.status} while fetching catalog`);
          text = await res.text();
          parsed = JSON.parse(text);
        } catch (err) {
          if (this.source.fallbackSiteRoot) {
            parsed = await loadSiteCatalog({ siteRoot: this.source.fallbackSiteRoot });
            text = JSON.stringify(parsed);
          } else {
            throw err;
          }
        }
      } else {
        parsed = await loadSiteCatalog(this.source);
        text = JSON.stringify(parsed);
      }
    } else {
      try {
        const res = await fetch(this.source.url || DEFAULT_CATALOG_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status} while fetching catalog`);
        text = await res.text();
        parsed = JSON.parse(text);
      } catch (err) {
        if (this.source.fallbackSiteRoot) {
          parsed = await loadSiteCatalog(this.source.fallbackSiteRoot);
          text = JSON.stringify(parsed);
        } else {
          throw err;
        }
      }
    }

    let normalized = normalizeCatalogPayload(parsed);
    const cachePath = this.cachePath(DEFAULT_DATA_FILE);
    let previousCatalog = null;
    if (fs.existsSync(cachePath)) {
      try {
        previousCatalog = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      } catch {
        previousCatalog = null;
      }
    }

    const shouldUpdateDownloads = forceRefresh || !previousCatalog || !isSameCatalogPayload(previousCatalog, normalized);
    if (shouldUpdateDownloads) {
      try {
        normalized = await enrichGithubDownloadCounts(normalized, this.cacheDir, forceRefresh);
      } catch (err) {
        console.error('Failed to enrich catalog with GitHub release download counts:', err.message || err);
      }
    } else if (previousCatalog) {
      mergeDownloadCounts(normalized, previousCatalog);
    }

    fs.writeFileSync(this.cachePath(DEFAULT_DATA_FILE), JSON.stringify(normalized));
    fs.writeFileSync(this.cachePath('meta.json'), JSON.stringify({ fetchedAt: Date.now() }));
    return normalized;
  }

  async load({ forceRefresh = false } = {}) {
    const shouldRefresh = forceRefresh || !this.hasCache() || this.source.type === 'site';
    if (shouldRefresh) {
      await this.refresh(forceRefresh);
    }
    const text = fs.readFileSync(this.cachePath(DEFAULT_DATA_FILE), 'utf-8');
    const parsed = JSON.parse(text);
    const normalized = normalizeCatalogPayload(parsed);
    return {
      ...normalized,
      fetchedAt: this.cacheInfo().fetchedAt,
    };
  }
}

module.exports = { Catalog, DEFAULT_BASE, DEFAULT_CATALOG_URL, RAW_BASE };
