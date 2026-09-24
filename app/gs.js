// 고스톱 — three-player Go-Stop against two AI players, played by hand: pick a card from your
// hand and slam it onto the same month on the floor, pinch the deck to flip, then thumbs up
// for 고 or an open palm for 스톱.
import {
  CARDS, monthOf, cardName, newRound as dealRound, playTurn, decide, settle, score, specials,
  rankHand, shouldGo, bestPick, matchesFor, WIN_MIN, goPoints, eul,
} from './gs-logic.js';
import { GoStopScene, cardSrc, SLOT_COUNT } from './gs-scene.js';
import { createShell } from './shell.js';
import { sfx, unlockSound, isMuted, setMuted } from './sound.js';
import { COLOR } from './stage.js';
import { createFx } from './fx.js';

const $ = (sel) => document.querySelector(sel);
const NAMES = ['나', '강 사장', '도 박사'];
const PAN = [0, -0.55, 0.55];
const STAKE = 100; // 점당
const START_MONEY = 10000;
const HOLD_MS = 1000; // how long a go/stop hand sign must be held
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (n) => Math.round(n).toLocaleString('en-US');
const KIND_OF = (id) => CARDS[id].kind;
const GUIDE_KEY = 'gostop-guide';
let guideOn = true;
try { guideOn = localStorage.getItem(GUIDE_KEY) !== 'off'; } catch { /* default on */ }

const scene = new GoStopScene($('#stage'));
const shell = createShell({ scene, gameId: 'gostop' });
const { log, toast, onStage } = shell;
const { bigSay, specialFx, victoryFx } = createFx(scene);

const state = {
  money: [START_MONEY, START_MONEY, START_MONEY], dealer: 0, round: 1, nagari: 0, started: false,
  st: null, phase: 'idle', slots: {}, reserved: new Set(),
  wait: null, drag: null, hover: null, trail: [], options: [], say: [null, null, null],
  gesture: { kind: null, since: 0 },
};

// ---------- layout ----------

function slotOf(month) {
  if (state.slots[month] !== undefined) return state.slots[month];
  const used = new Set(Object.values(state.slots));
  for (let s = 0; s < SLOT_COUNT; s++) if (!used.has(s)) { state.slots[month] = s; return s; }
  return 0;
}

/** Where a card lands on the floor now: on top of its month's pile. */
function floorTarget(id) {
  const m = monthOf(id);
  const pile = state.st.floor.filter((x) => monthOf(x) === m && x !== id);
  return scene.floorPose(slotOf(m), pile.length, id);
}

function handOrder(p) {
  return [...state.st.hands[p]].sort((a, b) => a - b);
}

function layoutHand(p, opts = {}) {
  const st = state.st;
  if (p === 0) {
    const hand = handOrder(0);
    hand.forEach((id, i) => {
      if (state.drag?.id === id) return;
      const lift = id === state.hover ? 0.16 : state.phase === 'play' && matchesFor(st, id).length ? 0.05 : 0;
      scene.place(id, scene.handPose(i, hand.length, lift), { dur: 0.22, arc: 0.05, ...opts });
    });
  } else {
    st.hands[p].forEach((id, i) => scene.place(id, scene.oppHandPose(p, i, st.hands[p].length), { dur: 0.3, arc: 0.1, ...opts }));
  }
}

function layoutAll({ instant = false, skip = null } = {}) {
  const st = state.st;
  // free the slots of months that have left the floor (unless a card is on its way there)
  const onFloor = new Set(st.floor.map(monthOf));
  for (const m of Object.keys(state.slots)) if (!onFloor.has(Number(m)) && !state.reserved.has(Number(m))) delete state.slots[m];
  const o = { instant };
  st.deck.forEach((id, i) => { if (id !== skip) scene.place(id, scene.deckPose(st.deck.length - 1 - i, st.deck.length), { ...o, dur: 0.3 }); });
  const count = {};
  for (const id of st.floor) {
    if (id === skip) continue;
    const m = monthOf(id);
    count[m] = (count[m] ?? 0);
    scene.place(id, scene.floorPose(slotOf(m), count[m]++, id), { ...o, dur: 0.35 });
  }
  for (let p = 0; p < 3; p++) {
    const piles = { gwang: 0, yeol: 0, tti: 0, pi: 0 };
    st.caps[p].forEach((id, i) => {
      if (id === skip) return;
      const k = KIND_OF(id);
      scene.place(id, scene.capPose(p, k, piles[k]++, id), { ...o, dur: 0.45, arc: 0.4, delay: instant ? 0 : i * 0.0 });
    });
    layoutHand(p, o);
  }
}

// ---------- a round ----------

