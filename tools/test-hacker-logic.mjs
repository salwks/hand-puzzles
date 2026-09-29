import * as H from '../app/hacker-logic.js';
const { N, simulate, codeSolutions, timings, hacks, fixes, puzzle, LEVELS, newGame, put, slide, slideRange, tryRun, advance, linkable, link, hint, currentProgram, codeProgram } = H;
let fail = 0;
const ok = (name, cond, info = '') => { if (!cond) { fail++; console.log('FAIL', name, info); } };
const S = JSON.stringify;
const U = 0, R = 1, D = 2, L = 3, _ = null;

// ---- running a program ----
{
  const p = { T: 5, walls: [[1, 2]], platforms: [], agent: [2, 2], data: [2, 3], exit: [3, 3] };
  const r = simulate(p, [R, _, D, _, _]);
  ok('picks up the data and escapes at the exit', r.result === 'escaped' && r.step === 2, S(r));
  ok('a wait keeps the agent still', S(r.visited.slice(0, 3)) === S([[2, 2], [2, 3], [2, 3]]));
  ok('the exit without the data is just a square', simulate({ ...p, data: [0, 0] }, [R, D, _, _, _]).result === 'lost');
  ok('a wall stops a move (a bump)', simulate(p, [U, _, _, _, _]).frames[0].bumped && S(simulate(p, [U]).visited[1]) === S([2, 2]));
  ok('the board edge stops a move', simulate({ ...p, agent: [0, 0] }, [U]).frames[0].bumped);
  ok('the alarm ends the run', simulate({ ...p, alarm: [2, 3] }, [R, D]).result === 'alarm');
  ok('the virus ends the run', simulate({ ...p, virus: [3, 2] }, [D]).result === 'virus');
  ok('hacking ignores the data file', simulate({ ...p, data: [0, 0] }, [R, D], { ignoreData: true }).result === 'escaped');
}

// ---- platforms ----
{
  // a 2×2 platform at (1,1) turning clockwise after beat 0 and 2: the agent on (1,1) rides it
  const pl = { r: 1, c: 1, dir: 'cw', at: [0, 2] };
  const p = { T: 4, walls: [], platforms: [pl], agent: [1, 1], data: [2, 2], exit: [0, 0] };
  const r = simulate(p, [_, _, _, _]);
  ok('clockwise: top-left → top-right → (wait) → bottom-right', S(r.visited) === S([[1, 1], [1, 2], [1, 2], [2, 2], [2, 2]]), S(r.visited));
  ok('items on the platform ride it too', S(r.frames[0].items.data) === S([2, 1]), S(r.frames[0].items));
  const ccw = simulate({ ...p, platforms: [{ ...pl, dir: 'ccw' }] }, [_]);
  ok('anticlockwise: top-left → bottom-left', S(ccw.visited[1]) === S([2, 1]));
  // moving off the platform before it turns
  const off = simulate(p, [U, _, _, _]);
  ok('a step off before the turn leaves the platform behind', S(off.visited[1]) === S([0, 1]));
}

// ---- solving the code phase, against brute force ----
function bruteCode(p) {
  const lockedAt = new Map(p.locked.map((l) => [l.slot, l.dir]));
  const free = [...Array(p.T).keys()].filter((s) => !lockedAt.has(s));
  const n = p.tiles.length, found = new Set();
  // every injective placement of the tiles into free slots (as a set of programs)
  const place = (k, used, pr) => {
    if (k === n) { if (simulate(p, pr).result === 'escaped') found.add(S(pr)); return; }
    for (const s of free) {
      if (used.has(s)) continue;
      used.add(s); pr[s] = p.tiles[k];
      place(k + 1, used, pr);
      used.delete(s); pr[s] = null;
    }
  };
  const pr = new Array(p.T).fill(null);
  for (const [s, d] of lockedAt) pr[s] = d;
  place(0, new Set(), pr);
  // a program that escapes before a later tile runs doesn't count
  return [...found].filter((x) => { const prg = JSON.parse(x); const r = simulate(p, prg); return prg.slice(r.step + 1).every((v) => v === null); });
}
{
  let checked = 0, agree = 0, multi = 0;
  for (let lv = 1; lv <= 3; lv++) for (let n = 0; n < 5; n++) {
    const p = puzzle(lv, n);
    const b = bruteCode(p), sv = codeSolutions(p, { limit: 1000 });
    checked++;
    if (b.length === sv.length && sv.every((x) => b.includes(S(x)))) agree++; else console.log('code mismatch', p.id, b.length, sv.length);
    if (b.length > 1) multi++;
  }
  console.log(`code phase: ${agree}/${checked} puzzles — solver matches brute force (${multi} with several answers)`);
  ok('the code solver finds exactly the brute-force answers', agree === checked && multi >= 2);
}

