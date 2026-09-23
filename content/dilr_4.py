"""DILR sets 16-20: quant caselet, 3-set Venn, Venn min/max, hybrid DI+LR,
hybrid arrangement + table."""
from fractions import Fraction as F
from itertools import permutations, product
from common import add, add_set, table
from dilr_1 import dq, unique

S = "DILR"

# =====================================================================
# D16  Quant caselet: partnership
# =====================================================================
def shares16(a_months=((6, 12),), b=((8, 6), (6, 6)), c=((9, 8),), profit=20, salary=1):
    cm = lambda parts: sum(x * m for x, m in parts)
    A, B, C = cm(a_months), cm(b), cm(c)
    rest = profit - salary
    tot = A + B + C
    return F(rest * A, tot) + salary, F(rest * B, tot), F(rest * C, tot)


def solve16():
    a, b, c = shares16()
    _, _, c2 = shares16(b=((8, 12),))
    # minimum profit P with C's share >= 9
    Pmin = F(9) * F(19, 6) + 1
    assert shares16(profit=Pmin)[2] == 9
    ratio = a / c
    return {1: b, 2: f"{ratio.numerator}:{ratio.denominator}",
            3: f"₹{float(c2):g} lakh", 4: float(Pmin), 5: b / 20 * 100}


add_set("D16", S, "Caselets", "Quant-based caselet", "Three partners, one year", """
Aditi, Bharat and Chetna ran a business for one year (12 months).

· Aditi invested ₹6 lakh at the start and kept it in for all 12 months.
· Bharat invested ₹8 lakh at the start but withdrew ₹2 lakh at the end of the 6th month; the remaining ₹6 lakh stayed in for the rest of the year.
· Chetna joined at the end of the 4th month with ₹9 lakh, which stayed in until the end of the year.

At the end of the year the profit was ₹20 lakh. Aditi, the working partner, first received a fixed payment of ₹1 lakh out of the profit. The rest was divided in the ratio of each partner's capital multiplied by the number of months it was invested (capital-months).
""", solver=solve16)

T, SUB = "Caselets", "Quant-based caselet"
dq("D16", T, SUB, "M", 120, "What was Bharat's share of the profit (in ₹ lakh)?", "7",
   """Capital-months: Aditi 6 × 12 = 72; Bharat 8 × 6 + 6 × 6 = 84; Chetna 9 × 8 = 72.
   Ratio 72 : 84 : 72 = 6 : 7 : 6 (total 19).
   Distributable profit = 20 − 1 = 19 ⇒ Bharat = 7.""",
   "Divide capital-months by 12 to get 6 : 7 : 6.",
   "Chetna's money was in for only 8 months.",
   "Using 12 months for Chetna or ignoring Bharat's withdrawal.",
   "Partnership: profit ∝ capital × time; pay fixed amounts first.")
dq("D16", T, SUB, "M", 60, "What is the ratio of Aditi's total earnings from the business to Chetna's?", 2,
   """Aditi = 1 (fixed) + 6 = 7; Chetna = 6 ⇒ 7 : 6.""",
   "Add the fixed payment only to Aditi.",
   "Include the working partner's fixed payment.",
   "Answering 1 : 1 by using only the capital-month shares.",
   "Total earnings = fixed payment + share.",
   options=["1:1", "6:7", "7:6", "12:7"])
dq("D16", T, SUB, "H", 90, "If Bharat had not withdrawn any money, what would Chetna's share of the profit have been?", 1,
   """Bharat: 8 × 12 = 96. Ratio 72 : 96 : 72 = 3 : 4 : 3 (total 10).
   Chetna = 19 × 3/10 = ₹5.7 lakh.""",
   "Recompute only Bharat's capital-months.",
   "Bharat's capital-months become 96.",
   "Keeping the denominator 19 from the original ratio.",
   "Any change to one partner changes everyone's fraction.",
   options=["₹6 lakh", "₹5.7 lakh", "₹5.4 lakh", "₹6.3 lakh"])
