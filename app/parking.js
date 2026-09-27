// 주차장 탈출: the game page. A puzzle from the level's list (parking-logic.js) goes on the 3D
// board (parking-scene.js); cars are picked up by pinch or mouse and slid along their own axis —
// the hand's motion since the grab, projected onto the car's direction, is what moves it, so
// sideways drift and the camera's slant don't matter. A slide of any length is one move.
// Three puzzles in a row with two stars or more open the next level.
import * as P from './parking-logic.js';
import { ParkingScene } from './parking-scene.js';
import { createShell } from './shell.js';
import { sfx, unlockSound, isMuted, setMuted } from './sound.js';
import { createFx } from './fx.js';

const $ = (sel) => document.querySelector(sel);
const SAVE_KEY = 'parking-progress';
const PALM_MS = 1000;

const scene = new ParkingScene($('#stage'));
const shell = createShell({ scene, gameId: 'parking' });
const { bigSay, specialFx } = createFx(scene);

const prog = { level: 1, unlocked: 1, next: {}, streak: {}, best: {} };
try { Object.assign(prog, JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')); } catch { /* keep defaults */ }
const save = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(prog)); } catch { /* storage blocked */ } };

const game = { g: null, drag: null, solved: false, palm: 0 };

// ---------- puzzles ----------

function load(level = prog.level, n = prog.next[level] ?? 0) {
  prog.level = level;
  const p = P.puzzle(level, n);
  game.g = P.newGame(p);
  game.solved = false;
  game.drag = null;
  scene.setPosition(game.g.pos);
  scene.clearHint();
  $('#p-done').hidden = true;
  save();
  render();
}

function next() {
  prog.next[prog.level] = (prog.next[prog.level] ?? 0) + 1;
  load();
}

// ---------- dragging ----------

function startDrag(x, y) {
  if (shell.introOpen() || !$('#p-done').hidden) return false;
  scene.pointer = { x, y };
  if (game.solved) return true;
  const pos = game.g.pos;
  const id = scene.carAt(x, y, pos.cars.map((c) => c.id));
  if (!id) return false;
  const i = pos.cars.findIndex((c) => c.id === id);
  const origin = scene.planeAt(x, y);
  if (!origin) return false;
  const range = P.range(pos, i);
  game.drag = { i, car: pos.cars[i], origin, range, bumped: 0 };
  scene.setGlow(id, null);
  scene.hold(pos.cars[i], range);
  sfx('lift', { vol: 0.3, rate: 1.1 });
  return true;
}

function moveDrag(x, y) {
  const d = game.drag;
  if (!d) return;
  scene.pointer = { x, y };
  const p = scene.planeAt(x, y);
  if (!p) return;
  const raw = d.car.horiz ? p.x - d.origin.x : p.z - d.origin.z;
  const lo = -d.range.back, hi = d.range.fwd;
  // a soft knock the moment it runs into something
  const side = raw < lo - 0.08 ? -1 : raw > hi + 0.08 ? 1 : 0;
  if (side && d.bumped !== side) sfx('clack', { vol: 0.22, rate: 1.4 });
  d.bumped = side;
  scene.dragTo(Math.max(lo, Math.min(hi, raw)));
}

function endDrag(x, y) {
  const d = game.drag;
  if (!d) return;
  moveDrag(x, y);
  game.drag = null;
  const cells = scene.release();
  if (cells && P.play(game.g, d.i, cells)) {
    sfx('knock', { vol: 0.35, rate: 1.3 });
    scene.clearHint();
    if (P.solved(game.g.pos)) win();
  } else sfx('knock', { vol: 0.18, rate: 1.6 });
  render();
}

function cancelDrag() {
  if (!game.drag) return;
  game.drag = null;
  scene.dragTo(0);
  scene.release();
  render();
}

// ---------- the rest of the buttons ----------

function undo() {
  if (game.drag || game.solved) return;
  if (!P.undo(game.g)) { shell.toast('되돌릴 이동이 없습니다', 1200); return; }
  scene.sync(game.g.pos);
  scene.clearHint();
  sfx('slide', { vol: 0.25, rate: 1.2 });
  render();
}
function restart() {
  if (game.drag || game.solved) return;
  if (!P.restart(game.g)) return;
  scene.sync(game.g.pos);
  scene.clearHint();
  render();
}
function hint() {
  if (game.drag || game.solved) return;
  const h = P.hint(game.g.pos);
  if (!h) return;
  scene.showHint(game.g.pos.cars[h.car], h.d);
  const left = P.solve(game.g.pos).length;
  shell.toast(`초록색 차를 화살표 쪽으로 — 여기서 ${left}수면 풉니다`, 2200);
}

// ---------- solving ----------

