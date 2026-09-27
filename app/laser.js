// 레이저 미로: the game page. A puzzle from laser-logic.js goes on the 3D board (laser-scene.js).
// The player's tokens are picked up by pinch or mouse and put on a free square (or back in the
// tray); a quick tap, a wrist twist while holding (a ratchet: each clear twist is one quarter
// turn, as in 펜토미노), or the mouse wheel turns a token. The beam is traced live, including
// through the token being carried over the square it would land on.
import * as L from './laser-logic.js';
import { LaserScene, NAMES } from './laser-scene.js';
import { createShell } from './shell.js';
import { sfx, unlockSound, isMuted, setMuted } from './sound.js';
import { createFx } from './fx.js';

const $ = (sel) => document.querySelector(sel);
const SAVE_KEY = 'laser-progress';
const TWIST_STEP = (30 * Math.PI) / 180;
const TWIST_MAX_SPEED = 0.8;
const TAP_MS = 450;          // a click this short, that barely moved, is a tap: turn
const TAP_HAND_MS = 1200;    // a pinch this short that puts the token back where it was is a tap too
const TAP_HAND_REACH = 0.9; // …and the hand stayed within about a square of where it pinched
const TAP_MOVE = 0.3;        // …and moved less than this many squares
const UNLOCK = 3;            // puzzles solved in a level (without 풀이 보기) to open the next

const scene = new LaserScene($('#stage'));
const shell = createShell({ scene, gameId: 'laser' });
const { log, toast, onStage } = shell;
const { bigSay, specialFx } = createFx(scene);

const prog = { level: 1, unlocked: 1, next: {}, solved: {}, best: {} };
try { Object.assign(prog, JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')); } catch { /* keep defaults */ }
const save = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(prog)); } catch { /* storage blocked */ } };

const game = { g: null, drag: null, solved: false, hints: 0, auto: null };

// ---------- puzzles ----------

function load(level = prog.level, n = prog.next[level] ?? 0) {
  stopAuto();
  prog.level = level;
  const p = L.puzzle(level, n);
  game.g = L.newGame(p);
  game.solved = false;
  game.drag = null;
  game.hints = 0;
  scene.setGame(game.g);
  $('#l-done').hidden = true;
  save();
  log.event('puzzle', { id: p.id, targets: p.targets, fixed: p.fixed, add: p.add });
  refreshBeam();
  render();
}

function next() {
  prog.next[prog.level] = (prog.next[prog.level] ?? 0) + 1;
  load();
}

const mine = () => game.g.tokens.map((_, i) => i).filter((i) => !game.g.tokens[i].fixed);
const handy = () => game.g.tokens.map((_, i) => i).filter((i) => !game.g.tokens[i].fixed || game.g.tokens[i].turnable);
const isFree = (i) => (r, c) => { const j = L.tokenAt(game.g, r, c); return j < 0 || j === i; };

/** Trace the beam as things stand — with a carried token counted on the square it hovers over. */
function refreshBeam() {
  const g = game.g, d = game.drag;
  let tokens = g.tokens;
  if (d?.lifted) {
    tokens = g.tokens.map((t, i) => (i !== d.i ? t : d.cell && d.cell !== 'tray' ? { ...t, r: d.cell.r, c: d.cell.c } : { ...t, r: null, c: null }));
  }
  const st = L.judge(g.p, tokens);
  scene.setBeam(st.trace, st.trace.lit);
  return st;
}

// ---------- dragging ----------