dq("D16", T, SUB, "H", 90,
   "With the same investments and the same ₹1 lakh fixed payment, what is the minimum annual profit (in ₹ lakh) for which Chetna's share would be at least ₹9 lakh?", "29.5",
   """Chetna gets 6/19 of (P − 1).
   6(P − 1)/19 ≥ 9 ⇒ P − 1 ≥ 28.5 ⇒ P ≥ 29.5.""",
   "Chetna's fraction of the distributable profit is 6/19.",
   "Set up 6/19 × (P − 1) = 9.",
   "Forgetting to add back the fixed payment (28.5).",
   "Reverse questions: solve for the total, then add fixed parts.")
dq("D16", T, SUB, "E", 30, "What percentage of the total profit of ₹20 lakh went to Bharat?", "35",
   """7/20 = 35%.""",
   "Share ÷ total profit.",
   "Use the ₹20 lakh total, not ₹19 lakh.",
   "Dividing by 19 (36.8%).",
   "Read the base of the percentage carefully.")

# =====================================================================
# D17  Three-set Venn diagram
# =====================================================================
V = dict(F=75, M=63, O=55, FM=23, MO=18, FO=20, none=60, total=200)


def solve17():
    sols = []
    for g in range(0, 100):
        d, e, f = V["FM"] - g, V["MO"] - g, V["FO"] - g
        a = V["F"] - d - f - g; b = V["M"] - d - e - g; c = V["O"] - e - f - g
        if min(a, b, c, d, e, f) < 0:
            continue
        if a + b + c + d + e + f + g + V["none"] == V["total"]:
            sols.append(dict(a=a, b=b, c=c, d=d, e=e, f=f, g=g))
    r = unique(sols, "D17")
    two = r["d"] + r["e"] + r["f"]
    return {1: r["g"], 2: r["a"] + r["b"] + r["c"], 3: str(two), 4: str(r["a"] + r["d"]),
            5: two + r["g"] + 10}


add_set("D17", S, "Venn Diagrams", "Three-set Venn", "Electives in an MBA batch", """
In a batch of 200 MBA students, each student may take any of three electives: Finance, Marketing and Operations.

· 75 students take Finance, 63 take Marketing and 55 take Operations.
· 23 take both Finance and Marketing, 18 take both Marketing and Operations, and 20 take both Finance and Operations. (These counts include students who take all three.)
· 60 students take none of the three electives.
""", solver=solve17)

T, SUB = "Venn Diagrams", "Three-set Venn"
dq("D17", T, SUB, "M", 90, "How many students take all three electives?", "8",
   """Students taking at least one = 200 − 60 = 140.
   140 = 75 + 63 + 55 − 23 − 18 − 20 + (all three) = 132 + (all three) ⇒ all three = 8.""",
   "Inclusion–exclusion solved for the triple overlap.",
   "Find the number taking at least one elective first.",
   "Forgetting to subtract the 60 who take none.",
   "|A∪B∪C| = ΣA − Σ(pairs) + (all three).")
dq("D17", T, SUB, "M", 90, "How many students take exactly one elective?", "95",
   """Pair-only regions: F&M 15, M&O 10, F&O 12.
   Only F = 75 − 15 − 12 − 8 = 40; only M = 63 − 15 − 10 − 8 = 30; only O = 55 − 10 − 12 − 8 = 25.
   Exactly one = 95.""",
   "Exactly one = at-least-one − exactly-two − all-three = 140 − 37 − 8.",
   "Subtract the triple overlap from each pair count first.",
   "Using the pair totals (which include the triple) directly.",
   "Fill Venn regions from the centre outward.")
dq("D17", T, SUB, "E", 45, "How many students take exactly two electives?", 2,
   """(23 − 8) + (18 − 8) + (20 − 8) = 15 + 10 + 12 = 37.""",
   "Σ pairs − 3 × (all three).",
   "Remove the all-three students from each pair.",
   "Subtracting the triple only once (53).",
   "Exactly two = Σ|pairs| − 3|all three|.",
   options=["61", "45", "37", "53"])
dq("D17", T, SUB, "E", 45, "How many students take Finance but not Operations?", 3,
   """Finance − (Finance ∩ Operations) = 75 − 20 = 55.""",
   "|F| − |F ∩ O|.",
   "Subtract the whole F∩O count.",
   "Subtracting only the F&O-only region (12) ⇒ 63.",
   "A but not B = |A| − |A∩B|.",
   options=["40", "63", "47", "55"])
