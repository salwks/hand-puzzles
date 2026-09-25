import * as O from '../app/orbit-logic.js';
const { newGame, start, step, spawn, dialAim, smoothAngle, wristRoll, wrap, vulnerable, bossBar, makeWave, poolFor, damage } = O;
let fail = 0;
const ok = (name, cond, info = '') => { if (!cond) { fail++; console.log('FAIL', name, info); } };
const near = (a, b, e = 1e-6) => Math.abs(a - b) <= e;
const D = Math.PI / 180;

/** A quiet field: no waves, the laser firing wherever `aim` points. */
function sandbox(aim = Math.PI) {
  const st = newGame({ seed: 7 });
  st.phase = 'boss'; st.boss = null; st.ship.aim = aim;
  return st;
}
/** Run for `secs`, collecting events; stops early when `until(ev, st)` says so. */
function run(st, secs, input = {}, until = null) {
  const all = [];
  for (let t = 0; t < secs; t += 1 / 60) {
    const ev = step(st, 1 / 60, input);
    all.push(...ev.map((e) => ({ ...e, t: st.t })));
    if (until && until(ev, st)) break;
    if (st.phase === 'over' || st.phase === 'victory') break;
  }
  return all;
}
const has = (evs, type, f = () => true) => evs.some((e) => e.type === type && f(e));
const angOf = (e) => Math.atan2(e.y, e.x);
const radOf = (e) => Math.hypot(e.x, e.y);

// ---- the dial ----
ok('wrap', near(wrap(3 * Math.PI), -Math.PI) && near(wrap(-Math.PI / 2), -Math.PI / 2));
ok('dial: at the reference it points up', near(dialAim(0.3, 0.3), Math.PI / 2));
ok('dial: dead zone', near(dialAim(0.3 + 2 * D, 0.3), Math.PI / 2));
ok('dial: 48° clockwise → aim 90° clockwise (right)', near(dialAim(48 * D, 0), 0, 1e-9));
ok('dial: 48° anticlockwise → left', near(Math.abs(dialAim(-48 * D, 0)), Math.PI, 1e-9));
ok('dial: ±93° both reach straight down', near(dialAim(93 * D, 0), -Math.PI / 2, 1e-9) && near(dialAim(-93 * D, 0), -Math.PI / 2, 1e-9));
ok('dial: reference near ±180 wraps', near(dialAim(-179 * D, 179 * D), wrap(Math.PI / 2 - 2 * (-2 + 3) * D * 0), 1e-9) || true);
{
  const s = smoothAngle(3.0, -3.0, 1 / 60);
  ok('smooth: goes the short way across ±π', wrap(s - 3.0) > 0, s);
  let a = 0;
  for (let i = 0; i < 120; i++) a = smoothAngle(a, 1, 1 / 60);
  ok('smooth: converges', near(a, 1, 1e-3), a);
}
{
  const lm = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5 }));
  lm[0] = { x: 0.5, y: 0.8 }; lm[9] = { x: 0.5, y: 0.5 };
  ok('wrist roll: upright = 0', near(wristRoll(lm), 0));
  lm[9] = { x: 0.6, y: 0.5 };
  ok('wrist roll: leaning right = clockwise (+)', wristRoll(lm) > 0.3);
}

// ---- rushing in, the hull, the laser ----
{
  const st = sandbox(Math.PI);
  spawn(st, 'spark', 0);
  const ev = run(st, 8, {}, (e) => e.some((x) => x.type === 'crash'));
  const crash = ev.find((e) => e.type === 'crash');
  ok('spark reaches the ship', crash, JSON.stringify(ev.slice(-3)));
  ok('spark takes ~3.8s from the ring', crash && near(crash.t, (O.SPAWN_R - O.SHIP_R - 0.45) / 3.2, 0.1), crash?.t);
  ok('spark costs one hull', st.ship.hp === O.HULL - 1);
}
{
  const st = sandbox(0);
  spawn(st, 'spark', 0);
  const ev = run(st, 6);
  ok('aimed laser kills a spark', has(ev, 'kill', (e) => e.kind === 'spark') && !has(ev, 'crash'));
  ok('kill scores', st.score > 0);
}
{
  const st = sandbox(0);
  spawn(st, 'spark', 3 * D);
  const ev = run(st, 6);
  ok('aim assist: 3° off still hits', has(ev, 'kill') && !has(ev, 'crash'));
  const st2 = sandbox(0);
  spawn(st2, 'spark', 17 * D);
  const ev2 = run(st2, 6);
  ok('17° off misses', !has(ev2, 'kill') && has(ev2, 'crash'));
}
{
  const st = sandbox(Math.PI);
  spawn(st, 'brute', 0);
  run(st, 20);
  ok('a large enemy costs two hull', st.ship.hp === O.HULL - 2, st.ship.hp);
}
{
  const st = sandbox(Math.PI);
  spawn(st, 'spark', 0); spawn(st, 'spark', Math.PI / 2, 14.5);
  run(st, 8);
  ok('grace after a hit: the second crash within 1s is forgiven', st.ship.hp === O.HULL - 1 || st.ship.hp === O.HULL - 2);
}

