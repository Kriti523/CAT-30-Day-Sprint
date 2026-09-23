"""DILR sets 6-10: selection, round-robin, knockout, road network, flow network."""
from itertools import combinations, product
from collections import deque
import heapq
from common import add, add_set, table
from dilr_1 import dq, unique

S = "DILR"

# =====================================================================
# D06  Selection / distribution
# =====================================================================
ENG = ["Aarav", "Bhavya", "Chitra", "Dhruv"]
LAW = ["Farah", "Gautam", "Hina"]
DOC = ["Ishaan", "Jaya"]
ALL6 = ENG + LAW + DOC


def ok6(c, drop=None):
    c = set(c)
    cl = {1: len(c & set(ENG)) >= 2 and len(c & set(LAW)) >= 1 and len(c & set(DOC)) >= 1,
          2: not {"Aarav", "Farah"} <= c,
          3: ("Bhavya" not in c) or ("Gautam" in c),
          4: ("Chitra" in c) == ("Dhruv" in c),
          5: len(c & set(DOC)) == 1,
          6: not {"Gautam", "Ishaan"} <= c}
    return all(v for k, v in cl.items() if k != drop)


def solve6():
    com = [set(c) for c in combinations(ALL6, 5) if ok6(c)]
    with_i = [c for c in com if "Ishaan" in c]
    opts = ["Hina is selected", "Aarav is selected", "Gautam is selected", "Farah is selected"]
    must = [o for o in opts if all(o.split()[0] in c for c in with_i)]
    assert len(must) == 1
    return {1: len(com), 2: sum(1 for c in com if "Hina" not in c),
            3: sum(1 for c in com if "Bhavya" in c), 4: must[0],
            5: str(max(len(c & set(LAW)) for c in com))}


add_set("D06", S, "Distribution", "Selection with conditions", "Forming a five-member task force", """
A five-member task force is to be selected from nine candidates: four engineers (Aarav, Bhavya, Chitra, Dhruv), three lawyers (Farah, Gautam, Hina) and two doctors (Ishaan, Jaya). The selection must satisfy all of the following:

1. The task force has at least two engineers, at least one lawyer and at least one doctor.
2. Aarav and Farah cannot both be selected.
3. If Bhavya is selected, Gautam must also be selected.
4. Chitra and Dhruv are either both selected or both left out.
5. Exactly one doctor is selected.
6. Gautam and Ishaan cannot both be selected.
""", solver=solve6)

T, SUB = "Distribution", "Selection with conditions"
dq("D06", T, SUB, "H", 180, "How many different task forces can be formed?", "9",
   """(Initials: A = Aarav, B = Bhavya, F = Farah, G = Gautam, H = Hina.)
   Exactly one doctor ⇒ four places for engineers and lawyers, with ≥ 2 engineers and ≥ 1 lawyer.
   Case 1 — Chitra and Dhruv both in: pick two more from {A, B, F, G, H} with at least one lawyer.
   · With Jaya: {A,G}, {A,H}, {B,G}, {F,G}, {F,H}, {G,H} are valid; {A,F} breaks clue 2; {B,F} and {B,H} break clue 3 ⇒ 6.
   · With Ishaan (Gautam barred by clue 6): {A,H}, {F,H} ⇒ 2.
   Case 2 — Chitra and Dhruv both out: the engineers must be Aarav and Bhavya ⇒ Gautam is in (clue 3), Farah is out (clue 2), so the fourth place is Hina; the doctor must be Jaya (clue 6) ⇒ 1.
   Total = 6 + 2 + 1 = 9.""",
   "Split on the Chitra–Dhruv pair (in or out); it forces most of the structure.",
   "Start with the 'both or neither' pair.",
   "Missing the Chitra–Dhruv-out case, or forgetting that clue 6 removes Gautam when Ishaan is chosen.",
   "Selection sets: branch on the 'both-or-neither' and 'if-then' clues.")
