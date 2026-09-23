// 손기술 — 섯다 with sleight of hand. Game flow, betting AI, the sleights, suspicion and the
// movie-style standoff (결판): when caught, the contested card stays face-down while both
// sides stake everything on whether it really was a sleight.
import { deckCards, shuffle, handOf, showdown, strength, cardName } from './sutda-logic.js';
import { SutdaScene, SEATS, POT, SLEEVE, CHIPS, CW } from './sutda-scene.js';
import { createShell } from './shell.js';
import { COLOR } from './stage.js';

const $ = (sel) => document.querySelector(sel);
const ANTE = 10;
const START_MONEY = 1000;
const ACCUSE_AT = 80; // suspicion at which an opponent calls it
const SWAP_MS = 1200; // a sleeve swap must be done within this
const READ_MS = 1400; // hover this long over an opponent's card to read its mark
const PEEK_PX = 0.16; // share of the window height a card is lifted to be fully seen
const STAKES = [0.3, 0.5, 1];

const AI_DEFS = [
  { name: '강 사장', money: 1500, aggr: 0.7, bluff: 0.18, percept: 1.0, gaze: 0.22 },
  { name: '도 박사', money: 2500, aggr: 0.45, bluff: 0.08, percept: 1.4, gaze: 0.34 },
  { name: '남 선생', money: 800, aggr: 0.25, bluff: 0.05, percept: 0.8, gaze: 0.18 },
];

const scene = new SutdaScene($('#stage'));
const shell = createShell({ scene, gameId: 'sutda' });
const { log, toast, onStage } = shell;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (n) => Math.round(n).toLocaleString('en-US');
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
/** Korean particle after a name: josa('도 박사', '이', '가') -> '도 박사가'. */
const josa = (word, withFinal, without) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return word + (code >= 0 && code < 11172 && code % 28 ? withFinal : without);
};

const state = {
  players: [], round: 0, dealer: 0, deck: [], pot: 0, carry: 0,
  phase: 'idle', turn: null, currentBet: 0, raises: 0,
  sleeve: null, drag: null, hover: null, read: new Set(),
  fakePending: false, standoff: null, stats: { best: START_MONEY, sleights: 0 },
};
const me = () => state.players[0];
const live = () => state.players.filter((p) => p.inRound && !p.folded);
const ais = () => state.players.filter((p) => p.ai && !p.gone);

function newGame() {
  state.players = [
    { seat: 0, name: '나', ai: false, money: START_MONEY },
    ...AI_DEFS.map((d, i) => ({ ...d, seat: i + 1, ai: true, sus: 0, gazing: false })),
  ];
  for (const p of state.players) Object.assign(p, { gone: false, cards: [], folded: false, bet: 0, inRound: false, note: '' });
  state.round = 0;
  state.dealer = 0;
  state.pot = state.carry = 0;
  state.stats = { best: START_MONEY, sleights: 0 };
  const good = deckCards().filter((c) => c.kind === 'gwang' || c.month === 10);
  state.sleeve = good[Math.floor(Math.random() * good.length)];
  $('#modal-over').hidden = true;
  startRound();
}

// ---------- layout ----------

function slot(seat, i) {
  const off = (i - 0.5) * (CW + 0.22);
  if (seat === 0) return { x: off, z: 1.75, yaw: 0 };
  if (seat === 2) return { x: -off, z: -1.55, yaw: Math.PI };
  const x = seat === 1 ? -3.55 : 3.55;
  return { x, z: 0.1 + (seat === 1 ? off : -off), yaw: seat === 1 ? -Math.PI / 2 : Math.PI / 2 };
}
const DECK_AT = [{ x: 1.9, z: 1.75 }, { x: -3.4, z: 1.55 }, { x: -1.9, z: -1.45 }, { x: 3.4, z: -1.35 }];

function layDeck() {
  const at = DECK_AT[state.dealer];
  const mine = state.dealer === 0 && state.phase === 'selfdeal';
  state.deck.forEach((c, i) => {
    const bottom = i === state.deck.length - 1;
    const up = mine && bottom;
    scene.place(c, { x: at.x, z: at.z + (up ? 0.42 : 0), y: bottom ? 0 : (state.deck.length - 1 - i) * 0.017 + 0.017, faceUp: up });
    scene.setPick(c, mine ? (i === 0 ? { kind: 'deck-top' } : bottom ? { kind: 'deck-bottom' } : null) : null);
  });
}

