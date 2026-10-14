"""QA questions added to bring every thin subtopic up to at least five questions
(number systems, geometry and modern maths). Same rules as the rest of the bank:
original wording, an independent check for every answer, and distractors that are
plausible mistakes rather than random numbers."""
from fractions import Fraction as F
from math import comb, factorial, gcd, isqrt, lcm, perm, sqrt
from itertools import permutations, product, combinations
from common import qa

N = "Number Systems"
G = "Geometry & Mensuration"
M = "Modern Math"


def divisors(n):
    return [d for d in range(1, n + 1) if n % d == 0]


def zeros(n):
    z, p = 0, 5
    while p <= n:
        z += n // p
        p *= 5
    return z


def legendre(n, p):
    e, q = 0, p
    while q <= n:
        e += n // q
        q *= p
    return e


# ---------------- Factors (+3) ----------------
qa(N, "Factors", "E", 55,
   "How many factors of 2⁴ × 3⁵ × 5² are multiples of 30?",
   0,
   """A multiple of 30 = 2 × 3 × 5 needs at least one of each prime.
   Exponent of 2: 1–4 (4 choices); of 3: 1–5 (5 choices); of 5: 1–2 (2 choices).
   Count = 4 × 5 × 2 = 40.""",
   "Force one of each required prime, then count the remaining exponent choices.",
   "Which exponents can each prime take in a factor that 30 divides?",
   "Counting all factors (5 × 6 × 3 = 90) or allowing exponent 0 for one of the primes.",
   "Factors of N divisible by k: factors of N/k, i.e. lower each required exponent's range.",
   options=["40", "90", "60", "30"],
   check=lambda: sum(1 for d in divisors(2 ** 4 * 3 ** 5 * 5 ** 2) if d % 30 == 0))

qa(N, "Factors", "M", 80,
   "How many positive factors of 7200 are perfect squares?",
   "12",
   """7200 = 2⁵ × 3² × 5².
   A square factor needs even exponents: 2 can be 0, 2 or 4 (3 choices); 3 can be 0 or 2 (2); 5 can be 0 or 2 (2).
   Count = 3 × 2 × 2 = 12.""",
   "Count the even exponents available for each prime and multiply.",
   "Which exponents of each prime keep a factor a perfect square?",
   "Using ⌊5/2⌋ = 2 choices for the 2s and forgetting exponent 0 (gives 8).",
   "Square factors: number of even values 0…e for each prime, multiplied.",
   check=lambda: sum(1 for d in divisors(7200) if isqrt(d) ** 2 == d))

qa(N, "Factors", "H", 120,
   "How many natural numbers less than 100 have exactly 6 positive factors?",
   "16",
   """d(n) = 6 means n = p⁵ or n = p² × q (p, q distinct primes).
   p⁵ < 100: only 2⁵ = 32 (1 number).
   p² × q < 100: p = 2: 4q < 100 with q ≠ 2 ⇒ q = 3, 5, …, 23 (8 numbers); p = 3: 9q < 100, q ≠ 3 ⇒ q = 2, 5, 7, 11 (4); p = 5: 25q < 100 ⇒ q = 2, 3 (2); p = 7: 49 × 2 = 98 (1).
   Total = 1 + 8 + 4 + 2 + 1 = 16.""",
   "List the shapes first (p⁵, p²q), then count by the squared prime.",
   "Which prime-power shapes give exactly 6 factors?",
   "Missing the p⁵ form (32), or allowing q = p (which gives p³ with 4 factors).",
   "d(n) = 6 ⇔ n = p⁵ or p²q; enumerate by the larger exponent.",
   check=lambda: sum(1 for n in range(1, 100) if len(divisors(n)) == 6))

# ---------------- Factorials (+4) ----------------
qa(N, "Factorials", "E", 45,
   "How many zeros does 125! end with?",
   0,
   """Count factors of 5: ⌊125/5⌋ + ⌊125/25⌋ + ⌊125/125⌋ = 25 + 5 + 1 = 31.
   There are more 2s than 5s, so 125! ends in 31 zeros.""",
   "Keep dividing by 5 and add the quotients: 25, 5, 1.",
   "Each trailing zero needs one 2 and one 5.",
   "Stopping after ⌊125/5⌋ = 25 and missing the extra 5s in 25, 50, … and 125.",
   "Trailing zeros of n! = Σ ⌊n/5ᵏ⌋.",
   options=["31", "25", "30", "32"],
   check=lambda: zeros(125))

qa(N, "Factorials", "M", 75,
   "What is the highest power of 6 that divides 40! ?",
   "18",
   """6 = 2 × 3, and 3s are scarcer than 2s, so count 3s.
   Power of 3 in 40! = ⌊40/3⌋ + ⌊40/9⌋ + ⌊40/27⌋ = 13 + 4 + 1 = 18.
   (Power of 2 = 20 + 10 + 5 + 2 + 1 = 38, more than enough.)""",
   "For a composite base, the scarcest prime decides: here the 3s.",
   "Write 6 as 2 × 3 and count each prime in 40!.",
   "Dividing 40 by 6 directly (6 + 1 = 7).",
   "Highest power of a composite k in n!: min over primes of (power in n!) ÷ (power in k).",
   check=lambda: min(legendre(40, 2), legendre(40, 3)))

qa(N, "Factorials", "M", 70,
   "What is the remainder when 1! + 2! + 3! + … + 100! is divided by 12?",
   0,
   """From 4! = 24 onwards every factorial is a multiple of 12.
   So the remainder comes from 1! + 2! + 3! = 1 + 2 + 6 = 9.""",
   "Find the first factorial divisible by the divisor; everything after it drops out.",
   "Which is the first factorial divisible by 12?",
   "Including 4! = 24 in the sum (33 ⇒ remainder 9 anyway) or thinking 3! is divisible by 12.",
   "Sums of factorials mod m: only terms before the first multiple of m matter.",
   options=["9", "3", "0", "1"],
   check=lambda: sum(factorial(i) for i in range(1, 101)) % 12)

