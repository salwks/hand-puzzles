// 궤도 방어: the game page. Runs the rules engine (orbit-logic.js) inside the 3D view's frame
// loop, turns the tracked hand into a dial (open hand = aim by wrist roll, fist = EMP), or the
// mouse into an aim (cursor direction, right click / Space = EMP), and keeps the HUD, the
// sounds and the effects in step with the engine's events.
import * as O from './orbit-logic.js';
import { OrbitScene } from './orbit-scene.js';
import { createShell } from './shell.js';
import { isMuted, setMuted } from './sound.js';
import { createFx } from './fx.js';
import { orbitSfx, unlockOrbitSound } from './orbit-sfx.js';

const $ = (sel) => document.querySelector(sel);
const BEST_KEY = 'orbit-best';
const HAND_LOST_MS = 1000;
const FIST_FRAMES = 3; // frames a fist must hold before it counts (a passing half-fist shouldn't fire the EMP)

const scene = new OrbitScene($('#stage'));
const shell = createShell({ scene, gameId: 'orbit' });
const { bigSay, flash, specialFx, victoryFx } = createFx(scene);
scene.setAim(Math.PI / 2);

const game = {
  st: null,
  playing: false,
  paused: false,
  pauseWhy: '',
  aim: Math.PI / 2,
  target: Math.PI / 2,
  empKey: false,
  mode: 'mouse',
  dial: { ref: null, roll: 0, pose: null, seen: 0, fistRun: 0 },
  lastHud: {},
};

// ---------- the hand dial ----------

/** Open hand, fist or something in between, from the finger landmarks. */
function handPose(lm) {
  const d = (a, b) => Math.hypot(lm[a].x - lm[b].x, lm[a].y - lm[b].y);
  const fingers = [[8, 6], [12, 10], [16, 14], [20, 18]];
  const ext = fingers.filter(([t, j]) => d(t, 0) > d(j, 0) * 1.1).length;
  const curled = fingers.filter(([t, j]) => d(t, 0) < d(j, 0) * 0.98).length;
  if (curled >= 4) return 'fist';
  if (ext >= 3) return 'open';
  return 'other';
}

function onHandPose(frame) {
  const lm = frame.landmarks;
  if (!lm) return;
  const dial = game.dial;
  dial.seen = performance.now();
  // the landmarks are in the raw (unmirrored) camera image: the player's clockwise is its anticlockwise
  dial.roll = -O.wristRoll(lm);
  const pose = handPose(lm);
  dial.pose = pose;
  dial.fistRun = pose === 'fist' ? dial.fistRun + 1 : 0;
  if (pose === 'open') {
    if (dial.ref === null) {
      dial.ref = dial.roll;
      if (game.playing) shell.toast('다이얼 영점을 맞췄습니다 — 지금 손 각도가 위쪽', 2200);
    }
    game.target = O.dialAim(dial.roll, dial.ref);
    if (game.paused && game.pauseWhy === 'hand') setPaused(false);
  }
  game.mode = 'hand';
  drawDial();
}

function zeroDial() {
  if (performance.now() - game.dial.seen > 300) { shell.toast('손을 펴서 보여준 상태에서 영점을 맞추세요'); return; }
  game.dial.ref = game.dial.roll;
  shell.toast('다이얼 영점을 맞췄습니다', 1600);
}

