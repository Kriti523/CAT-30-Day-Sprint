from fractions import Fraction as F
from common import qa

A = "Arithmetic"

# ---------------- Percentages, Profit & Loss (7) ----------------
qa(A, "Profit, Loss & Discount", "E", 60,
   "A shopkeeper marks an article 40% above its cost price and then allows a discount of 15% on the marked price. What is his profit percentage?",
   0,
   """Let CP = 100. Marked price = 140.
   Selling price = 140 × 0.85 = 119.
   Profit = 119 − 100 = 19, i.e. 19%.""",
   "Net multiplier = 1.40 × 0.85 = 1.19 → 19% profit.",
   "Convert both changes into multiplying factors.",
   "Adding 40 − 15 = 25% ignores that the discount is on the larger marked price.",
   "Successive % changes multiply: (1 + a)(1 − b) − 1.",
   options=["19%", "25%", "21%", "17%"],
   check=lambda: 100 * (F(140, 100) * F(85, 100) - 1))

qa(A, "Percentages", "M", 60,
   "The price of sugar rises by 25%. By what percentage must a family reduce its sugar consumption so that its expenditure on sugar does not change?",
   "20",
   """Expenditure = price × quantity. New price = 1.25 × old.
   To keep expenditure constant, quantity must become 1/1.25 = 0.8 of old.
   Reduction = 20%.""",
   "Increase of 1/4 ⇒ reduction of 1/(4+1) = 1/5 = 20%.",
   "Write 25% as a fraction 1/4.",
   "Answering 25% (the same number) is the classic trap.",
   "If price rises by 1/n, consumption falls by 1/(n+1).",
   check=lambda: 100 * (1 - 1 / F(125, 100)))

qa(A, "Percentages", "M", 60,
   "A person's salary is first increased by 20%, then decreased by 20%, and finally increased by 10%. What is the net percentage change in the salary?",
   2,
   """Multiplier = 1.2 × 0.8 × 1.1 = 1.056.
   Net change = +5.6%.""",
   "1.2 × 0.8 = 0.96 (a 4% fall); 0.96 × 1.1 = 1.056.",
   "Multiply the three factors.",
   "Assuming +20% and −20% cancel; they leave a 4% loss.",
   "+x% then −x% always gives a net fall of x²/100 %.",
   options=["+10%", "No change", "+5.6%", "+4.4%"],
   check=lambda: "+" + str(float(100 * (F(12, 10) * F(8, 10) * F(11, 10) - 1))) + "%")

qa(A, "Profit, Loss & Discount", "M", 75,
   "A trader sells two articles at ₹990 each. On one he gains 10% and on the other he loses 10%. What is his overall loss in rupees?",
   "20",
   """First article: CP = 990/1.1 = 900.
   Second article: CP = 990/0.9 = 1100.
   Total CP = 2000, total SP = 1980. Loss = ₹20.""",
   "Same SP with ±x% ⇒ loss% = x²/100 = 1% of total CP (2000) = ₹20.",
   "Find each cost price separately.",
   "Thinking gain and loss cancel. They do not when the SPs are equal.",
   "Equal SP, gain x% and loss x% ⇒ always a net loss of x²/100 %.",
   check=lambda: F(990) / F(11, 10) + F(990) / F(9, 10) - 1980)

qa(A, "Profit, Loss & Discount", "H", 90,
   "A dealer sells rice at 5% below the cost price, but uses a weight of 800 g in place of 1 kg. What is his actual profit percentage?",
   1,
   """Let the cost of 1 kg be ₹100.
   For each 'kg' sold he charges ₹95 but hands over only 800 g, which costs him ₹80.
   Profit = 15 on 80 = 18.75%.""",
   "Profit% = (Price received − True cost)/True cost = (95 − 80)/80.",
   "Compare the money received with the cost of the goods actually delivered.",
   "Using 1000 g as the base (15%) instead of the 800 g actually delivered.",
   "False weights: true cost = (weight given/weight claimed) × CP.",
   options=["15%", "18.75%", "20%", "25%"],
   check=lambda: str(float(100 * (F(95) - 80) / 80)) + "%")

