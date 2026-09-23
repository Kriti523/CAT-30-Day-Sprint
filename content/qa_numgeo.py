from fractions import Fraction as F
from math import comb, factorial, gcd, sqrt, pi
from itertools import permutations, product, combinations
from common import qa

N = "Number Systems"
G = "Geometry & Mensuration"
M = "Modern Math"


def divisors(n):
    return [d for d in range(1, n + 1) if n % d == 0]


# ---------------- Number systems (10) ----------------
qa(N, "Remainders & Cyclicity", "E", 45,
   "What is the remainder when 7¹⁰⁰ is divided by 5?",
   0,
   """7 ≡ 2 (mod 5); powers of 2 mod 5 cycle 2, 4, 3, 1 (length 4).
   100 is a multiple of 4 ⇒ remainder 1.""",
   "7⁴ = 2401 ≡ 1 (mod 5) ⇒ 7¹⁰⁰ = (7⁴)²⁵ ≡ 1.",
   "Find the cycle of 7ⁿ mod 5.",
   "Taking the exponent's remainder as 0 and using 7⁰ incorrectly as 7.",
   "Remainder cycles: reduce the base first, then the exponent mod cycle length.",
   options=["1", "2", "3", "4"],
   check=lambda: str(pow(7, 100, 5)))

qa(N, "Factors", "E", 45,
   "How many positive factors does 360 have?",
   "24",
   """360 = 2³ × 3² × 5.
   Number of factors = (3 + 1)(2 + 1)(1 + 1) = 24.""",
   "Add one to each exponent and multiply.",
   "Prime-factorise first.",
   "Multiplying the exponents themselves (3 × 2 × 1 = 6).",
   "d(n) = Π(eᵢ + 1).",
   check=lambda: len(divisors(360)))

qa(N, "Remainders & Cyclicity", "H", 90,
   "How many natural numbers less than 1000 leave a remainder of 3 when divided by 5 and a remainder of 4 when divided by 7?",
   "29",
   """N ≡ 3 (mod 5): 3, 8, 13, 18, … ; of these 18 ≡ 4 (mod 7).
   So N ≡ 18 (mod 35): N = 18, 53, 88, …, 998.
   Count = (998 − 18)/35 + 1 = 28 + 1 = 29.""",
   "Find the smallest solution by scanning the larger modulus's list, then step by the LCM.",
   "Find the first number satisfying both, then add 35 repeatedly.",
   "Off-by-one: forgetting the '+1' in the AP count (28).",
   "Two remainder conditions ⇒ solutions form an AP with difference = LCM.",
   check=lambda: sum(1 for n in range(1, 1000) if n % 5 == 3 and n % 7 == 4))

qa(N, "Factorials", "M", 45,
   "How many trailing zeros does 100! have?",
   "24",
   """Count factors of 5: ⌊100/5⌋ + ⌊100/25⌋ = 20 + 4 = 24.""",
   "Keep dividing by 5 and add the quotients.",
   "Zeros come from 2 × 5 pairs; 5s are scarcer.",
   "Forgetting the extra 5s from 25, 50, 75, 100 (answering 20).",
   "Trailing zeros of n! = Σ⌊n/5ᵏ⌋.",
   check=lambda: len(str(factorial(100))) - len(str(factorial(100)).rstrip("0")))

qa(N, "Remainders & Cyclicity", "H", 75,
   "What is the remainder when 17²³ + 23²³ is divided by 40?",
   0,
   """For odd n, aⁿ + bⁿ is divisible by (a + b).
   17 + 23 = 40 and 23 is odd ⇒ 17²³ + 23²³ is a multiple of 40.
   Remainder = 0.""",
   "Spot a + b = divisor with an odd exponent.",
   "Check what 17 + 23 equals.",
   "Computing each remainder separately and adding wrongly, or using the rule for even n (aⁿ − bⁿ).",
   "Odd n: (a + b) | aⁿ + bⁿ. Any n: (a − b) | aⁿ − bⁿ.",
   options=["0", "1", "20", "39"],
   check=lambda: str((pow(17, 23, 40) + pow(23, 23, 40)) % 40))

