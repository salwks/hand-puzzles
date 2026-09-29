// 해커: the game page, three phases per puzzle (hacker-logic.js on hacker-scene.js).
//   작성: carry move tiles from the supply into the program slots, then 실행 to watch the agent.
//   해킹: slide tiles left or right (never past each other; locked ones stay) so the agent walks
//         into the virus instead.
//   방어: pinch the link between two tiles that run back to back; if no sliding can reach the
//         virus any more, the program is safe.
// Tiles are carried by pinch or mouse; everything the scene shows comes from the engine's run.
import * as H from './hacker-logic.js';
import { HackerScene } from './hacker-scene.js';
import { createShell } from './shell.js';
import { sfx, unlockSound, isMuted, setMuted } from './sound.js';
import { createFx } from './fx.js';

const $ = (sel) => document.querySelector(sel);
const SAVE_KEY = 'hacker-progress';
const MOVE = 0.25; // squares of hand/mouse travel before a press becomes a carry
const UNLOCK = 3;
const PHASES = { code: '작성', hack: '해킹', fix: '방어', done: '완료' };
const WHY = {
  alarm: '<b>경보</b>가 울렸습니다', virus: '<b>바이러스</b>에 감염됐습니다',
  lost: '프로그램이 끝났는데 <b>출구</b>에 닿지 못했습니다', escaped: '요원이 <b>출구</b>로 빠져나갔습니다',
};

const scene = new HackerScene($('#stage'));
const shell = createShell({ scene, gameId: 'hacker' });
const { log, toast, onStage } = shell;
const { bigSay, specialFx } = createFx(scene);

const prog = { level: 1, unlocked: 1, next: {}, solved: {}, best: {} };
try { Object.assign(prog, JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')); } catch { /* keep defaults */ }
const save = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(prog)); } catch { /* storage blocked */ } };

const game = { g: null, drag: null, running: false, solved: false, hints: 0, last: null };

// ---------- puzzles ----------

function load(level = prog.level, n = prog.next[level] ?? 0) {
  prog.level = level;
  const p = H.puzzle(level, n);
  game.g = H.newGame(p);
  Object.assign(game, { drag: null, running: false, solved: false, hints: 0, last: null });
  scene.setGame(game.g);
  $('#h-done').hidden = true;
  save();
  log.event('puzzle', { id: p.id, T: p.T, tiles: p.tiles, locked: p.locked, platforms: p.platforms });
  render();
}
function next() {
  prog.next[prog.level] = (prog.next[prog.level] ?? 0) + 1;
  load();
}

const movable = () => game.g.tiles.map((_, i) => i).filter((i) => {
  const t = game.g.tiles[i];
  if (t.locked) return false;
  return game.g.phase === 'code' || (game.g.phase === 'hack' && t.slot !== null);
});

// ---------- phase actions ----------

function runProgram() {
  const g = game.g;
  if (game.running || game.drag || game.solved || g.phase === 'fix' || g.phase === 'done') return;
  const res = H.tryRun(g);
  if (g.phase === 'code' && res.unplaced) { toast(`보급대의 타일 ${res.unplaced}개를 먼저 칸에 넣으세요`, 2000); return; }
  game.running = true;
  game.last = null;
  log.event('run', { phase: g.phase, program: H.currentProgram(g), result: res.run.result, ok: res.ok });
  sfx('slide', { vol: 0.25, rate: 1.4 });
  render();
  scene.playRun(res.run, () => {
    game.running = false;
    game.last = res;
    if (res.ok) passPhase();
    else { sfx('knock', { vol: 0.3, rate: 0.8 }); render(); }
  });
}

function passPhase() {
  const g = game.g;
  const was = g.phase;
  sfx('win', { vol: 0.35 });
  scene.flare(0.35, 0.9);
  H.advance(g);
  log.event('phase', { from: was, to: g.phase });
  toast(was === 'code' ? '작성 완료! 이제 같은 타일로 바이러스에 닿게 해킹하세요' : '해킹 성공! 이제 두 타일을 연결해 해킹을 막으세요', 2800);
  setTimeout(() => {
    scene.placeStart();
    scene.syncTiles(g);
    if (g.phase === 'fix') showLinks();
    render();
  }, 900);
  render();
}