dq("D17", T, SUB, "M", 60,
   "If 10 students who take only Marketing also add Operations, how many students will take at least two electives?", "55",
   """Currently exactly two = 37, all three = 8 ⇒ 45.
   The 10 move from 'only Marketing' to 'Marketing & Operations' ⇒ 55.""",
   "They each move from 1 elective to 2.",
   "Who moves between which regions?",
   "Adding them to the all-three region.",
   "Transfers change two regions: one loses, one gains.")

# =====================================================================
# D18  Venn min / max
# =====================================================================
N18, A18, B18, C18 = 100, 80, 75, 70


def regions18():
    out = []
    for g in range(0, 71):
        s = A18 + B18 + C18 - N18 - 2 * g   # d + e + f
        if s < 0:
            continue
        for d in range(0, s + 1):
            for e in range(0, s - d + 1):
                f = s - d - e
                a = A18 - d - f - g; b = B18 - d - e - g; c = C18 - e - f - g
                if min(a, b, c) >= 0:
                    out.append(dict(a=a, b=b, c=c, d=d, e=e, f=f, g=g))
    return out


def solve18():
    R = regions18()
    gmin = min(r["g"] for r in R); gmax = max(r["g"] for r in R)
    one_max = max(r["a"] + r["b"] + r["c"] for r in R)
    two30 = {r["d"] + r["e"] + r["f"] for r in R if r["g"] == 30}
    two0 = {r["d"] + r["e"] + r["f"] for r in R if r["a"] + r["b"] + r["c"] == 0}
    assert len(two30) == len(two0) == 1
    return {1: gmin, 2: gmax, 3: one_max, 4: str(two30.pop()), 5: str(two0.pop())}


add_set("D18", S, "Venn Diagrams", "Maxima and minima in Venn", "Three payment apps", """
In a survey of 100 smartphone users, every respondent uses at least one of three payment apps — Alpha, Beta and Gamma. 80 respondents use Alpha, 75 use Beta and 70 use Gamma. No other information is available.
""", solver=solve18)

T, SUB = "Venn Diagrams", "Maxima and minima in Venn"
dq("D18", T, SUB, "M", 90, "What is the minimum possible number of respondents who use all three apps?", "25",
   """Let x₁, x₂, x₃ = numbers using exactly 1, 2, 3 apps. x₁ + x₂ + x₃ = 100 and x₁ + 2x₂ + 3x₃ = 225.
   Subtracting: x₂ + 2x₃ = 125. Also x₁ = x₃ − 25 ≥ 0 ⇒ x₃ ≥ 25.
   Achievable with x₁ = 0, x₂ = 75, x₃ = 25.""",
   "Minimum triple = Σ − 2N = 225 − 200 = 25.",
   "Count 'app-uses' (225) against people (100).",
   "Answering 0 or using Σ − N = 125.",
   "Exactly-k equations: Σx_k = N, Σk·x_k = Σ|sets|.")
dq("D18", T, SUB, "H", 120, "What is the maximum possible number of respondents who use all three apps?", "62",
   """From x₂ + 2x₃ = 125, x₂ ≥ 0 ⇒ x₃ ≤ 62 (x₂ must be odd when x₃ = 62: x₂ = 1).
   Check feasibility: x₃ = 62, one person uses exactly two apps (e.g. Alpha & Beta), x₁ = 37: Alpha-only 17, Beta-only 12, Gamma-only 8 ✓.
   Maximum = 62.""",
   "x₃ ≤ ⌊125/2⌋ and ≤ the smallest set (70); the first binds.",
   "Use the equation x₂ + 2x₃ = 125.",
   "Answering 70 (the smallest set), which breaks the total of 100.",
   "Max of the triple is limited by both the smallest set and the counting equation.")