// ---------- round ----------

async function startRound() {
  state.round++;
  for (const p of state.players) {
    if (p.ai && !p.gone && p.money <= 0) p.gone = true;
    p.sus = p.ai ? Math.max(0, (p.sus ?? 0) - 8) : 0;
  }
  if (me().money <= 0) return gameOver('파산', '재산을 모두 잃었습니다.');
  if (!ais().length) return gameOver('판을 평정했습니다', '상대가 모두 판을 떠났습니다.', true);

  state.read.clear();
  state.fakePending = false;
  state.pot = state.carry;
  state.carry = 0;
  for (const p of state.players) {
    Object.assign(p, { cards: [], folded: false, bet: 0, inRound: !p.gone && p.money > 0, note: '', allin: false });
    if (p.inRound) { const a = Math.min(ANTE, p.money); p.money -= a; state.pot += a; }
  }
  do state.dealer = (state.dealer + 1) % 4; while (!state.players[state.dealer].inRound);
  scene.clearCards();
  scene.resetChipToken();
  state.deck = shuffle(deckCards());
  state.phase = 'deal';
  layDeck();
  render();
  await sleep(500);

  const order = [];
  for (let k = 1; k <= 4; k++) { const p = state.players[(state.dealer + k) % 4]; if (p.inRound) order.push(p); }
  for (let pass = 0; pass < 2; pass++) {
    for (const p of order) {
      if (p.seat === 0 && state.dealer === 0) continue; // the player deals to themself by hand
      deal(p, state.deck.shift());
      await sleep(170);
    }
  }
  if (state.dealer === 0) {
    state.phase = 'selfdeal';
    layDeck();
    render();
    return;
  }
  await sleep(400);
  beginBetting();
}

function deal(p, card, { from = null } = {}) {
  const i = p.cards.length;
  p.cards.push(card);
  const s = slot(p.seat, i);
  if (from) scene.place(card, from);
  scene.moveTo(card, { ...s, faceUp: false, dur: 0.35, arc: 0.3 });
  scene.setPick(card, p.seat === 0 ? { kind: 'mine', i } : { kind: 'opp', seat: p.seat, i });
}

// ---------- betting ----------

function beginBetting() {
  state.phase = 'bet';
  state.currentBet = 0;
  state.raises = 0;
  for (const p of state.players) { p.bet = 0; p.acted = false; }
  state.turn = state.dealer;
  nextTurn();
}

function nextTurn() {
  if (state.phase !== 'bet') return;
  const alive = live();
  if (alive.length <= 1) return finish(alive);
  const needs = (p) => !p.allin && (!p.acted || p.bet < state.currentBet);
  if (!alive.some(needs)) return reveal();
  for (let k = 1; k <= 4; k++) {
    const p = state.players[(state.turn + k) % 4];
    if (p.inRound && !p.folded && needs(p)) { state.turn = p.seat; break; }
  }
  render();
  const p = state.players[state.turn];
  if (p.ai) setTimeout(() => { if (state.phase === 'bet' && state.turn === p.seat) aiAct(p); }, 650 + Math.random() * 700);
}

function pay(p, amount) {
  const a = Math.min(amount, p.money);
  p.money -= a;
  p.bet += a;
  state.pot += a;
  if (p.money === 0) p.allin = true;
}

function act(p, action) {
  const toCall = state.currentBet - p.bet;
  if (action === 'die') {
    p.folded = true;
    p.note = '다이';
    for (const c of p.cards) { scene.setPick(c, null); scene.moveTo(c, { x: POT.x + (Math.random() - 0.5) * 1.4, z: POT.z + (Math.random() - 0.5) * 0.8, yaw: Math.random() * 3, faceUp: false, dur: 0.4 }); }
  } else if (action === 'raise') {
    const target = Math.max(state.currentBet * 2, ANTE * 2);
    pay(p, target - p.bet);
    state.currentBet = Math.max(state.currentBet, p.bet);
    state.raises++;
    for (const o of state.players) if (o !== p) o.acted = false;
    p.note = '따당';
  } else if (action === 'bet') {
    pay(p, ANTE);
    state.currentBet = p.bet;
    for (const o of state.players) if (o !== p) o.acted = false;
    p.note = '삥';
  } else {
    if (toCall > 0) pay(p, toCall);
    p.note = toCall > 0 ? '콜' : '체크';
  }
  p.acted = true;
  log.event('bet', { seat: p.seat, action, pot: state.pot });
  nextTurn();
}