dq("D06", T, SUB, "M", 60, "If Hina is not selected, how many task forces are possible?", "3",
   """From the 9 teams, those without Hina: {A,C,D,G,J}, {B,C,D,G,J}, {C,D,F,G,J} ⇒ 3.""",
   "Filter the full list.",
   "Use your list of 9 teams.",
   "Counting teams without Farah instead.",
   "Keep the full list of cases written out — later questions reuse it.")
dq("D06", T, SUB, "M", 60, "If Bhavya is selected, how many task forces are possible?", "2",
   """Teams containing Bhavya: {A,B,G,H,J} and {B,C,D,G,J} ⇒ 2.""",
   "Bhavya forces Gautam, which forces Jaya.",
   "Chain clue 3 then clue 6.",
   "Allowing Ishaan with Gautam.",
   "Chained conditionals shrink the space fast.")
dq("D06", T, SUB, "M", 60, "If Ishaan is selected, which of the following must be true?", 0,
   """Teams with Ishaan: {A,C,D,H,I} and {C,D,F,H,I}. Both include Hina.""",
   "Ishaan bars Gautam, so the lawyer must be Hina (with or without Farah).",
   "Which lawyers remain once Gautam is out?",
   "Choosing Aarav (true in only one of the two teams).",
   "'Must be true' = true in every surviving case.",
   options=["Hina is selected", "Aarav is selected", "Gautam is selected", "Farah is selected"])
dq("D06", T, SUB, "E", 45, "What is the maximum number of lawyers that can be on the task force?", 1,
   """Engineers ≥ 2 and one doctor leave at most 2 places for lawyers; e.g. {C, D, G, H, J}. So 2.""",
   "5 − 2 engineers − 1 doctor = 2.",
   "Count the compulsory places first.",
   "Answering 3 (all lawyers) without checking the minimums.",
   "Max/min questions: fill the compulsory seats first.",
   options=["1", "2", "3", "0"])

# =====================================================================
# D07  Round-robin tournament
# =====================================================================
TEAMS = "PQRST"
MATCHES = list(combinations(TEAMS, 2))
PTS = dict(P=10, Q=7, R=6, S=4, T=1)


def outcomes7(extra=None):
    out = []
    for r in product((0, 1, 2), repeat=10):
        pts = dict.fromkeys(TEAMS, 0)
        for (a, b), x in zip(MATCHES, r):
            if x == 0: pts[a] += 3
            elif x == 2: pts[b] += 3
            else: pts[a] += 1; pts[b] += 1
        if pts != PTS:
            continue
        res = dict(zip(MATCHES, r))
        # clue: T's only point came from its match against S
        if res[("S", "T")] != 1:
            continue
        if extra and not extra(res):
            continue
        out.append(res)
    return out


def solve7():
    base = outcomes7()
    draws = {sum(1 for v in o.values() if v == 1) for o in base}
    pq = {o[("P", "Q")] for o in base}
    rw = set()
    for o in base:
        w = sum(1 for (a, b), v in o.items() if (a == 'R' and v == 0) or (b == 'R' and v == 2))
        rw.add(w)
    assert len(draws) == len(pq) == len(rw) == 1
    q4 = outcomes7(lambda o: o[("Q", "R")] == 0)
    rs = {o[("R", "S")] for o in q4}
    assert len(rs) == 1
    name = {0: "R won", 1: "Draw", 2: "S won"}
    return {1: draws.pop(), 2: {0: "P won", 1: "Draw", 2: "Q won"}[pq.pop()], 3: rw.pop(),
            4: name[rs.pop()], 5: len(base)}


add_set("D07", S, "Games & Tournaments", "Round-robin points table", "Five-team league", """
Five teams — P, Q, R, S and T — played a round-robin league: every team played every other team exactly once. A win earned 3 points, a draw 1 point and a loss 0 points.

The final points were: P – 10, Q – 7, R – 6, S – 4, T – 1.

It is also known that T's only point came from its match against S.
""", tables=[table("Final points", ["Team", "P", "Q", "R", "S", "T"], [["Points", 10, 7, 6, 4, 1]])], solver=solve7)

