const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const DEFAULT_CATALOG_REPO = 'https://github.com/artem-prime42/dota2-mod-manager-catalog';
const DEFAULT_CATALOG_URL = 'https://raw.githubusercontent.com/artem-prime42/dota2-mod-manager-catalog/main/catalog.json';
const LOCAL_CATALOG_PATH = '/home/artem/Other/catalog-repo/catalog.json';

function resolveCatalogSource() {
  const envCatalogUrl = process.env.DOTA2SKINS_CATALOG_URL;
  const envLocalCatalog = process.env.DOTA2SKINS_LOCAL_CATALOG;

  if (envCatalogUrl) {
    return { type: 'remote', url: envCatalogUrl };
  }

  const localCatalogFile = envLocalCatalog || LOCAL_CATALOG_PATH;
  if (localCatalogFile && fs.existsSync(localCatalogFile)) {
    return { type: 'file', filePath: localCatalogFile };
  }

  return {
    type: 'site',
    repoRoot: process.env.DOTA2SKINS_SITE_REPO || DEFAULT_CATALOG_REPO,
    dataUrl: process.env.DOTA2SKINS_SITE_CATALOG_URL || DEFAULT_CATALOG_URL,
  };
}

let autoUpdater = null;
try {
  ({ autoUpdater } = require('electron-updater'));
} catch { /* dev environment without the dependency installed yet */ }

const { Settings } = require('./src/settings');
const { Catalog } = require('./src/catalog');
const { Installer } = require('./src/installer');
const { Library } = require('./src/library');
const { findDotaGamePath, validateGamePath, resolveGamePath } = require('./src/steam');

let win;
let settings, catalog, installer, library;

function autoUpdatesEnabled() {
  return settings?.get('autoUpdateEnabled') !== false;
}

function sendProgress(evt) {
  if (win && !win.isDestroyed()) win.webContents.send('progress', evt);
}

function createWindow() {
  win = new BrowserWindow({
    width: 1420,
    height: 860,
    minWidth: 1100,
    minHeight: 760,
    resizable: true,
    maximizable: true,
    backgroundColor: '#050506',
    autoHideMenuBar: true,
    frame: false,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
    },
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  win.on('maximize', () => win.webContents.send('win:maximized', true));
  win.on('unmaximize', () => win.webContents.send('win:maximized', false));

  // dev: MM_SHOT=<path> saves a screenshot after load (used for automated UI checks)
  if (process.env.MM_SHOT) {
    win.webContents.once('did-finish-load', () => {
      diag('did-finish-load');
      setTimeout(async () => {
        diag('capture start');
        try {
          win.show();
          win.focus();
          if (process.env.MM_VIEW) {
            await win.webContents.executeJavaScript(
              `document.querySelector('[data-view="${process.env.MM_VIEW}"]')?.click()`);
            await new Promise((r) => setTimeout(r, 2500));
          }
          if (process.env.MM_CAT) {
            await win.webContents.executeJavaScript(
              `document.querySelector('.rail-item[data-cat="${process.env.MM_CAT}"]')?.click()`);
            await new Promise((r) => setTimeout(r, 2500));
          }
          if (process.env.MM_MODAL) {
            await win.webContents.executeJavaScript(`
              [...document.querySelectorAll('.card .card-name')]
                .find(n => n.textContent.trim() === ${JSON.stringify(process.env.MM_MODAL)})
                ?.closest('.card')?.click()`);
            await new Promise((r) => setTimeout(r, 1500));
            if (process.env.MM_PREVIEW) {
              await win.webContents.executeJavaScript(`document.getElementById('previewPlayBtn')?.click()`);
              await new Promise((r) => setTimeout(r, 2500));
            }
          }
          await new Promise((r) => setTimeout(r, 500));
          const img = await win.webContents.capturePage();
          fs.writeFileSync(process.env.MM_SHOT, img.toPNG());
          diag('capture done ' + img.getSize().width + 'x' + img.getSize().height);
        } catch (e) {
          fs.writeFileSync(process.env.MM_SHOT + '.err.txt', String(e));
        }
      }, 7000);
    });
  }
}

const DIAG = process.env.MM_DIAG;
function diag(msg) {
  if (DIAG) { try { fs.appendFileSync(DIAG, `${new Date().toISOString()} ${msg}\n`); } catch { /* noop */ } }
}

app.whenReady().then(async () => {
  diag('whenReady');
  const userData = app.getPath('userData');
  settings = new Settings(userData);
  catalog = new Catalog(userData, { source: resolveCatalogSource(userData) });
  library = new Library(userData);
  installer = new Installer({
    userDataDir: userData,
    getGamePath: () => resolveGamePath(settings.get('dotaGamePath')) || settings.get('dotaGamePath'),
    getLangSuffix: () => settings.get('langSuffix'),
    onProgress: sendProgress,
  });

  // auto-detect dota on first run
  if (!validateGamePath(settings.get('dotaGamePath'))) {
    const found = await findDotaGamePath();
    if (found) settings.set('dotaGamePath', found);
  }
  if (settings.get('dotaGamePath')) {
    const resolved = resolveGamePath(settings.get('dotaGamePath'));
    if (resolved) {
      settings.set('dotaGamePath', resolved);
    }
  }

  registerIpc();
  createWindow();
  diag('createWindow done');
  setupAutoUpdate();
}).catch((e) => diag('whenReady FAIL: ' + (e.stack || e)));

// ---- auto-update via GitHub Releases (packaged builds only) ----
function setupAutoUpdate() {
  if (!autoUpdater || !app.isPackaged) return;
  if (!autoUpdatesEnabled()) return;
  autoUpdater.autoDownload = true;
  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'artem-prime42',
    repo: 'dota2skins-mod-manager',
    private: false,
    protocol: 'https',
    host: 'github.com',
    path: '/artem-prime42/dota2skins-mod-manager/releases/latest',
  });
  autoUpdater.on('update-available', (info) => {
    if (!autoUpdatesEnabled()) return;
    if (win && !win.isDestroyed()) win.webContents.send('update', { type: 'available', version: info.version });
  });
  autoUpdater.on('update-not-available', () => {
    if (!autoUpdatesEnabled()) return;
    if (win && !win.isDestroyed()) win.webContents.send('update', { type: 'not-available' });
  });
  autoUpdater.on('update-downloaded', (info) => {
    if (!autoUpdatesEnabled()) return;
    if (win && !win.isDestroyed()) win.webContents.send('update', { type: 'downloaded', version: info.version });
  });
  autoUpdater.on('error', (err) => {
    if (!autoUpdatesEnabled()) return;
    if (win && !win.isDestroyed()) win.webContents.send('update', { type: 'error', message: String(err.message || err) });
  });
  autoUpdater.checkForUpdates().catch(() => {});
  // re-check every 4 hours while the app is open
  setInterval(() => {
    if (autoUpdatesEnabled()) autoUpdater.checkForUpdates().catch(() => {});
  }, 4 * 60 * 60 * 1000);
}