// ---- timings, hacks and fixes ----
{
  const pr = [R, _, D, _, R, _];
  const { list } = timings(pr);
  ok('timings keep order: C(6,3) layouts', list.length === 20 && list.every((sl) => sl[0] < sl[1] && sl[1] < sl[2]));
  ok('a locked tile stays put', timings(pr, [2]).list.every((sl) => sl[1] === 2));
  ok('a link keeps a pair back to back', timings(pr, [], [0]).list.every((sl) => sl[1] === sl[0] + 1));
  // hacks and fixes against brute force on generated puzzles
  let checked = 0, agree = 0;
  for (let lv = 1; lv <= 4; lv++) for (let n = 0; n < 4; n++) {
    const p = puzzle(lv, n);
    for (const code of codeSolutions(p, { limit: 5 })) {
      const lockedSlots = p.locked.map((l) => l.slot);
      const { tiles, list: all } = timings(code, lockedSlots);
      const prog = (sl) => { const x = new Array(p.T).fill(null); tiles.forEach((t, i) => { x[sl[i]] = t.d; }); return x; };
      const bruteHacks = all.filter((sl) => simulate(p, prog(sl), { ignoreData: true }).result === 'virus');
      const pairs = tiles.map((_, i) => i).filter((i) => i + 1 < tiles.length && tiles[i + 1].s === tiles[i].s + 1);
      const bruteFix = pairs.filter((i) => bruteHacks.every((sl) => sl[i + 1] !== sl[i] + 1));
      checked++;
      if (S(bruteHacks) === S(hacks(p, code)) && S(bruteFix) === S(fixes(p, code)) && bruteHacks.length && bruteFix.length) agree++;
      else console.log('hack/fix mismatch', p.id, bruteHacks.length, hacks(p, code).length, S(bruteFix), S(fixes(p, code)));
    }
  }
  console.log(`hack & fix: ${agree}/${checked} working programs — hacks and fixes match brute force, each hackable and fixable`);
  ok('every working program can be hacked and fixed; searches match brute force', agree === checked && checked >= 16);
}

// ---- the generator ----
{
  const t0 = performance.now();
  let made = 0, good = 0, level = 0;
  const seen = new Set();
  for (let lv = 1; lv <= LEVELS.length; lv++) for (let n = 0; n < 20; n++) {
    const p = puzzle(lv, n);
    made++;
    const Lv = LEVELS[lv - 1];
    if (simulate(p, p.program).result === 'escaped') good++;
    if (p.tiles.length >= Lv.free[0] && p.tiles.length <= Lv.free[1] && p.T === Lv.T) level++;
    seen.add(S([p.agent, p.walls, p.platforms, p.locked, p.tiles]));
    ok(`${p.id}: items don't overlap`, new Set([p.agent, p.data, p.exit, p.virus, p.alarm].filter(Boolean).map(S)).size === [p.agent, p.data, p.exit, p.virus, p.alarm].filter(Boolean).length);
  }
  const ms = (performance.now() - t0) / made;
  console.log(`generator: ${made} puzzles, ${good} reference programs work, ${level} match their level, ${seen.size} different; ${ms.toFixed(0)} ms each`);
  ok('reference programs work', good === made);
  ok('levels match', level === made);
  ok('puzzles differ', seen.size === made);
  ok('same numbers, same puzzle', S(puzzle(2, 5)) === S(puzzle(2, 5)));
  ok('quick enough', ms < 400, ms);
}

// ---- a game through all three phases ----
{
  const p = puzzle(2, 3);
  const g = newGame(p);
  ok('starts in the code phase with the player tiles in the supply', g.phase === 'code' && g.tiles.filter((t) => !t.locked).every((t) => t.slot === null));
  const lockedI = g.tiles.findIndex((t) => t.locked);
  ok('locked tiles do not move', lockedI < 0 || !put(g, lockedI, null));
  ok('running with tiles left over fails', !tryRun(g).ok);
  let n = 0;
  for (let h = hint(g); h && n < 20; h = hint(g), n++) put(g, h.tile, h.slot);
  const r1 = tryRun(g);
  ok('following hints makes a working program', r1.ok, S(r1.run.result));
  advance(g);
  ok('the hack phase starts from the working program', g.phase === 'hack' && S(currentProgram(g)) === S(codeProgram(g)));
  // sliding: never past another tile
  const order = g.tiles.map((t, i) => [t.slot, i]).filter(([s]) => s !== null).sort((a, b) => a[0] - b[0]);
  const [, first] = order.find(([, i]) => !g.tiles[i].locked) ?? [];
  if (first !== undefined) {
    const rg = slideRange(g, first);
    ok('a tile slides only within its gap', rg.lo <= g.tiles[first].slot && rg.hi >= g.tiles[first].slot && !slide(g, first, rg.hi + 1));
  }
  const h = hint(g);
  ok('there is a hack', h && h.slots);
  // apply the hack: set slots in program order
  const bySlot = g.tiles.map((t, i) => [t.slot, i]).filter(([s]) => s !== null).sort((a, b) => a[0] - b[0]).map(([, i]) => i);
  bySlot.forEach((i, k) => { g.tiles[i].slot = h.slots[k]; });
  ok('the hack reaches the virus', tryRun(g).ok);
  advance(g);
  ok('the fix phase goes back to the working program', g.phase === 'fix' && S(currentProgram(g)) === S(codeProgram(g)));
  const pairs = linkable(g);
  const good = fixes(p, codeProgram(g));
  ok('the fixes are among the linkable pairs', good.every((k) => pairs.some((q) => q.pair === k)));
  const bad = pairs.find((q) => !good.includes(q.pair));
  if (bad) ok('a wrong link leaves a hack', !link(g, bad.pair).ok);
  ok('the right link stops every hack', link(g, good[0]).ok);
}

console.log(fail ? `${fail} failed` : 'all passed');
process.exit(fail ? 1 : 0);