async function startRound() {
  state.st = dealRound({ dealer: state.dealer, nagari: state.nagari });
  state.slots = {};
  state.reserved.clear();
  state.say = [null, null, null];
  scene.clearGlows();
  const st = state.st;
  log.event('round', { round: state.round, dealer: state.dealer, nagari: state.nagari });
  // gather everything into the deck, shuffle, then deal out
  const all = [...st.hands.flat(), ...st.floor, ...st.deck];
  all.forEach((id, i) => scene.place(id, scene.deckPose(i, 48), { dur: 0.4, arc: 0.3, delay: (i % 12) * 0.01 }));
  state.phase = 'deal';
  render();
  sfx('shuffle', { vol: 0.8 });
  await sleep(1100);
  // deal: 4-3 to each hand and the floor, like at a real table
  const dealt = new Set();
  const dealTo = async (ids) => {
    for (const id of ids) dealt.add(id);
    layoutPartial(dealt);
    sfx('fan', { vol: 0.35, delay: 0.05 });
    await sleep(260);
  };
  for (const n of [[0, 4], [4, 7]]) {
    for (let k = 0; k < 3; k++) {
      const p = (state.dealer + k) % 3;
      await dealTo(st.hands[p].slice(n[0], n[1]));
    }
    await dealTo(st.floor.slice(n[0] === 0 ? 0 : 3, n[0] === 0 ? 3 : 6));
  }
  layoutAll();
  await sleep(400);
  if (st.over) return endRound(); // 총통
  runTurn();
}

/** During the deal: cards dealt so far go to their places, the rest stay in the deck. */
function layoutPartial(dealt) {
  const st = state.st;
  const rest = [...st.hands.flat(), ...st.floor, ...st.deck].filter((id) => !dealt.has(id));
  rest.forEach((id, i) => scene.place(id, scene.deckPose(i, rest.length), { dur: 0.2 }));
  const count = {};
  for (const id of st.floor) if (dealt.has(id)) { const m = monthOf(id); count[m] = count[m] ?? 0; scene.place(id, scene.floorPose(slotOf(m), count[m]++, id), { dur: 0.3, arc: 0.3 }); }
  for (let p = 0; p < 3; p++) {
    const hand = p === 0 ? handOrder(0) : st.hands[p];
    const got = hand.filter((id) => dealt.has(id));
    got.forEach((id) => {
      const i = hand.indexOf(id);
      scene.place(id, p === 0 ? scene.handPose(i, hand.length) : scene.oppHandPose(p, i, hand.length), { dur: 0.3, arc: 0.3 });
    });
  }
}

async function runTurn() {
  const st = state.st;
  if (st.over) return endRound();
  const p = st.turn;
  render();
  if (p === 0) await playerTurn();
  else await aiTurn(p);
  scene.clearGlows();
  layoutAll();
  render();
  if (st.pending) {
    if (st.pending.p === 0) await playerDecide();
    else {
      const go = shouldGo(st, p);
      decide(st, go);
      say(p, go ? `${st.go[p]}고!` : '스톱');
      sfx(go ? 'bell' : 'hit', { pan: PAN[p], vol: 0.7 });
      log.event('decide', { p, go });
      await sleep(900);
    }
  }
  if (st.over) return endRound();
  await sleep(250);
  runTurn();
}

// ---------- animation of one turn's events ----------

function makeAnimator(p, drop) {
  return async (ev) => {
    const st = state.st;
    if (ev.type === 'play' || ev.type === 'bomb') {
      const ids = ev.type === 'bomb' ? ev.cards : [ev.card];
      const strength = p === 0 ? drop?.strength ?? 0.4 : 0.35 + Math.random() * 0.3;
      if (ev.type === 'bomb') { bigSay('폭탄!'); sfx('hit', { vol: 0.8 }); }
      for (const [i, id] of ids.entries()) {
        const m = monthOf(id);
        const pile = st.floor.filter((x) => monthOf(x) === m && !ids.includes(x)).length + i;
        const target = scene.floorPose(slotOf(m), pile, id);
        await new Promise((resolve) => scene.slam(id, target, strength, () => { slapSound(p, strength); resolve(); }));
      }
      await sleep(p === 0 ? 150 : 250);
    } else if (ev.type === 'shake') {
      note(`<b>흔들기</b> — ${p === 0 ? '내가' : `${NAMES[p]}가`} 이기면 점수 ×2.`);
      bigSay('흔들기!');
      sfx('fan', { vol: 0.8, pan: PAN[p] });
      if (p !== 0) {
        ev.cards.forEach((id, i) => scene.place(id, { ...scene.revealPose(), p: scene.revealPose().p.clone().add({ x: (i - 1) * 0.6 + (p === 1 ? -2.5 : 2.5), y: 0, z: -2.2 }) }, { dur: 0.35 }));
        await sleep(1200);
        layoutHand(p);
      } else await sleep(700);
    } else if (ev.type === 'flip') {
      if (p === 0) await waitForFlip(ev.card);
      state.reserved.add(monthOf(ev.card));
      sfx('shove', { vol: 0.6, pan: PAN[p] });
      await new Promise((r) => scene.place(ev.card, scene.revealPose(), { dur: 0.32, arc: 0.3, done: r }));
      await sleep(260);
      await new Promise((resolve) => scene.slam(ev.card, floorTarget(ev.card), 0.35, () => { slapSound(p, 0.35); resolve(); }));
      await sleep(120);
    } else if (ev.type === 'capture') {
      sfx('slide', { vol: 0.6, pan: PAN[p], delay: 0.05 });
      for (const id of ev.cards) scene.setGlow(id, { color: COLOR.hint, intensity: 0.6, pulse: false });
      await sleep(260);
      state.reserved.clear();
      layoutAll();
      await sleep(380);
    } else if (ev.type === 'lay') {
      state.reserved.clear();
      layoutAll();
    } else if (ev.type === 'ppeok') {
      state.reserved.clear();
      bigSay('뻑!');
      sfx('lose', { vol: 0.5, jitter: 0 });
      layoutAll();
      await sleep(900);
    } else if (ev.type === 'steal') {
      if (ev.from === 0) note(`${NAMES[ev.to]}에게 피 ${mini(ev.card)}를 뺏겼습니다.`);
      sfx('slide', { vol: 0.5, pan: PAN[ev.to] });
      layoutAll();
      await sleep(250);
    } else if (ev.type === 'special') {
      const who = p === 0 ? '내가' : `${NAMES[p]}가`;
      const notes = ev.names.map((n) => SPECIAL_NOTE[n]?.(who)).filter(Boolean);
      if (notes.length) note(notes.join('<br>'));
      const names = ev.names.filter((n) => n !== '뻑' && n !== '폭탄');
      if (names.length) {
        bigSay(`${names.join(' · ')}!`);
        if (names.some((n) => n !== '뻑 먹기')) specialFx();
        sfx('hit', { vol: 0.7, jitter: 0 });
        if (names.some((n) => n !== '뻑 먹기')) sfx('bell', { vol: 0.25, delay: 0.1 });
        await sleep(900);
      }
    }
    render();
  };
}

