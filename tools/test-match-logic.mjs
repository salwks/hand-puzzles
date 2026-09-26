import * as M from '../app/match-logic.js';
const { cellsOf, textOf, evaluate, reach, solveEquation, makeEquation, lattice, countShapes, reachShapes, makeShape, check, hint, changes, DIGIT_MASK } = M;
let fail = 0;
const ok = (name, cond, info = '') => { if (!cond) { fail++; console.log('FAIL', name, info); } };
const pop = (m) => { let c = 0; while (m) { m &= m - 1; c++; } return c; };

// ---- glyphs ----
ok('stick counts of the digits', DIGIT_MASK.map(pop).join('') === '6255456376', DIGIT_MASK.map(pop).join(''));
ok('cells round-trip', textOf(cellsOf('12+34=46')) === '12+34=46' && textOf(cellsOf('7*8=56')) === '7*8=56');

// ---- reading equations ----
ok('true', evaluate('6+4=10').ok === true);
ok('false', evaluate('6+4=4').ok === false);
ok('× before +', evaluate('2+3*4=14').ok === true);
ok('either side', evaluate('9=4+5').ok === true && evaluate('3+3=2*3').ok === true);
ok('two = is not an equation', evaluate('1=1=1') === null);
ok('leading zero is not a number', evaluate('05+1=6') === null);
ok('an operator at an end is not', evaluate('+5=5') === null && evaluate('5-=5') === null);

// ---- one stick moved ----
{
  // classic: 6+4=4 — move one stick: 0+4=4 (6→0), 8−4=4 (+→−, 6→8)
  const answers = solveEquation(cellsOf('6+4=4'), 1, 'move').map((a) => a.text).sort();
  ok('6+4=4 has its known answers', answers.includes('0+4=4') && answers.includes('8-4=4'), answers.join(' '));
  ok('every answer is true', answers.every((t) => evaluate(t).ok));
}
{
  const all = reach(cellsOf('5+7=2'), 1, 'move', () => true);
  ok('each reached board is one stick-move away', all.every((a) => {
    const c = changes({ kind: 'equation', cells: cellsOf('5+7=2') }, a.cells);
    return c.removed === 1 && c.added === 1;
  }));
  const rm = reach(cellsOf('8+1=9'), 1, 'remove', () => true);
  ok('remove takes one away', rm.length > 0 && rm.every((a) => textOf(a.cells) !== '8+1=9'));
  const sols = solveEquation(cellsOf('8+1=9'), 1, 'remove').map((a) => a.text);
  ok('8+1=9 remove one: 9+1=… no; 8−1=… no; known: 0+1=… no — whatever it finds is true', sols.every((t) => evaluate(t).ok));
}

// ---- generated equations ----
{
  const t0 = performance.now();
  let made = 0, answersOk = 0, exact = 0, levelsOk = 0;
  for (let level = 1; level <= 5; level++) {
    for (let seed = 1; seed <= 12; seed++) {
      const p = makeEquation(seed, level);
      if (!p) continue;
      made++;
      const L = M.EQ_LEVELS[level - 1];
      const found = solveEquation(p.cells, p.moves, p.mode).map((a) => a.text).sort();
      if (JSON.stringify(found) === JSON.stringify([...p.answers].sort()) && found.includes(p.truth)) answersOk++;
      let shorter = false;
      for (let j = 1; j < p.moves; j++) shorter ||= solveEquation(p.cells, j, p.mode).length > 0;
      if (!shorter && !evaluate(p.text).ok) exact++;
      if (L.moves.includes(p.moves) && L.modes.includes(p.mode) && p.answers.length <= L.maxAnswers && (L.opChange || !p.symbolChange)) levelsOk++;
    }
  }
  const ms = performance.now() - t0;
  ok('equations: almost every seed makes a puzzle', made >= 55, made);
  ok('equations: the answers listed are exactly the ones a search finds', answersOk === made, `${answersOk}/${made}`);
  ok('equations: false as given, and not solvable with fewer changes', exact === made, `${exact}/${made}`);
  ok('equations: each fits its level', levelsOk === made, `${levelsOk}/${made}`);
  console.log(`equations: ${made} puzzles in ${ms.toFixed(0)} ms (${(ms / made).toFixed(1)} ms each)`);
  ok('equations: quick enough to make on the spot', ms / made < 150, ms / made);
}
{
  const a = makeEquation(42, 3), b = makeEquation(42, 3);
  ok('same seed, same puzzle', JSON.stringify(a) === JSON.stringify(b));
  const c = makeEquation(43, 3);
  ok('another seed, another puzzle', a.text !== c.text || a.mode !== c.mode);
  const seen = new Set();
  for (let s = 1; s <= 200; s++) { const p = makeEquation(s, 1); if (p) seen.add(p.text); }
  console.log(`level 1: ${seen.size} different puzzles from 200 seeds`);
  ok('level 1 alone gives many different puzzles', seen.size > 100, seen.size);
}
{
  // playing it: the answer board is solved, the start board isn't
  const p = makeEquation(7, 1);
  const answer = cellsOf(p.answers[0]);
  ok('check: the start is not solved', !check(p, p.cells).solved);
  ok('check: an answer is solved', check(p, answer).solved, JSON.stringify(check(p, answer)));
  const h1 = hint(p, 1), h2 = hint(p, 2);
  ok('hint 1 names the glyphs that change', h1.cells.length >= 1);
  ok('hint 2 names a stick that is really there', h2.from && (p.cells[h2.from[0]].m >> h2.from[1]) & 1);
}

