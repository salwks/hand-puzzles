// 다섯 칸 (pentomino packing): game state, rules-facing UI and the turn / flip controls.
//
// Turning and flipping a held piece, in order of how physical they feel:
//   hand   — twist the wrist to turn it, turn the hand over to flip it
//   mouse  — wheel turns, right button flips (while dragging or hovering)
//   keys   — Q / E or R turn, F flips
//   dock   — the turn / flip buttons act on the held piece, else on the tapped (selected) one
import { ROWS, NAMES, orient, cellsOf, fits, solve, generate } from './penta-logic.js';
import { PentaScene } from './penta-scene.js';
import { createShell } from './shell.js';

const $ = (sel) => document.querySelector(sel);
const SAVE_KEY = 'penta-level';
const MAX_COLS = 8;
// Turning by wrist is a ratchet: each clear twist of the wrist (past TWIST_STEP) is one quarter
// turn, and the wrist may then return without turning the piece back. Continuous 1:1 turning
// tried first read the ±40° of roll that comes with just carrying a piece as turns.
const TWIST_STEP = toRad(30);
const TWIST_MAX_SPEED = 0.8; // screen-widths/s: a hand sweeping across the frame isn't turning anything
const TAP_MS = 350;
const TAP_PX = 10;

function toRad(deg) { return (deg * Math.PI) / 180; }

const el = {
  level: $('#level'), left: $('#left'), moves: $('#moves'),
  banner: $('#banner'), bannerText: $('#banner-text'), modalWin: $('#modal-win'),
};

const state = {
  level: loadLevel(),
  cols: 3,
  pieces: [], // [{ name, rot, flip, on, gx, gz, x, z, homeX, homeZ }] — (gx, gz) on the board, (x, z) on the table
  history: [],
  drag: null,
  selected: null,
  hint: null, // { name, cells }
  moves: 0,
  undos: 0,
  hints: 0,
};

function loadLevel() {
  try { return Math.max(1, parseInt(localStorage.getItem(SAVE_KEY), 10) || 1); } catch { return 1; }
}
function saveLevel(level) {
  try { localStorage.setItem(SAVE_KEY, String(level)); } catch { /* storage unavailable */ }
}

const colsForLevel = (level) => Math.min(MAX_COLS, 3 + Math.floor((level - 1) / 2));
const pad2 = (n) => String(n).padStart(2, '0');
const mod4 = (n) => ((n % 4) + 4) % 4;
const pieceOf = (name) => state.pieces.find((p) => p.name === name);
const snapshot = () => state.pieces.map((p) => ({ ...p }));

const scene = new PentaScene($('#stage'));
const shell = createShell({ scene, gameId: 'penta' });
const { log, toast, onStage } = shell;

/** Board cells taken by every placed piece except `except`. */
function occupied(except = null) {
  const set = new Set();
  for (const p of state.pieces) {
    if (!p.on || p.name === except) continue;
    for (const [x, z] of cellsOf(p.name, { rot: p.rot, flip: p.flip, x: p.gx, z: p.gz })) set.add(`${x},${z}`);
  }
  return set;
}

/** World pose of a piece as the scene wants it. */
function worldPose(p) {
  if (!p.on) return { rot: p.rot, flip: p.flip, x: p.x, z: p.z };
  const w = scene.gridToWorld(p.gx, p.gz);
  return { rot: p.rot, flip: p.flip, x: w.x, z: w.z };
}

// ---------- rendering ----------

function render() {
  el.level.textContent = pad2(state.level);
  el.left.textContent = state.pieces.filter((p) => !p.on).length;
  el.moves.textContent = state.moves;
  $('#btn-undo').disabled = state.history.length === 0;
  $('#btn-reset').disabled = state.history.length === 0;
  scene.setHighlights({ hover: state.hover ?? null, selected: state.selected });
  scene.setHintCells(state.hint?.cells ?? null);
  updateBanner();
}

