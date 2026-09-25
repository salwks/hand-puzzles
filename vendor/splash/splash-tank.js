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
let R = 1e-6;
function ln(f) {
  function v(e = 0, o = 0) {
    const n = new f(2);
    return e !== void 0 && (n[0] = e, o !== void 0 && (n[1] = o)), n;
  }
  const M = v;
  function _(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = e, i[1] = o, i;
  }
  function U(e, o) {
    const n = o ?? new f(2);
    return n[0] = Math.ceil(e[0]), n[1] = Math.ceil(e[1]), n;
  }
  function B(e, o) {
    const n = o ?? new f(2);
    return n[0] = Math.floor(e[0]), n[1] = Math.floor(e[1]), n;
  }
  function L(e, o) {
    const n = o ?? new f(2);
    return n[0] = Math.round(e[0]), n[1] = Math.round(e[1]), n;
  }
  function k(e, o = 0, n = 1, i) {
    const a = i ?? new f(2);
    return a[0] = Math.min(n, Math.max(o, e[0])), a[1] = Math.min(n, Math.max(o, e[1])), a;
  }
  function G(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = e[0] + o[0], i[1] = e[1] + o[1], i;
  }
  function b(e, o, n, i) {
    const a = i ?? new f(2);
    return a[0] = e[0] + o[0] * n, a[1] = e[1] + o[1] * n, a;
  }
  function N(e, o) {
    const n = e[0], i = e[1], a = o[0], g = o[1], y = Math.sqrt(n * n + i * i), c = Math.sqrt(a * a + g * g), l = y * c, h = l && X(e, o) / l;
    return Math.acos(h);
  }
  function F(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = e[0] - o[0], i[1] = e[1] - o[1], i;
  }
  const J = F;
  function K(e, o) {
    return Math.abs(e[0] - o[0]) < R && Math.abs(e[1] - o[1]) < R;
  }
  function ue(e, o) {
    return e[0] === o[0] && e[1] === o[1];
  }
  function re(e, o, n, i) {
    const a = i ?? new f(2);
    return a[0] = e[0] + n * (o[0] - e[0]), a[1] = e[1] + n * (o[1] - e[1]), a;
  }
  function ae(e, o, n, i) {
    const a = i ?? new f(2);
    return a[0] = e[0] + n[0] * (o[0] - e[0]), a[1] = e[1] + n[1] * (o[1] - e[1]), a;
  }
  function te(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = Math.max(e[0], o[0]), i[1] = Math.max(e[1], o[1]), i;
  }
  function j(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = Math.min(e[0], o[0]), i[1] = Math.min(e[1], o[1]), i;
  }
  function H(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = e[0] * o, i[1] = e[1] * o, i;
  }
  const $ = H;
  function ie(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = e[0] / o, i[1] = e[1] / o, i;
  }
  function Z(e, o) {
    const n = o ?? new f(2);
    return n[0] = 1 / e[0], n[1] = 1 / e[1], n;
  }
  const ee = Z;
  function q(e, o, n) {
    const i = n ?? new f(3), a = e[0] * o[1] - e[1] * o[0];
    return i[0] = 0, i[1] = 0, i[2] = a, i;
  }
  function X(e, o) {
    return e[0] * o[0] + e[1] * o[1];
  }
  function ne(e) {
    const o = e[0], n = e[1];
    return Math.sqrt(o * o + n * n);
  }
  const xe = ne;
  function Y(e) {
    const o = e[0], n = e[1];
    return o * o + n * n;
  }
  const C = Y;
  function A(e, o) {
    const n = e[0] - o[0], i = e[1] - o[1];
    return Math.sqrt(n * n + i * i);
  }
  const me = A;
  function le(e, o) {
    const n = e[0] - o[0], i = e[1] - o[1];
    return n * n + i * i;
  }
  const ye = le;
  function se(e, o) {
    const n = o ?? new f(2), i = e[0], a = e[1], g = Math.sqrt(i * i + a * a);
    return g > 1e-5 ? (n[0] = i / g, n[1] = a / g) : (n[0] = 0, n[1] = 0), n;
  }
  function Ge(e, o) {
    const n = o ?? new f(2);
    return n[0] = -e[0], n[1] = -e[1], n;
  }
  function Q(e, o) {
    const n = o ?? new f(2);
    return n[0] = e[0], n[1] = e[1], n;
  }
  const W = Q;
  function ce(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = e[0] * o[0], i[1] = e[1] * o[1], i;
  }
  const fe = ce;
  function ge(e, o, n) {
    const i = n ?? new f(2);
    return i[0] = e[0] / o[0], i[1] = e[1] / o[1], i;
  }
  const we = ge;
  function de(e = 1, o) {
    const n = o ?? new f(2), i = Math.random() * 2 * Math.PI;
    return n[0] = Math.cos(i) * e, n[1] = Math.sin(i) * e, n;
  }
  function r(e) {
    const o = e ?? new f(2);
    return o[0] = 0, o[1] = 0, o;
  }
  function p(e, o, n) {
    const i = n ?? new f(2), a = e[0], g = e[1];
    return i[0] = a * o[0] + g * o[4] + o[12], i[1] = a * o[1] + g * o[5] + o[13], i;
  }
  function t(e, o, n) {
    const i = n ?? new f(2), a = e[0], g = e[1];
    return i[0] = o[0] * a + o[4] * g + o[8], i[1] = o[1] * a + o[5] * g + o[9], i;
  }
  function s(e, o, n, i) {
    const a = i ?? new f(2), g = e[0] - o[0], y = e[1] - o[1], c = Math.sin(n), l = Math.cos(n);
    return a[0] = g * l - y * c + o[0], a[1] = g * c + y * l + o[1], a;
  }
  function u(e, o, n) {
    const i = n ?? new f(2);
    return se(e, i), H(i, o, i);
  }
  function d(e, o, n) {
    const i = n ?? new f(2);
    return ne(e) > o ? u(e, o, i) : Q(e, i);
  }
  function w(e, o, n) {
    const i = n ?? new f(2);
    return re(e, o, 0.5, i);
  }
  return {
    create: v,
    fromValues: M,
    set: _,
    ceil: U,
    floor: B,
    round: L,
    clamp: k,
    add: G,
    addScaled: b,
    angle: N,
    subtract: F,
    sub: J,
    equalsApproximately: K,
    equals: ue,
    lerp: re,
    lerpV: ae,
    max: te,
    min: j,
    mulScalar: H,
    scale: $,
    divScalar: ie,
    inverse: Z,
    invert: ee,
    cross: q,
    dot: X,
    length: ne,
    len: xe,
    lengthSq: Y,
    lenSq: C,
    distance: A,
    dist: me,
    distanceSq: le,
    distSq: ye,
    normalize: se,
    negate: Ge,
    copy: Q,
    clone: W,
    multiply: ce,
    mul: fe,
    divide: ge,
    div: we,
    random: de,
    zero: r,
    transformMat4: p,
    transformMat3: t,
    rotate: s,
    setLength: u,
    truncate: d,
    midpoint: w
  };
}
const Je = /* @__PURE__ */ new Map();
function sn(f) {
  let v = Je.get(f);
  return v || (v = ln(f), Je.set(f, v)), v;
}
function fn(f) {
  function v(c, l, h) {
    const x = new f(3);
    return c !== void 0 && (x[0] = c, l !== void 0 && (x[1] = l, h !== void 0 && (x[2] = h))), x;
  }
  const M = v;
  function _(c, l, h, x) {
    const m = x ?? new f(3);
    return m[0] = c, m[1] = l, m[2] = h, m;
  }
  function U(c, l) {
    const h = l ?? new f(3);
    return h[0] = Math.ceil(c[0]), h[1] = Math.ceil(c[1]), h[2] = Math.ceil(c[2]), h;
  }
  function B(c, l) {
    const h = l ?? new f(3);
    return h[0] = Math.floor(c[0]), h[1] = Math.floor(c[1]), h[2] = Math.floor(c[2]), h;
  }
  function L(c, l) {
    const h = l ?? new f(3);
    return h[0] = Math.round(c[0]), h[1] = Math.round(c[1]), h[2] = Math.round(c[2]), h;
  }
  function k(c, l = 0, h = 1, x) {
    const m = x ?? new f(3);
    return m[0] = Math.min(h, Math.max(l, c[0])), m[1] = Math.min(h, Math.max(l, c[1])), m[2] = Math.min(h, Math.max(l, c[2])), m;
  }
  function G(c, l, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] + l[0], x[1] = c[1] + l[1], x[2] = c[2] + l[2], x;
  }
  function b(c, l, h, x) {
    const m = x ?? new f(3);
    return m[0] = c[0] + l[0] * h, m[1] = c[1] + l[1] * h, m[2] = c[2] + l[2] * h, m;
  }
  function N(c, l) {
    const h = c[0], x = c[1], m = c[2], P = l[0], D = l[1], S = l[2], I = Math.sqrt(h * h + x * x + m * m), T = Math.sqrt(P * P + D * D + S * S), V = I * T, O = V && X(c, l) / V;
    return Math.acos(O);
  }
  function F(c, l, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] - l[0], x[1] = c[1] - l[1], x[2] = c[2] - l[2], x;
  }
  const J = F;
  function K(c, l) {
    return Math.abs(c[0] - l[0]) < R && Math.abs(c[1] - l[1]) < R && Math.abs(c[2] - l[2]) < R;
  }
  function ue(c, l) {
    return c[0] === l[0] && c[1] === l[1] && c[2] === l[2];
  }
  function re(c, l, h, x) {
    const m = x ?? new f(3);
    return m[0] = c[0] + h * (l[0] - c[0]), m[1] = c[1] + h * (l[1] - c[1]), m[2] = c[2] + h * (l[2] - c[2]), m;
  }
  function ae(c, l, h, x) {
    const m = x ?? new f(3);
    return m[0] = c[0] + h[0] * (l[0] - c[0]), m[1] = c[1] + h[1] * (l[1] - c[1]), m[2] = c[2] + h[2] * (l[2] - c[2]), m;
  }
  function te(c, l, h) {
    const x = h ?? new f(3);
    return x[0] = Math.max(c[0], l[0]), x[1] = Math.max(c[1], l[1]), x[2] = Math.max(c[2], l[2]), x;
  }
  function j(c, l, h) {
    const x = h ?? new f(3);
    return x[0] = Math.min(c[0], l[0]), x[1] = Math.min(c[1], l[1]), x[2] = Math.min(c[2], l[2]), x;
  }
  function H(c, l, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] * l, x[1] = c[1] * l, x[2] = c[2] * l, x;
  }
  const $ = H;
  function ie(c, l, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] / l, x[1] = c[1] / l, x[2] = c[2] / l, x;
  }
  function Z(c, l) {
    const h = l ?? new f(3);
    return h[0] = 1 / c[0], h[1] = 1 / c[1], h[2] = 1 / c[2], h;
  }
  const ee = Z;
  function q(c, l, h) {
    const x = h ?? new f(3), m = c[2] * l[0] - c[0] * l[2], P = c[0] * l[1] - c[1] * l[0];
    return x[0] = c[1] * l[2] - c[2] * l[1], x[1] = m, x[2] = P, x;
  }
  function X(c, l) {
    return c[0] * l[0] + c[1] * l[1] + c[2] * l[2];
  }
  function ne(c) {
    const l = c[0], h = c[1], x = c[2];
    return Math.sqrt(l * l + h * h + x * x);
  }
  const xe = ne;
  function Y(c) {
    const l = c[0], h = c[1], x = c[2];
    return l * l + h * h + x * x;
  }
  const C = Y;
  function A(c, l) {
    const h = c[0] - l[0], x = c[1] - l[1], m = c[2] - l[2];
    return Math.sqrt(h * h + x * x + m * m);
  }
  const me = A;
  function le(c, l) {
    const h = c[0] - l[0], x = c[1] - l[1], m = c[2] - l[2];
    return h * h + x * x + m * m;
  }
  const ye = le;
  function se(c, l) {
    const h = l ?? new f(3), x = c[0], m = c[1], P = c[2], D = Math.sqrt(x * x + m * m + P * P);
    return D > 1e-5 ? (h[0] = x / D, h[1] = m / D, h[2] = P / D) : (h[0] = 0, h[1] = 0, h[2] = 0), h;
  }
  function Ge(c, l) {
    const h = l ?? new f(3);
    return h[0] = -c[0], h[1] = -c[1], h[2] = -c[2], h;
  }
  function Q(c, l) {
    const h = l ?? new f(3);
    return h[0] = c[0], h[1] = c[1], h[2] = c[2], h;
  }
  const W = Q;
  function ce(c, l, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] * l[0], x[1] = c[1] * l[1], x[2] = c[2] * l[2], x;
  }
  const fe = ce;
  function ge(c, l, h) {
    const x = h ?? new f(3);
    return x[0] = c[0] / l[0], x[1] = c[1] / l[1], x[2] = c[2] / l[2], x;
  }
  const we = ge;
  function de(c = 1, l) {
    const h = l ?? new f(3), x = Math.random() * 2 * Math.PI, m = Math.random() * 2 - 1, P = Math.sqrt(1 - m * m) * c;
    return h[0] = Math.cos(x) * P, h[1] = Math.sin(x) * P, h[2] = m * c, h;
  }
  function r(c) {
    const l = c ?? new f(3);
    return l[0] = 0, l[1] = 0, l[2] = 0, l;
  }
  function p(c, l, h) {
    const x = h ?? new f(3), m = c[0], P = c[1], D = c[2], S = l[3] * m + l[7] * P + l[11] * D + l[15] || 1;
    return x[0] = (l[0] * m + l[4] * P + l[8] * D + l[12]) / S, x[1] = (l[1] * m + l[5] * P + l[9] * D + l[13]) / S, x[2] = (l[2] * m + l[6] * P + l[10] * D + l[14]) / S, x;
  }
  function t(c, l, h) {
    const x = h ?? new f(3), m = c[0], P = c[1], D = c[2];
    return x[0] = m * l[0 * 4 + 0] + P * l[1 * 4 + 0] + D * l[2 * 4 + 0], x[1] = m * l[0 * 4 + 1] + P * l[1 * 4 + 1] + D * l[2 * 4 + 1], x[2] = m * l[0 * 4 + 2] + P * l[1 * 4 + 2] + D * l[2 * 4 + 2], x;
  }
  function s(c, l, h) {
    const x = h ?? new f(3), m = c[0], P = c[1], D = c[2];
    return x[0] = m * l[0] + P * l[4] + D * l[8], x[1] = m * l[1] + P * l[5] + D * l[9], x[2] = m * l[2] + P * l[6] + D * l[10], x;
  }
  function u(c, l, h) {
    const x = h ?? new f(3), m = l[0], P = l[1], D = l[2], S = l[3] * 2, I = c[0], T = c[1], V = c[2], O = P * V - D * T, E = D * I - m * V, oe = m * T - P * I;
    return x[0] = I + O * S + (P * oe - D * E) * 2, x[1] = T + E * S + (D * O - m * oe) * 2, x[2] = V + oe * S + (m * E - P * O) * 2, x;
  }
  function d(c, l) {
    const h = l ?? new f(3);
    return h[0] = c[12], h[1] = c[13], h[2] = c[14], h;
  }
  function w(c, l, h) {
    const x = h ?? new f(3), m = l * 4;
    return x[0] = c[m + 0], x[1] = c[m + 1], x[2] = c[m + 2], x;
  }
  function e(c, l) {
    const h = l ?? new f(3), x = c[0], m = c[1], P = c[2], D = c[4], S = c[5], I = c[6], T = c[8], V = c[9], O = c[10];
    return h[0] = Math.sqrt(x * x + m * m + P * P), h[1] = Math.sqrt(D * D + S * S + I * I), h[2] = Math.sqrt(T * T + V * V + O * O), h;
  }
  function o(c, l, h, x) {
    const m = x ?? new f(3), P = [], D = [];
    return P[0] = c[0] - l[0], P[1] = c[1] - l[1], P[2] = c[2] - l[2], D[0] = P[0], D[1] = P[1] * Math.cos(h) - P[2] * Math.sin(h), D[2] = P[1] * Math.sin(h) + P[2] * Math.cos(h), m[0] = D[0] + l[0], m[1] = D[1] + l[1], m[2] = D[2] + l[2], m;
  }
  function n(c, l, h, x) {
    const m = x ?? new f(3), P = [], D = [];
    return P[0] = c[0] - l[0], P[1] = c[1] - l[1], P[2] = c[2] - l[2], D[0] = P[2] * Math.sin(h) + P[0] * Math.cos(h), D[1] = P[1], D[2] = P[2] * Math.cos(h) - P[0] * Math.sin(h), m[0] = D[0] + l[0], m[1] = D[1] + l[1], m[2] = D[2] + l[2], m;
  }
  function i(c, l, h, x) {
    const m = x ?? new f(3), P = [], D = [];
    return P[0] = c[0] - l[0], P[1] = c[1] - l[1], P[2] = c[2] - l[2], D[0] = P[0] * Math.cos(h) - P[1] * Math.sin(h), D[1] = P[0] * Math.sin(h) + P[1] * Math.cos(h), D[2] = P[2], m[0] = D[0] + l[0], m[1] = D[1] + l[1], m[2] = D[2] + l[2], m;
  }
  function a(c, l, h) {
    const x = h ?? new f(3);
    return se(c, x), H(x, l, x);
  }
  function g(c, l, h) {
    const x = h ?? new f(3);
    return ne(c) > l ? a(c, l, x) : Q(c, x);
  }
  function y(c, l, h) {
    const x = h ?? new f(3);
    return re(c, l, 0.5, x);
  }
  return {
    create: v,
    fromValues: M,
    set: _,
    ceil: U,
    floor: B,
    round: L,
    clamp: k,
    add: G,
    addScaled: b,
    angle: N,
    subtract: F,
    sub: J,
    equalsApproximately: K,
    equals: ue,
    lerp: re,
    lerpV: ae,
    max: te,
    min: j,
    mulScalar: H,
    scale: $,
    divScalar: ie,
    inverse: Z,
    invert: ee,
    cross: q,
    dot: X,
    length: ne,
    len: xe,
    lengthSq: Y,
    lenSq: C,
    distance: A,
    dist: me,
    distanceSq: le,
    distSq: ye,
    normalize: se,
    negate: Ge,
    copy: Q,
    clone: W,
    multiply: ce,
    mul: fe,
    divide: ge,
    div: we,
    random: de,
    zero: r,
    transformMat4: p,
    transformMat4Upper3x3: t,
    transformMat3: s,
    transformQuat: u,
    getTranslation: d,
    getAxis: w,
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
  const v = sn(f), M = Ne(f);
  function _(r, p, t, s, u, d, w, e, o) {
    const n = new f(12);
    return n[3] = 0, n[7] = 0, n[11] = 0, r !== void 0 && (n[0] = r, p !== void 0 && (n[1] = p, t !== void 0 && (n[2] = t, s !== void 0 && (n[4] = s, u !== void 0 && (n[5] = u, d !== void 0 && (n[6] = d, w !== void 0 && (n[8] = w, e !== void 0 && (n[9] = e, o !== void 0 && (n[10] = o))))))))), n;
  }
  function U(r, p, t, s, u, d, w, e, o, n) {
    const i = n ?? new f(12);
    return i[0] = r, i[1] = p, i[2] = t, i[3] = 0, i[4] = s, i[5] = u, i[6] = d, i[7] = 0, i[8] = w, i[9] = e, i[10] = o, i[11] = 0, i;
  }
  function B(r, p) {
    const t = p ?? new f(12);
    return t[0] = r[0], t[1] = r[1], t[2] = r[2], t[3] = 0, t[4] = r[4], t[5] = r[5], t[6] = r[6], t[7] = 0, t[8] = r[8], t[9] = r[9], t[10] = r[10], t[11] = 0, t;
  }
  function L(r, p) {
    const t = p ?? new f(12), s = r[0], u = r[1], d = r[2], w = r[3], e = s + s, o = u + u, n = d + d, i = s * e, a = u * e, g = u * o, y = d * e, c = d * o, l = d * n, h = w * e, x = w * o, m = w * n;
    return t[0] = 1 - g - l, t[1] = a + m, t[2] = y - x, t[3] = 0, t[4] = a - m, t[5] = 1 - i - l, t[6] = c + h, t[7] = 0, t[8] = y + x, t[9] = c - h, t[10] = 1 - i - g, t[11] = 0, t;
  }
  function k(r, p) {
    const t = p ?? new f(12);
    return t[0] = -r[0], t[1] = -r[1], t[2] = -r[2], t[4] = -r[4], t[5] = -r[5], t[6] = -r[6], t[8] = -r[8], t[9] = -r[9], t[10] = -r[10], t;
  }
  function G(r, p) {
    const t = p ?? new f(12);
    return t[0] = r[0], t[1] = r[1], t[2] = r[2], t[4] = r[4], t[5] = r[5], t[6] = r[6], t[8] = r[8], t[9] = r[9], t[10] = r[10], t;
  }
  const b = G;
  function N(r, p) {
    return Math.abs(r[0] - p[0]) < R && Math.abs(r[1] - p[1]) < R && Math.abs(r[2] - p[2]) < R && Math.abs(r[4] - p[4]) < R && Math.abs(r[5] - p[5]) < R && Math.abs(r[6] - p[6]) < R && Math.abs(r[8] - p[8]) < R && Math.abs(r[9] - p[9]) < R && Math.abs(r[10] - p[10]) < R;
  }
  function F(r, p) {
    return r[0] === p[0] && r[1] === p[1] && r[2] === p[2] && r[4] === p[4] && r[5] === p[5] && r[6] === p[6] && r[8] === p[8] && r[9] === p[9] && r[10] === p[10];
  }
  function J(r) {
    const p = r ?? new f(12);
    return p[0] = 1, p[1] = 0, p[2] = 0, p[4] = 0, p[5] = 1, p[6] = 0, p[8] = 0, p[9] = 0, p[10] = 1, p;
  }
  function K(r, p) {
    const t = p ?? new f(12);
    if (t === r) {
      let g;
      return g = r[1], r[1] = r[4], r[4] = g, g = r[2], r[2] = r[8], r[8] = g, g = r[6], r[6] = r[9], r[9] = g, t;
    }
    const s = r[0 * 4 + 0], u = r[0 * 4 + 1], d = r[0 * 4 + 2], w = r[1 * 4 + 0], e = r[1 * 4 + 1], o = r[1 * 4 + 2], n = r[2 * 4 + 0], i = r[2 * 4 + 1], a = r[2 * 4 + 2];
    return t[0] = s, t[1] = w, t[2] = n, t[4] = u, t[5] = e, t[6] = i, t[8] = d, t[9] = o, t[10] = a, t;
  }
  function ue(r, p) {
    const t = p ?? new f(12), s = r[0 * 4 + 0], u = r[0 * 4 + 1], d = r[0 * 4 + 2], w = r[1 * 4 + 0], e = r[1 * 4 + 1], o = r[1 * 4 + 2], n = r[2 * 4 + 0], i = r[2 * 4 + 1], a = r[2 * 4 + 2], g = a * e - o * i, y = -a * w + o * n, c = i * w - e * n, l = 1 / (s * g + u * y + d * c);
    return t[0] = g * l, t[1] = (-a * u + d * i) * l, t[2] = (o * u - d * e) * l, t[4] = y * l, t[5] = (a * s - d * n) * l, t[6] = (-o * s + d * w) * l, t[8] = c * l, t[9] = (-i * s + u * n) * l, t[10] = (e * s - u * w) * l, t;
  }
  function re(r) {
    const p = r[0], t = r[0 * 4 + 1], s = r[0 * 4 + 2], u = r[1 * 4 + 0], d = r[1 * 4 + 1], w = r[1 * 4 + 2], e = r[2 * 4 + 0], o = r[2 * 4 + 1], n = r[2 * 4 + 2];
    return p * (d * n - o * w) - u * (t * n - o * s) + e * (t * w - d * s);
  }
  const ae = ue;
  function te(r, p, t) {
    const s = t ?? new f(12), u = r[0], d = r[1], w = r[2], e = r[4], o = r[5], n = r[6], i = r[8], a = r[9], g = r[10], y = p[0], c = p[1], l = p[2], h = p[4], x = p[5], m = p[6], P = p[8], D = p[9], S = p[10];
    return s[0] = u * y + e * c + i * l, s[1] = d * y + o * c + a * l, s[2] = w * y + n * c + g * l, s[4] = u * h + e * x + i * m, s[5] = d * h + o * x + a * m, s[6] = w * h + n * x + g * m, s[8] = u * P + e * D + i * S, s[9] = d * P + o * D + a * S, s[10] = w * P + n * D + g * S, s;
  }
  const j = te;
  function H(r, p, t) {
    const s = t ?? J();
    return r !== s && (s[0] = r[0], s[1] = r[1], s[2] = r[2], s[4] = r[4], s[5] = r[5], s[6] = r[6]), s[8] = p[0], s[9] = p[1], s[10] = 1, s;
  }
  function $(r, p) {
    const t = p ?? v.create();
    return t[0] = r[8], t[1] = r[9], t;
  }
  function ie(r, p, t) {
    const s = t ?? v.create(), u = p * 4;
    return s[0] = r[u + 0], s[1] = r[u + 1], s;
  }
  function Z(r, p, t, s) {
    const u = s === r ? r : G(r, s), d = t * 4;
    return u[d + 0] = p[0], u[d + 1] = p[1], u;
  }
  function ee(r, p) {
    const t = p ?? v.create(), s = r[0], u = r[1], d = r[4], w = r[5];
    return t[0] = Math.sqrt(s * s + u * u), t[1] = Math.sqrt(d * d + w * w), t;
  }
  function q(r, p) {
    const t = p ?? M.create(), s = r[0], u = r[1], d = r[2], w = r[4], e = r[5], o = r[6], n = r[8], i = r[9], a = r[10];
    return t[0] = Math.sqrt(s * s + u * u + d * d), t[1] = Math.sqrt(w * w + e * e + o * o), t[2] = Math.sqrt(n * n + i * i + a * a), t;
  }
  function X(r, p) {
    const t = p ?? new f(12);
    return t[0] = 1, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[8] = r[0], t[9] = r[1], t[10] = 1, t;
  }
  function ne(r, p, t) {
    const s = t ?? new f(12), u = p[0], d = p[1], w = r[0], e = r[1], o = r[2], n = r[1 * 4 + 0], i = r[1 * 4 + 1], a = r[1 * 4 + 2], g = r[2 * 4 + 0], y = r[2 * 4 + 1], c = r[2 * 4 + 2];
    return r !== s && (s[0] = w, s[1] = e, s[2] = o, s[4] = n, s[5] = i, s[6] = a), s[8] = w * u + n * d + g, s[9] = e * u + i * d + y, s[10] = o * u + a * d + c, s;
  }
  function xe(r, p) {
    const t = p ?? new f(12), s = Math.cos(r), u = Math.sin(r);
    return t[0] = s, t[1] = u, t[2] = 0, t[4] = -u, t[5] = s, t[6] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t;
  }
  function Y(r, p, t) {
    const s = t ?? new f(12), u = r[0 * 4 + 0], d = r[0 * 4 + 1], w = r[0 * 4 + 2], e = r[1 * 4 + 0], o = r[1 * 4 + 1], n = r[1 * 4 + 2], i = Math.cos(p), a = Math.sin(p);
    return s[0] = i * u + a * e, s[1] = i * d + a * o, s[2] = i * w + a * n, s[4] = i * e - a * u, s[5] = i * o - a * d, s[6] = i * n - a * w, r !== s && (s[8] = r[8], s[9] = r[9], s[10] = r[10]), s;
  }
  function C(r, p) {
    const t = p ?? new f(12), s = Math.cos(r), u = Math.sin(r);
    return t[0] = 1, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = s, t[6] = u, t[8] = 0, t[9] = -u, t[10] = s, t;
  }
  function A(r, p, t) {
    const s = t ?? new f(12), u = r[4], d = r[5], w = r[6], e = r[8], o = r[9], n = r[10], i = Math.cos(p), a = Math.sin(p);
    return s[4] = i * u + a * e, s[5] = i * d + a * o, s[6] = i * w + a * n, s[8] = i * e - a * u, s[9] = i * o - a * d, s[10] = i * n - a * w, r !== s && (s[0] = r[0], s[1] = r[1], s[2] = r[2]), s;
  }
  function me(r, p) {
    const t = p ?? new f(12), s = Math.cos(r), u = Math.sin(r);
    return t[0] = s, t[1] = 0, t[2] = -u, t[4] = 0, t[5] = 1, t[6] = 0, t[8] = u, t[9] = 0, t[10] = s, t;
  }
  function le(r, p, t) {
    const s = t ?? new f(12), u = r[0 * 4 + 0], d = r[0 * 4 + 1], w = r[0 * 4 + 2], e = r[2 * 4 + 0], o = r[2 * 4 + 1], n = r[2 * 4 + 2], i = Math.cos(p), a = Math.sin(p);
    return s[0] = i * u - a * e, s[1] = i * d - a * o, s[2] = i * w - a * n, s[8] = i * e + a * u, s[9] = i * o + a * d, s[10] = i * n + a * w, r !== s && (s[4] = r[4], s[5] = r[5], s[6] = r[6]), s;
  }
  const ye = xe, se = Y;
  function Ge(r, p) {
    const t = p ?? new f(12);
    return t[0] = r[0], t[1] = 0, t[2] = 0, t[4] = 0, t[5] = r[1], t[6] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t;
  }
  function Q(r, p, t) {
    const s = t ?? new f(12), u = p[0], d = p[1];
    return s[0] = u * r[0 * 4 + 0], s[1] = u * r[0 * 4 + 1], s[2] = u * r[0 * 4 + 2], s[4] = d * r[1 * 4 + 0], s[5] = d * r[1 * 4 + 1], s[6] = d * r[1 * 4 + 2], r !== s && (s[8] = r[8], s[9] = r[9], s[10] = r[10]), s;
  }
  function W(r, p) {
    const t = p ?? new f(12);
    return t[0] = r[0], t[1] = 0, t[2] = 0, t[4] = 0, t[5] = r[1], t[6] = 0, t[8] = 0, t[9] = 0, t[10] = r[2], t;
  }
  function ce(r, p, t) {
    const s = t ?? new f(12), u = p[0], d = p[1], w = p[2];
    return s[0] = u * r[0 * 4 + 0], s[1] = u * r[0 * 4 + 1], s[2] = u * r[0 * 4 + 2], s[4] = d * r[1 * 4 + 0], s[5] = d * r[1 * 4 + 1], s[6] = d * r[1 * 4 + 2], s[8] = w * r[2 * 4 + 0], s[9] = w * r[2 * 4 + 1], s[10] = w * r[2 * 4 + 2], s;
  }
  function fe(r, p) {
    const t = p ?? new f(12);
    return t[0] = r, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = r, t[6] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t;
  }
  function ge(r, p, t) {
    const s = t ?? new f(12);
    return s[0] = p * r[0 * 4 + 0], s[1] = p * r[0 * 4 + 1], s[2] = p * r[0 * 4 + 2], s[4] = p * r[1 * 4 + 0], s[5] = p * r[1 * 4 + 1], s[6] = p * r[1 * 4 + 2], r !== s && (s[8] = r[8], s[9] = r[9], s[10] = r[10]), s;
  }
  function we(r, p) {
    const t = p ?? new f(12);
    return t[0] = r, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = r, t[6] = 0, t[8] = 0, t[9] = 0, t[10] = r, t;
  }
  function de(r, p, t) {
    const s = t ?? new f(12);
    return s[0] = p * r[0 * 4 + 0], s[1] = p * r[0 * 4 + 1], s[2] = p * r[0 * 4 + 2], s[4] = p * r[1 * 4 + 0], s[5] = p * r[1 * 4 + 1], s[6] = p * r[1 * 4 + 2], s[8] = p * r[2 * 4 + 0], s[9] = p * r[2 * 4 + 1], s[10] = p * r[2 * 4 + 2], s;
  }
  return {
    clone: b,
    create: _,
    set: U,
    fromMat4: B,
    fromQuat: L,
    negate: k,
    copy: G,
    equalsApproximately: N,
    equals: F,
    identity: J,
    transpose: K,
    inverse: ue,
    invert: ae,
    determinant: re,
    mul: j,
    multiply: te,
    setTranslation: H,
    getTranslation: $,
    getAxis: ie,
    setAxis: Z,
    getScaling: ee,
    get3DScaling: q,
    translation: X,
    translate: ne,
    rotation: xe,
    rotate: Y,
    rotationX: C,
    rotateX: A,
    rotationY: me,
    rotateY: le,
    rotationZ: ye,
    rotateZ: se,
    scaling: Ge,
    scale: Q,
    uniformScaling: fe,
    uniformScale: ge,
    scaling3D: W,
    scale3D: ce,
    uniformScaling3D: we,
    uniformScale3D: de
  };
}
const en = /* @__PURE__ */ new Map();
function pn(f) {
  let v = en.get(f);
  return v || (v = dn(f), en.set(f, v)), v;
}
function hn(f) {
  const v = Ne(f);
  function M(e, o, n, i, a, g, y, c, l, h, x, m, P, D, S, I) {
    const T = new f(16);
    return e !== void 0 && (T[0] = e, o !== void 0 && (T[1] = o, n !== void 0 && (T[2] = n, i !== void 0 && (T[3] = i, a !== void 0 && (T[4] = a, g !== void 0 && (T[5] = g, y !== void 0 && (T[6] = y, c !== void 0 && (T[7] = c, l !== void 0 && (T[8] = l, h !== void 0 && (T[9] = h, x !== void 0 && (T[10] = x, m !== void 0 && (T[11] = m, P !== void 0 && (T[12] = P, D !== void 0 && (T[13] = D, S !== void 0 && (T[14] = S, I !== void 0 && (T[15] = I)))))))))))))))), T;
  }
  function _(e, o, n, i, a, g, y, c, l, h, x, m, P, D, S, I, T) {
    const V = T ?? new f(16);
    return V[0] = e, V[1] = o, V[2] = n, V[3] = i, V[4] = a, V[5] = g, V[6] = y, V[7] = c, V[8] = l, V[9] = h, V[10] = x, V[11] = m, V[12] = P, V[13] = D, V[14] = S, V[15] = I, V;
  }
  function U(e, o) {
    const n = o ?? new f(16);
    return n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = 0, n[4] = e[4], n[5] = e[5], n[6] = e[6], n[7] = 0, n[8] = e[8], n[9] = e[9], n[10] = e[10], n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function B(e, o) {
    const n = o ?? new f(16), i = e[0], a = e[1], g = e[2], y = e[3], c = i + i, l = a + a, h = g + g, x = i * c, m = a * c, P = a * l, D = g * c, S = g * l, I = g * h, T = y * c, V = y * l, O = y * h;
    return n[0] = 1 - P - I, n[1] = m + O, n[2] = D - V, n[3] = 0, n[4] = m - O, n[5] = 1 - x - I, n[6] = S + T, n[7] = 0, n[8] = D + V, n[9] = S - T, n[10] = 1 - x - P, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function L(e, o) {
    const n = o ?? new f(16);
    return n[0] = -e[0], n[1] = -e[1], n[2] = -e[2], n[3] = -e[3], n[4] = -e[4], n[5] = -e[5], n[6] = -e[6], n[7] = -e[7], n[8] = -e[8], n[9] = -e[9], n[10] = -e[10], n[11] = -e[11], n[12] = -e[12], n[13] = -e[13], n[14] = -e[14], n[15] = -e[15], n;
  }
  function k(e, o) {
    const n = o ?? new f(16);
    return n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = e[3], n[4] = e[4], n[5] = e[5], n[6] = e[6], n[7] = e[7], n[8] = e[8], n[9] = e[9], n[10] = e[10], n[11] = e[11], n[12] = e[12], n[13] = e[13], n[14] = e[14], n[15] = e[15], n;
  }
  const G = k;
  function b(e, o) {
    return Math.abs(e[0] - o[0]) < R && Math.abs(e[1] - o[1]) < R && Math.abs(e[2] - o[2]) < R && Math.abs(e[3] - o[3]) < R && Math.abs(e[4] - o[4]) < R && Math.abs(e[5] - o[5]) < R && Math.abs(e[6] - o[6]) < R && Math.abs(e[7] - o[7]) < R && Math.abs(e[8] - o[8]) < R && Math.abs(e[9] - o[9]) < R && Math.abs(e[10] - o[10]) < R && Math.abs(e[11] - o[11]) < R && Math.abs(e[12] - o[12]) < R && Math.abs(e[13] - o[13]) < R && Math.abs(e[14] - o[14]) < R && Math.abs(e[15] - o[15]) < R;
  }
  function N(e, o) {
    return e[0] === o[0] && e[1] === o[1] && e[2] === o[2] && e[3] === o[3] && e[4] === o[4] && e[5] === o[5] && e[6] === o[6] && e[7] === o[7] && e[8] === o[8] && e[9] === o[9] && e[10] === o[10] && e[11] === o[11] && e[12] === o[12] && e[13] === o[13] && e[14] === o[14] && e[15] === o[15];
  }
  function F(e) {
    const o = e ?? new f(16);
    return o[0] = 1, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = 1, o[6] = 0, o[7] = 0, o[8] = 0, o[9] = 0, o[10] = 1, o[11] = 0, o[12] = 0, o[13] = 0, o[14] = 0, o[15] = 1, o;
  }
  function J(e, o) {
    const n = o ?? new f(16);
    if (n === e) {
      let E;
      return E = e[1], e[1] = e[4], e[4] = E, E = e[2], e[2] = e[8], e[8] = E, E = e[3], e[3] = e[12], e[12] = E, E = e[6], e[6] = e[9], e[9] = E, E = e[7], e[7] = e[13], e[13] = E, E = e[11], e[11] = e[14], e[14] = E, n;
    }
    const i = e[0 * 4 + 0], a = e[0 * 4 + 1], g = e[0 * 4 + 2], y = e[0 * 4 + 3], c = e[1 * 4 + 0], l = e[1 * 4 + 1], h = e[1 * 4 + 2], x = e[1 * 4 + 3], m = e[2 * 4 + 0], P = e[2 * 4 + 1], D = e[2 * 4 + 2], S = e[2 * 4 + 3], I = e[3 * 4 + 0], T = e[3 * 4 + 1], V = e[3 * 4 + 2], O = e[3 * 4 + 3];
    return n[0] = i, n[1] = c, n[2] = m, n[3] = I, n[4] = a, n[5] = l, n[6] = P, n[7] = T, n[8] = g, n[9] = h, n[10] = D, n[11] = V, n[12] = y, n[13] = x, n[14] = S, n[15] = O, n;
  }
  function K(e, o) {
    const n = o ?? new f(16), i = e[0 * 4 + 0], a = e[0 * 4 + 1], g = e[0 * 4 + 2], y = e[0 * 4 + 3], c = e[1 * 4 + 0], l = e[1 * 4 + 1], h = e[1 * 4 + 2], x = e[1 * 4 + 3], m = e[2 * 4 + 0], P = e[2 * 4 + 1], D = e[2 * 4 + 2], S = e[2 * 4 + 3], I = e[3 * 4 + 0], T = e[3 * 4 + 1], V = e[3 * 4 + 2], O = e[3 * 4 + 3], E = D * O, oe = V * S, pe = h * O, he = V * x, ve = h * S, Pe = D * x, De = g * O, Me = V * y, ze = g * S, be = D * y, Te = g * x, Se = h * y, Ve = m * T, _e = I * P, Fe = c * T, Ue = I * l, Ie = c * P, Re = m * l, Oe = i * T, Le = I * a, We = i * P, He = m * a, qe = i * l, Ee = c * a, Ce = E * l + he * P + ve * T - (oe * l + pe * P + Pe * T), $e = oe * a + De * P + be * T - (E * a + Me * P + ze * T), Ze = pe * a + Me * l + Te * T - (he * a + De * l + Se * T), Qe = Pe * a + ze * l + Se * P - (ve * a + be * l + Te * P), Be = 1 / (i * Ce + c * $e + m * Ze + I * Qe);
    return n[0] = Be * Ce, n[1] = Be * $e, n[2] = Be * Ze, n[3] = Be * Qe, n[4] = Be * (oe * c + pe * m + Pe * I - (E * c + he * m + ve * I)), n[5] = Be * (E * i + Me * m + ze * I - (oe * i + De * m + be * I)), n[6] = Be * (he * i + De * c + Se * I - (pe * i + Me * c + Te * I)), n[7] = Be * (ve * i + be * c + Te * m - (Pe * i + ze * c + Se * m)), n[8] = Be * (Ve * x + Ue * S + Ie * O - (_e * x + Fe * S + Re * O)), n[9] = Be * (_e * y + Oe * S + He * O - (Ve * y + Le * S + We * O)), n[10] = Be * (Fe * y + Le * x + qe * O - (Ue * y + Oe * x + Ee * O)), n[11] = Be * (Re * y + We * x + Ee * S - (Ie * y + He * x + qe * S)), n[12] = Be * (Fe * D + Re * V + _e * h - (Ie * V + Ve * h + Ue * D)), n[13] = Be * (We * V + Ve * g + Le * D - (Oe * D + He * V + _e * g)), n[14] = Be * (Oe * h + Ee * V + Ue * g - (qe * V + Fe * g + Le * h)), n[15] = Be * (qe * D + Ie * g + He * h - (We * h + Ee * D + Re * g)), n;
  }
  function ue(e) {
    const o = e[0], n = e[0 * 4 + 1], i = e[0 * 4 + 2], a = e[0 * 4 + 3], g = e[1 * 4 + 0], y = e[1 * 4 + 1], c = e[1 * 4 + 2], l = e[1 * 4 + 3], h = e[2 * 4 + 0], x = e[2 * 4 + 1], m = e[2 * 4 + 2], P = e[2 * 4 + 3], D = e[3 * 4 + 0], S = e[3 * 4 + 1], I = e[3 * 4 + 2], T = e[3 * 4 + 3], V = m * T, O = I * P, E = c * T, oe = I * l, pe = c * P, he = m * l, ve = i * T, Pe = I * a, De = i * P, Me = m * a, ze = i * l, be = c * a, Te = V * y + oe * x + pe * S - (O * y + E * x + he * S), Se = O * n + ve * x + Me * S - (V * n + Pe * x + De * S), Ve = E * n + Pe * y + ze * S - (oe * n + ve * y + be * S), _e = he * n + De * y + be * x - (pe * n + Me * y + ze * x);
    return o * Te + g * Se + h * Ve + D * _e;
  }
  const re = K;
  function ae(e, o, n) {
    const i = n ?? new f(16), a = e[0], g = e[1], y = e[2], c = e[3], l = e[4], h = e[5], x = e[6], m = e[7], P = e[8], D = e[9], S = e[10], I = e[11], T = e[12], V = e[13], O = e[14], E = e[15], oe = o[0], pe = o[1], he = o[2], ve = o[3], Pe = o[4], De = o[5], Me = o[6], ze = o[7], be = o[8], Te = o[9], Se = o[10], Ve = o[11], _e = o[12], Fe = o[13], Ue = o[14], Ie = o[15];
    return i[0] = a * oe + l * pe + P * he + T * ve, i[1] = g * oe + h * pe + D * he + V * ve, i[2] = y * oe + x * pe + S * he + O * ve, i[3] = c * oe + m * pe + I * he + E * ve, i[4] = a * Pe + l * De + P * Me + T * ze, i[5] = g * Pe + h * De + D * Me + V * ze, i[6] = y * Pe + x * De + S * Me + O * ze, i[7] = c * Pe + m * De + I * Me + E * ze, i[8] = a * be + l * Te + P * Se + T * Ve, i[9] = g * be + h * Te + D * Se + V * Ve, i[10] = y * be + x * Te + S * Se + O * Ve, i[11] = c * be + m * Te + I * Se + E * Ve, i[12] = a * _e + l * Fe + P * Ue + T * Ie, i[13] = g * _e + h * Fe + D * Ue + V * Ie, i[14] = y * _e + x * Fe + S * Ue + O * Ie, i[15] = c * _e + m * Fe + I * Ue + E * Ie, i;
  }
  const te = ae;
  function j(e, o, n) {
    const i = n ?? F();
    return e !== i && (i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[3], i[4] = e[4], i[5] = e[5], i[6] = e[6], i[7] = e[7], i[8] = e[8], i[9] = e[9], i[10] = e[10], i[11] = e[11]), i[12] = o[0], i[13] = o[1], i[14] = o[2], i[15] = 1, i;
  }
  function H(e, o) {
    const n = o ?? v.create();
    return n[0] = e[12], n[1] = e[13], n[2] = e[14], n;
  }
  function $(e, o, n) {
    const i = n ?? v.create(), a = o * 4;
    return i[0] = e[a + 0], i[1] = e[a + 1], i[2] = e[a + 2], i;
  }
  function ie(e, o, n, i) {
    const a = i === e ? i : k(e, i), g = n * 4;
    return a[g + 0] = o[0], a[g + 1] = o[1], a[g + 2] = o[2], a;
  }
  function Z(e, o) {
    const n = o ?? v.create(), i = e[0], a = e[1], g = e[2], y = e[4], c = e[5], l = e[6], h = e[8], x = e[9], m = e[10];
    return n[0] = Math.sqrt(i * i + a * a + g * g), n[1] = Math.sqrt(y * y + c * c + l * l), n[2] = Math.sqrt(h * h + x * x + m * m), n;
  }
  function ee(e, o, n, i, a) {
    const g = a ?? new f(16), y = Math.tan(Math.PI * 0.5 - 0.5 * e);
    if (g[0] = y / o, g[1] = 0, g[2] = 0, g[3] = 0, g[4] = 0, g[5] = y, g[6] = 0, g[7] = 0, g[8] = 0, g[9] = 0, g[11] = -1, g[12] = 0, g[13] = 0, g[15] = 0, Number.isFinite(i)) {
      const c = 1 / (n - i);
      g[10] = i * c, g[14] = i * n * c;
    } else
      g[10] = -1, g[14] = -n;
    return g;
  }
  function q(e, o, n, i = 1 / 0, a) {
    const g = a ?? new f(16), y = 1 / Math.tan(e * 0.5);
    if (g[0] = y / o, g[1] = 0, g[2] = 0, g[3] = 0, g[4] = 0, g[5] = y, g[6] = 0, g[7] = 0, g[8] = 0, g[9] = 0, g[11] = -1, g[12] = 0, g[13] = 0, g[15] = 0, i === 1 / 0)
      g[10] = 0, g[14] = n;
    else {
      const c = 1 / (i - n);
      g[10] = n * c, g[14] = i * n * c;
    }
    return g;
  }
  function X(e, o, n, i, a, g, y) {
    const c = y ?? new f(16);
    return c[0] = 2 / (o - e), c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 2 / (i - n), c[6] = 0, c[7] = 0, c[8] = 0, c[9] = 0, c[10] = 1 / (a - g), c[11] = 0, c[12] = (o + e) / (e - o), c[13] = (i + n) / (n - i), c[14] = a / (a - g), c[15] = 1, c;
  }
  function ne(e, o, n, i, a, g, y) {
    const c = y ?? new f(16), l = o - e, h = i - n, x = a - g;
    return c[0] = 2 * a / l, c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 2 * a / h, c[6] = 0, c[7] = 0, c[8] = (e + o) / l, c[9] = (i + n) / h, c[10] = g / x, c[11] = -1, c[12] = 0, c[13] = 0, c[14] = a * g / x, c[15] = 0, c;
  }
  function xe(e, o, n, i, a, g = 1 / 0, y) {
    const c = y ?? new f(16), l = o - e, h = i - n;
    if (c[0] = 2 * a / l, c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 2 * a / h, c[6] = 0, c[7] = 0, c[8] = (e + o) / l, c[9] = (i + n) / h, c[11] = -1, c[12] = 0, c[13] = 0, c[15] = 0, g === 1 / 0)
      c[10] = 0, c[14] = a;
    else {
      const x = 1 / (g - a);
      c[10] = a * x, c[14] = g * a * x;
    }
    return c;
  }
  const Y = v.create(), C = v.create(), A = v.create();
  function me(e, o, n, i) {
    const a = i ?? new f(16);
    return v.normalize(v.subtract(o, e, A), A), v.normalize(v.cross(n, A, Y), Y), v.normalize(v.cross(A, Y, C), C), a[0] = Y[0], a[1] = Y[1], a[2] = Y[2], a[3] = 0, a[4] = C[0], a[5] = C[1], a[6] = C[2], a[7] = 0, a[8] = A[0], a[9] = A[1], a[10] = A[2], a[11] = 0, a[12] = e[0], a[13] = e[1], a[14] = e[2], a[15] = 1, a;
  }
  function le(e, o, n, i) {
    const a = i ?? new f(16);
    return v.normalize(v.subtract(e, o, A), A), v.normalize(v.cross(n, A, Y), Y), v.normalize(v.cross(A, Y, C), C), a[0] = Y[0], a[1] = Y[1], a[2] = Y[2], a[3] = 0, a[4] = C[0], a[5] = C[1], a[6] = C[2], a[7] = 0, a[8] = A[0], a[9] = A[1], a[10] = A[2], a[11] = 0, a[12] = e[0], a[13] = e[1], a[14] = e[2], a[15] = 1, a;
  }
  function ye(e, o, n, i) {
    const a = i ?? new f(16);
    return v.normalize(v.subtract(e, o, A), A), v.normalize(v.cross(n, A, Y), Y), v.normalize(v.cross(A, Y, C), C), a[0] = Y[0], a[1] = C[0], a[2] = A[0], a[3] = 0, a[4] = Y[1], a[5] = C[1], a[6] = A[1], a[7] = 0, a[8] = Y[2], a[9] = C[2], a[10] = A[2], a[11] = 0, a[12] = -(Y[0] * e[0] + Y[1] * e[1] + Y[2] * e[2]), a[13] = -(C[0] * e[0] + C[1] * e[1] + C[2] * e[2]), a[14] = -(A[0] * e[0] + A[1] * e[1] + A[2] * e[2]), a[15] = 1, a;
  }
  function se(e, o) {
    const n = o ?? new f(16);
    return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = e[0], n[13] = e[1], n[14] = e[2], n[15] = 1, n;
  }
  function Ge(e, o, n) {
    const i = n ?? new f(16), a = o[0], g = o[1], y = o[2], c = e[0], l = e[1], h = e[2], x = e[3], m = e[1 * 4 + 0], P = e[1 * 4 + 1], D = e[1 * 4 + 2], S = e[1 * 4 + 3], I = e[2 * 4 + 0], T = e[2 * 4 + 1], V = e[2 * 4 + 2], O = e[2 * 4 + 3], E = e[3 * 4 + 0], oe = e[3 * 4 + 1], pe = e[3 * 4 + 2], he = e[3 * 4 + 3];
    return e !== i && (i[0] = c, i[1] = l, i[2] = h, i[3] = x, i[4] = m, i[5] = P, i[6] = D, i[7] = S, i[8] = I, i[9] = T, i[10] = V, i[11] = O), i[12] = c * a + m * g + I * y + E, i[13] = l * a + P * g + T * y + oe, i[14] = h * a + D * g + V * y + pe, i[15] = x * a + S * g + O * y + he, i;
  }
  function Q(e, o) {
    const n = o ?? new f(16), i = Math.cos(e), a = Math.sin(e);
    return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = i, n[6] = a, n[7] = 0, n[8] = 0, n[9] = -a, n[10] = i, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function W(e, o, n) {
    const i = n ?? new f(16), a = e[4], g = e[5], y = e[6], c = e[7], l = e[8], h = e[9], x = e[10], m = e[11], P = Math.cos(o), D = Math.sin(o);
    return i[4] = P * a + D * l, i[5] = P * g + D * h, i[6] = P * y + D * x, i[7] = P * c + D * m, i[8] = P * l - D * a, i[9] = P * h - D * g, i[10] = P * x - D * y, i[11] = P * m - D * c, e !== i && (i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[3], i[12] = e[12], i[13] = e[13], i[14] = e[14], i[15] = e[15]), i;
  }
  function ce(e, o) {
    const n = o ?? new f(16), i = Math.cos(e), a = Math.sin(e);
    return n[0] = i, n[1] = 0, n[2] = -a, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = a, n[9] = 0, n[10] = i, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function fe(e, o, n) {
    const i = n ?? new f(16), a = e[0 * 4 + 0], g = e[0 * 4 + 1], y = e[0 * 4 + 2], c = e[0 * 4 + 3], l = e[2 * 4 + 0], h = e[2 * 4 + 1], x = e[2 * 4 + 2], m = e[2 * 4 + 3], P = Math.cos(o), D = Math.sin(o);
    return i[0] = P * a - D * l, i[1] = P * g - D * h, i[2] = P * y - D * x, i[3] = P * c - D * m, i[8] = P * l + D * a, i[9] = P * h + D * g, i[10] = P * x + D * y, i[11] = P * m + D * c, e !== i && (i[4] = e[4], i[5] = e[5], i[6] = e[6], i[7] = e[7], i[12] = e[12], i[13] = e[13], i[14] = e[14], i[15] = e[15]), i;
  }
  function ge(e, o) {
    const n = o ?? new f(16), i = Math.cos(e), a = Math.sin(e);
    return n[0] = i, n[1] = a, n[2] = 0, n[3] = 0, n[4] = -a, n[5] = i, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function we(e, o, n) {
    const i = n ?? new f(16), a = e[0 * 4 + 0], g = e[0 * 4 + 1], y = e[0 * 4 + 2], c = e[0 * 4 + 3], l = e[1 * 4 + 0], h = e[1 * 4 + 1], x = e[1 * 4 + 2], m = e[1 * 4 + 3], P = Math.cos(o), D = Math.sin(o);
    return i[0] = P * a + D * l, i[1] = P * g + D * h, i[2] = P * y + D * x, i[3] = P * c + D * m, i[4] = P * l - D * a, i[5] = P * h - D * g, i[6] = P * x - D * y, i[7] = P * m - D * c, e !== i && (i[8] = e[8], i[9] = e[9], i[10] = e[10], i[11] = e[11], i[12] = e[12], i[13] = e[13], i[14] = e[14], i[15] = e[15]), i;
  }
  function de(e, o, n) {
    const i = n ?? new f(16);
    let a = e[0], g = e[1], y = e[2];
    const c = Math.sqrt(a * a + g * g + y * y);
    a /= c, g /= c, y /= c;
    const l = a * a, h = g * g, x = y * y, m = Math.cos(o), P = Math.sin(o), D = 1 - m;
    return i[0] = l + (1 - l) * m, i[1] = a * g * D + y * P, i[2] = a * y * D - g * P, i[3] = 0, i[4] = a * g * D - y * P, i[5] = h + (1 - h) * m, i[6] = g * y * D + a * P, i[7] = 0, i[8] = a * y * D + g * P, i[9] = g * y * D - a * P, i[10] = x + (1 - x) * m, i[11] = 0, i[12] = 0, i[13] = 0, i[14] = 0, i[15] = 1, i;
  }
  const r = de;
  function p(e, o, n, i) {
    const a = i ?? new f(16);
    let g = o[0], y = o[1], c = o[2];
    const l = Math.sqrt(g * g + y * y + c * c);
    g /= l, y /= l, c /= l;
    const h = g * g, x = y * y, m = c * c, P = Math.cos(n), D = Math.sin(n), S = 1 - P, I = h + (1 - h) * P, T = g * y * S + c * D, V = g * c * S - y * D, O = g * y * S - c * D, E = x + (1 - x) * P, oe = y * c * S + g * D, pe = g * c * S + y * D, he = y * c * S - g * D, ve = m + (1 - m) * P, Pe = e[0], De = e[1], Me = e[2], ze = e[3], be = e[4], Te = e[5], Se = e[6], Ve = e[7], _e = e[8], Fe = e[9], Ue = e[10], Ie = e[11];
    return a[0] = I * Pe + T * be + V * _e, a[1] = I * De + T * Te + V * Fe, a[2] = I * Me + T * Se + V * Ue, a[3] = I * ze + T * Ve + V * Ie, a[4] = O * Pe + E * be + oe * _e, a[5] = O * De + E * Te + oe * Fe, a[6] = O * Me + E * Se + oe * Ue, a[7] = O * ze + E * Ve + oe * Ie, a[8] = pe * Pe + he * be + ve * _e, a[9] = pe * De + he * Te + ve * Fe, a[10] = pe * Me + he * Se + ve * Ue, a[11] = pe * ze + he * Ve + ve * Ie, e !== a && (a[12] = e[12], a[13] = e[13], a[14] = e[14], a[15] = e[15]), a;
  }
  const t = p;
  function s(e, o) {
    const n = o ?? new f(16);
    return n[0] = e[0], n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = e[1], n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = e[2], n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function u(e, o, n) {
    const i = n ?? new f(16), a = o[0], g = o[1], y = o[2];
    return i[0] = a * e[0 * 4 + 0], i[1] = a * e[0 * 4 + 1], i[2] = a * e[0 * 4 + 2], i[3] = a * e[0 * 4 + 3], i[4] = g * e[1 * 4 + 0], i[5] = g * e[1 * 4 + 1], i[6] = g * e[1 * 4 + 2], i[7] = g * e[1 * 4 + 3], i[8] = y * e[2 * 4 + 0], i[9] = y * e[2 * 4 + 1], i[10] = y * e[2 * 4 + 2], i[11] = y * e[2 * 4 + 3], e !== i && (i[12] = e[12], i[13] = e[13], i[14] = e[14], i[15] = e[15]), i;
  }
  function d(e, o) {
    const n = o ?? new f(16);
    return n[0] = e, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = e, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = e, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
  }
  function w(e, o, n) {
    const i = n ?? new f(16);
    return i[0] = o * e[0 * 4 + 0], i[1] = o * e[0 * 4 + 1], i[2] = o * e[0 * 4 + 2], i[3] = o * e[0 * 4 + 3], i[4] = o * e[1 * 4 + 0], i[5] = o * e[1 * 4 + 1], i[6] = o * e[1 * 4 + 2], i[7] = o * e[1 * 4 + 3], i[8] = o * e[2 * 4 + 0], i[9] = o * e[2 * 4 + 1], i[10] = o * e[2 * 4 + 2], i[11] = o * e[2 * 4 + 3], e !== i && (i[12] = e[12], i[13] = e[13], i[14] = e[14], i[15] = e[15]), i;
  }
  return {
    create: M,
    set: _,
    fromMat3: U,
    fromQuat: B,
    negate: L,
    copy: k,
    clone: G,
    equalsApproximately: b,
    equals: N,
    identity: F,
    transpose: J,
    inverse: K,
    determinant: ue,
    invert: re,
    multiply: ae,
    mul: te,
    setTranslation: j,
    getTranslation: H,
    getAxis: $,
    setAxis: ie,
    getScaling: Z,
    perspective: ee,
    perspectiveReverseZ: q,
    ortho: X,
    frustum: ne,
    frustumReverseZ: xe,
    aim: me,
    cameraAim: le,
    lookAt: ye,
    translation: se,
    translate: Ge,
    rotationX: Q,
    rotateX: W,
    rotationY: ce,
    rotateY: fe,
    rotationZ: ge,
    rotateZ: we,
    axisRotation: de,
    rotation: r,
    axisRotate: p,
    rotate: t,
    scaling: s,
    scale: u,
    uniformScaling: d,
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
  function M(r, p, t, s) {
    const u = new f(4);
    return r !== void 0 && (u[0] = r, p !== void 0 && (u[1] = p, t !== void 0 && (u[2] = t, s !== void 0 && (u[3] = s)))), u;
  }
  const _ = M;
  function U(r, p, t, s, u) {
    const d = u ?? new f(4);
    return d[0] = r, d[1] = p, d[2] = t, d[3] = s, d;
  }
  function B(r, p, t) {
    const s = t ?? new f(4), u = p * 0.5, d = Math.sin(u);
    return s[0] = d * r[0], s[1] = d * r[1], s[2] = d * r[2], s[3] = Math.cos(u), s;
  }
  function L(r, p) {
    const t = p ?? v.create(3), s = Math.acos(r[3]) * 2, u = Math.sin(s * 0.5);
    return u > R ? (t[0] = r[0] / u, t[1] = r[1] / u, t[2] = r[2] / u) : (t[0] = 1, t[1] = 0, t[2] = 0), { angle: s, axis: t };
  }
  function k(r, p) {
    const t = ne(r, p);
    return Math.acos(2 * t * t - 1);
  }
  function G(r, p, t) {
    const s = t ?? new f(4), u = r[0], d = r[1], w = r[2], e = r[3], o = p[0], n = p[1], i = p[2], a = p[3];
    return s[0] = u * a + e * o + d * i - w * n, s[1] = d * a + e * n + w * o - u * i, s[2] = w * a + e * i + u * n - d * o, s[3] = e * a - u * o - d * n - w * i, s;
  }
  const b = G;
  function N(r, p, t) {
    const s = t ?? new f(4), u = p * 0.5, d = r[0], w = r[1], e = r[2], o = r[3], n = Math.sin(u), i = Math.cos(u);
    return s[0] = d * i + o * n, s[1] = w * i + e * n, s[2] = e * i - w * n, s[3] = o * i - d * n, s;
  }
  function F(r, p, t) {
    const s = t ?? new f(4), u = p * 0.5, d = r[0], w = r[1], e = r[2], o = r[3], n = Math.sin(u), i = Math.cos(u);
    return s[0] = d * i - e * n, s[1] = w * i + o * n, s[2] = e * i + d * n, s[3] = o * i - w * n, s;
  }
  function J(r, p, t) {
    const s = t ?? new f(4), u = p * 0.5, d = r[0], w = r[1], e = r[2], o = r[3], n = Math.sin(u), i = Math.cos(u);
    return s[0] = d * i + w * n, s[1] = w * i - d * n, s[2] = e * i + o * n, s[3] = o * i - e * n, s;
  }
  function K(r, p, t, s) {
    const u = s ?? new f(4), d = r[0], w = r[1], e = r[2], o = r[3];
    let n = p[0], i = p[1], a = p[2], g = p[3], y = d * n + w * i + e * a + o * g;
    y < 0 && (y = -y, n = -n, i = -i, a = -a, g = -g);
    let c, l;
    if (1 - y > R) {
      const h = Math.acos(y), x = Math.sin(h);
      c = Math.sin((1 - t) * h) / x, l = Math.sin(t * h) / x;
    } else
      c = 1 - t, l = t;
    return u[0] = c * d + l * n, u[1] = c * w + l * i, u[2] = c * e + l * a, u[3] = c * o + l * g, u;
  }
  function ue(r, p) {
    const t = p ?? new f(4), s = r[0], u = r[1], d = r[2], w = r[3], e = s * s + u * u + d * d + w * w, o = e ? 1 / e : 0;
    return t[0] = -s * o, t[1] = -u * o, t[2] = -d * o, t[3] = w * o, t;
  }
  function re(r, p) {
    const t = p ?? new f(4);
    return t[0] = -r[0], t[1] = -r[1], t[2] = -r[2], t[3] = r[3], t;
  }
  function ae(r, p) {
    const t = p ?? new f(4), s = r[0] + r[5] + r[10];
    if (s > 0) {
      const u = Math.sqrt(s + 1);
      t[3] = 0.5 * u;
      const d = 0.5 / u;
      t[0] = (r[6] - r[9]) * d, t[1] = (r[8] - r[2]) * d, t[2] = (r[1] - r[4]) * d;
    } else {
      let u = 0;
      r[5] > r[0] && (u = 1), r[10] > r[u * 4 + u] && (u = 2);
      const d = (u + 1) % 3, w = (u + 2) % 3, e = Math.sqrt(r[u * 4 + u] - r[d * 4 + d] - r[w * 4 + w] + 1);
      t[u] = 0.5 * e;
      const o = 0.5 / e;
      t[3] = (r[d * 4 + w] - r[w * 4 + d]) * o, t[d] = (r[d * 4 + u] + r[u * 4 + d]) * o, t[w] = (r[w * 4 + u] + r[u * 4 + w]) * o;
    }
    return t;
  }
  function te(r, p, t, s, u) {
    const d = u ?? new f(4), w = r * 0.5, e = p * 0.5, o = t * 0.5, n = Math.sin(w), i = Math.cos(w), a = Math.sin(e), g = Math.cos(e), y = Math.sin(o), c = Math.cos(o);
    switch (s) {
      case "xyz":
        d[0] = n * g * c + i * a * y, d[1] = i * a * c - n * g * y, d[2] = i * g * y + n * a * c, d[3] = i * g * c - n * a * y;
        break;
      case "xzy":
        d[0] = n * g * c - i * a * y, d[1] = i * a * c - n * g * y, d[2] = i * g * y + n * a * c, d[3] = i * g * c + n * a * y;
        break;
      case "yxz":
        d[0] = n * g * c + i * a * y, d[1] = i * a * c - n * g * y, d[2] = i * g * y - n * a * c, d[3] = i * g * c + n * a * y;
        break;
      case "yzx":
        d[0] = n * g * c + i * a * y, d[1] = i * a * c + n * g * y, d[2] = i * g * y - n * a * c, d[3] = i * g * c - n * a * y;
        break;
      case "zxy":
        d[0] = n * g * c - i * a * y, d[1] = i * a * c + n * g * y, d[2] = i * g * y + n * a * c, d[3] = i * g * c - n * a * y;
        break;
      case "zyx":
        d[0] = n * g * c - i * a * y, d[1] = i * a * c + n * g * y, d[2] = i * g * y - n * a * c, d[3] = i * g * c + n * a * y;
        break;
      default:
        throw new Error(`Unknown rotation order: ${s}`);
    }
    return d;
  }
  function j(r, p) {
    const t = p ?? new f(4);
    return t[0] = r[0], t[1] = r[1], t[2] = r[2], t[3] = r[3], t;
  }
  const H = j;
  function $(r, p, t) {
    const s = t ?? new f(4);
    return s[0] = r[0] + p[0], s[1] = r[1] + p[1], s[2] = r[2] + p[2], s[3] = r[3] + p[3], s;
  }
  function ie(r, p, t) {
    const s = t ?? new f(4);
    return s[0] = r[0] - p[0], s[1] = r[1] - p[1], s[2] = r[2] - p[2], s[3] = r[3] - p[3], s;
  }
  const Z = ie;
  function ee(r, p, t) {
    const s = t ?? new f(4);
    return s[0] = r[0] * p, s[1] = r[1] * p, s[2] = r[2] * p, s[3] = r[3] * p, s;
  }
  const q = ee;
  function X(r, p, t) {
    const s = t ?? new f(4);
    return s[0] = r[0] / p, s[1] = r[1] / p, s[2] = r[2] / p, s[3] = r[3] / p, s;
  }
  function ne(r, p) {
    return r[0] * p[0] + r[1] * p[1] + r[2] * p[2] + r[3] * p[3];
  }
  function xe(r, p, t, s) {
    const u = s ?? new f(4);
    return u[0] = r[0] + t * (p[0] - r[0]), u[1] = r[1] + t * (p[1] - r[1]), u[2] = r[2] + t * (p[2] - r[2]), u[3] = r[3] + t * (p[3] - r[3]), u;
  }
  function Y(r) {
    const p = r[0], t = r[1], s = r[2], u = r[3];
    return Math.sqrt(p * p + t * t + s * s + u * u);
  }
  const C = Y;
  function A(r) {
    const p = r[0], t = r[1], s = r[2], u = r[3];
    return p * p + t * t + s * s + u * u;
  }
  const me = A;
  function le(r, p) {
    const t = p ?? new f(4), s = r[0], u = r[1], d = r[2], w = r[3], e = Math.sqrt(s * s + u * u + d * d + w * w);
    return e > 1e-5 ? (t[0] = s / e, t[1] = u / e, t[2] = d / e, t[3] = w / e) : (t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1), t;
  }
  function ye(r, p) {
    return Math.abs(r[0] - p[0]) < R && Math.abs(r[1] - p[1]) < R && Math.abs(r[2] - p[2]) < R && Math.abs(r[3] - p[3]) < R;
  }
  function se(r, p) {
    return r[0] === p[0] && r[1] === p[1] && r[2] === p[2] && r[3] === p[3];
  }
  function Ge(r) {
    const p = r ?? new f(4);
    return p[0] = 0, p[1] = 0, p[2] = 0, p[3] = 1, p;
  }
  const Q = v.create(), W = v.create(), ce = v.create();
  function fe(r, p, t) {
    const s = t ?? new f(4), u = v.dot(r, p);
    return u < -0.999999 ? (v.cross(W, r, Q), v.len(Q) < 1e-6 && v.cross(ce, r, Q), v.normalize(Q, Q), B(Q, Math.PI, s), s) : u > 0.999999 ? (s[0] = 0, s[1] = 0, s[2] = 0, s[3] = 1, s) : (v.cross(r, p, Q), s[0] = Q[0], s[1] = Q[1], s[2] = Q[2], s[3] = 1 + u, le(s, s));
  }
  const ge = new f(4), we = new f(4);
  function de(r, p, t, s, u, d) {
    const w = d ?? new f(4);
    return K(r, s, u, ge), K(p, t, u, we), K(ge, we, 2 * u * (1 - u), w), w;
  }
  return {
    create: M,
    fromValues: _,
    set: U,
    fromAxisAngle: B,
    toAxisAngle: L,
    angle: k,
    multiply: G,
    mul: b,
    rotateX: N,
    rotateY: F,
    rotateZ: J,
    slerp: K,
    inverse: ue,
    conjugate: re,
    fromMat: ae,
    fromEuler: te,
    copy: j,
    clone: H,
    add: $,
    subtract: ie,
    sub: Z,
    mulScalar: ee,
    scale: q,
    divScalar: X,
    dot: ne,
    lerp: xe,
    length: Y,
    len: C,
    lengthSq: A,
    lenSq: me,
    normalize: le,
    equalsApproximately: ye,
    equals: se,
    identity: Ge,
    rotationTo: fe,
    sqlerp: de
  };
}
const tn = /* @__PURE__ */ new Map();
function wn(f) {
  let v = tn.get(f);
  return v || (v = xn(f), tn.set(f, v)), v;
}
function vn(f) {
  function v(t, s, u, d) {
    const w = new f(4);
    return t !== void 0 && (w[0] = t, s !== void 0 && (w[1] = s, u !== void 0 && (w[2] = u, d !== void 0 && (w[3] = d)))), w;
  }
  const M = v;
  function _(t, s, u, d, w) {
    const e = w ?? new f(4);
    return e[0] = t, e[1] = s, e[2] = u, e[3] = d, e;
  }
  function U(t, s) {
    const u = s ?? new f(4);
    return u[0] = Math.ceil(t[0]), u[1] = Math.ceil(t[1]), u[2] = Math.ceil(t[2]), u[3] = Math.ceil(t[3]), u;
  }
  function B(t, s) {
    const u = s ?? new f(4);
    return u[0] = Math.floor(t[0]), u[1] = Math.floor(t[1]), u[2] = Math.floor(t[2]), u[3] = Math.floor(t[3]), u;
  }
  function L(t, s) {
    const u = s ?? new f(4);
    return u[0] = Math.round(t[0]), u[1] = Math.round(t[1]), u[2] = Math.round(t[2]), u[3] = Math.round(t[3]), u;
  }
  function k(t, s = 0, u = 1, d) {
    const w = d ?? new f(4);
    return w[0] = Math.min(u, Math.max(s, t[0])), w[1] = Math.min(u, Math.max(s, t[1])), w[2] = Math.min(u, Math.max(s, t[2])), w[3] = Math.min(u, Math.max(s, t[3])), w;
  }
  function G(t, s, u) {
    const d = u ?? new f(4);
    return d[0] = t[0] + s[0], d[1] = t[1] + s[1], d[2] = t[2] + s[2], d[3] = t[3] + s[3], d;
  }
  function b(t, s, u, d) {
    const w = d ?? new f(4);
    return w[0] = t[0] + s[0] * u, w[1] = t[1] + s[1] * u, w[2] = t[2] + s[2] * u, w[3] = t[3] + s[3] * u, w;
  }
  function N(t, s, u) {
    const d = u ?? new f(4);
    return d[0] = t[0] - s[0], d[1] = t[1] - s[1], d[2] = t[2] - s[2], d[3] = t[3] - s[3], d;
  }
  const F = N;
  function J(t, s) {
    return Math.abs(t[0] - s[0]) < R && Math.abs(t[1] - s[1]) < R && Math.abs(t[2] - s[2]) < R && Math.abs(t[3] - s[3]) < R;
  }
  function K(t, s) {
    return t[0] === s[0] && t[1] === s[1] && t[2] === s[2] && t[3] === s[3];
  }
  function ue(t, s, u, d) {
    const w = d ?? new f(4);
    return w[0] = t[0] + u * (s[0] - t[0]), w[1] = t[1] + u * (s[1] - t[1]), w[2] = t[2] + u * (s[2] - t[2]), w[3] = t[3] + u * (s[3] - t[3]), w;
  }
  function re(t, s, u, d) {
    const w = d ?? new f(4);
    return w[0] = t[0] + u[0] * (s[0] - t[0]), w[1] = t[1] + u[1] * (s[1] - t[1]), w[2] = t[2] + u[2] * (s[2] - t[2]), w[3] = t[3] + u[3] * (s[3] - t[3]), w;
  }
  function ae(t, s, u) {
    const d = u ?? new f(4);
    return d[0] = Math.max(t[0], s[0]), d[1] = Math.max(t[1], s[1]), d[2] = Math.max(t[2], s[2]), d[3] = Math.max(t[3], s[3]), d;
  }
  function te(t, s, u) {
    const d = u ?? new f(4);
    return d[0] = Math.min(t[0], s[0]), d[1] = Math.min(t[1], s[1]), d[2] = Math.min(t[2], s[2]), d[3] = Math.min(t[3], s[3]), d;
  }
  function j(t, s, u) {
    const d = u ?? new f(4);
    return d[0] = t[0] * s, d[1] = t[1] * s, d[2] = t[2] * s, d[3] = t[3] * s, d;
  }
  const H = j;
  function $(t, s, u) {
    const d = u ?? new f(4);
    return d[0] = t[0] / s, d[1] = t[1] / s, d[2] = t[2] / s, d[3] = t[3] / s, d;
  }
  function ie(t, s) {
    const u = s ?? new f(4);
    return u[0] = 1 / t[0], u[1] = 1 / t[1], u[2] = 1 / t[2], u[3] = 1 / t[3], u;
  }
  const Z = ie;
  function ee(t, s) {
    return t[0] * s[0] + t[1] * s[1] + t[2] * s[2] + t[3] * s[3];
  }
  function q(t) {
    const s = t[0], u = t[1], d = t[2], w = t[3];
    return Math.sqrt(s * s + u * u + d * d + w * w);
  }
  const X = q;
  function ne(t) {
    const s = t[0], u = t[1], d = t[2], w = t[3];
    return s * s + u * u + d * d + w * w;
  }
  const xe = ne;
  function Y(t, s) {
    const u = t[0] - s[0], d = t[1] - s[1], w = t[2] - s[2], e = t[3] - s[3];
    return Math.sqrt(u * u + d * d + w * w + e * e);
  }
  const C = Y;
  function A(t, s) {
    const u = t[0] - s[0], d = t[1] - s[1], w = t[2] - s[2], e = t[3] - s[3];
    return u * u + d * d + w * w + e * e;
  }
  const me = A;
  function le(t, s) {
    const u = s ?? new f(4), d = t[0], w = t[1], e = t[2], o = t[3], n = Math.sqrt(d * d + w * w + e * e + o * o);
    return n > 1e-5 ? (u[0] = d / n, u[1] = w / n, u[2] = e / n, u[3] = o / n) : (u[0] = 0, u[1] = 0, u[2] = 0, u[3] = 0), u;
  }
  function ye(t, s) {
    const u = s ?? new f(4);
    return u[0] = -t[0], u[1] = -t[1], u[2] = -t[2], u[3] = -t[3], u;
  }
  function se(t, s) {
    const u = s ?? new f(4);
    return u[0] = t[0], u[1] = t[1], u[2] = t[2], u[3] = t[3], u;
  }
  const Ge = se;
  function Q(t, s, u) {
    const d = u ?? new f(4);
    return d[0] = t[0] * s[0], d[1] = t[1] * s[1], d[2] = t[2] * s[2], d[3] = t[3] * s[3], d;
  }
  const W = Q;
  function ce(t, s, u) {
    const d = u ?? new f(4);
    return d[0] = t[0] / s[0], d[1] = t[1] / s[1], d[2] = t[2] / s[2], d[3] = t[3] / s[3], d;
  }
  const fe = ce;
  function ge(t) {
    const s = t ?? new f(4);
    return s[0] = 0, s[1] = 0, s[2] = 0, s[3] = 0, s;
  }
  function we(t, s, u) {
    const d = u ?? new f(4), w = t[0], e = t[1], o = t[2], n = t[3];
    return d[0] = s[0] * w + s[4] * e + s[8] * o + s[12] * n, d[1] = s[1] * w + s[5] * e + s[9] * o + s[13] * n, d[2] = s[2] * w + s[6] * e + s[10] * o + s[14] * n, d[3] = s[3] * w + s[7] * e + s[11] * o + s[15] * n, d;
  }
  function de(t, s, u) {
    const d = u ?? new f(4);
    return le(t, d), j(d, s, d);
  }
  function r(t, s, u) {
    const d = u ?? new f(4);
    return q(t) > s ? de(t, s, d) : se(t, d);
  }
  function p(t, s, u) {
    const d = u ?? new f(4);
    return ue(t, s, 0.5, d);
  }
  return {
    create: v,
    fromValues: M,
    set: _,
    ceil: U,
    floor: B,
    round: L,
    clamp: k,
    add: G,
    addScaled: b,
    subtract: N,
    sub: F,
    equalsApproximately: J,
    equals: K,
    lerp: ue,
    lerpV: re,
    max: ae,
    min: te,
    mulScalar: j,
    scale: H,
    divScalar: $,
    inverse: ie,
    invert: Z,
    dot: ee,
    length: q,
    len: X,
    lengthSq: ne,
    lenSq: xe,
    distance: Y,
    dist: C,
    distanceSq: A,
    distSq: me,
    normalize: le,
    negate: ye,
    copy: se,
    clone: Ge,
    multiply: Q,
    mul: W,
    divide: ce,
    div: fe,
    zero: ge,
    transformMat4: we,
    setLength: de,
    truncate: r,
    midpoint: p
  };
}
const rn = /* @__PURE__ */ new Map();
function mn(f) {
  let v = rn.get(f);
  return v || (v = vn(f), rn.set(f, v)), v;
}
function je(f, v, M, _, U, B) {
  return {
    /** @namespace mat3 */
    mat3: pn(f),
    /** @namespace mat4 */
    mat4: gn(v),
    /** @namespace quat */
    quat: wn(M),
    /** @namespace vec2 */
    vec2: sn(_),
    /** @namespace vec3 */
    vec3: Ne(U),
    /** @namespace vec4 */
    vec4: mn(B)
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
je(an, Array, Array, Array, Array, Array);
const Xe = new ArrayBuffer(272), Ye = {
  texelSize: new Float32Array(Xe, 0, 2),
  sphereSize: new Float32Array(Xe, 8, 2),
  invProjectionMatrix: new Float32Array(Xe, 16, 16),
  projectionMatrix: new Float32Array(Xe, 80, 16),
  viewMatrix: new Float32Array(Xe, 144, 16),
  invViewMatrix: new Float32Array(Xe, 208, 16)
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
      var _ = M.deltaY;
      this.currentDistance += (_ > 0 ? 1 : -1) * this.zoomRate, this.currentDistance < this.minDistance && (this.currentDistance = this.minDistance), this.currentDistance > this.maxDistance && (this.currentDistance = this.maxDistance), this.recalculateView();
    }), this.canvas.addEventListener("mousemove", (M) => {
      if (this.currentHoverX = M.clientX, this.currentHoverY = M.clientY, this.isDragging) {
        const _ = this.prevX - M.clientX, U = this.prevY - M.clientY;
        this.currentXtheta += this.sensitivity * _, this.currentYtheta += this.sensitivity * U, this.currentYtheta > this.maxYTheta && (this.currentYtheta = this.maxYTheta), this.currentYtheta < this.minYTheta && (this.currentYtheta = this.minYTheta), this.prevX = M.clientX, this.prevY = M.clientY, this.recalculateView();
      }
    }), this.canvas.addEventListener("mouseup", () => {
      this.isDragging && (this.isDragging = !1);
    });
  }
  reset(v, M, _, U) {
    this.isDragging = !1, this.prevX = 0, this.prevY = 0, this.currentXtheta = -Math.PI / 2 * 1, this.currentYtheta = -Math.PI / 12 * 0.8, this.maxYTheta = -Math.PI / 12 * 0.8, this.minYTheta = -0.99 * Math.PI / 2, this.sensitivity = 5e-3, this.currentDistance = v, this.maxDistance = 1.3 * this.currentDistance, this.minDistance = 0.8 * this.currentDistance, this.target = M, this.fov = _, this.zoomRate = U;
    const B = this.canvas.clientWidth / this.canvas.clientHeight, L = Ae.perspective(_, B, 0.1, 300);
    Ye.projectionMatrix.set(L), Ye.invProjectionMatrix.set(Ae.inverse(L)), this.recalculateView();
  }
  recalculateView() {
    var v = Ae.identity();
    Ae.translate(v, this.target, v), Ae.rotateY(v, this.currentXtheta, v), Ae.rotateX(v, this.currentYtheta, v), Ae.translate(v, [0, 0, this.currentDistance], v);
    var M = Ae.multiply(v, [0, 0, 0, 1]);
    let _ = this.target;
    const U = Ae.lookAt(
      [M[0], M[1], M[2]],
      // position
      _,
      // target
      [0, 1, 0]
      // up
    );
    Ye.viewMatrix.set(U), Ye.invViewMatrix.set(Ae.inverse(U));
  }
  calcMouseVelocity() {
    if (this.isDragging)
      return [0, 0];
    let [v, M] = this.calcPlaneCoord(this.currentHoverX, this.currentHoverY), [_, U] = this.calcPlaneCoord(this.prevHoverX, this.prevHoverY), B = v - _, L = M - U, k = 4;
    return B > k && (B = k), B < -k && (B = -k), L > k && (L = k), L < -k && (L = -k), [B, L, 0, 0];
  }
  calcPlaneCoord(v, M) {
    let _ = v / this.canvas.width, U = M / this.canvas.height, B = 2 * _ - 1, L = (1 - U) * 2 - 1, k = [
      B * Math.tan(this.fov / 2) * (this.canvas.width / this.canvas.height),
      L * Math.tan(this.fov / 2),
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
const ke = 80;
class Vn {
  constructor(v, M, _, U, B, L, k, G, b, N, F, J, K, ue) {
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
    this.device = G, this.renderDiameter = ue, this.frameCount = 0, this.spawned = !1, this.numParticles = 0, this.maxGridCount = F, this.maxParticleCount = J, this.initBoxSizeBuffer = L;
    const re = G.createShaderModule({ code: Pn }), ae = G.createShaderModule({ code: Tn }), te = G.createShaderModule({ code: Sn }), j = G.createShaderModule({ code: Dn }), H = G.createShaderModule({ code: Mn }), $ = G.createShaderModule({ code: Gn }), ie = G.createShaderModule({ code: zn }), Z = G.createShaderModule({ code: bn }), ee = G.createShaderModule({ code: Bn });
    this.restDensity = 3;
    const q = {
      stiffness: 50,
      restDensity: this.restDensity,
      dynamicViscosity: 0.1,
      fixedPointMultiplier: K,
      fixedPointMultiplierInverse: 1 / K
    };
    this.clearGridPipeline = G.createComputePipeline({
      label: "clear grid pipeline",
      layout: "auto",
      compute: {
        module: re
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
        module: te,
        constants: {
          fixedPointMultiplierInverse: q.fixedPointMultiplierInverse
        }
      }
    }), this.p2g1Pipeline = G.createComputePipeline({
      label: "p2g 1 pipeline",
      layout: "auto",
      compute: {
        module: j,
        constants: {
          fixedPointMultiplier: q.fixedPointMultiplier
        }
      }
    }), this.p2g2Pipeline = G.createComputePipeline({
      label: "p2g 2 pipeline",
      layout: "auto",
      compute: {
        module: H,
        constants: {
          fixedPointMultiplier: q.fixedPointMultiplier,
          fixedPointMultiplierInverse: q.fixedPointMultiplierInverse,
          stiffness: q.stiffness,
          restDensity: q.restDensity,
          dynamicViscosity: q.dynamicViscosity
        }
      }
    }), this.p2gDensityPipeline = G.createComputePipeline({
      label: "p2g density pipeline",
      layout: "auto",
      compute: {
        module: $,
        constants: {
          densityFixedPointMultiplier: q.fixedPointMultiplier
        }
      }
    }), this.updateGridPipeline = G.createComputePipeline({
      label: "update grid pipeline",
      layout: "auto",
      compute: {
        module: ie,
        constants: {
          fixedPointMultiplier: q.fixedPointMultiplier,
          fixedPointMultiplierInverse: q.fixedPointMultiplierInverse
        }
      }
    }), this.g2pPipeline = G.createComputePipeline({
      label: "g2p pipeline",
      layout: "auto",
      compute: {
        module: Z,
        constants: {
          fixedPointMultiplierInverse: q.fixedPointMultiplierInverse
        }
      }
    }), this.copyPositionPipeline = G.createComputePipeline({
      label: "copy position pipeline",
      layout: "auto",
      compute: {
        module: ee
      }
    });
    const X = G.createBuffer({
      label: "cells buffer",
      size: this.cellStructSize * F,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    this.densityBuffer = G.createBuffer({
      label: "density buffer",
      size: 4 * J,
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
    }), this.mouseInfoViews.screenSize.set([N.width, N.height]), this.device.queue.writeBuffer(this.mouseInfoUniformBuffer, 0, this.mouseInfoValues), this.clearGridBindGroup = G.createBindGroup({
      layout: this.clearGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: X } }
      ]
    }), this.clearDensityGridBindGroup = G.createBindGroup({
      layout: this.clearDensityGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: U } },
        { binding: 1, resource: { buffer: B } }
      ]
    }), this.castDensityGridBindGroup = G.createBindGroup({
      layout: this.castDensityGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: U } },
        { binding: 1, resource: { buffer: B } }
      ]
    }), this.p2g1BindGroup = G.createBindGroup({
      layout: this.p2g1Pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: X } },
        { binding: 2, resource: { buffer: L } },
        { binding: 3, resource: { buffer: this.numParticlesBuffer } }
      ]
    }), this.p2g2BindGroup = G.createBindGroup({
      layout: this.p2g2Pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: X } },
        { binding: 2, resource: { buffer: L } },
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
        { binding: 4, resource: { buffer: k } }
      ]
    }), this.updateGridBindGroup = G.createBindGroup({
      layout: this.updateGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: X } },
        { binding: 1, resource: { buffer: this.realBoxSizeBuffer } },
        { binding: 2, resource: { buffer: L } },
        { binding: 3, resource: { buffer: _ } },
        { binding: 4, resource: b },
        { binding: 5, resource: { buffer: this.mouseInfoUniformBuffer } },
        { binding: 6, resource: { buffer: this.dtBuffer } }
      ]
    }), this.g2pBindGroup = G.createBindGroup({
      layout: this.g2pPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: X } },
        { binding: 2, resource: { buffer: this.realBoxSizeBuffer } },
        { binding: 3, resource: { buffer: L } },
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
    let _ = new ArrayBuffer(ke * this.maxParticleCount);
    const U = 0.9;
    this.numParticles = 0, v[0] / 2, v[0] / 2, v[2] / 2;
    for (let G = 3; G < v[1] * 0.8 && this.numParticles < M; G += U)
      for (let b = v[0] * 0.25; b < v[0] - 4 && this.numParticles < M; b += U)
        for (let N = 3; N < v[2] / 2 && this.numParticles < M; N += U) {
          const F = ke * this.numParticles, J = {
            position: new Float32Array(_, F + 0, 3),
            v: new Float32Array(_, F + 16, 3),
            C: new Float32Array(_, F + 32, 12)
          }, K = 0.5 * Math.random();
          J.position.set([b + K, G + K, N + K]), this.numParticles++;
        }
    console.log(this.numParticles), this.numParticles < M && console.log("warning: actual number of particles is smaller than the specified number. make bounding box larger.");
    let B = new ArrayBuffer(ke * this.numParticles);
    const L = new Uint8Array(_), k = new Uint8Array(B);
    return k.set(L.subarray(0, k.length)), B;
  }
  reset(v, M) {
    if (this.gridCount = Math.ceil(v[0]) * Math.ceil(v[1]) * Math.ceil(v[2]), this.gridCount > this.maxGridCount)
      throw new Error("gridCount should be equal to or less than maxGridCount");
    this.densityGridCount = this.gridCount;
    const _ = new Float32Array(v);
    this.device.queue.writeBuffer(this.initBoxSizeBuffer, 0, _), this.frameCount = 0;
    let U = this.initDambreak(v, M);
    this.device.queue.writeBuffer(this.particleBuffer, 0, U), this.changeBoxSize(v), this.changeNumParticles(this.numParticles);
  }
  execute(v, M, _, U, B, L, k, G) {
    const b = v.beginComputePass();
    this.mouseInfoViews.mouseCoord.set([M[0], M[1]]), this.mouseInfoViews.mouseVel.set([_[0], _[1]]), this.mouseInfoViews.mouseRadius.set([U]), this.device.queue.writeBuffer(this.mouseInfoUniformBuffer, 0, this.mouseInfoValues);
    const N = new Float32Array([L]);
    if (this.device.queue.writeBuffer(this.dtBuffer, 0, N), B) {
      if (k)
        for (let J = 0; J < 1; J++)
          b.setBindGroup(0, this.clearGridBindGroup), b.setPipeline(this.clearGridPipeline), b.dispatchWorkgroups(Math.ceil(this.gridCount / 64)), b.setBindGroup(0, this.p2g1BindGroup), b.setPipeline(this.p2g1Pipeline), b.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), b.setBindGroup(0, this.p2g2BindGroup), b.setPipeline(this.p2g2Pipeline), b.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), b.setBindGroup(0, this.updateGridBindGroup), b.setPipeline(this.updateGridPipeline), b.dispatchWorkgroups(Math.ceil(this.gridCount / 64)), b.setBindGroup(0, this.g2pBindGroup), b.setPipeline(this.g2pPipeline), b.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
      let F = G[0] * G[1] * G[2];
      b.setBindGroup(0, this.clearDensityGridBindGroup), b.setPipeline(this.clearDensityGridPipeline), b.dispatchWorkgroups(Math.ceil(F / 2 / 64)), b.setBindGroup(0, this.p2gDensityBindGroup), b.setPipeline(this.p2gDensityPipeline), b.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), b.setBindGroup(0, this.castDensityGridBindGroup), b.setPipeline(this.castDensityGridPipeline), b.dispatchWorkgroups(Math.ceil(F / 2 / 64)), b.setBindGroup(0, this.copyPositionBindGroup), b.setPipeline(this.copyPositionPipeline), b.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
    } else if (k) {
      for (let F = 0; F < 1; F++)
        b.setBindGroup(0, this.clearGridBindGroup), b.setPipeline(this.clearGridPipeline), b.dispatchWorkgroups(Math.ceil(this.gridCount / 64)), b.setBindGroup(0, this.p2g1BindGroup), b.setPipeline(this.p2g1Pipeline), b.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), b.setBindGroup(0, this.p2g2BindGroup), b.setPipeline(this.p2g2Pipeline), b.dispatchWorkgroups(Math.ceil(this.numParticles / 64)), b.setBindGroup(0, this.updateGridBindGroup), b.setPipeline(this.updateGridPipeline), b.dispatchWorkgroups(Math.ceil(this.gridCount / 64)), b.setBindGroup(0, this.g2pBindGroup), b.setPipeline(this.g2pPipeline), b.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
      b.setBindGroup(0, this.copyPositionBindGroup), b.setPipeline(this.copyPositionPipeline), b.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
    }
    b.end(), this.frameCount++;
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
    return vec4f(0.); 
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
}`, kn = `@group(0) @binding(0) var envmapTexture: texture_cube<f32>;
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
    
    let rayDirWorld = normalize((uniforms.invViewMatrix * vec4f(computeViewPosFromUVDepth(input.uv, 1.0), 0.)).xyz);
    return vec4f(textureSampleLevel(envmapTexture, textureSampler, rayDirWorld, 0.).rgb, 1.);
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
class On {
  constructor(v, M, _, U, B, L, k, G, b, N, F, J, K) {
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
    this.device = B;
    const ue = 50, re = 2 * F, ae = 12, te = b.width / 2, j = b.height / 2, H = {
      screenHeight: b.height,
      screenWidth: b.width
    }, $ = {
      maxFilterSize: ue,
      projectedParticleConstant: ae * re * 0.05 * (b.height / 2) / Math.tan(J / 2)
    }, ie = {
      thicknessTextureWidth: te,
      thicknessTextureHeight: j
    }, Z = B.createSampler({
      // addressModeU: "repeat",
      // addressModeV: "repeat",
      magFilter: "linear",
      minFilter: "linear"
    }), ee = B.createShaderModule({ code: Un }), q = B.createShaderModule({ code: _n }), X = B.createShaderModule({ code: Fn }), ne = B.createShaderModule({ code: Xn }), xe = B.createShaderModule({ code: Yn }), Y = B.createShaderModule({ code: In }), C = B.createShaderModule({ code: An }), A = B.createShaderModule({ code: kn }), me = B.createShaderModule({ code: Rn });
    this.depthMapPipeline = B.createRenderPipeline({
      label: "depthMap pipeline",
      layout: "auto",
      vertex: { module: ne },
      fragment: {
        module: ne,
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
    }), this.spherePipeline = B.createRenderPipeline({
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
            format: N
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
    }), this.depthFilter1DPipeline = B.createRenderPipeline({
      label: "depth filter pipeline (1d)",
      layout: "auto",
      vertex: {
        module: ee,
        constants: H
      },
      fragment: {
        module: q,
        constants: {
          ...$,
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
    }), this.depthFilter2DPipeline = B.createRenderPipeline({
      label: "depth filter pipeline (2d)",
      layout: "auto",
      vertex: {
        module: ee,
        constants: H
      },
      fragment: {
        module: q,
        constants: {
          ...$,
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
    }), this.thicknessMapPipeline = B.createRenderPipeline({
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
    }), this.thicknessFilterPipeline = B.createRenderPipeline({
      label: "thickness filter pipeline",
      layout: "auto",
      vertex: {
        module: ee,
        constants: H
      },
      fragment: {
        module: C,
        constants: ie,
        targets: [
          {
            format: "r16float"
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      }
    }), this.fluidPipeline = B.createRenderPipeline({
      label: "fluid rendering pipeline",
      layout: "auto",
      vertex: {
        module: ee,
        constants: H
      },
      fragment: {
        module: X,
        targets: [
          {
            format: N
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      }
    }), this.bgColorPipeline = B.createRenderPipeline({
      label: "bgColor pipeline",
      layout: "auto",
      vertex: {
        module: ee,
        constants: H
      },
      fragment: {
        module: A,
        targets: [
          {
            format: N
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      }
    }), this.densityRaymarchPipeline = B.createRenderPipeline({
      label: "density raymarch pipeline",
      layout: "auto",
      vertex: {
        module: ee,
        constants: H
      },
      fragment: {
        module: me,
        targets: [
          {
            format: N
          }
        ]
      }
    });
    const le = B.createTexture({
      label: "temporary depth map texture",
      size: [b.width, b.height, 1],
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      format: "r32float"
    }), ye = B.createTexture({
      label: "thickness map texture",
      size: [te, j, 1],
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      format: "r16float"
    }), se = B.createTexture({
      label: "temporary thickness map texture",
      size: [te, j, 1],
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      format: "r16float"
    }), Ge = B.createTexture({
      size: [b.width, b.height, 1],
      format: "depth32float",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
    }), Q = B.createTexture({
      size: [b.width, b.height, 1],
      format: N,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
    });
    this.depthMapTextureView = L, this.tmpDepthMapTextureView = le.createView(), this.thicknessTextureView = ye.createView(), this.tmpThicknessTextureView = se.createView(), this.depthTestTextureView = Ge.createView(), this.tmpOutputTextureView = Q.createView();
    const W = B.createBuffer({
      label: "filter uniform buffer",
      size: 8,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), ce = B.createBuffer({
      label: "filter uniform buffer",
      size: 8,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), fe = B.createBuffer({
      label: "thickness filter size buffer",
      size: 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    this.diffuseColorBuffer = B.createBuffer({
      label: "diffuse color buffer",
      size: 12,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.colorDensityBuffer = B.createBuffer({
      label: "color density buffer",
      size: 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.densityGridSizeBuffer = _;
    let ge = new Float32Array([1, 0]), we = new Float32Array([0, 1]), de = new Int32Array([15]);
    B.queue.writeBuffer(W, 0, ge), B.queue.writeBuffer(ce, 0, we), B.queue.writeBuffer(fe, 0, de), this.depthFilter1DBindGroups = [], this.depthFilter1DBindGroups = [
      B.createBindGroup({
        label: "filterX bind group",
        layout: this.depthFilter1DPipeline.getBindGroupLayout(0),
        entries: [
          // { binding: 0, resource: sampler },
          { binding: 1, resource: this.depthMapTextureView },
          { binding: 2, resource: { buffer: W } }
        ]
      }),
      B.createBindGroup({
        label: "filterY bind group",
        layout: this.depthFilter1DPipeline.getBindGroupLayout(0),
        entries: [
          // { binding: 0, resource: sampler },
          { binding: 1, resource: this.tmpDepthMapTextureView },
          { binding: 2, resource: { buffer: ce } }
        ]
      })
    ], this.depthFilter2DBindGroups = [
      B.createBindGroup({
        label: "filterX bind group",
        layout: this.depthFilter2DPipeline.getBindGroupLayout(0),
        entries: [
          // { binding: 0, resource: sampler },
          { binding: 1, resource: this.depthMapTextureView },
          { binding: 2, resource: { buffer: W } }
        ]
      }),
      B.createBindGroup({
        label: "filterY bind group",
        layout: this.depthFilter2DPipeline.getBindGroupLayout(0),
        entries: [
          // { binding: 0, resource: sampler },
          { binding: 1, resource: this.tmpDepthMapTextureView },
          { binding: 2, resource: { buffer: ce } }
        ]
      })
    ], this.thicknessMapBindGroup = B.createBindGroup({
      label: "thickness map bind group",
      layout: this.thicknessMapPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: M } },
        { binding: 1, resource: { buffer: v } }
      ]
    }), this.thicknessFilterBindGroups = [], this.thicknessFilterBindGroups = [
      B.createBindGroup({
        label: "thickness filterX bind group",
        layout: this.thicknessFilterPipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: Z },
          { binding: 1, resource: this.thicknessTextureView },
          { binding: 2, resource: { buffer: W } },
          { binding: 3, resource: { buffer: fe } }
        ]
      }),
      B.createBindGroup({
        label: "thickness filterY bind group",
        layout: this.thicknessFilterPipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: Z },
          { binding: 1, resource: this.tmpThicknessTextureView },
          { binding: 2, resource: { buffer: ce } },
          { binding: 3, resource: { buffer: fe } }
        ]
      })
    ], this.fluidBindGroup = B.createBindGroup({
      label: "fluid bind group",
      layout: this.fluidPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: Z },
        { binding: 1, resource: this.depthMapTextureView },
        { binding: 2, resource: { buffer: v } },
        { binding: 3, resource: this.thicknessTextureView },
        { binding: 4, resource: k },
        { binding: 5, resource: this.tmpOutputTextureView },
        { binding: 6, resource: { buffer: this.diffuseColorBuffer } },
        { binding: 7, resource: { buffer: this.colorDensityBuffer } }
      ]
    }), this.depthMapBindGroup = B.createBindGroup({
      label: "depthMap bind group",
      layout: this.depthMapPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: M } },
        { binding: 1, resource: { buffer: v } }
      ]
    }), this.bgColorBindGroup = B.createBindGroup({
      label: "bgColor bind group",
      layout: this.bgColorPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: k },
        { binding: 1, resource: { buffer: v } },
        { binding: 2, resource: Z }
      ]
    }), this.sphereBindGroup = B.createBindGroup({
      label: "sphere bind group",
      layout: this.spherePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: M } },
        { binding: 1, resource: { buffer: v } }
      ]
    }), this.densityRaymarchBindGroup = B.createBindGroup({
      label: "density raymarch bind group",
      layout: this.densityRaymarchPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: this.depthMapTextureView },
        { binding: 1, resource: G },
        { binding: 2, resource: { buffer: v } },
        { binding: 3, resource: { buffer: U } },
        { binding: 4, resource: Z },
        { binding: 5, resource: this.tmpOutputTextureView },
        { binding: 6, resource: { buffer: this.densityGridSizeBuffer } }
      ]
    }), console.log(this.densityRaymarchPipeline.getBindGroupLayout(0));
  }
  execute(v, M, _, U, B, L) {
    const k = new Float32Array(B), G = new Float32Array([L]);
    this.device.queue.writeBuffer(this.diffuseColorBuffer, 0, k), this.device.queue.writeBuffer(this.colorDensityBuffer, 0, G);
    const b = [
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
    ], N = {
      colorAttachments: [
        {
          view: this.thicknessTextureView,
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    }, F = [
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
    ], J = {
      colorAttachments: [
        {
          view: this.tmpOutputTextureView,
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    }, K = {
      colorAttachments: [
        {
          view: v.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    }, ue = {
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
    }, re = {
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
      const j = M.beginRenderPass(J);
      j.setBindGroup(0, this.bgColorBindGroup), j.setPipeline(this.bgColorPipeline), j.draw(6), j.end();
      const H = M.beginRenderPass(re);
      H.setBindGroup(0, this.sphereBindGroup), H.setPipeline(this.spherePipeline), H.draw(6, _), H.end();
      const $ = M.beginRenderPass(ae);
      $.setBindGroup(0, this.densityRaymarchBindGroup), $.setPipeline(this.densityRaymarchPipeline), $.draw(6), $.end();
    } else {
      const j = M.beginRenderPass(ue);
      j.setBindGroup(0, this.depthMapBindGroup), j.setPipeline(this.depthMapPipeline), j.draw(6, _), j.end();
      for (var te = 0; te < 2; te++) {
        const q = M.beginRenderPass(b[0]);
        q.setBindGroup(0, this.depthFilter1DBindGroups[0]), q.setPipeline(this.depthFilter1DPipeline), q.draw(6), q.end();
        const X = M.beginRenderPass(b[1]);
        X.setBindGroup(0, this.depthFilter1DBindGroups[1]), X.setPipeline(this.depthFilter1DPipeline), X.draw(6), X.end();
      }
      const H = M.beginRenderPass(b[0]);
      H.setBindGroup(0, this.depthFilter2DBindGroups[0]), H.setPipeline(this.depthFilter2DPipeline), H.draw(6), H.end();
      const $ = M.beginRenderPass(b[1]);
      $.setBindGroup(0, this.depthFilter2DBindGroups[1]), $.setPipeline(this.depthFilter2DPipeline), $.draw(6), $.end();
      const ie = M.beginRenderPass(N);
      ie.setBindGroup(0, this.thicknessMapBindGroup), ie.setPipeline(this.thicknessMapPipeline), ie.draw(6, _), ie.end();
      for (var te = 0; te < 1; te++) {
        const X = M.beginRenderPass(F[0]);
        X.setBindGroup(0, this.thicknessFilterBindGroups[0]), X.setPipeline(this.thicknessFilterPipeline), X.draw(6), X.end();
        const ne = M.beginRenderPass(F[1]);
        ne.setBindGroup(0, this.thicknessFilterBindGroups[1]), ne.setPipeline(this.thicknessFilterPipeline), ne.draw(6), ne.end();
      }
      const Z = M.beginRenderPass(J);
      Z.setBindGroup(0, this.bgColorBindGroup), Z.setPipeline(this.bgColorPipeline), Z.draw(6), Z.end();
      const ee = M.beginRenderPass(K);
      ee.setBindGroup(0, this.fluidBindGroup), ee.setPipeline(this.fluidPipeline), ee.draw(6), ee.end();
    }
  }
}
function Ln(f, v) {
  const M = document.createElement("canvas");
  M.width = M.height = f;
  const _ = M.getContext("2d");
  if (v === "up") _.fillStyle = "#ffffff";
  else if (v === "down") _.fillStyle = "#dfe2e4";
  else {
    const U = _.createLinearGradient(0, 0, 0, f);
    U.addColorStop(0, "#ffffff"), U.addColorStop(0.5, "#eef0f1"), U.addColorStop(1, "#dfe2e4"), _.fillStyle = U;
  }
  return _.fillRect(0, 0, f, f), M;
}
async function Cn(f, v) {
  var t, s;
  const M = v.particles ?? 11e4, _ = 0.9, U = ((t = v.box) == null ? void 0 : t[0]) ?? 72, B = ((s = v.box) == null ? void 0 : s[2]) ?? 43, L = (Math.floor((U - 6) / _) + 1) * (Math.floor((B - 6) / _) + 1), k = 3 + Math.ceil(M / L) * _, G = v.box ?? [U, Math.ceil(k + 9), B], b = v.resolution ?? 0.7, N = await navigator.gpu.requestAdapter();
  if (!N) throw new Error("no WebGPU adapter");
  const F = await N.requestDevice();
  for (; !f.clientWidth || !f.clientHeight; ) await new Promise((u) => setTimeout(u, 50));
  const J = f.getContext("webgpu");
  f.width = Math.round(b * f.clientWidth), f.height = Math.round(b * f.clientHeight);
  const K = navigator.gpu.getPreferredCanvasFormat();
  J.configure({ device: F, format: K });
  const ue = v.sky ?? "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r165/examples/textures/cube/Bridge2/";
  let re;
  try {
    re = await Promise.all(["posx", "negx", "posy", "negy", "posz", "negz"].map(async (u) => {
      const d = await fetch(`${ue}${u}.jpg`);
      if (!d.ok) throw new Error(`sky ${u}: ${d.status}`);
      return createImageBitmap(await d.blob());
    }));
  } catch (u) {
    console.warn("sky box unavailable, using a white room", u);
    const d = ["side", "side", "up", "down", "side", "side"];
    re = await Promise.all(d.map((w) => createImageBitmap(Ln(64, w))));
  }
  const ae = F.createTexture({
    dimension: "2d",
    size: [re[0].width, re[0].height, 6],
    format: "rgba8unorm",
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
  });
  re.forEach((u, d) => F.queue.copyExternalImageToTexture({ source: u }, { texture: ae, origin: [0, 0, d] }, [u.width, u.height]));
  const te = ae.createView({ dimension: "cube" }), j = G[0] * G[1] * G[2], H = F.createBuffer({ size: ke * M, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST }), $ = F.createBuffer({ size: 32 * M, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST }), ie = F.createBuffer({ size: Xe.byteLength, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST }), Z = F.createBuffer({ size: 12, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST }), q = F.createTexture({ size: [f.width, f.height, 1], usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING, format: "r32float" }).createView(), X = [G[0], G[1], Math.ceil(G[2] / 128) * 128], ne = F.createBuffer({ size: 4 * X[0] * X[1] * X[2], usage: GPUBufferUsage.STORAGE }), xe = F.createBuffer({ size: 2 * X[0] * X[1] * X[2], usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC }), Y = F.createBuffer({ size: 12, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  F.queue.writeBuffer(Y, 0, new Float32Array(X));
  const C = F.createTexture({ size: [X[2], X[1], X[0]], usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST, format: "r16float", dimension: "3d" }), A = 60 * Math.PI / 180, me = 0.6, le = 2 * me, ye = 1e7, se = new Vn(
    H,
    $,
    ie,
    ne,
    xe,
    Z,
    Y,
    F,
    q,
    f,
    j,
    M,
    ye,
    le
  ), Ge = new On(
    ie,
    $,
    Y,
    Z,
    F,
    q,
    te,
    C.createView(),
    f,
    K,
    me,
    A,
    ye
  );
  se.initDambreak = function(u, d) {
    const w = new ArrayBuffer(ke * this.maxParticleCount);
    this.numParticles = 0;
    for (let e = 3; e < u[1] - 3 && this.numParticles < d; e += _)
      for (let o = 3; o < u[0] - 3 && this.numParticles < d; o += _)
        for (let n = 3; n < u[2] - 3 && this.numParticles < d; n += _) {
          const i = ke * this.numParticles;
          new Float32Array(w, i, 3).set([o + 0.3 * Math.random(), e + 0.3 * Math.random(), n + 0.3 * Math.random()]), this.numParticles++;
        }
    return w;
  };
  const Q = {
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
  }, W = new yn(Q), ce = () => {
    const u = f.clientWidth / Math.max(1, f.clientHeight), w = (G[0] - 7) / 2 / 0.9 / (Math.tan(A / 2) * u) + (G[2] / 2 - 3);
    W.reset(w, [G[0] / 2, k * 0.5, G[2] / 2], A, 0.7), W.currentXtheta = 0, W.currentYtheta = -((v.elevation ?? 10) * Math.PI) / 180, W.recalculateView();
  };
  se.reset(G, M), ce();
  let fe = !1;
  W.currentHoverX = W.prevHoverX = -1e4, W.currentHoverY = W.prevHoverY = -1e4;
  const ge = (u, d) => {
    const w = f.getBoundingClientRect();
    if (u === null || d === void 0) {
      fe = !1, W.currentHoverX = W.prevHoverX = -1e4, W.currentHoverY = W.prevHoverY = -1e4;
      return;
    }
    fe || (W.prevHoverX = u - w.left, W.prevHoverY = d - w.top), fe = !0, W.currentHoverX = u - w.left, W.currentHoverY = d - w.top;
  }, we = () => {
    Ye.texelSize.set([1 / f.width, 1 / f.height]), Ye.sphereSize.set([le]), F.queue.writeBuffer(ie, 0, Xe);
    const u = F.createCommandEncoder();
    se.execute(
      u,
      [W.currentHoverX / f.clientWidth, W.currentHoverY / f.clientHeight],
      W.calcMouseVelocity().map((d) => d * 0.6),
      15,
      !1,
      0.4 * 0.8,
      !0,
      X
    ), Ge.execute(J, u, se.numParticles, !1, [140 / 255, 220 / 255, 240 / 255], 0.18), F.queue.submit([u.finish()]), W.setNewPrevMouseCoord();
  };
  let de = 0, r = !1;
  const p = () => {
    r || (we(), de = requestAnimationFrame(p));
  };
  return de = requestAnimationFrame(p), {
    particleCount: se.numParticles,
    setHand: ge,
    reset: () => {
      se.reset(G, M), ce();
    },
    advance: we,
    box: G,
    project: (u, d, w) => {
      const e = Ye.viewMatrix, o = Ye.projectionMatrix, n = e[0] * u + e[4] * d + e[8] * w + e[12], i = e[1] * u + e[5] * d + e[9] * w + e[13], a = e[2] * u + e[6] * d + e[10] * w + e[14], g = e[3] * u + e[7] * d + e[11] * w + e[15], y = o[0] * n + o[4] * i + o[8] * a + o[12] * g, c = o[1] * n + o[5] * i + o[9] * a + o[13] * g, l = o[3] * n + o[7] * i + o[11] * a + o[15] * g, h = f.getBoundingClientRect();
      return { x: h.left + (y / l * 0.5 + 0.5) * h.width, y: h.top + (0.5 - c / l * 0.5) * h.height, behind: l <= 0 };
    },
    destroy: () => {
      r = !0, cancelAnimationFrame(de), F.destroy();
    }
  };
}
export {
  Cn as createTank
};