function showLinks(chosen = null) {
  const spots = H.linkable(game.g).map(({ pair, tiles }) => {
    const a = game.g.tiles[tiles[0]].slot, b = game.g.tiles[tiles[1]].slot;
    return { pair, x: (scene.slotX(a) + scene.slotX(b)) / 2 };
  });
  scene.setLinks(spots, chosen);
}

function chooseLink(k) {
  const g = game.g;
  const res = H.link(g, k);
  showLinks(k);
  log.event('link', { pair: k, ok: res.ok, hacks: res.hacks });
  sfx('clack', { vol: 0.35, rate: 1.1 });
  if (res.ok) { win(); return; }
  // show one hack that still gets through
  const hs = H.hacks(g.p, H.codeProgram(g), [k]);
  const { tiles } = H.timings(H.codeProgram(g), g.p.locked.map((l) => l.slot));
  const pr = new Array(g.p.T).fill(null);
  tiles.forEach((t, i) => { pr[hs[0][i]] = t.d; });
  game.running = true;
  game.last = { ok: false, fixFail: res.hacks };
  render();
  scene.playRun(H.simulate(g.p, pr, { ignoreData: true }), () => { game.running = false; scene.placeStart(); render(); });
}

// ---------- dragging ----------

function startDrag(x, y, frame = null) {
  if (shell.introOpen() || !$('#h-done').hidden) return false;
  scene.pointer = { x, y };
  if (game.running || game.solved) return true;
  const g = game.g;
  if (g.phase === 'fix') {
    const k = scene.linkAt(x, y);
    if (k !== null) { chooseLink(k); return true; }
    return false;
  }
  if (!onStage(x, y)) return false;
  const i = scene.tileAt(x, y, movable());
  if (i === null) {
    const any = scene.tileAt(x, y, g.tiles.map((_, k) => k));
    if (any !== null && g.tiles[any].locked) toast('자물쇠가 있는 타일은 움직일 수 없습니다', 1500);
    log.event('grab-empty', { x: Math.round(x), y: Math.round(y) });
    return false;
  }
  game.drag = { i, at: scene.pointOnPlane(x, y, 0.2), moved: false, target: null, byHand: Boolean(frame) };
  scene.setTileGlow(i, { color: 0x3f7fe6, intensity: 0.3, pulse: false });
  log.event('grab', { tile: i, slot: g.tiles[i].slot, phase: g.phase, x: Math.round(x), y: Math.round(y) });
  return true;
}

function targetFor(x, y) {
  const g = game.g, d = game.drag, t = g.tiles[d.i];
  const s = scene.slotAt(x, y);
  if (g.phase === 'code') {
    if (s === 'supply') return 'supply';
    if (typeof s === 'number') { const j = g.tiles.findIndex((q) => q.slot === s); return j < 0 || j === d.i ? s : null; }
    return null;
  }
  // hack: slide along the row within the gap around it
  const { lo, hi } = H.slideRange(g, d.i);
  const p = scene.pointOnPlane(x, y, 0.17);
  if (!p) return t.slot;
  const raw = Math.round(p.x / (0.78 + 0.06) + (g.p.T - 1) / 2);
  return Math.max(lo, Math.min(hi, raw));
}

function moveDrag(x, y) {
  const d = game.drag;
  if (!d) return;
  scene.pointer = { x, y };
  const p = scene.pointOnPlane(x, y, 0.2);
  if (!d.moved && p && d.at && Math.hypot(p.x - d.at.x, p.z - d.at.z) > MOVE) {
    d.moved = true;
    scene.hold(d.i);
    sfx('lift', { vol: 0.25, rate: 1.3 });
  }
  if (d.moved) { d.target = targetFor(x, y); scene.carry(x, y, d.target); }
}

function endDrag(x, y) {
  const d = game.drag;
  if (!d) return;
  moveDrag(x, y);
  game.drag = null;
  const g = game.g;
  scene.setTileGlow(d.i, null);
  scene.release();
  if (d.moved) {
    let ok = false;
    if (g.phase === 'code') ok = d.target === 'supply' ? H.put(g, d.i, null) : typeof d.target === 'number' ? H.put(g, d.i, d.target) : false;
    else if (g.phase === 'hack' && typeof d.target === 'number') ok = H.slide(g, d.i, d.target);
    log.event('drop', { tile: d.i, target: d.target, ok, x: Math.round(x), y: Math.round(y) });
    if (ok) { sfx('knock', { vol: 0.3, rate: 1.4 }); game.last = null; }
  }
  scene.syncTiles(g);
  render();
}