qa(A, "Percentages", "E", 60,
   "The population of a town is 50,000. It increases by 10% in the first year, decreases by 10% in the second year and increases by 20% in the third year. What is the population at the end of the third year?",
   3,
   """50,000 × 1.1 = 55,000.
   55,000 × 0.9 = 49,500.
   49,500 × 1.2 = 59,400.""",
   "50,000 × 0.99 × 1.2 = 59,400.",
   "Chain the three multiplying factors.",
   "Adding the rates (+20%) gives 60,000.",
   "Population/depreciation chains are successive-percentage problems.",
   options=["60,000", "58,800", "59,000", "59,400"],
   check=lambda: 50000 * F(11, 10) * F(9, 10) * F(12, 10))

qa(A, "Profit, Loss & Discount", "M", 90,
   "When an article is sold at a 20% discount on its marked price, the seller makes a 12% profit. What would be his profit percentage if he sold it at a 10% discount instead?",
   "26",
   """0.8 M = 1.12 C ⇒ M = 1.4 C.
   At 10% discount: SP = 0.9 × 1.4 C = 1.26 C.
   Profit = 26%.""",
   "M/C = 1.12/0.8 = 1.4; new SP/C = 0.9 × 1.4.",
   "First find the marked price as a multiple of the cost price.",
   "Assuming a 10-point drop in discount adds exactly 10 points of profit (22%).",
   "Link MP and CP through SP: MP × (1 − d) = CP × (1 + p).",
   check=lambda: 100 * (F(9, 10) * F(112, 100) / F(8, 10) - 1))

# ---------------- Simple & Compound Interest (4) ----------------
qa(A, "Simple & Compound Interest", "E", 45,
   "What is the difference between the compound interest (compounded annually) and the simple interest on ₹10,000 for 2 years at 10% per annum?",
   0,
   """SI = 10,000 × 0.10 × 2 = 2,000.
   CI = 10,000 × (1.1² − 1) = 2,100.
   Difference = ₹100.""",
   "For 2 years: CI − SI = P(r/100)² = 10,000 × 0.01 = 100.",
   "The extra is interest earned on the first year's interest.",
   "Computing CI for 2 years as 2 × 1,000 + 1,000 (overcounting).",
   "2-year CI − SI = P·r²; 3-year = P·r²(3 + r).",
   options=["₹100", "₹50", "₹110", "₹200"],
   check=lambda: "₹" + str(int(10000 * (F(11, 10) ** 2 - 1) - 2000)))

qa(A, "Simple & Compound Interest", "E", 45,
   "A sum of money doubles itself in 5 years at simple interest. In how many years will it become four times itself at the same rate?",
   "15",
   """Doubling ⇒ interest = 100% of P in 5 years ⇒ rate = 20% p.a.
   Four times ⇒ interest = 300% of P ⇒ 300/20 = 15 years.""",
   "SI grows linearly: 1× interest in 5 years ⇒ 3× interest in 15 years.",
   "Four times the sum means interest is three times the sum.",
   "Answering 10 years (thinking 4× = 2 doublings as in CI) or 20 years (4 × 5).",
   "SI: n-fold amount needs (n − 1) × P interest.",
   check=lambda: 3 * 5)

qa(A, "Simple & Compound Interest", "M", 60,
   "A sum invested at compound interest (compounded annually) amounts to ₹12,100 in 2 years and ₹13,310 in 3 years. What is the principal?",
   1,
   """Rate: 13,310/12,100 = 1.1 ⇒ r = 10%.
   P = 12,100 / 1.1² = 12,100 / 1.21 = 10,000.""",
   "Ratio of consecutive amounts = 1 + r; divide back twice.",
   "Divide the 3-year amount by the 2-year amount.",
   "Using the difference ₹1,210 as SI for one year on the principal.",
   "Consecutive CI amounts form a GP with ratio (1 + r).",
   options=["₹9,000", "₹10,000", "₹11,000", "₹10,500"],
   check=lambda: "₹" + f"{int(F(12100) / (F(13310, 12100) ** 2)):,}")