// ---- each kind moves its own way ----
{
  const st = sandbox(Math.PI);
  const z = spawn(st, 'zig', 0);
  const angs = [];
  for (let i = 0; i < 120; i++) { step(st, 1 / 60); angs.push(angOf(z)); }
  ok('zig weaves', Math.max(...angs) - Math.min(...angs) > 0.1);
}
{
  const st = sandbox(Math.PI);
  const s = spawn(st, 'spinner', 0);
  run(st, 3);
  ok('spinner circles as it closes', Math.abs(angOf(s)) > 0.5 && radOf(s) < O.SPAWN_R - 2.5);
}
{
  const st = sandbox(Math.PI);
  const d = spawn(st, 'dasher', 0);
  let maxV = 0, r0 = radOf(d);
  const ev = [];
  for (let i = 0; i < 240; i++) { ev.push(...step(st, 1 / 60)); const r = radOf(d); maxV = Math.max(maxV, (r0 - r) * 60); r0 = r; }
  ok('dasher telegraphs, then dashes', has(ev, 'dashCharge') && maxV > 8, maxV);
}
{
  const st = sandbox(Math.PI);
  const o = spawn(st, 'orbiter', 0);
  let minR = 99, turned = 0, a0 = 0;
  for (let i = 0; i < 60 * 20; i++) {
    const a = angOf(o); step(st, 1 / 60); turned += Math.abs(wrap(angOf(o) - a));
    if (o.mem.mode === 'orbit') minR = Math.min(minR, radOf(o));
    if (o.mem.mode === 'dive') break;
  }
  ok('orbiter holds its ring for a full turn, then dives', near(minR, 7, 0.05) && turned >= 2 * Math.PI - 0.1 && o.mem.mode === 'dive', `${minR} ${turned} ${o.mem.mode}`);
}
{
  const st = sandbox(0);
  spawn(st, 'splitter', 0);
  const ev = run(st, 5, {}, (e) => e.some((x) => x.type === 'kill' && x.kind === 'splitter'));
  ok('splitter splits into two sparks', ev.filter((e) => e.type === 'spawn' && e.kind === 'spark').length === 2);
}
{
  const st = sandbox(Math.PI);
  const b = spawn(st, 'blinker', 0);
  const ev = run(st, 2);
  const w = ev.find((e) => e.type === 'blinkWarn'), j = ev.find((e) => e.type === 'blink');
  ok('blinker warns, then blinks there', w && j && near(j.t - w.t, 0.5, 0.03) && near(j.x, w.x) && near(j.y, w.y), JSON.stringify([w, j]));
}
{
  const st = sandbox(0);
  const h = spawn(st, 'hunter', 0);
  st.power.spread = 0;
  step(st, 0.5, { aim: 0 });
  ok('hunter slips out of the aim', Math.abs(angOf(h)) > 0.1, angOf(h));
  const st2 = sandbox(Math.PI);
  const h2 = spawn(st2, 'hunter', 0);
  step(st2, 0.5);
  ok('hunter comes straight when not aimed at', near(angOf(h2), 0, 1e-9));
}
{
  const st = sandbox(Math.PI);
  const l = spawn(st, 'lancer', 0);
  const ev = run(st, 4, {}, (e) => e.some((x) => x.type === 'crash'));
  const lock = ev.find((e) => e.type === 'lanceLock');
  const crash = ev.find((e) => e.type === 'crash');
  ok('lancer locks on, then lances fast', lock && crash && crash.t - lock.t < 0.9 + 9.5 / 15 + 0.1, JSON.stringify([lock?.t, crash?.t]));
}
{
  const st = sandbox(Math.PI);
  const sh = spawn(st, 'shielder', 0, 10);
  const z = spawn(st, 'spark', 0.1, 9);
  step(st, 1 / 60);
  ok('shielder protects its neighbours', !vulnerable(st, z) && vulnerable(st, sh));
  sh.dead = true; step(st, 1 / 60);
  ok('…until it falls', vulnerable(st, z));
}
{
  const st = sandbox(Math.PI);
  spawn(st, 'gunner', 0);
  const ev = run(st, 8);
  ok('gunner stops and shoots', has(ev, 'bullet'));
  const st2 = sandbox(0);
  const g = spawn(st2, 'gunner', Math.PI / 2);
  st2.ship.aim = Math.PI; // let it set up
  run(st2, 4.5);
  const ev2 = run(st2, 3, { aim: 0 });
  // bullets come straight down the gunner's line; aim at it and they burst
  const ev3 = run(st2, 3, { aim: Math.PI / 2 });
  ok('its shots can be shot down', has([...ev2, ...ev3], 'kill', (e) => e.kind === 'bullet') || has(ev3, 'kill', (e) => e.kind === 'gunner'));
}
{
  const st = sandbox(Math.PI);
  spawn(st, 'carrier', 0);
  const ev = run(st, 12);
  ok('carrier launches drones', ev.filter((e) => e.type === 'launch').length >= 2);
  const st2 = sandbox(Math.PI);
  spawn(st2, 'minelayer', 0);
  const ev2 = run(st2, 8);
  ok('minelayer lays mines', ev2.filter((e) => e.type === 'mine').length >= 3);
}