dq("D18", T, SUB, "H", 90, "What is the maximum possible number of respondents who use exactly one app?", "37",
   """x₁ = x₃ − 25, so x₁ is largest when x₃ is largest (62) ⇒ x₁ = 37.""",
   "Express x₁ in terms of x₃.",
   "Relate 'exactly one' to 'all three'.",
   "Trying to set x₃ = 0 to free up people (infeasible: x₁ would be −25).",
   "In these systems, one variable often controls all the others.")
dq("D18", T, SUB, "M", 60, "If exactly 30 respondents use all three apps, how many use exactly two?", 0,
   """x₂ = 125 − 2 × 30 = 65.""",
   "Plug into x₂ + 2x₃ = 125.",
   "Use the derived equation.",
   "Using 100 − 30 = 70 (ignores exactly-one users).",
   "Derived equations turn 'if' questions into one-line answers.",
   options=["65", "70", "45", "55"])
dq("D18", T, SUB, "M", 60, "If no respondent uses exactly one app, how many use exactly two apps?", 3,
   """x₁ = 0 ⇒ x₃ = 25 ⇒ x₂ = 125 − 50 = 75.""",
   "x₁ = 0 fixes x₃ = 25.",
   "Use x₁ = x₃ − 25.",
   "Answering 25 (that is the all-three count).",
   "Chain the two derived relations.",
   options=["25", "50", "62", "75"])

# =====================================================================
# D19  Hybrid: DI + LR
# =====================================================================
PEOPLE = ["Ravi", "Sunil", "Tara", "Uma"]
CITIES = ["Delhi", "Mumbai", "Chennai", "Kolkata"]
PRICE = dict(Delhi=500, Mumbai=600, Chennai=450, Kolkata=400)


def solve19():
    sols = []
    for cities in permutations(CITIES):
        for units in permutations([10, 20, 30, 40]):
            city = dict(zip(PEOPLE, cities)); u = dict(zip(PEOPLE, units))
            inv = {v: k for k, v in city.items()}
            if (u[inv["Mumbai"]] == u["Tara"] + 10 and u["Uma"] == 40 and city["Uma"] != "Delhi"
                    and city["Ravi"] == "Chennai" and u[inv["Kolkata"]] == 10 and u["Sunil"] < u["Ravi"]):
                sols.append((city, u))
    city, u = unique(sols, "D19")
    rev = {p: u[p] * PRICE[city[p]] for p in PEOPLE}
    earn = {p: F(5, 100) * rev[p] + (1000 if u[p] >= 30 else 0) for p in PEOPLE}
    c2 = dict(city); c2["Ravi"], c2["Sunil"] = city["Sunil"], city["Ravi"]
    delta = sum(u[p] * PRICE[c2[p]] for p in PEOPLE) - sum(rev.values())
    return {1: [p for p in PEOPLE if city[p] == "Delhi"][0], 2: sum(rev.values()), 3: earn["Tara"],
            4: ("Decrease of ₹" if delta < 0 else "Increase of ₹") + str(abs(delta)),
            5: sum(1 for p in PEOPLE if earn[p] > 500)}


add_set("D19", S, "Hybrid Sets", "DI + LR hybrid", "Four salespeople, four cities", """
Four salespeople — Ravi, Sunil, Tara and Uma — are each posted to a different city among Delhi, Mumbai, Chennai and Kolkata. Last month they sold 10, 20, 30 and 40 units, one figure each (in some order). The price per unit depends only on the city (see table).

1. The person in Mumbai sold 10 units more than Tara.
2. Uma sold the most units and is not posted in Delhi.
3. Ravi is posted in Chennai.
4. The person in Kolkata sold 10 units.
5. Sunil sold fewer units than Ravi.

Each salesperson earns a commission of 5% of the revenue from his or her sales, plus a bonus of ₹1,000 if he or she sold at least 30 units.
""", tables=[table("Price per unit", ["City", "Delhi", "Mumbai", "Chennai", "Kolkata"],
                   [["Price (₹)", 500, 600, 450, 400]])], solver=solve19)

