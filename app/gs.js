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
      note(`${p === 0 ? '내가' : `${NAMES[p]}가`} 같은 달 세 장을 들고 있다고 보여 줬습니다(<b>흔들기</b>). 이 판을 이기면 점수가 <b>2배</b>가 됩니다.`);
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
      if (p !== 0) note(`${NAMES[p]}가 가져감: ${ev.cards.map(mini).join('')} ${ev.cards.some((id) => KIND_OF(id) === 'gwang') ? '광을 모으고 있으니 조심하세요.' : ''}`);
      else note(`내가 가져옴: ${ev.cards.map(mini).join('')}`);
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
      if (ev.from === 0) note(`${NAMES[ev.to]}에게 내 피 ${mini(ev.card)} 한 장을 뺏겼습니다.`);
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
  return new Promise((resolve) => { state.wait = { kind: 'flip', resolve }; }).then(() => {
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
  if (top === undefined) return null;
  if (scene.pick(x, y, [top]) !== null) return top;
  const p = scene.card(top).root.position, sp = scene.toScreen(p.x, p.y, p.z);
  return Math.hypot(sp.x - x, sp.y - y) < 90 ? top : null;
}

function updateHover(x, y) {
  let h = null;
  if (x !== null && !state.drag && !modalOpen() && onStage(x, y)) {
    if (state.phase === 'play') h = scene.pick(x, y, state.st.hands[0]);
    else if (state.phase === 'flip' || state.phase === 'flip-only') h = deckHit(x, y);
    else if (state.phase === 'choose') h = scene.pick(x, y, state.options);
  }
  scene.hoverOn = h !== null;
  if (h !== state.hover) {
    state.hover = h;
    if (state.phase === 'play') { applyGlows(); layoutHand(0); }
  }
}

function startDrag(x, y) {
  if (modalOpen() || state.drag || !onStage(x, y) || !state.wait) return false;
  scene.pointer = { x, y };
  const w = state.wait;
  if (w.kind === 'flip') {
    if (deckHit(x, y) === null) return false;
    w.resolve();
    return false;
  }
  if (w.kind === 'choose') {
    const id = scene.pick(x, y, state.options);
    if (id === null) return false;
    w.resolve(id);
    return false;
  }
  if (w.kind === 'play') {
    if (w.canPass && deckHit(x, y) !== null) { w.resolve({ pass: true }); return false; }
    const id = scene.pick(x, y, state.st.hands[0]);
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
  const onTable = at && Math.abs(at.x) < 5 && at.z < 2.9 && at.z > -2.1;
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
  '뻑': (who) => `${who} 낸 패와 뒤집은 패가 같은 달이라 <b>세 장이 바닥에 묶였습니다(뻑)</b>. 이 달의 남은 한 장을 가진 사람이 네 장을 모두 가져가고, 피도 한 장씩 받습니다.`,
  '쪽': (who) => `${who} 짝 없이 낸 패를 뒤집은 패가 바로 맞췄습니다(<b>쪽</b>). 두 장을 가져가고 다른 두 사람에게서 <b>피를 한 장씩</b> 받습니다.`,
  '따닥': (who) => `바닥의 두 장 + 낸 패 + 뒤집은 패, 같은 달 <b>네 장을 모두</b> ${who} 가져갔습니다(<b>따닥</b>). 피도 한 장씩 받습니다.`,
  '싹쓸이': (who) => `${who} 바닥을 <b>모두 쓸어</b> 갔습니다(<b>싹쓸이</b>). 피를 한 장씩 받습니다.`,
  '뻑 먹기': (who) => `뻑으로 묶여 있던 세 장을 ${who} 네 번째 패로 가져갔습니다(<b>뻑 먹기</b>). 피도 한 장씩 받습니다.`,
  '자뻑': (who) => `자기가 싼 뻑을 ${who} 직접 먹었습니다(<b>자뻑</b>). 피를 <b>두 장씩</b> 받습니다.`,
  '폭탄': (who) => `같은 달 세 장을 한꺼번에 내 바닥의 한 장까지 ${who} 네 장을 먹었습니다(<b>폭탄</b>). 이기면 점수 2배, 대신 다음 두 번은 손패 없이 더미만 뒤집습니다.`,
};

function say(p, text) {
  state.say[p] = { text, at: performance.now() };
  renderSeats();
}

let bigTimer;
function bigSay(text) {
  const el = $('#big-say');
  el.textContent = text;
  el.hidden = false;
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
  clearTimeout(bigTimer);
  bigTimer = setTimeout(() => { el.hidden = true; }, 1300);
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
const H = (t) => `<h3>${t}</h3>`;
const P = (t) => `<p>${t}</p>`;
const NUM = ['①', '②', '③', '④', '⑤', '⑥', '⑦'];

/** What playing each hand card would do, for the numbered list (cards that take something first). */
function candidates() {
  const st = state.st;
  return (state.recommend ?? []).map((r) => {
    const on = matchesFor(st, r.card);
    let what;
    if (on.length === 3) what = `뻑 난 ${on.map(mini).join('')} 세 장을 모두 가져옴 + 피 한 장씩`;
    else if (on.length === 2) what = `${on.map(mini).join('')} 중 하나를 가져옴 (내려놓는 쪽)`;
    else if (on.length === 1) what = `${mini(on[0])} ${eul(CARDS[on[0]].name)} 가져옴`;
    else what = '바닥에 짝이 없음 — 그냥 바닥에 놓입니다';
    return { ...r, what, takes: on.length > 0 };
  });
}

function renderGuide() {
  const st = state.st;
  const box = $('#guide-body');
  if (!guideOn) { box.innerHTML = ''; return; }
  const hand = shell.handActive();
  const key = [state.phase, st?.turn, st?.hands[0].join(','), st?.floor.join(','), st?.caps[0].length, state.options?.join(','), state.note?.at, hand].join('|');
  if (box.dataset.key === key) return;
  box.dataset.key = key;
  let html = '';
  const ph = state.phase;
  const pinch = hand ? '엄지와 검지로 <b>집고</b>' : '마우스로 <b>누른 채</b>';

  if (!st || ph === 'idle' || ph === 'deal') {
    html += H('고스톱이란');
    html += P('화투 48장은 <b>1월부터 12월까지 달마다 4장</b>씩입니다. 같은 그림(같은 달) 두 장을 맞추면 가져옵니다.');
    html += P('가져온 패로 <b>먼저 3점</b>을 만들면 <b>고</b>(계속) 또는 <b>스톱</b>(끝내고 돈 받기)을 고릅니다.');
    html += H('패의 종류');
    html += P(`${mini(0)} <b>광</b> — 光 글자. 3장 모으면 3점<br>${mini(4)} <b>열끗</b> — 새·동물. 5장이면 1점<br>${mini(1)} <b>띠</b> — 리본. 5장이면 1점<br>${mini(2)} <b>피</b> — 그림만. 10장이면 1점 ${mini(41)} 쌍피는 2장 몫`);
    html += H('한 차례에 하는 일');
    html += P('<b>① 손패 한 장 내기</b> → <b>② 가운데 더미 한 장 뒤집기</b>. 두 번 모두 같은 달이 바닥에 있으면 가져옵니다.');
    html += P('지금 패를 나누는 중입니다. 손에 7장, 바닥에 6장이 깔립니다.');
  } else if (ph === 'play') {
    const list = candidates();
    const best = list[0];
    html += H('내 차례 — ① 손패 내기');
    html += P(`손패 한 장을 ${pinch} 바닥의 <b>같은 달 그림 위에</b> 놓으세요. 짝이 있는 패는 살짝 올라와 있고, 들면 가져올 바닥 패가 <b>금빛</b>으로 빛납니다.`);
    const takers = list.filter((x) => x.takes).slice(0, 4);
    if (takers.length) {
      html += P(`짝이 있는 패 <b>${takers.length}장</b>:`) + `<ol class="cands">${takers.map((x, i) => `<li class="${x.card === best.card ? 'best' : ''}"><span class="no">${NUM[i]}</span>${mini(x.card)}<span>${x.what}</span></li>`).join('')}</ol>`;
    } else html += P('바닥에 짝이 되는 패가 <b>하나도 없습니다</b>. 한 장을 바닥에 내려놓아야 합니다.');
    const n = takers.findIndex((x) => x.card === best.card);
    html += P(`그중 <b class="rec">${n >= 0 ? `${NUM[n]} ` : ''}${eul(cardName(best.card))}</b> 추천합니다. <span class="why">이유 — ${best.reason}.</span>`);
    const sp = specials(st, 0);
    for (const x of sp) {
      html += x.kind === 'bomb'
        ? P(`<b>폭탄 가능</b> — ${x.month}월을 세 장 들고 있고 바닥에 한 장 있습니다. 그 달 패를 내면 세 장이 한꺼번에 나가 네 장을 모두 먹고, 이기면 점수 2배입니다.`)
        : P(`<b>흔들기 가능</b> — ${x.month}월 세 장을 들고 있습니다. 그 달 패를 내면 자동으로 흔들어 보여 주고, 이기면 점수 2배입니다.`);
    }
    html += P('<span class="why">팁: 세게(빠르게) 내려칠수록 소리가 커질 뿐, 결과는 같습니다.</span>');
  } else if (ph === 'flip' || ph === 'flip-only') {
    html += H('② 더미 뒤집기');
    if (ph === 'flip-only') html += P('폭탄을 한 덕분에 이번에는 <b>손패 없이</b> 더미만 뒤집습니다.');
    html += P(`가운데 <b>금빛 링</b>이 있는 더미를 ${hand ? '집으세요' : '누르세요'}. 맨 위 패가 뒤집혀 바닥에 떨어집니다.`);
    html += P('뒤집은 패와 같은 달이 바닥에 있으면 <b>한 번 더 가져옵니다</b>. 방금 낸 패와 같은 달이면:');
    html += `<ol class="cands"><li><span class="no">·</span><span>바닥에 짝이 없던 패 → <b>쪽</b>: 두 장 먹고 피 뺏기</span></li><li><span class="no">·</span><span>한 장과 짝지은 패 → <b>뻑</b>: 세 장이 묶여 못 먹음</span></li><li><span class="no">·</span><span>두 장 중 하나를 먹은 패 → <b>따닥</b>: 네 장 다 먹고 피 뺏기</span></li></ol>`;
  } else if (ph === 'choose') {
    const best = bestPick(st, 0, state.options);
    html += H('둘 중 하나 고르기');
    html += P(`뒤집은 패와 같은 달이 바닥에 <b>두 장</b> 있습니다: ${state.options.map(mini).join('')} 가져올 한 장을 ${hand ? '집으세요' : '누르세요'}.`);
    html += P(`<b class="rec">${eul(cardName(best))}</b> 추천합니다. <span class="why">이유 — ${KIND_OF(best) === 'pi' ? '피가 쌍피라 두 장 몫입니다' : `${{ gwang: '광', yeol: '열끗', tti: '띠' }[KIND_OF(best)]}은 피보다 점수 내기가 쉽습니다`}.</span>`);
  } else if (ph === 'decide') {
    const go = shouldGo(st, 0);
    html += H('3점 났습니다 — 고? 스톱?');
    html += P('<b>스톱</b> — 지금 점수로 판을 끝내고 두 사람에게서 돈을 받습니다.');
    html += P('<b>고</b> — 계속 칩니다. 다음에 나면 1고 +1점, 2고 +2점, 3고부터는 두 배씩. 하지만 그 전에 <b>남이 먼저 나면</b> 두 사람 몫을 혼자 물어냅니다(<b>고박</b>).');
    html += P(hand ? '<b>엄지를 올리면 고</b>, <b>손바닥을 펴 보이면 스톱</b>. 1초 동안 유지하세요.' : '버튼을 누르거나, 카메라가 켜져 있으면 엄지(고)·손바닥(스톱)을 1초 유지하세요.');
    html += P(`추천: <b class="rec">${go ? '고' : '스톱'}</b> — <span class="why">${go ? '남은 패가 넉넉하고 상대 점수가 낮아 더 키울 만합니다' : '상대가 점수에 가깝거나 남은 패가 적어, 받을 수 있을 때 받는 게 안전합니다'}.</span>`);
  } else if (ph === 'ai' || ph === 'busy') {
    html += H(st.turn === 0 ? '내 패가 움직이는 중' : `${NAMES[st.turn]} 차례`);
    html += P(st.turn === 0 ? '낸 패와 뒤집은 패로 무엇을 가져오는지 보세요.' : '상대가 무엇을 내고 가져가는지 보세요. 바닥에 남는 달이 다음 내 기회입니다.');
  } else if (ph === 'over') {
    html += H('판이 끝났습니다');
    html += P('결과 창에 점수 계산이 나옵니다. <b>광박</b>(광이 한 장도 없음)·<b>피박</b>(피가 6장 미만)인 사람은 두 배를 냅니다.');
  }

  if (state.note && performance.now() - state.note.at < 12000 && ph !== 'idle' && ph !== 'deal') {
    html += `<div class="note">${H('방금 일어난 일')}${P(state.note.text)}</div>`;
  }
  if (st) html += progressHtml(st.caps[0]);
  box.innerHTML = html;
}

/** My piles against each scoring goal, as small bars. */
function progressHtml(caps) {
  const c = caps.map((id) => CARDS[id]);
  const sc = score(caps);
  const row = (name, have, need, pts) => `<div class="gs-prog${have >= need ? ' done' : ''}"><span>${name}</span><i><b style="width:${Math.min(100, (have / need) * 100)}%"></b></i><em>${have}/${need}${pts ? ` · ${pts}` : ''}</em></div>`;
  let h = `<div class="gs-progress">${H(`내 점수 ${sc.total}점 <small>3점이면 고/스톱</small>`)}`;
  h += row('광', c.filter((x) => x.kind === 'gwang').length, 3, '3점');
  h += row('열끗', sc.yeol, 5, '1점');
  h += row('띠', c.filter((x) => x.kind === 'tti').length, 5, '1점');
  h += row('피', sc.pi, 10, '1점');
  for (const [r, nm] of [['hong', '홍단'], ['cheong', '청단'], ['cho', '초단']]) {
    const n = c.filter((x) => x.ribbon === r).length;
    if (n) h += row(nm, n, 3, '3점');
  }
  const birds = c.filter((x) => x.bird).length;
  if (birds) h += row('고도리', birds, 3, '5점');
  return `${h}</div>`;
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
    const best = state.recommend[0].card;
    state.recommend.filter((r) => matchesFor(state.st, r.card).length).slice(0, 4)
      .forEach((r, i) => tags.push({ id: r.card, label: r.card === best ? `${NUM[i]} 추천` : NUM[i], best: r.card === best }));
    if (!tags.some((t) => t.best)) tags.push({ id: best, label: '추천', best: true });
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
window.__gs = { state, scene, hand: shell.injectHandFrame, classify, layoutAll };
