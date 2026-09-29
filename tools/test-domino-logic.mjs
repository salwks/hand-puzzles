import * as D from '../app/domino-logic.js';
const { N, knock, run, judge, solveAll, countSolutions, puzzle, LEVELS, TURNS, newGame, place, lift, turn, status, hint, tokenAt } = D;
let fail = 0;
const ok = (name, cond, info = '') => { if (!cond) { fail++; console.log('FAIL', name, info); } };
const S = JSON.stringify;

// ---- pieces ----
{
  const dom = (o) => ({ type: 'domino', o });
  ok('a domino knocked from behind falls its way', knock(dom(2), 2) === 2);
  ok('a domino 45° off still falls, its own way', knock(dom(3), 2) === 3 && knock(dom(1), 2) === 1);
  ok('hit from the side it holds', knock(dom(0), 2) === null && knock(dom(4), 2) === null);
  ok('hit from the front it holds', knock(dom(6), 2) === null);
  ok('wrapping round north', knock(dom(7), 0) === 7 && knock(dom(0), 7) === 0);
  ok('a target falls on the way it was hit', knock({ type: 'target' }, 5) === 5);
  ok('a pivot turns a quarter, either hand', knock({ type: 'pivot', o: 0 }, 0) === 2 && knock({ type: 'pivot', o: 1 }, 0) === 6);
  ok('a blocker stops it', knock({ type: 'block' }, 3) === null);
}

// ---- a push ----
{
  // start at (5,0) falling east, dominoes along row 5, a 45° bend north-east, target I, pivot
  const t = [
    { type: 'start', r: 5, c: 0, o: 2 },
    { type: 'domino', r: 5, c: 1, o: 2 },
    { type: 'domino', r: 5, c: 2, o: 1 },   // bends to north-east
    { type: 'target', r: 4, c: 3, k: 1, o: 0 },
    { type: 'domino', r: 3, c: 4, o: 1 },
    { type: 'pivot', r: 2, c: 5, o: 1 },    // north-east + anticlockwise quarter = north-west
    { type: 'domino', r: 1, c: 4, o: 7 },
  ];
  const rr = run(t);
  ok('the whole chain falls', rr.falls.length === 7 && !rr.standing.length, S(rr));
  ok('the target fell', S(rr.order) === '[1]');
  ok('it ends on an empty square', rr.end.why === 'empty' && rr.end.r === 0 && rr.end.c === 3, S(rr.end));
  ok('diagonal falls take longer', rr.falls[3].t - rr.falls[2].t === 3 && rr.falls[1].t - rr.falls[0].t === 2);
  ok('solved', judge({}, t).solved);
  const held = t.map((x, i) => (i === 4 ? { ...x, o: 5 } : x));
  const r2 = run(held);
  ok('a domino facing the wrong way stops the chain: it, the pivot and the domino after stay unused', r2.end.why === 'held' && r2.standing.length === 3 && !judge({}, held).solved, S(r2.end));
  const two = [...t, { type: 'target', r: 0, c: 3, k: 2, o: 0 }];
  ok('targets must fall in order (I before II)', judge({}, two).solved);
  const swapped = two.map((x) => (x.type === 'target' ? { ...x, k: 3 - x.k } : x));
  ok('the wrong order is not solved', judge({}, swapped).wrongOrder && !judge({}, swapped).solved);
  ok('a domino off the chain spoils it', !judge({}, [...t, { type: 'domino', r: 0, c: 0, o: 0 }]).solved);
}