function aiAct(p) {
  const hand = handOf(p.cards);
  const s = strength(hand) + (Math.random() < p.bluff ? 0.4 : 0);
  const toCall = state.currentBet - p.bet;
  const pressure = toCall / (p.money + p.bet + 1);
  let a;
  if (s > 0.82 && state.raises < 3 && Math.random() < p.aggr + 0.25) a = 'raise';
  else if (toCall === 0) a = s > 0.6 && Math.random() < p.aggr ? 'bet' : 'call';
  else if (s > 0.45 + pressure * 0.6) a = 'call';
  else if (toCall <= ANTE * 2 && s > 0.25) a = 'call';
  else a = 'die';
  act(p, a);
}

async function reveal() {
  state.phase = 'showdown';
  render();
  const alive = live();
  for (const p of alive) for (const c of p.cards) { const o = scene.obj(c); if (o && !o.faceUp) scene.setFaceUp(o, true); }
  await sleep(700);
  const res = showdown(alive.map((p) => ({ id: p.seat, hand: handOf(p.cards) })));
  const names = alive.map((p) => `${p.name} ${handOf(p.cards).name}`).join(' · ');
  if (res.rematch) {
    state.carry = state.pot;
    state.pot = 0;
    banner(`${res.reason}. 판돈은 다음 판으로 넘어갑니다.`, 'hint');
  } else {
    const share = Math.floor(state.pot / res.winners.length);
    for (const id of res.winners) state.players[id].money += share;
    const who = res.winners.map((id) => state.players[id].name).join(', ');
    banner(`${who} 승 — ${res.reason ? `${res.reason}. ` : ''}${names}`, res.winners.includes(0) ? 'hint' : 'target');
    for (const id of res.winners) for (const c of state.players[id].cards) scene.setGlow(c, { color: COLOR.hint, intensity: 0.5, pulse: true });
    state.pot = 0;
  }
  endRound();
}

function finish(alive) {
  const w = alive[0];
  if (w) w.money += state.pot;
  banner(`${w?.name ?? '아무도'} 승 — 모두 죽었습니다.`, w?.seat === 0 ? 'hint' : 'target');
  state.pot = 0;
  state.phase = 'showdown';
  endRound();
}

function endRound() {
  state.phase = 'done';
  state.stats.best = Math.max(state.stats.best, me().money);
  render(false);
}

// ---------- AI attention ----------

setInterval(() => {
  const busy = ['deal', 'selfdeal', 'bet'].includes(state.phase);
  for (const p of ais()) {
    if (p.gazing) { if (performance.now() > p.gazeUntil || !busy) p.gazing = false; }
    else if (busy && Math.random() < p.gaze * 0.12) { p.gazing = true; p.gazeUntil = performance.now() + 1500 + Math.random() * 2000; }
  }
  renderSeats();
}, 250);

/** A sleight (or something that looks like one) raises suspicion; watchers raise it far more. */
function suspect(base, what) {
  let witness = null;
  for (const p of ais()) {
    const amount = base * p.percept * (p.gazing ? 1.9 : 0.6);
    p.sus = clamp(p.sus + amount, 0, 100);
    if (p.gazing && (!witness || p.sus > witness.sus)) witness = p;
  }
  log.event('suspect', { what, base, sus: ais().map((p) => Math.round(p.sus)), witness: witness?.seat ?? null });
  renderSeats();
  return witness;
}

/** After a (real or apparent) sleight, the most suspicious opponent may call it. */
function maybeAccuse(card, guilty, what, witness) {
  const cands = ais().filter((p) => p.sus >= ACCUSE_AT || (p === witness && p.sus >= 60));
  if (!cands.length) return false;
  const accuser = cands.sort((a, b) => b.sus - a.sus)[0];
  startStandoff({ accuser, card, guilty, what, saw: accuser === witness });
  return true;
}

