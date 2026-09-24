var on = Object.defineProperty;
var cn = (f, v, M) => v in f ? on(f, v, { enumerable: !0, configurable: !0, writable: !0, value: M }) : f[v] = M;
var z = (f, v, M) => cn(f, typeof v != "symbol" ? v + "" : v, M);
function an(f, v) {
  return class extends f {
    constructor(...M) {
      super(...M), v(this);
    }
  };
}
const un = an(Array, (f) => f.fill(0));
let k = 1e-6;
function ln(f) {
  function v(e = 0, o = 0) {
    const n = new f(2);
    return e !== void 0 && (n[0] = e, o !== void 0 && (n[1] = o)), n;
  }
  const M = v;
  function G(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e, r[1] = o, r;
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
  function Y(e, o = 0, n = 1, r) {
    const a = r ?? new f(2);
    return a[0] = Math.min(n, Math.max(o, e[0])), a[1] = Math.min(n, Math.max(o, e[1])), a;
  }
  function S(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] + o[0], r[1] = e[1] + o[1], r;
  }
  function B(e, o, n, r) {
    const a = r ?? new f(2);
    return a[0] = e[0] + o[0] * n, a[1] = e[1] + o[1] * n, a;
  }
  function C(e, o) {
    const n = e[0], r = e[1], a = o[0], x = o[1], y = Math.sqrt(n * n + r * r), c = Math.sqrt(a * a + x * x), u = y * c, h = u && Z(e, o) / u;
    return Math.acos(h);
  }
  function W(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] - o[0], r[1] = e[1] - o[1], r;
  }
  const ie = W;
  function re(e, o) {
    return Math.abs(e[0] - o[0]) < k && Math.abs(e[1] - o[1]) < k;
  }
  function fe(e, o) {
    return e[0] === o[0] && e[1] === o[1];
  }
  function ae(e, o, n, r) {
    const a = r ?? new f(2);
    return a[0] = e[0] + n * (o[0] - e[0]), a[1] = e[1] + n * (o[1] - e[1]), a;
  }
  function ue(e, o, n, r) {
    const a = r ?? new f(2);
    return a[0] = e[0] + n[0] * (o[0] - e[0]), a[1] = e[1] + n[1] * (o[1] - e[1]), a;
  }
  function se(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = Math.max(e[0], o[0]), r[1] = Math.max(e[1], o[1]), r;
  }
  function K(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = Math.min(e[0], o[0]), r[1] = Math.min(e[1], o[1]), r;
  }
  function q(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] * o, r[1] = e[1] * o, r;
  }
  const H = q;
  function oe(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] / o, r[1] = e[1] / o, r;
  }
  function ne(e, o) {
    const n = o ?? new f(2);
    return n[0] = 1 / e[0], n[1] = 1 / e[1], n;
  }
  const Q = ne;
  function j(e, o, n) {
    const r = n ?? new f(3), a = e[0] * o[1] - e[1] * o[0];
    return r[0] = 0, r[1] = 0, r[2] = a, r;
  }
  function Z(e, o) {
    return e[0] * o[0] + e[1] * o[1];
  }
  function te(e) {
    const o = e[0], n = e[1];
    return Math.sqrt(o * o + n * n);
  }
  const ge = te;
  function A(e) {
    const o = e[0], n = e[1];
    return o * o + n * n;
  }
  const N = A;
  function O(e, o) {
    const n = e[0] - o[0], r = e[1] - o[1];
    return Math.sqrt(n * n + r * r);
  }
  const Be = O;
  function L(e, o) {
    const n = e[0] - o[0], r = e[1] - o[1];
    return n * n + r * r;
  }
  const me = L;
  function de(e, o) {
    const n = o ?? new f(2), r = e[0], a = e[1], x = Math.sqrt(r * r + a * a);
    return x > 1e-5 ? (n[0] = r / x, n[1] = a / x) : (n[0] = 0, n[1] = 0), n;
  }
  function Se(e, o) {
    const n = o ?? new f(2);
    return n[0] = -e[0], n[1] = -e[1], n;
  }
  function J(e, o) {
    const n = o ?? new f(2);
    return n[0] = e[0], n[1] = e[1], n;
  }
  const pe = J;
  function le(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] * o[0], r[1] = e[1] * o[1], r;
  }
  const ve = le;
  function R(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] / o[0], r[1] = e[1] / o[1], r;
  }
  const $ = R;
  function ee(e = 1, o) {
    const n = o ?? new f(2), r = Math.random() * 2 * Math.PI;
    return n[0] = Math.cos(r) * e, n[1] = Math.sin(r) * e, n;
  }
  function i(e) {
    const o = e ?? new f(2);
    return o[0] = 0, o[1] = 0, o;
  }
  function d(e, o, n) {
    const r = n ?? new f(2), a = e[0], x = e[1];
    return r[0] = a * o[0] + x * o[4] + o[12], r[1] = a * o[1] + x * o[5] + o[13], r;
  }
  function t(e, o, n) {
    const r = n ?? new f(2), a = e[0], x = e[1];
    return r[0] = o[0] * a + o[4] * x + o[8], r[1] = o[1] * a + o[5] * x + o[9], r;
  }
  function s(e, o, n, r) {
    const a = r ?? new f(2), x = e[0] - o[0], y = e[1] - o[1], c = Math.sin(n), u = Math.cos(n);
    return a[0] = x * u - y * c + o[0], a[1] = x * c + y * u + o[1], a;
  }
  function l(e, o, n) {
    const r = n ?? new f(2);
    return de(e, r), q(r, o, r);
  }
  function p(e, o, n) {
    const r = n ?? new f(2);
    return te(e) > o ? l(e, o, r) : J(e, r);
  }
  function w(e, o, n) {
    const r = n ?? new f(2);
    return ae(e, o, 0.5, r);
  }
  return {
    create: v,
    fromValues: M,
    set: G,
    ceil: I,
    floor: b,
    round: F,
    clamp: Y,
    add: S,
    addScaled: B,
    angle: C,
    subtract: W,
    sub: ie,
    equalsApproximately: re,
    equals: fe,
    lerp: ae,
    lerpV: ue,
    max: se,
    min: K,
    mulScalar: q,
    scale: H,
    divScalar: oe,
    inverse: ne,
    invert: Q,
    cross: j,
    dot: Z,
    length: te,
    len: ge,
    lengthSq: A,
    lenSq: N,
    distance: O,
    dist: Be,
    distanceSq: L,
    distSq: me,
    normalize: de,
    negate: Se,
    copy: J,
    clone: pe,
    multiply: le,
    mul: ve,
    divide: R,
    div: $,
    random: ee,
    zero: i,
    transformMat4: d,
    transformMat3: t,
    rotate: s,
    setLength: l,
    truncate: p,
    midpoint: w
  };
}
const Qe = /* @__PURE__ */ new Map();
function sn(f) {
  let v = Qe.get(f);
  return v || (v = ln(f), Qe.set(f, v)), v;
}
function fn(f) {
  function v(c, u, h) {
    const g = new f(3);
    return c !== void 0 && (g[0] = c, u !== void 0 && (g[1] = u, h !== void 0 && (g[2] = h))), g;
  }
  const M = v;
  function G(c, u, h, g) {
    const m = g ?? new f(3);
    return m[0] = c, m[1] = u, m[2] = h, m;
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
  function Y(c, u = 0, h = 1, g) {
    const m = g ?? new f(3);
    return m[0] = Math.min(h, Math.max(u, c[0])), m[1] = Math.min(h, Math.max(u, c[1])), m[2] = Math.min(h, Math.max(u, c[2])), m;
  }
  function S(c, u, h) {
    const g = h ?? new f(3);
    return g[0] = c[0] + u[0], g[1] = c[1] + u[1], g[2] = c[2] + u[2], g;
  }
  function B(c, u, h, g) {
    const m = g ?? new f(3);
    return m[0] = c[0] + u[0] * h, m[1] = c[1] + u[1] * h, m[2] = c[2] + u[2] * h, m;
  }
  function C(c, u) {
    const h = c[0], g = c[1], m = c[2], P = u[0], D = u[1], _ = u[2], U = Math.sqrt(h * h + g * g + m * m), T = Math.sqrt(P * P + D * D + _ * _), V = U * T, X = V && Z(c, u) / V;
    return Math.acos(X);
  }
  function W(c, u, h) {
    const g = h ?? new f(3);
    return g[0] = c[0] - u[0], g[1] = c[1] - u[1], g[2] = c[2] - u[2], g;
  }
  const ie = W;
  function re(c, u) {
    return Math.abs(c[0] - u[0]) < k && Math.abs(c[1] - u[1]) < k && Math.abs(c[2] - u[2]) < k;
  }
  function fe(c, u) {
    return c[0] === u[0] && c[1] === u[1] && c[2] === u[2];
  }
  function ae(c, u, h, g) {
    const m = g ?? new f(3);
    return m[0] = c[0] + h * (u[0] - c[0]), m[1] = c[1] + h * (u[1] - c[1]), m[2] = c[2] + h * (u[2] - c[2]), m;
  }
  function ue(c, u, h, g) {
    const m = g ?? new f(3);
    return m[0] = c[0] + h[0] * (u[0] - c[0]), m[1] = c[1] + h[1] * (u[1] - c[1]), m[2] = c[2] + h[2] * (u[2] - c[2]), m;
  }
  function se(c, u, h) {
    const g = h ?? new f(3);
    return g[0] = Math.max(c[0], u[0]), g[1] = Math.max(c[1], u[1]), g[2] = Math.max(c[2], u[2]), g;
  }
  function K(c, u, h) {
    const g = h ?? new f(3);
    return g[0] = Math.min(c[0], u[0]), g[1] = Math.min(c[1], u[1]), g[2] = Math.min(c[2], u[2]), g;
  }
  function q(c, u, h) {
    const g = h ?? new f(3);
    return g[0] = c[0] * u, g[1] = c[1] * u, g[2] = c[2] * u, g;
  }
  const H = q;
  function oe(c, u, h) {
    const g = h ?? new f(3);
    return g[0] = c[0] / u, g[1] = c[1] / u, g[2] = c[2] / u, g;
  }
  function ne(c, u) {
    const h = u ?? new f(3);
    return h[0] = 1 / c[0], h[1] = 1 / c[1], h[2] = 1 / c[2], h;
  }
  const Q = ne;
  function j(c, u, h) {
    const g = h ?? new f(3), m = c[2] * u[0] - c[0] * u[2], P = c[0] * u[1] - c[1] * u[0];
    return g[0] = c[1] * u[2] - c[2] * u[1], g[1] = m, g[2] = P, g;
  }
  function Z(c, u) {
    return c[0] * u[0] + c[1] * u[1] + c[2] * u[2];
  }
  function te(c) {
    const u = c[0], h = c[1], g = c[2];
    return Math.sqrt(u * u + h * h + g * g);
  }
  const ge = te;
  function A(c) {
    const u = c[0], h = c[1], g = c[2];
    return u * u + h * h + g * g;
  }
  const N = A;
  function O(c, u) {
    const h = c[0] - u[0], g = c[1] - u[1], m = c[2] - u[2];
    return Math.sqrt(h * h + g * g + m * m);
  }
  const Be = O;
  function L(c, u) {
    const h = c[0] - u[0], g = c[1] - u[1], m = c[2] - u[2];
    return h * h + g * g + m * m;
  }
  const me = L;
  function de(c, u) {
    const h = u ?? new f(3), g = c[0], m = c[1], P = c[2], D = Math.sqrt(g * g + m * m + P * P);
    return D > 1e-5 ? (h[0] = g / D, h[1] = m / D, h[2] = P / D) : (h[0] = 0, h[1] = 0, h[2] = 0), h;
  }
  function Se(c, u) {
    const h = u ?? new f(3);
    return h[0] = -c[0], h[1] = -c[1], h[2] = -c[2], h;
  }
  function J(c, u) {
    const h = u ?? new f(3);
    return h[0] = c[0], h[1] = c[1], h[2] = c[2], h;
  }
  const pe = J;
  function le(c, u, h) {
    const g = h ?? new f(3);
    return g[0] = c[0] * u[0], g[1] = c[1] * u[1], g[2] = c[2] * u[2], g;
  }
  const ve = le;
  function R(c, u, h) {
    const g = h ?? new f(3);
    return g[0] = c[0] / u[0], g[1] = c[1] / u[1], g[2] = c[2] / u[2], g;
  }
  const $ = R;
  function ee(c = 1, u) {
    const h = u ?? new f(3), g = Math.random() * 2 * Math.PI, m = Math.random() * 2 - 1, P = Math.sqrt(1 - m * m) * c;
    return h[0] = Math.cos(g) * P, h[1] = Math.sin(g) * P, h[2] = m * c, h;
  }
  function i(c) {
    const u = c ?? new f(3);
    return u[0] = 0, u[1] = 0, u[2] = 0, u;
  }
  function d(c, u, h) {
    const g = h ?? new f(3), m = c[0], P = c[1], D = c[2], _ = u[3] * m + u[7] * P + u[11] * D + u[15] || 1;
    return g[0] = (u[0] * m + u[4] * P + u[8] * D + u[12]) / _, g[1] = (u[1] * m + u[5] * P + u[9] * D + u[13]) / _, g[2] = (u[2] * m + u[6] * P + u[10] * D + u[14]) / _, g;
  }
  function t(c, u, h) {
    const g = h ?? new f(3), m = c[0], P = c[1], D = c[2];
    return g[0] = m * u[0 * 4 + 0] + P * u[1 * 4 + 0] + D * u[2 * 4 + 0], g[1] = m * u[0 * 4 + 1] + P * u[1 * 4 + 1] + D * u[2 * 4 + 1], g[2] = m * u[0 * 4 + 2] + P * u[1 * 4 + 2] + D * u[2 * 4 + 2], g;
  }
  function s(c, u, h) {
    const g = h ?? new f(3), m = c[0], P = c[1], D = c[2];
    return g[0] = m * u[0] + P * u[4] + D * u[8], g[1] = m * u[1] + P * u[5] + D * u[9], g[2] = m * u[2] + P * u[6] + D * u[10], g;
  }
  function l(c, u, h) {
    const g = h ?? new f(3), m = u[0], P = u[1], D = u[2], _ = u[3] * 2, U = c[0], T = c[1], V = c[2], X = P * V - D * T, E = D * U - m * V, ce = m * T - P * U;
    return g[0] = U + X * _ + (P * ce - D * E) * 2, g[1] = T + E * _ + (D * X - m * ce) * 2, g[2] = V + ce * _ + (m * E - P * X) * 2, g;
  }
  function p(c, u) {
    const h = u ?? new f(3);
    return h[0] = c[12], h[1] = c[13], h[2] = c[14], h;
  }
  function w(c, u, h) {
    const g = h ?? new f(3), m = u * 4;
    return g[0] = c[m + 0], g[1] = c[m + 1], g[2] = c[m + 2], g;
  }
  function e(c, u) {
    const h = u ?? new f(3), g = c[0], m = c[1], P = c[2], D = c[4], _ = c[5], U = c[6], T = c[8], V = c[9], X = c[10];
    return h[0] = Math.sqrt(g * g + m * m + P * P), h[1] = Math.sqrt(D * D + _ * _ + U * U), h[2] = Math.sqrt(T * T + V * V + X * X), h;
  }
  function o(c, u, h, g) {
    const m = g ?? new f(3), P = [], D = [];
    return P[0] = c[0] - u[0], P[1] = c[1] - u[1], P[2] = c[2] - u[2], D[0] = P[0], D[1] = P[1] * Math.cos(h) - P[2] * Math.sin(h), D[2] = P[1] * Math.sin(h) + P[2] * Math.cos(h), m[0] = D[0] + u[0], m[1] = D[1] + u[1], m[2] = D[2] + u[2], m;
  }
  function n(c, u, h, g) {
    const m = g ?? new f(3), P = [], D = [];
    return P[0] = c[0] - u[0], P[1] = c[1] - u[1], P[2] = c[2] - u[2], D[0] = P[2] * Math.sin(h) + P[0] * Math.cos(h), D[1] = P[1], D[2] = P[2] * Math.cos(h) - P[0] * Math.sin(h), m[0] = D[0] + u[0], m[1] = D[1] + u[1], m[2] = D[2] + u[2], m;
  }
  function r(c, u, h, g) {
    const m = g ?? new f(3), P = [], D = [];
    return P[0] = c[0] - u[0], P[1] = c[1] - u[1], P[2] = c[2] - u[2], D[0] = P[0] * Math.cos(h) - P[1] * Math.sin(h), D[1] = P[0] * Math.sin(h) + P[1] * Math.cos(h), D[2] = P[2], m[0] = D[0] + u[0], m[1] = D[1] + u[1], m[2] = D[2] + u[2], m;
  }
  function a(c, u, h) {
    const g = h ?? new f(3);
    return de(c, g), q(g, u, g);
  }
  function x(c, u, h) {
    const g = h ?? new f(3);
    return te(c) > u ? a(c, u, g) : J(c, g);
  }
  function y(c, u, h) {
    const g = h ?? new f(3);
    return ae(c, u, 0.5, g);
  }
  return {
    create: v,
    fromValues: M,
    set: G,
    ceil: I,
    floor: b,
    round: F,
    clamp: Y,
    add: S,
    addScaled: B,
    angle: C,
    subtract: W,
    sub: ie,
    equalsApproximately: re,
    equals: fe,
    lerp: ae,
    lerpV: ue,
    max: se,
    min: K,
    mulScalar: q,
    scale: H,
    divScalar: oe,
    inverse: ne,
    invert: Q,
    cross: j,
    dot: Z,
    length: te,
    len: ge,
    lengthSq: A,
    lenSq: N,
    distance: O,
    dist: Be,
    distanceSq: L,
    distSq: me,
    normalize: de,
    negate: Se,
    copy: J,
    clone: pe,
    multiply: le,
    mul: ve,
    divide: R,
    div: $,
    random: ee,
    zero: i,
    transformMat4: d,
    transformMat4Upper3x3: t,
    transformMat3: s,
    transformQuat: l,
    getTranslation: p,
    getAxis: w,
    getScaling: e,
    rotateX: o,
    rotateY: n,
    rotateZ: r,
    setLength: a,
    truncate: x,
    midpoint: y
  };
}
const Je = /* @__PURE__ */ new Map();
function We(f) {
  let v = Je.get(f);
  return v || (v = fn(f), Je.set(f, v)), v;
}
function dn(f) {
  const v = sn(f), M = We(f);
  function G(i, d, t, s, l, p, w, e, o) {
    const n = new f(12);
    return n[3] = 0, n[7] = 0, n[11] = 0, i !== void 0 && (n[0] = i, d !== void 0 && (n[1] = d, t !== void 0 && (n[2] = t, s !== void 0 && (n[4] = s, l !== void 0 && (n[5] = l, p !== void 0 && (n[6] = p, w !== void 0 && (n[8] = w, e !== void 0 && (n[9] = e, o !== void 0 && (n[10] = o))))))))), n;
  }
  function I(i, d, t, s, l, p, w, e, o, n) {
    const r = n ?? new f(12);
    return r[0] = i, r[1] = d, r[2] = t, r[3] = 0, r[4] = s, r[5] = l, r[6] = p, r[7] = 0, r[8] = w, r[9] = e, r[10] = o, r[11] = 0, r;
  }
  function b(i, d) {
    const t = d ?? new f(12);
    return t[0] = i[0], t[1] = i[1], t[2] = i[2], t[3] = 0, t[4] = i[4], t[5] = i[5], t[6] = i[6], t[7] = 0, t[8] = i[8], t[9] = i[9], t[10] = i[10], t[11] = 0, t;
  }
  function F(i, d) {
    const t = d ?? new f(12), s = i[0], l = i[1], p = i[2], w = i[3], e = s + s, o = l + l, n = p + p, r = s * e, a = l * e, x = l * o, y = p * e, c = p * o, u = p * n, h = w * e, g = w * o, m = w * n;
    return t[0] = 1 - x - u, t[1] = a + m, t[2] = y - g, t[3] = 0, t[4] = a - m, t[5] = 1 - r - u, t[6] = c + h, t[7] = 0, t[8] = y + g, t[9] = c - h, t[10] = 1 - r - x, t[11] = 0, t;
  }
  function Y(i, d) {
    const t = d ?? new f(12);
    return t[0] = -i[0], t[1] = -i[1], t[2] = -i[2], t[4] = -i[4], t[5] = -i[5], t[6] = -i[6], t[8] = -i[8], t[9] = -i[9], t[10] = -i[10], t;
  }
  function S(i, d) {
    const t = d ?? new f(12);
    return t[0] = i[0], t[1] = i[1], t[2] = i[2], t[4] = i[4], t[5] = i[5], t[6] = i[6], t[8] = i[8], t[9] = i[9], t[10] = i[10], t;
  }
  const B = S;
  function C(i, d) {
    return Math.abs(i[0] - d[0]) < k && Math.abs(i[1] - d[1]) < k && Math.abs(i[2] - d[2]) < k && Math.abs(i[4] - d[4]) < k && Math.abs(i[5] - d[5]) < k && Math.abs(i[6] - d[6]) < k && Math.abs(i[8] - d[8]) < k && Math.abs(i[9] - d[9]) < k && Math.abs(i[10] - d[10]) < k;
  }
  function W(i, d) {
    return i[0] === d[0] && i[1] === d[1] && i[2] === d[2] && i[4] === d[4] && i[5] === d[5] && i[6] === d[6] && i[8] === d[8] && i[9] === d[9] && i[10] === d[10];
  }
  function ie(i) {
    const d = i ?? new f(12);
    return d[0] = 1, d[1] = 0, d[2] = 0, d[4] = 0, d[5] = 1, d[6] = 0, d[8] = 0, d[9] = 0, d[10] = 1, d;
  }
  function re(i, d) {
    const t = d ?? new f(12);
    if (t === i) {
      let x;
      return x = i[1], i[1] = i[4], i[4] = x, x = i[2], i[2] = i[8], i[8] = x, x = i[6], i[6] = i[9], i[9] = x, t;
    }
    const s = i[0 * 4 + 0], l = i[0 * 4 + 1], p = i[0 * 4 + 2], w = i[1 * 4 + 0], e = i[1 * 4 + 1], o = i[1 * 4 + 2], n = i[2 * 4 + 0], r = i[2 * 4 + 1], a = i[2 * 4 + 2];
    return t[0] = s, t[1] = w, t[2] = n, t[4] = l, t[5] = e, t[6] = r, t[8] = p, t[9] = o, t[10] = a, t;
  }
  function fe(i, d) {
    const t = d ?? new f(12), s = i[0 * 4 + 0], l = i[0 * 4 + 1], p = i[0 * 4 + 2], w = i[1 * 4 + 0], e = i[1 * 4 + 1], o = i[1 * 4 + 2], n = i[2 * 4 + 0], r = i[2 * 4 + 1], a = i[2 * 4 + 2], x = a * e - o * r, y = -a * w + o * n, c = r * w - e * n, u = 1 / (s * x + l * y + p * c);
    return t[0] = x * u, t[1] = (-a * l + p * r) * u, t[2] = (o * l - p * e) * u, t[4] = y * u, t[5] = (a * s - p * n) * u, t[6] = (-o * s + p * w) * u, t[8] = c * u, t[9] = (-r * s + l * n) * u, t[10] = (e * s - l * w) * u, t;
  }
  function ae(i) {
    const d = i[0], t = i[0 * 4 + 1], s = i[0 * 4 + 2], l = i[1 * 4 + 0], p = i[1 * 4 + 1], w = i[1 * 4 + 2], e = i[2 * 4 + 0], o = i[2 * 4 + 1], n = i[2 * 4 + 2];
    return d * (p * n - o * w) - l * (t * n - o * s) + e * (t * w - p * s);
  }
  const ue = fe;
  function se(i, d, t) {
    const s = t ?? new f(12), l = i[0], p = i[1], w = i[2], e = i[4], o = i[5], n = i[6], r = i[8], a = i[9], x = i[10], y = d[0], c = d[1], u = d[2], h = d[4], g = d[5], m = d[6], P = d[8], D = d[9], _ = d[10];
    return s[0] = l * y + e * c + r * u, s[1] = p * y + o * c + a * u, s[2] = w * y + n * c + x * u, s[4] = l * h + e * g + r * m, s[5] = p * h + o * g + a * m, s[6] = w * h + n * g + x * m, s[8] = l * P + e * D + r * _, s[9] = p * P + o * D + a * _, s[10] = w * P + n * D + x * _, s;
  }
  const K = se;
  function q(i, d, t) {
    const s = t ?? ie();
    return i !== s && (s[0] = i[0], s[1] = i[1], s[2] = i[2], s[4] = i[4], s[5] = i[5], s[6] = i[6]), s[8] = d[0], s[9] = d[1], s[10] = 1, s;
  }
  function H(i, d) {
    const t = d ?? v.create();
    return t[0] = i[8], t[1] = i[9], t;
  }
  function oe(i, d, t) {
    const s = t ?? v.create(), l = d * 4;
    return s[0] = i[l + 0], s[1] = i[l + 1], s;
  }
  function ne(i, d, t, s) {
    const l = s === i ? i : S(i, s), p = t * 4;
    return l[p + 0] = d[0], l[p + 1] = d[1], l;
  }
  function Q(i, d) {
    const t = d ?? v.create(), s = i[0], l = i[1], p = i[4], w = i[5];
    return t[0] = Math.sqrt(s * s + l * l), t[1] = Math.sqrt(p * p + w * w), t;
  }
  function j(i, d) {
    const t = d ?? M.create(), s = i[0], l = i[1], p = i[2], w = i[4], e = i[5], o = i[6], n = i[8], r = i[9], a = i[10];
    return t[0] = Math.sqrt(s * s + l * l + p * p), t[1] = Math.sqrt(w * w + e * e + o * o), t[2] = Math.sqrt(n * n + r * r + a * a), t;
  }
  function Z(i, d) {
    const t = d ?? new f(12);
    return t[0] = 1, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[8] = i[0], t[9] = i[1], t[10] = 1, t;
  }
  function te(i, d, t) {
    const s = t ?? new f(12), l = d[0], p = d[1], w = i[0], e = i[1], o = i[2], n = i[1 * 4 + 0], r = i[1 * 4 + 1], a = i[1 * 4 + 2], x = i[2 * 4 + 0], y = i[2 * 4 + 1], c = i[2 * 4 + 2];
    return i !== s && (s[0] = w, s[1] = e, s[2] = o, s[4] = n, s[5] = r, s[6] = a), s[8] = w * l + n * p + x, s[9] = e * l + r * p + y, s[10] = o * l + a * p + c, s;
  }
  function ge(i, d) {
    const t = d ?? new f(12), s = Math.cos(i), l = Math.sin(i);
    return t[0] = s, t[1] = l, t[2] = 0, t[4] = -l, t[5] = s, t[6] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t;
  }
  function A(i, d, t) {
    const s = t ?? new f(12), l = i[0 * 4 + 0], p = i[0 * 4 + 1], w = i[0 * 4 + 2], e = i[1 * 4 + 0], o = i[1 * 4 + 1], n = i[1 * 4 + 2], r = Math.cos(d), a = Math.sin(d);
    return s[0] = r * l + a * e, s[1] = r * p + a * o, s[2] = r * w + a * n, s[4] = r * e - a * l, s[5] = r * o - a * p, s[6] = r * n - a * w, i !== s && (s[8] = i[8], s[9] = i[9], s[10] = i[10]), s;
  }
  function N(i, d) {
    const t = d ?? new f(12), s = Math.cos(i), l = Math.sin(i);
    return t[0] = 1, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = s, t[6] = l, t[8] = 0, t[9] = -l, t[10] = s, t;
  }
  function O(i, d, t) {
    const s = t ?? new f(12), l = i[4], p = i[5], w = i[6], e = i[8], o = i[9], n = i[10], r = Math.cos(d), a = Math.sin(d);
    return s[4] = r * l + a * e, s[5] = r * p + a * o, s[6] = r * w + a * n, s[8] = r * e - a * l, s[9] = r * o - a * p, s[10] = r * n - a * w, i !== s && (s[0] = i[0], s[1] = i[1], s[2] = i[2]), s;
  }
  function Be(i, d) {
    const t = d ?? new f(12), s = Math.cos(i), l = Math.sin(i);
    return t[0] = s, t[1] = 0, t[2] = -l, t[4] = 0, t[5] = 1, t[6] = 0, t[8] = l, t[9] = 0, t[10] = s, t;
  }
  function L(i, d, t) {
    const s = t ?? new f(12), l = i[0 * 4 + 0], p = i[0 * 4 + 1], w = i[0 * 4 + 2], e = i[2 * 4 + 0], o = i[2 * 4 + 1], n = i[2 * 4 + 2], r = Math.cos(d), a = Math.sin(d);
    return s[0] = r * l - a * e, s[1] = r * p - a * o, s[2] = r * w - a * n, s[8] = r * e + a * l, s[9] = r * o + a * p, s[10] = r * n + a * w, i !== s && (s[4] = i[4], s[5] = i[5], s[6] = i[6]), s;
  }
  const me = ge, de = A;
  function Se(i, d) {
    const t = d ?? new f(12);
    return t[0] = i[0], t[1] = 0, t[2] = 0, t[4] = 0, t[5] = i[1], t[6] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t;
  }
  function J(i, d, t) {
    const s = t ?? new f(12), l = d[0], p = d[1];
    return s[0] = l * i[0 * 4 + 0], s[1] = l * i[0 * 4 + 1], s[2] = l * i[0 * 4 + 2], s[4] = p * i[1 * 4 + 0], s[5] = p * i[1 * 4 + 1], s[6] = p * i[1 * 4 + 2], i !== s && (s[8] = i[8], s[9] = i[9], s[10] = i[10]), s;
  }
  function pe(i, d) {
    const t = d ?? new f(12);
    return t[0] = i[0], t[1] = 0, t[2] = 0, t[4] = 0, t[5] = i[1], t[6] = 0, t[8] = 0, t[9] = 0, t[10] = i[2], t;
  }
  function le(i, d, t) {
    const s = t ?? new f(12), l = d[0], p = d[1], w = d[2];
    return s[0] = l * i[0 * 4 + 0], s[1] = l * i[0 * 4 + 1], s[2] = l * i[0 * 4 + 2], s[4] = p * i[1 * 4 + 0], s[5] = p * i[1 * 4 + 1], s[6] = p * i[1 * 4 + 2], s[8] = w * i[2 * 4 + 0], s[9] = w * i[2 * 4 + 1], s[10] = w * i[2 * 4 + 2], s;
  }
  function ve(i, d) {
    const t = d ?? new f(12);
    return t[0] = i, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = i, t[6] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t;
  }
  function R(i, d, t) {
    const s = t ?? new f(12);
    return s[0] = d * i[0 * 4 + 0], s[1] = d * i[0 * 4 + 1], s[2] = d * i[0 * 4 + 2], s[4] = d * i[1 * 4 + 0], s[5] = d * i[1 * 4 + 1], s[6] = d * i[1 * 4 + 2], i !== s && (s[8] = i[8], s[9] = i[9], s[10] = i[10]), s;
  }
  function $(i, d) {
    const t = d ?? new f(12);
    return t[0] = i, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = i, t[6] = 0, t[8] = 0, t[9] = 0, t[10] = i, t;
  }
  function ee(i, d, t) {
    const s = t ?? new f(12);
    return s[0] = d * i[0 * 4 + 0], s[1] = d * i[0 * 4 + 1], s[2] = d * i[0 * 4 + 2], s[4] = d * i[1 * 4 + 0], s[5] = d * i[1 * 4 + 1], s[6] = d * i[1 * 4 + 2], s[8] = d * i[2 * 4 + 0], s[9] = d * i[2 * 4 + 1], s[10] = d * i[2 * 4 + 2], s;
  }
  return {
    clone: B,
    create: G,
    set: I,
    fromMat4: b,
    fromQuat: F,
    negate: Y,
    copy: S,
    equalsApproximately: C,
    equals: W,
    identity: ie,
    transpose: re,
    inverse: fe,
    invert: ue,
    determinant: ae,
    mul: K,
    multiply: se,
    setTranslation: q,
    getTranslation: H,
    getAxis: oe,
    setAxis: ne,
    getScaling: Q,
    get3DScaling: j,
    translation: Z,
    translate: te,
    rotation: ge,
    rotate: A,
    rotationX: N,
    rotateX: O,
    rotationY: Be,
    rotateY: L,
    rotationZ: me,
    rotateZ: de,
    scaling: Se,
    scale: J,
    uniformScaling: ve,
    uniformScale: R,
    scaling3D: pe,
    scale3D: le,
    uniformScaling3D: $,
    uniformScale3D: ee
  };
}
const en = /* @__PURE__ */ new Map();
function pn(f) {
  let v = en.get(f);
  return v || (v = dn(f), en.set(f, v)), v;
}
function hn(f) {
  const v = We(f);
  function M(e, o, n, r, a, x, y, c, u, h, g, m, P, D, _, U) {
    const T = new f(16);
    return e !== void 0 && (T[0] = e, o !== void 0 && (T[1] = o, n !== void 0 && (T[2] = n, r !== void 0 && (T[3] = r, a !== void 0 && (T[4] = a, x !== void 0 && (T[5] = x, y !== void 0 && (T[6] = y, c !== void 0 && (T[7] = c, u !== void 0 && (T[8] = u, h !== void 0 && (T[9] = h, g !== void 0 && (T[10] = g, m !== void 0 && (T[11] = m, P !== void 0 && (T[12] = P, D !== void 0 && (T[13] = D, _ !== void 0 && (T[14] = _, U !== void 0 && (T[15] = U)))))))))))))))), T;
  }
  function G(e, o, n, r, a, x, y, c, u, h, g, m, P, D, _, U, T) {
    const V = T ?? new f(16);
    return V[0] = e, V[1] = o, V[2] = n, V[3] = r, V[4] = a, V[5] = x, V[6] = y, V[7] = c, V[8] = u, V[9] = h, V[10] = g, V[11] = m, V[12] = P, V[13] = D, V[14] = _, V[15] = U, V;
  }
  function I(e, o) {
    const n = o ?? new f(16);
    return n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = 0, n[4] = e[4], n[5] = e[5], n[6] = e[6], n[7] = 0, n[8] = e[8], n[9] = e[9], n[10] = e[10], n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function b(e, o) {
    const n = o ?? new f(16), r = e[0], a = e[1], x = e[2], y = e[3], c = r + r, u = a + a, h = x + x, g = r * c, m = a * c, P = a * u, D = x * c, _ = x * u, U = x * h, T = y * c, V = y * u, X = y * h;
    return n[0] = 1 - P - U, n[1] = m + X, n[2] = D - V, n[3] = 0, n[4] = m - X, n[5] = 1 - g - U, n[6] = _ + T, n[7] = 0, n[8] = D + V, n[9] = _ - T, n[10] = 1 - g - P, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function F(e, o) {
    const n = o ?? new f(16);
    return n[0] = -e[0], n[1] = -e[1], n[2] = -e[2], n[3] = -e[3], n[4] = -e[4], n[5] = -e[5], n[6] = -e[6], n[7] = -e[7], n[8] = -e[8], n[9] = -e[9], n[10] = -e[10], n[11] = -e[11], n[12] = -e[12], n[13] = -e[13], n[14] = -e[14], n[15] = -e[15], n;
  }
  function Y(e, o) {
    const n = o ?? new f(16);
    return n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = e[3], n[4] = e[4], n[5] = e[5], n[6] = e[6], n[7] = e[7], n[8] = e[8], n[9] = e[9], n[10] = e[10], n[11] = e[11], n[12] = e[12], n[13] = e[13], n[14] = e[14], n[15] = e[15], n;
  }
  const S = Y;
  function B(e, o) {
    return Math.abs(e[0] - o[0]) < k && Math.abs(e[1] - o[1]) < k && Math.abs(e[2] - o[2]) < k && Math.abs(e[3] - o[3]) < k && Math.abs(e[4] - o[4]) < k && Math.abs(e[5] - o[5]) < k && Math.abs(e[6] - o[6]) < k && Math.abs(e[7] - o[7]) < k && Math.abs(e[8] - o[8]) < k && Math.abs(e[9] - o[9]) < k && Math.abs(e[10] - o[10]) < k && Math.abs(e[11] - o[11]) < k && Math.abs(e[12] - o[12]) < k && Math.abs(e[13] - o[13]) < k && Math.abs(e[14] - o[14]) < k && Math.abs(e[15] - o[15]) < k;
  }
  function C(e, o) {
    return e[0] === o[0] && e[1] === o[1] && e[2] === o[2] && e[3] === o[3] && e[4] === o[4] && e[5] === o[5] && e[6] === o[6] && e[7] === o[7] && e[8] === o[8] && e[9] === o[9] && e[10] === o[10] && e[11] === o[11] && e[12] === o[12] && e[13] === o[13] && e[14] === o[14] && e[15] === o[15];
  }
  function W(e) {
    const o = e ?? new f(16);
    return o[0] = 1, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = 1, o[6] = 0, o[7] = 0, o[8] = 0, o[9] = 0, o[10] = 1, o[11] = 0, o[12] = 0, o[13] = 0, o[14] = 0, o[15] = 1, o;
  }
  function ie(e, o) {
    const n = o ?? new f(16);
    if (n === e) {
      let E;
      return E = e[1], e[1] = e[4], e[4] = E, E = e[2], e[2] = e[8], e[8] = E, E = e[3], e[3] = e[12], e[12] = E, E = e[6], e[6] = e[9], e[9] = E, E = e[7], e[7] = e[13], e[13] = E, E = e[11], e[11] = e[14], e[14] = E, n;
    }
    const r = e[0 * 4 + 0], a = e[0 * 4 + 1], x = e[0 * 4 + 2], y = e[0 * 4 + 3], c = e[1 * 4 + 0], u = e[1 * 4 + 1], h = e[1 * 4 + 2], g = e[1 * 4 + 3], m = e[2 * 4 + 0], P = e[2 * 4 + 1], D = e[2 * 4 + 2], _ = e[2 * 4 + 3], U = e[3 * 4 + 0], T = e[3 * 4 + 1], V = e[3 * 4 + 2], X = e[3 * 4 + 3];
    return n[0] = r, n[1] = c, n[2] = m, n[3] = U, n[4] = a, n[5] = u, n[6] = P, n[7] = T, n[8] = x, n[9] = h, n[10] = D, n[11] = V, n[12] = y, n[13] = g, n[14] = _, n[15] = X, n;
  }
  function re(e, o) {
    const n = o ?? new f(16), r = e[0 * 4 + 0], a = e[0 * 4 + 1], x = e[0 * 4 + 2], y = e[0 * 4 + 3], c = e[1 * 4 + 0], u = e[1 * 4 + 1], h = e[1 * 4 + 2], g = e[1 * 4 + 3], m = e[2 * 4 + 0], P = e[2 * 4 + 1], D = e[2 * 4 + 2], _ = e[2 * 4 + 3], U = e[3 * 4 + 0], T = e[3 * 4 + 1], V = e[3 * 4 + 2], X = e[3 * 4 + 3], E = D * X, ce = V * _, he = h * X, xe = V * g, we = h * _, ye = D * g, Pe = x * X, De = V * y, Me = x * _, ze = D * y, Ge = x * g, Te = h * y, _e = m * T, Ve = U * P, Fe = c * T, Ie = U * u, Ue = c * P, ke = m * u, Xe = r * T, He = U * a, Le = r * P, qe = m * a, Ne = r * u, Ee = c * a, Ze = E * u + xe * P + we * T - (ce * u + he * P + ye * T), Ce = ce * a + Pe * P + ze * T - (E * a + De * P + Me * T), $e = he * a + De * u + Ge * T - (xe * a + Pe * u + Te * T), Ke = ye * a + Me * u + Te * P - (we * a + ze * u + Ge * P), be = 1 / (r * Ze + c * Ce + m * $e + U * Ke);
    return n[0] = be * Ze, n[1] = be * Ce, n[2] = be * $e, n[3] = be * Ke, n[4] = be * (ce * c + he * m + ye * U - (E * c + xe * m + we * U)), n[5] = be * (E * r + De * m + Me * U - (ce * r + Pe * m + ze * U)), n[6] = be * (xe * r + Pe * c + Te * U - (he * r + De * c + Ge * U)), n[7] = be * (we * r + ze * c + Ge * m - (ye * r + Me * c + Te * m)), n[8] = be * (_e * g + Ie * _ + Ue * X - (Ve * g + Fe * _ + ke * X)), n[9] = be * (Ve * y + Xe * _ + qe * X - (_e * y + He * _ + Le * X)), n[10] = be * (Fe * y + He * g + Ne * X - (Ie * y + Xe * g + Ee * X)), n[11] = be * (ke * y + Le * g + Ee * _ - (Ue * y + qe * g + Ne * _)), n[12] = be * (Fe * D + ke * V + Ve * h - (Ue * V + _e * h + Ie * D)), n[13] = be * (Le * V + _e * x + He * D - (Xe * D + qe * V + Ve * x)), n[14] = be * (Xe * h + Ee * V + Ie * x - (Ne * V + Fe * x + He * h)), n[15] = be * (Ne * D + Ue * x + qe * h - (Le * h + Ee * D + ke * x)), n;
  }
  function fe(e) {
    const o = e[0], n = e[0 * 4 + 1], r = e[0 * 4 + 2], a = e[0 * 4 + 3], x = e[1 * 4 + 0], y = e[1 * 4 + 1], c = e[1 * 4 + 2], u = e[1 * 4 + 3], h = e[2 * 4 + 0], g = e[2 * 4 + 1], m = e[2 * 4 + 2], P = e[2 * 4 + 3], D = e[3 * 4 + 0], _ = e[3 * 4 + 1], U = e[3 * 4 + 2], T = e[3 * 4 + 3], V = m * T, X = U * P, E = c * T, ce = U * u, he = c * P, xe = m * u, we = r * T, ye = U * a, Pe = r * P, De = m * a, Me = r * u, ze = c * a, Ge = V * y + ce * g + he * _ - (X * y + E * g + xe * _), Te = X * n + we * g + De * _ - (V * n + ye * g + Pe * _), _e = E * n + ye * y + Me * _ - (ce * n + we * y + ze * _), Ve = xe * n + Pe * y + ze * g - (he * n + De * y + Me * g);
    return o * Ge + x * Te + h * _e + D * Ve;
  }
  const ae = re;
  function ue(e, o, n) {
    const r = n ?? new f(16), a = e[0], x = e[1], y = e[2], c = e[3], u = e[4], h = e[5], g = e[6], m = e[7], P = e[8], D = e[9], _ = e[10], U = e[11], T = e[12], V = e[13], X = e[14], E = e[15], ce = o[0], he = o[1], xe = o[2], we = o[3], ye = o[4], Pe = o[5], De = o[6], Me = o[7], ze = o[8], Ge = o[9], Te = o[10], _e = o[11], Ve = o[12], Fe = o[13], Ie = o[14], Ue = o[15];
    return r[0] = a * ce + u * he + P * xe + T * we, r[1] = x * ce + h * he + D * xe + V * we, r[2] = y * ce + g * he + _ * xe + X * we, r[3] = c * ce + m * he + U * xe + E * we, r[4] = a * ye + u * Pe + P * De + T * Me, r[5] = x * ye + h * Pe + D * De + V * Me, r[6] = y * ye + g * Pe + _ * De + X * Me, r[7] = c * ye + m * Pe + U * De + E * Me, r[8] = a * ze + u * Ge + P * Te + T * _e, r[9] = x * ze + h * Ge + D * Te + V * _e, r[10] = y * ze + g * Ge + _ * Te + X * _e, r[11] = c * ze + m * Ge + U * Te + E * _e, r[12] = a * Ve + u * Fe + P * Ie + T * Ue, r[13] = x * Ve + h * Fe + D * Ie + V * Ue, r[14] = y * Ve + g * Fe + _ * Ie + X * Ue, r[15] = c * Ve + m * Fe + U * Ie + E * Ue, r;
  }
  const se = ue;
  function K(e, o, n) {
    const r = n ?? W();
    return e !== r && (r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = e[3], r[4] = e[4], r[5] = e[5], r[6] = e[6], r[7] = e[7], r[8] = e[8], r[9] = e[9], r[10] = e[10], r[11] = e[11]), r[12] = o[0], r[13] = o[1], r[14] = o[2], r[15] = 1, r;
  }
  function q(e, o) {
    const n = o ?? v.create();
    return n[0] = e[12], n[1] = e[13], n[2] = e[14], n;
  }
  function H(e, o, n) {
    const r = n ?? v.create(), a = o * 4;
    return r[0] = e[a + 0], r[1] = e[a + 1], r[2] = e[a + 2], r;
  }
  function oe(e, o, n, r) {
    const a = r === e ? r : Y(e, r), x = n * 4;
    return a[x + 0] = o[0], a[x + 1] = o[1], a[x + 2] = o[2], a;
  }
  function ne(e, o) {
    const n = o ?? v.create(), r = e[0], a = e[1], x = e[2], y = e[4], c = e[5], u = e[6], h = e[8], g = e[9], m = e[10];
    return n[0] = Math.sqrt(r * r + a * a + x * x), n[1] = Math.sqrt(y * y + c * c + u * u), n[2] = Math.sqrt(h * h + g * g + m * m), n;
  }
  function Q(e, o, n, r, a) {
    const x = a ?? new f(16), y = Math.tan(Math.PI * 0.5 - 0.5 * e);
    if (x[0] = y / o, x[1] = 0, x[2] = 0, x[3] = 0, x[4] = 0, x[5] = y, x[6] = 0, x[7] = 0, x[8] = 0, x[9] = 0, x[11] = -1, x[12] = 0, x[13] = 0, x[15] = 0, Number.isFinite(r)) {
      const c = 1 / (n - r);
      x[10] = r * c, x[14] = r * n * c;
    } else
      x[10] = -1, x[14] = -n;
    return x;
  }
  function j(e, o, n, r = 1 / 0, a) {
    const x = a ?? new f(16), y = 1 / Math.tan(e * 0.5);
    if (x[0] = y / o, x[1] = 0, x[2] = 0, x[3] = 0, x[4] = 0, x[5] = y, x[6] = 0, x[7] = 0, x[8] = 0, x[9] = 0, x[11] = -1, x[12] = 0, x[13] = 0, x[15] = 0, r === 1 / 0)
      x[10] = 0, x[14] = n;
    else {
      const c = 1 / (r - n);
      x[10] = n * c, x[14] = r * n * c;
    }
    return x;
  }
  function Z(e, o, n, r, a, x, y) {
    const c = y ?? new f(16);
    return c[0] = 2 / (o - e), c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 2 / (r - n), c[6] = 0, c[7] = 0, c[8] = 0, c[9] = 0, c[10] = 1 / (a - x), c[11] = 0, c[12] = (o + e) / (e - o), c[13] = (r + n) / (n - r), c[14] = a / (a - x), c[15] = 1, c;
  }
  function te(e, o, n, r, a, x, y) {
    const c = y ?? new f(16), u = o - e, h = r - n, g = a - x;
    return c[0] = 2 * a / u, c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 2 * a / h, c[6] = 0, c[7] = 0, c[8] = (e + o) / u, c[9] = (r + n) / h, c[10] = x / g, c[11] = -1, c[12] = 0, c[13] = 0, c[14] = a * x / g, c[15] = 0, c;
  }
  function ge(e, o, n, r, a, x = 1 / 0, y) {
    const c = y ?? new f(16), u = o - e, h = r - n;
    if (c[0] = 2 * a / u, c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 2 * a / h, c[6] = 0, c[7] = 0, c[8] = (e + o) / u, c[9] = (r + n) / h, c[11] = -1, c[12] = 0, c[13] = 0, c[15] = 0, x === 1 / 0)
      c[10] = 0, c[14] = a;
    else {
      const g = 1 / (x - a);
      c[10] = a * g, c[14] = x * a * g;
    }
    return c;
  }
  const A = v.create(), N = v.create(), O = v.create();
  function Be(e, o, n, r) {
    const a = r ?? new f(16);
    return v.normalize(v.subtract(o, e, O), O), v.normalize(v.cross(n, O, A), A), v.normalize(v.cross(O, A, N), N), a[0] = A[0], a[1] = A[1], a[2] = A[2], a[3] = 0, a[4] = N[0], a[5] = N[1], a[6] = N[2], a[7] = 0, a[8] = O[0], a[9] = O[1], a[10] = O[2], a[11] = 0, a[12] = e[0], a[13] = e[1], a[14] = e[2], a[15] = 1, a;
  }
  function L(e, o, n, r) {
    const a = r ?? new f(16);
    return v.normalize(v.subtract(e, o, O), O), v.normalize(v.cross(n, O, A), A), v.normalize(v.cross(O, A, N), N), a[0] = A[0], a[1] = A[1], a[2] = A[2], a[3] = 0, a[4] = N[0], a[5] = N[1], a[6] = N[2], a[7] = 0, a[8] = O[0], a[9] = O[1], a[10] = O[2], a[11] = 0, a[12] = e[0], a[13] = e[1], a[14] = e[2], a[15] = 1, a;
  }
  function me(e, o, n, r) {
    const a = r ?? new f(16);
    return v.normalize(v.subtract(e, o, O), O), v.normalize(v.cross(n, O, A), A), v.normalize(v.cross(O, A, N), N), a[0] = A[0], a[1] = N[0], a[2] = O[0], a[3] = 0, a[4] = A[1], a[5] = N[1], a[6] = O[1], a[7] = 0, a[8] = A[2], a[9] = N[2], a[10] = O[2], a[11] = 0, a[12] = -(A[0] * e[0] + A[1] * e[1] + A[2] * e[2]), a[13] = -(N[0] * e[0] + N[1] * e[1] + N[2] * e[2]), a[14] = -(O[0] * e[0] + O[1] * e[1] + O[2] * e[2]), a[15] = 1, a;
  }
  function de(e, o) {
    const n = o ?? new f(16);
    return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = e[0], n[13] = e[1], n[14] = e[2], n[15] = 1, n;
  }
  function Se(e, o, n) {
    const r = n ?? new f(16), a = o[0], x = o[1], y = o[2], c = e[0], u = e[1], h = e[2], g = e[3], m = e[1 * 4 + 0], P = e[1 * 4 + 1], D = e[1 * 4 + 2], _ = e[1 * 4 + 3], U = e[2 * 4 + 0], T = e[2 * 4 + 1], V = e[2 * 4 + 2], X = e[2 * 4 + 3], E = e[3 * 4 + 0], ce = e[3 * 4 + 1], he = e[3 * 4 + 2], xe = e[3 * 4 + 3];
    return e !== r && (r[0] = c, r[1] = u, r[2] = h, r[3] = g, r[4] = m, r[5] = P, r[6] = D, r[7] = _, r[8] = U, r[9] = T, r[10] = V, r[11] = X), r[12] = c * a + m * x + U * y + E, r[13] = u * a + P * x + T * y + ce, r[14] = h * a + D * x + V * y + he, r[15] = g * a + _ * x + X * y + xe, r;
  }
  function J(e, o) {
    const n = o ?? new f(16), r = Math.cos(e), a = Math.sin(e);
    return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = r, n[6] = a, n[7] = 0, n[8] = 0, n[9] = -a, n[10] = r, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function pe(e, o, n) {
    const r = n ?? new f(16), a = e[4], x = e[5], y = e[6], c = e[7], u = e[8], h = e[9], g = e[10], m = e[11], P = Math.cos(o), D = Math.sin(o);
    return r[4] = P * a + D * u, r[5] = P * x + D * h, r[6] = P * y + D * g, r[7] = P * c + D * m, r[8] = P * u - D * a, r[9] = P * h - D * x, r[10] = P * g - D * y, r[11] = P * m - D * c, e !== r && (r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = e[3], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15]), r;
  }
  function le(e, o) {
    const n = o ?? new f(16), r = Math.cos(e), a = Math.sin(e);
    return n[0] = r, n[1] = 0, n[2] = -a, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = a, n[9] = 0, n[10] = r, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function ve(e, o, n) {
    const r = n ?? new f(16), a = e[0 * 4 + 0], x = e[0 * 4 + 1], y = e[0 * 4 + 2], c = e[0 * 4 + 3], u = e[2 * 4 + 0], h = e[2 * 4 + 1], g = e[2 * 4 + 2], m = e[2 * 4 + 3], P = Math.cos(o), D = Math.sin(o);
    return r[0] = P * a - D * u, r[1] = P * x - D * h, r[2] = P * y - D * g, r[3] = P * c - D * m, r[8] = P * u + D * a, r[9] = P * h + D * x, r[10] = P * g + D * y, r[11] = P * m + D * c, e !== r && (r[4] = e[4], r[5] = e[5], r[6] = e[6], r[7] = e[7], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15]), r;
  }
  function R(e, o) {
    const n = o ?? new f(16), r = Math.cos(e), a = Math.sin(e);
    return n[0] = r, n[1] = a, n[2] = 0, n[3] = 0, n[4] = -a, n[5] = r, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function $(e, o, n) {
    const r = n ?? new f(16), a = e[0 * 4 + 0], x = e[0 * 4 + 1], y = e[0 * 4 + 2], c = e[0 * 4 + 3], u = e[1 * 4 + 0], h = e[1 * 4 + 1], g = e[1 * 4 + 2], m = e[1 * 4 + 3], P = Math.cos(o), D = Math.sin(o);
    return r[0] = P * a + D * u, r[1] = P * x + D * h, r[2] = P * y + D * g, r[3] = P * c + D * m, r[4] = P * u - D * a, r[5] = P * h - D * x, r[6] = P * g - D * y, r[7] = P * m - D * c, e !== r && (r[8] = e[8], r[9] = e[9], r[10] = e[10], r[11] = e[11], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15]), r;
  }
  function ee(e, o, n) {
    const r = n ?? new f(16);
    let a = e[0], x = e[1], y = e[2];
    const c = Math.sqrt(a * a + x * x + y * y);
    a /= c, x /= c, y /= c;
    const u = a * a, h = x * x, g = y * y, m = Math.cos(o), P = Math.sin(o), D = 1 - m;
    return r[0] = u + (1 - u) * m, r[1] = a * x * D + y * P, r[2] = a * y * D - x * P, r[3] = 0, r[4] = a * x * D - y * P, r[5] = h + (1 - h) * m, r[6] = x * y * D + a * P, r[7] = 0, r[8] = a * y * D + x * P, r[9] = x * y * D - a * P, r[10] = g + (1 - g) * m, r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r;
  }
  const i = ee;
  function d(e, o, n, r) {
    const a = r ?? new f(16);
    let x = o[0], y = o[1], c = o[2];
    const u = Math.sqrt(x * x + y * y + c * c);
    x /= u, y /= u, c /= u;
    const h = x * x, g = y * y, m = c * c, P = Math.cos(n), D = Math.sin(n), _ = 1 - P, U = h + (1 - h) * P, T = x * y * _ + c * D, V = x * c * _ - y * D, X = x * y * _ - c * D, E = g + (1 - g) * P, ce = y * c * _ + x * D, he = x * c * _ + y * D, xe = y * c * _ - x * D, we = m + (1 - m) * P, ye = e[0], Pe = e[1], De = e[2], Me = e[3], ze = e[4], Ge = e[5], Te = e[6], _e = e[7], Ve = e[8], Fe = e[9], Ie = e[10], Ue = e[11];
    return a[0] = U * ye + T * ze + V * Ve, a[1] = U * Pe + T * Ge + V * Fe, a[2] = U * De + T * Te + V * Ie, a[3] = U * Me + T * _e + V * Ue, a[4] = X * ye + E * ze + ce * Ve, a[5] = X * Pe + E * Ge + ce * Fe, a[6] = X * De + E * Te + ce * Ie, a[7] = X * Me + E * _e + ce * Ue, a[8] = he * ye + xe * ze + we * Ve, a[9] = he * Pe + xe * Ge + we * Fe, a[10] = he * De + xe * Te + we * Ie, a[11] = he * Me + xe * _e + we * Ue, e !== a && (a[12] = e[12], a[13] = e[13], a[14] = e[14], a[15] = e[15]), a;
  }
  const t = d;
  function s(e, o) {
    const n = o ?? new f(16);
    return n[0] = e[0], n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = e[1], n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = e[2], n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function l(e, o, n) {
    const r = n ?? new f(16), a = o[0], x = o[1], y = o[2];
    return r[0] = a * e[0 * 4 + 0], r[1] = a * e[0 * 4 + 1], r[2] = a * e[0 * 4 + 2], r[3] = a * e[0 * 4 + 3], r[4] = x * e[1 * 4 + 0], r[5] = x * e[1 * 4 + 1], r[6] = x * e[1 * 4 + 2], r[7] = x * e[1 * 4 + 3], r[8] = y * e[2 * 4 + 0], r[9] = y * e[2 * 4 + 1], r[10] = y * e[2 * 4 + 2], r[11] = y * e[2 * 4 + 3], e !== r && (r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15]), r;
  }
  function p(e, o) {
    const n = o ?? new f(16);
    return n[0] = e, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = e, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = e, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function w(e, o, n) {
    const r = n ?? new f(16);
    return r[0] = o * e[0 * 4 + 0], r[1] = o * e[0 * 4 + 1], r[2] = o * e[0 * 4 + 2], r[3] = o * e[0 * 4 + 3], r[4] = o * e[1 * 4 + 0], r[5] = o * e[1 * 4 + 1], r[6] = o * e[1 * 4 + 2], r[7] = o * e[1 * 4 + 3], r[8] = o * e[2 * 4 + 0], r[9] = o * e[2 * 4 + 1], r[10] = o * e[2 * 4 + 2], r[11] = o * e[2 * 4 + 3], e !== r && (r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15]), r;
  }
  return {
    create: M,
    set: G,
    fromMat3: I,
    fromQuat: b,
    negate: F,
    copy: Y,
    clone: S,
    equalsApproximately: B,
    equals: C,
    identity: W,
    transpose: ie,
    inverse: re,
    determinant: fe,
    invert: ae,
    multiply: ue,
    mul: se,
    setTranslation: K,
    getTranslation: q,
    getAxis: H,
    setAxis: oe,
    getScaling: ne,
    perspective: Q,
    perspectiveReverseZ: j,
    ortho: Z,
    frustum: te,
    frustumReverseZ: ge,
    aim: Be,
    cameraAim: L,
    lookAt: me,
    translation: de,
    translate: Se,
    rotationX: J,
    rotateX: pe,
    rotationY: le,
    rotateY: ve,
    rotationZ: R,
    rotateZ: $,
    axisRotation: ee,
    rotation: i,
    axisRotate: d,
    rotate: t,
    scaling: s,
    scale: l,
    uniformScaling: p,
    uniformScale: w
  };
}
const nn = /* @__PURE__ */ new Map();
function xn(f) {
  let v = nn.get(f);
  return v || (v = hn(f), nn.set(f, v)), v;
}
function gn(f) {
  const v = We(f);
  function M(i, d, t, s) {
    const l = new f(4);
    return i !== void 0 && (l[0] = i, d !== void 0 && (l[1] = d, t !== void 0 && (l[2] = t, s !== void 0 && (l[3] = s)))), l;
  }
  const G = M;
  function I(i, d, t, s, l) {
    const p = l ?? new f(4);
    return p[0] = i, p[1] = d, p[2] = t, p[3] = s, p;
  }
  function b(i, d, t) {
    const s = t ?? new f(4), l = d * 0.5, p = Math.sin(l);
    return s[0] = p * i[0], s[1] = p * i[1], s[2] = p * i[2], s[3] = Math.cos(l), s;
  }
  function F(i, d) {
    const t = d ?? v.create(3), s = Math.acos(i[3]) * 2, l = Math.sin(s * 0.5);
    return l > k ? (t[0] = i[0] / l, t[1] = i[1] / l, t[2] = i[2] / l) : (t[0] = 1, t[1] = 0, t[2] = 0), { angle: s, axis: t };
  }
  function Y(i, d) {
    const t = te(i, d);
    return Math.acos(2 * t * t - 1);
  }
  function S(i, d, t) {
    const s = t ?? new f(4), l = i[0], p = i[1], w = i[2], e = i[3], o = d[0], n = d[1], r = d[2], a = d[3];
    return s[0] = l * a + e * o + p * r - w * n, s[1] = p * a + e * n + w * o - l * r, s[2] = w * a + e * r + l * n - p * o, s[3] = e * a - l * o - p * n - w * r, s;
  }
  const B = S;
  function C(i, d, t) {
    const s = t ?? new f(4), l = d * 0.5, p = i[0], w = i[1], e = i[2], o = i[3], n = Math.sin(l), r = Math.cos(l);
    return s[0] = p * r + o * n, s[1] = w * r + e * n, s[2] = e * r - w * n, s[3] = o * r - p * n, s;
  }
  function W(i, d, t) {
    const s = t ?? new f(4), l = d * 0.5, p = i[0], w = i[1], e = i[2], o = i[3], n = Math.sin(l), r = Math.cos(l);
    return s[0] = p * r - e * n, s[1] = w * r + o * n, s[2] = e * r + p * n, s[3] = o * r - w * n, s;
  }
  function ie(i, d, t) {
    const s = t ?? new f(4), l = d * 0.5, p = i[0], w = i[1], e = i[2], o = i[3], n = Math.sin(l), r = Math.cos(l);
    return s[0] = p * r + w * n, s[1] = w * r - p * n, s[2] = e * r + o * n, s[3] = o * r - e * n, s;
  }
  function re(i, d, t, s) {
    const l = s ?? new f(4), p = i[0], w = i[1], e = i[2], o = i[3];
    let n = d[0], r = d[1], a = d[2], x = d[3], y = p * n + w * r + e * a + o * x;
    y < 0 && (y = -y, n = -n, r = -r, a = -a, x = -x);
    let c, u;
    if (1 - y > k) {
      const h = Math.acos(y), g = Math.sin(h);
      c = Math.sin((1 - t) * h) / g, u = Math.sin(t * h) / g;
    } else
      c = 1 - t, u = t;
    return l[0] = c * p + u * n, l[1] = c * w + u * r, l[2] = c * e + u * a, l[3] = c * o + u * x, l;
  }
  function fe(i, d) {
    const t = d ?? new f(4), s = i[0], l = i[1], p = i[2], w = i[3], e = s * s + l * l + p * p + w * w, o = e ? 1 / e : 0;
    return t[0] = -s * o, t[1] = -l * o, t[2] = -p * o, t[3] = w * o, t;
  }
  function ae(i, d) {
    const t = d ?? new f(4);
    return t[0] = -i[0], t[1] = -i[1], t[2] = -i[2], t[3] = i[3], t;
  }
  function ue(i, d) {
    const t = d ?? new f(4), s = i[0] + i[5] + i[10];
    if (s > 0) {
      const l = Math.sqrt(s + 1);
      t[3] = 0.5 * l;
      const p = 0.5 / l;
      t[0] = (i[6] - i[9]) * p, t[1] = (i[8] - i[2]) * p, t[2] = (i[1] - i[4]) * p;
    } else {
      let l = 0;
      i[5] > i[0] && (l = 1), i[10] > i[l * 4 + l] && (l = 2);
      const p = (l + 1) % 3, w = (l + 2) % 3, e = Math.sqrt(i[l * 4 + l] - i[p * 4 + p] - i[w * 4 + w] + 1);
      t[l] = 0.5 * e;
      const o = 0.5 / e;
      t[3] = (i[p * 4 + w] - i[w * 4 + p]) * o, t[p] = (i[p * 4 + l] + i[l * 4 + p]) * o, t[w] = (i[w * 4 + l] + i[l * 4 + w]) * o;
    }
    return t;
  }
  function se(i, d, t, s, l) {
    const p = l ?? new f(4), w = i * 0.5, e = d * 0.5, o = t * 0.5, n = Math.sin(w), r = Math.cos(w), a = Math.sin(e), x = Math.cos(e), y = Math.sin(o), c = Math.cos(o);
    switch (s) {
      case "xyz":
        p[0] = n * x * c + r * a * y, p[1] = r * a * c - n * x * y, p[2] = r * x * y + n * a * c, p[3] = r * x * c - n * a * y;
        break;
      case "xzy":
        p[0] = n * x * c - r * a * y, p[1] = r * a * c - n * x * y, p[2] = r * x * y + n * a * c, p[3] = r * x * c + n * a * y;
        break;
      case "yxz":
        p[0] = n * x * c + r * a * y, p[1] = r * a * c - n * x * y, p[2] = r * x * y - n * a * c, p[3] = r * x * c + n * a * y;
        break;
      case "yzx":
        p[0] = n * x * c + r * a * y, p[1] = r * a * c + n * x * y, p[2] = r * x * y - n * a * c, p[3] = r * x * c - n * a * y;
        break;
      case "zxy":
        p[0] = n * x * c - r * a * y, p[1] = r * a * c + n * x * y, p[2] = r * x * y + n * a * c, p[3] = r * x * c - n * a * y;
        break;
      case "zyx":
        p[0] = n * x * c - r * a * y, p[1] = r * a * c + n * x * y, p[2] = r * x * y - n * a * c, p[3] = r * x * c + n * a * y;
        break;
      default:
        throw new Error(`Unknown rotation order: ${s}`);
    }
    return p;
  }
  function K(i, d) {
    const t = d ?? new f(4);
    return t[0] = i[0], t[1] = i[1], t[2] = i[2], t[3] = i[3], t;
  }
  const q = K;
  function H(i, d, t) {
    const s = t ?? new f(4);
    return s[0] = i[0] + d[0], s[1] = i[1] + d[1], s[2] = i[2] + d[2], s[3] = i[3] + d[3], s;
  }
  function oe(i, d, t) {
    const s = t ?? new f(4);
    return s[0] = i[0] - d[0], s[1] = i[1] - d[1], s[2] = i[2] - d[2], s[3] = i[3] - d[3], s;
  }
  const ne = oe;
  function Q(i, d, t) {
    const s = t ?? new f(4);
    return s[0] = i[0] * d, s[1] = i[1] * d, s[2] = i[2] * d, s[3] = i[3] * d, s;
  }
  const j = Q;
  function Z(i, d, t) {
    const s = t ?? new f(4);
    return s[0] = i[0] / d, s[1] = i[1] / d, s[2] = i[2] / d, s[3] = i[3] / d, s;
  }
  function te(i, d) {
    return i[0] * d[0] + i[1] * d[1] + i[2] * d[2] + i[3] * d[3];
  }
  function ge(i, d, t, s) {
    const l = s ?? new f(4);
    return l[0] = i[0] + t * (d[0] - i[0]), l[1] = i[1] + t * (d[1] - i[1]), l[2] = i[2] + t * (d[2] - i[2]), l[3] = i[3] + t * (d[3] - i[3]), l;
  }
  function A(i) {
    const d = i[0], t = i[1], s = i[2], l = i[3];
    return Math.sqrt(d * d + t * t + s * s + l * l);
  }
  const N = A;
  function O(i) {
    const d = i[0], t = i[1], s = i[2], l = i[3];
    return d * d + t * t + s * s + l * l;
  }
  const Be = O;
  function L(i, d) {
    const t = d ?? new f(4), s = i[0], l = i[1], p = i[2], w = i[3], e = Math.sqrt(s * s + l * l + p * p + w * w);
    return e > 1e-5 ? (t[0] = s / e, t[1] = l / e, t[2] = p / e, t[3] = w / e) : (t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1), t;
  }
  function me(i, d) {
    return Math.abs(i[0] - d[0]) < k && Math.abs(i[1] - d[1]) < k && Math.abs(i[2] - d[2]) < k && Math.abs(i[3] - d[3]) < k;
  }
  function de(i, d) {
    return i[0] === d[0] && i[1] === d[1] && i[2] === d[2] && i[3] === d[3];
  }
  function Se(i) {
    const d = i ?? new f(4);
    return d[0] = 0, d[1] = 0, d[2] = 0, d[3] = 1, d;
  }
  const J = v.create(), pe = v.create(), le = v.create();
  function ve(i, d, t) {
    const s = t ?? new f(4), l = v.dot(i, d);
    return l < -0.999999 ? (v.cross(pe, i, J), v.len(J) < 1e-6 && v.cross(le, i, J), v.normalize(J, J), b(J, Math.PI, s), s) : l > 0.999999 ? (s[0] = 0, s[1] = 0, s[2] = 0, s[3] = 1, s) : (v.cross(i, d, J), s[0] = J[0], s[1] = J[1], s[2] = J[2], s[3] = 1 + l, L(s, s));
  }
  const R = new f(4), $ = new f(4);
  function ee(i, d, t, s, l, p) {
    const w = p ?? new f(4);
    return re(i, s, l, R), re(d, t, l, $), re(R, $, 2 * l * (1 - l), w), w;
  }
  return {
    create: M,
    fromValues: G,
    set: I,
    fromAxisAngle: b,
    toAxisAngle: F,
    angle: Y,
    multiply: S,
    mul: B,
    rotateX: C,
    rotateY: W,
    rotateZ: ie,
    slerp: re,
    inverse: fe,
    conjugate: ae,
    fromMat: ue,
    fromEuler: se,
    copy: K,
    clone: q,
    add: H,
    subtract: oe,
    sub: ne,
    mulScalar: Q,
    scale: j,
    divScalar: Z,
    dot: te,
    lerp: ge,
    length: A,
    len: N,
    lengthSq: O,
    lenSq: Be,
    normalize: L,
    equalsApproximately: me,
    equals: de,
    identity: Se,
    rotationTo: ve,
    sqlerp: ee
  };
}
const tn = /* @__PURE__ */ new Map();
function vn(f) {
  let v = tn.get(f);
  return v || (v = gn(f), tn.set(f, v)), v;
}
function wn(f) {
  function v(t, s, l, p) {
    const w = new f(4);
    return t !== void 0 && (w[0] = t, s !== void 0 && (w[1] = s, l !== void 0 && (w[2] = l, p !== void 0 && (w[3] = p)))), w;
  }
  const M = v;
  function G(t, s, l, p, w) {
    const e = w ?? new f(4);
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
  function Y(t, s = 0, l = 1, p) {
    const w = p ?? new f(4);
    return w[0] = Math.min(l, Math.max(s, t[0])), w[1] = Math.min(l, Math.max(s, t[1])), w[2] = Math.min(l, Math.max(s, t[2])), w[3] = Math.min(l, Math.max(s, t[3])), w;
  }
  function S(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] + s[0], p[1] = t[1] + s[1], p[2] = t[2] + s[2], p[3] = t[3] + s[3], p;
  }
  function B(t, s, l, p) {
    const w = p ?? new f(4);
    return w[0] = t[0] + s[0] * l, w[1] = t[1] + s[1] * l, w[2] = t[2] + s[2] * l, w[3] = t[3] + s[3] * l, w;
  }
  function C(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] - s[0], p[1] = t[1] - s[1], p[2] = t[2] - s[2], p[3] = t[3] - s[3], p;
  }
  const W = C;
  function ie(t, s) {
    return Math.abs(t[0] - s[0]) < k && Math.abs(t[1] - s[1]) < k && Math.abs(t[2] - s[2]) < k && Math.abs(t[3] - s[3]) < k;
  }
  function re(t, s) {
    return t[0] === s[0] && t[1] === s[1] && t[2] === s[2] && t[3] === s[3];
  }
  function fe(t, s, l, p) {
    const w = p ?? new f(4);
    return w[0] = t[0] + l * (s[0] - t[0]), w[1] = t[1] + l * (s[1] - t[1]), w[2] = t[2] + l * (s[2] - t[2]), w[3] = t[3] + l * (s[3] - t[3]), w;
  }
  function ae(t, s, l, p) {
    const w = p ?? new f(4);
    return w[0] = t[0] + l[0] * (s[0] - t[0]), w[1] = t[1] + l[1] * (s[1] - t[1]), w[2] = t[2] + l[2] * (s[2] - t[2]), w[3] = t[3] + l[3] * (s[3] - t[3]), w;
  }
  function ue(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = Math.max(t[0], s[0]), p[1] = Math.max(t[1], s[1]), p[2] = Math.max(t[2], s[2]), p[3] = Math.max(t[3], s[3]), p;
  }
  function se(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = Math.min(t[0], s[0]), p[1] = Math.min(t[1], s[1]), p[2] = Math.min(t[2], s[2]), p[3] = Math.min(t[3], s[3]), p;
  }
  function K(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] * s, p[1] = t[1] * s, p[2] = t[2] * s, p[3] = t[3] * s, p;
  }
  const q = K;
  function H(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] / s, p[1] = t[1] / s, p[2] = t[2] / s, p[3] = t[3] / s, p;
  }
  function oe(t, s) {
    const l = s ?? new f(4);
    return l[0] = 1 / t[0], l[1] = 1 / t[1], l[2] = 1 / t[2], l[3] = 1 / t[3], l;
  }
  const ne = oe;
  function Q(t, s) {
    return t[0] * s[0] + t[1] * s[1] + t[2] * s[2] + t[3] * s[3];
  }
  function j(t) {
    const s = t[0], l = t[1], p = t[2], w = t[3];
    return Math.sqrt(s * s + l * l + p * p + w * w);
  }
  const Z = j;
  function te(t) {
    const s = t[0], l = t[1], p = t[2], w = t[3];
    return s * s + l * l + p * p + w * w;
  }
  const ge = te;
  function A(t, s) {
    const l = t[0] - s[0], p = t[1] - s[1], w = t[2] - s[2], e = t[3] - s[3];
    return Math.sqrt(l * l + p * p + w * w + e * e);
  }
  const N = A;
  function O(t, s) {
    const l = t[0] - s[0], p = t[1] - s[1], w = t[2] - s[2], e = t[3] - s[3];
    return l * l + p * p + w * w + e * e;
  }
  const Be = O;
  function L(t, s) {
    const l = s ?? new f(4), p = t[0], w = t[1], e = t[2], o = t[3], n = Math.sqrt(p * p + w * w + e * e + o * o);
    return n > 1e-5 ? (l[0] = p / n, l[1] = w / n, l[2] = e / n, l[3] = o / n) : (l[0] = 0, l[1] = 0, l[2] = 0, l[3] = 0), l;
  }
  function me(t, s) {
    const l = s ?? new f(4);
    return l[0] = -t[0], l[1] = -t[1], l[2] = -t[2], l[3] = -t[3], l;
  }
  function de(t, s) {
    const l = s ?? new f(4);
    return l[0] = t[0], l[1] = t[1], l[2] = t[2], l[3] = t[3], l;
  }
  const Se = de;
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
  function R(t) {
    const s = t ?? new f(4);
    return s[0] = 0, s[1] = 0, s[2] = 0, s[3] = 0, s;
  }
  function $(t, s, l) {
    const p = l ?? new f(4), w = t[0], e = t[1], o = t[2], n = t[3];
    return p[0] = s[0] * w + s[4] * e + s[8] * o + s[12] * n, p[1] = s[1] * w + s[5] * e + s[9] * o + s[13] * n, p[2] = s[2] * w + s[6] * e + s[10] * o + s[14] * n, p[3] = s[3] * w + s[7] * e + s[11] * o + s[15] * n, p;
  }
  function ee(t, s, l) {
    const p = l ?? new f(4);
    return L(t, p), K(p, s, p);
  }
  function i(t, s, l) {
    const p = l ?? new f(4);
    return j(t) > s ? ee(t, s, p) : de(t, p);
  }
  function d(t, s, l) {
    const p = l ?? new f(4);
    return fe(t, s, 0.5, p);
  }
  return {
    create: v,
    fromValues: M,
    set: G,
    ceil: I,
    floor: b,
    round: F,
    clamp: Y,
    add: S,
    addScaled: B,
    subtract: C,
    sub: W,
    equalsApproximately: ie,
    equals: re,
    lerp: fe,
    lerpV: ae,
    max: ue,
    min: se,
    mulScalar: K,
    scale: q,
    divScalar: H,
    inverse: oe,
    invert: ne,
    dot: Q,
    length: j,
    len: Z,
    lengthSq: te,
    lenSq: ge,
    distance: A,
    dist: N,
    distanceSq: O,
    distSq: Be,
    normalize: L,
    negate: me,
    copy: de,
    clone: Se,
    multiply: J,
    mul: pe,
    divide: le,
    div: ve,
    zero: R,
    transformMat4: $,
    setLength: ee,
    truncate: i,
    midpoint: d
  };
}
const rn = /* @__PURE__ */ new Map();
function mn(f) {
  let v = rn.get(f);
  return v || (v = wn(f), rn.set(f, v)), v;
}
function je(f, v, M, G, I, b) {
  return {
    /** @namespace mat3 */
    mat3: pn(f),
    /** @namespace mat4 */
    mat4: xn(v),
    /** @namespace quat */
    quat: vn(M),
    /** @namespace vec2 */
    vec2: sn(G),
    /** @namespace vec3 */
    vec3: We(I),
    /** @namespace vec4 */
    vec4: mn(b)
  };
}
const {
  /**
   * 3x3 Matrix functions that default to returning `Float32Array`
   * @namespace
   */
  mat3: qn,
  /**
   * 4x4 Matrix functions that default to returning `Float32Array`
   * @namespace
   */
  mat4: Ae,
  /**
   * Quaternion functions that default to returning `Float32Array`
   * @namespace
   */
  quat: Nn,
  /**
   * Vec2 functions that default to returning `Float32Array`
   * @namespace
   */
  vec2: En,
  /**
   * Vec3 functions that default to returning `Float32Array`
   * @namespace
   */
  vec3: Wn,
  /**
   * Vec3 functions that default to returning `Float32Array`
   * @namespace
   */
  vec4: jn
} = je(Float32Array, Float32Array, Float32Array, Float32Array, Float32Array, Float32Array);
je(Float64Array, Float64Array, Float64Array, Float64Array, Float64Array, Float64Array);
je(un, Array, Array, Array, Array, Array);
const Oe = new ArrayBuffer(272), Ye = {
  texelSize: new Float32Array(Oe, 0, 2),
  sphereSize: new Float32Array(Oe, 8, 2),
  invProjectionMatrix: new Float32Array(Oe, 16, 16),
  projectionMatrix: new Float32Array(Oe, 80, 16),
  viewMatrix: new Float32Array(Oe, 144, 16),
  invViewMatrix: new Float32Array(Oe, 208, 16)
};
class yn {
  constructor(v) {
    z(this, "isDragging");
    z(this, "prevX");
    z(this, "prevY");
    z(this, "prevHoverX");
    z(this, "prevHoverY");
    z(this, "currentHoverX");
    z(this, "currentHoverY");
    z(this, "currentXtheta");
    z(this, "currentYtheta");
    z(this, "maxYTheta");
    z(this, "minYTheta");
    z(this, "sensitivity");
    z(this, "currentDistance");
    z(this, "maxDistance");
    z(this, "minDistance");
    z(this, "target");
    z(this, "fov");
    z(this, "zoomRate");
    z(this, "canvas");
    this.canvas = v, this.canvas.addEventListener("mousedown", (M) => {
      this.isDragging = !0, this.prevX = M.clientX, this.prevY = M.clientY;
    }), this.canvas.addEventListener("wheel", (M) => {
      M.preventDefault();
      var G = M.deltaY;
      this.currentDistance += (G > 0 ? 1 : -1) * this.zoomRate, this.currentDistance < this.minDistance && (this.currentDistance = this.minDistance), this.currentDistance > this.maxDistance && (this.currentDistance = this.maxDistance), this.recalculateView();
    }), this.canvas.addEventListener("mousemove", (M) => {
      if (this.currentHoverX = M.clientX, this.currentHoverY = M.clientY, this.isDragging) {
        const G = this.prevX - M.clientX, I = this.prevY - M.clientY;
        this.currentXtheta += this.sensitivity * G, this.currentYtheta += this.sensitivity * I, this.currentYtheta > this.maxYTheta && (this.currentYtheta = this.maxYTheta), this.currentYtheta < this.minYTheta && (this.currentYtheta = this.minYTheta), this.prevX = M.clientX, this.prevY = M.clientY, this.recalculateView();
      }
    }), this.canvas.addEventListener("mouseup", () => {
      this.isDragging && (this.isDragging = !1);
    });
  }
  reset(v, M, G, I) {
    this.isDragging = !1, this.prevX = 0, this.prevY = 0, this.currentXtheta = -Math.PI / 2 * 1, this.currentYtheta = -Math.PI / 12 * 0.8, this.maxYTheta = -Math.PI / 12 * 0.8, this.minYTheta = -0.99 * Math.PI / 2, this.sensitivity = 5e-3, this.currentDistance = v, this.maxDistance = 1.3 * this.currentDistance, this.minDistance = 0.8 * this.currentDistance, this.target = M, this.fov = G, this.zoomRate = I;
    const b = this.canvas.clientWidth / this.canvas.clientHeight, F = Ae.perspective(G, b, 0.1, 300);
    Ye.projectionMatrix.set(F), Ye.invProjectionMatrix.set(Ae.inverse(F)), this.recalculateView();
  }
  recalculateView() {
    var v = Ae.identity();
    Ae.translate(v, this.target, v), Ae.rotateY(v, this.currentXtheta, v), Ae.rotateX(v, this.currentYtheta, v), Ae.translate(v, [0, 0, this.currentDistance], v);
    var M = Ae.multiply(v, [0, 0, 0, 1]);
    let G = this.target;
    const I = Ae.lookAt(
      [M[0], M[1], M[2]],
      // position
      G,
      // target
      [0, 1, 0]
      // up
    );
    Ye.viewMatrix.set(I), Ye.invViewMatrix.set(Ae.inverse(I));
  }
  calcMouseVelocity() {
    if (this.isDragging)
      return [0, 0];
    let [v, M] = this.calcPlaneCoord(this.currentHoverX, this.currentHoverY), [G, I] = this.calcPlaneCoord(this.prevHoverX, this.prevHoverY), b = v - G, F = M - I, Y = 4;
    return b > Y && (b = Y), b < -Y && (b = -Y), F > Y && (F = Y), F < -Y && (F = -Y), [b, F, 0, 0];
  }
  calcPlaneCoord(v, M) {
    let G = v / this.canvas.width, I = M / this.canvas.height, b = 2 * G - 1, F = (1 - I) * 2 - 1, Y = [
      b * Math.tan(this.fov / 2) * (this.canvas.width / this.canvas.height),
      F * Math.tan(this.fov / 2),
      -1
    ];
    return [Y[0] * this.currentDistance, Y[1] * this.currentDistance];
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
}`, Sn = `@group(0) @binding(0) var<storage, read> particles: array<Particle>;
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
}`, Tn = `@group(0) @binding(0) var<storage, read> densityGrid: array<i32>;
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
const Re = 80;
class _n {
  constructor(v, M, G, I, b, F, Y, S, B, C, W, ie, re, fe) {
    z(this, "cellStructSize", 16);
    z(this, "realBoxSizeBuffer");
    z(this, "numParticlesBuffer");
    z(this, "densityBuffer");
    z(this, "mouseInfoUniformBuffer");
    z(this, "sphereRadiusBuffer");
    z(this, "initBoxSizeBuffer");
    z(this, "numParticles", 0);
    z(this, "gridCount", 0);
    z(this, "maxGridCount", 0);
    z(this, "maxParticleCount", 0);
    z(this, "densityGridCount", 0);
    z(this, "clearGridPipeline");
    z(this, "clearDensityGridPipeline");
    z(this, "castDensityGridPipeline");
    z(this, "p2g1Pipeline");
    z(this, "p2g2Pipeline");
    z(this, "p2gDensityPipeline");
    z(this, "updateGridPipeline");
    z(this, "g2pPipeline");
    z(this, "copyPositionPipeline");
    z(this, "clearGridBindGroup");
    z(this, "clearDensityGridBindGroup");
    z(this, "castDensityGridBindGroup");
    z(this, "p2g1BindGroup");
    z(this, "p2g2BindGroup");
    z(this, "p2gDensityBindGroup");
    z(this, "updateGridBindGroup");
    z(this, "g2pBindGroup");
    z(this, "copyPositionBindGroup");
    z(this, "particleBuffer");
    z(this, "dtBuffer");
    z(this, "densityGridBuffer");
    z(this, "device");
    z(this, "renderDiameter");
    z(this, "frameCount");
    z(this, "spawned");
    z(this, "mouseInfoValues", new ArrayBuffer(32));
    z(this, "mouseInfoViews", {
      screenSize: new Float32Array(this.mouseInfoValues, 0, 2),
      mouseCoord: new Float32Array(this.mouseInfoValues, 8, 2),
      mouseVel: new Float32Array(this.mouseInfoValues, 16, 2),
      mouseRadius: new Float32Array(this.mouseInfoValues, 24, 1)
    });
    z(this, "restDensity");
    this.device = S, this.renderDiameter = fe, this.frameCount = 0, this.spawned = !1, this.numParticles = 0, this.maxGridCount = W, this.maxParticleCount = ie, this.initBoxSizeBuffer = F;
    const ae = S.createShaderModule({ code: Pn }), ue = S.createShaderModule({ code: Gn }), se = S.createShaderModule({ code: Tn }), K = S.createShaderModule({ code: Dn }), q = S.createShaderModule({ code: Mn }), H = S.createShaderModule({ code: Sn }), oe = S.createShaderModule({ code: zn }), ne = S.createShaderModule({ code: bn }), Q = S.createShaderModule({ code: Bn });
    this.restDensity = 3;
    const j = {
      stiffness: 50,
      restDensity: this.restDensity,
      dynamicViscosity: 0.1,
      fixedPointMultiplier: re,
      fixedPointMultiplierInverse: 1 / re
    };
    this.clearGridPipeline = S.createComputePipeline({
      label: "clear grid pipeline",
      layout: "auto",
      compute: {
        module: ae
      }
    }), this.clearDensityGridPipeline = S.createComputePipeline({
      label: "clear density grid pipeline",
      layout: "auto",
      compute: {
        module: ue
      }
    }), this.castDensityGridPipeline = S.createComputePipeline({
      label: "cast density grid pipeline",
      layout: "auto",
      compute: {
        module: se,
        constants: {
          fixedPointMultiplierInverse: j.fixedPointMultiplierInverse
        }
      }
    }), this.p2g1Pipeline = S.createComputePipeline({
      label: "p2g 1 pipeline",
      layout: "auto",
      compute: {
        module: K,
        constants: {
          fixedPointMultiplier: j.fixedPointMultiplier
        }
      }
    }), this.p2g2Pipeline = S.createComputePipeline({
      label: "p2g 2 pipeline",
      layout: "auto",
      compute: {
        module: q,
        constants: {
          fixedPointMultiplier: j.fixedPointMultiplier,
          fixedPointMultiplierInverse: j.fixedPointMultiplierInverse,
          stiffness: j.stiffness,
          restDensity: j.restDensity,
          dynamicViscosity: j.dynamicViscosity
        }
      }
    }), this.p2gDensityPipeline = S.createComputePipeline({
      label: "p2g density pipeline",
      layout: "auto",
      compute: {
        module: H,
        constants: {
          densityFixedPointMultiplier: j.fixedPointMultiplier
        }
      }
    }), this.updateGridPipeline = S.createComputePipeline({
      label: "update grid pipeline",
      layout: "auto",
      compute: {
        module: oe,
        constants: {
          fixedPointMultiplier: j.fixedPointMultiplier,
          fixedPointMultiplierInverse: j.fixedPointMultiplierInverse
        }
      }
    }), this.g2pPipeline = S.createComputePipeline({
      label: "g2p pipeline",
      layout: "auto",
      compute: {
        module: ne,
        constants: {
          fixedPointMultiplierInverse: j.fixedPointMultiplierInverse
        }
      }
    }), this.copyPositionPipeline = S.createComputePipeline({
      label: "copy position pipeline",
      layout: "auto",
      compute: {
        module: Q
      }
    });
    const Z = S.createBuffer({
      label: "cells buffer",
      size: this.cellStructSize * W,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    this.densityBuffer = S.createBuffer({
      label: "density buffer",
      size: 4 * ie,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    }), this.realBoxSizeBuffer = S.createBuffer({
      label: "real box size buffer",
      size: 12,
      // 3 x f32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.numParticlesBuffer = S.createBuffer({
      label: "number of particles buffer",
      size: 4,
      // 1 x f32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.mouseInfoUniformBuffer = S.createBuffer({
      label: "mouse info buffer",
      size: this.mouseInfoValues.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.sphereRadiusBuffer = S.createBuffer({
      label: "sphere radius buffer",
      size: 4,
      // 1 x f32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.dtBuffer = S.createBuffer({
      label: "dt buffer",
      size: 4,
      // 1 x f32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.mouseInfoViews.screenSize.set([C.width, C.height]), this.device.queue.writeBuffer(this.mouseInfoUniformBuffer, 0, this.mouseInfoValues), this.clearGridBindGroup = S.createBindGroup({
      layout: this.clearGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: Z } }
      ]
    }), this.clearDensityGridBindGroup = S.createBindGroup({
      layout: this.clearDensityGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: I } },
        { binding: 1, resource: { buffer: b } }
      ]
    }), this.castDensityGridBindGroup = S.createBindGroup({
      layout: this.castDensityGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: I } },
        { binding: 1, resource: { buffer: b } }
      ]
    }), this.p2g1BindGroup = S.createBindGroup({
      layout: this.p2g1Pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: Z } },
        { binding: 2, resource: { buffer: F } },
        { binding: 3, resource: { buffer: this.numParticlesBuffer } }
      ]
    }), this.p2g2BindGroup = S.createBindGroup({
      layout: this.p2g2Pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: Z } },
        { binding: 2, resource: { buffer: F } },
        { binding: 3, resource: { buffer: this.numParticlesBuffer } },
        { binding: 4, resource: { buffer: this.densityBuffer } },
        { binding: 5, resource: { buffer: this.dtBuffer } }
      ]
    }), this.p2gDensityBindGroup = S.createBindGroup({
      layout: this.p2gDensityPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: this.densityBuffer } },
        { binding: 2, resource: { buffer: this.numParticlesBuffer } },
        { binding: 3, resource: { buffer: I } },
        { binding: 4, resource: { buffer: Y } }
      ]
    }), this.updateGridBindGroup = S.createBindGroup({
      layout: this.updateGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: Z } },
        { binding: 1, resource: { buffer: this.realBoxSizeBuffer } },
        { binding: 2, resource: { buffer: F } },
        { binding: 3, resource: { buffer: G } },
        { binding: 4, resource: B },
        { binding: 5, resource: { buffer: this.mouseInfoUniformBuffer } },
        { binding: 6, resource: { buffer: this.dtBuffer } }
      ]
    }), this.g2pBindGroup = S.createBindGroup({
      layout: this.g2pPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: Z } },
        { binding: 2, resource: { buffer: this.realBoxSizeBuffer } },
        { binding: 3, resource: { buffer: F } },
        { binding: 4, resource: { buffer: this.numParticlesBuffer } },
        { binding: 5, resource: { buffer: this.dtBuffer } }
      ]
    }), this.copyPositionBindGroup = S.createBindGroup({
      layout: this.copyPositionPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: M } },
        { binding: 2, resource: { buffer: this.numParticlesBuffer } }
      ]
    }), this.particleBuffer = v, this.densityGridBuffer = I;
  }
  initDambreak(v, M) {
    let G = new ArrayBuffer(Re * this.maxParticleCount);
    const I = 0.9;
    this.numParticles = 0, v[0] / 2, v[0] / 2, v[2] / 2;
    for (let S = 3; S < v[1] * 0.8 && this.numParticles < M; S += I)
      for (let B = v[0] * 0.25; B < v[0] - 4 && this.numParticles < M; B += I)
        for (let C = 3; C < v[2] / 2 && this.numParticles < M; C += I) {
          const W = Re * this.numParticles, ie = {
            position: new Float32Array(G, W + 0, 3),
            v: new Float32Array(G, W + 16, 3),
            C: new Float32Array(G, W + 32, 12)
          }, re = 0.5 * Math.random();
          ie.position.set([B + re, S + re, C + re]), this.numParticles++;
        }
    console.log(this.numParticles), this.numParticles < M && console.log("warning: actual number of particles is smaller than the specified number. make bounding box larger.");
    let b = new ArrayBuffer(Re * this.numParticles);
    const F = new Uint8Array(G), Y = new Uint8Array(b);
    return Y.set(F.subarray(0, Y.length)), b;
  }
  reset(v, M) {
    if (this.gridCount = Math.ceil(v[0]) * Math.ceil(v[1]) * Math.ceil(v[2]), this.gridCount > this.maxGridCount)
      throw new Error("gridCount should be equal to or less than maxGridCount");
    this.densityGridCount = this.gridCount;
    const G = new Float32Array(v);
    this.device.queue.writeBuffer(this.initBoxSizeBuffer, 0, G), this.frameCount = 0;
    let I = this.initDambreak(v, M);
    this.device.queue.writeBuffer(this.particleBuffer, 0, I), this.changeBoxSize(v), this.changeNumParticles(this.numParticles);
  }
  execute(v, M, G, I, b, F, Y, S) {
    const B = v.beginComputePass();
    this.mouseInfoViews.mouseCoord.set([M[0], M[1]]), this.mouseInfoViews.mouseVel.set([G[0], G[1]]), this.mouseInfoViews.mouseRadius.set([I]), this.device.queue.writeBuffer(this.mouseInfoUniformBuffer, 0, this.mouseInfoValues);
    const C = new Float32Array([F]);
    if (this.device.queue.writeBuffer(this.dtBuffer, 0, C), b) {
      if (Y)
        for (let ie = 0; ie < 1; ie++)
          B.setBindGroup(0, this.clearGridBindGroup), B.setPipeline(this.clearGridPipeline), B.dispatchWorkgroups(Math.ceil(this.gridCount / 64)), B.setBindGroup(0, this.p2g1BindGroup), B.setPipeline(this.p2g1Pipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), B.setBindGroup(0, this.p2g2BindGroup), B.setPipeline(this.p2g2Pipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), B.setBindGroup(0, this.updateGridBindGroup), B.setPipeline(this.updateGridPipeline), B.dispatchWorkgroups(Math.ceil(this.gridCount / 64)), B.setBindGroup(0, this.g2pBindGroup), B.setPipeline(this.g2pPipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
      let W = S[0] * S[1] * S[2];
      B.setBindGroup(0, this.clearDensityGridBindGroup), B.setPipeline(this.clearDensityGridPipeline), B.dispatchWorkgroups(Math.ceil(W / 2 / 64)), B.setBindGroup(0, this.p2gDensityBindGroup), B.setPipeline(this.p2gDensityPipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), B.setBindGroup(0, this.castDensityGridBindGroup), B.setPipeline(this.castDensityGridPipeline), B.dispatchWorkgroups(Math.ceil(W / 2 / 64)), B.setBindGroup(0, this.copyPositionBindGroup), B.setPipeline(this.copyPositionPipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
    } else if (Y) {
      for (let W = 0; W < 1; W++)
        B.setBindGroup(0, this.clearGridBindGroup), B.setPipeline(this.clearGridPipeline), B.dispatchWorkgroups(Math.ceil(this.gridCount / 64)), B.setBindGroup(0, this.p2g1BindGroup), B.setPipeline(this.p2g1Pipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), B.setBindGroup(0, this.p2g2BindGroup), B.setPipeline(this.p2g2Pipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), B.setBindGroup(0, this.updateGridBindGroup), B.setPipeline(this.updateGridPipeline), B.dispatchWorkgroups(Math.ceil(this.gridCount / 64)), B.setBindGroup(0, this.g2pBindGroup), B.setPipeline(this.g2pPipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
      B.setBindGroup(0, this.copyPositionBindGroup), B.setPipeline(this.copyPositionPipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
    }
    B.end(), this.frameCount++;
  }
  changeBoxSize(v) {
    const M = new Float32Array(v);
    this.device.queue.writeBuffer(this.realBoxSizeBuffer, 0, M);
  }
  changeNumParticles(v) {
    const M = new Int32Array([v]);
    this.device.queue.writeBuffer(this.numParticlesBuffer, 0, M), this.numParticles = v;
  }
}
var Vn = `@group(0) @binding(1) var depthTexture: texture_2d<f32>;
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

const SAND_BASE = 2.0; 
const POOL = vec4f(3., 3., 68., 39.); 
const SUN = vec3f(-0.5, 0.62, 0.6);
const SKY_ZENITH = vec3f(0.50, 0.68, 0.86);
const SKY_HORIZON = vec3f(0.94, 0.90, 0.83);

fn hash2(p: vec2f) -> f32 {
    let q = fract(p * vec2f(123.34, 456.21));
    let r = q + dot(q, q + 45.32);
    return fract(r.x * r.y);
}
fn vnoise(p: vec2f) -> f32 {
    let i = floor(p); let f = fract(p); let u = f * f * (3. - 2. * f);
    return mix(mix(hash2(i), hash2(i + vec2f(1., 0.)), u.x), mix(hash2(i + vec2f(0., 1.)), hash2(i + vec2f(1., 1.)), u.x), u.y);
}
fn fbm(p0: vec2f) -> f32 {
    var p = p0; var a = 0.5; var s = 0.;
    for (var i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + vec2f(17.1, 9.7); a *= 0.5; }
    return s;
}
fn poolDist(p: vec2f) -> f32 {
    let c = (POOL.xy + POOL.zw) * 0.5; let h = (POOL.zw - POOL.xy) * 0.5;
    let d = abs(p - c) - h;
    return length(max(d, vec2f(0.))) + min(max(d.x, d.y), 0.);
}
fn sandHeight(p: vec2f) -> f32 {
    let d = poolDist(p);
    if (d <= 0.) { return SAND_BASE; }
    let b = (d - 4.) / 4.;
    let berm = 2.2 * exp(-b * b);
    let dunes = max(fbm(p * 0.011 + vec2f(3.1, 7.7)) * 1.7 - 0.55, 0.) * 34. + 3. * sin(p.x * 0.035 + fbm(p * 0.02) * 5.);
    return SAND_BASE + berm + smoothstep(6., 110., d) * max(dunes, 0.);
}

fn ripples(p: vec2f, fade: f32) -> f32 {
    return fade * 0.16 * sin(dot(p, vec2f(0.85, 0.52)) * 2.1 + fbm(p * 0.12) * 7.);
}
fn sandNormal(p: vec2f, dist: f32) -> vec3f {
    let e = max(0.12, dist * 0.003);
    let fade = 1. - smoothstep(60., 220., dist);
    let hx = sandHeight(p + vec2f(e, 0.)) + ripples(p + vec2f(e, 0.), fade) - sandHeight(p - vec2f(e, 0.)) - ripples(p - vec2f(e, 0.), fade);
    let hz = sandHeight(p + vec2f(0., e)) + ripples(p + vec2f(0., e), fade) - sandHeight(p - vec2f(0., e)) - ripples(p - vec2f(0., e), fade);
    return normalize(vec3f(-hx, 2. * e, -hz));
}
fn skyColor(dir: vec3f) -> vec3f {
    return mix(SKY_HORIZON, SKY_ZENITH, pow(clamp(dir.y, 0., 1.), 0.55));
}
fn sandColor(p: vec3f, n: vec3f, dist: f32) -> vec3f {
    let grainFade = 1. - smoothstep(20., 90., dist);
    var albedo = vec3f(0.86, 0.74, 0.55) * (0.88 + 0.22 * vnoise(p.xz * 0.35));
    albedo *= 1. + grainFade * 0.14 * (hash2(floor(p.xz * 7.)) - 0.5);
    let sun = normalize(SUN);
    let diffuse = max(dot(n, sun), 0.);
    let ambient = mix(vec3f(0.55, 0.50, 0.46), SKY_ZENITH, 0.5 + 0.5 * n.y) * 0.55;
    let lit = albedo * (ambient + vec3f(1.0, 0.95, 0.86) * diffuse * 0.85);
    return mix(lit, SKY_HORIZON, 1. - exp(-dist * 0.0035));
}

fn floorColor(surfacePos: vec3f, refractDir: vec3f) -> vec4f {
    let t = (SAND_BASE - surfacePos.y) / refractDir.y;
    let hitPos = surfacePos + t * refractDir;
    let camDist = length(hitPos - (uniforms.invViewMatrix * vec4f(0., 0., 0., 1.)).xyz);
    return vec4f(sandColor(hitPos, sandNormal(hitPos.xz, camDist), camDist), 1.);
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
}`, In = `struct VertexOutput {
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
}`, Un = `struct RenderUniforms {
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
}`, On = `struct VertexOutput {
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
}`, Yn = `struct VertexOutput {
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
}`, Rn = `@group(0) @binding(0) var envmapTexture: texture_cube<f32>;
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

const SAND_BASE = 2.0; 
const POOL = vec4f(3., 3., 68., 39.); 
const SUN = vec3f(-0.5, 0.62, 0.6);
const SKY_ZENITH = vec3f(0.50, 0.68, 0.86);
const SKY_HORIZON = vec3f(0.94, 0.90, 0.83);

fn hash2(p: vec2f) -> f32 {
    let q = fract(p * vec2f(123.34, 456.21));
    let r = q + dot(q, q + 45.32);
    return fract(r.x * r.y);
}
fn vnoise(p: vec2f) -> f32 {
    let i = floor(p); let f = fract(p); let u = f * f * (3. - 2. * f);
    return mix(mix(hash2(i), hash2(i + vec2f(1., 0.)), u.x), mix(hash2(i + vec2f(0., 1.)), hash2(i + vec2f(1., 1.)), u.x), u.y);
}
fn fbm(p0: vec2f) -> f32 {
    var p = p0; var a = 0.5; var s = 0.;
    for (var i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + vec2f(17.1, 9.7); a *= 0.5; }
    return s;
}
fn poolDist(p: vec2f) -> f32 {
    let c = (POOL.xy + POOL.zw) * 0.5; let h = (POOL.zw - POOL.xy) * 0.5;
    let d = abs(p - c) - h;
    return length(max(d, vec2f(0.))) + min(max(d.x, d.y), 0.);
}
fn sandHeight(p: vec2f) -> f32 {
    let d = poolDist(p);
    if (d <= 0.) { return SAND_BASE; }
    let b = (d - 4.) / 4.;
    let berm = 2.2 * exp(-b * b);
    let dunes = max(fbm(p * 0.011 + vec2f(3.1, 7.7)) * 1.7 - 0.55, 0.) * 34. + 3. * sin(p.x * 0.035 + fbm(p * 0.02) * 5.);
    return SAND_BASE + berm + smoothstep(6., 110., d) * max(dunes, 0.);
}

fn ripples(p: vec2f, fade: f32) -> f32 {
    return fade * 0.16 * sin(dot(p, vec2f(0.85, 0.52)) * 2.1 + fbm(p * 0.12) * 7.);
}
fn sandNormal(p: vec2f, dist: f32) -> vec3f {
    let e = max(0.12, dist * 0.003);
    let fade = 1. - smoothstep(60., 220., dist);
    let hx = sandHeight(p + vec2f(e, 0.)) + ripples(p + vec2f(e, 0.), fade) - sandHeight(p - vec2f(e, 0.)) - ripples(p - vec2f(e, 0.), fade);
    let hz = sandHeight(p + vec2f(0., e)) + ripples(p + vec2f(0., e), fade) - sandHeight(p - vec2f(0., e)) - ripples(p - vec2f(0., e), fade);
    return normalize(vec3f(-hx, 2. * e, -hz));
}
fn skyColor(dir: vec3f) -> vec3f {
    return mix(SKY_HORIZON, SKY_ZENITH, pow(clamp(dir.y, 0., 1.), 0.55));
}
fn sandColor(p: vec3f, n: vec3f, dist: f32) -> vec3f {
    let grainFade = 1. - smoothstep(20., 90., dist);
    var albedo = vec3f(0.86, 0.74, 0.55) * (0.88 + 0.22 * vnoise(p.xz * 0.35));
    albedo *= 1. + grainFade * 0.14 * (hash2(floor(p.xz * 7.)) - 0.5);
    let sun = normalize(SUN);
    let diffuse = max(dot(n, sun), 0.);
    let ambient = mix(vec3f(0.55, 0.50, 0.46), SKY_ZENITH, 0.5 + 0.5 * n.y) * 0.55;
    let lit = albedo * (ambient + vec3f(1.0, 0.95, 0.86) * diffuse * 0.85);
    return mix(lit, SKY_HORIZON, 1. - exp(-dist * 0.0035));
}

@fragment
fn fs(input: FragmentInput) -> @location(0) vec4f {
    let cameraPos = getCameraPosition();
    let dir = normalize((uniforms.invViewMatrix * vec4f(computeViewPosFromUVDepth(input.uv, 1.0), 0.)).xyz);
    
    var t = 0.; var prev = 0.; var hit = false;
    for (var i = 0; i < 180; i++) {
        let q = cameraPos + t * dir;
        let dy = q.y - sandHeight(q.xz);
        if (dy < 0.) { hit = true; break; }
        prev = t;
        t += max(0.08, dy * 0.5);
        if (t > 1200. || (dir.y > 0. && q.y > SAND_BASE + 60.)) { break; }
    }
    
    let env = textureSampleLevel(envmapTexture, textureSampler, dir, 0.).rgb;
    if (!hit) { return vec4f(mix(skyColor(dir), env, 0.15), 1.); }
    
    var a = prev; var b = t;
    for (var i = 0; i < 6; i++) {
        let m = 0.5 * (a + b); let q = cameraPos + m * dir;
        if (q.y > sandHeight(q.xz)) { a = m; } else { b = m; }
    }
    let hitPos = cameraPos + b * dir;
    return vec4f(sandColor(hitPos, sandNormal(hitPos.xz, b), b), 1.);
}`, kn = `struct FragmentInput {
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
class Xn {
  constructor(v, M, G, I, b, F, Y, S, B, C, W, ie, re) {
    z(this, "depthFilter1DPipeline");
    z(this, "depthFilter2DPipeline");
    z(this, "thicknessMapPipeline");
    z(this, "thicknessFilterPipeline");
    z(this, "fluidPipeline");
    z(this, "depthMapPipeline");
    z(this, "spherePipeline");
    z(this, "bgColorPipeline");
    z(this, "densityRaymarchPipeline");
    z(this, "depthMapTextureView");
    z(this, "tmpDepthMapTextureView");
    z(this, "thicknessTextureView");
    z(this, "tmpThicknessTextureView");
    z(this, "depthTestTextureView");
    z(this, "tmpOutputTextureView");
    z(this, "depthFilter1DBindGroups");
    z(this, "depthFilter2DBindGroups");
    z(this, "thicknessMapBindGroup");
    z(this, "thicknessFilterBindGroups");
    z(this, "fluidBindGroup");
    z(this, "depthMapBindGroup");
    z(this, "sphereBindGroup");
    z(this, "bgColorBindGroup");
    z(this, "densityRaymarchBindGroup");
    z(this, "diffuseColorBuffer");
    z(this, "colorDensityBuffer");
    z(this, "densityGridSizeBuffer");
    z(this, "device");
    this.device = b;
    const fe = 50, ae = 2 * W, ue = 12, se = B.width / 2, K = B.height / 2, q = {
      screenHeight: B.height,
      screenWidth: B.width
    }, H = {
      maxFilterSize: fe,
      projectedParticleConstant: ue * ae * 0.05 * (B.height / 2) / Math.tan(ie / 2)
    }, oe = {
      thicknessTextureWidth: se,
      thicknessTextureHeight: K
    }, ne = b.createSampler({
      // addressModeU: "repeat",
      // addressModeV: "repeat",
      magFilter: "linear",
      minFilter: "linear"
    }), Q = b.createShaderModule({ code: In }), j = b.createShaderModule({ code: Vn }), Z = b.createShaderModule({ code: Fn }), te = b.createShaderModule({ code: On }), ge = b.createShaderModule({ code: Yn }), A = b.createShaderModule({ code: Un }), N = b.createShaderModule({ code: An }), O = b.createShaderModule({ code: Rn }), Be = b.createShaderModule({ code: kn });
    this.depthMapPipeline = b.createRenderPipeline({
      label: "depthMap pipeline",
      layout: "auto",
      vertex: { module: te },
      fragment: {
        module: te,
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
      vertex: { module: ge },
      fragment: {
        module: ge,
        targets: [
          {
            format: "r32float"
          },
          {
            format: C
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
        constants: q
      },
      fragment: {
        module: j,
        constants: {
          ...H,
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
        constants: q
      },
      fragment: {
        module: j,
        constants: {
          ...H,
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
        constants: q
      },
      fragment: {
        module: N,
        constants: oe,
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
        constants: q
      },
      fragment: {
        module: Z,
        targets: [
          {
            format: C
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
        constants: q
      },
      fragment: {
        module: O,
        targets: [
          {
            format: C
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
        constants: q
      },
      fragment: {
        module: Be,
        targets: [
          {
            format: C
          }
        ]
      }
    });
    const L = b.createTexture({
      label: "temporary depth map texture",
      size: [B.width, B.height, 1],
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      format: "r32float"
    }), me = b.createTexture({
      label: "thickness map texture",
      size: [se, K, 1],
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      format: "r16float"
    }), de = b.createTexture({
      label: "temporary thickness map texture",
      size: [se, K, 1],
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      format: "r16float"
    }), Se = b.createTexture({
      size: [B.width, B.height, 1],
      format: "depth32float",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
    }), J = b.createTexture({
      size: [B.width, B.height, 1],
      format: C,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
    });
    this.depthMapTextureView = F, this.tmpDepthMapTextureView = L.createView(), this.thicknessTextureView = me.createView(), this.tmpThicknessTextureView = de.createView(), this.depthTestTextureView = Se.createView(), this.tmpOutputTextureView = J.createView();
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
    }), this.densityGridSizeBuffer = G;
    let R = new Float32Array([1, 0]), $ = new Float32Array([0, 1]), ee = new Int32Array([15]);
    b.queue.writeBuffer(pe, 0, R), b.queue.writeBuffer(le, 0, $), b.queue.writeBuffer(ve, 0, ee), this.depthFilter1DBindGroups = [], this.depthFilter1DBindGroups = [
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
        { binding: 0, resource: { buffer: M } },
        { binding: 1, resource: { buffer: v } }
      ]
    }), this.thicknessFilterBindGroups = [], this.thicknessFilterBindGroups = [
      b.createBindGroup({
        label: "thickness filterX bind group",
        layout: this.thicknessFilterPipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: ne },
          { binding: 1, resource: this.thicknessTextureView },
          { binding: 2, resource: { buffer: pe } },
          { binding: 3, resource: { buffer: ve } }
        ]
      }),
      b.createBindGroup({
        label: "thickness filterY bind group",
        layout: this.thicknessFilterPipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: ne },
          { binding: 1, resource: this.tmpThicknessTextureView },
          { binding: 2, resource: { buffer: le } },
          { binding: 3, resource: { buffer: ve } }
        ]
      })
    ], this.fluidBindGroup = b.createBindGroup({
      label: "fluid bind group",
      layout: this.fluidPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: ne },
        { binding: 1, resource: this.depthMapTextureView },
        { binding: 2, resource: { buffer: v } },
        { binding: 3, resource: this.thicknessTextureView },
        { binding: 4, resource: Y },
        { binding: 5, resource: this.tmpOutputTextureView },
        { binding: 6, resource: { buffer: this.diffuseColorBuffer } },
        { binding: 7, resource: { buffer: this.colorDensityBuffer } }
      ]
    }), this.depthMapBindGroup = b.createBindGroup({
      label: "depthMap bind group",
      layout: this.depthMapPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: M } },
        { binding: 1, resource: { buffer: v } }
      ]
    }), this.bgColorBindGroup = b.createBindGroup({
      label: "bgColor bind group",
      layout: this.bgColorPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: Y },
        { binding: 1, resource: { buffer: v } },
        { binding: 2, resource: ne }
      ]
    }), this.sphereBindGroup = b.createBindGroup({
      label: "sphere bind group",
      layout: this.spherePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: M } },
        { binding: 1, resource: { buffer: v } }
      ]
    }), this.densityRaymarchBindGroup = b.createBindGroup({
      label: "density raymarch bind group",
      layout: this.densityRaymarchPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: this.depthMapTextureView },
        { binding: 1, resource: S },
        { binding: 2, resource: { buffer: v } },
        { binding: 3, resource: { buffer: I } },
        { binding: 4, resource: ne },
        { binding: 5, resource: this.tmpOutputTextureView },
        { binding: 6, resource: { buffer: this.densityGridSizeBuffer } }
      ]
    }), console.log(this.densityRaymarchPipeline.getBindGroupLayout(0));
  }
  execute(v, M, G, I, b, F) {
    const Y = new Float32Array(b), S = new Float32Array([F]);
    this.device.queue.writeBuffer(this.diffuseColorBuffer, 0, Y), this.device.queue.writeBuffer(this.colorDensityBuffer, 0, S);
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
    ], C = {
      colorAttachments: [
        {
          view: this.thicknessTextureView,
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    }, W = [
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
    ], ie = {
      colorAttachments: [
        {
          view: this.tmpOutputTextureView,
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    }, re = {
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
      const K = M.beginRenderPass(ie);
      K.setBindGroup(0, this.bgColorBindGroup), K.setPipeline(this.bgColorPipeline), K.draw(6), K.end();
      const q = M.beginRenderPass(ae);
      q.setBindGroup(0, this.sphereBindGroup), q.setPipeline(this.spherePipeline), q.draw(6, G), q.end();
      const H = M.beginRenderPass(ue);
      H.setBindGroup(0, this.densityRaymarchBindGroup), H.setPipeline(this.densityRaymarchPipeline), H.draw(6), H.end();
    } else {
      const K = M.beginRenderPass(fe);
      K.setBindGroup(0, this.depthMapBindGroup), K.setPipeline(this.depthMapPipeline), K.draw(6, G), K.end();
      for (var se = 0; se < 2; se++) {
        const j = M.beginRenderPass(B[0]);
        j.setBindGroup(0, this.depthFilter1DBindGroups[0]), j.setPipeline(this.depthFilter1DPipeline), j.draw(6), j.end();
        const Z = M.beginRenderPass(B[1]);
        Z.setBindGroup(0, this.depthFilter1DBindGroups[1]), Z.setPipeline(this.depthFilter1DPipeline), Z.draw(6), Z.end();
      }
      const q = M.beginRenderPass(B[0]);
      q.setBindGroup(0, this.depthFilter2DBindGroups[0]), q.setPipeline(this.depthFilter2DPipeline), q.draw(6), q.end();
      const H = M.beginRenderPass(B[1]);
      H.setBindGroup(0, this.depthFilter2DBindGroups[1]), H.setPipeline(this.depthFilter2DPipeline), H.draw(6), H.end();
      const oe = M.beginRenderPass(C);
      oe.setBindGroup(0, this.thicknessMapBindGroup), oe.setPipeline(this.thicknessMapPipeline), oe.draw(6, G), oe.end();
      for (var se = 0; se < 1; se++) {
        const Z = M.beginRenderPass(W[0]);
        Z.setBindGroup(0, this.thicknessFilterBindGroups[0]), Z.setPipeline(this.thicknessFilterPipeline), Z.draw(6), Z.end();
        const te = M.beginRenderPass(W[1]);
        te.setBindGroup(0, this.thicknessFilterBindGroups[1]), te.setPipeline(this.thicknessFilterPipeline), te.draw(6), te.end();
      }
      const ne = M.beginRenderPass(ie);
      ne.setBindGroup(0, this.bgColorBindGroup), ne.setPipeline(this.bgColorPipeline), ne.draw(6), ne.end();
      const Q = M.beginRenderPass(re);
      Q.setBindGroup(0, this.fluidBindGroup), Q.setPipeline(this.fluidPipeline), Q.draw(6), Q.end();
    }
  }
}
function Hn(f, v) {
  const M = document.createElement("canvas");
  M.width = M.height = f;
  const G = M.getContext("2d");
  if (v === "up") G.fillStyle = "#80add8";
  else if (v === "down") G.fillStyle = "#c9ae84";
  else {
    const I = G.createLinearGradient(0, 0, 0, f);
    I.addColorStop(0, "#8cb4da"), I.addColorStop(0.46, "#efe6d6"), I.addColorStop(0.52, "#d9c29a"), I.addColorStop(1, "#c9ae84"), G.fillStyle = I;
  }
  return G.fillRect(0, 0, f, f), M;
}
async function Zn(f, v) {
  const M = v.particles ?? 55e3, G = v.box ?? [72, 22, 43], I = v.resolution ?? 0.7, b = await navigator.gpu.requestAdapter();
  if (!b) throw new Error("no WebGPU adapter");
  const F = await b.requestDevice(), Y = f.getContext("webgpu");
  f.width = Math.round(I * f.clientWidth), f.height = Math.round(I * f.clientHeight);
  const S = navigator.gpu.getPreferredCanvasFormat();
  Y.configure({ device: F, format: S });
  const B = ["side", "side", "up", "down", "side", "side"], C = await Promise.all(B.map((R) => createImageBitmap(Hn(256, R)))), W = F.createTexture({
    dimension: "2d",
    size: [C[0].width, C[0].height, 6],
    format: "rgba8unorm",
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
  });
  C.forEach((R, $) => F.queue.copyExternalImageToTexture({ source: R }, { texture: W, origin: [0, 0, $] }, [R.width, R.height]));
  const ie = W.createView({ dimension: "cube" }), re = G[0] * G[1] * G[2], fe = F.createBuffer({ size: Re * M, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST }), ae = F.createBuffer({ size: 32 * M, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST }), ue = F.createBuffer({ size: Oe.byteLength, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST }), se = F.createBuffer({ size: 12, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST }), q = F.createTexture({ size: [f.width, f.height, 1], usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING, format: "r32float" }).createView(), H = [G[0], G[1], Math.ceil(G[2] / 128) * 128], oe = F.createBuffer({ size: 4 * H[0] * H[1] * H[2], usage: GPUBufferUsage.STORAGE }), ne = F.createBuffer({ size: 2 * H[0] * H[1] * H[2], usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC }), Q = F.createBuffer({ size: 12, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  F.queue.writeBuffer(Q, 0, new Float32Array(H));
  const j = F.createTexture({ size: [H[2], H[1], H[0]], usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST, format: "r16float", dimension: "3d" }), Z = 60 * Math.PI / 180, te = 0.6, ge = 2 * te, A = 1e7, N = new _n(
    fe,
    ae,
    ue,
    oe,
    ne,
    se,
    Q,
    F,
    q,
    f,
    re,
    M,
    A,
    ge
  ), O = new Xn(
    ue,
    ae,
    Q,
    se,
    F,
    q,
    ie,
    j.createView(),
    f,
    S,
    te,
    Z,
    A
  );
  N.initDambreak = function(R, $) {
    const ee = new ArrayBuffer(Re * this.maxParticleCount), i = 0.9;
    this.numParticles = 0;
    for (let d = 3; d < R[1] - 3 && this.numParticles < $; d += i)
      for (let t = 3; t < R[0] - 3 && this.numParticles < $; t += i)
        for (let s = 3; s < R[2] - 3 && this.numParticles < $; s += i) {
          const l = Re * this.numParticles;
          new Float32Array(ee, l, 3).set([t + 0.3 * Math.random(), d + 0.3 * Math.random(), s + 0.3 * Math.random()]), this.numParticles++;
        }
    return ee;
  };
  const Be = {
    get clientWidth() {
      return f.clientWidth;
    },
    get clientHeight() {
      return f.clientHeight;
    },
    get width() {
      return f.width;
    },
    get height() {
      return f.height;
    },
    addEventListener() {
    }
  }, L = new yn(Be), me = () => {
    const R = f.clientWidth / Math.max(1, f.clientHeight), ee = (G[0] - 7) / 2 / 0.9 / (Math.tan(Z / 2) * R) + (G[2] / 2 - 3);
    L.reset(ee, [G[0] / 2, G[1] * 0.42, G[2] / 2], Z, 0.7), L.currentXtheta = 0, L.currentYtheta = -((v.elevation ?? 10) * Math.PI) / 180, L.recalculateView();
  };
  N.reset(G, M), me();
  let de = !1;
  L.currentHoverX = L.prevHoverX = -1e4, L.currentHoverY = L.prevHoverY = -1e4;
  const Se = (R, $) => {
    const ee = f.getBoundingClientRect();
    if (R === null || $ === void 0) {
      de = !1, L.currentHoverX = L.prevHoverX = -1e4, L.currentHoverY = L.prevHoverY = -1e4;
      return;
    }
    de || (L.prevHoverX = R - ee.left, L.prevHoverY = $ - ee.top), de = !0, L.currentHoverX = R - ee.left, L.currentHoverY = $ - ee.top;
  }, J = () => {
    Ye.texelSize.set([1 / f.width, 1 / f.height]), Ye.sphereSize.set([ge]), F.queue.writeBuffer(ue, 0, Oe);
    const R = F.createCommandEncoder();
    N.execute(
      R,
      [L.currentHoverX / f.clientWidth, L.currentHoverY / f.clientHeight],
      L.calcMouseVelocity().map(($) => $ * 0.6),
      15,
      !1,
      0.4 * 0.8,
      !0,
      H
    ), O.execute(Y, R, N.numParticles, !1, [140 / 255, 220 / 255, 240 / 255], 0.7), F.queue.submit([R.finish()]), L.setNewPrevMouseCoord();
  };
  let pe = 0, le = !1;
  const ve = () => {
    le || (J(), pe = requestAnimationFrame(ve));
  };
  return pe = requestAnimationFrame(ve), {
    particleCount: N.numParticles,
    setHand: Se,
    reset: () => {
      N.reset(G, M), me();
    },
    advance: J,
    box: G,
    project: (R, $, ee) => {
      const i = Ye.viewMatrix, d = Ye.projectionMatrix, t = i[0] * R + i[4] * $ + i[8] * ee + i[12], s = i[1] * R + i[5] * $ + i[9] * ee + i[13], l = i[2] * R + i[6] * $ + i[10] * ee + i[14], p = i[3] * R + i[7] * $ + i[11] * ee + i[15], w = d[0] * t + d[4] * s + d[8] * l + d[12] * p, e = d[1] * t + d[5] * s + d[9] * l + d[13] * p, o = d[3] * t + d[7] * s + d[11] * l + d[15] * p, n = f.getBoundingClientRect();
      return { x: n.left + (w / o * 0.5 + 0.5) * n.width, y: n.top + (0.5 - e / o * 0.5) * n.height, behind: o <= 0 };
    },
    destroy: () => {
      le = !0, cancelAnimationFrame(pe), F.destroy();
    }
  };
}
export {
  Zn as createTank
};
