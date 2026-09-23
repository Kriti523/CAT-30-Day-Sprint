"""DILR sets 11-15: missing-value table, ratings table, bar chart, pie chart,
percentage caselet."""
from fractions import Fraction as F
from itertools import product
from common import add, add_set, table
from dilr_1 import dq, unique

S = "DILR"

# =====================================================================
# D11  Table with missing values
# =====================================================================
FULL11 = {"W": [40, 45, 50, 55], "X": [30, 35, 25, 40], "Y": [25, 30, 35, 45], "Z": [50, 40, 45, 30]}
HIDDEN11 = [("W", 2), ("W", 3), ("X", 1), ("X", 3), ("Y", 0), ("Z", 3)]
ROWT = {k: sum(v) for k, v in FULL11.items()}
COLT = [sum(FULL11[k][i] for k in FULL11) for i in range(4)]


def solve11():
    # Complete search over all non-negative integers: each row total fixes one
    # hidden cell per row, so loop over the remaining free cell in W and X.
    sols = []
    for w3, x2 in product(range(0, ROWT["W"] + 1), range(0, ROWT["X"] + 1)):
        t = {k: list(v) for k, v in FULL11.items()}
        t["W"][2] = w3
        t["W"][3] = ROWT["W"] - (t["W"][0] + t["W"][1] + w3)
        t["X"][1] = x2
        t["X"][3] = ROWT["X"] - (t["X"][0] + x2 + t["X"][2])
        t["Y"][0] = ROWT["Y"] - sum(t["Y"][1:])
        t["Z"][3] = ROWT["Z"] - sum(t["Z"][:3])
        if min(min(r) for r in t.values()) < 0:
            continue
        if any(sum(t[k]) != ROWT[k] for k in t):
            continue
        if any(sum(t[k][i] for k in t) != COLT[i] for i in range(4)):
            continue
        w = t["W"]
        if not (w[1] - w[0] == w[2] - w[1] == w[3] - w[2]):
            continue
        if t["X"][3] != t["X"][1] + 5:
            continue
        if F(t["Y"][0]) != F(t["Z"][0], 2):
            continue
        sols.append(t)
    t = unique(sols, "D11")
    q = ["Q1", "Q2", "Q3", "Q4"]
    best_q = q[max(range(4), key=lambda i: sum(t[k][i] for k in t))]
    inc = {k: F(t[k][3] - t[k][0], t[k][0]) for k in t}
    best_p = max(inc, key=inc.get)
    price = dict(W=200, X=300, Y=250, Z=150)
    rev = {k: sum(t[k]) * price[k] for k in t}
    return {1: t["W"][3], 2: best_q, 3: best_p,
            4: sum(1 for i in range(4) if t["X"][i] > t["Y"][i]), 5: max(rev, key=rev.get)}


def shown11():
    rows = []
    for k, v in FULL11.items():
        cells = ["?" if (k, i) in HIDDEN11 else v[i] for i in range(4)]
        rows.append([k] + cells + [ROWT[k]])
    rows.append(["Total"] + COLT + [sum(COLT)])
    return rows


add_set("D11", S, "Tables", "Table with missing values", "Quarterly unit sales", """
The table shows the number of units of four products (W, X, Y and Z) sold by a company in the four quarters of a year, with row and column totals. Some entries are missing (marked ?). The following is also known:

1. W's sales increased by the same number of units from each quarter to the next.
2. X's sales in Q4 were 5 units more than its sales in Q2.
3. Y's sales in Q1 were exactly half of Z's sales in Q1.
""", tables=[table("Units sold", ["Product", "Q1", "Q2", "Q3", "Q4", "Total"], shown11())], solver=solve11)

T, SUB = "Tables", "Table with missing values"
dq("D11", T, SUB, "M", 120, "How many units of W were sold in Q4?", "55",
   """W: Q1 = 40, Q2 = 45 ⇒ constant increase of 5 (clue 1) ⇒ Q3 = 50, Q4 = 55.
   Check: 40 + 45 + 50 + 55 = 190 = W's total ✓.""",
   "Constant increments ⇒ arithmetic progression.",
   "Use clue 1 with Q1 and Q2.",
   "Using the total to split the remainder equally (52.5 each).",
   "Always verify filled values against the row total.")
