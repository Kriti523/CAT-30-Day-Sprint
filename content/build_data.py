"""Import all content, validate it and write src/data/*.json.

Run:  python3 content/build_data.py
Exit code is non-zero if any validation fails.
"""
import json, os, re, sys, importlib
from collections import Counter, defaultdict
from difflib import SequenceMatcher

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import common
from common import QUESTIONS, SETS, CHECKS, SET_SOLVERS, same

MODULES = ["qa_arith", "qa_algebra", "qa_numgeo", "qa_mcq_convert",
           "dilr_1", "dilr_2", "dilr_3", "dilr_4",
           "varc_rc1", "varc_rc2", "varc_rc3", "varc_va"]

errors, report = [], []


def err(msg):
    errors.append(msg)


for m in MODULES:
    try:
        importlib.import_module(m)
    except ModuleNotFoundError as e:
        if e.name == m:
            report.append(f"(module {m} not present yet)")
            continue
        raise

byid = {q["id"]: q for q in QUESTIONS}
sets = {s["id"]: s for s in SETS}

# 0. Deterministic option shuffle so the answer key is not biased toward the
#    position in which options were authored. Option-letter references in
#    explanations are written as ⟦X⟧ markers and remapped here.
import random
LET = "ABCD"
TEXT_FIELDS = ("solution", "fast", "hint", "trap", "note")
for s in SETS:
    if "⟦" in s["body"]:
        err(f"set {s['id']} body contains an option marker")
for q in QUESTIONS:
    if q["type"] != "MCQ" or q.get("noshuffle"):
        for f in TEXT_FIELDS:
            v = q[f]
            if ("⟦" in "".join(v)) if isinstance(v, list) else ("⟦" in v):
                err(f"{q['id']} unshuffled question has option markers")
        continue
    rng = random.Random("cat30:" + q["id"])
    perm = list(range(len(q["options"])))
    rng.shuffle(perm)                       # new position i holds old option perm[i]
    newpos = {old: new for new, old in enumerate(perm)}
    q["options"] = [q["options"][p] for p in perm]
    q["answer"] = newpos[q["answer"]]
    remap = lambda t: re.sub(r"⟦([A-D])⟧", lambda m: LET[newpos[LET.index(m.group(1))]], t)
    for f in TEXT_FIELDS:
        v = q[f]
        q[f] = [remap(x) for x in v] if isinstance(v, list) else remap(v)

# 1. counts
cnt = Counter(q["section"] for q in QUESTIONS)
for sec in ("VARC", "DILR", "QA"):
    if cnt[sec] != 100:
        err(f"{sec} has {cnt[sec]} questions (expected 100)")

# 2. completeness
REQ = ["topic", "subtopic", "difficulty", "time", "text", "solution", "fast",
       "hint", "trap", "note"]
for q in QUESTIONS:
    for f in REQ:
        if not q.get(f):
            err(f"{q['id']} missing {f}")
    if q["type"] == "MCQ":
        opts = q["options"]
        if len(opts) != 4:
            err(f"{q['id']} has {len(opts)} options")
        if len(set(o.strip().lower() for o in opts)) != len(opts):
            err(f"{q['id']} has duplicate options")
        if not (isinstance(q["answer"], int) and 0 <= q["answer"] < len(opts)):
            err(f"{q['id']} bad MCQ answer index {q['answer']}")
    else:
        if not isinstance(q["answer"], str) or not q["answer"].strip():
            err(f"{q['id']} TITA answer must be non-empty string")
        if not re.fullmatch(r"-?\d+(\.\d+)?|\d+", q["answer"]):
            err(f"{q['id']} TITA answer '{q['answer']}' is not a typeable number/sequence")
    if "setId" in q and q["setId"] not in sets:
        err(f"{q['id']} refers to unknown set {q['setId']}")

# 3. independent answer checks (QA and some others)
checked = set()
for qid, fn in CHECKS:
    q = byid[qid]
    try:
        val = fn()
    except Exception as e:
        err(f"{qid} check raised {e!r}")
        continue
    if val is None:
        err(f"{qid} check returned None")
        continue
    if q["type"] == "MCQ":
        correct = q["options"][q["answer"]]
        if not same(correct, val):
            err(f"{qid} MCQ answer '{correct}' != computed '{val}'")
        others = [o for i, o in enumerate(q["options"]) if i != q["answer"] and same(o, val)]
        if others:
            err(f"{qid} computed value also matches distractor {others}")
    else:
        if not same(q["answer"], val):
            err(f"{qid} TITA answer '{q['answer']}' != computed '{val}'")
    checked.add(qid)

