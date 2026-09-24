// 마작 — riichi mahjong against three AI players, played by hand: draw from the wall, drop a
// discard in the river (twist it sideways to declare riichi), pull another player's discard
// towards you to call it. One east-round game (동풍전).
import {
  makeWall, typeOf, counts, shanten, waits, evaluate, chiOptions, ponOK, kanOK, bestDiscard,
  tileName, EAST, HAKU, isHonor, isTerminal, isYaochu, ukeire,
} from './mj-logic.js';
import { MahjongScene, tileSrc, TW, TH } from './mj-scene.js';
import { createShell } from './shell.js';
import { COLOR } from './stage.js';

const $ = (sel) => document.querySelector(sel);
const NAMES = ['나', '남 사장', '서 선생', '북 여사'];
const WINDS = ['동', '남', '서', '북'];
const DEAD = 14;
const CALL_MS = 5000; // how long the player has to call someone else's discard
const TWIST_STEP = (30 * Math.PI) / 180;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (n) => Math.round(n).toLocaleString('en-US');
const byType = (a, b) => typeOf(a) - typeOf(b) || a - b;
const GUIDE_KEY = 'mahjong-guide';
let guideOn = true;
try { guideOn = localStorage.getItem(GUIDE_KEY) !== 'off'; } catch { /* default on */ }

const scene = new MahjongScene($('#stage'));
const shell = createShell({ scene, gameId: 'mahjong' });
const { log, toast, onStage } = shell;

const state = {
  scores: [25000, 25000, 25000, 25000], dealer: 0, roundNo: 1, sticks: 0, started: false,
  wall: [], live: 0, rinshan: 0, kans: 0, doraInd: [],
  hands: [[], [], [], []], melds: [[], [], [], []], rivers: [[], [], [], []],
  riichi: [false, false, false, false], ippatsu: [false, false, false, false],
  turn: 0, drawn: null, phase: 'idle', say: [null, null, null, null],
  wait: null, drag: null, hover: null, riichiIntent: false, callWin: null, lastDiscard: null,
};

const seatWind = (s) => EAST + ((s - state.dealer + 4) % 4);
const liveLeft = () => state.wall.length - DEAD - state.live - state.kans;
const handTypes = (s) => state.hands[s].map(typeOf);
const meldTypes = (s) => state.melds[s].map((m) => ({ kind: m.kind, tiles: m.tiles.map(typeOf) }));
const isClosed = (s) => state.melds[s].every((m) => m.kind === 'ankan');
const doraTypes = () => state.doraInd.map(typeOf);

/** Types nobody can see yet, from `s`'s point of view (for AI decisions and hint counts). */
function unseen(s) {
  const c = new Array(34).fill(4);
  const see = (id) => { c[typeOf(id)]--; };
  state.hands[s].forEach(see);
  state.rivers.forEach((r) => r.forEach((d) => see(d.id)));
  state.melds.forEach((ms) => ms.forEach((m) => m.tiles.forEach(see)));
  state.doraInd.forEach(see);
  return c.map((n) => Math.max(0, n));
}

// ---------- layout ----------

function layoutHand(s, { instant = false } = {}) {
  const drawn = state.drawn !== null && state.turn === s && state.hands[s].includes(state.drawn) ? state.drawn : null;
  const ids = state.hands[s].filter((id) => id !== drawn).sort(byType);
  if (drawn !== null) ids.push(drawn);
  state.hands[s] = ids;
  const open = state.phase === 'over-hand' && state.revealed?.includes(s);
  ids.forEach((id, i) => {
    const target = open && s !== 0 ? scene.openHandPose(s, i, ids.length)
      : scene.handPose(s, i, ids.length, drawn !== null && i === ids.length - 1, state.melds[s].length);
    if (s === 0 && state.phase === 'discard') {
      // candidates stand a little proud of the hand, the recommended one most
      const tag = state.tagged?.find((x) => x.id === id);
      target.p.y += state.hover === id ? 0.14 : tag?.best ? 0.1 : tag ? 0.05 : 0;
    }
    scene.place(id, target, { face: s === 0 || open, dur: 0.28, arc: 0.05, instant });
  });
}

function layoutRiver(s) {
  const r = state.rivers[s];
  let rowSide = -1;
  r.forEach((d, k) => {
    const row = Math.min(3, Math.floor(k / 6));
    if (d.sideways) rowSide = k;
    const before = rowSide >= 0 && rowSide < k && Math.min(3, Math.floor(rowSide / 6)) === row;
    scene.place(d.id, scene.riverPose(s, k, d.sideways, before), { face: true, dur: 0.3, arc: 0.3 });
  });
}

function layoutMelds(s) {
  let x = 0;
  for (const m of state.melds[s]) {
    m.tiles.forEach((id, j) => {
      const sideways = m.kind !== 'ankan' && j === m.calledPos;
      const hidden = m.kind === 'ankan' && (j === 0 || j === 3);
      const target = scene.meldPose(s, x, sideways);
      if (hidden) target.q.multiply(new target.q.constructor().setFromAxisAngle({ x: 1, y: 0, z: 0 }, Math.PI)); // face-down
      scene.place(id, target, { face: !hidden, dur: 0.35 });
      x += (sideways ? TH : TW) + 0.01;
    });
    x += 0.08;
  }
}

function layoutAll(instant = false) {
  for (let s = 0; s < 4; s++) { layoutHand(s, { instant }); layoutRiver(s); layoutMelds(s); }
}

// ---------- round ----------

async function newRound() {
  state.wall = makeWall();
  state.live = 0;
  state.kans = 0;
  state.rinshan = state.wall.length - 1;
  state.hands = [[], [], [], []];
  state.melds = [[], [], [], []];
  state.rivers = [[], [], [], []];
  state.riichi = [false, false, false, false];
  state.ippatsu = [false, false, false, false];
  state.say = [null, null, null, null];
  state.drawn = null;
  state.lastDiscard = null;
  state.riichiIntent = false;
  state.revealed = null;
  scene.reset(state.wall);
  state.wall.forEach((id, i) => scene.place(id, scene.wallPose(i), { instant: true, face: false }));
  // the dora indicator is turned face-up in the dead wall
  const indPos = state.wall.length - 6;
  state.doraInd = [state.wall[indPos]];
  flipWallTile(indPos);
  state.phase = 'deal';
  render();
  await sleep(400);
  for (let r = 0; r < 4; r++) {
    for (let k = 0; k < 4; k++) {
      const s = (state.dealer + k) % 4;
      const n = r < 3 ? 4 : 1;
      for (let j = 0; j < n; j++) state.hands[s].push(state.wall[state.live++]);
      layoutHand(s);
      await sleep(90);
    }
  }
  log.event('round', { dealer: state.dealer, round: state.roundNo });
  state.turn = state.dealer;
  playTurn(state.dealer);
}