qa(N, "Factorials", "H", 110,
   "For how many integers n from 1 to 100 does n! end in exactly 6 zeros?",
   "5",
   """Zeros in n! jump each time n reaches a multiple of 5, and by 2 at multiples of 25.
   z(24) = 4 and z(25) = 6 (25 contributes two 5s), so no n gives exactly 5 zeros.
   z stays 6 for n = 25, 26, 27, 28, 29 and becomes 7 at n = 30.
   So there are 5 such n.""",
   "Zero counts come in blocks of five n; find the block where the count is 6.",
   "What happens to the number of zeros at n = 25?",
   "Assuming every count is reached, so expecting the block 25–29 to have 5 zeros and 30–34 to have 6.",
   "Trailing-zero counts skip values at multiples of 25; answers come in blocks of 5 (or 0).",
   check=lambda: sum(1 for n in range(1, 101) if zeros(n) == 6))

# ---------------- HCF & LCM (+4) ----------------
qa(N, "HCF & LCM", "E", 45,
   "The HCF of two numbers is 12 and their LCM is 360. If one of the numbers is 72, what is the other?",
   0,
   """HCF × LCM = product of the two numbers.
   Other number = 12 × 360 / 72 = 60.""",
   "Product of two numbers = HCF × LCM.",
   "Use the product rule for two numbers.",
   "Dividing the LCM by the given number (360/72 = 5) instead of using the product rule.",
   "For two numbers a × b = HCF × LCM (not true for three or more numbers).",
   options=["60", "48", "90", "72"],
   check=lambda: next(b for b in range(1, 1000) if gcd(72, b) == 12 and lcm(72, b) == 360))

qa(N, "HCF & LCM", "M", 80,
   "What is the smallest positive number that leaves a remainder of 5 when divided by each of 6, 8 and 15, and is also divisible by 7?",
   "245",
   """Such numbers are 5 more than a multiple of LCM(6, 8, 15) = 120: N = 120k + 5.
   120 ≡ 1 (mod 7), so N ≡ k + 5 (mod 7). This is 0 when k = 2.
   N = 240 + 5 = 245.""",
   "Write N = LCM × k + common remainder, then fix k with the extra condition.",
   "Numbers with the same remainder for several divisors differ by their LCM.",
   "Taking k = 1 (125, not a multiple of 7) or using the product 6 × 8 × 15 instead of the LCM.",
   "Same remainder r for divisors a, b, c ⇒ N = k·LCM(a, b, c) + r.",
   check=lambda: next(n for n in range(1, 10000) if all(n % d == 5 for d in (6, 8, 15)) and n % 7 == 0))


def _bells():
    t = lcm(18, 24, 32)  # minutes after 8:00 am
    h, m = divmod(8 * 60 + t, 60)
    return f"{(h - 1) % 12 + 1}:{m:02d} {'am' if h < 12 else 'pm'}"


qa(N, "HCF & LCM", "M", 70,
   "Three bells ring at intervals of 18, 24 and 32 minutes. They ring together at 8:00 am. When will they next ring together?",
   0,
   """They ring together again after LCM(18, 24, 32) minutes.
   18 = 2 × 3², 24 = 2³ × 3, 32 = 2⁵ ⇒ LCM = 2⁵ × 3² = 288 minutes = 4 h 48 min.
   8:00 am + 4 h 48 min = 12:48 pm.""",
   "LCM = highest power of each prime: 2⁵ × 3².",
   "They meet again after a time divisible by all three intervals.",
   "Using 2³ (from 24) for the power of 2 and getting 72 minutes, or the HCF.",
   "Things that repeat together again after the LCM of their intervals.",
   options=["12:48 pm", "1:12 pm", "11:36 am", "2:24 pm"],
   check=_bells)

qa(N, "HCF & LCM", "H", 110,
   "How many pairs of positive integers (a, b) with a < b have HCF 6 and LCM 180?",
   "4",
   """Write a = 6x, b = 6y with x, y coprime. Then LCM = 6xy = 180, so xy = 30.
   30 = 2 × 3 × 5. Split the three primes between x and y: 2³ = 8 ordered splits, 4 with x < y.
   They are (1, 30), (2, 15), (3, 10), (5, 6) ⇒ (6, 180), (12, 90), (18, 60), (30, 36).""",
   "Divide out the HCF; the cofactors are coprime with product LCM/HCF.",
   "Let a = 6x and b = 6y. What must xy be, and what must gcd(x, y) be?",
   "Counting all factor pairs of 30 without the coprime condition (same here, but not in general), or counting ordered pairs (8).",
   "Pairs with HCF h and LCM l: split the distinct primes of l/h between the two numbers: 2ᵏ⁻¹ unordered pairs.",
   check=lambda: sum(1 for a in range(1, 181) for b in range(a + 1, 181) if gcd(a, b) == 6 and lcm(a, b) == 180))

# ---------------- Divisibility & Counting (+4) ----------------
qa(N, "Divisibility & Counting", "E", 50,
   "How many integers from 1 to 500 are divisible by 3 or by 7?",
   0,
   """Divisible by 3: ⌊500/3⌋ = 166. By 7: ⌊500/7⌋ = 71. By both (21): ⌊500/21⌋ = 23.
   By 3 or 7 = 166 + 71 − 23 = 214.""",
   "Add the two counts and subtract the overlap once.",
   "Count multiples of 3, of 7 and of 21.",
   "Adding 166 + 71 = 237 without removing the 23 numbers counted twice.",
   "|A ∪ B| = |A| + |B| − |A ∩ B|; the overlap is multiples of the LCM.",
   options=["214", "237", "191", "223"],
   check=lambda: sum(1 for n in range(1, 501) if n % 3 == 0 or n % 7 == 0))

