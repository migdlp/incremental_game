const { test } = require('node:test');
const assert = require('node:assert/strict');
const G = require('../app/src/main/assets/game.js');

test('clicks, purchases and passive production form a playable loop', () => {
  const s = G.fresh(1000);
  assert.equal(G.buy(s, 'grandma'), false);
  for (let i = 0; i < 30; i++) G.earn(s, G.perTap(s));
  assert.equal(G.buy(s, 'grandma'), true);
  assert.equal(s.cookies, 0);
  G.tick(s, 16000);
  assert.equal(s.cookies, 15);
  assert.equal(G.buy(s, 'finger'), true);
  G.earn(s, G.perTap(s));
  assert.equal(s.cookies, 2);
  assert.ok(G.price(s, 'finger') > 15);
  assert.equal(G.buy(s, 'missing'), false);
});

test('save roundtrip preserves progress and credits capped offline production once', () => {
  const s = G.fresh(1000);
  s.grandma = 1;
  s.oven = 1;
  const loaded = G.restore(JSON.stringify(s), 1000 + 12 * 3600000);
  assert.equal(G.tick(loaded, 1000 + 12 * 3600000), 8 * 3600 * 11);
  assert.equal(G.tick(loaded, 1000 + 12 * 3600000), 0);
  assert.equal(G.perSecond(loaded), 11);
});

test('bad saves and clock rollback never give negative or invalid balances', () => {
  assert.deepEqual(G.restore('{oops', 1000), G.fresh(1000));
  const s = G.restore(JSON.stringify({ version: 1, cookies: -5, total: 'bad', grandma: -10, oven: 1e99, updated: 9000 }), 1000);
  assert.equal(s.cookies, 0);
  assert.equal(s.grandma, 0);
  assert.equal(s.oven, 500);
  assert.equal(G.tick(s, 500), 0);
  assert.equal(s.cookies, 0);
  G.earn(s, Infinity);
  assert.equal(s.cookies, 0);
});
