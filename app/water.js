// 물놀이 — a glass tank of water to play with. Where WebGPU is available the water is Splash's
// particle simulation (vendor/splash, MLS-MPM): a hand moving through it stirs it. Elsewhere,
// the surface-sheet tank (water-scene.js) with the same controls.
import { WaterScene } from './water-scene.js';
import { createShell } from './shell.js';

const $ = (sel) => document.querySelector(sel);

let tank = null;
if (navigator.gpu) {
  document.body.classList.add('fluid'); // the canvas needs its size before WebGPU sets it up
  try {
    const { createTank } = await import('../vendor/splash/splash-tank.js');
    tank = await createTank($('#fluid'), { elevation: 10 });
  } catch (e) {
    console.warn('particle water unavailable, falling back', e);
    tank = null;
  }
}
document.body.classList.toggle('fluid', Boolean(tank));

// The shell drives a three.js stage for the 3D hand; with the particle tank there is no stage,
// so it gets a stand-in and the hand is shown as a ring over the water.
const surface = tank ? null : new WaterScene($('#stage'));
const stage = surface ?? { setHand() {}, handSide: () => null, setShift() {} };
const shell = createShell({ scene: stage, gameId: 'water' });
const { onStage } = shell;
const ring = $('#dip');

let mouseDown = false, mouseMode = 'push';
let lastHand = 0;

function stir(x, y, mode) {
  if (tank) tank.setHand(mode ? x : null, y);
  else surface.setStir(Boolean(mode), x, y);
  ring.hidden = !mode;
  if (mode) {
    ring.style.transform = `translate(${x}px, ${y}px)`;
    ring.classList.toggle('pull', mode === 'pull');
  }
}

const inWater = (x, y) => (tank ? document.elementFromPoint(x, y) === $('#fluid') : onStage(x, y));

shell.attach({
  modalOpen: () => shell.introOpen(),
  dragging: () => mouseDown,
  // pinches and presses: a real hand is handled in onHandPose, so only claim it here
  startDrag(x, y) { return !shell.introOpen() && inWater(x, y); },
  moveDrag() {},
  endDrag() {},
  cancelDrag() {},
  updateHover() {},
  // A tracked hand is in the water whenever it's seen; its movement stirs the water.
  onHandPose(frame) {
    if (shell.introOpen()) return;
    lastHand = performance.now();
    stir(frame.x * innerWidth, frame.y * innerHeight, 'push');
  },
  refresh() {},
});

// Out of the water once the mouse is released and no hand has been seen for a moment.
(function watch() {
  if (!mouseDown && performance.now() - lastHand > 180) stir(0, 0, null);
  requestAnimationFrame(watch);
})();

// Mouse: drag through the water to stir it.
const water = tank ? $('#fluid') : $('#stage');
water.addEventListener('contextmenu', (e) => e.preventDefault());
water.addEventListener('pointerdown', (e) => {
  if (shell.introOpen()) return;
  mouseDown = true;
  water.setPointerCapture(e.pointerId);
  stir(e.clientX, e.clientY, mouseMode);
});
water.addEventListener('pointermove', (e) => { if (mouseDown) stir(e.clientX, e.clientY, mouseMode); });
water.addEventListener('pointerup', () => { mouseDown = false; });
water.addEventListener('pointercancel', () => { mouseDown = false; });

$('#b-calm').addEventListener('click', () => (tank ? tank.reset() : surface.sim.calm()));
$('#b-surfer').hidden = Boolean(tank);
$('#b-surfer').addEventListener('click', () => surface && Object.assign(surface.surfer, { x: 0, z: 0, vx: 0, vz: 0 }));

// The glass tank drawn over the water: black rims top and bottom, silicone-seam corners.
if (tank) {
  const frame = $('#tankframe'), g = frame.getContext('2d');
  // Splash keeps particles 3 cells in from the low walls and 4 from the high ones, and the water
  // rests ~2.4 cells above the tiles: the glass goes there, on a black base slab.
  const [X, , Z] = tank.box, TOP = 19, B = 2.4, lo = 2.4, hx = X - 3.4, hz = Z - 3.4;
  const draw = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    if (frame.width !== Math.round(innerWidth * dpr)) { frame.width = Math.round(innerWidth * dpr); frame.height = Math.round(innerHeight * dpr); }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, innerWidth, innerHeight);
    const P = (x, y, z) => tank.project(x, y, z);
    const line = (a, b, w, c) => { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); };
    const corners = [[lo, lo], [hx, lo], [hx, hz], [lo, hz]];
    // glass: a faint green-grey tint on each pane, lighter at the top where it catches the light
    const pane = (pts, alpha) => {
      g.fillStyle = `rgba(190,220,215,${alpha})`;
      g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y))); g.closePath(); g.fill();
    };
    pane([P(lo, B, lo), P(hx, B, lo), P(hx, TOP, lo), P(lo, TOP, lo)], 0.06); // back
    pane([P(lo, B, lo), P(lo, B, hz), P(lo, TOP, hz), P(lo, TOP, lo)], 0.08); // left
    pane([P(hx, B, lo), P(hx, B, hz), P(hx, TOP, hz), P(hx, TOP, lo)], 0.08); // right
    pane([P(lo, B, hz), P(hx, B, hz), P(hx, TOP, hz), P(lo, TOP, hz)], 0.05); // front
    // the base slab under the water
    const base = (pts) => { g.fillStyle = '#1b1e20'; g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y))); g.closePath(); g.fill(); };
    base([P(lo, 0, hz), P(hx, 0, hz), P(hx, B, hz), P(lo, B, hz)]);
    base([P(hx, 0, lo), P(hx, 0, hz), P(hx, B, hz), P(hx, B, lo)]);
    base([P(lo, 0, lo), P(lo, 0, hz), P(lo, B, hz), P(lo, B, lo)]);
    // back edges first, thin (seen through the water), then the front frame
    const [bl, br] = [P(lo, B, lo), P(hx, B, lo)];
    line(P(lo, B, lo), P(lo, TOP, lo), 2, 'rgba(22,25,27,0.55)');
    line(P(hx, B, lo), P(hx, TOP, lo), 2, 'rgba(22,25,27,0.55)');
    line(bl, br, 3, 'rgba(22,25,27,0.55)');
    line(P(lo, TOP, lo), P(hx, TOP, lo), 4, '#16191b');
    line(P(lo, TOP, lo), P(lo, TOP, hz), 4, '#16191b');
    line(P(hx, TOP, lo), P(hx, TOP, hz), 4, '#16191b');
    line(P(lo, B, lo), P(lo, B, hz), 6, '#16191b');
    line(P(hx, B, lo), P(hx, B, hz), 6, '#16191b');
    line(P(lo, B, hz), P(lo, TOP, hz), 4, '#16191b'); // front corner posts
    line(P(hx, B, hz), P(hx, TOP, hz), 4, '#16191b');
    line(P(lo, TOP, hz), P(hx, TOP, hz), 5, '#16191b');
    line(P(lo, B, hz), P(hx, B, hz), 8, '#16191b');
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}

// Debug / test handle
window.__water = { tank, surface, stir, hand: shell.injectHandFrame };