function startDrag(x, y, frame = null) {
  if (shell.introOpen() || !$('#l-done').hidden) return false;
  scene.pointer = { x, y };
  if (game.solved || game.auto) return true;
  if (!onStage(x, y)) return false;
  const i = scene.tokenAt(x, y, handy());
  if (i === null) {
    // a fixed token: say so rather than doing nothing
    const f = scene.tokenAt(x, y, game.g.tokens.map((_, k) => k).filter((k) => game.g.tokens[k].fixed));
    if (f !== null && game.g.tokens[f].type !== 'laser') toast(`${NAMES[game.g.tokens[f].type]}은(는) 문제에 고정된 조각입니다`, 1600);
    log.event('grab-empty', { x: Math.round(x), y: Math.round(y), fixed: f });
    return false;
  }
  const t = game.g.tokens[i];
  const at = scene.planeAt(x, y);
  game.drag = {
    i, from: { r: t.r, c: t.c, o: t.o }, at, downT: performance.now(), moved: false, lifted: false, cell: null,
    byHand: Boolean(frame), rollPrev: frame?.roll ?? 0, twist: 0, turned: 0, returnDir: 0, returnBudget: 0,
  };
  scene.clearHint();
  scene.setGlow(i, { color: 0x3f7fe6, intensity: 0.25, pulse: false });
  log.event('grab', { token: i, type: t.type, fixed: t.fixed, r: t.r, c: t.c, x: Math.round(x), y: Math.round(y) });
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
    d.far = Math.max(d.far ?? 0, far);
    if (far > TAP_MOVE) d.moved = true;
  }
  if (d.moved && !t.fixed && !d.lifted) {
    d.lifted = true;
    scene.hold(d.i);
    sfx('lift', { vol: 0.3, rate: 1.2 });
  }
  if (d.lifted) {
    const cell = scene.carry(x, y, isFree(d.i));
    if (JSON.stringify(cell) !== JSON.stringify(d.cell)) { d.cell = cell; refreshBeam(); }
  }
}

function endDrag(x, y) {
  const d = game.drag;
  if (!d) return;
  moveDrag(x, y);
  game.drag = null;
  const g = game.g, t = g.tokens[d.i];
  scene.setGlow(d.i, null);
  const held = performance.now() - d.downT;
  // Where it would land: a free square, the tray, or (over a taken square / nowhere) back where it was.
  const cell = d.lifted ? d.cell : null;
  const home = t.r === null ? 'tray' : { r: t.r, c: t.c };
  const lands = cell ?? home;
  const stays = JSON.stringify(lands) === JSON.stringify(home);
  // A tap turns the token. A hand wobbles 30–60 px during a short pinch (a session log had three
  // meant-as-taps lifted and put straight back), so a quick pinch that ends where it started counts
  // as a tap however much it shook.
  const tap = !d.turned && (d.byHand ? stays && held < TAP_HAND_MS && (d.far ?? 0) < TAP_HAND_REACH : !d.moved && held < TAP_MS);
  if (d.lifted) scene.release();
  if (tap) {
    if (L.turn(g, d.i, 1)) { scene.showTurn(d.i, t.o); sfx('clack', { vol: 0.3, rate: 1.3 }); log.event('turn', { token: d.i, o: t.o, by: 'tap', ms: Math.round(held) }); }
    else toast('이 조각은 돌릴 수 없습니다', 1400);
  } else if (d.lifted) {
    let ok = false;
    if (lands === 'tray') ok = t.r !== null && L.lift(g, d.i);
    else if (!stays) ok = L.place(g, d.i, lands.r, lands.c);
    log.event('drop', { token: d.i, type: t.type, cell, placed: ok, o: t.o, x: Math.round(x), y: Math.round(y) });
    sfx(lands !== 'tray' ? 'knock' : 'slide', { vol: 0.3, rate: 1.3 });
  }
  scene.sync(g);
  after();
}

function cancelDrag() {
  const d = game.drag;
  if (!d) return;
  log.event('drag-cancel', { token: d.i });
  game.drag = null;
  scene.release();
  scene.setGlow(d.i, null);
  scene.sync(game.g);
  after();
}

/** Turn the token being held or hovered (mouse wheel, keys, wrist). */
function turnBy(i, by, how) {
  const g = game.g;
  if (i === null || i === undefined || game.solved || game.auto) return false;
  if (!L.turn(g, i, by)) return false;
  scene.showTurn(i, g.tokens[i].o);
  sfx('clack', { vol: 0.25, rate: 1.4 });
  log.event('turn', { token: i, o: g.tokens[i].o, by: how });
  if (game.drag?.i === i) game.drag.turned++;
  after();
  return true;
}

