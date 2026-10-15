(function (root) {
  'use strict';
  const MAX = 1e15;
  const MAX_OFFLINE = 8 * 60 * 60;
  const ITEMS = {
    finger: { name: 'Dedos de oro', description: '+1 galleta por toque', base: 15, growth: 1.6 },
    grandma: { name: 'Abuela repostera', description: '+1 galleta por segundo', base: 30, growth: 1.18 },
    oven: { name: 'Horno mágico', description: '+10 galletas por segundo', base: 250, growth: 1.22 }
  };
  const clean = value => typeof value === 'number' && Number.isFinite(value)
    ? Math.min(MAX, Math.max(0, value)) : 0;
  function fresh(now = Date.now()) {
    return { version: 1, cookies: 0, total: 0, finger: 0, grandma: 0, oven: 0, updated: now };
  }
  function restore(raw, now = Date.now()) {
    let input;
    try { input = JSON.parse(raw); } catch (_) { return fresh(now); }
    if (!input || input.version !== 1) return fresh(now);
    const state = fresh(now);
    state.cookies = clean(input.cookies);
    state.total = Math.max(state.cookies, clean(input.total));
    for (const key of Object.keys(ITEMS)) state[key] = Math.min(500, Math.floor(clean(input[key])));
    state.updated = Math.min(now, clean(input.updated) || now);
    return state;
  }
  const perTap = state => 1 + state.finger;
  const perSecond = state => state.grandma + state.oven * 10;
  function price(state, key) {
    if (!ITEMS[key]) return Infinity;
    return Math.ceil(ITEMS[key].base * Math.pow(ITEMS[key].growth, state[key]));
  }
  function earn(state, amount) {
    const earned = clean(amount);
    state.cookies = clean(state.cookies + earned);
    state.total = clean(state.total + earned);
    return earned;
  }
  function tick(state, now = Date.now()) {
    const seconds = Math.min(MAX_OFFLINE, Math.max(0, (now - state.updated) / 1000));
    const earned = earn(state, seconds * perSecond(state));
    state.updated = now;
    return earned;
  }
  function buy(state, key) {
    const cost = price(state, key);
    if (!ITEMS[key] || state[key] >= 500 || state.cookies < cost) return false;
    state.cookies -= cost;
    state[key]++;
    return true;
  }
  const api = { ITEMS, fresh, restore, perTap, perSecond, price, earn, tick, buy };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CookieGame = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