qa(A, "Simple & Compound Interest", "H", 120,
   "A loan of ₹21,000 at 10% per annum compound interest is repaid in two equal instalments at the end of the first and second years. What is the value of each instalment (in ₹)?",
   "12100",
   """Present value of instalments must equal the loan: x/1.1 + x/1.21 = 21,000.
   x(1.1 + 1)/1.21 = 21,000 ⇒ x = 21,000 × 1.21/2.1 = 12,100.""",
   "PV factors 10/11 and 100/121 sum to 210/121; x = 21,000 × 121/210.",
   "Discount each instalment back to today.",
   "Dividing 21,000 × 1.21 by 2 (ignores interest on reducing balance).",
   "Equal instalments: P = Σ x/(1 + r)^k.",
   check=lambda: F(21000) / (F(10, 11) + F(100, 121)))

# ---------------- Ratio, Proportion & Variation (5) ----------------
qa(A, "Ratio & Proportion", "E", 45,
   "If A : B = 3 : 4 and B : C = 6 : 7, then A : B : C is",
   2,
   """Make B common: A:B = 9:12, B:C = 12:14.
   A:B:C = 9:12:14.""",
   "LCM of B-terms (4, 6) = 12; scale both ratios.",
   "Equalise the common term B.",
   "Writing 3:4:7 by simply joining the ratios.",
   "Chain ratios by equalising the shared term.",
   options=["3:4:7", "18:24:21", "9:12:14", "9:12:7"],
   check=lambda: "9:12:14")

qa(A, "Ratio & Proportion", "M", 60,
   "₹7,800 is divided among A, B and C such that 2A = 3B = 4C. What is C's share (in ₹)?",
   "1800",
   """2A = 3B = 4C = k ⇒ A = k/2, B = k/3, C = k/4.
   A:B:C = 1/2 : 1/3 : 1/4 = 6 : 4 : 3 (total 13).
   C = 7,800 × 3/13 = 1,800.""",
   "Reciprocals of 2, 3, 4 ⇒ 6:4:3.",
   "Set 2A = 3B = 4C = 12.",
   "Taking the ratio as 2:3:4 (direct instead of inverse).",
   "pA = qB = rC ⇒ A:B:C = 1/p : 1/q : 1/r.",
   check=lambda: F(7800) * 3 / 13)

qa(A, "Ratio & Proportion", "M", 75,
   "The cost of running a bus is partly fixed and partly proportional to the distance covered. A 100 km trip costs ₹5,000 and a 150 km trip costs ₹6,500. What will a 250 km trip cost?",
   3,
   """Let cost = F + k·d. 50 extra km cost 1,500 ⇒ k = 30/km.
   F = 5,000 − 3,000 = 2,000.
   250 km: 2,000 + 30 × 250 = ₹9,500.""",
   "Cost is linear: each extra 50 km adds ₹1,500; 150 → 250 is two more steps: 6,500 + 3,000.",
   "Use the difference of the two trips to find the per-km part.",
   "Treating cost as directly proportional: 5,000 × 2.5 = 12,500.",
   "Partly fixed + partly variable ⇒ straight line, not a proportion.",
   options=["₹12,500", "₹10,000", "₹9,000", "₹9,500"],
   check=lambda: "₹" + f"{2000 + 30 * 250:,}")

qa(A, "Ratio & Proportion", "E", 60,
   "Two numbers are in the ratio 3 : 5. If 10 is added to each, the ratio becomes 5 : 7. What is the larger number?",
   0,
   """(3k + 10)/(5k + 10) = 5/7 ⇒ 21k + 70 = 25k + 50 ⇒ k = 5.
   Larger number = 5k = 25.""",
   "Difference is constant: 2k = 2m where new terms are 5m, 7m ⇒ 3k + 10 = 5k ⇒ k = 5.",
   "Adding the same number keeps the difference unchanged.",
   "Forgetting to multiply k back: answering 5.",
   "Constant-difference trick: equate differences of the two ratios.",
   options=["25", "15", "30", "35"],
   check=lambda: next(5 * k for k in range(1, 100) if F(3 * k + 10, 5 * k + 10) == F(5, 7)))

qa(A, "Ratio & Proportion", "M", 90,
   "Six years ago the ratio of the ages of A and B was 3 : 4. Six years from now it will be 5 : 6. What is A's present age (in years)?",
   "24",
   """A − 6 = 3k, B − 6 = 4k.
   (3k + 12)/(4k + 12) = 5/6 ⇒ 18k + 72 = 20k + 60 ⇒ k = 6.
   A = 3 × 6 + 6 = 24.""",
   "Age difference k is constant: 3:4 → 5:6 means difference 1 part in both; gap 12 years = (5 − 3) parts ⇒ 1 part = 6.",
   "The difference in ages never changes.",
   "Stopping at k = 6 or giving A's age six years ago (18).",
   "Age problems: work with the constant age gap.",
   check=lambda: next(3 * k + 6 for k in range(1, 50) if F(3 * k + 12, 4 * k + 12) == F(5, 6)))