function slapSound(p, strength) {
  const near = p === 0 ? 1 : 0.7;
  sfx('slap', { vol: (0.45 + 0.55 * strength) * near, rate: 1.05 - 0.2 * strength, pan: PAN[p] });
  if (strength > 0.6) sfx('knock', { vol: 0.35 * strength, rate: 0.8, pan: PAN[p] });
}

// ---------- the player's turn ----------

async function playerTurn() {
  const st = state.st;
  const canPass = st.passes[0] > 0;
  state.phase = st.hands[0].length ? 'play' : 'flip-only';
  state.recommend = st.hands[0].length ? rankHand(st, 0) : [];
  applyGlows();
  layoutHand(0);
  render();
  let move;
  if (!st.hands[0].length) move = { pass: true };
  else move = await new Promise((resolve) => { state.wait = { kind: 'play', resolve, canPass }; });
  state.wait = null;
  scene.clearGlows();
  state.flipQueued = false;
  const card = move.pass ? null : move.card;
  const opts = { onEvent: makeAnimator(0, move) };
  if (card !== null) {
    const sp = specials(st, 0).find((s) => s.month === monthOf(card));
    if (sp) opts[sp.kind] = true;
    const matches = matchesFor(st, card);
    if (matches.length === 2 && move.point) {
      // dropped on one of the two: take that one
      const near = matches.map((id) => ({ id, d: scene.card(id).root.position.distanceTo(move.point) })).sort((a, b) => a.d - b.d)[0].id;
      opts.choose = async (o, stage) => (stage === 'hand' ? (o.includes(near) ? near : o[0]) : playerChoose(o));
    } else opts.choose = async (o, stage) => (stage === 'hand' ? bestPick(st, 0, o) : playerChoose(o));
  } else opts.choose = async (o) => playerChoose(o);
  state.phase = 'busy';
  log.event('play', { card, pass: card === null, strength: move.strength });
  await playTurn(st, 0, card, opts);
}

/** Pinch the deck to flip. Mouse: click it. */
function waitForFlip(top) {
  // the engine has already taken this card off the deck, but it still lies on top of the pile
  state.phase = 'flip';
  state.flipCard = top;
  scene.deckOn = true;
  scene.setGlow(top, { color: COLOR.hover, intensity: 0.9, pulse: true });
  render();
  return new Promise((resolve) => {
    state.wait = { kind: 'flip', resolve };
    if (state.flipQueued) setTimeout(resolve, 150);
  }).then(() => {
    state.flipQueued = false;
    state.wait = null;
    state.flipCard = null;
    scene.deckOn = false;
    scene.setGlow(top, null);
    state.phase = 'busy';
    render();
  });
}

function playerChoose(options) {
  state.phase = 'choose';
  state.options = options;
  for (const id of options) scene.setGlow(id, { color: COLOR.hover, intensity: 0.9, pulse: true });
  render();
  return new Promise((resolve) => { state.wait = { kind: 'choose', resolve }; }).then((id) => {
    state.wait = null;
    for (const x of options) scene.setGlow(x, null);
    state.options = [];
    state.phase = 'busy';
    render();
    return id;
  });
}

// ---------- AI ----------

async function aiTurn(p) {
  const st = state.st;
  state.phase = 'ai';
  render();
  await sleep(500 + Math.random() * 400);
  let card = null;
  const opts = { onEvent: makeAnimator(p), choose: async (o) => bestPick(st, p, o) };
  if (st.hands[p].length && !(st.passes[p] > 0 && Math.random() < 0.5)) {
    card = rankHand(st, p)[0].card;
    const sp = specials(st, p).find((s) => s.month === monthOf(card));
    if (sp) opts[sp.kind] = true;
  }
  if (card === null && st.passes[p] <= 0) card = st.hands[p][0];
  if (card !== null) {
    // the card comes out of the hand face up, over the table
    const o = scene.card(card).root;
    scene.place(card, { p: o.position.clone().add({ x: p === 1 ? 1.2 : -1.2, y: 0.6, z: 1.2 }), q: scene.revealPose().q, s: 1 }, { dur: 0.3 });
    sfx('fan', { vol: 0.25, pan: PAN[p] });
    await sleep(330);
  }
  state.phase = 'busy';
  await playTurn(st, p, card, opts);
}

// ---------- go / stop ----------

