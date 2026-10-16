#!/usr/bin/env python3
"""Compare the node canon (engine file) with the Python reference BY VALUE, every key of every role.

Exit 0 when every number agrees within 1e-6 (the canon is rounded to 6 decimals on both sides) and
the planted check FAILS as it should: the same comparison is re-run after scaling one value by 1.001
(a 0.1% fault), and that run must report a mismatch. Exit 1 otherwise.
Usage: python3 materials/compare-ladder.py [repo]
"""
import json, os, subprocess, sys

repo = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
here = os.path.join(repo, "materials")
node = subprocess.run(["node", os.path.join(here, "org-node.js"), repo], capture_output=True, text=True)
if node.returncode != 0:
    print("node runner failed:", node.stderr.strip())
    sys.exit(1)
py = subprocess.run([sys.executable, os.path.join(here, "org_reference.py"), repo], capture_output=True, text=True, check=True)
N, P = json.loads(node.stdout), json.loads(py.stdout)


def diff(a, b, path="", out=None):
    out = [] if out is None else out
    if isinstance(a, dict) and isinstance(b, dict):
        for k in sorted(set(a) | set(b)):
            if k not in a or k not in b:
                out.append(path + "/" + k + " missing on one side")
            else:
                diff(a[k], b[k], path + "/" + k, out)
    elif isinstance(a, list) and isinstance(b, list):
        if len(a) != len(b):
            out.append(path + " length %d vs %d" % (len(a), len(b)))
        for i, (x, y) in enumerate(zip(a, b)):
            diff(x, y, path + "/%d" % i, out)
    elif isinstance(a, (int, float)) and isinstance(b, (int, float)) and not isinstance(a, bool):
        if abs(a - b) > 1e-6 * max(1.0, abs(a), abs(b)):
            out.append(path + " %r vs %r" % (a, b))
    elif a != b:
        out.append(path + " %r vs %r" % (a, b))
    return out


def count(x):
    if isinstance(x, dict):
        return sum(count(v) for v in x.values())
    if isinstance(x, list):
        return sum(count(v) for v in x)
    return 1 if isinstance(x, (int, float)) and not isinstance(x, bool) else 0


bad = diff(N, P)
planted = json.loads(json.dumps(P))
planted["firm"]["net"] = planted["firm"]["net"] * 1.001
caught = diff(N, planted)
print("values compared:", count(N), "| mismatches:", len(bad), "| planted 0.1% fault caught:", bool(caught))
for b in bad[:20]:
    print("  ", b)
sys.exit(0 if (not bad and caught) else 1)
