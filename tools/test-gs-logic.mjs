import * as G from '../app/gs-logic.js';
const { CARDS, score, newRound, playTurn, decide, settle, goPoints, rankHand, shouldGo, specials, bestPick } = G;
let fail = 0;
const eq = (name, got, want) => { const g = JSON.stringify(got), w = JSON.stringify(want); if (g !== w) { fail++; console.log('FAIL', name, 'got', g, 'want', w); } };
const C = (m, k) => (m - 1) * 4 + k; // month 1..12, k-th card of the month
const sc = (ids) => score(ids).total;

/** A round with p0 (dealer) holding `hand`, the floor `floor`, and `top` next on the deck. */
function rig(hand, floor, top = [], { p1 = [], p2 = [] } = {}) {
  const named = [...hand, ...floor, ...top, ...p1, ...p2];
  const months = new Set(named.map(G.monthOf));
  // filler comes from months the test doesn't touch, so it can't match by accident
  const filler = [...Array(48).keys()].filter((i) => !months.has(G.monthOf(i))).sort((a, b) => (a & 3) - (b & 3) || a - b); // spread months so nobody is dealt 총통
  const fill = (a, n) => { while (a.length < n) a.push(filler.shift()); return a; };
  const h0 = fill([...hand], 7), h1 = fill([...p1], 7), h2 = fill([...p2], 7), fl = fill([...floor], 6);
  const used = new Set([...h0, ...h1, ...h2, ...fl, ...top]);
  const deck = [...h0, ...h1, ...h2, ...fl, ...top, ...[...Array(48).keys()].filter((i) => !used.has(i))];
  return newRound({ dealer: 0, deck });
}
const run = (st, p, card, opts) => playTurn(st, p, card, opts);

// ---- the deck ----
eq('48 cards', CARDS.length, 48);
eq('5 gwang', CARDS.filter((c) => c.kind === 'gwang').length, 5);
eq('9 yeol', CARDS.filter((c) => c.kind === 'yeol').length, 9);
eq('10 tti', CARDS.filter((c) => c.kind === 'tti').length, 10);
eq('pi value 26', CARDS.reduce((s, c) => s + c.pi, 0), 26);
eq('names', [CARDS[C(12, 0)].name, CARDS[C(11, 1)].name], ['12월 비 광', '11월 오동 쌍피']);

// ---- scoring ----
eq('삼광', sc([C(1, 0), C(3, 0), C(8, 0)]), 3);
eq('비삼광', sc([C(1, 0), C(3, 0), C(12, 0)]), 2);
eq('사광', sc([C(1, 0), C(3, 0), C(8, 0), C(12, 0)]), 4);
eq('오광', sc([C(1, 0), C(3, 0), C(8, 0), C(11, 0), C(12, 0)]), 15);
eq('고도리', sc([C(2, 0), C(4, 0), C(8, 1)]), 5);
eq('홍단', sc([C(1, 1), C(2, 1), C(3, 1)]), 3);
eq('청단+초단', sc([C(6, 1), C(9, 1), C(10, 1), C(4, 1), C(5, 1), C(7, 1)]), 3 + 3 + 2);
eq('비띠 not a set', sc([C(12, 2), C(1, 1), C(2, 1)]), 0);
const tenPi = [C(1, 2), C(1, 3), C(2, 2), C(2, 3), C(3, 2), C(3, 3), C(4, 2), C(4, 3), C(5, 2), C(5, 3)];
eq('피 10 = 1', sc(tenPi), 1);
eq('쌍피 counts 2', sc([...tenPi.slice(0, 8), C(12, 3)]), 1);
eq('9월 열끗 as 쌍피', score([...tenPi.slice(0, 8), C(9, 0)]).pi, 10);
eq('9월 stays 열끗 when that scores', score([C(2, 0), C(4, 0), C(5, 0), C(6, 0), C(9, 0)]).yeol, 5);
eq('go points', [goPoints(4, 0), goPoints(4, 1), goPoints(4, 2), goPoints(4, 3), goPoints(4, 4)], [4, 5, 6, 12, 24]);