dq("D11", T, SUB, "M", 90, "In which quarter were the combined sales of all four products the highest?", 3,
   """Column totals: Q1 145, Q2 150, Q3 155, Q4 170 ⇒ Q4.""",
   "Column totals are given directly.",
   "Read the Total row.",
   "Filling cells before checking whether the given totals already answer the question.",
   "Check whether a question needs the missing cells at all.",
   options=["Q1", "Q2", "Q3", "Q4"])
dq("D11", T, SUB, "M", 120, "Which product had the highest percentage increase in sales from Q1 to Q4?", 2,
   """Fill the table: X Q2 = 150 − 45 − 30 − 40 = 35, X Q4 = 40 (clue 2), X Q3 = 130 − 30 − 35 − 40 = 25.
   Y Q1 = 50/2 = 25 (clue 3); Z Q4 = 170 − 55 − 40 − 45 = 30.
   Q1→Q4 change: W 40→55 (+37.5%), X 30→40 (+33.3%), Y 25→45 (+80%), Z 50→30 (−40%). Highest: Y.""",
   "Compare ratios Q4/Q1: 1.375, 1.33, 1.8, 0.6.",
   "You need Y's Q1 and Z's Q4.",
   "Comparing absolute increases (W +15, Y +20 still gives Y, but X/W comparisons often flip).",
   "Percentage change: always divide by the base value.",
   options=["W", "X", "Y", "Z"])
dq("D11", T, SUB, "E", 60, "In how many quarters did X sell more units than Y?", "2",
   """X: 30, 35, 25, 40. Y: 25, 30, 35, 45. X > Y in Q1 and Q2 ⇒ 2.""",
   "Compare the two completed rows.",
   "Fill X Q2, X Q4 and Y Q1 first.",
   "Counting ties or reversing the comparison.",
   "Pairwise row comparisons are quick once the table is complete.")
dq("D11", T, SUB, "M", 90,
   "The company earns ₹200 per unit of W, ₹300 per unit of X, ₹250 per unit of Y and ₹150 per unit of Z. Which product earned the highest annual revenue?", 1,
   """W 190 × 200 = 38,000; X 130 × 300 = 39,000; Y 135 × 250 = 33,750; Z 165 × 150 = 24,750 ⇒ X.""",
   "Use row totals × price.",
   "Row totals are given.",
   "Picking W or Z for having the most units.",
   "Revenue = volume × price; high volume ≠ high revenue.",
   options=["W", "X", "Y", "Z"])

# =====================================================================
# D12  Ratings table
# =====================================================================
SC = {"Anu": [8, 7, 9, 6, 8], "Bala": [9, 9, 5, 7, 8], "Cyrus": [6, 8, 8, 9, 7],
      "Dia": [7, 6, 9, 9, 10], "Ehsan": [8, 8, 7, 8, 5]}


def trimmed(xs):
    s = sorted(xs)
    return sum(s[1:-1])


def solve12():
    t = {k: trimmed(v) for k, v in SC.items()}
    best = max(t.values())
    win = [k for k in t if t[k] == best]
    low = min(t.values())
    wo3 = {k: trimmed(v[:2] + v[3:]) for k, v in SC.items()}
    b3 = max(wo3.values()); w3 = [k for k in wo3 if wo3[k] == b3]
    jt = [sum(SC[k][j] for k in SC) for j in range(5)]
    jbest = [f"J{j + 1}" for j in range(5) if jt[j] == max(jt)]
    assert len(win) == len(w3) == len(jbest) == 1
    x = next(x for x in range(1, 11) if trimmed([9, 9, x, 7, 8]) > max(t[k] for k in t if k != "Bala"))
    return {1: win[0], 2: sum(1 for k in t if t[k] == low), 3: w3[0], 4: jbest[0], 5: x}


