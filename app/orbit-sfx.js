// 궤도 방어 sound: synthesised in Web Audio (lasers, explosions and alarms are electronic sounds
// anyway), sharing the site's mute switch. The jingles (start, win, game over) come from the
// recorded banks in sound.js.
import { isMuted } from './sound.js';

let ctx = null, out = null, noise = null;
let lastLaser = 0;

export function unlockOrbitSound() {
  if (ctx) { ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16; comp.ratio.value = 4;
  out = ctx.createGain();
  out.gain.value = 0.7;
  out.connect(comp).connect(ctx.destination);
  // one second of white noise, reused for every burst
  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}

const ok = () => ctx && !isMuted();

function env(g, t, a, peak, dcy) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + dcy);
}
function panner(pan) {
  const p = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
  if (p.pan) p.pan.value = Math.max(-1, Math.min(1, pan));
  p.connect(out);
  return p;
}
function tone({ type = 'sine', f0, f1 = f0, dur, vol = 0.2, pan = 0, delay = 0, attack = 0.004 }) {
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  env(g, t, attack, vol, dur);
  o.connect(g).connect(panner(pan));
  o.start(t); o.stop(t + attack + dur + 0.05);
}
function hiss({ dur, vol = 0.3, from = 4000, to = 200, q = 0.8, pan = 0, delay = 0, type = 'lowpass', attack = 0.004 }) {
  const t = ctx.currentTime + delay;
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = noise; s.loop = true;
  f.type = type; f.Q.value = q;
  f.frequency.setValueAtTime(from, t);
  f.frequency.exponentialRampToValueAtTime(Math.max(30, to), t + dur);
  env(g, t, attack, vol, dur);
  s.connect(f).connect(g).connect(panner(pan));
  s.start(t, Math.random() * 0.5); s.stop(t + attack + dur + 0.05);
}

/** Pan for a logic x position (the arena spans about ±12). */
export const panOf = (x) => Math.max(-0.8, Math.min(0.8, x / 14));

export const orbitSfx = {
  laser(rapid = false) {
    if (!ok()) return;
    const now = ctx.currentTime;
    if (now - lastLaser < 0.05) return;
    lastLaser = now;
    tone({ type: 'square', f0: rapid ? 2100 : 1700, f1: rapid ? 700 : 520, dur: 0.07, vol: 0.035 });
    tone({ type: 'sine', f0: 3200, f1: 1200, dur: 0.04, vol: 0.02 });
  },
  hit(x = 0) { if (!ok()) return; tone({ type: 'triangle', f0: 900, f1: 380, dur: 0.05, vol: 0.06, pan: panOf(x) }); },
  deflect(x = 0) { if (!ok()) return; tone({ type: 'sine', f0: 2600, f1: 2400, dur: 0.12, vol: 0.05, pan: panOf(x) }); tone({ type: 'sine', f0: 3900, f1: 3700, dur: 0.08, vol: 0.03, pan: panOf(x) }); },
  explode(x = 0, size = 0.6) {
    if (!ok()) return;
    const big = size >= 1;
    hiss({ dur: 0.25 + size * 0.5, vol: 0.22 + size * 0.15, from: big ? 2400 : 3600, to: 90, pan: panOf(x) });
    tone({ type: 'sine', f0: big ? 140 : 220, f1: 40, dur: 0.2 + size * 0.35, vol: 0.18 + size * 0.1, pan: panOf(x) });
  },
  bossBoom() {
    if (!ok()) return;
    for (let i = 0; i < 5; i++) hiss({ dur: 0.9, vol: 0.35, from: 2000, to: 60, delay: i * 0.18, pan: (Math.random() - 0.5) * 1.2 });
    tone({ type: 'sine', f0: 90, f1: 30, dur: 1.8, vol: 0.4 });
  },
  hurt() {
    if (!ok()) return;
    hiss({ dur: 0.4, vol: 0.45, from: 1200, to: 80 });
    tone({ type: 'sawtooth', f0: 160, f1: 50, dur: 0.35, vol: 0.2 });
  },
  shieldBreak() { if (!ok()) return; tone({ type: 'triangle', f0: 1200, f1: 200, dur: 0.35, vol: 0.15 }); hiss({ dur: 0.3, vol: 0.2, from: 6000, to: 800, type: 'highpass' }); },
  emp() {
    if (!ok()) return;
    tone({ type: 'sine', f0: 60, f1: 30, dur: 1.2, vol: 0.45 });
    hiss({ dur: 1.0, vol: 0.35, from: 300, to: 6000, q: 2, type: 'bandpass', attack: 0.05 });
    tone({ type: 'sawtooth', f0: 200, f1: 1600, dur: 0.5, vol: 0.08, delay: 0.02 });
  },
  empty() { if (!ok()) return; tone({ type: 'square', f0: 220, f1: 200, dur: 0.12, vol: 0.05 }); },
  pickup() { if (!ok()) return; [880, 1320, 1760].forEach((f, i) => tone({ type: 'triangle', f0: f, dur: 0.12, vol: 0.08, delay: i * 0.06 })); },
  charge(x = 0) { if (!ok()) return; tone({ type: 'sawtooth', f0: 180, f1: 900, dur: 0.55, vol: 0.05, pan: panOf(x), attack: 0.2 }); },
  lock(x = 0) { if (!ok()) return; [0, 0.12, 0.24].forEach((d) => tone({ type: 'square', f0: 1500, dur: 0.05, vol: 0.04, delay: d, pan: panOf(x) })); },
  blink(x = 0) { if (!ok()) return; tone({ type: 'sine', f0: 400, f1: 2400, dur: 0.18, vol: 0.06, pan: panOf(x) }); },
  bullet(x = 0) { if (!ok()) return; tone({ type: 'square', f0: 520, f1: 260, dur: 0.1, vol: 0.03, pan: panOf(x) }); },
  wave() { if (!ok()) return; [523, 659, 784].forEach((f, i) => tone({ type: 'triangle', f0: f, dur: 0.25, vol: 0.07, delay: i * 0.09 })); },
  alarm() {
    if (!ok()) return;
    for (let i = 0; i < 3; i++) { tone({ type: 'sawtooth', f0: 440, f1: 660, dur: 0.35, vol: 0.08, delay: i * 0.5 }); tone({ type: 'sawtooth', f0: 660, f1: 440, dur: 0.12, vol: 0.06, delay: i * 0.5 + 0.35 }); }
  },
  phase() { if (!ok()) return; tone({ type: 'sawtooth', f0: 110, f1: 55, dur: 0.8, vol: 0.2 }); hiss({ dur: 0.6, vol: 0.2, from: 800, to: 100 }); },
};