qa(N, "Divisibility & Counting", "M", 75,
   "A is a digit. The five-digit number 5A7A2 is divisible by 12. What is A?",
   "5",
   """Divisible by 4: the last two digits A2 must be a multiple of 4 ⇒ A2 ∈ {12, 32, 52, 72, 92} ⇒ A is odd.
   Divisible by 3: digit sum 5 + A + 7 + A + 2 = 14 + 2A must be a multiple of 3 ⇒ A ∈ {2, 5, 8}.
   The only odd value is A = 5 (number 55752 = 12 × 4646).""",
   "12 = 4 × 3: test the last two digits for 4 and the digit sum for 3.",
   "Split 12 into coprime factors and apply each test.",
   "Testing divisibility by 2 and 6 (not coprime), which lets A = 2 or 8 through.",
   "Divisibility by a composite: use coprime factors (12 = 4 × 3, not 2 × 6).",
   check=lambda: next(str(a) for a in range(10) if int(f"5{a}7{a}2") % 12 == 0))

qa(N, "Divisibility & Counting", "M", 80,
   "How many four-digit numbers are divisible by 15 but not by 45?",
   0,
   """Four-digit multiples of 15: 1005 to 9990 ⇒ (9990 − 1005)/15 + 1 = 600.
   Four-digit multiples of 45: 1035 to 9990 ⇒ (9990 − 1035)/45 + 1 = 200.
   Every multiple of 45 is a multiple of 15, so the answer is 600 − 200 = 400.""",
   "Count multiples of 15, subtract multiples of 45.",
   "Multiples of 45 are a subset of multiples of 15.",
   "Off-by-one in the AP counts (599 or 199), giving 400 ± 1.",
   "Count of multiples of k in [a, b] = ⌊b/k⌋ − ⌊(a − 1)/k⌋.",
   options=["400", "450", "420", "360"],
   check=lambda: sum(1 for n in range(1000, 10000) if n % 15 == 0 and n % 45 != 0))

