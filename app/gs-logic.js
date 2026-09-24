// Go-Stop (3 players) rules engine: the 48 hwatu cards, dealing, one turn's matching
// (뻑 · 쪽 · 따닥 · 싹쓸이 · 폭탄 · 흔들기), scoring, go multipliers and settlement
// (광박 · 피박 · 고박 · 멍텅구리 · 나가리). Pure: no DOM, no randomness except the rng passed in.

export const PLAYERS = 3;
export const HAND = 7, FLOOR = 6;
export const WIN_MIN = 3; // points needed to stop or go with three players
export const MONTHS = ['송학', '매조', '벚꽃', '흑싸리', '난초', '모란', '홍싸리', '공산', '국진', '단풍', '오동', '비'];
const EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Each month's four cards: [file suffix, kind, extras]. kinds: gwang, yeol, tti, pi.
const DECK = [
  [['Hikari', 'gwang'], ['Tanzaku', 'tti', { ribbon: 'hong' }], ['Kasu_1', 'pi'], ['Kasu_2', 'pi']],
  [['Tane', 'yeol', { bird: true }], ['Tanzaku', 'tti', { ribbon: 'hong' }], ['Kasu_1', 'pi'], ['Kasu_2', 'pi']],
  [['Hikari', 'gwang'], ['Tanzaku', 'tti', { ribbon: 'hong' }], ['Kasu_1', 'pi'], ['Kasu_2', 'pi']],
  [['Tane', 'yeol', { bird: true }], ['Tanzaku', 'tti', { ribbon: 'cho' }], ['Kasu_1', 'pi'], ['Kasu_2', 'pi']],
  [['Tane', 'yeol'], ['Tanzaku', 'tti', { ribbon: 'cho' }], ['Kasu_1', 'pi'], ['Kasu_2', 'pi']],
  [['Tane', 'yeol'], ['Tanzaku', 'tti', { ribbon: 'cheong' }], ['Kasu_1', 'pi'], ['Kasu_2', 'pi']],
  [['Tane', 'yeol'], ['Tanzaku', 'tti', { ribbon: 'cho' }], ['Kasu_1', 'pi'], ['Kasu_2', 'pi']],
  [['Hikari', 'gwang'], ['Tane', 'yeol', { bird: true }], ['Kasu_1', 'pi'], ['Kasu_2', 'pi']],
  [['Tane', 'yeol', { flex: true }], ['Tanzaku', 'tti', { ribbon: 'cheong' }], ['Kasu_1', 'pi'], ['Kasu_2', 'pi']],
  [['Tane', 'yeol'], ['Tanzaku', 'tti', { ribbon: 'cheong' }], ['Kasu_1', 'pi'], ['Kasu_2', 'pi']],
  [['Hikari', 'gwang'], ['Kasu_2', 'pi', { pi: 2 }], ['Kasu_1', 'pi'], ['Kasu_3', 'pi']],
  [['Hikari', 'gwang', { rain: true }], ['Tane', 'yeol'], ['Tanzaku', 'tti'], ['Kasu', 'pi', { pi: 2 }]],
];

const KIND_NAME = { gwang: '광', yeol: '열끗', tti: '띠', pi: '피' };

/** CARDS[id]: id 0..47, month 1..12 (id >> 2 is month - 1). */
export const CARDS = DECK.flatMap((cards, m) => cards.map(([file, kind, x = {}], k) => ({
  id: m * 4 + k,
  month: m + 1,
  kind,
  pi: kind === 'pi' ? (x.pi ?? 1) : 0,
  ribbon: x.ribbon ?? null,
  bird: Boolean(x.bird),
  rain: Boolean(x.rain),
  flex: Boolean(x.flex), // 9월 국진: counts as 열끗 or as 쌍피, whichever scores more
  file: `Hwatu_${EN[m]}_${file}`,
  name: `${m + 1}월 ${MONTHS[m]} ${x.pi === 2 ? '쌍피' : KIND_NAME[kind]}`,
})));

export const monthOf = (id) => (id >> 2) + 1;
export const cardName = (id) => CARDS[id].name;

