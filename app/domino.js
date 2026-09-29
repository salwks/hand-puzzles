// 도미노 미로: the game page. A puzzle from domino-logic.js goes on the 3D board (domino-scene.js).
// The player's dominoes are picked up by pinch or mouse and set on a free square (or back in the
// tray); a quick tap, the wrist while holding (its angle since the pinch, snapped to 45° steps),
// or the mouse wheel turns a piece. A tap on the start domino — or the 밀기 button — pushes it,
// and the chain plays with the engine's timing; if it fails, the spot where it stopped is marked
// and everything stands back up.
import * as D from './domino-logic.js';
import { DominoScene, NAMES } from './domino-scene.js';
import { createShell } from './shell.js';
import { sfx, unlockSound, isMuted, setMuted } from './sound.js';
import { createFx } from './fx.js';

const $ = (sel) => document.querySelector(sel);
const SAVE_KEY = 'domino-progress';
// Wrist turning snaps to 45° steps. The wrist's angle since the pinch sets the domino's direction
// (30° of wrist per 45° step, as far as a wrist comfortably turns); a boundary must be passed by a
// margin before it flips, and the direction freezes while the fingers open to let go. A session
// log with the old ratchet (a step per 26° of twist, a smooth lean in between) had players twist
// ~65–90° for a quarter turn, relax while still holding, and the piece stepping back and forth.
const TWIST_STEP = (30 * Math.PI) / 180;
const TWIST_MARGIN = 0.2;       // of a step: hysteresis at each boundary
const TWIST_MAX_SPEED = 0.8;    // screen-widths/s: a sweeping hand blurs the roll, so it's ignored
const TAP_MS = 450;          // a click this short, that barely moved, is a tap
const TAP_HAND_MS = 1200;    // a pinch this short that ends where it started is a tap too
const TAP_HAND_REACH = 0.9;  // …if the hand stayed within about a square
const TAP_MOVE = 0.3;        // beyond this (squares) a press becomes a carry
const UNLOCK = 3;
const ROMAN = ['', 'I', 'II', 'III'];
const WHY = {
  edge: '사슬이 <b>판 끝</b>에서 멈췄습니다',
  empty: '사슬이 <b>빈칸</b>에서 끊겼습니다',
  held: '도미노가 <b>옆이나 앞에서</b> 맞아 버텼습니다',
  block: '사슬이 <b>막이</b>에 막혔습니다',
  fallen: '이미 쓰러진 조각에 부딪혀 멈췄습니다',
};

const scene = new DominoScene($('#stage'));
const shell = createShell({ scene, gameId: 'domino' });
const { log, toast, onStage } = shell;
const { bigSay, specialFx } = createFx(scene);

const prog = { level: 1, unlocked: 1, next: {}, solved: {}, best: {} };
try { Object.assign(prog, JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')); } catch { /* keep defaults */ }
const save = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(prog)); } catch { /* storage blocked */ } };

// push: null | 'playing' | 'down' (a failed chain lying there until the player touches something)
const game = { g: null, drag: null, solved: false, hints: 0, pushes: 0, auto: null, push: null, fail: null };

// ---------- puzzles ----------

function load(level = prog.level, n = prog.next[level] ?? 0) {
  stopAuto();
  prog.level = level;
  const p = D.puzzle(level, n);
  game.g = D.newGame(p);
  Object.assign(game, { solved: false, drag: null, hints: 0, pushes: 0, push: null, fail: null });
  scene.setGame(game.g);
  $('#d-done').hidden = true;
  save();
  log.event('puzzle', { id: p.id, dominoes: p.dominoes, fixed: p.fixed });
  render();
}
function next() {
  prog.next[prog.level] = (prog.next[prog.level] ?? 0) + 1;
  load();
}

const mine = () => game.g.tokens.map((_, i) => i).filter((i) => !game.g.tokens[i].fixed);
const handy = () => game.g.tokens.map((_, i) => i).filter((i) => { const t = game.g.tokens[i]; return !t.fixed || t.turnable || t.type === 'start'; });
const isFree = (i) => (r, c) => { const j = D.tokenAt(game.g, r, c); return j < 0 || j === i; };