async function playerDecide() {
  const st = state.st;
  const sc = score(st.caps[0]);
  state.phase = 'decide';
  $('#dec-score').textContent = goPoints(sc.total, st.go[0]);
  $('#dec-parts').innerHTML = sc.parts.map((q) => `<div><span>${q.name}</span><b>${q.pts}</b></div>`).join('')
    + (st.go[0] ? `<div><span>${st.go[0]}고</span><b>+${Math.min(st.go[0], 2)}${st.go[0] >= 3 ? ` ×${2 ** (st.go[0] - 2)}` : ''}</b></div>` : '');
  const threat = [1, 2].map((o) => ({ o, s: score(st.caps[o]).total })).sort((a, b) => b.s - a.s)[0];
  $('#dec-go').textContent = `${st.go[0] + 1}고 — 다음에 나면 ${goPoints(sc.total, st.go[0] + 1)}점 이상${st.go[0] + 1 >= 3 ? ' (×2)' : ''}`;
  $('#dec-risk').textContent = threat.s > 0
    ? `${NAMES[threat.o]}가 ${threat.s}점. 고 한 뒤 남이 먼저 나면 고박으로 혼자 물어냅니다.`
    : '상대 둘 다 아직 점수가 없습니다.';
  const preview = settle({ ...st, over: { kind: 'win', winner: 0, reason: '스톱' } });
  $('#dec-stop').textContent = `지금 받으면 +${fmt(preview.delta[0] * STAKE)}${preview.bak.flat().length ? ` (${[...new Set(preview.bak.flat())].join('·')})` : ''}`;
  $('#dec-left').textContent = `남은 손패 ${st.hands[0].length}장`;
  $('#decide').hidden = false;
  sfx('bell', { vol: 0.5 });
  render();
  const go = await new Promise((resolve) => { state.wait = { kind: 'decide', resolve }; });
  state.wait = null;
  $('#decide').hidden = true;
  decide(st, go);
  say(0, go ? `${st.go[0]}고!` : '스톱');
  bigSay(go ? `${st.go[0]}고!` : '스톱!');
  sfx(go ? 'bell' : 'hit', { vol: 0.9 });
  log.event('decide', { p: 0, go });
  await sleep(700);
}

/** Thumbs up = 고, open palm = 스톱, held for a second. */
function classify(lm) {
  if (!lm) return null;
  const d = (a, b) => Math.hypot(lm[a].x - lm[b].x, lm[a].y - lm[b].y);
  const palm = d(0, 9) || 1;
  const ext = [[8, 6], [12, 10], [16, 14], [20, 18]].map(([t, j]) => d(t, 0) > d(j, 0) * 1.12);
  const curled = [[8, 6], [12, 10], [16, 14], [20, 18]].map(([t, j]) => d(t, 0) < d(j, 0) * 1.02);
  const thumbOut = d(4, 5) > 0.5 * palm;
  const thumbUp = lm[4].y < lm[3].y && lm[3].y < lm[2].y && lm[4].y < Math.min(lm[6].y, lm[10].y, lm[14].y, lm[18].y) - 0.25 * palm;
  if (curled.filter(Boolean).length >= 3 && thumbOut && thumbUp) return 'go';
  if (ext.every(Boolean) && thumbOut) return 'stop';
  return null;
}

function onHandPose(frame) {
  if (state.wait?.kind !== 'decide') return;
  const g = state.gesture;
  const kind = frame.pinching ? null : classify(frame.landmarks);
  const now = performance.now();
  if (kind !== g.kind) { g.kind = kind; g.since = now; }
  const k = kind ? Math.min(1, (now - g.since) / HOLD_MS) : 0;
  $('#dec-btn-go').style.setProperty('--hold', kind === 'go' ? k : 0);
  $('#dec-btn-stop').style.setProperty('--hold', kind === 'stop' ? k : 0);
  $('#dec-sign').textContent = kind === 'go' ? '엄지 인식 — 그대로 유지' : kind === 'stop' ? '손바닥 인식 — 그대로 유지' : '엄지를 올리거나 손바닥을 펴 보이세요';
  if (k >= 1) { g.kind = null; state.wait.resolve(kind === 'go'); }
}

// ---------- end of a round ----------

async function endRound() {
  const st = state.st;
  state.phase = 'over';
  scene.clearGlows();
  render();
  const r = settle(st);
  if (!r) {
    state.nagari++;
    log.event('nagari', { n: state.nagari });
    sfx('draw', { jitter: 0 });
    showResult({ title: '나가리', over: 'NO WINNER', text: `아무도 나지 못했습니다. 다음 판은 ×${2 ** state.nagari}.` });
    return;
  }
  const w = r.winner;
  for (let p = 0; p < 3; p++) state.money[p] += r.delta[p] * STAKE;
  log.event('win', { p: w, points: r.points, delta: r.delta, reason: r.reason });
  scene.celebrate(st.caps[w], { strong: w === 0 });
  if (w === 0) victoryFx();
  if (w === 0) { sfx('win', { delay: 0.3, jitter: 0 }); sfx('win2', { delay: 1.9, vol: 0.8, jitter: 0 }); for (let i = 0; i < 8; i++) sfx('slide', { delay: 1.8 + i * 0.12, vol: 0.4 }); }
  else sfx(r.delta[0] < 0 ? 'lose' : 'draw', { delay: 0.3, jitter: 0 });
  await sleep(1300);
  state.nagari = 0;
  state.dealer = w;
  showResult({ r, title: w === 0 ? `${r.reason} — 승리` : `${NAMES[w]} ${r.reason}`, over: `${r.reason.toUpperCase?.() ?? ''}${r.go ? ` · ${r.go} GO` : ''}` });
}