function drawDial() {
  const box = $('#o-dial');
  const on = shell.cameraOn();
  box.hidden = !on;
  if (!on) return;
  const { roll, ref, pose, seen } = game.dial;
  const present = performance.now() - seen < 300;
  const rel = ref === null ? roll : O.wrap(roll - ref);
  const deg = Math.round((rel * 180) / Math.PI);
  const c = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rel));
  const x = 100 + Math.sin(c) * 76, y = 100 - Math.cos(c) * 76;
  $('#o-dial-hand').setAttribute('x2', x.toFixed(1));
  $('#o-dial-hand').setAttribute('y2', y.toFixed(1));
  const ax = 100 + Math.sin(c) * 80, ay = 100 - Math.cos(c) * 80;
  $('#o-dial-arc').setAttribute('d', present && pose === 'open' ? `M 100 20 A 80 80 0 0 ${c >= 0 ? 1 : 0} ${ax.toFixed(1)} ${ay.toFixed(1)}` : '');
  const aimDeg = Math.round(((Math.PI / 2 - game.aim) * 180) / Math.PI);
  $('#o-dial-roll').textContent = present ? `손목 ${deg > 0 ? '+' : ''}${deg}°` : '손목 —';
  $('#o-dial-aim').textContent = `조준 ${((aimDeg % 360) + 360) % 360}°`;
  $('#o-dial-state').textContent = !present ? '손을 펴서 카메라에 보이세요'
    : pose === 'fist' ? '주먹 — EMP'
    : pose === 'open' ? (ref === null ? '영점 맞추는 중' : '다이얼 잡음 · 손목을 돌려 조준')
    : '손을 펴면 조준합니다';
  box.classList.toggle('grab', present && pose === 'open');
  box.classList.toggle('fist', present && pose === 'fist');
}

// ---------- mouse / keys ----------

function aimAtScreen(x, y) {
  const p = scene.logicAt(x, y);
  if (!p || Math.hypot(p.x, p.y) < 0.3) return;
  game.target = Math.atan2(p.y, p.x);
}

$('#stage').addEventListener('contextmenu', (e) => { e.preventDefault(); if (game.playing && !game.paused) game.empKey = true; });
addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); if (game.playing && !game.paused && !e.repeat) game.empKey = true; }
  else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') { if (game.playing) setPaused(!game.paused, 'key'); }
  else if (e.key === 'c' || e.key === 'C') zeroDial();
});

shell.attach({
  modalOpen: () => shell.introOpen() || !$('#o-end').hidden || !$('#o-pause').hidden,
  dragging: () => false,
  // while playing, a pinch or fist over the HUD must not press its buttons; paused, it may
  startDrag() { return game.playing && !game.paused; },
  moveDrag() {},
  endDrag() {},
  cancelDrag() {},
  updateHover(x, y) {
    if (x === null || shell.handActive()) return;
    game.mode = 'mouse';
    if (game.playing && !game.paused) aimAtScreen(x, y);
  },
  onHandPose,
  refresh() { drawDial(); },
});

// ---------- the game ----------

function newGame() {
  scene.reset();
  game.st = O.newGame({ seed: (Math.random() * 2 ** 31) | 0 });
  game.playing = true;
  game.paused = false;
  game.aim = game.target = Math.PI / 2;
  scene.setAim(game.aim);
  $('#o-end').hidden = true;
  handle(O.start(game.st));
  orbitSfx.start();
  hud(true);
}

function setPaused(on, why = '') {
  if (!game.playing) return;
  game.paused = on;
  orbitSfx.pause(on);
  game.pauseWhy = on ? why : '';
  $('#o-pause').hidden = !on;
  const first = game.st && game.st.t < 1;
  $('#o-pause .overline').textContent = first ? 'READY' : 'PAUSED';
  $('#o-pause h2').textContent = first ? '다이얼 잡기' : '일시정지';
  $('#o-pause-why').textContent = why !== 'hand' ? 'P를 누르거나 계속하기를 누르세요'
    : first ? '손을 펴서 똑바로 세우면 시작합니다 — 그 각도가 위쪽(영점)이 됩니다'
    : '손이 보이지 않습니다 — 손을 펴 보이면 계속합니다';
}
$('#o-resume').addEventListener('click', () => setPaused(false));
$('#b-pause').addEventListener('click', () => setPaused(!game.paused, 'key'));
$('#b-zero').addEventListener('click', zeroDial);
$('#o-again').addEventListener('click', () => { unlock(); newGame(); });