// ---- turns ----
{ // plain pair on each step
  const st = rig([C(1, 0)], [C(1, 2), C(5, 2)], [C(5, 3)]);
  await run(st, 0, C(1, 0));
  eq('pair + flip pair', st.caps[0].sort((a, b) => a - b), [C(1, 0), C(1, 2), C(5, 2), C(5, 3)].sort((a, b) => a - b));
  eq('turn passes', st.turn, 1);
}
{ // 쪽
  const st = rig([C(2, 0)], [C(6, 2)], [C(2, 2)]);
  st.caps[1] = [C(10, 2)]; st.caps[2] = [C(12, 3)];
  const ev = await run(st, 0, C(2, 0));
  eq('쪽 captures both', st.caps[0].includes(C(2, 0)) && st.caps[0].includes(C(2, 2)), true);
  eq('쪽 steals a 피 from each', [st.caps[1].length, st.caps[2].length], [0, 0]);
  eq('쪽 named', ev.find((e) => e.type === 'special')?.names, ['쪽']);
}
{ // 뻑
  const st = rig([C(3, 2)], [C(3, 0)], [C(3, 3)]);
  const ev = await run(st, 0, C(3, 2));
  eq('뻑 leaves three', st.floor.filter((id) => G.monthOf(id) === 3).length, 3);
  eq('뻑 captures nothing', st.caps[0].length, 0);
  eq('뻑 event', ev.some((e) => e.type === 'ppeok'), true);
  // the next player with the 4th card eats the stack
  st.hands[1].push(C(3, 1)); st.caps[0].push(C(7, 2));
  const ev2 = await run(st, 1, C(3, 1));
  eq('뻑 먹기 takes 4', st.caps[1].filter((id) => G.monthOf(id) === 3).length, 4);
  eq('뻑 먹기 named', ev2.find((e) => e.type === 'special')?.names, ['뻑 먹기']);
  eq('뻑 먹기 steals', st.caps[0].includes(C(7, 2)), false);
}
{ // 따닥
  const st = rig([C(4, 0)], [C(4, 2), C(4, 3)], [C(4, 1)]);
  st.caps[1] = [C(10, 2)];
  const ev = await run(st, 0, C(4, 0));
  eq('따닥 takes 4', st.caps[0].filter((id) => G.monthOf(id) === 4).length + st.caps[0].filter((id) => id === C(10, 2)).length, 5);
  eq('따닥 named', ev.find((e) => e.type === 'special')?.names, ['따닥']);
}
{ // two on the floor: the default picks the better card, a chooser can override
  const st = rig([C(6, 2)], [C(6, 1), C(6, 3)], [C(11, 2)]);
  await run(st, 0, C(6, 2));
  eq('default takes the 띠', st.caps[0].includes(C(6, 1)), true);
  const st2 = rig([C(6, 2)], [C(6, 1), C(6, 3)], [C(11, 2)]);
  await run(st2, 0, C(6, 2), { choose: async (o) => o.find((id) => id === C(6, 3)) });
  eq('chooser takes the 피', st2.caps[0].includes(C(6, 3)), true);
}
{ // 폭탄
  const st = rig([C(5, 0), C(5, 1), C(5, 2)], [C(5, 3)], [C(11, 2)]);
  eq('bomb offered', specials(st, 0), [{ kind: 'bomb', month: 5 }]);
  await run(st, 0, C(5, 0), { bomb: true });
  eq('bomb takes 4', st.caps[0].filter((id) => G.monthOf(id) === 5).length, 4);
  eq('bomb passes + shake', [st.passes[0], st.shakes[0], st.hands[0].length], [2, 1, 4]);
  st.turn = 0;
  await run(st, 0, null);
  eq('pass uses a turn without a card', [st.passes[0], st.hands[0].length, st.turnsLeft[0]], [1, 4, 5]);
}
{ // 흔들기
  const st = rig([C(7, 0), C(7, 1), C(7, 2)], [C(1, 2)], [C(11, 2)]);
  eq('shake offered', specials(st, 0), [{ kind: 'shake', month: 7 }]);
  await run(st, 0, C(7, 2), { shake: true });
  eq('shake counted', st.shakes[0], 1);
}
{ // 싹쓸이
  const st = rig([C(8, 2)], [C(8, 3), C(9, 2)], [C(9, 3)]);
  st.floor = [C(8, 3), C(9, 2)];
  st.deck.push(C(12, 3)); // not the last flip
  st.caps[1] = [C(10, 2)];
  const ev = await run(st, 0, C(8, 2));
  eq('sweep', ev.find((e) => e.type === 'special')?.names, ['싹쓸이']);
}
{ // stop and settle: 삼광 + 피 10 = 4, 광박 and 피박 on a bare loser, 고박 on a go-er
  const st = rig([], [], []);
  st.caps = [[C(1, 0), C(3, 0), C(8, 0), ...tenPi], [C(12, 0), C(6, 2), C(6, 3), C(7, 2), C(7, 3), C(9, 2), C(9, 3)], [C(10, 2)]];
  st.over = { kind: 'win', winner: 0, reason: '스톱' };
  const r = settle(st);
  eq('points 4', r.points, 4);
  eq('baks', r.bak, [[], [], ['광박', '피박']]);
  eq('delta', r.delta, [4 + 16, -4, -16]);
  st.go[1] = 1;
  const r2 = settle(st);
  eq('고박 pays both', r2.delta, [20, -20, 0]);
  st.go = [3, 0, 0]; st.go[1] = 0; st.shakes[0] = 1; st.nagari = 1;
  const r3 = settle(st);
  eq('3고 ×2, 흔들기 ×2, 나가리 ×2', r3.points, (4 + 2) * 2 * 2 * 2);
}
{ // a go must be topped before the next decision
  const st = rig([C(1, 0)], [C(1, 2), C(5, 2)], [C(5, 3)]);
  st.caps[0] = [C(3, 0), C(8, 0), C(12, 0)]; // 비삼광 2
  await run(st, 0, C(1, 0)); // + 1월 광 → 사광 4
  eq('pending after 3+', st.pending?.score, 4);
  decide(st, true);
  eq('go recorded', [st.go[0], st.goScore[0], st.turn], [1, 4, 1]);
}
{ // 총통
  const deck = [C(2, 0), C(2, 1), C(2, 2), C(2, 3), ...[...Array(48).keys()].filter((i) => G.monthOf(i) !== 2)];
  const st = newRound({ deck });
  eq('총통', [st.over?.reason, st.over?.winner], ['총통', 0]);
}

