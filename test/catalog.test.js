const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { Catalog } = require('../src/catalog');
const { loadSiteCatalog } = require('../src/catalog-site-adapter');

test('Renderer card template uses explicit preview links for preview buttons', () => {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'renderer', 'app.js'), 'utf8');
  assert.match(appSource, /const previewLink = \(mod\?\.links \|\| \[\]\)\.find\(\(l\) => l\?\.type === 'preview'/);
  assert.match(appSource, /if \(!previewLink\) return null;/);
  assert.doesNotMatch(appSource, /<button class="mtag-play"/);
});

test('Renderer hero filtering uses hero metadata and marks requested mods as immortal', () => {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'renderer', 'app.js'), 'utf8');
  assert.match(appSource, /function matchesHeroFilter\(mod, heroFilter\)/);
  assert.match(appSource, /lion cannonroar confessor/);
  assert.match(appSource, /mulctant pall crimson/);
  assert.match(appSource, /tyrian mulctant pall/);
});

test('Site adapter keeps full preview and download URLs', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-site-test-'));
  const sourceDir = path.join(tmpDir, 'app', 'lib');
  fs.mkdirSync(sourceDir, { recursive: true });
  const sourcePath = path.join(sourceDir, 'hero-skins.ts');
  fs.writeFileSync(sourcePath, `
export const HERO_MODS = {
  demo: [{
    id: "demo",
    title: "Demo mod",
    author: "anon",
    category: "heroes",
    imageUrl: "https://img.example.com/demo.webp",
    downloadUrl: "https://files.example.com/demo.zip",
    createdAt: "2026-07-20T00:00:00.000Z",
  }],
};
export const OTHER_MODS = [];
export const EXTRA_HIDDEN_SKIN_TITLES = [];
`);

  const data = await loadSiteCatalog(tmpDir);
  const entry = data.mods.modsData.heroes[0];

  assert.equal(entry.preview, 'https://img.example.com/demo.webp');
  assert.equal(entry.file, 'https://files.example.com/demo.zip');
});

test('Site adapter maps mods to their hero slug and slot', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-site-hero-test-'));
  const sourceDir = path.join(tmpDir, 'app', 'lib');
  fs.mkdirSync(sourceDir, { recursive: true });
  const sourcePath = path.join(sourceDir, 'hero-skins.ts');
  fs.writeFileSync(sourcePath, `
export const HERO_MODS = {
  demo: [{
    id: "demo",
    title: "Demo mod",
    author: "anon",
    category: "heroes",
    imageUrl: "https://img.example.com/demo.webp",
    downloadUrl: "https://files.example.com/demo.zip",
    createdAt: "2026-07-20T00:00:00.000Z",
    invokerSlot: "set",
  }],
};
export const OTHER_MODS = [];
export const EXTRA_HIDDEN_SKIN_TITLES = [];
`);

  const data = await loadSiteCatalog(tmpDir);
  const hero = data.constants.HERO_CATALOG[0];
  const entry = data.mods.modsData.heroes[0];

  assert.equal(hero.slug, 'demo');
  assert.equal(hero.modsCount, 1);
  assert.equal(entry.hero, 'demo');
  assert.equal(entry.slot, 'set');
});

test('Catalog can load data from a provided local file', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-test-'));
  const catalogFile = path.join(tmpDir, 'catalog.json');
  fs.writeFileSync(catalogFile, JSON.stringify({
    mods: { modsData: { heroes: [{ name: 'Demo mod', file: 'https://example.com/demo.zip' }] } },
    constants: { categories: [{ id: 'heroes', label: 'Heroes' }] },
    guides: {},
    fetchedAt: 1234,
  }));

  const catalog = new Catalog(tmpDir, { source: { type: 'file', filePath: catalogFile } });
  const data = await catalog.load();

  assert.equal(data.mods.modsData.heroes[0].name, 'Demo mod');
  assert.ok(typeof data.fetchedAt === 'number');
});

test('Catalog refreshes site source data even when cache exists', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-site-refresh-test-'));
  const cacheDir = path.join(tmpDir, 'catalog-cache');
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(path.join(cacheDir, 'catalog.json'), JSON.stringify({
    mods: { modsData: { heroes: [{ name: 'Cached mod', preview: null }] } },
    constants: { categories: [{ id: 'heroes', label: 'Heroes' }] },
    guides: {},
    fetchedAt: 1,
  }));
  fs.writeFileSync(path.join(cacheDir, 'meta.json'), JSON.stringify({ fetchedAt: 1 }));

  const siteRoot = path.join(tmpDir, 'site');
  fs.mkdirSync(path.join(siteRoot, 'app', 'lib'), { recursive: true });
  fs.writeFileSync(path.join(siteRoot, 'app', 'lib', 'hero-skins.ts'), `
export const HERO_MODS = {
  demo: [{
    id: "demo",
    title: "Fresh mod",
    author: "anon",
    category: "heroes",
    imageUrl: "https://img.example.com/fresh.webp",
    downloadUrl: "https://files.example.com/fresh.zip",
    createdAt: "2026-07-20T00:00:00.000Z",
  }],
};
export const OTHER_MODS = [];
export const EXTRA_HIDDEN_SKIN_TITLES = [];
`);

  const catalog = new Catalog(tmpDir, { source: { type: 'site', siteRoot } });
  const data = await catalog.load();

  assert.equal(data.mods.modsData.heroes[0].name, 'Fresh mod');
  assert.equal(data.mods.modsData.heroes[0].preview, 'https://img.example.com/fresh.webp');
});