function unlock() { unlockOrbitSound(); }
for (const id of ['#btn-start-cam', '#btn-start-mouse']) {
  $(id).addEventListener('click', () => {
    unlock();
    game.mode = id === '#btn-start-cam' ? 'hand' : 'mouse';
    if (game.mode === 'mouse') { setTimeout(newGame, 300); return; }
    // the hand model takes a few seconds to load: start once the camera is on (or fall back to the mouse)
    banner('<b>카메라 준비 중</b> — 손 인식 모델을 불러옵니다');
    const t0 = performance.now();
    const wait = setInterval(() => {
      if (shell.cameraOn()) { clearInterval(wait); game.dial.ref = null; newGame(); }
      else if (performance.now() - t0 > 20000) { clearInterval(wait); game.mode = 'mouse'; newGame(); }
    }, 200);
  });
}

scene.onFrame = (dt) => {
  const st = game.st;
  if (!st) return;
  // a hand that has gone for a while pauses the game (only when it's being played by hand)
  if (game.playing && !game.paused && shell.cameraOn() && game.mode === 'hand' && performance.now() - game.dial.seen > HAND_LOST_MS) setPaused(true, 'hand');
  if (game.playing && !game.paused) {
    game.aim = O.smoothAngle(game.aim, game.target, dt, game.mode === 'hand' ? 16 : 30);
    const emp = game.empKey || game.dial.fistRun >= FIST_FRAMES;
    game.empKey = false;
    handle(O.step(st, dt, { aim: game.aim, emp }));
  }
  scene.setAim(st.ship.aim);
  scene.sync(st, dt);
  hud();
  if (shell.cameraOn()) drawDial();
};

// ---------- events → effects, sounds, HUD ----------

let hitSound = 0;
function handle(evs) {
  const st = game.st;
  for (const ev of evs) {
    switch (ev.type) {
      case 'fire': orbitSfx.laser(st.power.rapid > 0); break;
      case 'hit':
        scene.hitFx(ev.id);
        if (performance.now() - hitSound > 40) { hitSound = performance.now(); orbitSfx.hit(ev.x); }
        break;
      case 'deflect': scene.spark(ev.x, ev.y); orbitSfx.deflect(ev.x); break;
      case 'kill': {
        const big = ['hive', 'twin', 'core', 'serpent', 'mother'].includes(ev.kind);
        scene.explode(ev.id, ev.x, ev.y, ev.kind, big);
        orbitSfx.explode(ev.x, big ? 2 : O.ENEMIES[ev.kind] ? { S: 0.4, M: 0.7, L: 1.2 }[O.ENEMIES[ev.kind].size] : 0.2);
        break;
      }
      case 'crash': scene.explode(ev.id, ev.x, ev.y, ev.kind); break;
      case 'hurt': flash(true); scene.shake = 0.4; orbitSfx.hurt(); break;
      case 'shieldBreak': orbitSfx.shieldBreak(); shell.toast('방어막이 막아냈습니다', 1400); break;
      case 'emp': scene.shock(); orbitSfx.emp(); flash(false); break;
      case 'empEmpty': orbitSfx.empty(); shell.toast('EMP를 다 썼습니다 — 다음 스테이지에 채워집니다', 1600); break;
      case 'pickup': orbitSfx.pickup(); shell.toast({ spread: '산탄 — 3갈래 레이저', pierce: '관통 — 적을 뚫고 지나감', rapid: '속사 — 초당 10발', shield: '방어막 — 한 번 막아줌' }[ev.kind], 1600); break;
      case 'dashCharge': { const e = st.enemies.find((x) => x.id === ev.id); orbitSfx.charge(e?.x ?? 0); break; }
      case 'lanceLock': orbitSfx.lock(ev.x); break;
      case 'blinkWarn': orbitSfx.blink(ev.x); break;
      case 'bullet': orbitSfx.bullet(ev.x); break;
      case 'stagger': orbitSfx.deflect(0); bigSay('막았다!'); break;
      case 'wave': {
        orbitSfx.wave();
        const intro = ev.intro ? O.ENEMIES[ev.intro] : null;
        banner(`<b>STAGE ${ev.stage} · WAVE ${ev.wave}</b>${intro ? ` — 새 적 <em>${intro.name}</em>` : ''}`);
        break;
      }
      case 'waveClear': banner(`<b>WAVE ${ev.wave} 방어 성공</b>`); break;
      case 'boss': orbitSfx.alarm(); bigSay(ev.name); banner(`<b>경고 — 보스 접근</b> ${ev.name}`); break;
      case 'bossPhase': orbitSfx.phase(); banner(`<b>보스 페이즈 ${ev.phase}</b>`); break;
      case 'bossDown': orbitSfx.bossBoom(); specialFx(); bigSay('격파!'); break;
      case 'stageClear': banner(`<b>STAGE ${ev.stage} 클리어</b> — 선체 1칸 회복`); break;
      case 'victory': victoryFx('승리!'); orbitSfx.win(); end(true); break;
      case 'over': orbitSfx.over(); scene.explode(0, 0, 0, 'spark', true); end(false); break;
      default: break;
    }
  }
}