T, SUB = "Games & Tournaments", "Round-robin points table"
dq("D07", T, SUB, "M", 120, "How many matches in the league ended in a draw?", "2",
   """10 matches were played. Each decisive match gives 3 points in total, each draw 2.
   Total points = 28 = 3 × 10 − (number of draws) ⇒ draws = 2.""",
   "Total-points identity: 3M − D = total.",
   "Add up all the points first.",
   "Assuming every team with a non-multiple of 3 drew separately (counting 4).",
   "Win/draw/loss leagues: total = 3 × matches − draws.")
dq("D07", T, SUB, "H", 150, "What was the result of the match between P and Q?", 2,
   """T has 1 point ⇒ one draw (vs S) and three losses; S–T is one of the two draws.
   P has 10 = 3 wins + 1 draw. Q has 7 = 2 wins + 1 draw. R has 6 = 2 wins and no draw. S has 4 = 1 win + 1 draw (the draw is with T).
   So the second draw involves both P and Q ⇒ P drew with Q.""",
   "Decompose each total into wins and draws: 10 = 3+3+3+1, 7 = 3+3+1, 6 = 3+3, 4 = 3+1, 1 = 1.",
   "Who needs a draw, and who already has one?",
   "Pairing P's draw with T (ruled out by the given clue).",
   "Points decomposition is the key step in league puzzles.",
   options=["P won", "Q won", "Draw", "Cannot be determined"])
dq("D07", T, SUB, "E", 45, "How many matches did R win?", "2",
   """R has 6 points and no draws are available for R (both draws are P–Q and S–T) ⇒ 2 wins.""",
   "6 = 3 + 3.",
   "Could R have drawn any match?",
   "Answering 6 (points, not wins).",
   "Always separate points from wins.")
dq("D07", T, SUB, "H", 90, "If it is also known that Q beat R, what was the result of the match between R and S?", 0,
   """Q's two wins: over T and, now, R. So Q lost to S.
   S's single win is therefore over Q, so S lost to R ⇒ R won.""",
   "Track each team's remaining wins as a budget.",
   "S has exactly one win; whom did it beat?",
   "Assuming S beat R because S beat Q earlier in the case list.",
   "In league problems, win budgets propagate quickly.",
   options=["R won", "S won", "Draw", "Cannot be determined"])
dq("D07", T, SUB, "H", 120, "How many different sets of match results are consistent with all the given information?", "2",
   """Fixed: P beat R, S, T; P drew Q; Q and R beat T; S drew T.
   Remaining: Q–R, Q–S, R–S with Q needing 1 more win, R 1 more, S 1 win.
   These form a cycle: either Q>R, R>S, S>Q or R>Q, S>R, Q>S ⇒ 2 sets.""",
   "After fixing forced results, the leftover three matches form a win cycle.",
   "List the forced results first.",
   "Counting the 4 sets possible without the 'T's point' clue.",
   "Count possibilities only after applying every clue.")

# =====================================================================
# D08  Knockout tournament
# =====================================================================
R1 = [(1, 8), (4, 5), (3, 6), (2, 7)]


def outcomes8(drop=None):
    out = []
    for bits in product((0, 1), repeat=7):
        w1 = [m[b] for m, b in zip(R1, bits[:4])]
        sf = [(w1[0], w1[1]), (w1[2], w1[3])]
        w2 = [m[b] for m, b in zip(sf, bits[4:6])]
        fin = (w2[0], w2[1]); champ = fin[bits[6]]
        matches = list(zip(R1, w1)) + list(zip(sf, w2)) + [(fin, champ)]
        ups = sum(1 for (a, b), w in matches if w == max(a, b))
        wins = {p: sum(1 for _, w in matches if w == p) for p in range(1, 9)}
        cl = {1: ups == 3, 2: 5 in w2, 3: champ < 5, 4: w1[0] == 8, 5: wins[2] >= 1, 6: wins[6] == 0}
        if all(v for k, v in cl.items() if k != drop):
            out.append(dict(w1=w1, sf=sf, w2=w2, champ=champ, matches=matches, wins=wins))
    return out


