var on = Object.defineProperty;
var cn = (f, v, z) => v in f ? on(f, v, { enumerable: !0, configurable: !0, writable: !0, value: z }) : f[v] = z;
var b = (f, v, z) => cn(f, typeof v != "symbol" ? v + "" : v, z);
function an(f, v) {
  return class extends f {
    constructor(...z) {
      super(...z), v(this);
    }
  };
}
const un = an(Array, (f) => f.fill(0));
let L = 1e-6;
function ln(f) {
  function v(e = 0, o = 0) {
    const n = new f(2);
    return e !== void 0 && (n[0] = e, o !== void 0 && (n[1] = o)), n;
  }
  const z = v;
  function T(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e, r[1] = o, r;
  }
  function U(e, o) {
    const n = o ?? new f(2);
    return n[0] = Math.ceil(e[0]), n[1] = Math.ceil(e[1]), n;
  }
  function M(e, o) {
    const n = o ?? new f(2);
    return n[0] = Math.floor(e[0]), n[1] = Math.floor(e[1]), n;
  }
  function S(e, o) {
    const n = o ?? new f(2);
    return n[0] = Math.round(e[0]), n[1] = Math.round(e[1]), n;
  }
  function I(e, o = 0, n = 1, r) {
    const a = r ?? new f(2);
    return a[0] = Math.min(n, Math.max(o, e[0])), a[1] = Math.min(n, Math.max(o, e[1])), a;
  }
  function G(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] + o[0], r[1] = e[1] + o[1], r;
  }
  function B(e, o, n, r) {
    const a = r ?? new f(2);
    return a[0] = e[0] + o[0] * n, a[1] = e[1] + o[1] * n, a;
  }
  function $(e, o) {
    const n = e[0], r = e[1], a = o[0], g = o[1], y = Math.sqrt(n * n + r * r), c = Math.sqrt(a * a + g * g), u = y * c, h = u && N(e, o) / u;
    return Math.acos(h);
  }
  function E(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] - o[0], r[1] = e[1] - o[1], r;
  }
  const re = E;
  function se(e, o) {
    return Math.abs(e[0] - o[0]) < L && Math.abs(e[1] - o[1]) < L;
  }
  function le(e, o) {
    return e[0] === o[0] && e[1] === o[1];
  }
  function ae(e, o, n, r) {
    const a = r ?? new f(2);
    return a[0] = e[0] + n * (o[0] - e[0]), a[1] = e[1] + n * (o[1] - e[1]), a;
  }
  function de(e, o, n, r) {
    const a = r ?? new f(2);
    return a[0] = e[0] + n[0] * (o[0] - e[0]), a[1] = e[1] + n[1] * (o[1] - e[1]), a;
  }
  function oe(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = Math.max(e[0], o[0]), r[1] = Math.max(e[1], o[1]), r;
  }
  function Z(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = Math.min(e[0], o[0]), r[1] = Math.min(e[1], o[1]), r;
  }
  function A(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] * o, r[1] = e[1] * o, r;
  }
  const ne = A;
  function ce(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] / o, r[1] = e[1] / o, r;
  }
  function K(e, o) {
    const n = o ?? new f(2);
    return n[0] = 1 / e[0], n[1] = 1 / e[1], n;
  }
  const te = K;
  function H(e, o, n) {
    const r = n ?? new f(3), a = e[0] * o[1] - e[1] * o[0];
    return r[0] = 0, r[1] = 0, r[2] = a, r;
  }
  function N(e, o) {
    return e[0] * o[0] + e[1] * o[1];
  }
  function ie(e) {
    const o = e[0], n = e[1];
    return Math.sqrt(o * o + n * n);
  }
  const we = ie;
  function k(e) {
    const o = e[0], n = e[1];
    return o * o + n * n;
  }
  const Q = k;
  function Y(e, o) {
    const n = e[0] - o[0], r = e[1] - o[1];
    return Math.sqrt(n * n + r * r);
  }
  const j = Y;
  function pe(e, o) {
    const n = e[0] - o[0], r = e[1] - o[1];
    return n * n + r * r;
  }
  const me = pe;
  function he(e, o) {
    const n = o ?? new f(2), r = e[0], a = e[1], g = Math.sqrt(r * r + a * a);
    return g > 1e-5 ? (n[0] = r / g, n[1] = a / g) : (n[0] = 0, n[1] = 0), n;
  }
  function Pe(e, o) {
    const n = o ?? new f(2);
    return n[0] = -e[0], n[1] = -e[1], n;
  }
  function J(e, o) {
    const n = o ?? new f(2);
    return n[0] = e[0], n[1] = e[1], n;
  }
  const ge = J;
  function fe(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] * o[0], r[1] = e[1] * o[1], r;
  }
  const R = fe;
  function C(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] / o[0], r[1] = e[1] / o[1], r;
  }
  const ee = C;
  function W(e = 1, o) {
    const n = o ?? new f(2), r = Math.random() * 2 * Math.PI;
    return n[0] = Math.cos(r) * e, n[1] = Math.sin(r) * e, n;
  }
  function i(e) {
    const o = e ?? new f(2);
    return o[0] = 0, o[1] = 0, o;
  }
  function d(e, o, n) {
    const r = n ?? new f(2), a = e[0], g = e[1];
    return r[0] = a * o[0] + g * o[4] + o[12], r[1] = a * o[1] + g * o[5] + o[13], r;
  }
  function t(e, o, n) {
    const r = n ?? new f(2), a = e[0], g = e[1];
    return r[0] = o[0] * a + o[4] * g + o[8], r[1] = o[1] * a + o[5] * g + o[9], r;
  }
  function s(e, o, n, r) {
    const a = r ?? new f(2), g = e[0] - o[0], y = e[1] - o[1], c = Math.sin(n), u = Math.cos(n);
    return a[0] = g * u - y * c + o[0], a[1] = g * c + y * u + o[1], a;
  }
  function l(e, o, n) {
    const r = n ?? new f(2);
    return he(e, r), A(r, o, r);
  }
  function p(e, o, n) {
    const r = n ?? new f(2);
    return ie(e) > o ? l(e, o, r) : J(e, r);
  }
  function w(e, o, n) {
    const r = n ?? new f(2);
    return ae(e, o, 0.5, r);
  }
  return {
    create: v,
    fromValues: z,
    set: T,
    ceil: U,
    floor: M,
    round: S,
    clamp: I,
    add: G,
    addScaled: B,
    angle: $,
    subtract: E,
    sub: re,
    equalsApproximately: se,
    equals: le,
    lerp: ae,
    lerpV: de,
    max: oe,
    min: Z,
    mulScalar: A,
    scale: ne,
    divScalar: ce,
    inverse: K,
    invert: te,
    cross: H,
    dot: N,
    length: ie,
    len: we,
    lengthSq: k,
    lenSq: Q,
    distance: Y,
    dist: j,
    distanceSq: pe,
    distSq: me,
    normalize: he,
    negate: Pe,
    copy: J,
    clone: ge,
    multiply: fe,
    mul: R,
    divide: C,
    div: ee,
    random: W,
    zero: i,
    transformMat4: d,
    transformMat3: t,
    rotate: s,
    setLength: l,
    truncate: p,
    midpoint: w
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
  function T(c, u, h, x) {
    const m = x ?? new f(3);
    return m[0] = c, m[1] = u, m[2] = h, m;
  }
  function U(c, u) {
    const h = u ?? new f(3);
    return h[0] = Math.ceil(c[0]), h[1] = Math.ceil(c[1]), h[2] = Math.ceil(c[2]), h;
  }
  function M(c, u) {
    const h = u ?? new f(3);
    return h[0] = Math.floor(c[0]), h[1] = Math.floor(c[1]), h[2] = Math.floor(c[2]), h;
  }
  function S(c, u) {
    const h = u ?? new f(3);
    return h[0] = Math.round(c[0]), h[1] = Math.round(c[1]), h[2] = Math.round(c[2]), h;
  }
  function I(c, u = 0, h = 1, x) {
    const m = x ?? new f(3);
    return m[0] = Math.min(h, Math.max(u, c[0])), m[1] = Math.min(h, Math.max(u, c[1])), m[2] = Math.min(h, Math.max(u, c[2])), m;
  }
  function G(c, u, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] + u[0], x[1] = c[1] + u[1], x[2] = c[2] + u[2], x;
  }
  function B(c, u, h, x) {
    const m = x ?? new f(3);
    return m[0] = c[0] + u[0] * h, m[1] = c[1] + u[1] * h, m[2] = c[2] + u[2] * h, m;
  }
  function $(c, u) {
    const h = c[0], x = c[1], m = c[2], P = u[0], D = u[1], _ = u[2], X = Math.sqrt(h * h + x * x + m * m), V = Math.sqrt(P * P + D * D + _ * _), F = X * V, O = F && N(c, u) / F;
    return Math.acos(O);
  }
  function E(c, u, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] - u[0], x[1] = c[1] - u[1], x[2] = c[2] - u[2], x;
  }
  const re = E;
  function se(c, u) {
    return Math.abs(c[0] - u[0]) < L && Math.abs(c[1] - u[1]) < L && Math.abs(c[2] - u[2]) < L;
  }
  function le(c, u) {
    return c[0] === u[0] && c[1] === u[1] && c[2] === u[2];
  }
  function ae(c, u, h, x) {
    const m = x ?? new f(3);
    return m[0] = c[0] + h * (u[0] - c[0]), m[1] = c[1] + h * (u[1] - c[1]), m[2] = c[2] + h * (u[2] - c[2]), m;
  }
  function de(c, u, h, x) {
    const m = x ?? new f(3);
    return m[0] = c[0] + h[0] * (u[0] - c[0]), m[1] = c[1] + h[1] * (u[1] - c[1]), m[2] = c[2] + h[2] * (u[2] - c[2]), m;
  }
  function oe(c, u, h) {
    const x = h ?? new f(3);
    return x[0] = Math.max(c[0], u[0]), x[1] = Math.max(c[1], u[1]), x[2] = Math.max(c[2], u[2]), x;
  }
  function Z(c, u, h) {
    const x = h ?? new f(3);
    return x[0] = Math.min(c[0], u[0]), x[1] = Math.min(c[1], u[1]), x[2] = Math.min(c[2], u[2]), x;
  }
  function A(c, u, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] * u, x[1] = c[1] * u, x[2] = c[2] * u, x;
  }
  const ne = A;
  function ce(c, u, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] / u, x[1] = c[1] / u, x[2] = c[2] / u, x;
  }
  function K(c, u) {
    const h = u ?? new f(3);
    return h[0] = 1 / c[0], h[1] = 1 / c[1], h[2] = 1 / c[2], h;
  }
  const te = K;
  function H(c, u, h) {
    const x = h ?? new f(3), m = c[2] * u[0] - c[0] * u[2], P = c[0] * u[1] - c[1] * u[0];
    return x[0] = c[1] * u[2] - c[2] * u[1], x[1] = m, x[2] = P, x;
  }
  function N(c, u) {
    return c[0] * u[0] + c[1] * u[1] + c[2] * u[2];
  }
  function ie(c) {
    const u = c[0], h = c[1], x = c[2];
    return Math.sqrt(u * u + h * h + x * x);
  }
  const we = ie;
  function k(c) {
    const u = c[0], h = c[1], x = c[2];
    return u * u + h * h + x * x;
  }
  const Q = k;
  function Y(c, u) {
    const h = c[0] - u[0], x = c[1] - u[1], m = c[2] - u[2];
    return Math.sqrt(h * h + x * x + m * m);
  }
  const j = Y;
  function pe(c, u) {
    const h = c[0] - u[0], x = c[1] - u[1], m = c[2] - u[2];
    return h * h + x * x + m * m;
  }
  const me = pe;
  function he(c, u) {
    const h = u ?? new f(3), x = c[0], m = c[1], P = c[2], D = Math.sqrt(x * x + m * m + P * P);
    return D > 1e-5 ? (h[0] = x / D, h[1] = m / D, h[2] = P / D) : (h[0] = 0, h[1] = 0, h[2] = 0), h;
  }
  function Pe(c, u) {
    const h = u ?? new f(3);
    return h[0] = -c[0], h[1] = -c[1], h[2] = -c[2], h;
  }
  function J(c, u) {
    const h = u ?? new f(3);
    return h[0] = c[0], h[1] = c[1], h[2] = c[2], h;
  }
  const ge = J;
  function fe(c, u, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] * u[0], x[1] = c[1] * u[1], x[2] = c[2] * u[2], x;
  }
  const R = fe;
  function C(c, u, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] / u[0], x[1] = c[1] / u[1], x[2] = c[2] / u[2], x;
  }
  const ee = C;
  function W(c = 1, u) {
    const h = u ?? new f(3), x = Math.random() * 2 * Math.PI, m = Math.random() * 2 - 1, P = Math.sqrt(1 - m * m) * c;
    return h[0] = Math.cos(x) * P, h[1] = Math.sin(x) * P, h[2] = m * c, h;
  }
  function i(c) {
    const u = c ?? new f(3);
    return u[0] = 0, u[1] = 0, u[2] = 0, u;
  }
  function d(c, u, h) {
    const x = h ?? new f(3), m = c[0], P = c[1], D = c[2], _ = u[3] * m + u[7] * P + u[11] * D + u[15] || 1;
    return x[0] = (u[0] * m + u[4] * P + u[8] * D + u[12]) / _, x[1] = (u[1] * m + u[5] * P + u[9] * D + u[13]) / _, x[2] = (u[2] * m + u[6] * P + u[10] * D + u[14]) / _, x;
  }
  function t(c, u, h) {
    const x = h ?? new f(3), m = c[0], P = c[1], D = c[2];
    return x[0] = m * u[0 * 4 + 0] + P * u[1 * 4 + 0] + D * u[2 * 4 + 0], x[1] = m * u[0 * 4 + 1] + P * u[1 * 4 + 1] + D * u[2 * 4 + 1], x[2] = m * u[0 * 4 + 2] + P * u[1 * 4 + 2] + D * u[2 * 4 + 2], x;
  }
  function s(c, u, h) {
    const x = h ?? new f(3), m = c[0], P = c[1], D = c[2];
    return x[0] = m * u[0] + P * u[4] + D * u[8], x[1] = m * u[1] + P * u[5] + D * u[9], x[2] = m * u[2] + P * u[6] + D * u[10], x;
  }
  function l(c, u, h) {
    const x = h ?? new f(3), m = u[0], P = u[1], D = u[2], _ = u[3] * 2, X = c[0], V = c[1], F = c[2], O = P * F - D * V, q = D * X - m * F, ue = m * V - P * X;
    return x[0] = X + O * _ + (P * ue - D * q) * 2, x[1] = V + q * _ + (D * O - m * ue) * 2, x[2] = F + ue * _ + (m * q - P * O) * 2, x;
  }
  function p(c, u) {
    const h = u ?? new f(3);
    return h[0] = c[12], h[1] = c[13], h[2] = c[14], h;
  }
  function w(c, u, h) {
    const x = h ?? new f(3), m = u * 4;
    return x[0] = c[m + 0], x[1] = c[m + 1], x[2] = c[m + 2], x;
  }
  function e(c, u) {
    const h = u ?? new f(3), x = c[0], m = c[1], P = c[2], D = c[4], _ = c[5], X = c[6], V = c[8], F = c[9], O = c[10];
    return h[0] = Math.sqrt(x * x + m * m + P * P), h[1] = Math.sqrt(D * D + _ * _ + X * X), h[2] = Math.sqrt(V * V + F * F + O * O), h;
  }
  function o(c, u, h, x) {
    const m = x ?? new f(3), P = [], D = [];
    return P[0] = c[0] - u[0], P[1] = c[1] - u[1], P[2] = c[2] - u[2], D[0] = P[0], D[1] = P[1] * Math.cos(h) - P[2] * Math.sin(h), D[2] = P[1] * Math.sin(h) + P[2] * Math.cos(h), m[0] = D[0] + u[0], m[1] = D[1] + u[1], m[2] = D[2] + u[2], m;
  }
  function n(c, u, h, x) {
    const m = x ?? new f(3), P = [], D = [];
    return P[0] = c[0] - u[0], P[1] = c[1] - u[1], P[2] = c[2] - u[2], D[0] = P[2] * Math.sin(h) + P[0] * Math.cos(h), D[1] = P[1], D[2] = P[2] * Math.cos(h) - P[0] * Math.sin(h), m[0] = D[0] + u[0], m[1] = D[1] + u[1], m[2] = D[2] + u[2], m;
  }
  function r(c, u, h, x) {
    const m = x ?? new f(3), P = [], D = [];
    return P[0] = c[0] - u[0], P[1] = c[1] - u[1], P[2] = c[2] - u[2], D[0] = P[0] * Math.cos(h) - P[1] * Math.sin(h), D[1] = P[0] * Math.sin(h) + P[1] * Math.cos(h), D[2] = P[2], m[0] = D[0] + u[0], m[1] = D[1] + u[1], m[2] = D[2] + u[2], m;
  }
  function a(c, u, h) {
    const x = h ?? new f(3);
    return he(c, x), A(x, u, x);
  }
  function g(c, u, h) {
    const x = h ?? new f(3);
    return ie(c) > u ? a(c, u, x) : J(c, x);
  }
  function y(c, u, h) {
    const x = h ?? new f(3);
    return ae(c, u, 0.5, x);
  }
  return {
    create: v,
    fromValues: z,
    set: T,
    ceil: U,
    floor: M,
    round: S,
    clamp: I,
    add: G,
    addScaled: B,
    angle: $,
    subtract: E,
    sub: re,
    equalsApproximately: se,
    equals: le,
    lerp: ae,
    lerpV: de,
    max: oe,
    min: Z,
    mulScalar: A,
    scale: ne,
    divScalar: ce,
    inverse: K,
    invert: te,
    cross: H,
    dot: N,
    length: ie,
    len: we,
    lengthSq: k,
    lenSq: Q,
    distance: Y,
    dist: j,
    distanceSq: pe,
    distSq: me,
    normalize: he,
    negate: Pe,
    copy: J,
    clone: ge,
    multiply: fe,
    mul: R,
    divide: C,
    div: ee,
    random: W,
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
  function T(i, d, t, s, l, p, w, e, o) {
    const n = new f(12);
    return n[3] = 0, n[7] = 0, n[11] = 0, i !== void 0 && (n[0] = i, d !== void 0 && (n[1] = d, t !== void 0 && (n[2] = t, s !== void 0 && (n[4] = s, l !== void 0 && (n[5] = l, p !== void 0 && (n[6] = p, w !== void 0 && (n[8] = w, e !== void 0 && (n[9] = e, o !== void 0 && (n[10] = o))))))))), n;
  }
  function U(i, d, t, s, l, p, w, e, o, n) {
    const r = n ?? new f(12);
    return r[0] = i, r[1] = d, r[2] = t, r[3] = 0, r[4] = s, r[5] = l, r[6] = p, r[7] = 0, r[8] = w, r[9] = e, r[10] = o, r[11] = 0, r;
  }
  function M(i, d) {
    const t = d ?? new f(12);
    return t[0] = i[0], t[1] = i[1], t[2] = i[2], t[3] = 0, t[4] = i[4], t[5] = i[5], t[6] = i[6], t[7] = 0, t[8] = i[8], t[9] = i[9], t[10] = i[10], t[11] = 0, t;
  }
  function S(i, d) {
    const t = d ?? new f(12), s = i[0], l = i[1], p = i[2], w = i[3], e = s + s, o = l + l, n = p + p, r = s * e, a = l * e, g = l * o, y = p * e, c = p * o, u = p * n, h = w * e, x = w * o, m = w * n;
    return t[0] = 1 - g - u, t[1] = a + m, t[2] = y - x, t[3] = 0, t[4] = a - m, t[5] = 1 - r - u, t[6] = c + h, t[7] = 0, t[8] = y + x, t[9] = c - h, t[10] = 1 - r - g, t[11] = 0, t;
  }
  function I(i, d) {
    const t = d ?? new f(12);
    return t[0] = -i[0], t[1] = -i[1], t[2] = -i[2], t[4] = -i[4], t[5] = -i[5], t[6] = -i[6], t[8] = -i[8], t[9] = -i[9], t[10] = -i[10], t;
  }
  function G(i, d) {
    const t = d ?? new f(12);
    return t[0] = i[0], t[1] = i[1], t[2] = i[2], t[4] = i[4], t[5] = i[5], t[6] = i[6], t[8] = i[8], t[9] = i[9], t[10] = i[10], t;
  }
  const B = G;
  function $(i, d) {
    return Math.abs(i[0] - d[0]) < L && Math.abs(i[1] - d[1]) < L && Math.abs(i[2] - d[2]) < L && Math.abs(i[4] - d[4]) < L && Math.abs(i[5] - d[5]) < L && Math.abs(i[6] - d[6]) < L && Math.abs(i[8] - d[8]) < L && Math.abs(i[9] - d[9]) < L && Math.abs(i[10] - d[10]) < L;
  }
  function E(i, d) {
    return i[0] === d[0] && i[1] === d[1] && i[2] === d[2] && i[4] === d[4] && i[5] === d[5] && i[6] === d[6] && i[8] === d[8] && i[9] === d[9] && i[10] === d[10];
  }
  function re(i) {
    const d = i ?? new f(12);
    return d[0] = 1, d[1] = 0, d[2] = 0, d[4] = 0, d[5] = 1, d[6] = 0, d[8] = 0, d[9] = 0, d[10] = 1, d;
  }
  function se(i, d) {
    const t = d ?? new f(12);
    if (t === i) {
      let g;
      return g = i[1], i[1] = i[4], i[4] = g, g = i[2], i[2] = i[8], i[8] = g, g = i[6], i[6] = i[9], i[9] = g, t;
    }
    const s = i[0 * 4 + 0], l = i[0 * 4 + 1], p = i[0 * 4 + 2], w = i[1 * 4 + 0], e = i[1 * 4 + 1], o = i[1 * 4 + 2], n = i[2 * 4 + 0], r = i[2 * 4 + 1], a = i[2 * 4 + 2];
    return t[0] = s, t[1] = w, t[2] = n, t[4] = l, t[5] = e, t[6] = r, t[8] = p, t[9] = o, t[10] = a, t;
  }
  function le(i, d) {
    const t = d ?? new f(12), s = i[0 * 4 + 0], l = i[0 * 4 + 1], p = i[0 * 4 + 2], w = i[1 * 4 + 0], e = i[1 * 4 + 1], o = i[1 * 4 + 2], n = i[2 * 4 + 0], r = i[2 * 4 + 1], a = i[2 * 4 + 2], g = a * e - o * r, y = -a * w + o * n, c = r * w - e * n, u = 1 / (s * g + l * y + p * c);
    return t[0] = g * u, t[1] = (-a * l + p * r) * u, t[2] = (o * l - p * e) * u, t[4] = y * u, t[5] = (a * s - p * n) * u, t[6] = (-o * s + p * w) * u, t[8] = c * u, t[9] = (-r * s + l * n) * u, t[10] = (e * s - l * w) * u, t;
  }
  function ae(i) {
    const d = i[0], t = i[0 * 4 + 1], s = i[0 * 4 + 2], l = i[1 * 4 + 0], p = i[1 * 4 + 1], w = i[1 * 4 + 2], e = i[2 * 4 + 0], o = i[2 * 4 + 1], n = i[2 * 4 + 2];
    return d * (p * n - o * w) - l * (t * n - o * s) + e * (t * w - p * s);
  }
  const de = le;
  function oe(i, d, t) {
    const s = t ?? new f(12), l = i[0], p = i[1], w = i[2], e = i[4], o = i[5], n = i[6], r = i[8], a = i[9], g = i[10], y = d[0], c = d[1], u = d[2], h = d[4], x = d[5], m = d[6], P = d[8], D = d[9], _ = d[10];
    return s[0] = l * y + e * c + r * u, s[1] = p * y + o * c + a * u, s[2] = w * y + n * c + g * u, s[4] = l * h + e * x + r * m, s[5] = p * h + o * x + a * m, s[6] = w * h + n * x + g * m, s[8] = l * P + e * D + r * _, s[9] = p * P + o * D + a * _, s[10] = w * P + n * D + g * _, s;
  }
  const Z = oe;
  function A(i, d, t) {
    const s = t ?? re();
    return i !== s && (s[0] = i[0], s[1] = i[1], s[2] = i[2], s[4] = i[4], s[5] = i[5], s[6] = i[6]), s[8] = d[0], s[9] = d[1], s[10] = 1, s;
  }
  function ne(i, d) {
    const t = d ?? v.create();
    return t[0] = i[8], t[1] = i[9], t;
  }
  function ce(i, d, t) {
    const s = t ?? v.create(), l = d * 4;
    return s[0] = i[l + 0], s[1] = i[l + 1], s;
  }
  function K(i, d, t, s) {
    const l = s === i ? i : G(i, s), p = t * 4;
    return l[p + 0] = d[0], l[p + 1] = d[1], l;
  }
  function te(i, d) {
    const t = d ?? v.create(), s = i[0], l = i[1], p = i[4], w = i[5];
    return t[0] = Math.sqrt(s * s + l * l), t[1] = Math.sqrt(p * p + w * w), t;
  }
  function H(i, d) {
    const t = d ?? z.create(), s = i[0], l = i[1], p = i[2], w = i[4], e = i[5], o = i[6], n = i[8], r = i[9], a = i[10];
    return t[0] = Math.sqrt(s * s + l * l + p * p), t[1] = Math.sqrt(w * w + e * e + o * o), t[2] = Math.sqrt(n * n + r * r + a * a), t;
  }
  function N(i, d) {
    const t = d ?? new f(12);
    return t[0] = 1, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[8] = i[0], t[9] = i[1], t[10] = 1, t;
  }
  function ie(i, d, t) {
    const s = t ?? new f(12), l = d[0], p = d[1], w = i[0], e = i[1], o = i[2], n = i[1 * 4 + 0], r = i[1 * 4 + 1], a = i[1 * 4 + 2], g = i[2 * 4 + 0], y = i[2 * 4 + 1], c = i[2 * 4 + 2];
    return i !== s && (s[0] = w, s[1] = e, s[2] = o, s[4] = n, s[5] = r, s[6] = a), s[8] = w * l + n * p + g, s[9] = e * l + r * p + y, s[10] = o * l + a * p + c, s;
  }
  function we(i, d) {
    const t = d ?? new f(12), s = Math.cos(i), l = Math.sin(i);
    return t[0] = s, t[1] = l, t[2] = 0, t[4] = -l, t[5] = s, t[6] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t;
  }
  function k(i, d, t) {
    const s = t ?? new f(12), l = i[0 * 4 + 0], p = i[0 * 4 + 1], w = i[0 * 4 + 2], e = i[1 * 4 + 0], o = i[1 * 4 + 1], n = i[1 * 4 + 2], r = Math.cos(d), a = Math.sin(d);
    return s[0] = r * l + a * e, s[1] = r * p + a * o, s[2] = r * w + a * n, s[4] = r * e - a * l, s[5] = r * o - a * p, s[6] = r * n - a * w, i !== s && (s[8] = i[8], s[9] = i[9], s[10] = i[10]), s;
  }
  function Q(i, d) {
    const t = d ?? new f(12), s = Math.cos(i), l = Math.sin(i);
    return t[0] = 1, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = s, t[6] = l, t[8] = 0, t[9] = -l, t[10] = s, t;
  }
  function Y(i, d, t) {
    const s = t ?? new f(12), l = i[4], p = i[5], w = i[6], e = i[8], o = i[9], n = i[10], r = Math.cos(d), a = Math.sin(d);
    return s[4] = r * l + a * e, s[5] = r * p + a * o, s[6] = r * w + a * n, s[8] = r * e - a * l, s[9] = r * o - a * p, s[10] = r * n - a * w, i !== s && (s[0] = i[0], s[1] = i[1], s[2] = i[2]), s;
  }
  function j(i, d) {
    const t = d ?? new f(12), s = Math.cos(i), l = Math.sin(i);
    return t[0] = s, t[1] = 0, t[2] = -l, t[4] = 0, t[5] = 1, t[6] = 0, t[8] = l, t[9] = 0, t[10] = s, t;
  }
  function pe(i, d, t) {
    const s = t ?? new f(12), l = i[0 * 4 + 0], p = i[0 * 4 + 1], w = i[0 * 4 + 2], e = i[2 * 4 + 0], o = i[2 * 4 + 1], n = i[2 * 4 + 2], r = Math.cos(d), a = Math.sin(d);
    return s[0] = r * l - a * e, s[1] = r * p - a * o, s[2] = r * w - a * n, s[8] = r * e + a * l, s[9] = r * o + a * p, s[10] = r * n + a * w, i !== s && (s[4] = i[4], s[5] = i[5], s[6] = i[6]), s;
  }
  const me = we, he = k;
  function Pe(i, d) {
    const t = d ?? new f(12);
    return t[0] = i[0], t[1] = 0, t[2] = 0, t[4] = 0, t[5] = i[1], t[6] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t;
  }
  function J(i, d, t) {
    const s = t ?? new f(12), l = d[0], p = d[1];
    return s[0] = l * i[0 * 4 + 0], s[1] = l * i[0 * 4 + 1], s[2] = l * i[0 * 4 + 2], s[4] = p * i[1 * 4 + 0], s[5] = p * i[1 * 4 + 1], s[6] = p * i[1 * 4 + 2], i !== s && (s[8] = i[8], s[9] = i[9], s[10] = i[10]), s;
  }
  function ge(i, d) {
    const t = d ?? new f(12);
    return t[0] = i[0], t[1] = 0, t[2] = 0, t[4] = 0, t[5] = i[1], t[6] = 0, t[8] = 0, t[9] = 0, t[10] = i[2], t;
  }
  function fe(i, d, t) {
    const s = t ?? new f(12), l = d[0], p = d[1], w = d[2];
    return s[0] = l * i[0 * 4 + 0], s[1] = l * i[0 * 4 + 1], s[2] = l * i[0 * 4 + 2], s[4] = p * i[1 * 4 + 0], s[5] = p * i[1 * 4 + 1], s[6] = p * i[1 * 4 + 2], s[8] = w * i[2 * 4 + 0], s[9] = w * i[2 * 4 + 1], s[10] = w * i[2 * 4 + 2], s;
  }
  function R(i, d) {
    const t = d ?? new f(12);
    return t[0] = i, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = i, t[6] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t;
  }
  function C(i, d, t) {
    const s = t ?? new f(12);
    return s[0] = d * i[0 * 4 + 0], s[1] = d * i[0 * 4 + 1], s[2] = d * i[0 * 4 + 2], s[4] = d * i[1 * 4 + 0], s[5] = d * i[1 * 4 + 1], s[6] = d * i[1 * 4 + 2], i !== s && (s[8] = i[8], s[9] = i[9], s[10] = i[10]), s;
  }
  function ee(i, d) {
    const t = d ?? new f(12);
    return t[0] = i, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = i, t[6] = 0, t[8] = 0, t[9] = 0, t[10] = i, t;
  }
  function W(i, d, t) {
    const s = t ?? new f(12);
    return s[0] = d * i[0 * 4 + 0], s[1] = d * i[0 * 4 + 1], s[2] = d * i[0 * 4 + 2], s[4] = d * i[1 * 4 + 0], s[5] = d * i[1 * 4 + 1], s[6] = d * i[1 * 4 + 2], s[8] = d * i[2 * 4 + 0], s[9] = d * i[2 * 4 + 1], s[10] = d * i[2 * 4 + 2], s;
  }
  return {
    clone: B,
    create: T,
    set: U,
    fromMat4: M,
    fromQuat: S,
    negate: I,
    copy: G,
    equalsApproximately: $,
    equals: E,
    identity: re,
    transpose: se,
    inverse: le,
    invert: de,
    determinant: ae,
    mul: Z,
    multiply: oe,
    setTranslation: A,
    getTranslation: ne,
    getAxis: ce,
    setAxis: K,
    getScaling: te,
    get3DScaling: H,
    translation: N,
    translate: ie,
    rotation: we,
    rotate: k,
    rotationX: Q,
    rotateX: Y,
    rotationY: j,
    rotateY: pe,
    rotationZ: me,
    rotateZ: he,
    scaling: Pe,
    scale: J,
    uniformScaling: R,
    uniformScale: C,
    scaling3D: ge,
    scale3D: fe,
    uniformScaling3D: ee,
    uniformScale3D: W
  };
}
const en = /* @__PURE__ */ new Map();
function pn(f) {
  let v = en.get(f);
  return v || (v = dn(f), en.set(f, v)), v;
}
function hn(f) {
  const v = Ne(f);
  function z(e, o, n, r, a, g, y, c, u, h, x, m, P, D, _, X) {
    const V = new f(16);
    return e !== void 0 && (V[0] = e, o !== void 0 && (V[1] = o, n !== void 0 && (V[2] = n, r !== void 0 && (V[3] = r, a !== void 0 && (V[4] = a, g !== void 0 && (V[5] = g, y !== void 0 && (V[6] = y, c !== void 0 && (V[7] = c, u !== void 0 && (V[8] = u, h !== void 0 && (V[9] = h, x !== void 0 && (V[10] = x, m !== void 0 && (V[11] = m, P !== void 0 && (V[12] = P, D !== void 0 && (V[13] = D, _ !== void 0 && (V[14] = _, X !== void 0 && (V[15] = X)))))))))))))))), V;
  }
  function T(e, o, n, r, a, g, y, c, u, h, x, m, P, D, _, X, V) {
    const F = V ?? new f(16);
    return F[0] = e, F[1] = o, F[2] = n, F[3] = r, F[4] = a, F[5] = g, F[6] = y, F[7] = c, F[8] = u, F[9] = h, F[10] = x, F[11] = m, F[12] = P, F[13] = D, F[14] = _, F[15] = X, F;
  }
  function U(e, o) {
    const n = o ?? new f(16);
    return n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = 0, n[4] = e[4], n[5] = e[5], n[6] = e[6], n[7] = 0, n[8] = e[8], n[9] = e[9], n[10] = e[10], n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function M(e, o) {
    const n = o ?? new f(16), r = e[0], a = e[1], g = e[2], y = e[3], c = r + r, u = a + a, h = g + g, x = r * c, m = a * c, P = a * u, D = g * c, _ = g * u, X = g * h, V = y * c, F = y * u, O = y * h;
    return n[0] = 1 - P - X, n[1] = m + O, n[2] = D - F, n[3] = 0, n[4] = m - O, n[5] = 1 - x - X, n[6] = _ + V, n[7] = 0, n[8] = D + F, n[9] = _ - V, n[10] = 1 - x - P, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function S(e, o) {
    const n = o ?? new f(16);
    return n[0] = -e[0], n[1] = -e[1], n[2] = -e[2], n[3] = -e[3], n[4] = -e[4], n[5] = -e[5], n[6] = -e[6], n[7] = -e[7], n[8] = -e[8], n[9] = -e[9], n[10] = -e[10], n[11] = -e[11], n[12] = -e[12], n[13] = -e[13], n[14] = -e[14], n[15] = -e[15], n;
  }
  function I(e, o) {
    const n = o ?? new f(16);
    return n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = e[3], n[4] = e[4], n[5] = e[5], n[6] = e[6], n[7] = e[7], n[8] = e[8], n[9] = e[9], n[10] = e[10], n[11] = e[11], n[12] = e[12], n[13] = e[13], n[14] = e[14], n[15] = e[15], n;
  }
  const G = I;
  function B(e, o) {
    return Math.abs(e[0] - o[0]) < L && Math.abs(e[1] - o[1]) < L && Math.abs(e[2] - o[2]) < L && Math.abs(e[3] - o[3]) < L && Math.abs(e[4] - o[4]) < L && Math.abs(e[5] - o[5]) < L && Math.abs(e[6] - o[6]) < L && Math.abs(e[7] - o[7]) < L && Math.abs(e[8] - o[8]) < L && Math.abs(e[9] - o[9]) < L && Math.abs(e[10] - o[10]) < L && Math.abs(e[11] - o[11]) < L && Math.abs(e[12] - o[12]) < L && Math.abs(e[13] - o[13]) < L && Math.abs(e[14] - o[14]) < L && Math.abs(e[15] - o[15]) < L;
  }
  function $(e, o) {
    return e[0] === o[0] && e[1] === o[1] && e[2] === o[2] && e[3] === o[3] && e[4] === o[4] && e[5] === o[5] && e[6] === o[6] && e[7] === o[7] && e[8] === o[8] && e[9] === o[9] && e[10] === o[10] && e[11] === o[11] && e[12] === o[12] && e[13] === o[13] && e[14] === o[14] && e[15] === o[15];
  }
  function E(e) {
    const o = e ?? new f(16);
    return o[0] = 1, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = 1, o[6] = 0, o[7] = 0, o[8] = 0, o[9] = 0, o[10] = 1, o[11] = 0, o[12] = 0, o[13] = 0, o[14] = 0, o[15] = 1, o;
  }
  function re(e, o) {
    const n = o ?? new f(16);
    if (n === e) {
      let q;
      return q = e[1], e[1] = e[4], e[4] = q, q = e[2], e[2] = e[8], e[8] = q, q = e[3], e[3] = e[12], e[12] = q, q = e[6], e[6] = e[9], e[9] = q, q = e[7], e[7] = e[13], e[13] = q, q = e[11], e[11] = e[14], e[14] = q, n;
    }
    const r = e[0 * 4 + 0], a = e[0 * 4 + 1], g = e[0 * 4 + 2], y = e[0 * 4 + 3], c = e[1 * 4 + 0], u = e[1 * 4 + 1], h = e[1 * 4 + 2], x = e[1 * 4 + 3], m = e[2 * 4 + 0], P = e[2 * 4 + 1], D = e[2 * 4 + 2], _ = e[2 * 4 + 3], X = e[3 * 4 + 0], V = e[3 * 4 + 1], F = e[3 * 4 + 2], O = e[3 * 4 + 3];
    return n[0] = r, n[1] = c, n[2] = m, n[3] = X, n[4] = a, n[5] = u, n[6] = P, n[7] = V, n[8] = g, n[9] = h, n[10] = D, n[11] = F, n[12] = y, n[13] = x, n[14] = _, n[15] = O, n;
  }
  function se(e, o) {
    const n = o ?? new f(16), r = e[0 * 4 + 0], a = e[0 * 4 + 1], g = e[0 * 4 + 2], y = e[0 * 4 + 3], c = e[1 * 4 + 0], u = e[1 * 4 + 1], h = e[1 * 4 + 2], x = e[1 * 4 + 3], m = e[2 * 4 + 0], P = e[2 * 4 + 1], D = e[2 * 4 + 2], _ = e[2 * 4 + 3], X = e[3 * 4 + 0], V = e[3 * 4 + 1], F = e[3 * 4 + 2], O = e[3 * 4 + 3], q = D * O, ue = F * _, xe = h * O, ve = F * x, ye = h * _, De = D * x, Me = g * O, ze = F * y, be = g * _, Be = D * y, Ge = g * x, Se = h * y, Ve = m * V, _e = X * P, Fe = c * V, Ue = X * u, Ie = c * P, Re = m * u, Le = r * V, Oe = X * a, He = r * P, We = m * a, qe = r * u, Ee = c * a, Ce = q * u + ve * P + ye * V - (ue * u + xe * P + De * V), Ze = ue * a + Me * P + Be * V - (q * a + ze * P + be * V), $e = xe * a + ze * u + Ge * V - (ve * a + Me * u + Se * V), Qe = De * a + be * u + Se * P - (ye * a + Be * u + Ge * P), Te = 1 / (r * Ce + c * Ze + m * $e + X * Qe);
    return n[0] = Te * Ce, n[1] = Te * Ze, n[2] = Te * $e, n[3] = Te * Qe, n[4] = Te * (ue * c + xe * m + De * X - (q * c + ve * m + ye * X)), n[5] = Te * (q * r + ze * m + be * X - (ue * r + Me * m + Be * X)), n[6] = Te * (ve * r + Me * c + Se * X - (xe * r + ze * c + Ge * X)), n[7] = Te * (ye * r + Be * c + Ge * m - (De * r + be * c + Se * m)), n[8] = Te * (Ve * x + Ue * _ + Ie * O - (_e * x + Fe * _ + Re * O)), n[9] = Te * (_e * y + Le * _ + We * O - (Ve * y + Oe * _ + He * O)), n[10] = Te * (Fe * y + Oe * x + qe * O - (Ue * y + Le * x + Ee * O)), n[11] = Te * (Re * y + He * x + Ee * _ - (Ie * y + We * x + qe * _)), n[12] = Te * (Fe * D + Re * F + _e * h - (Ie * F + Ve * h + Ue * D)), n[13] = Te * (He * F + Ve * g + Oe * D - (Le * D + We * F + _e * g)), n[14] = Te * (Le * h + Ee * F + Ue * g - (qe * F + Fe * g + Oe * h)), n[15] = Te * (qe * D + Ie * g + We * h - (He * h + Ee * D + Re * g)), n;
  }
  function le(e) {
    const o = e[0], n = e[0 * 4 + 1], r = e[0 * 4 + 2], a = e[0 * 4 + 3], g = e[1 * 4 + 0], y = e[1 * 4 + 1], c = e[1 * 4 + 2], u = e[1 * 4 + 3], h = e[2 * 4 + 0], x = e[2 * 4 + 1], m = e[2 * 4 + 2], P = e[2 * 4 + 3], D = e[3 * 4 + 0], _ = e[3 * 4 + 1], X = e[3 * 4 + 2], V = e[3 * 4 + 3], F = m * V, O = X * P, q = c * V, ue = X * u, xe = c * P, ve = m * u, ye = r * V, De = X * a, Me = r * P, ze = m * a, be = r * u, Be = c * a, Ge = F * y + ue * x + xe * _ - (O * y + q * x + ve * _), Se = O * n + ye * x + ze * _ - (F * n + De * x + Me * _), Ve = q * n + De * y + be * _ - (ue * n + ye * y + Be * _), _e = ve * n + Me * y + Be * x - (xe * n + ze * y + be * x);
    return o * Ge + g * Se + h * Ve + D * _e;
  }
  const ae = se;
  function de(e, o, n) {
    const r = n ?? new f(16), a = e[0], g = e[1], y = e[2], c = e[3], u = e[4], h = e[5], x = e[6], m = e[7], P = e[8], D = e[9], _ = e[10], X = e[11], V = e[12], F = e[13], O = e[14], q = e[15], ue = o[0], xe = o[1], ve = o[2], ye = o[3], De = o[4], Me = o[5], ze = o[6], be = o[7], Be = o[8], Ge = o[9], Se = o[10], Ve = o[11], _e = o[12], Fe = o[13], Ue = o[14], Ie = o[15];
    return r[0] = a * ue + u * xe + P * ve + V * ye, r[1] = g * ue + h * xe + D * ve + F * ye, r[2] = y * ue + x * xe + _ * ve + O * ye, r[3] = c * ue + m * xe + X * ve + q * ye, r[4] = a * De + u * Me + P * ze + V * be, r[5] = g * De + h * Me + D * ze + F * be, r[6] = y * De + x * Me + _ * ze + O * be, r[7] = c * De + m * Me + X * ze + q * be, r[8] = a * Be + u * Ge + P * Se + V * Ve, r[9] = g * Be + h * Ge + D * Se + F * Ve, r[10] = y * Be + x * Ge + _ * Se + O * Ve, r[11] = c * Be + m * Ge + X * Se + q * Ve, r[12] = a * _e + u * Fe + P * Ue + V * Ie, r[13] = g * _e + h * Fe + D * Ue + F * Ie, r[14] = y * _e + x * Fe + _ * Ue + O * Ie, r[15] = c * _e + m * Fe + X * Ue + q * Ie, r;
  }
  const oe = de;
  function Z(e, o, n) {
    const r = n ?? E();
    return e !== r && (r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = e[3], r[4] = e[4], r[5] = e[5], r[6] = e[6], r[7] = e[7], r[8] = e[8], r[9] = e[9], r[10] = e[10], r[11] = e[11]), r[12] = o[0], r[13] = o[1], r[14] = o[2], r[15] = 1, r;
  }
  function A(e, o) {
    const n = o ?? v.create();
    return n[0] = e[12], n[1] = e[13], n[2] = e[14], n;
  }
  function ne(e, o, n) {
    const r = n ?? v.create(), a = o * 4;
    return r[0] = e[a + 0], r[1] = e[a + 1], r[2] = e[a + 2], r;
  }
  function ce(e, o, n, r) {
    const a = r === e ? r : I(e, r), g = n * 4;
    return a[g + 0] = o[0], a[g + 1] = o[1], a[g + 2] = o[2], a;
  }
  function K(e, o) {
    const n = o ?? v.create(), r = e[0], a = e[1], g = e[2], y = e[4], c = e[5], u = e[6], h = e[8], x = e[9], m = e[10];
    return n[0] = Math.sqrt(r * r + a * a + g * g), n[1] = Math.sqrt(y * y + c * c + u * u), n[2] = Math.sqrt(h * h + x * x + m * m), n;
  }
  function te(e, o, n, r, a) {
    const g = a ?? new f(16), y = Math.tan(Math.PI * 0.5 - 0.5 * e);
    if (g[0] = y / o, g[1] = 0, g[2] = 0, g[3] = 0, g[4] = 0, g[5] = y, g[6] = 0, g[7] = 0, g[8] = 0, g[9] = 0, g[11] = -1, g[12] = 0, g[13] = 0, g[15] = 0, Number.isFinite(r)) {
      const c = 1 / (n - r);
      g[10] = r * c, g[14] = r * n * c;
    } else
      g[10] = -1, g[14] = -n;
    return g;
  }
  function H(e, o, n, r = 1 / 0, a) {
    const g = a ?? new f(16), y = 1 / Math.tan(e * 0.5);
    if (g[0] = y / o, g[1] = 0, g[2] = 0, g[3] = 0, g[4] = 0, g[5] = y, g[6] = 0, g[7] = 0, g[8] = 0, g[9] = 0, g[11] = -1, g[12] = 0, g[13] = 0, g[15] = 0, r === 1 / 0)
      g[10] = 0, g[14] = n;
    else {
      const c = 1 / (r - n);
      g[10] = n * c, g[14] = r * n * c;
    }
    return g;
  }
  function N(e, o, n, r, a, g, y) {
    const c = y ?? new f(16);
    return c[0] = 2 / (o - e), c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 2 / (r - n), c[6] = 0, c[7] = 0, c[8] = 0, c[9] = 0, c[10] = 1 / (a - g), c[11] = 0, c[12] = (o + e) / (e - o), c[13] = (r + n) / (n - r), c[14] = a / (a - g), c[15] = 1, c;
  }
  function ie(e, o, n, r, a, g, y) {
    const c = y ?? new f(16), u = o - e, h = r - n, x = a - g;
    return c[0] = 2 * a / u, c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 2 * a / h, c[6] = 0, c[7] = 0, c[8] = (e + o) / u, c[9] = (r + n) / h, c[10] = g / x, c[11] = -1, c[12] = 0, c[13] = 0, c[14] = a * g / x, c[15] = 0, c;
  }
  function we(e, o, n, r, a, g = 1 / 0, y) {
    const c = y ?? new f(16), u = o - e, h = r - n;
    if (c[0] = 2 * a / u, c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 2 * a / h, c[6] = 0, c[7] = 0, c[8] = (e + o) / u, c[9] = (r + n) / h, c[11] = -1, c[12] = 0, c[13] = 0, c[15] = 0, g === 1 / 0)
      c[10] = 0, c[14] = a;
    else {
      const x = 1 / (g - a);
      c[10] = a * x, c[14] = g * a * x;
    }
    return c;
  }
  const k = v.create(), Q = v.create(), Y = v.create();
  function j(e, o, n, r) {
    const a = r ?? new f(16);
    return v.normalize(v.subtract(o, e, Y), Y), v.normalize(v.cross(n, Y, k), k), v.normalize(v.cross(Y, k, Q), Q), a[0] = k[0], a[1] = k[1], a[2] = k[2], a[3] = 0, a[4] = Q[0], a[5] = Q[1], a[6] = Q[2], a[7] = 0, a[8] = Y[0], a[9] = Y[1], a[10] = Y[2], a[11] = 0, a[12] = e[0], a[13] = e[1], a[14] = e[2], a[15] = 1, a;
  }
  function pe(e, o, n, r) {
    const a = r ?? new f(16);
    return v.normalize(v.subtract(e, o, Y), Y), v.normalize(v.cross(n, Y, k), k), v.normalize(v.cross(Y, k, Q), Q), a[0] = k[0], a[1] = k[1], a[2] = k[2], a[3] = 0, a[4] = Q[0], a[5] = Q[1], a[6] = Q[2], a[7] = 0, a[8] = Y[0], a[9] = Y[1], a[10] = Y[2], a[11] = 0, a[12] = e[0], a[13] = e[1], a[14] = e[2], a[15] = 1, a;
  }
  function me(e, o, n, r) {
    const a = r ?? new f(16);
    return v.normalize(v.subtract(e, o, Y), Y), v.normalize(v.cross(n, Y, k), k), v.normalize(v.cross(Y, k, Q), Q), a[0] = k[0], a[1] = Q[0], a[2] = Y[0], a[3] = 0, a[4] = k[1], a[5] = Q[1], a[6] = Y[1], a[7] = 0, a[8] = k[2], a[9] = Q[2], a[10] = Y[2], a[11] = 0, a[12] = -(k[0] * e[0] + k[1] * e[1] + k[2] * e[2]), a[13] = -(Q[0] * e[0] + Q[1] * e[1] + Q[2] * e[2]), a[14] = -(Y[0] * e[0] + Y[1] * e[1] + Y[2] * e[2]), a[15] = 1, a;
  }
  function he(e, o) {
    const n = o ?? new f(16);
    return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = e[0], n[13] = e[1], n[14] = e[2], n[15] = 1, n;
  }
  function Pe(e, o, n) {
    const r = n ?? new f(16), a = o[0], g = o[1], y = o[2], c = e[0], u = e[1], h = e[2], x = e[3], m = e[1 * 4 + 0], P = e[1 * 4 + 1], D = e[1 * 4 + 2], _ = e[1 * 4 + 3], X = e[2 * 4 + 0], V = e[2 * 4 + 1], F = e[2 * 4 + 2], O = e[2 * 4 + 3], q = e[3 * 4 + 0], ue = e[3 * 4 + 1], xe = e[3 * 4 + 2], ve = e[3 * 4 + 3];
    return e !== r && (r[0] = c, r[1] = u, r[2] = h, r[3] = x, r[4] = m, r[5] = P, r[6] = D, r[7] = _, r[8] = X, r[9] = V, r[10] = F, r[11] = O), r[12] = c * a + m * g + X * y + q, r[13] = u * a + P * g + V * y + ue, r[14] = h * a + D * g + F * y + xe, r[15] = x * a + _ * g + O * y + ve, r;
  }
  function J(e, o) {
    const n = o ?? new f(16), r = Math.cos(e), a = Math.sin(e);
    return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = r, n[6] = a, n[7] = 0, n[8] = 0, n[9] = -a, n[10] = r, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function ge(e, o, n) {
    const r = n ?? new f(16), a = e[4], g = e[5], y = e[6], c = e[7], u = e[8], h = e[9], x = e[10], m = e[11], P = Math.cos(o), D = Math.sin(o);
    return r[4] = P * a + D * u, r[5] = P * g + D * h, r[6] = P * y + D * x, r[7] = P * c + D * m, r[8] = P * u - D * a, r[9] = P * h - D * g, r[10] = P * x - D * y, r[11] = P * m - D * c, e !== r && (r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = e[3], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15]), r;
  }
  function fe(e, o) {
    const n = o ?? new f(16), r = Math.cos(e), a = Math.sin(e);
    return n[0] = r, n[1] = 0, n[2] = -a, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = a, n[9] = 0, n[10] = r, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function R(e, o, n) {
    const r = n ?? new f(16), a = e[0 * 4 + 0], g = e[0 * 4 + 1], y = e[0 * 4 + 2], c = e[0 * 4 + 3], u = e[2 * 4 + 0], h = e[2 * 4 + 1], x = e[2 * 4 + 2], m = e[2 * 4 + 3], P = Math.cos(o), D = Math.sin(o);
    return r[0] = P * a - D * u, r[1] = P * g - D * h, r[2] = P * y - D * x, r[3] = P * c - D * m, r[8] = P * u + D * a, r[9] = P * h + D * g, r[10] = P * x + D * y, r[11] = P * m + D * c, e !== r && (r[4] = e[4], r[5] = e[5], r[6] = e[6], r[7] = e[7], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15]), r;
  }
  function C(e, o) {
    const n = o ?? new f(16), r = Math.cos(e), a = Math.sin(e);
    return n[0] = r, n[1] = a, n[2] = 0, n[3] = 0, n[4] = -a, n[5] = r, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function ee(e, o, n) {
    const r = n ?? new f(16), a = e[0 * 4 + 0], g = e[0 * 4 + 1], y = e[0 * 4 + 2], c = e[0 * 4 + 3], u = e[1 * 4 + 0], h = e[1 * 4 + 1], x = e[1 * 4 + 2], m = e[1 * 4 + 3], P = Math.cos(o), D = Math.sin(o);
    return r[0] = P * a + D * u, r[1] = P * g + D * h, r[2] = P * y + D * x, r[3] = P * c + D * m, r[4] = P * u - D * a, r[5] = P * h - D * g, r[6] = P * x - D * y, r[7] = P * m - D * c, e !== r && (r[8] = e[8], r[9] = e[9], r[10] = e[10], r[11] = e[11], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15]), r;
  }
  function W(e, o, n) {
    const r = n ?? new f(16);
    let a = e[0], g = e[1], y = e[2];
    const c = Math.sqrt(a * a + g * g + y * y);
    a /= c, g /= c, y /= c;
    const u = a * a, h = g * g, x = y * y, m = Math.cos(o), P = Math.sin(o), D = 1 - m;
    return r[0] = u + (1 - u) * m, r[1] = a * g * D + y * P, r[2] = a * y * D - g * P, r[3] = 0, r[4] = a * g * D - y * P, r[5] = h + (1 - h) * m, r[6] = g * y * D + a * P, r[7] = 0, r[8] = a * y * D + g * P, r[9] = g * y * D - a * P, r[10] = x + (1 - x) * m, r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r;
  }
  const i = W;
  function d(e, o, n, r) {
    const a = r ?? new f(16);
    let g = o[0], y = o[1], c = o[2];
    const u = Math.sqrt(g * g + y * y + c * c);
    g /= u, y /= u, c /= u;
    const h = g * g, x = y * y, m = c * c, P = Math.cos(n), D = Math.sin(n), _ = 1 - P, X = h + (1 - h) * P, V = g * y * _ + c * D, F = g * c * _ - y * D, O = g * y * _ - c * D, q = x + (1 - x) * P, ue = y * c * _ + g * D, xe = g * c * _ + y * D, ve = y * c * _ - g * D, ye = m + (1 - m) * P, De = e[0], Me = e[1], ze = e[2], be = e[3], Be = e[4], Ge = e[5], Se = e[6], Ve = e[7], _e = e[8], Fe = e[9], Ue = e[10], Ie = e[11];
    return a[0] = X * De + V * Be + F * _e, a[1] = X * Me + V * Ge + F * Fe, a[2] = X * ze + V * Se + F * Ue, a[3] = X * be + V * Ve + F * Ie, a[4] = O * De + q * Be + ue * _e, a[5] = O * Me + q * Ge + ue * Fe, a[6] = O * ze + q * Se + ue * Ue, a[7] = O * be + q * Ve + ue * Ie, a[8] = xe * De + ve * Be + ye * _e, a[9] = xe * Me + ve * Ge + ye * Fe, a[10] = xe * ze + ve * Se + ye * Ue, a[11] = xe * be + ve * Ve + ye * Ie, e !== a && (a[12] = e[12], a[13] = e[13], a[14] = e[14], a[15] = e[15]), a;
  }
  const t = d;
  function s(e, o) {
    const n = o ?? new f(16);
    return n[0] = e[0], n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = e[1], n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = e[2], n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function l(e, o, n) {
    const r = n ?? new f(16), a = o[0], g = o[1], y = o[2];
    return r[0] = a * e[0 * 4 + 0], r[1] = a * e[0 * 4 + 1], r[2] = a * e[0 * 4 + 2], r[3] = a * e[0 * 4 + 3], r[4] = g * e[1 * 4 + 0], r[5] = g * e[1 * 4 + 1], r[6] = g * e[1 * 4 + 2], r[7] = g * e[1 * 4 + 3], r[8] = y * e[2 * 4 + 0], r[9] = y * e[2 * 4 + 1], r[10] = y * e[2 * 4 + 2], r[11] = y * e[2 * 4 + 3], e !== r && (r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15]), r;
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
    create: z,
    set: T,
    fromMat3: U,
    fromQuat: M,
    negate: S,
    copy: I,
    clone: G,
    equalsApproximately: B,
    equals: $,
    identity: E,
    transpose: re,
    inverse: se,
    determinant: le,
    invert: ae,
    multiply: de,
    mul: oe,
    setTranslation: Z,
    getTranslation: A,
    getAxis: ne,
    setAxis: ce,
    getScaling: K,
    perspective: te,
    perspectiveReverseZ: H,
    ortho: N,
    frustum: ie,
    frustumReverseZ: we,
    aim: j,
    cameraAim: pe,
    lookAt: me,
    translation: he,
    translate: Pe,
    rotationX: J,
    rotateX: ge,
    rotationY: fe,
    rotateY: R,
    rotationZ: C,
    rotateZ: ee,
    axisRotation: W,
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
function gn(f) {
  let v = nn.get(f);
  return v || (v = hn(f), nn.set(f, v)), v;
}
function xn(f) {
  const v = Ne(f);
  function z(i, d, t, s) {
    const l = new f(4);
    return i !== void 0 && (l[0] = i, d !== void 0 && (l[1] = d, t !== void 0 && (l[2] = t, s !== void 0 && (l[3] = s)))), l;
  }
  const T = z;
  function U(i, d, t, s, l) {
    const p = l ?? new f(4);
    return p[0] = i, p[1] = d, p[2] = t, p[3] = s, p;
  }
  function M(i, d, t) {
    const s = t ?? new f(4), l = d * 0.5, p = Math.sin(l);
    return s[0] = p * i[0], s[1] = p * i[1], s[2] = p * i[2], s[3] = Math.cos(l), s;
  }
  function S(i, d) {
    const t = d ?? v.create(3), s = Math.acos(i[3]) * 2, l = Math.sin(s * 0.5);
    return l > L ? (t[0] = i[0] / l, t[1] = i[1] / l, t[2] = i[2] / l) : (t[0] = 1, t[1] = 0, t[2] = 0), { angle: s, axis: t };
  }
  function I(i, d) {
    const t = ie(i, d);
    return Math.acos(2 * t * t - 1);
  }
  function G(i, d, t) {
    const s = t ?? new f(4), l = i[0], p = i[1], w = i[2], e = i[3], o = d[0], n = d[1], r = d[2], a = d[3];
    return s[0] = l * a + e * o + p * r - w * n, s[1] = p * a + e * n + w * o - l * r, s[2] = w * a + e * r + l * n - p * o, s[3] = e * a - l * o - p * n - w * r, s;
  }
  const B = G;
  function $(i, d, t) {
    const s = t ?? new f(4), l = d * 0.5, p = i[0], w = i[1], e = i[2], o = i[3], n = Math.sin(l), r = Math.cos(l);
    return s[0] = p * r + o * n, s[1] = w * r + e * n, s[2] = e * r - w * n, s[3] = o * r - p * n, s;
  }
  function E(i, d, t) {
    const s = t ?? new f(4), l = d * 0.5, p = i[0], w = i[1], e = i[2], o = i[3], n = Math.sin(l), r = Math.cos(l);
    return s[0] = p * r - e * n, s[1] = w * r + o * n, s[2] = e * r + p * n, s[3] = o * r - w * n, s;
  }
  function re(i, d, t) {
    const s = t ?? new f(4), l = d * 0.5, p = i[0], w = i[1], e = i[2], o = i[3], n = Math.sin(l), r = Math.cos(l);
    return s[0] = p * r + w * n, s[1] = w * r - p * n, s[2] = e * r + o * n, s[3] = o * r - e * n, s;
  }
  function se(i, d, t, s) {
    const l = s ?? new f(4), p = i[0], w = i[1], e = i[2], o = i[3];
    let n = d[0], r = d[1], a = d[2], g = d[3], y = p * n + w * r + e * a + o * g;
    y < 0 && (y = -y, n = -n, r = -r, a = -a, g = -g);
    let c, u;
    if (1 - y > L) {
      const h = Math.acos(y), x = Math.sin(h);
      c = Math.sin((1 - t) * h) / x, u = Math.sin(t * h) / x;
    } else
      c = 1 - t, u = t;
    return l[0] = c * p + u * n, l[1] = c * w + u * r, l[2] = c * e + u * a, l[3] = c * o + u * g, l;
  }
  function le(i, d) {
    const t = d ?? new f(4), s = i[0], l = i[1], p = i[2], w = i[3], e = s * s + l * l + p * p + w * w, o = e ? 1 / e : 0;
    return t[0] = -s * o, t[1] = -l * o, t[2] = -p * o, t[3] = w * o, t;
  }
  function ae(i, d) {
    const t = d ?? new f(4);
    return t[0] = -i[0], t[1] = -i[1], t[2] = -i[2], t[3] = i[3], t;
  }
  function de(i, d) {
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
  function oe(i, d, t, s, l) {
    const p = l ?? new f(4), w = i * 0.5, e = d * 0.5, o = t * 0.5, n = Math.sin(w), r = Math.cos(w), a = Math.sin(e), g = Math.cos(e), y = Math.sin(o), c = Math.cos(o);
    switch (s) {
      case "xyz":
        p[0] = n * g * c + r * a * y, p[1] = r * a * c - n * g * y, p[2] = r * g * y + n * a * c, p[3] = r * g * c - n * a * y;
        break;
      case "xzy":
        p[0] = n * g * c - r * a * y, p[1] = r * a * c - n * g * y, p[2] = r * g * y + n * a * c, p[3] = r * g * c + n * a * y;
        break;
      case "yxz":
        p[0] = n * g * c + r * a * y, p[1] = r * a * c - n * g * y, p[2] = r * g * y - n * a * c, p[3] = r * g * c + n * a * y;
        break;
      case "yzx":
        p[0] = n * g * c + r * a * y, p[1] = r * a * c + n * g * y, p[2] = r * g * y - n * a * c, p[3] = r * g * c - n * a * y;
        break;
      case "zxy":
        p[0] = n * g * c - r * a * y, p[1] = r * a * c + n * g * y, p[2] = r * g * y + n * a * c, p[3] = r * g * c - n * a * y;
        break;
      case "zyx":
        p[0] = n * g * c - r * a * y, p[1] = r * a * c + n * g * y, p[2] = r * g * y - n * a * c, p[3] = r * g * c + n * a * y;
        break;
      default:
        throw new Error(`Unknown rotation order: ${s}`);
    }
    return p;
  }
  function Z(i, d) {
    const t = d ?? new f(4);
    return t[0] = i[0], t[1] = i[1], t[2] = i[2], t[3] = i[3], t;
  }
  const A = Z;
  function ne(i, d, t) {
    const s = t ?? new f(4);
    return s[0] = i[0] + d[0], s[1] = i[1] + d[1], s[2] = i[2] + d[2], s[3] = i[3] + d[3], s;
  }
  function ce(i, d, t) {
    const s = t ?? new f(4);
    return s[0] = i[0] - d[0], s[1] = i[1] - d[1], s[2] = i[2] - d[2], s[3] = i[3] - d[3], s;
  }
  const K = ce;
  function te(i, d, t) {
    const s = t ?? new f(4);
    return s[0] = i[0] * d, s[1] = i[1] * d, s[2] = i[2] * d, s[3] = i[3] * d, s;
  }
  const H = te;
  function N(i, d, t) {
    const s = t ?? new f(4);
    return s[0] = i[0] / d, s[1] = i[1] / d, s[2] = i[2] / d, s[3] = i[3] / d, s;
  }
  function ie(i, d) {
    return i[0] * d[0] + i[1] * d[1] + i[2] * d[2] + i[3] * d[3];
  }
  function we(i, d, t, s) {
    const l = s ?? new f(4);
    return l[0] = i[0] + t * (d[0] - i[0]), l[1] = i[1] + t * (d[1] - i[1]), l[2] = i[2] + t * (d[2] - i[2]), l[3] = i[3] + t * (d[3] - i[3]), l;
  }
  function k(i) {
    const d = i[0], t = i[1], s = i[2], l = i[3];
    return Math.sqrt(d * d + t * t + s * s + l * l);
  }
  const Q = k;
  function Y(i) {
    const d = i[0], t = i[1], s = i[2], l = i[3];
    return d * d + t * t + s * s + l * l;
  }
  const j = Y;
  function pe(i, d) {
    const t = d ?? new f(4), s = i[0], l = i[1], p = i[2], w = i[3], e = Math.sqrt(s * s + l * l + p * p + w * w);
    return e > 1e-5 ? (t[0] = s / e, t[1] = l / e, t[2] = p / e, t[3] = w / e) : (t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1), t;
  }
  function me(i, d) {
    return Math.abs(i[0] - d[0]) < L && Math.abs(i[1] - d[1]) < L && Math.abs(i[2] - d[2]) < L && Math.abs(i[3] - d[3]) < L;
  }
  function he(i, d) {
    return i[0] === d[0] && i[1] === d[1] && i[2] === d[2] && i[3] === d[3];
  }
  function Pe(i) {
    const d = i ?? new f(4);
    return d[0] = 0, d[1] = 0, d[2] = 0, d[3] = 1, d;
  }
  const J = v.create(), ge = v.create(), fe = v.create();
  function R(i, d, t) {
    const s = t ?? new f(4), l = v.dot(i, d);
    return l < -0.999999 ? (v.cross(ge, i, J), v.len(J) < 1e-6 && v.cross(fe, i, J), v.normalize(J, J), M(J, Math.PI, s), s) : l > 0.999999 ? (s[0] = 0, s[1] = 0, s[2] = 0, s[3] = 1, s) : (v.cross(i, d, J), s[0] = J[0], s[1] = J[1], s[2] = J[2], s[3] = 1 + l, pe(s, s));
  }
  const C = new f(4), ee = new f(4);
  function W(i, d, t, s, l, p) {
    const w = p ?? new f(4);
    return se(i, s, l, C), se(d, t, l, ee), se(C, ee, 2 * l * (1 - l), w), w;
  }
  return {
    create: z,
    fromValues: T,
    set: U,
    fromAxisAngle: M,
    toAxisAngle: S,
    angle: I,
    multiply: G,
    mul: B,
    rotateX: $,
    rotateY: E,
    rotateZ: re,
    slerp: se,
    inverse: le,
    conjugate: ae,
    fromMat: de,
    fromEuler: oe,
    copy: Z,
    clone: A,
    add: ne,
    subtract: ce,
    sub: K,
    mulScalar: te,
    scale: H,
    divScalar: N,
    dot: ie,
    lerp: we,
    length: k,
    len: Q,
    lengthSq: Y,
    lenSq: j,
    normalize: pe,
    equalsApproximately: me,
    equals: he,
    identity: Pe,
    rotationTo: R,
    sqlerp: W
  };
}
const tn = /* @__PURE__ */ new Map();
function vn(f) {
  let v = tn.get(f);
  return v || (v = xn(f), tn.set(f, v)), v;
}
function wn(f) {
  function v(t, s, l, p) {
    const w = new f(4);
    return t !== void 0 && (w[0] = t, s !== void 0 && (w[1] = s, l !== void 0 && (w[2] = l, p !== void 0 && (w[3] = p)))), w;
  }
  const z = v;
  function T(t, s, l, p, w) {
    const e = w ?? new f(4);
    return e[0] = t, e[1] = s, e[2] = l, e[3] = p, e;
  }
  function U(t, s) {
    const l = s ?? new f(4);
    return l[0] = Math.ceil(t[0]), l[1] = Math.ceil(t[1]), l[2] = Math.ceil(t[2]), l[3] = Math.ceil(t[3]), l;
  }
  function M(t, s) {
    const l = s ?? new f(4);
    return l[0] = Math.floor(t[0]), l[1] = Math.floor(t[1]), l[2] = Math.floor(t[2]), l[3] = Math.floor(t[3]), l;
  }
  function S(t, s) {
    const l = s ?? new f(4);
    return l[0] = Math.round(t[0]), l[1] = Math.round(t[1]), l[2] = Math.round(t[2]), l[3] = Math.round(t[3]), l;
  }
  function I(t, s = 0, l = 1, p) {
    const w = p ?? new f(4);
    return w[0] = Math.min(l, Math.max(s, t[0])), w[1] = Math.min(l, Math.max(s, t[1])), w[2] = Math.min(l, Math.max(s, t[2])), w[3] = Math.min(l, Math.max(s, t[3])), w;
  }
  function G(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] + s[0], p[1] = t[1] + s[1], p[2] = t[2] + s[2], p[3] = t[3] + s[3], p;
  }
  function B(t, s, l, p) {
    const w = p ?? new f(4);
    return w[0] = t[0] + s[0] * l, w[1] = t[1] + s[1] * l, w[2] = t[2] + s[2] * l, w[3] = t[3] + s[3] * l, w;
  }
  function $(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] - s[0], p[1] = t[1] - s[1], p[2] = t[2] - s[2], p[3] = t[3] - s[3], p;
  }
  const E = $;
  function re(t, s) {
    return Math.abs(t[0] - s[0]) < L && Math.abs(t[1] - s[1]) < L && Math.abs(t[2] - s[2]) < L && Math.abs(t[3] - s[3]) < L;
  }
  function se(t, s) {
    return t[0] === s[0] && t[1] === s[1] && t[2] === s[2] && t[3] === s[3];
  }
  function le(t, s, l, p) {
    const w = p ?? new f(4);
    return w[0] = t[0] + l * (s[0] - t[0]), w[1] = t[1] + l * (s[1] - t[1]), w[2] = t[2] + l * (s[2] - t[2]), w[3] = t[3] + l * (s[3] - t[3]), w;
  }
  function ae(t, s, l, p) {
    const w = p ?? new f(4);
    return w[0] = t[0] + l[0] * (s[0] - t[0]), w[1] = t[1] + l[1] * (s[1] - t[1]), w[2] = t[2] + l[2] * (s[2] - t[2]), w[3] = t[3] + l[3] * (s[3] - t[3]), w;
  }
  function de(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = Math.max(t[0], s[0]), p[1] = Math.max(t[1], s[1]), p[2] = Math.max(t[2], s[2]), p[3] = Math.max(t[3], s[3]), p;
  }
  function oe(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = Math.min(t[0], s[0]), p[1] = Math.min(t[1], s[1]), p[2] = Math.min(t[2], s[2]), p[3] = Math.min(t[3], s[3]), p;
  }
  function Z(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] * s, p[1] = t[1] * s, p[2] = t[2] * s, p[3] = t[3] * s, p;
  }
  const A = Z;
  function ne(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] / s, p[1] = t[1] / s, p[2] = t[2] / s, p[3] = t[3] / s, p;
  }
  function ce(t, s) {
    const l = s ?? new f(4);
    return l[0] = 1 / t[0], l[1] = 1 / t[1], l[2] = 1 / t[2], l[3] = 1 / t[3], l;
  }
  const K = ce;
  function te(t, s) {
    return t[0] * s[0] + t[1] * s[1] + t[2] * s[2] + t[3] * s[3];
  }
  function H(t) {
    const s = t[0], l = t[1], p = t[2], w = t[3];
    return Math.sqrt(s * s + l * l + p * p + w * w);
  }
  const N = H;
  function ie(t) {
    const s = t[0], l = t[1], p = t[2], w = t[3];
    return s * s + l * l + p * p + w * w;
  }
  const we = ie;
  function k(t, s) {
    const l = t[0] - s[0], p = t[1] - s[1], w = t[2] - s[2], e = t[3] - s[3];
    return Math.sqrt(l * l + p * p + w * w + e * e);
  }
  const Q = k;
  function Y(t, s) {
    const l = t[0] - s[0], p = t[1] - s[1], w = t[2] - s[2], e = t[3] - s[3];
    return l * l + p * p + w * w + e * e;
  }
  const j = Y;
  function pe(t, s) {
    const l = s ?? new f(4), p = t[0], w = t[1], e = t[2], o = t[3], n = Math.sqrt(p * p + w * w + e * e + o * o);
    return n > 1e-5 ? (l[0] = p / n, l[1] = w / n, l[2] = e / n, l[3] = o / n) : (l[0] = 0, l[1] = 0, l[2] = 0, l[3] = 0), l;
  }
  function me(t, s) {
    const l = s ?? new f(4);
    return l[0] = -t[0], l[1] = -t[1], l[2] = -t[2], l[3] = -t[3], l;
  }
  function he(t, s) {
    const l = s ?? new f(4);
    return l[0] = t[0], l[1] = t[1], l[2] = t[2], l[3] = t[3], l;
  }
  const Pe = he;
  function J(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] * s[0], p[1] = t[1] * s[1], p[2] = t[2] * s[2], p[3] = t[3] * s[3], p;
  }
  const ge = J;
  function fe(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] / s[0], p[1] = t[1] / s[1], p[2] = t[2] / s[2], p[3] = t[3] / s[3], p;
  }
  const R = fe;
  function C(t) {
    const s = t ?? new f(4);
    return s[0] = 0, s[1] = 0, s[2] = 0, s[3] = 0, s;
  }
  function ee(t, s, l) {
    const p = l ?? new f(4), w = t[0], e = t[1], o = t[2], n = t[3];
    return p[0] = s[0] * w + s[4] * e + s[8] * o + s[12] * n, p[1] = s[1] * w + s[5] * e + s[9] * o + s[13] * n, p[2] = s[2] * w + s[6] * e + s[10] * o + s[14] * n, p[3] = s[3] * w + s[7] * e + s[11] * o + s[15] * n, p;
  }
  function W(t, s, l) {
    const p = l ?? new f(4);
    return pe(t, p), Z(p, s, p);
  }
  function i(t, s, l) {
    const p = l ?? new f(4);
    return H(t) > s ? W(t, s, p) : he(t, p);
  }
  function d(t, s, l) {
    const p = l ?? new f(4);
    return le(t, s, 0.5, p);
  }
  return {
    create: v,
    fromValues: z,
    set: T,
    ceil: U,
    floor: M,
    round: S,
    clamp: I,
    add: G,
    addScaled: B,
    subtract: $,
    sub: E,
    equalsApproximately: re,
    equals: se,
    lerp: le,
    lerpV: ae,
    max: de,
    min: oe,
    mulScalar: Z,
    scale: A,
    divScalar: ne,
    inverse: ce,
    invert: K,
    dot: te,
    length: H,
    len: N,
    lengthSq: ie,
    lenSq: we,
    distance: k,
    dist: Q,
    distanceSq: Y,
    distSq: j,
    normalize: pe,
    negate: me,
    copy: he,
    clone: Pe,
    multiply: J,
    mul: ge,
    divide: fe,
    div: R,
    zero: C,
    transformMat4: ee,
    setLength: W,
    truncate: i,
    midpoint: d
  };
}
const rn = /* @__PURE__ */ new Map();
function mn(f) {
  let v = rn.get(f);
  return v || (v = wn(f), rn.set(f, v)), v;
}
function je(f, v, z, T, U, M) {
  return {
    /** @namespace mat3 */
    mat3: pn(f),
    /** @namespace mat4 */
    mat4: gn(v),
    /** @namespace quat */
    quat: vn(z),
    /** @namespace vec2 */
    vec2: sn(T),
    /** @namespace vec3 */
    vec3: Ne(U),
    /** @namespace vec4 */
    vec4: mn(M)
  };
}
const {
  /**
   * 3x3 Matrix functions that default to returning `Float32Array`
   * @namespace
   */
  mat3: Wn,
  /**
   * 4x4 Matrix functions that default to returning `Float32Array`
   * @namespace
   */
  mat4: Ae,
  /**
   * Quaternion functions that default to returning `Float32Array`
   * @namespace
   */
  quat: qn,
  /**
   * Vec2 functions that default to returning `Float32Array`
   * @namespace
   */
  vec2: En,
  /**
   * Vec3 functions that default to returning `Float32Array`
   * @namespace
   */
  vec3: Nn,
  /**
   * Vec3 functions that default to returning `Float32Array`
   * @namespace
   */
  vec4: jn
} = je(Float32Array, Float32Array, Float32Array, Float32Array, Float32Array, Float32Array);
je(Float64Array, Float64Array, Float64Array, Float64Array, Float64Array, Float64Array);
je(un, Array, Array, Array, Array, Array);
const ke = new ArrayBuffer(272), Xe = {
  texelSize: new Float32Array(ke, 0, 2),
  sphereSize: new Float32Array(ke, 8, 2),
  invProjectionMatrix: new Float32Array(ke, 16, 16),
  projectionMatrix: new Float32Array(ke, 80, 16),
  viewMatrix: new Float32Array(ke, 144, 16),
  invViewMatrix: new Float32Array(ke, 208, 16)
};
class yn {
  constructor(v) {
    b(this, "isDragging");
    b(this, "prevX");
    b(this, "prevY");
    b(this, "prevHoverX");
    b(this, "prevHoverY");
    b(this, "currentHoverX");
    b(this, "currentHoverY");
    b(this, "currentXtheta");
    b(this, "currentYtheta");
    b(this, "maxYTheta");
    b(this, "minYTheta");
    b(this, "sensitivity");
    b(this, "currentDistance");
    b(this, "maxDistance");
    b(this, "minDistance");
    b(this, "target");
    b(this, "fov");
    b(this, "zoomRate");
    b(this, "canvas");
    this.canvas = v, this.canvas.addEventListener("mousedown", (z) => {
      this.isDragging = !0, this.prevX = z.clientX, this.prevY = z.clientY;
    }), this.canvas.addEventListener("wheel", (z) => {
      z.preventDefault();
      var T = z.deltaY;
      this.currentDistance += (T > 0 ? 1 : -1) * this.zoomRate, this.currentDistance < this.minDistance && (this.currentDistance = this.minDistance), this.currentDistance > this.maxDistance && (this.currentDistance = this.maxDistance), this.recalculateView();
    }), this.canvas.addEventListener("mousemove", (z) => {
      if (this.currentHoverX = z.clientX, this.currentHoverY = z.clientY, this.isDragging) {
        const T = this.prevX - z.clientX, U = this.prevY - z.clientY;
        this.currentXtheta += this.sensitivity * T, this.currentYtheta += this.sensitivity * U, this.currentYtheta > this.maxYTheta && (this.currentYtheta = this.maxYTheta), this.currentYtheta < this.minYTheta && (this.currentYtheta = this.minYTheta), this.prevX = z.clientX, this.prevY = z.clientY, this.recalculateView();
      }
    }), this.canvas.addEventListener("mouseup", () => {
      this.isDragging && (this.isDragging = !1);
    });
  }
  reset(v, z, T, U) {
    this.isDragging = !1, this.prevX = 0, this.prevY = 0, this.currentXtheta = -Math.PI / 2 * 1, this.currentYtheta = -Math.PI / 12 * 0.8, this.maxYTheta = -Math.PI / 12 * 0.8, this.minYTheta = -0.99 * Math.PI / 2, this.sensitivity = 5e-3, this.currentDistance = v, this.maxDistance = 1.3 * this.currentDistance, this.minDistance = 0.8 * this.currentDistance, this.target = z, this.fov = T, this.zoomRate = U;
    const M = this.canvas.clientWidth / this.canvas.clientHeight, S = Ae.perspective(T, M, 0.1, 300);
    Xe.projectionMatrix.set(S), Xe.invProjectionMatrix.set(Ae.inverse(S)), this.recalculateView();
  }
  recalculateView() {
    var v = Ae.identity();
    Ae.translate(v, this.target, v), Ae.rotateY(v, this.currentXtheta, v), Ae.rotateX(v, this.currentYtheta, v), Ae.translate(v, [0, 0, this.currentDistance], v);
    var z = Ae.multiply(v, [0, 0, 0, 1]);
    let T = this.target;
    const U = Ae.lookAt(
      [z[0], z[1], z[2]],
      // position
      T,
      // target
      [0, 1, 0]
      // up
    );
    Xe.viewMatrix.set(U), Xe.invViewMatrix.set(Ae.inverse(U));
  }
  calcMouseVelocity() {
    if (this.isDragging)
      return [0, 0];
    let [v, z] = this.calcPlaneCoord(this.currentHoverX, this.currentHoverY), [T, U] = this.calcPlaneCoord(this.prevHoverX, this.prevHoverY), M = v - T, S = z - U, I = 4;
    return M > I && (M = I), M < -I && (M = -I), S > I && (S = I), S < -I && (S = -I), [M, S, 0, 0];
  }
  calcPlaneCoord(v, z) {
    let T = v / this.canvas.width, U = z / this.canvas.height, M = 2 * T - 1, S = (1 - U) * 2 - 1, I = [
      M * Math.tan(this.fov / 2) * (this.canvas.width / this.canvas.height),
      S * Math.tan(this.fov / 2),
      -1
    ];
    return [I[0] * this.currentDistance, I[1] * this.currentDistance];
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
  constructor(v, z, T, U, M, S, I, G, B, $, E, re, se, le) {
    b(this, "cellStructSize", 16);
    b(this, "realBoxSizeBuffer");
    b(this, "numParticlesBuffer");
    b(this, "densityBuffer");
    b(this, "mouseInfoUniformBuffer");
    b(this, "sphereRadiusBuffer");
    b(this, "initBoxSizeBuffer");
    b(this, "numParticles", 0);
    b(this, "gridCount", 0);
    b(this, "maxGridCount", 0);
    b(this, "maxParticleCount", 0);
    b(this, "densityGridCount", 0);
    b(this, "clearGridPipeline");
    b(this, "clearDensityGridPipeline");
    b(this, "castDensityGridPipeline");
    b(this, "p2g1Pipeline");
    b(this, "p2g2Pipeline");
    b(this, "p2gDensityPipeline");
    b(this, "updateGridPipeline");
    b(this, "g2pPipeline");
    b(this, "copyPositionPipeline");
    b(this, "clearGridBindGroup");
    b(this, "clearDensityGridBindGroup");
    b(this, "castDensityGridBindGroup");
    b(this, "p2g1BindGroup");
    b(this, "p2g2BindGroup");
    b(this, "p2gDensityBindGroup");
    b(this, "updateGridBindGroup");
    b(this, "g2pBindGroup");
    b(this, "copyPositionBindGroup");
    b(this, "particleBuffer");
    b(this, "dtBuffer");
    b(this, "densityGridBuffer");
    b(this, "device");
    b(this, "renderDiameter");
    b(this, "frameCount");
    b(this, "spawned");
    b(this, "mouseInfoValues", new ArrayBuffer(32));
    b(this, "mouseInfoViews", {
      screenSize: new Float32Array(this.mouseInfoValues, 0, 2),
      mouseCoord: new Float32Array(this.mouseInfoValues, 8, 2),
      mouseVel: new Float32Array(this.mouseInfoValues, 16, 2),
      mouseRadius: new Float32Array(this.mouseInfoValues, 24, 1)
    });
    b(this, "restDensity");
    this.device = G, this.renderDiameter = le, this.frameCount = 0, this.spawned = !1, this.numParticles = 0, this.maxGridCount = E, this.maxParticleCount = re, this.initBoxSizeBuffer = S;
    const ae = G.createShaderModule({ code: Pn }), de = G.createShaderModule({ code: Gn }), oe = G.createShaderModule({ code: Sn }), Z = G.createShaderModule({ code: Dn }), A = G.createShaderModule({ code: Mn }), ne = G.createShaderModule({ code: Tn }), ce = G.createShaderModule({ code: zn }), K = G.createShaderModule({ code: bn }), te = G.createShaderModule({ code: Bn });
    this.restDensity = 3;
    const H = {
      stiffness: 50,
      restDensity: this.restDensity,
      dynamicViscosity: 0.1,
      fixedPointMultiplier: se,
      fixedPointMultiplierInverse: 1 / se
    };
    this.clearGridPipeline = G.createComputePipeline({
      label: "clear grid pipeline",
      layout: "auto",
      compute: {
        module: ae
      }
    }), this.clearDensityGridPipeline = G.createComputePipeline({
      label: "clear density grid pipeline",
      layout: "auto",
      compute: {
        module: de
      }
    }), this.castDensityGridPipeline = G.createComputePipeline({
      label: "cast density grid pipeline",
      layout: "auto",
      compute: {
        module: oe,
        constants: {
          fixedPointMultiplierInverse: H.fixedPointMultiplierInverse
        }
      }
    }), this.p2g1Pipeline = G.createComputePipeline({
      label: "p2g 1 pipeline",
      layout: "auto",
      compute: {
        module: Z,
        constants: {
          fixedPointMultiplier: H.fixedPointMultiplier
        }
      }
    }), this.p2g2Pipeline = G.createComputePipeline({
      label: "p2g 2 pipeline",
      layout: "auto",
      compute: {
        module: A,
        constants: {
          fixedPointMultiplier: H.fixedPointMultiplier,
          fixedPointMultiplierInverse: H.fixedPointMultiplierInverse,
          stiffness: H.stiffness,
          restDensity: H.restDensity,
          dynamicViscosity: H.dynamicViscosity
        }
      }
    }), this.p2gDensityPipeline = G.createComputePipeline({
      label: "p2g density pipeline",
      layout: "auto",
      compute: {
        module: ne,
        constants: {
          densityFixedPointMultiplier: H.fixedPointMultiplier
        }
      }
    }), this.updateGridPipeline = G.createComputePipeline({
      label: "update grid pipeline",
      layout: "auto",
      compute: {
        module: ce,
        constants: {
          fixedPointMultiplier: H.fixedPointMultiplier,
          fixedPointMultiplierInverse: H.fixedPointMultiplierInverse
        }
      }
    }), this.g2pPipeline = G.createComputePipeline({
      label: "g2p pipeline",
      layout: "auto",
      compute: {
        module: K,
        constants: {
          fixedPointMultiplierInverse: H.fixedPointMultiplierInverse
        }
      }
    }), this.copyPositionPipeline = G.createComputePipeline({
      label: "copy position pipeline",
      layout: "auto",
      compute: {
        module: te
      }
    });
    const N = G.createBuffer({
      label: "cells buffer",
      size: this.cellStructSize * E,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    this.densityBuffer = G.createBuffer({
      label: "density buffer",
      size: 4 * re,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    }), this.realBoxSizeBuffer = G.createBuffer({
      label: "real box size buffer",
      size: 12,
      // 3 x f32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.numParticlesBuffer = G.createBuffer({
      label: "number of particles buffer",
      size: 4,
      // 1 x f32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.mouseInfoUniformBuffer = G.createBuffer({
      label: "mouse info buffer",
      size: this.mouseInfoValues.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.sphereRadiusBuffer = G.createBuffer({
      label: "sphere radius buffer",
      size: 4,
      // 1 x f32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.dtBuffer = G.createBuffer({
      label: "dt buffer",
      size: 4,
      // 1 x f32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.mouseInfoViews.screenSize.set([$.width, $.height]), this.device.queue.writeBuffer(this.mouseInfoUniformBuffer, 0, this.mouseInfoValues), this.clearGridBindGroup = G.createBindGroup({
      layout: this.clearGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: N } }
      ]
    }), this.clearDensityGridBindGroup = G.createBindGroup({
      layout: this.clearDensityGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: U } },
        { binding: 1, resource: { buffer: M } }
      ]
    }), this.castDensityGridBindGroup = G.createBindGroup({
      layout: this.castDensityGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: U } },
        { binding: 1, resource: { buffer: M } }
      ]
    }), this.p2g1BindGroup = G.createBindGroup({
      layout: this.p2g1Pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: N } },
        { binding: 2, resource: { buffer: S } },
        { binding: 3, resource: { buffer: this.numParticlesBuffer } }
      ]
    }), this.p2g2BindGroup = G.createBindGroup({
      layout: this.p2g2Pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: N } },
        { binding: 2, resource: { buffer: S } },
        { binding: 3, resource: { buffer: this.numParticlesBuffer } },
        { binding: 4, resource: { buffer: this.densityBuffer } },
        { binding: 5, resource: { buffer: this.dtBuffer } }
      ]
    }), this.p2gDensityBindGroup = G.createBindGroup({
      layout: this.p2gDensityPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: this.densityBuffer } },
        { binding: 2, resource: { buffer: this.numParticlesBuffer } },
        { binding: 3, resource: { buffer: U } },
        { binding: 4, resource: { buffer: I } }
      ]
    }), this.updateGridBindGroup = G.createBindGroup({
      layout: this.updateGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: N } },
        { binding: 1, resource: { buffer: this.realBoxSizeBuffer } },
        { binding: 2, resource: { buffer: S } },
        { binding: 3, resource: { buffer: T } },
        { binding: 4, resource: B },
        { binding: 5, resource: { buffer: this.mouseInfoUniformBuffer } },
        { binding: 6, resource: { buffer: this.dtBuffer } }
      ]
    }), this.g2pBindGroup = G.createBindGroup({
      layout: this.g2pPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: N } },
        { binding: 2, resource: { buffer: this.realBoxSizeBuffer } },
        { binding: 3, resource: { buffer: S } },
        { binding: 4, resource: { buffer: this.numParticlesBuffer } },
        { binding: 5, resource: { buffer: this.dtBuffer } }
      ]
    }), this.copyPositionBindGroup = G.createBindGroup({
      layout: this.copyPositionPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: z } },
        { binding: 2, resource: { buffer: this.numParticlesBuffer } }
      ]
    }), this.particleBuffer = v, this.densityGridBuffer = U;
  }
  initDambreak(v, z) {
    let T = new ArrayBuffer(Ye * this.maxParticleCount);
    const U = 0.9;
    this.numParticles = 0, v[0] / 2, v[0] / 2, v[2] / 2;
    for (let G = 3; G < v[1] * 0.8 && this.numParticles < z; G += U)
      for (let B = v[0] * 0.25; B < v[0] - 4 && this.numParticles < z; B += U)
        for (let $ = 3; $ < v[2] / 2 && this.numParticles < z; $ += U) {
          const E = Ye * this.numParticles, re = {
            position: new Float32Array(T, E + 0, 3),
            v: new Float32Array(T, E + 16, 3),
            C: new Float32Array(T, E + 32, 12)
          }, se = 0.5 * Math.random();
          re.position.set([B + se, G + se, $ + se]), this.numParticles++;
        }
    console.log(this.numParticles), this.numParticles < z && console.log("warning: actual number of particles is smaller than the specified number. make bounding box larger.");
    let M = new ArrayBuffer(Ye * this.numParticles);
    const S = new Uint8Array(T), I = new Uint8Array(M);
    return I.set(S.subarray(0, I.length)), M;
  }
  reset(v, z) {
    if (this.gridCount = Math.ceil(v[0]) * Math.ceil(v[1]) * Math.ceil(v[2]), this.gridCount > this.maxGridCount)
      throw new Error("gridCount should be equal to or less than maxGridCount");
    this.densityGridCount = this.gridCount;
    const T = new Float32Array(v);
    this.device.queue.writeBuffer(this.initBoxSizeBuffer, 0, T), this.frameCount = 0;
    let U = this.initDambreak(v, z);
    this.device.queue.writeBuffer(this.particleBuffer, 0, U), this.changeBoxSize(v), this.changeNumParticles(this.numParticles);
  }
  execute(v, z, T, U, M, S, I, G) {
    const B = v.beginComputePass();
    this.mouseInfoViews.mouseCoord.set([z[0], z[1]]), this.mouseInfoViews.mouseVel.set([T[0], T[1]]), this.mouseInfoViews.mouseRadius.set([U]), this.device.queue.writeBuffer(this.mouseInfoUniformBuffer, 0, this.mouseInfoValues);
    const $ = new Float32Array([S]);
    if (this.device.queue.writeBuffer(this.dtBuffer, 0, $), M) {
      if (I)
        for (let re = 0; re < 1; re++)
          B.setBindGroup(0, this.clearGridBindGroup), B.setPipeline(this.clearGridPipeline), B.dispatchWorkgroups(Math.ceil(this.gridCount / 64)), B.setBindGroup(0, this.p2g1BindGroup), B.setPipeline(this.p2g1Pipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), B.setBindGroup(0, this.p2g2BindGroup), B.setPipeline(this.p2g2Pipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), B.setBindGroup(0, this.updateGridBindGroup), B.setPipeline(this.updateGridPipeline), B.dispatchWorkgroups(Math.ceil(this.gridCount / 64)), B.setBindGroup(0, this.g2pBindGroup), B.setPipeline(this.g2pPipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
      let E = G[0] * G[1] * G[2];
      B.setBindGroup(0, this.clearDensityGridBindGroup), B.setPipeline(this.clearDensityGridPipeline), B.dispatchWorkgroups(Math.ceil(E / 2 / 64)), B.setBindGroup(0, this.p2gDensityBindGroup), B.setPipeline(this.p2gDensityPipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), B.setBindGroup(0, this.castDensityGridBindGroup), B.setPipeline(this.castDensityGridPipeline), B.dispatchWorkgroups(Math.ceil(E / 2 / 64)), B.setBindGroup(0, this.copyPositionBindGroup), B.setPipeline(this.copyPositionPipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
    } else if (I) {
      for (let E = 0; E < 1; E++)
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

    
    let gridSize = 6.0;
    let lineThickness = 0.35;
    let isLineX = abs(fract(rayHitPos.x / gridSize - 0.5) - 0.5) < lineThickness / gridSize;
    let isLineZ = abs(fract(rayHitPos.z / gridSize - 0.5) - 0.5) < lineThickness / gridSize;
    let isLine = isLineX || isLineZ;
    let cell = floor(rayHitPos.xz / gridSize);
    let checker = select(0.93, 0.89, (i32(cell.x) + i32(cell.y)) % 2 == 0);
    let boardColor = vec3(checker, checker, checker * 1.01);
    let lineColor = vec3(0.66, 0.68, 0.69);
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
}`, kn = `struct VertexOutput {
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
}`, Xn = `struct VertexOutput {
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
    
    let gridSize = 6.0;
    let lineThickness = 0.35;
    let isLineX = abs(fract(rayHitPos.x / gridSize - 0.5) - 0.5) < lineThickness / gridSize;
    let isLineZ = abs(fract(rayHitPos.z / gridSize - 0.5) - 0.5) < lineThickness / gridSize;
    let isLine = isLineX || isLineZ;
    let cell = floor(rayHitPos.xz / gridSize);
    let checker = select(0.93, 0.89, (i32(cell.x) + i32(cell.y)) % 2 == 0);
    let boardColor = vec3(checker, checker, checker * 1.01);
    let lineColor = vec3(0.66, 0.68, 0.69);
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
  constructor(v, z, T, U, M, S, I, G, B, $, E, re, se) {
    b(this, "depthFilter1DPipeline");
    b(this, "depthFilter2DPipeline");
    b(this, "thicknessMapPipeline");
    b(this, "thicknessFilterPipeline");
    b(this, "fluidPipeline");
    b(this, "depthMapPipeline");
    b(this, "spherePipeline");
    b(this, "bgColorPipeline");
    b(this, "densityRaymarchPipeline");
    b(this, "depthMapTextureView");
    b(this, "tmpDepthMapTextureView");
    b(this, "thicknessTextureView");
    b(this, "tmpThicknessTextureView");
    b(this, "depthTestTextureView");
    b(this, "tmpOutputTextureView");
    b(this, "depthFilter1DBindGroups");
    b(this, "depthFilter2DBindGroups");
    b(this, "thicknessMapBindGroup");
    b(this, "thicknessFilterBindGroups");
    b(this, "fluidBindGroup");
    b(this, "depthMapBindGroup");
    b(this, "sphereBindGroup");
    b(this, "bgColorBindGroup");
    b(this, "densityRaymarchBindGroup");
    b(this, "diffuseColorBuffer");
    b(this, "colorDensityBuffer");
    b(this, "densityGridSizeBuffer");
    b(this, "device");
    this.device = M;
    const le = 50, ae = 2 * E, de = 12, oe = B.width / 2, Z = B.height / 2, A = {
      screenHeight: B.height,
      screenWidth: B.width
    }, ne = {
      maxFilterSize: le,
      projectedParticleConstant: de * ae * 0.05 * (B.height / 2) / Math.tan(re / 2)
    }, ce = {
      thicknessTextureWidth: oe,
      thicknessTextureHeight: Z
    }, K = M.createSampler({
      // addressModeU: "repeat",
      // addressModeV: "repeat",
      magFilter: "linear",
      minFilter: "linear"
    }), te = M.createShaderModule({ code: Un }), H = M.createShaderModule({ code: _n }), N = M.createShaderModule({ code: Fn }), ie = M.createShaderModule({ code: kn }), we = M.createShaderModule({ code: Xn }), k = M.createShaderModule({ code: In }), Q = M.createShaderModule({ code: An }), Y = M.createShaderModule({ code: Yn }), j = M.createShaderModule({ code: Rn });
    this.depthMapPipeline = M.createRenderPipeline({
      label: "depthMap pipeline",
      layout: "auto",
      vertex: { module: ie },
      fragment: {
        module: ie,
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
    }), this.spherePipeline = M.createRenderPipeline({
      label: "sphere pipeline",
      layout: "auto",
      vertex: { module: we },
      fragment: {
        module: we,
        targets: [
          {
            format: "r32float"
          },
          {
            format: $
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
    }), this.depthFilter1DPipeline = M.createRenderPipeline({
      label: "depth filter pipeline (1d)",
      layout: "auto",
      vertex: {
        module: te,
        constants: A
      },
      fragment: {
        module: H,
        constants: {
          ...ne,
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
    }), this.depthFilter2DPipeline = M.createRenderPipeline({
      label: "depth filter pipeline (2d)",
      layout: "auto",
      vertex: {
        module: te,
        constants: A
      },
      fragment: {
        module: H,
        constants: {
          ...ne,
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
    }), this.thicknessMapPipeline = M.createRenderPipeline({
      label: "thickness map pipeline",
      layout: "auto",
      vertex: {
        module: k
      },
      fragment: {
        module: k,
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
    }), this.thicknessFilterPipeline = M.createRenderPipeline({
      label: "thickness filter pipeline",
      layout: "auto",
      vertex: {
        module: te,
        constants: A
      },
      fragment: {
        module: Q,
        constants: ce,
        targets: [
          {
            format: "r16float"
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      }
    }), this.fluidPipeline = M.createRenderPipeline({
      label: "fluid rendering pipeline",
      layout: "auto",
      vertex: {
        module: te,
        constants: A
      },
      fragment: {
        module: N,
        targets: [
          {
            format: $
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      }
    }), this.bgColorPipeline = M.createRenderPipeline({
      label: "bgColor pipeline",
      layout: "auto",
      vertex: {
        module: te,
        constants: A
      },
      fragment: {
        module: Y,
        targets: [
          {
            format: $
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      }
    }), this.densityRaymarchPipeline = M.createRenderPipeline({
      label: "density raymarch pipeline",
      layout: "auto",
      vertex: {
        module: te,
        constants: A
      },
      fragment: {
        module: j,
        targets: [
          {
            format: $
          }
        ]
      }
    });
    const pe = M.createTexture({
      label: "temporary depth map texture",
      size: [B.width, B.height, 1],
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      format: "r32float"
    }), me = M.createTexture({
      label: "thickness map texture",
      size: [oe, Z, 1],
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      format: "r16float"
    }), he = M.createTexture({
      label: "temporary thickness map texture",
      size: [oe, Z, 1],
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      format: "r16float"
    }), Pe = M.createTexture({
      size: [B.width, B.height, 1],
      format: "depth32float",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
    }), J = M.createTexture({
      size: [B.width, B.height, 1],
      format: $,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
    });
    this.depthMapTextureView = S, this.tmpDepthMapTextureView = pe.createView(), this.thicknessTextureView = me.createView(), this.tmpThicknessTextureView = he.createView(), this.depthTestTextureView = Pe.createView(), this.tmpOutputTextureView = J.createView();
    const ge = M.createBuffer({
      label: "filter uniform buffer",
      size: 8,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), fe = M.createBuffer({
      label: "filter uniform buffer",
      size: 8,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), R = M.createBuffer({
      label: "thickness filter size buffer",
      size: 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    this.diffuseColorBuffer = M.createBuffer({
      label: "diffuse color buffer",
      size: 12,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.colorDensityBuffer = M.createBuffer({
      label: "color density buffer",
      size: 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.densityGridSizeBuffer = T;
    let C = new Float32Array([1, 0]), ee = new Float32Array([0, 1]), W = new Int32Array([15]);
    M.queue.writeBuffer(ge, 0, C), M.queue.writeBuffer(fe, 0, ee), M.queue.writeBuffer(R, 0, W), this.depthFilter1DBindGroups = [], this.depthFilter1DBindGroups = [
      M.createBindGroup({
        label: "filterX bind group",
        layout: this.depthFilter1DPipeline.getBindGroupLayout(0),
        entries: [
          // { binding: 0, resource: sampler },
          { binding: 1, resource: this.depthMapTextureView },
          { binding: 2, resource: { buffer: ge } }
        ]
      }),
      M.createBindGroup({
        label: "filterY bind group",
        layout: this.depthFilter1DPipeline.getBindGroupLayout(0),
        entries: [
          // { binding: 0, resource: sampler },
          { binding: 1, resource: this.tmpDepthMapTextureView },
          { binding: 2, resource: { buffer: fe } }
        ]
      })
    ], this.depthFilter2DBindGroups = [
      M.createBindGroup({
        label: "filterX bind group",
        layout: this.depthFilter2DPipeline.getBindGroupLayout(0),
        entries: [
          // { binding: 0, resource: sampler },
          { binding: 1, resource: this.depthMapTextureView },
          { binding: 2, resource: { buffer: ge } }
        ]
      }),
      M.createBindGroup({
        label: "filterY bind group",
        layout: this.depthFilter2DPipeline.getBindGroupLayout(0),
        entries: [
          // { binding: 0, resource: sampler },
          { binding: 1, resource: this.tmpDepthMapTextureView },
          { binding: 2, resource: { buffer: fe } }
        ]
      })
    ], this.thicknessMapBindGroup = M.createBindGroup({
      label: "thickness map bind group",
      layout: this.thicknessMapPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: z } },
        { binding: 1, resource: { buffer: v } }
      ]
    }), this.thicknessFilterBindGroups = [], this.thicknessFilterBindGroups = [
      M.createBindGroup({
        label: "thickness filterX bind group",
        layout: this.thicknessFilterPipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: K },
          { binding: 1, resource: this.thicknessTextureView },
          { binding: 2, resource: { buffer: ge } },
          { binding: 3, resource: { buffer: R } }
        ]
      }),
      M.createBindGroup({
        label: "thickness filterY bind group",
        layout: this.thicknessFilterPipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: K },
          { binding: 1, resource: this.tmpThicknessTextureView },
          { binding: 2, resource: { buffer: fe } },
          { binding: 3, resource: { buffer: R } }
        ]
      })
    ], this.fluidBindGroup = M.createBindGroup({
      label: "fluid bind group",
      layout: this.fluidPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: K },
        { binding: 1, resource: this.depthMapTextureView },
        { binding: 2, resource: { buffer: v } },
        { binding: 3, resource: this.thicknessTextureView },
        { binding: 4, resource: I },
        { binding: 5, resource: this.tmpOutputTextureView },
        { binding: 6, resource: { buffer: this.diffuseColorBuffer } },
        { binding: 7, resource: { buffer: this.colorDensityBuffer } }
      ]
    }), this.depthMapBindGroup = M.createBindGroup({
      label: "depthMap bind group",
      layout: this.depthMapPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: z } },
        { binding: 1, resource: { buffer: v } }
      ]
    }), this.bgColorBindGroup = M.createBindGroup({
      label: "bgColor bind group",
      layout: this.bgColorPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: I },
        { binding: 1, resource: { buffer: v } },
        { binding: 2, resource: K }
      ]
    }), this.sphereBindGroup = M.createBindGroup({
      label: "sphere bind group",
      layout: this.spherePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: z } },
        { binding: 1, resource: { buffer: v } }
      ]
    }), this.densityRaymarchBindGroup = M.createBindGroup({
      label: "density raymarch bind group",
      layout: this.densityRaymarchPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: this.depthMapTextureView },
        { binding: 1, resource: G },
        { binding: 2, resource: { buffer: v } },
        { binding: 3, resource: { buffer: U } },
        { binding: 4, resource: K },
        { binding: 5, resource: this.tmpOutputTextureView },
        { binding: 6, resource: { buffer: this.densityGridSizeBuffer } }
      ]
    }), console.log(this.densityRaymarchPipeline.getBindGroupLayout(0));
  }
  execute(v, z, T, U, M, S) {
    const I = new Float32Array(M), G = new Float32Array([S]);
    this.device.queue.writeBuffer(this.diffuseColorBuffer, 0, I), this.device.queue.writeBuffer(this.colorDensityBuffer, 0, G);
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
    ], $ = {
      colorAttachments: [
        {
          view: this.thicknessTextureView,
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    }, E = [
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
    ], re = {
      colorAttachments: [
        {
          view: this.tmpOutputTextureView,
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    }, se = {
      colorAttachments: [
        {
          view: v.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    }, le = {
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
    }, de = {
      colorAttachments: [
        {
          view: v.getCurrentTexture().createView(),
          clearValue: { r: 0.7, g: 0.7, b: 0.75, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    };
    if (U) {
      const Z = z.beginRenderPass(re);
      Z.setBindGroup(0, this.bgColorBindGroup), Z.setPipeline(this.bgColorPipeline), Z.draw(6), Z.end();
      const A = z.beginRenderPass(ae);
      A.setBindGroup(0, this.sphereBindGroup), A.setPipeline(this.spherePipeline), A.draw(6, T), A.end();
      const ne = z.beginRenderPass(de);
      ne.setBindGroup(0, this.densityRaymarchBindGroup), ne.setPipeline(this.densityRaymarchPipeline), ne.draw(6), ne.end();
    } else {
      const Z = z.beginRenderPass(le);
      Z.setBindGroup(0, this.depthMapBindGroup), Z.setPipeline(this.depthMapPipeline), Z.draw(6, T), Z.end();
      for (var oe = 0; oe < 2; oe++) {
        const H = z.beginRenderPass(B[0]);
        H.setBindGroup(0, this.depthFilter1DBindGroups[0]), H.setPipeline(this.depthFilter1DPipeline), H.draw(6), H.end();
        const N = z.beginRenderPass(B[1]);
        N.setBindGroup(0, this.depthFilter1DBindGroups[1]), N.setPipeline(this.depthFilter1DPipeline), N.draw(6), N.end();
      }
      const A = z.beginRenderPass(B[0]);
      A.setBindGroup(0, this.depthFilter2DBindGroups[0]), A.setPipeline(this.depthFilter2DPipeline), A.draw(6), A.end();
      const ne = z.beginRenderPass(B[1]);
      ne.setBindGroup(0, this.depthFilter2DBindGroups[1]), ne.setPipeline(this.depthFilter2DPipeline), ne.draw(6), ne.end();
      const ce = z.beginRenderPass($);
      ce.setBindGroup(0, this.thicknessMapBindGroup), ce.setPipeline(this.thicknessMapPipeline), ce.draw(6, T), ce.end();
      for (var oe = 0; oe < 1; oe++) {
        const N = z.beginRenderPass(E[0]);
        N.setBindGroup(0, this.thicknessFilterBindGroups[0]), N.setPipeline(this.thicknessFilterPipeline), N.draw(6), N.end();
        const ie = z.beginRenderPass(E[1]);
        ie.setBindGroup(0, this.thicknessFilterBindGroups[1]), ie.setPipeline(this.thicknessFilterPipeline), ie.draw(6), ie.end();
      }
      const K = z.beginRenderPass(re);
      K.setBindGroup(0, this.bgColorBindGroup), K.setPipeline(this.bgColorPipeline), K.draw(6), K.end();
      const te = z.beginRenderPass(se);
      te.setBindGroup(0, this.fluidBindGroup), te.setPipeline(this.fluidPipeline), te.draw(6), te.end();
    }
  }
}
function On(f, v = !1) {
  const z = document.createElement("canvas");
  z.width = z.height = f;
  const T = z.getContext("2d");
  if (T.fillStyle = v ? "#ecebe7" : "#f1f1ee", T.fillRect(0, 0, f, f), v) return z;
  const U = 8, M = f / U;
  for (let S = 0; S < U; S++) for (let I = 0; I < U; I++) {
    const G = 236 + Math.round(Math.random() * 10) - ((S + I) % 2 ? 6 : 0);
    T.fillStyle = `rgb(${G},${G},${G - 2})`, T.fillRect(S * M + 2, I * M + 2, M - 4, M - 4);
  }
  T.strokeStyle = "#b9bcbd", T.lineWidth = 4;
  for (let S = 0; S <= U; S++)
    T.beginPath(), T.moveTo(S * M, 0), T.lineTo(S * M, f), T.stroke(), T.beginPath(), T.moveTo(0, S * M), T.lineTo(f, S * M), T.stroke();
  return z;
}
async function Cn(f, v) {
  const z = v.particles ?? 55e3, T = v.box ?? [72, 22, 43], U = v.resolution ?? 0.7, M = await navigator.gpu.requestAdapter();
  if (!M) throw new Error("no WebGPU adapter");
  const S = await M.requestDevice(), I = f.getContext("webgpu");
  f.width = Math.round(U * f.clientWidth), f.height = Math.round(U * f.clientHeight);
  const G = navigator.gpu.getPreferredCanvasFormat();
  I.configure({ device: S, format: G });
  const B = await Promise.all([!1, !1, !0, !1, !1, !1].map((R) => createImageBitmap(On(512, R)))), $ = S.createTexture({
    dimension: "2d",
    size: [B[0].width, B[0].height, 6],
    format: "rgba8unorm",
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
  });
  B.forEach((R, C) => S.queue.copyExternalImageToTexture({ source: R }, { texture: $, origin: [0, 0, C] }, [R.width, R.height]));
  const E = $.createView({ dimension: "cube" }), re = T[0] * T[1] * T[2], se = S.createBuffer({ size: Ye * z, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST }), le = S.createBuffer({ size: 32 * z, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST }), ae = S.createBuffer({ size: ke.byteLength, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST }), de = S.createBuffer({ size: 12, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST }), Z = S.createTexture({ size: [f.width, f.height, 1], usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING, format: "r32float" }).createView(), A = [T[0], T[1], Math.ceil(T[2] / 128) * 128], ne = S.createBuffer({ size: 4 * A[0] * A[1] * A[2], usage: GPUBufferUsage.STORAGE }), ce = S.createBuffer({ size: 2 * A[0] * A[1] * A[2], usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC }), K = S.createBuffer({ size: 12, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  S.queue.writeBuffer(K, 0, new Float32Array(A));
  const te = S.createTexture({ size: [A[2], A[1], A[0]], usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST, format: "r16float", dimension: "3d" }), H = 60 * Math.PI / 180, N = 0.6, ie = 2 * N, we = 1e7, k = new Vn(
    se,
    le,
    ae,
    ne,
    ce,
    de,
    K,
    S,
    Z,
    f,
    re,
    z,
    we,
    ie
  ), Q = new Ln(
    ae,
    le,
    K,
    de,
    S,
    Z,
    E,
    te.createView(),
    f,
    G,
    N,
    H,
    we
  );
  k.initDambreak = function(R, C) {
    const ee = new ArrayBuffer(Ye * this.maxParticleCount), W = 0.9;
    this.numParticles = 0;
    for (let i = 3; i < R[1] - 3 && this.numParticles < C; i += W)
      for (let d = 3; d < R[0] - 3 && this.numParticles < C; d += W)
        for (let t = 3; t < R[2] - 3 && this.numParticles < C; t += W) {
          const s = Ye * this.numParticles;
          new Float32Array(ee, s, 3).set([d + 0.3 * Math.random(), i + 0.3 * Math.random(), t + 0.3 * Math.random()]), this.numParticles++;
        }
    return ee;
  };
  const Y = {
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
  }, j = new yn(Y), pe = () => {
    const R = f.clientWidth / Math.max(1, f.clientHeight), ee = (T[0] - 7) / 2 / 0.9 / (Math.tan(H / 2) * R) + (T[2] / 2 - 3);
    j.reset(ee, [T[0] / 2, T[1] * 0.42, T[2] / 2], H, 0.7), j.currentXtheta = 0, j.currentYtheta = -((v.elevation ?? 10) * Math.PI) / 180, j.recalculateView();
  };
  k.reset(T, z), pe();
  let me = !1;
  j.currentHoverX = j.prevHoverX = -1e4, j.currentHoverY = j.prevHoverY = -1e4;
  const he = (R, C) => {
    const ee = f.getBoundingClientRect();
    if (R === null || C === void 0) {
      me = !1, j.currentHoverX = j.prevHoverX = -1e4, j.currentHoverY = j.prevHoverY = -1e4;
      return;
    }
    me || (j.prevHoverX = R - ee.left, j.prevHoverY = C - ee.top), me = !0, j.currentHoverX = R - ee.left, j.currentHoverY = C - ee.top;
  }, Pe = () => {
    Xe.texelSize.set([1 / f.width, 1 / f.height]), Xe.sphereSize.set([ie]), S.queue.writeBuffer(ae, 0, ke);
    const R = S.createCommandEncoder();
    k.execute(
      R,
      [j.currentHoverX / f.clientWidth, j.currentHoverY / f.clientHeight],
      j.calcMouseVelocity().map((C) => C * 0.6),
      15,
      !1,
      0.4 * 0.8,
      !0,
      A
    ), Q.execute(I, R, k.numParticles, !1, [140 / 255, 220 / 255, 240 / 255], 0.7), S.queue.submit([R.finish()]), j.setNewPrevMouseCoord();
  };
  let J = 0, ge = !1;
  const fe = () => {
    ge || (Pe(), J = requestAnimationFrame(fe));
  };
  return J = requestAnimationFrame(fe), {
    particleCount: k.numParticles,
    setHand: he,
    reset: () => {
      k.reset(T, z), pe();
    },
    advance: Pe,
    box: T,
    project: (R, C, ee) => {
      const W = Xe.viewMatrix, i = Xe.projectionMatrix, d = W[0] * R + W[4] * C + W[8] * ee + W[12], t = W[1] * R + W[5] * C + W[9] * ee + W[13], s = W[2] * R + W[6] * C + W[10] * ee + W[14], l = W[3] * R + W[7] * C + W[11] * ee + W[15], p = i[0] * d + i[4] * t + i[8] * s + i[12] * l, w = i[1] * d + i[5] * t + i[9] * s + i[13] * l, e = i[3] * d + i[7] * t + i[11] * s + i[15] * l, o = f.getBoundingClientRect();
      return { x: o.left + (p / e * 0.5 + 0.5) * o.width, y: o.top + (0.5 - w / e * 0.5) * o.height, behind: e <= 0 };
    },
    destroy: () => {
      ge = !0, cancelAnimationFrame(J), S.destroy();
    }
  };
}
export {
  Cn as createTank
};
