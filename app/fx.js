// Big-moment effects shared by the games: a light flash, the scene's bloom flaring up,
// confetti and fireworks (canvas-confetti, loaded on first use) and a glowing headline.
// The page needs #flash, #fx-canvas and #big-say (styles in style.css).
const $ = (sel) => document.querySelector(sel);
const GOLD = ['#f2d08a', '#d6a23e', '#fff4d6', '#c9454b', '#ffffff'];

let confettiFn = null;
import('https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/+esm')
  .then((m) => { confettiFn = m.default.create($('#fx-canvas'), { resize: true, useWorker: true }); })
  .catch(() => {});

export function createFx(scene) {
  function flash(strong = false) {
    const el = $('#flash');
    el.classList.remove('on', 'strong');
    void el.offsetWidth;
    el.classList.add('on');
    el.classList.toggle('strong', strong);
  }

  let bigTimer;
  /** A headline across the table: '쪽!', '리치!', or kind 'victory' for the win burst. */
  function bigSay(text, kind = '') {
    const el = $('#big-say');
    el.textContent = text;
    el.hidden = false;
    el.className = '';
    void el.offsetWidth;
    el.className = kind ? `pop ${kind}` : 'pop';
    clearTimeout(bigTimer);
    bigTimer = setTimeout(() => { el.hidden = true; }, kind === 'victory' ? 2200 : 1300);
  }

  /** A special play: a short flare of light and a puff of gold. */
  function specialFx() {
    scene.flare(0.6, 0.9);
    flash(false);
    confettiFn?.({ particleCount: 60, spread: 70, startVelocity: 32, origin: { x: 0.5, y: 0.45 }, colors: GOLD, scalar: 0.8, ticks: 120 });
  }

  /** Winning: white flash, the light blooms, fireworks from both sides, the title bursts in. */
  function victoryFx(title = '승리!') {
    scene.flare(1, 3.2);
    scene.shake = 0.14;
    flash(true);
    bigSay(title, 'victory');
    if (!confettiFn) return;
    const end = performance.now() + 2600;
    const shoot = () => {
      confettiFn({ particleCount: 7, angle: 60, spread: 60, startVelocity: 62, origin: { x: 0, y: 0.75 }, colors: GOLD });
      confettiFn({ particleCount: 7, angle: 120, spread: 60, startVelocity: 62, origin: { x: 1, y: 0.75 }, colors: GOLD });
      if (performance.now() < end) requestAnimationFrame(shoot);
    };
    shoot();
    for (let i = 0; i < 6; i++) {
      setTimeout(() => confettiFn({
        particleCount: 90, spread: 360, startVelocity: 26, gravity: 0.7, decay: 0.92, ticks: 160, scalar: 0.9,
        origin: { x: 0.2 + Math.random() * 0.6, y: 0.2 + Math.random() * 0.3 }, colors: GOLD, shapes: ['circle', 'star'],
      }), 250 + i * 380);
    }
  }

  return { flash, bigSay, specialFx, victoryFx };
}