def solve8():
    o = unique(outcomes8(), "D08")
    beaten_by5 = [a if b == 5 else b for (a, b), w in o["matches"][4:6] if w == 5 and 5 in (a, b)][0]
    upsets = [(a, b) for (a, b), w in o["matches"] if w == max(a, b)]
    opt = {"Seed 3 vs seed 2 (semi-final)": (3, 2), "Seed 5 vs seed 8 (semi-final)": (8, 5),
           "Seed 3 vs seed 5 (final)": (5, 3), "Seed 2 vs seed 7 (first round)": (2, 7)}
    ups = [k for k, (a, b) in opt.items() if (a, b) in upsets or (b, a) in upsets]
    assert len(ups) == 1
    return {1: o["champ"], 2: f"Seed {beaten_by5}", 3: o["wins"][2], 4: len(outcomes8(drop=6)), 5: ups[0]}


add_set("D08", S, "Games & Tournaments", "Knockout bracket", "Eight-player knockout", """
Eight players seeded 1 (strongest) to 8 (weakest) played a knockout tournament. First-round matches: 1 vs 8, 4 vs 5, 3 vs 6 and 2 vs 7. The winners of 1 vs 8 and 4 vs 5 met in semi-final 1; the winners of 3 vs 6 and 2 vs 7 met in semi-final 2. The two semi-final winners played the final. There were no draws.

A match is called an upset if it is won by the player with the higher seed number (the weaker seed).

1. Exactly three matches in the tournament were upsets.
2. Seed 5 reached the final.
3. The champion's seed number was less than 5.
4. Seed 1 lost its first match.
5. Seed 2 won at least one match.
6. Seed 6 did not win any match.
""", solver=solve8)

T, SUB = "Games & Tournaments", "Knockout bracket"
dq("D08", T, SUB, "M", 150, "Which seed won the tournament?", "3",
   """Clue 4: 8 beat 1 (upset 1). Clue 2: 5 reached the final, so 5 beat 4 (upset 2) and then beat 8 in semi-final 1 (not an upset).
   Clue 6: 3 beat 6. Clue 5: 2 beat 7.
   Semi-final 2 is 3 vs 2. The final is 5 vs the winner; clue 3 says the champion is not 5.
   Exactly one more upset is needed (clue 1). If 2 beat 3 there is no upset in SF2; then the final (5 vs 2, won by 2) is not an upset ⇒ total 2 ✗.
   So 3 beat 2 (upset 3), and 3 beat 5 in the final (not an upset) ⇒ champion = seed 3.""",
   "Count upsets as you go; the last one decides SF2.",
   "Work round by round; list which matches are forced.",
   "Calling 5-beats-8 an upset (5 is the stronger seed there).",
   "Upset bookkeeping: compare seed numbers in every match.")
dq("D08", T, SUB, "E", 30, "Whom did seed 5 beat in the semi-final?", 1,
   """Semi-final 1 was 8 (who beat 1) vs 5 ⇒ seed 8.""",
   "Seed 1 was already out.",
   "Who won 1 vs 8?",
   "Answering seed 1 without applying clue 4.",
   "Track the bracket path explicitly.",
   options=["Seed 1", "Seed 8", "Seed 4", "Seed 3"])
dq("D08", T, SUB, "E", 30, "How many matches did seed 2 win?", "1",
   """2 beat 7 in round 1 and lost to 3 in the semi-final ⇒ 1 win.""",
   "Read from the bracket.",
   "Who beat seed 2?",
   "Assuming seed 2 reached the final.",
   "Wins in a knockout = rounds survived.")