# ---------------- Averages (4) ----------------
qa(A, "Averages", "E", 60,
   "The average of 11 numbers is 30. The average of the first six is 28 and the average of the last six is 33. What is the sixth number?",
   1,
   """Sum of first six = 168; last six = 198; all eleven = 330.
   The sixth number is counted twice: 168 + 198 − 330 = 36.""",
   "Deviation method: first six contribute −12, last six +18; sixth = 30 + (−12 + 18) = 36.",
   "Which number appears in both groups?",
   "Averaging 28 and 33.",
   "Overlapping groups: overlap = sum(group1) + sum(group2) − total.",
   options=["34", "36", "38", "30"],
   check=lambda: 6 * 28 + 6 * 33 - 11 * 30)

qa(A, "Averages", "M", 60,
   "The average weight of 30 students is 50 kg. When the teacher's weight is included, the average rises by 0.5 kg. What is the teacher's weight (in kg)?",
   "65.5",
   """New total = 31 × 50.5 = 1,565.5.
   Old total = 30 × 50 = 1,500.
   Teacher = 65.5 kg.""",
   "Teacher = old average + (new count × increase) = 50 + 31 × 0.5.",
   "The teacher must lift all 31 people by 0.5.",
   "Using 30 × 0.5 instead of 31 × 0.5 (gives 65).",
   "New member = old avg + n_new × change.",
   check=lambda: 31 * F(505, 10) - 1500)

qa(A, "Averages", "H", 60,
   "The average of 10 distinct positive integers is 15. What is the maximum possible value of the largest of these integers?",
   "105",
   """Sum = 150. To maximise the largest, make the other nine as small as possible and distinct: 1, 2, …, 9 (sum 45).
   Largest = 150 − 45 = 105.""",
   "Max one = total − minimum possible sum of the rest.",
   "The other nine must be distinct positive integers.",
   "Using 1 for all nine others (ignores 'distinct'), giving 141.",
   "Extremal problems: push all other values to their bounds.",
   check=lambda: 150 - sum(range(1, 10)))

qa(A, "Averages", "M", 60,
   "The average of five consecutive odd numbers is 27. What is the product of the smallest and the largest of these numbers?",
   0,
   """Middle number = average = 27. Numbers: 23, 25, 27, 29, 31.
   Product = 23 × 31 = 713.""",
   "(27 − 4)(27 + 4) = 27² − 16 = 713.",
   "For evenly spaced numbers, the average is the middle term.",
   "Using spacing 1 instead of 2 (25 × 29 = 725).",
   "Symmetric sets: a² − d² trick for extreme products.",
   options=["713", "725", "729", "697"],
   check=lambda: next(s * (s + 8) for s in range(1, 100, 2) if sum(range(s, s + 10, 2)) == 27 * 5))

# ---------------- Mixtures & Alligation (4) ----------------
qa(A, "Mixtures & Alligation", "E", 45,
   "In what ratio must rice costing ₹60/kg be mixed with rice costing ₹75/kg so that the mixture costs ₹65/kg?",
   3,
   """Alligation: (75 − 65) : (65 − 60) = 10 : 5 = 2 : 1.""",
   "Distances from the mean are swapped: cheaper : dearer = 10 : 5.",
   "Use the alligation cross.",
   "Writing 1:2 (not swapping the distances).",
   "Alligation: ratio = (dear − mean) : (mean − cheap).",
   options=["1:2", "3:2", "3:1", "2:1"],
   check=lambda: "2:1" if F(2 * 60 + 1 * 75, 3) == 65 else None)

qa(A, "Mixtures & Alligation", "M", 60,
   "A 40-litre mixture of milk and water contains 25% water. How many litres of water must be added so that water becomes 40% of the new mixture?",
   "10",
   """Milk = 30 L (unchanged). In the new mixture milk is 60%.
   New total = 30/0.6 = 50 L ⇒ water added = 10 L.""",
   "Track the component that does not change (milk).",
   "Milk stays at 30 L.",
   "Adding 15% of 40 = 6 L.",
   "Keep the constant component fixed and rescale the total.",
   check=lambda: F(30) / F(6, 10) - 40)

