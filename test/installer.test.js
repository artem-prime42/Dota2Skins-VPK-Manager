const test = require('node:test');
const assert = require('node:assert/strict');
const { shouldUsePriorityPak } = require('../src/installer');

test('priority pak naming is disabled for trees and ranged-attack categories', () => {
  assert.equal(shouldUsePriorityPak('trees'), false);
  assert.equal(shouldUsePriorityPak('ranged-attack'), false);
  assert.equal(shouldUsePriorityPak('river'), true);
});
