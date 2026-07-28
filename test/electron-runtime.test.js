const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { ensureElectronRuntime } = require('../src/electron-runtime');

test('ensureElectronRuntime downloads and prepares the Electron binary', async () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'electron-runtime-'));
  const electronRoot = path.join(tmpRoot, 'node_modules', 'electron');
  fs.mkdirSync(path.join(electronRoot, 'dist'), { recursive: true });
  fs.writeFileSync(path.join(electronRoot, 'package.json'), JSON.stringify({ version: '33.4.11' }));

  let downloaded = false;
  await ensureElectronRuntime({
    rootDir: tmpRoot,
    platform: 'linux',
    arch: 'x64',
    downloadFile: async (url, dest) => {
      downloaded = true;
      fs.writeFileSync(dest, 'fake-archive');
    },
    extractFile: async (src, dest) => {
      fs.mkdirSync(dest, { recursive: true });
      fs.writeFileSync(path.join(dest, 'electron'), 'binary');
      fs.writeFileSync(path.join(dest, 'version'), '33.4.11');
    },
  });

  assert.equal(downloaded, true);
  assert.equal(fs.readFileSync(path.join(electronRoot, 'path.txt'), 'utf8'), 'electron');
  assert.equal(fs.readFileSync(path.join(electronRoot, 'dist', 'version'), 'utf8'), '33.4.11');
  assert.equal(fs.existsSync(path.join(electronRoot, 'dist', 'electron')), true);
});
