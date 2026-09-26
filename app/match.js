// 성냥개비: the game page. Lays a generated puzzle (match-logic.js) out on the 3D table
// (match-scene.js), lets the player pick sticks up and put them down — pinch or mouse drag —
// judges the board after every drop, and moves through the levels: three solved in a row goes
// up a level, two skipped in a row goes down one.
import * as M from './match-logic.js';
import { MatchScene, L } from './match-scene.js';
import { createShell } from './shell.js';
import { sfx, unlockSound, isMuted, setMuted } from './sound.js';
import { createFx } from './fx.js';

const $ = (sel) => document.querySelector(sel);
const SAVE_KEY = 'match-progress';
const PALM_MS = 1000; // open palm held this long: undo

const scene = new MatchScene($('#stage'));
const shell = createShell({ scene, gameId: 'match' });
const { bigSay, specialFx } = createFx(scene);

const game = {
  type: 'equation',
  progress: { equation: { level: 1, streak: 0, skips: 0 }, shape: { level: 1, streak: 0, skips: 0 } },
  p: null,
  slots: [],          // [{ id, x, y, ang, cell, bit | edge }]
  at: new Map(),      // slot id → stick id
  where: new Map(),   // stick id → slot id, or 'tray'
  start: null,        // where each stick began
  history: [],        // [{ stick, from, to }]
  carry: null,        // { stick, from }
  hover: null,
  hintStep: 0,
  solved: false,
  palm: { since: 0 },
};
try { Object.assign(game.progress, JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')); } catch { /* keep defaults */ }
const save = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(game.progress)); } catch { /* storage blocked */ } };
const prog = () => game.progress[game.type];

// ---------- layout ----------

// seven-segment slots around a digit cell's centre (with a small gap at every corner, as sticks
// laid by hand leave), and the symbol slots
const GX = 0.56 * L, GY = 0.545 * L, DW = 2 * GX;
const SEG_AT = {
  0: [0, 2 * GY, 0], 1: [GX, GY, Math.PI / 2], 2: [GX, -GY, Math.PI / 2], 3: [0, -2 * GY, 0],
  4: [-GX, -GY, Math.PI / 2], 5: [-GX, GY, Math.PI / 2], 6: [0, 0, 0],
};
const SYM_AT = { 0: [0, 0, 0], 1: [0, 0, Math.PI / 2], 2: [0, 0.22 * L, 0], 3: [0, -0.22 * L, 0], 4: [0, 0, Math.PI / 4], 5: [0, 0, -Math.PI / 4] };
// heads point either way along a slot: vary it so the board looks placed by hand
const flip = (a, b) => ((a * 31 + b * 17) % 3 === 0 ? Math.PI : 0);

function layoutEquation(p) {
  const slots = [];
  const widths = p.cells.map((c) => (c.t === 'd' ? DW : L * 0.9));
  const gaps = p.cells.map((c, i) => (i === 0 ? 0 : c.t === 'd' && p.cells[i - 1].t === 'd' ? 0.42 * L : 0.5 * L));
  const total = widths.reduce((a, b) => a + b, 0) + gaps.reduce((a, b) => a + b, 0);
  let x = -total / 2;
  const cellBoxes = [];
  p.cells.forEach((c, i) => {
    x += gaps[i];
    const cx = x + widths[i] / 2;
    const table = c.t === 'd' ? SEG_AT : SYM_AT;
    for (const [bit, [dx, dy, ang]] of Object.entries(table)) {
      slots.push({ id: `${i}:${bit}`, cell: i, bit: Number(bit), x: cx + dx, y: dy, ang: ang + flip(i, Number(bit)) });
    }
    cellBoxes.push({ x: cx, y: 0, w: widths[i] + 0.3, h: 4 * GY + 0.4 });
    x += widths[i];
  });
  return { slots, cellBoxes, width: total };
}

function layoutShape(p) {
  const lat = p.lattice;
  const xs = lat.pts.map((q) => q.x), ys = lat.pts.map((q) => q.y);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const S = 1.08 * L; // a little wider than a stick, so corners don't pile up
  const P = (q) => [(q.x - cx) * S, (cy - q.y) * S];
  const slots = lat.slots.map((s, e) => {
    const [ax, ay] = P(lat.pts[s.a]), [bx, by] = P(lat.pts[s.b]);
    return { id: `e${e}`, edge: e, x: (ax + bx) / 2, y: (ay + by) / 2, ang: Math.atan2(by - ay, bx - ax) + flip(e, 3) };
  });
  const width = (Math.max(...xs) - Math.min(...xs)) * S;
  return { slots, dots: lat.pts.map(P), width };
}

// ---------- a puzzle ----------