add_set("D12", S, "Tables", "Ratings and scoring rules", "Five judges, five finalists", """
Five judges (J1 to J5) scored five finalists of a debate on a scale of 1 to 10. A finalist's final score is obtained by dropping one highest and one lowest of the five scores she or he received and adding the remaining three. (If the highest or lowest score appears more than once, only one copy is dropped.)
""", tables=[table("Scores", ["Finalist", "J1", "J2", "J3", "J4", "J5"], [[k] + v for k, v in SC.items()])], solver=solve12)

T, SUB = "Tables", "Ratings and scoring rules"
dq("D12", T, SUB, "M", 90, "Who has the highest final score?", 3,
   """Final scores: Anu 7+8+8 = 23; Bala 7+8+9 = 24; Cyrus 7+8+8 = 23; Dia 7+9+9 = 25; Ehsan 7+8+8 = 23.
   Highest: Dia (25).""",
   "Sum of all five − max − min.",
   "Drop exactly one max and one min.",
   "Dropping both 9s for Bala (duplicates) — only one copy is dropped.",
   "Trimmed sum = total − max − min.",
   options=["Anu", "Bala", "Cyrus", "Dia"])
dq("D12", T, SUB, "E", 45, "How many finalists share the lowest final score?", "3",
   """Anu, Cyrus and Ehsan all have 23 ⇒ 3.""",
   "Use totals: Anu 38 − 9 − 6, Cyrus 38 − 9 − 6, Ehsan 36 − 8 − 5.",
   "Compute all five trimmed sums.",
   "Using averages of all five scores instead of trimmed sums.",
   "Rule-based scoring: apply the rule exactly as stated.")
dq("D12", T, SUB, "H", 120,
   "Suppose J3's scores are disregarded completely and each final score is computed from the remaining four judges by dropping one highest and one lowest and adding the other two. Who would then have the highest final score?", 1,
   """Without J3: Anu 8,7,6,8 → 7+8 = 15; Bala 9,9,7,8 → 8+9 = 17; Cyrus 6,8,9,7 → 7+8 = 15; Dia 7,6,9,10 → 7+9 = 16; Ehsan 8,8,8,5 → 8+8 = 16.
   Highest: Bala (17).""",
   "Recompute the middle two of four for each finalist.",
   "J3 gave Bala the lowest score (5).",
   "Keeping Dia as the winner without recomputing.",
   "Changing the panel can reverse rankings — recompute, don't adjust.",
   options=["Dia", "Bala", "Ehsan", "Anu"])
dq("D12", T, SUB, "M", 60, "Which judge gave the highest total score across all five finalists?", 3,
   """Judge totals: J1 38, J2 38, J3 38, J4 39, J5 38 ⇒ J4.""",
   "Column sums.",
   "Add each column.",
   "Picking J5 because of the single 10.",
   "Column totals reveal judge leniency.",
   options=["J1", "J2", "J3", "J4"])
dq("D12", T, SUB, "H", 120,
   "If only Bala's score from J3 could be changed (from 5 to some other whole number from 1 to 10), what is the minimum value it must be changed to so that Bala has the highest final score outright?", "9",
   """Bala needs a trimmed sum above Dia's 25.
   J3 = 6 or 7: middle three stay 7, 8, 9 ⇒ 24. J3 = 8: 8+8+9 = 25 (tie). J3 = 9: scores 7,8,9,9,9 ⇒ 8+9+9 = 26 ✓.
   Minimum = 9.""",
   "Raising a low score only helps once it enters the middle three.",
   "Try values from 6 upwards.",
   "Answering 8 (that only ties with Dia).",
   "Outright winner means strictly greater.")

# =====================================================================
# D13  Bar chart
# =====================================================================
YEARS = [2019, 2020, 2021, 2022, 2023, 2024]
REV = [120, 100, 140, 160, 150, 200]
EXP = [100, 95, 110, 120, 135, 155]


