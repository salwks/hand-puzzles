import * as L from '../app/laser-logic.js';
const { N, react, trace, judge, solveAll, solve, countSolutions, puzzle, LEVELS, TURNS, newGame, place, lift, turn, status, hint, tokenAt } = L;
let fail = 0;
const ok = (name, cond, info = '') => { if (!cond) { fail++; console.log('FAIL', name, info); } };
const S = JSON.stringify;

// ---- tokens: base pose, then the same rule turned ----
{
  // target (o = 0): target face north, "\" mirror facing south-west, east side blocked
  ok('target: travelling south hits the target face', react('target', 0, 2) === 'lit');
  ok('target: travelling north is turned west', S(react('target', 0, 0)) === '[3]');
  ok('target: travelling east is turned south', S(react('target', 0, 1)) === '[2]');
  ok('target: travelling west hits the blocked side', react('target', 0, 3) === 'bad');
  ok('target turned once: target face east, hit by a beam going west', react('target', 1, 3) === 'lit');
  ok('double mirror "\\" both sides', S([0, 1, 2, 3].map((d) => react('double', 0, d))) === '[[3],[2],[1],[0]]');
  ok('double mirror "/"', S([0, 1, 2, 3].map((d) => react('double', 1, d))) === '[[1],[0],[3],[2]]');
  ok('splitter reflects and lets through', S(react('splitter', 0, 1)) === '[2,1]' && S(react('splitter', 1, 1)) === '[0,1]');
  ok('checkpoint passes along its slot only', S(react('check', 0, 0)) === '[0]' && react('check', 0, 1) === 'bad' && S(react('check', 1, 3)) === '[3]');
  ok('cell blocker lets the beam over', S(react('block', 0, 2)) === '[2]');
  ok('laser: back into the muzzle is fine, its sides are not', S(react('laser', 0, 2)) === '[]' && react('laser', 0, 1) === 'bad');
}

// ---- following the beam ----
{
  // laser at (4,0) firing north; "/" at (0,0) turns it east; target at (0,4) facing west (o = 3)
  const t = [{ type: 'laser', r: 4, c: 0, o: 0 }, { type: 'double', r: 0, c: 0, o: 1 }, { type: 'target', r: 0, c: 4, o: 3 }];
  const tr = trace(t);
  ok('beam goes up, right, into the target', tr.lit.has(2) && !tr.bad && !tr.off && tr.touched.size === 3, S(tr.ends));
  ok('steps: 4 up + 4 across', tr.steps.length === 8, tr.steps.length);
  const off = trace([{ type: 'laser', r: 4, c: 0, o: 1 }]);
  ok('a beam leaving the board is noted', off.off && off.ends[0].kind === 'off' && off.ends[0].c === 4);
  const back = trace([{ type: 'laser', r: 4, c: 0, o: 0 }, { type: 'target', r: 0, c: 0, o: 1 }]);
  ok('hitting a blocked side is noted', back.bad && back.ends[0].kind === 'bad', S(back.ends));
  const face = trace([{ type: 'laser', r: 4, c: 0, o: 0 }, { type: 'target', r: 0, c: 0, o: 2 }]);
  ok('a target turned to face the beam lights', face.lit.size === 1 && !face.bad);
  // a splitter loop must end
  const loop = trace([{ type: 'laser', r: 2, c: 0, o: 1 }, { type: 'splitter', r: 2, c: 2, o: 0 }, { type: 'double', r: 4, c: 2, o: 1 }, { type: 'double', r: 4, c: 4, o: 0 }]);
  ok('loops through a splitter terminate', loop.steps.length < 200);
}

// ---- judging ----
{
  const p = { targets: 1, fixed: [], add: [] };
  const good = [{ type: 'laser', r: 4, c: 0, o: 0 }, { type: 'double', r: 0, c: 0, o: 1 }, { type: 'target', r: 0, c: 4, o: 3 }];
  ok('the example is solved', judge(p, good).solved);
  ok('a token the beam misses spoils it', !judge(p, [...good, { type: 'double', r: 3, c: 3, o: 0 }]).solved);
  ok('a cell blocker need not be touched', judge(p, [...good, { type: 'block', r: 3, c: 3, o: 0 }]).solved);
  ok('too many targets lit is not solved', !judge({ ...p, targets: 2 }, good).solved);
  ok('an unplaced token is not solved', !judge(p, [...good, { type: 'target', r: null, c: null, o: 0 }]).solved);
}

// ---- solving, checked against brute force ----
function brute(p) {
  // every placement of the added tokens on empty squares × every direction of open tokens
  const fixed = p.fixed.map((f) => ({ ...f }));
  const open = fixed.filter((f) => f.o === null);
  const taken = new Set(fixed.map((f) => f.r * N + f.c));
  const free = [...Array(N * N).keys()].filter((i) => !taken.has(i));
  let count = 0;
  const adds = p.add.map((type) => ({ type, r: 0, c: 0, o: 0 }));
  const setOpen = (k) => {
    if (k === open.length) { if (judge(p, [...fixed, ...adds]).solved) count++; return; }
    for (let o = 0; o < TURNS[open[k].type]; o++) { open[k].o = o; setOpen(k + 1); }
    open[k].o = null;
  };
  const used = new Set();
  const put = (k, from) => {
    if (k === adds.length) { setOpen(0); return; }
    // identical tokens are placed in increasing square order so each layout counts once
    const start = k > 0 && adds[k - 1].type === adds[k].type ? from : 0;
    for (let s = start; s < free.length; s++) {
      if (used.has(s)) continue;
      used.add(s);
      adds[k].r = Math.floor(free[s] / N); adds[k].c = free[s] % N;
      for (let o = 0; o < TURNS[adds[k].type]; o++) { adds[k].o = o; put(k + 1, s + 1); }
      used.delete(s);
    }
  };
  put(0, 0);
  return count;
}
{
  const t0 = performance.now();
  let checked = 0, agree = 0;
  for (const [lv, n] of [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [3, 0], [3, 5]]) {
    const p = puzzle(lv, n);
    if (p.add.length > 3) continue;
    const b = brute(p);
    checked++;
    if (b === 1) agree++; else console.log('brute force found', b, 'solutions for', p.id, S(p));
  }
  console.log(`brute force: ${agree}/${checked} generated puzzles have exactly one solution (${((performance.now() - t0) / 1000).toFixed(1)} s)`);
  ok('generated puzzles are unique by brute force', agree === checked && checked >= 10);
}