export function shuffled(rng = Math.random) {
  const a = [...Array(48).keys()];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const byMonth = (ids, m) => ids.filter((id) => monthOf(id) === m);
const monthCounts = (ids) => {
  const c = new Array(13).fill(0);
  for (const id of ids) c[monthOf(id)]++;
  return c;
};

// ---------- scoring ----------

/** Score a pile of captured cards. Returns total points and a breakdown. */
export function score(caps) {
  const cards = caps.map((id) => CARDS[id]);
  const gw = cards.filter((c) => c.kind === 'gwang');
  const tti = cards.filter((c) => c.kind === 'tti');
  const flex = cards.some((c) => c.flex);
  const baseYeol = cards.filter((c) => c.kind === 'yeol' && !c.flex);
  const basePi = cards.reduce((s, c) => s + c.pi, 0);

  const variant = (flexAsPi) => {
    const parts = [];
    const g = gw.length, rain = gw.some((c) => c.rain);
    if (g === 5) parts.push(['오광', 15]);
    else if (g === 4) parts.push(['사광', 4]);
    else if (g === 3) parts.push(rain ? ['비삼광', 2] : ['삼광', 3]);
    const yeol = baseYeol.length + (flex && !flexAsPi ? 1 : 0);
    if (yeol >= 5) parts.push([`열끗 ${yeol}장`, yeol - 4]);
    if (cards.filter((c) => c.bird).length === 3) parts.push(['고도리', 5]);
    if (tti.length >= 5) parts.push([`띠 ${tti.length}장`, tti.length - 4]);
    for (const [r, nm] of [['hong', '홍단'], ['cheong', '청단'], ['cho', '초단']]) {
      if (tti.filter((c) => c.ribbon === r).length === 3) parts.push([nm, 3]);
    }
    const pi = basePi + (flex && flexAsPi ? 2 : 0);
    if (pi >= 10) parts.push([`피 ${pi}장`, pi - 9]);
    const total = parts.reduce((s, p) => s + p[1], 0);
    return { total, parts: parts.map(([name, pts]) => ({ name, pts })), gwang: g, yeol, tti: tti.length, pi, flexAsPi };
  };
  const a = variant(false);
  if (!flex) return a;
  const b = variant(true);
  return b.total > a.total ? b : a;
}

/** Points a pile would be worth to its owner right now, with go bonuses applied. */
export function goPoints(base, go) {
  return (base + Math.min(go, 2)) * 2 ** Math.max(0, go - 2);
}

// ---------- a round ----------

/**
 * Deal a new round. Four of a month on the floor is a misdeal and is redealt. A player dealt all
 * four of a month wins on the spot (총통): `st.over` is already set.
 */
export function newRound({ dealer = 0, nagari = 0, rng = Math.random, deck = null } = {}) {
  for (;;) {
    const d = deck ? [...deck] : shuffled(rng);
    const hands = [0, 1, 2].map(() => []);
    for (let p = 0; p < PLAYERS; p++) hands[(dealer + p) % PLAYERS] = d.splice(0, HAND);
    const floor = d.splice(0, FLOOR);
    if (!deck && monthCounts(floor).some((n) => n === 4)) continue;
    const st = {
      dealer, nagari, turn: dealer, deck: d, floor, hands,
      caps: [[], [], []],
      go: [0, 0, 0], goScore: [0, 0, 0], shakes: [0, 0, 0], passes: [0, 0, 0],
      turnsLeft: [HAND, HAND, HAND], ppeokBy: {}, ppeoks: [0, 0, 0],
      shaken: [[], [], []], pending: null, over: null,
    };
    for (let p = 0; p < PLAYERS; p++) {
      const m = monthCounts(hands[p]).findIndex((n) => n === 4);
      if (m > 0 && !st.over) st.over = { kind: 'win', winner: p, reason: '총통', flat: 10, month: m };
    }
    return st;
  }
}

/** Floor cards a hand card would match. */
export const matchesFor = (st, id) => byMonth(st.floor, monthOf(id));

/** Months the player holds three of: can shake (floor has none) or bomb (floor has one). */
export function specials(st, p) {
  const c = monthCounts(st.hands[p]);
  const out = [];
  for (let m = 1; m <= 12; m++) {
    if (c[m] !== 3) continue;
    const onFloor = byMonth(st.floor, m).length;
    if (onFloor === 1) out.push({ kind: 'bomb', month: m });
    else if (onFloor === 0 && !st.shaken[p].includes(m)) out.push({ kind: 'shake', month: m });
  }
  return out;
}

function stealPi(st, p, events) {
  for (let o = 0; o < PLAYERS; o++) {
    if (o === p) continue;
    const pis = st.caps[o].filter((id) => CARDS[id].kind === 'pi').sort((a, b) => CARDS[a].pi - CARDS[b].pi);
    if (!pis.length) continue;
    const id = pis[0]; // the cheapest one: a plain 피 before a 쌍피
    st.caps[o] = st.caps[o].filter((x) => x !== id);
    st.caps[p].push(id);
    events.push({ type: 'steal', from: o, to: p, card: id });
  }
}

const take = (st, p, ids, events) => {
  st.floor = st.floor.filter((x) => !ids.includes(x));
  st.caps[p].push(...ids);
  events.push({ type: 'capture', p, cards: [...ids] });
};

/**
 * Play one turn for player `p`.
 *  - `card`: the hand card to play, or null to use a bomb pass (flip only).
 *  - `opts.bomb` / `opts.shake`: declare with a card of a month held three times.
 *  - `opts.choose(options, stage)`: async picker when two floor cards of a month could be taken;
 *    stage is 'hand' or 'flip'. Defaults to the better card.
 *  - `opts.onEvent(ev)`: async hook called as each step happens (for animation).
 * Resolves with the events. Afterwards check `st.pending` (a go/stop decision) and `st.over`.
 */
export async function playTurn(st, p, card, opts = {}) {
  const choose = opts.choose ?? (async (options) => bestOf(options));
  const events = [];
  const emit = async (ev) => { events.push(ev); if (opts.onEvent) await opts.onEvent(ev); };
  const special = [];
  const steal = async () => { const e = []; stealPi(st, p, e); for (const ev of e) await emit(ev); };
  const capture = async (ids) => { const e = []; take(st, p, ids, e); await emit(e[0]); };

  // ---- 1. the hand card ----
  let m = null, pendingHand = null; // cards of month m to take once the flip is known
  let k = 0;
  if (card === null) {
    if (st.passes[p] <= 0) throw new Error('no bomb pass');
    st.passes[p]--;
    await emit({ type: 'pass', p });
  } else {
    if (!st.hands[p].includes(card)) throw new Error('not in hand');
    m = monthOf(card);
    const onFloor = byMonth(st.floor, m);
    k = onFloor.length;
    if (opts.bomb) {
      const three = byMonth(st.hands[p], m);
      if (three.length !== 3 || k !== 1) throw new Error('no bomb');
      st.hands[p] = st.hands[p].filter((x) => !three.includes(x));
      st.shakes[p]++;
      st.passes[p] += 2;
      await emit({ type: 'bomb', p, cards: three, target: onFloor[0] });
      st.floor.push(...three);
      await capture([...three, onFloor[0]]);
      special.push('폭탄');
      await steal();
      m = null; // the month is gone; nothing left to pair with the flip
    } else {
      if (opts.shake) {
        if (byMonth(st.hands[p], m).length !== 3 || k !== 0) throw new Error('no shake');
        st.shakes[p]++;
        st.shaken[p].push(m);
        await emit({ type: 'shake', p, cards: byMonth(st.hands[p], m) });
      }
      st.hands[p] = st.hands[p].filter((x) => x !== card);
      if (k === 0) {
        st.floor.push(card);
        await emit({ type: 'play', p, card, target: null });
      } else if (k === 1 || k === 3) {
        await emit({ type: 'play', p, card, target: onFloor[0] });
        st.floor.push(card);
        pendingHand = [card, ...onFloor];
      } else {
        const pick = await choose(onFloor, 'hand');
        await emit({ type: 'play', p, card, target: pick });
        st.floor.push(card);
        pendingHand = [card, pick];
      }
    }
  }
  st.turnsLeft[p]--;

  // ---- 2. the flip ----
  const flip = st.deck.shift();
  const m2 = flip === undefined ? null : monthOf(flip);
  if (flip !== undefined) await emit({ type: 'flip', p, card: flip });

  if (flip !== undefined && m2 === m) {
    if (k === 0) {
      // 쪽: the flip lands on the card just played
      st.floor.push(flip);
      await capture([card, flip]);
      special.push('쪽');
      await steal();
    } else if (k === 1) {
      // 뻑: three of the month stay on the floor, stacked
      st.floor.push(flip);
      st.ppeokBy[m] = p;
      st.ppeoks[p]++;
      await emit({ type: 'ppeok', p, month: m });
      special.push('뻑');
    } else if (k === 2) {
      // 따닥: all four
      st.floor.push(flip);
      await capture(byMonth(st.floor, m));
      special.push('따닥');
      await steal();
    }
    pendingHand = null;
  } else {
    if (pendingHand) {
      const stack = k === 3;
      await capture(stack ? byMonth(st.floor, m) : pendingHand);
      if (stack) {
        const by = st.ppeokBy[m];
        delete st.ppeokBy[m];
        special.push(by === p ? '자뻑' : '뻑 먹기');
        await steal();
        if (by === p) await steal();
      }
    }
    if (flip !== undefined) {
      const onFloor = byMonth(st.floor, m2);
      st.floor.push(flip);
      if (onFloor.length === 1) await capture([flip, onFloor[0]]);
      else if (onFloor.length === 2) {
        const pick = await choose(onFloor, 'flip');
        await capture([flip, pick]);
      } else if (onFloor.length === 3) {
        const by = st.ppeokBy[m2];
        delete st.ppeokBy[m2];
        await capture(byMonth(st.floor, m2));
        special.push(by === p ? '자뻑' : '뻑 먹기');
        await steal();
        if (by === p) await steal();
      } else await emit({ type: 'lay', p, card: flip });
    }
  }

  // 싹쓸이: the floor swept clean (not on the very last flip)
  if (!st.floor.length && st.deck.length) {
    special.push('싹쓸이');
    await steal();
  }
  if (special.length) await emit({ type: 'special', p, names: special });

  // ---- 3. can this player stop? ----
  const s = score(st.caps[p]);
  if (st.ppeoks[p] >= 3) {
    st.over = { kind: 'win', winner: p, reason: '삼뻑', flat: 10 };
  } else if (s.total >= WIN_MIN && s.total > st.goScore[p]) {
    const last = st.turnsLeft[p] <= 0;
    if (last) st.over = { kind: 'win', winner: p, reason: '스톱' };
    else st.pending = { p, score: s.total };
  }
  if (!st.over && !st.pending) advance(st);
  return events;
}

function advance(st) {
  if (st.turnsLeft.every((n) => n <= 0)) {
    st.over = { kind: 'nagari' };
    return;
  }
  do st.turn = (st.turn + 1) % PLAYERS; while (st.turnsLeft[st.turn] <= 0);
}

/** Answer a pending go/stop. */
export function decide(st, go) {
  const { p, score: sc } = st.pending;
  st.pending = null;
  if (go) {
    st.go[p]++;
    st.goScore[p] = sc;
    advance(st);
  } else st.over = { kind: 'win', winner: p, reason: '스톱' };
}

// ---------- settlement ----------

/**
 * What each loser pays the winner, in points (multiply by the stake). Handles go bonuses,
 * 흔들기/폭탄, 멍텅구리, 광박, 피박, 고박 and carried-over 나가리.
 */
export function settle(st) {
  const o = st.over;
  if (!o || o.kind !== 'win') return null;
  const w = o.winner;
  const s = score(st.caps[w]);
  const mult = [];
  let points;
  if (o.flat) points = o.flat;
  else {
    points = goPoints(s.total, st.go[w]);
    if (st.go[w] >= 3) mult.push({ name: `${st.go[w]}고`, x: 2 ** (st.go[w] - 2) });
  }
  let x = 1;
  if (st.shakes[w]) { x *= 2 ** st.shakes[w]; mult.push({ name: st.shakes[w] > 1 ? `흔들기·폭탄 ${st.shakes[w]}번` : '흔들기·폭탄', x: 2 ** st.shakes[w] }); }
  if (!o.flat && s.yeol >= 7) { x *= 2; mult.push({ name: '멍텅구리', x: 2 }); }
  if (st.nagari) { x *= 2 ** st.nagari; mult.push({ name: `나가리 ${st.nagari}번`, x: 2 ** st.nagari }); }
  points *= x;

  const losers = [0, 1, 2].filter((p) => p !== w);
  const pay = [0, 0, 0];
  const bak = [[], [], []];
  for (const l of losers) {
    if (o.flat) { pay[l] = points; continue; }
    const ls = score(st.caps[l]);
    let v = points;
    if (s.parts.some((q) => /광/.test(q.name)) && ls.gwang === 0) { v *= 2; bak[l].push('광박'); }
    if (s.parts.some((q) => q.name.startsWith('피')) && ls.pi < 6) { v *= 2; bak[l].push('피박'); }
    pay[l] = v;
  }
  // 고박: a loser who called go and then lost pays everyone's share
  const goer = losers.find((l) => st.go[l] > 0);
  if (goer !== undefined && !o.flat) {
    const other = losers.find((l) => l !== goer);
    pay[goer] += pay[other];
    pay[other] = 0;
    bak[goer].push('고박');
  }
  const delta = [0, 0, 0];
  for (const l of losers) { delta[l] = -pay[l]; delta[w] += pay[l]; }
  return { winner: w, reason: o.reason, score: s, go: st.go[w], points, mult, bak, delta };
}

// ---------- AI and hints ----------

/** How much a card is worth taking to this player, given what they already hold. */
export function cardValue(st, p, id) {
  const c = CARDS[id];
  const have = st.caps[p].map((x) => CARDS[x]);
  if (c.kind === 'gwang') return 7 + have.filter((x) => x.kind === 'gwang').length * 2 - (c.rain ? 2 : 0);
  if (c.kind === 'yeol') return (c.bird ? 5 + have.filter((x) => x.bird).length * 2 : 3) + (c.flex ? 1 : 0);
  if (c.kind === 'tti') return 3 + (c.ribbon ? have.filter((x) => x.ribbon === c.ribbon).length * 2 : 0);
  return c.pi * 1.6 + (have.reduce((s, x) => s + x.pi, 0) >= 7 ? 1 : 0);
}

const BASE = { gwang: 9, yeol: 4, tti: 3, pi: 0 };
const plainValue = (id) => BASE[CARDS[id].kind] + CARDS[id].pi;
const bestOf = (ids, st = null, p = 0) => [...ids].sort((a, b) => (st ? cardValue(st, p, b) - cardValue(st, p, a) : plainValue(b) - plainValue(a)))[0];
export const bestPick = (st, p, ids) => bestOf(ids, st, p);

/**
 * Rank the hand for player p: what each card would take now, what it gives away, and why.
 * Returns [{card, value, reason, takes}] best first.
 */
export function rankHand(st, p) {
  const seen = new Set([...st.floor, ...st.hands[p], ...st.caps.flat()]);
  const unseenMonth = monthCounts([...Array(48).keys()].filter((id) => !seen.has(id)));
  const out = st.hands[p].map((id) => {
    const m = monthOf(id);
    const on = byMonth(st.floor, m);
    const inHand = byMonth(st.hands[p], m).length;
    let value = 0, takes = [], reason;
    if (on.length === 3) {
      takes = [id, ...on];
      value = takes.reduce((s, x) => s + cardValue(st, p, x), 0) + 4;
      reason = '뻑 난 네 장을 모두 가져오고 피도 한 장씩 받습니다';
    } else if (on.length >= 1) {
      const pick = bestOf(on, st, p);
      takes = [id, pick];
      value = cardValue(st, p, id) + cardValue(st, p, pick);
      // leaving the month's last card out there lets the next player finish it
      if (on.length === 1 && unseenMonth[m] >= 1 && inHand === 1) value -= 0.5;
      reason = `${CARDS[pick].name}${on.length === 2 ? '(둘 중 좋은 쪽)' : ''}을 가져옵니다`;
    } else {
      // no match: throwing it gives the others a card; prefer cheap ones nobody needs
      const risk = Math.max(...[0, 1, 2].filter((o) => o !== p).map((o) => cardValue(st, o, id)));
      value = -risk * 0.6 - (inHand >= 2 ? 1.5 : 0);
      reason = inHand >= 2 ? '짝이 없지만 같은 달을 더 들고 있어 아깝습니다' : '짝이 없어 버립니다 — 상대에게 줘도 덜 아픈 패';
    }
    return { card: id, value, reason, takes };
  });
  return out.sort((a, b) => b.value - a.value);
}

/** AI go/stop: go while it's early, the lead is safe and nobody else is close. */
export function shouldGo(st, p) {
  const left = st.turnsLeft[p];
  if (left <= 1) return false;
  const threat = Math.max(...[0, 1, 2].filter((o) => o !== p).map((o) => score(st.caps[o]).total));
  if (threat >= 2) return false;
  return st.go[p] < 2 && left >= 3;
}