function cancelDrag() {
  const d = game.drag;
  if (!d) return;
  log.event('drag-cancel', { tile: d.i });
  game.drag = null;
  scene.setTileGlow(d.i, null);
  scene.release();
  scene.syncTiles(game.g);
}

// ---------- buttons ----------

function restartPhase() {
  const g = game.g;
  if (game.running || game.drag || game.solved) return;
  if (g.phase === 'code') g.tiles.forEach((t) => { if (!t.locked) t.slot = null; });
  else g.tiles.forEach((t, i) => { t.slot = g.codeSlots[i]; });
  g.link = null;
  game.last = null;
  scene.placeStart();
  scene.syncTiles(g);
  if (g.phase === 'fix') showLinks();
  render();
}

function hint() {
  const g = game.g;
  if (game.running || game.drag || game.solved) return;
  const h = H.hint(g);
  if (!h) return;
  game.hints++;
  log.event('hint', h);
  if (h.phase === 'code') {
    if (h.slot === null) { toast('빛나는 타일은 빼야 합니다 — 보급대로 돌려놓으세요', 2400); scene.setTileGlow(h.tile, { color: 0x2fae7f, intensity: 0.6, pulse: true }); }
    else { toast(`빛나는 타일을 ${h.slot + 1}번 칸에 넣으세요`, 2400); scene.setTileGlow(h.tile, { color: 0x2fae7f, intensity: 0.6, pulse: true }); }
  } else if (h.phase === 'hack') {
    const cur = g.tiles.map((t, i) => [t.slot, i]).filter(([s]) => s !== null).sort((a, b) => a[0] - b[0]);
    const k = cur.findIndex(([s], j) => s !== h.slots[j]);
    if (k >= 0) { const [s, i] = cur[k]; toast(`빛나는 타일을 ${h.slots[k] + 1}번 칸 쪽으로 미세요 (지금 ${s + 1}번)`, 2600); scene.setTileGlow(i, { color: 0x2fae7f, intensity: 0.6, pulse: true }); }
  } else if (h.phase === 'fix') {
    toast('초록색으로 빛나는 연결을 집어 보세요', 2200);
    showLinks();
    const sp = scene.linkSpots.find((q) => q.pair === h.pair);
    if (sp) sp.mesh.material.color.set(0x2fae7f);
  }
  render();
}

function win() {
  game.solved = true;
  const g = game.g, p = g.p, L0 = prog.level;
  prog.solved[L0] = (prog.solved[L0] ?? 0) + 1;
  prog.best[p.id] = 1;
  let opened = false;
  if (prog.solved[L0] >= UNLOCK && L0 === prog.unlocked && L0 < H.LEVELS.length) { prog.unlocked = L0 + 1; opened = true; }
  prog.next[L0] = (prog.next[L0] ?? 0) + 1;
  save();
  H.advance(g);
  log.event('win', { id: p.id, runs: g.runs, hints: game.hints });
  scene.celebrate();
  sfx('win2', { vol: 0.5 });
  specialFx();
  bigSay('보안 완료!');
  $('#h-done-text').textContent = `${g.runs}번 실행해 작성·해킹·방어를 마쳤습니다${game.hints ? ` · 힌트 ${game.hints}번` : ''}`;
  const left = UNLOCK - prog.solved[L0];
  $('#h-done-note').innerHTML = opened ? `<b>${H.LEVELS[L0].name} 단계가 열렸습니다</b>`
    : L0 === prog.unlocked && L0 < H.LEVELS.length && left > 0 ? `${left}문제 더 풀면 다음 단계가 열립니다` : '';
  setTimeout(() => { $('#h-done').hidden = false; }, 1200);
  render();
}

// ---------- HUD ----------

