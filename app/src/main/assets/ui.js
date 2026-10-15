'use strict';
const G = window.CookieGame;
const STORAGE = 'galleta-factory-v1';
const $ = id => document.getElementById(id);
const format = value => Math.floor(value).toLocaleString('es-ES');
let storageAvailable = true;
let raw = null;
try { raw = localStorage.getItem(STORAGE); } catch (_) { storageAvailable = false; }
let state = G.restore(raw);
const offline = G.tick(state);
const icons = { finger: '👆', grandma: '👵', oven: '🔥' };
const buttons = {};
for (const [key, item] of Object.entries(G.ITEMS)) {
  const button = document.createElement('button');
  button.className = 'upgrade';
  button.innerHTML = '<span class="upgrade-icon" aria-hidden="true">' + icons[key] + '</span><span class="upgrade-info"><strong>' + item.name + '</strong><small>' + item.description + '</small></span><span class="upgrade-cost"><span class="price"></span><small class="owned"></small></span>';
  button.addEventListener('click', () => {
    G.tick(state);
    if (G.buy(state, key)) {
      $('message').textContent = item.name + ': ¡mejora comprada!';
      saveGame();
    }
    render();
  });
  $('shop').appendChild(button);
  buttons[key] = button;
}
function render() {
  $('cookies').textContent = format(state.cookies);
  $('tap-rate').textContent = format(G.perTap(state));
  $('rate').textContent = format(G.perSecond(state));
  const goals = [100, 1000, 10000, 100000, 1000000, 1000000000];
  const goal = goals.find(value => value > state.total);
  const percent = goal ? Math.min(100, Math.floor(state.total / goal * 100)) : 100;
  $('goal-label').textContent = goal ? 'Meta · ' + format(goal) + ' galletas horneadas' : '¡Imperio de la galleta completado!';
  $('goal-percent').textContent = percent + '%';
  $('goal').value = percent;
  for (const key of Object.keys(G.ITEMS)) {
    const button = buttons[key];
    const maxed = state[key] >= 500;
    button.disabled = maxed || state.cookies < G.price(state, key);
    button.querySelector('.price').textContent = maxed ? 'Máximo' : format(G.price(state, key)) + ' 🍪';
    button.querySelector('.owned').textContent = state[key] + ' en propiedad';
  }
}
function saveGame() {
  G.tick(state);
  try {
    localStorage.setItem(STORAGE, JSON.stringify(state));
    storageAvailable = true;
  } catch (_) { storageAvailable = false; }
  $('save-status').textContent = storageAvailable ? 'Guardado automático · Sin conexión' : 'No se pudo guardar el progreso';
}
window.saveGame = saveGame;
$('cookie').addEventListener('click', () => {
  G.tick(state);
  G.earn(state, G.perTap(state));
  render();
  saveGame();
});
$('reset').addEventListener('click', () => {
  if (!window.confirm('¿Borrar todas tus galletas y mejoras? Esta acción no se puede deshacer.')) return;
  state = G.fresh();
  saveGame();
  render();
  $('message').textContent = 'Nuevo comienzo. ¡Vamos a hornear!';
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) saveGame();
  else {
    const earned = G.tick(state);
    if (earned >= 1) $('message').textContent = '¡Has horneado ' + format(earned) + ' galletas mientras no estabas!';
    render();
    saveGame();
  }
});
window.addEventListener('pagehide', saveGame);
setInterval(() => { G.tick(state); render(); }, 250);
setInterval(saveGame, 3000);
if (offline >= 1) $('message').textContent = '¡Bienvenido! Ganaste ' + format(offline) + ' galletas mientras no estabas (máximo 8 h).';
render();
saveGame();