function updateBanner() {
  const hand = shell.handActive();
  let tone = '', html;
  const d = state.drag;
  if (d) {
    if (d.target) {
      tone = 'hint';
      html = `여기에 놓을 수 있습니다. ${hand ? '손가락을 떼세요' : '버튼을 놓으세요'}.`;
    } else if (d.overBoard) {
      tone = 'target';
      html = `이 자리에는 맞지 않습니다. ${hand ? '<b>손목을 비틀거나 손을 뒤집어</b>' : '<b>휠로 돌리거나 우클릭으로 뒤집어</b>'} 보세요.`;
    } else {
      tone = 'held';
      html = hand
        ? `<b>${d.name} 조각</b> — 손목을 비틀면 <b>회전</b>, 손을 뒤집으면 <b>뒤집기</b>.`
        : `<b>${d.name} 조각</b> — 휠로 <b>회전</b>, 우클릭으로 <b>뒤집기</b>. (키보드 R · F)`;
    }
  } else if (state.hover) {
    tone = 'hover';
    html = `<b>${state.hover} 조각</b> — ${hand ? '핀치하면' : '누르면'} 집습니다. 살짝 ${hand ? '집었다 놓으면' : '클릭하면'} 선택.`;
  } else if (state.hint) {
    tone = 'hint';
    html = `힌트: <b>${state.hint.name} 조각</b>을 금빛 자리에 맞춰 보세요.`;
  } else if (state.selected) {
    html = `<b>${state.selected} 조각</b> 선택됨 — 아래 버튼으로 돌리거나 뒤집으세요.`;
  } else if (shell.cameraOn() && !hand) {
    html = '카메라에 손을 비춰 주세요.';
  } else {
    html = `조각을 집어 <b>5×${state.cols}</b> 판을 빈칸 없이 채우세요.`;
  }
  if (html === el.banner.dataset.html) return;
  el.banner.dataset.html = html;
  el.bannerText.innerHTML = html;
  el.banner.querySelector('.gem').className = `gem ${tone}`;
}

// ---------- game flow ----------

/** A random orientation whose footprint is at most 3 deep, so it fits a tray row. */
function trayOrientation(name) {
  for (;;) {
    const rot = Math.floor(Math.random() * 4), flip = Math.random() < 0.5;
    const cells = orient(name, rot, flip);
    const xs = cells.map((c) => c[0]), zs = cells.map((c) => c[1]);
    const depth = Math.max(...zs) - Math.min(...zs) + 1;
    if (depth > 3) continue;
    return {
      name, rot, flip,
      width: Math.max(...xs) - Math.min(...xs) + 1, depth,
      centerX: (Math.max(...xs) + Math.min(...xs)) / 2, centerZ: (Math.max(...zs) + Math.min(...zs)) / 2,
    };
  }
}

function newPuzzle() {
  state.cols = colsForLevel(state.level);
  const names = generate(state.cols);
  names.sort(() => Math.random() - 0.5);
  const layout = names.map(trayOrientation);
  const spots = scene.build(state.cols, layout);
  state.pieces = layout.map((p) => ({
    name: p.name, rot: p.rot, flip: p.flip, on: false, gx: 0, gz: 0,
    x: spots[p.name].x, z: spots[p.name].z, homeX: spots[p.name].x, homeZ: spots[p.name].z,
  }));
  state.initial = snapshot();
  Object.assign(state, { history: [], drag: null, selected: null, hover: null, hint: null, moves: 0, undos: 0, hints: 0 });
  scene.setGhost(null);
  render();
}

function restore(pieces, { hop = true } = {}) {
  cancelDrag();
  state.pieces = pieces.map((p) => ({ ...p }));
  for (const p of state.pieces) scene.settle(p.name, worldPose(p), { hop });
  state.hint = null;
  render();
}

function resetPuzzle() {
  if (!state.history.length) return;
  state.history = [];
  state.moves = 0;
  restore(state.initial);
}

function undo() {
  if (!state.history.length) return;
  state.moves = Math.max(0, state.moves - 1);
  state.undos++;
  restore(state.history.pop());
}

