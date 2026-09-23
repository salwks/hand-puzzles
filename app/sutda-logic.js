// 섯다 rules: the 20-card deck, hand ranking (족보) and the showdown with its special hands.
// A card is { id, month: 1..10, kind: 'gwang' | 'yeol' | 'tti' }.

export function deckCards() {
  const cards = [];
  for (let month = 1; month <= 10; month++) {
    cards.push({ id: month * 2 - 2, month, kind: [1, 3, 8].includes(month) ? 'gwang' : 'yeol' });
    cards.push({ id: month * 2 - 1, month, kind: 'tti' });
  }
  return cards;
}

export function shuffle(list, rng = Math.random) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const cardName = (c) => `${c.month}${c.kind === 'gwang' ? '광' : c.kind === 'yeol' ? '열끗' : ''}`;

const PAIRS = [[[1, 2], 800, '알리'], [[1, 4], 790, '독사'], [[1, 9], 780, '구삥'], [[1, 10], 770, '장삥'],
  [[4, 10], 760, '장사'], [[4, 6], 750, '세륙']];

/** { score, name, special } — special hands keep a nominal score and act only in the showdown. */
export function handOf([a, b]) {
  const has = (m, k) => (a.month === m && a.kind === k) || (b.month === m && b.kind === k);
  const months = [a.month, b.month].sort((x, y) => x - y);
  const is = (x, y) => months[0] === x && months[1] === y;
  if (has(3, 'gwang') && has(8, 'gwang')) return { score: 1000, name: '38광땡' };
  if (has(1, 'gwang') && has(8, 'gwang')) return { score: 990, name: '18광땡' };
  if (has(1, 'gwang') && has(3, 'gwang')) return { score: 980, name: '13광땡' };
  if (a.month === b.month) return { score: 900 + a.month, name: a.month === 10 ? '장땡' : `${a.month}땡` };
  if (has(4, 'yeol') && has(7, 'yeol')) return { score: 1, name: '암행어사', special: 'amhaeng' };
  if (has(3, 'gwang') && has(7, 'yeol')) return { score: 0, name: '땡잡이', special: 'ttaeng' };
  if (has(4, 'yeol') && has(9, 'yeol')) return { score: 3, name: '멍텅구리구사', special: 'mgusa' };
  if (is(4, 9)) return { score: 3, name: '구사', special: 'gusa' };
  for (const [[x, y], score, name] of PAIRS) if (is(x, y)) return { score, name };
  const k = (a.month + b.month) % 10;
  return { score: k, name: k === 9 ? '갑오' : k === 0 ? '망통' : `${k}끗` };
}

/**
 * hands: [{ id, hand }]. Returns { winners: [id], rematch: bool, reason }.
 * 암행어사 beats 13·18광땡, 땡잡이 beats 1~9땡, 구사 / 멍텅구리구사 call a rematch
 * when the best other hand is no better than 알리 / 9땡.
 */
export function showdown(hands) {
  const top = (list) => Math.max(...list.map((h) => h.hand.score));
  const plainTop = top(hands);
  const holderOf = (special) => hands.find((h) => h.hand.special === special);
  const others = (h) => hands.filter((x) => x !== h);

  const am = holderOf('amhaeng');
  if (am && [980, 990].includes(top(others(am)))) return { winners: [am.id], reason: '암행어사가 광땡을 잡았습니다' };
  const tt = holderOf('ttaeng');
  if (tt && top(others(tt)) >= 901 && top(others(tt)) <= 909) return { winners: [tt.id], reason: '땡잡이가 땡을 잡았습니다' };
  const mg = holderOf('mgusa');
  if (mg && top(others(mg)) <= 909) return { winners: [], rematch: true, reason: '멍텅구리구사 — 재경기' };
  const gs = holderOf('gusa');
  if (gs && top(others(gs)) <= 800) return { winners: [], rematch: true, reason: '구사 — 재경기' };
  return { winners: hands.filter((h) => h.hand.score === plainTop).map((h) => h.id) };
}

// Strength 0..1 = share of all 190 possible hands this one beats (special hands count as middling).
const ALL = (() => {
  const d = deckCards(), scores = [];
  for (let i = 0; i < d.length; i++) for (let j = i + 1; j < d.length; j++) scores.push(handOf([d[i], d[j]]).score);
  return scores.sort((x, y) => x - y);
})();
export function strength(hand) {
  if (hand.special === 'amhaeng' || hand.special === 'ttaeng') return 0.5;
  return ALL.filter((s) => s < hand.score).length / ALL.length;
}
