// 궤도 방어 (Orbit Defense) rules engine: a ship fixed at the centre of a round arena, enemies
// rushing in from every side, an auto-firing laser aimed by a wrist "dial". Fifteen enemy kinds,
// five stage bosses, waves, power-ups, EMP, scoring. Pure: no DOM; randomness comes from the
// seed in the state, so a game replays exactly.
//
// World: the arena floor as a plane, x to the right and y "up" the screen, the ship at (0, 0).
// Angles are radians, counter-clockwise from +x (so straight up is π/2).

export const ARENA = 12;         // radius of the play area
export const SPAWN_R = 13.5;     // enemies appear on this ring, just outside it
export const SHIP_R = 0.8;
export const HULL = 5;
export const EMP_CHARGES = 3;    // per stage
export const EMP_DAMAGE = 6;
export const FIRE_RATE = 6, RAPID_RATE = 10; // pulses per second
export const SHOT_SPEED = 36, SHOT_RANGE = 17, SHOT_DAMAGE = 1;
export const SPREAD = (8 * Math.PI) / 180;
export const ASSIST = (4 * Math.PI) / 180; // a target this close to the aim pulls the shot onto it
export const INVULN = 1.0;       // seconds of grace after the hull is hit
export const POWER_TIME = 12;
export const COMBO_TIME = 3;
export const WAVES = 5;          // per stage, then the boss
export const REST = 2;           // seconds between waves
export const STEP = 1 / 120;     // the simulation's fixed sub-step
export const STAGGER = 3;        // hits that turn a twin blade's dash away

const TAU = Math.PI * 2;
export const wrap = (a) => a - TAU * Math.floor((a + Math.PI) / TAU); // → [-π, π)

// ---------- the roster ----------

const RADIUS = { S: 0.45, M: 0.7, L: 1.2 };
const SCORE = { S: 100, M: 250, L: 600 };
/** kind → { name, en, size, hp, family, cost (wave budget per group) }. The ones that weave,
 * circle, blink or dodge are hard to keep in the sights, so they break after fewer hits. */
export const ENEMIES = {
  spark:     { name: '스파크', en: 'Spark', size: 'S', hp: 1, family: 'ruby', cost: 2 },
  drone:     { name: '드론', en: 'Drone', size: 'S', hp: 1, family: 'ruby', cost: 3 },
  zig:       { name: '지그', en: 'Zig', size: 'S', hp: 1, family: 'sapphire', cost: 1.5 },
  spinner:   { name: '스피너', en: 'Spinner', size: 'S', hp: 1, family: 'sapphire', cost: 1.5 },
  dasher:    { name: '대셔', en: 'Dasher', size: 'M', hp: 3, family: 'ruby', cost: 2.5 },
  orbiter:   { name: '오비터', en: 'Orbiter', size: 'M', hp: 2, family: 'sapphire', cost: 2.5 },
  splitter:  { name: '스플리터', en: 'Splitter', size: 'M', hp: 4, family: 'violet', cost: 3 },
  blinker:   { name: '블링커', en: 'Blinker', size: 'M', hp: 2, family: 'violet', cost: 2.5 },
  hunter:    { name: '헌터', en: 'Hunter', size: 'M', hp: 2, family: 'sapphire', cost: 3 },
  lancer:    { name: '랜서', en: 'Lancer', size: 'M', hp: 5, family: 'ruby', cost: 3.5 },
  shielder:  { name: '실더', en: 'Shielder', size: 'M', hp: 4, family: 'emerald', cost: 3 },
  gunner:    { name: '거너', en: 'Gunner', size: 'M', hp: 5, family: 'emerald', cost: 3.5 },
  brute:     { name: '브루트', en: 'Brute', size: 'L', hp: 12, family: 'emerald', cost: 5 },
  carrier:   { name: '캐리어', en: 'Carrier', size: 'L', hp: 10, family: 'emerald', cost: 6 },
  minelayer: { name: '마인레이어', en: 'Minelayer', size: 'L', hp: 8, family: 'violet', cost: 5 },
};
export const KINDS = Object.keys(ENEMIES);

// small things that don't count towards clearing a wave: enemy shots and mines
const MINOR = {
  bullet: { hp: 1, r: 0.28, dmg: 1 },
  mine: { hp: 1, r: 0.38, dmg: 1 },
};

export const BOSSES = [
  { key: 'hive', name: '하이브 퀸', en: 'Hive Queen' },
  { key: 'twin', name: '트윈 블레이드', en: 'Twin Blades' },
  { key: 'core', name: '코어 오브', en: 'Core Orb' },
  { key: 'serpent', name: '서펀트', en: 'Serpent' },
  { key: 'mother', name: '모선', en: 'Mothership' },
];

/** Each stage brings three new kinds; its waves draw on everything seen so far. */
export const STAGES = [
  { name: '첫 접촉', intro: ['spark', 'drone', 'zig'] },
  { name: '곡선', intro: ['spinner', 'dasher', 'orbiter'] },
  { name: '속임수', intro: ['splitter', 'blinker', 'hunter'] },
  { name: '포위', intro: ['lancer', 'shielder', 'gunner'] },
  { name: '총력전', intro: ['brute', 'carrier', 'minelayer'] },
];

