/* org-live.js - the role-redesign bench for learn-leadership-ai-with-phoebe
 *
 * REAL ROWS: org-sample.js carries 34 occupations relevant to a professional-services firm, with
 * every task statement, importance (IM) and mean frequency (FT) rating from the O*NET 31.0
 * Database (USDOL/ETA, CC BY 4.0), joined on task ID to the task-level exposure labels released
 * with Eloundou, Manning, Mishkin and Rock (2023), "GPTs are GPTs" (data under MIT licence).
 *   E0 = no exposure, E1 = an LLM alone could cut the task's time by at least half,
 *   E2 = it would take LLM-powered software built on top to get there.
 * Human annotators' labels are the default; the GPT-4 labels ship too, so the bench can show
 * where the two disagree.
 *
 * CONSTRUCTED: Marlowe Group, a fictional 4,000-person professional-services firm. Its headcount
 * per role and junior share per role are invented for teaching.
 *
 * ASSUMPTIONS (the leader sets them; defaults recorded in materials/official-course-map.md):
 *   s1  share of an E1 task's time saved                 default 0.25
 *   s2  share of an E2 task's time saved = E2W * s1      E2W = 0.5, the weight Eloundou et al.
 *                                                         give E2 in their beta measure
 *   v   review and verification time added back, as a
 *       share of each exposed task's original time       default 0.10
 *   a   share of the freed capacity absorbed by new or
 *       rebounding demand                                default 0.25
 *   time shares: default = importance x mean frequency, normalised. A PROXY: O*NET rates how
 *       important and how frequent a task is, not how many hours it takes.
 *   reskill cost band per person in the role, in FTE-years (a modelled cost band, no salaries)
 *
 * LADDER (rung 1 to 5):
 *   1 naive      share of tasks labelled exposed (E1 or E2), counted as freed time
 *   2 timed      sum over tasks of time share x time saved
 *   3 reviewed   rung 2 minus review time on every exposed task (can go below zero)
 *   4 rebound    rung 3 minus the absorbed share of any positive freed capacity
 *   5 range      rung 4 at the low and high ends of the assumption bands, plus payback range
 * ANTI-LEVER  "count hours saved as headcount cut": cut = floor(rung 2 x headcount), taken from
 *   the junior grade first (a stated model). Prints the staff shortfall the cut leaves (review
 *   time nobody is staffed for, plus absorbed demand) and the junior rung that is left.
 * BREAK BUTTON  "drop the review time": v = 0. The business case goes up and the widget says why.
 *
 * The Python reference (materials/org_reference.py) runs the same steps in the same order; node
 * runs THIS file (materials/org-node.js) and materials/compare-ladder.py compares them by value.
 */