/** Commit a change to one piece (after pushing history) and animate it there. */
function commit(name, change, { hop = false } = {}) {
  state.history.push(snapshot());
  Object.assign(pieceOf(name), change);
  state.moves++;
  state.hint = null;
  scene.settle(name, worldPose(pieceOf(name)), { hop });
  render();
  if (state.pieces.every((p) => p.on)) win();
}

function win() {
  $('#win-level').textContent = `LEVEL ${pad2(state.level)} COMPLETE`;
  $('#win-moves').textContent = state.moves;
  $('#win-undos').textContent = state.undos;
  $('#win-hints').textContent = state.hints;
  saveLevel(state.level + 1);
  log.event('win', { level: state.level, moves: state.moves });
  setTimeout(() => { el.modalWin.hidden = false; }, 700);
}

function hint() {
  const placed = state.pieces.filter((p) => p.on).map((p) => ({ name: p.name, pose: { rot: p.rot, flip: p.flip, x: p.gx, z: p.gz } }));
  const free = state.pieces.filter((p) => !p.on).map((p) => p.name);
  if (!free.length) return;
  const solution = solve(state.cols, free, placed);
  if (!solution) {
    state.hint = null;
    toast('지금 놓인 조각들로는 완성할 수 없습니다. 하나를 빼 보세요.', 3400);
    render();
    return;
  }
  state.hints++;
  const step = solution[0];
  state.hint = { name: step.name, cells: cellsOf(step.name, step.pose) };
  state.selected = step.name;
  render();
}

// ---------- turning & flipping ----------

/** Turn (quarter turns, + = counter-clockwise seen from above) or flip the held piece, else the selected one. */
function transform({ turn = 0, flip = false }) {
  const d = state.drag;
  if (d) {
    d.extraRot += turn;
    if (flip) d.extraFlip = !d.extraFlip;
    updateHeldPose();
    refreshGhost();
    return;
  }
  const p = state.selected && pieceOf(state.selected);
  if (!p) {
    toast('먼저 조각을 집거나, 살짝 눌러 선택하세요.', 2200);
    return;
  }
  const next = { rot: mod4(p.rot + turn), flip: flip ? !p.flip : p.flip };
  if (p.on && !fits(p.name, { ...next, x: p.gx, z: p.gz }, state.cols, occupied(p.name))) {
    // No longer fits where it was: lift it off the board, back to its place on the table.
    commit(p.name, { ...next, on: false, x: p.homeX, z: p.homeZ }, { hop: true });
  } else {
    commit(p.name, next, { hop: flip });
  }
}

/** Orientation the held piece shows right now, from its grab-time pose plus wrist twist, wheel, keys and buttons. */
function updateHeldPose() {
  const d = state.drag;
  if (!d) return;
  // The piece leans with the wrist (so the player sees it respond), and clicks over a quarter turn once the twist is clear.
  const lean = Math.max(-TWIST_STEP, Math.min(TWIST_STEP, d.twist)) * 0.5;
  const yaw = (d.rot0 + d.extraRot) * (Math.PI / 2) - lean; // clockwise on screen = negative turn about up
  d.rotSnap = d.rot0 + d.extraRot;
  d.flipSnap = d.flip0 !== d.extraFlip;
  scene.setHeldPose(yaw, d.flipSnap);
}