T, SUB = "Hybrid Sets", "DI + LR hybrid"
dq("D19", T, SUB, "M", 150, "Who is posted in Delhi?", 2,
   """Uma sold 40 and is not in Delhi; Ravi is in Chennai. If Uma were in Kolkata she would have sold 10 ✗. So Uma is in Mumbai, and Tara sold 40 − 10 = 30 (clue 1).
   Ravi and Sunil share 10 and 20 with Sunil < Ravi ⇒ Ravi 20, Sunil 10.
   The Kolkata seller sold 10 ⇒ Sunil is in Kolkata, leaving Tara in Delhi.""",
   "Uma's city is forced first; everything cascades from clue 1.",
   "Where can Uma be?",
   "Putting Uma in Kolkata without checking clue 4.",
   "Hybrid sets: finish the logic grid before touching the numbers.",
   options=["Ravi", "Sunil", "Tara", "Uma"])
dq("D19", T, SUB, "M", 60, "What was the total revenue (in ₹) from all four salespeople?", "52000",
   """Ravi 20 × 450 = 9,000; Sunil 10 × 400 = 4,000; Tara 30 × 500 = 15,000; Uma 40 × 600 = 24,000.
   Total = 52,000.""",
   "Units × city price, then add.",
   "Use the solved grid.",
   "Using the wrong city price for a person.",
   "Revenue = units × price of that person's city.")
dq("D19", T, SUB, "M", 60, "What were Tara's total earnings (commission plus bonus) in ₹?", "1750",
   """Tara's revenue = 15,000 ⇒ commission 750. She sold 30 units ⇒ bonus 1,000.
   Total = 1,750.""",
   "5% of 15,000 = 750.",
   "'At least 30' includes 30.",
   "Leaving out the bonus because Tara did not sell the most.",
   "Read inclusive thresholds (≥) carefully.")
dq("D19", T, SUB, "M", 75, "If Ravi and Sunil swapped cities but sold the same numbers of units, how would the total revenue change?", 1,
   """Ravi in Kolkata: 20 × 400 = 8,000; Sunil in Chennai: 10 × 450 = 4,500.
   Before: 9,000 + 4,000 = 13,000. After: 12,500 ⇒ decrease of ₹500.""",
   "Only two terms change: (450 − 400) × (10 − 20) = −500.",
   "Recompute only Ravi and Sunil.",
   "Assuming no change because the cities are only exchanged.",
   "Swaps change totals when both quantities and prices differ.",
   options=["No change", "Decrease of ₹500", "Increase of ₹500", "Decrease of ₹1000"])
dq("D19", T, SUB, "E", 45, "How many salespeople earned more than ₹500 in total (commission plus bonus)?", "2",
   """Earnings: Ravi 450, Sunil 200, Tara 1,750, Uma 1,200 + 1,000 = 2,200 ⇒ 2.""",
   "Only the bonus winners exceed 500 here.",
   "Compute each person's commission.",
   "Counting Ravi (₹450 is not more than ₹500).",
   "Strict vs non-strict comparisons matter.")

# =====================================================================
# D20  Hybrid: arrangement + table
# =====================================================================
RES = dict(M="Mehta", N="Nair", O="Oberoi", P="Pillai", Q="Qureshi")


def solve20():
    sols = []
    for fl in permutations(range(1, 6)):
        f = dict(zip("MNOPQ", fl))
        for mem in permutations(range(1, 6)):
            m = dict(zip("MNOPQ", mem))
            on3 = [k for k in f if f[k] == 3][0]
            if (f['O'] == f['N'] + 2 and m['O'] == m['N'] + 2 and f['Q'] in (1, 5) and m['Q'] == 1
                    and f['P'] < f['M'] and m['M'] > m['P'] and m[on3] == 5 and f['N'] != 1):
                sols.append((f, m))
    f, m = unique(sols, "D20")
    charge = lambda k, per_floor=200, per_mem=300: 1000 + per_floor * f[k] + per_mem * m[k]
    ch = {k: charge(k) for k in f}
    top = max(ch, key=ch.get)
    return {1: RES[[k for k in f if f[k] == 4][0]], 2: m['P'], 3: RES[top], 4: sum(ch.values()),
            5: sum(1 for k in f if charge(k, per_floor=300) > 2500)}