dq("D08", T, SUB, "H", 120, "If clue 6 is removed, how many different tournament outcomes are possible?", "2",
   """Without clue 6, SF2 can be 3 vs 2 (as before) or 6 vs 2.
   6 vs 2 case: 6 beat 3 (upset 3), so 2 must beat 6 in SF2 (no more upsets) and 2 beats 5 in the final ✓ (champion 2 < 5).
   Together with the original outcome ⇒ 2 outcomes.""",
   "Only the 3 vs 6 result is released; recount upsets.",
   "Which match did clue 6 decide?",
   "Letting 6 also win the semi-final (that makes 4 upsets).",
   "Removing a clue reopens only the matches it fixed.")
dq("D08", T, SUB, "M", 45, "Which of the following matches was an upset?", 0,
   """Upsets: 8 over 1, 5 over 4, 3 over 2. Among the options, only seed 3 vs seed 2 (semi-final) was an upset.""",
   "The weaker seed (higher number) won.",
   "Compare seed numbers.",
   "Treating the final (3 beat 5) as an upset.",
   "Define 'upset' once and apply it mechanically.",
   options=["Seed 3 vs seed 2 (semi-final)", "Seed 5 vs seed 8 (semi-final)",
            "Seed 3 vs seed 5 (final)", "Seed 2 vs seed 7 (first round)"])

# =====================================================================
# D09  Road network (shortest paths)
# =====================================================================
ROADS = {("A", "B"): 4, ("A", "C"): 2, ("B", "C"): 1, ("B", "D"): 5, ("C", "D"): 8,
         ("C", "E"): 8, ("D", "E"): 2, ("D", "F"): 6, ("E", "F"): 3}


def dijkstra(roads, src):
    g = {}
    for (u, v), w in roads.items():
        g.setdefault(u, []).append((v, w)); g.setdefault(v, []).append((u, w))
    dist = {src: 0}; ways = {src: 1}; pq = [(0, src)]; done = set()
    while pq:
        d, u = heapq.heappop(pq)
        if u in done: continue
        done.add(u)
        for v, w in g[u]:
            nd = d + w
            if nd < dist.get(v, 1e9):
                dist[v] = nd; ways[v] = ways[u]; heapq.heappush(pq, (nd, v))
            elif nd == dist[v]:
                ways[v] += ways[u]
    return dist, ways


def solve9():
    d, w = dijkstra(ROADS, "A")
    r2 = {k: v for k, v in ROADS.items() if k != ("B", "D")}
    r5 = {k: v for k, v in ROADS.items() if k != ("E", "F")}
    dD, _ = dijkstra(ROADS, "D")
    return {1: d["F"], 2: dijkstra(r2, "A")[0]["F"], 3: w["F"],
            4: d["D"] + dD["F"], 5: f"{dijkstra(r5, 'A')[0]['F']} minutes"}


add_set("D09", S, "Networks", "Shortest paths", "Six towns and nine roads", """
Six towns A, B, C, D, E and F are connected by nine two-way roads. The table lists every road and the time (in minutes) to drive along it in either direction. There are no other roads, and a vehicle can only change roads at a town.
""", tables=[table("Road travel times", ["Road", "Time (min)"],
                   [[f"{u}–{v}", w] for (u, v), w in ROADS.items()])], solver=solve9)

T, SUB = "Networks", "Shortest paths"
dq("D09", T, SUB, "M", 120, "What is the minimum time (in minutes) to travel from A to F?", "13",
   """Shortest times from A: C = 2, B = 3 (via C), D = 8 (A–C–B–D), E = 10 (via C directly or via D), F = 13 (E + 3).
   D–F gives 8 + 6 = 14, which is longer.""",
   "Label each town with its best time from A, nearest first (Dijkstra by hand).",
   "Go to C first; A–B directly is slower than A–C–B.",
   "Taking A–B (4) directly and missing the 3-minute route via C.",
   "Label towns in order of distance; never revisit a finalised town.")
