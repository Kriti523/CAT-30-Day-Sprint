"""DILR sets 1-5: linear arrangement, circular arrangement, scheduling (x2),
distribution. Every set has a brute-force solver that re-derives the answers
from the clues exactly as stated in the set text."""
from itertools import permutations, product
from common import add, add_set, table

S = "DILR"


def dq(set_id, topic, sub, diff, secs, text, answer, solution, fast, hint,
       trap, note, options=None):
    return add(S, topic, sub, diff, secs, text, answer, solution, fast, hint,
               trap, note, options=options, set_id=set_id)


def unique(sols, name):
    if len(sols) != 1:
        raise AssertionError(f"{name}: expected 1 solution, found {len(sols)}")
    return sols[0]


# =====================================================================
# D01  Linear arrangement
# =====================================================================
NAMES1 = dict(A="Arun", B="Bela", C="Chirag", D="Divya", E="Esha", F="Farhan", G="Gopal")


def clues1(s, drop=None):
    c = {
        1: s['E'] in (1, 7),
        2: abs(s['A'] - s['F']) == 3,
        3: s['B'] == s['D'] + 1,
        4: abs(s['G'] - s['E']) != 1,
        5: s['A'] % 2 == 0 and s['C'] < s['A'],
        6: s['F'] not in (1, 7),
        7: s['G'] < s['F'],
        8: s['C'] not in (1, 7),
    }
    return all(v for k, v in c.items() if k != drop)


def all1(drop=None):
    out = []
    for perm in permutations("ABCDEFG"):
        s = {p: i + 1 for i, p in enumerate(perm)}
        if clues1(s, drop):
            out.append(s)
    return out


def solve1():
    s = unique(all1(), "D01")
    at = {v: k for k, v in s.items()}
    mid = (s['F'] + s['E']) // 2 if (s['F'] + s['E']) % 2 == 0 else None
    return {
        1: NAMES1[at[4]],
        2: abs(s['C'] - s['B']) - 1,
        3: NAMES1[at[s['A'] - 1]],
        4: len(all1(drop=7)),
        5: NAMES1[at[mid]],
    }


add_set("D01", S, "Arrangements", "Linear arrangement", "Seven colleagues in a row", """
Seven colleagues — Arun, Bela, Chirag, Divya, Esha, Farhan and Gopal — sit in a single row of seven seats numbered 1 to 7 from left to right. All of them face the same direction, so "to the right of" means a higher seat number. The following is known:

1. Esha sits at one of the two ends of the row.
2. Exactly two people sit between Arun and Farhan.
3. Bela sits immediately to the right of Divya.
4. Gopal does not sit next to Esha.
5. Arun sits in an even-numbered seat, somewhere to the right of Chirag.
6. Farhan does not sit at either end of the row.
7. Gopal sits somewhere to the left of Farhan.
8. Chirag does not sit at either end of the row.
""", solver=solve1)

T, SUB = "Arrangements", "Linear arrangement"
dq("D01", T, SUB, "M", 150, "Who sits in seat 4?", 0,
   """Clue 5 puts Arun in seat 2, 4 or 6; clue 2 puts Farhan three seats away, and clue 6 keeps Farhan off the ends.
   Testing Esha at seat 7 (clue 1) with Arun at 6 forces Farhan to 3; Divya–Bela then need two adjacent free seats to the right of Farhan: seats 4–5.
   Gopal must be left of Farhan (clue 7) and Chirag off the ends (clue 8) ⇒ Gopal 1, Chirag 2.
   Final order (1→7): Gopal, Chirag, Farhan, Divya, Bela, Arun, Esha. Every other placement of Esha/Arun breaks a clue.
   Seat 4: Divya.""",
   "Start from the most restrictive pair (Arun–Farhan with a gap of 2 and Arun in an even seat), then place the Divya–Bela block.",
   "Fix Esha at an end, then try the three possible seats for Arun.",
   "Treating 'exactly two people between' as a gap of 2 seats instead of 3.",
   "Blocks (like Divya–Bela) and fixed gaps are the anchors in linear arrangements.",
   options=["Divya", "Farhan", "Bela", "Chirag"])
dq("D01", T, SUB, "E", 45, "How many people sit between Chirag and Bela?", "2",
   """Chirag is in seat 2 and Bela in seat 5.
   Seats 3 and 4 lie between them ⇒ 2 people.""",
   "People between = |difference of seats| − 1.",
   "Use the final arrangement.",
   "Reporting the seat difference (3).",
   "Between-count = gap − 1.")
