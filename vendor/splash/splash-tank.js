var on = Object.defineProperty;
var cn = (f, v, z) => v in f ? on(f, v, { enumerable: !0, configurable: !0, writable: !0, value: z }) : f[v] = z;
var M = (f, v, z) => cn(f, typeof v != "symbol" ? v + "" : v, z);
function an(f, v) {
  return class extends f {
    constructor(...z) {
      super(...z), v(this);
    }
  };
}
const un = an(Array, (f) => f.fill(0));
let Y = 1e-6;
function ln(f) {
  function v(e = 0, o = 0) {
    const n = new f(2);
    return e !== void 0 && (n[0] = e, o !== void 0 && (n[1] = o)), n;
  }
  const z = v;
  function _(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = e, i[1] = o, i;
  }
  function I(e, o) {
    const n = o ?? new f(2);
    return n[0] = Math.ceil(e[0]), n[1] = Math.ceil(e[1]), n;
  }
  function b(e, o) {
    const n = o ?? new f(2);
    return n[0] = Math.floor(e[0]), n[1] = Math.floor(e[1]), n;
  }
  function F(e, o) {
    const n = o ?? new f(2);
    return n[0] = Math.round(e[0]), n[1] = Math.round(e[1]), n;
  }
  function k(e, o = 0, n = 1, i) {
    const a = i ?? new f(2);
    return a[0] = Math.min(n, Math.max(o, e[0])), a[1] = Math.min(n, Math.max(o, e[1])), a;
  }
  function T(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = e[0] + o[0], i[1] = e[1] + o[1], i;
  }
  function B(e, o, n, i) {
    const a = i ?? new f(2);
    return a[0] = e[0] + o[0] * n, a[1] = e[1] + o[1] * n, a;
  }
  function Z(e, o) {
    const n = e[0], i = e[1], a = o[0], g = o[1], y = Math.sqrt(n * n + i * i), c = Math.sqrt(a * a + g * g), u = y * c, h = u && C(e, o) / u;
    return Math.acos(h);
  }
  function N(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = e[0] - o[0], i[1] = e[1] - o[1], i;
  }
  const ne = N;
  function te(e, o) {
    return Math.abs(e[0] - o[0]) < Y && Math.abs(e[1] - o[1]) < Y;
  }
  function fe(e, o) {
    return e[0] === o[0] && e[1] === o[1];
  }
  function ae(e, o, n, i) {
    const a = i ?? new f(2);
    return a[0] = e[0] + n * (o[0] - e[0]), a[1] = e[1] + n * (o[1] - e[1]), a;
  }
  function ue(e, o, n, i) {
    const a = i ?? new f(2);
    return a[0] = e[0] + n[0] * (o[0] - e[0]), a[1] = e[1] + n[1] * (o[1] - e[1]), a;
  }
  function ie(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = Math.max(e[0], o[0]), i[1] = Math.max(e[1], o[1]), i;
  }
  function $(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = Math.min(e[0], o[0]), i[1] = Math.min(e[1], o[1]), i;
  }
  function H(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = e[0] * o, i[1] = e[1] * o, i;
  }
  const L = H;
  function re(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = e[0] / o, i[1] = e[1] / o, i;
  }
  function K(e, o) {
    const n = o ?? new f(2);
    return n[0] = 1 / e[0], n[1] = 1 / e[1], n;
  }
  const Q = K;
  function j(e, o, n) {
    const i = n ?? new f(3), a = e[0] * o[1] - e[1] * o[0];
    return i[0] = 0, i[1] = 0, i[2] = a, i;
  }
  function C(e, o) {
    return e[0] * o[0] + e[1] * o[1];
  }
  function ee(e) {
    const o = e[0], n = e[1];
    return Math.sqrt(o * o + n * n);
  }
  const xe = ee;
  function A(e) {
    const o = e[0], n = e[1];
    return o * o + n * n;
  }
  const W = A;
  function X(e, o) {
    const n = e[0] - o[0], i = e[1] - o[1];
    return Math.sqrt(n * n + i * i);
  }
  const Be = X;
  function q(e, o) {
    const n = e[0] - o[0], i = e[1] - o[1];
    return n * n + i * i;
  }
  const me = q;
  function de(e, o) {
    const n = o ?? new f(2), i = e[0], a = e[1], g = Math.sqrt(i * i + a * a);
    return g > 1e-5 ? (n[0] = i / g, n[1] = a / g) : (n[0] = 0, n[1] = 0), n;
  }
  function Te(e, o) {
    const n = o ?? new f(2);
    return n[0] = -e[0], n[1] = -e[1], n;
  }
  function J(e, o) {
    const n = o ?? new f(2);
    return n[0] = e[0], n[1] = e[1], n;
  }
  const pe = J;
  function le(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = e[0] * o[0], i[1] = e[1] * o[1], i;
  }
  const ve = le;
  function O(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = e[0] / o[0], i[1] = e[1] / o[1], i;
  }
  const se = O;
  function oe(e = 1, o) {
    const n = o ?? new f(2), i = Math.random() * 2 * Math.PI;
    return n[0] = Math.cos(i) * e, n[1] = Math.sin(i) * e, n;
  }
  function r(e) {
    const o = e ?? new f(2);
    return o[0] = 0, o[1] = 0, o;
  }
  function d(e, o, n) {
    const i = n ?? new f(2), a = e[0], g = e[1];
    return i[0] = a * o[0] + g * o[4] + o[12], i[1] = a * o[1] + g * o[5] + o[13], i;
  }
  function t(e, o, n) {
    const i = n ?? new f(2), a = e[0], g = e[1];
    return i[0] = o[0] * a + o[4] * g + o[8], i[1] = o[1] * a + o[5] * g + o[9], i;
  }
  function s(e, o, n, i) {
    const a = i ?? new f(2), g = e[0] - o[0], y = e[1] - o[1], c = Math.sin(n), u = Math.cos(n);
    return a[0] = g * u - y * c + o[0], a[1] = g * c + y * u + o[1], a;
  }
  function l(e, o, n) {
    const i = n ?? new f(2);
    return de(e, i), H(i, o, i);
  }
  function p(e, o, n) {
    const i = n ?? new f(2);
    return ee(e) > o ? l(e, o, i) : J(e, i);
  }
  function m(e, o, n) {
    const i = n ?? new f(2);
    return ae(e, o, 0.5, i);
  }
  return {
    create: v,
    fromValues: z,
    set: _,
    ceil: I,
    floor: b,
    round: F,
    clamp: k,
    add: T,
    addScaled: B,
    angle: Z,
    subtract: N,
    sub: ne,
    equalsApproximately: te,
    equals: fe,
    lerp: ae,
    lerpV: ue,
    max: ie,
    min: $,
    mulScalar: H,
    scale: L,
    divScalar: re,
    inverse: K,
    invert: Q,
    cross: j,
    dot: C,
    length: ee,
    len: xe,
    lengthSq: A,
    lenSq: W,
    distance: X,
    dist: Be,
    distanceSq: q,
    distSq: me,
    normalize: de,
    negate: Te,
    copy: J,
    clone: pe,
    multiply: le,
    mul: ve,
    divide: O,
    div: se,
    random: oe,
    zero: r,
    transformMat4: d,
    transformMat3: t,
    rotate: s,
    setLength: l,
    truncate: p,
    midpoint: m
  };
}
const Je = /* @__PURE__ */ new Map();
function sn(f) {
  let v = Je.get(f);
  return v || (v = ln(f), Je.set(f, v)), v;
}
function fn(f) {
  function v(c, u, h) {
    const x = new f(3);
    return c !== void 0 && (x[0] = c, u !== void 0 && (x[1] = u, h !== void 0 && (x[2] = h))), x;
  }
  const z = v;
  function _(c, u, h, x) {
    const w = x ?? new f(3);
    return w[0] = c, w[1] = u, w[2] = h, w;
  }
  function I(c, u) {
    const h = u ?? new f(3);
    return h[0] = Math.ceil(c[0]), h[1] = Math.ceil(c[1]), h[2] = Math.ceil(c[2]), h;
  }
  function b(c, u) {
    const h = u ?? new f(3);
    return h[0] = Math.floor(c[0]), h[1] = Math.floor(c[1]), h[2] = Math.floor(c[2]), h;
  }
  function F(c, u) {
    const h = u ?? new f(3);
    return h[0] = Math.round(c[0]), h[1] = Math.round(c[1]), h[2] = Math.round(c[2]), h;
  }
  function k(c, u = 0, h = 1, x) {
    const w = x ?? new f(3);
    return w[0] = Math.min(h, Math.max(u, c[0])), w[1] = Math.min(h, Math.max(u, c[1])), w[2] = Math.min(h, Math.max(u, c[2])), w;
  }
  function T(c, u, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] + u[0], x[1] = c[1] + u[1], x[2] = c[2] + u[2], x;
  }
  function B(c, u, h, x) {
    const w = x ?? new f(3);
    return w[0] = c[0] + u[0] * h, w[1] = c[1] + u[1] * h, w[2] = c[2] + u[2] * h, w;
  }
  function Z(c, u) {
    const h = c[0], x = c[1], w = c[2], P = u[0], D = u[1], S = u[2], U = Math.sqrt(h * h + x * x + w * w), G = Math.sqrt(P * P + D * D + S * S), V = U * G, R = V && C(c, u) / V;
    return Math.acos(R);
  }
  function N(c, u, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] - u[0], x[1] = c[1] - u[1], x[2] = c[2] - u[2], x;
  }
  const ne = N;
  function te(c, u) {
    return Math.abs(c[0] - u[0]) < Y && Math.abs(c[1] - u[1]) < Y && Math.abs(c[2] - u[2]) < Y;
  }
  function fe(c, u) {
    return c[0] === u[0] && c[1] === u[1] && c[2] === u[2];
  }
  function ae(c, u, h, x) {
    const w = x ?? new f(3);
    return w[0] = c[0] + h * (u[0] - c[0]), w[1] = c[1] + h * (u[1] - c[1]), w[2] = c[2] + h * (u[2] - c[2]), w;
  }
  function ue(c, u, h, x) {
    const w = x ?? new f(3);
    return w[0] = c[0] + h[0] * (u[0] - c[0]), w[1] = c[1] + h[1] * (u[1] - c[1]), w[2] = c[2] + h[2] * (u[2] - c[2]), w;
  }
  function ie(c, u, h) {
    const x = h ?? new f(3);
    return x[0] = Math.max(c[0], u[0]), x[1] = Math.max(c[1], u[1]), x[2] = Math.max(c[2], u[2]), x;
  }
  function $(c, u, h) {
    const x = h ?? new f(3);
    return x[0] = Math.min(c[0], u[0]), x[1] = Math.min(c[1], u[1]), x[2] = Math.min(c[2], u[2]), x;
  }
  function H(c, u, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] * u, x[1] = c[1] * u, x[2] = c[2] * u, x;
  }
  const L = H;
  function re(c, u, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] / u, x[1] = c[1] / u, x[2] = c[2] / u, x;
  }
  function K(c, u) {
    const h = u ?? new f(3);
    return h[0] = 1 / c[0], h[1] = 1 / c[1], h[2] = 1 / c[2], h;
  }
  const Q = K;
  function j(c, u, h) {
    const x = h ?? new f(3), w = c[2] * u[0] - c[0] * u[2], P = c[0] * u[1] - c[1] * u[0];
    return x[0] = c[1] * u[2] - c[2] * u[1], x[1] = w, x[2] = P, x;
  }
  function C(c, u) {
    return c[0] * u[0] + c[1] * u[1] + c[2] * u[2];
  }
  function ee(c) {
    const u = c[0], h = c[1], x = c[2];
    return Math.sqrt(u * u + h * h + x * x);
  }
  const xe = ee;
  function A(c) {
    const u = c[0], h = c[1], x = c[2];
    return u * u + h * h + x * x;
  }
  const W = A;
  function X(c, u) {
    const h = c[0] - u[0], x = c[1] - u[1], w = c[2] - u[2];
    return Math.sqrt(h * h + x * x + w * w);
  }
  const Be = X;
  function q(c, u) {
    const h = c[0] - u[0], x = c[1] - u[1], w = c[2] - u[2];
    return h * h + x * x + w * w;
  }
  const me = q;
  function de(c, u) {
    const h = u ?? new f(3), x = c[0], w = c[1], P = c[2], D = Math.sqrt(x * x + w * w + P * P);
    return D > 1e-5 ? (h[0] = x / D, h[1] = w / D, h[2] = P / D) : (h[0] = 0, h[1] = 0, h[2] = 0), h;
  }
  function Te(c, u) {
    const h = u ?? new f(3);
    return h[0] = -c[0], h[1] = -c[1], h[2] = -c[2], h;
  }
  function J(c, u) {
    const h = u ?? new f(3);
    return h[0] = c[0], h[1] = c[1], h[2] = c[2], h;
  }
  const pe = J;
  function le(c, u, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] * u[0], x[1] = c[1] * u[1], x[2] = c[2] * u[2], x;
  }
  const ve = le;
  function O(c, u, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] / u[0], x[1] = c[1] / u[1], x[2] = c[2] / u[2], x;
  }
  const se = O;
  function oe(c = 1, u) {
    const h = u ?? new f(3), x = Math.random() * 2 * Math.PI, w = Math.random() * 2 - 1, P = Math.sqrt(1 - w * w) * c;
    return h[0] = Math.cos(x) * P, h[1] = Math.sin(x) * P, h[2] = w * c, h;
  }
  function r(c) {
    const u = c ?? new f(3);
    return u[0] = 0, u[1] = 0, u[2] = 0, u;
  }
  function d(c, u, h) {
    const x = h ?? new f(3), w = c[0], P = c[1], D = c[2], S = u[3] * w + u[7] * P + u[11] * D + u[15] || 1;
    return x[0] = (u[0] * w + u[4] * P + u[8] * D + u[12]) / S, x[1] = (u[1] * w + u[5] * P + u[9] * D + u[13]) / S, x[2] = (u[2] * w + u[6] * P + u[10] * D + u[14]) / S, x;
  }
  function t(c, u, h) {
    const x = h ?? new f(3), w = c[0], P = c[1], D = c[2];
    return x[0] = w * u[0 * 4 + 0] + P * u[1 * 4 + 0] + D * u[2 * 4 + 0], x[1] = w * u[0 * 4 + 1] + P * u[1 * 4 + 1] + D * u[2 * 4 + 1], x[2] = w * u[0 * 4 + 2] + P * u[1 * 4 + 2] + D * u[2 * 4 + 2], x;
  }
  function s(c, u, h) {
    const x = h ?? new f(3), w = c[0], P = c[1], D = c[2];
    return x[0] = w * u[0] + P * u[4] + D * u[8], x[1] = w * u[1] + P * u[5] + D * u[9], x[2] = w * u[2] + P * u[6] + D * u[10], x;
  }
  function l(c, u, h) {
    const x = h ?? new f(3), w = u[0], P = u[1], D = u[2], S = u[3] * 2, U = c[0], G = c[1], V = c[2], R = P * V - D * G, E = D * U - w * V, ce = w * G - P * U;
    return x[0] = U + R * S + (P * ce - D * E) * 2, x[1] = G + E * S + (D * R - w * ce) * 2, x[2] = V + ce * S + (w * E - P * R) * 2, x;
  }
  function p(c, u) {
    const h = u ?? new f(3);
    return h[0] = c[12], h[1] = c[13], h[2] = c[14], h;
  }
  function m(c, u, h) {
    const x = h ?? new f(3), w = u * 4;
    return x[0] = c[w + 0], x[1] = c[w + 1], x[2] = c[w + 2], x;
  }
  function e(c, u) {
    const h = u ?? new f(3), x = c[0], w = c[1], P = c[2], D = c[4], S = c[5], U = c[6], G = c[8], V = c[9], R = c[10];
    return h[0] = Math.sqrt(x * x + w * w + P * P), h[1] = Math.sqrt(D * D + S * S + U * U), h[2] = Math.sqrt(G * G + V * V + R * R), h;
  }
  function o(c, u, h, x) {
    const w = x ?? new f(3), P = [], D = [];
    return P[0] = c[0] - u[0], P[1] = c[1] - u[1], P[2] = c[2] - u[2], D[0] = P[0], D[1] = P[1] * Math.cos(h) - P[2] * Math.sin(h), D[2] = P[1] * Math.sin(h) + P[2] * Math.cos(h), w[0] = D[0] + u[0], w[1] = D[1] + u[1], w[2] = D[2] + u[2], w;
  }
  function n(c, u, h, x) {
    const w = x ?? new f(3), P = [], D = [];
    return P[0] = c[0] - u[0], P[1] = c[1] - u[1], P[2] = c[2] - u[2], D[0] = P[2] * Math.sin(h) + P[0] * Math.cos(h), D[1] = P[1], D[2] = P[2] * Math.cos(h) - P[0] * Math.sin(h), w[0] = D[0] + u[0], w[1] = D[1] + u[1], w[2] = D[2] + u[2], w;
  }
  function i(c, u, h, x) {
    const w = x ?? new f(3), P = [], D = [];
    return P[0] = c[0] - u[0], P[1] = c[1] - u[1], P[2] = c[2] - u[2], D[0] = P[0] * Math.cos(h) - P[1] * Math.sin(h), D[1] = P[0] * Math.sin(h) + P[1] * Math.cos(h), D[2] = P[2], w[0] = D[0] + u[0], w[1] = D[1] + u[1], w[2] = D[2] + u[2], w;
  }
  function a(c, u, h) {
    const x = h ?? new f(3);
    return de(c, x), H(x, u, x);
  }
  function g(c, u, h) {
    const x = h ?? new f(3);
    return ee(c) > u ? a(c, u, x) : J(c, x);
  }
  function y(c, u, h) {
    const x = h ?? new f(3);
    return ae(c, u, 0.5, x);
  }
  return {
    create: v,
    fromValues: z,
    set: _,
    ceil: I,
    floor: b,
    round: F,
    clamp: k,
    add: T,
    addScaled: B,
    angle: Z,
    subtract: N,
    sub: ne,
    equalsApproximately: te,
    equals: fe,
    lerp: ae,
    lerpV: ue,
    max: ie,
    min: $,
    mulScalar: H,
    scale: L,
    divScalar: re,
    inverse: K,
    invert: Q,
    cross: j,
    dot: C,
    length: ee,
    len: xe,
    lengthSq: A,
    lenSq: W,
    distance: X,
    dist: Be,
    distanceSq: q,
    distSq: me,
    normalize: de,
    negate: Te,
    copy: J,
    clone: pe,
    multiply: le,
    mul: ve,
    divide: O,
    div: se,
    random: oe,
    zero: r,
    transformMat4: d,
    transformMat4Upper3x3: t,
    transformMat3: s,
    transformQuat: l,
    getTranslation: p,
    getAxis: m,
    getScaling: e,
    rotateX: o,
    rotateY: n,
    rotateZ: i,
    setLength: a,
    truncate: g,
    midpoint: y
  };
}
const Ke = /* @__PURE__ */ new Map();
function Ne(f) {
  let v = Ke.get(f);
  return v || (v = fn(f), Ke.set(f, v)), v;
}
function dn(f) {
  const v = sn(f), z = Ne(f);
  function _(r, d, t, s, l, p, m, e, o) {
    const n = new f(12);
    return n[3] = 0, n[7] = 0, n[11] = 0, r !== void 0 && (n[0] = r, d !== void 0 && (n[1] = d, t !== void 0 && (n[2] = t, s !== void 0 && (n[4] = s, l !== void 0 && (n[5] = l, p !== void 0 && (n[6] = p, m !== void 0 && (n[8] = m, e !== void 0 && (n[9] = e, o !== void 0 && (n[10] = o))))))))), n;
  }
  function I(r, d, t, s, l, p, m, e, o, n) {
    const i = n ?? new f(12);
    return i[0] = r, i[1] = d, i[2] = t, i[3] = 0, i[4] = s, i[5] = l, i[6] = p, i[7] = 0, i[8] = m, i[9] = e, i[10] = o, i[11] = 0, i;
  }
  function b(r, d) {
    const t = d ?? new f(12);
    return t[0] = r[0], t[1] = r[1], t[2] = r[2], t[3] = 0, t[4] = r[4], t[5] = r[5], t[6] = r[6], t[7] = 0, t[8] = r[8], t[9] = r[9], t[10] = r[10], t[11] = 0, t;
  }
  function F(r, d) {
    const t = d ?? new f(12), s = r[0], l = r[1], p = r[2], m = r[3], e = s + s, o = l + l, n = p + p, i = s * e, a = l * e, g = l * o, y = p * e, c = p * o, u = p * n, h = m * e, x = m * o, w = m * n;
    return t[0] = 1 - g - u, t[1] = a + w, t[2] = y - x, t[3] = 0, t[4] = a - w, t[5] = 1 - i - u, t[6] = c + h, t[7] = 0, t[8] = y + x, t[9] = c - h, t[10] = 1 - i - g, t[11] = 0, t;
  }
  function k(r, d) {
    const t = d ?? new f(12);
    return t[0] = -r[0], t[1] = -r[1], t[2] = -r[2], t[4] = -r[4], t[5] = -r[5], t[6] = -r[6], t[8] = -r[8], t[9] = -r[9], t[10] = -r[10], t;
  }
  function T(r, d) {
    const t = d ?? new f(12);
    return t[0] = r[0], t[1] = r[1], t[2] = r[2], t[4] = r[4], t[5] = r[5], t[6] = r[6], t[8] = r[8], t[9] = r[9], t[10] = r[10], t;
  }
  const B = T;
  function Z(r, d) {
    return Math.abs(r[0] - d[0]) < Y && Math.abs(r[1] - d[1]) < Y && Math.abs(r[2] - d[2]) < Y && Math.abs(r[4] - d[4]) < Y && Math.abs(r[5] - d[5]) < Y && Math.abs(r[6] - d[6]) < Y && Math.abs(r[8] - d[8]) < Y && Math.abs(r[9] - d[9]) < Y && Math.abs(r[10] - d[10]) < Y;
  }
  function N(r, d) {
    return r[0] === d[0] && r[1] === d[1] && r[2] === d[2] && r[4] === d[4] && r[5] === d[5] && r[6] === d[6] && r[8] === d[8] && r[9] === d[9] && r[10] === d[10];
  }
  function ne(r) {
    const d = r ?? new f(12);
    return d[0] = 1, d[1] = 0, d[2] = 0, d[4] = 0, d[5] = 1, d[6] = 0, d[8] = 0, d[9] = 0, d[10] = 1, d;
  }
  function te(r, d) {
    const t = d ?? new f(12);
    if (t === r) {
      let g;
      return g = r[1], r[1] = r[4], r[4] = g, g = r[2], r[2] = r[8], r[8] = g, g = r[6], r[6] = r[9], r[9] = g, t;
    }
    const s = r[0 * 4 + 0], l = r[0 * 4 + 1], p = r[0 * 4 + 2], m = r[1 * 4 + 0], e = r[1 * 4 + 1], o = r[1 * 4 + 2], n = r[2 * 4 + 0], i = r[2 * 4 + 1], a = r[2 * 4 + 2];
    return t[0] = s, t[1] = m, t[2] = n, t[4] = l, t[5] = e, t[6] = i, t[8] = p, t[9] = o, t[10] = a, t;
  }
  function fe(r, d) {
    const t = d ?? new f(12), s = r[0 * 4 + 0], l = r[0 * 4 + 1], p = r[0 * 4 + 2], m = r[1 * 4 + 0], e = r[1 * 4 + 1], o = r[1 * 4 + 2], n = r[2 * 4 + 0], i = r[2 * 4 + 1], a = r[2 * 4 + 2], g = a * e - o * i, y = -a * m + o * n, c = i * m - e * n, u = 1 / (s * g + l * y + p * c);
    return t[0] = g * u, t[1] = (-a * l + p * i) * u, t[2] = (o * l - p * e) * u, t[4] = y * u, t[5] = (a * s - p * n) * u, t[6] = (-o * s + p * m) * u, t[8] = c * u, t[9] = (-i * s + l * n) * u, t[10] = (e * s - l * m) * u, t;
  }
  function ae(r) {
    const d = r[0], t = r[0 * 4 + 1], s = r[0 * 4 + 2], l = r[1 * 4 + 0], p = r[1 * 4 + 1], m = r[1 * 4 + 2], e = r[2 * 4 + 0], o = r[2 * 4 + 1], n = r[2 * 4 + 2];
    return d * (p * n - o * m) - l * (t * n - o * s) + e * (t * m - p * s);
  }
  const ue = fe;
  function ie(r, d, t) {
    const s = t ?? new f(12), l = r[0], p = r[1], m = r[2], e = r[4], o = r[5], n = r[6], i = r[8], a = r[9], g = r[10], y = d[0], c = d[1], u = d[2], h = d[4], x = d[5], w = d[6], P = d[8], D = d[9], S = d[10];
    return s[0] = l * y + e * c + i * u, s[1] = p * y + o * c + a * u, s[2] = m * y + n * c + g * u, s[4] = l * h + e * x + i * w, s[5] = p * h + o * x + a * w, s[6] = m * h + n * x + g * w, s[8] = l * P + e * D + i * S, s[9] = p * P + o * D + a * S, s[10] = m * P + n * D + g * S, s;
  }
  const $ = ie;
  function H(r, d, t) {
    const s = t ?? ne();
    return r !== s && (s[0] = r[0], s[1] = r[1], s[2] = r[2], s[4] = r[4], s[5] = r[5], s[6] = r[6]), s[8] = d[0], s[9] = d[1], s[10] = 1, s;
  }
  function L(r, d) {
    const t = d ?? v.create();
    return t[0] = r[8], t[1] = r[9], t;
  }
  function re(r, d, t) {
    const s = t ?? v.create(), l = d * 4;
    return s[0] = r[l + 0], s[1] = r[l + 1], s;
  }
  function K(r, d, t, s) {
    const l = s === r ? r : T(r, s), p = t * 4;
    return l[p + 0] = d[0], l[p + 1] = d[1], l;
  }
  function Q(r, d) {
    const t = d ?? v.create(), s = r[0], l = r[1], p = r[4], m = r[5];
    return t[0] = Math.sqrt(s * s + l * l), t[1] = Math.sqrt(p * p + m * m), t;
  }
  function j(r, d) {
    const t = d ?? z.create(), s = r[0], l = r[1], p = r[2], m = r[4], e = r[5], o = r[6], n = r[8], i = r[9], a = r[10];
    return t[0] = Math.sqrt(s * s + l * l + p * p), t[1] = Math.sqrt(m * m + e * e + o * o), t[2] = Math.sqrt(n * n + i * i + a * a), t;
  }
  function C(r, d) {
    const t = d ?? new f(12);
    return t[0] = 1, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[8] = r[0], t[9] = r[1], t[10] = 1, t;
  }
  function ee(r, d, t) {
    const s = t ?? new f(12), l = d[0], p = d[1], m = r[0], e = r[1], o = r[2], n = r[1 * 4 + 0], i = r[1 * 4 + 1], a = r[1 * 4 + 2], g = r[2 * 4 + 0], y = r[2 * 4 + 1], c = r[2 * 4 + 2];
    return r !== s && (s[0] = m, s[1] = e, s[2] = o, s[4] = n, s[5] = i, s[6] = a), s[8] = m * l + n * p + g, s[9] = e * l + i * p + y, s[10] = o * l + a * p + c, s;
  }
  function xe(r, d) {
    const t = d ?? new f(12), s = Math.cos(r), l = Math.sin(r);
    return t[0] = s, t[1] = l, t[2] = 0, t[4] = -l, t[5] = s, t[6] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t;
  }
  function A(r, d, t) {
    const s = t ?? new f(12), l = r[0 * 4 + 0], p = r[0 * 4 + 1], m = r[0 * 4 + 2], e = r[1 * 4 + 0], o = r[1 * 4 + 1], n = r[1 * 4 + 2], i = Math.cos(d), a = Math.sin(d);
    return s[0] = i * l + a * e, s[1] = i * p + a * o, s[2] = i * m + a * n, s[4] = i * e - a * l, s[5] = i * o - a * p, s[6] = i * n - a * m, r !== s && (s[8] = r[8], s[9] = r[9], s[10] = r[10]), s;
  }
  function W(r, d) {
    const t = d ?? new f(12), s = Math.cos(r), l = Math.sin(r);
    return t[0] = 1, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = s, t[6] = l, t[8] = 0, t[9] = -l, t[10] = s, t;
  }
  function X(r, d, t) {
    const s = t ?? new f(12), l = r[4], p = r[5], m = r[6], e = r[8], o = r[9], n = r[10], i = Math.cos(d), a = Math.sin(d);
    return s[4] = i * l + a * e, s[5] = i * p + a * o, s[6] = i * m + a * n, s[8] = i * e - a * l, s[9] = i * o - a * p, s[10] = i * n - a * m, r !== s && (s[0] = r[0], s[1] = r[1], s[2] = r[2]), s;
  }
  function Be(r, d) {
    const t = d ?? new f(12), s = Math.cos(r), l = Math.sin(r);
    return t[0] = s, t[1] = 0, t[2] = -l, t[4] = 0, t[5] = 1, t[6] = 0, t[8] = l, t[9] = 0, t[10] = s, t;
  }
  function q(r, d, t) {
    const s = t ?? new f(12), l = r[0 * 4 + 0], p = r[0 * 4 + 1], m = r[0 * 4 + 2], e = r[2 * 4 + 0], o = r[2 * 4 + 1], n = r[2 * 4 + 2], i = Math.cos(d), a = Math.sin(d);
    return s[0] = i * l - a * e, s[1] = i * p - a * o, s[2] = i * m - a * n, s[8] = i * e + a * l, s[9] = i * o + a * p, s[10] = i * n + a * m, r !== s && (s[4] = r[4], s[5] = r[5], s[6] = r[6]), s;
  }
  const me = xe, de = A;
  function Te(r, d) {
    const t = d ?? new f(12);
    return t[0] = r[0], t[1] = 0, t[2] = 0, t[4] = 0, t[5] = r[1], t[6] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t;
  }
  function J(r, d, t) {
    const s = t ?? new f(12), l = d[0], p = d[1];
    return s[0] = l * r[0 * 4 + 0], s[1] = l * r[0 * 4 + 1], s[2] = l * r[0 * 4 + 2], s[4] = p * r[1 * 4 + 0], s[5] = p * r[1 * 4 + 1], s[6] = p * r[1 * 4 + 2], r !== s && (s[8] = r[8], s[9] = r[9], s[10] = r[10]), s;
  }
  function pe(r, d) {
    const t = d ?? new f(12);
    return t[0] = r[0], t[1] = 0, t[2] = 0, t[4] = 0, t[5] = r[1], t[6] = 0, t[8] = 0, t[9] = 0, t[10] = r[2], t;
  }
  function le(r, d, t) {
    const s = t ?? new f(12), l = d[0], p = d[1], m = d[2];
    return s[0] = l * r[0 * 4 + 0], s[1] = l * r[0 * 4 + 1], s[2] = l * r[0 * 4 + 2], s[4] = p * r[1 * 4 + 0], s[5] = p * r[1 * 4 + 1], s[6] = p * r[1 * 4 + 2], s[8] = m * r[2 * 4 + 0], s[9] = m * r[2 * 4 + 1], s[10] = m * r[2 * 4 + 2], s;
  }
  function ve(r, d) {
    const t = d ?? new f(12);
    return t[0] = r, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = r, t[6] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t;
  }
  function O(r, d, t) {
    const s = t ?? new f(12);
    return s[0] = d * r[0 * 4 + 0], s[1] = d * r[0 * 4 + 1], s[2] = d * r[0 * 4 + 2], s[4] = d * r[1 * 4 + 0], s[5] = d * r[1 * 4 + 1], s[6] = d * r[1 * 4 + 2], r !== s && (s[8] = r[8], s[9] = r[9], s[10] = r[10]), s;
  }
  function se(r, d) {
    const t = d ?? new f(12);
    return t[0] = r, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = r, t[6] = 0, t[8] = 0, t[9] = 0, t[10] = r, t;
  }
  function oe(r, d, t) {
    const s = t ?? new f(12);
    return s[0] = d * r[0 * 4 + 0], s[1] = d * r[0 * 4 + 1], s[2] = d * r[0 * 4 + 2], s[4] = d * r[1 * 4 + 0], s[5] = d * r[1 * 4 + 1], s[6] = d * r[1 * 4 + 2], s[8] = d * r[2 * 4 + 0], s[9] = d * r[2 * 4 + 1], s[10] = d * r[2 * 4 + 2], s;
  }
  return {
    clone: B,
    create: _,
    set: I,
    fromMat4: b,
    fromQuat: F,
    negate: k,
    copy: T,
    equalsApproximately: Z,
    equals: N,
    identity: ne,
    transpose: te,
    inverse: fe,
    invert: ue,
    determinant: ae,
    mul: $,
    multiply: ie,
    setTranslation: H,
    getTranslation: L,
    getAxis: re,
    setAxis: K,
    getScaling: Q,
    get3DScaling: j,
    translation: C,
    translate: ee,
    rotation: xe,
    rotate: A,
    rotationX: W,
    rotateX: X,
    rotationY: Be,
    rotateY: q,
    rotationZ: me,
    rotateZ: de,
    scaling: Te,
    scale: J,
    uniformScaling: ve,
    uniformScale: O,
    scaling3D: pe,
    scale3D: le,
    uniformScaling3D: se,
    uniformScale3D: oe
  };
}
const en = /* @__PURE__ */ new Map();
function pn(f) {
  let v = en.get(f);
  return v || (v = dn(f), en.set(f, v)), v;
}
function hn(f) {
  const v = Ne(f);
  function z(e, o, n, i, a, g, y, c, u, h, x, w, P, D, S, U) {
    const G = new f(16);
    return e !== void 0 && (G[0] = e, o !== void 0 && (G[1] = o, n !== void 0 && (G[2] = n, i !== void 0 && (G[3] = i, a !== void 0 && (G[4] = a, g !== void 0 && (G[5] = g, y !== void 0 && (G[6] = y, c !== void 0 && (G[7] = c, u !== void 0 && (G[8] = u, h !== void 0 && (G[9] = h, x !== void 0 && (G[10] = x, w !== void 0 && (G[11] = w, P !== void 0 && (G[12] = P, D !== void 0 && (G[13] = D, S !== void 0 && (G[14] = S, U !== void 0 && (G[15] = U)))))))))))))))), G;
  }
  function _(e, o, n, i, a, g, y, c, u, h, x, w, P, D, S, U, G) {
    const V = G ?? new f(16);
    return V[0] = e, V[1] = o, V[2] = n, V[3] = i, V[4] = a, V[5] = g, V[6] = y, V[7] = c, V[8] = u, V[9] = h, V[10] = x, V[11] = w, V[12] = P, V[13] = D, V[14] = S, V[15] = U, V;
  }
  function I(e, o) {
    const n = o ?? new f(16);
    return n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = 0, n[4] = e[4], n[5] = e[5], n[6] = e[6], n[7] = 0, n[8] = e[8], n[9] = e[9], n[10] = e[10], n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function b(e, o) {
    const n = o ?? new f(16), i = e[0], a = e[1], g = e[2], y = e[3], c = i + i, u = a + a, h = g + g, x = i * c, w = a * c, P = a * u, D = g * c, S = g * u, U = g * h, G = y * c, V = y * u, R = y * h;
    return n[0] = 1 - P - U, n[1] = w + R, n[2] = D - V, n[3] = 0, n[4] = w - R, n[5] = 1 - x - U, n[6] = S + G, n[7] = 0, n[8] = D + V, n[9] = S - G, n[10] = 1 - x - P, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function F(e, o) {
    const n = o ?? new f(16);
    return n[0] = -e[0], n[1] = -e[1], n[2] = -e[2], n[3] = -e[3], n[4] = -e[4], n[5] = -e[5], n[6] = -e[6], n[7] = -e[7], n[8] = -e[8], n[9] = -e[9], n[10] = -e[10], n[11] = -e[11], n[12] = -e[12], n[13] = -e[13], n[14] = -e[14], n[15] = -e[15], n;
  }
  function k(e, o) {
    const n = o ?? new f(16);
    return n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = e[3], n[4] = e[4], n[5] = e[5], n[6] = e[6], n[7] = e[7], n[8] = e[8], n[9] = e[9], n[10] = e[10], n[11] = e[11], n[12] = e[12], n[13] = e[13], n[14] = e[14], n[15] = e[15], n;
  }
  const T = k;
  function B(e, o) {
    return Math.abs(e[0] - o[0]) < Y && Math.abs(e[1] - o[1]) < Y && Math.abs(e[2] - o[2]) < Y && Math.abs(e[3] - o[3]) < Y && Math.abs(e[4] - o[4]) < Y && Math.abs(e[5] - o[5]) < Y && Math.abs(e[6] - o[6]) < Y && Math.abs(e[7] - o[7]) < Y && Math.abs(e[8] - o[8]) < Y && Math.abs(e[9] - o[9]) < Y && Math.abs(e[10] - o[10]) < Y && Math.abs(e[11] - o[11]) < Y && Math.abs(e[12] - o[12]) < Y && Math.abs(e[13] - o[13]) < Y && Math.abs(e[14] - o[14]) < Y && Math.abs(e[15] - o[15]) < Y;
  }
  function Z(e, o) {
    return e[0] === o[0] && e[1] === o[1] && e[2] === o[2] && e[3] === o[3] && e[4] === o[4] && e[5] === o[5] && e[6] === o[6] && e[7] === o[7] && e[8] === o[8] && e[9] === o[9] && e[10] === o[10] && e[11] === o[11] && e[12] === o[12] && e[13] === o[13] && e[14] === o[14] && e[15] === o[15];
  }
  function N(e) {
    const o = e ?? new f(16);
    return o[0] = 1, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = 1, o[6] = 0, o[7] = 0, o[8] = 0, o[9] = 0, o[10] = 1, o[11] = 0, o[12] = 0, o[13] = 0, o[14] = 0, o[15] = 1, o;
  }
  function ne(e, o) {
    const n = o ?? new f(16);
    if (n === e) {
      let E;
      return E = e[1], e[1] = e[4], e[4] = E, E = e[2], e[2] = e[8], e[8] = E, E = e[3], e[3] = e[12], e[12] = E, E = e[6], e[6] = e[9], e[9] = E, E = e[7], e[7] = e[13], e[13] = E, E = e[11], e[11] = e[14], e[14] = E, n;
    }
    const i = e[0 * 4 + 0], a = e[0 * 4 + 1], g = e[0 * 4 + 2], y = e[0 * 4 + 3], c = e[1 * 4 + 0], u = e[1 * 4 + 1], h = e[1 * 4 + 2], x = e[1 * 4 + 3], w = e[2 * 4 + 0], P = e[2 * 4 + 1], D = e[2 * 4 + 2], S = e[2 * 4 + 3], U = e[3 * 4 + 0], G = e[3 * 4 + 1], V = e[3 * 4 + 2], R = e[3 * 4 + 3];
    return n[0] = i, n[1] = c, n[2] = w, n[3] = U, n[4] = a, n[5] = u, n[6] = P, n[7] = G, n[8] = g, n[9] = h, n[10] = D, n[11] = V, n[12] = y, n[13] = x, n[14] = S, n[15] = R, n;
  }
  function te(e, o) {
    const n = o ?? new f(16), i = e[0 * 4 + 0], a = e[0 * 4 + 1], g = e[0 * 4 + 2], y = e[0 * 4 + 3], c = e[1 * 4 + 0], u = e[1 * 4 + 1], h = e[1 * 4 + 2], x = e[1 * 4 + 3], w = e[2 * 4 + 0], P = e[2 * 4 + 1], D = e[2 * 4 + 2], S = e[2 * 4 + 3], U = e[3 * 4 + 0], G = e[3 * 4 + 1], V = e[3 * 4 + 2], R = e[3 * 4 + 3], E = D * R, ce = V * S, he = h * R, ge = V * x, we = h * S, ye = D * x, Pe = g * R, De = V * y, Me = g * S, ze = D * y, Ge = g * x, Se = h * y, Ve = w * G, _e = U * P, Fe = c * G, Ue = U * u, Ie = c * P, Re = w * u, Le = i * G, Oe = U * a, He = i * P, We = w * a, qe = i * u, Ee = c * a, Ce = E * u + ge * P + we * G - (ce * u + he * P + ye * G), Ze = ce * a + Pe * P + ze * G - (E * a + De * P + Me * G), $e = he * a + De * u + Ge * G - (ge * a + Pe * u + Se * G), Qe = ye * a + Me * u + Se * P - (we * a + ze * u + Ge * P), be = 1 / (i * Ce + c * Ze + w * $e + U * Qe);
    return n[0] = be * Ce, n[1] = be * Ze, n[2] = be * $e, n[3] = be * Qe, n[4] = be * (ce * c + he * w + ye * U - (E * c + ge * w + we * U)), n[5] = be * (E * i + De * w + Me * U - (ce * i + Pe * w + ze * U)), n[6] = be * (ge * i + Pe * c + Se * U - (he * i + De * c + Ge * U)), n[7] = be * (we * i + ze * c + Ge * w - (ye * i + Me * c + Se * w)), n[8] = be * (Ve * x + Ue * S + Ie * R - (_e * x + Fe * S + Re * R)), n[9] = be * (_e * y + Le * S + We * R - (Ve * y + Oe * S + He * R)), n[10] = be * (Fe * y + Oe * x + qe * R - (Ue * y + Le * x + Ee * R)), n[11] = be * (Re * y + He * x + Ee * S - (Ie * y + We * x + qe * S)), n[12] = be * (Fe * D + Re * V + _e * h - (Ie * V + Ve * h + Ue * D)), n[13] = be * (He * V + Ve * g + Oe * D - (Le * D + We * V + _e * g)), n[14] = be * (Le * h + Ee * V + Ue * g - (qe * V + Fe * g + Oe * h)), n[15] = be * (qe * D + Ie * g + We * h - (He * h + Ee * D + Re * g)), n;
  }
  function fe(e) {
    const o = e[0], n = e[0 * 4 + 1], i = e[0 * 4 + 2], a = e[0 * 4 + 3], g = e[1 * 4 + 0], y = e[1 * 4 + 1], c = e[1 * 4 + 2], u = e[1 * 4 + 3], h = e[2 * 4 + 0], x = e[2 * 4 + 1], w = e[2 * 4 + 2], P = e[2 * 4 + 3], D = e[3 * 4 + 0], S = e[3 * 4 + 1], U = e[3 * 4 + 2], G = e[3 * 4 + 3], V = w * G, R = U * P, E = c * G, ce = U * u, he = c * P, ge = w * u, we = i * G, ye = U * a, Pe = i * P, De = w * a, Me = i * u, ze = c * a, Ge = V * y + ce * x + he * S - (R * y + E * x + ge * S), Se = R * n + we * x + De * S - (V * n + ye * x + Pe * S), Ve = E * n + ye * y + Me * S - (ce * n + we * y + ze * S), _e = ge * n + Pe * y + ze * x - (he * n + De * y + Me * x);
    return o * Ge + g * Se + h * Ve + D * _e;
  }
  const ae = te;
  function ue(e, o, n) {
    const i = n ?? new f(16), a = e[0], g = e[1], y = e[2], c = e[3], u = e[4], h = e[5], x = e[6], w = e[7], P = e[8], D = e[9], S = e[10], U = e[11], G = e[12], V = e[13], R = e[14], E = e[15], ce = o[0], he = o[1], ge = o[2], we = o[3], ye = o[4], Pe = o[5], De = o[6], Me = o[7], ze = o[8], Ge = o[9], Se = o[10], Ve = o[11], _e = o[12], Fe = o[13], Ue = o[14], Ie = o[15];
    return i[0] = a * ce + u * he + P * ge + G * we, i[1] = g * ce + h * he + D * ge + V * we, i[2] = y * ce + x * he + S * ge + R * we, i[3] = c * ce + w * he + U * ge + E * we, i[4] = a * ye + u * Pe + P * De + G * Me, i[5] = g * ye + h * Pe + D * De + V * Me, i[6] = y * ye + x * Pe + S * De + R * Me, i[7] = c * ye + w * Pe + U * De + E * Me, i[8] = a * ze + u * Ge + P * Se + G * Ve, i[9] = g * ze + h * Ge + D * Se + V * Ve, i[10] = y * ze + x * Ge + S * Se + R * Ve, i[11] = c * ze + w * Ge + U * Se + E * Ve, i[12] = a * _e + u * Fe + P * Ue + G * Ie, i[13] = g * _e + h * Fe + D * Ue + V * Ie, i[14] = y * _e + x * Fe + S * Ue + R * Ie, i[15] = c * _e + w * Fe + U * Ue + E * Ie, i;
  }
  const ie = ue;
  function $(e, o, n) {
    const i = n ?? N();
    return e !== i && (i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[3], i[4] = e[4], i[5] = e[5], i[6] = e[6], i[7] = e[7], i[8] = e[8], i[9] = e[9], i[10] = e[10], i[11] = e[11]), i[12] = o[0], i[13] = o[1], i[14] = o[2], i[15] = 1, i;
  }
  function H(e, o) {
    const n = o ?? v.create();
    return n[0] = e[12], n[1] = e[13], n[2] = e[14], n;
  }
  function L(e, o, n) {
    const i = n ?? v.create(), a = o * 4;
    return i[0] = e[a + 0], i[1] = e[a + 1], i[2] = e[a + 2], i;
  }
  function re(e, o, n, i) {
    const a = i === e ? i : k(e, i), g = n * 4;
    return a[g + 0] = o[0], a[g + 1] = o[1], a[g + 2] = o[2], a;
  }
  function K(e, o) {
    const n = o ?? v.create(), i = e[0], a = e[1], g = e[2], y = e[4], c = e[5], u = e[6], h = e[8], x = e[9], w = e[10];
    return n[0] = Math.sqrt(i * i + a * a + g * g), n[1] = Math.sqrt(y * y + c * c + u * u), n[2] = Math.sqrt(h * h + x * x + w * w), n;
  }
  function Q(e, o, n, i, a) {
    const g = a ?? new f(16), y = Math.tan(Math.PI * 0.5 - 0.5 * e);
    if (g[0] = y / o, g[1] = 0, g[2] = 0, g[3] = 0, g[4] = 0, g[5] = y, g[6] = 0, g[7] = 0, g[8] = 0, g[9] = 0, g[11] = -1, g[12] = 0, g[13] = 0, g[15] = 0, Number.isFinite(i)) {
      const c = 1 / (n - i);
      g[10] = i * c, g[14] = i * n * c;
    } else
      g[10] = -1, g[14] = -n;
    return g;
  }
  function j(e, o, n, i = 1 / 0, a) {
    const g = a ?? new f(16), y = 1 / Math.tan(e * 0.5);
    if (g[0] = y / o, g[1] = 0, g[2] = 0, g[3] = 0, g[4] = 0, g[5] = y, g[6] = 0, g[7] = 0, g[8] = 0, g[9] = 0, g[11] = -1, g[12] = 0, g[13] = 0, g[15] = 0, i === 1 / 0)
      g[10] = 0, g[14] = n;
    else {
      const c = 1 / (i - n);
      g[10] = n * c, g[14] = i * n * c;
    }
    return g;
  }
  function C(e, o, n, i, a, g, y) {
    const c = y ?? new f(16);
    return c[0] = 2 / (o - e), c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 2 / (i - n), c[6] = 0, c[7] = 0, c[8] = 0, c[9] = 0, c[10] = 1 / (a - g), c[11] = 0, c[12] = (o + e) / (e - o), c[13] = (i + n) / (n - i), c[14] = a / (a - g), c[15] = 1, c;
  }
  function ee(e, o, n, i, a, g, y) {
    const c = y ?? new f(16), u = o - e, h = i - n, x = a - g;
    return c[0] = 2 * a / u, c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 2 * a / h, c[6] = 0, c[7] = 0, c[8] = (e + o) / u, c[9] = (i + n) / h, c[10] = g / x, c[11] = -1, c[12] = 0, c[13] = 0, c[14] = a * g / x, c[15] = 0, c;
  }
  function xe(e, o, n, i, a, g = 1 / 0, y) {
    const c = y ?? new f(16), u = o - e, h = i - n;
    if (c[0] = 2 * a / u, c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 2 * a / h, c[6] = 0, c[7] = 0, c[8] = (e + o) / u, c[9] = (i + n) / h, c[11] = -1, c[12] = 0, c[13] = 0, c[15] = 0, g === 1 / 0)
      c[10] = 0, c[14] = a;
    else {
      const x = 1 / (g - a);
      c[10] = a * x, c[14] = g * a * x;
    }
    return c;
  }
  const A = v.create(), W = v.create(), X = v.create();
  function Be(e, o, n, i) {
    const a = i ?? new f(16);
    return v.normalize(v.subtract(o, e, X), X), v.normalize(v.cross(n, X, A), A), v.normalize(v.cross(X, A, W), W), a[0] = A[0], a[1] = A[1], a[2] = A[2], a[3] = 0, a[4] = W[0], a[5] = W[1], a[6] = W[2], a[7] = 0, a[8] = X[0], a[9] = X[1], a[10] = X[2], a[11] = 0, a[12] = e[0], a[13] = e[1], a[14] = e[2], a[15] = 1, a;
  }
  function q(e, o, n, i) {
    const a = i ?? new f(16);
    return v.normalize(v.subtract(e, o, X), X), v.normalize(v.cross(n, X, A), A), v.normalize(v.cross(X, A, W), W), a[0] = A[0], a[1] = A[1], a[2] = A[2], a[3] = 0, a[4] = W[0], a[5] = W[1], a[6] = W[2], a[7] = 0, a[8] = X[0], a[9] = X[1], a[10] = X[2], a[11] = 0, a[12] = e[0], a[13] = e[1], a[14] = e[2], a[15] = 1, a;
  }
  function me(e, o, n, i) {
    const a = i ?? new f(16);
    return v.normalize(v.subtract(e, o, X), X), v.normalize(v.cross(n, X, A), A), v.normalize(v.cross(X, A, W), W), a[0] = A[0], a[1] = W[0], a[2] = X[0], a[3] = 0, a[4] = A[1], a[5] = W[1], a[6] = X[1], a[7] = 0, a[8] = A[2], a[9] = W[2], a[10] = X[2], a[11] = 0, a[12] = -(A[0] * e[0] + A[1] * e[1] + A[2] * e[2]), a[13] = -(W[0] * e[0] + W[1] * e[1] + W[2] * e[2]), a[14] = -(X[0] * e[0] + X[1] * e[1] + X[2] * e[2]), a[15] = 1, a;
  }
  function de(e, o) {
    const n = o ?? new f(16);
    return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = e[0], n[13] = e[1], n[14] = e[2], n[15] = 1, n;
  }
  function Te(e, o, n) {
    const i = n ?? new f(16), a = o[0], g = o[1], y = o[2], c = e[0], u = e[1], h = e[2], x = e[3], w = e[1 * 4 + 0], P = e[1 * 4 + 1], D = e[1 * 4 + 2], S = e[1 * 4 + 3], U = e[2 * 4 + 0], G = e[2 * 4 + 1], V = e[2 * 4 + 2], R = e[2 * 4 + 3], E = e[3 * 4 + 0], ce = e[3 * 4 + 1], he = e[3 * 4 + 2], ge = e[3 * 4 + 3];
    return e !== i && (i[0] = c, i[1] = u, i[2] = h, i[3] = x, i[4] = w, i[5] = P, i[6] = D, i[7] = S, i[8] = U, i[9] = G, i[10] = V, i[11] = R), i[12] = c * a + w * g + U * y + E, i[13] = u * a + P * g + G * y + ce, i[14] = h * a + D * g + V * y + he, i[15] = x * a + S * g + R * y + ge, i;
  }
  function J(e, o) {
    const n = o ?? new f(16), i = Math.cos(e), a = Math.sin(e);
    return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = i, n[6] = a, n[7] = 0, n[8] = 0, n[9] = -a, n[10] = i, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function pe(e, o, n) {
    const i = n ?? new f(16), a = e[4], g = e[5], y = e[6], c = e[7], u = e[8], h = e[9], x = e[10], w = e[11], P = Math.cos(o), D = Math.sin(o);
    return i[4] = P * a + D * u, i[5] = P * g + D * h, i[6] = P * y + D * x, i[7] = P * c + D * w, i[8] = P * u - D * a, i[9] = P * h - D * g, i[10] = P * x - D * y, i[11] = P * w - D * c, e !== i && (i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[3], i[12] = e[12], i[13] = e[13], i[14] = e[14], i[15] = e[15]), i;
  }
  function le(e, o) {
    const n = o ?? new f(16), i = Math.cos(e), a = Math.sin(e);
    return n[0] = i, n[1] = 0, n[2] = -a, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = a, n[9] = 0, n[10] = i, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function ve(e, o, n) {
    const i = n ?? new f(16), a = e[0 * 4 + 0], g = e[0 * 4 + 1], y = e[0 * 4 + 2], c = e[0 * 4 + 3], u = e[2 * 4 + 0], h = e[2 * 4 + 1], x = e[2 * 4 + 2], w = e[2 * 4 + 3], P = Math.cos(o), D = Math.sin(o);
    return i[0] = P * a - D * u, i[1] = P * g - D * h, i[2] = P * y - D * x, i[3] = P * c - D * w, i[8] = P * u + D * a, i[9] = P * h + D * g, i[10] = P * x + D * y, i[11] = P * w + D * c, e !== i && (i[4] = e[4], i[5] = e[5], i[6] = e[6], i[7] = e[7], i[12] = e[12], i[13] = e[13], i[14] = e[14], i[15] = e[15]), i;
  }
  function O(e, o) {
    const n = o ?? new f(16), i = Math.cos(e), a = Math.sin(e);
    return n[0] = i, n[1] = a, n[2] = 0, n[3] = 0, n[4] = -a, n[5] = i, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function se(e, o, n) {
    const i = n ?? new f(16), a = e[0 * 4 + 0], g = e[0 * 4 + 1], y = e[0 * 4 + 2], c = e[0 * 4 + 3], u = e[1 * 4 + 0], h = e[1 * 4 + 1], x = e[1 * 4 + 2], w = e[1 * 4 + 3], P = Math.cos(o), D = Math.sin(o);
    return i[0] = P * a + D * u, i[1] = P * g + D * h, i[2] = P * y + D * x, i[3] = P * c + D * w, i[4] = P * u - D * a, i[5] = P * h - D * g, i[6] = P * x - D * y, i[7] = P * w - D * c, e !== i && (i[8] = e[8], i[9] = e[9], i[10] = e[10], i[11] = e[11], i[12] = e[12], i[13] = e[13], i[14] = e[14], i[15] = e[15]), i;
  }
  function oe(e, o, n) {
    const i = n ?? new f(16);
    let a = e[0], g = e[1], y = e[2];
    const c = Math.sqrt(a * a + g * g + y * y);
    a /= c, g /= c, y /= c;
    const u = a * a, h = g * g, x = y * y, w = Math.cos(o), P = Math.sin(o), D = 1 - w;
    return i[0] = u + (1 - u) * w, i[1] = a * g * D + y * P, i[2] = a * y * D - g * P, i[3] = 0, i[4] = a * g * D - y * P, i[5] = h + (1 - h) * w, i[6] = g * y * D + a * P, i[7] = 0, i[8] = a * y * D + g * P, i[9] = g * y * D - a * P, i[10] = x + (1 - x) * w, i[11] = 0, i[12] = 0, i[13] = 0, i[14] = 0, i[15] = 1, i;
  }
  const r = oe;
  function d(e, o, n, i) {
    const a = i ?? new f(16);
    let g = o[0], y = o[1], c = o[2];
    const u = Math.sqrt(g * g + y * y + c * c);
    g /= u, y /= u, c /= u;
    const h = g * g, x = y * y, w = c * c, P = Math.cos(n), D = Math.sin(n), S = 1 - P, U = h + (1 - h) * P, G = g * y * S + c * D, V = g * c * S - y * D, R = g * y * S - c * D, E = x + (1 - x) * P, ce = y * c * S + g * D, he = g * c * S + y * D, ge = y * c * S - g * D, we = w + (1 - w) * P, ye = e[0], Pe = e[1], De = e[2], Me = e[3], ze = e[4], Ge = e[5], Se = e[6], Ve = e[7], _e = e[8], Fe = e[9], Ue = e[10], Ie = e[11];
    return a[0] = U * ye + G * ze + V * _e, a[1] = U * Pe + G * Ge + V * Fe, a[2] = U * De + G * Se + V * Ue, a[3] = U * Me + G * Ve + V * Ie, a[4] = R * ye + E * ze + ce * _e, a[5] = R * Pe + E * Ge + ce * Fe, a[6] = R * De + E * Se + ce * Ue, a[7] = R * Me + E * Ve + ce * Ie, a[8] = he * ye + ge * ze + we * _e, a[9] = he * Pe + ge * Ge + we * Fe, a[10] = he * De + ge * Se + we * Ue, a[11] = he * Me + ge * Ve + we * Ie, e !== a && (a[12] = e[12], a[13] = e[13], a[14] = e[14], a[15] = e[15]), a;
  }
  const t = d;
  function s(e, o) {
    const n = o ?? new f(16);
    return n[0] = e[0], n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = e[1], n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = e[2], n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function l(e, o, n) {
    const i = n ?? new f(16), a = o[0], g = o[1], y = o[2];
    return i[0] = a * e[0 * 4 + 0], i[1] = a * e[0 * 4 + 1], i[2] = a * e[0 * 4 + 2], i[3] = a * e[0 * 4 + 3], i[4] = g * e[1 * 4 + 0], i[5] = g * e[1 * 4 + 1], i[6] = g * e[1 * 4 + 2], i[7] = g * e[1 * 4 + 3], i[8] = y * e[2 * 4 + 0], i[9] = y * e[2 * 4 + 1], i[10] = y * e[2 * 4 + 2], i[11] = y * e[2 * 4 + 3], e !== i && (i[12] = e[12], i[13] = e[13], i[14] = e[14], i[15] = e[15]), i;
  }
  function p(e, o) {
    const n = o ?? new f(16);
    return n[0] = e, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = e, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = e, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function m(e, o, n) {
    const i = n ?? new f(16);
    return i[0] = o * e[0 * 4 + 0], i[1] = o * e[0 * 4 + 1], i[2] = o * e[0 * 4 + 2], i[3] = o * e[0 * 4 + 3], i[4] = o * e[1 * 4 + 0], i[5] = o * e[1 * 4 + 1], i[6] = o * e[1 * 4 + 2], i[7] = o * e[1 * 4 + 3], i[8] = o * e[2 * 4 + 0], i[9] = o * e[2 * 4 + 1], i[10] = o * e[2 * 4 + 2], i[11] = o * e[2 * 4 + 3], e !== i && (i[12] = e[12], i[13] = e[13], i[14] = e[14], i[15] = e[15]), i;
  }
  return {
    create: z,
    set: _,
    fromMat3: I,
    fromQuat: b,
    negate: F,
    copy: k,
    clone: T,
    equalsApproximately: B,
    equals: Z,
    identity: N,
    transpose: ne,
    inverse: te,
    determinant: fe,
    invert: ae,
    multiply: ue,
    mul: ie,
    setTranslation: $,
    getTranslation: H,
    getAxis: L,
    setAxis: re,
    getScaling: K,
    perspective: Q,
    perspectiveReverseZ: j,
    ortho: C,
    frustum: ee,
    frustumReverseZ: xe,
    aim: Be,
    cameraAim: q,
    lookAt: me,
    translation: de,
    translate: Te,
    rotationX: J,
    rotateX: pe,
    rotationY: le,
    rotateY: ve,
    rotationZ: O,
    rotateZ: se,
    axisRotation: oe,
    rotation: r,
    axisRotate: d,
    rotate: t,
    scaling: s,
    scale: l,
    uniformScaling: p,
    uniformScale: m
  };
}
const nn = /* @__PURE__ */ new Map();
function gn(f) {
  let v = nn.get(f);
  return v || (v = hn(f), nn.set(f, v)), v;
}
function xn(f) {
  const v = Ne(f);
  function z(r, d, t, s) {
    const l = new f(4);
    return r !== void 0 && (l[0] = r, d !== void 0 && (l[1] = d, t !== void 0 && (l[2] = t, s !== void 0 && (l[3] = s)))), l;
  }
  const _ = z;
  function I(r, d, t, s, l) {
    const p = l ?? new f(4);
    return p[0] = r, p[1] = d, p[2] = t, p[3] = s, p;
  }
  function b(r, d, t) {
    const s = t ?? new f(4), l = d * 0.5, p = Math.sin(l);
    return s[0] = p * r[0], s[1] = p * r[1], s[2] = p * r[2], s[3] = Math.cos(l), s;
  }
  function F(r, d) {
    const t = d ?? v.create(3), s = Math.acos(r[3]) * 2, l = Math.sin(s * 0.5);
    return l > Y ? (t[0] = r[0] / l, t[1] = r[1] / l, t[2] = r[2] / l) : (t[0] = 1, t[1] = 0, t[2] = 0), { angle: s, axis: t };
  }
  function k(r, d) {
    const t = ee(r, d);
    return Math.acos(2 * t * t - 1);
  }
  function T(r, d, t) {
    const s = t ?? new f(4), l = r[0], p = r[1], m = r[2], e = r[3], o = d[0], n = d[1], i = d[2], a = d[3];
    return s[0] = l * a + e * o + p * i - m * n, s[1] = p * a + e * n + m * o - l * i, s[2] = m * a + e * i + l * n - p * o, s[3] = e * a - l * o - p * n - m * i, s;
  }
  const B = T;
  function Z(r, d, t) {
    const s = t ?? new f(4), l = d * 0.5, p = r[0], m = r[1], e = r[2], o = r[3], n = Math.sin(l), i = Math.cos(l);
    return s[0] = p * i + o * n, s[1] = m * i + e * n, s[2] = e * i - m * n, s[3] = o * i - p * n, s;
  }
  function N(r, d, t) {
    const s = t ?? new f(4), l = d * 0.5, p = r[0], m = r[1], e = r[2], o = r[3], n = Math.sin(l), i = Math.cos(l);
    return s[0] = p * i - e * n, s[1] = m * i + o * n, s[2] = e * i + p * n, s[3] = o * i - m * n, s;
  }
  function ne(r, d, t) {
    const s = t ?? new f(4), l = d * 0.5, p = r[0], m = r[1], e = r[2], o = r[3], n = Math.sin(l), i = Math.cos(l);
    return s[0] = p * i + m * n, s[1] = m * i - p * n, s[2] = e * i + o * n, s[3] = o * i - e * n, s;
  }
  function te(r, d, t, s) {
    const l = s ?? new f(4), p = r[0], m = r[1], e = r[2], o = r[3];
    let n = d[0], i = d[1], a = d[2], g = d[3], y = p * n + m * i + e * a + o * g;
    y < 0 && (y = -y, n = -n, i = -i, a = -a, g = -g);
    let c, u;
    if (1 - y > Y) {
      const h = Math.acos(y), x = Math.sin(h);
      c = Math.sin((1 - t) * h) / x, u = Math.sin(t * h) / x;
    } else
      c = 1 - t, u = t;
    return l[0] = c * p + u * n, l[1] = c * m + u * i, l[2] = c * e + u * a, l[3] = c * o + u * g, l;
  }
  function fe(r, d) {
    const t = d ?? new f(4), s = r[0], l = r[1], p = r[2], m = r[3], e = s * s + l * l + p * p + m * m, o = e ? 1 / e : 0;
    return t[0] = -s * o, t[1] = -l * o, t[2] = -p * o, t[3] = m * o, t;
  }
  function ae(r, d) {
    const t = d ?? new f(4);
    return t[0] = -r[0], t[1] = -r[1], t[2] = -r[2], t[3] = r[3], t;
  }
  function ue(r, d) {
    const t = d ?? new f(4), s = r[0] + r[5] + r[10];
    if (s > 0) {
      const l = Math.sqrt(s + 1);
      t[3] = 0.5 * l;
      const p = 0.5 / l;
      t[0] = (r[6] - r[9]) * p, t[1] = (r[8] - r[2]) * p, t[2] = (r[1] - r[4]) * p;
    } else {
      let l = 0;
      r[5] > r[0] && (l = 1), r[10] > r[l * 4 + l] && (l = 2);
      const p = (l + 1) % 3, m = (l + 2) % 3, e = Math.sqrt(r[l * 4 + l] - r[p * 4 + p] - r[m * 4 + m] + 1);
      t[l] = 0.5 * e;
      const o = 0.5 / e;
      t[3] = (r[p * 4 + m] - r[m * 4 + p]) * o, t[p] = (r[p * 4 + l] + r[l * 4 + p]) * o, t[m] = (r[m * 4 + l] + r[l * 4 + m]) * o;
    }
    return t;
  }
  function ie(r, d, t, s, l) {
    const p = l ?? new f(4), m = r * 0.5, e = d * 0.5, o = t * 0.5, n = Math.sin(m), i = Math.cos(m), a = Math.sin(e), g = Math.cos(e), y = Math.sin(o), c = Math.cos(o);
    switch (s) {
      case "xyz":
        p[0] = n * g * c + i * a * y, p[1] = i * a * c - n * g * y, p[2] = i * g * y + n * a * c, p[3] = i * g * c - n * a * y;
        break;
      case "xzy":
        p[0] = n * g * c - i * a * y, p[1] = i * a * c - n * g * y, p[2] = i * g * y + n * a * c, p[3] = i * g * c + n * a * y;
        break;
      case "yxz":
        p[0] = n * g * c + i * a * y, p[1] = i * a * c - n * g * y, p[2] = i * g * y - n * a * c, p[3] = i * g * c + n * a * y;
        break;
      case "yzx":
        p[0] = n * g * c + i * a * y, p[1] = i * a * c + n * g * y, p[2] = i * g * y - n * a * c, p[3] = i * g * c - n * a * y;
        break;
      case "zxy":
        p[0] = n * g * c - i * a * y, p[1] = i * a * c + n * g * y, p[2] = i * g * y + n * a * c, p[3] = i * g * c - n * a * y;
        break;
      case "zyx":
        p[0] = n * g * c - i * a * y, p[1] = i * a * c + n * g * y, p[2] = i * g * y - n * a * c, p[3] = i * g * c + n * a * y;
        break;
      default:
        throw new Error(`Unknown rotation order: ${s}`);
    }
    return p;
  }
  function $(r, d) {
    const t = d ?? new f(4);
    return t[0] = r[0], t[1] = r[1], t[2] = r[2], t[3] = r[3], t;
  }
  const H = $;
  function L(r, d, t) {
    const s = t ?? new f(4);
    return s[0] = r[0] + d[0], s[1] = r[1] + d[1], s[2] = r[2] + d[2], s[3] = r[3] + d[3], s;
  }
  function re(r, d, t) {
    const s = t ?? new f(4);
    return s[0] = r[0] - d[0], s[1] = r[1] - d[1], s[2] = r[2] - d[2], s[3] = r[3] - d[3], s;
  }
  const K = re;
  function Q(r, d, t) {
    const s = t ?? new f(4);
    return s[0] = r[0] * d, s[1] = r[1] * d, s[2] = r[2] * d, s[3] = r[3] * d, s;
  }
  const j = Q;
  function C(r, d, t) {
    const s = t ?? new f(4);
    return s[0] = r[0] / d, s[1] = r[1] / d, s[2] = r[2] / d, s[3] = r[3] / d, s;
  }
  function ee(r, d) {
    return r[0] * d[0] + r[1] * d[1] + r[2] * d[2] + r[3] * d[3];
  }
  function xe(r, d, t, s) {
    const l = s ?? new f(4);
    return l[0] = r[0] + t * (d[0] - r[0]), l[1] = r[1] + t * (d[1] - r[1]), l[2] = r[2] + t * (d[2] - r[2]), l[3] = r[3] + t * (d[3] - r[3]), l;
  }
  function A(r) {
    const d = r[0], t = r[1], s = r[2], l = r[3];
    return Math.sqrt(d * d + t * t + s * s + l * l);
  }
  const W = A;
  function X(r) {
    const d = r[0], t = r[1], s = r[2], l = r[3];
    return d * d + t * t + s * s + l * l;
  }
  const Be = X;
  function q(r, d) {
    const t = d ?? new f(4), s = r[0], l = r[1], p = r[2], m = r[3], e = Math.sqrt(s * s + l * l + p * p + m * m);
    return e > 1e-5 ? (t[0] = s / e, t[1] = l / e, t[2] = p / e, t[3] = m / e) : (t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1), t;
  }
  function me(r, d) {
    return Math.abs(r[0] - d[0]) < Y && Math.abs(r[1] - d[1]) < Y && Math.abs(r[2] - d[2]) < Y && Math.abs(r[3] - d[3]) < Y;
  }
  function de(r, d) {
    return r[0] === d[0] && r[1] === d[1] && r[2] === d[2] && r[3] === d[3];
  }
  function Te(r) {
    const d = r ?? new f(4);
    return d[0] = 0, d[1] = 0, d[2] = 0, d[3] = 1, d;
  }
  const J = v.create(), pe = v.create(), le = v.create();
  function ve(r, d, t) {
    const s = t ?? new f(4), l = v.dot(r, d);
    return l < -0.999999 ? (v.cross(pe, r, J), v.len(J) < 1e-6 && v.cross(le, r, J), v.normalize(J, J), b(J, Math.PI, s), s) : l > 0.999999 ? (s[0] = 0, s[1] = 0, s[2] = 0, s[3] = 1, s) : (v.cross(r, d, J), s[0] = J[0], s[1] = J[1], s[2] = J[2], s[3] = 1 + l, q(s, s));
  }
  const O = new f(4), se = new f(4);
  function oe(r, d, t, s, l, p) {
    const m = p ?? new f(4);
    return te(r, s, l, O), te(d, t, l, se), te(O, se, 2 * l * (1 - l), m), m;
  }
  return {
    create: z,
    fromValues: _,
    set: I,
    fromAxisAngle: b,
    toAxisAngle: F,
    angle: k,
    multiply: T,
    mul: B,
    rotateX: Z,
    rotateY: N,
    rotateZ: ne,
    slerp: te,
    inverse: fe,
    conjugate: ae,
    fromMat: ue,
    fromEuler: ie,
    copy: $,
    clone: H,
    add: L,
    subtract: re,
    sub: K,
    mulScalar: Q,
    scale: j,
    divScalar: C,
    dot: ee,
    lerp: xe,
    length: A,
    len: W,
    lengthSq: X,
    lenSq: Be,
    normalize: q,
    equalsApproximately: me,
    equals: de,
    identity: Te,
    rotationTo: ve,
    sqlerp: oe
  };
}
const tn = /* @__PURE__ */ new Map();
function vn(f) {
  let v = tn.get(f);
  return v || (v = xn(f), tn.set(f, v)), v;
}
function wn(f) {
  function v(t, s, l, p) {
    const m = new f(4);
    return t !== void 0 && (m[0] = t, s !== void 0 && (m[1] = s, l !== void 0 && (m[2] = l, p !== void 0 && (m[3] = p)))), m;
  }
  const z = v;
  function _(t, s, l, p, m) {
    const e = m ?? new f(4);
    return e[0] = t, e[1] = s, e[2] = l, e[3] = p, e;
  }
  function I(t, s) {
    const l = s ?? new f(4);
    return l[0] = Math.ceil(t[0]), l[1] = Math.ceil(t[1]), l[2] = Math.ceil(t[2]), l[3] = Math.ceil(t[3]), l;
  }
  function b(t, s) {
    const l = s ?? new f(4);
    return l[0] = Math.floor(t[0]), l[1] = Math.floor(t[1]), l[2] = Math.floor(t[2]), l[3] = Math.floor(t[3]), l;
  }
  function F(t, s) {
    const l = s ?? new f(4);
    return l[0] = Math.round(t[0]), l[1] = Math.round(t[1]), l[2] = Math.round(t[2]), l[3] = Math.round(t[3]), l;
  }
  function k(t, s = 0, l = 1, p) {
    const m = p ?? new f(4);
    return m[0] = Math.min(l, Math.max(s, t[0])), m[1] = Math.min(l, Math.max(s, t[1])), m[2] = Math.min(l, Math.max(s, t[2])), m[3] = Math.min(l, Math.max(s, t[3])), m;
  }
  function T(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] + s[0], p[1] = t[1] + s[1], p[2] = t[2] + s[2], p[3] = t[3] + s[3], p;
  }
  function B(t, s, l, p) {
    const m = p ?? new f(4);
    return m[0] = t[0] + s[0] * l, m[1] = t[1] + s[1] * l, m[2] = t[2] + s[2] * l, m[3] = t[3] + s[3] * l, m;
  }
  function Z(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] - s[0], p[1] = t[1] - s[1], p[2] = t[2] - s[2], p[3] = t[3] - s[3], p;
  }
  const N = Z;
  function ne(t, s) {
    return Math.abs(t[0] - s[0]) < Y && Math.abs(t[1] - s[1]) < Y && Math.abs(t[2] - s[2]) < Y && Math.abs(t[3] - s[3]) < Y;
  }
  function te(t, s) {
    return t[0] === s[0] && t[1] === s[1] && t[2] === s[2] && t[3] === s[3];
  }
  function fe(t, s, l, p) {
    const m = p ?? new f(4);
    return m[0] = t[0] + l * (s[0] - t[0]), m[1] = t[1] + l * (s[1] - t[1]), m[2] = t[2] + l * (s[2] - t[2]), m[3] = t[3] + l * (s[3] - t[3]), m;
  }
  function ae(t, s, l, p) {
    const m = p ?? new f(4);
    return m[0] = t[0] + l[0] * (s[0] - t[0]), m[1] = t[1] + l[1] * (s[1] - t[1]), m[2] = t[2] + l[2] * (s[2] - t[2]), m[3] = t[3] + l[3] * (s[3] - t[3]), m;
  }
  function ue(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = Math.max(t[0], s[0]), p[1] = Math.max(t[1], s[1]), p[2] = Math.max(t[2], s[2]), p[3] = Math.max(t[3], s[3]), p;
  }
  function ie(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = Math.min(t[0], s[0]), p[1] = Math.min(t[1], s[1]), p[2] = Math.min(t[2], s[2]), p[3] = Math.min(t[3], s[3]), p;
  }
  function $(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] * s, p[1] = t[1] * s, p[2] = t[2] * s, p[3] = t[3] * s, p;
  }
  const H = $;
  function L(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] / s, p[1] = t[1] / s, p[2] = t[2] / s, p[3] = t[3] / s, p;
  }
  function re(t, s) {
    const l = s ?? new f(4);
    return l[0] = 1 / t[0], l[1] = 1 / t[1], l[2] = 1 / t[2], l[3] = 1 / t[3], l;
  }
  const K = re;
  function Q(t, s) {
    return t[0] * s[0] + t[1] * s[1] + t[2] * s[2] + t[3] * s[3];
  }
  function j(t) {
    const s = t[0], l = t[1], p = t[2], m = t[3];
    return Math.sqrt(s * s + l * l + p * p + m * m);
  }
  const C = j;
  function ee(t) {
    const s = t[0], l = t[1], p = t[2], m = t[3];
    return s * s + l * l + p * p + m * m;
  }
  const xe = ee;
  function A(t, s) {
    const l = t[0] - s[0], p = t[1] - s[1], m = t[2] - s[2], e = t[3] - s[3];
    return Math.sqrt(l * l + p * p + m * m + e * e);
  }
  const W = A;
  function X(t, s) {
    const l = t[0] - s[0], p = t[1] - s[1], m = t[2] - s[2], e = t[3] - s[3];
    return l * l + p * p + m * m + e * e;
  }
  const Be = X;
  function q(t, s) {
    const l = s ?? new f(4), p = t[0], m = t[1], e = t[2], o = t[3], n = Math.sqrt(p * p + m * m + e * e + o * o);
    return n > 1e-5 ? (l[0] = p / n, l[1] = m / n, l[2] = e / n, l[3] = o / n) : (l[0] = 0, l[1] = 0, l[2] = 0, l[3] = 0), l;
  }
  function me(t, s) {
    const l = s ?? new f(4);
    return l[0] = -t[0], l[1] = -t[1], l[2] = -t[2], l[3] = -t[3], l;
  }
  function de(t, s) {
    const l = s ?? new f(4);
    return l[0] = t[0], l[1] = t[1], l[2] = t[2], l[3] = t[3], l;
  }
  const Te = de;
  function J(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] * s[0], p[1] = t[1] * s[1], p[2] = t[2] * s[2], p[3] = t[3] * s[3], p;
  }
  const pe = J;
  function le(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] / s[0], p[1] = t[1] / s[1], p[2] = t[2] / s[2], p[3] = t[3] / s[3], p;
  }
  const ve = le;
  function O(t) {
    const s = t ?? new f(4);
    return s[0] = 0, s[1] = 0, s[2] = 0, s[3] = 0, s;
  }
  function se(t, s, l) {
    const p = l ?? new f(4), m = t[0], e = t[1], o = t[2], n = t[3];
    return p[0] = s[0] * m + s[4] * e + s[8] * o + s[12] * n, p[1] = s[1] * m + s[5] * e + s[9] * o + s[13] * n, p[2] = s[2] * m + s[6] * e + s[10] * o + s[14] * n, p[3] = s[3] * m + s[7] * e + s[11] * o + s[15] * n, p;
  }
  function oe(t, s, l) {
    const p = l ?? new f(4);
    return q(t, p), $(p, s, p);
  }
  function r(t, s, l) {
    const p = l ?? new f(4);
    return j(t) > s ? oe(t, s, p) : de(t, p);
  }
  function d(t, s, l) {
    const p = l ?? new f(4);
    return fe(t, s, 0.5, p);
  }
  return {
    create: v,
    fromValues: z,
    set: _,
    ceil: I,
    floor: b,
    round: F,
    clamp: k,
    add: T,
    addScaled: B,
    subtract: Z,
    sub: N,
    equalsApproximately: ne,
    equals: te,
    lerp: fe,
    lerpV: ae,
    max: ue,
    min: ie,
    mulScalar: $,
    scale: H,
    divScalar: L,
    inverse: re,
    invert: K,
    dot: Q,
    length: j,
    len: C,
    lengthSq: ee,
    lenSq: xe,
    distance: A,
    dist: W,
    distanceSq: X,
    distSq: Be,
    normalize: q,
    negate: me,
    copy: de,
    clone: Te,
    multiply: J,
    mul: pe,
    divide: le,
    div: ve,
    zero: O,
    transformMat4: se,
    setLength: oe,
    truncate: r,
    midpoint: d
  };
}
const rn = /* @__PURE__ */ new Map();
function mn(f) {
  let v = rn.get(f);
  return v || (v = wn(f), rn.set(f, v)), v;
}
function je(f, v, z, _, I, b) {
  return {
    /** @namespace mat3 */
    mat3: pn(f),
    /** @namespace mat4 */
    mat4: gn(v),
    /** @namespace quat */
    quat: vn(z),
    /** @namespace vec2 */
    vec2: sn(_),
    /** @namespace vec3 */
    vec3: Ne(I),
    /** @namespace vec4 */
    vec4: mn(b)
  };
}
const {
  /**
   * 3x3 Matrix functions that default to returning `Float32Array`
   * @namespace
   */
  mat3: Hn,
  /**
   * 4x4 Matrix functions that default to returning `Float32Array`
   * @namespace
   */
  mat4: Ae,
  /**
   * Quaternion functions that default to returning `Float32Array`
   * @namespace
   */
  quat: Wn,
  /**
   * Vec2 functions that default to returning `Float32Array`
   * @namespace
   */
  vec2: qn,
  /**
   * Vec3 functions that default to returning `Float32Array`
   * @namespace
   */
  vec3: En,
  /**
   * Vec3 functions that default to returning `Float32Array`
   * @namespace
   */
  vec4: Nn
} = je(Float32Array, Float32Array, Float32Array, Float32Array, Float32Array, Float32Array);
je(Float64Array, Float64Array, Float64Array, Float64Array, Float64Array, Float64Array);
je(un, Array, Array, Array, Array, Array);
const Xe = new ArrayBuffer(272), ke = {
  texelSize: new Float32Array(Xe, 0, 2),
  sphereSize: new Float32Array(Xe, 8, 2),
  invProjectionMatrix: new Float32Array(Xe, 16, 16),
  projectionMatrix: new Float32Array(Xe, 80, 16),
  viewMatrix: new Float32Array(Xe, 144, 16),
  invViewMatrix: new Float32Array(Xe, 208, 16)
};
class yn {
  constructor(v) {
    M(this, "isDragging");
    M(this, "prevX");
    M(this, "prevY");
    M(this, "prevHoverX");
    M(this, "prevHoverY");
    M(this, "currentHoverX");
    M(this, "currentHoverY");
    M(this, "currentXtheta");
    M(this, "currentYtheta");
    M(this, "maxYTheta");
    M(this, "minYTheta");
    M(this, "sensitivity");
    M(this, "currentDistance");
    M(this, "maxDistance");
    M(this, "minDistance");
    M(this, "target");
    M(this, "fov");
    M(this, "zoomRate");
    M(this, "canvas");
    this.canvas = v, this.canvas.addEventListener("mousedown", (z) => {
      this.isDragging = !0, this.prevX = z.clientX, this.prevY = z.clientY;
    }), this.canvas.addEventListener("wheel", (z) => {
      z.preventDefault();
      var _ = z.deltaY;
      this.currentDistance += (_ > 0 ? 1 : -1) * this.zoomRate, this.currentDistance < this.minDistance && (this.currentDistance = this.minDistance), this.currentDistance > this.maxDistance && (this.currentDistance = this.maxDistance), this.recalculateView();
    }), this.canvas.addEventListener("mousemove", (z) => {
      if (this.currentHoverX = z.clientX, this.currentHoverY = z.clientY, this.isDragging) {
        const _ = this.prevX - z.clientX, I = this.prevY - z.clientY;
        this.currentXtheta += this.sensitivity * _, this.currentYtheta += this.sensitivity * I, this.currentYtheta > this.maxYTheta && (this.currentYtheta = this.maxYTheta), this.currentYtheta < this.minYTheta && (this.currentYtheta = this.minYTheta), this.prevX = z.clientX, this.prevY = z.clientY, this.recalculateView();
      }
    }), this.canvas.addEventListener("mouseup", () => {
      this.isDragging && (this.isDragging = !1);
    });
  }
  reset(v, z, _, I) {
    this.isDragging = !1, this.prevX = 0, this.prevY = 0, this.currentXtheta = -Math.PI / 2 * 1, this.currentYtheta = -Math.PI / 12 * 0.8, this.maxYTheta = -Math.PI / 12 * 0.8, this.minYTheta = -0.99 * Math.PI / 2, this.sensitivity = 5e-3, this.currentDistance = v, this.maxDistance = 1.3 * this.currentDistance, this.minDistance = 0.8 * this.currentDistance, this.target = z, this.fov = _, this.zoomRate = I;
    const b = this.canvas.clientWidth / this.canvas.clientHeight, F = Ae.perspective(_, b, 0.1, 300);
    ke.projectionMatrix.set(F), ke.invProjectionMatrix.set(Ae.inverse(F)), this.recalculateView();
  }
  recalculateView() {
    var v = Ae.identity();
    Ae.translate(v, this.target, v), Ae.rotateY(v, this.currentXtheta, v), Ae.rotateX(v, this.currentYtheta, v), Ae.translate(v, [0, 0, this.currentDistance], v);
    var z = Ae.multiply(v, [0, 0, 0, 1]);
    let _ = this.target;
    const I = Ae.lookAt(
      [z[0], z[1], z[2]],
      // position
      _,
      // target
      [0, 1, 0]
      // up
    );
    ke.viewMatrix.set(I), ke.invViewMatrix.set(Ae.inverse(I));
  }
  calcMouseVelocity() {
    if (this.isDragging)
      return [0, 0];
    let [v, z] = this.calcPlaneCoord(this.currentHoverX, this.currentHoverY), [_, I] = this.calcPlaneCoord(this.prevHoverX, this.prevHoverY), b = v - _, F = z - I, k = 4;
    return b > k && (b = k), b < -k && (b = -k), F > k && (F = k), F < -k && (F = -k), [b, F, 0, 0];
  }
  calcPlaneCoord(v, z) {
    let _ = v / this.canvas.width, I = z / this.canvas.height, b = 2 * _ - 1, F = (1 - I) * 2 - 1, k = [
      b * Math.tan(this.fov / 2) * (this.canvas.width / this.canvas.height),
      F * Math.tan(this.fov / 2),
      -1
    ];
    return [k[0] * this.currentDistance, k[1] * this.currentDistance];
  }
  setNewPrevMouseCoord() {
    this.prevHoverX = this.currentHoverX, this.prevHoverY = this.currentHoverY;
  }
  stepAngle() {
    this.currentXtheta += 0.012, this.recalculateView();
  }
}
var Pn = `struct Cell {
    vx: i32, 
    vy: i32, 
    vz: i32, 
    mass: i32, 
}

@group(0) @binding(0) var<storage, read_write> cells: array<Cell>;

@compute @workgroup_size(64)
fn clearGrid(@builtin(global_invocation_id) id: vec3<u32>) {
    if (id.x < arrayLength(&cells)) {
        cells[id.x].mass = 0;
        cells[id.x].vx = 0;
        cells[id.x].vy = 0;
        cells[id.x].vz = 0;
    }
}`, Dn = `struct Particle {
    position: vec3f, 
    v: vec3f, 
    C: mat3x3f, 
}
struct Cell {
    vx: atomic<i32>, 
    vy: atomic<i32>, 
    vz: atomic<i32>, 
    mass: atomic<i32>, 
}

override fixedPointMultiplier: f32; 

fn encodeFixedPoint(floatingPoint: f32) -> i32 {
	return i32(floatingPoint * fixedPointMultiplier);
}

@group(0) @binding(0) var<storage, read> particles: array<Particle>;
@group(0) @binding(1) var<storage, read_write> cells: array<Cell>;
@group(0) @binding(2) var<uniform> initBoxSize: vec3f;
@group(0) @binding(3) var<uniform> numParticles: u32;

@compute @workgroup_size(64)
fn p2g_1(@builtin(global_invocation_id) id: vec3<u32>) {
    if (id.x < numParticles) {
        var weights: array<vec3f, 3>;

        let particle = particles[id.x];
        let cellIndex: vec3f = floor(particle.position);
        let cellDiff: vec3f = particle.position - (cellIndex + 0.5f);
        weights[0] = 0.5f * (0.5f - cellDiff) * (0.5f - cellDiff);
        weights[1] = 0.75f - cellDiff * cellDiff;
        weights[2] = 0.5f * (0.5f + cellDiff) * (0.5f + cellDiff);

        let C: mat3x3f = particle.C;

        for (var gx = 0; gx < 3; gx++) {
            for (var gy = 0; gy < 3; gy++) {
                for (var gz = 0; gz < 3; gz++) {
                    let weight: f32 = weights[gx].x * weights[gy].y * weights[gz].z;
                    let cellX: vec3f = vec3f(
                            cellIndex.x + f32(gx) - 1., 
                            cellIndex.y + f32(gy) - 1.,
                            cellIndex.z + f32(gz) - 1.  
                        );
                    let cellDist = (cellX + 0.5f) - particle.position;

                    let Q: vec3f = C * cellDist;

                    let massContrib: f32 = weight * 1.0; 
                    let velContrib: vec3f = massContrib * (particle.v + Q);
                    let cellIndex1D: i32 = 
                        i32(cellX.x) * i32(initBoxSize.y) * i32(initBoxSize.z) + 
                        i32(cellX.y) * i32(initBoxSize.z) + 
                        i32(cellX.z);
                    atomicAdd(&cells[cellIndex1D].mass, encodeFixedPoint(massContrib));
                    atomicAdd(&cells[cellIndex1D].vx, encodeFixedPoint(velContrib.x));
                    atomicAdd(&cells[cellIndex1D].vy, encodeFixedPoint(velContrib.y));
                    atomicAdd(&cells[cellIndex1D].vz, encodeFixedPoint(velContrib.z));
                }
            }
        }
    }
}`, Mn = `struct Particle {
    position: vec3f, 
    v: vec3f, 
    C: mat3x3f, 
}
struct Cell {
    vx: atomic<i32>, 
    vy: atomic<i32>, 
    vz: atomic<i32>, 
    mass: i32, 
}

override fixedPointMultiplier: f32; 
override fixedPointMultiplierInverse: f32; 
override stiffness: f32;
override restDensity: f32;
override dynamicViscosity: f32;

fn encodeFixedPoint(floatingPoint: f32) -> i32 {
	return i32(floatingPoint * fixedPointMultiplier);
}
fn decodeFixedPoint(fixedPoint: i32) -> f32 {
	return f32(fixedPoint) * fixedPointMultiplierInverse;
}

@group(0) @binding(0) var<storage, read> particles: array<Particle>;
@group(0) @binding(1) var<storage, read_write> cells: array<Cell>;
@group(0) @binding(2) var<uniform> initBoxSize: vec3f;
@group(0) @binding(3) var<uniform> numParticles: u32;
@group(0) @binding(4) var<storage, read_write> densities: array<f32>;
@group(0) @binding(5) var<uniform> dt: f32;

@compute @workgroup_size(64)
fn p2g_2(@builtin(global_invocation_id) id: vec3<u32>) {
    if (id.x < numParticles) {
        var weights: array<vec3f, 3>;

        let particle = particles[id.x];
        let cellIndex: vec3f = floor(particle.position);
        let cellDiff: vec3f = particle.position - (cellIndex + 0.5f);
        weights[0] = 0.5f * (0.5f - cellDiff) * (0.5f - cellDiff);
        weights[1] = 0.75f - cellDiff * cellDiff;
        weights[2] = 0.5f * (0.5f + cellDiff) * (0.5f + cellDiff);

        var density: f32 = 0.;
        for (var gx = 0; gx < 3; gx++) {
            for (var gy = 0; gy < 3; gy++) {    
                for (var gz = 0; gz < 3; gz++) {
                    let weight: f32 = weights[gx].x * weights[gy].y * weights[gz].z;
                    let cellX: vec3f = vec3f(
                            cellIndex.x + f32(gx) - 1., 
                            cellIndex.y + f32(gy) - 1.,
                            cellIndex.z + f32(gz) - 1.  
                        );
                    let cellIndex1D: i32 = 
                        i32(cellX.x) * i32(initBoxSize.y) * i32(initBoxSize.z) + 
                        i32(cellX.y) * i32(initBoxSize.z) + 
                        i32(cellX.z);
                    density += decodeFixedPoint(cells[cellIndex1D].mass) * weight;
                }
            }
        }

        let volume: f32 = 1.0 / density; 
        densities[id.x] = density;

        let pressure: f32 = max(-0.0, stiffness * (pow(density / restDensity, 1.) - 1));

        var stress: mat3x3f = mat3x3f(-pressure, 0, 0, 0, -pressure, 0, 0, 0, -pressure);
        let dudv: mat3x3f = particle.C;
        let strain: mat3x3f = dudv + transpose(dudv);
        stress += dynamicViscosity * strain;

        let eq_16_term0 = -volume * 4 * stress * dt;

        for (var gx = 0; gx < 3; gx++) {
            for (var gy = 0; gy < 3; gy++) {
                for (var gz = 0; gz < 3; gz++) {
                    let weight: f32 = weights[gx].x * weights[gy].y * weights[gz].z;
                    let cellX: vec3f = vec3f(
                            cellIndex.x + f32(gx) - 1., 
                            cellIndex.y + f32(gy) - 1.,
                            cellIndex.z + f32(gz) - 1.  
                        );
                    let cellDist = (cellX + 0.5f) - particle.position;
                    let cellIndex1D: i32 = 
                        i32(cellX.x) * i32(initBoxSize.y) * i32(initBoxSize.z) + 
                        i32(cellX.y) * i32(initBoxSize.z) + 
                        i32(cellX.z);
                    let momentum: vec3f = eq_16_term0 * weight * cellDist;
                    atomicAdd(&cells[cellIndex1D].vx, encodeFixedPoint(momentum.x));
                    atomicAdd(&cells[cellIndex1D].vy, encodeFixedPoint(momentum.y));
                    atomicAdd(&cells[cellIndex1D].vz, encodeFixedPoint(momentum.z));
                }
            }
        }
    }
}`, zn = `struct Cell {
    vx: i32, 
    vy: i32, 
    vz: i32, 
    mass: i32, 
}
struct RenderUniforms {
    texelSize: vec2f, 
    sphereSize: f32, 
    invProjectionMatrix: mat4x4f, 
    projectionMatrix: mat4x4f, 
    viewMatrix: mat4x4f, 
    invViewMatrix: mat4x4f, 
}
struct MouseInfo {
    screenSize: vec2f, 
    mouseCoord : vec2f, 
    mouseVel : vec2f, 
    mouseRadius: f32, 
}

override fixedPointMultiplier: f32; 
override fixedPointMultiplierInverse: f32; 

@group(0) @binding(0) var<storage, read_write> cells: array<Cell>;
@group(0) @binding(1) var<uniform> realBoxSize: vec3f;
@group(0) @binding(2) var<uniform> initBoxSize: vec3f;
@group(0) @binding(3) var<uniform> uniforms: RenderUniforms;
@group(0) @binding(4) var depthTexture: texture_2d<f32>;
@group(0) @binding(5) var<uniform> mouseInfo: MouseInfo; 
@group(0) @binding(6) var<uniform> dt: f32; 

fn encodeFixedPoint(floatingPoint: f32) -> i32 {
	return i32(floatingPoint * fixedPointMultiplier);
}
fn decodeFixedPoint(fixedPoint: i32) -> f32 {
	return f32(fixedPoint) * fixedPointMultiplierInverse;
}

fn computeViewPosFromUVDepth(tex_coord: vec2f, depth: f32) -> vec3f {
    var ndc: vec4f = vec4f(tex_coord.x * 2.0 - 1.0, 1.0 - 2.0 * tex_coord.y, 0.0, 1.0);
    ndc.z = -uniforms.projectionMatrix[2].z + uniforms.projectionMatrix[3].z / depth;
    ndc.w = 1.0;

    var eye_pos: vec4f = uniforms.invProjectionMatrix * ndc;

    return eye_pos.xyz / eye_pos.w;
}

fn getViewPosFromTexCoord(tex_coord: vec2f, iuv: vec2f) -> vec3f {
    var depth: f32 = abs(textureLoad(depthTexture, vec2u(iuv), 0).x);
    return computeViewPosFromUVDepth(tex_coord, depth);
}

@compute @workgroup_size(64)
fn updateGrid(@builtin(global_invocation_id) id: vec3<u32>) {
    if (id.x < arrayLength(&cells)) { 
        let uv: vec2f = mouseInfo.mouseCoord;
        let iuv = uv * mouseInfo.screenSize;
        let depth: f32 = abs(textureLoad(depthTexture, vec2u(iuv), 0).x);
        var mouseCellIndex: u32 = 1000000000; 
        var cellSquareDistToMouse: f32 = 1e9;
        var forceDir = vec3f(0.);

        if (depth < 1e4) {
            let mouseViewPos = getViewPosFromTexCoord(uv, iuv);
            let mouseWorldPos = uniforms.invViewMatrix * vec4f(mouseViewPos, 1.); 
            let mouseCellPos: vec3i = vec3i(floor(mouseWorldPos).xyz);
            mouseCellIndex =    u32(mouseCellPos.x) * u32(initBoxSize.y) * u32(initBoxSize.z) + 
                                u32(mouseCellPos.y) * u32(initBoxSize.z) + 
                                u32(mouseCellPos.z);
            let center = realBoxSize / 2;
            forceDir = select(vec3f(0.), (uniforms.invViewMatrix * vec4f(mouseInfo.mouseVel, 0.0, 0)).xyz, dot(mouseInfo.mouseVel, mouseInfo.mouseVel) > 0.);
            var x: f32 = f32(i32(id.x) / i32(initBoxSize.z) / i32(initBoxSize.y));
            var y: f32 = f32((i32(id.x) / i32(initBoxSize.z)) % i32(initBoxSize.y));
            var z: f32 = f32(i32(id.x) % i32(initBoxSize.z));
            let cellPos = vec3f(x, y, z);
            let diff = floor(mouseWorldPos).xyz - cellPos;
            cellSquareDistToMouse = dot(diff, diff);
        }

        let dt = dt;
        let r = mouseInfo.mouseRadius;

        if (cells[id.x].mass > 0) { 
            var floatV: vec3f = vec3f(
                decodeFixedPoint(cells[id.x].vx), 
                decodeFixedPoint(cells[id.x].vy), 
                decodeFixedPoint(cells[id.x].vz)
            );
            floatV /= decodeFixedPoint(cells[id.x].mass);

            let strength = smoothstep(r*r, 0., cellSquareDistToMouse) * 0.2;   
            cells[id.x].vx = encodeFixedPoint(floatV.x + strength * forceDir.x); 
            cells[id.x].vy = encodeFixedPoint(floatV.y + strength * forceDir.y - 0.40 * dt); 
            cells[id.x].vz = encodeFixedPoint(floatV.z + strength * forceDir.z); 

            var x: i32 = i32(id.x) / i32(initBoxSize.z) / i32(initBoxSize.y);
            var y: i32 = (i32(id.x) / i32(initBoxSize.z)) % i32(initBoxSize.y);
            var z: i32 = i32(id.x) % i32(initBoxSize.z);
            if (x < 2 || x > i32(ceil(realBoxSize.x) - 3)) { cells[id.x].vx = 0; } 
            if (y < 2 || y > i32(ceil(realBoxSize.y) - 3)) { cells[id.x].vy = 0; }
            if (z < 2 || z > i32(ceil(realBoxSize.z) - 3)) { cells[id.x].vz = 0; }
        }
    }
}`, bn = `struct Particle {
    position: vec3f, 
    v: vec3f, 
    C: mat3x3f, 
}
struct Cell {
    vx: i32, 
    vy: i32, 
    vz: i32, 
    mass: i32, 
}

override fixedPointMultiplierInverse: f32; 

@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(1) var<storage, read> cells: array<Cell>;
@group(0) @binding(2) var<uniform> realBoxSize: vec3f;
@group(0) @binding(3) var<uniform> initBoxSize: vec3f;
@group(0) @binding(4) var<uniform> numParticles: u32;
@group(0) @binding(5) var<uniform> dt: f32;

fn decodeFixedPoint(fixedPoint: i32) -> f32 {
	return f32(fixedPoint) * fixedPointMultiplierInverse;
}

@compute @workgroup_size(64)
fn g2p(@builtin(global_invocation_id) id: vec3<u32>) {
    if (id.x < numParticles) {
        particles[id.x].v = vec3f(0.);
        var weights: array<vec3f, 3>;

        let particle = particles[id.x];
        let cellIndex: vec3f = floor(particle.position);
        let cellDiff: vec3f = particle.position - (cellIndex + 0.5f);
        weights[0] = 0.5f * (0.5f - cellDiff) * (0.5f - cellDiff);
        weights[1] = 0.75f - cellDiff * cellDiff;
        weights[2] = 0.5f * (0.5f + cellDiff) * (0.5f + cellDiff);

        var B: mat3x3f = mat3x3f(vec3f(0.), vec3f(0.), vec3f(0.));
        for (var gx = 0; gx < 3; gx++) {
            for (var gy = 0; gy < 3; gy++) {
                for (var gz = 0; gz < 3; gz++) {
                    let weight: f32 = weights[gx].x * weights[gy].y * weights[gz].z;
                    let cellX: vec3f = vec3f(
                        cellIndex.x + f32(gx) - 1., 
                        cellIndex.y + f32(gy) - 1.,
                        cellIndex.z + f32(gz) - 1.  
                    );
                    let cellDist: vec3f = (cellX + 0.5f) - particle.position;
                    let cellIndex1D: i32 = 
                        i32(cellX.x) * i32(initBoxSize.y) * i32(initBoxSize.z) + 
                        i32(cellX.y) * i32(initBoxSize.z) + 
                        i32(cellX.z);
                    let weighted_velocity: vec3f = vec3f(
                        decodeFixedPoint(cells[cellIndex1D].vx), 
                        decodeFixedPoint(cells[cellIndex1D].vy), 
                        decodeFixedPoint(cells[cellIndex1D].vz)
                    ) * weight;
                    let term: mat3x3f = mat3x3f(
                        weighted_velocity * cellDist.x, 
                        weighted_velocity * cellDist.y, 
                        weighted_velocity * cellDist.z
                    );

                    B += term;

                    particles[id.x].v += weighted_velocity;
                }
            }
        }

        particles[id.x].C = B * 4.0f;
        particles[id.x].position += particles[id.x].v * dt;
        particles[id.x].position = vec3f(
            clamp(particles[id.x].position.x, 1., realBoxSize.x - 2.), 
            clamp(particles[id.x].position.y, 1., realBoxSize.y - 2.), 
            clamp(particles[id.x].position.z, 1., realBoxSize.z - 2.)
        );

        let center = vec3f(realBoxSize.x / 2, realBoxSize.y / 2, realBoxSize.z / 2);
        let dist = center - particles[id.x].position;
        let dirToOrigin = normalize(dist);
        var rForce = vec3f(0);

        
        let k = 2.0;
        let wallStiffness = 1.0;
        let x_n: vec3f = particles[id.x].position + particles[id.x].v * dt * k;
        let wallMin: vec3f = vec3f(3.);
        let wallMax: vec3f = realBoxSize - 4.;
        if (x_n.x < wallMin.x) { particles[id.x].v.x += wallStiffness * (wallMin.x - x_n.x); }
        if (x_n.x > wallMax.x) { particles[id.x].v.x += wallStiffness * (wallMax.x - x_n.x); }
        if (x_n.y < wallMin.y) { particles[id.x].v.y += wallStiffness * (wallMin.y - x_n.y); }
        if (x_n.y > wallMax.y) { particles[id.x].v.y += wallStiffness * (wallMax.y - x_n.y); }
        if (x_n.z < wallMin.z) { particles[id.x].v.z += wallStiffness * (wallMin.z - x_n.z); }
        if (x_n.z > wallMax.z) { particles[id.x].v.z += wallStiffness * (wallMax.z - x_n.z); }
    }
}`, Bn = `struct Particle {
    position: vec3f, 
    v: vec3f, 
    C: mat3x3f, 
}

struct PosVel {
    position: vec3f, 
    v: vec3f, 
}

@group(0) @binding(0) var<storage, read> particles: array<Particle>;
@group(0) @binding(1) var<storage, read_write> posvel: array<PosVel>;
@group(0) @binding(2) var<uniform> numParticles: u32;

@compute @workgroup_size(64)
fn copyPosition(@builtin(global_invocation_id) id: vec3<u32>) {
    if (id.x < numParticles) { 
        posvel[id.x].position = particles[id.x].position;
        posvel[id.x].v = particles[id.x].v;
    }
}`, Tn = `@group(0) @binding(0) var<storage, read> particles: array<Particle>;
@group(0) @binding(1) var<storage, read> densities: array<f32>;
@group(0) @binding(2) var<uniform> numParticles: u32;
@group(0) @binding(3) var<storage, read_write> densityGrid: array<atomic<i32>>;
@group(0) @binding(4) var<uniform> densityGridSize: vec3f;

struct Particle {
    position: vec3f, 
    v: vec3f, 
    C: mat3x3f, 
}

override densityFixedPointMultiplier: f32; 

fn encodeFixedPoint(floatingPoint: f32) -> i32 {
	return i32(floatingPoint * densityFixedPointMultiplier);
}

@compute @workgroup_size(64)
fn p2gDensity(@builtin(global_invocation_id) id: vec3<u32>) {
    if (id.x < numParticles) {
        var weights: array<vec3f, 3>;
        let particle = particles[id.x];
        let cellIndex: vec3f = floor(particle.position);
        let cellDiff: vec3f = particle.position - (cellIndex + 0.5f);
        weights[0] = 0.5f * (0.5f - cellDiff) * (0.5f - cellDiff);
        weights[1] = 0.75f - cellDiff * cellDiff;
        weights[2] = 0.5f * (0.5f + cellDiff) * (0.5f + cellDiff);

        for (var gx = 0; gx < 3; gx++) {
            for (var gy = 0; gy < 3; gy++) {
                for (var gz = 0; gz < 3; gz++) {
                    let weight: f32 = weights[gx].x * weights[gy].y * weights[gz].z;
                    let cellX: vec3f = vec3f(
                            cellIndex.x + f32(gx) - 1., 
                            cellIndex.y + f32(gy) - 1.,
                            cellIndex.z + f32(gz) - 1.  
                        );
                    let cellIndex1D: i32 = 
                        i32(cellX.x) * i32(densityGridSize.y) * i32(densityGridSize.z) + 
                        i32(cellX.y) * i32(densityGridSize.z) + 
                        i32(cellX.z);
                    atomicAdd(&densityGrid[cellIndex1D], encodeFixedPoint(densities[id.x] * weight));
                }
            }
        }
    }
}`, Gn = `@group(0) @binding(0) var<storage, read_write> densityGrid: array<i32>;
@group(0) @binding(1) var<storage, read_write> castedDensityGrid: array<i32>;

@compute @workgroup_size(64)
fn clearDensityGrid(@builtin(global_invocation_id) id: vec3<u32>) {
    if (id.x < arrayLength(&castedDensityGrid)) {
        densityGrid[2 * id.x] = 0;
        densityGrid[2 * id.x + 1] = 0;
        castedDensityGrid[id.x] = 0;
    }
}`, Sn = `@group(0) @binding(0) var<storage, read> densityGrid: array<i32>;
@group(0) @binding(1) var<storage, read_write> castedDensityGrid: array<u32>;

override fixedPointMultiplierInverse: f32; 

fn decodeFixedPoint(fixedPoint: i32) -> f32 {
	return f32(fixedPoint) * fixedPointMultiplierInverse;
}

@compute @workgroup_size(64)
fn clearDensityGrid(@builtin(global_invocation_id) id: vec3<u32>) {
    if (id.x < arrayLength(&castedDensityGrid)) {
        let d0: f32 = decodeFixedPoint(densityGrid[2 * id.x]);
        let d1: f32 = decodeFixedPoint(densityGrid[2 * id.x + 1]);
        
        
        let d01: u32 = pack2x16float(vec2f(d0, d1));
        castedDensityGrid[id.x] = d01;
    }
}`;
const Ye = 80;
class Vn {
  constructor(v, z, _, I, b, F, k, T, B, Z, N, ne, te, fe) {
    M(this, "cellStructSize", 16);
    M(this, "realBoxSizeBuffer");
    M(this, "numParticlesBuffer");
    M(this, "densityBuffer");
    M(this, "mouseInfoUniformBuffer");
    M(this, "sphereRadiusBuffer");
    M(this, "initBoxSizeBuffer");
    M(this, "numParticles", 0);
    M(this, "gridCount", 0);
    M(this, "maxGridCount", 0);
    M(this, "maxParticleCount", 0);
    M(this, "densityGridCount", 0);
    M(this, "clearGridPipeline");
    M(this, "clearDensityGridPipeline");
    M(this, "castDensityGridPipeline");
    M(this, "p2g1Pipeline");
    M(this, "p2g2Pipeline");
    M(this, "p2gDensityPipeline");
    M(this, "updateGridPipeline");
    M(this, "g2pPipeline");
    M(this, "copyPositionPipeline");
    M(this, "clearGridBindGroup");
    M(this, "clearDensityGridBindGroup");
    M(this, "castDensityGridBindGroup");
    M(this, "p2g1BindGroup");
    M(this, "p2g2BindGroup");
    M(this, "p2gDensityBindGroup");
    M(this, "updateGridBindGroup");
    M(this, "g2pBindGroup");
    M(this, "copyPositionBindGroup");
    M(this, "particleBuffer");
    M(this, "dtBuffer");
    M(this, "densityGridBuffer");
    M(this, "device");
    M(this, "renderDiameter");
    M(this, "frameCount");
    M(this, "spawned");
    M(this, "mouseInfoValues", new ArrayBuffer(32));
    M(this, "mouseInfoViews", {
      screenSize: new Float32Array(this.mouseInfoValues, 0, 2),
      mouseCoord: new Float32Array(this.mouseInfoValues, 8, 2),
      mouseVel: new Float32Array(this.mouseInfoValues, 16, 2),
      mouseRadius: new Float32Array(this.mouseInfoValues, 24, 1)
    });
    M(this, "restDensity");
    this.device = T, this.renderDiameter = fe, this.frameCount = 0, this.spawned = !1, this.numParticles = 0, this.maxGridCount = N, this.maxParticleCount = ne, this.initBoxSizeBuffer = F;
    const ae = T.createShaderModule({ code: Pn }), ue = T.createShaderModule({ code: Gn }), ie = T.createShaderModule({ code: Sn }), $ = T.createShaderModule({ code: Dn }), H = T.createShaderModule({ code: Mn }), L = T.createShaderModule({ code: Tn }), re = T.createShaderModule({ code: zn }), K = T.createShaderModule({ code: bn }), Q = T.createShaderModule({ code: Bn });
    this.restDensity = 3;
    const j = {
      stiffness: 50,
      restDensity: this.restDensity,
      dynamicViscosity: 0.1,
      fixedPointMultiplier: te,
      fixedPointMultiplierInverse: 1 / te
    };
    this.clearGridPipeline = T.createComputePipeline({
      label: "clear grid pipeline",
      layout: "auto",
      compute: {
        module: ae
      }
    }), this.clearDensityGridPipeline = T.createComputePipeline({
      label: "clear density grid pipeline",
      layout: "auto",
      compute: {
        module: ue
      }
    }), this.castDensityGridPipeline = T.createComputePipeline({
      label: "cast density grid pipeline",
      layout: "auto",
      compute: {
        module: ie,
        constants: {
          fixedPointMultiplierInverse: j.fixedPointMultiplierInverse
        }
      }
    }), this.p2g1Pipeline = T.createComputePipeline({
      label: "p2g 1 pipeline",
      layout: "auto",
      compute: {
        module: $,
        constants: {
          fixedPointMultiplier: j.fixedPointMultiplier
        }
      }
    }), this.p2g2Pipeline = T.createComputePipeline({
      label: "p2g 2 pipeline",
      layout: "auto",
      compute: {
        module: H,
        constants: {
          fixedPointMultiplier: j.fixedPointMultiplier,
          fixedPointMultiplierInverse: j.fixedPointMultiplierInverse,
          stiffness: j.stiffness,
          restDensity: j.restDensity,
          dynamicViscosity: j.dynamicViscosity
        }
      }
    }), this.p2gDensityPipeline = T.createComputePipeline({
      label: "p2g density pipeline",
      layout: "auto",
      compute: {
        module: L,
        constants: {
          densityFixedPointMultiplier: j.fixedPointMultiplier
        }
      }
    }), this.updateGridPipeline = T.createComputePipeline({
      label: "update grid pipeline",
      layout: "auto",
      compute: {
        module: re,
        constants: {
          fixedPointMultiplier: j.fixedPointMultiplier,
          fixedPointMultiplierInverse: j.fixedPointMultiplierInverse
        }
      }
    }), this.g2pPipeline = T.createComputePipeline({
      label: "g2p pipeline",
      layout: "auto",
      compute: {
        module: K,
        constants: {
          fixedPointMultiplierInverse: j.fixedPointMultiplierInverse
        }
      }
    }), this.copyPositionPipeline = T.createComputePipeline({
      label: "copy position pipeline",
      layout: "auto",
      compute: {
        module: Q
      }
    });
    const C = T.createBuffer({
      label: "cells buffer",
      size: this.cellStructSize * N,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    this.densityBuffer = T.createBuffer({
      label: "density buffer",
      size: 4 * ne,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    }), this.realBoxSizeBuffer = T.createBuffer({
      label: "real box size buffer",
      size: 12,
      // 3 x f32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.numParticlesBuffer = T.createBuffer({
      label: "number of particles buffer",
      size: 4,
      // 1 x f32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.mouseInfoUniformBuffer = T.createBuffer({
      label: "mouse info buffer",
      size: this.mouseInfoValues.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.sphereRadiusBuffer = T.createBuffer({
      label: "sphere radius buffer",
      size: 4,
      // 1 x f32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.dtBuffer = T.createBuffer({
      label: "dt buffer",
      size: 4,
      // 1 x f32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.mouseInfoViews.screenSize.set([Z.width, Z.height]), this.device.queue.writeBuffer(this.mouseInfoUniformBuffer, 0, this.mouseInfoValues), this.clearGridBindGroup = T.createBindGroup({
      layout: this.clearGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: C } }
      ]
    }), this.clearDensityGridBindGroup = T.createBindGroup({
      layout: this.clearDensityGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: I } },
        { binding: 1, resource: { buffer: b } }
      ]
    }), this.castDensityGridBindGroup = T.createBindGroup({
      layout: this.castDensityGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: I } },
        { binding: 1, resource: { buffer: b } }
      ]
    }), this.p2g1BindGroup = T.createBindGroup({
      layout: this.p2g1Pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: C } },
        { binding: 2, resource: { buffer: F } },
        { binding: 3, resource: { buffer: this.numParticlesBuffer } }
      ]
    }), this.p2g2BindGroup = T.createBindGroup({
      layout: this.p2g2Pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: C } },
        { binding: 2, resource: { buffer: F } },
        { binding: 3, resource: { buffer: this.numParticlesBuffer } },
        { binding: 4, resource: { buffer: this.densityBuffer } },
        { binding: 5, resource: { buffer: this.dtBuffer } }
      ]
    }), this.p2gDensityBindGroup = T.createBindGroup({
      layout: this.p2gDensityPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: this.densityBuffer } },
        { binding: 2, resource: { buffer: this.numParticlesBuffer } },
        { binding: 3, resource: { buffer: I } },
        { binding: 4, resource: { buffer: k } }
      ]
    }), this.updateGridBindGroup = T.createBindGroup({
      layout: this.updateGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: C } },
        { binding: 1, resource: { buffer: this.realBoxSizeBuffer } },
        { binding: 2, resource: { buffer: F } },
        { binding: 3, resource: { buffer: _ } },
        { binding: 4, resource: B },
        { binding: 5, resource: { buffer: this.mouseInfoUniformBuffer } },
        { binding: 6, resource: { buffer: this.dtBuffer } }
      ]
    }), this.g2pBindGroup = T.createBindGroup({
      layout: this.g2pPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: C } },
        { binding: 2, resource: { buffer: this.realBoxSizeBuffer } },
        { binding: 3, resource: { buffer: F } },
        { binding: 4, resource: { buffer: this.numParticlesBuffer } },
        { binding: 5, resource: { buffer: this.dtBuffer } }
      ]
    }), this.copyPositionBindGroup = T.createBindGroup({
      layout: this.copyPositionPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: z } },
        { binding: 2, resource: { buffer: this.numParticlesBuffer } }
      ]
    }), this.particleBuffer = v, this.densityGridBuffer = I;
  }
  initDambreak(v, z) {
    let _ = new ArrayBuffer(Ye * this.maxParticleCount);
    const I = 0.9;
    this.numParticles = 0, v[0] / 2, v[0] / 2, v[2] / 2;
    for (let T = 3; T < v[1] * 0.8 && this.numParticles < z; T += I)
      for (let B = v[0] * 0.25; B < v[0] - 4 && this.numParticles < z; B += I)
        for (let Z = 3; Z < v[2] / 2 && this.numParticles < z; Z += I) {
          const N = Ye * this.numParticles, ne = {
            position: new Float32Array(_, N + 0, 3),
            v: new Float32Array(_, N + 16, 3),
            C: new Float32Array(_, N + 32, 12)
          }, te = 0.5 * Math.random();
          ne.position.set([B + te, T + te, Z + te]), this.numParticles++;
        }
    console.log(this.numParticles), this.numParticles < z && console.log("warning: actual number of particles is smaller than the specified number. make bounding box larger.");
    let b = new ArrayBuffer(Ye * this.numParticles);
    const F = new Uint8Array(_), k = new Uint8Array(b);
    return k.set(F.subarray(0, k.length)), b;
  }
  reset(v, z) {
    if (this.gridCount = Math.ceil(v[0]) * Math.ceil(v[1]) * Math.ceil(v[2]), this.gridCount > this.maxGridCount)
      throw new Error("gridCount should be equal to or less than maxGridCount");
    this.densityGridCount = this.gridCount;
    const _ = new Float32Array(v);
    this.device.queue.writeBuffer(this.initBoxSizeBuffer, 0, _), this.frameCount = 0;
    let I = this.initDambreak(v, z);
    this.device.queue.writeBuffer(this.particleBuffer, 0, I), this.changeBoxSize(v), this.changeNumParticles(this.numParticles);
  }
  execute(v, z, _, I, b, F, k, T) {
    const B = v.beginComputePass();
    this.mouseInfoViews.mouseCoord.set([z[0], z[1]]), this.mouseInfoViews.mouseVel.set([_[0], _[1]]), this.mouseInfoViews.mouseRadius.set([I]), this.device.queue.writeBuffer(this.mouseInfoUniformBuffer, 0, this.mouseInfoValues);
    const Z = new Float32Array([F]);
    if (this.device.queue.writeBuffer(this.dtBuffer, 0, Z), b) {
      if (k)
        for (let ne = 0; ne < 1; ne++)
          B.setBindGroup(0, this.clearGridBindGroup), B.setPipeline(this.clearGridPipeline), B.dispatchWorkgroups(Math.ceil(this.gridCount / 64)), B.setBindGroup(0, this.p2g1BindGroup), B.setPipeline(this.p2g1Pipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), B.setBindGroup(0, this.p2g2BindGroup), B.setPipeline(this.p2g2Pipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), B.setBindGroup(0, this.updateGridBindGroup), B.setPipeline(this.updateGridPipeline), B.dispatchWorkgroups(Math.ceil(this.gridCount / 64)), B.setBindGroup(0, this.g2pBindGroup), B.setPipeline(this.g2pPipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
      let N = T[0] * T[1] * T[2];
      B.setBindGroup(0, this.clearDensityGridBindGroup), B.setPipeline(this.clearDensityGridPipeline), B.dispatchWorkgroups(Math.ceil(N / 2 / 64)), B.setBindGroup(0, this.p2gDensityBindGroup), B.setPipeline(this.p2gDensityPipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), B.setBindGroup(0, this.castDensityGridBindGroup), B.setPipeline(this.castDensityGridPipeline), B.dispatchWorkgroups(Math.ceil(N / 2 / 64)), B.setBindGroup(0, this.copyPositionBindGroup), B.setPipeline(this.copyPositionPipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
    } else if (k) {
      for (let N = 0; N < 1; N++)
        B.setBindGroup(0, this.clearGridBindGroup), B.setPipeline(this.clearGridPipeline), B.dispatchWorkgroups(Math.ceil(this.gridCount / 64)), B.setBindGroup(0, this.p2g1BindGroup), B.setPipeline(this.p2g1Pipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), B.setBindGroup(0, this.p2g2BindGroup), B.setPipeline(this.p2g2Pipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), B.setBindGroup(0, this.updateGridBindGroup), B.setPipeline(this.updateGridPipeline), B.dispatchWorkgroups(Math.ceil(this.gridCount / 64)), B.setBindGroup(0, this.g2pBindGroup), B.setPipeline(this.g2pPipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
      B.setBindGroup(0, this.copyPositionBindGroup), B.setPipeline(this.copyPositionPipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
    }
    B.end(), this.frameCount++;
  }
  changeBoxSize(v) {
    const z = new Float32Array(v);
    this.device.queue.writeBuffer(this.realBoxSizeBuffer, 0, z);
  }
  changeNumParticles(v) {
    const z = new Int32Array([v]);
    this.device.queue.writeBuffer(this.numParticlesBuffer, 0, z), this.numParticles = v;
  }
}
var _n = `@group(0) @binding(1) var depthTexture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> uniforms: FilterUniforms;

struct FragmentInput {
    @location(0) uv: vec2f,  
    @location(1) iuv: vec2f
}

override projectedParticleConstant: f32; 
override maxFilterSize: f32;
override blur2D: u32;

struct FilterUniforms {
    blurDir: vec2f,
}

@fragment
fn fs(input: FragmentInput) -> @location(0) vec4f {
    let depth: f32 = abs(textureLoad(depthTexture, vec2u(input.iuv), 0).r);

    if (depth >= 1e4) {
        return vec4f(vec3f(depth), 1.);
    }

    let filterSize: i32 = min(i32(maxFilterSize), i32(ceil(projectedParticleConstant / depth)));

    let sigma: f32 = f32(filterSize) / 2.0; 
    let sigmaSquareInv: f32 = 1.0 / (2.0 * sigma * sigma);

    let mu = 3. * 0.6; 
    let depthThreshold = 10.0 * 0.6;

    let higherDepthBound = depth + mu;

    var sum: f32 = depth;
    var wsum: f32 = 1.0;
    
    if (blur2D == 0) {
        var sum2 = vec2f(0, 0);
        var wsum2 = vec2f(0, 0);
        var depthThresholdLowX = depth - depthThreshold;
        var depthThresholdHighX = depth + depthThreshold;
        var depthThresholdLowY = depth - depthThreshold;
        var depthThresholdHighY = depth + depthThreshold;
        for (var r: i32 = 1; r <= filterSize; r++) {
            var gaussianWeight: f32 = exp(-f32(r * r) * sigmaSquareInv);
            var sampledDepthX: f32 = abs(textureLoad(depthTexture, vec2u(input.iuv - vec2f(f32(r)) * uniforms.blurDir), 0).r);
            var sampledDepthY: f32 = abs(textureLoad(depthTexture, vec2u(input.iuv + vec2f(f32(r)) * uniforms.blurDir), 0).r);

            var w = vec2f(gaussianWeight);

            if (sampledDepthX < depthThresholdLowX) {
                w.x = 0.;
                w.y = 0.; 
            } else {
                if (sampledDepthX > depthThresholdHighX) {
                    sampledDepthX = higherDepthBound;
                } else {
                    depthThresholdLowX = min(depthThresholdLowX, sampledDepthX - depthThreshold);
                    depthThresholdHighX = max(depthThresholdHighX, sampledDepthX + depthThreshold);
                }
            }

            if (sampledDepthY < depthThresholdLowY) {
                w.x = 0.;
                w.y = 0.; 
            } else {
                if (sampledDepthY > depthThresholdHighY) {
                    sampledDepthY = higherDepthBound;
                } else {
                    depthThresholdLowY = min(depthThresholdLowY, sampledDepthY - depthThreshold);
                    depthThresholdHighY = max(depthThresholdHighY, sampledDepthY + depthThreshold);
                }
            }

            sum2 += vec2f(sampledDepthX, sampledDepthY) * w;
            wsum2 += w;
        }
        sum += sum2.x + sum2.y;
        wsum += wsum2.x + wsum2.y;
    } else {
        let filterSize2D = 2;
        var depthThresholdLow = depth - depthThreshold;
        var depthThresholdHigh = depth + depthThreshold;
        var sum4 = vec4f(0.);
        var wsum4 = vec4f(0.);
        for (var r: i32 = 1; r <= filterSize2D; r++) {
            for (var i: i32 = 0; i < 2 * r; i++) {
                let gaussianWeight = exp((-f32(r*r) + f32((r-i) * (r-i))) * sigmaSquareInv);

                var sampledDepthX: f32 = abs(textureLoad(depthTexture, vec2u(input.iuv - vec2f(f32(r), f32(r-i))), 0).r);
                var sampledDepthY: f32 = abs(textureLoad(depthTexture, vec2u(input.iuv + vec2f(f32(r), f32(r-i))), 0).r);
                var sampledDepthZ: f32 = abs(textureLoad(depthTexture, vec2u(input.iuv - vec2f(f32(r-i), f32(r))), 0).r);
                var sampledDepthW: f32 = abs(textureLoad(depthTexture, vec2u(input.iuv + vec2f(f32(r-i), f32(r))), 0).r);

                var w = vec4f(gaussianWeight);

                if (sampledDepthX < depthThresholdLow) {
                    w.x = 0.;
                    w.y = 0.; 
                } else {
                    if (sampledDepthX > depthThresholdHigh) {
                        sampledDepthX = higherDepthBound;
                    } else {
                        depthThresholdLow = min(depthThresholdLow, sampledDepthX - depthThreshold);
                        depthThresholdHigh = max(depthThresholdHigh, sampledDepthX + depthThreshold);
                    }
                }

                if (sampledDepthY < depthThresholdLow) {
                    w.x = 0.;
                    w.y = 0.; 
                } else {
                    if (sampledDepthY > depthThresholdHigh) {
                        sampledDepthY = higherDepthBound;
                    } else {
                        depthThresholdLow = min(depthThresholdLow, sampledDepthY - depthThreshold);
                        depthThresholdHigh = max(depthThresholdHigh, sampledDepthY + depthThreshold);
                    }
                }

                if (sampledDepthZ < depthThresholdLow) {
                    w.z = 0.;
                    w.w = 0.; 
                } else {
                    if (sampledDepthZ > depthThresholdHigh) {
                        sampledDepthZ = higherDepthBound;
                    } else {
                        depthThresholdLow = min(depthThresholdLow, sampledDepthZ - depthThreshold);
                        depthThresholdHigh = max(depthThresholdHigh, sampledDepthZ + depthThreshold);
                    }
                }

                if (sampledDepthW < depthThresholdLow) {
                    w.z = 0.;
                    w.w = 0.; 
                } else {
                    if (sampledDepthW > depthThresholdHigh) {
                        sampledDepthW = higherDepthBound;
                    } else {
                        depthThresholdLow = min(depthThresholdLow, sampledDepthW - depthThreshold);
                        depthThresholdHigh = max(depthThresholdHigh, sampledDepthW + depthThreshold);
                    }
                }

                sum4 += vec4f(sampledDepthX, sampledDepthY, sampledDepthZ, sampledDepthW) * w;
                wsum4 += w;
            }
        }
        sum += sum4.x + sum4.y + sum4.z + sum4.w;
        wsum += wsum4.x + wsum4.y + wsum4.z + wsum4.w;
    }

    return vec4f(sum / wsum, 0., 0., 1.);
}`, Fn = `@group(0) @binding(0) var textureSampler: sampler;
@group(0) @binding(1) var depthTexture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> uniforms: RenderUniforms;
@group(0) @binding(3) var thicknessTexture: texture_2d<f32>;
@group(0) @binding(4) var envmapTexture: texture_cube<f32>;
@group(0) @binding(5) var bgTexture: texture_2d<f32>;
@group(0) @binding(6) var<uniform> diffuseColor: vec3f;
@group(0) @binding(7) var<uniform> density: f32;

struct RenderUniforms {
    texelSize: vec2f, 
    sphereSize: f32, 
    invProjectionMatrix: mat4x4f, 
    projectionMatrix: mat4x4f, 
    viewMatrix: mat4x4f, 
    invViewMatrix: mat4x4f, 
}

struct FragmentInput {
    @location(0) uv: vec2f, 
    @location(1) iuv: vec2f, 
}

fn computeViewPosFromUVDepth(texCoord: vec2f, depth: f32) -> vec3f {
    var ndc: vec4f = vec4f(texCoord.x * 2.0 - 1.0, 1.0 - 2.0 * texCoord.y, 0.0, 1.0);
    ndc.z = -uniforms.projectionMatrix[2].z + uniforms.projectionMatrix[3].z / depth;
    ndc.w = 1.0;

    var eye_pos: vec4f = uniforms.invProjectionMatrix * ndc;

    return eye_pos.xyz / eye_pos.w;
}

fn getViewPosFromTexCoord(texCoord: vec2f, iuv: vec2f) -> vec3f {
    var depth: f32 = abs(textureLoad(depthTexture, vec2u(iuv), 0).x);
    return computeViewPosFromUVDepth(texCoord, depth);
}

fn gamma(v: vec3f) -> vec3f {
    return pow(v, vec3(1.0 / 2.2));
}
fn invGamma(v: vec3f) -> vec3f {
    return pow(v, vec3(2.2));
}

fn calcReflactedTexCoord(surfacePosView: vec3f, refractionDirView: vec3f, thickness: f32) -> vec2f {
    let refractionStrength = 3.;
    let exitPosView: vec3f = surfacePosView + refractionDirView * thickness * refractionStrength;
    let exitPosClip: vec4f = uniforms.projectionMatrix * vec4f(exitPosView, 1.);
    let exitPosNdc: vec3f = exitPosClip.xyz / exitPosClip.w;
    return clamp(vec2f((1. + exitPosNdc.x) / 2., (1. - exitPosNdc.y) / 2.), vec2f(0.), vec2f(1.));
}

fn floorColor(surfacePos: vec3f, refractDir: vec3f) -> vec4f {
    let t = -surfacePos.y / refractDir.y;
    let rayHitPos = surfacePos + t * refractDir;

    let gridSize = 16.0;
    let lineThickness = 0.2; 

    let isLineX = abs(fract(rayHitPos.x / gridSize - 0.5) - 0.5) < lineThickness / gridSize;
    let isLineZ = abs(fract(rayHitPos.z / gridSize - 0.5) - 0.5) < lineThickness / gridSize;
    let isLine = isLineX || isLineZ;

    let boardColor = vec3(0.6); 
    let lineColor = vec3(0.5); 
    let finalColor = select(boardColor, lineColor, isLine);

    return vec4f(finalColor, f32(abs(rayHitPos.x) < 3e2 && abs(rayHitPos.z) < 3e2));
}

@fragment
fn fs(input: FragmentInput) -> @location(0) vec4f {
    let depth: f32 = abs(textureLoad(depthTexture, vec2u(input.iuv), 0).r);
    var thickness = textureSample(thicknessTexture, textureSampler, input.uv).r;

    if (depth >= 1e4) {
        let bgColor: vec3f = textureSampleLevel(bgTexture, textureSampler, input.uv, 0.0).rgb;
        return vec4f(bgColor, 0.);
    }

    let surfacePosView = computeViewPosFromUVDepth(input.uv, depth);
    let surfacePosWorld = (uniforms.invViewMatrix * vec4f(surfacePosView, 1.0)).xyz;
    if (surfacePosWorld.y < 2.0) {
        let bgColor: vec3f = textureSampleLevel(bgTexture, textureSampler, input.uv, 0.0).rgb;
        return vec4f(bgColor, 0.);
    }
    var ddx: vec3f = getViewPosFromTexCoord(input.uv + vec2f(uniforms.texelSize.x, 0.), input.iuv + vec2f(1.0, 0.0)) - surfacePosView; 
    var ddy: vec3f = getViewPosFromTexCoord(input.uv + vec2f(0., uniforms.texelSize.y), input.iuv + vec2f(0.0, 1.0)) - surfacePosView; 
    let ddx2: vec3f = surfacePosView - getViewPosFromTexCoord(input.uv + vec2f(-uniforms.texelSize.x, 0.), input.iuv + vec2f(-1.0, 0.0));
    let ddy2: vec3f = surfacePosView - getViewPosFromTexCoord(input.uv + vec2f(0., -uniforms.texelSize.y), input.iuv + vec2f(0.0, -1.0));
    let maxDeltaZ = max(max(abs(ddx.z), abs(ddy.z)), max(abs(ddx2.z), abs(ddy2.z)));

    ddx = select(ddx, ddx2, abs(ddx.z) > abs(ddx2.z));
    ddy = select(ddy, ddy2, abs(ddy.z) > abs(ddy2.z));

    var normal: vec3f = -normalize(cross(ddx, ddy)); 
    var rayDirView = normalize(surfacePosView);
    var lightDirView = normalize((uniforms.viewMatrix * vec4f(0.2, 0.0, 1, 0.)).xyz);
    var H: vec3f        = normalize(lightDirView - rayDirView);
    var specular: f32   = pow(max(0.0, dot(H, normal)), 300.);
    var diffuse: f32  = max(0.0, dot(lightDirView, normal)) * 1.0;

    var transmittance: vec3f = exp(-density * 10 * thickness * (1.0 - diffuseColor)); 
    var refractionDirView: vec3f = normalize(refract(rayDirView, normal, 1.0 / 1.333));
    var refractionDirWorld: vec3f = normalize((uniforms.invViewMatrix * vec4f(refractionDirView, 0.)).xyz);
    var transmitted = pow(textureSampleLevel(envmapTexture, textureSampler, refractionDirWorld, 0.0).rgb, vec3f(2.2));
    if (refractionDirWorld.y < 0.) {
        let surfacePosWorld = (uniforms.invViewMatrix * vec4f(surfacePosView, 1.)).xyz;
        let floor = floorColor(surfacePosWorld, refractionDirWorld);
        transmitted = select(transmitted, invGamma(floor.rgb), floor.w > 0.5);
    }
    var refractionColor: vec3f = transmitted * transmittance;

    let F0 = 0.02;
    var fresnelBiased: f32 = clamp(F0 + (1.0 - F0) * pow(1.0 - dot(normal, -rayDirView), 5.0) + 0.0, 0., 1.);
    var fresnel: f32 = clamp(F0 + (1.0 - F0) * pow(1.0 - dot(normal, -rayDirView), 5.0), 0., 1.);

    var reflectionDir: vec3f = reflect(rayDirView, normal);
    var reflectionDirWorld: vec3f = (uniforms.invViewMatrix * vec4f(reflectionDir, 0.0)).xyz;
    var reflectionColor: vec3f = invGamma(select(textureSampleLevel(envmapTexture, textureSampler, reflectionDirWorld, 0.).rgb, vec3f(0.75), reflectionDirWorld.y < 0.)); 
    fresnel = select(fresnel, 0.1 * fresnel, reflectionDirWorld.y < 0.);
    fresnelBiased = select(fresnelBiased, 0.1 * fresnelBiased, reflectionDirWorld.y < 0.);

    var finalColor = 0.0     * specular + mix(refractionColor, reflectionColor, fresnel) + 0. * fresnel;

    return vec4f(gamma(finalColor), 1.0);
}`, Un = `struct VertexOutput {
  @builtin(position) position : vec4f,
  @location(0) uv : vec2f,
  @location(1) iuv : vec2f,
}

override screenWidth: f32;
override screenHeight: f32;

@vertex
fn vs(@builtin(vertex_index) vertex_index : u32) -> VertexOutput {
    var out: VertexOutput;

    var pos = array(
        vec2( 1.0,  1.0),
        vec2( 1.0, -1.0),
        vec2(-1.0, -1.0),
        vec2( 1.0,  1.0),
        vec2(-1.0, -1.0),
        vec2(-1.0,  1.0),
    );

    var uv = array(
        vec2(1.0, 0.0),
        vec2(1.0, 1.0),
        vec2(0.0, 1.0),
        vec2(1.0, 0.0),
        vec2(0.0, 1.0),
        vec2(0.0, 0.0),
    );

    out.position = vec4(pos[vertex_index], 0.0, 1.0);
    out.uv = uv[vertex_index];
    out.iuv = out.uv * vec2f(screenWidth, screenHeight);

    return out;
}`, In = `struct RenderUniforms {
    texelSize: vec2f, 
    sphereSize: f32, 
    invProjectionMatrix: mat4x4f, 
    projectionMatrix: mat4x4f, 
    viewMatrix: mat4x4f, 
    invViewMatrix: mat4x4f, 
}

struct VertexOutput {
    @builtin(position) position: vec4f, 
    @location(0) uv: vec2f, 
}

struct FragmentInput {
    @location(0) uv: vec2f, 
}

struct PosVel {
    position: vec3f, 
    v: vec3f, 
}

@group(0) @binding(0) var<storage> particles: array<PosVel>;
@group(0) @binding(1) var<uniform> uniforms: RenderUniforms;

@vertex
fn vs(    
    @builtin(vertex_index) vertex_index: u32, 
    @builtin(instance_index) instance_index: u32
) -> VertexOutput {
    var corner_positions = array(
        vec2( 0.5,  0.5),
        vec2( 0.5, -0.5),
        vec2(-0.5, -0.5),
        vec2( 0.5,  0.5),
        vec2(-0.5, -0.5),
        vec2(-0.5,  0.5),
    );

    var size = uniforms.sphereSize;
    let stretched_position = corner_positions[vertex_index] * size;
    let corner = vec3(stretched_position, 0.0);

    let uv = corner_positions[vertex_index] + 0.5;

    let real_position = particles[instance_index].position;
    let view_position = (uniforms.viewMatrix * vec4f(real_position, 1.0)).xyz;

    let out_position = uniforms.projectionMatrix * vec4f(view_position + corner, 1.0);

    return VertexOutput(out_position, uv);
}

@fragment
fn fs(input: FragmentInput) -> @location(0) vec4f {
    var normalxy: vec2f = input.uv * 2.0 - 1.0;
    var r2: f32 = dot(normalxy, normalxy);
    if (r2 > 1.0) {
        discard;
    }
    var thickness: f32 = sqrt(1.0 - r2);
    let particle_alpha = 0.05;

    return vec4f(vec3f(particle_alpha * thickness), 1.0);
}`, An = `@group(0) @binding(0) var textureSampler: sampler;
@group(0) @binding(1) var texture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> uniforms: FilterUniforms;
@group(0) @binding(3) var<uniform> filterSize: i32;

struct FragmentInput {
    @location(0) uv: vec2f,  
    @location(1) iuv: vec2f
}

struct FilterUniforms {
    blurDir: vec2f, 
}

override thicknessTextureWidth: f32;
override thicknessTextureHeight: f32;

@fragment
fn fs(input: FragmentInput) -> @location(0) vec4f {
    var thickness: f32 = textureSample(texture, textureSampler, input.uv).r;
    if (thickness == 0.) {
        return vec4f(0., 0., 0., 1.);
    }

    var sigma: f32 = f32(filterSize) / 3.0;
    var sigmaSquareInv: f32 = 1.0 / (2.0 * sigma * sigma);

    var sum = thickness;
    var wsum = 1.;

    let iuv: vec2f = vec2f(thicknessTextureWidth, thicknessTextureHeight) * input.uv;

    for (var x: i32 = 1; x <= filterSize; x++) {
        var coords: vec2f = vec2f(f32(x));
        var sampledThicknessLeft: f32 = textureLoad(texture, vec2u(iuv - uniforms.blurDir * coords), 0).r;
        var sampledThicknessRight: f32 = textureLoad(texture, vec2u(iuv + uniforms.blurDir * coords), 0).r;

        var w: f32 = exp(-f32(x * x) * sigmaSquareInv);

        sum += (sampledThicknessLeft + sampledThicknessRight) * w;
        wsum += 2.0 * w;
    }

    return vec4f(sum / wsum, 0., 0., 1.);
}`, Xn = `struct VertexOutput {
    @builtin(position) position: vec4f, 
    @location(0) uv: vec2f, 
    @location(1) viewPosition: vec3f, 
}

struct FragmentInput {
    @location(0) uv: vec2f, 
    @location(1) viewPosition: vec3f, 
}

struct FragmentOutput {
    
    @location(0) depth: f32, 
    @builtin(frag_depth) fragDepth: f32, 
}

struct RenderUniforms {
    texelSize: vec2f, 
    sphereSize: f32, 
    invProjectionMatrix: mat4x4f, 
    projectionMatrix: mat4x4f, 
    viewMatrix: mat4x4f, 
    invViewMatrix: mat4x4f, 
}

struct PosVel {
    position: vec3f, 
    v: vec3f, 
}

@group(0) @binding(0) var<storage> particles: array<PosVel>;
@group(0) @binding(1) var<uniform> uniforms: RenderUniforms;

@vertex
fn vs(    
    @builtin(vertex_index) vertex_index: u32, 
    @builtin(instance_index) instance_index: u32
) -> VertexOutput {
    var corner_positions = array(
        vec2( 0.5,  0.5),
        vec2( 0.5, -0.5),
        vec2(-0.5, -0.5),
        vec2( 0.5,  0.5),
        vec2(-0.5, -0.5),
        vec2(-0.5,  0.5),
    );

    var size = uniforms.sphereSize;
    let stretched_position = corner_positions[vertex_index] * size;
    let corner = vec3(stretched_position, 0.0);

    let uv = corner_positions[vertex_index] + 0.5;

    let real_position = particles[instance_index].position;
    let view_position = (uniforms.viewMatrix * vec4f(real_position, 1.0)).xyz;

    let out_position = uniforms.projectionMatrix * vec4f(view_position + corner, 1.0);

    return VertexOutput(out_position, uv, view_position);
}

@fragment
fn fs(input: FragmentInput) -> FragmentOutput {
    var out: FragmentOutput;

    var normalxy: vec2f = input.uv * 2.0 - 1.0;
    var r2: f32 = dot(normalxy, normalxy);
    if (r2 > 1.0) {
        discard;
    }
    var normalz = sqrt(1.0 - r2);
    var normal = vec3(normalxy, normalz);

    var radius = uniforms.sphereSize / 2;
    var realViewPos: vec4f = vec4f(input.viewPosition + normal * radius, 1.0);
    var clipSpacePos: vec4f = uniforms.projectionMatrix * realViewPos;
    out.fragDepth = clipSpacePos.z / clipSpacePos.w;
    out.depth = realViewPos.z;
    return out;
}`, kn = `struct VertexOutput {
    @builtin(position) position: vec4f, 
    @location(0) uv: vec2f, 
    @location(1) viewPosition: vec3f, 
    @location(2) speed: f32, 
}

struct FragmentInput {
    @location(0) uv: vec2f, 
    @location(1) viewPosition: vec3f, 
    @location(2) speed: f32, 
}

struct FragmentOutput {
    @location(0) depth: f32, 
    @location(1) color: vec4f, 
    @builtin(frag_depth) fragDepth: f32, 
}

struct RenderUniforms {
    texelSize: vec2f, 
    sphereSize: f32, 
    invProjectionMatrix: mat4x4f, 
    projectionMatrix: mat4x4f, 
    viewMatrix: mat4x4f, 
    invViewMatrix: mat4x4f, 
}

struct PosVel {
    position: vec3f, 
    v: vec3f, 
}

@group(0) @binding(0) var<storage> particles: array<PosVel>;
@group(0) @binding(1) var<uniform> uniforms: RenderUniforms;

@vertex
fn vs(    
    @builtin(vertex_index) vertex_index: u32, 
    @builtin(instance_index) instance_index: u32
) -> VertexOutput {
    var corner_positions = array(
        vec2( 0.5,  0.5),
        vec2( 0.5, -0.5),
        vec2(-0.5, -0.5),
        vec2( 0.5,  0.5),
        vec2(-0.5, -0.5),
        vec2(-0.5,  0.5),
    );

    var size = uniforms.sphereSize;
    let stretched_position = corner_positions[vertex_index] * size;
    let corner = vec3(stretched_position, 0.0);
    let uv = corner_positions[vertex_index] + 0.5;

    let real_position = particles[instance_index].position;
    let view_position = (uniforms.viewMatrix * vec4f(real_position, 1.0)).xyz;

    let out_position = uniforms.projectionMatrix * vec4f(view_position + corner, 1.0);

    let speed = length(particles[instance_index].v);
    return VertexOutput(out_position, uv, view_position, speed);
}

@fragment
fn fs(input: FragmentInput) -> FragmentOutput {
    var out: FragmentOutput;

    var normalxy: vec2f = input.uv * 2.0 - 1.0;
    var r2: f32 = dot(normalxy, normalxy);
    if (r2 > 1.0) {
        discard;
    }
    var normalz = sqrt(1.0 - r2);
    var normal = vec3(normalxy, normalz);

    var radius = uniforms.sphereSize / 2;
    var realViewPos: vec4f = vec4f(input.viewPosition + normal * radius, 1.0);
    var clipSpacePos: vec4f = uniforms.projectionMatrix * realViewPos;
    out.fragDepth = clipSpacePos.z / clipSpacePos.w;

    out.depth = realViewPos.z;
    out.color = vec4f(input.speed, 0, 0, 1.);
    return out;
}`, Yn = `@group(0) @binding(0) var envmapTexture: texture_cube<f32>;
@group(0) @binding(1) var<uniform> uniforms: RenderUniforms;
@group(0) @binding(2) var textureSampler: sampler;

struct RenderUniforms {
    texelSize: vec2f, 
    sphereSize: f32, 
    invProjectionMatrix: mat4x4f, 
    projectionMatrix: mat4x4f, 
    viewMatrix: mat4x4f, 
    invViewMatrix: mat4x4f, 
}

struct FragmentInput {
    @location(0) uv: vec2f,  
    @location(1) iuv: vec2f
}

fn computeViewPosFromUVDepth(texCoord: vec2f, depth: f32) -> vec3f {
    var ndc: vec4f = vec4f(texCoord.x * 2.0 - 1.0, 1.0 - 2.0 * texCoord.y, 0.0, 1.0);
    ndc.z = -uniforms.projectionMatrix[2].z + uniforms.projectionMatrix[3].z / depth;
    ndc.w = 1.0;

    var eye_pos: vec4f = uniforms.invProjectionMatrix * ndc;

    return eye_pos.xyz / eye_pos.w;
}

fn getCameraPosition() -> vec3f {
    return (uniforms.invViewMatrix * vec4(0, 0, 0, 1)).xyz;
}

fn rayPlaneIntersection(rayOrigin: vec3f, rayDir: vec3f) -> vec3f {
    
    
    

    let t = -rayOrigin.y / rayDir.y;
    return rayOrigin + t * rayDir;
}

@fragment
fn fs(input: FragmentInput) -> @location(0) vec4f {
    let cameraPos = getCameraPosition();
    let rayDirWorld = normalize((uniforms.invViewMatrix * vec4f(computeViewPosFromUVDepth(input.uv, 1.0), 0.)).xyz); 
    let bgColor = textureSampleLevel(envmapTexture, textureSampler, rayDirWorld, 0.).rgb;
    if (abs(rayDirWorld.y) < 1e-6) { 
        return vec4f(bgColor, 1.);
    } 

    let t = -cameraPos.y / rayDirWorld.y;
    if (t < 0) {
        return vec4f(bgColor, 1.);
    }
    let rayHitPos = cameraPos + t * rayDirWorld;
    let gridSize = 16.0;
    let lineThickness = 0.2; 

    let isLineX = abs(fract(rayHitPos.x / gridSize - 0.5) - 0.5) < lineThickness / gridSize;
    let isLineZ = abs(fract(rayHitPos.z / gridSize - 0.5) - 0.5) < lineThickness / gridSize;
    let isLine = isLineX || isLineZ;

    let boardColor = vec3(0.6); 
    let lineColor = vec3(0.5); 
    var finalColor = select(boardColor, lineColor, isLine);
    finalColor = select(bgColor, finalColor, abs(rayHitPos.x) < 3e2 && abs(rayHitPos.z) < 3e2);
    return vec4f(finalColor, 1.);
}`, Rn = `struct FragmentInput {
    @location(0) uv: vec2f,  
    @location(1) iuv: vec2f
}

struct RenderUniforms {
    texelSize: vec2f, 
    sphereSize: f32, 
    invProjectionMatrix: mat4x4f, 
    projectionMatrix: mat4x4f, 
    viewMatrix: mat4x4f, 
    invViewMatrix: mat4x4f, 
}

@group(0) @binding(0) var depthTexture: texture_2d<f32>;
@group(0) @binding(1) var densityGridTexture: texture_3d<f32>;
@group(0) @binding(2) var<uniform> uniforms: RenderUniforms;
@group(0) @binding(3) var<uniform> initBoxSize: vec3f;
@group(0) @binding(4) var textureSampler: sampler;
@group(0) @binding(5) var bgTexture: texture_2d<f32>;
@group(0) @binding(6) var<uniform> densityGridSize: vec3f;

fn computeViewPosFromUVDepth(texCoord: vec2f, depth: f32) -> vec3f {
    var ndc: vec4f = vec4f(texCoord.x * 2.0 - 1.0, 1.0 - 2.0 * texCoord.y, 0.0, 1.0);
    ndc.z = -uniforms.projectionMatrix[2].z + uniforms.projectionMatrix[3].z / depth;
    ndc.w = 1.0;

    var eye_pos: vec4f = uniforms.invProjectionMatrix * ndc;

    return eye_pos.xyz / eye_pos.w;
}

fn getViewPosFromTexCoord(texCoord: vec2f, iuv: vec2f) -> vec3f {
    var depth: f32 = abs(textureLoad(depthTexture, vec2u(iuv), 0).x);
    return computeViewPosFromUVDepth(texCoord, depth);
}

fn gamma(v: vec3f) -> vec3f {
    return pow(v, vec3(1.0 / 2.2));
}

@fragment
fn fs(input: FragmentInput) -> @location(0) vec4f {
    let depth: f32 = abs(textureLoad(depthTexture, vec2u(input.iuv), 0).r);
    if (depth >= 1e4) {
        let bgColor: vec3f = textureSampleLevel(bgTexture, textureSampler, input.uv, 0.0).rgb;
        return vec4f(bgColor, 0.);
    }

    let surfacePosView = computeViewPosFromUVDepth(input.uv, depth);
    let rayDirView = normalize(surfacePosView);
    var surfacePosWorld = (uniforms.invViewMatrix * vec4f(surfacePosView, 1.)).xyz;
    let rayDirWorld = (uniforms.invViewMatrix * vec4f(rayDirView, 0.)).xyz;

    var ddx: vec3f = getViewPosFromTexCoord(input.uv + vec2f(uniforms.texelSize.x, 0.), input.iuv + vec2f(1.0, 0.0)) - surfacePosView; 
    var ddy: vec3f = getViewPosFromTexCoord(input.uv + vec2f(0., uniforms.texelSize.y), input.iuv + vec2f(0.0, 1.0)) - surfacePosView; 
    let ddx2: vec3f = surfacePosView - getViewPosFromTexCoord(input.uv + vec2f(-uniforms.texelSize.x, 0.), input.iuv + vec2f(-1.0, 0.0));
    let ddy2: vec3f = surfacePosView - getViewPosFromTexCoord(input.uv + vec2f(0., -uniforms.texelSize.y), input.iuv + vec2f(0.0, -1.0));
    ddx = select(ddx, ddx2, abs(ddx.z) > abs(ddx2.z));
    ddy = select(ddy, ddy2, abs(ddy.z) > abs(ddy2.z));
    var normal: vec3f = -normalize(cross(ddx, ddy)); 
    var normalWorld: vec3f = (uniforms.invViewMatrix * vec4f(normal, 0.)).xyz; 

    var densitySum: f32 = 0.;
    var t: f32 = 0.;
    let stepSize: f32 = 0.6; 
    let densityScale: f32 = 0.2; 
    let lightDirWorld: vec3f = normalize(vec3f(0, 1, 0));

    surfacePosWorld += 1.5 * lightDirWorld; 
    for (var i = 0; i < 1000; i++) { 
        let posWorld = surfacePosWorld + t * lightDirWorld;
        if (any(posWorld <= vec3f(0.)) || any(posWorld >= initBoxSize - 1)) { 
            break;
        }
        let worldCoord: vec3f = posWorld / densityGridSize;
        let density: f32 = textureSampleLevel(densityGridTexture, textureSampler, worldCoord.zyx, 0.).r;
        densitySum += stepSize * density * densityScale;
        t += stepSize;
    }

    let speed = textureSampleLevel(bgTexture, textureSampler, input.uv, 0.0).r;
    let albedo: vec3f = vec3f(0, 70, 250) / 256.;

    let LdotN: f32 = 0.5 * dot(normalWorld, lightDirWorld) + 0.5;
    let shadow = exp(-1. * densitySum);

    let H: vec3f        = normalize(lightDirWorld - rayDirWorld);
    let specular: f32   = pow(max(0.0, dot(H, normalWorld)), 50.);
    let diffuse: f32 = max(dot(normalWorld, lightDirWorld), 0.);
    var finalColor = shadow * LdotN * albedo * 1. + 0.1 * diffuse * shadow + 0.3 * specular * shadow;

    return vec4f(gamma(finalColor), 1.); 
}`;
class Ln {
  constructor(v, z, _, I, b, F, k, T, B, Z, N, ne, te) {
    M(this, "depthFilter1DPipeline");
    M(this, "depthFilter2DPipeline");
    M(this, "thicknessMapPipeline");
    M(this, "thicknessFilterPipeline");
    M(this, "fluidPipeline");
    M(this, "depthMapPipeline");
    M(this, "spherePipeline");
    M(this, "bgColorPipeline");
    M(this, "densityRaymarchPipeline");
    M(this, "depthMapTextureView");
    M(this, "tmpDepthMapTextureView");
    M(this, "thicknessTextureView");
    M(this, "tmpThicknessTextureView");
    M(this, "depthTestTextureView");
    M(this, "tmpOutputTextureView");
    M(this, "depthFilter1DBindGroups");
    M(this, "depthFilter2DBindGroups");
    M(this, "thicknessMapBindGroup");
    M(this, "thicknessFilterBindGroups");
    M(this, "fluidBindGroup");
    M(this, "depthMapBindGroup");
    M(this, "sphereBindGroup");
    M(this, "bgColorBindGroup");
    M(this, "densityRaymarchBindGroup");
    M(this, "diffuseColorBuffer");
    M(this, "colorDensityBuffer");
    M(this, "densityGridSizeBuffer");
    M(this, "device");
    this.device = b;
    const fe = 50, ae = 2 * N, ue = 12, ie = B.width / 2, $ = B.height / 2, H = {
      screenHeight: B.height,
      screenWidth: B.width
    }, L = {
      maxFilterSize: fe,
      projectedParticleConstant: ue * ae * 0.05 * (B.height / 2) / Math.tan(ne / 2)
    }, re = {
      thicknessTextureWidth: ie,
      thicknessTextureHeight: $
    }, K = b.createSampler({
      // addressModeU: "repeat",
      // addressModeV: "repeat",
      magFilter: "linear",
      minFilter: "linear"
    }), Q = b.createShaderModule({ code: Un }), j = b.createShaderModule({ code: _n }), C = b.createShaderModule({ code: Fn }), ee = b.createShaderModule({ code: Xn }), xe = b.createShaderModule({ code: kn }), A = b.createShaderModule({ code: In }), W = b.createShaderModule({ code: An }), X = b.createShaderModule({ code: Yn }), Be = b.createShaderModule({ code: Rn });
    this.depthMapPipeline = b.createRenderPipeline({
      label: "depthMap pipeline",
      layout: "auto",
      vertex: { module: ee },
      fragment: {
        module: ee,
        targets: [
          {
            format: "r32float"
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      },
      depthStencil: {
        depthWriteEnabled: !0,
        depthCompare: "less",
        format: "depth32float"
      }
    }), this.spherePipeline = b.createRenderPipeline({
      label: "sphere pipeline",
      layout: "auto",
      vertex: { module: xe },
      fragment: {
        module: xe,
        targets: [
          {
            format: "r32float"
          },
          {
            format: Z
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      },
      depthStencil: {
        depthWriteEnabled: !0,
        depthCompare: "less",
        format: "depth32float"
      }
    }), this.depthFilter1DPipeline = b.createRenderPipeline({
      label: "depth filter pipeline (1d)",
      layout: "auto",
      vertex: {
        module: Q,
        constants: H
      },
      fragment: {
        module: j,
        constants: {
          ...L,
          blur2D: 0
        },
        targets: [
          {
            format: "r32float"
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      }
    }), this.depthFilter2DPipeline = b.createRenderPipeline({
      label: "depth filter pipeline (2d)",
      layout: "auto",
      vertex: {
        module: Q,
        constants: H
      },
      fragment: {
        module: j,
        constants: {
          ...L,
          blur2D: 1
        },
        targets: [
          {
            format: "r32float"
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      }
    }), this.thicknessMapPipeline = b.createRenderPipeline({
      label: "thickness map pipeline",
      layout: "auto",
      vertex: {
        module: A
      },
      fragment: {
        module: A,
        targets: [
          {
            format: "r16float",
            writeMask: GPUColorWrite.RED,
            blend: {
              color: { operation: "add", srcFactor: "one", dstFactor: "one" },
              alpha: { operation: "add", srcFactor: "one", dstFactor: "one" }
            }
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      }
    }), this.thicknessFilterPipeline = b.createRenderPipeline({
      label: "thickness filter pipeline",
      layout: "auto",
      vertex: {
        module: Q,
        constants: H
      },
      fragment: {
        module: W,
        constants: re,
        targets: [
          {
            format: "r16float"
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      }
    }), this.fluidPipeline = b.createRenderPipeline({
      label: "fluid rendering pipeline",
      layout: "auto",
      vertex: {
        module: Q,
        constants: H
      },
      fragment: {
        module: C,
        targets: [
          {
            format: Z
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      }
    }), this.bgColorPipeline = b.createRenderPipeline({
      label: "bgColor pipeline",
      layout: "auto",
      vertex: {
        module: Q,
        constants: H
      },
      fragment: {
        module: X,
        targets: [
          {
            format: Z
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      }
    }), this.densityRaymarchPipeline = b.createRenderPipeline({
      label: "density raymarch pipeline",
      layout: "auto",
      vertex: {
        module: Q,
        constants: H
      },
      fragment: {
        module: Be,
        targets: [
          {
            format: Z
          }
        ]
      }
    });
    const q = b.createTexture({
      label: "temporary depth map texture",
      size: [B.width, B.height, 1],
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      format: "r32float"
    }), me = b.createTexture({
      label: "thickness map texture",
      size: [ie, $, 1],
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      format: "r16float"
    }), de = b.createTexture({
      label: "temporary thickness map texture",
      size: [ie, $, 1],
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      format: "r16float"
    }), Te = b.createTexture({
      size: [B.width, B.height, 1],
      format: "depth32float",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
    }), J = b.createTexture({
      size: [B.width, B.height, 1],
      format: Z,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
    });
    this.depthMapTextureView = F, this.tmpDepthMapTextureView = q.createView(), this.thicknessTextureView = me.createView(), this.tmpThicknessTextureView = de.createView(), this.depthTestTextureView = Te.createView(), this.tmpOutputTextureView = J.createView();
    const pe = b.createBuffer({
      label: "filter uniform buffer",
      size: 8,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), le = b.createBuffer({
      label: "filter uniform buffer",
      size: 8,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), ve = b.createBuffer({
      label: "thickness filter size buffer",
      size: 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    this.diffuseColorBuffer = b.createBuffer({
      label: "diffuse color buffer",
      size: 12,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.colorDensityBuffer = b.createBuffer({
      label: "color density buffer",
      size: 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.densityGridSizeBuffer = _;
    let O = new Float32Array([1, 0]), se = new Float32Array([0, 1]), oe = new Int32Array([15]);
    b.queue.writeBuffer(pe, 0, O), b.queue.writeBuffer(le, 0, se), b.queue.writeBuffer(ve, 0, oe), this.depthFilter1DBindGroups = [], this.depthFilter1DBindGroups = [
      b.createBindGroup({
        label: "filterX bind group",
        layout: this.depthFilter1DPipeline.getBindGroupLayout(0),
        entries: [
          // { binding: 0, resource: sampler },
          { binding: 1, resource: this.depthMapTextureView },
          { binding: 2, resource: { buffer: pe } }
        ]
      }),
      b.createBindGroup({
        label: "filterY bind group",
        layout: this.depthFilter1DPipeline.getBindGroupLayout(0),
        entries: [
          // { binding: 0, resource: sampler },
          { binding: 1, resource: this.tmpDepthMapTextureView },
          { binding: 2, resource: { buffer: le } }
        ]
      })
    ], this.depthFilter2DBindGroups = [
      b.createBindGroup({
        label: "filterX bind group",
        layout: this.depthFilter2DPipeline.getBindGroupLayout(0),
        entries: [
          // { binding: 0, resource: sampler },
          { binding: 1, resource: this.depthMapTextureView },
          { binding: 2, resource: { buffer: pe } }
        ]
      }),
      b.createBindGroup({
        label: "filterY bind group",
        layout: this.depthFilter2DPipeline.getBindGroupLayout(0),
        entries: [
          // { binding: 0, resource: sampler },
          { binding: 1, resource: this.tmpDepthMapTextureView },
          { binding: 2, resource: { buffer: le } }
        ]
      })
    ], this.thicknessMapBindGroup = b.createBindGroup({
      label: "thickness map bind group",
      layout: this.thicknessMapPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: z } },
        { binding: 1, resource: { buffer: v } }
      ]
    }), this.thicknessFilterBindGroups = [], this.thicknessFilterBindGroups = [
      b.createBindGroup({
        label: "thickness filterX bind group",
        layout: this.thicknessFilterPipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: K },
          { binding: 1, resource: this.thicknessTextureView },
          { binding: 2, resource: { buffer: pe } },
          { binding: 3, resource: { buffer: ve } }
        ]
      }),
      b.createBindGroup({
        label: "thickness filterY bind group",
        layout: this.thicknessFilterPipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: K },
          { binding: 1, resource: this.tmpThicknessTextureView },
          { binding: 2, resource: { buffer: le } },
          { binding: 3, resource: { buffer: ve } }
        ]
      })
    ], this.fluidBindGroup = b.createBindGroup({
      label: "fluid bind group",
      layout: this.fluidPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: K },
        { binding: 1, resource: this.depthMapTextureView },
        { binding: 2, resource: { buffer: v } },
        { binding: 3, resource: this.thicknessTextureView },
        { binding: 4, resource: k },
        { binding: 5, resource: this.tmpOutputTextureView },
        { binding: 6, resource: { buffer: this.diffuseColorBuffer } },
        { binding: 7, resource: { buffer: this.colorDensityBuffer } }
      ]
    }), this.depthMapBindGroup = b.createBindGroup({
      label: "depthMap bind group",
      layout: this.depthMapPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: z } },
        { binding: 1, resource: { buffer: v } }
      ]
    }), this.bgColorBindGroup = b.createBindGroup({
      label: "bgColor bind group",
      layout: this.bgColorPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: k },
        { binding: 1, resource: { buffer: v } },
        { binding: 2, resource: K }
      ]
    }), this.sphereBindGroup = b.createBindGroup({
      label: "sphere bind group",
      layout: this.spherePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: z } },
        { binding: 1, resource: { buffer: v } }
      ]
    }), this.densityRaymarchBindGroup = b.createBindGroup({
      label: "density raymarch bind group",
      layout: this.densityRaymarchPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: this.depthMapTextureView },
        { binding: 1, resource: T },
        { binding: 2, resource: { buffer: v } },
        { binding: 3, resource: { buffer: I } },
        { binding: 4, resource: K },
        { binding: 5, resource: this.tmpOutputTextureView },
        { binding: 6, resource: { buffer: this.densityGridSizeBuffer } }
      ]
    }), console.log(this.densityRaymarchPipeline.getBindGroupLayout(0));
  }
  execute(v, z, _, I, b, F) {
    const k = new Float32Array(b), T = new Float32Array([F]);
    this.device.queue.writeBuffer(this.diffuseColorBuffer, 0, k), this.device.queue.writeBuffer(this.colorDensityBuffer, 0, T);
    const B = [
      {
        colorAttachments: [
          {
            view: this.tmpDepthMapTextureView,
            clearValue: { r: 1e6, g: 0, b: 0, a: 1 },
            loadOp: "clear",
            storeOp: "store"
          }
        ]
      },
      {
        colorAttachments: [
          {
            view: this.depthMapTextureView,
            clearValue: { r: 1e6, g: 0, b: 0, a: 1 },
            loadOp: "clear",
            storeOp: "store"
          }
        ]
      }
    ], Z = {
      colorAttachments: [
        {
          view: this.thicknessTextureView,
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    }, N = [
      {
        colorAttachments: [
          {
            view: this.tmpThicknessTextureView,
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: "clear",
            storeOp: "store"
          }
        ]
      },
      {
        colorAttachments: [
          {
            view: this.thicknessTextureView,
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: "clear",
            storeOp: "store"
          }
        ]
      }
    ], ne = {
      colorAttachments: [
        {
          view: this.tmpOutputTextureView,
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    }, te = {
      colorAttachments: [
        {
          view: v.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    }, fe = {
      colorAttachments: [
        {
          view: this.depthMapTextureView,
          clearValue: { r: 1e6, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ],
      depthStencilAttachment: {
        view: this.depthTestTextureView,
        depthClearValue: 1,
        depthLoadOp: "clear",
        depthStoreOp: "store"
      }
    }, ae = {
      colorAttachments: [
        {
          view: this.depthMapTextureView,
          clearValue: { r: 1e6, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        },
        {
          view: this.tmpOutputTextureView,
          loadOp: "load",
          storeOp: "store"
        }
      ],
      depthStencilAttachment: {
        view: this.depthTestTextureView,
        depthClearValue: 1,
        depthLoadOp: "clear",
        depthStoreOp: "store"
      }
    }, ue = {
      colorAttachments: [
        {
          view: v.getCurrentTexture().createView(),
          clearValue: { r: 0.7, g: 0.7, b: 0.75, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    };
    if (I) {
      const $ = z.beginRenderPass(ne);
      $.setBindGroup(0, this.bgColorBindGroup), $.setPipeline(this.bgColorPipeline), $.draw(6), $.end();
      const H = z.beginRenderPass(ae);
      H.setBindGroup(0, this.sphereBindGroup), H.setPipeline(this.spherePipeline), H.draw(6, _), H.end();
      const L = z.beginRenderPass(ue);
      L.setBindGroup(0, this.densityRaymarchBindGroup), L.setPipeline(this.densityRaymarchPipeline), L.draw(6), L.end();
    } else {
      const $ = z.beginRenderPass(fe);
      $.setBindGroup(0, this.depthMapBindGroup), $.setPipeline(this.depthMapPipeline), $.draw(6, _), $.end();
      for (var ie = 0; ie < 2; ie++) {
        const j = z.beginRenderPass(B[0]);
        j.setBindGroup(0, this.depthFilter1DBindGroups[0]), j.setPipeline(this.depthFilter1DPipeline), j.draw(6), j.end();
        const C = z.beginRenderPass(B[1]);
        C.setBindGroup(0, this.depthFilter1DBindGroups[1]), C.setPipeline(this.depthFilter1DPipeline), C.draw(6), C.end();
      }
      const H = z.beginRenderPass(B[0]);
      H.setBindGroup(0, this.depthFilter2DBindGroups[0]), H.setPipeline(this.depthFilter2DPipeline), H.draw(6), H.end();
      const L = z.beginRenderPass(B[1]);
      L.setBindGroup(0, this.depthFilter2DBindGroups[1]), L.setPipeline(this.depthFilter2DPipeline), L.draw(6), L.end();
      const re = z.beginRenderPass(Z);
      re.setBindGroup(0, this.thicknessMapBindGroup), re.setPipeline(this.thicknessMapPipeline), re.draw(6, _), re.end();
      for (var ie = 0; ie < 1; ie++) {
        const C = z.beginRenderPass(N[0]);
        C.setBindGroup(0, this.thicknessFilterBindGroups[0]), C.setPipeline(this.thicknessFilterPipeline), C.draw(6), C.end();
        const ee = z.beginRenderPass(N[1]);
        ee.setBindGroup(0, this.thicknessFilterBindGroups[1]), ee.setPipeline(this.thicknessFilterPipeline), ee.draw(6), ee.end();
      }
      const K = z.beginRenderPass(ne);
      K.setBindGroup(0, this.bgColorBindGroup), K.setPipeline(this.bgColorPipeline), K.draw(6), K.end();
      const Q = z.beginRenderPass(te);
      Q.setBindGroup(0, this.fluidBindGroup), Q.setPipeline(this.fluidPipeline), Q.draw(6), Q.end();
    }
  }
}
async function jn(f, v) {
  const z = v.particles ?? 4e4, _ = v.box ?? [72, 40, 40], I = v.resolution ?? 0.7, b = await navigator.gpu.requestAdapter();
  if (!b) throw new Error("no WebGPU adapter");
  const F = await b.requestDevice(), k = f.getContext("webgpu");
  f.width = Math.round(I * f.clientWidth), f.height = Math.round(I * f.clientHeight);
  const T = navigator.gpu.getPreferredCanvasFormat();
  k.configure({ device: F, format: T });
  const B = ["posx", "negx", "posy", "negy", "posz", "negz"].map((O) => `${v.base}cubemap/${O}.png`), Z = await Promise.all(B.map(async (O) => createImageBitmap(await (await fetch(O)).blob()))), N = F.createTexture({
    dimension: "2d",
    size: [Z[0].width, Z[0].height, 6],
    format: "rgba8unorm",
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
  });
  Z.forEach((O, se) => F.queue.copyExternalImageToTexture({ source: O }, { texture: N, origin: [0, 0, se] }, [O.width, O.height]));
  const ne = N.createView({ dimension: "cube" }), te = _[0] * _[1] * _[2], fe = F.createBuffer({ size: Ye * z, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST }), ae = F.createBuffer({ size: 32 * z, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST }), ue = F.createBuffer({ size: Xe.byteLength, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST }), ie = F.createBuffer({ size: 12, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST }), H = F.createTexture({ size: [f.width, f.height, 1], usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING, format: "r32float" }).createView(), L = [_[0], _[1], Math.ceil(_[2] / 128) * 128], re = F.createBuffer({ size: 4 * L[0] * L[1] * L[2], usage: GPUBufferUsage.STORAGE }), K = F.createBuffer({ size: 2 * L[0] * L[1] * L[2], usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC }), Q = F.createBuffer({ size: 12, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  F.queue.writeBuffer(Q, 0, new Float32Array(L));
  const j = F.createTexture({ size: [L[2], L[1], L[0]], usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST, format: "r16float", dimension: "3d" }), C = 60 * Math.PI / 180, ee = 0.6, xe = 2 * ee, A = 1e7, W = new Vn(
    fe,
    ae,
    ue,
    re,
    K,
    ie,
    Q,
    F,
    H,
    f,
    te,
    z,
    A,
    xe
  ), X = new Ln(
    ue,
    ae,
    Q,
    ie,
    F,
    H,
    ne,
    j.createView(),
    f,
    T,
    ee,
    C,
    A
  );
  W.initDambreak = function(O, se) {
    const oe = new ArrayBuffer(Ye * this.maxParticleCount), r = 0.9;
    this.numParticles = 0;
    for (let d = 3; d < O[1] - 3 && this.numParticles < se; d += r)
      for (let t = 3; t < O[0] - 3 && this.numParticles < se; t += r)
        for (let s = 3; s < O[2] - 3 && this.numParticles < se; s += r) {
          const l = Ye * this.numParticles;
          new Float32Array(oe, l, 3).set([t + 0.3 * Math.random(), d + 0.3 * Math.random(), s + 0.3 * Math.random()]), this.numParticles++;
        }
    return oe;
  };
  const Be = { get clientWidth() {
    return f.clientWidth;
  }, get clientHeight() {
    return f.clientHeight;
  }, addEventListener() {
  } }, q = new yn(Be), me = () => {
    const O = _[0] * 0.95;
    q.reset(O, [_[0] / 2, _[1] * 0.28, _[2] / 2], C, 0.7), q.currentYtheta = -((v.elevation ?? 10) * Math.PI) / 180, q.recalculateView();
  };
  W.reset(_, z), me();
  let de = !1;
  q.currentHoverX = q.prevHoverX = -1e4, q.currentHoverY = q.prevHoverY = -1e4;
  const Te = (O, se) => {
    const oe = f.getBoundingClientRect();
    if (O === null || se === void 0) {
      de = !1, q.currentHoverX = q.prevHoverX = -1e4, q.currentHoverY = q.prevHoverY = -1e4;
      return;
    }
    de || (q.prevHoverX = O - oe.left, q.prevHoverY = se - oe.top), de = !0, q.currentHoverX = O - oe.left, q.currentHoverY = se - oe.top;
  }, J = () => {
    ke.texelSize.set([1 / f.width, 1 / f.height]), ke.sphereSize.set([xe]), F.queue.writeBuffer(ue, 0, Xe);
    const O = F.createCommandEncoder();
    W.execute(
      O,
      [q.currentHoverX / f.clientWidth, q.currentHoverY / f.clientHeight],
      q.calcMouseVelocity(),
      15,
      !1,
      0.4 * 0.8,
      !0,
      L
    ), X.execute(k, O, W.numParticles, !1, [140 / 255, 220 / 255, 240 / 255], 0.7), F.queue.submit([O.finish()]), q.setNewPrevMouseCoord();
  };
  let pe = 0, le = !1;
  const ve = () => {
    le || (J(), pe = requestAnimationFrame(ve));
  };
  return pe = requestAnimationFrame(ve), {
    particleCount: W.numParticles,
    setHand: Te,
    reset: () => {
      W.reset(_, z), me();
    },
    advance: J,
    destroy: () => {
      le = !0, cancelAnimationFrame(pe), F.destroy();
    }
  };
}
export {
  jn as createTank
};