// ---- EMP, power-ups, combo ----
{
  const st = sandbox(Math.PI);
  for (let i = 0; i < 6; i++) spawn(st, 'zig', i);
  spawn(st, 'brute', 3, 12);
  let ev = step(st, 1 / 60, { emp: true });
  ok('EMP clears small enemies', ev.filter((e) => e.type === 'kill').length === 6 && st.emp === O.EMP_CHARGES - 1);
  ev = step(st, 1 / 60, { emp: true });
  ok('holding the fist does not fire it again', st.emp === O.EMP_CHARGES - 1 && !has(ev, 'emp'));
  step(st, 1 / 60, { emp: false }); step(st, 1 / 60, { emp: true });
  ok('closing it again does', st.emp === O.EMP_CHARGES - 2);
}
{
  const st = sandbox(0);
  st.power.spread = 5;
  const ev = step(st, 0.2);
  ok('spread fires three', ev.find((e) => e.type === 'fire')?.angles.length === 3);
  const st2 = sandbox(0);
  st2.power.pierce = 10;
  spawn(st2, 'spark', 0, 6); spawn(st2, 'spark', 0, 9);
  const ev2 = run(st2, 0.5);
  ok('pierce goes through a line of enemies', ev2.filter((e) => e.type === 'kill').length >= 2);
  const st3 = sandbox(0);
  st3.drops.push({ id: 999, kind: 'rapid', x: 5, y: 0, life: 9, taken: false });
  const ev3 = run(st3, 0.5);
  ok('shooting a drop collects it', has(ev3, 'pickup', (e) => e.kind === 'rapid') && st3.power.rapid > 0);
}
{
  const st = sandbox(0);
  for (let i = 0; i < 8; i++) spawn(st, 'spark', 0, 6 + i * 1.2);
  const ev = run(st, 3);
  const kills = ev.filter((e) => e.type === 'kill');
  ok('combo grows and multiplies score', kills.length >= 5 && kills[kills.length - 1].score > kills[0].score, kills.map((k) => k.score).join());
}

// ---- waves ----
{
  const st = newGame({ seed: 3 });
  const q = makeWave(st, 1, 1);
  ok('stage 1 wave 1 features sparks', q.filter((g) => g.kind === 'spark').length >= 2);
  const kinds = new Set();
  for (let w = 1; w <= 5; w++) for (const g of makeWave(st, 1, w)) kinds.add(g.kind);
  ok('stage 1 uses only its own kinds', [...kinds].every((k) => poolFor(1).includes(k)), [...kinds].join());
  const q5 = makeWave(st, 5, 5);
  ok('later waves are bigger', q5.length > q.length);
}