app.on('window-all-closed', () => app.quit());

function registerIpc() {
  // ----- window controls -----
  ipcMain.handle('win:minimize', () => win.minimize());
  ipcMain.handle('win:maximize', () => {
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
    return win.isMaximized();
  });
  ipcMain.handle('win:toggleFullscreen', () => {
    if (win.isFullScreen()) win.setFullScreen(false);
    else win.setFullScreen(true);
    return win.isFullScreen();
  });
  ipcMain.handle('win:close', () => win.close());
  ipcMain.handle('win:isMaximized', () => win.isMaximized());

  // ----- updates -----
  ipcMain.handle('update:install', () => {
    if (autoUpdater) autoUpdater.quitAndInstall();
  });
  ipcMain.handle('update:check', async () => {
    if (!autoUpdater) return { error: 'Обновления недоступны' };
    if (!autoUpdatesEnabled()) return { error: 'Автообновление отключено' };
    try {
      await autoUpdater.checkForUpdates();
      return { ok: true };
    } catch (err) {
      return { error: String(err.message || err) };
    }
  });
  ipcMain.handle('app:version', () => app.getVersion());

  // ----- settings -----
  ipcMain.handle('settings:get', () => ({
    ...settings.all(),
    dotaPathValid: validateGamePath(settings.get('dotaGamePath')),
  }));

  ipcMain.handle('settings:set', (e, key, value) => {
    // when the language folder changes, move installed mod files over
    if (key === 'langSuffix' && value !== settings.get('langSuffix')) {
      const game = settings.get('dotaGamePath');
      if (game) {
        const oldDir = path.join(game, `dota_${settings.get('langSuffix')}`);
        const newDir = path.join(game, `dota_${value}`);
        try {
          if (fs.existsSync(oldDir)) {
            fs.mkdirSync(newDir, { recursive: true });
            // move only files that are referenced by our manifest (managed mods)
            try {
              const known = library.knownLangRelPaths();
              for (const rel of known) {
                const src = path.join(oldDir, rel);
                const dst = path.join(newDir, rel);
                if (fs.existsSync(src) && !fs.existsSync(dst)) {
                  fs.mkdirSync(path.dirname(dst), { recursive: true });
                  fs.renameSync(src, dst);
                }
                const srcOff = src + '.off';
                const dstOff = dst + '.off';
                if (fs.existsSync(srcOff) && !fs.existsSync(dstOff)) {
                  fs.mkdirSync(path.dirname(dstOff), { recursive: true });
                  fs.renameSync(srcOff, dstOff);
                }
              }
            } catch (inner) {
              console.error('failed to migrate managed lang files:', inner);
            }
            // attempt to remove old folder if now empty
            try {
              if (!fs.readdirSync(oldDir).length) fs.rmdirSync(oldDir);
            } catch {}
          }
        } catch (err) {
          console.error('lang folder migration failed:', err);
        }
      }
    }
    settings.set(key, value);
    return settings.all();
  });

  ipcMain.handle('settings:detectDota', async () => {
    const found = await findDotaGamePath();
    if (found) settings.set('dotaGamePath', found);
    return found;
  });

  ipcMain.handle('settings:browseDota', async () => {
    const res = await dialog.showOpenDialog(win, {
      title: 'Выбери папку game внутри dota 2 beta',
      properties: ['openDirectory'],
    });
    if (res.canceled || !res.filePaths[0]) return null;
    let p = res.filePaths[0];
    // allow picking "dota 2 beta" root as well
    if (!validateGamePath(p) && validateGamePath(path.join(p, 'game'))) p = path.join(p, 'game');
    if (!validateGamePath(p)) return { error: 'В этой папке не найдена Dota 2 (нет подпапки dota)' };
    settings.set('dotaGamePath', p);
    return { path: p };
  });

  // ----- catalog -----
  ipcMain.handle('catalog:load', async (e, force) => {
    try {
      return await catalog.load({ forceRefresh: !!force });
    } catch (err) {
      return { error: String(err.message || err) };
    }
  });

  // ----- install/manage -----
  ipcMain.handle('mods:install', async (e, payload) => {
    // payload: { categoryId, name, styleLabel, fileRef, preview }
    try {
      const existing = library.findByKey(payload.categoryId, payload.name, payload.styleLabel);
      if (existing) return { error: 'Уже установлено', already: true };
      const files = await installer.install({
        categoryId: payload.categoryId,
        modName: payload.name,
        fileRef: payload.fileRef,
      });
      const rec = library.add({ ...payload, files });
      sendProgress({ type: 'done', label: payload.name });
      return { ok: true, record: rec };
    } catch (err) {
      sendProgress({ type: 'error', label: payload.name, message: String(err.message || err) });
      return { error: String(err.message || err) };
    }
  });

  ipcMain.handle('mods:list', () => {
    let external = [];
    try {
      external = installer.externalFiles(library.knownLangRelPaths());
    } catch { /* lang folder may not exist yet */ }
    return { installed: library.list(), external };
  });

  ipcMain.handle('mods:setEnabled', (e, id, enabled) => {
    const rec = library.find(id);
    if (!rec) return { error: 'Мод не найден' };
    try {
      installer.setEnabled(rec.files, enabled);
      library.setEnabled(id, enabled);
      return { ok: true };
    } catch (err) {
      return { error: String(err.message || err) };
    }
  });

  ipcMain.handle('mods:remove', (e, id) => {
    const rec = library.find(id);
    if (!rec) return { error: 'Мод не найден' };
    try {
      installer.remove(rec.files);
      library.removeRecord(id);
      return { ok: true };
    } catch (err) {
      return { error: String(err.message || err) };
    }
  });

  ipcMain.handle('mods:mergeSelected', (e, ids) => {
    const selected = (ids || []).map((id) => library.find(id)).filter(Boolean);
    if (selected.length < 2) return { error: 'Нужно выбрать минимум 2 мода' };
    try {
      const result = installer.mergeRecords(selected);
      // build a friendly merged name from selected mods' names
      const names = selected.map((s) => (s && s.name) ? s.name.trim() : 'mod');
      let mergedName = '';
      if (names.length <= 3) mergedName = names.join(' + ');
      else mergedName = names.slice(0, 3).join(' + ') + ` (+${names.length - 3})`;

      for (const rec of selected) library.removeRecord(rec.id);

      const merged = library.add({
        name: mergedName || `Merged (${selected.length})`,
        categoryId: selected[0].categoryId,
        styleLabel: null,
        fileRef: selected[0].fileRef,
        preview: selected[0].preview,
        files: [{ root: 'lang', relPath: result.outputRelPath }],
      });
      sendProgress({ type: 'done', label: merged.name });
      return { ok: true, record: merged };
    } catch (err) {
      sendProgress({ type: 'error', label: 'merge', message: String(err.message || err) });
      return { error: String(err.message || err) };
    }
  });

  ipcMain.handle('mods:externalSetEnabled', (e, fileName, enabled) => {
    try {
      const lang = installer.langFolder();
      const abs = path.join(lang, fileName);
      const base = fileName.replace(/\.off$/i, '');
      const on = path.join(lang, base);
      const off = on + '.off';
      if (enabled && fs.existsSync(off)) fs.renameSync(off, on);
      if (!enabled && fs.existsSync(on)) fs.renameSync(on, off);
      return { ok: true };
    } catch (err) {
      return { error: String(err.message || err) };
    }
  });

  ipcMain.handle('mods:externalRemove', (e, fileName) => {
    try {
      const abs = path.join(installer.langFolder(), fileName);
      if (fs.existsSync(abs)) fs.rmSync(abs, { force: true });
      return { ok: true };
    } catch (err) {
      return { error: String(err.message || err) };
    }
  });

  // ----- presets -----
  ipcMain.handle('presets:list', () => library.listPresets());
  ipcMain.handle('presets:save', (e, name) => {
    library.savePreset(name);
    return library.listPresets();
  });
  ipcMain.handle('presets:delete', (e, id) => {
    library.deletePreset(id);
    return library.listPresets();
  });
  ipcMain.handle('presets:apply', (e, id) => {
    const preset = library.getPreset(id);
    if (!preset) return { error: 'Пресет не найден' };
    const wanted = new Set(preset.modIds);
    const errors = [];
    for (const rec of library.list()) {
      const shouldEnable = wanted.has(rec.id);
      if (rec.enabled !== shouldEnable) {
        try {
          installer.setEnabled(rec.files, shouldEnable);
          library.setEnabled(rec.id, shouldEnable);
        } catch (err) {
          errors.push(`${rec.name}: ${err.message}`);
        }
      }
    }
    return errors.length ? { error: errors.join('\n') } : { ok: true };
  });

  // ----- misc -----
  ipcMain.handle('misc:openLangFolder', () => {
    try {
      const lang = installer.langFolder();
      fs.mkdirSync(lang, { recursive: true });
      shell.openPath(lang);
      return { ok: true };
    } catch (err) {
      return { error: String(err.message || err) };
    }
  });

  ipcMain.handle('misc:listLangFolders', (e) => {
    try {
      const game = settings.get('dotaGamePath');
      if (!game) return { ok: true, folders: [] };
      const langRoot = path.join(game);
      if (!fs.existsSync(langRoot)) return { ok: true, folders: [] };
      const out = [];
      for (const f of fs.readdirSync(langRoot)) {
        try {
          const full = path.join(langRoot, f);
          if (!fs.statSync(full).isDirectory()) continue;
          const m = /^dota_(.+)$/i.exec(f);
          if (m) out.push(m[1]);
        } catch { /* ignore */ }
      }
      // de-duplicate and sort
      const uniq = Array.from(new Set(out)).sort();
      return { ok: true, folders: uniq };
    } catch (err) {
      return { error: String(err.message || err) };
    }
  });

  ipcMain.handle('misc:openToolsFolder', (e, sub) => {
    const p = sub ? path.join(installer.toolsDir, sub) : installer.toolsDir;
    shell.openPath(p);
    return { ok: true };
  });

  ipcMain.handle('misc:openExternal', (e, url) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { ok: true };
  });

  ipcMain.handle('misc:openPath', async (e, targetPath) => {
    if (!targetPath) return { ok: false, error: 'Путь не указан' };
    const result = await shell.openPath(targetPath);
    return result ? { ok: false, error: result } : { ok: true };
  });

  ipcMain.handle('misc:launchDota', async () => {
    try {
      const gamePath = settings.get('dotaGamePath');
      const candidates = [];
      if (gamePath) {
        const base = gamePath.replace(/[\\/]+$/, '');
        candidates.push(path.join(base, 'dota2.exe'));
        candidates.push(path.join(base, 'dota2'));
        candidates.push(path.join(base, 'dota2.sh'));
        candidates.push(path.join(base, 'dota2.x86_64'));
      }
      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          const result = await shell.openPath(candidate);
          return result === '' ? { ok: true } : { error: result };
        }
      }
      const steamResult = await shell.openExternal('steam://rungameid/570');
      return steamResult === '' ? { ok: true } : { error: steamResult };
    } catch (err) {
      return { error: String(err.message || err) };
    }
  });

  ipcMain.handle('misc:cacheSize', () => installer.downloadCacheSize());
  ipcMain.handle('misc:clearCache', () => {
    installer.clearDownloadCache();
    return { ok: true };
  });

  ipcMain.handle('misc:runTool', (e, toolDirName) => {
    // find first exe inside the tool folder and launch it
    try {
      const dir = path.join(installer.toolsDir, toolDirName);
      const findExe = (d) => {
        for (const f of fs.readdirSync(d)) {
          const full = path.join(d, f);
          if (fs.statSync(full).isDirectory()) {
            const r = findExe(full);
            if (r) return r;
          } else if (f.toLowerCase().endsWith('.exe')) {
            return full;
          }
        }
        return null;
      };
      const exe = findExe(dir);
      if (!exe) return { error: 'exe не найден в папке инструмента' };
      shell.openPath(exe);
      return { ok: true };
    } catch (err) {
      return { error: String(err.message || err) };
    }
  });
}