dq("D01", T, SUB, "E", 30, "Who sits immediately to the left of Arun?", 0,
   """Arun is in seat 6; the person in seat 5 is Bela.""",
   "Left = one seat lower.",
   "Arun is in seat 6.",
   "Reading 'left' as the higher seat number.",
   "Define directions before solving; the set text does it for you.",
   options=["Bela", "Divya", "Esha", "Farhan"])
dq("D01", T, SUB, "H", 150,
   "If clue 7 (Gopal sits somewhere to the left of Farhan) is dropped, how many different seating arrangements satisfy all the remaining clues?",
   "4",
   """Without clue 7, the valid orders are:
   G C F D B A E, D B F C G A E, D B F G C A E, E C F D B A G (and C G F D B A E, which clue 8 removes because Chirag is at an end).
   Count = 4.""",
   "List the cases systematically by Esha's end and Arun's seat.",
   "Keep clue 8 in force while counting.",
   "Forgetting clue 8 and counting 5.",
   "'If a clue is removed' questions: recount every case, don't just flip one.")
dq("D01", T, SUB, "M", 45, "Who sits exactly midway between Farhan and Esha?", 1,
   """Farhan is in seat 3, Esha in seat 7 ⇒ midpoint seat 5 = Bela.""",
   "Midpoint seat = average of the two seat numbers.",
   "Average the seat numbers.",
   "Choosing Divya (seat 4), which is nearer to Farhan.",
   "Midway exists only when the seat numbers have the same parity.",
   options=["Divya", "Bela", "Arun", "Gopal"])

# =====================================================================
# D02  Circular arrangement (facing centre)
# =====================================================================
NAMES2 = dict(K="Kavya", L="Leela", M="Manav", N="Nikhil", O="Omkar", P="Priya", R="Rohan", S="Sana")


def solve2():
    d = lambda a, b: (a - b) % 8
    adj = lambda a, b: d(a, b) in (1, 7)
    sols = []
    for perm in permutations("LMNOPRS"):
        s = {'K': 0}
        for i, p in enumerate(perm):
            s[p] = i + 1
        if (s['P'] == (s['K'] + 2) % 8 and d(s['R'], s['P']) == 4 and adj(s['M'], s['R'])
                and not adj(s['S'], s['K']) and s['N'] == (s['M'] - 3) % 8
                and adj(s['L'], s['P']) and s['O'] == (s['P'] + 1) % 8):
            sols.append(s)
    s = unique(sols, "D02")
    at = {v: k for k, v in s.items()}
    between = (s['R'] - s['L']) % 8 - 1
    pairs = {"Manav and Kavya": ('M', 'K'), "Leela and Omkar": ('L', 'O'),
             "Priya and Sana": ('P', 'S'), "Rohan and Nikhil": ('R', 'N')}
    adjp = [k for k, (a, b) in pairs.items() if adj(s[a], s[b])]
    assert len(adjp) == 1
    # swap K and S
    s2 = dict(s); s2['K'], s2['S'] = s['S'], s['K']
    at2 = {v: k for k, v in s2.items()}
    return {1: NAMES2[at[(s['K'] + 4) % 8]], 2: NAMES2[at[(s['S'] - 2) % 8]],
            3: between, 4: adjp[0], 5: NAMES2[at2[(s2['K'] + 1) % 8]]}


add_set("D02", S, "Arrangements", "Circular arrangement", "Eight friends at a round table", """
Eight friends — Kavya, Leela, Manav, Nikhil, Omkar, Priya, Rohan and Sana — sit around a circular table with eight equally spaced seats, all facing the centre. For a person facing the centre, "left" means the next seat in the clockwise direction and "right" means the next seat anticlockwise. "Second to the left" means two seats away clockwise, and so on.

1. Priya sits second to the left of Kavya.
2. Rohan sits directly opposite Priya.
3. Manav is an immediate neighbour of Rohan.
4. Sana is not an immediate neighbour of Kavya.
5. Nikhil sits third to the right of Manav.
6. Leela is an immediate neighbour of Priya.
7. Omkar sits immediately to the left of Priya.
""", solver=solve2)

