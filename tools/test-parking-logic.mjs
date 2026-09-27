import * as P from '../app/parking-logic.js';
const { parse, boardOf, range, slide, solved, solve, hint, stars, puzzle, count, newGame, play, undo, restart, LEVELS } = P;
let fail = 0;
const ok = (name, cond, info = '') => { if (!cond) { fail++; console.log('FAIL', name, info); } };

// ---- reading boards ----
{
  const b = 'ooooBBoooooDAAoooDooooCCoooooooooooo'; // 3 moves in the DB
  const pos = parse(b);
  ok('round-trip', boardOf(pos) === b);
  ok('the red car comes first, across the exit row', pos.cars[0].id === 'A' && pos.cars[0].horiz && pos.cars[0].r === 2 && pos.cars[0].c === 0);
  const D = pos.cars.find((c) => c.id === 'D');
  ok('a vertical car', !D.horiz && D.len === 2 && D.r === 1 && D.c === 5);
  const walls = parse('xCCoLMooJoLMAAJoLNHIDDDNHIoKEExooKGG').walls;
  ok('walls read', walls.length === 2 && walls[0][0] === 0 && walls[0][1] === 0, JSON.stringify(walls));
  let threw = false;
  try { parse('BBoooo' + 'o'.repeat(30)); } catch { threw = true; }
  ok('no red car is not a board', threw);
}

// ---- sliding ----
{
  const pos = parse('ooooBBoooooDAAoooDooooCCoooooooooooo');
  const A = 0, D = pos.cars.findIndex((c) => c.id === 'D'), B = pos.cars.findIndex((c) => c.id === 'B');
  ok('the red car can go right until the truck', JSON.stringify(range(pos, A)) === JSON.stringify({ back: 0, fwd: 3 }), JSON.stringify(range(pos, A)));
  ok('D is boxed in above by B, free below until C', JSON.stringify(range(pos, D)) === JSON.stringify({ back: 0, fwd: 0 }), JSON.stringify(range(pos, D)));
  ok('B slides left four', range(pos, B).back === 4 && range(pos, B).fwd === 0, JSON.stringify(range(pos, B)));
  ok('a slide past the range is refused', slide(pos, A, 4) === null && slide(pos, A, -1) === null);
  const moved = slide(pos, B, -4);
  ok('a slide moves only that car', moved.cars[B].c === 0 && pos.cars[B].c === 4 && boardOf(moved).startsWith('BBoooo'));
  ok('not solved at the start', !solved(pos));
  ok('solved when the red car reaches the exit', solved(parse('oooooooooooooooAAooooooooooooooooooo'.slice(0, 12) + 'ooooAA' + 'o'.repeat(18))));
}

// ---- solving: the search must agree with the database's minimum on real puzzles ----
{
  const t0 = performance.now();
  let checked = 0, agree = 0, slowest = 0, worst = '';
  for (let level = 1; level <= LEVELS.length; level++) {
    const step = Math.max(1, Math.floor(count(level) / 30));
    for (let n = 0; n < count(level); n += step) {
      const p = puzzle(level, n);
      const t1 = performance.now();
      const path = solve(p.pos);
      const dt = performance.now() - t1;
      if (dt > slowest) { slowest = dt; worst = p.id; }
      checked++;
      // the path really solves it, in exactly the DB's number of moves
      let pos = p.pos, valid = true;
      for (const m of path ?? []) { pos = slide(pos, m.car, m.d); if (!pos) { valid = false; break; } }
      if (path && valid && solved(pos) && path.length === p.best) agree++;
      else console.log('mismatch', p.id, p.best, path?.length);
    }
  }
  const ms = performance.now() - t0;
  console.log(`solver: ${agree}/${checked} DB puzzles match their minimum; ${(ms / checked).toFixed(1)} ms each, slowest ${slowest.toFixed(0)} ms (${worst})`);
  ok('solver agrees with the database on every sampled puzzle', agree === checked, `${agree}/${checked}`);
  ok('solving is quick enough for a hint', slowest < 1500, slowest);
}

// ---- levels ----
{
  ok('five levels', LEVELS.length === 5);
  for (let level = 1; level <= 5; level++) {
    const L = LEVELS[level - 1];
    let inRange = true;
    const ids = new Set();
    for (let n = 0; n < count(level); n++) { const p = puzzle(level, n); if (p.best < L.min || p.best > L.max) inRange = false; ids.add(p.board); }
    ok(`level ${level}: every puzzle within ${L.min}–${L.max} moves`, inRange);
    ok(`level ${level}: hundreds of different puzzles`, ids.size >= 300 && ids.size === count(level), ids.size);
  }
  ok('puzzle numbers wrap', puzzle(1, count(1)).board === puzzle(1, 0).board);
  ok('the same number is the same puzzle', puzzle(3, 17).board === puzzle(3, 17).board);
  const firsts = [0, 1, 2, 3, 4, 5, 6, 7].map((n) => puzzle(2, n).best);
  ok('consecutive puzzles mix their move counts', new Set(firsts).size >= 3, firsts.join());
}

// ---- playing ----
{
  const p = puzzle(2, 5);
  const g = newGame(p);
  const path = solve(g.pos);
  ok('a wrong-way slide is refused and not counted', !play(g, 0, -1) && g.used === 0);
  play(g, path[0].car, path[0].d);
  ok('a move counts', g.used === 1);
  undo(g);
  ok('undo takes the position back but keeps the count', boardOf(g.pos) === p.board && g.used === 1);
  for (const m of path) play(g, m.car, m.d);
  ok('playing the solution solves it', solved(g.pos));
  ok('stars: best, within half again, beyond', stars(p.best, p.best) === 3 && stars(Math.ceil(p.best * 1.5), p.best) === 2 && stars(p.best * 3, p.best) === 1);
  ok('the hint is the first move of a shortest solution', (() => { const h = hint(parse(p.board)); const q = slide(parse(p.board), h.car, h.d); return solve(q).length === p.best - 1; })());
  ok('no hint when solved', hint(g.pos) === null);
  const g2 = newGame(p);
  play(g2, path[0].car, path[0].d);
  ok('restart goes back to the start', restart(g2) && boardOf(g2.pos) === p.board);
}

console.log(fail ? `${fail} failed` : 'all passed');
process.exit(fail ? 1 : 0);
