"""Convert some QA questions from TITA to MCQ so the bank's MCQ/TITA ratio
tracks CAT (about 14 MCQ : 8 TITA per QA section). Distractors are built
from the common traps listed in each question. The answer checks in
build_data.py then run against the new options."""
from common import QUESTIONS

CONVERT = {
    # id: (options, correct index)
    "Q002": (["25%", "20%", "22.5%", "16%"], 1),
    "Q004": (["No profit, no loss", "₹10", "₹20", "₹40"], 2),
    "Q009": (["10", "20", "15", "12"], 2),
    "Q013": (["₹2,400", "₹1,800", "₹2,600", "₹1,600"], 1),
    "Q016": (["18", "24", "30", "20"], 1),
    "Q018": (["65", "65.5", "66", "64.5"], 1),
    "Q022": (["6 L", "8 L", "10 L", "12 L"], 2),
    "Q026": (["15", "20", "24", "30"], 3),
    "Q032": (["18", "24", "30", "36"], 2),
    "Q044": (["5", "10", "12", "15"], 1),
    "Q051": (["32", "36", "28", "20"], 2),
    "Q057": (["4", "5", "6", "3"], 1),
    "Q063": (["15", "243", "8", "10"], 0),
    "Q067": (["735", "728", "714", "742"], 1),
    "Q073": (["6", "18", "24", "36"], 2),
    "Q075": (["20", "22", "24", "25"], 2),
    "Q094": (["440", "1,540", "3,080", "1,450"], 1),
}

for q in QUESTIONS:
    if q["id"] in CONVERT:
        opts, idx = CONVERT[q["id"]]
        q["options"], q["answer"], q["type"] = opts, idx, "MCQ"
