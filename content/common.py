"""Shared authoring helpers for the CAT question bank.

Every question is authored in Python so that its answer can be re-computed
independently (QA / DILR) or checked against the passage text (VARC).
`build_data.py` imports all content modules, runs every check and emits
src/data/*.json for the web app.
"""
from fractions import Fraction
import re

QUESTIONS = []   # list of dicts
SETS = []        # list of dicts (DILR sets, RC passages)
CHECKS = []      # (qid, callable returning computed answer)
SET_SOLVERS = [] # (set_id, callable returning {qnum: answer}) for DILR

DIFF = {"E": "Easy", "M": "Medium", "H": "Hard"}


def _steps(s):
    if isinstance(s, (list, tuple)):
        return list(s)
    return [x.strip() for x in s.strip().split("\n") if x.strip()]


def add(section, topic, subtopic, diff, secs, text, answer, solution, fast,
        hint, trap, note, options=None, set_id=None, check=None,
        evidence=None, qid=None, extra=None):
    """Register one question.

    answer: for MCQ an int index 0..3; for TITA a string.
    check:  optional zero-arg callable returning the independently computed
            answer (number/str). For MCQ it is compared with options[answer].
    evidence: VARC only - list of exact substrings of the passage that
              support the answer.
    """
    n = sum(1 for q in QUESTIONS if q["section"] == section) + 1
    prefix = {"VARC": "V", "DILR": "D", "QA": "Q"}[section]
    qid = qid or f"{prefix}{n:03d}"
    q = {
        "id": qid,
        "section": section,
        "topic": topic,
        "subtopic": subtopic,
        "difficulty": DIFF[diff],
        "time": secs,
        "type": "MCQ" if options else "TITA",
        "text": text.strip(),
        "options": options,
        "answer": answer,
        "solution": _steps(solution),
        "fast": fast.strip(),
        "hint": hint.strip(),
        "trap": trap.strip(),
        "note": note.strip(),
    }
    if set_id:
        q["setId"] = set_id
    if evidence:
        q["evidence"] = evidence
    if extra:
        q.update(extra)
    QUESTIONS.append(q)
    if check:
        CHECKS.append((qid, check))
    return q


def qa(topic, subtopic, diff, secs, text, answer, solution, fast, hint, trap,
       note, options=None, check=None):
    return add("QA", topic, subtopic, diff, secs, text, answer, solution, fast,
               hint, trap, note, options=options, check=check)


def add_set(set_id, section, topic, subtopic, title, body, tables=None,
            chart=None, solver=None, sentences=None):
    s = {"id": set_id, "section": section, "topic": topic,
         "subtopic": subtopic, "title": title, "body": body.strip()}
    if tables:
        s["tables"] = tables
    if chart:
        s["chart"] = chart
    SETS.append(s)
    if solver:
        SET_SOLVERS.append((set_id, solver))
    return s


def table(caption, headers, rows):
    return {"caption": caption, "headers": headers,
            "rows": [[str(c) for c in r] for r in rows]}


# ---------- answer normalisation ----------

def to_num(x):
    """Parse '12', '12.5', '3/4', '-2', '₹1,200', '25%' into Fraction."""
    if isinstance(x, bool):
        raise ValueError
    if isinstance(x, (int, Fraction)):
        return Fraction(x)
    if isinstance(x, float):
        return Fraction(x).limit_denominator(10**6)
    s = str(x).strip().replace(",", "").replace("₹", "").replace("%", "")
    s = re.sub(r"\s*(km/h|km|hours?|days?|minutes?|cm³|cm²|cm|m²|m|litres?|L|s|°|units?|sq\.?\s*units)$", "", s)
    if re.fullmatch(r"-?\d+/\d+", s):
        a, b = s.split("/")
        return Fraction(int(a), int(b))
    return Fraction(s).limit_denominator(10**6)


def same(a, b):
    try:
        return abs(float(to_num(a) - to_num(b))) < 1e-6
    except Exception:
        return str(a).strip().lower() == str(b).strip().lower()
