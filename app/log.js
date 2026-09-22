// Session recorder for tuning the hand tracking. Buffers per-frame numbers and
// game events, and posts them to the dev server (serve.py → logs/<session>.jsonl).
// Only numbers are recorded — never camera images.

const FLUSH_MS = 2000;

export class SessionLog {
  constructor() {
    this.session = new Date().toISOString().replace(/[:.]/g, '-');
    this.lines = [];
    this.sent = 0;
    this.onStatus = null; // (ok: boolean) after each upload
    this.enabled = ['localhost', '127.0.0.1'].includes(location.hostname);
    if (!this.enabled) return;
    setInterval(() => this.flush(), FLUSH_MS);
    window.addEventListener('pagehide', () => this.flush(true));
    this.event('session', {
      ua: navigator.userAgent, w: innerWidth, h: innerHeight, dpr: devicePixelRatio,
    });
  }

  /** Per-frame tracker record (already compact). */
  frame(rec) {
    if (this.enabled) this.lines.push(JSON.stringify(rec));
  }

  event(name, data = {}) {
    if (this.enabled) this.lines.push(JSON.stringify({ ev: name, t: Math.round(performance.now()), ...data }));
  }

  flush(closing = false) {
    if (!this.lines.length) return;
    const body = this.lines.join('\n') + '\n';
    this.lines = [];
    const url = `/log?session=${this.session}`;
    if (closing && navigator.sendBeacon) navigator.sendBeacon(url, body);
    else {
      fetch(url, { method: 'POST', body, keepalive: true })
        .then((res) => { this.sent += res.ok ? 1 : 0; this.onStatus?.(res.ok); })
        .catch(() => { this.enabled = false; this.onStatus?.(false); });
    }
  }
}