test('Site adapter parses all mods from OTHER_MODS and normalizes category ids', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-site-other-mods-test-'));
  const sourceDir = path.join(tmpDir, 'app', 'lib');
  fs.mkdirSync(sourceDir, { recursive: true });
  const sourcePath = path.join(sourceDir, 'hero-skins.ts');
  fs.writeFileSync(sourcePath, `
export const HERO_MODS = {
  demo: [{
    id: "demo",
    title: "Hero mod",
    author: "anon",
    category: "heroes",
    imageUrl: "https://img.example.com/hero.webp",
    downloadUrl: "https://files.example.com/hero.zip",
    createdAt: "2026-07-20T00:00:00.000Z",
  }],
};
export const OTHER_MODS = [
  {
    id: "high-five",
    title: "High Five Crownfall",
    author: "anon",
    category: "high_five",
    imageUrl: "https://img.example.com/high-five.webp",
    downloadUrl: "https://files.example.com/high-five.zip",
    createdAt: "2026-07-20T00:00:00.000Z",
  },
  {
    id: "creep-deny",
    title: "Creep Deny",
    author: "anon",
    category: "creep_deny",
    imageUrl: "https://img.example.com/creep-deny.webp",
    downloadUrl: "https://files.example.com/creep-deny.zip",
    createdAt: "2026-07-20T00:00:00.000Z",
  },
];
export const EXTRA_HIDDEN_SKIN_TITLES = [];
`);

  const data = await loadSiteCatalog(tmpDir);

  assert.ok(data.mods.modsData['high-five']);
  assert.ok(data.mods.modsData['creep-deny']);
  assert.ok(data.constants.categories.some((c) => c.id === 'high-five'));
  assert.ok(data.constants.categories.some((c) => c.id === 'creep-deny'));
});

test('Site adapter strips leading exclamation marks from mod names for all categories', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-site-name-normalization-test-'));
  const sourceDir = path.join(tmpDir, 'app', 'lib');
  fs.mkdirSync(sourceDir, { recursive: true });
  const sourcePath = path.join(sourceDir, 'hero-skins.ts');
  fs.writeFileSync(sourcePath, `
export const HERO_MODS = {
  demo: [{
    id: "demo",
    title: "Hero mod",
    author: "anon",
    category: "heroes",
    imageUrl: "https://img.example.com/hero.webp",
    downloadUrl: "https://files.example.com/hero.zip",
    createdAt: "2026-07-20T00:00:00.000Z",
  }],
};
export const OTHER_MODS = [
  {
    id: "optimization-example",
    title: "!Optimization Example",
    author: "anon",
    category: "optimization",
    imageUrl: "https://img.example.com/optimization.webp",
    downloadUrl: "https://files.example.com/optimization.zip",
    createdAt: "2026-07-20T00:00:00.000Z",
  },
  {
    id: "river-example",
    title: "!River Example",
    author: "anon",
    category: "river",
    imageUrl: "https://img.example.com/river.webp",
    downloadUrl: "https://files.example.com/river.zip",
    createdAt: "2026-07-20T00:00:00.000Z",
  },
];
export const EXTRA_HIDDEN_SKIN_TITLES = [];
`);

  const data = await loadSiteCatalog(tmpDir);

  assert.equal(data.mods.modsData.optimization[0].name, 'Optimization Example');
  assert.equal(data.mods.modsData.river[0].name, 'River Example');
});

test('Site adapter loads author profiles with avatars and links', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-site-authors-test-'));
  const sourceDir = path.join(tmpDir, 'app', 'lib');
  fs.mkdirSync(sourceDir, { recursive: true });
  fs.writeFileSync(path.join(sourceDir, 'hero-skins.ts'), `
export const HERO_MODS = {
  demo: [{
    id: "demo",
    title: "Demo mod",
    author: "mopsyara",
    category: "heroes",
    imageUrl: "https://img.example.com/demo.webp",
    downloadUrl: "https://files.example.com/demo.zip",
    createdAt: "2026-07-20T00:00:00.000Z",
  }],
};
export const OTHER_MODS = [];
export const EXTRA_HIDDEN_SKIN_TITLES = [];
`);
  fs.writeFileSync(path.join(sourceDir, 'authors-profiles.ts'), `
export const AUTHORS_PROFILES = {
  mopsyara: {
    id: "mopsyara",
    displayName: "mopsyara",
    avatarUrl: "https://example.com/avatar.jpg",
    telegram: "https://t.me/mopsyara",
    authorLink: "https://example.com/mopsyara",
  },
};
`);

  const data = await loadSiteCatalog(tmpDir);
  const profile = data.constants.AUTHOR_PROFILES.find((p) => p.id === 'mopsyara');

  assert.ok(profile);
  assert.equal(profile.avatarUrl, 'https://example.com/avatar.jpg');
  assert.equal(profile.links.telegram, 'https://t.me/mopsyara');
});
