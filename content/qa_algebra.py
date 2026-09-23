from fractions import Fraction as F
from math import isqrt, log10, sqrt
from itertools import product
from common import qa

AL = "Algebra"

# ---------------- Linear equations (6) ----------------
qa(AL, "Linear Equations", "E", 60,
   "3 pens and 2 notebooks cost ₹110, while 2 pens and 3 notebooks cost ₹115. What is the cost of one notebook?",
   2,
   """Adding: 5p + 5n = 225 ⇒ p + n = 45.
   Subtracting: n − p = 5.
   n = (45 + 5)/2 = ₹25.""",
   "Add and subtract the equations instead of substituting.",
   "The equations are symmetric; use their sum and difference.",
   "Solving for the pen (₹20) and reporting it.",
   "Symmetric linear pairs: add for the sum, subtract for the difference.",
   options=["₹20", "₹22", "₹25", "₹30"],
   check=lambda: "₹" + str(next(n for p in range(1, 60) for n in range(1, 60) if 3 * p + 2 * n == 110 and 2 * p + 3 * n == 115)))

qa(AL, "Linear Equations", "M", 75,
   "How many two-digit numbers are exactly four times the sum of their digits?",
   "4",
   """10a + b = 4(a + b) ⇒ 6a = 3b ⇒ b = 2a.
   a = 1, 2, 3, 4 give 12, 24, 36, 48 (a = 5 gives b = 10, invalid).
   Answer: 4.""",
   "Reduce to b = 2a and count the valid digits.",
   "Write the number as 10a + b.",
   "Including a = 0 (not two-digit) or a = 5 (b = 10 is not a digit).",
   "Digit problems: remember 1 ≤ a ≤ 9, 0 ≤ b ≤ 9.",
   check=lambda: sum(1 for n in range(10, 100) if n == 4 * (n // 10 + n % 10)))

qa(AL, "Linear Equations", "E", 45,
   "A purse contains 50 coins, all of ₹1 and ₹2 denominations, with a total value of ₹74. How many ₹2 coins are there?",
   1,
   """x + y = 50 and x + 2y = 74 ⇒ y = 24.""",
   "If all were ₹1 coins the value would be 50; each ₹2 coin adds ₹1 extra ⇒ 24.",
   "Assume all coins are ₹1 first.",
   "Answering the ₹1 count (26).",
   "Assumption method: excess value ÷ excess per item.",
   options=["26", "24", "25", "22"],
   check=lambda: 74 - 50)

qa(AL, "Linear Equations", "M", 60,
   "How many ordered pairs of non-negative integers (x, y) satisfy 2x + 3y = 30?",
   "6",
   """2x = 30 − 3y must be even and non-negative ⇒ y even, 0 ≤ y ≤ 10.
   y ∈ {0, 2, 4, 6, 8, 10} ⇒ 6 solutions.""",
   "y steps by 2 (coefficient of x) from 0 to 10.",
   "Which values of y keep 30 − 3y even?",
   "Excluding zero values (would give 4).",
   "Solutions of ax + by = c step by b in x and a in y.",
   check=lambda: sum(1 for x in range(0, 16) for y in range(0, 11) if 2 * x + 3 * y == 30))

qa(AL, "Linear Equations", "H", 90,
   "x, y and z are positive integers such that x + y + z = 12 and x + 2y + 3z = 20. How many ordered triples (x, y, z) are possible?",
   1,
   """Subtract: y + 2z = 8 ⇒ (y, z) = (6, 1), (4, 2), (2, 3).
   Then x = 12 − y − z = 5, 6, 7, all positive.
   (y, z) = (0, 4) is excluded because y must be positive. Answer: 3.""",
   "Eliminate x immediately by subtracting.",
   "Subtract the first equation from the second.",
   "Counting (0, 4) and answering 4.",
   "Always re-check positivity of the eliminated variable.",
   options=["2", "3", "4", "5"],
   check=lambda: sum(1 for x in range(1, 13) for y in range(1, 13) for z in range(1, 13) if x + y + z == 12 and x + 2 * y + 3 * z == 20))

qa(AL, "Linear Equations", "E", 60,
   "The sum of the present ages of a father and his son is 50 years. Five years ago the father was seven times as old as the son. What is the son's present age (in years)?",
   "10",
   """f + s = 50; f − 5 = 7(s − 5).
   (50 − s) − 5 = 7s − 35 ⇒ 80 = 8s ⇒ s = 10.""",
   "Five years ago their ages summed to 40 in ratio 7:1 ⇒ son was 5, now 10.",
   "Look at the sum of ages five years ago.",
   "Reporting the son's age five years ago (5).",
   "Shift the sum by the number of people × years.",
   check=lambda: next(s for s in range(1, 50) if (50 - s) - 5 == 7 * (s - 5)))

# ---------------- Inequalities & Modulus (5) ----------------
qa(AL, "Inequalities & Modulus", "E", 45,
   "How many integers x satisfy |x − 3| < 5?",
   2,
   """−5 < x − 3 < 5 ⇒ −2 < x < 8.
   Integers −1 to 7 ⇒ 9 values.""",
   "Open interval of width 10 around 3 contains 2 × 5 − 1 = 9 integers.",
   "Remove the modulus as a double inequality.",
   "Including the endpoints −2 and 8 (strict inequality).",
   "|x − a| < b ⇔ a − b < x < a + b.",
   options=["10", "11", "9", "8"],
   check=lambda: sum(1 for x in range(-50, 50) if abs(x - 3) < 5))

qa(AL, "Inequalities & Modulus", "E", 45,
   "How many integer values of x satisfy x² − 7x + 10 < 0?",
   "2",
   """x² − 7x + 10 = (x − 2)(x − 5) < 0 ⇒ 2 < x < 5.
   Integers: 3, 4 ⇒ 2 values.""",
   "Upward parabola is negative strictly between its roots.",
   "Factorise the quadratic.",
   "Including 2 and 5 where the expression is 0.",
   "(x − a)(x − b) < 0 ⇒ between a and b.",
   check=lambda: sum(1 for x in range(-50, 50) if x * x - 7 * x + 10 < 0))

qa(AL, "Inequalities & Modulus", "M", 60,
   "What is the minimum value of |x − 1| + |x − 4| + |x − 10| over all real x?",
   3,
   """The sum of distances is minimised at the median point x = 4.
   Value = 3 + 0 + 6 = 9.""",
   "Minimum of Σ|x − aᵢ| occurs at the median of the aᵢ.",
   "Think of distances on a number line.",
   "Using the mean (5): gives 4 + 1 + 5 = 10.",
   "Sum of absolute deviations is minimised at the median.",
   options=["10", "6", "8", "9"],
   check=lambda: min(abs(F(x, 10) - 1) + abs(F(x, 10) - 4) + abs(F(x, 10) - 10) for x in range(-100, 200)))

qa(AL, "Inequalities & Modulus", "M", 75,
   "How many ordered pairs of integers (x, y) satisfy |x| + |y| ≤ 3?",
   "25",
   """For |x| = 0, 1, 2, 3, |y| can go up to 3, 2, 1, 0.
   Count: x = 0 → 7; x = ±1 → 5 each; x = ±2 → 3 each; x = ±3 → 1 each.
   Total = 7 + 10 + 6 + 2 = 25.""",
   "Lattice points in |x| + |y| ≤ n = 2n² + 2n + 1 = 25 for n = 3.",
   "Fix x and count y.",
   "Counting only the first quadrant and multiplying by 4 (double-counts the axes).",
   "Diamond lattice count: 2n² + 2n + 1.",
   check=lambda: sum(1 for x in range(-5, 6) for y in range(-5, 6) if abs(x) + abs(y) <= 3))

qa(AL, "Inequalities & Modulus", "H", 90,
   "If x and y are positive real numbers with x + y = 10, what is the maximum value of x²y?",
   0,
   """Write 10 = x/2 + x/2 + y. By AM–GM, (x/2)(x/2)(y) ≤ (10/3)³.
   Equality at x/2 = y = 10/3 ⇒ x = 20/3, y = 10/3.
   x²y = (400/9)(10/3) = 4000/27.""",
   "Split x into two equal halves so that all three parts can be equal.",
   "Use AM–GM with three terms.",
   "Setting x = y = 5 (gives 125, not the maximum).",
   "For max xᵃyᵇ with x + y fixed: x : y = a : b.",
   options=["4000/27", "1000/9", "500/3", "4000/9"],
   check=lambda: max((F(k, 300) ** 2 * (10 - F(k, 300)) for k in range(1, 3000)), key=lambda v: v))

# ---------------- Quadratic equations (6) ----------------
qa(AL, "Quadratic Equations", "E", 45,
   "The roots of x² − 5x + k = 0 differ by 1. What is k?",
   1,
   """Roots sum to 5 and differ by 1 ⇒ roots are 2 and 3.
   k = product = 6.""",
   "(α − β)² = 25 − 4k = 1 ⇒ k = 6.",
   "Use sum and difference of roots.",
   "Using (α − β) = 1 as (α − β)² = 1 without the 4k term correctly.",
   "(α − β)² = (α + β)² − 4αβ.",
   options=["4", "6", "5", "7"],
   check=lambda: next(k for k in range(-20, 20) if 25 - 4 * k == 1))

qa(AL, "Quadratic Equations", "E", 45,
   "If α and β are the roots of x² − 6x + 4 = 0, what is α² + β²?",
   "28",
   """α + β = 6, αβ = 4.
   α² + β² = 36 − 8 = 28.""",
   "(sum)² − 2(product).",
   "Don't solve for the roots.",
   "Computing (sum)² − product (32).",
   "Symmetric functions of roots via Vieta.",
   check=lambda: round((3 + sqrt(5)) ** 2 + (3 - sqrt(5)) ** 2, 6))

qa(AL, "Quadratic Equations", "M", 60,
   "For how many integer values of m in the range −10 ≤ m ≤ 10 does the equation x² + mx + 9 = 0 have real roots?",
   "10",
   """Real roots ⇒ m² − 36 ≥ 0 ⇒ |m| ≥ 6.
   m ∈ {−10, …, −6} ∪ {6, …, 10} ⇒ 5 + 5 = 10 values.""",
   "Count |m| from 6 to 10, doubled.",
   "Apply the discriminant condition.",
   "Using strict inequality and dropping ±6 (gives 8).",
   "Real roots ⇔ D ≥ 0 (equal roots included).",
   check=lambda: sum(1 for m in range(-10, 11) if m * m - 36 >= 0))

qa(AL, "Quadratic Equations", "M", 75,
   "One root of x² + px + 12 = 0 is 4, and the equation x² + px + q = 0 has equal roots. What is q?",
   0,
   """16 + 4p + 12 = 0 ⇒ p = −7.
   Equal roots ⇒ p² = 4q ⇒ q = 49/4.""",
   "Get p from the known root, then D = 0.",
   "Substitute x = 4 in the first equation.",
   "Assuming the second equation also has root 4 (q = 12).",
   "Equal roots: q = p²/4.",
   options=["49/4", "12", "7/2", "49/2"],
   check=lambda: F((-(16 + 12) // 4) ** 2, 4))

qa(AL, "Quadratic Equations", "H", 90,
   "For how many integer values of k with |k| ≤ 12 does the equation x² + kx + 16 = 0 have two distinct negative real roots?",
   "4",
   """Distinct real roots: k² > 64 ⇒ |k| > 8.
   Both negative: sum = −k < 0 ⇒ k > 0; product = 16 > 0 ✓.
   k ∈ {9, 10, 11, 12} ⇒ 4 values.""",
   "Sign of the sum decides the sign of k.",
   "Check discriminant, sum and product of roots.",
   "Counting k = −9 … −12 too (those give positive roots).",
   "Both roots negative ⇔ D ≥ 0, sum < 0, product > 0.",
   check=lambda: sum(1 for k in range(-12, 13) if k * k - 64 > 0 and (-k + sqrt(k * k - 64)) / 2 < 0))

qa(AL, "Quadratic Equations", "E", 45,
   "If the roots of x² − bx + c = 0 are two consecutive integers, what is the value of b² − 4c?",
   2,
   """Roots n and n + 1: b = 2n + 1, c = n(n + 1).
   b² − 4c = 4n² + 4n + 1 − 4n² − 4n = 1.""",
   "b² − 4c = (difference of roots)² = 1.",
   "Discriminant equals the square of the root difference.",
   "Answering 0 (confusing with equal roots).",
   "D = (α − β)² for monic quadratics.",
   options=["0", "2", "1", "4"],
   check=lambda: {(2 * n + 1) ** 2 - 4 * n * (n + 1) for n in range(-20, 20)}.pop())

# ---------------- Logarithms, Surds & Indices (6) ----------------
qa(AL, "Logarithms, Surds & Indices", "H", 90,
   "How many integers n satisfy log₂ n + log₂ (20 − n) > 6?",
   "11",
   """Domain: 0 < n < 20.
   log₂[n(20 − n)] > 6 ⇒ n(20 − n) > 64 ⇒ n² − 20n + 64 < 0 ⇒ (n − 4)(n − 16) < 0.
   4 < n < 16 ⇒ n = 5, …, 15 ⇒ 11 integers.""",
   "Combine the logs, drop the base, factorise.",
   "Use log a + log b = log ab and check the domain.",
   "Including 4 and 16 (equality, not >) or ignoring the domain.",
   "Log inequalities: fix the domain first, then drop the log (base > 1 keeps the sign).",
   check=lambda: sum(1 for n in range(1, 20) if n * (20 - n) > 64))

qa(AL, "Logarithms, Surds & Indices", "E", 45,
   "If 2^(x+1) + 2^x = 96, what is x?",
   "5",
   """2^x(2 + 1) = 96 ⇒ 2^x = 32 ⇒ x = 5.""",
   "Factor out the smallest power.",
   "2^(x+1) = 2 · 2^x.",
   "Adding exponents: 2^(2x+1) = 96.",
   "aᵐ + aⁿ cannot be combined into one power — factor instead.",
   check=lambda: next(x for x in range(0, 20) if 2 ** (x + 1) + 2 ** x == 96))

qa(AL, "Logarithms, Surds & Indices", "M", 60,
   "Given log₁₀ 2 = 0.3010, how many digits does 2⁵⁰ have?",
   1,
   """log₁₀ 2⁵⁰ = 50 × 0.3010 = 15.05.
   Number of digits = ⌊15.05⌋ + 1 = 16.""",
   "Digits = floor(log) + 1.",
   "The characteristic of the log tells the digit count.",
   "Answering 15 (forgetting +1).",
   "N has ⌊log₁₀ N⌋ + 1 digits.",
   options=["15", "16", "17", "50"],
   check=lambda: len(str(2 ** 50)))

qa(AL, "Logarithms, Surds & Indices", "M", 60,
   "√(12 + 2√35) equals",
   0,
   """Seek a + b = 12, ab = 35 ⇒ a = 7, b = 5.
   √(12 + 2√35) = √7 + √5.""",
   "√(a + b + 2√ab) = √a + √b.",
   "Find two numbers with sum 12 and product 35.",
   "Picking √10 + √2 (sum 12 but product 20).",
   "Nested surd: √(x + 2√y) = √a + √b with a + b = x, ab = y.",
   options=["√7 + √5", "√6 + √6", "√10 + √2", "2√3 + √5"],
   check=lambda: "√7 + √5" if abs(sqrt(12 + 2 * sqrt(35)) - (sqrt(7) + sqrt(5))) < 1e-12 and all(abs(sqrt(12 + 2 * sqrt(35)) - v) > 1e-6 for v in (2 * sqrt(6), sqrt(10) + sqrt(2), 2 * sqrt(3) + sqrt(5))) else None)

qa(AL, "Logarithms, Surds & Indices", "M", 75,
   "If log₂ x + log₄ x + log₁₆ x = 7, what is x?",
   "16",
   """log₄ x = (log₂ x)/2, log₁₆ x = (log₂ x)/4.
   log₂ x (1 + 1/2 + 1/4) = 7 ⇒ log₂ x × 7/4 = 7 ⇒ log₂ x = 4 ⇒ x = 16.""",
   "Convert all to base 2.",
   "log_{bⁿ} x = (1/n) log_b x.",
   "Multiplying instead of dividing by n when changing base.",
   "Change of base: log_{a^k} x = (log_a x)/k.",
   check=lambda: next(x for x in range(1, 100000) if abs(log10(x) / log10(2) * 1.75 - 7) < 1e-9))

qa(AL, "Logarithms, Surds & Indices", "M", 75,
   "What is the sum of all real values of x satisfying 3^(2x) − 10·3^x + 9 = 0?",
   0,
   """Let t = 3^x: t² − 10t + 9 = 0 ⇒ t = 1 or 9.
   x = 0 or 2 ⇒ sum = 2.""",
   "Product of t-roots = 9 = 3^(x₁ + x₂) ⇒ x₁ + x₂ = 2.",
   "Substitute t = 3^x.",
   "Reporting the sum of t-values (10).",
   "Exponential quadratics: product of t-roots gives sum of x-roots.",
   options=["2", "1", "3", "0"],
   check=lambda: sum(x for x in range(-10, 10) if 3 ** (2 * x) - 10 * 3 ** x + 9 == 0))

# ---------------- Functions & Graphs (4) ----------------
qa(AL, "Functions & Graphs", "H", 75,
   "For how many integer values of x is |x − 2| + |x + 3| = 5?",
   "6",
   """|x − 2| + |x + 3| is the sum of distances from x to 2 and to −3.
   The two points are 5 apart, so the sum equals 5 exactly when x lies between them: −3 ≤ x ≤ 2.
   Integers: −3, −2, −1, 0, 1, 2 ⇒ 6.""",
   "Sum of distances equals the gap ⇔ x is between the points.",
   "Interpret each modulus as a distance on the number line.",
   "Solving only at the critical points and reporting 2 solutions.",
   "|x − a| + |x − b| ≥ |a − b|, with equality on [a, b].",
   check=lambda: sum(1 for x in range(-100, 100) if abs(x - 2) + abs(x + 3) == 5))

qa(AL, "Functions & Graphs", "E", 45,
   "A function satisfies f(x + y) = f(x) + f(y) for all real x, y, and f(1) = 3. What is f(5)?",
   "15",
   """f(2) = 2f(1), …, f(5) = 5f(1) = 15.""",
   "Additive functions on integers are linear: f(n) = n·f(1).",
   "Build f(5) from f(1) repeatedly.",
   "Guessing f(5) = f(1)⁵.",
   "Cauchy's equation: f(n) = n f(1) for integers n.",
   check=lambda: 5 * 3)

qa(AL, "Functions & Graphs", "M", 60,
   "What is the minimum value of f(x) = max(2x + 1, 7 − x) over all real x?",
   3,
   """The max of an increasing and a decreasing line is smallest where they cross.
   2x + 1 = 7 − x ⇒ x = 2 ⇒ f = 5.""",
   "Minimum of max(increasing, decreasing) is at their intersection.",
   "Sketch the two lines.",
   "Minimising each line separately.",
   "min max(…) of opposite-slope lines occurs at intersection.",
   options=["3", "7", "1", "5"],
   check=lambda: min(max(2 * F(x, 100) + 1, 7 - F(x, 100)) for x in range(-1000, 1000)))

qa(AL, "Functions & Graphs", "H", 90,
   "A function f satisfies f(x) + 2f(1 − x) = 3x for all real x. What is f(0)?",
   "2",
   """x = 0: f(0) + 2f(1) = 0.
   x = 1: f(1) + 2f(0) = 3 ⇒ f(1) = 3 − 2f(0).
   f(0) + 6 − 4f(0) = 0 ⇒ f(0) = 2.""",
   "Substitute x and 1 − x to get two equations.",
   "Put x = 0 and x = 1.",
   "Substituting only once and stalling with two unknowns.",
   "Functional equations with x and (1 − x): substitute both.",
   check=lambda: next(F(a, 2) for a in range(-40, 41) if F(a, 2) + 2 * (3 - 2 * F(a, 2)) == 0))

# ---------------- Progressions & Series (6) ----------------
P = "Progressions & Series"
qa(AL, P, "M", 60,
   "What is the value of 1/(1·3) + 1/(3·5) + 1/(5·7) + … + 1/(19·21)?",
   1,
   """1/((2k − 1)(2k + 1)) = ½[1/(2k − 1) − 1/(2k + 1)].
   The sum telescopes: ½(1 − 1/21) = ½ × 20/21 = 10/21.""",
   "Telescoping: ½(first − last reciprocal).",
   "Split each term into partial fractions.",
   "Forgetting the factor ½ (20/21).",
   "1/(a·b) with b − a = d ⇒ (1/d)(1/a − 1/b).",
   options=["20/21", "10/21", "1/2", "11/21"],
   check=lambda: sum(F(1, (2 * k - 1) * (2 * k + 1)) for k in range(1, 11)))

qa(AL, P, "E", 60,
   "What is the sum of all two-digit numbers that are divisible by 7?",
   "728",
   """Terms: 14, 21, …, 98 ⇒ n = (98 − 14)/7 + 1 = 13.
   Sum = 13 × (14 + 98)/2 = 728.""",
   "n × average of first and last.",
   "First is 14, last is 98.",
   "Starting from 7 (not two-digit).",
   "AP sum = n(first + last)/2.",
   check=lambda: sum(x for x in range(10, 100) if x % 7 == 0))

qa(AL, P, "M", 60,
   "In a geometric progression the 3rd term is 12 and the 6th term is 96. What is the sum of the first five terms?",
   2,
   """r³ = 96/12 = 8 ⇒ r = 2; a = 12/4 = 3.
   S₅ = 3(2⁵ − 1) = 93.""",
   "3 + 6 + 12 + 24 + 48 = 93.",
   "Divide T₆ by T₃.",
   "Using r = 8 (forgetting the cube root).",
   "Tₙ = arⁿ⁻¹; Sₙ = a(rⁿ − 1)/(r − 1).",
   options=["96", "189", "93", "45"],
   check=lambda: sum(3 * 2 ** k for k in range(5)))

qa(AL, P, "E", 45,
   "The sum of an infinite geometric progression is 20 and its first term is 5. What is its common ratio? (Enter as a decimal.)",
   "0.75",
   """5/(1 − r) = 20 ⇒ 1 − r = 0.25 ⇒ r = 0.75.""",
   "a/S = 1 − r.",
   "Use S∞ = a/(1 − r).",
   "Answering 0.25 (that is 1 − r).",
   "S∞ exists only for |r| < 1.",
   check=lambda: 1 - F(5, 20))

qa(AL, P, "M", 60,
   "What is the value of 1·2 + 2·3 + 3·4 + … + 10·11?",
   0,
   """Σ k(k + 1) = n(n + 1)(n + 2)/3 = 10 × 11 × 12/3 = 440.""",
   "Product of three consecutive integers ÷ 3.",
   "k(k + 1) = k² + k.",
   "Using n(n + 1)(2n + 1)/6 only (385).",
   "Σk(k + 1) = n(n + 1)(n + 2)/3.",
   options=["440", "385", "495", "330"],
   check=lambda: sum(k * (k + 1) for k in range(1, 11)))

qa(AL, P, "H", 75,
   "The first term of an arithmetic progression is 24, and the sum of its first 10 terms equals the sum of its first 15 terms. What is the common difference?",
   "-2",
   """S₁₀ = S₁₅ ⇒ T₁₁ + … + T₁₅ = 0 ⇒ middle term T₁₃ = 0.
   24 + 12d = 0 ⇒ d = −2.""",
   "Sₘ = Sₙ ⇒ T at position (m + n + 1)/2 is 0.",
   "Terms 11 to 15 must add up to zero.",
   "Setting T₁₅ = 0 instead of the middle term T₁₃ (gives d = −12/7).",
   "Sₘ = Sₙ ⇒ S_(m+n) = 0.",
   check=lambda: next(F(d, 2) for d in range(-40, 40) if sum(24 + k * F(d, 2) for k in range(10)) == sum(24 + k * F(d, 2) for k in range(15))))