{
  // loosened puzzles (one more token taken off, or a direction opened) have several answers:
  // the solver must count exactly what brute force counts
  let checked = 0, agree = 0, multi = 0;
  for (let n = 0; n < 16; n++) {
    const p = puzzle(1 + (n % 2), n);
    const k = p.fixed.findIndex((f) => f.type !== 'laser' && f.type !== 'block');
    const q = n % 3 === 0 || k < 0
      ? { ...p, fixed: p.fixed.map((f) => (f.type !== 'laser' && TURNS[f.type] > 1 ? { ...f, o: null } : f)) }
      : { ...p, fixed: p.fixed.filter((_, i) => i !== k), add: [...p.add, p.fixed[k].type].sort() };
    if (q.add.length > 3) continue;
    const b = brute(q), s2 = solveAll(q, { limit: 10000 }).solutions.length;
    checked++;
    if (b === s2) agree++; else console.log('count mismatch', p.id, 'brute', b, 'solver', s2, S(q));
    if (b > 1) multi++;
  }
  console.log(`solution counts: ${agree}/${checked} loosened puzzles agree with brute force (${multi} with several answers)`);
  ok('solver counts match brute force', agree === checked && multi >= 3);
}

// ---- the generator ----
{
  const t0 = performance.now();
  let made = 0, unique = 0, solvedBySolution = 0, inRange = 0;
  const seen = new Set();
  for (let lv = 1; lv <= LEVELS.length; lv++) {
    for (let n = 0; n < 25; n++) {
      const p = puzzle(lv, n);
      made++;
      if (countSolutions(p) === 1) unique++;
      const g = newGame(p);
      if (judge(p, p.solution).solved) solvedBySolution++;
      if (p.add.length >= LEVELS[lv - 1].add[0] && p.add.length <= LEVELS[lv - 1].add[1]) inRange++;
      seen.add(S([p.fixed, p.add]));
      ok(`${p.id}: tokens come from the box`, ['target', 'double', 'splitter', 'check', 'block'].every((t) => [...p.fixed, ...p.add.map((type) => ({ type }))].filter((x) => x.type === t).length <= L.INVENTORY[t]));
      ok(`${p.id}: the new game starts unsolved`, !status(g).solved);
    }
  }
  const ms = (performance.now() - t0) / made;
  console.log(`generator: ${made} puzzles, ${unique} unique, ${solvedBySolution} solutions check out, ${inRange} with the level's number of tokens to add, ${seen.size} different; ${ms.toFixed(0)} ms each`);
  ok('every generated puzzle has exactly one solution', unique === made);
  ok('every stored solution solves its puzzle', solvedBySolution === made);
  ok('tokens to add match the level', inRange === made);
  ok('puzzles differ', seen.size === made);
  ok('the same numbers give the same puzzle', S(puzzle(3, 7)) === S(puzzle(3, 7)));
  ok('quick enough to make on the fly', ms < 300, ms);
}

// ---- playing ----
{
  const p = puzzle(2, 3);
  const g = newGame(p);
  const mine = g.tokens.findIndex((t) => !t.fixed);
  const fixedI = g.tokens.findIndex((t) => t.fixed);
  ok('fixed tokens do not move', !place(g, fixedI, 0, 0) || (g.tokens[fixedI].r === p.fixed[0].r));
  const empty = [...Array(N * N).keys()].find((k) => tokenAt(g, Math.floor(k / N), k % N) < 0);
  ok('a token goes on an empty square', place(g, mine, Math.floor(empty / N), empty % N));
  ok('not onto a taken square', !place(g, mine, g.tokens[fixedI].r, g.tokens[fixedI].c));
  ok('turning counts as a move', turn(g, mine) && g.moves === 2);
  ok('fixed directions do not turn', !g.tokens[fixedI].turnable ? !turn(g, fixedI) : true);
  ok('lifting takes it off', lift(g, mine) && g.tokens[mine].r === null);
  // following hints solves the puzzle
  let steps = 0;
  for (let h = hint(g); h && steps < 20; h = hint(g), steps++) {
    const t = g.tokens[h.i];
    if (!t.fixed) {
      const j = tokenAt(g, h.r, h.c);
      if (j >= 0 && j !== h.i) lift(g, j);
      place(g, h.i, h.r, h.c);
    }
    t.o = h.o;
  }
  ok('following hints solves it', status(g).solved, S(status(g)));
  ok('no hint once solved', hint(g) === null);
}

console.log(fail ? `${fail} failed` : 'all passed');
process.exit(fail ? 1 : 0);