function newPuzzle(seed = (Math.random() * 1e6) | 0) {
  const level = prog().level;
  const p = M.makePuzzle(seed, { type: game.type, level }) ?? M.makePuzzle(seed + 1, { type: game.type, level });
  game.p = p;
  const lay = p.kind === 'equation' ? layoutEquation(p) : layoutShape(p);
  game.slots = lay.slots;
  game.slotMap = null;
  game.cellBoxes = lay.cellBoxes ?? null;
  const needsTray = p.mode !== 'move';
  const lowest = Math.min(...lay.slots.map((s) => s.y));
  const tray = needsTray ? { x: 0, y: lowest - 1.25 * L, w: Math.max(2.2, L * 2.4) } : null;
  scene.extinguish();
  scene.markAreas(null);
  scene.clearGlows();
  scene.setLayout({ slots: lay.slots, dots: lay.dots ?? [], tray });

  // sticks where the puzzle has them, plus spares in the tray for an "add" puzzle
  const on = lay.slots.filter((s) => (p.kind === 'equation' ? (p.cells[s.cell].m >> s.bit) & 1 : p.on[s.edge]));
  const spares = p.mode === 'add' ? p.moves : 0;
  const ids = [...Array(on.length + spares).keys()];
  scene.setSticks(ids);
  game.at = new Map(); game.where = new Map();
  on.forEach((s, i) => { game.at.set(s.id, i); game.where.set(i, s.id); });
  for (let j = 0; j < spares; j++) game.where.set(on.length + j, 'tray');
  game.start = new Map(game.where);
  game.history = [];
  game.hintStep = 0;
  game.solved = false;
  layoutSticks(true);
  $('#m-done').hidden = true;
  render();
}

/** Every stick to where the state says it is. */
function layoutSticks(instant = false) {
  let t = 0;
  for (const [id, w] of game.where) {
    if (game.carry?.stick === id) continue;
    scene.place(id, w === 'tray' ? scene.trayPose(t++) : scene.slotPose(w), { instant });
  }
  scene.occupied = new Set(game.at.keys());
}

/** The board as the rules engine reads it. */
function board() {
  const p = game.p;
  if (p.kind === 'equation') {
    const cells = p.cells.map((c) => ({ t: c.t, m: 0 }));
    for (const sid of game.at.keys()) { const s = slotById(sid); cells[s.cell].m |= 1 << s.bit; }
    return cells;
  }
  const on = new Array(p.lattice.slots.length).fill(0);
  for (const sid of game.at.keys()) on[slotById(sid).edge] = 1;
  return on;
}
const slotById = (id) => game.slotMap?.get(id) ?? (game.slotMap = new Map(game.slots.map((s) => [s.id, s]))).get(id);

// ---------- moving sticks ----------

/**
 * Which sticks may be picked up: any on the board for a move or remove puzzle (and ones already
 * taken away, to put back); only the spares for an add puzzle (the board's own sticks stay).
 */
function movable() {
  if (game.solved) return [];
  const ids = [...game.where.keys()];
  return game.p.mode === 'add' ? ids.filter((id) => game.start.get(id) === 'tray') : ids;
}
/** Where the carried stick may go: any free slot, except a remove puzzle only puts sticks back where they were. */
function freeSlots() {
  const free = game.slots.filter((s) => !game.at.has(s.id)).map((s) => s.id);
  if (game.p.mode !== 'remove') return free;
  const home = game.carry ? game.start.get(game.carry.stick) : null;
  return free.filter((id) => id === home);
}

function overTray(x, y) {
  const t = scene.tray;
  if (!t) return false;
  const q = scene.layoutAt(x, y, 0);
  return q && Math.abs(q.x - t.x) < t.w / 2 + 0.4 && Math.abs(q.y - t.y) < 0.8;
}

function startDrag(x, y) {
  if (shell.introOpen() || !$('#m-done').hidden) return false;
  scene.pointer = { x, y };
  if (game.solved) return true;
  const id = scene.stickNear(x, y, movable());
  if (id === null) return false;
  const from = game.where.get(id);
  if (from !== 'tray') game.at.delete(from);
  game.carry = { stick: id, from };
  scene.occupied = new Set(game.at.keys());
  scene.carry(id);
  scene.clearGlows();
  sfx('slide', { vol: 0.3, rate: 1.35 });
  moveDrag(x, y);
  return true;
}

function moveDrag(x, y) {
  if (!game.carry) return;
  scene.pointer = { x, y };
  scene.setTarget(scene.slotNear(x, y, freeSlots()));
}