dq("D09", T, SUB, "M", 60, "If road B–D is closed, what is the minimum time (in minutes) from A to F?", "13",
   """A–C–E–F = 2 + 8 + 3 = 13 does not use B–D, so the minimum is unchanged at 13.""",
   "Check whether an alternative shortest route avoids the closed road.",
   "There are two shortest routes to F.",
   "Assuming any closure on a shortest path must increase the time.",
   "A closure matters only if every shortest route uses that road.")
dq("D09", T, SUB, "M", 60, "How many different routes from A to F take the minimum possible time?", 1,
   """Routes of 13 minutes: A–C–B–D–E–F (2+1+5+2+3) and A–C–E–F (2+8+3) ⇒ 2.""",
   "Count ties while labelling: E is reached in 10 two ways.",
   "Look for ties at E.",
   "Counting A–B–D–E–F (14 minutes).",
   "Number of shortest paths = sum over tied predecessors.",
   options=["1", "2", "3", "4"])
dq("D09", T, SUB, "M", 90, "A courier must go from A to F and must pass through D on the way. What is the minimum time (in minutes)?", "13",
   """A to D minimum = 8 (A–C–B–D). D to F minimum = 5 (D–E–F).
   Total = 13.""",
   "Split into A→D and D→F and minimise each.",
   "Via-point routes: shortest(A, D) + shortest(D, F).",
   "Using the direct D–F road (6) and getting 14.",
   "Forced waypoint: add two shortest distances.")
dq("D09", T, SUB, "H", 90, "If road E–F is closed for repairs, what is the minimum time from A to F?", 2,
   """The only other road into F is D–F (6). Minimum A to D = 8.
   Minimum = 8 + 6 = 14 minutes.""",
   "Identify the roads entering F.",
   "With E–F gone, F can only be reached from D.",
   "Going A–C–E–D–F (2 + 8 + 2 + 6 = 18) without checking the D route.",
   "When the last link is cut, work backwards from the destination.",
   options=["13 minutes", "15 minutes", "14 minutes", "16 minutes"])

# =====================================================================
# D10  Flow network
# =====================================================================
PIPES = {("S", "A"): 10, ("S", "B"): 8, ("A", "B"): 3, ("A", "C"): 6, ("B", "D"): 9,
         ("C", "T"): 8, ("D", "T"): 7, ("A", "D"): 4, ("C", "D"): 2}


def maxflow(edges, s="S", t="T"):
    cap, adj = {}, {}
    for (u, v), c in edges.items():
        cap[(u, v)] = cap.get((u, v), 0) + c; cap.setdefault((v, u), 0)
        adj.setdefault(u, set()).add(v); adj.setdefault(v, set()).add(u)
    f = 0
    while True:
        par = {s: None}; q = deque([s])
        while q:
            u = q.popleft()
            for v in adj.get(u, ()):
                if v not in par and cap[(u, v)] > 0:
                    par[v] = u; q.append(v)
        if t not in par:
            return f
        b = float("inf"); v = t
        while par[v] is not None:
            b = min(b, cap[(par[v], v)]); v = par[v]
        v = t
        while par[v] is not None:
            cap[(par[v], v)] -= b; cap[(v, par[v])] += b; v = par[v]
        f += b


def solve10():
    base = maxflow(PIPES)
    def mod(**kw):
        e = dict(PIPES)
        for k, v in kw.items():
            key = (k[0], k[1])
            if v is None: e.pop(key)
            else: e[key] = v
        return maxflow(e)
    cands = {"S→A": ("S", "A"), "A→C": ("A", "C"), "D→T": ("D", "T"), "B→D": ("B", "D")}
    gains = {k: maxflow({**PIPES, e: PIPES[e] + 5}) for k, e in cands.items()}
    best = max(gains.values())
    bestk = [k for k, g in gains.items() if g == best]
    assert len(bestk) == 1
    return {1: base, 2: mod(DT=10), 3: bestk[0], 4: mod(AC=None), 5: str(maxflow({**PIPES, ("B", "C"): 4}))}