function showResult({ r = null, title, over, text = '' }) {
  const st = state.st;
  $('#res-over').textContent = r ? (r.go ? `STOP · ${r.go} GO` : r.reason === '총통' ? 'CHONGTONG' : 'STOP') : over;
  $('#res-title').textContent = title;
  const card = $('#result .card');
  card.classList.toggle('mine', Boolean(r) && r.winner === 0);
  if (r) {
    const w = r.winner;
    const groups = ['gwang', 'yeol', 'tti', 'pi'].map((k) => st.caps[w].filter((id) => KIND_OF(id) === k));
    $('#res-tiles').innerHTML = groups.filter((g) => g.length).map((g) => `<span class="gs-group">${g.map((id) => `<img class="gs-card" src="${cardSrc(id)}" alt="${cardName(id)}">`).join('')}</span>`).join('');
    const rows = r.score.parts.map((q, i) => `<div style="--i:${i}"><span>${q.name}</span><b>${q.pts}</b></div>`);
    if (r.go) rows.push(`<div style="--i:${rows.length}"><span>${r.go}고</span><b>+${Math.min(r.go, 2)}</b></div>`);
    for (const m of r.mult) rows.push(`<div style="--i:${rows.length}"><span>${m.name}</span><b>×${m.x}</b></div>`);
    $('#res-yaku').innerHTML = r.reason === '총통' || r.reason === '삼뻑' ? `<div><span>${r.reason}</span><b>10</b></div>` : rows.join('');
    $('#res-points').innerHTML = `<span class="han">${r.points}점 × ${STAKE}</span><b>${fmt(r.delta[w] * STAKE)}</b><span class="split">${w === 0 ? '받은 돈' : `${NAMES[w]}가 받음`}</span>`;
    $('#res-scores').innerHTML = [0, 1, 2].map((p) => `<div><dt>${NAMES[p]}${r.bak[p].length ? ` <em class="bak">${r.bak[p].join(' · ')}</em>` : ''}</dt><dd>${fmt(state.money[p])}</dd><span class="${r.delta[p] > 0 ? 'up' : r.delta[p] < 0 ? 'down' : ''}">${r.delta[p] ? (r.delta[p] > 0 ? '+' : '') + fmt(r.delta[p] * STAKE) : '±0'}</span></div>`).join('');
  } else {
    $('#res-tiles').innerHTML = '';
    $('#res-yaku').innerHTML = '';
    $('#res-points').innerHTML = `<span class="han">${text}</span>`;
    $('#res-scores').innerHTML = [0, 1, 2].map((p) => `<div><dt>${NAMES[p]}</dt><dd>${fmt(state.money[p])}</dd><span>±0</span></div>`).join('');
  }
  card.classList.remove('enter');
  void card.offsetWidth;
  card.classList.add('enter');
  $('#result').hidden = false;
  const b = $('#res-points b');
  if (b && r) {
    const total = r.delta[r.winner] * STAKE, t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / 1200);
      b.textContent = fmt(Math.round(total * (1 - (1 - k) ** 3) / 100) * 100);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  render();
}

function nextRound() {
  $('#result').hidden = true;
  sfx('lay', { vol: 0.5 });
  if (state.money.some((m) => m <= 0)) return endGame();
  state.round++;
  startRound();
}

function endGame() {
  state.phase = 'end';
  const rank = [0, 1, 2].sort((a, b) => state.money[b] - state.money[a]);
  $('#end-title').textContent = `${rank.indexOf(0) + 1}위`;
  $('#end-scores').innerHTML = rank.map((p, i) => `<div><dt>${i + 1}위 · ${NAMES[p]}</dt><dd>${fmt(state.money[p])}</dd></div>`).join('');
  $('#modal-end').hidden = false;
  if (rank[0] === 0) { sfx('first', { jitter: 0 }); sfx('win', { delay: 0.8, jitter: 0 }); } else sfx('over', { jitter: 0 });
  log.event('gameover', { money: state.money });
}

function newGame() {
  $('#modal-end').hidden = true;
  Object.assign(state, { money: [START_MONEY, START_MONEY, START_MONEY], dealer: 0, round: 1, nagari: 0, started: true });
  sfx('start', { jitter: 0 });
  startRound();
}

// ---------- hands on the table ----------

const modalOpen = () => shell.introOpen() || !$('#result').hidden || !$('#modal-end').hidden || !$('#decide').hidden;

function deckHit(x, y) {
  const top = state.flipCard ?? state.st?.deck[0];
  if (top === undefined || top === null) return null;
  if (scene.pick(x, y, [top]) !== null) return top;
  const p = scene.card(top).root.position, sp = scene.toScreen(p.x, p.y, p.z);
  return Math.hypot(sp.x - x, sp.y - y) < 120 ? top : null;
}

/**
 * The hand card a pinch means. Logs showed pinches landing 50–150 px above the standing hand
 * (people aim at the card's top edge), so off-card pinches take the nearest card, reaching
 * further upwards than down.
 */
