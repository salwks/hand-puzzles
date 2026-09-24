// Riichi mahjong rules engine (no DOM): tiles, shanten, winning shapes, waits, yaku, fu and points.
//
// Tile types 0..33: 0-8 man (1-9m), 9-17 pin (1-9p), 18-26 sou (1-9s),
// 27-30 winds E S W N, 31-33 dragons 白 發 中. The 136 physical tiles have ids 0..135, type = id >> 2.
// Melds: { kind: 'chi' | 'pon' | 'kan' | 'ankan', tiles: [types], from?: seat }. 'ankan' stays closed.

export const EAST = 27, HAKU = 31, HATSU = 32, CHUN = 33;
export const typeOf = (id) => id >> 2;
export const isHonor = (t) => t >= 27;
export const isTerminal = (t) => t < 27 && (t % 9 === 0 || t % 9 === 8);
export const isYaochu = (t) => isHonor(t) || isTerminal(t);
export const suitOf = (t) => (t < 27 ? Math.floor(t / 9) : 3);

const SUIT_KO = ['만', '통', '삭'];
const HONOR_KO = ['동', '남', '서', '북', '백', '발', '중'];
export const tileName = (t) => (t < 27 ? `${(t % 9) + 1}${SUIT_KO[suitOf(t)]}` : HONOR_KO[t - 27]);

/** Parse '123m456p77z' style strings into types (z: 1-7 = 동남서북백발중). For tests and demos. */
export function parse(str) {
  const out = [];
  for (const [, digits, suit] of str.matchAll(/(\d+)([mpsz])/g)) {
    for (const d of digits) out.push(suit === 'z' ? 26 + Number(d) : 'mps'.indexOf(suit) * 9 + Number(d) - 1);
  }
  return out;
}

export function counts(types) {
  const c = new Array(34).fill(0);
  for (const t of types) c[t]++;
  return c;
}

export function makeWall(rng = Math.random) {
  const w = Array.from({ length: 136 }, (_, i) => i);
  for (let i = w.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [w[i], w[j]] = [w[j], w[i]];
  }
  return w;
}

/** The dora a dora-indicator points to. */
export function doraFrom(ind) {
  if (ind < 27) return ind - (ind % 9) + ((ind % 9) + 1) % 9;
  if (ind <= 30) return 27 + ((ind - 27 + 1) % 4);
  return 31 + ((ind - 31 + 1) % 3);
}

// ---------- shanten ----------

function standardShanten(c, meldCount) {
  let best = 8, m = 0, t = 0, p = 0;
  const maxSets = 4 - meldCount;
  const rec = (i) => {
    while (i < 34 && !c[i]) i++;
    if (i >= 34) {
      const tt = Math.min(t, maxSets - m);
      const s = 8 - 2 * (m + meldCount) - tt - p;
      if (s < best) best = s;
      return;
    }
    if (m < maxSets) {
      if (c[i] >= 3) { c[i] -= 3; m++; rec(i); m--; c[i] += 3; }
      if (i < 27 && i % 9 <= 6 && c[i + 1] && c[i + 2]) { c[i]--; c[i + 1]--; c[i + 2]--; m++; rec(i); m--; c[i]++; c[i + 1]++; c[i + 2]++; }
    }
    if (c[i] >= 2) {
      c[i] -= 2;
      if (!p) { p = 1; rec(i); p = 0; }
      t++; rec(i); t--;
      c[i] += 2;
    }
    if (i < 27 && i % 9 <= 7 && c[i + 1]) { c[i]--; c[i + 1]--; t++; rec(i); t--; c[i]++; c[i + 1]++; }
    if (i < 27 && i % 9 <= 6 && c[i + 2]) { c[i]--; c[i + 2]--; t++; rec(i); t--; c[i]++; c[i + 2]++; }
    c[i]--; rec(i); c[i]++; // this copy stays isolated
  };
  rec(0);
  return best;
}

function chiitoiShanten(c) {
  let pairs = 0, kinds = 0;
  for (const n of c) { if (n >= 2) pairs++; if (n >= 1) kinds++; }
  return 6 - pairs + Math.max(0, 7 - kinds);
}

function kokushiShanten(c) {
  let kinds = 0, pair = 0;
  for (let t = 0; t < 34; t++) if (isYaochu(t) && c[t]) { kinds++; if (c[t] >= 2) pair = 1; }
  return 13 - kinds - pair;
}