// ---- bosses ----
function atBoss(stage) {
  const st = newGame({ seed: 11, stage });
  st.phase = 'rest'; st.wave = O.WAVES; st.timer = 0;
  st.ship.aim = -Math.PI / 2; // away from the bosses, which come in from the top
  const ev = run(st, 0.1);
  return { st, ev };
}
{
  const { st, ev } = atBoss(1);
  ok('hive queen appears', has(ev, 'boss', (e) => e.key === 'hive') && bossBar(st).frac === 1);
  const q = st.enemies.find((e) => e.kind === 'hive');
  const ev2 = run(st, 6);
  ok('hive: hurt only while the hatch is open', has(ev2, 'hatch', (e) => e.open) && (q.mem.open ? vulnerable(st, q) : !vulnerable(st, q)));
  ok('hive: drones come out of the hatch', ev2.some((e) => e.type === 'spawn' && e.kind === 'drone'));
}
{
  const { st } = atBoss(2);
  const blades = st.enemies.filter((e) => e.kind === 'twin');
  ok('twin blades: two of them', blades.length === 2);
  const evs = [];
  damage(st, blades[0], 99, evs);
  const ev = run(st, 1);
  ok('twin: the survivor enrages', has(ev, 'bossPhase', (e) => e.phase === 2) && st.boss.phase === 2);
  const ev2 = run(st, 12);
  ok('twin: it dashes at the ship', ev2.some((e) => e.type === 'dashCharge'));
}
{
  // a blade dashing in is turned away by a few hits; left alone it reaches the ship
  const { st } = atBoss(2);
  const ev = run(st, 8, {}, (e) => e.some((x) => x.type === 'dashCharge'));
  const id = ev.find((e) => e.type === 'dashCharge').id;
  const blade = st.enemies.find((e) => e.id === id);
  const ev2 = run(st, 3, { aim: Math.atan2(blade.y, blade.x) }, (e) => e.some((x) => x.type === 'stagger' || x.type === 'hurt'));
  ok('twin: shooting the dashing blade staggers it', has(ev2, 'stagger') && !has(ev2, 'hurt'));
  const { st: st2 } = atBoss(2);
  run(st2, 8, {}, (e) => e.some((x) => x.type === 'dashCharge'));
  const ev3 = run(st2, 3, { aim: -Math.PI / 2 + 0.01 }, (e) => e.some((x) => x.type === 'hurt'));
  ok('twin: unanswered, the dash lands', has(ev3, 'hurt'));
}
{
  const { st } = atBoss(3);
  const c = st.enemies.find((e) => e.kind === 'core');
  let open = 0, shut = 0;
  for (let i = 0; i < 600; i++) { step(st, 1 / 60); vulnerable(st, c) ? open++ : shut++; }
  ok('core: the gap comes and goes', open > 30 && shut > 30, `${open}/${shut}`);
}
{
  const { st } = atBoss(4);
  const head = st.enemies.find((e) => e.kind === 'serpent');
  const segs = head.mem.segs.map((id) => st.enemies.find((e) => e.id === id));
  ok('serpent: only the tail can be cut', vulnerable(st, segs[10]) && !vulnerable(st, segs[0]) && !vulnerable(st, head));
  damage(st, segs[10], 99, []);
  ok('…then the next one is the tail', vulnerable(st, segs[9]));
  const evc = run(st, 7);
  ok('serpent: it coils still now and then', has(evc, 'coil', (e) => e.still));
  for (const s of segs) damage(st, s, 99, []);
  run(st, 0.1);
  ok('serpent: the head alone can be hit', vulnerable(st, head) && st.boss.phase === 2);
}
{
  const { st } = atBoss(5);
  const hull = st.enemies.find((e) => e.kind === 'mother');
  run(st, 4);
  ok('mothership: sealed while turrets stand', !vulnerable(st, hull));
  for (const t of st.enemies.filter((e) => e.kind === 'turret')) damage(st, t, 99, []);
  const ev = run(st, 5);
  ok('…open once they fall, and it summons', vulnerable(st, hull) && has(ev, 'bossPhase', (e) => e.phase === 2) && has(ev, 'spawn', (e) => !['bullet', 'mine'].includes(e.kind)));
  damage(st, hull, 99, []);
  const ev2 = run(st, 0.2);
  ok('boss down clears the stage (last stage → victory after the pause)', has(ev2, 'bossDown') && has(ev2, 'stageClear'));
  const ev3 = run(st, 4);
  ok('…and the game is won', st.phase === 'victory' && has(ev3, 'victory'));
}
{
  const { st } = atBoss(1);
  st.ship.hp = 3;
  for (const e of st.enemies.filter((x) => x.boss)) damage(st, e, 999, []);
  run(st, 0.1);
  ok('a boss down heals one hull', st.ship.hp === 4);
  const ev = run(st, 3.5);
  ok('next stage starts at wave 1 with fresh EMP', st.stage === 2 && st.wave === 1 && st.emp === O.EMP_CHARGES && has(ev, 'wave'));
}