T, SUB = "Arrangements", "Circular arrangement"
dq("D02", T, SUB, "M", 150, "Who sits directly opposite Kavya?", 2,
   """Number seats clockwise from Kavya (0). Clue 1: Priya = 2. Clue 7: Omkar = 3. Clue 2: Rohan = 6.
   Clue 6: Leela is next to Priya and seat 3 is taken ⇒ Leela = 1.
   Clue 3: Manav is at 5 or 7. If Manav = 5, Nikhil (clue 5, three seats anticlockwise) = 2 — taken. So Manav = 7 and Nikhil = 4.
   Sana takes the last seat, 5 (not adjacent to Kavya ✓).
   Clockwise from Kavya: Kavya, Leela, Priya, Omkar, Nikhil, Sana, Rohan, Manav.
   Opposite Kavya (seat 4): Nikhil.""",
   "Fix Kavya at 0 and convert every clue into a seat offset.",
   "Priya's seat follows directly from clue 1.",
   "Mixing up the left/right convention for people facing the centre.",
   "Circular: fix one person to remove rotations; facing centre ⇒ left = clockwise.",
   options=["Sana", "Omkar", "Nikhil", "Rohan"])
dq("D02", T, SUB, "M", 45, "Who sits second to the right of Sana?", 1,
   """Sana is at seat 5. Second to the right = two seats anticlockwise = seat 3 = Omkar.""",
   "Right = anticlockwise = subtract.",
   "Count two seats anticlockwise from Sana.",
   "Counting clockwise (gives Manav).",
   "Write the direction convention next to your diagram.",
   options=["Manav", "Omkar", "Nikhil", "Priya"])
dq("D02", T, SUB, "M", 45,
   "Counting in the clockwise direction from Leela, how many people sit between Leela and Rohan?",
   "4",
   """Leela = 1, Rohan = 6. Clockwise between them: seats 2, 3, 4, 5 ⇒ 4 people.""",
   "Clockwise gap − 1.",
   "List seats 2 to 5.",
   "Counting anticlockwise (2 people: Kavya, Manav).",
   "In circles always state the direction of counting.")
dq("D02", T, SUB, "E", 45, "Which of the following pairs are immediate neighbours?", 0,
   """Manav (7) and Kavya (0) are adjacent. Leela–Omkar (1, 3), Priya–Sana (2, 5) and Rohan–Nikhil (6, 4) are not.""",
   "Seats 7 and 0 are adjacent in a circle.",
   "Remember the wrap-around.",
   "Forgetting that the last and first seats touch.",
   "Adjacency in circles is modulo n.",
   options=["Manav and Kavya", "Leela and Omkar", "Priya and Sana", "Rohan and Nikhil"])
dq("D02", T, SUB, "H", 75,
   "If Kavya and Sana exchange seats (everyone else stays put), who will sit immediately to the left of Kavya?",
   2,
   """After the swap Kavya is at seat 5. Immediate left = next seat clockwise = 6 = Rohan.""",
   "Only the two swapped seats change; read the neighbour directly.",
   "Kavya moves to Sana's old seat.",
   "Answering Nikhil (that is Kavya's right after the swap).",
   "After swaps, recompute only the affected positions.",
   options=["Nikhil", "Manav", "Rohan", "Sana"])

# =====================================================================
# D03  Scheduling: 6 lectures, 3 days x 2 slots
# =====================================================================
LECT = dict(F="Finance", H="HR", M="Marketing", O="Operations", S="Strategy", T="Tech")
SLOTNAME = ["Monday morning", "Monday afternoon", "Tuesday morning", "Tuesday afternoon",
            "Wednesday morning", "Wednesday afternoon"]


def all3(drop=None):
    day = lambda x: x // 2
    out = []
    for perm in permutations("FHMOST"):
        s = {p: i for i, p in enumerate(perm)}
        c = {1: day(s['S']) > day(s['M']), 2: day(s['F']) != day(s['H']),
             3: s['T'] % 2 == 0, 4: s['O'] == s['T'] + 1, 5: day(s['M']) != 0,
             6: s['H'] % 2 == 0, 7: s['F'] % 2 == 1, 8: day(s['F']) != day(s['S'])}
        if all(v for k, v in c.items() if k != drop):
            out.append(s)
    return out