/** Tiles away from a winning hand (-1 = complete, 0 = tenpai). `c` = closed-hand counts. */
export function shanten(c, meldCount = 0) {
  const cc = [...c];
  let s = standardShanten(cc, meldCount);
  if (meldCount === 0) s = Math.min(s, chiitoiShanten(c), kokushiShanten(c));
  return s;
}

/** Types that would complete this 13-tile (or 13 - 3·melds) closed hand. */
export function waits(c, meldCount = 0) {
  const out = [];
  for (let t = 0; t < 34; t++) {
    if (c[t] >= 4) continue;
    c[t]++;
    if (shanten(c, meldCount) === -1) out.push(t);
    c[t]--;
  }
  return out;
}

// ---------- decomposition ----------

/** All ways to split a complete closed part into a pair + sets. [{ pair, sets: [{ kind: 'seq'|'tri', t }] }] */
export function decompose(c) {
  const out = [];
  const sets = [];
  const rec = (i) => {
    while (i < 34 && !c[i]) i++;
    if (i >= 34) { out.push(sets.map((s) => ({ ...s }))); return; }
    if (c[i] >= 3) { c[i] -= 3; sets.push({ kind: 'tri', t: i }); rec(i); sets.pop(); c[i] += 3; }
    if (i < 27 && i % 9 <= 6 && c[i + 1] && c[i + 2]) {
      c[i]--; c[i + 1]--; c[i + 2]--; sets.push({ kind: 'seq', t: i }); rec(i); sets.pop(); c[i]++; c[i + 1]++; c[i + 2]++;
    }
  };
  const res = [];
  for (let p = 0; p < 34; p++) {
    if (c[p] < 2) continue;
    c[p] -= 2;
    out.length = 0;
    rec(0);
    for (const s of out) res.push({ pair: p, sets: s });
    c[p] += 2;
  }
  return res;
}

const isChiitoi = (c) => c.filter((n) => n === 2).length === 7;
const isKokushi = (c) => { let k = 0, pr = 0; for (let t = 0; t < 34; t++) { if (isYaochu(t) && c[t]) { k++; if (c[t] === 2) pr++; } else if (c[t]) return false; } return k === 13 && pr === 1; };

// ---------- scoring ----------

function roundUp100(x) { return Math.ceil(x / 100) * 100; }

/** Base points → what each player pays. */
export function payments(han, fu, { dealer, tsumo }) {
  let base = fu * 2 ** (han + 2), limit = '';
  if (han >= 13) { base = 8000; limit = '역만'; }
  else if (han >= 11) { base = 6000; limit = '삼배만'; }
  else if (han >= 8) { base = 4000; limit = '배만'; }
  else if (han >= 6) { base = 3000; limit = '하네만'; }
  else if (han >= 5 || base >= 2000) { base = 2000; limit = '만관'; }
  if (!tsumo) { const total = roundUp100(base * (dealer ? 6 : 4)); return { total, ron: total, limit }; }
  if (dealer) { const each = roundUp100(base * 2); return { total: each * 3, each, limit }; }
  const fromDealer = roundUp100(base * 2), fromOthers = roundUp100(base);
  return { total: fromDealer + fromOthers * 2, fromDealer, fromOthers, limit };
}

/**
 * Evaluate a finished hand. ctx:
 *   closed: types of the closed hand INCLUDING the winning tile (14 - 3·melds tiles)
 *   melds, winTile, tsumo, riichi, ippatsu, lastTile, seatWind (27-30), roundWind, doraIndicators: [types]
 * Returns null when the shape isn't complete or has no yaku, else
 *   { han, fu, yaku: [{ name, han }], dora, yakuman, points }.
 */