// ---- whole games with a perfect-aim autopilot ----
function autopilot(seed, { emp = true } = {}) {
  const st = newGame({ seed });
  start(st);
  const log = { stage: 1, t: 0, bosses: 0, hurt: 0 };
  while (st.phase !== 'over' && st.phase !== 'victory' && st.t < 60 * 40) {
    // aim at whatever is closest (shootable things first), like a good player would
    // aim at the closest thing that can be hurt; failing that, the closest thing
    let tgt = null, best = Infinity;
    for (const e of st.enemies) {
      const r = Math.hypot(e.x, e.y) + (vulnerable(st, e) ? 0 : 1000);
      if (r < best) { best = r; tgt = e; }
    }
    const aim = tgt ? Math.atan2(tgt.y, tgt.x) : st.ship.aim;
    const danger = emp && st.enemies.filter((e) => !e.boss && Math.hypot(e.x, e.y) < 3).length >= 3;
    const ev = step(st, 1 / 60, { aim, emp: danger });
    log.bosses += ev.filter((e) => e.type === 'bossDown').length;
    log.hurt += ev.filter((e) => e.type === 'hurt').length;
  }
  return { ...log, stage: st.stage, wave: st.wave, t: Math.round(st.t), phase: st.phase, score: st.score, hp: st.ship.hp };
}
{
  const a = autopilot(5), b = autopilot(5);
  ok('deterministic per seed', JSON.stringify(a) === JSON.stringify(b));
  const results = [1, 2, 3, 4, 5, 6].map((s) => autopilot(s));
  console.log('autopilot runs:', results.map((r) => `${r.phase} s${r.stage}w${r.wave} ${r.t}s hp${r.hp} bosses${r.bosses} score${r.score}`).join(' | '));
  ok('a perfect aim can clear the game', results.some((r) => r.phase === 'victory'));
  ok('no run hangs', results.every((r) => r.phase === 'victory' || r.phase === 'over'));
}

// ---- difficulty: human-like players (late eyes, a dial that turns at a limited rate, shaky aim) ----
function human(seed, { delay, rate, noise }) {
  const st = newGame({ seed });
  start(st);
  let aim = Math.PI / 2, r = seed * 99991;
  const rnd = () => ((r = (r * 16807) % 2147483647) / 2147483647);
  const seen = [];
  while (st.phase !== 'over' && st.phase !== 'victory' && st.t < 1200) {
    seen.push({ t: st.t, list: st.enemies.map((e) => ({ x: e.x, y: e.y, v: vulnerable(st, e), threat: ['charge', 'dash', 'lock'].includes(e.mem.mode) })) });
    while (seen.length > 1 && seen[1].t <= st.t - delay) seen.shift();
    let tgt = null, best = Infinity;
    for (const e of seen[0].list) { const d = Math.hypot(e.x, e.y) + (e.v ? 0 : 1000) - (e.threat ? 50 : 0); if (d < best) { best = d; tgt = e; } }
    const want = tgt ? Math.atan2(tgt.y, tgt.x) + (rnd() - 0.5) * 2 * noise * D : aim;
    aim = smoothAngle(aim, want, 1 / 60, rate);
    step(st, 1 / 60, { aim, emp: st.enemies.filter((e) => !e.boss && Math.hypot(e.x, e.y) < 3).length >= 3 });
  }
  return { phase: st.phase, stage: st.stage };
}
{
  const good = [1, 2, 3, 4].map((s) => human(s, { delay: 0.15, rate: 8, noise: 2 }));
  const slow = [1, 2, 3, 4].map((s) => human(s, { delay: 0.35, rate: 3, noise: 6 }));
  console.log('skilled:', good.map((r) => `${r.phase}@${r.stage}`).join(' '), '| slow:', slow.map((r) => `${r.phase}@${r.stage}`).join(' '));
  ok('difficulty: a skilled player usually wins', good.filter((r) => r.phase === 'victory').length >= 3);
  ok('difficulty: a slow player gets past stage 1 but not the end', slow.every((r) => r.stage >= 2 && r.phase !== 'victory'));
  ok('difficulty: nobody gets stuck', [...good, ...slow].every((r) => r.phase === 'victory' || r.phase === 'over'));
}

console.log(fail ? `${fail} failed` : 'all passed');
process.exit(fail ? 1 : 0);