function endDrag(x, y) {
  const c = game.carry;
  if (!c) return;
  scene.pointer = { x, y };
  const slot = scene.slotNear(x, y, freeSlots());
  scene.dropCarry();
  game.carry = null;
  let to = c.from;
  if (slot !== null) to = slot;
  else if (overTray(x, y) && game.p.mode !== 'move') to = 'tray';
  if (to !== c.from) game.history.push({ stick: c.stick, from: c.from, to });
  put(c.stick, to);
  sfx(to === 'tray' ? 'slide' : 'knock', { vol: 0.35, rate: 1.55 });
  if (to !== c.from) judge();
  render();
}

function cancelDrag() {
  const c = game.carry;
  if (!c) return;
  scene.dropCarry();
  game.carry = null;
  put(c.stick, c.from);
  render();
}

function put(stick, to) {
  game.where.set(stick, to);
  if (to !== 'tray') game.at.set(to, stick);
  layoutSticks();
}

function undo() {
  if (game.carry || game.solved) return;
  const last = game.history.pop();
  if (!last) { shell.toast('되돌릴 이동이 없습니다', 1200); return; }
  if (last.to !== 'tray') game.at.delete(last.to);
  put(last.stick, last.from);
  sfx('slide', { vol: 0.3, rate: 1.1 });
  render();
}

function reset() {
  if (game.carry || game.solved) return;
  game.at = new Map(); game.where = new Map(game.start);
  for (const [id, w] of game.where) if (w !== 'tray') game.at.set(w, id);
  game.history = [];
  layoutSticks();
  render();
}

// ---------- judging ----------

function judge() {
  const p = game.p;
  const r = M.check(p, board());
  if (r.solved) return win(r);
  if (r.done) {
    const moved = game.history.map((h) => h.stick);
    scene.shakeSticks(moved);
    sfx('knock', { vol: 0.25, rate: 0.8, delay: 0.1 });
    const why = p.kind === 'equation'
      ? (M.evaluate(r.text) ? `${M.pretty(r.text)} — 아직 참이 아닙니다` : '식으로 읽히지 않습니다')
      : r.loose ? `남는 성냥이 ${r.loose}개 있습니다` : `지금 ${r.count}개 — ${p.target}개를 만들어야 합니다`;
    shell.toast(`${why} · 되돌리기로 다시 해보세요`, 2400);
  }
}

function win(r) {
  game.solved = true;
  const pr = prog();
  pr.streak++;
  pr.skips = 0;
  let up = false;
  if (pr.streak % 3 === 0 && pr.level < 5) { pr.level++; up = true; }
  save();
  const onBoard = [...game.at.values()];
  scene.ignite(onBoard);
  specialFx();
  bigSay('정답!');
  sfx('win', { vol: 0.7 });
  const p = game.p;
  let text = '', other = '';
  if (p.kind === 'equation') {
    text = M.pretty(r.text);
    const rest = p.answers.filter((a) => a !== r.text);
    if (rest.length) other = `다른 답도 있어요: ${rest.map(M.pretty).join(', ')}`;
  } else {
    text = `${p.target}개를 만들었습니다`;
    if (p.answers.length > 1) other = `다른 답도 ${p.answers.length - 1}가지 있어요`;
  }
  if (up) other = `${other ? `${other}<br>` : ''}<b>${pr.level}단계로 올라갑니다</b>`;
  setTimeout(() => {
    $('#m-done-text').textContent = text;
    $('#m-done-other').innerHTML = other;
    $('#m-done').hidden = false;
  }, 1300);
  render();
}

function skip() {
  if (game.carry) return;
  const pr = prog();
  if (!game.solved) {
    pr.streak = 0;
    pr.skips++;
    if (pr.skips >= 2 && pr.level > 1) { pr.level--; pr.skips = 0; shell.toast(`${pr.level}단계로 내려갑니다`, 1600); }
    save();
  }
  newPuzzle();
}

function showHint() {
  if (game.carry || game.solved) return;
  const p = game.p;
  game.hintStep = Math.min(2, game.hintStep + 1);
  const h = M.hint(p, game.hintStep);
  scene.clearGlows();
  scene.markAreas(null);
  if (p.kind === 'equation') {
    if (h.cells) scene.markAreas(h.cells.map((i) => game.cellBoxes[i]));
    if (h.from) {
      const sid = `${h.from[0]}:${h.from[1]}`;
      const stick = game.at.get(sid);
      if (stick !== undefined) scene.setGlow(stick, { color: 0x2fae7f, intensity: 0.9, pulse: true });
      scene.markAreas(M.hint(p, 1).cells.map((i) => game.cellBoxes[i]));
      shell.toast('빛나는 성냥을 옮겨 보세요', 1800);
    } else shell.toast('초록색 칸의 글자가 바뀝니다', 1800);
  } else {
    const around = (e) => { const s = slotById(`e${e}`); return { x: s.x, y: s.y, w: 1.2 * L, h: 1.2 * L }; };
    if (game.hintStep === 1) { scene.markAreas(h.area.map(around)); shell.toast('초록색 근처가 바뀝니다', 1800); }
    else {
      const stick = game.at.get(`e${h.from}`);
      if (stick !== undefined) scene.setGlow(stick, { color: 0x2fae7f, intensity: 0.9, pulse: true });
      scene.markAreas([around(h.to)]);
      shell.toast('빛나는 성냥을 초록색 자리로', 1800);
    }
  }
  render();
}