function pickHand(x, y) {
  const hand = state.st.hands[0];
  const hit = scene.pick(x, y, hand);
  if (hit !== null) return hit;
  let best = null, bd = 1;
  for (const id of hand) {
    const p = scene.card(id).root.position, sp = scene.toScreen(p.x, p.y, p.z);
    const dy = y - sp.y;
    const d = Math.hypot((x - sp.x) / 60, dy / (dy < 0 ? 170 : 90));
    if (d < bd) { bd = d; best = id; }
  }
  return best;
}

/** One of the glowing floor options, by nearest on screen. */
function pickOption(x, y) {
  const hit = scene.pick(x, y, state.options);
  if (hit !== null) return hit;
  let best = null, bd = 110;
  for (const id of state.options) {
    const p = scene.card(id).root.position, sp = scene.toScreen(p.x, p.y, p.z);
    const d = Math.hypot(x - sp.x, y - sp.y);
    if (d < bd) { bd = d; best = id; }
  }
  return best;
}

function updateHover(x, y) {
  let h = null;
  if (x !== null && !state.drag && !modalOpen() && onStage(x, y)) {
    if (state.phase === 'play') h = pickHand(x, y);
    else if (state.phase === 'flip' || state.phase === 'flip-only') h = deckHit(x, y);
    else if (state.phase === 'choose') h = pickOption(x, y);
  }
  scene.hoverOn = h !== null;
  if (h !== state.hover) {
    state.hover = h;
    if (state.phase === 'play') { applyGlows(); layoutHand(0); }
  }
}

function startDrag(x, y) {
  if (modalOpen() || state.drag || !onStage(x, y)) return false;
  scene.pointer = { x, y };
  const w = state.wait;
  // pinching the deck while your own card is still landing: flip as soon as it's allowed
  if (!w && state.phase === 'busy' && state.st?.turn === 0 && deckHit(x, y) !== null) { state.flipQueued = true; return true; }
  if (!w) return false;
  if (w.kind === 'flip') {
    if (deckHit(x, y) === null) return false;
    w.resolve();
    return true;
  }
  if (w.kind === 'choose') {
    const id = pickOption(x, y);
    if (id === null) return false;
    w.resolve(id);
    return true;
  }
  if (w.kind === 'play') {
    if (w.canPass && deckHit(x, y) !== null) { w.resolve({ pass: true }); return true; }
    const id = pickHand(x, y);
    if (id === null) return false;
    state.drag = { id, t: performance.now(), x0: x, y0: y };
    state.trail = [{ x, y, t: performance.now() }];
    state.hover = null;
    scene.carry(id);
    sfx('fan', { vol: 0.2 });
    applyGlows(id);
    render();
    return true;
  }
  return false;
}

function moveDrag(x, y) {
  if (!state.drag) return;
  scene.pointer = { x, y };
  const now = performance.now();
  state.trail.push({ x, y, t: now });
  while (state.trail.length > 2 && now - state.trail[0].t > 140) state.trail.shift();
}

/** How hard the card was brought down: pointer speed over the last moments before release. */
function slamStrength() {
  const tr = state.trail;
  if (tr.length < 2) return 0.3;
  const a = tr[0], b = tr[tr.length - 1];
  const dt = Math.max(16, b.t - a.t) / 1000;
  const v = Math.hypot(b.x - a.x, b.y - a.y) / dt; // px/s
  const down = Math.max(0, (b.y - a.y) / dt);
  return Math.max(0.15, Math.min(1, (0.6 * v + 0.6 * down - 250) / 1800));
}

function endDrag(x, y) {
  const d = state.drag;
  if (!d) return;
  moveDrag(x, y);
  scene.pointer = { x, y };
  state.drag = null;
  scene.dropCarry();
  const at = scene.pointerOnTable(0);
  const quick = performance.now() - d.t < 250 && Math.hypot(x - d.x0, y - d.y0) < 40;
  const onTable = !quick && at && Math.abs(at.x) < 5 && at.z < 2.9 && at.z > -2.1;
  if (!onTable || !state.wait) {
    layoutHand(0);
    applyGlows();
    return;
  }
  state.wait.resolve({ card: d.id, point: at, strength: slamStrength() });
}

function cancelDrag() {
  if (!state.drag) return;
  state.drag = null;
  scene.dropCarry();
  layoutHand(0);
  applyGlows();
}

// ---------- guide + UI ----------

/** Glow the floor cards the held/hovered card would take, and the hand cards that can take something. */
function applyGlows(held = null) {
  const st = state.st;
  scene.clearGlows();
  if (state.phase !== 'play') return;
  const focus = held ?? state.hover;
  if (focus !== null) {
    for (const id of matchesFor(st, focus)) scene.setGlow(id, { color: COLOR.hover, intensity: 0.9, pulse: true });
    return;
  }
  for (const id of st.hands[0]) if (matchesFor(st, id).length) scene.setGlow(id, { color: 0xfff0c8, intensity: 0.3, pulse: false });
  if (guideOn && state.recommend?.[0]) scene.setGlow(state.recommend[0].card, { color: COLOR.hint, intensity: 0.7, pulse: true });
}

/** A line for the guide about what just happened on the table. */
function note(text) {
  state.note = { text, at: performance.now() };
  $('#guide-body').dataset.key = '';
  renderGuide();
}

