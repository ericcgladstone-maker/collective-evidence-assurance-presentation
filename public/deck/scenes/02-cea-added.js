/* Collective evidence assurance: scenes added in the November 6 revision
   (why-system, apparatus, what-not-established, early-prediction, closing).
   Same contract and glyph grammar as 01-cea.js. */
(function () {
  'use strict';
  var NCMA = window.NCMA;
  function edge(a, b, ra, rb) { var dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1; return [[a[0] + dx / d * ra, a[1] + dy / d * ra], [b[0] - dx / d * rb, b[1] - dy / d * rb]]; }
  function hidden(U, el) { U.op(el, 0); return el; }
  function cycle(U, tok, pts, t, start, period, travel, offset) {
    if (t < start) { U.op(tok, 0); return; }
    var local = ((t - start + (offset || 0)) % period + period) % period;
    if (local > travel) { U.op(tok, 0); return; }
    var xy = U.along(pts, U.ease(local / travel)); U.place(tok, xy[0], xy[1]);
    U.op(tok, Math.min(1, local / 0.15, (travel - local) / 0.2));
  }
  function box(U, p, x, y, w, h, cls) { return U.el('rect', { x: x, y: y, width: w, height: h, rx: 6, 'class': cls || 'box' }, p); }

  // ---- 2. The unit of analysis ---------------------------------------------------------
  NCMA.scene({ id: 'why-system', note: 'Schematic · candidate failure sites, not measured effects', source: '',
    desc: 'A single model evaluated alone becomes one member of a small network feeding a decision. Four candidate failure sites are marked: a misread signal, a message that loses its qualification, a recipient that misweights, and two reports with a shared origin, which is marked untested.',
    build: function (svg, U) {
      var c = {};
      c.solo = U.g(svg);
      box(U, c.solo, 40, 250, 380, 300);
      U.agent(c.solo, { x: 230, y: 360, r: 46 });
      U.text(c.solo, 230, 470, 'one model, one test', 'lab', { 'text-anchor': 'middle' });
      U.text(c.solo, 230, 510, 'correct on the benchmark', 'lab lab--hi', { 'text-anchor': 'middle' });
      var A = [640, 160], B = [640, 400], Cc = [640, 640], S = [520, 280], R = [1120, 400];
      c.net = U.g(svg); var lk = U.g(c.net); c.tkg = U.g(c.net); var nd = U.g(c.net);
      c.pA = edge(A, R, 40, 60); c.pB = edge(B, R, 40, 60); c.pC = edge(Cc, R, 40, 60);
      [A, B, Cc].forEach(function (p) { U.link(lk, { x: p[0], y: p[1], r: 34 }, { x: R[0], y: R[1], r: 50 }, { arrow: true }); });
      c.ag = [A, B, Cc].map(function (p) { return U.agent(nd, { x: p[0], y: p[1], r: 34 }); });
      c.R = U.agent(nd, { x: R[0], y: R[1], r: 50, role: 'hub' });
      U.text(c.net, R[0] + 40, R[1] + 120, 'group decision', 'lab');
      c.tA = U.token(c.tkg, 'evidence', { r: 13 }); c.tB = U.token(c.tkg, 'altered', { r: 14 }); c.tC = U.token(c.tkg, 'conclusion', { r: 13 });
      U.op(c.net, 0);
      // failure sites
      var site = function (x, y, lines, cls, lx, ly) { var g = U.g(svg); U.el('circle', { cx: x, cy: y, r: 62, 'class': 'zone' }, g); U.lines(g, x + (lx == null ? 80 : lx), y + (ly == null ? -10 : ly), lines, cls || 'lab', 30); U.op(g, 0); return g; };
      c.s1 = site(640, 160, ['misreads its', 'own signal']);
      c.s2 = site(880, 400, ['message loses', 'its qualification'], 'lab', -90, 110);
      c.s3 = site(1120, 400, ['recipient', 'misweights'], 'lab');
      c.shared = U.g(svg);
      U.el('path', { d: 'M' + S[0] + ',' + S[1] + ' Q560,220 610,180 M' + S[0] + ',' + S[1] + ' Q560,340 610,380', 'class': 'ln ln--dash is-live', fill: 'none' }, c.shared);
      U.agent(c.shared, { x: S[0], y: S[1], r: 18, role: 'doc' });
      U.lines(c.shared, 470, 470, ['shared origin', 'untested here'], 'lab lab--warm', 30, { 'text-anchor': 'end' });
      U.op(c.shared, 0);
      c.retro = hidden(U, U.text(svg, 1350, 160, 'explain after the fact', 'lab lab--t2'));
      c.pred = hidden(U, U.text(svg, 1350, 210, 'or predict before', 'word word--lg'));
      return c;
    },
    draw: function (c, t, U) {
      var t1 = U.cue(0, 3);
      U.op(c.solo, 1 - U.ramp(t, t1, 1));
      U.fade(c.net, t, t1, 1);
      cycle(U, c.tA, c.pA, t, t1 + 1, 3.4, 1.4, 0); cycle(U, c.tB, c.pB, t, t1 + 1, 3.4, 1.4, 0.5); cycle(U, c.tC, c.pC, t, t1 + 1, 3.4, 1.4, 1.0);
      var a = U.say(1, 'An agent could misunderstand'), b = U.say(1, 'A sender could strip'), d = U.say(1, 'A recipient could give'), e = U.say(1, 'Several apparently corroborating messages');
      U.fade(c.s1, t, a, 0.6); U.fade(c.s2, t, b, 0.6); U.fade(c.s3, t, d, 0.6); U.fade(c.shared, t, e, 0.6);
      U.fade(c.retro, t, U.say(3, 'Explaining a failure'), 0.6); U.fade(c.pred, t, U.say(3, 'Predicting the failure'), 0.6);
    } });

  // ---- 3. The experimental system -------------------------------------------------------
  NCMA.scene({ id: 'apparatus', note: 'Schematic · the experimental system behind the measured results', source: 'Gladstone (2026a), PNAS Nexus, revise and resubmit',
    desc: 'Three regions: a controller that assigns private signals, the graph, message content and rounds; a five-agent network receiving its signals; and a readout that logs every message and stated probability and compares the pooled belief with the known answer. A final beat dims what deployed systems lack.',
    build: function (svg, U) {
      var c = {};
      c.ctl = U.g(svg); box(U, c.ctl, 0, 120, 400, 560, 'box box--hi');
      U.text(c.ctl, 30, 175, 'controller', 'word word--lg');
      U.lines(c.ctl, 30, 250, ['assigns each private signal', 'and its strength', '', 'fixes the graph', '', 'sets what a message', 'may contain', '', 'runs fixed rounds'], 'cap', 38);
      var P = [], cx = 860, cy = 400, R = 190;
      for (var i = 0; i < 5; i++) { var th = -Math.PI / 2 + i * 2 * Math.PI / 5; P.push([cx + R * Math.cos(th), cy + R * Math.sin(th)]); }
      c.net = U.g(svg); var lk = U.g(c.net); c.tkg = U.g(svg); var nd = U.g(c.net);
      for (var a = 0; a < 5; a++) for (var b = a + 1; b < 5; b++) U.link(lk, { x: P[a][0], y: P[a][1], r: 30 }, { x: P[b][0], y: P[b][1], r: 30 });
      P.forEach(function (p) { U.agent(nd, { x: p[0], y: p[1], r: 30 }); });
      U.text(c.net, cx, 690, 'network', 'word word--lg', { 'text-anchor': 'middle' });
      c.sig = P.map(function (p, i) { var strong = i >= 3; return { tk: U.token(c.tkg, 'evidence', { r: strong ? 22 : 12, cls: strong ? 'clue-A' : 'clue-B' }), path: [[400, 300 + i * 40], [p[0] + 52, p[1] - 30]] }; });
      c.out = U.g(svg); box(U, c.out, 1290, 120, 470, 560);
      U.text(c.out, 1320, 175, 'readout', 'word word--lg');
      U.lines(c.out, 1320, 250, ['every message logged', 'stated probability', 'after each round', 'pooled group belief', 'compared with the', 'known answer'], 'cap', 38);
      c.log = [0, 1, 2, 3, 4, 5].map(function (k) { var l = U.el('line', { x1: 1320, y1: 500 + k * 26, x2: 1320 + 200 + (k % 3) * 60, y2: 500 + k * 26, 'class': 'rule' }, c.out); U.op(l, 0); return l; });
      U.op(c.out, 0);
      c.dep = U.g(svg);
      U.text(c.dep, 0, 780, 'in deployment · answer often unknown · origins unrecorded · evidence not assigned', 'lab lab--alert');
      U.op(c.dep, 0);
      return c;
    },
    draw: function (c, t, U) {
      var t0 = U.say(0, 'A controller assigns');
      c.sig.forEach(function (s, i) { U.fly(s.tk, s.path, t, t0 + i * 0.35, 1.2, true); });
      var t1 = U.say(0, 'After each round');
      U.fade(c.out, t, t1, 0.8);
      c.log.forEach(function (l, k) { U.fade(l, t, U.say(2, 'Complete logs', k * 0.4), 0.3); });
      var t2 = U.cue(3);
      U.fade(c.dep, t, t2 + 1, 0.7);
      U.op(c.ctl, 1 - 0.6 * U.ramp(t, t2 + 1, 1)); U.op(c.out, t >= t2 + 1 ? 1 - 0.6 * U.ramp(t, t2 + 1, 1) : U.ramp(t, t1, 0.8));
    } });

  // ---- 10. What the data do not show --------------------------------------------------------
  NCMA.scene({ id: 'what-not-established', note: 'Summary of the evidence · three levels', source: 'Gladstone (2026a), PNAS Nexus, revise and resubmit',
    desc: 'A three-row ledger. Causal: message content changed accuracy in two families, and reversing a planted verdict moved final belief. Behavioral: correct agents crossed to incorrect decisions far more often than a benchmark predicted. Untested: duplicated sources, a continuous distortion measure, and prediction in held-out configurations.',
    build: function (svg, U) {
      var c = {}, rows = [
        ['causal', 'box box--hi', 'lab lab--hi', ['conclusions in place of evidence lowered accuracy in two families', 'reversing one planted verdict moved final belief']],
        ['behavioral', 'box', 'lab lab--t2', ['correct agents crossed to incorrect decisions far more often than', 'a confidence-weighted benchmark predicted, more so at higher fan-in']],
        ['untested', 'zone', 'lab', ['one observation relayed by several routes', 'a continuous measure of distortion', 'prediction in held-out graphs, models and tasks']]];
      c.r = rows.map(function (r, i) {
        var g = U.g(svg), y = 20 + i * 260;
        box(U, g, 0, y, 1760, 230, r[1]);
        U.text(g, 40, y + 70, r[0], r[2]);
        U.lines(g, 360, y + 74, r[3], 'cap', 46);
        U.op(g, 0); return g;
      });
      return c;
    },
    draw: function (c, t, U) {
      U.fade(c.r[0], t, U.say(0, 'Changing permitted message content'), 0.7);
      U.fade(c.r[1], t, U.say(0, 'A separate recipient-level analysis'), 0.7);
      U.fade(c.r[2], t, U.cue(1), 0.7);
    } });

  // ---- 13. Measurement versus prediction ------------------------------------------------------
  NCMA.scene({ id: 'early-prediction', note: 'Proposed design · references are labels, never predictor inputs', source: '',
    desc: 'Four rounds on a timeline. The predictor reads only rounds 0 and 1; rounds 2 and the final round are masked. Below, the experimenter-only references feed a scorer as labels, separated from the predictor. A list of baselines appears last.',
    build: function (svg, U) {
      var c = {}, names = ['round 0', 'round 1', 'round 2', 'final'], X = [40, 300, 560, 820];
      X.forEach(function (x, i) { box(U, svg, x, 40, 220, 80, i < 2 ? 'box box--hi' : 'box'); U.text(svg, x + 110, 90, names[i], i < 2 ? 'lab lab--hi' : 'lab', { 'text-anchor': 'middle' }); });
      c.mask = U.g(svg);
      U.el('rect', { x: 548, y: 28, width: 506, height: 104, rx: 6, 'class': 'zone', style: 'fill:#071A2B' }, c.mask);
      U.text(c.mask, 800, 90, 'not yet observed', 'lab lab--alert', { 'text-anchor': 'middle' });
      U.op(c.mask, 0);
      c.pr = U.g(svg);
      box(U, c.pr, 40, 240, 480, 120, 'box box--hi');
      U.text(c.pr, 280, 295, 'predictor', 'word word--lg', { 'text-anchor': 'middle' });
      U.text(c.pr, 280, 335, 'messages · traces · confidence', 'lab', { 'text-anchor': 'middle' });
      U.el('line', { x1: 150, y1: 124, x2: 180, y2: 234, 'class': 'ln is-live', 'marker-end': 'url(#arrow)' }, c.pr);
      U.el('line', { x1: 410, y1: 124, x2: 380, y2: 234, 'class': 'ln is-live', 'marker-end': 'url(#arrow)' }, c.pr);
      U.op(c.pr, 0);
      c.ex = U.g(svg);
      box(U, c.ex, 40, 470, 1000, 240, 'zone');
      U.text(c.ex, 70, 530, 'experimenter only', 'lab lab--warm');
      U.lines(c.ex, 70, 590, ['original observations and the true answer', 'oracle and message-conditioned references', 'later rounds and terminal beliefs'], 'cap', 42);
      box(U, c.ex, 1180, 470, 560, 240);
      U.text(c.ex, 1460, 560, 'scorer', 'word word--lg', { 'text-anchor': 'middle' });
      U.text(c.ex, 1460, 610, 'labels for training and scoring', 'lab', { 'text-anchor': 'middle' });
      U.el('line', { x1: 1044, y1: 590, x2: 1174, y2: 590, 'class': 'ln', 'marker-end': 'url(#arrow)' }, c.ex);
      U.el('line', { x1: 524, y1: 300, x2: 1240, y2: 464, 'class': 'ln', 'marker-end': 'url(#arrow)' }, c.ex);
      U.op(c.ex, 0);
      c.wall = U.g(svg);
      U.el('line', { x1: 20, y1: 425, x2: 900, y2: 425, stroke: '#E58C7E', 'stroke-width': 4, 'stroke-dasharray': '14 10' }, c.wall);
      U.text(c.wall, 460, 455, 'no input path to the predictor', 'lab lab--alert', { 'text-anchor': 'middle' });
      U.op(c.wall, 0);
      c.bl = U.g(svg);
      U.text(c.bl, 1180, 90, 'must beat', 'lab lab--t2');
      U.lines(c.bl, 1180, 150, ['connectivity', 'message type', 'current group belief', 'same traces, no distortion features'], 'cap', 42);
      U.op(c.bl, 0);
      return c;
    },
    draw: function (c, t, U) {
      U.fade(c.ex, t, U.say(0, 'The experimenter knows'), 0.8); U.fade(c.wall, t, U.say(1, 'but it could not receive'), 0.6);
      U.fade(c.pr, t, U.cue(1), 0.7); U.fade(c.mask, t, U.say(1, 'at least two rounds'), 0.6);
      U.fade(c.bl, t, U.cue(2), 0.7);
    } });

  // ---- 17. The question ---------------------------------------------------------------------
  NCMA.scene({ id: 'closing', note: 'The claim the program would test · nothing on this page has been observed', source: '',
    desc: 'The opening network returns. Early messages reach a hub, a warning is raised before the decision, and the outcome is shown as unknown. Three outcomes are listed: supported, narrowed, rejected.',
    build: function (svg, U) {
      var c = {}, P = [[220, 170], [470, 110], [690, 250], [180, 430], [450, 420], [270, 650], [610, 600]], hub = [1000, 400];
      var E = [[0, 1], [1, 2], [0, 3], [3, 4], [1, 4], [4, 2], [3, 5], [5, 6], [4, 6]], H = [2, 4, 6];
      var lk = U.g(svg); c.tkg = U.g(svg); var nd = U.g(svg);
      c.paths = [];
      E.forEach(function (e) { U.link(lk, { x: P[e[0]][0], y: P[e[0]][1], r: 32 }, { x: P[e[1]][0], y: P[e[1]][1], r: 32 }); c.paths.push(edge(P[e[0]], P[e[1]], 42, 42)); });
      c.hp = H.map(function (i) { U.link(lk, { x: P[i][0], y: P[i][1], r: 32 }, { x: hub[0], y: hub[1], r: 54 }, { arrow: true }); return edge(P[i], hub, 42, 64); });
      P.forEach(function (p) { U.agent(nd, { x: p[0], y: p[1], r: 32 }); });
      c.H = U.agent(nd, { x: hub[0], y: hub[1], r: 54, role: 'hub' });
      c.tks = c.paths.map(function (p, i) { return U.token(c.tkg, i % 2 ? 'evidence' : 'conclusion', { r: 12 }); });
      c.htks = c.hp.map(function () { return U.token(c.tkg, 'conclusion', { r: 14 }); });
      c.warn = hidden(U, U.text(svg, hub[0], hub[1] - 100, 'early warning', 'lab lab--warm', { 'text-anchor': 'middle' }));
      c.unk = hidden(U, U.text(svg, hub[0], hub[1] + 110, 'outcome unknown', 'lab', { 'text-anchor': 'middle' }));
      c.o = [['supported', 'prediction holds in new graphs, models and a new task family', 'lab lab--hi'], ['narrowed', 'prediction holds only within familiar tasks', 'lab lab--warm'], ['rejected', 'the signatures add nothing to simpler features', 'lab lab--alert']].map(function (o, i) {
        var g = U.g(svg), y = 230 + i * 170;
        U.text(g, 1240, y, o[0], o[2]); U.lines(g, 1240, y + 44, o[1].length > 34 ? [o[1].slice(0, o[1].lastIndexOf(' ', 34)), o[1].slice(o[1].lastIndexOf(' ', 34) + 1)] : [o[1]], 'cap', 36);
        U.op(g, 0); return g;
      });
      return c;
    },
    draw: function (c, t, U) {
      c.paths.forEach(function (p, i) { cycle(U, c.tks[i], p, t, 0.4, 4.0, 1.4, i * 0.41); });
      c.hp.forEach(function (p, i) { cycle(U, c.htks[i], p, t, 1.2, 3.6, 1.5, i * 0.6); });
      var tw = U.cue(0, 4); U.fade(c.warn, t, tw, 0.6); U.fade(c.unk, t, tw + 1, 0.6);
      U.setText(c.H.mark, t >= tw + 1 ? '?' : '');
      U.fade(c.o[0], t, U.say(1, 'Features derived from early messages'), 0.6); U.fade(c.o[1], t, U.say(1, 'only works on familiar tasks'), 0.6); U.fade(c.o[2], t, U.say(1, 'adds nothing beyond simpler traces'), 0.6);
    } });
})();
