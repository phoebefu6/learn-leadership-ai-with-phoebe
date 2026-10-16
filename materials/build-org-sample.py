#!/usr/bin/env python3
"""Build assets/org-sample.js for the role-redesign bench (learn-leadership-ai-with-phoebe).

Inputs (download each into its own empty directory, read only, never execute anything from them):
  --labels  full_labelset.tsv from github.com/openai/GPTs-are-GPTs (data/, MIT licence):
            task-level exposure labels from Eloundou, Manning, Mishkin, Rock (2023, arXiv 2303.10130)
            columns used: O*NET-SOC Code, Task ID, human_exposure_agg, gpt4_exposure
  --onet    directory holding "Task Statements.txt" and "Task Ratings.txt" from the
            O*NET 31.0 Database text release (USDOL/ETA, CC BY 4.0)

Join: (O*NET-SOC Code, Task ID). A task ships only if it carries an exposure label AND an O*NET 31.0
importance (IM) rating AND a frequency (FT) distribution. Task text is O*NET 31.0's.

Shipped per task (integers, json.dumps):
  h   human exposure label  0=E0 none, 1=E1 direct, 2=E2 needs LLM-powered software
  g   GPT-4 exposure label  (same coding) - shipped so the bench can show where the two disagree
  im  O*NET importance x 100   (scale 1-5)
  ft  O*NET mean frequency category x 100 (categories 1 yearly or less ... 7 hourly or more),
      computed as sum(category * percent) / sum(percent)
  c   1 = core task, 0 = supplemental

Marlowe Group headcount and junior share per role are CONSTRUCTED for teaching (Marlowe is a
fictional 4,000-person professional-services firm); they are written here, not read from any source.
"""
import argparse, csv, json, os, sys

ROLES = [  # (O*NET-SOC code, short name used on the page, Marlowe headcount, junior share) - CONSTRUCTED
    ("13-1111.00", "Management analyst", 900, 0.45),
    ("13-2011.00", "Accountant and auditor", 520, 0.40),
    ("15-2031.00", "Operations research analyst", 260, 0.40),  # 13-2051.00 has no O*NET 31.0 task ratings
    ("13-1082.00", "Project management specialist", 180, 0.30),
    ("15-1252.00", "Software developer", 140, 0.35),
    ("11-1021.00", "General and operations manager", 120, 0.00),
    ("13-1161.00", "Market research analyst", 120, 0.45),
    ("43-6014.00", "Secretary and administrative assistant", 120, 0.30),
    ("15-1211.00", "Computer systems analyst", 110, 0.35),
    ("15-2051.00", "Data scientist", 90, 0.40),
    ("43-3031.00", "Bookkeeping and accounting clerk", 90, 0.30),
    ("43-4051.00", "Customer service representative", 90, 0.35),
    ("43-6011.00", "Executive assistant", 80, 0.20),
    ("41-3091.00", "Sales representative, services", 80, 0.30),
    ("13-1041.00", "Compliance officer", 70, 0.30),
    ("43-9061.00", "Office clerk", 70, 0.35),
    ("13-1071.00", "Human resources specialist", 60, 0.35),
    ("23-2011.00", "Paralegal and legal assistant", 60, 0.40),
    ("15-1232.00", "Computer user support specialist", 60, 0.40),
    ("23-1011.00", "Lawyer", 50, 0.30),
    ("13-2041.00", "Credit analyst", 40, 0.40),
    ("15-1212.00", "Information security analyst", 40, 0.30),
    ("27-1024.00", "Graphic designer", 40, 0.35),
    ("13-1151.00", "Training and development specialist", 35, 0.30),
    ("27-3031.00", "Public relations specialist", 30, 0.35),
    ("27-3042.00", "Technical writer", 30, 0.35),
    ("43-4171.00", "Receptionist", 30, 0.40),
    ("13-2031.00", "Budget analyst", 30, 0.35),
    ("43-4161.00", "Human resources assistant", 25, 0.40),
    ("43-3051.00", "Payroll and timekeeping clerk", 20, 0.30),
    ("11-2021.00", "Marketing manager", 20, 0.00),
    ("11-3021.00", "Computer and information systems manager", 20, 0.00),
    ("11-3031.01", "Treasurer and controller", 15, 0.00),
    ("11-3121.00", "Human resources manager", 15, 0.00),
]
LAB = {"E0": 0, "E1": 1, "E2": 2}


