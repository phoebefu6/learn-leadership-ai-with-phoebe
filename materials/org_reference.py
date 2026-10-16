#!/usr/bin/env python3
"""Independent Python reference for the role-redesign bench (assets/org-live.js).

Reads assets/org-sample.js (the JSON after "window.ORG_SAMPLE = "), runs the same ladder in the same
order, and prints the canon as JSON. Compare with node: python3 materials/compare-ladder.py
Every assumption below is a copy of the engine's defaults and is recorded in official-course-map.md.
"""
import json, math, os, sys

DEF = {"s1": 0.25, "v": 0.10, "a": 0.25}
E2W = 0.5
LOW = {"s1": 0.14, "v": 0.15, "a": 0.50}
HIGH = {"s1": 0.50, "v": 0.05, "a": 0.00}
COST = {"lo": 0.03, "hi": 0.08}


def load(repo):
    src = open(os.path.join(repo, "assets", "org-sample.js"), encoding="ascii").read()
    i = src.index("window.ORG_SAMPLE = ") + len("window.ORG_SAMPLE = ")
    return json.loads(src[i:].rstrip().rstrip(";"))


def js_round(x):
    """JavaScript Math.round: halves round up (towards +infinity)."""
    return math.floor(x + 0.5)


def default_shares(role):
    w = [t["im"] * t["ft"] for t in role["tasks"]]
    s = 0
    for x in w:
        s += x
    return [x / s for x in w]


def saved(l, p):
    return p["s1"] if l == 1 else (E2W * p["s1"] if l == 2 else 0)


def evaluate(role, p):
    key = "g" if p.get("set") == "g" else "h"
    w = default_shares(role)
    n = len(role["tasks"])
    n_exp, timed, review = 0, 0.0, 0.0
    for i, t in enumerate(role["tasks"]):
        l = t[key]
        timed += w[i] * saved(l, p)
        review += w[i] * p["v"] if l > 0 else 0
        if l > 0:
            n_exp += 1
    naive = n_exp / n
    reviewed = timed - review
    absorbed = p["a"] * reviewed if reviewed > 0 else 0
    net = reviewed - absorbed
    head = role["head"]
    juniors = js_round(head * role["jr"])
    cut = math.floor(timed * head)
    return dict(n=n, nExp=n_exp, naive=naive, timed=timed, review=review, reviewed=reviewed,
                absorbed=absorbed, net=net, head=head, juniors=juniors, cut=cut,
                shortfall=cut - net * head, reviewFte=review * head, absorbedFte=absorbed * head,
                juniorsLeft=max(0, juniors - cut))


def wp(p, over):
    q = dict(p)
    q.update(over)
    return q


def rng(role, p):
    lo, hi = evaluate(role, wp(p, LOW)), evaluate(role, wp(p, HIGH))
    head = role["head"]
    clo, chi = head * COST["lo"], head * COST["hi"]
    lf, hf = lo["net"] * head, hi["net"] * head
    return dict(lowNet=lo["net"], highNet=hi["net"], lowFte=lf, highFte=hf,
                paybackFast=(clo / hf * 12) if hf > 0 else None,
                paybackSlow=(chi / lf * 12) if lf > 0 else None)


def r6(x):
    return None if x is None else js_round(x * 1e6) / 1e6


def canon(sample):
    p = wp(DEF, {"set": "h"})
    out = {"roles": []}
    F = dict(head=0, naive=0, timed=0, reviewed=0, net=0, cut=0, shortfall=0, lowFte=0, highFte=0, brkNet=0)
    FG = dict(F)
    for r in sample["roles"]:
        e, g, b, eg = evaluate(r, p), rng(r, p), evaluate(r, wp(p, {"v": 0})), evaluate(r, wp(p, {"set": "g"}))
        head = r["head"]
        dis = sum(1 for t in r["tasks"] if (t["h"] > 0) != (t["g"] > 0))
        out["roles"].append(dict(
            soc=r["soc"], n=e["n"], nExp=e["nExp"], head=head, juniors=e["juniors"],
            naive=r6(e["naive"]), timed=r6(e["timed"]), reviewed=r6(e["reviewed"]), net=r6(e["net"]),
            fteNaive=r6(e["naive"] * head), fteTimed=r6(e["timed"] * head), fteReviewed=r6(e["reviewed"] * head),
            fteNet=r6(e["net"] * head), lowNet=r6(g["lowNet"]), highNet=r6(g["highNet"]),
            lowFte=r6(g["lowFte"]), highFte=r6(g["highFte"]), paybackFast=r6(g["paybackFast"]),
            paybackSlow=r6(g["paybackSlow"]), cut=e["cut"], shortfall=r6(e["shortfall"]),
            reviewFte=r6(e["reviewFte"]), absorbedFte=r6(e["absorbedFte"]), juniorsLeft=e["juniorsLeft"],
            brkNet=r6(b["net"]), brkFte=r6(b["net"] * head), gNaive=r6(eg["naive"]), gNet=r6(eg["net"]),
            disagree=dis))
        for acc, pp in ((F, p), (FG, wp(p, {"set": "g"}))):
            ee, gg, bb = evaluate(r, pp), rng(r, pp), evaluate(r, wp(pp, {"v": 0}))
            acc["head"] += head
            acc["naive"] += ee["naive"] * head; acc["timed"] += ee["timed"] * head
            acc["reviewed"] += ee["reviewed"] * head; acc["net"] += ee["net"] * head
            acc["cut"] += ee["cut"]; acc["shortfall"] += ee["shortfall"]
            acc["lowFte"] += gg["lowFte"]; acc["highFte"] += gg["highFte"]; acc["brkNet"] += bb["net"] * head
    out["firm"] = {k: r6(v) for k, v in F.items()}
    out["firmG"] = {k: r6(v) for k, v in FG.items()}
    return out


if __name__ == "__main__":
    repo = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
    print(json.dumps(canon(load(repo))))
