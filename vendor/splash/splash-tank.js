var on = Object.defineProperty;
var cn = (f, v, M) => v in f ? on(f, v, { enumerable: !0, configurable: !0, writable: !0, value: M }) : f[v] = M;
var z = (f, v, M) => cn(f, typeof v != "symbol" ? v + "" : v, M);
function un(f, v) {
  return class extends f {
    constructor(...M) {
      super(...M), v(this);
    }
  };
}
const an = un(Array, (f) => f.fill(0));
let k = 1e-6;
function ln(f) {
  function v(e = 0, o = 0) {
    const n = new f(2);
    return e !== void 0 && (n[0] = e, o !== void 0 && (n[1] = o)), n;
  }
  const M = v;
  function T(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e, r[1] = o, r;
  }
  function U(e, o) {
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
  function R(e, o = 0, n = 1, r) {
    const u = r ?? new f(2);
    return u[0] = Math.min(n, Math.max(o, e[0])), u[1] = Math.min(n, Math.max(o, e[1])), u;
  }
  function G(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] + o[0], r[1] = e[1] + o[1], r;
  }
  function B(e, o, n, r) {
    const u = r ?? new f(2);
    return u[0] = e[0] + o[0] * n, u[1] = e[1] + o[1] * n, u;
  }
  function Z(e, o) {
    const n = e[0], r = e[1], u = o[0], g = o[1], y = Math.sqrt(n * n + r * r), c = Math.sqrt(u * u + g * g), a = y * c, h = a && C(e, o) / a;
    return Math.acos(h);
  }
  function N(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] - o[0], r[1] = e[1] - o[1], r;
  }
  const ie = N;
  function re(e, o) {
    return Math.abs(e[0] - o[0]) < k && Math.abs(e[1] - o[1]) < k;
  }
  function fe(e, o) {
    return e[0] === o[0] && e[1] === o[1];
  }
  function ue(e, o, n, r) {
    const u = r ?? new f(2);
    return u[0] = e[0] + n * (o[0] - e[0]), u[1] = e[1] + n * (o[1] - e[1]), u;
  }
  function ae(e, o, n, r) {
    const u = r ?? new f(2);
    return u[0] = e[0] + n[0] * (o[0] - e[0]), u[1] = e[1] + n[1] * (o[1] - e[1]), u;
  }
  function se(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = Math.max(e[0], o[0]), r[1] = Math.max(e[1], o[1]), r;
  }
  function Q(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = Math.min(e[0], o[0]), r[1] = Math.min(e[1], o[1]), r;
  }
  function H(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] * o, r[1] = e[1] * o, r;
  }
  const L = H;
  function oe(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] / o, r[1] = e[1] / o, r;
  }
  function ne(e, o) {
    const n = o ?? new f(2);
    return n[0] = 1 / e[0], n[1] = 1 / e[1], n;
  }
  const J = ne;
  function j(e, o, n) {
    const r = n ?? new f(3), u = e[0] * o[1] - e[1] * o[0];
    return r[0] = 0, r[1] = 0, r[2] = u, r;
  }
  function C(e, o) {
    return e[0] * o[0] + e[1] * o[1];
  }
  function te(e) {
    const o = e[0], n = e[1];
    return Math.sqrt(o * o + n * n);
  }
  const xe = te;
  function Y(e) {
    const o = e[0], n = e[1];
    return o * o + n * n;
  }
  const W = Y;
  function X(e, o) {
    const n = e[0] - o[0], r = e[1] - o[1];
    return Math.sqrt(n * n + r * r);
  }
  const Be = X;
  function q(e, o) {
    const n = e[0] - o[0], r = e[1] - o[1];
    return n * n + r * r;
  }
  const me = q;
  function de(e, o) {
    const n = o ?? new f(2), r = e[0], u = e[1], g = Math.sqrt(r * r + u * u);
    return g > 1e-5 ? (n[0] = r / g, n[1] = u / g) : (n[0] = 0, n[1] = 0), n;
  }
  function Ge(e, o) {
    const n = o ?? new f(2);
    return n[0] = -e[0], n[1] = -e[1], n;
  }
  function K(e, o) {
    const n = o ?? new f(2);
    return n[0] = e[0], n[1] = e[1], n;
  }
  const pe = K;
  function le(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] * o[0], r[1] = e[1] * o[1], r;
  }
  const ve = le;
  function A(e, o, n) {
    const r = n ?? new f(2);
    return r[0] = e[0] / o[0], r[1] = e[1] / o[1], r;
  }
  const $ = A;
  function ee(e = 1, o) {
    const n = o ?? new f(2), r = Math.random() * 2 * Math.PI;
    return n[0] = Math.cos(r) * e, n[1] = Math.sin(r) * e, n;
  }
  function i(e) {
    const o = e ?? new f(2);
    return o[0] = 0, o[1] = 0, o;
  }
  function d(e, o, n) {
    const r = n ?? new f(2), u = e[0], g = e[1];
    return r[0] = u * o[0] + g * o[4] + o[12], r[1] = u * o[1] + g * o[5] + o[13], r;
  }
  function t(e, o, n) {
    const r = n ?? new f(2), u = e[0], g = e[1];
    return r[0] = o[0] * u + o[4] * g + o[8], r[1] = o[1] * u + o[5] * g + o[9], r;
  }
  function s(e, o, n, r) {
    const u = r ?? new f(2), g = e[0] - o[0], y = e[1] - o[1], c = Math.sin(n), a = Math.cos(n);
    return u[0] = g * a - y * c + o[0], u[1] = g * c + y * a + o[1], u;
  }
  function l(e, o, n) {
    const r = n ?? new f(2);
    return de(e, r), H(r, o, r);
  }
  function p(e, o, n) {
    const r = n ?? new f(2);
    return te(e) > o ? l(e, o, r) : K(e, r);
  }
  function w(e, o, n) {
    const r = n ?? new f(2);
    return ue(e, o, 0.5, r);
  }
  return {
    create: v,
    fromValues: M,
    set: T,
    ceil: U,
    floor: b,
    round: F,
    clamp: R,
    add: G,
    addScaled: B,
    angle: Z,
    subtract: N,
    sub: ie,
    equalsApproximately: re,
    equals: fe,
    lerp: ue,
    lerpV: ae,
    max: se,
    min: Q,
    mulScalar: H,
    scale: L,
    divScalar: oe,
    inverse: ne,
    invert: J,
    cross: j,
    dot: C,
    length: te,
    len: xe,
    lengthSq: Y,
    lenSq: W,
    distance: X,
    dist: Be,
    distanceSq: q,
    distSq: me,
    normalize: de,
    negate: Ge,
    copy: K,
    clone: pe,
    multiply: le,
    mul: ve,
    divide: A,
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
const Je = /* @__PURE__ */ new Map();
function sn(f) {
  let v = Je.get(f);
  return v || (v = ln(f), Je.set(f, v)), v;
}
function fn(f) {
  function v(c, a, h) {
    const x = new f(3);
    return c !== void 0 && (x[0] = c, a !== void 0 && (x[1] = a, h !== void 0 && (x[2] = h))), x;
  }
  const M = v;
  function T(c, a, h, x) {
    const m = x ?? new f(3);
    return m[0] = c, m[1] = a, m[2] = h, m;
  }
  function U(c, a) {
    const h = a ?? new f(3);
    return h[0] = Math.ceil(c[0]), h[1] = Math.ceil(c[1]), h[2] = Math.ceil(c[2]), h;
  }
  function b(c, a) {
    const h = a ?? new f(3);
    return h[0] = Math.floor(c[0]), h[1] = Math.floor(c[1]), h[2] = Math.floor(c[2]), h;
  }
  function F(c, a) {
    const h = a ?? new f(3);
    return h[0] = Math.round(c[0]), h[1] = Math.round(c[1]), h[2] = Math.round(c[2]), h;
  }
  function R(c, a = 0, h = 1, x) {
    const m = x ?? new f(3);
    return m[0] = Math.min(h, Math.max(a, c[0])), m[1] = Math.min(h, Math.max(a, c[1])), m[2] = Math.min(h, Math.max(a, c[2])), m;
  }
  function G(c, a, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] + a[0], x[1] = c[1] + a[1], x[2] = c[2] + a[2], x;
  }
  function B(c, a, h, x) {
    const m = x ?? new f(3);
    return m[0] = c[0] + a[0] * h, m[1] = c[1] + a[1] * h, m[2] = c[2] + a[2] * h, m;
  }
  function Z(c, a) {
    const h = c[0], x = c[1], m = c[2], P = a[0], D = a[1], V = a[2], I = Math.sqrt(h * h + x * x + m * m), S = Math.sqrt(P * P + D * D + V * V), _ = I * S, O = _ && C(c, a) / _;
    return Math.acos(O);
  }
  function N(c, a, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] - a[0], x[1] = c[1] - a[1], x[2] = c[2] - a[2], x;
  }
  const ie = N;
  function re(c, a) {
    return Math.abs(c[0] - a[0]) < k && Math.abs(c[1] - a[1]) < k && Math.abs(c[2] - a[2]) < k;
  }
  function fe(c, a) {
    return c[0] === a[0] && c[1] === a[1] && c[2] === a[2];
  }
  function ue(c, a, h, x) {
    const m = x ?? new f(3);
    return m[0] = c[0] + h * (a[0] - c[0]), m[1] = c[1] + h * (a[1] - c[1]), m[2] = c[2] + h * (a[2] - c[2]), m;
  }
  function ae(c, a, h, x) {
    const m = x ?? new f(3);
    return m[0] = c[0] + h[0] * (a[0] - c[0]), m[1] = c[1] + h[1] * (a[1] - c[1]), m[2] = c[2] + h[2] * (a[2] - c[2]), m;
  }
  function se(c, a, h) {
    const x = h ?? new f(3);
    return x[0] = Math.max(c[0], a[0]), x[1] = Math.max(c[1], a[1]), x[2] = Math.max(c[2], a[2]), x;
  }
  function Q(c, a, h) {
    const x = h ?? new f(3);
    return x[0] = Math.min(c[0], a[0]), x[1] = Math.min(c[1], a[1]), x[2] = Math.min(c[2], a[2]), x;
  }
  function H(c, a, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] * a, x[1] = c[1] * a, x[2] = c[2] * a, x;
  }
  const L = H;
  function oe(c, a, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] / a, x[1] = c[1] / a, x[2] = c[2] / a, x;
  }
  function ne(c, a) {
    const h = a ?? new f(3);
    return h[0] = 1 / c[0], h[1] = 1 / c[1], h[2] = 1 / c[2], h;
  }
  const J = ne;
  function j(c, a, h) {
    const x = h ?? new f(3), m = c[2] * a[0] - c[0] * a[2], P = c[0] * a[1] - c[1] * a[0];
    return x[0] = c[1] * a[2] - c[2] * a[1], x[1] = m, x[2] = P, x;
  }
  function C(c, a) {
    return c[0] * a[0] + c[1] * a[1] + c[2] * a[2];
  }
  function te(c) {
    const a = c[0], h = c[1], x = c[2];
    return Math.sqrt(a * a + h * h + x * x);
  }
  const xe = te;
  function Y(c) {
    const a = c[0], h = c[1], x = c[2];
    return a * a + h * h + x * x;
  }
  const W = Y;
  function X(c, a) {
    const h = c[0] - a[0], x = c[1] - a[1], m = c[2] - a[2];
    return Math.sqrt(h * h + x * x + m * m);
  }
  const Be = X;
  function q(c, a) {
    const h = c[0] - a[0], x = c[1] - a[1], m = c[2] - a[2];
    return h * h + x * x + m * m;
  }
  const me = q;
  function de(c, a) {
    const h = a ?? new f(3), x = c[0], m = c[1], P = c[2], D = Math.sqrt(x * x + m * m + P * P);
    return D > 1e-5 ? (h[0] = x / D, h[1] = m / D, h[2] = P / D) : (h[0] = 0, h[1] = 0, h[2] = 0), h;
  }
  function Ge(c, a) {
    const h = a ?? new f(3);
    return h[0] = -c[0], h[1] = -c[1], h[2] = -c[2], h;
  }
  function K(c, a) {
    const h = a ?? new f(3);
    return h[0] = c[0], h[1] = c[1], h[2] = c[2], h;
  }
  const pe = K;
  function le(c, a, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] * a[0], x[1] = c[1] * a[1], x[2] = c[2] * a[2], x;
  }
  const ve = le;
  function A(c, a, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] / a[0], x[1] = c[1] / a[1], x[2] = c[2] / a[2], x;
  }
  const $ = A;
  function ee(c = 1, a) {
    const h = a ?? new f(3), x = Math.random() * 2 * Math.PI, m = Math.random() * 2 - 1, P = Math.sqrt(1 - m * m) * c;
    return h[0] = Math.cos(x) * P, h[1] = Math.sin(x) * P, h[2] = m * c, h;
  }
  function i(c) {
    const a = c ?? new f(3);
    return a[0] = 0, a[1] = 0, a[2] = 0, a;
  }
  function d(c, a, h) {
    const x = h ?? new f(3), m = c[0], P = c[1], D = c[2], V = a[3] * m + a[7] * P + a[11] * D + a[15] || 1;
    return x[0] = (a[0] * m + a[4] * P + a[8] * D + a[12]) / V, x[1] = (a[1] * m + a[5] * P + a[9] * D + a[13]) / V, x[2] = (a[2] * m + a[6] * P + a[10] * D + a[14]) / V, x;
  }
  function t(c, a, h) {
    const x = h ?? new f(3), m = c[0], P = c[1], D = c[2];
    return x[0] = m * a[0 * 4 + 0] + P * a[1 * 4 + 0] + D * a[2 * 4 + 0], x[1] = m * a[0 * 4 + 1] + P * a[1 * 4 + 1] + D * a[2 * 4 + 1], x[2] = m * a[0 * 4 + 2] + P * a[1 * 4 + 2] + D * a[2 * 4 + 2], x;
  }
  function s(c, a, h) {
    const x = h ?? new f(3), m = c[0], P = c[1], D = c[2];
    return x[0] = m * a[0] + P * a[4] + D * a[8], x[1] = m * a[1] + P * a[5] + D * a[9], x[2] = m * a[2] + P * a[6] + D * a[10], x;
  }
  function l(c, a, h) {
    const x = h ?? new f(3), m = a[0], P = a[1], D = a[2], V = a[3] * 2, I = c[0], S = c[1], _ = c[2], O = P * _ - D * S, E = D * I - m * _, ce = m * S - P * I;
    return x[0] = I + O * V + (P * ce - D * E) * 2, x[1] = S + E * V + (D * O - m * ce) * 2, x[2] = _ + ce * V + (m * E - P * O) * 2, x;
  }
  function p(c, a) {
    const h = a ?? new f(3);
    return h[0] = c[12], h[1] = c[13], h[2] = c[14], h;
  }
  function w(c, a, h) {
    const x = h ?? new f(3), m = a * 4;
    return x[0] = c[m + 0], x[1] = c[m + 1], x[2] = c[m + 2], x;
  }
  function e(c, a) {
    const h = a ?? new f(3), x = c[0], m = c[1], P = c[2], D = c[4], V = c[5], I = c[6], S = c[8], _ = c[9], O = c[10];
    return h[0] = Math.sqrt(x * x + m * m + P * P), h[1] = Math.sqrt(D * D + V * V + I * I), h[2] = Math.sqrt(S * S + _ * _ + O * O), h;
  }
  function o(c, a, h, x) {
    const m = x ?? new f(3), P = [], D = [];
    return P[0] = c[0] - a[0], P[1] = c[1] - a[1], P[2] = c[2] - a[2], D[0] = P[0], D[1] = P[1] * Math.cos(h) - P[2] * Math.sin(h), D[2] = P[1] * Math.sin(h) + P[2] * Math.cos(h), m[0] = D[0] + a[0], m[1] = D[1] + a[1], m[2] = D[2] + a[2], m;
  }
  function n(c, a, h, x) {
    const m = x ?? new f(3), P = [], D = [];
    return P[0] = c[0] - a[0], P[1] = c[1] - a[1], P[2] = c[2] - a[2], D[0] = P[2] * Math.sin(h) + P[0] * Math.cos(h), D[1] = P[1], D[2] = P[2] * Math.cos(h) - P[0] * Math.sin(h), m[0] = D[0] + a[0], m[1] = D[1] + a[1], m[2] = D[2] + a[2], m;
  }
  function r(c, a, h, x) {
    const m = x ?? new f(3), P = [], D = [];
    return P[0] = c[0] - a[0], P[1] = c[1] - a[1], P[2] = c[2] - a[2], D[0] = P[0] * Math.cos(h) - P[1] * Math.sin(h), D[1] = P[0] * Math.sin(h) + P[1] * Math.cos(h), D[2] = P[2], m[0] = D[0] + a[0], m[1] = D[1] + a[1], m[2] = D[2] + a[2], m;
  }
  function u(c, a, h) {
    const x = h ?? new f(3);
    return de(c, x), H(x, a, x);
  }
  function g(c, a, h) {
    const x = h ?? new f(3);
    return te(c) > a ? u(c, a, x) : K(c, x);
  }
  function y(c, a, h) {
    const x = h ?? new f(3);
    return ue(c, a, 0.5, x);
  }
  return {
    create: v,
    fromValues: M,
    set: T,
    ceil: U,
    floor: b,
    round: F,
    clamp: R,
    add: G,
    addScaled: B,
    angle: Z,
    subtract: N,
    sub: ie,
    equalsApproximately: re,
    equals: fe,
    lerp: ue,
    lerpV: ae,
    max: se,
    min: Q,
    mulScalar: H,
    scale: L,
    divScalar: oe,
    inverse: ne,
    invert: J,
    cross: j,
    dot: C,
    length: te,
    len: xe,
    lengthSq: Y,
    lenSq: W,
    distance: X,
    dist: Be,
    distanceSq: q,
    distSq: me,
    normalize: de,
    negate: Ge,
    copy: K,
    clone: pe,
    multiply: le,
    mul: ve,
    divide: A,
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
    setLength: u,
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
  const v = sn(f), M = Ne(f);
  function T(i, d, t, s, l, p, w, e, o) {
    const n = new f(12);
    return n[3] = 0, n[7] = 0, n[11] = 0, i !== void 0 && (n[0] = i, d !== void 0 && (n[1] = d, t !== void 0 && (n[2] = t, s !== void 0 && (n[4] = s, l !== void 0 && (n[5] = l, p !== void 0 && (n[6] = p, w !== void 0 && (n[8] = w, e !== void 0 && (n[9] = e, o !== void 0 && (n[10] = o))))))))), n;
  }
  function U(i, d, t, s, l, p, w, e, o, n) {
    const r = n ?? new f(12);
    return r[0] = i, r[1] = d, r[2] = t, r[3] = 0, r[4] = s, r[5] = l, r[6] = p, r[7] = 0, r[8] = w, r[9] = e, r[10] = o, r[11] = 0, r;
  }
  function b(i, d) {
    const t = d ?? new f(12);
    return t[0] = i[0], t[1] = i[1], t[2] = i[2], t[3] = 0, t[4] = i[4], t[5] = i[5], t[6] = i[6], t[7] = 0, t[8] = i[8], t[9] = i[9], t[10] = i[10], t[11] = 0, t;
  }
  function F(i, d) {
    const t = d ?? new f(12), s = i[0], l = i[1], p = i[2], w = i[3], e = s + s, o = l + l, n = p + p, r = s * e, u = l * e, g = l * o, y = p * e, c = p * o, a = p * n, h = w * e, x = w * o, m = w * n;
    return t[0] = 1 - g - a, t[1] = u + m, t[2] = y - x, t[3] = 0, t[4] = u - m, t[5] = 1 - r - a, t[6] = c + h, t[7] = 0, t[8] = y + x, t[9] = c - h, t[10] = 1 - r - g, t[11] = 0, t;
  }
  function R(i, d) {
    const t = d ?? new f(12);
    return t[0] = -i[0], t[1] = -i[1], t[2] = -i[2], t[4] = -i[4], t[5] = -i[5], t[6] = -i[6], t[8] = -i[8], t[9] = -i[9], t[10] = -i[10], t;
  }
  function G(i, d) {
    const t = d ?? new f(12);
    return t[0] = i[0], t[1] = i[1], t[2] = i[2], t[4] = i[4], t[5] = i[5], t[6] = i[6], t[8] = i[8], t[9] = i[9], t[10] = i[10], t;
  }
  const B = G;
  function Z(i, d) {
    return Math.abs(i[0] - d[0]) < k && Math.abs(i[1] - d[1]) < k && Math.abs(i[2] - d[2]) < k && Math.abs(i[4] - d[4]) < k && Math.abs(i[5] - d[5]) < k && Math.abs(i[6] - d[6]) < k && Math.abs(i[8] - d[8]) < k && Math.abs(i[9] - d[9]) < k && Math.abs(i[10] - d[10]) < k;
  }
  function N(i, d) {
    return i[0] === d[0] && i[1] === d[1] && i[2] === d[2] && i[4] === d[4] && i[5] === d[5] && i[6] === d[6] && i[8] === d[8] && i[9] === d[9] && i[10] === d[10];
  }
  function ie(i) {
    const d = i ?? new f(12);
    return d[0] = 1, d[1] = 0, d[2] = 0, d[4] = 0, d[5] = 1, d[6] = 0, d[8] = 0, d[9] = 0, d[10] = 1, d;
  }
  function re(i, d) {
    const t = d ?? new f(12);
    if (t === i) {
      let g;
      return g = i[1], i[1] = i[4], i[4] = g, g = i[2], i[2] = i[8], i[8] = g, g = i[6], i[6] = i[9], i[9] = g, t;
    }
    const s = i[0 * 4 + 0], l = i[0 * 4 + 1], p = i[0 * 4 + 2], w = i[1 * 4 + 0], e = i[1 * 4 + 1], o = i[1 * 4 + 2], n = i[2 * 4 + 0], r = i[2 * 4 + 1], u = i[2 * 4 + 2];
    return t[0] = s, t[1] = w, t[2] = n, t[4] = l, t[5] = e, t[6] = r, t[8] = p, t[9] = o, t[10] = u, t;
  }
  function fe(i, d) {
    const t = d ?? new f(12), s = i[0 * 4 + 0], l = i[0 * 4 + 1], p = i[0 * 4 + 2], w = i[1 * 4 + 0], e = i[1 * 4 + 1], o = i[1 * 4 + 2], n = i[2 * 4 + 0], r = i[2 * 4 + 1], u = i[2 * 4 + 2], g = u * e - o * r, y = -u * w + o * n, c = r * w - e * n, a = 1 / (s * g + l * y + p * c);
    return t[0] = g * a, t[1] = (-u * l + p * r) * a, t[2] = (o * l - p * e) * a, t[4] = y * a, t[5] = (u * s - p * n) * a, t[6] = (-o * s + p * w) * a, t[8] = c * a, t[9] = (-r * s + l * n) * a, t[10] = (e * s - l * w) * a, t;
  }
  function ue(i) {
    const d = i[0], t = i[0 * 4 + 1], s = i[0 * 4 + 2], l = i[1 * 4 + 0], p = i[1 * 4 + 1], w = i[1 * 4 + 2], e = i[2 * 4 + 0], o = i[2 * 4 + 1], n = i[2 * 4 + 2];
    return d * (p * n - o * w) - l * (t * n - o * s) + e * (t * w - p * s);
  }
  const ae = fe;
  function se(i, d, t) {
    const s = t ?? new f(12), l = i[0], p = i[1], w = i[2], e = i[4], o = i[5], n = i[6], r = i[8], u = i[9], g = i[10], y = d[0], c = d[1], a = d[2], h = d[4], x = d[5], m = d[6], P = d[8], D = d[9], V = d[10];
    return s[0] = l * y + e * c + r * a, s[1] = p * y + o * c + u * a, s[2] = w * y + n * c + g * a, s[4] = l * h + e * x + r * m, s[5] = p * h + o * x + u * m, s[6] = w * h + n * x + g * m, s[8] = l * P + e * D + r * V, s[9] = p * P + o * D + u * V, s[10] = w * P + n * D + g * V, s;
  }
  const Q = se;
  function H(i, d, t) {
    const s = t ?? ie();
    return i !== s && (s[0] = i[0], s[1] = i[1], s[2] = i[2], s[4] = i[4], s[5] = i[5], s[6] = i[6]), s[8] = d[0], s[9] = d[1], s[10] = 1, s;
  }
  function L(i, d) {
    const t = d ?? v.create();
    return t[0] = i[8], t[1] = i[9], t;
  }
  function oe(i, d, t) {
    const s = t ?? v.create(), l = d * 4;
    return s[0] = i[l + 0], s[1] = i[l + 1], s;
  }
  function ne(i, d, t, s) {
    const l = s === i ? i : G(i, s), p = t * 4;
    return l[p + 0] = d[0], l[p + 1] = d[1], l;
  }
  function J(i, d) {
    const t = d ?? v.create(), s = i[0], l = i[1], p = i[4], w = i[5];
    return t[0] = Math.sqrt(s * s + l * l), t[1] = Math.sqrt(p * p + w * w), t;
  }
  function j(i, d) {
    const t = d ?? M.create(), s = i[0], l = i[1], p = i[2], w = i[4], e = i[5], o = i[6], n = i[8], r = i[9], u = i[10];
    return t[0] = Math.sqrt(s * s + l * l + p * p), t[1] = Math.sqrt(w * w + e * e + o * o), t[2] = Math.sqrt(n * n + r * r + u * u), t;
  }
  function C(i, d) {
    const t = d ?? new f(12);
    return t[0] = 1, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[8] = i[0], t[9] = i[1], t[10] = 1, t;
  }
  function te(i, d, t) {
    const s = t ?? new f(12), l = d[0], p = d[1], w = i[0], e = i[1], o = i[2], n = i[1 * 4 + 0], r = i[1 * 4 + 1], u = i[1 * 4 + 2], g = i[2 * 4 + 0], y = i[2 * 4 + 1], c = i[2 * 4 + 2];
    return i !== s && (s[0] = w, s[1] = e, s[2] = o, s[4] = n, s[5] = r, s[6] = u), s[8] = w * l + n * p + g, s[9] = e * l + r * p + y, s[10] = o * l + u * p + c, s;
  }
  function xe(i, d) {
    const t = d ?? new f(12), s = Math.cos(i), l = Math.sin(i);
    return t[0] = s, t[1] = l, t[2] = 0, t[4] = -l, t[5] = s, t[6] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t;
  }
  function Y(i, d, t) {
    const s = t ?? new f(12), l = i[0 * 4 + 0], p = i[0 * 4 + 1], w = i[0 * 4 + 2], e = i[1 * 4 + 0], o = i[1 * 4 + 1], n = i[1 * 4 + 2], r = Math.cos(d), u = Math.sin(d);
    return s[0] = r * l + u * e, s[1] = r * p + u * o, s[2] = r * w + u * n, s[4] = r * e - u * l, s[5] = r * o - u * p, s[6] = r * n - u * w, i !== s && (s[8] = i[8], s[9] = i[9], s[10] = i[10]), s;
  }
  function W(i, d) {
    const t = d ?? new f(12), s = Math.cos(i), l = Math.sin(i);
    return t[0] = 1, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = s, t[6] = l, t[8] = 0, t[9] = -l, t[10] = s, t;
  }
  function X(i, d, t) {
    const s = t ?? new f(12), l = i[4], p = i[5], w = i[6], e = i[8], o = i[9], n = i[10], r = Math.cos(d), u = Math.sin(d);
    return s[4] = r * l + u * e, s[5] = r * p + u * o, s[6] = r * w + u * n, s[8] = r * e - u * l, s[9] = r * o - u * p, s[10] = r * n - u * w, i !== s && (s[0] = i[0], s[1] = i[1], s[2] = i[2]), s;
  }
  function Be(i, d) {
    const t = d ?? new f(12), s = Math.cos(i), l = Math.sin(i);
    return t[0] = s, t[1] = 0, t[2] = -l, t[4] = 0, t[5] = 1, t[6] = 0, t[8] = l, t[9] = 0, t[10] = s, t;
  }
  function q(i, d, t) {
    const s = t ?? new f(12), l = i[0 * 4 + 0], p = i[0 * 4 + 1], w = i[0 * 4 + 2], e = i[2 * 4 + 0], o = i[2 * 4 + 1], n = i[2 * 4 + 2], r = Math.cos(d), u = Math.sin(d);
    return s[0] = r * l - u * e, s[1] = r * p - u * o, s[2] = r * w - u * n, s[8] = r * e + u * l, s[9] = r * o + u * p, s[10] = r * n + u * w, i !== s && (s[4] = i[4], s[5] = i[5], s[6] = i[6]), s;
  }
  const me = xe, de = Y;
  function Ge(i, d) {
    const t = d ?? new f(12);
    return t[0] = i[0], t[1] = 0, t[2] = 0, t[4] = 0, t[5] = i[1], t[6] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t;
  }
  function K(i, d, t) {
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
  function A(i, d, t) {
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
    create: T,
    set: U,
    fromMat4: b,
    fromQuat: F,
    negate: R,
    copy: G,
    equalsApproximately: Z,
    equals: N,
    identity: ie,
    transpose: re,
    inverse: fe,
    invert: ae,
    determinant: ue,
    mul: Q,
    multiply: se,
    setTranslation: H,
    getTranslation: L,
    getAxis: oe,
    setAxis: ne,
    getScaling: J,
    get3DScaling: j,
    translation: C,
    translate: te,
    rotation: xe,
    rotate: Y,
    rotationX: W,
    rotateX: X,
    rotationY: Be,
    rotateY: q,
    rotationZ: me,
    rotateZ: de,
    scaling: Ge,
    scale: K,
    uniformScaling: ve,
    uniformScale: A,
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
  const v = Ne(f);
  function M(e, o, n, r, u, g, y, c, a, h, x, m, P, D, V, I) {
    const S = new f(16);
    return e !== void 0 && (S[0] = e, o !== void 0 && (S[1] = o, n !== void 0 && (S[2] = n, r !== void 0 && (S[3] = r, u !== void 0 && (S[4] = u, g !== void 0 && (S[5] = g, y !== void 0 && (S[6] = y, c !== void 0 && (S[7] = c, a !== void 0 && (S[8] = a, h !== void 0 && (S[9] = h, x !== void 0 && (S[10] = x, m !== void 0 && (S[11] = m, P !== void 0 && (S[12] = P, D !== void 0 && (S[13] = D, V !== void 0 && (S[14] = V, I !== void 0 && (S[15] = I)))))))))))))))), S;
  }
  function T(e, o, n, r, u, g, y, c, a, h, x, m, P, D, V, I, S) {
    const _ = S ?? new f(16);
    return _[0] = e, _[1] = o, _[2] = n, _[3] = r, _[4] = u, _[5] = g, _[6] = y, _[7] = c, _[8] = a, _[9] = h, _[10] = x, _[11] = m, _[12] = P, _[13] = D, _[14] = V, _[15] = I, _;
  }
  function U(e, o) {
    const n = o ?? new f(16);
    return n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = 0, n[4] = e[4], n[5] = e[5], n[6] = e[6], n[7] = 0, n[8] = e[8], n[9] = e[9], n[10] = e[10], n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function b(e, o) {
    const n = o ?? new f(16), r = e[0], u = e[1], g = e[2], y = e[3], c = r + r, a = u + u, h = g + g, x = r * c, m = u * c, P = u * a, D = g * c, V = g * a, I = g * h, S = y * c, _ = y * a, O = y * h;
    return n[0] = 1 - P - I, n[1] = m + O, n[2] = D - _, n[3] = 0, n[4] = m - O, n[5] = 1 - x - I, n[6] = V + S, n[7] = 0, n[8] = D + _, n[9] = V - S, n[10] = 1 - x - P, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function F(e, o) {
    const n = o ?? new f(16);
    return n[0] = -e[0], n[1] = -e[1], n[2] = -e[2], n[3] = -e[3], n[4] = -e[4], n[5] = -e[5], n[6] = -e[6], n[7] = -e[7], n[8] = -e[8], n[9] = -e[9], n[10] = -e[10], n[11] = -e[11], n[12] = -e[12], n[13] = -e[13], n[14] = -e[14], n[15] = -e[15], n;
  }
  function R(e, o) {
    const n = o ?? new f(16);
    return n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = e[3], n[4] = e[4], n[5] = e[5], n[6] = e[6], n[7] = e[7], n[8] = e[8], n[9] = e[9], n[10] = e[10], n[11] = e[11], n[12] = e[12], n[13] = e[13], n[14] = e[14], n[15] = e[15], n;
  }
  const G = R;
  function B(e, o) {
    return Math.abs(e[0] - o[0]) < k && Math.abs(e[1] - o[1]) < k && Math.abs(e[2] - o[2]) < k && Math.abs(e[3] - o[3]) < k && Math.abs(e[4] - o[4]) < k && Math.abs(e[5] - o[5]) < k && Math.abs(e[6] - o[6]) < k && Math.abs(e[7] - o[7]) < k && Math.abs(e[8] - o[8]) < k && Math.abs(e[9] - o[9]) < k && Math.abs(e[10] - o[10]) < k && Math.abs(e[11] - o[11]) < k && Math.abs(e[12] - o[12]) < k && Math.abs(e[13] - o[13]) < k && Math.abs(e[14] - o[14]) < k && Math.abs(e[15] - o[15]) < k;
  }
  function Z(e, o) {
    return e[0] === o[0] && e[1] === o[1] && e[2] === o[2] && e[3] === o[3] && e[4] === o[4] && e[5] === o[5] && e[6] === o[6] && e[7] === o[7] && e[8] === o[8] && e[9] === o[9] && e[10] === o[10] && e[11] === o[11] && e[12] === o[12] && e[13] === o[13] && e[14] === o[14] && e[15] === o[15];
  }
  function N(e) {
    const o = e ?? new f(16);
    return o[0] = 1, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = 1, o[6] = 0, o[7] = 0, o[8] = 0, o[9] = 0, o[10] = 1, o[11] = 0, o[12] = 0, o[13] = 0, o[14] = 0, o[15] = 1, o;
  }
  function ie(e, o) {
    const n = o ?? new f(16);
    if (n === e) {
      let E;
      return E = e[1], e[1] = e[4], e[4] = E, E = e[2], e[2] = e[8], e[8] = E, E = e[3], e[3] = e[12], e[12] = E, E = e[6], e[6] = e[9], e[9] = E, E = e[7], e[7] = e[13], e[13] = E, E = e[11], e[11] = e[14], e[14] = E, n;
    }
    const r = e[0 * 4 + 0], u = e[0 * 4 + 1], g = e[0 * 4 + 2], y = e[0 * 4 + 3], c = e[1 * 4 + 0], a = e[1 * 4 + 1], h = e[1 * 4 + 2], x = e[1 * 4 + 3], m = e[2 * 4 + 0], P = e[2 * 4 + 1], D = e[2 * 4 + 2], V = e[2 * 4 + 3], I = e[3 * 4 + 0], S = e[3 * 4 + 1], _ = e[3 * 4 + 2], O = e[3 * 4 + 3];
    return n[0] = r, n[1] = c, n[2] = m, n[3] = I, n[4] = u, n[5] = a, n[6] = P, n[7] = S, n[8] = g, n[9] = h, n[10] = D, n[11] = _, n[12] = y, n[13] = x, n[14] = V, n[15] = O, n;
  }
  function re(e, o) {
    const n = o ?? new f(16), r = e[0 * 4 + 0], u = e[0 * 4 + 1], g = e[0 * 4 + 2], y = e[0 * 4 + 3], c = e[1 * 4 + 0], a = e[1 * 4 + 1], h = e[1 * 4 + 2], x = e[1 * 4 + 3], m = e[2 * 4 + 0], P = e[2 * 4 + 1], D = e[2 * 4 + 2], V = e[2 * 4 + 3], I = e[3 * 4 + 0], S = e[3 * 4 + 1], _ = e[3 * 4 + 2], O = e[3 * 4 + 3], E = D * O, ce = _ * V, he = h * O, ge = _ * x, we = h * V, ye = D * x, Pe = g * O, De = _ * y, Me = g * V, ze = D * y, Te = g * x, Se = h * y, Ve = m * S, _e = I * P, Fe = c * S, Ue = I * a, Ie = c * P, ke = m * a, Oe = r * S, Le = I * u, qe = r * P, He = m * u, We = r * a, Ee = c * u, Ce = E * a + ge * P + we * S - (ce * a + he * P + ye * S), Ze = ce * u + Pe * P + ze * S - (E * u + De * P + Me * S), $e = he * u + De * a + Te * S - (ge * u + Pe * a + Se * S), Qe = ye * u + Me * a + Se * P - (we * u + ze * a + Te * P), be = 1 / (r * Ce + c * Ze + m * $e + I * Qe);
    return n[0] = be * Ce, n[1] = be * Ze, n[2] = be * $e, n[3] = be * Qe, n[4] = be * (ce * c + he * m + ye * I - (E * c + ge * m + we * I)), n[5] = be * (E * r + De * m + Me * I - (ce * r + Pe * m + ze * I)), n[6] = be * (ge * r + Pe * c + Se * I - (he * r + De * c + Te * I)), n[7] = be * (we * r + ze * c + Te * m - (ye * r + Me * c + Se * m)), n[8] = be * (Ve * x + Ue * V + Ie * O - (_e * x + Fe * V + ke * O)), n[9] = be * (_e * y + Oe * V + He * O - (Ve * y + Le * V + qe * O)), n[10] = be * (Fe * y + Le * x + We * O - (Ue * y + Oe * x + Ee * O)), n[11] = be * (ke * y + qe * x + Ee * V - (Ie * y + He * x + We * V)), n[12] = be * (Fe * D + ke * _ + _e * h - (Ie * _ + Ve * h + Ue * D)), n[13] = be * (qe * _ + Ve * g + Le * D - (Oe * D + He * _ + _e * g)), n[14] = be * (Oe * h + Ee * _ + Ue * g - (We * _ + Fe * g + Le * h)), n[15] = be * (We * D + Ie * g + He * h - (qe * h + Ee * D + ke * g)), n;
  }
  function fe(e) {
    const o = e[0], n = e[0 * 4 + 1], r = e[0 * 4 + 2], u = e[0 * 4 + 3], g = e[1 * 4 + 0], y = e[1 * 4 + 1], c = e[1 * 4 + 2], a = e[1 * 4 + 3], h = e[2 * 4 + 0], x = e[2 * 4 + 1], m = e[2 * 4 + 2], P = e[2 * 4 + 3], D = e[3 * 4 + 0], V = e[3 * 4 + 1], I = e[3 * 4 + 2], S = e[3 * 4 + 3], _ = m * S, O = I * P, E = c * S, ce = I * a, he = c * P, ge = m * a, we = r * S, ye = I * u, Pe = r * P, De = m * u, Me = r * a, ze = c * u, Te = _ * y + ce * x + he * V - (O * y + E * x + ge * V), Se = O * n + we * x + De * V - (_ * n + ye * x + Pe * V), Ve = E * n + ye * y + Me * V - (ce * n + we * y + ze * V), _e = ge * n + Pe * y + ze * x - (he * n + De * y + Me * x);
    return o * Te + g * Se + h * Ve + D * _e;
  }
  const ue = re;
  function ae(e, o, n) {
    const r = n ?? new f(16), u = e[0], g = e[1], y = e[2], c = e[3], a = e[4], h = e[5], x = e[6], m = e[7], P = e[8], D = e[9], V = e[10], I = e[11], S = e[12], _ = e[13], O = e[14], E = e[15], ce = o[0], he = o[1], ge = o[2], we = o[3], ye = o[4], Pe = o[5], De = o[6], Me = o[7], ze = o[8], Te = o[9], Se = o[10], Ve = o[11], _e = o[12], Fe = o[13], Ue = o[14], Ie = o[15];
    return r[0] = u * ce + a * he + P * ge + S * we, r[1] = g * ce + h * he + D * ge + _ * we, r[2] = y * ce + x * he + V * ge + O * we, r[3] = c * ce + m * he + I * ge + E * we, r[4] = u * ye + a * Pe + P * De + S * Me, r[5] = g * ye + h * Pe + D * De + _ * Me, r[6] = y * ye + x * Pe + V * De + O * Me, r[7] = c * ye + m * Pe + I * De + E * Me, r[8] = u * ze + a * Te + P * Se + S * Ve, r[9] = g * ze + h * Te + D * Se + _ * Ve, r[10] = y * ze + x * Te + V * Se + O * Ve, r[11] = c * ze + m * Te + I * Se + E * Ve, r[12] = u * _e + a * Fe + P * Ue + S * Ie, r[13] = g * _e + h * Fe + D * Ue + _ * Ie, r[14] = y * _e + x * Fe + V * Ue + O * Ie, r[15] = c * _e + m * Fe + I * Ue + E * Ie, r;
  }
  const se = ae;
  function Q(e, o, n) {
    const r = n ?? N();
    return e !== r && (r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = e[3], r[4] = e[4], r[5] = e[5], r[6] = e[6], r[7] = e[7], r[8] = e[8], r[9] = e[9], r[10] = e[10], r[11] = e[11]), r[12] = o[0], r[13] = o[1], r[14] = o[2], r[15] = 1, r;
  }
  function H(e, o) {
    const n = o ?? v.create();
    return n[0] = e[12], n[1] = e[13], n[2] = e[14], n;
  }
  function L(e, o, n) {
    const r = n ?? v.create(), u = o * 4;
    return r[0] = e[u + 0], r[1] = e[u + 1], r[2] = e[u + 2], r;
  }
  function oe(e, o, n, r) {
    const u = r === e ? r : R(e, r), g = n * 4;
    return u[g + 0] = o[0], u[g + 1] = o[1], u[g + 2] = o[2], u;
  }
  function ne(e, o) {
    const n = o ?? v.create(), r = e[0], u = e[1], g = e[2], y = e[4], c = e[5], a = e[6], h = e[8], x = e[9], m = e[10];
    return n[0] = Math.sqrt(r * r + u * u + g * g), n[1] = Math.sqrt(y * y + c * c + a * a), n[2] = Math.sqrt(h * h + x * x + m * m), n;
  }
  function J(e, o, n, r, u) {
    const g = u ?? new f(16), y = Math.tan(Math.PI * 0.5 - 0.5 * e);
    if (g[0] = y / o, g[1] = 0, g[2] = 0, g[3] = 0, g[4] = 0, g[5] = y, g[6] = 0, g[7] = 0, g[8] = 0, g[9] = 0, g[11] = -1, g[12] = 0, g[13] = 0, g[15] = 0, Number.isFinite(r)) {
      const c = 1 / (n - r);
      g[10] = r * c, g[14] = r * n * c;
    } else
      g[10] = -1, g[14] = -n;
    return g;
  }
  function j(e, o, n, r = 1 / 0, u) {
    const g = u ?? new f(16), y = 1 / Math.tan(e * 0.5);
    if (g[0] = y / o, g[1] = 0, g[2] = 0, g[3] = 0, g[4] = 0, g[5] = y, g[6] = 0, g[7] = 0, g[8] = 0, g[9] = 0, g[11] = -1, g[12] = 0, g[13] = 0, g[15] = 0, r === 1 / 0)
      g[10] = 0, g[14] = n;
    else {
      const c = 1 / (r - n);
      g[10] = n * c, g[14] = r * n * c;
    }
    return g;
  }
  function C(e, o, n, r, u, g, y) {
    const c = y ?? new f(16);
    return c[0] = 2 / (o - e), c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 2 / (r - n), c[6] = 0, c[7] = 0, c[8] = 0, c[9] = 0, c[10] = 1 / (u - g), c[11] = 0, c[12] = (o + e) / (e - o), c[13] = (r + n) / (n - r), c[14] = u / (u - g), c[15] = 1, c;
  }
  function te(e, o, n, r, u, g, y) {
    const c = y ?? new f(16), a = o - e, h = r - n, x = u - g;
    return c[0] = 2 * u / a, c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 2 * u / h, c[6] = 0, c[7] = 0, c[8] = (e + o) / a, c[9] = (r + n) / h, c[10] = g / x, c[11] = -1, c[12] = 0, c[13] = 0, c[14] = u * g / x, c[15] = 0, c;
  }
  function xe(e, o, n, r, u, g = 1 / 0, y) {
    const c = y ?? new f(16), a = o - e, h = r - n;
    if (c[0] = 2 * u / a, c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 2 * u / h, c[6] = 0, c[7] = 0, c[8] = (e + o) / a, c[9] = (r + n) / h, c[11] = -1, c[12] = 0, c[13] = 0, c[15] = 0, g === 1 / 0)
      c[10] = 0, c[14] = u;
    else {
      const x = 1 / (g - u);
      c[10] = u * x, c[14] = g * u * x;
    }
    return c;
  }
  const Y = v.create(), W = v.create(), X = v.create();
  function Be(e, o, n, r) {
    const u = r ?? new f(16);
    return v.normalize(v.subtract(o, e, X), X), v.normalize(v.cross(n, X, Y), Y), v.normalize(v.cross(X, Y, W), W), u[0] = Y[0], u[1] = Y[1], u[2] = Y[2], u[3] = 0, u[4] = W[0], u[5] = W[1], u[6] = W[2], u[7] = 0, u[8] = X[0], u[9] = X[1], u[10] = X[2], u[11] = 0, u[12] = e[0], u[13] = e[1], u[14] = e[2], u[15] = 1, u;
  }
  function q(e, o, n, r) {
    const u = r ?? new f(16);
    return v.normalize(v.subtract(e, o, X), X), v.normalize(v.cross(n, X, Y), Y), v.normalize(v.cross(X, Y, W), W), u[0] = Y[0], u[1] = Y[1], u[2] = Y[2], u[3] = 0, u[4] = W[0], u[5] = W[1], u[6] = W[2], u[7] = 0, u[8] = X[0], u[9] = X[1], u[10] = X[2], u[11] = 0, u[12] = e[0], u[13] = e[1], u[14] = e[2], u[15] = 1, u;
  }
  function me(e, o, n, r) {
    const u = r ?? new f(16);
    return v.normalize(v.subtract(e, o, X), X), v.normalize(v.cross(n, X, Y), Y), v.normalize(v.cross(X, Y, W), W), u[0] = Y[0], u[1] = W[0], u[2] = X[0], u[3] = 0, u[4] = Y[1], u[5] = W[1], u[6] = X[1], u[7] = 0, u[8] = Y[2], u[9] = W[2], u[10] = X[2], u[11] = 0, u[12] = -(Y[0] * e[0] + Y[1] * e[1] + Y[2] * e[2]), u[13] = -(W[0] * e[0] + W[1] * e[1] + W[2] * e[2]), u[14] = -(X[0] * e[0] + X[1] * e[1] + X[2] * e[2]), u[15] = 1, u;
  }
  function de(e, o) {
    const n = o ?? new f(16);
    return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = e[0], n[13] = e[1], n[14] = e[2], n[15] = 1, n;
  }
  function Ge(e, o, n) {
    const r = n ?? new f(16), u = o[0], g = o[1], y = o[2], c = e[0], a = e[1], h = e[2], x = e[3], m = e[1 * 4 + 0], P = e[1 * 4 + 1], D = e[1 * 4 + 2], V = e[1 * 4 + 3], I = e[2 * 4 + 0], S = e[2 * 4 + 1], _ = e[2 * 4 + 2], O = e[2 * 4 + 3], E = e[3 * 4 + 0], ce = e[3 * 4 + 1], he = e[3 * 4 + 2], ge = e[3 * 4 + 3];
    return e !== r && (r[0] = c, r[1] = a, r[2] = h, r[3] = x, r[4] = m, r[5] = P, r[6] = D, r[7] = V, r[8] = I, r[9] = S, r[10] = _, r[11] = O), r[12] = c * u + m * g + I * y + E, r[13] = a * u + P * g + S * y + ce, r[14] = h * u + D * g + _ * y + he, r[15] = x * u + V * g + O * y + ge, r;
  }
  function K(e, o) {
    const n = o ?? new f(16), r = Math.cos(e), u = Math.sin(e);
    return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = r, n[6] = u, n[7] = 0, n[8] = 0, n[9] = -u, n[10] = r, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function pe(e, o, n) {
    const r = n ?? new f(16), u = e[4], g = e[5], y = e[6], c = e[7], a = e[8], h = e[9], x = e[10], m = e[11], P = Math.cos(o), D = Math.sin(o);
    return r[4] = P * u + D * a, r[5] = P * g + D * h, r[6] = P * y + D * x, r[7] = P * c + D * m, r[8] = P * a - D * u, r[9] = P * h - D * g, r[10] = P * x - D * y, r[11] = P * m - D * c, e !== r && (r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = e[3], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15]), r;
  }
  function le(e, o) {
    const n = o ?? new f(16), r = Math.cos(e), u = Math.sin(e);
    return n[0] = r, n[1] = 0, n[2] = -u, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = u, n[9] = 0, n[10] = r, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function ve(e, o, n) {
    const r = n ?? new f(16), u = e[0 * 4 + 0], g = e[0 * 4 + 1], y = e[0 * 4 + 2], c = e[0 * 4 + 3], a = e[2 * 4 + 0], h = e[2 * 4 + 1], x = e[2 * 4 + 2], m = e[2 * 4 + 3], P = Math.cos(o), D = Math.sin(o);
    return r[0] = P * u - D * a, r[1] = P * g - D * h, r[2] = P * y - D * x, r[3] = P * c - D * m, r[8] = P * a + D * u, r[9] = P * h + D * g, r[10] = P * x + D * y, r[11] = P * m + D * c, e !== r && (r[4] = e[4], r[5] = e[5], r[6] = e[6], r[7] = e[7], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15]), r;
  }
  function A(e, o) {
    const n = o ?? new f(16), r = Math.cos(e), u = Math.sin(e);
    return n[0] = r, n[1] = u, n[2] = 0, n[3] = 0, n[4] = -u, n[5] = r, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function $(e, o, n) {
    const r = n ?? new f(16), u = e[0 * 4 + 0], g = e[0 * 4 + 1], y = e[0 * 4 + 2], c = e[0 * 4 + 3], a = e[1 * 4 + 0], h = e[1 * 4 + 1], x = e[1 * 4 + 2], m = e[1 * 4 + 3], P = Math.cos(o), D = Math.sin(o);
    return r[0] = P * u + D * a, r[1] = P * g + D * h, r[2] = P * y + D * x, r[3] = P * c + D * m, r[4] = P * a - D * u, r[5] = P * h - D * g, r[6] = P * x - D * y, r[7] = P * m - D * c, e !== r && (r[8] = e[8], r[9] = e[9], r[10] = e[10], r[11] = e[11], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15]), r;
  }
  function ee(e, o, n) {
    const r = n ?? new f(16);
    let u = e[0], g = e[1], y = e[2];
    const c = Math.sqrt(u * u + g * g + y * y);
    u /= c, g /= c, y /= c;
    const a = u * u, h = g * g, x = y * y, m = Math.cos(o), P = Math.sin(o), D = 1 - m;
    return r[0] = a + (1 - a) * m, r[1] = u * g * D + y * P, r[2] = u * y * D - g * P, r[3] = 0, r[4] = u * g * D - y * P, r[5] = h + (1 - h) * m, r[6] = g * y * D + u * P, r[7] = 0, r[8] = u * y * D + g * P, r[9] = g * y * D - u * P, r[10] = x + (1 - x) * m, r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r;
  }
  const i = ee;
  function d(e, o, n, r) {
    const u = r ?? new f(16);
    let g = o[0], y = o[1], c = o[2];
    const a = Math.sqrt(g * g + y * y + c * c);
    g /= a, y /= a, c /= a;
    const h = g * g, x = y * y, m = c * c, P = Math.cos(n), D = Math.sin(n), V = 1 - P, I = h + (1 - h) * P, S = g * y * V + c * D, _ = g * c * V - y * D, O = g * y * V - c * D, E = x + (1 - x) * P, ce = y * c * V + g * D, he = g * c * V + y * D, ge = y * c * V - g * D, we = m + (1 - m) * P, ye = e[0], Pe = e[1], De = e[2], Me = e[3], ze = e[4], Te = e[5], Se = e[6], Ve = e[7], _e = e[8], Fe = e[9], Ue = e[10], Ie = e[11];
    return u[0] = I * ye + S * ze + _ * _e, u[1] = I * Pe + S * Te + _ * Fe, u[2] = I * De + S * Se + _ * Ue, u[3] = I * Me + S * Ve + _ * Ie, u[4] = O * ye + E * ze + ce * _e, u[5] = O * Pe + E * Te + ce * Fe, u[6] = O * De + E * Se + ce * Ue, u[7] = O * Me + E * Ve + ce * Ie, u[8] = he * ye + ge * ze + we * _e, u[9] = he * Pe + ge * Te + we * Fe, u[10] = he * De + ge * Se + we * Ue, u[11] = he * Me + ge * Ve + we * Ie, e !== u && (u[12] = e[12], u[13] = e[13], u[14] = e[14], u[15] = e[15]), u;
  }
  const t = d;
  function s(e, o) {
    const n = o ?? new f(16);
    return n[0] = e[0], n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = e[1], n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = e[2], n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function l(e, o, n) {
    const r = n ?? new f(16), u = o[0], g = o[1], y = o[2];
    return r[0] = u * e[0 * 4 + 0], r[1] = u * e[0 * 4 + 1], r[2] = u * e[0 * 4 + 2], r[3] = u * e[0 * 4 + 3], r[4] = g * e[1 * 4 + 0], r[5] = g * e[1 * 4 + 1], r[6] = g * e[1 * 4 + 2], r[7] = g * e[1 * 4 + 3], r[8] = y * e[2 * 4 + 0], r[9] = y * e[2 * 4 + 1], r[10] = y * e[2 * 4 + 2], r[11] = y * e[2 * 4 + 3], e !== r && (r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15]), r;
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
    set: T,
    fromMat3: U,
    fromQuat: b,
    negate: F,
    copy: R,
    clone: G,
    equalsApproximately: B,
    equals: Z,
    identity: N,
    transpose: ie,
    inverse: re,
    determinant: fe,
    invert: ue,
    multiply: ae,
    mul: se,
    setTranslation: Q,
    getTranslation: H,
    getAxis: L,
    setAxis: oe,
    getScaling: ne,
    perspective: J,
    perspectiveReverseZ: j,
    ortho: C,
    frustum: te,
    frustumReverseZ: xe,
    aim: Be,
    cameraAim: q,
    lookAt: me,
    translation: de,
    translate: Ge,
    rotationX: K,
    rotateX: pe,
    rotationY: le,
    rotateY: ve,
    rotationZ: A,
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
function gn(f) {
  let v = nn.get(f);
  return v || (v = hn(f), nn.set(f, v)), v;
}
function xn(f) {
  const v = Ne(f);
  function M(i, d, t, s) {
    const l = new f(4);
    return i !== void 0 && (l[0] = i, d !== void 0 && (l[1] = d, t !== void 0 && (l[2] = t, s !== void 0 && (l[3] = s)))), l;
  }
  const T = M;
  function U(i, d, t, s, l) {
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
  function R(i, d) {
    const t = te(i, d);
    return Math.acos(2 * t * t - 1);
  }
  function G(i, d, t) {
    const s = t ?? new f(4), l = i[0], p = i[1], w = i[2], e = i[3], o = d[0], n = d[1], r = d[2], u = d[3];
    return s[0] = l * u + e * o + p * r - w * n, s[1] = p * u + e * n + w * o - l * r, s[2] = w * u + e * r + l * n - p * o, s[3] = e * u - l * o - p * n - w * r, s;
  }
  const B = G;
  function Z(i, d, t) {
    const s = t ?? new f(4), l = d * 0.5, p = i[0], w = i[1], e = i[2], o = i[3], n = Math.sin(l), r = Math.cos(l);
    return s[0] = p * r + o * n, s[1] = w * r + e * n, s[2] = e * r - w * n, s[3] = o * r - p * n, s;
  }
  function N(i, d, t) {
    const s = t ?? new f(4), l = d * 0.5, p = i[0], w = i[1], e = i[2], o = i[3], n = Math.sin(l), r = Math.cos(l);
    return s[0] = p * r - e * n, s[1] = w * r + o * n, s[2] = e * r + p * n, s[3] = o * r - w * n, s;
  }
  function ie(i, d, t) {
    const s = t ?? new f(4), l = d * 0.5, p = i[0], w = i[1], e = i[2], o = i[3], n = Math.sin(l), r = Math.cos(l);
    return s[0] = p * r + w * n, s[1] = w * r - p * n, s[2] = e * r + o * n, s[3] = o * r - e * n, s;
  }
  function re(i, d, t, s) {
    const l = s ?? new f(4), p = i[0], w = i[1], e = i[2], o = i[3];
    let n = d[0], r = d[1], u = d[2], g = d[3], y = p * n + w * r + e * u + o * g;
    y < 0 && (y = -y, n = -n, r = -r, u = -u, g = -g);
    let c, a;
    if (1 - y > k) {
      const h = Math.acos(y), x = Math.sin(h);
      c = Math.sin((1 - t) * h) / x, a = Math.sin(t * h) / x;
    } else
      c = 1 - t, a = t;
    return l[0] = c * p + a * n, l[1] = c * w + a * r, l[2] = c * e + a * u, l[3] = c * o + a * g, l;
  }
  function fe(i, d) {
    const t = d ?? new f(4), s = i[0], l = i[1], p = i[2], w = i[3], e = s * s + l * l + p * p + w * w, o = e ? 1 / e : 0;
    return t[0] = -s * o, t[1] = -l * o, t[2] = -p * o, t[3] = w * o, t;
  }
  function ue(i, d) {
    const t = d ?? new f(4);
    return t[0] = -i[0], t[1] = -i[1], t[2] = -i[2], t[3] = i[3], t;
  }
  function ae(i, d) {
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
    const p = l ?? new f(4), w = i * 0.5, e = d * 0.5, o = t * 0.5, n = Math.sin(w), r = Math.cos(w), u = Math.sin(e), g = Math.cos(e), y = Math.sin(o), c = Math.cos(o);
    switch (s) {
      case "xyz":
        p[0] = n * g * c + r * u * y, p[1] = r * u * c - n * g * y, p[2] = r * g * y + n * u * c, p[3] = r * g * c - n * u * y;
        break;
      case "xzy":
        p[0] = n * g * c - r * u * y, p[1] = r * u * c - n * g * y, p[2] = r * g * y + n * u * c, p[3] = r * g * c + n * u * y;
        break;
      case "yxz":
        p[0] = n * g * c + r * u * y, p[1] = r * u * c - n * g * y, p[2] = r * g * y - n * u * c, p[3] = r * g * c + n * u * y;
        break;
      case "yzx":
        p[0] = n * g * c + r * u * y, p[1] = r * u * c + n * g * y, p[2] = r * g * y - n * u * c, p[3] = r * g * c - n * u * y;
        break;
      case "zxy":
        p[0] = n * g * c - r * u * y, p[1] = r * u * c + n * g * y, p[2] = r * g * y + n * u * c, p[3] = r * g * c - n * u * y;
        break;
      case "zyx":
        p[0] = n * g * c - r * u * y, p[1] = r * u * c + n * g * y, p[2] = r * g * y - n * u * c, p[3] = r * g * c + n * u * y;
        break;
      default:
        throw new Error(`Unknown rotation order: ${s}`);
    }
    return p;
  }
  function Q(i, d) {
    const t = d ?? new f(4);
    return t[0] = i[0], t[1] = i[1], t[2] = i[2], t[3] = i[3], t;
  }
  const H = Q;
  function L(i, d, t) {
    const s = t ?? new f(4);
    return s[0] = i[0] + d[0], s[1] = i[1] + d[1], s[2] = i[2] + d[2], s[3] = i[3] + d[3], s;
  }
  function oe(i, d, t) {
    const s = t ?? new f(4);
    return s[0] = i[0] - d[0], s[1] = i[1] - d[1], s[2] = i[2] - d[2], s[3] = i[3] - d[3], s;
  }
  const ne = oe;
  function J(i, d, t) {
    const s = t ?? new f(4);
    return s[0] = i[0] * d, s[1] = i[1] * d, s[2] = i[2] * d, s[3] = i[3] * d, s;
  }
  const j = J;
  function C(i, d, t) {
    const s = t ?? new f(4);
    return s[0] = i[0] / d, s[1] = i[1] / d, s[2] = i[2] / d, s[3] = i[3] / d, s;
  }
  function te(i, d) {
    return i[0] * d[0] + i[1] * d[1] + i[2] * d[2] + i[3] * d[3];
  }
  function xe(i, d, t, s) {
    const l = s ?? new f(4);
    return l[0] = i[0] + t * (d[0] - i[0]), l[1] = i[1] + t * (d[1] - i[1]), l[2] = i[2] + t * (d[2] - i[2]), l[3] = i[3] + t * (d[3] - i[3]), l;
  }
  function Y(i) {
    const d = i[0], t = i[1], s = i[2], l = i[3];
    return Math.sqrt(d * d + t * t + s * s + l * l);
  }
  const W = Y;
  function X(i) {
    const d = i[0], t = i[1], s = i[2], l = i[3];
    return d * d + t * t + s * s + l * l;
  }
  const Be = X;
  function q(i, d) {
    const t = d ?? new f(4), s = i[0], l = i[1], p = i[2], w = i[3], e = Math.sqrt(s * s + l * l + p * p + w * w);
    return e > 1e-5 ? (t[0] = s / e, t[1] = l / e, t[2] = p / e, t[3] = w / e) : (t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1), t;
  }
  function me(i, d) {
    return Math.abs(i[0] - d[0]) < k && Math.abs(i[1] - d[1]) < k && Math.abs(i[2] - d[2]) < k && Math.abs(i[3] - d[3]) < k;
  }
  function de(i, d) {
    return i[0] === d[0] && i[1] === d[1] && i[2] === d[2] && i[3] === d[3];
  }
  function Ge(i) {
    const d = i ?? new f(4);
    return d[0] = 0, d[1] = 0, d[2] = 0, d[3] = 1, d;
  }
  const K = v.create(), pe = v.create(), le = v.create();
  function ve(i, d, t) {
    const s = t ?? new f(4), l = v.dot(i, d);
    return l < -0.999999 ? (v.cross(pe, i, K), v.len(K) < 1e-6 && v.cross(le, i, K), v.normalize(K, K), b(K, Math.PI, s), s) : l > 0.999999 ? (s[0] = 0, s[1] = 0, s[2] = 0, s[3] = 1, s) : (v.cross(i, d, K), s[0] = K[0], s[1] = K[1], s[2] = K[2], s[3] = 1 + l, q(s, s));
  }
  const A = new f(4), $ = new f(4);
  function ee(i, d, t, s, l, p) {
    const w = p ?? new f(4);
    return re(i, s, l, A), re(d, t, l, $), re(A, $, 2 * l * (1 - l), w), w;
  }
  return {
    create: M,
    fromValues: T,
    set: U,
    fromAxisAngle: b,
    toAxisAngle: F,
    angle: R,
    multiply: G,
    mul: B,
    rotateX: Z,
    rotateY: N,
    rotateZ: ie,
    slerp: re,
    inverse: fe,
    conjugate: ue,
    fromMat: ae,
    fromEuler: se,
    copy: Q,
    clone: H,
    add: L,
    subtract: oe,
    sub: ne,
    mulScalar: J,
    scale: j,
    divScalar: C,
    dot: te,
    lerp: xe,
    length: Y,
    len: W,
    lengthSq: X,
    lenSq: Be,
    normalize: q,
    equalsApproximately: me,
    equals: de,
    identity: Ge,
    rotationTo: ve,
    sqlerp: ee
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
  const M = v;
  function T(t, s, l, p, w) {
    const e = w ?? new f(4);
    return e[0] = t, e[1] = s, e[2] = l, e[3] = p, e;
  }
  function U(t, s) {
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
  function R(t, s = 0, l = 1, p) {
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
  function Z(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] - s[0], p[1] = t[1] - s[1], p[2] = t[2] - s[2], p[3] = t[3] - s[3], p;
  }
  const N = Z;
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
  function ue(t, s, l, p) {
    const w = p ?? new f(4);
    return w[0] = t[0] + l[0] * (s[0] - t[0]), w[1] = t[1] + l[1] * (s[1] - t[1]), w[2] = t[2] + l[2] * (s[2] - t[2]), w[3] = t[3] + l[3] * (s[3] - t[3]), w;
  }
  function ae(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = Math.max(t[0], s[0]), p[1] = Math.max(t[1], s[1]), p[2] = Math.max(t[2], s[2]), p[3] = Math.max(t[3], s[3]), p;
  }
  function se(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = Math.min(t[0], s[0]), p[1] = Math.min(t[1], s[1]), p[2] = Math.min(t[2], s[2]), p[3] = Math.min(t[3], s[3]), p;
  }
  function Q(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] * s, p[1] = t[1] * s, p[2] = t[2] * s, p[3] = t[3] * s, p;
  }
  const H = Q;
  function L(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] / s, p[1] = t[1] / s, p[2] = t[2] / s, p[3] = t[3] / s, p;
  }
  function oe(t, s) {
    const l = s ?? new f(4);
    return l[0] = 1 / t[0], l[1] = 1 / t[1], l[2] = 1 / t[2], l[3] = 1 / t[3], l;
  }
  const ne = oe;
  function J(t, s) {
    return t[0] * s[0] + t[1] * s[1] + t[2] * s[2] + t[3] * s[3];
  }
  function j(t) {
    const s = t[0], l = t[1], p = t[2], w = t[3];
    return Math.sqrt(s * s + l * l + p * p + w * w);
  }
  const C = j;
  function te(t) {
    const s = t[0], l = t[1], p = t[2], w = t[3];
    return s * s + l * l + p * p + w * w;
  }
  const xe = te;
  function Y(t, s) {
    const l = t[0] - s[0], p = t[1] - s[1], w = t[2] - s[2], e = t[3] - s[3];
    return Math.sqrt(l * l + p * p + w * w + e * e);
  }
  const W = Y;
  function X(t, s) {
    const l = t[0] - s[0], p = t[1] - s[1], w = t[2] - s[2], e = t[3] - s[3];
    return l * l + p * p + w * w + e * e;
  }
  const Be = X;
  function q(t, s) {
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
  const Ge = de;
  function K(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] * s[0], p[1] = t[1] * s[1], p[2] = t[2] * s[2], p[3] = t[3] * s[3], p;
  }
  const pe = K;
  function le(t, s, l) {
    const p = l ?? new f(4);
    return p[0] = t[0] / s[0], p[1] = t[1] / s[1], p[2] = t[2] / s[2], p[3] = t[3] / s[3], p;
  }
  const ve = le;
  function A(t) {
    const s = t ?? new f(4);
    return s[0] = 0, s[1] = 0, s[2] = 0, s[3] = 0, s;
  }
  function $(t, s, l) {
    const p = l ?? new f(4), w = t[0], e = t[1], o = t[2], n = t[3];
    return p[0] = s[0] * w + s[4] * e + s[8] * o + s[12] * n, p[1] = s[1] * w + s[5] * e + s[9] * o + s[13] * n, p[2] = s[2] * w + s[6] * e + s[10] * o + s[14] * n, p[3] = s[3] * w + s[7] * e + s[11] * o + s[15] * n, p;
  }
  function ee(t, s, l) {
    const p = l ?? new f(4);
    return q(t, p), Q(p, s, p);
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
    set: T,
    ceil: U,
    floor: b,
    round: F,
    clamp: R,
    add: G,
    addScaled: B,
    subtract: Z,
    sub: N,
    equalsApproximately: ie,
    equals: re,
    lerp: fe,
    lerpV: ue,
    max: ae,
    min: se,
    mulScalar: Q,
    scale: H,
    divScalar: L,
    inverse: oe,
    invert: ne,
    dot: J,
    length: j,
    len: C,
    lengthSq: te,
    lenSq: xe,
    distance: Y,
    dist: W,
    distanceSq: X,
    distSq: Be,
    normalize: q,
    negate: me,
    copy: de,
    clone: Ge,
    multiply: K,
    mul: pe,
    divide: le,
    div: ve,
    zero: A,
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
function je(f, v, M, T, U, b) {
  return {
    /** @namespace mat3 */
    mat3: pn(f),
    /** @namespace mat4 */
    mat4: gn(v),
    /** @namespace quat */
    quat: vn(M),
    /** @namespace vec2 */
    vec2: sn(T),
    /** @namespace vec3 */
    vec3: Ne(U),
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
je(an, Array, Array, Array, Array, Array);
const Ye = new ArrayBuffer(272), Xe = {
  texelSize: new Float32Array(Ye, 0, 2),
  sphereSize: new Float32Array(Ye, 8, 2),
  invProjectionMatrix: new Float32Array(Ye, 16, 16),
  projectionMatrix: new Float32Array(Ye, 80, 16),
  viewMatrix: new Float32Array(Ye, 144, 16),
  invViewMatrix: new Float32Array(Ye, 208, 16)
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
      var T = M.deltaY;
      this.currentDistance += (T > 0 ? 1 : -1) * this.zoomRate, this.currentDistance < this.minDistance && (this.currentDistance = this.minDistance), this.currentDistance > this.maxDistance && (this.currentDistance = this.maxDistance), this.recalculateView();
    }), this.canvas.addEventListener("mousemove", (M) => {
      if (this.currentHoverX = M.clientX, this.currentHoverY = M.clientY, this.isDragging) {
        const T = this.prevX - M.clientX, U = this.prevY - M.clientY;
        this.currentXtheta += this.sensitivity * T, this.currentYtheta += this.sensitivity * U, this.currentYtheta > this.maxYTheta && (this.currentYtheta = this.maxYTheta), this.currentYtheta < this.minYTheta && (this.currentYtheta = this.minYTheta), this.prevX = M.clientX, this.prevY = M.clientY, this.recalculateView();
      }
    }), this.canvas.addEventListener("mouseup", () => {
      this.isDragging && (this.isDragging = !1);
    });
  }
  reset(v, M, T, U) {
    this.isDragging = !1, this.prevX = 0, this.prevY = 0, this.currentXtheta = -Math.PI / 2 * 1, this.currentYtheta = -Math.PI / 12 * 0.8, this.maxYTheta = -Math.PI / 12 * 0.8, this.minYTheta = -0.99 * Math.PI / 2, this.sensitivity = 5e-3, this.currentDistance = v, this.maxDistance = 1.3 * this.currentDistance, this.minDistance = 0.8 * this.currentDistance, this.target = M, this.fov = T, this.zoomRate = U;
    const b = this.canvas.clientWidth / this.canvas.clientHeight, F = Ae.perspective(T, b, 0.1, 300);
    Xe.projectionMatrix.set(F), Xe.invProjectionMatrix.set(Ae.inverse(F)), this.recalculateView();
  }
  recalculateView() {
    var v = Ae.identity();
    Ae.translate(v, this.target, v), Ae.rotateY(v, this.currentXtheta, v), Ae.rotateX(v, this.currentYtheta, v), Ae.translate(v, [0, 0, this.currentDistance], v);
    var M = Ae.multiply(v, [0, 0, 0, 1]);
    let T = this.target;
    const U = Ae.lookAt(
      [M[0], M[1], M[2]],
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
    let [v, M] = this.calcPlaneCoord(this.currentHoverX, this.currentHoverY), [T, U] = this.calcPlaneCoord(this.prevHoverX, this.prevHoverY), b = v - T, F = M - U, R = 4;
    return b > R && (b = R), b < -R && (b = -R), F > R && (F = R), F < -R && (F = -R), [b, F, 0, 0];
  }
  calcPlaneCoord(v, M) {
    let T = v / this.canvas.width, U = M / this.canvas.height, b = 2 * T - 1, F = (1 - U) * 2 - 1, R = [
      b * Math.tan(this.fov / 2) * (this.canvas.width / this.canvas.height),
      F * Math.tan(this.fov / 2),
      -1
    ];
    return [R[0] * this.currentDistance, R[1] * this.currentDistance];
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
}`, Gn = `@group(0) @binding(0) var<storage, read> particles: array<Particle>;
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
}`, Tn = `@group(0) @binding(0) var<storage, read_write> densityGrid: array<i32>;
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
const Re = 80;
class Vn {
  constructor(v, M, T, U, b, F, R, G, B, Z, N, ie, re, fe) {
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
    this.device = G, this.renderDiameter = fe, this.frameCount = 0, this.spawned = !1, this.numParticles = 0, this.maxGridCount = N, this.maxParticleCount = ie, this.initBoxSizeBuffer = F;
    const ue = G.createShaderModule({ code: Pn }), ae = G.createShaderModule({ code: Tn }), se = G.createShaderModule({ code: Sn }), Q = G.createShaderModule({ code: Dn }), H = G.createShaderModule({ code: Mn }), L = G.createShaderModule({ code: Gn }), oe = G.createShaderModule({ code: zn }), ne = G.createShaderModule({ code: bn }), J = G.createShaderModule({ code: Bn });
    this.restDensity = 3;
    const j = {
      stiffness: 50,
      restDensity: this.restDensity,
      dynamicViscosity: 0.1,
      fixedPointMultiplier: re,
      fixedPointMultiplierInverse: 1 / re
    };
    this.clearGridPipeline = G.createComputePipeline({
      label: "clear grid pipeline",
      layout: "auto",
      compute: {
        module: ue
      }
    }), this.clearDensityGridPipeline = G.createComputePipeline({
      label: "clear density grid pipeline",
      layout: "auto",
      compute: {
        module: ae
      }
    }), this.castDensityGridPipeline = G.createComputePipeline({
      label: "cast density grid pipeline",
      layout: "auto",
      compute: {
        module: se,
        constants: {
          fixedPointMultiplierInverse: j.fixedPointMultiplierInverse
        }
      }
    }), this.p2g1Pipeline = G.createComputePipeline({
      label: "p2g 1 pipeline",
      layout: "auto",
      compute: {
        module: Q,
        constants: {
          fixedPointMultiplier: j.fixedPointMultiplier
        }
      }
    }), this.p2g2Pipeline = G.createComputePipeline({
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
    }), this.p2gDensityPipeline = G.createComputePipeline({
      label: "p2g density pipeline",
      layout: "auto",
      compute: {
        module: L,
        constants: {
          densityFixedPointMultiplier: j.fixedPointMultiplier
        }
      }
    }), this.updateGridPipeline = G.createComputePipeline({
      label: "update grid pipeline",
      layout: "auto",
      compute: {
        module: oe,
        constants: {
          fixedPointMultiplier: j.fixedPointMultiplier,
          fixedPointMultiplierInverse: j.fixedPointMultiplierInverse
        }
      }
    }), this.g2pPipeline = G.createComputePipeline({
      label: "g2p pipeline",
      layout: "auto",
      compute: {
        module: ne,
        constants: {
          fixedPointMultiplierInverse: j.fixedPointMultiplierInverse
        }
      }
    }), this.copyPositionPipeline = G.createComputePipeline({
      label: "copy position pipeline",
      layout: "auto",
      compute: {
        module: J
      }
    });
    const C = G.createBuffer({
      label: "cells buffer",
      size: this.cellStructSize * N,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    this.densityBuffer = G.createBuffer({
      label: "density buffer",
      size: 4 * ie,
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
    }), this.mouseInfoViews.screenSize.set([Z.width, Z.height]), this.device.queue.writeBuffer(this.mouseInfoUniformBuffer, 0, this.mouseInfoValues), this.clearGridBindGroup = G.createBindGroup({
      layout: this.clearGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: C } }
      ]
    }), this.clearDensityGridBindGroup = G.createBindGroup({
      layout: this.clearDensityGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: U } },
        { binding: 1, resource: { buffer: b } }
      ]
    }), this.castDensityGridBindGroup = G.createBindGroup({
      layout: this.castDensityGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: U } },
        { binding: 1, resource: { buffer: b } }
      ]
    }), this.p2g1BindGroup = G.createBindGroup({
      layout: this.p2g1Pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: C } },
        { binding: 2, resource: { buffer: F } },
        { binding: 3, resource: { buffer: this.numParticlesBuffer } }
      ]
    }), this.p2g2BindGroup = G.createBindGroup({
      layout: this.p2g2Pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: C } },
        { binding: 2, resource: { buffer: F } },
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
        { binding: 4, resource: { buffer: R } }
      ]
    }), this.updateGridBindGroup = G.createBindGroup({
      layout: this.updateGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: C } },
        { binding: 1, resource: { buffer: this.realBoxSizeBuffer } },
        { binding: 2, resource: { buffer: F } },
        { binding: 3, resource: { buffer: T } },
        { binding: 4, resource: B },
        { binding: 5, resource: { buffer: this.mouseInfoUniformBuffer } },
        { binding: 6, resource: { buffer: this.dtBuffer } }
      ]
    }), this.g2pBindGroup = G.createBindGroup({
      layout: this.g2pPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: C } },
        { binding: 2, resource: { buffer: this.realBoxSizeBuffer } },
        { binding: 3, resource: { buffer: F } },
        { binding: 4, resource: { buffer: this.numParticlesBuffer } },
        { binding: 5, resource: { buffer: this.dtBuffer } }
      ]
    }), this.copyPositionBindGroup = G.createBindGroup({
      layout: this.copyPositionPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: M } },
        { binding: 2, resource: { buffer: this.numParticlesBuffer } }
      ]
    }), this.particleBuffer = v, this.densityGridBuffer = U;
  }
  initDambreak(v, M) {
    let T = new ArrayBuffer(Re * this.maxParticleCount);
    const U = 0.9;
    this.numParticles = 0, v[0] / 2, v[0] / 2, v[2] / 2;
    for (let G = 3; G < v[1] * 0.8 && this.numParticles < M; G += U)
      for (let B = v[0] * 0.25; B < v[0] - 4 && this.numParticles < M; B += U)
        for (let Z = 3; Z < v[2] / 2 && this.numParticles < M; Z += U) {
          const N = Re * this.numParticles, ie = {
            position: new Float32Array(T, N + 0, 3),
            v: new Float32Array(T, N + 16, 3),
            C: new Float32Array(T, N + 32, 12)
          }, re = 0.5 * Math.random();
          ie.position.set([B + re, G + re, Z + re]), this.numParticles++;
        }
    console.log(this.numParticles), this.numParticles < M && console.log("warning: actual number of particles is smaller than the specified number. make bounding box larger.");
    let b = new ArrayBuffer(Re * this.numParticles);
    const F = new Uint8Array(T), R = new Uint8Array(b);
    return R.set(F.subarray(0, R.length)), b;
  }
  reset(v, M) {
    if (this.gridCount = Math.ceil(v[0]) * Math.ceil(v[1]) * Math.ceil(v[2]), this.gridCount > this.maxGridCount)
      throw new Error("gridCount should be equal to or less than maxGridCount");
    this.densityGridCount = this.gridCount;
    const T = new Float32Array(v);
    this.device.queue.writeBuffer(this.initBoxSizeBuffer, 0, T), this.frameCount = 0;
    let U = this.initDambreak(v, M);
    this.device.queue.writeBuffer(this.particleBuffer, 0, U), this.changeBoxSize(v), this.changeNumParticles(this.numParticles);
  }
  execute(v, M, T, U, b, F, R, G) {
    const B = v.beginComputePass();
    this.mouseInfoViews.mouseCoord.set([M[0], M[1]]), this.mouseInfoViews.mouseVel.set([T[0], T[1]]), this.mouseInfoViews.mouseRadius.set([U]), this.device.queue.writeBuffer(this.mouseInfoUniformBuffer, 0, this.mouseInfoValues);
    const Z = new Float32Array([F]);
    if (this.device.queue.writeBuffer(this.dtBuffer, 0, Z), b) {
      if (R)
        for (let ie = 0; ie < 1; ie++)
          B.setBindGroup(0, this.clearGridBindGroup), B.setPipeline(this.clearGridPipeline), B.dispatchWorkgroups(Math.ceil(this.gridCount / 64)), B.setBindGroup(0, this.p2g1BindGroup), B.setPipeline(this.p2g1Pipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), B.setBindGroup(0, this.p2g2BindGroup), B.setPipeline(this.p2g2Pipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), B.setBindGroup(0, this.updateGridBindGroup), B.setPipeline(this.updateGridPipeline), B.dispatchWorkgroups(Math.ceil(this.gridCount / 64)), B.setBindGroup(0, this.g2pBindGroup), B.setPipeline(this.g2pPipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
      let N = G[0] * G[1] * G[2];
      B.setBindGroup(0, this.clearDensityGridBindGroup), B.setPipeline(this.clearDensityGridPipeline), B.dispatchWorkgroups(Math.ceil(N / 2 / 64)), B.setBindGroup(0, this.p2gDensityBindGroup), B.setPipeline(this.p2gDensityPipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), B.setBindGroup(0, this.castDensityGridBindGroup), B.setPipeline(this.castDensityGridPipeline), B.dispatchWorkgroups(Math.ceil(N / 2 / 64)), B.setBindGroup(0, this.copyPositionBindGroup), B.setPipeline(this.copyPositionPipeline), B.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
    } else if (R) {
      for (let N = 0; N < 1; N++)
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
    return vec4f(1., 1., 1., 1.); 
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
}`, Yn = `struct VertexOutput {
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

@fragment
fn fs(input: FragmentInput) -> @location(0) vec4f {
    
    let env = textureSampleLevel(envmapTexture, textureSampler, vec3f(0., 1., 0.), 0.).rgb;
    return vec4f(max(env + uniforms.texelSize.x, vec3f(1.)), 1.); 
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
class On {
  constructor(v, M, T, U, b, F, R, G, B, Z, N, ie, re) {
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
    const fe = 50, ue = 2 * N, ae = 12, se = B.width / 2, Q = B.height / 2, H = {
      screenHeight: B.height,
      screenWidth: B.width
    }, L = {
      maxFilterSize: fe,
      projectedParticleConstant: ae * ue * 0.05 * (B.height / 2) / Math.tan(ie / 2)
    }, oe = {
      thicknessTextureWidth: se,
      thicknessTextureHeight: Q
    }, ne = b.createSampler({
      // addressModeU: "repeat",
      // addressModeV: "repeat",
      magFilter: "linear",
      minFilter: "linear"
    }), J = b.createShaderModule({ code: Un }), j = b.createShaderModule({ code: _n }), C = b.createShaderModule({ code: Fn }), te = b.createShaderModule({ code: Yn }), xe = b.createShaderModule({ code: Xn }), Y = b.createShaderModule({ code: In }), W = b.createShaderModule({ code: An }), X = b.createShaderModule({ code: Rn }), Be = b.createShaderModule({ code: kn });
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
        module: J,
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
        module: J,
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
        module: Y
      },
      fragment: {
        module: Y,
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
        module: J,
        constants: H
      },
      fragment: {
        module: W,
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
        module: J,
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
        module: J,
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
        module: J,
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
      size: [se, Q, 1],
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      format: "r16float"
    }), de = b.createTexture({
      label: "temporary thickness map texture",
      size: [se, Q, 1],
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      format: "r16float"
    }), Ge = b.createTexture({
      size: [B.width, B.height, 1],
      format: "depth32float",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
    }), K = b.createTexture({
      size: [B.width, B.height, 1],
      format: Z,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
    });
    this.depthMapTextureView = F, this.tmpDepthMapTextureView = q.createView(), this.thicknessTextureView = me.createView(), this.tmpThicknessTextureView = de.createView(), this.depthTestTextureView = Ge.createView(), this.tmpOutputTextureView = K.createView();
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
    }), this.densityGridSizeBuffer = T;
    let A = new Float32Array([1, 0]), $ = new Float32Array([0, 1]), ee = new Int32Array([15]);
    b.queue.writeBuffer(pe, 0, A), b.queue.writeBuffer(le, 0, $), b.queue.writeBuffer(ve, 0, ee), this.depthFilter1DBindGroups = [], this.depthFilter1DBindGroups = [
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
        { binding: 4, resource: R },
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
        { binding: 0, resource: R },
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
        { binding: 1, resource: G },
        { binding: 2, resource: { buffer: v } },
        { binding: 3, resource: { buffer: U } },
        { binding: 4, resource: ne },
        { binding: 5, resource: this.tmpOutputTextureView },
        { binding: 6, resource: { buffer: this.densityGridSizeBuffer } }
      ]
    }), console.log(this.densityRaymarchPipeline.getBindGroupLayout(0));
  }
  execute(v, M, T, U, b, F) {
    const R = new Float32Array(b), G = new Float32Array([F]);
    this.device.queue.writeBuffer(this.diffuseColorBuffer, 0, R), this.device.queue.writeBuffer(this.colorDensityBuffer, 0, G);
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
    }, ue = {
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
    }, ae = {
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
      const Q = M.beginRenderPass(ie);
      Q.setBindGroup(0, this.bgColorBindGroup), Q.setPipeline(this.bgColorPipeline), Q.draw(6), Q.end();
      const H = M.beginRenderPass(ue);
      H.setBindGroup(0, this.sphereBindGroup), H.setPipeline(this.spherePipeline), H.draw(6, T), H.end();
      const L = M.beginRenderPass(ae);
      L.setBindGroup(0, this.densityRaymarchBindGroup), L.setPipeline(this.densityRaymarchPipeline), L.draw(6), L.end();
    } else {
      const Q = M.beginRenderPass(fe);
      Q.setBindGroup(0, this.depthMapBindGroup), Q.setPipeline(this.depthMapPipeline), Q.draw(6, T), Q.end();
      for (var se = 0; se < 2; se++) {
        const j = M.beginRenderPass(B[0]);
        j.setBindGroup(0, this.depthFilter1DBindGroups[0]), j.setPipeline(this.depthFilter1DPipeline), j.draw(6), j.end();
        const C = M.beginRenderPass(B[1]);
        C.setBindGroup(0, this.depthFilter1DBindGroups[1]), C.setPipeline(this.depthFilter1DPipeline), C.draw(6), C.end();
      }
      const H = M.beginRenderPass(B[0]);
      H.setBindGroup(0, this.depthFilter2DBindGroups[0]), H.setPipeline(this.depthFilter2DPipeline), H.draw(6), H.end();
      const L = M.beginRenderPass(B[1]);
      L.setBindGroup(0, this.depthFilter2DBindGroups[1]), L.setPipeline(this.depthFilter2DPipeline), L.draw(6), L.end();
      const oe = M.beginRenderPass(Z);
      oe.setBindGroup(0, this.thicknessMapBindGroup), oe.setPipeline(this.thicknessMapPipeline), oe.draw(6, T), oe.end();
      for (var se = 0; se < 1; se++) {
        const C = M.beginRenderPass(N[0]);
        C.setBindGroup(0, this.thicknessFilterBindGroups[0]), C.setPipeline(this.thicknessFilterPipeline), C.draw(6), C.end();
        const te = M.beginRenderPass(N[1]);
        te.setBindGroup(0, this.thicknessFilterBindGroups[1]), te.setPipeline(this.thicknessFilterPipeline), te.draw(6), te.end();
      }
      const ne = M.beginRenderPass(ie);
      ne.setBindGroup(0, this.bgColorBindGroup), ne.setPipeline(this.bgColorPipeline), ne.draw(6), ne.end();
      const J = M.beginRenderPass(re);
      J.setBindGroup(0, this.fluidBindGroup), J.setPipeline(this.fluidPipeline), J.draw(6), J.end();
    }
  }
}
function Ln(f, v) {
  const M = document.createElement("canvas");
  M.width = M.height = f;
  const T = M.getContext("2d");
  if (v === "up") T.fillStyle = "#ffffff";
  else if (v === "down") T.fillStyle = "#dfe2e4";
  else {
    const U = T.createLinearGradient(0, 0, 0, f);
    U.addColorStop(0, "#ffffff"), U.addColorStop(0.5, "#eef0f1"), U.addColorStop(1, "#dfe2e4"), T.fillStyle = U;
  }
  return T.fillRect(0, 0, f, f), M;
}
async function Cn(f, v) {
  const M = v.particles ?? 55e3, T = v.box ?? [72, 22, 43], U = v.resolution ?? 0.7, b = await navigator.gpu.requestAdapter();
  if (!b) throw new Error("no WebGPU adapter");
  const F = await b.requestDevice();
  for (; !f.clientWidth || !f.clientHeight; ) await new Promise((A) => setTimeout(A, 50));
  const R = f.getContext("webgpu");
  f.width = Math.round(U * f.clientWidth), f.height = Math.round(U * f.clientHeight);
  const G = navigator.gpu.getPreferredCanvasFormat();
  R.configure({ device: F, format: G });
  const B = ["side", "side", "up", "down", "side", "side"], Z = await Promise.all(B.map((A) => createImageBitmap(Ln(64, A)))), N = F.createTexture({
    dimension: "2d",
    size: [Z[0].width, Z[0].height, 6],
    format: "rgba8unorm",
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
  });
  Z.forEach((A, $) => F.queue.copyExternalImageToTexture({ source: A }, { texture: N, origin: [0, 0, $] }, [A.width, A.height]));
  const ie = N.createView({ dimension: "cube" }), re = T[0] * T[1] * T[2], fe = F.createBuffer({ size: Re * M, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST }), ue = F.createBuffer({ size: 32 * M, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST }), ae = F.createBuffer({ size: Ye.byteLength, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST }), se = F.createBuffer({ size: 12, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST }), H = F.createTexture({ size: [f.width, f.height, 1], usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING, format: "r32float" }).createView(), L = [T[0], T[1], Math.ceil(T[2] / 128) * 128], oe = F.createBuffer({ size: 4 * L[0] * L[1] * L[2], usage: GPUBufferUsage.STORAGE }), ne = F.createBuffer({ size: 2 * L[0] * L[1] * L[2], usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC }), J = F.createBuffer({ size: 12, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  F.queue.writeBuffer(J, 0, new Float32Array(L));
  const j = F.createTexture({ size: [L[2], L[1], L[0]], usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST, format: "r16float", dimension: "3d" }), C = 60 * Math.PI / 180, te = 0.6, xe = 2 * te, Y = 1e7, W = new Vn(
    fe,
    ue,
    ae,
    oe,
    ne,
    se,
    J,
    F,
    H,
    f,
    re,
    M,
    Y,
    xe
  ), X = new On(
    ae,
    ue,
    J,
    se,
    F,
    H,
    ie,
    j.createView(),
    f,
    G,
    te,
    C,
    Y
  );
  W.initDambreak = function(A, $) {
    const ee = new ArrayBuffer(Re * this.maxParticleCount), i = 0.9;
    this.numParticles = 0;
    for (let d = 3; d < A[1] - 3 && this.numParticles < $; d += i)
      for (let t = 3; t < A[0] - 3 && this.numParticles < $; t += i)
        for (let s = 3; s < A[2] - 3 && this.numParticles < $; s += i) {
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
  }, q = new yn(Be), me = () => {
    const A = f.clientWidth / Math.max(1, f.clientHeight), ee = (T[0] - 7) / 2 / 0.9 / (Math.tan(C / 2) * A) + (T[2] / 2 - 3);
    q.reset(ee, [T[0] / 2, T[1] * 0.42, T[2] / 2], C, 0.7), q.currentXtheta = 0, q.currentYtheta = -((v.elevation ?? 10) * Math.PI) / 180, q.recalculateView();
  };
  W.reset(T, M), me();
  let de = !1;
  q.currentHoverX = q.prevHoverX = -1e4, q.currentHoverY = q.prevHoverY = -1e4;
  const Ge = (A, $) => {
    const ee = f.getBoundingClientRect();
    if (A === null || $ === void 0) {
      de = !1, q.currentHoverX = q.prevHoverX = -1e4, q.currentHoverY = q.prevHoverY = -1e4;
      return;
    }
    de || (q.prevHoverX = A - ee.left, q.prevHoverY = $ - ee.top), de = !0, q.currentHoverX = A - ee.left, q.currentHoverY = $ - ee.top;
  }, K = () => {
    Xe.texelSize.set([1 / f.width, 1 / f.height]), Xe.sphereSize.set([xe]), F.queue.writeBuffer(ae, 0, Ye);
    const A = F.createCommandEncoder();
    W.execute(
      A,
      [q.currentHoverX / f.clientWidth, q.currentHoverY / f.clientHeight],
      q.calcMouseVelocity().map(($) => $ * 0.6),
      15,
      !1,
      0.4 * 0.8,
      !0,
      L
    ), X.execute(R, A, W.numParticles, !1, [140 / 255, 220 / 255, 240 / 255], 0.7), F.queue.submit([A.finish()]), q.setNewPrevMouseCoord();
  };
  let pe = 0, le = !1;
  const ve = () => {
    le || (K(), pe = requestAnimationFrame(ve));
  };
  return pe = requestAnimationFrame(ve), {
    particleCount: W.numParticles,
    setHand: Ge,
    reset: () => {
      W.reset(T, M), me();
    },
    advance: K,
    box: T,
    project: (A, $, ee) => {
      const i = Xe.viewMatrix, d = Xe.projectionMatrix, t = i[0] * A + i[4] * $ + i[8] * ee + i[12], s = i[1] * A + i[5] * $ + i[9] * ee + i[13], l = i[2] * A + i[6] * $ + i[10] * ee + i[14], p = i[3] * A + i[7] * $ + i[11] * ee + i[15], w = d[0] * t + d[4] * s + d[8] * l + d[12] * p, e = d[1] * t + d[5] * s + d[9] * l + d[13] * p, o = d[3] * t + d[7] * s + d[11] * l + d[15] * p, n = f.getBoundingClientRect();
      return { x: n.left + (w / o * 0.5 + 0.5) * n.width, y: n.top + (0.5 - e / o * 0.5) * n.height, behind: o <= 0 };
    },
    destroy: () => {
      le = !0, cancelAnimationFrame(pe), F.destroy();
    }
  };
}
export {
  Cn as createTank
};