// wrist twist while holding: a ratchet, as in 펜토미노
function onHandPose(frame) {
  const d = game.drag;
  if (!d || !d.byHand || frame.roll === undefined || frame.roll === null) return;
  const dRoll = frame.roll - d.rollPrev;
  d.rollPrev = frame.roll;
  if ((frame.speed ?? 0) < TWIST_MAX_SPEED) {
    // after a step the wrist comes back: that return (up to one step's worth) must not undo the turn
    if (d.returnDir && Math.sign(dRoll) === d.returnDir && d.returnBudget > 0) {
      const used = Math.min(d.returnBudget, Math.abs(dRoll));
      d.returnBudget -= used;
      d.twist += dRoll - used * d.returnDir;
    } else d.twist += dRoll;
  } else d.twist *= 0.8;
  if (Math.abs(d.twist) >= TWIST_STEP) {
    const dir = Math.sign(d.twist);
    turnBy(d.i, dir, 'wrist'); // clockwise wrist = clockwise token
    d.returnDir = -dir;
    d.returnBudget = TWIST_STEP * 1.1;
    d.twist = 0;
  }
  const t = game.g.tokens[d.i];
  if (t.turnable) scene.showTurn(d.i, t.o, Math.max(-TWIST_STEP, Math.min(TWIST_STEP, d.twist)) * 0.5);
}

// ---------- after every change ----------

function after() {
  const st = refreshBeam();
  if (st.solved && !game.solved && !game.drag) win();
  render(st);
}

function win(watched = false) {
  game.solved = true;
  const p = game.g.p, L0 = prog.level;
  if (!watched) {
    prog.solved[L0] = (prog.solved[L0] ?? 0) + 1;
    prog.best[p.id] = Math.max(prog.best[p.id] ?? 0, game.hints ? 1 : 3);
  }
  let opened = false;
  if (!watched && (prog.solved[L0] ?? 0) >= UNLOCK && L0 === prog.unlocked && L0 < L.LEVELS.length) { prog.unlocked = L0 + 1; opened = true; }
  prog.next[L0] = (prog.next[L0] ?? 0) + 1;
  save();
  log.event('win', { id: p.id, moves: game.g.moves, hints: game.hints, watched });
  scene.celebrate();
  sfx('win2', { vol: 0.5 });
  setTimeout(() => {
    if (!watched) { specialFx(); bigSay('명중!'); }
    $('#l-done-title').textContent = watched ? '풀이' : '명중';
    $('#l-done-text').textContent = watched ? '직접 풀어야 기록이 쌓입니다' : `${game.g.moves}번 움직여 풀었습니다${game.hints ? ` · 힌트 ${game.hints}번` : ''}`;
    const left = UNLOCK - (prog.solved[L0] ?? 0);
    $('#l-done-note').innerHTML = opened ? `<b>${L.LEVELS[L0].name} 단계가 열렸습니다</b>`
      : L0 === prog.unlocked && L0 < L.LEVELS.length && left > 0 ? `${left}문제 더 풀면 다음 단계가 열립니다` : '';
    setTimeout(() => { $('#l-done').hidden = false; }, 600);
  }, 500);
  render();
}

// ---------- buttons ----------

function restart() {
  if (game.drag || game.solved || game.auto) return;
  const p = game.g.p;
  game.g = L.newGame(p);
  scene.clearHint();
  // same tokens, back where they started: rebuild the positions without rebuilding the models
  scene.sync(game.g);
  after();
}

function hint() {
  if (game.drag || game.solved || game.auto) return;
  const h = L.hint(game.g);
  if (!h) return;
  game.hints++;
  scene.showHint(game.g, h);
  const t = game.g.tokens[h.i];
  toast(t.fixed ? `초록색으로 표시한 방향으로 ${NAMES[t.type]}을(를) 돌리세요` : `${NAMES[t.type]}을(를) 초록색 자리에 그 방향으로 놓으세요`, 2600);
  log.event('hint', h);
  render();
}