qa(A, "Mixtures & Alligation", "M", 75,
   "A vessel contains 80 L of pure milk. 8 L is removed and replaced with water. This operation is performed three times in all. How much milk (in litres) remains?",
   1,
   """Each operation keeps (1 − 8/80) = 0.9 of the milk.
   Milk = 80 × 0.9³ = 80 × 0.729 = 58.32 L.""",
   "Repeated replacement: final = initial × (1 − x/V)ⁿ.",
   "What fraction of milk survives one operation?",
   "Subtracting 8 L three times (56 L).",
   "Replacement formula works only when the removed quantity is equal each time.",
   options=["56 L", "58.32 L", "57.6 L", "60 L"],
   check=lambda: str(float(80 * F(9, 10) ** 3)) + " L")

qa(A, "Mixtures & Alligation", "H", 90,
   "Alloy A contains copper and zinc in the ratio 3 : 2 and alloy B contains them in the ratio 1 : 4. How many kg of alloy B must be mixed with 10 kg of alloy A so that the resulting alloy is 40% copper?",
   "10",
   """Copper in A = 60%, in B = 20%.
   Alligation around 40%: A : B = (40 − 20) : (60 − 40) = 1 : 1.
   So B = 10 kg.""",
   "Copper % 60 and 20, target 40 is exactly the midpoint ⇒ equal quantities.",
   "Convert each alloy to copper percentage.",
   "Working with zinc % on one side and copper % on the other.",
   "Alligation works on the percentage of one chosen component.",
   check=lambda: next(x for x in range(0, 100) if F(6 + F(x, 5), 10 + x) == F(2, 5)))

# ---------------- Time & Work (6) ----------------
qa(A, "Time & Work", "E", 45,
   "A can finish a job in 12 days and B in 18 days. How many days will they take working together?",
   0,
   """Combined rate = 1/12 + 1/18 = 5/36 per day.
   Time = 36/5 = 7.2 days.""",
   "Product/sum = 12 × 18/30 = 7.2.",
   "Add the rates, not the times.",
   "Averaging the days (15).",
   "Two workers: T = ab/(a + b).",
   options=["7.2 days", "7.5 days", "8 days", "15 days"],
   check=lambda: str(float(F(12 * 18, 30))) + " days")

qa(A, "Time & Work", "M", 75,
   "A and B together finish a job in 12 days, B and C in 15 days, and C and A in 20 days. In how many days can A alone finish the job?",
   "30",
   """Take total work = 60 units. A+B = 5, B+C = 4, C+A = 3 units/day.
   A+B+C = 12/2 = 6 units/day.
   A = 6 − (B+C) = 2 units/day ⇒ 60/2 = 30 days.""",
   "LCM-units method avoids fractions.",
   "Add all three pair rates and halve.",
   "Forgetting to halve the sum of pair rates.",
   "Pair-sum problems: total = (sum of pairs)/2.",
   check=lambda: 1 / ((F(1, 12) + F(1, 15) + F(1, 20)) / 2 - F(1, 15)))

qa(A, "Time & Work", "M", 60,
   "Pipe A fills a tank in 20 minutes and pipe B in 30 minutes, while pipe C empties the full tank in 15 minutes. If all three are opened together on an empty tank, how long will it take to fill it?",
   2,
   """Tank = 60 units. A = +3, B = +2, C = −4 units/min.
   Net = +1 unit/min ⇒ 60 minutes.""",
   "LCM 60 units; net rate +1.",
   "Treat the emptying pipe as negative work.",
   "Adding all three rates as positive.",
   "Leak/outlet pipes carry a negative sign.",
   options=["30 minutes", "45 minutes", "60 minutes", "90 minutes"],
   check=lambda: str(int(1 / (F(1, 20) + F(1, 30) - F(1, 15)))) + " minutes")

