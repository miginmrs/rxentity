import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);

test('the commonjs build loads', () => {
  const lib = require('../dist/index.cjs') as { TopStore: unknown; createStoredList: unknown };
  assert.equal(typeof lib.TopStore, 'function');
  assert.equal(typeof lib.createStoredList, 'function');
});