// ---------- hand: open palm held = undo ----------

function openPalm(lm) {
  const d = (a, b) => Math.hypot(lm[a].x - lm[b].x, lm[a].y - lm[b].y);
  const ext = [[8, 6], [12, 10], [16, 14], [20, 18]].every(([t, j]) => d(t, 0) > d(j, 0) * 1.12);
  return ext && d(4, 5) > 0.5 * (d(0, 9) || 1);
}
function onHandPose(frame) {
  if (game.carry || frame.pinching || !frame.landmarks || shell.introOpen()) { game.palm.since = 0; return; }
  if (!openPalm(frame.landmarks)) { game.palm.since = 0; return; }
  const now = performance.now();
  if (!game.palm.since) game.palm.since = now;
  if (now - game.palm.since >= PALM_MS) { game.palm.since = now + 600; undo(); }
}

// ---------- HUD ----------

function render() {
  const p = game.p;
  if (!p) return;
  $('#t-eq').setAttribute('aria-pressed', String(game.type === 'equation'));
  $('#t-shape').setAttribute('aria-pressed', String(game.type === 'shape'));
  $('#m-level').textContent = `${prog().level}`;
  $('#m-stars').textContent = '★'.repeat(p.stars) + '☆'.repeat(3 - p.stars);
  $('#m-streak').textContent = prog().streak;
  $('#m-id').textContent = `문제 #${p.id}`;
  $('#banner-text').innerHTML = game.solved ? '<b>정답!</b>' : M.promptOf(p).replace(/(\d+개)/, '<b>$1</b>');
  const { removed, added } = M.changes(p, board());
  const used = Math.min(p.moves, p.mode === 'add' ? added : removed);
  $('#m-moves').innerHTML = `<span>${{ move: '옮긴', remove: '뺀', add: '더한' }[p.mode]} 성냥</span>` + Array.from({ length: p.moves }, (_, i) => `<i class="${i < used ? 'used' : ''}"></i>`).join('');
  $('#b-undo').disabled = !game.history.length || game.solved;
  $('#b-reset').disabled = !game.history.length || game.solved;
  $('#b-hint').disabled = game.solved;
}

function updateHover(x, y) {
  if (game.carry || x === null) { if (x === null && !game.carry) { scene.hoverId = null; } return; }
  if (!shell.onStage(x, y) || game.solved) { scene.hoverId = null; return; }
  const id = scene.stickNear(x, y, movable());
  if (id !== scene.hoverId) {
    if (scene.hoverId !== null && game.hintStep < 2) scene.setGlow(scene.hoverId, null);
    scene.hoverId = id;
    if (id !== null) scene.setGlow(id, { color: 0xe0a83a, intensity: 0.35, pulse: false });
  }
}

shell.attach({
  modalOpen: () => shell.introOpen() || !$('#m-done').hidden,
  dragging: () => Boolean(game.carry),
  startDrag, moveDrag, endDrag, cancelDrag, updateHover,
  onHandPose,
  refresh: render,
});

// ---------- buttons ----------

$('#b-undo').addEventListener('click', undo);
$('#b-reset').addEventListener('click', reset);
$('#b-skip').addEventListener('click', skip);
$('#b-hint').addEventListener('click', showHint);
$('#m-next').addEventListener('click', () => newPuzzle());
for (const [id, type] of [['#t-eq', 'equation'], ['#t-shape', 'shape']]) {
  $(id).addEventListener('click', () => { if (game.type === type || game.carry) return; game.type = type; newPuzzle(); });
}
addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); undo(); }
  else if (e.key === 'Enter' && !$('#m-done').hidden) newPuzzle();
});
for (const id of ['#btn-start-cam', '#btn-start-mouse']) $(id).addEventListener('click', () => unlockSound());
const soundBtn = $('#b-sound');
const showSound = () => { soundBtn.textContent = isMuted() ? '소리 꺼짐' : '소리 켜짐'; soundBtn.classList.toggle('off', isMuted()); };
soundBtn.addEventListener('click', () => { unlockSound(); setMuted(!isMuted()); showSound(); });
showSound();

newPuzzle();

// Debug / test handle
window.__match = { game, scene, M, hand: shell.injectHandFrame, newPuzzle, board, undo, skip, showHint, slotById };