qa(N, "Remainders & Cyclicity", "M", 60,
   "What is the smallest natural number that leaves remainders 1, 2 and 3 when divided by 2, 3 and 4 respectively?",
   "11",
   """In each case the remainder is one less than the divisor, so N + 1 is divisible by 2, 3 and 4.
   N + 1 = LCM = 12 ⇒ N = 11.""",
   "Constant 'deficit' (divisor − remainder = 1) ⇒ N = LCM − 1.",
   "Look at divisor − remainder.",
   "Answering the LCM itself (12).",
   "Common deficit d ⇒ N = k·LCM − d.",
   check=lambda: next(n for n in range(1, 1000) if n % 2 == 1 and n % 3 == 2 and n % 4 == 3))

qa(N, "Factors", "M", 60,
   "What is the sum of all positive factors of 72?",
   2,
   """72 = 2³ × 3².
   Sum = (1 + 2 + 4 + 8)(1 + 3 + 9) = 15 × 13 = 195.""",
   "Multiply the sums of prime-power series.",
   "Prime-factorise first.",
   "Excluding 1 or 72 from the sum.",
   "σ(n) = Π(1 + p + … + pᵉ).",
   options=["180", "123", "195", "168"],
   check=lambda: sum(divisors(72)))

qa(N, "Units Digit", "M", 60,
   "What is the units digit of 3⁶⁵ × 7⁴⁹?",
   "1",
   """Units digits of 3ⁿ and 7ⁿ cycle with length 4.
   65 ≡ 1 (mod 4) ⇒ 3⁶⁵ ends in 3; 49 ≡ 1 (mod 4) ⇒ 7⁴⁹ ends in 7.
   3 × 7 = 21 ⇒ units digit 1.""",
   "Reduce exponents mod 4.",
   "Units digits of powers repeat every 4.",
   "Using exponent mod 2 or adding the digits instead of multiplying.",
   "Cyclicity 4 for 2, 3, 7, 8; 2 for 4, 9; 1 for 0, 1, 5, 6.",
   check=lambda: (pow(3, 65, 10) * pow(7, 49, 10)) % 10)

