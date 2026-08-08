const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const AdmZip = require('adm-zip');
const { VpkReader, VpkWriter } = require('vpk-tools');
const { Installer, shouldUsePriorityPak } = require('../src/installer');
const { resolveGamePath, validateGamePath } = require('../src/steam');

test('priority pak naming is disabled for trees and ranged-attack categories', () => {
  assert.equal(shouldUsePriorityPak('trees'), false);
  assert.equal(shouldUsePriorityPak('ranged-attack'), false);
  assert.equal(shouldUsePriorityPak('river'), true);
});

test('priority categories use normal pak02_dir-style names without an exclamation mark', () => {
  const installer = new Installer({ userDataDir: '/tmp', getGamePath: () => '/tmp/game', getLangSuffix: () => 'russian' });
  const used = new Set();
  const pakName = installer.allocatePak(used, true);

  assert.equal(pakName, 'pak02_dir.vpk');
  assert.ok(used.has(pakName));
  assert.ok(!pakName.startsWith('!'));
});

test('installer falls back to a merge pak once pak10-99 are exhausted', () => {
  const installer = new Installer({ userDataDir: '/tmp', getGamePath: () => '/tmp/game', getLangSuffix: () => 'russian' });
  const used = new Set(Array.from({ length: 90 }, (_, i) => `pak${i + 10}_dir.vpk`));
  const pakName = installer.allocatePak(used, false);

  assert.equal(pakName, 'pak_merge_dir.vpk');
  assert.ok(used.has(pakName));
});

test('merge command keeps the output path and input list', () => {
  const installer = new Installer({ userDataDir: '/tmp', getGamePath: () => '/tmp/game', getLangSuffix: () => 'russian' });
  const args = installer.buildMergeCommand('/tmp/vpk.exe', '/tmp/lang/pak_merge_dir.vpk', ['/tmp/a.vpk', '/tmp/b.vpk']);

  assert.deepEqual(args, ['-create', '/tmp/lang/pak_merge_dir.vpk', '/tmp/a.vpk', '/tmp/b.vpk']);
});

test('mergeRecords combines selected VPK files into a single archive', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'installer-merge-'));
  const gameRoot = path.join(tempRoot, 'game');
  const langDir = path.join(gameRoot, 'dota_russian');
  fs.mkdirSync(langDir, { recursive: true });

  const installer = new Installer({ userDataDir: tempRoot, getGamePath: () => gameRoot, getLangSuffix: () => 'russian' });

  const first = path.join(langDir, 'first.vpk');
  new VpkWriter().addFile('foo.txt', 'one').write(first);
  const second = path.join(langDir, 'second.vpk');
  new VpkWriter().addFile('bar.txt', 'two').write(second);

  const result = installer.mergeRecords([
    { id: '1', name: 'One', categoryId: 'heroes', files: [{ root: 'lang', relPath: 'first.vpk' }] },
    { id: '2', name: 'Two', categoryId: 'heroes', files: [{ root: 'lang', relPath: 'second.vpk' }] },
  ]);

  assert.match(result.outputRelPath, /^pak\d+_dir\.vpk$/);
  assert.equal(fs.existsSync(path.join(langDir, result.outputRelPath)), true);

  const merged = VpkReader.open(path.join(langDir, result.outputRelPath));
  assert.equal(merged.readFile('foo.txt').toString(), 'one');
  assert.equal(merged.readFile('bar.txt').toString(), 'two');
  assert.equal(fs.existsSync(first), false);
  assert.equal(fs.existsSync(second), false);
});

test('resolveGamePath accepts a Dota root that contains a game subfolder', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'installer-game-root-'));
  const dotaRoot = path.join(tempRoot, 'dota 2 beta');
  const gameDir = path.join(dotaRoot, 'game');
  fs.mkdirSync(path.join(gameDir, 'dota'), { recursive: true });

  assert.equal(resolveGamePath(dotaRoot), gameDir);
  assert.equal(validateGamePath(dotaRoot), true);
});

test('download accepts local file paths and file:// references', async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'installer-download-'));
  const gameRoot = path.join(tempRoot, 'game');
  fs.mkdirSync(gameRoot, { recursive: true });

  const localFile = path.join(tempRoot, 'local-mod.zip');
  fs.writeFileSync(localFile, 'dummy content');

  const installer = new Installer({ userDataDir: tempRoot, getGamePath: () => gameRoot, getLangSuffix: () => 'russian' });
  const resolvedPath = await installer.download('heroes', localFile, 'Local file');
  assert.equal(resolvedPath, localFile);

  const fileUrlRef = `file://${localFile}`;
  const resolvedFileUrlPath = await installer.download('heroes', fileUrlRef, 'File URL');
  assert.equal(resolvedFileUrlPath, localFile);
});

test('download resolves Windows-style file URLs correctly', async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'installer-download-win-'));
  const gameRoot = path.join(tempRoot, 'game');
  fs.mkdirSync(gameRoot, { recursive: true });

  const localFile = path.join(tempRoot, 'windows-mod.zip');
  fs.writeFileSync(localFile, 'dummy content');

  const installer = new Installer({ userDataDir: tempRoot, getGamePath: () => gameRoot, getLangSuffix: () => 'russian' });
  const fileUrlRef = require('url').pathToFileURL(localFile).href;
  const resolvedFileUrlPath = await installer.download('heroes', fileUrlRef, 'Windows file URL');
  assert.equal(resolvedFileUrlPath, localFile);
});

test('install handles split VPK zip archives by remapping part prefixes', async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'installer-split-zip-'));
  const gameRoot = path.join(tempRoot, 'game');
  const langDir = path.join(gameRoot, 'dota_russian');
  fs.mkdirSync(langDir, { recursive: true });

  const archive = path.join(tempRoot, 'hero-skin.zip');
  const zip = new AdmZip();
  zip.addFile('hero-skin/pak01_dir.vpk', Buffer.from('dir contents'));
  zip.addFile('hero-skin/pak01_000.vpk', Buffer.from('part contents'));
  zip.writeZip(archive);

  const installer = new Installer({ userDataDir: tempRoot, getGamePath: () => gameRoot, getLangSuffix: () => 'russian' });
  const records = await installer.install({ categoryId: 'heroes', modName: 'Hero Skin', fileRef: archive });

  assert.equal(records.length, 2);
  const prefixes = records.map((r) => r.relPath.split('_')[0]);
  assert.equal(prefixes[0], prefixes[1]);
  assert.ok(/^pak\d+$/.test(prefixes[0]));
  const contentMap = new Map(records.map((r) => [r.relPath, fs.readFileSync(path.join(langDir, r.relPath), 'utf8')]));
  assert.equal(contentMap.get(records[0].relPath), records[0].relPath.endsWith('_dir.vpk') ? 'dir contents' : 'part contents');
  assert.equal(contentMap.get(records[1].relPath), records[1].relPath.endsWith('_dir.vpk') ? 'dir contents' : 'part contents');
});