function flipWallTile(pos) {
  const t = scene.wallPose(pos);
  t.q.multiply(new t.q.constructor().setFromAxisAngle({ x: 1, y: 0, z: 0 }, Math.PI));
  scene.place(state.wall[pos], t, { face: true, dur: 0.4, arc: 0.3 });
}

async function playTurn(s, { afterCall = false, rinshan = false } = {}) {
  if (state.phase === 'end') return;
  state.turn = s;
  if (!afterCall) {
    if (!rinshan && liveLeft() <= 0) return exhaustiveDraw();
    await drawTile(s, rinshan);
  } else state.drawn = null;
  render();
  if (s === 0) playerTurn(afterCall, rinshan);
  else aiTurn(s, afterCall, rinshan);
}

async function drawTile(s, rinshan) {
  const id = rinshan ? state.wall[state.rinshan--] : state.wall[state.live];
  if (s === 0 && !rinshan) {
    // The player takes their own tile from the wall.
    state.phase = 'draw';
    state.drawTarget = id;
    // The tile slides out of the wall so the standing hand can't hide it.
    const pop = scene.popPose(state.live);
    scene.place(id, pop, { dur: 0.35, arc: 0.1 });
    scene.showDrawSpot(pop.p);
    scene.setGlow(id, { color: COLOR.hover, intensity: 1, pulse: true });
    render();
    await new Promise((resolve) => { state.wait = { kind: 'draw', resolve }; });
    state.wait = null;
    scene.setGlow(id, null);
    scene.showDrawSpot(null);
    state.drawTarget = null;
  }
  if (!rinshan) state.live++;
  state.hands[s].push(id);
  state.drawn = id;
  layoutHand(s);
  await sleep(s === 0 ? 150 : 250);
}

// ---------- the player's turn ----------

function playerOptions(afterCall, rinshan) {
  const c = counts(handTypes(0));
  const o = { tsumo: null, kans: [], riichi: false };
  if (!afterCall && state.drawn !== null) {
    o.tsumo = evaluate(winCtx(0, typeOf(state.drawn), true, { rinshan }));
  }
  if (!afterCall && liveLeft() > 0) for (let t = 0; t < 34; t++) if (c[t] === 4 && !state.riichi[0]) o.kans.push(t);
  if (!state.riichi[0] && isClosed(0) && state.scores[0] >= 1000 && liveLeft() >= 4) {
    for (let t = 0; t < 34; t++) {
      if (!c[t]) continue;
      c[t]--;
      if (shanten(c, state.melds[0].length) === 0) o.riichi = true;
      c[t]++;
      if (o.riichi) break;
    }
  }
  return o;
}

async function playerTurn(afterCall, rinshan) {
  state.phase = 'discard';
  state.options = playerOptions(afterCall, rinshan);
  render();
  if (state.riichi[0] && !state.options.tsumo) {
    // In riichi the drawn tile goes straight out.
    await sleep(700);
    if (state.phase === 'discard') discard(0, state.drawn);
  }
}

function winCtx(s, winTile, tsumo, { rinshan = false, ronTile = null } = {}) {
  const closed = handTypes(s);
  if (ronTile !== null) closed.push(ronTile);
  return {
    closed, melds: meldTypes(s), winTile, tsumo, riichi: state.riichi[s], ippatsu: state.ippatsu[s],
    lastTile: !rinshan && liveLeft() <= 0, seatWind: seatWind(s), roundWind: EAST,
    doraIndicators: doraTypes(), dealer: s === state.dealer,
  };
}

function discard(s, id, { riichi = false } = {}) {
  if (!state.hands[s].includes(id)) return;
  if (riichi) {
    const c = counts(handTypes(s));
    c[typeOf(id)]--;
    if (shanten(c, state.melds[s].length) !== 0) {
      if (s === 0) toast('그 패를 버리면 텐파이가 아닙니다. 리치할 수 없습니다.', 2400);
      riichi = false;
    }
  }
  if (state.ippatsu[s]) state.ippatsu[s] = false;
  state.hands[s] = state.hands[s].filter((x) => x !== id);
  state.rivers[s].push({ id, sideways: riichi });
  if (riichi) {
    state.riichi[s] = true;
    state.ippatsu[s] = true;
    state.scores[s] -= 1000;
    state.sticks++;
    say(s, '리치');
  }
  state.drawn = null;
  state.phase = 'after-discard';
  state.lastDiscard = { seat: s, id };
  state.riichiIntent = false;
  scene.setCarrySideways(false);
  log.event('discard', { seat: s, tile: typeOf(id), riichi });
  layoutHand(s);
  layoutRiver(s);
  render();
  afterDiscard(s, id);
}

// ---------- calls ----------

function canRon(s, t) {
  const c = counts(handTypes(s));
  const w = waits(c, state.melds[s].length);
  if (!w.includes(t)) return null;
  // furiten: a wait already in your own river means no ron
  if (state.rivers[s].some((d) => w.includes(typeOf(d.id)))) return null;
  return evaluate(winCtx(s, t, false, { ronTile: t }));
}

async function afterDiscard(from, id) {
  await sleep(250);
  const t = typeOf(id);
  const order = [1, 2, 3].map((k) => (from + k) % 4);
  // Ron first, in turn order.
  for (const s of order) {
    const r = canRon(s, t);
    if (!r) continue;
    if (s !== 0) return win(s, { from, tile: id, result: r });
    const choice = await playerCallWindow(from, id, { ron: r });
    if (choice?.kind === 'ron') return win(0, { from, tile: id, result: r });
  }
  // Then pon / kan / chi.
  for (const s of order) {
    if (s === 0 || state.riichi[s] || liveLeft() <= 0) continue;
    const c = counts(handTypes(s));
    const valuable = t >= HAKU || t === seatWind(s) || t === EAST;
    if (valuable && ponOK(c, t)) return call(s, from, id, { kind: 'pon' });
  }
  if (!state.riichi[0] && liveLeft() > 0) {
    const c = counts(handTypes(0));
    const opts = {
      pon: ponOK(c, t), kan: kanOK(c, t),
      chi: from === 3 ? chiOptions(c, t) : [],
    };
    if (opts.pon || opts.kan || opts.chi.length) {
      const choice = await playerCallWindow(from, id, opts);
      if (choice) return call(0, from, id, choice);
    }
  }
  playTurn((from + 1) % 4);
}

