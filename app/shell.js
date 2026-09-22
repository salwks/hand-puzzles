// Everything a game page shares: camera + hand tracking, the calibration drawer, the
// tracking chip, the on-UI cursor, toasts, the intro screen and mouse/touch input.
// A game plugs in with shell.attach(game), where game implements:
//   modalOpen(), dragging(), startDrag(x,y) -> bool, moveDrag(x,y), endDrag(x,y),
//   cancelDrag(), updateHover(x,y | null), refresh()  (redraw banner etc.)
// and optionally onHandPose(frame) (every tracked frame) and onWheel/onContext for mouse extras.
import { HandTracker, HAND_CONNECTIONS, ACTIVE_REGION } from './hand.js';
import { SessionLog } from './log.js';
import { WilorClient } from './wilor-client.js';

const $ = (sel) => document.querySelector(sel);
const TUNE_KEY = 'solitaire-chess-tune';

export function createShell({ scene, gameId }) {
  const el = {
    stage: $('#stage'), toast: $('#toast'), cursor: $('#cursor'),
    cam: $('#cam'), video: $('#video'), camCanvas: $('#cam-canvas'), camStatus: $('#cam-status'),
    drawer: $('#drawer'), modalStart: $('#modal-start'),
  };
  let game = null;
  let tracker = null;
  let handActive = false; // true while a tracked hand is driving the cursor
  let handDown = false;
  let hoverBtn = null;
  let fps = 0;
  let lastFrameAt = 0;

  const log = new SessionLog();
  log.event('game', { id: gameId });
  log.onStatus = (ok) => {
    $('#log-status').textContent = ok ? `진단 로그 기록 중 · ${log.sent}` : '진단 로그 저장 실패';
  };

  let toastTimer;
  function toast(message, ms = 2600) {
    el.toast.textContent = message;
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.toast.hidden = true; }, ms);
  }

  /** True when nothing (drawer, camera chip, a button) sits between the pointer and the board. */
  const onStage = (x, y) => document.elementFromPoint(x, y) === el.stage;
  const buttonAt = (x, y) => document.elementFromPoint(x, y)?.closest('button:not(:disabled)') ?? null;

  // ---------- mouse / touch ----------

  el.stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || !game.startDrag(e.clientX, e.clientY)) return;
    e.preventDefault();
    el.stage.setPointerCapture(e.pointerId);
  });
  el.stage.addEventListener('pointermove', (e) => {
    game.moveDrag(e.clientX, e.clientY);
    if (e.pointerType === 'mouse') game.updateHover(e.clientX, e.clientY);
  });
  el.stage.addEventListener('pointerleave', () => game.updateHover(null));
  el.stage.addEventListener('pointerup', (e) => { if (e.button === 0) game.endDrag(e.clientX, e.clientY); });
  el.stage.addEventListener('pointercancel', () => game.cancelDrag());

  // ---------- hand input ----------

  /** Tracking state for the camera chip and the drawer: status dot, pinch gauge, handedness. */
  function showTracking(frame) {
    const present = Boolean(frame?.present);
    document.body.classList.toggle('tracking-ok', present);
    document.body.classList.toggle('tracking-lost', Boolean(tracker) && !present);
    document.body.classList.toggle('pinching', present && frame.pinching);
    const wilorOn = tracker?.external?.connected && tracker.external.enabled;
    const label = !tracker ? '카메라 꺼짐' : present ? `추적 안정 · ${Math.round(fps)} FPS${wilorOn ? ` · 3D ${tracker.external.stats.fps.toFixed(1)}/s` : ''}` : '손을 찾는 중';
    $('#engine-state').textContent = !tracker ? '' : wilorOn ? `WiLoR 3D 보정 켜짐 (${tracker.external.stats.ms} ms)` : tracker.external?.enabled ? 'WiLoR 서버 없음 — MediaPipe만' : 'MediaPipe만';
    for (const node of document.querySelectorAll('.track-label')) node.textContent = label;
    $('#pinch-state').textContent = !present ? '' : frame.pinching ? '집은 상태' : '편 상태';
    $('#hand-side').textContent = present ? { left: '왼손', right: '오른손' }[scene.handSide()] ?? '' : '';
    if (!present || frame.pinchRatio === undefined) return;
    const pct = (v) => `${Math.min(1, v / 1.2) * 100}%`;
    for (const gauge of document.querySelectorAll('.gauge')) {
      gauge.querySelector('b').style.width = pct(frame.pinchRatio);
      gauge.querySelector('.down').style.left = pct(frame.pinchDown);
      gauge.querySelector('.up').style.left = pct(frame.pinchUp);
    }
  }

  let lastFrame = null;
  function onHandFrame(frame) {
    lastFrame = frame;
    drawCamera(frame);
    if (handActive !== frame.present) {
      handActive = frame.present;
      game.refresh();
    }
    showTracking(frame);
    if (!frame.present) {
      scene.setHand(null);
      game.updateHover(null);
      el.cursor.hidden = true;
      hoverBtn?.classList.remove('hand-hover');
      hoverBtn = null;
      if (handDown) { log.event('lost-while-holding', { drag: game.dragging() }); game.cancelDrag(); }
      handDown = false;
      return;
    }

    const x = frame.x * window.innerWidth;
    const y = frame.y * window.innerHeight;
    const btn = game.dragging() ? null : buttonAt(x, y);
    // Over the board the 3D hand is the cursor; the flat ring only appears over UI.
    const overUi = game.modalOpen() || btn !== null;
    scene.setHand(game.modalOpen() ? null : frame, x, y, el.video.videoWidth / el.video.videoHeight || 4 / 3);
    el.cursor.hidden = !overUi;
    el.cursor.style.transform = `translate(${x}px, ${y}px)`;
    el.cursor.classList.toggle('pinch', frame.pinching);
    if (btn !== hoverBtn) {
      hoverBtn?.classList.remove('hand-hover');
      btn?.classList.add('hand-hover');
      hoverBtn = btn;
    }

    game.updateHover(x, y);
    game.onHandPose?.(frame);

    if (frame.pinching && !handDown) {
      handDown = true;
      if (!game.startDrag(x, y, frame)) {
        log.event('pinch-miss', { x: Math.round(x), y: Math.round(y), button: btn?.id ?? null });
        btn?.click();
      }
    } else if (frame.pinching) {
      game.moveDrag(x, y);
    } else if (handDown) {
      handDown = false;
      game.endDrag(x, y);
    }
  }

  const camCtx = el.camCanvas.getContext('2d');
  function drawCamera(frame) {
    const { width: w, height: h } = el.camCanvas;
    camCtx.save();
    camCtx.translate(w, 0);
    camCtx.scale(-1, 1); // mirror, so moving right moves the cursor right
    camCtx.drawImage(el.video, 0, 0, w, h);

    const { x0, x1, y0, y1 } = ACTIVE_REGION;
    camCtx.strokeStyle = 'rgba(255,255,255,0.35)';
    camCtx.setLineDash([6, 6]);
    camCtx.lineWidth = 1.5;
    // The region is defined in mirrored space; (1 - x1) maps it back into this flipped context.
    camCtx.strokeRect((1 - x1) * w, y0 * h, (x1 - x0) * w, (y1 - y0) * h);
    camCtx.setLineDash([]);

    if (frame.present) {
      const lm = frame.landmarks;
      camCtx.strokeStyle = frame.pinching ? '#4a7fd6' : '#ede6d8';
      camCtx.lineWidth = 2;
      camCtx.beginPath();
      for (const [a, b] of HAND_CONNECTIONS) {
        camCtx.moveTo(lm[a].x * w, lm[a].y * h);
        camCtx.lineTo(lm[b].x * w, lm[b].y * h);
      }
      camCtx.stroke();
      camCtx.fillStyle = '#b89b5e';
      for (const i of [4, 8]) {
        camCtx.beginPath();
        camCtx.arc(lm[i].x * w, lm[i].y * h, 5, 0, Math.PI * 2);
        camCtx.fill();
      }
    }
    camCtx.restore();
  }

  // ---------- calibration, remembered between sessions and shared by all games ----------

  const tune = { smoothing: 0.6, sensitivity: 1, wilor: true };
  try { Object.assign(tune, JSON.parse(localStorage.getItem(TUNE_KEY) || '{}')); } catch { /* keep defaults */ }
  function applyTune() {
    if (tracker) {
      Object.assign(tracker, { smoothing: tune.smoothing, sensitivity: tune.sensitivity });
      if (tracker.external) tracker.external.enabled = tune.wilor !== false;
    }
    try { localStorage.setItem(TUNE_KEY, JSON.stringify(tune)); } catch { /* storage unavailable */ }
  }
  for (const [sel, key] of [['#tune-smooth', 'smoothing'], ['#tune-pinch', 'sensitivity']]) {
    const input = $(sel);
    const show = () => {
      $(`${sel}-value`).textContent = Number(input.value).toFixed(2);
      input.style.setProperty('--fill', `${((input.value - input.min) / (input.max - input.min)) * 100}%`);
    };
    input.value = tune[key];
    show();
    input.addEventListener('input', () => { tune[key] = Number(input.value); applyTune(); show(); });
    input.addEventListener('change', () => log.event('tune', tune));
  }

  const wilorToggle = $('#tune-wilor');
  wilorToggle.checked = tune.wilor !== false;
  wilorToggle.addEventListener('change', () => { tune.wilor = wilorToggle.checked; applyTune(); showTracking(lastFrame); log.event('tune', tune); });

  // ---------- camera ----------

  function setCameraButtons(on, busy = false) {
    $('#btn-cam').textContent = on ? '카메라 끄기' : '카메라 켜기';
    for (const id of ['#btn-cam', '#btn-cam-on']) $(id).disabled = busy;
    el.cam.classList.toggle('off', !on && !busy);
  }

  async function toggleCamera() {
    if (tracker) {
      tracker.external?.stop();
      tracker.stop();
      tracker = null;
      setCameraButtons(false);
      showTracking(null);
      game.refresh();
      return;
    }
    setCameraButtons(false, true);
    const next = new HandTracker(el.video, onHandFrame);
    try {
      await next.start((status) => { el.camStatus.textContent = status; });
      tracker = next;
      tracker.external = new WilorClient(el.video);
      tracker.external.enabled = tune.wilor !== false;
      tracker.external.onStatus = () => { showTracking(lastFrame); log.event('wilor', { connected: tracker.external.connected }); };
      tracker.onDebug = (rec) => {
        if (lastFrameAt) fps += (1000 / Math.max(1, rec.t - lastFrameAt) - fps) * 0.1;
        lastFrameAt = rec.t;
        log.frame(rec);
      };
      applyTune();
      log.event('camera', { ...tune, video: [el.video.videoWidth, el.video.videoHeight] });
      setCameraButtons(true);
      showTracking(null);
      game.refresh();
    } catch (err) {
      console.error(err);
      next.stop();
      el.camStatus.textContent = '';
      setCameraButtons(false);
      const denied = err?.name === 'NotAllowedError' || err?.name === 'NotFoundError';
      toast(denied ? '카메라를 사용할 수 없습니다. 마우스로 플레이하세요.' : '손 인식 모델을 불러오지 못했습니다. 마우스로 플레이하세요.', 4000);
    }
  }

  // The calibration drawer borrows the camera chip's preview canvas while it is open.
  function setDrawer(open) {
    el.drawer.hidden = !open;
    document.body.classList.toggle('drawer-open', open);
    $(open ? '#drawer-slot' : '#cam-slot').prepend(el.camCanvas);
  }

  // Start screen: the board waits on the right, then glides to the centre when play begins.
  const introShift = () => (window.innerWidth > 900 ? 0.2 : 0);
  function closeIntro() {
    el.modalStart.hidden = true;
    document.body.classList.remove('intro');
    scene.setShift(0);
  }
  document.body.classList.add('intro');
  scene.setShift(introShift(), true);
  window.addEventListener('resize', () => { if (!el.modalStart.hidden) scene.setShift(introShift(), true); });

  $('#btn-cam').addEventListener('click', toggleCamera);
  $('#btn-cam-on').addEventListener('click', toggleCamera);
  $('#btn-tune').addEventListener('click', () => setDrawer(true));
  $('#btn-drawer-close').addEventListener('click', () => setDrawer(false));
  $('#btn-start-cam').addEventListener('click', () => { closeIntro(); toggleCamera(); });
  $('#btn-start-mouse').addEventListener('click', closeIntro);

  return {
    log, toast, onStage,
    attach(g) { game = g; },
    introOpen: () => !el.modalStart.hidden,
    handActive: () => handActive,
    cameraOn: () => Boolean(tracker),
    /** Test hook: feed a synthetic tracker frame. */
    injectHandFrame: onHandFrame,
  };
}