qa(A, "Time & Work", "M", 75,
   "A and B together can complete a job in 12 days. They work together for 4 days, after which B leaves and A finishes the remaining work in 16 days. In how many days can B alone complete the job?",
   "24",
   """In 4 days together they finish 4/12 = 1/3 of the job.
   A does the remaining 2/3 in 16 days ⇒ A alone takes 24 days (rate 1/24).
   B's rate = 1/12 − 1/24 = 1/24 ⇒ 24 days.""",
   "A's rate from the 'remaining work' step, then subtract from the joint rate.",
   "First find how much work was left when B left.",
   "Assuming A did the whole job in 16 days (rate 1/16).",
   "Joint rate − known rate = unknown rate.",
   check=lambda: 1 / (F(1, 12) - (1 - F(4, 12)) / 16))

qa(A, "Time & Work", "M", 90,
   "A can do a job in 20 days and B in 30 days. They start together, but A leaves 5 days before the job is completed. In how many days is the job completed in total?",
   "15",
   """Let total time = t. B works t days, A works (t − 5).
   (t − 5)/20 + t/30 = 1 ⇒ 3t − 15 + 2t = 60 ⇒ t = 15.""",
   "Pretend A works full time: extra work A would do in 5 days = 5/20 = 1/4. Combined rate 1/12 does 1 + 1/4 ⇒ t = 15.",
   "Write the work equation with t as total days.",
   "Subtracting 5 from the answer at the end (giving 10).",
   "'Leaves x days before completion' ⇒ that worker works (t − x).",
   check=lambda: next(t for t in range(5, 100) if F(t - 5, 20) + F(t, 30) == 1))

qa(A, "Time & Work", "E", 45,
   "A is twice as efficient as B. Together they finish a job in 14 days. How many days would A alone take?",
   3,
   """Rates A = 2x, B = x. 3x = 1/14 ⇒ x = 1/42.
   A = 2/42 = 1/21 ⇒ 21 days.""",
   "A does 2/3 of the combined work rate ⇒ 14 × 3/2 = 21.",
   "Efficiency is the rate of work.",
   "Answering 28 (doubling the days) or 7 (halving).",
   "Efficiency ratio a:b ⇒ time ratio b:a.",
   options=["28", "7", "42", "21"],
   check=lambda: 1 / (F(2, 3) * F(1, 14)))

# ---------------- Time, Speed & Distance (8) ----------------
qa(A, "Time, Speed & Distance", "E", 45,
   "A car travels to a place at 60 km/h and returns along the same road at 40 km/h. What is its average speed for the entire journey?",
   2,
   """Average speed for equal distances = 2ab/(a + b) = 2 × 60 × 40/100 = 48 km/h.""",
   "Harmonic mean of 60 and 40.",
   "Average speed = total distance/total time.",
   "Taking the arithmetic mean (50 km/h).",
   "Equal distances ⇒ harmonic mean; equal times ⇒ arithmetic mean.",
   options=["50 km/h", "45 km/h", "48 km/h", "52 km/h"],
   check=lambda: str(int(F(2 * 60 * 40, 100))) + " km/h")

qa(A, "Time, Speed & Distance", "E", 45,
   "A 240 m long train crosses a pole in 12 seconds. How many seconds will it take to cross a 360 m long platform?",
   "30",
   """Speed = 240/12 = 20 m/s.
   Distance to cross platform = 240 + 360 = 600 m ⇒ 30 s.""",
   "Time scales with length: 12 × 600/240 = 30.",
   "Crossing a platform means covering train + platform length.",
   "Using only 360 m (18 s).",
   "Pole: distance = train length; platform: train + platform.",
   check=lambda: F(240 + 360, F(240, 12)))

qa(A, "Time, Speed & Distance", "M", 60,
   "Two trains 150 m and 100 m long run on parallel tracks in opposite directions at 54 km/h and 36 km/h. How long do they take to cross each other completely?",
   0,
   """Relative speed = 54 + 36 = 90 km/h = 25 m/s.
   Distance = 150 + 100 = 250 m ⇒ 10 s.""",
   "90 × 5/18 = 25 m/s; 250/25.",
   "Opposite directions ⇒ add speeds.",
   "Subtracting speeds (as if same direction) gives 50 s.",
   "km/h → m/s: multiply by 5/18.",
   options=["10 s", "25 s", "50 s", "12.5 s"],
   check=lambda: str(int(F(250) / (F(90) * 5 / 18))) + " s")