add_set("D10", S, "Networks", "Flow / capacity network", "Water from reservoir to city", """
Water flows from a reservoir S to a city T through one-way pipes via four pumping stations A, B, C and D. The table gives the maximum flow each pipe can carry (in million litres per day, MLD) and its direction. Water can be split and merged freely at stations, but no water is stored or lost at any station.
""", tables=[table("Pipe capacities", ["Pipe (from → to)", "Capacity (MLD)"],
                   [[f"{u} → {v}", c] for (u, v), c in PIPES.items()])], solver=solve10)

T, SUB = "Networks", "Flow / capacity network"
dq("D10", T, SUB, "H", 150, "What is the maximum flow (in MLD) that can reach T?", "13",
   """Only two pipes enter T: C→T (8) and D→T (7), so flow ≤ 15.
   C receives only from A→C (6) ⇒ C→T carries at most 6.
   D→T carries at most 7 (enough water reaches D via S→B→D).
   Maximum = 6 + 7 = 13, achieved e.g. by S→A→C→T (6), S→B→D→T (7).
   The cut {A→C, D→T} has capacity 13, confirming the maximum.""",
   "Look for a small set of pipes whose removal disconnects S from T (min cut = max flow).",
   "Check what can actually reach C and D.",
   "Answering 15 (sum of the two pipes into T) without checking what feeds C.",
   "Max-flow = min-cut: find the cheapest set of pipes separating S and T.")
dq("D10", T, SUB, "M", 60, "If the capacity of pipe D→T is increased from 7 to 10 MLD, what is the new maximum flow?", "16",
   """Now D→T can take 10: feeds to D are B→D (9) plus A→D (4) and C→D (2), plenty.
   Max flow = 6 (via C) + 10 (via D) = 16. New min cut {A→C, D→T} = 16.""",
   "Recheck the min cut with the new capacity.",
   "Is D→T still a bottleneck?",
   "Adding 3 to 13 without checking other cuts (it happens to work here, but verify).",
   "After a capacity change, re-evaluate every candidate cut.")
dq("D10", T, SUB, "H", 90,
   "Which one pipe, if its capacity were increased by 5 MLD, would increase the maximum flow the most?", 2,
   """Only pipes in the minimum cut {A→C, D→T} can help.
   A→C +5: C→T limit 8 ⇒ flow via C rises to 8 ⇒ total 15.
   D→T +5: D can receive up to 9 + 4 + 2 = 15 ≥ 12 ⇒ total 6 + 12 = 18.
   S→A and B→D are not bottlenecks (no gain). Best: D→T.""",
   "Only min-cut pipes can raise the max flow.",
   "Which pipes are saturated in every maximum flow?",
   "Choosing A→C without noticing C→T caps it at 8.",
   "Upgrade the bottleneck whose downstream has spare capacity.",
   options=["S→A", "A→C", "D→T", "B→D"])
dq("D10", T, SUB, "M", 60, "If pipe A→C is shut down completely, what is the maximum flow (in MLD) to T?", "7",
   """C now receives nothing, so C→T carries 0. All flow must use D→T (7).
   Maximum = 7.""",
   "With A→C gone, C is a dead end.",
   "Which pipes feed C?",
   "Routing via C→D→T without realising D→T is already the limit.",
   "Removing a pipe can isolate a whole branch.")
dq("D10", T, SUB, "M", 75, "If a new pipe B→C with capacity 4 MLD is added (all else unchanged), what is the new maximum flow?", 1,
   """C can now receive 6 (A→C) + 4 (B→C) = 10, but C→T is limited to 8.
   D→T still carries 7. Supply: S→A 10, S→B 8 — enough (e.g. S→A→C 6, S→B→C 2, S→B→D 6, S→A→D 1).
   Max flow = 8 + 7 = 15.""",
   "New bottlenecks: C→T (8) and D→T (7).",
   "Recompute the minimum cut.",
   "Adding the full 4 to 13 (17), ignoring C→T's cap.",
   "Adding capacity helps only up to the next bottleneck.",
   options=["13", "15", "17", "14"])