add_set("D20", S, "Hybrid Sets", "Arrangement + table", "Five families, five floors", """
Five families — Mehta, Nair, Oberoi, Pillai and Qureshi — live in a five-storey building, one family per floor (floors 1 to 5, with floor 1 at the bottom). The five families have 1, 2, 3, 4 and 5 members, one number each.

1. The Oberois live two floors above the Nairs, and have two more members than the Nairs.
2. The Qureshis live on either the top or the bottom floor, and theirs is a one-member household.
3. The Pillais live on a lower floor than the Mehtas, and have fewer members than the Mehtas.
4. The family on floor 3 has 5 members.
5. The Nairs do not live on floor 1.

Monthly maintenance charge for a family = ₹1,000 + ₹200 × (floor number) + ₹300 × (number of members).
""", solver=solve20)

T, SUB = "Hybrid Sets", "Arrangement + table"
dq("D20", T, SUB, "H", 180, "Which family lives on floor 4?", 2,
   """Clue 1 and 5: Nair on 2 or 3 with Oberoi on 4 or 5.
   If Nair = 3, Oberoi = 5 and Qureshi = 1; the floor-3 family (Nair) has 5 members, so Oberoi would need 7 ✗.
   So Nair = 2, Oberoi = 4, and Mehta/Pillai/Qureshi take floors 1, 3, 5.
   Floor 3 has 5 members; it can't be Qureshi (1 member) or Pillai (fewer than Mehta) ⇒ Mehta on 3, so Pillai on 1 and Qureshi on 5.
   Members: Qureshi 1, Mehta 5; Nair and Oberoi differ by 2 from {2, 3, 4} ⇒ Nair 2, Oberoi 4; Pillai 3.
   Floor 4: Oberoi.""",
   "Case on Nair's floor; the member clue kills one case immediately.",
   "Nair can only be on floor 2 or 3.",
   "Ignoring the member-count half of clue 1.",
   "Two-attribute clues give double leverage — use both halves.",
   options=["Mehta", "Nair", "Oberoi", "Pillai"])
dq("D20", T, SUB, "E", 30, "How many members does the Pillai family have?", "3",
   """Pillai = 3 (the remaining number after Qureshi 1, Nair 2, Oberoi 4, Mehta 5).""",
   "Last remaining value.",
   "Use elimination.",
   "Mixing floor numbers with member counts (answering 1).",
   "Keep separate rows for each attribute.")
dq("D20", T, SUB, "M", 75, "Which family pays the highest monthly maintenance charge?", 0,
   """Charges: Pillai 1,000 + 200 + 900 = 2,100; Nair 1,000 + 400 + 600 = 2,000; Mehta 1,000 + 600 + 1,500 = 3,100; Oberoi 1,000 + 800 + 1,200 = 3,000; Qureshi 1,000 + 1,000 + 300 = 2,300.
   Highest: Mehta.""",
   "Compare 200 × floor + 300 × members only.",
   "Members are weighted more than floors.",
   "Choosing Qureshi for being on the top floor.",
   "Drop common constants when comparing.",
   options=["Mehta", "Oberoi", "Qureshi", "Nair"])
dq("D20", T, SUB, "M", 60, "What is the total monthly maintenance collected from all five families (in ₹)?", "12500",
   """2,100 + 2,000 + 3,100 + 3,000 + 2,300 = 12,500.
   Check: 5 × 1,000 + 200 × 15 + 300 × 15 = 5,000 + 3,000 + 4,500 = 12,500.""",
   "Floors and members each sum to 15.",
   "Use the sums of floors and members.",
   "Arithmetic slips; the shortcut avoids them.",
   "Totals of linear rules can use aggregate sums.")
dq("D20", T, SUB, "M", 75,
   "If the per-floor rate were ₹300 instead of ₹200 (all else unchanged), how many families would pay more than ₹2,500 a month?", "3",
   """New charges: Pillai 2,200; Nair 2,200; Mehta 3,400; Oberoi 3,400; Qureshi 2,800.
   More than 2,500: Mehta, Oberoi, Qureshi ⇒ 3.""",
   "Each charge rises by 100 × floor.",
   "Add 100 × floor number to each old charge.",
   "Adding a flat ₹100 to every family.",
   "Rate changes scale with the variable they multiply.")