// ---------- the player's hands on the table ----------

const modalOpen = () => shell.introOpen() || !$('#modal-over').hidden || Boolean(state.standoff);

function updateHover(x, y) {
  let h = null;
  if (x !== null && !state.drag && !modalOpen() && onStage(x, y)) h = scene.pick(x, y);
  scene.hoverOn = Boolean(h);
  if (h?.kind === 'opp' && ['bet', 'deal', 'selfdeal'].includes(state.phase)) {
    const p = state.players[h.seat], card = p.cards[h.i];
    if (!state.read.has(card.id)) {
      if (state.hover?.card !== card) state.hover = { card, since: performance.now() };
      else if (performance.now() - state.hover.since > READ_MS) {
        state.read.add(card.id);
        scene.setGlow(card, { color: 0xb89b5e, intensity: 0.35, pulse: false });
        state.stats.sleights++;
        const w = suspect(8, 'read');
        toast(`${p.name}의 패 표시: ${cardName(card)}`, 2600);
        log.event('sleight', { what: 'read', card: card.id });
        maybeAccuse(card, false, 'read', w) || renderSeats();
      }
    }
  } else state.hover = null;
  render(false);
}

function startDrag(x, y) {
  if (modalOpen() || state.drag || !onStage(x, y)) return false;
  const h = scene.pick(x, y);
  if (!h) return false;
  scene.pointer = { x, y };
  const t = performance.now();
  if (h.kind === 'deck-top' || h.kind === 'deck-bottom') {
    const bottom = h.kind === 'deck-bottom';
    const card = bottom ? state.deck[state.deck.length - 1] : state.deck[0];
    state.drag = { kind: 'deal', card, bottom, t };
    scene.carry(card);
  } else if (h.kind === 'mine') {
    const card = me().cards[h.i];
    state.drag = { kind: 'peek', card, i: h.i, y0: y, x0: x, t };
    scene.peeking = card;
  } else if (h.kind === 'chips') {
    if (state.phase !== 'bet' || state.turn !== 0) return false;
    state.drag = { kind: 'chips', t };
  } else return false;
  log.event('grab', { kind: state.drag.kind });
  render(false);
  return true;
}

function moveDrag(x, y) {
  const d = state.drag;
  if (!d) return;
  scene.pointer = { x, y };
  if (d.kind === 'peek') {
    const p = clamp((d.y0 - y) / (innerHeight * PEEK_PX), 0, 1);
    scene.setPeek(d.card, p);
    d.peek = p;
    // Pulled sideways instead of up: the card is being carried (to the sleeve or the pot).
    if (Math.abs(x - d.x0) > innerWidth * 0.06 && p < 0.5) {
      d.kind = 'carry';
      d.carryAt = performance.now();
      scene.peeking = null;
      scene.carry(d.card);
    }
  } else if (d.kind === 'chips') {
    const p = scene.pointerOnTable(0.3);
    if (p) scene.myChipToken.position.set(p.x, 0.3, p.z);
  }
  render(false);
}

function endDrag(x, y) {
  const d = state.drag;
  if (!d) return;
  scene.pointer = { x, y };
  state.drag = null;
  const at = scene.pointerOnTable(0);
  if (d.kind === 'deal') {
    scene.dropCarry();
    const mySlot = slot(0, me().cards.length);
    if (scene.dist(at, mySlot) < 1.2) takeDealt(d);
    else {
      if (d.bottom && scene.dist(at, DECK_AT[0]) < 1.4) { // put the bottom card back: a feint
        state.fakePending = true;
        suspect(20, 'feint');
        log.event('sleight', { what: 'feint' });
      }
      layDeck();
    }
  } else if (d.kind === 'peek') {
    scene.peeking = null;
    const o = scene.obj(d.card);
    if ((d.peek ?? 0) >= 0.75 && o && !o.faceUp) scene.setFaceUp(o, true);
    scene.setPeek(d.card, 0);
  } else if (d.kind === 'carry') {
    scene.dropCarry();
    if (scene.dist(at, SLEEVE) < 1.0 && state.sleeve && state.phase !== 'showdown' && state.phase !== 'done') swap(d);
    else if (scene.dist(at, POT) < 1.4 && state.phase === 'bet' && state.turn === 0) act(me(), 'die');
    else { const s = slot(0, d.i); scene.moveTo(d.card, { ...s, dur: 0.25, arc: 0.1 }); }
  } else if (d.kind === 'chips') {
    if (scene.dist(at, POT) < 1.4) playerBet(state.currentBet > me().bet ? 'call' : 'bet');
    scene.resetChipToken();
  }
  render();
}