function onHandPose(frame) {
  const d = state.drag;
  if (!d || !d.byHand || frame.roll === undefined) return;
  const dRoll = frame.roll - d.rollPrev;
  d.rollPrev = frame.roll;
  if ((frame.speed ?? 0) < TWIST_MAX_SPEED) {
    // After a step the wrist comes back: that return (up to one step's worth) must not undo the turn.
    if (d.returnDir && Math.sign(dRoll) === d.returnDir && d.returnBudget > 0) {
      const used = Math.min(d.returnBudget, Math.abs(dRoll));
      d.returnBudget -= used;
      d.twist += dRoll - used * d.returnDir;
    } else d.twist += dRoll;
  } else d.twist *= 0.8; // a sweep cancels a half-formed twist
  if (Math.abs(d.twist) >= TWIST_STEP) {
    const dir = Math.sign(d.twist);
    d.extraRot -= dir; // clockwise wrist = clockwise piece
    d.returnDir = -dir;
    d.returnBudget = TWIST_STEP * 1.1;
    log.event('turn', { name: d.name, rot: mod4(d.rot0 + d.extraRot), twist: Math.round((d.twist * 180) / Math.PI), byHand: true });
    d.twist = 0;
  }
  // Turning the hand over flips the piece once; turning it back re-arms without flipping again.
  if (frame.facing && d.facingStart) {
    if (frame.facing !== d.facingStart && d.flipArmed) {
      d.extraFlip = !d.extraFlip;
      d.flipArmed = false;
      log.event('hand-flip', { name: d.name });
    } else if (frame.facing === d.facingStart) {
      d.flipArmed = true;
    }
  }
  updateHeldPose();
}

// ---------- drag & drop ----------

const modalOpen = () => shell.introOpen() || !el.modalWin.hidden;

function updateHover(x, y) {
  let hover = null;
  if (x !== null && !state.drag && !modalOpen() && onStage(x, y)) hover = scene.pick(x, y);
  if (hover === (state.hover ?? null)) return;
  state.hover = hover;
  render();
}

function startDrag(x, y, frame = null) {
  if (modalOpen() || state.drag || !onStage(x, y)) return false;
  const name = scene.pick(x, y);
  if (!name || !scene.grab(name, x, y)) return false;
  const p = pieceOf(name);
  state.drag = {
    name, from: { ...p }, rot0: p.rot, flip0: p.flip, rotSnap: p.rot, flipSnap: p.flip,
    extraRot: 0, extraFlip: false,
    byHand: Boolean(frame), rollPrev: frame?.roll ?? 0, twist: 0, returnDir: 0, returnBudget: 0,
    facingStart: frame?.facing ?? 0, flipArmed: true,
    downAt: performance.now(), downX: x, downY: y, moved: false,
    target: null, overBoard: false,
  };
  state.hover = null;
  log.event('grab', { name, on: p.on, x: Math.round(x), y: Math.round(y) });
  updateHeldPose();
  moveDrag(x, y);
  return true;
}

/** Recompute where the held piece would land and draw its footprint. */
function refreshGhost() {
  const d = state.drag;
  if (!d) return;
  const rot = mod4(d.rotSnap);
  const pivot = scene.heldPivot(rot, d.flipSnap);
  d.target = null;
  d.overBoard = false;
  d.drop = pivot && { rot, flip: d.flipSnap, x: pivot.x, z: pivot.z };
  if (pivot) {
    const g = scene.worldToGrid(pivot.x, pivot.z);
    const offsets = orient(d.name, rot, d.flipSnap);
    d.grid = [Math.round(g.gx * 100) / 100, Math.round(g.gz * 100) / 100];
    // Candidate cells for the pivot, nearest first; the piece lands wherever its whole footprint
    // fits within reach. Players aim by the piece's body, so an exact pivot cell isn't required.
    const gx0 = Math.round(g.gx), gz0 = Math.round(g.gz);
    const candidates = [];
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) candidates.push([gx0 + dx, gz0 + dz, Math.hypot(gx0 + dx - g.gx, gz0 + dz - g.gz)]);
    candidates.sort((a, b) => a[2] - b[2]);
    const onBoard = (cx, cz) => cx >= 0 && cx < state.cols && cz >= 0 && cz < ROWS;
    const nearest = { rot, flip: d.flipSnap, x: gx0, z: gz0 };
    const inside = offsets.filter(([ox, oz]) => onBoard(ox + gx0, oz + gz0)).length;
    d.inside = inside;
    // The centre of the piece's body, not the pinched point, decides "over the board".
    const cx = g.gx + offsets.reduce((a, o) => a + o[0], 0) / 5, cz = g.gz + offsets.reduce((a, o) => a + o[1], 0) / 5;
    if (cx > -0.8 && cx < state.cols - 0.2 && cz > -0.8 && cz < ROWS - 0.2) {
      d.overBoard = true;
      const taken = occupied(d.name);
      for (const [px, pz, dist] of candidates) {
        if (dist > 0.85) break;
        const pose = { rot, flip: d.flipSnap, x: px, z: pz };
        if (fits(d.name, pose, state.cols, taken)) { d.target = pose; break; }
      }
      const shown = d.target ?? nearest;
      scene.setGhost(cellsOf(d.name, shown).filter(([x, z]) => onBoard(x, z)), Boolean(d.target));
      render();
      return;
    }
  }
  scene.setGhost(null);
  render();
}

