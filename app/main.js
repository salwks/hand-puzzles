// Solitaire chess: game state and rules-facing UI. Camera, hand input and the shared
// chrome (drawer, toasts, intro) live in shell.js.
import { CELLS, captures, allMoves, solve, generate } from './game.js';
import { Scene3D } from './scene.js';
import { createShell } from './shell.js';

const $ = (sel) => document.querySelector(sel);
const SNAP = 0.6; // grab/drop snaps to pieces/targets within this many cells of the line of sight
const SAVE_KEY = 'solitaire-chess-level';

const el = {
  level: $('#level'), left: $('#left'), moves: $('#moves'),
  banner: $('#banner'), bannerText: $('#banner-text'), modalWin: $('#modal-win'),
};

const state = {
  level: loadLevel(),
  pieces: [], // [{id, type, sq}]
  initial: [],
  history: [],
  drag: null, // {id, from, targets}
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

const piecesForLevel = (level) => Math.min(8, 2 + Math.floor(level / 2));
const boardOf = (pieces) => {
  const board = new Array(CELLS).fill(null);
  for (const p of pieces) board[p.sq] = p.type;
  return board;
};
const clonePieces = (pieces) => pieces.map((p) => ({ ...p }));
const pad2 = (n) => String(n).padStart(2, '0');

// ---------- rendering ----------

const scene = new Scene3D($('#stage'));
const shell = createShell({ scene, gameId: 'chess' });
const { log, toast } = shell;
const marks = { origin: null, targets: [], over: null, hover: null, hoverMovable: true, hintFrom: null, hintTo: null };

function render(opts) {
  scene.sync(state.pieces, opts);
  scene.setMarks(marks);
  el.level.textContent = pad2(state.level);
  el.left.textContent = state.pieces.length;
  el.moves.textContent = state.moves;
  $('#btn-undo').disabled = state.history.length === 0;
  $('#btn-reset').disabled = state.history.length === 0;
  updateBanner();
}

// ---------- status banner: says what the colours on the board mean right now ----------

const NAMES = { K: '킹', Q: '퀸', R: '룩', B: '비숍', N: '나이트', P: '폰' };
// Korean particles depend on whether the noun ends in a consonant; only 나이트 ends in a vowel.
const particle = (type, withFinal, without) => NAMES[type] + (type === 'N' ? without : withFinal);

function updateBanner() {
  const typeAt = (sq) => state.pieces.find((p) => p.sq === sq)?.type;
  const handActive = shell.handActive();
  const grabVerb = handActive ? '핀치하면' : '누르면';
  const dropVerb = handActive ? '손가락을 떼세요' : '버튼을 놓으세요';
  let tone = '', html;
  if (state.drag) {
    const held = typeAt(state.drag.from);
    if (!state.drag.targets.length) {
      html = `이 <b>${particle(held, '은', '는')}</b> 지금 잡을 수 있는 말이 없습니다. 내려놓으세요.`;
    } else if (marks.over !== null) {
      tone = 'target';
      html = `<b>${particle(held, '으로', '로')}</b> <em>${particle(typeAt(marks.over), '을', '를')}</em> 잡습니다. ${dropVerb}.`;
    } else {
      tone = 'held';
      html = `<b>${particle(held, '을', '를')}</b> 들고 있습니다. <em>붉은 칸</em> 위에서 ${dropVerb}.`;
    }
  } else if (marks.hover !== null) {
    const type = typeAt(marks.hover);
    tone = marks.hoverMovable ? 'hover' : '';
    html = marks.hoverMovable
      ? `<b>${NAMES[type]}</b> — ${grabVerb} 집습니다.`
      : `이 <b>${particle(type, '은', '는')}</b> 지금 잡을 수 있는 말이 없습니다.`;
  } else if (marks.hintFrom !== null) {
    tone = 'hint';
    html = `힌트: <b>${particle(typeAt(marks.hintFrom), '으로', '로')}</b> 초록 칸의 말을 잡아 보세요.`;
  } else if (state.pieces.length > 1 && allMoves(boardOf(state.pieces)).length === 0) {
    tone = 'target';
    html = '더 잡을 수 있는 말이 없습니다. 되돌리거나 다시 시작하세요.';
  } else if (shell.cameraOn() && !handActive) {
    html = '카메라에 손을 비춰 주세요.';
  } else {
    html = '잡을 수 있는 말을 골라 집으세요.';
  }
  if (html === el.banner.dataset.html) return;
  el.banner.dataset.html = html;
  el.bannerText.innerHTML = html;
  el.banner.querySelector('.gem').className = `gem ${tone}`;
}

function clearHint() {
  marks.hintFrom = marks.hintTo = null;
}

// ---------- game flow ----------

let nextId = 1;
function newPuzzle() {
  const board = generate(piecesForLevel(state.level));
  state.initial = [];
  board.forEach((type, sq) => { if (type) state.initial.push({ id: nextId++, type, sq }); });
  state.undos = state.hints = 0;
  resetPuzzle(true);
}

function resetPuzzle(spawn = false) {
  cancelDrag();
  scene.clear();
  state.pieces = clonePieces(state.initial);
  state.history = [];
  state.moves = 0;
  clearHint();
  render({ spawn });
}

function undo() {
  if (!state.history.length) return;
  cancelDrag();
  state.pieces = state.history.pop();
  state.moves--;
  state.undos++;
  clearHint();
  render();
}

function hint() {
  clearHint();
  const solution = solve(boardOf(state.pieces));
  if (!solution) {
    toast('이 상태에서는 풀 수 없습니다. 되돌리기를 눌러 보세요.');
    scene.setMarks(marks);
    updateBanner();
    return;
  }
  if (!solution.length) return;
  state.hints++;
  [marks.hintFrom, marks.hintTo] = solution[0];
  scene.setMarks(marks);
  updateBanner();
}

function play(from, to) {
  state.history.push(clonePieces(state.pieces));
  state.pieces = state.pieces.filter((p) => p.sq !== to);
  state.pieces.find((p) => p.sq === from).sq = to;
  state.moves++;
  clearHint();
  render({ from });

  if (state.pieces.length === 1) {
    $('#win-level').textContent = `LEVEL ${pad2(state.level)} COMPLETE`;
    $('#win-moves').textContent = state.moves;
    $('#win-undos').textContent = state.undos;
    $('#win-hints').textContent = state.hints;
    saveLevel(state.level + 1); // progress is kept even if the page closes on the clear screen
    setTimeout(() => { el.modalWin.hidden = false; }, 900);
  }
}

// ---------- drag & drop (shared by mouse/touch and hand) ----------

const modalOpen = () => shell.introOpen() || !el.modalWin.hidden;

const { onStage } = shell;

/** Highlights the piece a grab at (x, y) would pick up. Pass null to clear. */
function updateHover(x, y) {
  let hover = null;
  if (x !== null && !state.drag && !modalOpen() && onStage(x, y)) {
    const id = scene.pick(x, y, SNAP);
    if (id !== null) hover = state.pieces.find((p) => p.id === id)?.sq ?? null;
  }
  const movable = hover !== null && captures(boardOf(state.pieces), hover).length > 0;
  if (hover === marks.hover && movable === marks.hoverMovable) return;
  marks.hover = hover;
  marks.hoverMovable = movable;
  scene.setMarks(marks);
  updateBanner();
}

function startDrag(x, y) {
  if (modalOpen() || state.drag || !onStage(x, y)) return false;
  const id = scene.pick(x, y, SNAP);
  if (id === null || !scene.grab(id, x, y)) return false;
  const from = state.pieces.find((p) => p.id === id).sq;
  const targets = captures(boardOf(state.pieces), from);
  state.drag = { id, from, targets };
  log.event('grab', { type: state.pieces.find((p) => p.id === id).type, from, targets, x: Math.round(x), y: Math.round(y) });
  Object.assign(marks, { origin: from, targets, over: null, hover: null });
  moveDrag(x, y);
  return true;
}

function moveDrag(x, y) {
  if (!state.drag) return;
  marks.over = scene.moveHeld(x, y, state.drag.targets, SNAP);
  scene.setMarks(marks);
  updateBanner();
}

function endDrag(x, y) {
  if (!state.drag) return;
  const { from } = state.drag;
  const to = scene.moveHeld(x, y, state.drag.targets, SNAP);
  log.event('drop', { from, to, targets: state.drag.targets, x: Math.round(x), y: Math.round(y), aim: scene.aimDebug(x, y) });
  if (to === null) return cancelDrag();
  state.drag = null;
  scene.release();
  Object.assign(marks, { origin: null, targets: [], over: null });
  play(from, to); // the released piece drops from the air straight onto the target
}

/** Lets go of the held piece; unless a move follows, it settles back onto its square. */
function cancelDrag() {
  if (!state.drag) return;
  state.drag = null;
  scene.release();
  Object.assign(marks, { origin: null, targets: [], over: null });
  render();
}

shell.attach({
  modalOpen,
  dragging: () => Boolean(state.drag),
  startDrag, moveDrag, endDrag, cancelDrag, updateHover,
  refresh: updateBanner,
});

// ---------- wiring ----------

$('#btn-undo').addEventListener('click', undo);
$('#btn-reset').addEventListener('click', () => resetPuzzle());
$('#btn-hint').addEventListener('click', hint);
$('#btn-new').addEventListener('click', newPuzzle);
$('#btn-next').addEventListener('click', () => {
  el.modalWin.hidden = true;
  state.level++;
  newPuzzle();
});
$('#btn-replay').addEventListener('click', () => {
  el.modalWin.hidden = true;
  state.undos = state.hints = 0;
  resetPuzzle(true);
});

newPuzzle();

// Debug/test handle
window.__game = { state, play, scene, solve: () => solve(boardOf(state.pieces)), hand: shell.injectHandFrame };