// 풀이 보기: puts every token where the solution has it, one at a time
const AUTO_STEP = 750;
function showSolution() {
  if (game.drag || game.solved || game.auto) return;
  scene.clearHint();
  game.auto = { timer: 0 };
  render();
  const step = () => {
    if (!game.auto) return;
    const h = L.hint(game.g);
    if (!h) { game.auto = null; win(true); return; }
    const t = game.g.tokens[h.i];
    if (!t.fixed) {
      const j = L.tokenAt(game.g, h.r, h.c);
      if (j >= 0 && j !== h.i) L.lift(game.g, j);
      L.place(game.g, h.i, h.r, h.c);
    }
    t.o = h.o;
    scene.showTurn(h.i, t.o);
    scene.sync(game.g, false, 0.45);
    sfx('knock', { vol: 0.25, rate: 1.2 });
    refreshBeam();
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

function render(st = L.status(game.g)) {
  const g = game.g;
  if (!g) return;
  $('#l-levels').innerHTML = L.LEVELS.map((lv, i) => `<button class="btn small tab" data-level="${i + 1}" aria-pressed="${prog.level === i + 1}" ${i + 1 > prog.unlocked ? `disabled title="앞 단계에서 ${UNLOCK}문제를 풀면 열립니다"` : ''}>${lv.name}</button>`).join('');
  $('#l-lit').textContent = st.lit;
  $('#l-need').textContent = ` / ${st.need}`;
  const placed = mine().filter((i) => g.tokens[i].r !== null).length;
  $('#l-placed').textContent = placed;
  $('#l-mine').textContent = ` / ${mine().length}`;
  $('#l-id').textContent = `${L.LEVELS[g.p.level - 1].name} · 문제 ${g.p.n + 1}${prog.best[g.p.id] ? ` · 풀었음` : ''}`;
  let msg;
  if (game.auto) msg = '<b>풀이 보기</b>';
  else if (game.solved) msg = '<b>명중!</b>';
  else if (st.unplaced) msg = `트레이의 조각 <b>${st.unplaced}개</b>를 판에 놓으세요`;
  else if (st.bad) msg = '빛이 조각의 <b>막힌 면</b>에 닿았습니다';
  else if (st.off) msg = '빛이 <b>판 밖으로</b> 나갑니다';
  else if (st.untouched.length) msg = `빛이 닿지 않은 조각이 <b>${st.untouched.length}개</b> 있습니다`;
  else if (st.lit !== st.need) msg = `목표를 <b>${st.need}개</b> 켜야 합니다 (지금 ${st.lit}개)`;
  else msg = '거의 다 됐습니다';
  $('#banner-text').innerHTML = msg;
  const busy = game.solved || Boolean(game.auto);
  $('#b-hint').disabled = busy;
  $('#b-solve').disabled = busy;
  $('#b-reset').disabled = busy || !g.moves;
}
$('#l-levels').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-level]');
  if (!b || b.disabled || game.drag) return;
  load(Number(b.dataset.level));
});

function updateHover(x, y) {
  if (game.drag || !game.g || game.solved || game.auto) return;
  const i = x === null || !onStage(x, y) ? null : scene.tokenAt(x, y, handy());
  if (i === scene.hoverI) return;
  if (scene.hoverI !== null && scene.tokens[scene.hoverI]?.glow.color !== 0x2fae7f) scene.setGlow(scene.hoverI, null);
  scene.hoverI = i;
  if (i !== null && scene.tokens[i].glow.color !== 0x2fae7f) scene.setGlow(i, { color: 0xe0a83a, intensity: 0.3, pulse: false });
}

shell.attach({
  modalOpen: () => shell.introOpen() || !$('#l-done').hidden,
  dragging: () => Boolean(game.drag),
  startDrag, moveDrag, endDrag, cancelDrag, updateHover, onHandPose,
  refresh: () => render(),
});

$('#stage').addEventListener('wheel', (e) => {
  e.preventDefault();
  const i = game.drag?.i ?? scene.hoverI;
  turnBy(i, e.deltaY > 0 ? 1 : -1, 'wheel');
}, { passive: false });
$('#b-hint').addEventListener('click', hint);
$('#b-solve').addEventListener('click', showSolution);
$('#b-reset').addEventListener('click', restart);
$('#b-next').addEventListener('click', () => { if (!game.drag) next(); });
$('#l-next').addEventListener('click', () => load());
addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !$('#l-done').hidden) load();
  else if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey) turnBy(game.drag?.i ?? scene.hoverI, e.shiftKey ? -1 : 1, 'key');
});
for (const id of ['#btn-start-cam', '#btn-start-mouse']) $(id).addEventListener('click', () => unlockSound());
const soundBtn = $('#b-sound');
const showSound = () => { soundBtn.textContent = isMuted() ? '소리 꺼짐' : '소리 켜짐'; soundBtn.classList.toggle('off', isMuted()); };
soundBtn.addEventListener('click', () => { unlockSound(); setMuted(!isMuted()); showSound(); });
showSound();

load();

// Debug / test handle
window.__laser = { game, scene, L, prog, hand: shell.injectHandFrame, load, next, hint, showSolution, restart };