// ---- solving, checked against brute force ----
function brute(p) {
  const fixed = p.fixed.map((f) => ({ ...f }));
  const open = fixed.filter((f) => f.o === null);
  const taken = new Set(fixed.map((f) => f.r * N + f.c));
  const free = [...Array(N * N).keys()].filter((i) => !taken.has(i));
  const adds = Array.from({ length: p.dominoes }, () => ({ type: 'domino', r: 0, c: 0, o: 0 }));
  let count = 0;
  const setOpen = (k) => {
    if (k === open.length) { if (judge(p, [...fixed, ...adds]).solved) count++; return; }
    for (let o = 0; o < TURNS[open[k].type]; o++) { open[k].o = o; setOpen(k + 1); }
    open[k].o = null;
  };
  const dirs = (k) => {
    if (k === adds.length) { setOpen(0); return; }
    for (let o = 0; o < 8; o++) { adds[k].o = o; dirs(k + 1); }
  };
  // identical dominoes: squares in increasing order
  const put = (k, from) => {
    if (k === adds.length) { dirs(0); return; }
    for (let s = from; s < free.length; s++) { adds[k].r = Math.floor(free[s] / N); adds[k].c = free[s] % N; put(k + 1, s + 1); }
  };
  put(0, 0);
  return count;
}
{
  const t0 = performance.now();
  let checked = 0, agree = 0, loose = 0, looseAgree = 0, multi = 0;
  for (let n = 0; n < 40 && checked < 14; n++) {
    const lv = 1 + (n % 2);
    const p = puzzle(lv, n);
    if (p.dominoes > 2 || p.fixed.filter((f) => f.o === null).length > 1) continue;
    checked++;
    const b = brute(p);
    if (b === 1) agree++; else console.log('brute force found', b, 'solutions for', p.id);
  }
  // loosened puzzles (a domino taken off, or every direction opened) often have several answers:
  // the solver's count must match brute force's
  const cost = (q) => { let c = 1; const free = N * N - q.fixed.length; for (let k = 0; k < q.dominoes; k++) c *= ((free - k) * 8) / (k + 1); for (const f of q.fixed) if (f.o === null) c *= TURNS[f.type]; return c; };
  for (let n = 0; n < 40 && loose < 12; n++) {
    const p = puzzle(1, n);
    const k = p.fixed.findIndex((f) => f.type === 'domino' && f.o !== null);
    const variants = [
      k >= 0 && { ...p, fixed: p.fixed.filter((_, i) => i !== k), dominoes: p.dominoes + 1 },
      { ...p, fixed: p.fixed.map((f) => (f.type === 'domino' || f.type === 'start' ? { ...f, o: null } : f)) },
    ].filter(Boolean);
    for (const q of variants) {
      if (cost(q) > 6e5) continue;
      const bq = brute(q), sq = solveAll(q, { limit: 100000 }).solutions.length;
      loose++;
      if (bq === sq) looseAgree++; else console.log('count mismatch', p.id, 'brute', bq, 'solver', sq, S(q));
      if (bq > 1) multi++;
    }
  }
  // small open puzzles with many answers
  const open = [
    { dominoes: 3, fixed: [{ type: 'start', r: 2, c: 0, o: 2 }, { type: 'target', r: 2, c: 4, k: 1, o: 0 }] },
    { dominoes: 2, fixed: [{ type: 'start', r: 2, c: 0, o: null }, { type: 'target', r: 2, c: 3, k: 1, o: 0 }] },
    { dominoes: 2, fixed: [{ type: 'start', r: 0, c: 0, o: 3 }, { type: 'target', r: 3, c: 3, k: 1, o: 0 }] },
    { dominoes: 2, fixed: [{ type: 'start', r: 3, c: 0, o: 2 }, { type: 'pivot', r: 3, c: 3, o: null }, { type: 'target', r: 1, c: 3, k: 1, o: 0 }] },
  ];
  for (const q of open) {
    const bq = brute(q), sq = solveAll(q, { limit: 100000 }).solutions.length;
    loose++;
    if (bq === sq) looseAgree++; else console.log('count mismatch (open)', 'brute', bq, 'solver', sq, S(q));
    if (bq > 1) multi++;
  }
  console.log(`brute force: ${agree}/${checked} generated puzzles unique; loosened ${looseAgree}/${loose} counts agree (${multi} with several answers) — ${((performance.now() - t0) / 1000).toFixed(1)} s`);
  ok('generated puzzles are unique by brute force', agree === checked && checked >= 10);
  ok('solver counts match brute force', looseAgree === loose && multi >= 2);
}

// ---- the generator ----
{
  const t0 = performance.now();
  let made = 0, unique = 0, good = 0, inRange = 0;
  const seen = new Set();
  for (let lv = 1; lv <= LEVELS.length; lv++) {
    const L = LEVELS[lv - 1];
    for (let n = 0; n < 30; n++) {
      const p = puzzle(lv, n);
      made++;
      if (countSolutions(p) === 1) unique++;
      if (judge(p, p.solution).solved) good++;
      const open = p.fixed.filter((f) => f.o === null).length;
      if (p.dominoes >= L.place[0] && p.dominoes <= L.place[1] && open >= L.open[0] && open <= L.open[1]) inRange++;
      seen.add(S([p.fixed, p.dominoes]));
      ok(`${p.id}: new game unsolved`, !status(newGame(p)).solved);
    }
  }
  const ms = (performance.now() - t0) / made;
  console.log(`generator: ${made} puzzles, ${unique} unique, ${good} solutions check out, ${inRange} match their level, ${seen.size} different; ${ms.toFixed(1)} ms each`);
  ok('every puzzle has exactly one solution', unique === made);
  ok('every stored solution solves its puzzle', good === made);
  ok('every puzzle matches its level', inRange === made);
  ok('puzzles differ', seen.size === made);
  ok('same numbers, same puzzle', S(puzzle(3, 9)) === S(puzzle(3, 9)));
}

// ---- playing ----
{
  const p = puzzle(2, 4);
  const g = newGame(p);
  const mine = g.tokens.findIndex((t) => !t.fixed);
  const fixedI = g.tokens.findIndex((t) => t.fixed && !t.turnable);
  ok('fixed pieces stay put', !place(g, fixedI, 0, 0));
  const empty = [...Array(N * N).keys()].find((k) => tokenAt(g, Math.floor(k / N), k % N) < 0);
  ok('a domino goes on an empty square', place(g, mine, Math.floor(empty / N), empty % N));
  ok('a domino turns in 45° steps', turn(g, mine, 1) && g.tokens[mine].o === 1 && turn(g, mine, -2) && g.tokens[mine].o === 7);
  ok('lifting takes it off', lift(g, mine) && g.tokens[mine].r === null);
  let steps = 0;
  for (let h = hint(g); h && steps < 30; h = hint(g), steps++) {
    const t = g.tokens[h.i];
    if (!t.fixed) { const j = tokenAt(g, h.r, h.c); if (j >= 0 && j !== h.i) lift(g, j); place(g, h.i, h.r, h.c); }
    t.o = h.o;
  }
  ok('following hints solves it', status(g).solved, S(status(g)));
  ok('no hint once solved', hint(g) === null);
}

console.log(fail ? `${fail} failed` : 'all passed');
process.exit(fail ? 1 : 0);