def read_tsv(path):
    with open(path, newline="", encoding="utf-8", errors="replace") as f:
        return list(csv.DictReader(f, delimiter="\t"))


def build(labels_path, onet_dir):
    want = {r[0] for r in ROLES}
    labels = {}
    for r in read_tsv(labels_path):
        soc = r["O*NET-SOC Code"]
        if soc not in want:
            continue
        tid = int(float(r["Task ID"]))
        labels[(soc, tid)] = (LAB[r["human_exposure_agg"]], LAB[r["gpt4_exposure"]])
    stmts = {}
    for r in read_tsv(os.path.join(onet_dir, "Task Statements.txt")):
        soc = r["O*NET-SOC Code"]
        if soc in want:
            stmts[(soc, int(r["Task ID"]))] = (r["Task"].strip(), 1 if r["Task Type"] == "Core" else 0)
    im, ftnum, ftden = {}, {}, {}
    for r in read_tsv(os.path.join(onet_dir, "Task Ratings.txt")):
        soc = r["O*NET-SOC Code"]
        if soc not in want:
            continue
        k = (soc, int(r["Task ID"]))
        if r["Scale ID"] == "IM":
            im[k] = float(r["Data Value"])
        elif r["Scale ID"] == "FT":
            c, v = int(r["Category"]), float(r["Data Value"])
            ftnum[k] = ftnum.get(k, 0.0) + c * v
            ftden[k] = ftden.get(k, 0.0) + v
    out, cov = [], []
    for soc, name, head, jr in ROLES:
        lab_ids = sorted(t for (s, t) in labels if s == soc)
        tasks = []
        for tid in lab_ids:
            k = (soc, tid)
            if k not in stmts or k not in im or ftden.get(k, 0) <= 0:
                continue
            text, core = stmts[k]
            h, g = labels[k]
            tasks.append({"id": tid, "t": text, "h": h, "g": g, "c": core,
                          "im": int(round(im[k] * 100)), "ft": int(round(ftnum[k] / ftden[k] * 100))})
        cov.append((soc, name, len(lab_ids), len(tasks)))
        if tasks:
            out.append({"soc": soc, "name": name, "head": head, "jr": jr, "tasks": tasks})
    return out, cov


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--labels", required=True)
    ap.add_argument("--onet", required=True)
    ap.add_argument("--out", default=os.path.join(os.path.dirname(__file__), "..", "assets", "org-sample.js"))
    a = ap.parse_args()
    roles, cov = build(a.labels, a.onet)
    for soc, name, nl, nk in cov:
        print(f"{soc} {name:42s} labelled {nl:3d}  shipped {nk:3d}", file=sys.stderr)
    print("roles", len(roles), "tasks", sum(len(r["tasks"]) for r in roles),
          "headcount", sum(r["head"] for r in roles), file=sys.stderr)
    sample = {
        "source": "O*NET 31.0 Database (USDOL/ETA, CC BY 4.0): task statements, importance and frequency ratings. "
                  "Exposure labels: Eloundou, Manning, Mishkin and Rock (2023), GPTs-are-GPTs released data (MIT licence).",
        "modified": "Joined on occupation and task ID; frequency reduced to its mean category; ratings x100 as integers. "
                    "USDOL/ETA has not approved, endorsed, or tested these modifications.",
        "firm": "Marlowe Group (constructed): headcount and junior share per role are invented for teaching.",
        "roles": roles,
    }
    js = ("/* Derived from the O*NET 31.0 Database by USDOL/ETA, used under CC BY 4.0 (O*NET is a trademark of USDOL/ETA), "
          "and from the GPTs-are-GPTs released data (MIT). Modified; USDOL/ETA has not approved, endorsed, or tested these modifications. "
          "Generated by materials/build-org-sample.py */\n"
          "window.ORG_SAMPLE = " + json.dumps(sample, ensure_ascii=True, separators=(",", ":")) + ";\n")
    with open(a.out, "w", encoding="ascii") as f:
        f.write(js)
    print("wrote", a.out, len(js), "bytes", file=sys.stderr)


if __name__ == "__main__":
    main()