(function (root) {
  "use strict";

  var DEF = { s1: 0.25, v: 0.10, a: 0.25 };
  var E2W = 0.5;
  var LOW = { s1: 0.14, v: 0.15, a: 0.50 };   // slow case: Brynjolfsson et al. average gain, heavier review, half absorbed
  var HIGH = { s1: 0.50, v: 0.05, a: 0.00 };  // fast case: Eloundou's E1 threshold, light review, nothing absorbed
  var COST = { lo: 0.03, hi: 0.08 };          // reskill cost per person in the role, FTE-years (modelled band)
  var LABEL = ["E0", "E1", "E2"];

  /* ---------- engine (mirrors materials/org_reference.py step for step) ---------- */
  function lab(t, set) { return set === "g" ? t.g : t.h; }

  function defaultShares(role) {
    var w = role.tasks.map(function (t) { return t.im * t.ft; });
    var s = 0;
    for (var i = 0; i < w.length; i++) s += w[i];
    return w.map(function (x) { return x / s; });
  }

  function normalise(w) {
    var s = 0;
    for (var i = 0; i < w.length; i++) s += w[i];
    if (!(s > 0)) return w.map(function () { return 1 / w.length; });
    return w.map(function (x) { return x / s; });
  }

  function saved(l, p) { return l === 1 ? p.s1 : (l === 2 ? E2W * p.s1 : 0); }

  // p = {s1, v, a, set, shares (optional array), fault (optional, for selfTest only)}
  function evaluate(role, p) {
    var set = p.set || "h";
    var w = p.shares ? normalise(p.shares) : defaultShares(role);
    var n = role.tasks.length, nExp = 0, timed = 0, review = 0, expShare = 0;
    var rows = [];
    for (var i = 0; i < n; i++) {
      var t = role.tasks[i], l = lab(t, set);
      var sv = w[i] * saved(l, p);
      var rv = l > 0 ? w[i] * p.v : 0;
      if (p.fault === "review-sign") rv = -rv;
      if (l > 0) { nExp += 1; expShare += w[i]; }
      timed += sv;
      review += rv;
      rows.push({ id: t.id, share: w[i], label: l, other: set === "g" ? t.h : t.g, saved: sv, review: rv, net: sv - rv });
    }
    var naive = nExp / n;
    var reviewed = timed - review;
    var absorbed = reviewed > 0 ? p.a * reviewed : 0;
    var net = reviewed - absorbed;
    var head = role.head;
    var juniors = Math.round(head * role.jr);
    var cut = Math.floor(timed * head);
    return {
      n: n, nExp: nExp, expShare: expShare, naive: naive, timed: timed, review: review,
      reviewed: reviewed, absorbed: absorbed, net: net, rows: rows,
      head: head, juniors: juniors,
      fte: { naive: naive * head, timed: timed * head, reviewed: reviewed * head, net: net * head },
      anti: {
        cut: cut,
        shortfall: cut - net * head,
        reviewFte: review * head,
        absorbedFte: absorbed * head,
        juniorsLeft: Math.max(0, juniors - cut)
      }
    };
  }

  function withP(base, over) {
    var o = {};
    Object.keys(base).forEach(function (k) { o[k] = base[k]; });
    Object.keys(over).forEach(function (k) { o[k] = over[k]; });
    return o;
  }

  function range(role, p) {
    var lo = evaluate(role, withP(p, LOW)), hi = evaluate(role, withP(p, HIGH));
    var costLo = role.head * COST.lo, costHi = role.head * COST.hi;
    return {
      lowNet: lo.net, highNet: hi.net, lowFte: lo.fte.net, highFte: hi.fte.net,
      costLo: costLo, costHi: costHi,
      paybackFast: hi.fte.net > 0 ? costLo / hi.fte.net * 12 : null,
      paybackSlow: lo.fte.net > 0 ? costHi / lo.fte.net * 12 : null
    };
  }

  function firm(roles, p) {
    var out = { head: 0, naive: 0, timed: 0, reviewed: 0, net: 0, cut: 0, shortfall: 0, lowFte: 0, highFte: 0, brkNet: 0 };
    roles.forEach(function (r) {
      var e = evaluate(r, p), g = range(r, p), b = evaluate(r, withP(p, { v: 0 }));
      out.head += r.head;
      out.naive += e.fte.naive; out.timed += e.fte.timed; out.reviewed += e.fte.reviewed; out.net += e.fte.net;
      out.cut += e.anti.cut; out.shortfall += e.anti.shortfall;
      out.lowFte += g.lowFte; out.highFte += g.highFte; out.brkNet += b.fte.net;
    });
    return out;
  }

  // Properties that must hold for every role and every assumption setting. A planted fault
  // (opts.fault = "review-sign") must make this return false; materials/org-node.js checks both.
  function selfTest(sample, opts) {
    opts = opts || {};
    var grid = [DEF, LOW, HIGH, { s1: 0.40, v: 0.30, a: 0.10 }, { s1: 0.05, v: 0.15, a: 0.80 }];
    var ok = true;
    sample.roles.forEach(function (r) {
      ["h", "g"].forEach(function (set) {
        grid.forEach(function (g) {
          var p = withP(g, { set: set, fault: opts.fault });
          var e = evaluate(r, p);
          var s = 0; e.rows.forEach(function (x) { s += x.share; });
          if (Math.abs(s - 1) > 1e-9) ok = false;                       // shares sum to one
          if (e.reviewed > e.timed + 1e-12) ok = false;                  // review never frees time
          if (e.net > e.reviewed + 1e-12) ok = false;                    // demand rebound never frees time
          var b = evaluate(r, withP(p, { v: 0 }));
          if (b.net + 1e-12 < e.net) ok = false;                         // dropping review can only look rosier
          if (e.anti.reviewFte + e.anti.absorbedFte < -1e-12) ok = false; // the anti-lever's hidden work is never negative
        });
      });
      var gr = range(r, withP(DEF, { set: "h", fault: opts.fault }));
      var c = evaluate(r, withP(DEF, { set: "h", fault: opts.fault }));
      if (gr.lowNet > c.net + 1e-12 || gr.highNet + 1e-12 < c.net) ok = false; // the range brackets the central case
    });
    return ok;
  }

  function r6(x) { return x === null ? null : Math.round(x * 1e6) / 1e6; }

  // Canon: every rung for every role, the anti-lever, the break button and the firm totals.
  function canon(sample) {
    var p = withP(DEF, { set: "h" });
    var out = { roles: [], firm: null, firmG: null, selfTest: selfTest(sample), selfTestFault: selfTest(sample, { fault: "review-sign" }) };
    sample.roles.forEach(function (r) {
      var e = evaluate(r, p), g = range(r, p), b = evaluate(r, withP(p, { v: 0 })), eg = evaluate(r, withP(p, { set: "g" }));
      var disagree = 0; r.tasks.forEach(function (t) { if ((t.h > 0) !== (t.g > 0)) disagree += 1; });
      out.roles.push({
        soc: r.soc, n: e.n, nExp: e.nExp, head: r.head, juniors: e.juniors,
        naive: r6(e.naive), timed: r6(e.timed), reviewed: r6(e.reviewed), net: r6(e.net),
        fteNaive: r6(e.fte.naive), fteTimed: r6(e.fte.timed), fteReviewed: r6(e.fte.reviewed), fteNet: r6(e.fte.net),
        lowNet: r6(g.lowNet), highNet: r6(g.highNet), lowFte: r6(g.lowFte), highFte: r6(g.highFte),
        paybackFast: r6(g.paybackFast), paybackSlow: r6(g.paybackSlow),
        cut: e.anti.cut, shortfall: r6(e.anti.shortfall), reviewFte: r6(e.anti.reviewFte), absorbedFte: r6(e.anti.absorbedFte),
        juniorsLeft: e.anti.juniorsLeft, brkNet: r6(b.net), brkFte: r6(b.fte.net),
        gNaive: r6(eg.naive), gNet: r6(eg.net), disagree: disagree
      });
    });
    var f = firm(sample.roles, p), fg = firm(sample.roles, withP(p, { set: "g" }));
    Object.keys(f).forEach(function (k) { f[k] = r6(f[k]); });
    Object.keys(fg).forEach(function (k) { fg[k] = r6(fg[k]); });
    out.firm = f; out.firmG = fg;
    return out;
  }

  /* ---------- widget ---------- */
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function pct1(x) { return (x * 100).toFixed(1) + "%"; }
  function f1(x) { return x.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
  function mo(x) { return x === null ? "never" : Math.round(x) + " months"; }

  var RUNGS = [
    { id: 1, label: "1 · Naive: exposed share = freed share", note: "Counts the tasks labelled E1 or E2 and calls that share of the job freed.", tag: "real labels, naive reading" },
    { id: 2, label: "2 · + time shares and speed-up", note: "Weights each task by its share of the week and saves only the assumed speed-up on exposed tasks.", tag: "modelled on real tasks" },
    { id: 3, label: "3 · + review load", note: "Adds back the time someone spends checking AI output on every exposed task.", tag: "modelled on real tasks" },
    { id: 4, label: "4 · + demand rebound", note: "Some freed capacity is absorbed by new or rebounding work. Set the share below.", tag: "modelled on real tasks" },
    { id: 5, label: "5 · Range for the board", note: "Rung 4 at the slow and fast ends of every assumption, with the payback range.", tag: "modelled range" },
    { id: "anti", label: "Count hours saved as headcount cut", note: "Takes rung 2 straight to a cut, from the junior grade first.", tag: "modelled", anti: true },
    { id: "brk", label: "Break it: drop the review time", note: "Sets review to zero. Watch the case improve for no real reason.", tag: "broken on purpose", brk: true }
  ];

  var sample, rootEl, els = {}, state = { idx: 0, rung: 1, set: "h", s1: DEF.s1, v: DEF.v, a: DEF.a, shares: {} };

  function params(over) {
    var r = sample.roles[state.idx];
    var p = { s1: state.s1, v: state.v, a: state.a, set: state.set };
    var sh = state.shares[r.soc];
    if (sh) p.shares = sh;
    return over ? withP(p, over) : p;
  }

  function ladderSvg(vals, active) {
    var W = 640, rowH = 34, x0 = 210, bw = 380, y0 = 30;
    var H = y0 + vals.length * rowH + 30;
    var max = 0.6;
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Freed capacity for this role at each rung of the ladder">';
    svg += '<text class="rrb-cap" x="' + x0 + '" y="16">freed capacity, share of the role\'s time</text>';
    vals.forEach(function (v, i) {
      var y = y0 + i * rowH, w = Math.max(0, Math.min(v.val, max)) / max * bw;
      svg += '<text class="rrb-lab" x="' + (x0 - 10) + '" y="' + (y + 18) + '" text-anchor="end">' + esc(v.name) + '</text>';
      svg += '<rect class="rrb-bar' + (v.key === active ? ' is-on' : '') + (v.bad ? ' is-bad' : '') + '" x="' + x0 + '" y="' + (y + 5) + '" width="' + w.toFixed(1) + '" height="18" rx="3"/>';
      svg += '<text class="rrb-val" x="' + (x0 + w + 8).toFixed(1) + '" y="' + (y + 19) + '">' + pct1(v.val) + '</text>';
    });
    svg += '<line class="rrb-axis" x1="' + x0 + '" y1="' + (y0 - 4) + '" x2="' + x0 + '" y2="' + (y0 + vals.length * rowH) + '"/>';
    svg += '<text class="rrb-cap" x="' + x0 + '" y="' + (H - 8) + '">bars clip at 60%; the value is printed beside each bar</text>';
    return svg + '</svg>';
  }

  function render() {
    var r = sample.roles[state.idx];
    var p = params();
    var e = evaluate(r, p), g = range(r, p), b = evaluate(r, params({ v: 0 }));
    var all = sample.roles;
    var fm = firm(all, { s1: state.s1, v: state.v, a: state.a, set: state.set });
    var rung = state.rung;

    Object.keys(els.btns).forEach(function (k) {
      els.btns[k].classList.toggle("is-on", String(rung) === k);
      els.btns[k].querySelector("input").checked = String(rung) === k;
    });

    var verdict, vcls;
    if (rung === 1) { verdict = "Naive. " + e.nExp + " of " + e.n + " tasks are labelled exposed, so the naive case says " + pct1(e.naive) + " of the role is freed: " + f1(e.fte.naive) + " FTE of Marlowe's " + r.head + "."; vcls = "is-bad"; }
    else if (rung === 2) { verdict = "Modelled. Weighting tasks by time and saving only the assumed speed-up: " + pct1(e.timed) + " freed, " + f1(e.fte.timed) + " FTE. Still no one checks the output."; vcls = "is-ok"; }
    else if (rung === 3) { verdict = "Modelled. Review time added back: " + pct1(e.reviewed) + " freed, " + f1(e.fte.reviewed) + " FTE (rung 2 was " + pct1(e.timed) + ")."; vcls = e.reviewed > 0 ? "is-ok" : "is-bad"; }
    else if (rung === 4) { verdict = "Modelled. With " + Math.round(state.a * 100) + "% of freed capacity absorbed by demand: " + pct1(e.net) + " freed, " + f1(e.fte.net) + " FTE of " + r.head + "."; vcls = "is-good"; }
    else if (rung === 5) { verdict = "Modelled range. Between " + f1(g.lowFte) + " and " + f1(g.highFte) + " FTE freed (" + pct1(g.lowNet) + " to " + pct1(g.highNet) + "); reskilling pays back in " + mo(g.paybackFast) + " to " + mo(g.paybackSlow) + "."; vcls = "is-good"; }
    else if (rung === "anti") { verdict = "Anti-lever. Cutting " + e.anti.cut + " people on rung 2's hours leaves " + f1(e.anti.shortfall) + " FTE of work with nobody to do it, and the junior rung falls from " + e.juniors + " to " + e.anti.juniorsLeft + "."; vcls = "is-bad"; }
    else { verdict = "Broken on purpose. With review time set to zero the case shows " + f1(b.fte.net) + " FTE freed instead of " + f1(e.fte.net) + ": checking AI output is work, and this button pretends it is free."; vcls = "is-bad"; }
    els.verdict.className = "mb-verdict " + vcls;
    els.verdict.textContent = verdict;

    function metric(label, val, unit, kind) {
      return '<div class="mb-metric"><span class="mb-mkind ' + (kind === "real" ? "is-measured" : "is-heuristic") + '">' + esc(kind) + '</span>' +
        '<span class="mb-mlabel">' + esc(label) + '</span><span class="mb-mvalue">' + esc(val) + '</span><span class="mb-munit">' + esc(unit) + '</span></div>';
    }
    var cur = rung === 1 ? e.naive : rung === 2 ? e.timed : rung === 3 ? e.reviewed : rung === "brk" ? b.net : e.net;
    var curF = cur * r.head;
    var h = metric("Tasks labelled exposed", e.nExp + " of " + e.n, (state.set === "g" ? "GPT-4 labels" : "human annotators") + "; " + pct1(e.expShare) + " of the time", "real") +
      metric("Freed capacity, this rung", pct1(cur), "share of the role's time", "modelled") +
      metric("FTE-equivalent at Marlowe", f1(curF), "of " + r.head + " people (constructed headcount)", "modelled");
    if (rung === 5) {
      h += metric("Board range, FTE", f1(g.lowFte) + " to " + f1(g.highFte), "slow case to fast case", "modelled range") +
        metric("Reskill cost band", f1(g.costLo) + " to " + f1(g.costHi), "FTE-years, modelled band", "modelled range") +
        metric("Payback", mo(g.paybackFast) + " to " + mo(g.paybackSlow), "fast case to slow case", "modelled range");
    } else if (rung === "anti") {
      h += metric("Headcount cut", String(e.anti.cut), "rung 2 hours counted as people", "modelled") +
        metric("Review nobody is staffed for", f1(e.anti.reviewFte), "FTE", "modelled") +
        metric("Absorbed demand left unstaffed", f1(e.anti.absorbedFte), "FTE", "modelled") +
        metric("Junior rung", e.juniors + " to " + e.anti.juniorsLeft, "constructed junior grade, cut first", "modelled");
    } else {
      h += metric("Firm-wide, all " + all.length + " roles", f1(rung === 1 ? fm.naive : rung === 2 ? fm.timed : rung === 3 ? fm.reviewed : rung === "brk" ? fm.brkNet : fm.net) + " FTE", "of " + fm.head.toLocaleString("en-US") + " people in the sample", "modelled") +
        metric("Review time on exposed tasks", pct1(rung === "brk" ? 0 : e.review), (rung === 1 || rung === 2) ? "not counted until rung 3" : "share of the role's time", "modelled") +
        metric("Absorbed by demand", pct1(rung === 4 ? e.absorbed : 0), rung === 4 ? "share of the role's time" : "switched on at rung 4", "modelled");
    }
    els.metrics.innerHTML = h;

    var lv = [
      { key: 1, name: "1 naive", val: e.naive },
      { key: 2, name: "2 + time shares", val: e.timed },
      { key: 3, name: "3 + review load", val: e.reviewed },
      { key: 4, name: "4 + demand rebound", val: e.net },
      { key: 5, name: "5 slow case", val: g.lowNet },
      { key: 5, name: "5 fast case", val: g.highNet },
      { key: "brk", name: "break: no review", val: b.net, bad: true }
    ];
    els.ladder.innerHTML = ladderSvg(lv, rung);

    var t = '<table class="dt-table rrb-tasks"><thead><tr><th>Task (O*NET 31.0)</th><th>Label</th><th>Time share</th><th>Saved</th><th>Review</th><th>Net</th></tr></thead><tbody>';
    e.rows.forEach(function (x, i) {
      var task = r.tasks[i];
      var dis = (x.label > 0) !== (x.other > 0);
      t += '<tr><td>' + esc(task.t) + (task.c ? "" : ' <em class="rrb-sup">supplemental</em>') + '</td>' +
        '<td><span class="rrb-tag rrb-e' + x.label + '">' + LABEL[x.label] + '</span>' + (dis ? '<span class="rrb-dis" title="the other label set disagrees">' + LABEL[x.other] + '?</span>' : "") + '</td>' +
        '<td><input class="rrb-share" type="number" min="0" max="100" step="0.5" data-i="' + i + '" value="' + (x.share * 100).toFixed(1) + '" aria-label="Time share for task ' + (i + 1) + ', percent"></td>' +
        '<td>' + pct1(x.saved) + '</td><td>' + (rung === "brk" ? "0.0%" : pct1(x.review)) + '</td><td>' + pct1(rung === "brk" ? x.saved : x.net) + '</td></tr>';
    });
    els.tasks.innerHTML = t + '</tbody></table>';
    Array.prototype.forEach.call(els.tasks.querySelectorAll(".rrb-share"), function (inp) {
      inp.addEventListener("change", function () {
        var cur = e.rows.map(function (x) { return x.share * 100; });
        var v = parseFloat(inp.value);
        cur[+inp.getAttribute("data-i")] = isNaN(v) || v < 0 ? 0 : v;
        state.shares[r.soc] = cur;
        render();
      });
    });
    els.reset.style.display = state.shares[r.soc] ? "" : "none";
    els.s1o.textContent = Math.round(state.s1 * 100) + "% (E2: " + (E2W * state.s1 * 100).toFixed(1) + "%)";
    els.vo.textContent = Math.round(state.v * 100) + "%";
    els.ao.textContent = Math.round(state.a * 100) + "%";
  }

  function slider(id, label, min, max, val, note) {
    var d = document.createElement("div"); d.className = "rrb-slider";
    d.innerHTML = '<label for="' + id + '"><span class="rrb-assume">assumption</span> ' + esc(label) + '</label>' +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="1" value="' + val + '"><output></output>' +
      '<span class="rrb-snote">' + esc(note) + '</span>';
    return d;
  }

  function buildUI() {
    rootEl.innerHTML = "";
    var top = document.createElement("div"); top.className = "rrb-top";
    var lab1 = document.createElement("label"); lab1.className = "rrb-pick"; lab1.innerHTML = "<span>Role</span>";
    var sel = document.createElement("select"); sel.id = "rrb-role";
    sample.roles.forEach(function (r, i) {
      var e = evaluate(r, { s1: DEF.s1, v: DEF.v, a: DEF.a, set: "h" });
      var o = document.createElement("option"); o.value = i;
      o.textContent = r.name + " · " + e.nExp + " of " + e.n + " tasks exposed · " + r.head + " at Marlowe";
      sel.appendChild(o);
    });
    sel.addEventListener("change", function () { state.idx = +sel.value; render(); });
    lab1.appendChild(sel); top.appendChild(lab1);
    var lab2 = document.createElement("label"); lab2.className = "rrb-pick"; lab2.innerHTML = "<span>Exposure labels</span>";
    var sel2 = document.createElement("select"); sel2.id = "rrb-set";
    [["h", "Human annotators (default)"], ["g", "GPT-4 classifier"]].forEach(function (x) {
      var o = document.createElement("option"); o.value = x[0]; o.textContent = x[1]; sel2.appendChild(o);
    });
    sel2.addEventListener("change", function () { state.set = sel2.value; render(); });
    lab2.appendChild(sel2); top.appendChild(lab2);
    rootEl.appendChild(top);

    var panel = document.createElement("div"); panel.className = "mb-presets";
    els.btns = {};
    RUNGS.forEach(function (q) {
      var l = document.createElement("label");
      l.className = "mb-preset" + (q.anti || q.brk ? " is-anti" : "");
      l.innerHTML = '<input type="radio" name="rrb-rung" value="' + q.id + '">' +
        '<span class="mb-pname">' + esc(q.label) + (q.anti ? ' <em class="mb-anti">anti-lever</em>' : "") + (q.brk ? ' <em class="mb-anti">break</em>' : "") + "</span>" +
        '<span class="mb-pnote">' + esc(q.note) + "</span>";
      l.querySelector("input").addEventListener("change", function () { state.rung = q.id; render(); });
      panel.appendChild(l); els.btns[String(q.id)] = l;
    });
    rootEl.appendChild(panel);

    var sl = document.createElement("div"); sl.className = "rrb-sliders";
    var s1 = slider("rrb-s1", "time saved on an E1 task", 5, 60, Math.round(DEF.s1 * 100), "default 25%; E2 tasks save half of it");
    var sv = slider("rrb-v", "review time per exposed task", 0, 30, Math.round(DEF.v * 100), "default 10% of the task's time");
    var sa = slider("rrb-a", "freed capacity absorbed by demand", 0, 80, Math.round(DEF.a * 100), "default 25%; used from rung 4");
    sl.appendChild(s1); sl.appendChild(sv); sl.appendChild(sa);
    rootEl.appendChild(sl);
    els.s1o = s1.querySelector("output"); els.vo = sv.querySelector("output"); els.ao = sa.querySelector("output"); els.aRow = sa;
    s1.querySelector("input").addEventListener("input", function (ev) { state.s1 = (+ev.target.value) / 100; render(); });
    sv.querySelector("input").addEventListener("input", function (ev) { state.v = (+ev.target.value) / 100; render(); });
    sa.querySelector("input").addEventListener("input", function (ev) { state.a = (+ev.target.value) / 100; render(); });

    els.verdict = document.createElement("p"); rootEl.appendChild(els.verdict);
    els.metrics = document.createElement("div"); els.metrics.className = "mb-metrics"; rootEl.appendChild(els.metrics);

    var c1 = document.createElement("div"); c1.className = "rrb-card";
    c1.innerHTML = "<h4>The ladder for this role</h4>";
    els.ladder = document.createElement("div"); els.ladder.className = "rrb-stage"; c1.appendChild(els.ladder);
    rootEl.appendChild(c1);

    var c2 = document.createElement("div"); c2.className = "rrb-card";
    c2.innerHTML = "<h4>Every task in the role <span class=\"rrb-h4note\">edit a time share to replace the proxy; shares are renormalised</span></h4>";
    els.reset = document.createElement("button"); els.reset.type = "button"; els.reset.className = "btn rrb-reset"; els.reset.textContent = "Reset time shares to the O*NET proxy";
    els.reset.addEventListener("click", function () { delete state.shares[sample.roles[state.idx].soc]; render(); });
    c2.appendChild(els.reset);
    els.tasks = document.createElement("div"); els.tasks.className = "dt-tablewrap"; c2.appendChild(els.tasks);
    rootEl.appendChild(c2);

    var hint = document.createElement("p"); hint.className = "mb-hint";
    var nt = sample.roles.reduce(function (s, r) { return s + r.tasks.length; }, 0);
    hint.textContent = "Real rows: " + sample.roles.length + " occupations, " + nt + " task statements with importance and frequency ratings from the O*NET 31.0 Database by USDOL/ETA, used under CC BY 4.0 (O*NET is a trademark of USDOL/ETA), " +
      "joined to the task-level exposure labels released with Eloundou, Manning, Mishkin and Rock (2023), MIT licence. Modified: joined and reduced; USDOL/ETA has not approved, endorsed, or tested these modifications. " +
      "Constructed: Marlowe Group, its headcount and its junior grade. Modelled: every speed-up, review, demand and cost number is an assumption you can move, and the tag on each number says which kind it is." +
      (selfTest(sample) ? " Self-test passed on load." : " SELF-TEST FAILED: do not quote these numbers.");
    rootEl.appendChild(hint);

    sel.value = String(state.idx);
    render();
  }

  function init() {
    rootEl = document.getElementById("rrb-bench");
    if (!rootEl || !root.ORG_SAMPLE) return;
    sample = root.ORG_SAMPLE;
    var def = rootEl.getAttribute("data-role");
    if (def !== null) sample.roles.forEach(function (r, i) { if (r.soc === def) state.idx = i; });
    buildUI();
    root.ORG_LIVE = {
      set: function (o) {
        Object.keys(o || {}).forEach(function (k) { state[k] = o[k]; });
        if (o && o.soc) sample.roles.forEach(function (r, i) { if (r.soc === o.soc) state.idx = i; });
        document.getElementById("rrb-role").value = String(state.idx);
        document.getElementById("rrb-set").value = state.set;
        render();
      },
      state: state,
      canon: function () { return canon(sample); }
    };
  }

  var api = { DEF: DEF, LOW: LOW, HIGH: HIGH, COST: COST, E2W: E2W, defaultShares: defaultShares, evaluate: evaluate,
              range: range, firm: firm, selfTest: selfTest, canon: canon };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  }
})(typeof window !== "undefined" ? window : this);