function cancelDrag() {
  const d = state.drag;
  if (!d) return;
  state.drag = null;
  scene.dropCarry();
  scene.peeking = null;
  if (d.kind === 'deal') layDeck();
  else if (d.card) { scene.setPeek(d.card, 0); scene.moveTo(d.card, { ...slot(0, d.i ?? 0), dur: 0.25 }); }
  scene.resetChipToken();
  render();
}

function takeDealt(d) {
  const card = d.card;
  state.deck = state.deck.filter((c) => c !== card);
  deal(me(), card);
  const ms = performance.now() - d.t;
  let witness = null, what = null;
  if (d.bottom) {
    what = 'bottom';
    state.stats.sleights++;
    witness = suspect(22 * (ms < 900 ? 0.7 : ms > 2000 ? 1.3 : 1), 'bottom');
    log.event('sleight', { what: 'bottom', ms: Math.round(ms), card: card.id });
  } else if (state.fakePending) {
    what = 'feint';
    state.fakePending = false;
  }
  layDeck();
  if (what && maybeAccuse(card, what === 'bottom', what, witness)) return;
  if (me().cards.length >= 2) setTimeout(beginBetting, 400);
  render();
}

function swap(d) {
  const ms = performance.now() - d.carryAt;
  const old = d.card, fresh = state.sleeve;
  state.sleeve = old;
  const hand = me().cards;
  hand[d.i] = fresh;
  scene.remove(old);
  const s = slot(0, d.i);
  scene.place(fresh, { x: SLEEVE.x, z: SLEEVE.z, faceUp: true });
  scene.moveTo(fresh, { ...s, dur: 0.3, arc: 0.2 });
  scene.setPick(fresh, { kind: 'mine', i: d.i });
  state.stats.sleights++;
  const w = suspect(28 * (ms < SWAP_MS ? 0.6 : ms < SWAP_MS * 1.5 ? 1 : 1.5), 'swap');
  log.event('sleight', { what: 'swap', ms: Math.round(ms), card: fresh.id });
  maybeAccuse(fresh, true, 'swap', w);
}

// ---------- the standoff (결판) ----------

const tell = { moved: 0, since: 0, last: null, decidedAt: 0 };
function trackTell(x, y) {
  if (!state.standoff) return;
  if (tell.last) tell.moved += Math.hypot(x - tell.last[0], y - tell.last[1]);
  tell.last = [x, y];
}
addEventListener('pointermove', (e) => trackTell(e.clientX, e.clientY));

function startStandoff({ accuser, card, guilty, what, saw }) {
  cancelDrag();
  const prev = state.phase;
  state.phase = 'standoff';
  const base = me().money;
  const stakes = STAKES.map((f) => Math.max(ANTE, Math.min(Math.round(base * f), accuser.money)));
  state.standoff = { accuser, card, guilty, what, saw, prev, stakes, stage: 0, conf: saw ? 0.85 : 0.58, tellDone: false };
  Object.assign(tell, { moved: 0, since: performance.now(), last: null });
  scene.setStandoff(true);
  const o = scene.obj(card);
  if (o) { scene.spotOn(o.root.position.x, o.root.position.z, true); scene.setGlow(card, { color: COLOR.target, intensity: 0.6, pulse: true }); }
  log.event('accused', { by: accuser.seat, guilty, what, saw, sus: Math.round(accuser.sus) });
  const claim = { bottom: '밑장', feint: '밑장', swap: '바꿔친 패', read: '표시패를 훔쳐본 것' }[what];
  $('#so-claim').textContent = `${accuser.name}: “그 패, ${claim}이야. 뒤집어 보지.”`;
  $('#so-avatar').textContent = accuser.name[0];
  $('#standoff').hidden = false;
  renderStandoff();
  const hold = setInterval(() => {
    const t = (performance.now() - tell.since) / 3000;
    $('#so-hold').style.width = `${clamp(t, 0, 1) * 100}%`;
    if (t >= 1) {
      clearInterval(hold);
      state.standoff.tellDone = true;
      // Moving about during the freeze reads as nerves; utter stillness reads as confidence.
      const speed = tell.moved / 3; // px per second
      state.standoff.shake = clamp(speed / 250, 0, 1);
      state.standoff.conf = clamp(state.standoff.conf + (state.standoff.shake - 0.35) * 0.35, 0.3, 0.95);
      tell.decidedAt = performance.now();
      log.event('tell', { speed: Math.round(speed), conf: +state.standoff.conf.toFixed(2) });
      renderStandoff();
    }
  }, 100);
}