export function evaluate(ctx) {
  const { closed, melds = [], winTile, tsumo = false, riichi = false, ippatsu = false, lastTile = false,
    seatWind = EAST, roundWind = EAST, doraIndicators = [], dealer = seatWind === EAST } = ctx;
  const c = counts(closed);
  const isClosed = melds.every((m) => m.kind === 'ankan');
  const allTypes = [...closed, ...melds.flatMap((m) => m.tiles)];
  const doraTypes = doraIndicators.map(doraFrom);
  const dora = allTypes.reduce((n, t) => n + doraTypes.filter((d) => d === t).length, 0);

  const common = [];
  if (riichi) common.push({ name: '리치', han: 1 });
  if (riichi && ippatsu) common.push({ name: '일발', han: 1 });
  if (isClosed && tsumo) common.push({ name: '멘젠쯔모', han: 1 });
  if (lastTile) common.push({ name: tsumo ? '해저로월' : '하저로어', han: 1 });

  const candidates = [];
  const flush = () => {
    const suits = new Set(allTypes.filter((t) => t < 27).map(suitOf));
    const honors = allTypes.some(isHonor);
    if (suits.size === 1 && !honors) return { name: '청일색', han: isClosed ? 6 : 5 };
    if (suits.size === 1 && honors) return { name: '혼일색', han: isClosed ? 3 : 2 };
    return null;
  };
  const tanyao = allTypes.every((t) => !isYaochu(t)) ? { name: '탕야오', han: 1 } : null;

  // Thirteen orphans and seven pairs are shapes of their own.
  if (melds.length === 0 && isKokushi(c)) candidates.push({ yaku: [{ name: '국사무쌍', han: 13 }], fu: 30, yakuman: true });
  if (melds.length === 0 && isChiitoi(c)) {
    const y = [...common, { name: '치또이츠', han: 2 }];
    if (tanyao) y.push(tanyao);
    const f = flush(); if (f) y.push(f);
    if (allTypes.every(isYaochu)) y.push({ name: '혼노두', han: 2 });
    candidates.push({ yaku: y, fu: 25 });
  }

  for (const d of decompose(c)) {
    // Every way the winning tile could have completed the hand is a different reading.
    const readings = [];
    if (d.pair === winTile) readings.push({ wait: 'tanki' });
    d.sets.forEach((s, i) => {
      if (s.kind === 'tri' && s.t === winTile) readings.push({ wait: 'shanpon', set: i });
      if (s.kind === 'seq' && winTile >= s.t && winTile <= s.t + 2) {
        const pos = winTile - s.t, n = s.t % 9;
        const w = pos === 1 ? 'kanchan' : (pos === 0 && n === 6) || (pos === 2 && n === 0) ? 'penchan' : 'ryanmen';
        readings.push({ wait: w, set: i });
      }
    });
    for (const r of readings) candidates.push(scoreReading(d, r));
  }

  function scoreReading(d, r) {
    const openSets = melds.map((m) => ({
      kind: m.kind === 'chi' ? 'seq' : m.kind === 'pon' ? 'tri' : 'kan',
      t: Math.min(...m.tiles), open: m.kind !== 'ankan',
    }));
    // A triplet finished off someone else's discard counts as open.
    const closedSets = d.sets.map((s, i) => ({ ...s, open: !tsumo && r.wait === 'shanpon' && r.set === i }));
    const sets = [...closedSets, ...openSets];
    const trips = sets.filter((s) => s.kind !== 'seq');
    const seqs = sets.filter((s) => s.kind === 'seq');
    const yakuhai = (t) => (t >= HAKU ? 1 : 0) + (t === seatWind ? 1 : 0) + (t === roundWind ? 1 : 0);
    const y = [...common];

    const concealedTrips = trips.filter((s) => !s.open).length;
    const dragonTrips = trips.filter((s) => s.t >= HAKU).length;
    if (dragonTrips === 3) return { yaku: [{ name: '대삼원', han: 13 }], fu: 30, yakuman: true };
    if (concealedTrips === 4) return { yaku: [{ name: '스안커', han: 13 }], fu: 30, yakuman: true };

    if (tanyao) y.push(tanyao);
    const pinfu = isClosed && seqs.length === 4 && !yakuhai(d.pair) && r.wait === 'ryanmen';
    if (pinfu) y.push({ name: '핑후', han: 1 });
    for (const s of trips) {
      if (s.t >= HAKU) y.push({ name: `역패 ${HONOR_KO[s.t - 27]}`, han: 1 });
      if (s.t === seatWind) y.push({ name: '자풍패', han: 1 });
      if (s.t === roundWind) y.push({ name: '장풍패', han: 1 });
    }
    if (isClosed) {
      const keys = seqs.map((s) => s.t).sort((a, b) => a - b);
      let dup = 0;
      for (let i = 0; i < keys.length - 1; i++) if (keys[i] === keys[i + 1]) { dup++; i++; }
      if (dup === 2) y.push({ name: '량페코', han: 3 });
      else if (dup === 1) y.push({ name: '이페코', han: 1 });
    }
    for (let n = 0; n < 7; n++) if ([0, 9, 18].every((b) => seqs.some((s) => s.t === b + n))) { y.push({ name: '삼색동순', han: isClosed ? 2 : 1 }); break; }
    for (const b of [0, 9, 18]) if ([0, 3, 6].every((k) => seqs.some((s) => s.t === b + k))) { y.push({ name: '일기통관', han: isClosed ? 2 : 1 }); break; }
    if (trips.length === 4) y.push({ name: '또이또이', han: 2 });
    if (concealedTrips === 3) y.push({ name: '삼암각', han: 2 });
    if (dragonTrips === 2 && d.pair >= HAKU) y.push({ name: '소삼원', han: 2 });
    const f = flush(); if (f) y.push(f);
    const hasYaochu = (s) => (s.kind === 'seq' ? s.t % 9 === 0 || s.t % 9 === 6 : isYaochu(s.t));
    if (sets.every(hasYaochu) && isYaochu(d.pair)) {
      if (seqs.length === 0) y.push({ name: '혼노두', han: 2 });
      else if (!allTypes.some(isHonor)) y.push({ name: '준찬타', han: isClosed ? 3 : 2 });
      else y.push({ name: '찬타', han: isClosed ? 2 : 1 });
    }

    // fu
    let fu = 20;
    if (pinfu) fu = tsumo ? 20 : 30;
    else {
      if (isClosed && !tsumo) fu += 10;
      if (tsumo) fu += 2;
      for (const s of sets) {
        if (s.kind === 'seq') continue;
        let v = s.kind === 'kan' ? 8 : 2;
        if (!s.open) v *= 2;
        if (isYaochu(s.t)) v *= 2;
        fu += v;
      }
      fu += 2 * yakuhai(d.pair);
      if (['tanki', 'kanchan', 'penchan'].includes(r.wait)) fu += 2;
      fu = Math.max(30, Math.ceil(fu / 10) * 10);
    }
    return { yaku: y, fu };
  }

  let best = null;
  for (const cand of candidates) {
    if (!cand.yaku.length) continue; // no yaku, no win
    const yakuHan = cand.yaku.reduce((s, x) => s + x.han, 0);
    const han = cand.yakuman ? yakuHan : yakuHan + dora;
    const points = payments(han, cand.fu, { dealer, tsumo });
    if (!best || points.total > best.points.total) best = { han, fu: cand.fu, yaku: cand.yaku, dora: cand.yakuman ? 0 : dora, yakuman: Boolean(cand.yakuman), points };
  }
  return best;
}