def solve3():
    s = unique(all3(), "D03")
    at = {v: k for k, v in s.items()}
    same_day_F = [LECT[k] for k in s if k != 'F' and s[k] // 2 == s['F'] // 2]
    return {1: LECT[at[2]], 2: LECT[at[s['S'] - 1]], 3: abs(s['H'] - s['T']) - 1,
            4: len(all3(drop=5)), 5: same_day_F[0]}


add_set("D03", S, "Scheduling", "Day-slot scheduling", "Six guest lectures in three days", """
A college schedules six guest lectures — Finance, HR, Marketing, Operations, Strategy and Tech — over three days (Monday, Tuesday and Wednesday). Each day has two slots, morning and afternoon, and exactly one lecture is held in each slot. On any day the morning slot comes before the afternoon slot.

1. Strategy is held on a later day than Marketing.
2. Finance and HR are held on different days.
3. Tech is held in a morning slot.
4. Operations is held in the slot immediately after Tech.
5. Marketing is not held on Monday.
6. HR is held in a morning slot.
7. Finance is held in an afternoon slot.
8. Finance and Strategy are held on different days.
""", solver=solve3)

T, SUB = "Scheduling", "Day-slot scheduling"
dq("D03", T, SUB, "M", 150, "Which lecture is held on Tuesday morning?", 3,
   """Clues 3 and 4: Tech (morning) and Operations (afternoon) share one day.
   Clue 1 with clue 5: Marketing is on Tuesday and Strategy on Wednesday.
   So Tech–Operations is on Monday.
   HR is a morning lecture (6) and Finance an afternoon one (7), on different days (2); Finance is not with Strategy (8) ⇒ Finance is on Tuesday afternoon, so Marketing is Tuesday morning.
   HR then takes Wednesday morning and Strategy Wednesday afternoon.
   Schedule: Mon – Tech, Operations; Tue – Marketing, Finance; Wed – HR, Strategy.""",
   "Pair up linked lectures (Tech→Operations) first; they occupy a whole day.",
   "Tech and Operations must be on the same day.",
   "Placing Operations on the next day's morning; 'immediately after' stays within the same day because Tech is in the morning.",
   "Block the tightest pair first, then use day-level clues.",
   options=["Finance", "HR", "Strategy", "Marketing"])
dq("D03", T, SUB, "E", 30, "Which lecture is held immediately before Strategy?", 0,
   """Strategy is Wednesday afternoon; Wednesday morning is HR.""",
   "Read off the schedule.",
   "Strategy is the last slot.",
   "Choosing Finance (last slot of the previous day, not immediately before).",
   "'Immediately before' = previous slot.",
   options=["HR", "Finance", "Marketing", "Operations"])
dq("D03", T, SUB, "E", 30, "How many lectures are held between Tech and HR?", "3",
   """Tech = slot 1 (Mon AM), HR = slot 5 (Wed AM). Between: Operations, Marketing, Finance ⇒ 3.""",
   "Slot gap − 1.",
   "Number the slots 1 to 6.",
   "Counting the day gap (2) instead of slots.",
   "Linearise multi-day schedules into numbered slots.")
dq("D03", T, SUB, "H", 120,
   "If clue 5 (Marketing is not held on Monday) is removed, how many different schedules satisfy the remaining clues?",
   "3",
   """Without clue 5 the Tech–Operations block can sit on any day, and Marketing may be on Monday.
   Place the block, then Marketing (earlier day than Strategy), then HR (morning) and Finance (afternoon) on different days, keeping Finance away from Strategy.
   Valid schedules:
   (i) Mon: Tech, Operations | Tue: Marketing, Finance | Wed: HR, Strategy
   (ii) Mon: Marketing, Finance | Tue: Tech, Operations | Wed: HR, Strategy
   (iii) Mon: Marketing, Finance | Tue: HR, Strategy | Wed: Tech, Operations
   Count = 3.""",
   "Enumerate by the day of the Tech–Operations block (3 choices) and fill the rest.",
   "Keep clues 1–4 and 6–8 all active.",
   "Stopping at the first alternative found.",
   "Clue-removal questions need a full re-enumeration.")
dq("D03", T, SUB, "E", 30, "Which lecture is held on the same day as Finance?", 1,
   """Finance is Tuesday afternoon; Tuesday morning is Marketing.""",
   "Read off the schedule.",
   "Finance is on Tuesday.",
   "Choosing Strategy (clue 8 forbids it).",
   "Double-check answers against the 'different day' clues.",
   options=["HR", "Marketing", "Strategy", "Operations"])

# =====================================================================
# D04  Scheduling: project tasks (critical path)
# =====================================================================
TASKS = {  # name: (duration, prerequisites)
    "A": (3, []), "B": (5, []), "C": (4, ["A"]), "D": (6, ["A", "B"]),
    "E": (2, ["C"]), "F": (3, ["D", "E"]), "G": (4, ["B"]), "H": (2, ["F", "G"]),
}


def cpm(tasks):
    order = list(tasks)
    ef = {}
    es = {}
    changed = True
    while len(ef) < len(tasks):
        for t in order:
            if t in ef:
                continue
            d, pre = tasks[t]
            if all(p in ef for p in pre):
                es[t] = max([ef[p] for p in pre], default=0)
                ef[t] = es[t] + d
    total = max(ef.values())
    lf = {}
    for t in reversed(order):
        succ = [u for u in tasks if t in tasks[u][1]]
        lf[t] = min([lf[u] - tasks[u][0] for u in succ], default=total)
    return es, ef, lf, total


def solve4():
    es, ef, lf, total = cpm(TASKS)
    critical = [t for t in TASKS if lf[t] == ef[t]]
    t2 = dict(TASKS); t2["D"] = (8, TASKS["D"][1])
    return {1: total, 2: ef["E"], 3: lf["G"] - ef["G"], 4: f"{cpm(t2)[3]} days",
            5: ", ".join(critical)}


add_set("D04", S, "Scheduling", "Task dependencies (critical path)", "Launching a product in eight tasks", """
A product launch consists of eight tasks, A to H. The table gives each task's duration in working days and the tasks that must be fully completed before it can start. Any number of tasks can run in parallel as long as their prerequisites are complete, and each task, once started, runs without a break. Work starts on day 0; a task of duration d starting at time t finishes at time t + d.
""", tables=[table("Task plan", ["Task", "Duration (days)", "Prerequisites"],
                   [[k, v[0], ", ".join(v[1]) or "—"] for k, v in TASKS.items()])], solver=solve4)

T, SUB = "Scheduling", "Task dependencies (critical path)"
dq("D04", T, SUB, "M", 120, "What is the minimum number of days needed to complete the whole project?", "16",
   """Earliest finish (EF) = max EF of prerequisites + duration.
   A 3, B 5, C 3+4 = 7, D max(3,5)+6 = 11, E 7+2 = 9, F max(11,9)+3 = 14, G 5+4 = 9, H max(14,9)+2 = 16.
   Project length = 16 days.""",
   "Forward pass: carry the latest prerequisite finish.",
   "Compute each task's earliest finish in dependency order.",
   "Adding all durations (29) — tasks run in parallel.",
   "Project length = longest path through the dependency network.")
dq("D04", T, SUB, "E", 45, "What is the earliest time by which task E can be completed?", "9",
   """E needs C, which needs A: 3 + 4 + 2 = 9.""",
   "Follow the chain A → C → E.",
   "E's only chain is A, C, E.",
   "Including D (not a prerequisite of E).",
   "Earliest finish depends only on the task's own ancestors.")
dq("D04", T, SUB, "M", 90,
   "By how many days can task G be delayed (beyond its earliest finish) without delaying the project?",
   "5",
   """G's earliest finish = 9. H must start by 16 − 2 = 14, so G's latest finish = 14.
   Slack = 14 − 9 = 5 days.""",
   "Slack = latest finish − earliest finish.",
   "Work backwards from the project end to find G's latest finish.",
   "Comparing with F's finish (14) and forgetting H's duration, or comparing with E.",
   "Backward pass: LF = min(LS of successors).")
dq("D04", T, SUB, "M", 60, "If task D takes 8 days instead of 6, what is the new minimum project duration?", 2,
   """D: 5 → 13, F: 13 → 16, H: 16 → 18. New duration = 18 days.""",
   "D is on the critical path, so the whole delay passes through.",
   "Is D critical?",
   "Assuming slack absorbs the delay (answering 16).",
   "Delays on critical tasks add one-for-one to the project length.",
   options=["16 days", "17 days", "18 days", "19 days"])
dq("D04", T, SUB, "M", 60, "Which tasks lie on the critical path?", 3,
   """Tasks with zero slack: B (0–5), D (5–11), F (11–14), H (14–16).
   A, C, E and G all have slack.""",
   "Trace back from H through the prerequisite that finished last.",
   "Follow the 'binding' prerequisite at each step.",
   "Choosing A → C → E → F → H (that path totals only 14).",
   "Critical path = chain of zero-slack tasks.",
   options=["A, C, E, F, H", "A, D, F, H", "B, G, H", "B, D, F, H"])

# =====================================================================
# D05  Distribution
# =====================================================================
FR = dict(A="Asha", B="Bhanu", C="Charu", D="Dev", E="Ekta")


def all5(drop=None):
    out = []
    for a, b, c, d in product(range(1, 20), repeat=4):
        e = 20 - a - b - c - d
        if e < 1:
            continue
        s = dict(A=a, B=b, C=c, D=d, E=e)
        if len(set(s.values())) < 5:
            continue
        cl = {1: a == 2 * b, 2: c > d + e, 3: e == min(s.values()), 4: d > b, 5: c % 4 == 0}
        if all(v for k, v in cl.items() if k != drop):
            out.append(s)
    return out


def solve5():
    s = unique(all5(), "D05")
    ranked = sorted(s, key=s.get, reverse=True)
    s2 = dict(s); s2['C'] -= 3; s2['E'] += 3
    mx = max(s2.values())
    top = [FR[k] for k in "ABCDE" if s2[k] == mx]
    return {1: s['C'], 2: FR[ranked[1]], 3: s['D'] - s['B'], 4: len(all5(drop=5)),
            5: " and ".join(top) + (" (tied)" if len(top) > 1 else " only")}


add_set("D05", S, "Distribution", "Numeric distribution", "Twenty chocolates, five friends", """
Twenty identical chocolates are distributed among five friends — Asha, Bhanu, Charu, Dev and Ekta. Every friend gets at least one chocolate, and no two friends get the same number.

1. Asha gets exactly twice as many chocolates as Bhanu.
2. Charu gets more chocolates than Dev and Ekta put together.
3. Ekta gets the fewest chocolates.
4. Dev gets more chocolates than Bhanu.
5. The number of chocolates Charu gets is a multiple of 4.
""", solver=solve5)

T, SUB = "Distribution", "Numeric distribution"
dq("D05", T, SUB, "M", 150, "How many chocolates does Charu get?", "8",
   """Ekta has the fewest, so Ekta = 1 is the natural start; Bhanu ≥ 2 so Asha ≥ 4.
   Try Bhanu = 2, Asha = 4: Charu + Dev = 13 with Dev > 2 and Charu > Dev + 1. Charu a multiple of 4 ⇒ Charu = 8, Dev = 5 ✓ (8 > 6).
   Bhanu = 3, Asha = 6: Charu + Dev = 10, Dev ≥ 4, Charu > Dev + 1 ⇒ Charu = 8 needs Dev = 2 ✗.
   Larger Bhanu leaves too few chocolates. Ekta ≥ 2 also fails.
   Unique: Asha 4, Bhanu 2, Charu 8, Dev 5, Ekta 1.""",
   "Drive the case split by Bhanu's value; Asha follows automatically.",
   "Start with Ekta = 1.",
   "Forgetting that all five numbers must be different.",
   "Distribution sets: case on the most constrained variable.")
dq("D05", T, SUB, "E", 30, "Who gets the second-highest number of chocolates?", 3,
   """Order: Charu 8, Dev 5, Asha 4, Bhanu 2, Ekta 1 ⇒ Dev.""",
   "Sort the final distribution.",
   "Use the solved distribution.",
   "Picking Asha (third).",
   "Rank questions: write the sorted list once.",
   options=["Asha", "Charu", "Bhanu", "Dev"])
dq("D05", T, SUB, "E", 30, "What is the difference between the numbers of chocolates Dev and Bhanu get?", "3",
   """Dev 5 − Bhanu 2 = 3.""",
   "Direct subtraction.",
   "Dev has 5.",
   "Using Asha instead of Bhanu (1).",
   "Read names carefully in similar-looking options.")
dq("D05", T, SUB, "H", 120,
   "If clue 5 (Charu's number is a multiple of 4) is removed, how many distributions satisfy the remaining clues?",
   "2",
   """Without clue 5 the valid distributions are:
   Asha 4, Bhanu 2, Charu 8, Dev 5, Ekta 1 and Asha 4, Bhanu 2, Charu 10, Dev 3, Ekta 1.
   Count = 2.""",
   "Re-run the Bhanu = 2 case without the multiple-of-4 filter.",
   "Only the Bhanu = 2 case survives the other clues.",
   "Forgetting that Dev must exceed Bhanu, which would admit extra cases.",
   "Each clue usually kills specific cases; note which.")
dq("D05", T, SUB, "M", 60,
   "Suppose that after the distribution Charu gives 3 of her chocolates to Ekta. Who then has the largest number of chocolates?", 1,
   """New counts: Charu 5, Ekta 4, Asha 4, Bhanu 2, Dev 5.
   Charu and Dev tie at 5.""",
   "Update just the two changed values.",
   "Recompute Charu and Ekta only.",
   "Answering 'Charu only' without checking Dev.",
   "After transfers, check for ties.",
   options=["Charu only", "Charu and Dev (tied)", "Dev only", "Asha and Ekta (tied)"])