function renderStandoff() {
  const so = state.standoff;
  if (!so) return;
  const noise = () => (Math.random() - 0.5) * 24;
  $('#so-conf').style.width = `${clamp(so.conf * 100 + noise(), 5, 100)}%`;
  $('#so-hes').style.width = `${clamp((1 - so.conf) * 100 + noise(), 5, 100)}%`;
  $('#so-shake').style.width = `${(so.shake ?? 0) * 100}%`;
  document.querySelectorAll('.so-rung').forEach((el, i) => {
    el.className = `so-rung ${i < so.stage ? 'done' : i === so.stage ? 'now' : ''}`;
    el.querySelector('b').textContent = fmt(so.stakes[i]);
  });
  $('#so-take').textContent = `받기 · ${fmt(so.stakes[so.stage])}`;
  $('#so-all').textContent = `전재산 · ${fmt(so.stakes[2])}`;
  for (const id of ['#so-admit', '#so-take', '#so-all']) $(id).disabled = !so.tellDone;
  $('#so-take').hidden = so.stage >= 2;
}

function soDecide(choice) {
  const so = state.standoff;
  if (!so?.tellDone) return;
  const quick = performance.now() - tell.decidedAt < 1500;
  so.conf = clamp(so.conf + (quick ? -0.05 : 0.04), 0.3, 0.95);
  log.event('standoff', { choice, stage: so.stage, conf: +so.conf.toFixed(2) });
  if (choice === 'admit') {
    transfer(me(), so.accuser, so.stakes[so.stage]);
    me().folded = me().inRound; // out of this round
    for (const c of me().cards) scene.setPick(c, null);
    return endStandoff(`인정했습니다. ${so.accuser.name}에게 ${fmt(so.stakes[so.stage])}을 넘겼습니다.`);
  }
  if (choice === 'all') so.stage = 2;
  // Each raise gives the accuser a chance to back down; going all-in is the loudest raise.
  const withdraw = (1 - so.conf) * (choice === 'all' ? 1.05 : 0.6 + so.stage * 0.15);
  if (Math.random() < withdraw) {
    const amt = so.stakes[Math.min(so.stage, 2)];
    transfer(so.accuser, me(), amt);
    so.accuser.sus = 40;
    return endStandoff(`${josa(so.accuser.name, '이', '가')} 물러섰습니다. ${fmt(amt)}을 가져왔습니다.`);
  }
  if (so.stage >= 2) return flipContested();
  so.stage++;
  renderStandoff();
}

async function flipContested() {
  const so = state.standoff;
  for (const id of ['#so-admit', '#so-take', '#so-all']) $(id).disabled = true;
  const o = scene.obj(so.card);
  if (o && !o.faceUp) scene.setFaceUp(o, true);
  await sleep(900);
  const amt = so.stakes[2];
  let title, text, win;
  if (so.guilty) {
    transfer(me(), so.accuser, amt);
    title = { bottom: '밑장이었다', swap: '바꿔친 패였다' }[so.what] ?? '들켰다';
    text = `${josa(so.accuser.name, '이', '가')} ${fmt(amt)}을 가져갔습니다.`;
    win = false;
  } else {
    transfer(so.accuser, me(), amt);
    so.accuser.sus = 0;
    title = so.what === 'read' ? '증거가 없었다' : '위 패였다';
    text = so.what === 'feint' ? `쓰는 척이었습니다. ${fmt(amt)}을 가져왔습니다.` : `${so.accuser.name}의 주장은 틀렸습니다. ${fmt(amt)}을 가져왔습니다.`;
    win = true;
  }
  if (so.accuser.money <= 0) { so.accuser.gone = true; so.accuser.folded = true; text += ` ${josa(so.accuser.name, '은', '는')} 판을 떠났습니다.`; }
  log.event('reveal', { guilty: so.guilty, amt });
  $('#standoff').hidden = true;
  $('#rv-over').textContent = win ? 'REVEALED' : 'CAUGHT';
  $('#rv-title').textContent = title;
  $('#rv-text').textContent = text;
  $('#rv-money').textContent = fmt(me().money);
  $('#reveal').dataset.win = win;
  $('#reveal').hidden = false;
}

