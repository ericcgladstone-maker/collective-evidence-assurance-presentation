/* Collective evidence assurance: the twelve scenes.
   Built on the NCMA deck contract: build(svg, U) lays geometry out once, draw(ctx, t, U)
   sets every position, opacity and class from t alone. Glyphs follow the deck's grammar:
   ring = a reading carried with its strength, solid warm disc = a verdict without it,
   mint = in use or right, blue dashed = the other state, alert = wrong. */
(function () {
  'use strict';
  var NCMA = window.NCMA;
  var PNAS = 'Gladstone (2026a), PNAS Nexus, revise and resubmit';

  // ---- small local helpers -----------------------------------------------------------
  function hbar(p, x, y, h, cls) { var r = { el: null }; r.el = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); r.el.setAttribute('x', x); r.el.setAttribute('y', y); r.el.setAttribute('height', h); r.el.setAttribute('width', 0); r.el.setAttribute('class', cls); p.appendChild(r.el); return r.el; }
  function setW(el, w) { var v = Math.max(0, w).toFixed(1); if (el.getAttribute('width') !== v) el.setAttribute('width', v); }
  function vbar(p, x, base, w, cls) { var el = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); el.setAttribute('x', x); el.setAttribute('width', w); el.setAttribute('y', base); el.setAttribute('height', 0); el.setAttribute('class', cls); el._base = base; p.appendChild(el); return el; }
  function setH(el, h) { h = Math.max(0, h); var y = (el._base - h).toFixed(1), hv = h.toFixed(1); if (el.getAttribute('height') !== hv) { el.setAttribute('height', hv); el.setAttribute('y', y); } }
  function line(U, p, x1, y1, x2, y2, cls, arrow) { var l = U.el('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'class': cls || 'rule' }, p); if (arrow) l.setAttribute('marker-end', 'url(#arrow)'); return l; }
  function hidden(U, el) { U.op(el, 0); return el; }
  // a token cycling forever along a path: pure in t
  function cycle(U, tok, pts, t, start, period, travel, offset) {
    if (t < start) { U.op(tok, 0); return; }
    var local = ((t - start + (offset || 0)) % period + period) % period;
    if (local > travel) { U.op(tok, 0); return; }
    var p = U.ease(local / travel), xy = U.along(pts, p);
    U.place(tok, xy[0], xy[1]);
    U.op(tok, Math.min(1, local / 0.15, (travel - local) / 0.2));
  }
  function ring(U, cx, cy, R, n, rot) { var out = []; for (var i = 0; i < n; i++) { var th = (rot == null ? -Math.PI / 2 : rot) + i * 2 * Math.PI / n; out.push([cx + R * Math.cos(th), cy + R * Math.sin(th)]); } return out; }
  function edge(a, b, ra, rb) { var dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1; return [[a[0] + dx / d * ra, a[1] + dy / d * ra], [b[0] - dx / d * rb, b[1] - dy / d * rb]]; }

  // ---- 1. Opening ----------------------------------------------------------------------
  NCMA.scene({ id: 'cover', note: 'Schematic', source: '',
    desc: 'Seven agents pass readings along their links to a hub that reaches a joint judgment, which is then marked confident and wrong.',
    build: function (svg, U) {
      var c = {}, P = [[250, 170], [500, 110], [720, 250], [210, 430], [480, 420], [300, 650], [640, 600]];
      var hub = [1240, 400]; c.P = P; c.hub = hub;
      var E = [[0, 1], [1, 2], [0, 3], [3, 4], [1, 4], [4, 2], [3, 5], [5, 6], [4, 6]], H = [2, 4, 6];
      c.lk = U.g(svg); c.tkg = U.g(svg); c.nd = U.g(svg);
      c.paths = [];
      E.forEach(function (e) { U.link(c.lk, { x: P[e[0]][0], y: P[e[0]][1], r: 34 }, { x: P[e[1]][0], y: P[e[1]][1], r: 34 }); c.paths.push(edge(P[e[0]], P[e[1]], 44, 44)); c.paths.push(edge(P[e[1]], P[e[0]], 44, 44)); });
      c.hpaths = H.map(function (i) { U.link(c.lk, { x: P[i][0], y: P[i][1], r: 34 }, { x: hub[0], y: hub[1], r: 56 }, { arrow: true }); return edge(P[i], hub, 44, 66); });
      c.ag = P.map(function (p) { return U.agent(c.nd, { x: p[0], y: p[1], r: 34 }); });
      c.H = U.agent(c.nd, { x: hub[0], y: hub[1], r: 56, role: 'hub' });
      c.tks = c.paths.map(function (p, i) { return U.token(c.tkg, i % 3 ? 'evidence' : 'conclusion', { r: 13 }); });
      c.htks = c.hpaths.map(function () { return U.token(c.tkg, 'conclusion', { r: 15 }); });
      c.j = hidden(U, U.text(svg, hub[0], hub[1] + 120, 'joint judgment', 'lab', { 'text-anchor': 'middle' }));
      c.j2 = hidden(U, U.text(svg, hub[0], hub[1] + 160, 'confident · wrong', 'lab lab--alert', { 'text-anchor': 'middle' }));
      c.cr = U.lines(svg, 1180, 640, ['Eric Gladstone', 'Behavioral and computational scientist', 'Independent research · November 2026'], 'cap', 40);
      c.cr.firstChild.setAttribute('class', 'word--lg'); c.cr.firstChild.style.fill = '#F6FAFD';
      c.h1 = hidden(U, U.lines(svg, 1180, 100, ['human communication networks', 'correction improved fidelity and', 'created new mutated versions'], 'lab', 32));
      c.h2 = hidden(U, U.lines(svg, 1180, 220, ['language-model agent networks', 'assigned evidence · known answer', 'every message logged'], 'lab lab--hi', 32));
      return c;
    },
    draw: function (c, t, U) {
      c.paths.forEach(function (p, i) { cycle(U, c.tks[i], p, t, 0.4, 4.2, 1.4, i * 0.37); });
      var t1 = U.cue(3, 2);
      c.hpaths.forEach(function (p, i) { cycle(U, c.htks[i], p, t, t1, 3.6, 1.5, i * 0.5); });
      var on = t >= t1 + 1.5;
      U.cls(c.H.g, 'is-bad', on); U.setText(c.H.mark, on ? 'B' : '');
      U.fade(c.h1, t, U.say(1, 'In experimental work'), 0.7); U.fade(c.h2, t, U.say(2, 'More recently'), 0.7);
      U.fade(c.j, t, t1 + 1.5, 0.6); U.fade(c.j2, t, t1 + 2, 0.6);
    } });

  // ---- 2. Counting versus weighing ------------------------------------------------------
  NCMA.scene({ id: 'votes-vs-weight', note: 'Illustrative model · outcomes follow from stated rules · weights stipulated', source: '',
    desc: 'Five agents: three weak readings for B and two strong readings for A. A head count favors B three to two. Weighing by stipulated strength favors A.',
    build: function (svg, U) {
      var c = { ag: [], ev: [] }, Y = [100, 250, 400, 550, 700];
      Y.forEach(function (y, i) {
        var a = U.agent(svg, { x: 200, y: y, r: 36 }); c.ag.push(a);
        var strong = i >= 3, tk = U.token(svg, 'evidence', { r: strong ? 26 : 12, cls: strong ? 'clue-A' : 'clue-B' });
        U.place(tk, 300, y); U.op(tk, 1); c.ev.push(tk);
      });
      c.lw = U.text(svg, 90, 790, 'ring size = strength of the reading', 'lab', { 'text-anchor': 'start' });
      // readout 1: head count
      U.el('rect', { x: 520, y: 120, width: 520, height: 560, rx: 6, 'class': 'box' }, svg);
      U.text(svg, 550, 170, 'Count the verdicts', 'word word--lg');
      U.text(svg, 550, 300, 'B', 'big'); U.text(svg, 550, 480, 'A', 'big');
      c.cB = hbar(svg, 610, 262, 56, 'bar bar--mu'); c.cA = hbar(svg, 610, 442, 56, 'bar bar--mu');
      c.cBv = hidden(U, U.text(svg, 610, 360, '3 agents', 'lab')); c.cAv = hidden(U, U.text(svg, 610, 540, '2 agents', 'lab'));
      c.cOut = hidden(U, U.text(svg, 550, 640, 'favors B · wrong', 'lab lab--alert'));
      // readout 2: weighed
      U.el('rect', { x: 1120, y: 120, width: 620, height: 560, rx: 6, 'class': 'box' }, svg);
      U.text(svg, 1150, 170, 'Weigh each reading', 'word word--lg');
      U.text(svg, 1150, 300, 'B', 'big'); U.text(svg, 1150, 480, 'A', 'big');
      c.wB = hbar(svg, 1210, 262, 56, 'bar bar--mu'); c.wA = hbar(svg, 1210, 442, 56, 'bar bar--hi');
      c.wBv = hidden(U, U.text(svg, 1210, 360, '3 × weight 1 = 3', 'lab')); c.wAv = hidden(U, U.text(svg, 1210, 540, '2 × weight 3 = 6', 'lab lab--hi'));
      c.wOut = hidden(U, U.text(svg, 1150, 640, 'favors A · right', 'lab lab--hi'));
      return c;
    },
    draw: function (c, t, U) {
      var tv = U.say(0, 'Three receive weak observations'), tc = U.say(0, 'Ask each agent for a verdict'), tw = U.say(0, 'Combine the five observations');
      c.ag.forEach(function (a, i) { var on = t >= tv + i * 0.25; var v = on ? (i >= 3 ? 'A' : 'B') : ''; U.cls(a.g, 'is-A', v === 'A'); U.cls(a.g, 'is-B', v === 'B'); U.setText(a.mark, v); });
      var k = 90;
      setW(c.cB, 3 * k * U.ramp(t, tc, 1)); setW(c.cA, 2 * k * U.ramp(t, tc + 0.3, 1));
      U.fade(c.cBv, t, tc + 0.6, 0.5); U.fade(c.cAv, t, tc + 0.9, 0.5); U.fade(c.cOut, t, tc + 1.6, 0.6);
      var w = 75;
      setW(c.wB, 3 * w * U.ramp(t, tw, 1)); setW(c.wA, 6 * w * U.ramp(t, tw + 0.3, 1.2));
      U.fade(c.wBv, t, tw + 0.6, 0.5); U.fade(c.wAv, t, tw + 1, 0.5); U.fade(c.wOut, t, tw + 1.8, 0.6);
    } });

  // ---- 3. Evidence or conclusions --------------------------------------------------------
  function k5(U, svg, cx, cy, R, kind) {
    var g = U.g(svg), P = ring(U, cx, cy, R, 5), o = { P: P, paths: [], tks: [], ag: [] };
    var lk = U.g(g), tk = U.g(g), nd = U.g(g);
    for (var i = 0; i < 5; i++) for (var j = i + 1; j < 5; j++) { U.link(lk, { x: P[i][0], y: P[i][1], r: 30 }, { x: P[j][0], y: P[j][1], r: 30 }); o.paths.push(edge(P[i], P[j], 40, 40)); o.paths.push(edge(P[j], P[i], 40, 40)); }
    P.forEach(function (p) { o.ag.push(U.agent(nd, { x: p[0], y: p[1], r: 30 })); });
    o.paths.forEach(function () { o.tks.push(U.token(tk, kind, { r: 11 })); });
    o.g = g; return o;
  }
  NCMA.scene({ id: 'content-effect', note: 'Reported finding · five agents, fully connected, misleading majority', source: PNAS,
    desc: 'Two identical five-agent networks. In one, rings carrying evidence travel the links. In the other, solid discs carrying only verdicts. Accuracy 0.90 versus 0.64 in gpt-4.1-mini and 0.96 versus 0.62 in claude-sonnet-4-6.',
    build: function (svg, U) {
      var c = {};
      c.L = k5(U, svg, 420, 300, 190, 'evidence'); c.R = k5(U, svg, 1340, 300, 190, 'conclusion');
      U.text(svg, 420, 40, 'Evidence shared', 'lab lab--hi', { 'text-anchor': 'middle' });
      U.text(svg, 1340, 40, 'Conclusions only', 'lab lab--warm', { 'text-anchor': 'middle' });
      line(U, svg, 884, 60, 884, 520, 'rule');
      c.a1 = hidden(U, U.text(svg, 420, 640, '0.90', 'big big--hi', { 'text-anchor': 'middle' }));
      c.a2 = hidden(U, U.text(svg, 1340, 640, '0.64', 'big big--warm', { 'text-anchor': 'middle' }));
      c.m1 = hidden(U, U.text(svg, 884, 625, 'gpt-4.1-mini · 100 trials each', 'lab', { 'text-anchor': 'middle' }));
      c.b1 = hidden(U, U.text(svg, 420, 730, '0.96', 'word word--lg', { 'text-anchor': 'middle' }));
      c.b2 = hidden(U, U.text(svg, 1340, 730, '0.62', 'word word--lg', { 'text-anchor': 'middle' }));
      c.m2 = hidden(U, U.text(svg, 884, 722, 'claude-sonnet-4-6 · 50 trials each', 'lab', { 'text-anchor': 'middle' }));
      c.acc = hidden(U, U.text(svg, 884, 560, 'collective accuracy', 'lab lab--t2', { 'text-anchor': 'middle' }));
      return c;
    },
    draw: function (c, t, U) {
      [c.L, c.R].forEach(function (n) { n.paths.forEach(function (p, i) { cycle(U, n.tks[i], p, t, 0.3, 3.2, 1.2, (i % 10) * 0.31 + (i > 9 ? 1.6 : 0)); }); });
      var ta = U.say(1, 'collective accuracy was 0.90'), tb = U.say(1, 'and 0.64 when conclusions'), tc = U.say(1, 'With claude-sonnet-4-6');
      U.fade(c.acc, t, ta - 0.3, 0.5); U.fade(c.a1, t, ta, 0.6); U.fade(c.m1, t, ta, 0.6); U.fade(c.a2, t, tb, 0.6);
      U.fade(c.b1, t, tc, 0.6); U.fade(c.b2, t, tc + 0.4, 0.6); U.fade(c.m2, t, tc, 0.6);
    } });

  // ---- 4. Dispersion: Figure 2C from the trial records ---------------------------------------
  // gpt-4.1-mini, five agents, all-channel, misleading majority, final round, log pool. N = 100 per arm.
  var ECDF = {"evidence_only":[0.005, 0.08, 0.086, 0.12, 0.153, 0.164, 0.23, 0.303, 0.375, 0.456, 0.526, 0.674, 0.675, 0.683, 0.695, 0.703, 0.711, 0.717, 0.725, 0.734, 0.741, 0.771, 0.773, 0.773, 0.774, 0.777, 0.778, 0.781, 0.788, 0.794, 0.817, 0.83, 0.83, 0.831, 0.836, 0.837, 0.838, 0.84, 0.844, 0.844, 0.853, 0.858, 0.858, 0.859, 0.866, 0.868, 0.87, 0.873, 0.875, 0.88, 0.882, 0.883, 0.883, 0.884, 0.896, 0.898, 0.899, 0.903, 0.905, 0.908, 0.909, 0.909, 0.911, 0.913, 0.916, 0.918, 0.921, 0.923, 0.923, 0.924, 0.926, 0.928, 0.928, 0.933, 0.935, 0.94, 0.941, 0.941, 0.942, 0.946, 0.946, 0.949, 0.95, 0.951, 0.952, 0.955, 0.957, 0.957, 0.962, 0.964, 0.966, 0.979, 0.986, 0.988, 0.99, 0.99, 0.991, 0.992, 0.993, 0.995],"conclusion_only":[0.0, 0.002, 0.002, 0.012, 0.016, 0.016, 0.026, 0.033, 0.034, 0.044, 0.052, 0.053, 0.072, 0.078, 0.084, 0.085, 0.117, 0.141, 0.161, 0.18, 0.192, 0.193, 0.196, 0.2, 0.23, 0.249, 0.254, 0.259, 0.273, 0.303, 0.312, 0.332, 0.416, 0.418, 0.427, 0.469, 0.511, 0.54, 0.583, 0.661, 0.663, 0.665, 0.718, 0.758, 0.764, 0.804, 0.824, 0.827, 0.856, 0.856, 0.862, 0.873, 0.875, 0.881, 0.888, 0.901, 0.912, 0.913, 0.921, 0.927, 0.935, 0.942, 0.947, 0.949, 0.951, 0.951, 0.954, 0.957, 0.958, 0.97, 0.973, 0.98, 0.985, 0.988, 0.991, 0.992, 0.994, 0.994, 0.994, 0.996, 0.998, 0.998, 0.998, 0.998, 0.998, 0.999, 0.999, 0.999, 0.999, 0.999, 0.999, 0.999, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]};
  NCMA.scene({ id: 'dispersion', note: 'Reported finding · empirical distribution from the trial records, 100 trials per condition', source: PNAS + ', Fig. 2C',
    desc: 'Empirical cumulative distributions of the final pooled probability on the true state. Evidence sharing stays concentrated at high probability. Conclusion sharing spreads toward both ends, with 36 of 100 trials left of 0.5 against 10 of 100.',
    build: function (svg, U) {
      var c = {}, X0 = 380, X1 = 1460, Y0 = 700, Y1 = 90;
      c.sx = function (v) { return X0 + (X1 - X0) * v; }; c.sy = function (v) { return Y0 - (Y0 - Y1) * v; };
      line(U, svg, X0, Y0, X1, Y0, 'rule'); line(U, svg, X0, Y0, X0, Y1, 'rule');
      [0, 0.5, 1].forEach(function (v) { U.text(svg, c.sx(v), Y0 + 40, v.toFixed(1), 'lab', { 'text-anchor': 'middle' }); U.text(svg, X0 - 18, c.sy(v) + 8, v.toFixed(1), 'lab', { 'text-anchor': 'end' }); });
      U.text(svg, (X0 + X1) / 2, Y0 + 88, 'final pooled probability on the true state', 'lab lab--t2', { 'text-anchor': 'middle' });
      U.text(svg, X0 - 92, (Y0 + Y1) / 2, 'cumulative share of trials', 'lab lab--t2', { 'text-anchor': 'middle', transform: 'rotate(-90 ' + (X0 - 92) + ' ' + ((Y0 + Y1) / 2) + ')' });
      U.el('line', { x1: c.sx(0.5), y1: Y0, x2: c.sx(0.5), y2: Y1, 'class': 'rule', 'stroke-dasharray': '3 7' }, svg);
      var clip = U.el('clipPath', { id: 'ecdf-clip' }, svg.querySelector('defs'));
      c.clip = U.el('rect', { x: X0 - 4, y: Y1 - 20, width: 0, height: Y0 - Y1 + 30 }, clip);
      function path(arr) { var n = arr.length, d = 'M' + c.sx(0) + ',' + c.sy(0); arr.forEach(function (v, i) { d += ' L' + c.sx(v).toFixed(1) + ',' + c.sy(i / n).toFixed(1) + ' L' + c.sx(v).toFixed(1) + ',' + c.sy((i + 1) / n).toFixed(1); }); return d + ' L' + c.sx(1) + ',' + c.sy(1); }
      var g = U.g(svg, null, { 'clip-path': 'url(#ecdf-clip)' });
      U.el('path', { d: path(ECDF.evidence_only), fill: 'none', stroke: '#6FD8BE', 'stroke-width': 4 }, g);
      U.el('path', { d: path(ECDF.conclusion_only), fill: 'none', stroke: '#D9A863', 'stroke-width': 4, 'stroke-dasharray': '14 9' }, g);
      c.le = hidden(U, U.text(svg, c.sx(0.62), c.sy(0.05), 'evidence shared', 'lab lab--hi'));
      c.lc = hidden(U, U.text(svg, c.sx(0.06), c.sy(0.48), 'conclusions only', 'lab lab--warm'));
      c.n1 = hidden(U, U.text(svg, c.sx(0.5) - 16, c.sy(0.36) - 14, '36 of 100', 'word word--lg', { 'text-anchor': 'end' }));
      c.d1 = hidden(U, U.el('circle', { cx: c.sx(0.5), cy: c.sy(0.36), r: 8, fill: '#D9A863' }, svg));
      c.n2 = hidden(U, U.text(svg, c.sx(0.5) + 18, c.sy(0.10) - 14, '10 of 100', 'word word--lg'));
      c.d2 = hidden(U, U.el('circle', { cx: c.sx(0.5), cy: c.sy(0.10), r: 8, fill: '#6FD8BE' }, svg));
      c.w = hidden(U, U.text(svg, c.sx(0.25), c.sy(0.92), 'wrong side', 'lab', { 'text-anchor': 'middle' }));
      c.r = hidden(U, U.text(svg, c.sx(0.75), c.sy(0.92), 'right side', 'lab', { 'text-anchor': 'middle' }));
      c.X1 = X1; c.X0 = X0;
      return c;
    },
    draw: function (c, t, U) {
      c.clip.setAttribute('width', ((c.X1 - c.X0 + 10) * U.ramp(t, U.cue(0, 1), 5)).toFixed(1));
      U.fade(c.le, t, U.cue(0, 5), 0.6); U.fade(c.lc, t, U.cue(0, 5.4), 0.6);
      var t1 = U.cue(1);
      U.fade(c.w, t, t1, 0.6); U.fade(c.r, t, t1, 0.6);
      var a = U.say(1, 'Thirty-six conclusion-sharing trials'), b = U.say(1, 'compared with ten');
      U.fade(c.d1, t, a, 0.4); U.fade(c.n1, t, a, 0.5); U.fade(c.d2, t, b, 0.4); U.fade(c.n2, t, b, 0.5);
    } });

  // ---- 5. Response to verdicts -------------------------------------------------------------
  NCMA.scene({ id: 'verdict-response', note: 'Reported finding · 11 agents, conclusion sharing, gpt-4.1-mini, 1,500 agent-trials', source: PNAS + ', S6.6',
    desc: 'An agent holding strong evidence for the true state receives verdict discs from a growing number of neighbors. Bars compare 0.1 percent of cases in which a confidence-weighted benchmark predicted a crossing to the incorrect decision with 26.9 percent observed.',
    build: function (svg, U) {
      var c = {}, C = [440, 400], N = ring(U, C[0], C[1], 290, 10, -Math.PI / 2);
      c.lk = U.g(svg); c.tkg = U.g(svg); c.nd = U.g(svg);
      c.links = []; c.paths = []; c.nb = []; c.tks = [];
      N.forEach(function (p, i) {
        c.links.push(U.link(c.lk, { x: p[0], y: p[1], r: 28 }, { x: C[0], y: C[1], r: 48 }, { arrow: true }));
        c.paths.push(edge(p, C, 38, 62));
        c.nb.push(U.agent(c.nd, { x: p[0], y: p[1], r: 28 }));
        c.tks.push(U.token(c.tkg, 'conclusion', { r: 13 }));
      });
      c.me = U.agent(c.nd, { x: C[0], y: C[1], r: 48 });
      var ev = U.token(c.nd, 'evidence', { r: 24, cls: 'clue-A' }); U.place(ev, C[0] + 78, C[1] - 64); U.op(ev, 1);
      c.fan = U.text(svg, C[0], 780, 'fan-in varied from 2 to 10 across six cells', 'lab lab--t2', { 'text-anchor': 'middle' });
      var X0 = 1000, W = 680;
      U.text(svg, X0, 120, 'Crossed from a correct to an incorrect decision', 'word word--lg');
      U.text(svg, X0, 160, 'pooled over six cells · 1,500 agent-trials', 'lab');
      U.text(svg, X0, 260, 'predicted by the confidence-weighted benchmark', 'lab lab--t2');
      c.b1 = hbar(svg, X0, 280, 52, 'bar bar--hi'); c.v1 = hidden(U, U.text(svg, X0 + 24, 318, '0.1%', 'word word--lg'));
      U.text(svg, X0, 420, 'observed', 'lab lab--t2');
      c.b2 = hbar(svg, X0, 440, 52, 'bar bar--warm'); c.v2 = hidden(U, U.text(svg, X0, 540, '26.9%', 'big big--warm'));
      line(U, svg, X0, 240, X0, 510, 'rule');
      c.r = hidden(U, U.lines(svg, X0, 640, ['separately: the excess rose with fan-in,', 'correlation 0.91 across six aggregate cells'], 'cap', 38));
      c.W = W; c.X0 = X0;
      return c;
    },
    draw: function (c, t, U) {
      var k = 2 + Math.floor(U.clamp((t - U.cue(0, 2)) / 1.2, 0, 8)), order = [0, 5, 1, 6, 2, 7, 3, 8, 4, 9], on = {};
      for (var i = 0; i < k; i++) on[order[i]] = 1;
      c.nb.forEach(function (n, i) { U.op(n.g, on[i] ? 1 : 0.12); U.op(c.links[i], on[i] ? 0.8 : 0.08); if (on[i]) cycle(U, c.tks[i], c.paths[i], t, 0.5, 2.8, 1.3, i * 0.29); else U.op(c.tks[i], 0); });
            var a = U.say(1, 'crossed to the wrong side in 0.1 percent'), b = U.say(1, 'actually crossed in 26.9 percent');
      setW(c.b1, c.W * 0.001 / 0.30 * U.ramp(t, a, 0.6) + (t >= a ? 3 : 0)); U.fade(c.v1, t, a + 0.3, 0.5);
      setW(c.b2, c.W * 0.269 / 0.30 * U.ramp(t, b, 1.2)); U.fade(c.v2, t, b + 0.8, 0.5);
      U.fade(c.r, t, U.say(1, 'Across the six fan-in cells'), 0.6);
    } });

  // ---- 6. Planted verdict ---------------------------------------------------------------------
  NCMA.scene({ id: 'planted', note: 'Reported finding · causal intervention, five agents, conclusion sharing, private evidence fixed', source: PNAS + ', Table S23',
    desc: 'A planted first verdict enters a five-agent network, first correct, then incorrect. Bars show final collective probability on the true state: gpt-4.1-mini 0.85, 0.59 and 0.34 for correct, no and incorrect plants, claude-sonnet-4-6 0.99, 0.76 and 0.36.',
    build: function (svg, U) {
      var c = {}, P = ring(U, 400, 420, 210, 5);
      var lk = U.g(svg); c.tkg = U.g(svg); var nd = U.g(svg);
      for (var i = 0; i < 5; i++) for (var j = i + 1; j < 5; j++) U.link(lk, { x: P[i][0], y: P[i][1], r: 32 }, { x: P[j][0], y: P[j][1], r: 32 });
      c.ag = P.map(function (p) { return U.agent(nd, { x: p[0], y: p[1], r: 32 }); });
      c.inPath = [[400, 60], [P[0][0], P[0][1] - 46]];
      c.plantA = U.token(c.tkg, 'conclusion', { r: 22, label: 'A' }); c.plantB = U.token(c.tkg, 'conclusion', { r: 22, label: 'B' });
      c.pl = U.text(svg, 470, 70, 'planted first verdict', 'lab lab--warm');
      c.cond = U.text(svg, 400, 770, '', 'lab lab--t2', { 'text-anchor': 'middle' });
      // bars of final P(true)
      var base = 570, H = 400, X = [940, 1360], vals = [[0.85, 0.59, 0.34], [0.99, 0.76, 0.36]], cls = ['bar bar--hi', 'bar bar--mu', 'bar bar--alert'], names = ['correct', 'none', 'incorrect'];
      line(U, svg, 900, base, 1740, base, 'rule');
      U.text(svg, 900, 70, 'final collective probability on the true state', 'lab lab--t2'); U.text(svg, 1305, base + 215, 'change in P(true): incorrect plant minus correct plant', 'lab', { 'text-anchor': 'middle' });
      c.bars = []; c.vals = vals; c.H = H;
      X.forEach(function (x0, g) {
        vals[g].forEach(function (v, k) { var b = vbar(svg, x0 + k * 115, base, 80, cls[k]); c.bars.push(b); U.text(svg, x0 + k * 115 + 40, base + 36, names[k], 'lab', { 'text-anchor': 'middle' }); b._val = hidden(U, U.text(svg, x0 + k * 115 + 40, base - H * v - 16, v.toFixed(2), 'lab lab--t2', { 'text-anchor': 'middle' })); });
        U.text(svg, x0 + 155, base + 84, g ? 'claude-sonnet-4-6 · 15 trials' : 'gpt-4.1-mini · 40 trials', 'lab lab--t2', { 'text-anchor': 'middle' });
      });
      c.d1 = hidden(U, U.lines(svg, 1095, base + 140, ['−0.51', ''], 'big big--warm', 10, { 'text-anchor': 'middle' }));
      c.d2 = hidden(U, U.lines(svg, 1515, base + 140, ['−0.64', ''], 'big big--warm', 10, { 'text-anchor': 'middle' }));
      return c;
    },
    draw: function (c, t, U) {
      var t0 = U.cue(0, 2), t1 = U.say(1, 'Replacing the correct plant'), useB = t >= t1;
      var flight = U.ramp(t, useB ? t1 : t0, 1.4), xy = U.along(c.inPath, flight);
      U.place(useB ? c.plantB : c.plantA, xy[0], xy[1]); U.op(useB ? c.plantB : c.plantA, t >= t0 ? 1 : 0); U.op(useB ? c.plantA : c.plantB, 0);
      U.setText(c.cond, t < t0 ? '' : useB ? 'incorrect plant' : 'correct plant');
      var tb = U.cue(0, 4);
      c.bars.forEach(function (b, i) { var g = Math.floor(i / 3), k = i % 3, v = c.vals[g][k]; setH(b, c.H * v * U.ramp(t, tb + i * 0.2, 1)); U.fade(b._val, t, tb + i * 0.2 + 0.8, 0.4); });
      U.fade(c.d1, t, U.say(1, 'by 0.51'), 0.6); U.fade(c.d2, t, U.say(1, 'by 0.64'), 0.6);
    } });

  // ---- 7. Boundaries ----------------------------------------------------------------------------
  NCMA.scene({ id: 'boundaries', note: 'Reported finding · fan-in reversal in gpt-4.1-mini only · model and reasoning budget confounded for gemini', source: PNAS,
    desc: 'Left: at the highest fan-in, evidence sharing 0.38 versus conclusion sharing 0.58 with a misleading majority, 0.68 versus 0.96 when all readings favor the truth. Right: gemini-2.5-flash 0.93 under conclusion sharing, claude-sonnet-4-6 0.62 rising to 1.00 with extended reasoning at about 3.3 times the cost.',
    build: function (svg, U) {
      var c = {}, base = 640, H = 460;
      U.text(svg, 60, 50, '11 agents · highest fan-in · gpt-4.1-mini', 'lab lab--t2');
      line(U, svg, 60, base, 800, base, 'rule');
      var groups = [[0.38, 0.58, 'misleading majority'], [0.68, 0.96, 'all readings favor truth']];
      c.bars = [];
      groups.forEach(function (g, i) {
        var x = 110 + i * 360;
        [0, 1].forEach(function (k) { var b = vbar(svg, x + k * 130, base, 100, k ? 'bar bar--warm' : 'bar bar--hi'); b._v = g[k]; c.bars.push(b); b._lab = hidden(U, U.text(svg, x + k * 130 + 50, base - H * g[k] - 16, g[k].toFixed(2), 'lab lab--t2', { 'text-anchor': 'middle' })); });
        U.text(svg, x + 115, base + 40, g[2], 'lab', { 'text-anchor': 'middle' });
      });
      U.text(svg, 110, base + 100, 'evidence', 'lab lab--hi'); U.text(svg, 290, base + 100, 'conclusions', 'lab lab--warm');
      c.H = H; c.base = base;
      // model boundary
      line(U, svg, 920, 40, 920, 760, 'rule');
      var X0 = 1000, W = 640;
      U.text(svg, X0, 50, 'accuracy under conclusion sharing', 'lab lab--t2');
      U.text(svg, X0, 160, 'gemini-2.5-flash · larger reasoning budget', 'lab');
      c.g = hbar(svg, X0, 180, 50, 'bar bar--mu'); c.gv = hidden(U, U.text(svg, X0, 290, '0.93 · family and budget confounded', 'word'));
      U.text(svg, X0, 420, 'claude-sonnet-4-6 · extended private reasoning', 'lab');
      c.c0 = hbar(svg, X0, 440, 50, 'bar bar--warm'); c.c1 = hbar(svg, X0, 440, 50, 'bar bar--hi');
      c.cv = hidden(U, U.text(svg, X0, 550, '0.62 → 1.00', 'big'));
      c.cc = hidden(U, U.text(svg, X0, 610, 'about 3.3 times the cost per agent', 'word'));
      c.W = W; c.X0 = X0;
      return c;
    },
    draw: function (c, t, U) {
      var tb = U.say(0, 'evidence sharing was less accurate');
      c.bars.forEach(function (b, i) { setH(b, c.H * b._v * U.ramp(t, tb + i * 0.35, 1)); U.fade(b._lab, t, tb + i * 0.35 + 0.8, 0.4); });
      var tg = U.say(2, 'Gemini\'s high');
      setW(c.g, c.W * 0.93 * U.ramp(t, tg, 1)); U.fade(c.gv, t, tg + 0.8, 0.5);
      var tc = U.say(2, 'Within claude-sonnet-4-6'), tr = U.say(2, 'from 0.62 to 1.00');
      setW(c.c0, c.W * 0.62 * U.ramp(t, tc, 0.8));
      c.c1.setAttribute('x', (c.X0 + c.W * 0.62).toFixed(1)); setW(c.c1, c.W * 0.38 * U.ramp(t, tr, 1.2));
      U.fade(c.cv, t, tr, 0.6); U.fade(c.cc, t, tr + 1, 0.6);
    } });

  // ---- 8. Related programs -------------------------------------------------------------------------
  NCMA.scene({ id: 'neighborhood', note: 'Public program descriptions · stated as differences of measure', source: 'DARPA program pages, 2026',
    desc: 'Three boxes for MATHBAC, DICE and SIQ with what each measures, and a dashed box for the proposed program: confident collective error on known-answer tasks, predicted in held-out configurations, controls judged at matched coverage.',
    build: function (svg, U) {
      var c = { b: [] }, W = 540, specs = [
        ['MATHBAC', 'DSO', ['theory of agent protocols and content', 'judged by success, speed, generalization', 'on scientific-discovery tasks']],
        ['DICE', 'IPTO', ['decentralized coordination for missions', 'evaluation includes contradictory evidence', 'judged by mission success, scale, recovery']],
        ['SIQ', 'IPTO', ['prediction of model performance', 'in scenarios not yet evaluated', 'single models']]];
      specs.forEach(function (s, i) {
        var x = i * (W + 74), g = U.g(svg);
        U.el('rect', { x: x, y: 20, width: W, height: 330, rx: 6, 'class': 'box' }, g);
        U.text(g, x + 34, 90, s[0], 'big'); U.text(g, x + W - 34, 88, s[1], 'lab', { 'text-anchor': 'end' });
        U.lines(g, x + 34, 170, s[2], 'cap', 46);
        c.b.push(hidden(U, g));
      });
      var g = U.g(svg);
      U.el('rect', { x: 330, y: 440, width: 1108, height: 330, rx: 6, 'class': 'zone' }, g);
      U.text(g, 370, 510, 'Proposed · CEA', 'big big--hi');
      U.lines(g, 370, 590, ['confident collective error on tasks with known answers', 'predicted in held-out graphs, models and task families', 'controls judged at matched coverage, accuracy and calibration'], 'cap', 46);
      c.cea = hidden(U, g);
      return c;
    },
    draw: function (c, t, U) {
      U.fade(c.b[0], t, U.say(0, 'MATHBAC'), 0.7); U.fade(c.b[1], t, U.say(0, 'DICE'), 0.7); U.fade(c.b[2], t, U.say(0, 'SIQ'), 0.7);
      U.fade(c.cea, t, U.cue(1), 0.8);
    } });

  // ---- 9. Distortion: three updates on one signed axis ----------------------------------------
  NCMA.scene({ id: 'distortion', note: 'Proposed construct · illustrative values · no distortion score has been computed', source: '',
    desc: 'One horizontal axis of change in log-odds toward the true state, measured from the belief after the private signal. Three illustrative updates are plotted from zero: oracle, message-conditioned and observed. The gap between oracle and message-conditioned is information not available through the messages. The gap between observed and message-conditioned is the candidate distortion.',
    build: function (svg, U) {
      var c = {}, X0 = 560, k = 230, sx = function (v) { return X0 + k * v; }; c.sx = sx;
      c.ax = U.g(svg);
      U.el('line', { x1: sx(-2), y1: 640, x2: sx(4.4), y2: 640, 'class': 'rule', 'stroke-width': 2 }, c.ax);
      [-2, -1, 0, 1, 2, 3, 4].forEach(function (v) { U.el('line', { x1: sx(v), y1: 632, x2: sx(v), y2: 648, 'class': 'rule' }, c.ax); U.text(c.ax, sx(v), 684, (v > 0 ? '+' : '') + v, 'lab', { 'text-anchor': 'middle' }); });
      U.el('line', { x1: sx(0), y1: 60, x2: sx(0), y2: 660, 'class': 'rule', 'stroke-dasharray': '4 6' }, c.ax);
      U.text(c.ax, sx(0), 40, 'pre-message belief', 'lab lab--t2', { 'text-anchor': 'middle' });
      U.text(c.ax, sx(1.2), 740, 'change in log-odds toward the true state', 'lab lab--t2', { 'text-anchor': 'middle' });
      U.text(c.ax, sx(-2), 740, 'away from truth', 'lab'); U.text(c.ax, sx(4.4), 740, 'toward truth', 'lab', { 'text-anchor': 'end' });
      U.op(c.ax, 0);
      var rows = [['oracle update', 3.6, 140, '#D8F2FF'], ['message-conditioned update', 1.8, 300, '#6FD8BE'], ['observed update', -0.6, 460, '#D9A863']];
      c.rows = rows.map(function (r) {
        var g = U.g(svg);
        U.text(g, 0, r[2] + 9, r[0], 'word word--lg');
        var ln = U.el('line', { x1: sx(0), y1: r[2], x2: sx(0), y2: r[2], stroke: r[3], 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
        var dot = U.el('circle', { cx: sx(0), cy: r[2], r: 13, fill: r[3] }, g);
        U.op(g, 0); return { g: g, ln: ln, dot: dot, v: r[1], y: r[2] };
      });
      c.b1 = U.g(svg);
      U.el('path', { d: 'M' + sx(1.8) + ',210 L' + sx(1.8) + ',190 L' + sx(3.6) + ',190 L' + sx(3.6) + ',210', 'class': 'rule' }, c.b1);
      U.text(c.b1, sx(2.7), 176, 'not available through the messages', 'lab', { 'text-anchor': 'middle' });
      U.op(c.b1, 0);
      c.b2 = U.g(svg);
      U.el('line', { x1: sx(1.8), y1: 320, x2: sx(1.8), y2: 510, 'class': 'rule', 'stroke-dasharray': '4 6' }, c.b2);
      U.el('path', { d: 'M' + sx(-0.6) + ',490 L' + sx(-0.6) + ',510 L' + sx(1.8) + ',510 L' + sx(1.8) + ',490', 'class': 'rule', stroke: '#6FD8BE' }, c.b2);
      U.text(c.b2, sx(0.6), 546, 'distortion = observed − message-conditioned', 'lab lab--hi', { 'text-anchor': 'middle' });
      U.text(c.b2, sx(0.6), 580, 'negative here: less toward truth than warranted', 'lab', { 'text-anchor': 'middle' });
      U.op(c.b2, 0);
      return c;
    },
    draw: function (c, t, U) {
      U.fade(c.ax, t, U.cue(0, 1), 0.8);
      var ph = [U.say(1, 'The oracle update is'), U.say(1, 'The message-conditioned update is'), U.say(1, 'The observed update is')];
      c.rows.forEach(function (r, i) {
        U.fade(r.g, t, ph[i], 0.4);
        var x = c.sx(r.v * U.ramp(t, ph[i] + 0.3, 1.4));
        r.ln.setAttribute('x2', x.toFixed(1)); r.dot.setAttribute('cx', x.toFixed(1));
      });
      U.fade(c.b1, t, U.say(2, 'The oracle-minus-message-conditioned'), 0.7);
      U.fade(c.b2, t, U.say(2, 'The observed-minus-message-conditioned'), 0.7);
    } });

  // ---- 10. Repeated relay: identical delivery, different ancestry ----------------------------------
  function relay(U, svg, ox, single, c, tag) {
    var lk = U.g(svg), nd = U.g(svg), tkg = U.g(svg), R = [[ox + 330, 150], [ox + 330, 310], [ox + 330, 490], [ox + 330, 650]], rec = [ox + 640, 400];
    var S = single ? [[ox + 60, 400]] : [[ox + 60, 150], [ox + 60, 310], [ox + 60, 490], [ox + 60, 650]];
    var up = R.map(function (r, i) { var s0 = S[single ? 0 : i]; U.link(lk, { x: s0[0], y: s0[1], r: 26 }, { x: r[0], y: r[1], r: 28 }); return edge(s0, r, 36, 38); });
    var dn = R.map(function (r) { U.link(lk, { x: r[0], y: r[1], r: 28 }, { x: rec[0], y: rec[1], r: 46 }, { arrow: true }); return edge(r, rec, 38, 60); });
    S.forEach(function (s0) { U.agent(nd, { x: s0[0], y: s0[1], r: 26, role: 'doc' }); });
    R.forEach(function (r) { U.agent(nd, { x: r[0], y: r[1], r: 28 }); });
    U.agent(nd, { x: rec[0], y: rec[1], r: 46 });
    c[tag] = { up: up, dn: dn, t1: up.map(function () { return U.token(tkg, 'evidence', { r: 13 }); }), t2: dn.map(function () { return U.token(tkg, 'evidence', { r: 13 }); }), rec: rec };
  }
  NCMA.scene({ id: 'duplication', note: 'Planned manipulation · illustrative scheme · not tested in the experiments shown', source: 'Gladstone (2026b), TACL, under review',
    desc: 'Two networks with the same delivery structure: four relays each pass one message to a recipient. On the left the relays draw on four separate observations. On the right all four draw on one observation. Both recipients receive four messages.',
    build: function (svg, U) {
      var c = {};
      relay(U, svg, 0, false, c, 'L'); relay(U, svg, 1000, true, c, 'R');
      U.text(svg, 380, 40, '4 observations · 4 arrivals', 'lab lab--hi', { 'text-anchor': 'middle' });
      U.text(svg, 1380, 40, '1 observation · 4 arrivals', 'lab lab--warm', { 'text-anchor': 'middle' });
      U.el('line', { x1: 884, y1: 60, x2: 884, y2: 740, 'class': 'rule' }, svg);
      c.cL = hidden(U, U.text(svg, 640, 500, '4', 'big', { 'text-anchor': 'middle' })); c.cR = hidden(U, U.text(svg, 1640, 500, '4', 'big', { 'text-anchor': 'middle' }));
      c.same = hidden(U, U.text(svg, 884, 780, 'same relays, same paths, same count · different ancestry · planned, untested', 'lab', { 'text-anchor': 'middle' }));
      c.ct = hidden(U, U.text(svg, 1060, 560, 'circular reporting', 'lab lab--warm'));
      return c;
    },
    draw: function (c, t, U) {
      ['L', 'R'].forEach(function (k) { var n = c[k];
        n.up.forEach(function (p, i) { cycle(U, n.t1[i], p, t, 0.6, 4.4, 1.0, 0); });
        n.dn.forEach(function (p, i) { cycle(U, n.t2[i], p, t, 1.6, 4.4, 1.2, 0); }); });
      var ta = U.say(0, 'The recipient sees four arrivals');
      U.fade(c.cL, t, ta, 0.6); U.fade(c.cR, t, ta, 0.6);
      U.fade(c.ct, t, U.say(0, 'circular reporting'), 0.6);
      U.fade(c.same, t, U.cue(1), 0.6);
    } });

  // ---- 11. Month-22 gate ------------------------------------------------------------------------------
  NCMA.scene({ id: 'gate', note: 'Proposed examination · targets provisional', source: '',
    desc: 'A timeline of four rounds. The predictor reads only rounds 0 and 1. Final beliefs go only to a scorer as labels. Three gate boxes, for held-out graphs, models and one task family, each with AUROC, calibration and coverage targets, and a fail path that ends the transfer claim.',
    build: function (svg, U) {
      var c = {}, names = ['round 0', 'round 1', 'round 2', 'final'], X = [40, 260, 480, 700];
      X.forEach(function (x, i) { U.el('rect', { x: x, y: 30, width: 180, height: 70, rx: 6, 'class': i < 2 ? 'box box--hi' : 'box' }, svg); U.text(svg, x + 90, 74, names[i], i < 2 ? 'lab lab--hi' : 'lab', { 'text-anchor': 'middle' }); });
      U.el('line', { x1: 460, y1: 10, x2: 460, y2: 330, 'class': 'rule', 'stroke-dasharray': '4 6' }, svg);
      U.text(svg, 470, 140, 'prediction point', 'lab lab--t2');
      c.pr = U.g(svg);
      U.el('rect', { x: 40, y: 220, width: 400, height: 90, rx: 6, 'class': 'box box--hi' }, c.pr); U.text(c.pr, 240, 274, 'predictor', 'word word--lg', { 'text-anchor': 'middle' });
      line(U, c.pr, 130, 104, 160, 214, 'ln is-live', true); line(U, c.pr, 350, 104, 320, 214, 'ln is-live', true);
      c.sc = U.g(svg);
      U.el('rect', { x: 600, y: 220, width: 300, height: 90, rx: 6, 'class': 'box' }, c.sc); U.text(c.sc, 750, 274, 'scorer', 'word word--lg', { 'text-anchor': 'middle' });
      line(U, c.sc, 790, 104, 760, 214, 'ln', true); line(U, c.sc, 444, 265, 594, 265, 'ln', true);
      U.text(c.sc, 950, 262, 'final beliefs are labels, never inputs', 'lab'); U.text(c.sc, 950, 296, 'confidently wrong = at least 0.8 on the wrong answer', 'lab');
      U.op(c.pr, 0); U.op(c.sc, 0);
      c.gates = []; var G = ['held-out graphs', 'held-out models', 'held-out task family'];
      G.forEach(function (gname, i) {
        var x = i * 600, g = U.g(svg);
        U.el('rect', { x: x, y: 420, width: 560, height: 250, rx: 6, 'class': 'box' }, g);
        U.text(g, x + 30, 476, gname, 'word word--lg');
        U.lines(g, x + 30, 540, ['AUROC at least baseline + 0.10', 'expected calibration error < 0.05', 'coverage at least 80 percent'], 'cap', 40);
        U.op(g, 0); c.gates.push(g);
      });
      c.fail = hidden(U, U.text(svg, 0, 740, 'any family fails → the broad transfer claim ends · no automatic Phase III', 'word word--lg'));
      c.prov = hidden(U, U.text(svg, 0, 790, 'month 22 · independent evaluators · targets provisional', 'lab'));
      return c;
    },
    draw: function (c, t, U) {
      U.fade(c.pr, t, U.cue(0, 1), 0.7); U.fade(c.sc, t, U.cue(0, 3), 0.7);
      var t1 = U.cue(1); c.gates.forEach(function (g, i) { U.fade(g, t, t1 + i * 1.2, 0.7); });
      U.fade(c.prov, t, t1 + 3, 0.6);
      U.fade(c.fail, t, U.cue(2), 0.7);
    } });

  // ---- 12. What would change ----------------------------------------------------------------------------
  NCMA.scene({ id: 'success', note: 'Proposed examination · planning assumptions, no funding or transition partner', source: '',
    desc: 'Three candidate controls enter a scoreboard of five month-36 requirements: confidently wrong judgments halved, decision accuracy up five points, log score improved, coverage and latency matched. A timeline strip shows phases at months 1 to 9, 10 to 22 with the gate, and 23 to 36.',
    build: function (svg, U) {
      var c = {}, ctr = ['provenance tags', 'routing limits', 'targeted rechecking'];
      c.ct = ctr.map(function (s, i) { var g = U.g(svg); var tk = U.token(g, 'instruction', { r: 16 }); U.place(tk, 40, 70 + i * 80); U.op(tk, 1); U.text(g, 76, 79 + i * 80, s, 'cap'); U.op(g, 0); return g; });
      var cols = [[['confidently', 'wrong'], 'halved'], [['decision', 'accuracy'], '+5 points'], [['log', 'score'], 'improved'], [['coverage'], 'matched'], [['latency'], 'matched']];
      c.cols = cols.map(function (s, i) { var x = 460 + i * 262, g = U.g(svg); U.el('rect', { x: x, y: 30, width: 240, height: 230, rx: 6, 'class': i < 3 ? 'box box--hi' : 'box' }, g); U.lines(g, x + 120, s[0].length > 1 ? 92 : 112, s[0], 'lab', 32, { 'text-anchor': 'middle' }); U.text(g, x + 120, 190, s[1], 'word word--lg', { 'text-anchor': 'middle' }); U.op(g, 0); return g; });
      c.m36 = hidden(U, U.text(svg, 460, 300, 'month 36 · blind duplication, corruption, model update, task shift', 'lab lab--t2'));
      // timeline
      var y = 480, x0 = 40, W = 1680, mx = function (m) { return x0 + W * m / 36; };
      c.tl = U.g(svg);
      U.el('line', { x1: x0, y1: y, x2: x0 + W, y2: y, 'class': 'rule', 'stroke-width': 3 }, c.tl);
      [[0, 9, 'Phase I · months 1 to 9'], [9, 22, 'Phase II · months 10 to 22'], [22, 36, 'Phase III · months 23 to 36, if the gate passes']].forEach(function (p) { U.el('line', { x1: mx(p[0]), y1: y - 16, x2: mx(p[0]), y2: y + 16, 'class': 'rule' }, c.tl); U.text(c.tl, mx(p[0]) + 12, y + 50, p[2], 'lab'); });
      U.el('circle', { cx: mx(22), cy: y, r: 12, fill: '#6FD8BE' }, c.tl); U.text(c.tl, mx(22), y - 30, 'month-22 gate', 'lab lab--hi', { 'text-anchor': 'middle' });
      U.text(c.tl, x0, y + 100, 'illustrative $15 to $25 million · three or four performers · independent evaluation', 'lab lab--t2');
      U.op(c.tl, 0);
      return c;
    },
    draw: function (c, t, U) {
      c.ct.forEach(function (g, i) { U.fade(g, t, U.cue(0, 1 + i * 0.6), 0.6); });
      var tc = U.say(1, 'Success would require halving');
      c.cols.forEach(function (g, i) { U.fade(g, t, tc + i * 0.7, 0.6); });
      U.fade(c.m36, t, tc, 0.6);
      U.fade(c.tl, t, U.cue(2), 0.8);
    } });
})();