qa(N, "Divisibility & Counting", "H", 120,
   "N is the smallest positive integer such that N/2 is a perfect square and N/3 is a perfect cube. What is N?",
   "648",
   """N must be of the form 2ᵃ × 3ᵇ (any other prime would only make N bigger).
   N/2 square: a − 1 and b are even. N/3 cube: a and b − 1 are multiples of 3.
   Smallest a: odd and a multiple of 3 ⇒ a = 3. Smallest b: even and one more than a multiple of 3 ⇒ b = 4.
   N = 2³ × 3⁴ = 8 × 81 = 648. Check: 648/2 = 324 = 18², 648/3 = 216 = 6³.""",
   "Work prime by prime: each exponent must satisfy one parity and one mod-3 condition.",
   "Write N = 2ᵃ3ᵇ and turn 'square' and 'cube' into conditions on a and b.",
   "Taking a = 1, b = 1 (N = 6) without checking: 3 is not a square and 2 is not a cube.",
   "Square ⇔ all exponents even; cube ⇔ all exponents multiples of 3. Solve each exponent separately.",
   check=lambda: next(n for n in range(1, 10000) if n % 6 == 0 and isqrt(n // 2) ** 2 == n // 2 and round((n // 3) ** (1 / 3)) ** 3 == n // 3))

# ---------------- Units Digit (+4) ----------------
qa(N, "Units Digit", "E", 45,
   "What is the units digit of 8²⁰²⁷?",
   0,
   """Units digits of powers of 8 cycle 8, 4, 2, 6 (length 4).
   2027 = 4 × 506 + 3 ⇒ the 3rd term of the cycle: 2.""",
   "Exponent mod 4 picks the position in the cycle 8, 4, 2, 6.",
   "Find the cycle of units digits of 8ⁿ.",
   "Using the remainder 3 but counting the cycle from 8⁰ (giving 4).",
   "Units digits of powers cycle with length 1, 2 or 4; use the exponent mod 4 (with 0 → 4).",
   options=["2", "4", "6", "8"],
   check=lambda: str(pow(8, 2027, 10)))

qa(N, "Units Digit", "M", 70,
   "What is the units digit of 13⁴¹ × 27¹⁷ × 32¹⁵?",
   "8",
   """Only units digits matter: 3⁴¹, 7¹⁷ and 2¹⁵.
   41 ≡ 1, 17 ≡ 1, 15 ≡ 3 (mod 4) ⇒ units digits 3, 7 and 8.
   3 × 7 × 8 = 168 ⇒ units digit 8.""",
   "Reduce each base to its units digit and each exponent mod 4.",
   "Only the last digit of each base matters.",
   "Multiplying the exponents' remainders together instead of the resulting digits.",
   "Units digit of a product = units digit of the product of units digits.",
   check=lambda: str(pow(13, 41, 10) * pow(27, 17, 10) * pow(32, 15, 10) % 10))

qa(N, "Units Digit", "M", 90,
   "What is the units digit of 1¹ + 2² + 3³ + … + 10¹⁰?",
   0,
   """Units digits: 1¹ → 1, 2² → 4, 3³ → 7, 4⁴ → 6, 5⁵ → 5, 6⁶ → 6, 7⁷ → 3, 8⁸ → 6, 9⁹ → 9, 10¹⁰ → 0.
   Sum = 1 + 4 + 7 + 6 + 5 + 6 + 3 + 6 + 9 + 0 = 47 ⇒ units digit 7.""",
   "Find each term's units digit with the power cycles, then add.",
   "Work out the units digit of each term separately.",
   "Taking 7⁷ as ending in 7 (7 ≡ 3 mod 4 gives 3) or 8⁸ as 8.",
   "Units digit of a sum: add the units digits and keep the last digit.",
   options=["7", "3", "5", "1"],
   check=lambda: str(sum(i ** i for i in range(1, 11)) % 10))

qa(N, "Units Digit", "H", 110,
   "When 7²⁰²⁶ is written out in full, what two-digit number do its last two digits form?",
   "49",
   """Work mod 100: 7² = 49, 7⁴ = 2401 ≡ 1 (mod 100).
   2026 = 4 × 506 + 2 ⇒ 7²⁰²⁶ ≡ 7² = 49 (mod 100).
   So 7²⁰²⁶ ends in …49.""",
   "7⁴ = 2401 ends in 01, so powers of 7 repeat mod 100 every 4.",
   "Find the remainder mod 100; a power of 7 ending in 01 helps.",
   "Stopping at the units digit (9), or reducing 2026 mod 10 instead of mod 4.",
   "Last two digits: look for a power ending in 01 (7⁴ = 2401, 3²⁰ ≡ 01, …).",
   check=lambda: str(pow(7, 2026, 100)))

# ---------------- Polygons (+4) ----------------
qa(G, "Polygons", "E", 45,
   "Each interior angle of a regular polygon is 156°. How many sides does it have?",
   0,
   """Each exterior angle = 180° − 156° = 24°.
   Exterior angles of any polygon add to 360°, so n = 360/24 = 15.""",
   "Use the exterior angle: n = 360° ÷ (180° − interior angle).",
   "Exterior angles always add up to 360°.",
   "Dividing 360 by the interior angle, or using (n − 2) × 180 = 156 without multiplying by n.",
   "Regular polygon: exterior angle = 360°/n, interior = 180° − 360°/n.",
   options=["15", "12", "18", "24"],
   check=lambda: next(n for n in range(3, 100) if F(180 * (n - 2), n) == 156))

qa(G, "Polygons", "M", 60,
   "How many diagonals does a 12-sided polygon have?",
   "54",
   """Each vertex joins to 12 − 3 = 9 others by a diagonal (not itself or its two neighbours).
   12 × 9 counts every diagonal twice ⇒ 108/2 = 54.""",
   "Diagonals = n(n − 3)/2.",
   "From one vertex, how many diagonals can you draw?",
   "Forgetting to halve (108) or using n(n − 1)/2 = 66, which includes the 12 sides.",
   "Diagonals of an n-gon: n(n − 3)/2 = C(n, 2) − n.",
   check=lambda: comb(12, 2) - 12)

qa(G, "Polygons", "M", 70,
   "A polygon has three times as many diagonals as sides. How many sides does it have?",
   0,
   """n(n − 3)/2 = 3n ⇒ n − 3 = 6 ⇒ n = 9.
   Check: a nonagon has 9 × 6 / 2 = 27 diagonals = 3 × 9.""",
   "Cancel n from n(n − 3)/2 = 3n.",
   "Write the number of diagonals in terms of n.",
   "Solving n(n − 3) = 3n and getting n = 6 (forgot the /2).",
   "Diagonals = k × sides ⇔ n = 2k + 3.",
   options=["9", "6", "8", "12"],
   check=lambda: next(n for n in range(4, 100) if n * (n - 3) // 2 == 3 * n))

qa(G, "Polygons", "H", 120,
   "A regular hexagon is inscribed in a circle. An equilateral triangle is formed by joining alternate vertices of the hexagon. What is the ratio of the area of the hexagon to the area of the triangle?",
   "2",
   """Let the circle's radius be r. The hexagon is 6 equilateral triangles of side r: area = 6 × (√3/4)r².
   The triangle on alternate vertices has side √3 r: area = (√3/4) × 3r².
   Ratio = 6r² / 3r² = 2.""",
   "The hexagon is 6 small equilateral triangles; the big triangle covers exactly half of it.",
   "Express both areas in terms of the circle's radius.",
   "Taking the triangle's side as 2r (a diameter) instead of √3 r.",
   "Regular hexagon of side s: area (3√3/2)s²; joining alternate vertices gives half the area.",
   check=lambda: round((6 * sqrt(3) / 4) / (sqrt(3) / 4 * 3), 9))

# ---------------- Coordinate Geometry (+3) ----------------
qa(G, "Coordinate Geometry", "E", 45,
   "What is the distance between the points (−3, 4) and (5, −2)?",
   0,
   """Δx = 5 − (−3) = 8, Δy = −2 − 4 = −6.
   Distance = √(8² + 6²) = √100 = 10.""",
   "Spot the 6-8-10 triangle.",
   "Use √(Δx² + Δy²).",
   "Subtracting signs wrongly: Δx = 2, Δy = 2 ⇒ 2√2.",
   "Distance = √((x₂ − x₁)² + (y₂ − y₁)²); look for Pythagorean triples.",
   options=["10", "2√2", "√52", "14"],
   check=lambda: sqrt(8 ** 2 + 6 ** 2))

qa(G, "Coordinate Geometry", "M", 75,
   "The straight line through (2, 3) and (6, 11) meets the x-axis at (a, 0). What is a?",
   "0.5",
   """Slope = (11 − 3)/(6 − 2) = 2.
   Line: y − 3 = 2(x − 2). Put y = 0: −3 = 2x − 4 ⇒ x = 0.5.""",
   "From (2, 3), dropping 3 in y at slope 2 means moving 1.5 left in x.",
   "Find the slope, then set y = 0.",
   "Using the y-intercept (−1) instead of the x-intercept.",
   "x-intercept: set y = 0; y-intercept: set x = 0.",
   check=lambda: F(2) - F(3, 2))

qa(G, "Coordinate Geometry", "H", 120,
   "How many points with integer coordinates lie strictly inside the triangle with vertices (0, 0), (8, 0) and (0, 6)?",
   "17",
   """Area A = ½ × 8 × 6 = 24.
   Lattice points on the boundary: 8 on the x-side, 6 on the y-side and gcd(8, 6) = 2 on the hypotenuse ⇒ B = 16.
   Pick's theorem: A = I + B/2 − 1 ⇒ 24 = I + 8 − 1 ⇒ I = 17.""",
   "Pick's theorem: interior = area − boundary/2 + 1.",
   "Count the lattice points on each edge using gcd of the coordinate differences.",
   "Counting the hypotenuse's lattice points as 8 or 6 instead of gcd(8, 6) = 2.",
   "Lattice points on a segment = gcd(|Δx|, |Δy|) (excluding one end); Pick: A = I + B/2 − 1.",
   check=lambda: sum(1 for x in range(1, 8) for y in range(1, 6) if 3 * x + 4 * y < 24))

# ---------------- Quadrilaterals (+4) ----------------
qa(G, "Quadrilaterals", "E", 50,
   "A square and an 18 cm × 8 cm rectangle have the same perimeter. By how much does the square's area exceed the rectangle's?",
   0,
   """Perimeter = 2(18 + 8) = 52 cm, so the square's side is 13 cm.
   Square: 169 cm². Rectangle: 144 cm². Difference = 25 cm².""",
   "Side of the square = average of length and breadth; the difference is ((18 − 8)/2)².",
   "Find the square's side from the shared perimeter.",
   "Assuming equal perimeters mean equal areas (0).",
   "For a fixed perimeter, the square has the largest area; the gap is ((l − w)/2)².",
   options=["25 cm²", "0 cm²", "16 cm²", "36 cm²"],
   check=lambda: ((18 + 8) / 2) ** 2 - 18 * 8)

qa(G, "Quadrilaterals", "M", 80,
   "A trapezium has parallel sides of 10 cm and 22 cm, and both of its other sides are 10 cm long. What is its area in cm²?",
   "128",
   """It is isosceles, so each side overhangs by (22 − 10)/2 = 6 cm.
   Height = √(10² − 6²) = 8 cm.
   Area = ½ × (10 + 22) × 8 = 128 cm².""",
   "Drop perpendiculars: 6-8-10 triangle at each end.",
   "Find the height from the slanted side and the overhang.",
   "Using the slant side 10 as the height (area 160).",
   "Isosceles trapezium: overhang = (difference of parallel sides)/2; area = ½(sum) × height.",
   check=lambda: (10 + 22) / 2 * sqrt(10 ** 2 - 6 ** 2))

qa(G, "Quadrilaterals", "M", 75,
   "A rectangle has a perimeter of 34 cm and a diagonal of 13 cm. What is its area?",
   0,
   """l + w = 17 and l² + w² = 13² = 169.
   (l + w)² = l² + w² + 2lw ⇒ 289 = 169 + 2lw ⇒ lw = 60.
   Area = 60 cm² (sides 12 and 5).""",
   "Use (l + w)² − (l² + w²) = 2lw; no need to find the sides.",
   "Write the perimeter and the diagonal as equations in l and w.",
   "Taking half the perimeter as the diagonal's partner and computing 17 × 13 / 2.",
   "(a + b)² − (a² + b²) = 2ab: area from perimeter and diagonal directly.",
   options=["60 cm²", "72 cm²", "65 cm²", "84 cm²"],
   check=lambda: next(l * w for l in range(1, 17) for w in range(1, l + 1) if l + w == 17 and l * l + w * w == 169))

qa(G, "Quadrilaterals", "H", 130,
   "A cyclic quadrilateral has sides of 7, 15, 20 and 24 units, in that order. What is its area in square units?",
   "234",
   """Brahmagupta's formula: s = (7 + 15 + 20 + 24)/2 = 33.
   Area = √((33 − 7)(33 − 15)(33 − 20)(33 − 24)) = √(26 × 18 × 13 × 9) = √54756 = 234.
   Check: 7² + 24² = 25² = 15² + 20², so the 25-unit diagonal is a diameter and the area is ½ × 7 × 24 + ½ × 15 × 20 = 84 + 150 = 234.""",
   "7-24-25 and 15-20-25 share the hypotenuse 25: two right triangles on a diameter.",
   "For a cyclic quadrilateral, use Brahmagupta's formula with the semi-perimeter.",
   "Using Heron with only three of the sides, or forgetting to subtract each side from s.",
   "Cyclic quadrilateral area = √((s − a)(s − b)(s − c)(s − d)).",
   check=lambda: sqrt((33 - 7) * (33 - 15) * (33 - 20) * (33 - 24)))

# ---------------- Permutations (+4) ----------------
qa(M, "Permutations", "E", 50,
   "In how many ways can 6 people sit in a row if two particular people must sit next to each other?",
   0,
   """Tie the pair together as one block: 5 units to arrange ⇒ 5! = 120.
   The pair can sit in 2 orders inside the block ⇒ 120 × 2 = 240.""",
   "Glue the pair into one unit, arrange, then multiply by their internal order.",
   "Treat the two people as a single block.",
   "Forgetting the ×2 for the pair's internal order (120).",
   "Must be together: treat as one block (×k! inside); never together: total − together.",
   options=["240", "120", "720", "480"],
   check=lambda: sum(1 for p in permutations(range(6)) if abs(p.index(0) - p.index(1)) == 1))

qa(M, "Permutations", "M", 60,
   "In how many different ways can the letters of the word BANANA be arranged?",
   "60",
   """6 letters with A repeated 3 times and N twice.
   Arrangements = 6! / (3! × 2!) = 720 / 12 = 60.""",
   "Divide 6! by the factorials of the repeat counts.",
   "Swapping identical letters doesn't create a new word.",
   "Dividing only by 3! (120) and forgetting the two Ns.",
   "Arrangements with repeats: n! / (a! b! …).",
   check=lambda: len(set(permutations("BANANA"))))

qa(M, "Permutations", "M", 90,
   "In how many ways can 5 boys and 3 girls stand in a row so that no two girls stand next to each other?",
   0,
   """Arrange the boys: 5! = 120 ways. This creates 6 gaps (ends included).
   Place the 3 girls in 3 different gaps, in order: 6 × 5 × 4 = 120 ways.
   Total = 120 × 120 = 14400.""",
   "Seat the unrestricted group first, then slot the others into the gaps.",
   "How many gaps do 5 boys in a row create?",
   "Using 4 gaps (only between boys) or choosing gaps without ordering the girls.",
   "No two of k together: arrange the rest (m!), then P(m + 1, k) for the gaps.",
   options=["14400", "2880", "7200", "4320"],
   # people 0–4 are boys, 5–7 girls
   check=lambda: sum(1 for p in permutations(range(8)) if not any(p[i] >= 5 and p[i + 1] >= 5 for i in range(7))))

qa(M, "Permutations", "H", 120,
   "How many four-digit numbers with all digits different are divisible by 5?",
   "952",
   """The last digit must be 0 or 5.
   Last digit 0: first digit 9 choices, then 8 and 7 ⇒ 9 × 8 × 7 = 504.
   Last digit 5: first digit 8 choices (not 0 or 5), then 8 and 7 ⇒ 8 × 8 × 7 = 448.
   Total = 504 + 448 = 952.""",
   "Split on the last digit, because 0 also restricts the first digit.",
   "Fill the most restricted places first: the last digit, then the first.",
   "Treating both cases alike (2 × 504 = 1008) and allowing a leading 0 when the last digit is 5.",
   "Case-split when one choice changes the restrictions on another (here 0 in the last place).",
   check=lambda: sum(1 for n in range(1000, 10000) if n % 5 == 0 and len(set(str(n))) == 4))

# ---------------- Combinations (+3) ----------------
qa(M, "Combinations", "E", 45,
   "A committee of 3 is to be chosen from 6 men and 4 women. In how many ways can it include exactly 2 women?",
   0,
   "Choose 2 of the 4 women and 1 of the 6 men: C(4, 2) × C(6, 1) = 6 × 6 = 36.",
   "Multiply the choices for each group.",
   "Pick the women and the men separately.",
   "Using C(10, 3) = 120 (ignores the condition) or adding 6 + 6.",
   "Exactly k from a group: C(group, k) × C(rest, remaining), multiplied.",
   options=["36", "60", "24", "120"],
   check=lambda: sum(1 for c in combinations(range(10), 3) if sum(1 for x in c if x < 4) == 2))

qa(M, "Combinations", "M", 70,
   "There are 10 points in a plane, of which exactly 4 lie on one straight line and no other three are collinear. How many triangles can be formed with these points as vertices?",
   "116",
   """Any 3 points form a triangle unless all 3 are on the line.
   C(10, 3) − C(4, 3) = 120 − 4 = 116.""",
   "Count all triples, subtract the collinear ones.",
   "Which choices of 3 points fail to make a triangle?",
   "Subtracting C(4, 2) = 6 (pairs) instead of C(4, 3) = 4 (triples).",
   "Triangles from n points with k collinear: C(n, 3) − C(k, 3).",
   check=lambda: sum(1 for c in combinations(range(10), 3) if not all(x < 4 for x in c)))

qa(M, "Combinations", "H", 110,
   "How many solutions in non-negative integers does a + b + c = 15 have, if each of a, b and c is at most 6?",
   0,
   """Without the cap: C(17, 2) = 136.
   Subtract cases with one variable ≥ 7: put a = 7 + a′ ⇒ a′ + b + c = 8 ⇒ C(10, 2) = 45, times 3 variables = 135.
   Add back cases with two variables ≥ 7: a′ + b′ + c = 1 ⇒ C(3, 2) = 3, times 3 pairs = 9.
   136 − 135 + 9 = 10. (They are the arrangements of 6, 6, 3 (3), 6, 5, 4 (6) and 5, 5, 5 (1).)""",
   "With a cap close to the average, listing the multisets (6,6,3), (6,5,4), (5,5,5) is fastest.",
   "Count without the cap, then remove the solutions that break it.",
   "Stopping after subtracting 135 (answer 1), forgetting to add back the double overlaps.",
   "Upper bounds in a + b + c = n: inclusion–exclusion over variables pushed above the cap.",
   options=["10", "12", "9", "16"],
   check=lambda: sum(1 for a, b, c in product(range(7), repeat=3) if a + b + c == 15))

# ---------------- Probability (+3) ----------------
qa(M, "Probability", "E", 45,
   "Two fair dice are rolled. What is the probability that the total is 8?",
   0,
   """Outcomes with total 8: (2, 6), (3, 5), (4, 4), (5, 3), (6, 2) ⇒ 5 of 36.
   Probability = 5/36.""",
   "Totals near 7 are most likely; 8 has 5 ways.",
   "List the ordered pairs that add to 8.",
   "Counting (3, 5) and (5, 3) as one outcome (3/36 or 1/12).",
   "Two dice: ways to make total t = 6 − |t − 7|.",
   options=["5/36", "1/6", "1/9", "7/36"],
   check=lambda: F(sum(1 for a, b in product(range(1, 7), repeat=2) if a + b == 8), 36))

qa(M, "Probability", "M", 80,
   "A family has three children. Given that at least one of them is a girl, what is the probability that all three are girls? (Assume boys and girls are equally likely.)",
   0,
   """There are 8 equally likely sequences of three children; 7 of them have at least one girl.
   Only GGG has three girls ⇒ probability = 1/7.""",
   "Condition by shrinking the sample space: 7 cases remain.",
   "List all 8 sequences, then keep only those with at least one girl.",
   "Ignoring the condition and answering 1/8.",
   "Conditional probability: P(A | B) = favourable outcomes inside B ÷ outcomes in B.",
   options=["1/7", "1/8", "1/3", "3/7"],
   check=lambda: F(sum(1 for t in product("BG", repeat=3) if t == ("G", "G", "G")), sum(1 for t in product("BG", repeat=3) if "G" in t)))

qa(M, "Probability", "H", 110,
   "Three fair dice are rolled. The probability that the total is 10 can be written as k/216. What is k?",
   "27",
   """Count ordered triples (a, b, c) from 1–6 with a + b + c = 10.
   Unordered: (1, 3, 6), (1, 4, 5), (2, 2, 6), (2, 3, 5), (2, 4, 4), (3, 3, 4).
   Arrangements: 6 + 6 + 3 + 6 + 3 + 3 = 27. So k = 27.""",
   "Totals 10 and 11 are the most likely for three dice: 27 ways each.",
   "List the unordered triples, then count the orders of each.",
   "Counting each unordered triple once (6) or treating all as having 6 orders (36).",
   "Ordered outcomes from an unordered triple: 6 if all different, 3 if two equal, 1 if all equal.",
   check=lambda: sum(1 for t in product(range(1, 7), repeat=3) if sum(t) == 10))


# ---------------- Second round: every QA subtopic to at least five ----------------
A = "Arithmetic"

qa(A, "Percentages", "H", 130,
   "In an election between two candidates, 10% of the people on the voters' list did not vote and 100 of the votes cast were invalid. The winner received 52% of the valid votes and won by 248 votes. How many people were on the voters' list?",
   "7000",
   """Winning margin = 52% − 48% = 4% of the valid votes = 248 ⇒ valid votes = 6200.
   Votes cast = 6200 + 100 = 6300, which is 90% of the list.
   List = 6300 / 0.9 = 7000.""",
   "Margin as a percentage of valid votes gives the valid total in one step.",
   "Work backwards: margin → valid votes → votes cast → voters' list.",
   "Treating 248 as 52% of the votes, or applying the 90% before adding the invalid votes.",
   "Two-candidate contests: margin = (winner% − loser%) of valid votes.",
   check=lambda: next(v for v in range(100, 100000, 10) if (0.9 * v - 100) * 0.04 == 248))

qa(A, "Percentages", "M", 80,
   "When the price of a pen falls by 20%, a buyer gets 5 more pens for ₹400. What was the original price of a pen?",
   0,
   """At the original price p, ₹400 buys 400/p pens; at 0.8p it buys 500/p.
   500/p − 400/p = 5 ⇒ 100/p = 5 ⇒ p = ₹20.""",
   "A 20% price cut means ₹400 now buys what ₹500 used to: the extra ₹100 buys 5 pens at the original price.",
   "Write the number of pens before and after the price change.",
   "Using the new price (₹16) as the answer.",
   "Price down x% ⇒ quantity for the same money up by x/(100 − x) as a fraction.",
   options=["₹20", "₹16", "₹25", "₹24"],
   check=lambda: next(p for p in range(1, 200) if 400 / (0.8 * p) - 400 / p == 5))

qa(G, "Triangles", "E", 45,
   "A triangle has sides of 5 cm, 12 cm and 13 cm. What is the radius of its circumcircle?",
   0,
   """5² + 12² = 13², so the triangle is right-angled.
   The hypotenuse is a diameter of the circumcircle ⇒ R = 13/2 = 6.5 cm.""",
   "Right triangle ⇒ circumradius = half the hypotenuse.",
   "Check whether the triangle is right-angled.",
   "Using the inradius formula (r = 2 cm) or the full hypotenuse (13 cm).",
   "Circumradius R = abc / (4 × area); for a right triangle R = hypotenuse/2.",
   options=["6.5 cm", "6 cm", "2 cm", "13 cm"],
   check=lambda: F(5 * 12 * 13, 4 * 30))

qa(G, "Triangles", "H", 120,
   "How many triangles with whole-number side lengths have a perimeter of 15?",
   "7",
   """Let a ≤ b ≤ c with a + b + c = 15 and a + b > c ⇒ c < 7.5, so c ≤ 7; also c ≥ 5.
   c = 7: (1, 7, 7), (2, 6, 7), (3, 5, 7), (4, 4, 7) ⇒ 4.
   c = 6: (3, 6, 6), (4, 5, 6) ⇒ 2.
   c = 5: (5, 5, 5) ⇒ 1.
   Total = 7.""",
   "Fix the longest side between ⌈15/3⌉ and ⌊(15 − 1)/2⌋, then count.",
   "Order the sides a ≤ b ≤ c; the triangle inequality only needs a + b > c.",
   "Counting ordered triples, or allowing a + b = c (degenerate, e.g. 1, 7, 7 is fine but 2, 6, 7 must be checked).",
   "Integer triangles with perimeter p: largest side c from ⌈p/3⌉ to ⌊(p − 1)/2⌋.",
   check=lambda: sum(1 for a in range(1, 15) for b in range(a, 15) for c in range(b, 15) if a + b + c == 15 and a + b > c))

qa(G, "Mensuration", "M", 70,
   "How many cubes of edge 2 cm can be cut from a solid cuboid measuring 12 cm × 10 cm × 7 cm?",
   0,
   """Along each edge: 12/2 = 6, 10/2 = 5 and ⌊7/2⌋ = 3 cubes.
   Total = 6 × 5 × 3 = 90 (a 12 × 10 × 1 slab is left over).""",
   "Count along each edge with floor division, then multiply.",
   "Can a 7 cm edge hold a whole number of 2 cm cubes?",
   "Dividing volumes: 840 / 8 = 105, which ignores the leftover 1 cm slab.",
   "Cutting whole cubes: multiply ⌊edge / side⌋ for each edge, never divide volumes.",
   options=["90", "105", "84", "96"],
   check=lambda: (12 // 2) * (10 // 2) * (7 // 2))

qa(G, "Mensuration", "H", 110,
   "A sphere fits exactly inside a cube of edge 6 cm, touching all six faces. To the nearest whole number, what percentage of the cube's volume does the sphere fill? (Take π = 3.14.)",
   "52",
   """The sphere's diameter equals the edge, so r = 3 cm.
   Sphere = (4/3) × 3.14 × 27 = 113.04 cm³; cube = 216 cm³.
   113.04 / 216 = 0.5233 ⇒ about 52%.""",
   "The ratio is π/6 for any cube: 3.14/6 ≈ 0.523.",
   "The sphere's diameter is the cube's edge.",
   "Taking r = 6 (the edge as the radius) gives over 400%.",
   "Sphere in a cube fills π/6 ≈ 52.4%; cube in a sphere fills 2/(π√3) ≈ 36.8%.",
   check=lambda: round(4 / 3 * 3.14 * 27 / 216 * 100))

qa(A, "Profit, Loss & Discount", "M", 60,
   "By selling an article for ₹1,140, a trader loses 5%. At what price (in ₹) should he sell it to gain 10%?",
   "1320",
   """₹1,140 = 95% of the cost price ⇒ CP = ₹1,200.
   To gain 10%: SP = 1.1 × 1,200 = ₹1,320.""",
   "Scale directly: 1140 × 110/95 = 1320.",
   "Find the cost price from the loss first.",
   "Adding 15% to ₹1,140 (₹1,311).",
   "SP₂ = SP₁ × (100 + gain)/(100 − loss); percentages are always on cost price.",
   check=lambda: F(1140 * 110, 95))

qa(A, "Simple & Compound Interest", "M", 60,
   "What is the effective annual rate of interest on a deposit paying 20% per annum compounded half-yearly?",
   0,
   """Half-yearly compounding at 20% p.a. means 10% every six months.
   1.1 × 1.1 = 1.21 ⇒ effective rate = 21% per year.""",
   "Two half-years at 10%: 10 + 10 + (10 × 10)/100 = 21%.",
   "Halve the rate and double the number of periods.",
   "Taking 20% (ignores compounding) or 10.25% (compounding a 5% rate).",
   "Effective rate for k compoundings a year = (1 + r/k)ᵏ − 1.",
   options=["21%", "20%", "22%", "10.25%"],
   check=lambda: round((1.1 ** 2 - 1) * 100, 6))

qa(A, "Averages", "M", 75,
   "Four years ago the average age of a family of five was 24 years. A baby has been born since, and the average age of the family of six is now 23.5 years. How old is the baby?",
   "1",
   """The five members' total age four years ago = 5 × 24 = 120; today it is 120 + 5 × 4 = 140.
   The six members' total today = 6 × 23.5 = 141.
   Baby = 141 − 140 = 1 year.""",
   "Age everyone forward first, then compare totals.",
   "Work with total ages rather than averages.",
   "Forgetting to add 4 years to each of the five members (gives 21).",
   "Averages over time: total age grows by (number of people × years).",
   check=lambda: 6 * F(47, 2) - (5 * 24 + 5 * 4))

qa(M, "Probability", "H", 90,
   "Two cards are drawn at random from a standard deck of 52 without replacement. The probability that both are aces is 1/k. What is k?",
   "221",
   """P = (4/52) × (3/51) = 12/2652 = 1/221.
   Equivalently C(4, 2) / C(52, 2) = 6 / 1326 = 1/221.""",
   "Multiply the falling fractions 4/52 × 3/51.",
   "The second draw has one fewer ace and one fewer card.",
   "Drawing with replacement: (1/13)² = 1/169.",
   "Without replacement: multiply successive fractions or use C(good, k)/C(total, k).",
   check=lambda: F(comb(52, 2), comb(4, 2)))

qa(A, "Mixtures & Alligation", "M", 70,
   "How many litres of a 30% acid solution must be mixed with 20 litres of a 60% acid solution to obtain a 40% acid solution?",
   "40",
   """Alligation: (60 − 40) : (40 − 30) = 20 : 10 = 2 : 1 for the 30% : 60% solutions.
   With 20 L of the 60% solution, the 30% solution needed is 2 × 20 = 40 L.
   Check: 0.3 × 40 + 0.6 × 20 = 24 L of acid in 60 L = 40%.""",
   "The weaker solution is twice as far from 40% as the stronger one is close: ratio 2 : 1.",
   "Set up the alligation cross with 30, 60 and the mean 40.",
   "Reversing the ratio and answering 10 L.",
   "Alligation: weaker : stronger = (stronger − mean) : (mean − weaker).",
   check=lambda: next(x for x in range(1, 500) if F(30 * x + 60 * 20, x + 20) == 40))

qa("Algebra", "Functions & Graphs", "H", 100,
   "f(x) = x² − 6x + 11. For how many integers x is f(x) < 20?",
   "9",
   """f(x) < 20 ⇔ x² − 6x − 9 < 0 ⇔ (x − 3)² < 18.
   |x − 3| < √18 ≈ 4.24 ⇒ x − 3 ∈ {−4, …, 4} ⇒ x from −1 to 7.
   That is 9 integers.""",
   "Complete the square: (x − 3)² < 18 ⇒ |x − 3| ≤ 4.",
   "Rewrite f(x) around its vertex.",
   "Solving x² − 6x + 11 = 20 and counting only positive x (0 to 7, i.e. 8).",
   "Integer solutions of (x − h)² < k: |x − h| ≤ ⌈√k⌉ − 1 when k is not a perfect square.",
   check=lambda: sum(1 for x in range(-100, 100) if x * x - 6 * x + 11 < 20))

qa(N, "Remainders & Cyclicity", "M", 80,
   "What is the remainder when 1 + 2 + 2² + 2³ + … + 2⁹⁹ is divided by 7?",
   0,
   """The sum is a geometric series: 2¹⁰⁰ − 1.
   2³ = 8 ≡ 1 (mod 7) ⇒ 2⁹⁹ ≡ 1 ⇒ 2¹⁰⁰ ≡ 2.
   2¹⁰⁰ − 1 ≡ 1 (mod 7).""",
   "Sum the series first (2¹⁰⁰ − 1), then use 2³ ≡ 1 (mod 7).",
   "What does 1 + 2 + … + 2ⁿ⁻¹ simplify to?",
   "Finding 2¹⁰⁰ mod 7 = 2 and forgetting the −1.",
   "Geometric sums mod m: simplify to a single power, then use its cycle.",
   options=["1", "2", "0", "3"],
   check=lambda: str(sum(pow(2, k) for k in range(100)) % 7))

qa(G, "Circles", "E", 45,
   "A chord of a circle is 16 cm long and lies 6 cm from the centre. What is the radius of the circle?",
   0,
   """The perpendicular from the centre bisects the chord: half-chord = 8 cm.
   Radius = √(8² + 6²) = 10 cm.""",
   "6-8-10 triangle with the half-chord.",
   "The perpendicular from the centre to a chord bisects it.",
   "Using the full chord: √(16² + 6²) ≈ 17.1 cm.",
   "Chord at distance d from the centre: (chord/2)² + d² = r².",
   options=["10 cm", "8 cm", "12 cm", "17 cm"],
   check=lambda: sqrt(8 ** 2 + 6 ** 2))