function transfer(from, to, amount) {
  const a = Math.min(amount, from.money);
  from.money -= a;
  to.money += a;
}

function endStandoff(message) {
  const so = state.standoff;
  state.standoff = null;
  $('#standoff').hidden = true;
  $('#reveal').hidden = true;
  scene.setStandoff(false);
  scene.spotOn(0, 0, false);
  scene.setGlow(so.card, { color: 0, intensity: 0, pulse: false });
  if (message) toast(message, 3400);
  if (me().money <= 0) return gameOver('파산', `결판에서 전재산을 잃었습니다.`);
  state.phase = so.prev === 'standoff' ? 'bet' : so.prev;
  if (state.phase === 'selfdeal' && me().cards.length >= 2) return beginBetting();
  if (state.phase === 'bet') { if (live().length <= 1) return finish(live()); nextTurn(); }
  render();
}

// ---------- UI ----------

function banner(html, tone = '') {
  state.bannerOverride = { html, tone };
  render(false);
}

function render(full = true) {
  const m = me();
  $('#money').textContent = fmt(m.money);
  $('#pot').textContent = fmt(state.pot);
  $('#round').textContent = String(state.round).padStart(2, '0');
  scene.setMoney(state.pot, m.money);
  const myTurn = state.phase === 'bet' && state.turn === 0 && !m.folded;
  const toCall = state.currentBet - m.bet;
  $('#b-bet').hidden = !(myTurn && state.currentBet === 0);
  $('#b-call').textContent = toCall > 0 ? `콜 · ${fmt(Math.min(toCall, m.money))}` : '체크';
  $('#b-raise').textContent = `따당 · ${fmt(Math.max(state.currentBet * 2, ANTE * 2) - m.bet)}`;
  for (const id of ['#b-call', '#b-raise', '#b-die']) $(id).disabled = !myTurn;
  $('#b-raise').disabled = !myTurn || state.raises >= 3;
  $('#b-next').hidden = state.phase !== 'done';
  for (const id of ['#b-call', '#b-raise', '#b-die']) $(id).hidden = state.phase === 'done';
  const dealing = state.phase === 'selfdeal';
  $('#sk-bottom').dataset.state = dealing ? 'ready' : 'off';
  $('#sk-bottom .st').textContent = dealing ? '준비됨' : '선일 때';
  $('#sk-swap .st').textContent = state.sleeve ? `소매 · ${cardName(state.sleeve)}` : '비어 있음';
  if (full) state.bannerOverride = state.phase === 'done' ? state.bannerOverride : null;
  updateBanner();
  renderSeats();
}

function updateBanner() {
  const hand = shell.handActive();
  const pinch = hand ? '핀치해' : '눌러';
  let html, tone = '';
  const d = state.drag;
  if (state.bannerOverride) ({ html, tone } = state.bannerOverride);
  else if (d?.kind === 'deal') { tone = d.bottom ? 'target' : 'held'; html = d.bottom ? '<b>밑장</b>을 들었습니다. 내 자리에 놓으면 밑장빼기, 더미에 되돌리면 <b>쓰는 척</b>.' : '내 자리(앞쪽)에 놓으세요.'; }
  else if (d?.kind === 'peek') { tone = 'held'; html = '천천히 들어 올리세요 — 끝까지 들면 패가 보입니다.'; }
  else if (d?.kind === 'carry') { tone = 'target'; html = `<b>소매</b>(오른쪽 검은 천)에 ${SWAP_MS / 1000}초 안에 놓으면 바꿔치기. 판 가운데로 던지면 다이.`; }
  else if (state.phase === 'selfdeal') { tone = 'hover'; html = `당신이 선입니다. 더미 <b>위</b>를 ${pinch} 내 앞에 두 장 — 튀어나온 <b>밑장</b>을 집으면 밑장빼기.`; }
  else if (state.phase === 'bet' && state.turn === 0) { tone = 'hover'; html = `당신 차례. 칩을 판 가운데로 밀면 ${state.currentBet > me().bet ? '콜' : '삥'}, 패를 가운데로 던지면 다이.`; }
  else if (state.phase === 'bet') html = `${state.players[state.turn].name} 생각 중…`;
  else if (state.phase === 'deal') html = '패를 돌리는 중…';
  else html = '…';
  if (html === $('#banner').dataset.html) return;
  $('#banner').dataset.html = html;
  $('#banner-text').innerHTML = html;
  $('#banner .gem').className = `gem ${tone}`;
}