// ---- lattices and counting ----
{
  const sq = lattice('square', 3, 3);
  ok('3×3 square grid: 24 sticks', sq.slots.length === 24);
  ok('3×3 square grid: 14 squares of all sizes', sq.shapes.length === 14);
  const all = sq.slots.map(() => 1);
  ok('full grid counts 14, nothing loose', JSON.stringify(countShapes(sq, all)) === JSON.stringify({ count: 14, loose: 0 }));
  const one = sq.slots.map(() => 0);
  for (const e of sq.shapes[0].edges) one[e] = 1;
  one[sq.shapes[8].edges[0]] = 1; // a stray stick
  const c = countShapes(sq, one);
  ok('one square and a stray stick', c.count === 1 && c.loose === 1, JSON.stringify(c));
  const tri = lattice('triangle', 2, 2);
  ok('2×2 triangle lattice: 16 sticks', tri.slots.length === 16, tri.slots.length);
  const ups = tri.shapes.filter((s) => s.type === 'up').length, downs = tri.shapes.filter((s) => s.type === 'down').length;
  ok('2×2 triangle lattice: 5 up and 5 down triangles', ups === 5 && downs === 5, `${ups}/${downs}`);
  ok('all triangle sides are real sticks', tri.shapes.every((s) => s.edges.length === 3 * s.size && s.edges.every((e) => e !== undefined)));
  ok('full triangle lattice: nothing loose', countShapes(tri, tri.slots.map(() => 1)).loose === 0);
}
{
  // move one stick: 2 squares side by side (7 sticks) — moving one can't make 3 squares
  const sq = lattice('square', 3, 1);
  const on = sq.slots.map(() => 0);
  for (const s of sq.shapes.filter((x) => x.size === 1).slice(0, 2)) for (const e of s.edges) on[e] = 1;
  ok('two squares', countShapes(sq, on).count === 2 && on.filter(Boolean).length === 7);
  const r = reachShapes(sq, on, 1, 'move');
  ok('every reached board has no loose sticks', r.every((x) => countShapes(sq, x.on).loose === 0));
  const rm = reachShapes(sq, on, 3, 'remove');
  ok('remove the middle-free three: one square left', rm.some((x) => x.count === 1));
}

// ---- generated shapes ----
{
  const t0 = performance.now();
  let made = 0, exact = 0, fits = 0, slow = 0;
  for (let level = 1; level <= 5; level++) {
    for (let seed = 1; seed <= 6; seed++) {
      const t1 = performance.now();
      const p = makeShape(seed, level);
      const dt = performance.now() - t1;
      if (dt > 1500) slow++;
      if (!p) continue;
      made++;
      const L = M.SHAPE_LEVELS[level - 1];
      const found = reachShapes(p.lattice, p.on, p.moves, p.mode).filter((x) => x.count === p.target).map((x) => x.key).sort();
      let shorter = countShapes(p.lattice, p.on).count === p.target;
      for (let j = 1; j < p.moves; j++) shorter ||= reachShapes(p.lattice, p.on, j, p.mode).some((x) => x.count === p.target);
      if (JSON.stringify(found) === JSON.stringify([...p.answers].sort()) && !shorter) exact++;
      if (L.moves.includes(p.moves) && L.modes.includes(p.mode) && p.answers.length <= L.maxAnswers && p.lattice.kind === L.kind) fits++;
      // playing an answer through check()
      const answer = [...p.answers[0]].map(Number);
      if (!check(p, answer).solved) console.log('not solved?', p.id, JSON.stringify(check(p, answer)));
    }
  }
  const ms = performance.now() - t0;
  console.log(`shapes: ${made} puzzles in ${ms.toFixed(0)} ms (${(ms / Math.max(1, made)).toFixed(0)} ms each)`);
  ok('shapes: most seeds make a puzzle', made >= 26, made);
  ok('shapes: answers are exactly those found, none shorter', exact === made, `${exact}/${made}`);
  ok('shapes: each fits its level', fits === made, `${fits}/${made}`);
  ok('shapes: no puzzle takes over 1.5 s to make', slow === 0, slow);
  const p = makeShape(3, 2);
  ok('shape prompt reads', /성냥 \d개를 (옮겨|빼서) 정사각형 \d+개를 만드세요/.test(p.prompt), p.prompt);
  ok('shape check: the start is not solved', !check(p, p.on).solved);
  const h = hint(p, 2);
  ok('shape hint 2 points at a stick that is there', p.on[h.from] === 1);
}

// ---- variety: enough different puzzles at every level ----
for (let level = 1; level <= 5; level++) {
  const seen = new Set();
  for (let seed = 1; seed <= 40; seed++) { const p = makeShape(seed, level); if (p) seen.add(p.on.join('') + p.mode + p.moves + p.target); }
  ok(`shapes level ${level}: varied`, seen.size >= 25, seen.size);
}

console.log(fail ? `${fail} failed` : 'all passed');
process.exit(fail ? 1 : 0);