function moveDrag(x, y) {
  const d = state.drag;
  if (!d) return;
  if (Math.hypot(x - d.downX, y - d.downY) > TAP_PX) d.moved = true;
  scene.moveHeld(x, y);
  refreshGhost();
}

function endDrag(x, y) {
  const d = state.drag;
  if (!d) return;
  scene.moveHeld(x, y);
  refreshGhost();
  const tapped = !d.moved && performance.now() - d.downAt < TAP_MS && d.extraRot === 0 && !d.extraFlip;
  const { name, from, target, overBoard, drop } = d;
  state.drag = null;
  scene.release();
  scene.setGhost(null);
  log.event('drop', {
    name, tapped, target, overBoard, grid: d.grid, inside: d.inside, rot: mod4(d.rotSnap), flip: d.flipSnap,
    twist: Math.round((d.twist * 180) / Math.PI), cols: state.cols,
    placed: state.pieces.filter((q) => q.on).map((q) => q.name).join(''),
  });

  if (tapped) {
    state.selected = state.selected === name ? null : name;
    scene.settle(name, worldPose(from));
    render();
  } else if (target) {
    state.selected = null;
    commit(name, { rot: target.rot, flip: target.flip, on: true, gx: target.x, gz: target.z });
  } else if (overBoard || !drop) {
    // Doesn't fit there: back to where it came from, in its old orientation.
    scene.settle(name, worldPose(from), { hop: true });
    render();
  } else {
    // Put down on the table, keeping the orientation it was turned to.
    const reachX = scene.extent.width / 2 + 1.5, reachZ = scene.extent.depth / 2 + 1.5;
    const change = {
      rot: drop.rot, flip: drop.flip, on: false,
      x: Math.max(-reachX, Math.min(reachX, drop.x)), z: Math.max(-reachZ, Math.min(reachZ, drop.z)),
    };
    const same = !from.on && from.rot === change.rot && from.flip === change.flip;
    if (same) { // just slid along the table: not a move worth undoing
      Object.assign(pieceOf(name), change);
      scene.settle(name, worldPose(pieceOf(name)));
      render();
    } else {
      commit(name, change);
    }
  }
}

function cancelDrag() {
  const d = state.drag;
  if (!d) return;
  state.drag = null;
  scene.release();
  scene.setGhost(null);
  scene.settle(d.name, worldPose(d.from), { hop: true });
  render();
}

shell.attach({
  modalOpen,
  dragging: () => Boolean(state.drag),
  startDrag, moveDrag, endDrag, cancelDrag, updateHover, onHandPose,
  refresh: updateBanner,
});

// ---------- mouse & keyboard extras ----------

const stage = $('#stage');
stage.addEventListener('wheel', (e) => {
  if (!state.drag && !state.hover) return;
  e.preventDefault();
  if (!state.drag) state.selected = state.hover;
  transform({ turn: e.deltaY > 0 ? -1 : 1 });
}, { passive: false });
stage.addEventListener('contextmenu', (e) => e.preventDefault());
stage.addEventListener('pointerdown', (e) => {
  if (e.button !== 2) return;
  if (!state.drag && state.hover) state.selected = state.hover;
  transform({ flip: true });
});
window.addEventListener('keydown', (e) => {
  if (modalOpen() || e.metaKey || e.ctrlKey) return;
  const key = e.key.toLowerCase();
  if (!state.drag && state.hover) state.selected = state.hover;
  if (key === 'r' || key === 'e') transform({ turn: e.shiftKey ? 1 : -1 });
  else if (key === 'q') transform({ turn: 1 });
  else if (key === 'f') transform({ flip: true });
  else if (key === 'z') undo();
});