/** A failed chain lies there until the player does something; then it all stands up again. */
function standUp() {
  if (game.push !== 'down') return;
  game.push = null;
  game.fail = null;
  scene.stand(game.g);
  render();
}

// ---------- the push ----------

function push() {
  if (game.drag || game.solved || game.auto || game.push === 'playing') return;
  standUp();
  const st = D.status(game.g);
  if (st.unplaced) {
    toast(`트레이의 도미노 ${st.unplaced}개를 먼저 판에 세우세요`, 2600);
    bigSay(`도미노 ${st.unplaced}개 남음`);
    for (const i of mine()) if (game.g.tokens[i].r === null) scene.setGlow(i, { color: 0xe0a83a, intensity: 0.6, pulse: true });
    setTimeout(() => { for (const i of mine()) if (scene.pieces[i]?.glow.color === 0xe0a83a) scene.setGlow(i, null); }, 2400);
    return;
  }
  game.push = 'playing';
  game.pushes++;
  scene.clearHint();
  sfx('slap', { vol: 0.3, rate: 1.2 });
  const rr = st.run;
  // a click per fall, timed with the animation
  rr.falls.forEach((f, k) => { if (k) setTimeout(() => sfx('clack', { vol: 0.2 + Math.random() * 0.1, rate: 1.2 + Math.random() * 0.3 }), f.t * 85 + 120); });
  log.event('push', { solved: st.solved, order: st.order, end: rr.end, standing: rr.standing.length });
  render();
  scene.playPush(game.g, rr, () => {
    if (st.solved) { game.push = null; win(); return; }
    game.push = 'down';
    game.fail = st;
    scene.showStop(true);
    sfx('knock', { vol: 0.25, rate: 0.8 });
    render();
  });
}

// ---------- dragging ----------

function startDrag(x, y, frame = null) {
  if (shell.introOpen() || !$('#d-done').hidden) return false;
  scene.pointer = { x, y };
  if (game.solved || game.auto || game.push === 'playing') return true;
  if (!onStage(x, y)) return false;
  standUp();
  const i = scene.pieceAt(x, y, handy());
  if (i === null) {
    const f = scene.pieceAt(x, y, game.g.tokens.map((_, k) => k).filter((k) => game.g.tokens[k].fixed));
    if (f !== null) toast(`${NAMES[game.g.tokens[f].type]}은(는) 문제에 고정된 조각입니다`, 1500);
    log.event('grab-empty', { x: Math.round(x), y: Math.round(y), fixed: f });
    return false;
  }
  const t = game.g.tokens[i];
  game.drag = {
    i, at: scene.planeAt(x, y), downT: performance.now(), moved: false, lifted: false, cell: null, far: 0,
    byHand: Boolean(frame), roll0: frame?.roll ?? null, o0: t.o, steps: 0, turned: 0,
  };
  scene.clearHint();
  scene.setGlow(i, { color: 0x3f7fe6, intensity: 0.25, pulse: false });
  log.event('grab', { piece: i, type: t.type, fixed: t.fixed, r: t.r, c: t.c, x: Math.round(x), y: Math.round(y) });
  return true;
}

function moveDrag(x, y) {
  const d = game.drag;
  if (!d) return;
  scene.pointer = { x, y };
  const t = game.g.tokens[d.i];
  const p = scene.planeAt(x, y);
  if (p && d.at) {
    const far = Math.hypot(p.x - d.at.x, p.z - d.at.z);
    d.far = Math.max(d.far, far);
    if (far > TAP_MOVE) d.moved = true;
  }
  if (d.moved && !t.fixed && !d.lifted) {
    d.lifted = true;
    scene.hold(d.i);
    sfx('lift', { vol: 0.3, rate: 1.2 });
  }
  if (d.lifted) d.cell = scene.carry(x, y, isFree(d.i));
}