// ---------- calls ----------

export function ponOK(c, t) { return c[t] >= 2; }
export function kanOK(c, t) { return c[t] >= 3; }
/** Chi options for a discard from the player on the left: [[a, b], ...] closed types to use. */
export function chiOptions(c, t) {
  if (t >= 27) return [];
  const n = t % 9, out = [];
  if (n >= 2 && c[t - 2] && c[t - 1]) out.push([t - 2, t - 1]);
  if (n >= 1 && n <= 7 && c[t - 1] && c[t + 1]) out.push([t - 1, t + 1]);
  if (n <= 6 && c[t + 1] && c[t + 2]) out.push([t + 1, t + 2]);
  return out;
}

// ---------- AI helpers ----------

/** Number of unseen tiles that would lower the shanten of this hand. */
export function ukeire(c, meldCount, unseen) {
  const s = shanten(c, meldCount);
  let n = 0;
  for (let t = 0; t < 34; t++) {
    if (!unseen[t] || c[t] >= 4) continue;
    c[t]++;
    if (shanten(c, meldCount) < s) n += unseen[t];
    c[t]--;
  }
  return n;
}

/** Discard that keeps the hand closest to winning (shanten, then acceptance, then shedding honors/terminals). */
export function bestDiscard(c, meldCount, unseen, avoid = null) {
  let best = null;
  for (let t = 0; t < 34; t++) {
    if (!c[t]) continue;
    c[t]--;
    const s = shanten(c, meldCount);
    const u = s <= 3 ? ukeire(c, meldCount, unseen) : 0;
    c[t]++;
    const danger = avoid ? avoid(t) : 0;
    const score = -s * 1000 + u - danger * 40 + (isYaochu(t) ? 3 : 0);
    if (!best || score > best.score) best = { t, s, u, score };
  }
  return best;
}