function win() {
  game.solved = true;
  const { p, used } = game.g;
  const stars = P.stars(used, p.best);
  prog.best[p.id] = Math.max(prog.best[p.id] ?? 0, stars);
  // three in a row with two stars or more opens the next level
  const L = prog.level;
  prog.streak[L] = stars >= 2 ? (prog.streak[L] ?? 0) + 1 : 0;
  let opened = false;
  if (prog.streak[L] >= 3 && L === prog.unlocked && L < P.LEVELS.length) { prog.unlocked = L + 1; opened = true; }
  prog.next[L] = (prog.next[L] ?? 0) + 1;
  save();
  sfx('win2', { vol: 0.5 });
  scene.driveOut(() => {
    specialFx();
    bigSay('탈출!');
    $('#p-done-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    $('#p-done-text').textContent = `${used}수 · 최소 ${p.best}수`;
    $('#p-done-note').innerHTML = opened ? `<b>${P.LEVELS[L].name} 단계가 열렸습니다</b>`
      : stars < 3 ? `최소 수로 풀면 별 셋${L === prog.unlocked && L < P.LEVELS.length ? ` · 연속 ${prog.streak[L]}/3` : ''}`
      : L === prog.unlocked && L < P.LEVELS.length ? `다음 단계까지 연속 ${prog.streak[L]}/3` : '';
    setTimeout(() => { $('#p-done').hidden = false; }, 700);
  });
  render();
}

// ---------- hand: open palm held = undo ----------

function openPalm(lm) {
  const d = (a, b) => Math.hypot(lm[a].x - lm[b].x, lm[a].y - lm[b].y);
  return [[8, 6], [12, 10], [16, 14], [20, 18]].every(([t, j]) => d(t, 0) > d(j, 0) * 1.12) && d(4, 5) > 0.5 * (d(0, 9) || 1);
}
function onHandPose(frame) {
  if (game.drag || frame.pinching || !frame.landmarks || shell.introOpen() || !openPalm(frame.landmarks)) { game.palm = 0; return; }
  const now = performance.now();
  if (!game.palm) game.palm = now;
  if (now - game.palm >= PALM_MS) { game.palm = now + 600; undo(); }
}

// ---------- HUD ----------

function render() {
  const g = game.g;
  if (!g) return;
  $('#p-levels').innerHTML = P.LEVELS.map((L, i) => `<button class="btn small tab" data-level="${i + 1}" aria-pressed="${prog.level === i + 1}" ${i + 1 > prog.unlocked ? 'disabled title="앞 단계에서 3문제 연속 별 둘 이상"' : ''}>${L.name}</button>`).join('');
  $('#p-used').textContent = g.used;
  $('#p-best').textContent = ` / 최소 ${g.p.best}`;
  const s = P.stars(Math.max(g.used, 0), g.p.best);
  $('#p-stars').textContent = g.used <= g.p.best ? '★★★' : '★'.repeat(s) + '☆'.repeat(3 - s);
  $('#p-id').textContent = `${P.LEVELS[g.p.level - 1].name} · 문제 ${g.p.n + 1}/${P.count(g.p.level)}${prog.best[g.p.id] ? ` · 최고 ${'★'.repeat(prog.best[g.p.id])}` : ''}`;
  $('#banner-text').innerHTML = game.solved ? '<b>탈출!</b>' : '차를 집어 <b>앞뒤로</b> 밀어 빨간 차의 길을 여세요';
  $('#b-undo').disabled = !g.history.length || game.solved;
  $('#b-reset').disabled = !g.history.length || game.solved;
  $('#b-hint').disabled = game.solved;
}
$('#p-levels').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-level]');
  if (!b || b.disabled || game.drag) return;
  load(Number(b.dataset.level));
});

function updateHover(x, y) {
  if (game.drag || !game.g || game.solved) return;
  const id = x === null || !shell.onStage(x, y) ? null : scene.carAt(x, y, game.g.pos.cars.map((c) => c.id));
  if (id !== scene.hoverId) {
    if (scene.hoverId && scene.cars.get(scene.hoverId)?.glow.color !== 0x2fae7f) scene.setGlow(scene.hoverId, null);
    scene.hoverId = id;
    if (id && scene.cars.get(id).glow.color !== 0x2fae7f) scene.setGlow(id, { color: 0xe0a83a, intensity: 0.3, pulse: false });
  }
}

shell.attach({
  modalOpen: () => shell.introOpen() || !$('#p-done').hidden,
  dragging: () => Boolean(game.drag),
  startDrag, moveDrag, endDrag, cancelDrag, updateHover, onHandPose,
  refresh: render,
});

$('#b-hint').addEventListener('click', hint);
$('#b-undo').addEventListener('click', undo);
$('#b-reset').addEventListener('click', restart);
$('#b-next').addEventListener('click', () => { if (!game.drag) next(); });
$('#p-next').addEventListener('click', () => load());
addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); undo(); }
  else if (e.key === 'Enter' && !$('#p-done').hidden) load();
});
for (const id of ['#btn-start-cam', '#btn-start-mouse']) $(id).addEventListener('click', () => unlockSound());
const soundBtn = $('#b-sound');
const showSound = () => { soundBtn.textContent = isMuted() ? '소리 꺼짐' : '소리 켜짐'; soundBtn.classList.toggle('off', isMuted()); };
soundBtn.addEventListener('click', () => { unlockSound(); setMuted(!isMuted()); showSound(); });
showSound();

load();

// Debug / test handle
window.__parking = { game, scene, P, prog, hand: shell.injectHandFrame, load, next, undo, hint };