function endDrag(x, y) {
  const d = game.drag;
  if (!d) return;
  moveDrag(x, y);
  game.drag = null;
  const g = game.g, t = g.tokens[d.i];
  scene.setGlow(d.i, null);
  const held = performance.now() - d.downT;
  const home = t.r === null ? 'tray' : { r: t.r, c: t.c };
  const lands = (d.lifted ? d.cell : null) ?? home;
  const stays = JSON.stringify(lands) === JSON.stringify(home);
  // a quick pinch that ends where it started is a tap, however much the hand shook
  const tap = !d.turned && (d.byHand ? stays && held < TAP_HAND_MS && d.far < TAP_HAND_REACH : !d.moved && held < TAP_MS);
  if (d.lifted) scene.release();
  // the start domino can't move: letting go of it — a tap, a long pinch or a push-like drag —
  // pushes it (unless its direction is open, when a tap turns it)
  if (t.type === 'start' && (!t.turnable || (d.moved && !d.turned))) { scene.sync(g); push(); return; }
  if (tap) {
    if (D.turn(g, d.i, 1)) { scene.showTurn(d.i, t); sfx('clack', { vol: 0.3, rate: 1.3 }); log.event('turn', { piece: d.i, o: t.o, by: 'tap', ms: Math.round(held) }); }
    else toast('이 조각은 돌릴 수 없습니다', 1400);
  } else if (d.lifted) {
    let ok = false;
    if (lands === 'tray') ok = t.r !== null && D.lift(g, d.i);
    else if (!stays) ok = D.place(g, d.i, lands.r, lands.c);
    log.event('drop', { piece: d.i, cell: d.cell, placed: ok, o: t.o, x: Math.round(x), y: Math.round(y) });
    sfx(lands !== 'tray' ? 'knock' : 'slide', { vol: 0.3, rate: 1.3 });
  }
  scene.sync(g);
  render();
}

function cancelDrag() {
  const d = game.drag;
  if (!d) return;
  log.event('drag-cancel', { piece: d.i });
  game.drag = null;
  scene.release();
  scene.setGlow(d.i, null);
  scene.sync(game.g);
  render();
}

function turnBy(i, by, how) {
  const g = game.g;
  if (i === null || i === undefined || game.solved || game.auto || game.push === 'playing') return false;
  standUp();
  if (!D.turn(g, i, by)) return false;
  scene.showTurn(i, g.tokens[i]);
  sfx('clack', { vol: 0.25, rate: 1.4 });
  log.event('turn', { piece: i, o: g.tokens[i].o, by: how });
  if (game.drag?.i === i) game.drag.turned++;
  render();
  return true;
}

// wrist twist while holding: the direction follows the wrist, in 45° steps
function onHandPose(frame) {
  const d = game.drag;
  if (!d || !d.byHand || frame.roll === undefined || frame.roll === null) return;
  const t = game.g.tokens[d.i];
  if (!t.turnable || t.type === 'pivot') return;
  if (d.roll0 === null) d.roll0 = frame.roll;
  if ((frame.speed ?? 0) > TWIST_MAX_SPEED) return;
  // letting go: the fingers open and the wrist often turns with them — keep what was set
  if (frame.pinchRatio !== undefined && frame.pinchRatio > frame.pinchDown * 1.15) return;
  const x = (frame.roll - d.roll0) / TWIST_STEP;
  let k = d.steps;
  while (x > k + 0.5 + TWIST_MARGIN) k++;
  while (x < k - 0.5 - TWIST_MARGIN) k--;
  if (k === d.steps) return;
  const by = k - d.steps;
  d.steps = k;
  turnBy(d.i, by, 'wrist'); // clockwise wrist = clockwise domino
}

// ---------- solving ----------