# 4. DILR set solvers
for sid, solver in SET_SOLVERS:
    try:
        res = solver()
    except Exception as e:
        err(f"set {sid} solver raised {e!r}")
        continue
    qs = [q for q in QUESTIONS if q.get("setId") == sid]
    for i, q in enumerate(qs, 1):
        if i not in res:
            err(f"set {sid} solver gave no answer for Q{i} ({q['id']})")
            continue
        val = res[i]
        if q["type"] == "MCQ":
            correct = q["options"][q["answer"]]
            if not same(correct, val):
                err(f"{q['id']} (set {sid} Q{i}) MCQ '{correct}' != solver '{val}'")
            others = [o for j, o in enumerate(q["options"]) if j != q["answer"] and same(o, val)]
            if others:
                err(f"{q['id']} solver value also matches distractor {others}")
        else:
            if not same(q["answer"], val):
                err(f"{q['id']} (set {sid} Q{i}) TITA '{q['answer']}' != solver '{val}'")
        checked.add(q["id"])

# 5. VARC evidence must appear verbatim in the passage
for q in QUESTIONS:
    if q["section"] != "VARC":
        continue
    if q.get("setId"):
        body = sets[q["setId"]]["body"]
        ev = q.get("evidence") or []
        if not ev:
            err(f"{q['id']} RC question has no evidence quote")
        for e in ev:
            if e not in body:
                err(f"{q['id']} evidence not found in passage: {e[:60]!r}")
        if ev and all(e in body for e in ev):
            checked.add(q["id"])
    elif q.get("vcheck"):
        ok, msg = q["vcheck"](q)
        if not ok:
            err(f"{q['id']} VA check failed: {msg}")
        else:
            checked.add(q["id"])

# 6. duplicates / near-duplicates
texts = [(q["id"], re.sub(r"\W+", " ", q["text"].lower())) for q in QUESTIONS]
seen = {}
for qid, t in texts:
    if t in seen:
        err(f"duplicate question text {qid} == {seen[t]}")
    seen[t] = qid
near = []
by_sec = defaultdict(list)
for q in QUESTIONS:
    if not q.get("setId"):
        by_sec[q["section"]].append(q)
for sec, qs in by_sec.items():
    for i in range(len(qs)):
        for j in range(i + 1, len(qs)):
            r = SequenceMatcher(None, qs[i]["text"], qs[j]["text"]).ratio()
            if r > 0.85:
                near.append((qs[i]["id"], qs[j]["id"], round(r, 2)))
for a, b, r in near:
    err(f"near-duplicate {a} ~ {b} ({r})")

# 7. set sizes
for s in SETS:
    n = sum(1 for q in QUESTIONS if q.get("setId") == s["id"])
    if n == 0:
        err(f"set {s['id']} has no questions")

unchecked = [q["id"] for q in QUESTIONS if q["id"] not in checked]

# ---------- stats ----------
stats = {}
for sec in ("VARC", "DILR", "QA"):
    qs = [q for q in QUESTIONS if q["section"] == sec]
    stats[sec] = {
        "total": len(qs),
        "mcq": sum(q["type"] == "MCQ" for q in qs),
        "tita": sum(q["type"] == "TITA" for q in qs),
        "difficulty": dict(Counter(q["difficulty"] for q in qs)),
        "topics": dict(Counter(q["topic"] for q in qs)),
        "subtopics": dict(Counter(q["subtopic"] for q in qs)),
        "sets": len([s for s in SETS if s["section"] == sec]),
    }

out_q = []
for q in QUESTIONS:
    d = {k: v for k, v in q.items() if k not in ("vcheck",)}
    out_q.append(d)

data_dir = os.path.join(HERE, "..", "src", "data")
os.makedirs(data_dir, exist_ok=True)
with open(os.path.join(data_dir, "questions.json"), "w") as f:
    json.dump(out_q, f, ensure_ascii=False, separators=(",", ":"))
with open(os.path.join(data_dir, "sets.json"), "w") as f:
    json.dump(SETS, f, ensure_ascii=False, separators=(",", ":"))

summary = {
    "counts": dict(cnt),
    "stats": stats,
    "machine_checked": len(checked),
    "unchecked": unchecked,
    "errors": errors,
    "notes": report,
}
with open(os.path.join(HERE, "validation_result.json"), "w") as f:
    json.dump(summary, f, ensure_ascii=False, indent=1)

print(json.dumps({k: summary[k] for k in ("counts", "machine_checked")}, ensure_ascii=False))
for sec in stats:
    s = stats[sec]
    print(sec, "MCQ", s["mcq"], "TITA", s["tita"], s["difficulty"], "sets", s["sets"])
print("unchecked:", len(unchecked), unchecked[:20])
for r in report:
    print(r)
if errors:
    print(f"\n{len(errors)} ERRORS:")
    for e in errors:
        print(" -", e)
    sys.exit(1)
print("ALL CHECKS PASSED")