// ---------- wiring ----------

$('#btn-undo').addEventListener('click', undo);
$('#btn-reset').addEventListener('click', resetPuzzle);
$('#btn-hint').addEventListener('click', hint);
$('#btn-new').addEventListener('click', newPuzzle);
$('#btn-turn-left').addEventListener('click', () => transform({ turn: 1 }));
$('#btn-turn-right').addEventListener('click', () => transform({ turn: -1 }));
$('#btn-flip').addEventListener('click', () => transform({ flip: true }));
$('#btn-next').addEventListener('click', () => {
  el.modalWin.hidden = true;
  state.level++;
  newPuzzle();
});
$('#btn-replay').addEventListener('click', () => {
  el.modalWin.hidden = true;
  state.history = [];
  state.moves = state.undos = state.hints = 0;
  restore(state.initial);
});

newPuzzle();

// Debug/test handle
window.__penta = { state, scene, NAMES, solve, cellsOf, hand: shell.injectHandFrame, transform, newPuzzle };

// ---------- ?demo: a staged scene for screenshots (no camera needed) ----------
if (new URLSearchParams(location.search).has('demo')) {
  const LM = [[0.5,0.80,0],[0.56,0.74,-0.02],[0.60,0.66,-0.04],[0.60,0.58,-0.06],[0.57,0.52,-0.08],[0.54,0.58,-0.02],[0.55,0.49,-0.05],[0.555,0.47,-0.08],[0.56,0.505,-0.1],[0.50,0.57,-0.02],[0.50,0.47,-0.03],[0.50,0.41,-0.04],[0.50,0.36,-0.05],[0.46,0.58,-0.02],[0.455,0.49,-0.03],[0.45,0.43,-0.04],[0.45,0.39,-0.05],[0.425,0.61,-0.02],[0.415,0.54,-0.03],[0.41,0.49,-0.04],[0.405,0.45,-0.05]].map(([x, y, z]) => ({ x, y, z }));
  const hf = (p, pinching) => shell.injectHandFrame({ present: true, x: p.x / innerWidth, y: p.y / innerHeight, pinching,
    landmarks: LM, pinchRatio: pinching ? 0.15 : 0.6, pinchDown: 0.3, pinchUp: 0.44, handedness: 'Left', roll: 0, facing: 1, speed: 0.1 });
  $('#btn-start-mouse').click();
  state.level = 9;
  newPuzzle();
  const wait = (ms = 200) => new Promise((r) => setTimeout(r, ms));
  (async () => {
    for (let i = 0; i < 12 && !scene.hand.rigged.ready('right'); i++) await wait();
    await wait(1500);
    const sol = solve(state.cols, state.pieces.map((p) => p.name));
    const put = async (step, release) => {
      state.selected = step.name;
      for (let g = 0; g < 4 && pieceOf(step.name).rot !== step.pose.rot; g++) { transform({ turn: 1 }); await wait(); }
      if (pieceOf(step.name).flip !== step.pose.flip) { transform({ flip: true }); await wait(400); }
      await wait(400);
      const cur = pieceOf(step.name);
      const from = scene.toScreen(cur.x, 0.21, cur.z), to = scene.cellToScreen(step.pose.x, step.pose.z, 0.21);
      for (let i = 0; i < 20 && !state.drag; i++) { hf(from, false); hf(from, true); await wait(); if (!state.drag) hf(from, false); }
      await wait(300);
      hf(to, true);
      await wait(400);
      hf(to, true);
      if (release) { hf(to, false); await wait(600); }
    };
    for (let i = 0; i < 4; i++) await put(sol[i], i < 3);
  })();
}