// ---- full games with the AI: nothing breaks, cards are conserved ----
let rng = 7; const rand = () => ((rng = (rng * 16807) % 2147483647) / 2147483647);
const tally = { win: 0, nagari: 0, special: {} };
for (let g = 0; g < 400; g++) {
  const st = newRound({ dealer: g % 3, rng: rand });
  let guard = 0;
  while (!st.over && guard++ < 40) {
    const p = st.turn;
    let card = null, opts = {};
    if (st.passes[p] > 0 && rand() < 0.5) card = null;
    else if (!st.hands[p].length) card = null;
    else {
      card = rankHand(st, p)[0].card;
      const sp = specials(st, p).find((s) => s.month === G.monthOf(card));
      if (sp) opts[sp.kind] = true;
    }
    if (card === null && st.passes[p] <= 0) card = st.hands[p][0];
    opts.choose = async (o) => bestPick(st, p, o);
    const ev = await playTurn(st, p, card, opts);
    for (const e of ev) if (e.type === 'special') for (const n of e.names) tally.special[n] = (tally.special[n] ?? 0) + 1;
    const all = [...st.deck, ...st.floor, ...st.hands.flat(), ...st.caps.flat()];
    if (all.length !== 48 || new Set(all).size !== 48) { fail++; console.log('FAIL conservation', g); break; }
    if (st.pending) decide(st, shouldGo(st, p));
  }
  if (!st.over) { fail++; console.log('FAIL game did not end', g); continue; }
  if (st.over.kind === 'win') {
    tally.win++;
    const r = settle(st);
    if (r.delta.reduce((a, b) => a + b, 0) !== 0) { fail++; console.log('FAIL zero-sum', g); }
  } else tally.nagari++;
}
console.log('400 AI rounds:', JSON.stringify(tally));
console.log(fail ? `${fail} FAILED` : 'all passed');