function render() {
  const g = game.g;
  if (!g) return;
  $('#h-levels').innerHTML = H.LEVELS.map((lv, i) => `<button class="btn small tab" data-level="${i + 1}" aria-pressed="${prog.level === i + 1}" ${i + 1 > prog.unlocked ? `disabled title="앞 단계에서 ${UNLOCK}문제를 풀면 열립니다"` : ''}>${lv.name}</button>`).join('');
  $('#h-phase').innerHTML = ['code', 'hack', 'fix'].map((ph, k) => `<span class="${g.phase === ph ? 'on' : ['code', 'hack', 'fix', 'done'].indexOf(g.phase) > k ? 'past' : ''}">${k + 1} ${PHASES[ph]}</span>`).join('<i>›</i>');
  $('#h-runs').textContent = g.runs;
  $('#h-id').textContent = `${H.LEVELS[g.p.level - 1].name} · 문제 ${g.p.n + 1} · ${g.p.T}박자${prog.best[g.p.id] ? ' · 풀었음' : ''}`;
  let msg;
  const last = game.last;
  if (game.solved) msg = '<b>보안 완료!</b>';
  else if (game.running) msg = last?.fixFail ? '이 연결로는…' : '실행 중…';
  else if (g.phase === 'code') {
    const left = g.tiles.filter((t) => t.slot === null).length;
    msg = last && !last.ok ? `${WHY[last.run.result]} — 타일을 다시 배치하세요`
      : left ? `타일 <b>${left}개</b>를 칸에 넣어 요원이 <b>문서</b>를 줍고 <b>출구</b>로 가게 하세요` : '준비됐으면 <b>실행</b>을 누르세요';
  } else if (g.phase === 'hack') {
    msg = last && !last.ok ? `${WHY[last.run.result]} — 타일을 좌우로 밀어 박자를 바꿔 보세요` : '타일을 <b>좌우로만</b> 밀어 요원이 <b>바이러스</b>에 닿게 하세요';
  } else if (g.phase === 'fix') {
    msg = last?.fixFail ? `이 연결로는 아직 <b>${last.fixFail}가지</b> 방법으로 해킹됩니다 — 다른 연결을 고르세요` : '붙어 있는 두 타일 사이의 <b>연결 고리</b>를 집어 해킹을 막으세요';
  }
  $('#banner-text').innerHTML = msg;
  const busy = game.running || game.solved;
  $('#b-run').disabled = busy || g.phase === 'fix';
  $('#b-hint').disabled = busy;
  $('#b-reset').disabled = busy;
}
$('#h-levels').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-level]');
  if (!b || b.disabled || game.drag || game.running) return;
  load(Number(b.dataset.level));
});

function updateHover(x, y) {
  if (game.drag || !game.g || game.running || game.solved || game.g.phase === 'fix') return;
  const i = x === null || !onStage(x, y) ? null : scene.tileAt(x, y, movable());
  if (i === scene.hoverI) return;
  if (scene.hoverI !== null && scene.tiles[scene.hoverI]?.userData.glow.color !== 0x2fae7f) scene.setTileGlow(scene.hoverI, null);
  scene.hoverI = i;
  if (i !== null && scene.tiles[i].userData.glow.color !== 0x2fae7f) scene.setTileGlow(i, { color: 0xe0a83a, intensity: 0.3, pulse: false });
}

shell.attach({
  modalOpen: () => shell.introOpen() || !$('#h-done').hidden,
  dragging: () => Boolean(game.drag),
  startDrag, moveDrag, endDrag, cancelDrag, updateHover,
  refresh: render,
});

$('#b-run').addEventListener('click', runProgram);
$('#b-hint').addEventListener('click', hint);
$('#b-reset').addEventListener('click', restartPhase);
$('#b-next').addEventListener('click', () => { if (!game.drag && !game.running) next(); });
$('#h-next').addEventListener('click', () => load());
addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !$('#h-done').hidden) load();
  else if (e.key === ' ' && $('#h-done').hidden && !shell.introOpen()) { e.preventDefault(); runProgram(); }
});
for (const id of ['#btn-start-cam', '#btn-start-mouse']) $(id).addEventListener('click', () => unlockSound());
const soundBtn = $('#b-sound');
const showSound = () => { soundBtn.textContent = isMuted() ? '소리 꺼짐' : '소리 켜짐'; soundBtn.classList.toggle('off', isMuted()); };
soundBtn.addEventListener('click', () => { unlockSound(); setMuted(!isMuted()); showSound(); });
showSound();

load();

window.__hacker = { game, scene, H, prog, hand: shell.injectHandFrame, load, next, hint, runProgram, chooseLink };
