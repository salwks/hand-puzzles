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
    tank = await createTank($('#fluid'), { base: 'vendor/splash/', elevation: 10 });
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

// Debug / test handle
window.__water = { tank, surface, stir, hand: shell.injectHandFrame };