def solve13():
    prof = [r - e for r, e in zip(REV, EXP)]
    margin = [F(p, r) for p, r in zip(prof, REV)]
    m = max(margin); assert margin.count(m) == 1
    g = [F(REV[i] - REV[i - 1], REV[i - 1]) for i in range(1, 6)]
    gm = max(g); assert g.count(gm) == 1
    faster = sum(1 for i in range(1, 6) if F(EXP[i] - EXP[i - 1], EXP[i - 1]) > F(REV[i] - REV[i - 1], REV[i - 1]))
    return {1: str(YEARS[margin.index(m)]), 2: str(YEARS[g.index(gm) + 1]), 3: sum(prof), 4: faster,
            5: REV[-1] + (REV[-1] - REV[-2]) - EXP[-1]}


add_set("D13", S, "Charts", "Bar chart", "Revenue vs expenses, 2019–2024", """
The bar chart shows the annual revenue and total expenses (in ₹ crore) of a company from 2019 to 2024. Profit = Revenue − Expenses. Profit margin = Profit ÷ Revenue.
""", chart={"type": "bar", "title": "Revenue and expenses (₹ crore)", "labels": [str(y) for y in YEARS],
            "series": [{"name": "Revenue", "values": REV}, {"name": "Expenses", "values": EXP}]},
        tables=[table("Data behind the chart (₹ crore)", ["Year"] + [str(y) for y in YEARS],
                      [["Revenue"] + REV, ["Expenses"] + EXP])], solver=solve13)

T, SUB = "Charts", "Bar chart"
dq("D13", T, SUB, "M", 90, "In which year was the profit margin the highest?", 2,
   """Profits: 20, 5, 30, 40, 15, 45. Margins: 16.7%, 5%, 21.4%, 25%, 10%, 22.5% ⇒ 2022.""",
   "Compare profit/revenue; 40/160 = 1/4 beats 45/200 = 0.225.",
   "Margin, not absolute profit.",
   "Choosing 2024 (highest absolute profit).",
   "Absolute vs relative: read what the question measures.",
   options=["2021", "2024", "2022", "2019"])
dq("D13", T, SUB, "M", 75, "In which year did revenue grow the fastest (in percentage terms) over the previous year?", 0,
   """Growth: 2020 −16.7%, 2021 +40%, 2022 +14.3%, 2023 −6.25%, 2024 +33.3% ⇒ 2021.""",
   "40/100 vs 50/150: 40% beats 33%.",
   "Divide the change by the previous year's value.",
   "Choosing 2024 for the largest absolute jump (+50).",
   "Low base years inflate percentage growth.",
   options=["2021", "2024", "2022", "2023"])
dq("D13", T, SUB, "E", 45, "What was the company's total profit (in ₹ crore) over the six years?", "155",
   """20 + 5 + 30 + 40 + 15 + 45 = 155.""",
   "Total revenue 870 − total expenses 715 = 155.",
   "Sum the yearly profits.",
   "Arithmetic slips; cross-check with total revenue − total expenses.",
   "Σ(R − E) = ΣR − ΣE.")
dq("D13", T, SUB, "H", 120,
   "In how many of the years 2020–2024 did expenses grow at a higher percentage rate than revenue (compared with the previous year)?", "2",
   """2020: revenue −16.7%, expenses −5% ⇒ expenses 'grew' faster (a smaller fall) ✓.
   2021: +40% vs +15.8% ✗. 2022: +14.3% vs +9.1% ✗. 2023: −6.25% vs +12.5% ✓. 2024: +33.3% vs +14.8% ✗.
   Answer: 2.""",
   "A smaller fall counts as higher growth (−5% > −16.7%).",
   "Compare signed growth rates.",
   "Ignoring 2020 because both figures fell.",
   "Signed comparisons: −5% is greater than −16.7%.")
dq("D13", T, SUB, "M", 60,
   "Suppose that in 2025 revenue increases by the same absolute amount as it did in 2024, while expenses remain at the 2024 level. What will the 2025 profit be (in ₹ crore)?", "95",
   """2024 revenue increase = 200 − 150 = 50 ⇒ 2025 revenue = 250.
   Expenses = 155 ⇒ profit = 95.""",
   "Absolute increase, not percentage.",
   "Revenue rose by 50 in 2024.",
   "Using 33.3% growth (revenue 266.7).",
   "'Same amount' = absolute; 'same rate' = percentage.")