function win(watched = false) {
  game.solved = true;
  const p = game.g.p, L0 = prog.level;
  if (!watched) {
    prog.solved[L0] = (prog.solved[L0] ?? 0) + 1;
    prog.best[p.id] = 1;
  }
  let opened = false;
  if (!watched && (prog.solved[L0] ?? 0) >= UNLOCK && L0 === prog.unlocked && L0 < D.LEVELS.length) { prog.unlocked = L0 + 1; opened = true; }
  prog.next[L0] = (prog.next[L0] ?? 0) + 1;
  save();
  log.event('win', { id: p.id, moves: game.g.moves, pushes: game.pushes, hints: game.hints, watched });
  scene.celebrate();
  sfx('win2', { vol: 0.5 });
  if (!watched) { specialFx(); bigSay('와르르!'); }
  $('#d-done-title').textContent = watched ? '풀이' : '성공';
  $('#d-done-text').textContent = watched ? '직접 풀어야 기록이 쌓입니다' : `${game.pushes}번 밀어 풀었습니다${game.hints ? ` · 힌트 ${game.hints}번` : ''}`;
  const left = UNLOCK - (prog.solved[L0] ?? 0);
  $('#d-done-note').innerHTML = opened ? `<b>${D.LEVELS[L0].name} 단계가 열렸습니다</b>`
    : L0 === prog.unlocked && L0 < D.LEVELS.length && left > 0 ? `${left}문제 더 풀면 다음 단계가 열립니다` : '';
  setTimeout(() => { $('#d-done').hidden = false; }, 900);
  render();
}

// ---------- buttons ----------

function restart() {
  if (game.drag || game.solved || game.auto || game.push === 'playing') return;
  game.g = D.newGame(game.g.p);
  game.push = null;
  scene.stand(game.g);
  scene.clearHint();
  scene.sync(game.g);
  game.g.tokens.forEach((t, i) => scene.showTurn(i, t));
  render();
}

function hint() {
  if (game.drag || game.solved || game.auto || game.push === 'playing') return;
  standUp();
  const h = D.hint(game.g);
  if (!h) { toast('모두 맞게 놓였습니다 — 밀어 보세요', 1800); return; }
  game.hints++;
  scene.showHint(game.g, h);
  const t = game.g.tokens[h.i];
  toast(t.fixed ? `초록색으로 표시한 방향으로 ${NAMES[t.type]}을(를) 돌리세요` : '도미노를 초록색 자리에 그 방향으로 세우세요', 2600);
  log.event('hint', h);
  render();
}

const AUTO_STEP = 600;
function showSolution() {
  if (game.drag || game.solved || game.auto || game.push === 'playing') return;
  standUp();
  scene.clearHint();
  game.auto = { timer: 0 };
  render();
  const step = () => {
    if (!game.auto) return;
    const h = D.hint(game.g);
    if (!h) {
      game.auto = null;
      const st = D.status(game.g);
      game.push = 'playing';
      scene.playPush(game.g, st.run, () => { game.push = null; win(true); });
      render();
      return;
    }
    const t = game.g.tokens[h.i];
    if (!t.fixed) {
      const j = D.tokenAt(game.g, h.r, h.c);
      if (j >= 0 && j !== h.i) D.lift(game.g, j);
      D.place(game.g, h.i, h.r, h.c);
    }
    t.o = h.o;
    scene.showTurn(h.i, t);
    scene.sync(game.g, false, 0.4);
    sfx('knock', { vol: 0.25, rate: 1.2 });
    render();
    game.auto.timer = setTimeout(step, AUTO_STEP);
  };
  game.auto.timer = setTimeout(step, 300);
}
function stopAuto() {
  if (!game.auto) return;
  clearTimeout(game.auto.timer);
  game.auto = null;
}

// ---------- HUD ----------

