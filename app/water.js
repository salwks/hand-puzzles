// 물놀이 — a glass tank of water to play with. Put a hand in (or drag the mouse through
// it) and the water follows: waves, reflections off the glass, foam where they meet,
// spray and bubbles, and a toy surfer riding whatever you make.
import { WaterScene } from './water-scene.js';
import { createShell } from './shell.js';

const $ = (sel) => document.querySelector(sel);
const scene = new WaterScene($('#stage'));
const shell = createShell({ scene, gameId: 'water' });
const { onStage } = shell;

let mouseDown = false;
let lastHand = 0;

shell.attach({
  modalOpen: () => shell.introOpen(),
  dragging: () => mouseDown,
  startDrag(x, y) {
    if (shell.introOpen() || !onStage(x, y)) return false;
    mouseDown = true;
    scene.pointer = { x, y };
    scene.setStir(true, x, y);
    return true;
  },
  moveDrag(x, y) {
    if (!mouseDown) return;
    scene.pointer = { x, y };
    scene.setStir(true, x, y);
  },
  endDrag() { mouseDown = false; },
  cancelDrag() { mouseDown = false; },
  updateHover() {},
  // A tracked hand is always "in the water": no pinch needed, its movement is the stroke.
  onHandPose(frame) {
    if (shell.introOpen()) return;
    lastHand = performance.now();
    scene.setStir(true, frame.x * innerWidth, frame.y * innerHeight);
  },
  refresh() {},
});

// Out of the water when the mouse is released and no hand has been seen for a moment.
(function watch() {
  if (!mouseDown && performance.now() - lastHand > 180) scene.setStir(false);
  requestAnimationFrame(watch);
})();

$('#b-calm').addEventListener('click', () => scene.sim.calm());
$('#b-surfer').addEventListener('click', () => Object.assign(scene.surfer, { x: 0, z: 0, vx: 0, vz: 0 }));
for (const id of ['#btn-start-mouse', '#btn-start-cam']) $(id).addEventListener('click', () => {}, { once: true });

// Debug / test handle
window.__water = { scene, hand: shell.injectHandFrame };