qa(N, "HCF & LCM", "H", 90,
   "The HCF of two numbers is 27 and their LCM is 2079. If one of the numbers lies between 250 and 500, what is the other number?",
   0,
   """Write the numbers as 27a and 27b with a, b co-prime and ab = 2079/27 = 77.
   Co-prime pairs: (1, 77) or (7, 11).
   (1, 77) gives 27 and 2079 — neither in 250–500. (7, 11) gives 189 and 297.
   297 lies in the range ⇒ the other number is 189.""",
   "LCM/HCF = 77 = 7 × 11 ⇒ numbers are 27 × 7 and 27 × 11.",
   "Divide the LCM by the HCF and split the result into co-prime factors.",
   "Choosing 297 — that is the number in the range, not the other one.",
   "Numbers = H·a, H·b with gcd(a, b) = 1 and ab = L/H.",
   options=["189", "297", "243", "351"],
   check=lambda: next(str(b) for a in range(250, 501) for b in range(1, 3000) if gcd(a, b) == 27 and a * b // 27 == 2079))

qa(N, "Divisibility & Counting", "M", 60,
   "How many integers from 1 to 1000 (inclusive) are divisible by neither 3 nor 5?",
   "533",
   """Divisible by 3: 333; by 5: 200; by 15: 66.
   Divisible by 3 or 5 = 333 + 200 − 66 = 467.
   Neither = 1000 − 467 = 533.""",
   "Inclusion–exclusion with floors.",
   "Count the complement first.",
   "Forgetting to add back the 66 multiples of 15, which gives 467.",
   "|A ∪ B| = |A| + |B| − |A ∩ B|.",
   check=lambda: sum(1 for x in range(1, 1001) if x % 3 and x % 5))

# ---------------- Geometry (11) ----------------
qa(G, "Triangles", "H", 90,
   "In triangle ABC, AB = 10 cm, AC = 17 cm and BC = 21 cm. What is the length (in cm) of the altitude from A to BC?",
   "8",
   """s = (10 + 17 + 21)/2 = 24.
   Area = √(24 × 14 × 7 × 3) = √7056 = 84.
   Altitude = 2 × 84/21 = 8.""",
   "Alternatively split BC as x + (21 − x): 10² − x² = 17² − (21 − x)² ⇒ x = 6, h = 8.",
   "Find the area with Heron's formula, then use ½ × base × height.",
   "Dividing the area by 21 without doubling (4).",
   "h = 2Δ/base. Triangles 10-17-21 and 13-14-15 both have area 84.",
   check=lambda: round(2 * sqrt(24 * 14 * 7 * 3) / 21, 6))

qa(G, "Triangles", "M", 60,
   "In triangle ABC, D lies on AB and E on AC such that DE ∥ BC and AD : DB = 2 : 3. If the area of triangle ABC is 100 cm², what is the area (in cm²) of trapezium DBCE?",
   "84",
   """AD/AB = 2/5 ⇒ area(ADE)/area(ABC) = 4/25.
   area(ADE) = 16 ⇒ trapezium = 100 − 16 = 84.""",
   "Area ratio = (side ratio)².",
   "Similar triangles ADE and ABC.",
   "Using 2/3 as the similarity ratio (AD/DB instead of AD/AB).",
   "Similar figures: areas scale as the square of lengths.",
   check=lambda: 100 - 100 * F(2, 5) ** 2)

qa(G, "Circles", "M", 60,
   "Two circles of radii 5 cm and 3 cm touch each other externally. What is the length of a direct (external) common tangent?",
   2,
   """Distance between centres d = 5 + 3 = 8.
   Direct common tangent = √(d² − (r₁ − r₂)²) = √(64 − 4) = √60 = 2√15 cm.""",
   "For circles touching externally, direct tangent = 2√(r₁r₂) = 2√15.",
   "Draw the tangent and shift it to pass through the smaller centre.",
   "Using (r₁ + r₂)² — that is for the transverse tangent (which is 0 here).",
   "Direct: √(d² − (r₁ − r₂)²); transverse: √(d² − (r₁ + r₂)²).",
   options=["8 cm", "2√17 cm", "2√15 cm", "4√3 cm"],
   check=lambda: "2√15 cm" if abs(sqrt(64 - 4) - 2 * sqrt(15)) < 1e-12 and all(abs(sqrt(60) - v) > 1e-6 for v in (8, 2 * sqrt(17), 4 * sqrt(3))) else None)

qa(G, "Polygons", "M", 60,
   "A convex polygon has 54 diagonals. Each of its interior angles is equal. What is the measure (in degrees) of each interior angle?",
   "150",
   """n(n − 3)/2 = 54 ⇒ n² − 3n − 108 = 0 ⇒ n = 12.
   Exterior angle = 360/12 = 30° ⇒ interior = 150°.""",
   "Try n = 12: 12 × 9/2 = 54 ✓.",
   "Diagonals = n(n − 3)/2.",
   "Using n(n − 1)/2 (that counts sides too).",
   "Interior angle of a regular n-gon = 180 − 360/n.",
   check=lambda: next(180 - F(360, n) for n in range(3, 100) if n * (n - 3) // 2 == 54))

qa(G, "Circles", "E", 45,
   "From a point P that is 13 cm from the centre of a circle of radius 5 cm, a tangent is drawn. What is the length of the tangent?",
   0,
   """Radius ⟂ tangent at the point of contact.
   Tangent = √(13² − 5²) = 12 cm.""",
   "5-12-13 triplet.",
   "The radius meets the tangent at 90°.",
   "Adding instead of subtracting squares.",
   "Tangent length from P = √(d² − r²).",
   options=["12 cm", "8 cm", "18 cm", "√194 cm"],
   check=lambda: str(int(sqrt(13 ** 2 - 5 ** 2))) + " cm")

qa(G, "Triangles", "M", 75,
   "What is the inradius of a triangle with sides 13, 14 and 15 units?",
   3,
   """s = 21; area = √(21 × 8 × 7 × 6) = 84.
   r = area/s = 84/21 = 4.""",
   "Memorise: the 13-14-15 triangle has area 84.",
   "r = Area/s.",
   "Dividing area by the full perimeter (2).",
   "Inradius r = Δ/s; circumradius R = abc/4Δ.",
   options=["3", "6", "3.5", "4"],
   check=lambda: str(int(round(sqrt(21 * 8 * 7 * 6) / 21))))

qa(G, "Circles", "M", 60,
   "An equilateral triangle is inscribed in a circle of radius 6 cm. What is the square of the side of the triangle (in cm²)?",
   "108",
   """For an equilateral triangle, R = a/√3 ⇒ a = 6√3.
   a² = 108.""",
   "a = R√3.",
   "Circumradius of an equilateral triangle is a/√3.",
   "Using the inradius formula a/(2√3) (a = 12√3).",
   "Equilateral: R = a/√3, r = a/(2√3), R = 2r.",
   check=lambda: round((2 * 6 * __import__('math').sin(pi / 3)) ** 2, 6))

qa(G, "Coordinate Geometry", "H", 75,
   "How many points with integer coordinates lie strictly inside the triangle formed by the lines x = 0, y = 0 and x + y = 10?",
   "36",
   """Strictly inside ⇒ x ≥ 1, y ≥ 1, x + y ≤ 9.
   For x = 1 … 8, y can take 9 − x values: 8 + 7 + … + 1 = 36.""",
   "Substitute x = a + 1, y = b + 1: a + b ≤ 7 ⇒ C(9, 2) = 36.",
   "Fix x and count the allowed y values.",
   "Including boundary points on x + y = 10 (gives 45).",
   "Interior lattice points of the triangle x, y > 0, x + y < n: (n − 1)(n − 2)/2.",
   check=lambda: sum(1 for x in range(1, 10) for y in range(1, 10) if x + y < 10))

qa(G, "Coordinate Geometry", "M", 60,
   "What is the area (in square units) of the triangle with vertices (0, 0), (8, 0) and (3, 6)?",
   "24",
   """Base along the x-axis = 8; height = y-coordinate of the third vertex = 6.
   Area = ½ × 8 × 6 = 24.""",
   "When one side lies on an axis, use base × height directly.",
   "Look for a side on an axis.",
   "Using the slanted side as the base.",
   "Shoelace: ½|x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|.",
   check=lambda: F(abs(0 * (0 - 6) + 8 * (6 - 0) + 3 * (0 - 0)), 2))

qa(G, "Quadrilaterals", "E", 45,
   "The diagonals of a rhombus are 16 cm and 12 cm. What is its perimeter?",
   2,
   """Diagonals bisect at right angles: half-diagonals 8 and 6 ⇒ side = 10.
   Perimeter = 40 cm.""",
   "6-8-10 triplet again.",
   "Diagonals of a rhombus are perpendicular bisectors.",
   "Using full diagonals as legs (side 20).",
   "Rhombus side = ½√(d₁² + d₂²).",
   options=["56 cm", "48 cm", "40 cm", "28 cm"],
   check=lambda: str(int(4 * sqrt(8 ** 2 + 6 ** 2))) + " cm")

qa(G, "Circles", "E", 30,
   "An arc of a circle subtends an angle of 110° at the centre. What angle does it subtend at a point on the remaining (major) arc of the circle?",
   0,
   """Inscribed angle = half the central angle on the same arc = 55°.""",
   "Halve the central angle.",
   "Angle at centre = 2 × angle at circumference.",
   "Answering 125° (the angle from a point on the minor arc).",
   "Point on the minor arc sees 180° − 55° = 125°.",
   options=["55°", "110°", "125°", "70°"],
   check=lambda: str(110 // 2) + "°")

# ---------------- Mensuration (3) ----------------
qa(G, "Mensuration", "E", 30,
   "The total surface area of a cube is 150 cm². What is its volume?",
   3,
   """6a² = 150 ⇒ a = 5 ⇒ volume = 125 cm³.""",
   "Divide by 6, take the square root, cube it.",
   "Cube has 6 equal faces.",
   "Using 4 faces (lateral area).",
   "Cube: TSA 6a², volume a³, diagonal a√3.",
   options=["100 cm³", "150 cm³", "216 cm³", "125 cm³"],
   check=lambda: str(next(a for a in range(1, 50) if 6 * a * a == 150) ** 3) + " cm³")

qa(G, "Mensuration", "E", 30,
   "What is the volume (in cm³) of a cylinder of radius 7 cm and height 10 cm? (Take π = 22/7.)",
   "1540",
   """V = πr²h = (22/7) × 49 × 10 = 1,540.""",
   "22 × 7 × 10.",
   "V = πr²h.",
   "Using 2πrh (curved surface area, 440).",
   "Cylinder CSA 2πrh, TSA 2πr(r + h).",
   check=lambda: F(22, 7) * 49 * 10)

qa(G, "Mensuration", "M", 60,
   "A solid metal sphere of radius 6 cm is melted and recast into solid cones of base radius 3 cm and height 4 cm. How many cones are formed?",
   1,
   """Sphere volume = (4/3)π × 216 = 288π.
   Cone volume = (1/3)π × 9 × 4 = 12π.
   Number = 288/12 = 24.""",
   "Cancel π and 1/3 first: (4 × 216)/(9 × 4) = 24.",
   "Volume is conserved when melting.",
   "Comparing surface areas.",
   "Recasting problems: equate volumes.",
   options=["12", "24", "36", "48"],
   check=lambda: str(int(F(4, 3) * 216 / (F(1, 3) * 9 * 4))))

# ---------------- Modern Math (5) ----------------
qa(M, "Permutations", "H", 75,
   "In how many distinct arrangements of the letters of BANANA are no two A's adjacent?",
   "12",
   """Arrange B, N, N first: 3!/2! = 3 ways.
   This creates 4 gaps (_ B _ N _ N _); choose 3 of them for the identical A's: C(4, 3) = 4.
   Total = 3 × 4 = 12.""",
   "Gap method: arrange the others, then drop the restricted letters into gaps.",
   "Place the non-A letters first.",
   "Using total − (all A's together) = 60 − 4 = 56, which still allows two A's to be adjacent.",
   "No two X adjacent ⇒ arrange the rest, choose gaps for X.",
   check=lambda: sum(1 for p in set(permutations("BANANA")) if "AA" not in "".join(p)))

qa(M, "Combinations", "E", 45,
   "In how many ways can a committee of 3 men and 2 women be chosen from 6 men and 5 women?",
   "200",
   """C(6, 3) × C(5, 2) = 20 × 10 = 200.""",
   "Independent choices multiply.",
   "Choose men and women separately.",
   "Adding the two counts (30).",
   "AND ⇒ multiply; OR ⇒ add.",
   check=lambda: sum(1 for m in combinations(range(6), 3) for w in combinations(range(5), 2)))

qa(M, "Probability", "H", 90,
   "Three different numbers are chosen at random from 1, 2, …, 10. What is the probability that they can be arranged to form an arithmetic progression?",
   0,
   """Total selections = C(10, 3) = 120.
   AP triples {a, a + d, a + 2d} ≤ 10: d = 1 → 8, d = 2 → 6, d = 3 → 4, d = 4 → 2. Total 20.
   Probability = 20/120 = 1/6.""",
   "Equivalently, count pairs (first, last) of the same parity: the middle is fixed. Odd pairs C(5,2) + even pairs C(5,2) = 20.",
   "The middle term is the average of the other two.",
   "Counting ordered triples in the numerator but unordered in the denominator.",
   "a, b, c in AP ⇔ a + c = 2b ⇔ a and c have the same parity.",
   options=["1/6", "1/5", "1/8", "1/10"],
   check=lambda: F(sum(1 for c in combinations(range(1, 11), 3) if c[0] + c[2] == 2 * c[1]), comb(10, 3)))

qa(M, "Combinations", "M", 60,
   "In how many ways can 10 identical chocolates be distributed among 3 children so that each child gets at least 2?",
   "15",
   """Give 2 to each first; 4 remain to be distributed freely.
   Non-negative solutions of a + b + c = 4: C(6, 2) = 15.""",
   "Pre-allocate the minimum, then stars and bars.",
   "Hand out the compulsory 2 each first.",
   "Using C(9, 2) = 36 (at least 1 each).",
   "x₁ + … + x_r = n, xᵢ ≥ 0: C(n + r − 1, r − 1).",
   check=lambda: sum(1 for a in range(11) for b in range(11) for c in range(11) if a + b + c == 10 and min(a, b, c) >= 2))

qa(M, "Probability", "M", 75,
   "A bag contains 5 red and 4 blue balls. Three balls are drawn at random without replacement. What is the probability that exactly two of them are red?",
   2,
   """Favourable = C(5, 2) × C(4, 1) = 10 × 4 = 40.
   Total = C(9, 3) = 84.
   P = 40/84 = 10/21.""",
   "Hypergeometric: choose reds and blues separately.",
   "Count favourable selections, not sequences.",
   "Mixing ordered numerator with unordered denominator.",
   "P = C(R, r)C(B, b)/C(R + B, r + b).",
   options=["5/21", "20/63", "10/21", "4/9"],
   check=lambda: F(sum(1 for c in combinations(range(9), 3) if sum(1 for i in c if i < 5) == 2), comb(9, 3)))