const SPECIAL_NOTE = {
  '뻑': (who) => `<b>뻑</b> — ${who} 같은 달 세 장이 묶였습니다. 남은 한 장을 가진 사람이 다 가져갑니다.`,
  '쪽': (who) => `<b>쪽</b> — ${who} 두 장을 먹고 피를 한 장씩 받았습니다.`,
  '따닥': (who) => `<b>따닥</b> — ${who} 같은 달 네 장을 모두 먹고 피를 한 장씩 받았습니다.`,
  '싹쓸이': (who) => `<b>싹쓸이</b> — ${who} 바닥을 비우고 피를 한 장씩 받았습니다.`,
  '뻑 먹기': (who) => `<b>뻑 먹기</b> — ${who} 묶인 네 장을 가져가고 피를 한 장씩 받았습니다.`,
  '자뻑': (who) => `<b>자뻑</b> — ${who} 피를 두 장씩 받았습니다.`,
  '폭탄': (who) => `<b>폭탄</b> — ${who} 네 장을 먹었습니다. 다음 두 번은 더미만 뒤집습니다.`,
};

function say(p, text) {
  state.say[p] = { text, at: performance.now() };
  renderSeats();
}

function bannerText() {
  const st = state.st;
  switch (state.phase) {
    case 'idle': return '시작을 누르세요';
    case 'deal': return '패를 섞어 나누는 중…';
    case 'play': return state.drag ? '같은 달 위에 <b>내려치세요</b> — 세게 칠수록 짝!' : '손패 한 장을 <b>집으세요</b>';
    case 'flip-only': case 'flip': return '가운데 <b>더미를 집어</b> 뒤집으세요';
    case 'choose': return '둘 중 <b>가져올 패</b>를 집으세요';
    case 'decide': return '<b>고</b>? <b>스톱</b>?';
    case 'ai': return `${NAMES[st.turn]} 차례`;
    case 'over': return '판이 끝났습니다';
    default: return '…';
  }
}

const mini = (id) => `<img class="gs-mini" src="${cardSrc(id)}" alt="${cardName(id)}">`;
const P = (t) => `<p>${t}</p>`;

function renderGuide() {
  const st = state.st;
  const box = $('#guide-body');
  if (!guideOn) { box.innerHTML = ''; return; }
  const hand = shell.handActive();
  const key = [state.phase, st?.turn, st?.hands[0].join(','), st?.floor.join(','), st?.caps[0].length, state.options?.join(','), state.note?.at, hand, state.round].join('|');
  if (box.dataset.key === key) return;
  box.dataset.key = key;
  const ph = state.phase;
  const grab = hand ? '집어' : '끌어';
  let html = '';
  if (!st || ph === 'deal') {
    html = P('같은 달 그림끼리 맞춰 가져오고, <b>먼저 3점</b>을 내면 이깁니다.')
      + (state.round === 1 ? P(`<span class="why">${mini(0)}광 ${mini(4)}열끗 ${mini(1)}띠 ${mini(2)}피</span>`) : '');
  } else if (ph === 'play') {
    const best = state.recommend[0];
    const on = matchesFor(st, best.card);
    html = P(`<b>①</b> 손패를 ${grab} 같은 달 위에 놓기`)
      + P(`추천 ${mini(best.card)}${on.length ? ` → ${on.map(mini).join('')}` : ' (짝 없음)'}`)
      + P(`<span class="why">${best.reason}</span>`);
    const sp = specials(st, 0)[0];
    if (sp) html += P(`<span class="why">${sp.month}월 세 장 → ${sp.kind === 'bomb' ? '<b>폭탄</b>' : '<b>흔들기</b>'} (이기면 ×2)</span>`);
  } else if (ph === 'flip' || ph === 'flip-only') {
    html = P(`<b>②</b> 가운데 더미를 ${hand ? '집어' : '눌러'} 뒤집기`);
  } else if (ph === 'choose') {
    html = P(`둘 중 가져올 패를 ${hand ? '집기' : '누르기'} — 추천 ${mini(bestPick(st, 0, state.options))}`);
  } else if (ph === 'decide') {
    html = P(`추천 <b class="rec">${shouldGo(st, 0) ? '고' : '스톱'}</b>`)
      + P('<span class="why">고 한 뒤 남이 먼저 나면 둘 몫을 혼자 냅니다(고박).</span>');
  }
  if (state.note && performance.now() - state.note.at < 8000 && ph !== 'deal') html += `<div class="note">${P(state.note.text)}</div>`;
  if (st && ph !== 'deal' && ph !== 'over') {
    const need = goalLine(st.caps[0]);
    if (need) html += `<p class="goal">${need}</p>`;
  }
  box.innerHTML = html;
}

/** The two closest ways to 3 points, e.g. "0점 · 3점까지 광 1장 또는 피 4장". */
function goalLine(caps) {
  const c = caps.map((id) => CARDS[id]);
  const sc = score(caps);
  if (sc.total >= WIN_MIN) return `<b>${sc.total}점</b>`;
  const opts = [
    [3 - c.filter((x) => x.kind === 'gwang').length, '광'],
    [10 - sc.pi, '피'],
    [5 - c.filter((x) => x.kind === 'tti').length, '띠'],
    [5 - sc.yeol, '열끗'],
  ];
  for (const [r, nm] of [['hong', '홍단'], ['cheong', '청단'], ['cho', '초단']]) {
    const n = c.filter((x) => x.ribbon === r).length;
    if (n) opts.push([3 - n, nm]);
  }
  const birds = c.filter((x) => x.bird).length;
  if (birds) opts.push([3 - birds, '고도리']);
  const top = opts.filter(([n]) => n > 0).sort((a, b) => a[0] - b[0]).slice(0, 2);
  return `<b>${sc.total}점</b> · 3점까지 ${top.map(([n, nm]) => `${nm} ${n}장`).join(' 또는 ')}`;
}