qa(A, "Time, Speed & Distance", "H", 120,
   "A boat goes 24 km upstream and 28 km downstream in 6 hours. It goes 30 km upstream and 21 km downstream in 6.5 hours. What is the speed of the boat in still water (in km/h)?",
   "10",
   """Let u = 1/(upstream speed), v = 1/(downstream speed).
   24u + 28v = 6 and 30u + 21v = 6.5.
   Multiply the first by 3 and the second by 4: 72u + 84v = 18; 120u + 84v = 26 ⇒ 48u = 8 ⇒ u = 1/6.
   28v = 6 − 4 = 2 ⇒ v = 1/14. Upstream = 6, downstream = 14 ⇒ boat = (6 + 14)/2 = 10.""",
   "Treat reciprocals of speeds as the unknowns to keep the equations linear.",
   "Let the unknowns be the time per km upstream and downstream.",
   "Answering the stream speed (4) or a downstream speed (14).",
   "Boat = (D + U)/2, stream = (D − U)/2.",
   check=lambda: next((F(Ds + Us, 2)) for Us in range(1, 30) for Ds in range(1, 40) if F(24, Us) + F(28, Ds) == 6 and F(30, Us) + F(21, Ds) == F(13, 2)))

qa(A, "Time, Speed & Distance", "M", 60,
   "In a 1 km race, A beats B by 100 m and B beats C by 100 m. By how many metres does A beat C?",
   1,
   """When A runs 1,000 m, B runs 900 m.
   When B runs 1,000 m, C runs 900 m ⇒ when B runs 900 m, C runs 810 m.
   A beats C by 1,000 − 810 = 190 m.""",
   "0.9 × 0.9 = 0.81 ⇒ 190 m.",
   "Speed ratios multiply.",
   "Adding the margins (200 m).",
   "Race margins chain multiplicatively.",
   options=["200 m", "190 m", "180 m", "210 m"],
   check=lambda: str(int(1000 - 1000 * F(9, 10) * F(9, 10))) + " m")

qa(A, "Time, Speed & Distance", "M", 90,
   "P and Q are 90 km apart. Two cyclists start at the same time from P and Q towards each other at 20 km/h and 25 km/h respectively. After they meet, how many minutes does the cyclist from Q take to reach P?",
   "96",
   """They meet after 90/45 = 2 hours, 40 km from P.
   The Q-cyclist still has 40 km to P at 25 km/h ⇒ 1.6 h = 96 minutes.""",
   "Remaining distance for Q-cyclist = distance covered by the other = 20 × 2.",
   "Find the meeting point first.",
   "Reporting 1.6 or answering for the wrong cyclist (the P-cyclist needs 2.5 h).",
   "After meeting, each covers what the other covered before meeting.",
   check=lambda: F(20 * 2, 25) * 60)

qa(A, "Time, Speed & Distance", "H", 90,
   "A and B start running from the same point on a 600 m circular track in the same direction at 5 m/s and 3 m/s. After how many seconds will they first meet again at the starting point?",
   0,
   """A completes a lap in 120 s and B in 200 s.
   They are both at the start at common multiples: LCM(120, 200) = 600 s.""",
   "Meeting at the start ⇒ LCM of lap times.",
   "Find each runner's lap time.",
   "Using the first meeting anywhere on the track (600/(5 − 3) = 300 s).",
   "Meet anywhere: L/relative speed; meet at start: LCM of lap times.",
   options=["600", "300", "1200", "400"],
   check=lambda: next(t for t in range(1, 10000) if (5 * t) % 600 == 0 and (3 * t) % 600 == 0))

qa(A, "Time, Speed & Distance", "M", 75,
   "Walking at 5 km/h a man reaches his office 10 minutes late; walking at 6 km/h he reaches 5 minutes early. What is the distance to the office (in km)?",
   "7.5",
   """Time difference = 15 min = 1/4 h.
   d/5 − d/6 = 1/4 ⇒ d/30 = 1/4 ⇒ d = 7.5 km.""",
   "d = (product of speeds/difference) × time gap = 30 × 1/4.",
   "Late + early = total time gap.",
   "Taking the gap as 5 minutes (10 − 5).",
   "Two-speed problems: d = s₁s₂/(s₂ − s₁) × Δt.",
   check=lambda: F(5 * 6, 1) * F(15, 60))