function banner(html) { $('#banner-text').innerHTML = html; }

function end(won) {
  game.playing = false;
  const st = game.st;
  let best = 0;
  try { best = Number(localStorage.getItem(BEST_KEY) || 0); } catch { /* storage blocked */ }
  const record = st.score > best;
  if (record) try { localStorage.setItem(BEST_KEY, String(st.score)); } catch { /* storage blocked */ }
  setTimeout(() => {
    $('#o-end-over').textContent = won ? 'VICTORY' : 'GAME OVER';
    $('#o-end-title').textContent = won ? '궤도를 지켰습니다' : '선체 파괴';
    $('#o-end-score').textContent = st.score.toLocaleString();
    $('#o-end-stage').textContent = `${st.stage}-${st.wave}`;
    $('#o-end-kills').textContent = st.kills;
    $('#o-end-best').textContent = record ? '최고 기록!' : `최고 기록 ${best.toLocaleString()}`;
    $('#o-end').hidden = false;
  }, won ? 2600 : 1400);
}

// ---------- HUD ----------

function set(id, text) {
  if (game.lastHud[id] === text) return;
  game.lastHud[id] = text;
  $(id).innerHTML = text;
}
function pips(n, max, cls = '') { return Array.from({ length: max }, (_, i) => `<i class="${i < n ? 'on' : ''} ${cls}"></i>`).join(''); }

function hud(force = false) {
  const st = game.st;
  if (!st) return;
  if (force) game.lastHud = {};
  set('#o-stage', `${st.stage}-${Math.max(1, st.wave)}${st.phase === 'boss' ? ' <small>BOSS</small>' : ''}`);
  set('#o-score', st.score.toLocaleString());
  set('#o-combo', st.combo >= 2 ? `×${st.combo}` : '—');
  set('#o-hull', pips(st.ship.hp, O.HULL) + (st.ship.shield ? '<i class="on shield"></i>' : ''));
  set('#o-emp', pips(st.emp, O.EMP_CHARGES));
  set('#o-emp-key', shell.cameraOn() ? '주먹 쥐기' : '우클릭 · Space');
  const p = st.power;
  set('#o-powers', [['spread', '산탄'], ['pierce', '관통'], ['rapid', '속사']].filter(([k]) => p[k] > 0).map(([k, n]) => `<span class="chip ${k}">${n} ${Math.ceil(p[k])}s</span>`).join(''));
  const b = O.bossBar(st);
  $('#o-boss').hidden = !b;
  if (b) {
    set('#o-boss-name', b.name);
    set('#o-boss-over', `BOSS · STAGE ${st.stage}`);
    $('#o-boss-fill').style.width = `${(b.frac * 100).toFixed(1)}%`;
    set('#o-boss-ph', pips(b.phase, b.key === 'core' || b.key === 'mother' ? 3 : 2));
  }
}

const soundBtn = $('#b-sound');
const showSound = () => { soundBtn.textContent = isMuted() ? '소리 꺼짐' : '소리 켜짐'; soundBtn.classList.toggle('off', isMuted()); };
soundBtn.addEventListener('click', () => { unlock(); setMuted(!isMuted()); orbitSfx.mute(isMuted()); showSound(); });
showSound();
banner('<b>궤도 방어</b> — 시작을 누르세요');

// Debug / test handle
window.__orbit = { game, scene, O, hand: shell.injectHandFrame, newGame, handle };