function render() {
  const st = state.st;
  $('#banner-text').innerHTML = bannerText();
  $('#money').textContent = fmt(state.money[0]);
  $('#round').textContent = String(state.round).padStart(2, '0');
  $('#my-score').textContent = st ? score(st.caps[0]).total : 0;
  $('#my-go').textContent = st?.go[0] ? `${st.go[0]}고` : '';
  $('#nagari').textContent = state.nagari ? `나가리 ×${2 ** state.nagari}` : '';
  $('#left').textContent = st ? st.deck.length : 48;
  renderGuide();
  renderSeats();
  document.body.classList.toggle('my-turn', ['play', 'flip', 'flip-only', 'choose'].includes(state.phase));
}

function renderSeats() {
  const st = state.st;
  for (const p of [1, 2]) {
    const el = $(`#seat-${p}`);
    el.classList.toggle('turn', st && st.turn === p && state.phase === 'ai');
    el.querySelector('.pts').textContent = fmt(state.money[p]);
    if (st) {
      const sc = score(st.caps[p]);
      el.querySelector('.st').textContent = `${sc.total}점${st.go[p] ? ` · ${st.go[p]}고` : ''} · 피 ${sc.pi}`;
      el.classList.toggle('danger', sc.pi < 6 && st.deck.length < 12);
    }
    const s = state.say[p];
    const sayEl = el.querySelector('.say');
    const on = s && performance.now() - s.at < 1800;
    sayEl.textContent = on ? s.text : '';
    sayEl.classList.toggle('on', Boolean(on));
  }
  const s0 = state.say[0];
  $('#my-say').textContent = s0 && performance.now() - s0.at < 1800 ? s0.text : '';
}
setInterval(renderSeats, 250);

function placeTags() {
  const box = $('#tile-tags');
  const tags = [];
  if (guideOn && state.phase === 'play' && !state.drag && !modalOpen() && state.recommend?.length) {
    tags.push({ id: state.recommend[0].card, label: '추천', best: true });
  }
  const flipTop = state.flipCard ?? state.st?.deck[0];
  if ((state.phase === 'flip' || state.phase === 'flip-only') && flipTop !== undefined && flipTop !== null) tags.push({ id: flipTop, label: '뒤집기', best: true });
  while (box.children.length < tags.length) box.append(document.createElement('div'));
  [...box.children].forEach((el, i) => {
    const t = tags[i];
    el.hidden = !t;
    if (!t) return;
    const p = scene.card(t.id).root.position, pt = scene.toScreen(p.x, p.y + 0.5, p.z - 0.1);
    el.textContent = t.label;
    el.className = `tile-tag${t.best ? ' best' : ''}`;
    el.style.transform = `translate(${pt.x}px, ${pt.y}px) translate(-50%, -100%)`;
  });
}

function placeLabels() {
  placeTags();
  for (const p of [1, 2]) {
    const pt = scene.seatScreen(p);
    $(`#seat-${p}`).style.transform = `translate(${pt.x}px, ${pt.y}px) translate(-50%, -50%)`;
  }
  requestAnimationFrame(placeLabels);
}
requestAnimationFrame(placeLabels);

function setGuide(on) {
  guideOn = on;
  try { localStorage.setItem(GUIDE_KEY, on ? 'on' : 'off'); } catch { /* ignore */ }
  $('#guide-toggle').textContent = on ? '가이드 끄기' : '가이드 켜기';
  $('#guide-start').checked = on;
  document.body.classList.toggle('guide', on);
  $('#guide-body').dataset.key = '';
  if (state.st) { applyGlows(); render(); }
}

shell.attach({
  modalOpen,
  dragging: () => Boolean(state.drag),
  startDrag, moveDrag, endDrag, cancelDrag, updateHover, onHandPose,
  refresh: () => render(),
});

$('#dec-btn-go').addEventListener('click', () => state.wait?.kind === 'decide' && state.wait.resolve(true));
$('#dec-btn-stop').addEventListener('click', () => state.wait?.kind === 'decide' && state.wait.resolve(false));
$('#res-next').addEventListener('click', nextRound);
$('#res-quit').addEventListener('click', endGame);
$('#end-again').addEventListener('click', newGame);
$('#guide-toggle').addEventListener('click', () => setGuide(!guideOn));
$('#guide-start').addEventListener('change', (e) => setGuide(e.target.checked));
setGuide(guideOn);
for (const id of ['#btn-start-mouse', '#btn-start-cam']) {
  $(id).addEventListener('click', () => { unlockSound(); if (!state.started) setTimeout(newGame, 250); }, { once: true });
}
const soundBtn = $('#b-sound');
const showSound = () => { soundBtn.textContent = isMuted() ? '소리 꺼짐' : '소리 켜짐'; soundBtn.classList.toggle('off', isMuted()); };
soundBtn.addEventListener('click', () => { unlockSound(); setMuted(!isMuted()); showSound(); });
showSound();
render();

// Debug / test handle
window.__gs = { state, scene, hand: shell.injectHandFrame, classify, layoutAll, victoryFx, specialFx };