/** Opens the call window for the player; resolves with { kind, pair? } or null for pass. */
function playerCallWindow(from, id, opts) {
  state.phase = 'call';
  state.callWin = { from, id, opts, until: performance.now() + CALL_MS };
  scene.setGlow(id, { color: COLOR.hover, intensity: 0.8, pulse: true });
  render();
  return new Promise((resolve) => {
    const done = (choice) => {
      clearInterval(timer);
      scene.setGlow(id, null);
      state.callWin = null;
      state.wait = null;
      state.phase = 'after-discard';
      render();
      resolve(choice);
    };
    state.wait = { kind: 'call', resolve: done };
    const timer = setInterval(() => {
      if (!state.callWin) return clearInterval(timer);
      const left = state.callWin.until - performance.now();
      $('#call-timer').style.width = `${Math.max(0, left / CALL_MS) * 100}%`;
      if (left <= 0 && !state.callWin.choosing) done(null);
    }, 50);
  });
}

function call(s, from, id, choice) {
  const t = typeOf(id);
  state.rivers[from] = state.rivers[from].filter((d) => d.id !== id);
  const take = (types) => {
    const out = [];
    for (const tt of types) {
      const idx = state.hands[s].findIndex((x) => typeOf(x) === tt && !out.includes(x));
      out.push(state.hands[s][idx]);
    }
    state.hands[s] = state.hands[s].filter((x) => !out.includes(x));
    return out;
  };
  let tiles, kind = choice.kind;
  if (kind === 'chi') tiles = [...take(choice.pair), id].sort(byType);
  else if (kind === 'pon') tiles = [...take([t, t]), id];
  else { tiles = [...take([t, t, t]), id]; kind = 'kan'; }
  // the called tile lies sideways, pointing at who it came from
  const rel = (from - s + 4) % 4; // 1 right, 2 across, 3 left
  const calledPos = kind === 'chi' ? 0 : rel === 3 ? 0 : rel === 2 ? 1 : tiles.length - 1;
  const ordered = tiles.filter((x) => x !== id);
  ordered.splice(calledPos, 0, id);
  state.melds[s].push({ kind, tiles: ordered, from, calledPos });
  state.ippatsu = [false, false, false, false];
  say(s, { chi: '치', pon: '퐁', kan: '깡' }[kind]);
  log.event('call', { seat: s, kind, tile: t });
  layoutRiver(from);
  layoutMelds(s);
  layoutHand(s);
  if (kind === 'kan') { addDora(); return playTurn(s, { rinshan: true }); }
  playTurn(s, { afterCall: true });
}

function addDora() {
  state.kans++;
  const pos = state.wall.length - 6 - state.kans * 2;
  state.doraInd.push(state.wall[pos]);
  flipWallTile(pos);
}

function declareAnkan(t) {
  const tiles = state.hands[0].filter((x) => typeOf(x) === t);
  state.hands[0] = state.hands[0].filter((x) => typeOf(x) !== t);
  state.melds[0].push({ kind: 'ankan', tiles, calledPos: -1 });
  say(0, '깡');
  layoutMelds(0);
  layoutHand(0);
  addDora();
  playTurn(0, { rinshan: true });
}

// ---------- AI ----------

async function aiTurn(s, afterCall, rinshan) {
  state.phase = 'ai';
  render();
  await sleep(450 + Math.random() * 450);
  if (!afterCall && state.drawn !== null) {
    const r = evaluate(winCtx(s, typeOf(state.drawn), true, { rinshan }));
    if (r) return win(s, { tsumo: true, tile: state.drawn, result: r });
  }
  if (state.riichi[s]) return discard(s, state.drawn);
  const c = counts(handTypes(s));
  const threat = [0, 1, 2, 3].filter((o) => o !== s && state.riichi[o]);
  const safe = (t) => threat.every((o) => state.rivers[o].some((d) => typeOf(d.id) === t));
  const sh = shanten(c, state.melds[s].length);
  // Against a riichi, a hand far from winning folds: it throws only tiles that are safe.
  const folding = threat.length && sh >= 2;
  const pick = bestDiscard(c, state.melds[s].length, unseen(s), threat.length ? (t) => (safe(t) ? 0 : folding ? 100 : 3) : null);
  const id = state.hands[s].filter((x) => typeOf(x) === pick.t).sort((a, b) => (a === state.drawn ? -1 : b === state.drawn ? 1 : 0))[0];
  const riichi = pick.s === 0 && isClosed(s) && state.scores[s] >= 1000 && liveLeft() >= 4 && !state.riichi[s];
  discard(s, id, { riichi });
}

function say(s, text) {
  state.say[s] = { text, at: performance.now() };
  renderSeats();
}

// ---------- ending a hand ----------

async function win(s, { tsumo = false, from = null, tile, result }) {
  state.phase = 'over-hand';
  state.revealed = [s];
  if (!tsumo) { state.rivers[from] = state.rivers[from].filter((d) => d.id !== tile); layoutRiver(from); state.hands[s].push(tile); }
  say(s, tsumo ? '쯔모' : '론');
  layoutHand(s);
  setTimeout(() => scene.celebrate(state.hands[s], { strong: s === 0 || result.yakuman }), 350);
  const p = result.points;
  const delta = [0, 0, 0, 0];
  if (tsumo) {
    for (let o = 0; o < 4; o++) {
      if (o === s) continue;
      const pay = s === state.dealer ? p.each : o === state.dealer ? p.fromDealer : p.fromOthers;
      delta[o] -= pay;
      delta[s] += pay;
    }
  } else { delta[from] -= p.ron; delta[s] += p.ron; }
  delta[s] += state.sticks * 1000;
  state.sticks = 0;
  for (let o = 0; o < 4; o++) state.scores[o] += delta[o];
  log.event('win', { seat: s, tsumo, han: result.han, fu: result.fu, total: p.total, yaku: result.yaku.map((y) => y.name) });
  await sleep(900);
  showResult({
    title: tsumo ? '쯔모' : '론', over: `${NAMES[s]} · ${tsumo ? 'TSUMO' : 'RON'}`,
    hand: state.hands[s], melds: state.melds[s], winTile: tile, result, delta,
  });
  state.nextDealerKeeps = s === state.dealer;
}