function render() {
  const g = game.g;
  if (!g) return;
  const st = D.status(g);
  $('#d-levels').innerHTML = D.LEVELS.map((lv, i) => `<button class="btn small tab" data-level="${i + 1}" aria-pressed="${prog.level === i + 1}" ${i + 1 > prog.unlocked ? `disabled title="앞 단계에서 ${UNLOCK}문제를 풀면 열립니다"` : ''}>${lv.name}</button>`).join('');
  $('#d-order').textContent = ROMAN.slice(1, st.targets + 1).join(' → ');
  const placed = mine().filter((i) => g.tokens[i].r !== null).length;
  $('#d-placed').textContent = placed;
  $('#d-mine').textContent = ` / ${mine().length}`;
  $('#d-id').textContent = `${D.LEVELS[g.p.level - 1].name} · 문제 ${g.p.n + 1}${prog.best[g.p.id] ? ' · 풀었음' : ''}`;
  let msg;
  if (game.auto) msg = '<b>풀이 보기</b>';
  else if (game.solved) msg = '<b>와르르!</b> 모두 쓰러졌습니다';
  else if (game.push === 'playing') msg = '밀었습니다…';
  else if (game.push === 'down' && game.fail) {
    const f = game.fail;
    msg = f.wrongOrder ? `목표물을 <b>${ROMAN.slice(1, f.targets + 1).join('→')}</b> 순서로 쓰러뜨려야 합니다`
      : f.order.length < f.targets ? `${WHY[f.run.end?.why] ?? '사슬이 멈췄습니다'} — 목표물 ${f.order.length}/${f.targets}`
      : f.standing.length ? `목표물은 다 쓰러졌지만 <b>안 쓰러진 조각</b>이 ${f.standing.length}개 있습니다`
      : '사슬이 멈췄습니다';
  } else if (st.unplaced) msg = `트레이의 도미노 <b>${st.unplaced}개</b>를 세운 뒤, 빨간 시작 도미노를 살짝 집어 미세요`;
  else msg = '준비됐으면 <b>빨간 시작 도미노</b>를 살짝 집거나 <b>밀기</b>를 누르세요';
  $('#banner-text').innerHTML = msg;
  const busy = game.solved || Boolean(game.auto) || game.push === 'playing';
  for (const id of ['#b-hint', '#b-solve', '#b-push']) $(id).disabled = busy;
  $('#b-reset').disabled = busy || !g.moves;
}
$('#d-levels').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-level]');
  if (!b || b.disabled || game.drag) return;
  load(Number(b.dataset.level));
});

function updateHover(x, y) {
  if (game.drag || !game.g || game.solved || game.auto || game.push === 'playing') return;
  const i = x === null || !onStage(x, y) ? null : scene.pieceAt(x, y, handy());
  if (i === scene.hoverI) return;
  if (scene.hoverI !== null && scene.pieces[scene.hoverI]?.glow.color !== 0x2fae7f) scene.setGlow(scene.hoverI, null);
  scene.hoverI = i;
  if (i !== null && scene.pieces[i].glow.color !== 0x2fae7f) scene.setGlow(i, { color: 0xe0a83a, intensity: 0.3, pulse: false });
}

shell.attach({
  modalOpen: () => shell.introOpen() || !$('#d-done').hidden,
  dragging: () => Boolean(game.drag),
  startDrag, moveDrag, endDrag, cancelDrag, updateHover, onHandPose,
  refresh: render,
});

$('#stage').addEventListener('wheel', (e) => {
  e.preventDefault();
  turnBy(game.drag?.i ?? scene.hoverI, e.deltaY > 0 ? 1 : -1, 'wheel');
}, { passive: false });
$('#b-push').addEventListener('click', push);
$('#b-hint').addEventListener('click', hint);
$('#b-solve').addEventListener('click', showSolution);
$('#b-reset').addEventListener('click', restart);
$('#b-next').addEventListener('click', () => { if (!game.drag) next(); });
$('#d-next').addEventListener('click', () => load());
addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !$('#d-done').hidden) load();
  else if (e.key === ' ' && $('#d-done').hidden && !shell.introOpen()) { e.preventDefault(); push(); }
  else if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey) turnBy(game.drag?.i ?? scene.hoverI, e.shiftKey ? -1 : 1, 'key');
});
for (const id of ['#btn-start-cam', '#btn-start-mouse']) $(id).addEventListener('click', () => unlockSound());
const soundBtn = $('#b-sound');
const showSound = () => { soundBtn.textContent = isMuted() ? '소리 꺼짐' : '소리 켜짐'; soundBtn.classList.toggle('off', isMuted()); };
soundBtn.addEventListener('click', () => { unlockSound(); setMuted(!isMuted()); showSound(); });
showSound();

load();

window.__domino = { game, scene, D, prog, hand: shell.injectHandFrame, load, next, hint, showSolution, restart, push };
