const test = require('node:test');
const assert = require('node:assert/strict');
const { Installer, shouldUsePriorityPak } = require('../src/installer');

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