async function exhaustiveDraw() {
  state.phase = 'over-hand';
  const tenpai = [0, 1, 2, 3].filter((s) => shanten(counts(handTypes(s)), state.melds[s].length) === 0);
  state.revealed = tenpai;
  for (const s of tenpai) layoutHand(s);
  const delta = [0, 0, 0, 0];
  if (tenpai.length && tenpai.length < 4) {
    for (let s = 0; s < 4; s++) delta[s] = tenpai.includes(s) ? 3000 / tenpai.length : -3000 / (4 - tenpai.length);
  }
  for (let s = 0; s < 4; s++) state.scores[s] += delta[s];
  log.event('draw', { tenpai });
  await sleep(700);
  showResult({ title: '유국', over: 'EXHAUSTIVE DRAW', text: tenpai.length ? `텐파이: ${tenpai.map((s) => NAMES[s]).join(', ')}` : '모두 노텐', delta });
  state.nextDealerKeeps = tenpai.includes(state.dealer);
}

function faceImg(t) {
  return `<span class="mj-tile"><img src="${tileSrc(t)}" alt="${tileName(t)}"></span>`;
}

function showResult({ title, over, hand = null, melds = [], winTile = null, result = null, text = '', delta }) {
  $('#res-over').textContent = over;
  $('#res-title').textContent = title;
  let tiles = '';
  if (hand) {
    const rest = hand.filter((x) => x !== winTile).sort(byType);
    tiles = rest.map((x) => faceImg(typeOf(x))).join('') + melds.map((m) => `<span class="gap"></span>${m.tiles.map((x) => faceImg(typeOf(x))).join('')}`).join('')
      + `<span class="gap"></span><span class="win">${faceImg(typeOf(winTile))}</span>`;
  }
  $('#res-tiles').innerHTML = tiles;
  $('#res-yaku').innerHTML = result ? result.yaku.map((y, i) => `<div style="--i:${i}"><span>${y.name}</span><b>${y.han >= 13 ? '역만' : `${y.han}판`}</b></div>`).join('')
    + (result.dora ? `<div><span>도라</span><b>${result.dora}</b></div>` : '') : '';
  const pts = result?.points;
  $('#res-points').innerHTML = result ? `<span class="han">${result.yakuman ? '역만' : `${result.han}판 ${result.fu}부`}</span><b>${fmt(pts.total)}</b><span class="split">${pts.limit || ''}${pts.fromDealer ? ` · ${fmt(pts.fromOthers)} / ${fmt(pts.fromDealer)}` : pts.each ? ` · ${fmt(pts.each)} all` : ''}</span>` : `<span class="han">${text}</span>`;
  $('#res-scores').innerHTML = [0, 1, 2, 3].map((s) => `<div><dt>${NAMES[s]}</dt><dd>${fmt(state.scores[s])}</dd><span class="${delta[s] > 0 ? 'up' : delta[s] < 0 ? 'down' : ''}">${delta[s] ? (delta[s] > 0 ? '+' : '') + fmt(delta[s]) : '±0'}</span></div>`).join('');
  const card = $('#result .card');
  card.classList.toggle('mine', Boolean(result) && delta[0] > 0);
  card.classList.remove('enter');
  void card.offsetWidth; // restart the entrance animation
  card.classList.add('enter');
  $('#result').hidden = false;
  // the points count up
  const b = $('#res-points b');
  if (b && result) {
    const total = result.points.total, t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / 1300);
      b.textContent = fmt(Math.round(total * (1 - (1 - k) ** 3) / 100) * 100);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

function nextHand() {
  $('#result').hidden = true;
  if (!state.nextDealerKeeps) { state.dealer = (state.dealer + 1) % 4; state.roundNo++; }
  if (state.roundNo > 4 || state.scores.some((x) => x < 0)) return endGame();
  newRound();
}

function endGame() {
  state.phase = 'end';
  const rank = [0, 1, 2, 3].sort((a, b) => state.scores[b] - state.scores[a]);
  $('#end-title').textContent = `${rank.indexOf(0) + 1}위`;
  $('#end-scores').innerHTML = rank.map((s, i) => `<div><dt>${i + 1}위 · ${NAMES[s]}</dt><dd>${fmt(state.scores[s])}</dd></div>`).join('');
  $('#modal-end').hidden = false;
  log.event('gameover', { scores: state.scores });
}

function newGame() {
  $('#modal-end').hidden = true;
  Object.assign(state, { scores: [25000, 25000, 25000, 25000], dealer: 0, roundNo: 1, sticks: 0, started: true });
  newRound();
}

// ---------- hands on the table ----------

/** The tile to draw is small and far away: a pinch anywhere near it on screen counts. */
function nearDrawTarget(x, y) {
  const id = state.drawTarget;
  if (id === null || id === undefined) return null;
  if (scene.pick(x, y, [id]) !== null) return id;
  const p = scene.tile(id).root.position, sp = scene.toScreen(p.x, p.y, p.z);
  return Math.hypot(sp.x - x, sp.y - y) < 70 ? id : null;
}

const modalOpen = () => shell.introOpen() || !$('#result').hidden || !$('#modal-end').hidden;

function updateHover(x, y) {
  let h = null;
  if (x !== null && !state.drag && !modalOpen() && onStage(x, y)) {
    if (state.phase === 'discard') h = scene.pick(x, y, state.hands[0]);
    else if (state.phase === 'draw') h = nearDrawTarget(x, y);
    else if (state.phase === 'call') h = scene.pick(x, y, [state.callWin.id]);
  }
  scene.hoverOn = h !== null;
  if (h !== state.hover) {
    const prev = state.hover;
    state.hover = h;
    if (state.phase === 'discard') {
      applyHandGlows();
      layoutHand(0);
    }
    void prev;
  }
}

function startDrag(x, y) {
  if (modalOpen() || state.drag || !onStage(x, y)) return false;
  scene.pointer = { x, y };
  let id = null, kind = null;
  if (state.phase === 'discard') { id = scene.pick(x, y, state.hands[0]); kind = 'discard'; }
  else if (state.phase === 'draw') { id = nearDrawTarget(x, y); kind = 'draw'; }
  else if (state.phase === 'call') { id = scene.pick(x, y, [state.callWin.id]); kind = 'call'; }
  if (id === null) return false;
  if (kind === 'discard' && state.riichi[0] && id !== state.drawn) { toast('리치 중에는 가져온 패만 버릴 수 있습니다.', 1800); return false; }
  state.drag = { kind, id, t: performance.now(), x0: x, y0: y, twist: 0, rollPrev: null };
  if (state.hover !== null) scene.setGlow(state.hover, null);
  state.hover = null;
  scene.carry(id, kind === 'discard' && state.riichiIntent);
  if (kind === 'call') state.callWin.choosing = true;
  render();
  return true;
}

function moveDrag(x, y) {
  if (!state.drag) return;
  scene.pointer = { x, y };
  render(false);
}

function endDrag(x, y) {
  const d = state.drag;
  if (!d) return;
  scene.pointer = { x, y };
  state.drag = null;
  scene.dropCarry();
  const at = scene.pointerOnTable(0);
  const tap = Math.hypot(x - d.x0, y - d.y0) < 12 && performance.now() - d.t < 400;
  const inRiver = at && Math.abs(at.x) < 2.95 && Math.abs(at.z) < 2.95;
  const toMe = at && at.z > 2.5;
  if (d.kind === 'draw') {
    state.wait?.resolve();
  } else if (d.kind === 'discard') {
    if (inRiver) discard(0, d.id, { riichi: state.riichiIntent });
    else layoutHand(0);
  } else if (d.kind === 'call') {
    state.callWin.choosing = false;
    layoutRiver(state.callWin.from);
    if (toMe || tap) chooseCall();
  }
  render();
}

function cancelDrag() {
  const d = state.drag;
  if (!d) return;
  state.drag = null;
  scene.dropCarry();
  if (d.kind === 'discard') layoutHand(0);
  if (d.kind === 'call') { state.callWin.choosing = false; layoutRiver(state.callWin.from); }
  if (d.kind === 'draw') scene.place(d.id, scene.popPose(state.live), { dur: 0.2 });
  render();
}

/** Pulling the discard in: take the only option, or open the choice for several. */
function chooseCall() {
  const cw = state.callWin;
  if (!cw) return;
  const list = callChoices(cw.opts);
  if (list.length === 1) return cw && state.wait?.resolve(list[0]);
  cw.choosing = true;
  cw.until = performance.now() + CALL_MS;
  render();
}

function callChoices(o) {
  const list = [];
  if (o.ron) list.push({ kind: 'ron' });
  if (o.pon) list.push({ kind: 'pon' });
  if (o.kan) list.push({ kind: 'kan' });
  for (const pair of o.chi ?? []) list.push({ kind: 'chi', pair });
  return list;
}

/** Wrist twist while carrying a discard turns it sideways: riichi. */
function onHandPose(f) {
  const d = state.drag;
  if (!d || d.kind !== 'discard' || f.roll === undefined) return;
  if (d.rollPrev !== null && (f.speed ?? 0) < 0.8) d.twist += f.roll - d.rollPrev;
  d.rollPrev = f.roll;
  if (Math.abs(d.twist) >= TWIST_STEP) {
    d.twist = 0;
    toggleRiichi();
  }
}

function toggleRiichi() {
  if (!state.options?.riichi && !state.riichiIntent) return toast('지금은 리치할 수 없습니다 (멘젠 텐파이가 아님).', 2000);
  state.riichiIntent = !state.riichiIntent;
  scene.setCarrySideways(state.riichiIntent);
  render();
}


// ---------- beginner's guide ----------

const HEAD = (t) => `<h3>${t}</h3>`;
const P = (t) => `<p>${t}</p>`;
const threats = (s) => [0, 1, 2, 3].filter((o) => o !== s && state.riichi[o]);
const isSafeFor = (s, t) => threats(s).every((o) => state.rivers[o].some((d) => typeOf(d.id) === t));

const CIRCLED = ['①', '②', '③', '④'];

/** A short reason why a single tile is a weak part of the hand. */
function tileTag(c, t) {
  if (isHonor(t) && c[t] === 1) return '짝 없는 자패';
  if (isTerminal(t) && c[t] === 1) return '1·9 단독';
  const near = [-2, -1, 1, 2].some((d) => { const x = t + d; return t < 27 && x >= 0 && x < 27 && Math.floor(x / 9) === Math.floor(t / 9) && c[x]; });
  if (t < 27 && c[t] === 1 && !near) return '외톨이';
  if (c[t] >= 2) return '짝을 깸';
  return '몸통 후보를 깸';
}

/**
 * Reasonable discards, best first (up to 4): every tile whose removal keeps the hand as close to
 * winning as possible, ranked by acceptance (and safety against a riichi).
 */
function discardCandidates() {
  const c = counts(handTypes(0)), m = state.melds[0].length, u = unseen(0);
  if (state.riichi[0]) return [{ t: typeOf(state.drawn), s: 0, u: 0, tag: '리치 중', only: true }];
  const th = threats(0);
  const list = [];
  for (let t = 0; t < 34; t++) {
    if (!c[t]) continue;
    const tag = tileTag(c, t);
    c[t]--;
    const sh = shanten(c, m);
    const w = sh === 0 ? waits(c, m) : [];
    const acc = sh === 0 ? w.reduce((a, x) => a + u[x], 0) : sh <= 3 ? ukeire(c, m, u) : 0;
    c[t]++;
    const safe = th.length ? isSafeFor(0, t) : null;
    list.push({ t, s: sh, u: acc, w, tag, safe });
  }
  const sh0 = shanten(c, m);
  const folding = th.length && sh0 >= 2;
  const score = (x) => (folding ? (x.safe ? 1e6 : 0) : 0) - x.s * 1000 + x.u + (th.length && x.safe ? 30 : 0) + (isYaochu(x.t) ? 3 : 0);
  list.sort((x, y) => score(y) - score(x));
  const bestS = list[0].s;
  const top = list.filter((x) => (folding ? x.safe === list[0].safe : x.s === bestS)).slice(0, 4);
  return top.length ? top : list.slice(0, 1);
}

function candidateLine(x) {
  if (x.only) return '리치 중이라 가져온 패만 버릴 수 있습니다';
  if (x.s === 0) return `텐파이 · 대기 ${x.w.map(faceImg).join('')} ${x.u}장`;
  return `${x.tag} · 유효패 ${x.u}장${x.safe ? ' · 현물(안전)' : ''}`;
}

/** Why the first candidate beats the others. */
function recommendReason(list) {
  const [a, b] = list;
  const th = threats(0);
  if (a.only) return '리치하면 손을 바꿀 수 없습니다.';
  if (th.length && a.safe && !(b?.safe)) return `<b>${th.map((o) => NAMES[o]).join(', ')}</b>가 리치했습니다. 이 패는 그 사람 하천에 이미 있는 <b>현물</b>이라 버려도 론 당하지 않습니다.`;
  if (!b) return a.s === 0 ? '이 패를 버리면 텐파이가 됩니다.' : '손을 가장 빨리 완성할 수 있는 선택입니다.';
  if (a.s === 0) return a.u > b.u ? `텐파이 후 기다리는 패가 가장 많습니다 (${a.u}장, 다음은 ${b.u}장).` : '대기 장수가 같다면 쓸모가 적은 패부터 버립니다.';
  if (a.u > b.u) return `남겨 둔 패로 완성에 가까워질 수 있는 패(유효패)가 가장 많습니다 — ${a.u}장, 다음 후보는 ${b.u}장.`;
  if (isHonor(a.t)) return '효율이 같다면 쓰임새가 적은 <b>자패</b>부터 정리하는 것이 기본입니다.';
  if (isTerminal(a.t)) return '효율이 같다면 이어 붙기 어려운 <b>1·9</b>부터 정리합니다.';
  return '효율이 같다면 가장 고립된 패부터 버립니다.';
}

/** Whether calling this discard is a good idea for a beginner, and why. */
function recommendCall(opts, t) {
  if (opts.ron) return { kind: 'ron', why: '이 패로 손이 완성됩니다. <b>론</b>을 고르세요!' };
  const valuable = t >= HAKU || t === seatWind(0) || t === EAST;
  if (opts.pon && valuable) return { kind: 'pon', why: `<b>${tileName(t)}</b> 세 장은 그 자체로 역(역패 1판)입니다. <b>퐁</b> 추천.` };
  if (!isClosed(0) && (opts.pon || opts.chi?.length)) return { kind: opts.pon ? 'pon' : 'chi', why: '이미 울었으니 몸통을 빨리 만드는 편이 낫습니다.' };
  return { kind: null, why: '울면 손이 공개되어 <b>리치</b>를 할 수 없고, 역이 없으면 이길 수도 없습니다. 처음에는 <b>패스</b>하고 멘젠(울지 않은 손)을 지키세요.' };
}

function renderGuide() {
  const box = $('#guide-body');
  // Only recompute when the situation changes (render also runs on every pointer move).
  const key = [state.phase, state.turn, state.hands[0].join(','), state.riichi.join(), state.callWin?.id, Boolean(state.options?.tsumo), shell.handActive()].join('|');
  if (box.dataset.key === key) return;
  box.dataset.key = key;
  let html = '';
  const ph = state.phase;
  const c = counts(handTypes(0)), m = state.melds[0].length;
  if (ph === 'deal') {
    html = HEAD('목표') + P('14장으로 <b>몸통 4개 + 머리 1개</b>를 먼저 만들면 이깁니다.')
      + P('몸통 = 같은 패 3장(예: 東東東) 또는 이어진 숫자 3장(예: 3·4·5만). 머리 = 같은 패 2장.')
      + P('매 차례 산에서 <b>1장 가져오고 1장 버립니다</b>.');
  } else if (ph === 'draw') {
    html = HEAD('가져오기') + P('당신 차례입니다. 산에서 <b>밝게 빛나는 패</b>("가져오기" 표시)를 집어 내 앞으로 가져오세요.') + P(`지금 손: 완성까지 <b>${Math.max(0, shanten(c, m))}장</b> 더 필요 (샹텐).`);
  } else if (ph === 'discard') {
    if (state.options?.tsumo) {
      const y = state.options.tsumo.yaku.map((x) => x.name).join(' · ');
      html = HEAD('쯔모!') + P(`가져온 패로 손이 완성됐습니다 (<b>${y}</b>). <b>쯔모</b> 버튼을 누르세요.`);
    } else {
      const list = state.guideCands = discardCandidates();
      const rec = state.guideRec = list[0];
      html = HEAD('버리기');
      if (list.length > 1) {
        html += P(`밝게 빛나는 <b>후보 ${list.length}장</b>:`) + `<ol class="cands">${list.map((x, i) => `<li class="${i ? '' : 'best'}"><span class="no">${CIRCLED[i]}</span>${faceImg(x.t)}<span>${candidateLine(x)}</span></li>`).join('')}</ol>`
          + P(`그중 <b>${CIRCLED[0]} ${tileName(rec.t)}</b>을 추천합니다. <span class="why">이유: ${recommendReason(list)}</span>`);
      } else {
        html += P(`추천: ${faceImg(rec.t)} <b>${tileName(rec.t)}</b> — ${candidateLine(rec)}`) + P(`<span class="why">이유: ${recommendReason(list)}</span>`);
      }
      if (state.options?.riichi) html += HEAD('리치할 수 있어요') + P('텐파이이고 울지 않았습니다. 버릴 때 <b>리치</b>하면 역 1판이 생기고 점수가 커집니다. 대신 1000점을 걸고, 이후엔 가져온 패만 버려야 합니다.') + P(shell.handActive() ? '패를 든 채 <b>손목을 비틀어</b> 가로로 눕히고 하천에 놓으세요.' : '<b>리치</b> 버튼(또는 R 키)을 누른 뒤 추천 패를 하천에 놓으세요.');
      if (rec.s === 0 && !isClosed(0)) {
        c[rec.t]--;
        const noYaku = waits(c, m).every((x) => !evaluate({ ...winCtx(0, x, false, { ronTile: x }), closed: [...handTypes(0).filter((_, i, arr) => i !== arr.indexOf(rec.t)), x] }));
        c[rec.t]++;
        if (noYaku) html += P('⚠ 이 손은 울어서 <b>역이 없습니다</b>. 완성돼도 이길 수 없으니 역(역패, 탕야오 등)을 만들어야 해요.');
      }
    }
  } else if (ph === 'call' && state.callWin) {
    const t = typeOf(state.callWin.id);
    const rec = state.guideCall = recommendCall(state.callWin.opts, t);
    const kinds = callChoices(state.callWin.opts).map((x) => ({ ron: '론', pon: '퐁', kan: '깡', chi: '치' }[x.kind]));
    html = HEAD('가져올 수 있어요') + P(`${NAMES[state.callWin.from]}가 버린 ${faceImg(t)}로 <b>${[...new Set(kinds)].join(' · ')}</b>가 가능합니다.`)
      + P('<b>퐁</b> = 같은 패 2장 + 이 패. <b>치</b> = 왼쪽 사람 패로 이어진 숫자 3장. <b>론</b> = 이 패로 완성.')
      + P(`추천: <b>${rec.kind ? { ron: '론', pon: '퐁', chi: '치', kan: '깡' }[rec.kind] : '패스'}</b> — ${rec.why}`);
  } else if (ph === 'ai' || ph === 'after-discard') {
    const th = threats(0);
    html = state.turn === 0 ? HEAD('버렸습니다') + P('다른 사람이 이 패로 울거나 론할 수 있는지 잠시 기다립니다.')
      : HEAD(`${NAMES[state.turn]} 차례`) + P('상대가 버리는 패를 지켜보세요. 상대에게 필요 없는 패를 알 수 있습니다.');
    if (th.length) html += P(`<b>${th.map((o) => NAMES[o]).join(', ')}</b> 리치 중 — 그 사람 하천의 패는 안전한 패(현물)입니다.`);
    const w = shanten(c, m) === 0 ? waits(c, m) : [];
    if (w.length) html += P(`당신은 텐파이입니다. 대기: ${w.map(faceImg).join('')}`);
  } else if (ph === 'over-hand') {
    html = HEAD('한 국이 끝났습니다') + P('결과 창에서 누가 어떤 역으로 이겼는지 보세요. <b>판</b>이 많을수록 점수가 큽니다.');
  }
  if (html === box.dataset.html) return;
  box.dataset.html = html;
  box.innerHTML = html;
  document.querySelectorAll('.call-opt').forEach((b, i) => {
    const kind = state.callWin ? callChoices(state.callWin.opts)[i]?.kind : null;
    b.classList.toggle('rec', Boolean(guideOn && state.guideCall && kind === state.guideCall.kind));
  });
  $('#b-pass').classList.toggle('rec', Boolean(guideOn && state.guideCall && !state.guideCall.kind));
}

/** Hovered tile glows gold; in guide mode the candidate discards glow bright and the recommended one green. */
function applyHandGlows() {
  const cands = guideOn && state.phase === 'discard' && !state.options?.tsumo ? state.guideCands ?? [] : [];
  state.tagged = [];
  const used = new Set();
  cands.forEach((x, i) => {
    const pool = state.hands[0].filter((id) => typeOf(id) === x.t && !used.has(id) && (!state.riichi[0] || id === state.drawn));
    const id = pool.includes(state.drawn) ? state.drawn : pool[pool.length - 1];
    if (id === undefined) return;
    used.add(id);
    state.tagged.push({ id, label: i === 0 ? `${CIRCLED[0]} 추천` : CIRCLED[i], best: i === 0 });
  });
  for (const id of state.hands[0]) {
    const tag = state.tagged.find((x) => x.id === id);
    let g = null;
    if (id === state.hover) g = { color: COLOR.hover, intensity: 0.5, pulse: false };
    else if (tag?.best) g = { color: COLOR.hint, intensity: 0.7, pulse: true };
    else if (tag) g = { color: 0xfff0c8, intensity: 0.42, pulse: false };
    scene.setGlow(id, g);
  }
  if (state.phase === 'draw' && state.drawTarget !== null) state.tagged.push({ id: state.drawTarget, label: '가져오기', best: true });
  if (guideOn && state.phase === 'call' && state.callWin) state.tagged.push({ id: state.callWin.id, label: '가져올 수 있음', best: true });
}

function setGuide(on) {
  guideOn = on;
  try { localStorage.setItem(GUIDE_KEY, on ? 'on' : 'off'); } catch { /* ignore */ }
  document.body.classList.toggle('guide', on);
  $('#guide-toggle').textContent = on ? '가이드 끄기' : '가이드 켜기';
  $('#guide-start').checked = on;
  $('#guide-body').dataset.html = '';
  $('#guide-body').dataset.key = '';
  $('#hint-body').dataset.key = '';
  render();
}

// ---------- UI ----------

function render(full = true) {
  if (!state.started) return;
  $('#score').textContent = fmt(state.scores[0]);
  $('#round').textContent = `${WINDS[0]} ${state.roundNo}국`;
  $('#left').textContent = Math.max(0, liveLeft());
  scene.setRoundLabel('동', state.roundNo, Math.max(0, liveLeft()));
  scene.zoneOn = state.drag?.kind === 'discard';
  const myDiscard = state.phase === 'discard';
  const o = state.options ?? {};
  $('#b-riichi').hidden = !(myDiscard && (o.riichi || state.riichiIntent));
  $('#b-riichi').classList.toggle('on', state.riichiIntent);
  $('#b-tsumo').hidden = !(myDiscard && o.tsumo);
  $('#b-kan').hidden = !(myDiscard && o.kans?.length);
  const cw = state.callWin;
  $('#callbox').hidden = !cw;
  if (cw && full) {
    $('#call-what').innerHTML = `${NAMES[cw.from]}의 버림패 ${faceImg(typeOf(cw.id))}`;
    $('#call-opts').innerHTML = callChoices(cw.opts).map((c, i) => {
      const t = typeOf(cw.id);
      const tiles = c.kind === 'chi' ? [...c.pair, t].sort((a, b) => a - b) : c.kind === 'ron' ? [t] : new Array(c.kind === 'kan' ? 4 : 3).fill(t);
      return `<button class="call-opt" data-i="${i}"><span>${{ ron: '론', pon: '퐁', kan: '깡', chi: '치' }[c.kind]}</span><span class="tiles">${tiles.map(faceImg).join('')}</span></button>`;
    }).join('');
  }
  updateBanner();
  if (guideOn) renderGuide(); else renderHint();
  const before = (state.tagged ?? []).map((x) => x.id).join();
  applyHandGlows();
  if (state.phase === 'discard' && before !== state.tagged.map((x) => x.id).join()) layoutHand(0);
  renderSeats();
}

function updateBanner() {
  const hand = shell.handActive();
  const pinch = hand ? '핀치해' : '눌러';
  let html, tone = '';
  const d = state.drag;
  if (d?.kind === 'discard') { tone = state.riichiIntent ? 'target' : 'held'; html = state.riichiIntent ? '<b>리치</b>로 버립니다 — 가운데 하천에 놓으세요.' : `가운데 <b>하천</b>에 놓으면 버립니다.${state.options?.riichi ? (hand ? ' 손목을 비틀면 <b>리치</b>.' : ' R 키 또는 리치 버튼으로 <b>리치</b>.') : ''}`; }
  else if (d?.kind === 'call') { tone = 'held'; html = '내 쪽으로 끌어와 놓으면 가져옵니다.'; }
  else if (state.phase === 'draw') { tone = 'hover'; html = `반짝이는 <b>산의 패</b>를 ${pinch} 가져오세요.`; }
  else if (state.phase === 'discard') { tone = 'hover'; html = state.options?.tsumo ? '<b>쯔모!</b> 화료할 수 있습니다 — 쯔모 버튼, 또는 버리고 계속.' : state.riichi[0] ? '리치 중 — 가져온 패가 자동으로 나갑니다.' : `버릴 패를 ${pinch} 가운데 <b>하천</b>에 놓으세요.`; }
  else if (state.phase === 'call') { tone = 'hint'; html = `버림패를 가져올 수 있습니다 — 그 패를 <b>내 쪽으로 끌어오거나</b> 아래에서 고르세요. 가만히 있으면 패스.`; }
  else if (state.phase === 'ai' || state.phase === 'after-discard') html = `${NAMES[state.turn]} 차례…`;
  else if (state.phase === 'deal') html = '패를 나누는 중…';
  else html = '…';
  if (html === $('#banner').dataset.html) return;
  $('#banner').dataset.html = html;
  $('#banner-text').innerHTML = html;
  $('#banner .gem').className = `gem ${tone}`;
}

function renderHint() {
  const box = $('#hint-body');
  if (state.phase !== 'discard' || state.riichi[0]) { box.innerHTML = state.riichi[0] ? `<p>리치 중 · 대기 ${waits(counts(handTypes(0).filter((_, i) => state.hands[0][i] !== state.drawn)), state.melds[0].length).map(faceImg).join('')}</p>` : '<p>당신 차례가 되면 여기에 추천이 뜹니다.</p>'; return; }
  const key = state.hands[0].join(',');
  if (box.dataset.key === key) return;
  box.dataset.key = key;
  const c = counts(handTypes(0)), m = state.melds[0].length, u = unseen(0);
  const tenpai = [];
  for (let t = 0; t < 34; t++) {
    if (!c[t]) continue;
    c[t]--;
    if (shanten(c, m) === 0) { const w = waits(c, m); tenpai.push({ t, w, n: w.reduce((a, x) => a + u[x], 0) }); }
    c[t]++;
  }
  if (tenpai.length) {
    tenpai.sort((a, b) => b.n - a.n);
    box.innerHTML = tenpai.slice(0, 2).map((x) => `<p>${faceImg(x.t)} 버리면 <b>텐파이</b><br>대기 ${x.w.map(faceImg).join('')} · ${x.n}장</p>`).join('');
  } else {
    const best = bestDiscard(c, m, u);
    box.innerHTML = `<p><b>${shanten(c, m)}샹텐</b> — 추천 ${faceImg(best.t)} (유효패 ${best.u}장)</p>`;
  }
}

function renderSeats() {
  for (let s = 1; s <= 3; s++) {
    const el = $(`#seat-${s}`);
    el.querySelector('.wind').textContent = WINDS[(s - state.dealer + 4) % 4];
    el.querySelector('.pts').textContent = fmt(state.scores[s]);
    el.querySelector('.st').textContent = state.riichi[s] ? '리치' : '';
    el.classList.toggle('turn', state.turn === s && ['ai', 'after-discard'].includes(state.phase));
    const b = el.querySelector('.say'), sv = state.say[s];
    const on = sv && performance.now() - sv.at < 1600;
    b.textContent = sv?.text ?? '';
    b.classList.toggle('show', Boolean(on));
  }
  $('#my-wind').textContent = WINDS[(0 - state.dealer + 4) % 4];
  const sv = state.say[0];
  $('#my-say').textContent = sv && performance.now() - sv.at < 1600 ? sv.text : '';
}
setInterval(renderSeats, 250);

function placeTags() {
  const box = $('#tile-tags');
  const tags = !modalOpen() && !state.drag ? (state.tagged ?? []).filter((t) => guideOn || state.phase === 'draw') : [];
  while (box.children.length < tags.length) box.append(document.createElement('div'));
  [...box.children].forEach((el, i) => {
    const tag = tags[i];
    el.hidden = !tag;
    if (!tag) return;
    const o = scene.tile(tag.id);
    if (!o) { el.hidden = true; return; }
    const p = o.root.position, pt = scene.toScreen(p.x, p.y + 0.34, p.z);
    el.textContent = tag.label;
    el.className = `tile-tag${tag.best ? ' best' : ''}`;
    el.style.transform = `translate(${pt.x}px, ${pt.y}px) translate(-50%, -100%)`;
  });
}

function placeLabels() {
  placeTags();
  for (let s = 1; s <= 3; s++) {
    const pt = scene.seatScreen(s);
    $(`#seat-${s}`).style.transform = `translate(${pt.x}px, ${pt.y}px) translate(-50%, -50%)`;
  }
  requestAnimationFrame(placeLabels);
}
requestAnimationFrame(placeLabels);

shell.attach({
  modalOpen,
  dragging: () => Boolean(state.drag),
  startDrag, moveDrag, endDrag, cancelDrag, updateHover, onHandPose,
  refresh: () => render(false),
});

$('#b-riichi').addEventListener('click', toggleRiichi);
$('#b-tsumo').addEventListener('click', () => {
  const r = state.options?.tsumo;
  if (r && state.phase === 'discard') win(0, { tsumo: true, tile: state.drawn, result: r });
});
$('#b-kan').addEventListener('click', () => { if (state.phase === 'discard' && state.options?.kans?.length) declareAnkan(state.options.kans[0]); });
$('#b-pass').addEventListener('click', () => state.wait?.kind === 'call' && state.wait.resolve(null));
$('#call-opts').addEventListener('click', (e) => {
  const b = e.target.closest('.call-opt');
  if (b && state.callWin) state.wait?.resolve(callChoices(state.callWin.opts)[Number(b.dataset.i)]);
});
$('#res-next').addEventListener('click', nextHand);
$('#guide-toggle').addEventListener('click', () => setGuide(!guideOn));
$('#guide-start').addEventListener('change', (e) => setGuide(e.target.checked));
setGuide(guideOn);
$('#end-again').addEventListener('click', newGame);
addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'r' && state.phase === 'discard') toggleRiichi(); });
$('#stage').addEventListener('contextmenu', (e) => { e.preventDefault(); if (state.drag?.kind === 'discard') toggleRiichi(); });
for (const id of ['#btn-start-mouse', '#btn-start-cam']) $(id).addEventListener('click', () => { if (!state.started) newGame(); }, { once: true });

// Debug / test handle
window.__mj = { state, scene, discard, playTurn, hand: shell.injectHandFrame, evaluate, winCtx };