function renderSeats() {
  for (const p of state.players) {
    if (!p.ai) continue;
    const el = $(`#seat-${p.seat}`);
    el.hidden = p.gone && state.phase !== 'showdown';
    el.querySelector('.money').textContent = fmt(p.money);
    const bar = el.querySelector('.sus b');
    bar.style.width = `${p.sus}%`;
    bar.style.background = p.sus >= 70 ? 'var(--ruby)' : 'var(--amber)';
    el.classList.toggle('gazing', p.gazing && !p.folded);
    el.classList.toggle('turn', state.phase === 'bet' && state.turn === p.seat);
    el.querySelector('.status').textContent = p.gone ? '떠남' : p.gazing ? '당신을 보는 중' : p.note || (p.folded ? '다이' : '');
  }
}

function placeLabels() {
  for (let s = 1; s <= 3; s++) {
    const el = $(`#seat-${s}`), pt = scene.seatScreen(s, 0.6);
    el.style.transform = `translate(${pt.x}px, ${pt.y}px) translate(-50%, -100%)`;
  }
  const sp = scene.toScreen(SLEEVE.x, 0, SLEEVE.z + 0.9);
  $('#sleeve-tag').style.transform = `translate(${sp.x}px, ${sp.y}px) translate(-50%, 0)`;
  const cp = scene.toScreen(CHIPS.x, 0, CHIPS.z + 0.6);
  $('#chip-tag').style.transform = `translate(${cp.x}px, ${cp.y}px) translate(-50%, 0)`;
  requestAnimationFrame(placeLabels);
}
requestAnimationFrame(placeLabels);

function gameOver(title, text, won = false) {
  state.phase = 'over';
  $('#over-over').textContent = won ? 'THE TABLE IS YOURS' : 'BUSTED';
  $('#over-title').textContent = title;
  $('#over-text').textContent = text;
  $('#over-rounds').textContent = state.round;
  $('#over-best').textContent = fmt(state.stats.best);
  $('#over-sleights').textContent = state.stats.sleights;
  $('#modal-over').dataset.won = won;
  $('#modal-over').hidden = false;
  log.event('gameover', { won, round: state.round });
}

function playerBet(a) {
  if (state.phase !== 'bet' || state.turn !== 0) return;
  act(me(), a);
}

shell.attach({
  modalOpen,
  dragging: () => Boolean(state.drag),
  startDrag, moveDrag, endDrag, cancelDrag, updateHover,
  onHandPose: (f) => trackTell(f.x * innerWidth, f.y * innerHeight),
  refresh: () => render(false),
});

$('#b-bet').addEventListener('click', () => playerBet('bet'));
$('#b-call').addEventListener('click', () => playerBet('call'));
$('#b-raise').addEventListener('click', () => playerBet('raise'));
$('#b-die').addEventListener('click', () => playerBet('die'));
$('#b-next').addEventListener('click', () => startRound());
$('#so-admit').addEventListener('click', () => soDecide('admit'));
$('#so-take').addEventListener('click', () => soDecide('take'));
$('#so-all').addEventListener('click', () => soDecide('all'));
$('#rv-back').addEventListener('click', () => endStandoff(null));
$('#over-again').addEventListener('click', newGame);

newGame();

// Debug / test handle
window.__sutda = { state, scene, act, startStandoff, soDecide, hand: shell.injectHandFrame, startRound, handOf };