# =====================================================================
# D14  Pie charts
# =====================================================================
CH = ["TV", "Digital", "Print", "Radio", "Events"]
P23 = [30, 35, 15, 10, 10]
P24 = [24, 44, 10, 8, 14]
TOT23, TOT24 = 40, 50


def solve14():
    a23 = [F(p * TOT23, 100) for p in P23]
    a24 = [F(p * TOT24, 100) for p in P24]
    unchanged = sum(1 for x, y in zip(a23, a24) if x == y)
    dig = F(a24[1] - a23[1], a23[1]) * 100
    inc = [F(y - x, x) for x, y in zip(a23, a24)]
    best = CH[inc.index(max(inc))]
    share = F(a23[2] + a23[3] + a24[2] + a24[3], TOT23 + TOT24) * 100
    tv25 = F(a24[0], TOT24 * F(12, 10)) * 100
    return {1: unchanged, 2: f"{float(dig):.1f}%", 3: best, 4: f"{float(share):.1f}%", 5: tv25}


add_set("D14", S, "Charts", "Pie charts", "Marketing budget mix", """
The two pie charts show how a company split its marketing budget across five channels in 2023 and 2024. The total budget was ₹40 lakh in 2023 and ₹50 lakh in 2024. Percentages are of that year's total budget.
""", chart={"type": "pie", "title": "Share of marketing budget (%)", "labels": CH,
            "series": [{"name": "2023 (₹40 lakh)", "values": P23}, {"name": "2024 (₹50 lakh)", "values": P24}]},
        tables=[table("Data behind the charts (% of budget)", ["Channel"] + CH, [["2023"] + P23, ["2024"] + P24])],
        solver=solve14)

T, SUB = "Charts", "Pie charts"
dq("D14", T, SUB, "M", 75, "For how many channels did the spending in rupees stay exactly the same from 2023 to 2024?", "2",
   """2023 (₹ lakh): TV 12, Digital 14, Print 6, Radio 4, Events 4.
   2024: TV 12, Digital 22, Print 5, Radio 4, Events 7.
   Unchanged: TV and Radio ⇒ 2.""",
   "Convert percentages to rupees before comparing.",
   "Shares fell for TV and Radio, but the budget grew.",
   "Comparing percentages directly (none unchanged).",
   "Pie charts with different totals: compare amounts, not shares.")
dq("D14", T, SUB, "M", 60, "By what percentage did spending on Digital increase from 2023 to 2024?", 1,
   """14 → 22 lakh ⇒ increase 8/14 = 57.1%.""",
   "8/14 = 4/7 ≈ 57%.",
   "Convert both shares to rupees.",
   "Using share change 35 → 44 (25.7%).",
   "Share growth ≠ amount growth when totals differ.",
   options=["25.7%", "57.1%", "36.4%", "9.0%"])
dq("D14", T, SUB, "M", 60, "Which channel had the largest percentage increase in spending (in rupees)?", 3,
   """TV 0%, Digital +57.1%, Print −16.7%, Radio 0%, Events 4 → 7 = +75% ⇒ Events.""",
   "Small bases grow fastest: 4 → 7.",
   "Compute each channel's rupee change.",
   "Picking Digital for the biggest absolute rise.",
   "Percentage leaders often have small bases.",
   options=["Digital", "TV", "Print", "Events"])
dq("D14", T, SUB, "M", 75, "What percentage of the combined two-year budget was spent on Print and Radio together?", 0,
   """Print + Radio = (6 + 4) + (5 + 4) = 19 lakh out of 90 lakh = 21.1%.""",
   "Sum amounts over both years, then divide by 90.",
   "Combined budget = 40 + 50.",
   "Averaging the two years' shares (21.5%).",
   "Averages of percentages need weights.",
   options=["21.1%", "21.5%", "20.0%", "22.5%"])