export const POWERS = ['spread', 'pierce', 'rapid', 'shield'];
const DROP_CHANCE = { S: 0.04, M: 0.08, L: 0.35 };

// ---------- randomness ----------

/** mulberry32 on the state's seed: deterministic per game. */
export function rand(st) {
  let t = (st.seed = (st.seed + 0x6d2b79f5) | 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const pick = (st, a) => a[Math.floor(rand(st) * a.length)];

// ---------- the wrist dial ----------

/**
 * Roll of an open hand in the image, radians, 0 = fingers straight up, positive = clockwise as
 * the image is laid out (x right, y down). From the wrist to the middle finger's knuckle.
 * `lm` are MediaPipe hand landmarks (normalised image coordinates).
 */
export function wristRoll(lm) {
  const dx = lm[9].x - lm[0].x, dy = lm[9].y - lm[0].y;
  return Math.atan2(dx, -dy);
}

/**
 * Aim for a wrist roll: the roll away from the reference (the hand's roll when the dial was
 * grabbed), a small dead zone around it, amplified by `gain` so ±90° of wrist covers the circle.
 * Rolling clockwise turns the aim clockwise. Returns an absolute aim angle.
 */
export function dialAim(roll, ref, { gain = 2, dead = (3 * Math.PI) / 180 } = {}) {
  let d = wrap(roll - ref);
  d = Math.abs(d) <= dead ? 0 : d - Math.sign(d) * dead;
  return wrap(Math.PI / 2 - d * gain);
}

/** Exponential smoothing of an angle towards a target, the short way round. */
export function smoothAngle(cur, target, dt, rate = 14) {
  return wrap(cur + wrap(target - cur) * (1 - Math.exp(-rate * dt)));
}

// ---------- a game ----------

export function newGame({ seed = 1, stage = 1 } = {}) {
  const st = {
    seed: seed | 0, t: 0,
    stage, wave: 0, phase: 'ready', timer: 0,
    ship: { hp: HULL, shield: false, aim: Math.PI / 2, invuln: 0 },
    enemies: [], shots: [], drops: [],
    queue: [], waveT: 0,
    power: { spread: 0, pierce: 0, rapid: 0 },
    emp: EMP_CHARGES, empWas: false,
    fireT: 0,
    score: 0, combo: 0, comboT: 0, kills: 0,
    boss: null, // { key, name, phase, maxHp }
    nextId: 1,
  };
  return st;
}

/** Begin (or continue from 'ready'): the first wave of the current stage. */
export function start(st) {
  if (st.phase !== 'ready') return [];
  const ev = [];
  startWave(st, 1, ev);
  return ev;
}

/**
 * Advance the game by `dt` seconds. `input`: { aim (radians), emp (true while the fist is closed) }.
 * Returns the events that happened, for the scene and the sound.
 */
export function step(st, dt, input = {}) {
  const ev = [];
  if (st.phase === 'over' || st.phase === 'victory' || st.phase === 'ready') return ev;
  if (typeof input.aim === 'number') st.ship.aim = wrap(input.aim);
  // EMP on the fist closing (an edge, not held)
  const emp = Boolean(input.emp);
  if (emp && !st.empWas) useEmp(st, ev);
  st.empWas = emp;
  const n = Math.max(1, Math.ceil(dt / STEP - 1e-9));
  const h = dt / n;
  for (let i = 0; i < n; i++) {
    tick(st, h, ev);
    if (st.phase === 'over' || st.phase === 'victory') break;
  }
  return ev;
}

function tick(st, dt, ev) {
  st.t += dt;
  const ship = st.ship;
  ship.invuln = Math.max(0, ship.invuln - dt);
  for (const k of ['spread', 'pierce', 'rapid']) st.power[k] = Math.max(0, st.power[k] - dt);
  if (st.combo && (st.comboT -= dt) <= 0) { st.combo = 0; ev.push({ type: 'comboEnd' }); }

  // ---- stage flow ----
  if (st.phase === 'wave') {
    st.waveT += dt;
    while (st.queue.length && st.queue[0].t <= st.waveT) {
      const g = st.queue.shift();
      spawnGroup(st, g, ev);
    }
    if (!st.queue.length && !st.enemies.some((e) => !e.minor)) {
      ev.push({ type: 'waveClear', stage: st.stage, wave: st.wave });
      st.phase = 'rest';
      st.timer = REST;
    }
  } else if (st.phase === 'rest') {
    if ((st.timer -= dt) <= 0) {
      if (st.wave < WAVES) startWave(st, st.wave + 1, ev);
      else startBoss(st, ev);
    }
  } else if (st.phase === 'clear') {
    if ((st.timer -= dt) <= 0) {
      if (st.stage >= STAGES.length) { st.phase = 'victory'; ev.push({ type: 'victory', score: st.score }); return; }
      st.stage++;
      st.emp = EMP_CHARGES;
      startWave(st, 1, ev);
    }
  }

  // ---- enemies ----
  for (const e of st.enemies) e.shielded = false;
  for (const s of st.enemies) {
    if (s.kind !== 'shielder' || s.dead) continue;
    for (const e of st.enemies) if (e !== s && !e.boss && !e.minor && dist(e, s) < 3.4) e.shielded = true;
  }
  for (const e of [...st.enemies]) {
    if (e.dead) continue;
    e.age += dt;
    AI[e.kind](e, st, dt, ev);
    if (e.dead) continue;
    // reaching the ship: everything but the bosses crashes into it
    if (!e.boss && Math.hypot(e.x, e.y) < SHIP_R + e.r) {
      e.dead = true;
      ev.push({ type: 'crash', id: e.id, kind: e.kind, x: e.x, y: e.y });
      hurt(st, e.dmg, ev);
    }
  }

  // ---- the laser ----
  if (st.phase === 'wave' || st.phase === 'rest' || st.phase === 'boss' || st.phase === 'clear') {
    st.fireT -= dt;
    const period = 1 / (st.power.rapid > 0 ? RAPID_RATE : FIRE_RATE);
    while (st.fireT <= 0) { fire(st, ev); st.fireT += period; }
  }
  moveShots(st, dt, ev);

  // ---- drops drift in and are picked up by the ship or a shot ----
  for (const d of st.drops) {
    d.life -= dt;
    const r = Math.hypot(d.x, d.y);
    if (r > 1e-6) { const k = Math.max(0, r - 0.7 * dt) / r; d.x *= k; d.y *= k; }
    if (Math.hypot(d.x, d.y) < SHIP_R + 0.4) collect(st, d, ev);
  }
  st.drops = st.drops.filter((d) => !d.taken && d.life > 0);
  st.enemies = st.enemies.filter((e) => !e.dead);

  // ---- the boss ----
  if (st.phase === 'boss' && st.boss) {
    const parts = st.enemies.filter((e) => e.boss === st.boss.key);
    if (!parts.length) {
      const bonus = 5000 * st.stage;
      st.score += bonus;
      ship.hp = Math.min(HULL, ship.hp + 1);
      ev.push({ type: 'bossDown', key: st.boss.key, name: st.boss.name, bonus });
      st.boss = null;
      st.phase = 'clear';
      st.timer = 3;
      ev.push({ type: 'stageClear', stage: st.stage });
    }
  }
}

// ---------- waves ----------

function startWave(st, w, ev) {
  st.wave = w;
  st.phase = 'wave';
  st.waveT = 0;
  st.queue = makeWave(st, st.stage, w);
  ev.push({ type: 'wave', stage: st.stage, wave: w, intro: w <= 3 ? STAGES[st.stage - 1].intro[w - 1] : null });
}

/** The kinds a stage's waves may use: everything introduced up to and including it. */
export function poolFor(stage) {
  return STAGES.slice(0, stage).flatMap((s) => s.intro);
}

/**
 * A wave's spawn schedule: groups of enemies with a time and an angle. Waves 1–3 of a stage
 * feature its new kinds; 4–5 mix the whole pool. The budget grows with stage and wave.
 */
export function makeWave(st, stage, w) {
  const pool = poolFor(stage);
  const featured = w <= 3 ? STAGES[stage - 1].intro[w - 1] : null;
  const budget0 = 9 + (stage - 1) * 6 + (w - 1) * 2.5;
  let budget = budget0, t = 0.6;
  const q = [];
  let large = 0;
  while (budget > 0.5) {
    let kind;
    if (featured && budget > budget0 * 0.45) kind = featured;
    else {
      const choices = pool.filter((k) => ENEMIES[k].size !== 'L' || large < 1 + Math.floor(stage / 2));
      kind = pick(st, choices);
    }
    if (ENEMIES[kind].size === 'L') large++;
    budget -= ENEMIES[kind].cost;
    q.push({ t, kind, ang: rand(st) * TAU });
    t += (0.5 + rand(st) * 1.1) * Math.max(0.6, ENEMIES[kind].cost * 0.45) * (1 - (stage - 1) * 0.06);
  }
  return q;
}

function spawnGroup(st, g, ev) {
  const { kind, ang } = g;
  if (kind === 'spark') for (const d of [-0.22, 0, 0.22]) spawn(st, kind, ang + d, SPAWN_R + Math.abs(d) * 3, ev);
  else if (kind === 'drone') for (let i = 0; i < 5; i++) spawn(st, kind, ang, SPAWN_R + i * 1.05, ev);
  else spawn(st, kind, ang, SPAWN_R, ev);
}

/** Put an enemy (or minor thing) on the field at polar (rad, ang). */
export function spawn(st, kind, ang, rad = SPAWN_R, ev = null, extra = {}) {
  const def = ENEMIES[kind], minor = MINOR[kind];
  const e = {
    id: st.nextId++, kind,
    x: Math.cos(ang) * rad, y: Math.sin(ang) * rad,
    hp: def ? def.hp : minor ? minor.hp : 1,
    r: def ? RADIUS[def.size] : minor ? minor.r : 1,
    dmg: def ? (def.size === 'L' ? 2 : 1) : minor ? minor.dmg : 1,
    minor: Boolean(minor), boss: null,
    age: 0, mem: {}, shielded: false, dead: false,
    ...extra,
  };
  e.maxHp = e.hp;
  st.enemies.push(e);
  ev?.push({ type: 'spawn', id: e.id, kind, x: e.x, y: e.y });
  return e;
}

// ---------- motion helpers ----------

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const radOf = (e) => Math.hypot(e.x, e.y);
const angOf = (e) => Math.atan2(e.y, e.x);
function setPolar(e, rad, ang) { e.x = Math.cos(ang) * rad; e.y = Math.sin(ang) * rad; }
/** Move towards (negative) or away from the centre. */
function radial(e, v, dt) {
  const r = radOf(e), a = angOf(e);
  setPolar(e, Math.max(0, r + v * dt), a);
}
/** Move sideways around the centre at a linear speed (positive = counter-clockwise). */
function around(e, v, dt) {
  const r = Math.max(0.5, radOf(e));
  setPolar(e, r, angOf(e) + (v * dt) / r);
}
/** Approach a ring radius and report whether it's there. */
function approachTo(e, ring, v, dt) {
  const r = radOf(e);
  if (r <= ring) return true;
  radial(e, -Math.min(v * dt, r - ring), dt > 0 ? 1 : 0);
  return radOf(e) <= ring + 1e-6;
}
function fireBullet(st, e, ev, ang = angOf(e) + Math.PI, speed = 3.2) {
  const b = spawn(st, 'bullet', 0, 0, null);
  b.x = e.x; b.y = e.y;
  b.mem.vx = Math.cos(ang) * speed; b.mem.vy = Math.sin(ang) * speed;
  ev.push({ type: 'bullet', id: b.id, from: e.id, x: b.x, y: b.y });
  return b;
}

// ---------- behaviours ----------

const AI = {
  spark(e, st, dt) { radial(e, -3.2, dt); },
  drone(e, st, dt) { radial(e, -1.8, dt); },
  zig(e, st, dt) {
    if (e.mem.ph === undefined) e.mem.ph = rand(st) * TAU;
    radial(e, -2.0, dt);
    // the weave narrows as it closes, so it stays trackable near the ship
    around(e, 3.4 * Math.min(1, radOf(e) / 8) * Math.cos(e.age * 3.4 + e.mem.ph), dt);
  },
  spinner(e, st, dt) {
    if (!e.mem.dir) e.mem.dir = rand(st) < 0.5 ? -1 : 1;
    radial(e, -1.0, dt);
    around(e, Math.min(3.6, 0.45 * radOf(e)) * e.mem.dir, dt); // at most ~0.45 rad/s round the ship
  },
  // approach · stop and charge (telegraph) · dash, repeating
  dasher(e, st, dt, ev) {
    const m = e.mem;
    if (!m.mode) { m.mode = 'approach'; m.t = 1.4; }
    m.t -= dt;
    if (m.mode === 'approach') { radial(e, -1.6, dt); if (m.t <= 0) { m.mode = 'charge'; m.t = 0.6; ev.push({ type: 'dashCharge', id: e.id }); } }
    else if (m.mode === 'charge') { if (m.t <= 0) { m.mode = 'dash'; m.t = 0.4; } }
    else { radial(e, -9, dt); if (m.t <= 0) { m.mode = 'approach'; m.t = 1.4; } }
  },
  // in to a ring, one full turn around it, then a dive
  orbiter(e, st, dt) {
    const m = e.mem;
    if (!m.mode) { m.mode = 'in'; m.dir = rand(st) < 0.5 ? -1 : 1; m.turned = 0; }
    if (m.mode === 'in') { if (approachTo(e, 7, 2.4, dt)) m.mode = 'orbit'; }
    else if (m.mode === 'orbit') {
      const a0 = angOf(e);
      around(e, 6 * m.dir, dt);
      m.turned += Math.abs(wrap(angOf(e) - a0));
      if (m.turned >= TAU) m.mode = 'dive';
    } else radial(e, -4, dt);
  },
  splitter(e, st, dt) { radial(e, -1.8, dt); },
  // drifts in, and every so often blinks closer; the next spot is announced half a second ahead
  blinker(e, st, dt, ev) {
    const m = e.mem;
    if (m.t === undefined) m.t = 1.6;
    radial(e, -0.5, dt);
    m.t -= dt;
    if (!m.next && m.t <= 0.5) {
      const r = Math.max(3, radOf(e) - 2.6), a = angOf(e) + (rand(st) < 0.5 ? -0.45 : 0.45);
      m.next = { x: Math.cos(a) * r, y: Math.sin(a) * r };
      ev.push({ type: 'blinkWarn', id: e.id, x: m.next.x, y: m.next.y });
    }
    if (m.t <= 0) {
      ev.push({ type: 'blink', id: e.id, from: { x: e.x, y: e.y }, x: m.next.x, y: m.next.y });
      e.x = m.next.x; e.y = m.next.y; m.next = null; m.t = 1.6;
    }
  },
  // steps aside when the laser points at it — half a second of dodging, then a breather
  hunter(e, st, dt) {
    const m = e.mem;
    radial(e, -2.0, dt);
    m.cool = Math.max(0, (m.cool ?? 0) - dt);
    const d = wrap(angOf(e) - st.ship.aim);
    if (m.dodge > 0) { around(e, m.side * 3.6, dt); if ((m.dodge -= dt) <= 0) m.cool = 1.2; }
    else if (!m.cool && Math.abs(d) < 0.22 && radOf(e) > 3) { m.dodge = 0.5; m.side = d >= 0 ? 1 : -1; }
  },
  // in to a ring, a lock-on line, then a very fast lance
  lancer(e, st, dt, ev) {
    const m = e.mem;
    if (!m.mode) m.mode = 'in';
    if (m.mode === 'in') { if (approachTo(e, 9.5, 2.6, dt)) { m.mode = 'lock'; m.t = 0.9; ev.push({ type: 'lanceLock', id: e.id, x: e.x, y: e.y }); } }
    else if (m.mode === 'lock') { if ((m.t -= dt) <= 0) m.mode = 'lance'; }
    else radial(e, -15, dt);
  },
  shielder(e, st, dt) { radial(e, -1.3, dt); },
  // stops at range and fires slow shots, then after a while closes in
  gunner(e, st, dt, ev) {
    const m = e.mem;
    if (!m.mode) m.mode = 'in';
    if (m.mode === 'in') { if (approachTo(e, 7.5, 2.0, dt)) { m.mode = 'shoot'; m.t = 1.0; m.shots = 0; } }
    else if (m.mode === 'shoot') {
      if ((m.t -= dt) <= 0) { fireBullet(st, e, ev); m.shots++; m.t = 2.2; if (m.shots >= 5) m.mode = 'close'; }
    } else radial(e, -1.0, dt);
  },
  brute(e, st, dt) { radial(e, -0.9, dt); },
  // hangs back and launches drones, then comes in itself
  carrier(e, st, dt, ev) {
    const m = e.mem;
    if (!m.mode) { m.mode = 'in'; m.dir = rand(st) < 0.5 ? -1 : 1; m.launched = 0; m.t = 1.5; }
    if (m.mode === 'in') { if (approachTo(e, 10, 1.2, dt)) m.mode = 'launch'; }
    else if (m.mode === 'launch') {
      around(e, 0.8 * m.dir, dt);
      if ((m.t -= dt) <= 0) {
        const d = spawn(st, 'drone', angOf(e), radOf(e) - 1, null);
        ev.push({ type: 'launch', id: e.id, drone: d.id, x: d.x, y: d.y });
        m.launched++; m.t = 3.2;
        if (m.launched >= 5) m.mode = 'close';
      }
    } else radial(e, -0.9, dt);
  },
  // circles the edge laying mines that drift in, then comes in itself
  minelayer(e, st, dt, ev) {
    const m = e.mem;
    if (!m.mode) { m.mode = 'in'; m.dir = rand(st) < 0.5 ? -1 : 1; m.laid = 0; m.t = 1.2; }
    if (m.mode === 'in') { if (approachTo(e, 9, 1.6, dt)) m.mode = 'lay'; }
    else if (m.mode === 'lay') {
      around(e, 2.2 * m.dir, dt);
      if ((m.t -= dt) <= 0) {
        const mine = spawn(st, 'mine', angOf(e), radOf(e) - 0.4, null);
        ev.push({ type: 'mine', id: e.id, mine: mine.id, x: mine.x, y: mine.y });
        m.laid++; m.t = 1.5;
        if (m.laid >= 8) m.mode = 'close';
      }
    } else radial(e, -1.2, dt);
  },
  bullet(e, st, dt) {
    e.x += e.mem.vx * dt; e.y += e.mem.vy * dt;
    if (radOf(e) > SPAWN_R + 2) e.dead = true;
  },
  mine(e, st, dt) { radial(e, -0.55, dt); },

  // ---------- bosses ----------

  // Hive Queen: circles the edge; its hatch opens every few seconds, lets out drones, and only
  // then can it be hurt.
  hive(e, st, dt, ev) {
    const m = e.mem;
    if (!m.mode) { m.mode = 'in'; m.t = 3; m.open = false; }
    if (m.mode === 'in') { if (approachTo(e, 9, 2.5, dt)) m.mode = 'circle'; return; }
    around(e, 1.8, dt);
    const half = e.hp <= e.maxHp / 2;
    if (half && !m.half) { m.half = true; bossPhase(st, 2, ev); }
    if ((m.t -= dt) <= 0) {
      m.open = !m.open;
      m.t = m.open ? 2 : (half ? 2.5 : 5) - 2;
      if (m.open) {
        ev.push({ type: 'hatch', id: e.id, open: true });
        for (const d of [-0.12, 0, 0.12]) spawn(st, 'drone', angOf(e) + d, radOf(e) - 1.4, ev);
      } else ev.push({ type: 'hatch', id: e.id, open: false });
    }
  },
  // Twin Blades: two blades on opposite sides of an orbit, dashing in by turns. Alone, the
  // survivor dashes more often.
  twin(e, st, dt, ev) {
    const m = e.mem, b = st.boss;
    if (!b) return;
    const partner = st.enemies.find((x) => x.boss === 'twin' && x !== e && !x.dead);
    if (!partner && !m.alone) { m.alone = true; bossPhase(st, 2, ev); }
    if (!m.mode) m.mode = 'in';
    const base = b.theta + m.side * Math.PI;
    // the orbit turns once per tick, driven by the first blade still flying
    if (e === st.enemies.find((x) => x.boss === 'twin' && !x.dead)) b.theta += 0.35 * dt;
    if (m.mode === 'in') {
      const r = radOf(e);
      setPolar(e, Math.max(8, r - 2.5 * dt), base);
      if (r <= 8.001) { m.mode = 'orbit'; m.t = m.side ? 4.5 : 2.5; }
    } else if (m.mode === 'orbit') {
      setPolar(e, 8, base);
      if ((m.t -= dt) <= 0) { m.mode = 'charge'; m.t = 1.0; m.hits = 0; ev.push({ type: 'dashCharge', id: e.id }); }
    } else if (m.mode === 'charge') {
      setPolar(e, 8, base);
      if ((m.t -= dt) <= 0) m.mode = 'dash';
    } else if (m.mode === 'dash') {
      // enough hits while it comes in knock it off course
      if (m.hits >= STAGGER) { m.mode = 'back'; ev.push({ type: 'stagger', id: e.id }); return; }
      radial(e, -(m.alone ? 9 : 7), dt);
      if (radOf(e) <= SHIP_R + e.r) { hurt(st, 1, ev); m.mode = 'back'; }
    } else if (m.mode === 'back') {
      const r = radOf(e) + 6 * dt, a = angOf(e) + wrap(base - angOf(e)) * Math.min(1, 3 * dt);
      setPolar(e, Math.min(8, r), a);
      if (r >= 8) { m.mode = 'orbit'; m.t = m.alone ? 2 : 4; }
    }
  },
  // Core Orb: four armour plates turn around the core; only a shot through a gap gets in.
  core(e, st, dt, ev) {
    const m = e.mem;
    if (!m.mode) { m.mode = 'in'; m.rot = 0; m.spin = 1.2; m.phase = 1; m.t = 3; }
    if (m.mode === 'in') { if (approachTo(e, 8, 2.5, dt)) m.mode = 'hold'; }
    else around(e, 1.5, dt);
    m.rot = wrap(m.rot + m.spin * dt);
    const f = e.hp / e.maxHp;
    if (m.phase === 1 && f <= 2 / 3) { m.phase = 2; m.spin = -1.8; bossPhase(st, 2, ev); }
    if (m.phase === 2 && f <= 1 / 3) { m.phase = 3; m.spin = 2.6; bossPhase(st, 3, ev); }
    if (m.phase >= 2 && m.mode !== 'in' && (m.t -= dt) <= 0) {
      for (const d of [-0.25, 0, 0.25]) fireBullet(st, e, ev, angOf(e) + Math.PI + d, 3.4);
      m.t = m.phase === 2 ? 3 : 2;
    }
  },
  // Serpent: a head and a chain of segments spiralling in. Only the tail can be cut; once the
  // head is alone it rushes the ship, and is thrown back if it gets there.
  serpent(e, st, dt, ev) {
    const m = e.mem;
    const segs = m.segs.map((id) => st.enemies.find((x) => x.id === id)).filter((x) => x && !x.dead);
    if (!segs.length && !m.alone) { m.alone = true; bossPhase(st, 2, ev); }
    if (!m.alone) {
      // slithers for five seconds, then coils still for a breath: the moment to cut the tail
      m.t = (m.t ?? 0) + dt;
      const coiled = m.t % 6.8 > 5;
      if (coiled !== Boolean(m.coiled)) { m.coiled = coiled; ev.push({ type: 'coil', id: e.id, still: coiled }); }
      if (!coiled) {
        const r = radOf(e);
        setPolar(e, Math.max(4.5, r - 0.35 * dt), angOf(e));
        around(e, 2.0, dt);
      }
    } else {
      radial(e, -5, dt);
      if (radOf(e) <= SHIP_R + e.r) { hurt(st, 2, ev); setPolar(e, 10, angOf(e)); ev.push({ type: 'knockback', id: e.id }); }
    }
    // the chain follows the head at a fixed spacing
    let prev = e;
    for (const s of segs) {
      const d = dist(s, prev), gap = 1.15;
      if (d > gap) { const k = (d - gap) / d; s.x += (prev.x - s.x) * k; s.y += (prev.y - s.y) * k; }
      prev = s;
    }
  },
  segment() {}, // moved by its head
  // Mothership: turrets first (the hull is sealed), then the open bridge summons everything it
  // has, and at half strength the whole ship comes in.
  mother(e, st, dt, ev) {
    const m = e.mem;
    if (!m.mode) { m.mode = 'in'; m.t = 3.5; m.phase = 1; }
    if (m.mode === 'in') { if (approachTo(e, 9.5, 2, dt)) m.mode = 'hold'; }
    else if (m.phase < 3) setPolar(e, radOf(e), Math.PI / 2 + 0.25 * Math.sin(st.t * 0.3));
    const turrets = st.enemies.filter((x) => x.kind === 'turret' && !x.dead);
    // turrets ride just in front of the hull (outside it, so a shot at one isn't stopped by the hull)
    const a = angOf(e), r = radOf(e);
    const tx = -Math.sin(a), ty = Math.cos(a), front = e.r + 0.4;
    for (const tu of turrets) {
      const off = tu.mem.off;
      tu.x = e.x + tx * off - Math.cos(a) * front;
      tu.y = e.y + ty * off - Math.sin(a) * front;
    }
    if (m.phase === 1 && !turrets.length) { m.phase = 2; m.t = 1; bossPhase(st, 2, ev); }
    if (m.phase === 2) {
      if ((m.t -= dt) <= 0) { spawn(st, pick(st, KINDS.filter((k) => ENEMIES[k].size !== 'L')), rand(st) * TAU, SPAWN_R, ev); m.t = 3.5; }
      if (e.hp <= e.maxHp / 2) { m.phase = 3; bossPhase(st, 3, ev); }
    }
    if (m.phase === 3) {
      radial(e, -0.5, dt);
      if (r <= SHIP_R + e.r) { hurt(st, 3, ev); setPolar(e, 9.5, a); ev.push({ type: 'knockback', id: e.id }); }
    }
  },
  turret(e, st, dt, ev) {
    const m = e.mem;
    if (st.boss?.key !== 'mother') return;
    const hull = lead(st, 'mother');
    if (!hull || hull.mem.mode === 'in') return;
    if ((m.t -= dt) <= 0) { fireBullet(st, e, ev, angOf(e) + Math.PI, 3.0); m.t = 2.6; }
  },
};

const lead = (st, key) => st.enemies.find((x) => x.boss === key && !x.dead && x.lead);

function startBoss(st, ev) {
  const def = BOSSES[st.stage - 1];
  st.phase = 'boss';
  st.boss = { key: def.key, name: def.name, en: def.en, phase: 1, maxHp: 0, theta: Math.PI / 2 };
  const mk = (kind, hp, r, ang, rad, extra = {}) => {
    const e = spawn(st, kind, ang, rad, ev, { hp, r, dmg: 2, boss: def.key, ...extra });
    e.maxHp = hp;
    st.boss.maxHp += hp;
    return e;
  };
  if (def.key === 'hive') mk('hive', 70, 2.2, Math.PI / 2, SPAWN_R + 1, { lead: true });
  else if (def.key === 'twin') {
    mk('twin', 32, 1.1, Math.PI / 2, SPAWN_R, { lead: true, mem: { side: 0 } });
    mk('twin', 32, 1.1, -Math.PI / 2, SPAWN_R, { mem: { side: 1 } });
  } else if (def.key === 'core') mk('core', 60, 1.6, Math.PI / 2, SPAWN_R + 1, { lead: true });
  else if (def.key === 'serpent') {
    const head = mk('serpent', 10, 0.9, 0, SPAWN_R, { lead: true, mem: { segs: [] } });
    for (let i = 1; i <= 11; i++) {
      const s = mk('segment', 4, 0.7, -i * 0.09, SPAWN_R, { mem: { head: head.id, i } });
      head.mem.segs.push(s.id);
    }
  } else if (def.key === 'mother') {
    mk('mother', 60, 3.0, Math.PI / 2, SPAWN_R + 2, { lead: true });
    for (let i = 0; i < 6; i++) mk('turret', 6, 0.55, Math.PI / 2, SPAWN_R + 2, { mem: { off: (i - 2.5) * 1.1, t: 1.5 + i * 0.4 } });
  }
  ev.push({ type: 'boss', key: def.key, name: def.name, stage: st.stage });
}

function bossPhase(st, phase, ev) {
  if (!st.boss || st.boss.phase >= phase) return;
  st.boss.phase = phase;
  ev.push({ type: 'bossPhase', key: st.boss.key, phase });
}

/** For the HUD: the boss's name, remaining health 0..1 and phase, or null. */
export function bossBar(st) {
  if (!st.boss) return null;
  const hp = st.enemies.filter((e) => e.boss === st.boss.key).reduce((s, e) => s + Math.max(0, e.hp), 0);
  return { key: st.boss.key, name: st.boss.name, frac: st.boss.maxHp ? hp / st.boss.maxHp : 0, phase: st.boss.phase };
}

/**
 * Whether a shot coming from the ship can hurt this enemy right now (armour, hatches, shields,
 * the serpent's order, the mothership's turrets).
 */
export function vulnerable(st, e) {
  if (e.shielded) return false;
  switch (e.kind) {
    case 'hive': return Boolean(e.mem.open);
    case 'core': {
      const face = wrap(angOf(e) + Math.PI); // the side facing the ship
      for (let k = 0; k < 4; k++) if (Math.abs(wrap(face - (e.mem.rot + (k * Math.PI) / 2))) < 0.5) return false;
      return true;
    }
    case 'segment': {
      const head = st.enemies.find((x) => x.id === e.mem.head);
      const alive = head ? head.mem.segs.filter((id) => st.enemies.some((x) => x.id === id && !x.dead)) : [];
      return alive[alive.length - 1] === e.id; // only the tail
    }
    case 'serpent': return Boolean(e.mem.alone);
    case 'mother': return e.mem.phase >= 2;
    default: return true;
  }
}

// ---------- the laser ----------

function fire(st, ev) {
  const aim = st.ship.aim;
  // aim assist: the nearest target within a few degrees of the aim pulls the centre shot onto it
  let target = null, best = Infinity;
  for (const e of st.enemies) {
    if (e.dead) continue;
    const r = radOf(e);
    if (r > SHOT_RANGE) continue;
    const d = Math.abs(wrap(angOf(e) - aim));
    if (d <= ASSIST + Math.atan2(e.r, Math.max(r, 0.1)) * 0.5 && r < best) { best = r; target = e; }
  }
  const centre = target ? angOf(target) : aim;
  const angles = st.power.spread > 0 ? [centre - SPREAD, centre, centre + SPREAD] : [centre];
  const pierce = st.power.pierce > 0;
  const shots = angles.map((a) => {
    const s = { x: Math.cos(a) * SHIP_R, y: Math.sin(a) * SHIP_R, vx: Math.cos(a) * SHOT_SPEED, vy: Math.sin(a) * SHOT_SPEED, a, pierce, hit: [], dead: false };
    st.shots.push(s);
    return s;
  });
  ev.push({ type: 'fire', angles, assist: target?.id ?? null });
  return shots;
}

function moveShots(st, dt, ev) {
  for (const s of st.shots) {
    const x0 = s.x, y0 = s.y;
    s.x += s.vx * dt; s.y += s.vy * dt;
    // what the pulse swept through this sub-step, nearest first
    const hits = [];
    for (const e of st.enemies) {
      if (e.dead || s.hit.includes(e.id)) continue;
      const t = sweep(x0, y0, s.x, s.y, e.x, e.y, e.r);
      if (t !== null) hits.push([t, e]);
    }
    hits.sort((a, b) => a[0] - b[0]);
    for (const [, e] of hits) {
      if (!vulnerable(st, e)) {
        ev.push({ type: 'deflect', id: e.id, x: e.x, y: e.y });
        s.dead = true;
        break;
      }
      damage(st, e, SHOT_DAMAGE, ev);
      s.hit.push(e.id);
      if (!s.pierce) { s.dead = true; break; }
    }
    if (!s.dead) for (const d of st.drops) {
      if (!d.taken && sweep(x0, y0, s.x, s.y, d.x, d.y, 0.5) !== null) collect(st, d, ev);
    }
    if (Math.hypot(s.x, s.y) > SHOT_RANGE) s.dead = true;
  }
  st.shots = st.shots.filter((s) => !s.dead);
}

/** Where along the segment (0..1) it first touches the circle, or null. */
function sweep(x0, y0, x1, y1, cx, cy, r) {
  const dx = x1 - x0, dy = y1 - y0, fx = x0 - cx, fy = y0 - cy;
  const a = dx * dx + dy * dy, b = 2 * (fx * dx + fy * dy), c = fx * fx + fy * fy - r * r;
  if (c <= 0) return 0;
  if (a < 1e-12) return null;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  const t = (-b - Math.sqrt(disc)) / (2 * a);
  return t >= 0 && t <= 1 ? t : null;
}

export function damage(st, e, n, ev) {
  if (e.dead) return;
  e.hp -= n;
  if (e.kind === 'twin' && (e.mem.mode === 'charge' || e.mem.mode === 'dash')) e.mem.hits = (e.mem.hits ?? 0) + n;
  ev.push({ type: 'hit', id: e.id, kind: e.kind, x: e.x, y: e.y, hp: e.hp });
  if (e.hp <= 0) kill(st, e, ev);
}

function kill(st, e, ev) {
  e.dead = true;
  const def = ENEMIES[e.kind];
  let pts = 10;
  if (def) {
    st.combo++;
    st.comboT = COMBO_TIME;
    st.kills++;
    pts = Math.round(SCORE[def.size] * Math.min(4, 1 + st.combo * 0.1));
    if (rand(st) < DROP_CHANCE[def.size]) {
      const d = { id: st.nextId++, kind: pick(st, POWERS), x: e.x, y: e.y, life: 9, taken: false };
      st.drops.push(d);
      ev.push({ type: 'drop', id: d.id, kind: d.kind, x: d.x, y: d.y });
    }
  } else if (e.boss) pts = 300;
  st.score += pts;
  ev.push({ type: 'kill', id: e.id, kind: e.kind, x: e.x, y: e.y, score: pts, combo: st.combo, boss: e.boss });
  if (e.kind === 'splitter') {
    for (const d of [-0.12, 0.12]) spawn(st, 'spark', angOf(e) + d, radOf(e), ev);
  }
}

function collect(st, d, ev) {
  d.taken = true;
  if (d.kind === 'shield') st.ship.shield = true;
  else st.power[d.kind] = POWER_TIME;
  ev.push({ type: 'pickup', id: d.id, kind: d.kind });
}

function hurt(st, n, ev) {
  const ship = st.ship;
  if (ship.invuln > 0) return;
  if (ship.shield) { ship.shield = false; ship.invuln = INVULN; ev.push({ type: 'shieldBreak' }); return; }
  ship.hp = Math.max(0, ship.hp - n);
  ship.invuln = INVULN;
  st.combo = 0;
  ev.push({ type: 'hurt', dmg: n, hp: ship.hp });
  if (ship.hp <= 0) { st.phase = 'over'; ev.push({ type: 'over', score: st.score, stage: st.stage, wave: st.wave }); }
}

function useEmp(st, ev) {
  if (st.emp <= 0 || !['wave', 'rest', 'boss'].includes(st.phase)) { ev.push({ type: 'empEmpty' }); return; }
  st.emp--;
  ev.push({ type: 'emp', left: st.emp });
  for (const e of [...st.enemies]) {
    if (e.dead) continue;
    if (e.minor) { e.dead = true; ev.push({ type: 'kill', id: e.id, kind: e.kind, x: e.x, y: e.y, score: 0, combo: st.combo, boss: null }); continue; }
    // bosses shrug most of it off, armour or not
    damage(st, e, e.boss ? 3 : EMP_DAMAGE, ev);
  }
}