dq("D14", T, SUB, "H", 90,
   "In 2025 the total budget is 20% higher than in 2024 and TV spending in rupees is the same as in 2024. What is TV's share (in %) of the 2025 budget?", "20",
   """2025 budget = 50 × 1.2 = 60 lakh. TV = 12 lakh ⇒ 12/60 = 20%.""",
   "Share = constant amount ÷ new total.",
   "TV spent 12 lakh in 2024.",
   "Keeping the share at 24%.",
   "Constant amount + growing total ⇒ falling share.")

# =====================================================================
# D15  Percentage caselet
# =====================================================================
DEPT = {"Sales": (30, 25), "Tech": (40, 35), "Ops": (20, 50), "HR": (10, 60)}  # (% of staff, % women)
STAFF = 800


def solve15():
    n = {d: STAFF * p // 100 for d, (p, _) in DEPT.items()}
    w = {d: F(n[d] * DEPT[d][1], 100) for d in DEPT}
    men_ts = (n["Tech"] - w["Tech"]) + (n["Sales"] - w["Sales"])
    pct = F(men_ts, n["Tech"] + n["Sales"]) * 100
    sales_new = F(w["Sales"] + 40, n["Sales"] + 40) * 100
    leave = n["Tech"] - w["Tech"] / F(40, 100)
    return {1: sum(w.values()), 2: max(w, key=w.get), 3: f"{float(pct):.1f}%", 4: f"{float(sales_new):.1f}%", 5: leave}


add_set("D15", S, "Caselets", "Percentage caselet", "Who works where", """
A firm has 800 employees in four departments. Sales has 30% of the employees, Tech 40%, Operations (Ops) 20% and HR the remaining 10%.

Women make up 25% of Sales, 35% of Tech, 50% of Ops and 60% of HR. Every employee belongs to exactly one department.
""", solver=solve15)

T, SUB = "Caselets", "Percentage caselet"
dq("D15", T, SUB, "E", 90, "How many women work in the firm?", "300",
   """Department sizes: Sales 240, Tech 320, Ops 160, HR 80.
   Women: 60 + 112 + 80 + 48 = 300.""",
   "Build a small table: size × women %.",
   "Convert percentages to headcounts first.",
   "Averaging the four percentages (42.5% ⇒ 340).",
   "Weighted, not simple, averages for combined groups.")
dq("D15", T, SUB, "E", 30, "Which department has the largest number of women?", 1,
   """Women: Sales 60, Tech 112, Ops 80, HR 48 ⇒ Tech.""",
   "Headcount, not percentage.",
   "Compare numbers, not rates.",
   "Choosing HR (highest percentage).",
   "Rate leaders are not always count leaders.",
   options=["HR", "Tech", "Ops", "Sales"])
dq("D15", T, SUB, "M", 60, "What percentage of the employees in Sales and Tech combined are men?", 2,
   """Men: Sales 180, Tech 208 ⇒ 388 of 560 = 69.3%.""",
   "388/560 ≈ 0.693.",
   "Combine counts, not percentages.",
   "Averaging 75% and 65% (70%).",
   "Combined % = combined count ÷ combined base.",
   options=["70.0%", "65.0%", "69.3%", "71.4%"])
dq("D15", T, SUB, "M", 60, "If 40 new women join Sales and nobody leaves, what percentage of Sales will be women?", 0,
   """Women 60 + 40 = 100; Sales 240 + 40 = 280 ⇒ 35.7%.""",
   "Both numerator and denominator rise by 40.",
   "The department size grows too.",
   "Using 100/240 = 41.7% (forgetting the base grows).",
   "Additions change the base.",
   options=["35.7%", "41.7%", "40.0%", "33.3%"])
dq("D15", T, SUB, "H", 75, "How many men must leave Tech (with no one joining) so that women make up exactly 40% of Tech?", "40",
   """Women in Tech = 112 (unchanged). For 40%, Tech size = 112/0.4 = 280.
   Men must fall from 208 to 168 ⇒ 40 leave.""",
   "Fix the unchanged group and solve for the new total.",
   "The number of women stays 112.",
   "Computing 5% of 320 (16), treating a percentage-point change as proportional.",
   "Hold the constant group fixed; rescale the total.")
