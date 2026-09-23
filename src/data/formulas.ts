export interface Sheet { id: string; title: string; section: 'QA' | 'DILR' | 'VARC'; groups: { name: string; items: [string, string][] }[] }

export const SHEETS: Sheet[] = [
  { id: 'arith', title: 'Arithmetic', section: 'QA', groups: [
    { name: 'Percentages', items: [
      ['Successive change', 'a% then b% ⇒ net = a + b + ab/100 (use signs)'],
      ['+x% then −x%', 'Net fall of x²/100 %'],
      ['Price ↑ by 1/n', 'Consumption ↓ by 1/(n+1) to keep spend constant'],
      ['Fractions', '1/6 = 16.67% · 1/7 ≈ 14.29% · 1/8 = 12.5% · 1/9 ≈ 11.11% · 1/11 ≈ 9.09% · 1/12 ≈ 8.33%'],
    ] },
    { name: 'Profit, loss & discount', items: [
      ['Link', 'MP × (1 − d) = SP = CP × (1 + p)'],
      ['Equal SP, ±x%', 'Always a net loss of x²/100 % of total CP'],
      ['False weight', 'Profit % = (claimed − actual)/actual × 100 (at claimed price)'],
    ] },
    { name: 'Interest', items: [
      ['SI', 'P·r·t/100'], ['CI', 'P(1 + r/100)ⁿ − P'],
      ['CI − SI', '2 yrs: P(r/100)² · 3 yrs: P(r/100)²(3 + r/100)'],
      ['Equal instalments', 'P = Σ x/(1 + r)ᵏ, k = 1…n'],
      ['Doubling (SI)', 'n-fold in t years ⇒ (n−1)·100/r = t'],
    ] },
    { name: 'Ratio, averages, mixtures', items: [
      ['pA = qB = rC', 'A:B:C = 1/p : 1/q : 1/r'],
      ['Constant difference', 'Adding k to both terms keeps the difference: equate differences'],
      ['New member', 'Value = old avg + (new count × change in avg)'],
      ['Alligation', 'Cheap : Dear = (Dear − Mean) : (Mean − Cheap)'],
      ['Replacement', 'Left = V(1 − x/V)ⁿ after n removals of x'],
    ] },
    { name: 'Time, speed, distance, work', items: [
      ['Equal distances', 'Avg speed = 2ab/(a + b)'], ['km/h → m/s', '× 5/18'],
      ['Crossing', 'Opposite: add speeds; same direction: subtract; distance = sum of lengths'],
      ['Boats', 'Boat = (D + U)/2 · Stream = (D − U)/2'],
      ['Circular track', 'Meet anywhere: L/relative speed · at start: LCM of lap times'],
      ['Two speeds, time gap Δt', 'd = s₁s₂/(s₂ − s₁) × Δt'],
      ['Work', 'Use LCM units; outlets negative; T = ab/(a + b) for two workers'],
    ] },
  ] },
  { id: 'algebra', title: 'Algebra', section: 'QA', groups: [
    { name: 'Equations & inequalities', items: [
      ['ax + by = c solutions', 'Step x by b/g and y by a/g from one solution (g = gcd)'],
      ['|x − a| < b', 'a − b < x < a + b'],
      ['Σ|x − aᵢ|', 'Minimum at the median of aᵢ'],
      ['|x| + |y| ≤ n', '2n² + 2n + 1 lattice points'],
      ['AM–GM', 'For max xᵃyᵇ with x + y fixed: x : y = a : b'],
    ] },
    { name: 'Quadratics', items: [
      ['Vieta', 'α + β = −b/a, αβ = c/a'], ['(α − β)²', '(α + β)² − 4αβ = D/a²'],
      ['Both roots +ve', 'D ≥ 0, sum > 0, product > 0 (−ve: sum < 0, product > 0)'],
      ['Equal roots', 'D = 0'],
    ] },
    { name: 'Logs, surds, indices', items: [
      ['Laws', 'log ab = log a + log b · log aⁿ = n log a · log_{bᵏ} x = (log_b x)/k'],
      ['Digits', 'N has ⌊log₁₀N⌋ + 1 digits (log 2 = 0.301, log 3 = 0.477)'],
      ['Nested surd', '√(x + 2√y) = √a + √b, a + b = x, ab = y'],
      ['Log inequality', 'Fix the domain first; base > 1 keeps the sign'],
    ] },
    { name: 'Progressions', items: [
      ['AP', 'Tₙ = a + (n − 1)d · Sₙ = n/2 (first + last)'],
      ['GP', 'Tₙ = arⁿ⁻¹ · Sₙ = a(rⁿ − 1)/(r − 1) · S∞ = a/(1 − r), |r| < 1'],
      ['Sₘ = Sₙ in AP', 'S_(m+n) = 0'],
      ['Series', 'Σk = n(n+1)/2 · Σk² = n(n+1)(2n+1)/6 · Σk(k+1) = n(n+1)(n+2)/3'],
      ['Telescoping', '1/(a·b), b − a = d ⇒ (1/d)(1/a − 1/b)'],
    ] },
    { name: 'Functions', items: [
      ['f(x+y) = f(x) + f(y)', 'f(n) = n·f(1)'], ['f(x), f(1 − x) equations', 'Substitute x and 1 − x, solve the pair'],
      ['max(increasing, decreasing)', 'Minimum at the intersection'],
    ] },
  ] },
  { id: 'numbers', title: 'Number systems', section: 'QA', groups: [
    { name: 'Divisibility & remainders', items: [
      ['aⁿ + bⁿ', 'Divisible by a + b when n is odd'], ['aⁿ − bⁿ', 'Divisible by a − b always; by a + b when n is even'],
      ['Cyclicity (units digit)', '2,3,7,8 → 4 · 4,9 → 2 · 0,1,5,6 → 1'],
      ['Common deficit', 'N ≡ −d mod each ⇒ N = k·LCM − d'],
      ['Two remainders', 'Find first solution, then add LCM repeatedly'],
    ] },
    { name: 'Factors', items: [
      ['Count', 'N = pᵃqᵇ… ⇒ (a+1)(b+1)…'], ['Sum', 'Π (1 + p + … + pᵃ)'],
      ['HCF × LCM', '= product (two numbers only)'], ['Trailing zeros of n!', 'Σ ⌊n/5ᵏ⌋'],
    ] },
  ] },
  { id: 'geometry', title: 'Geometry & mensuration', section: 'QA', groups: [
    { name: 'Triangles', items: [
      ['Heron', 'Δ = √(s(s−a)(s−b)(s−c))'], ['Inradius / circumradius', 'r = Δ/s · R = abc/4Δ'],
      ['Similar figures', 'Area ratio = (side ratio)²'],
      ['Triplets', '3-4-5, 5-12-13, 7-24-25, 8-15-17, 9-40-41, 20-21-29'],
      ['Area-84 triangles', '13-14-15 and 10-17-21'],
      ['Equilateral', 'Area √3a²/4 · R = a/√3 · r = a/(2√3)'],
    ] },
    { name: 'Circles & polygons', items: [
      ['Chord', 'Perpendicular from centre bisects it'], ['Tangent length', '√(d² − r²)'],
      ['Common tangents', 'Direct √(d² − (r₁−r₂)²) · Transverse √(d² − (r₁+r₂)²)'],
      ['Angle at centre', '= 2 × angle at circumference (same arc)'],
      ['Polygon', 'Exterior = 360/n · Diagonals = n(n − 3)/2'],
      ['Rhombus', 'Side = ½√(d₁² + d₂²), area = d₁d₂/2'],
    ] },
    { name: 'Mensuration & coordinates', items: [
      ['Cylinder', 'V = πr²h · CSA = 2πrh'], ['Cone', 'V = πr²h/3 · CSA = πrl'], ['Sphere', 'V = 4πr³/3 · SA = 4πr²'],
      ['Cube', 'TSA 6a² · diagonal a√3'], ['Shoelace', '½|x₁(y₂−y₃) + x₂(y₃−y₁) + x₃(y₁−y₂)|'],
    ] },
  ] },
  { id: 'modern', title: 'Modern math', section: 'QA', groups: [
    { name: 'Counting & probability', items: [
      ['Repeated letters', 'n!/(p!q!…)'], ['No two X adjacent', 'Arrange the rest, choose gaps for X'],
      ['Identical items, ≥ k each', 'Pre-allocate, then C(n + r − 1, r − 1)'],
      ['AND / OR', 'Multiply / add'], ['Hypergeometric', 'C(R, r)C(B, b)/C(R + B, r + b)'],
      ['AP triples from 1…n', 'First and last share parity'],
    ] },
  ] },
  { id: 'dilr', title: 'DILR toolkit', section: 'DILR', groups: [
    { name: 'The 3-minute scan', items: [
      ['Clarity', 'Can you draw the grid/table in under a minute?'], ['Conditions', 'Fewer, concrete clues beat many vague ones'],
      ['Question types', 'Direct "who/what" questions beat "if … then how many" chains'],
      ['Calculation load', 'Round-number data is faster than messy percentages'],
    ] },
    { name: 'Solving', items: [
      ['Anchor first', 'Start from fixed positions, blocks, maximum/minimum values'],
      ['Cases', 'Branch on the most constrained entity; kill cases early'],
      ['Leagues', '3M − D = total points; decompose each team’s points'],
      ['Venn min/max', 'x₁ + x₂ + x₃ = N; x₁ + 2x₂ + 3x₃ = Σ|sets|'],
      ['Networks', 'Max-flow = min-cut; shortest path = label towns nearest-first'],
      ['Stop-loss', 'No foothold after 6 minutes → move to the next set'],
    ] },
  ] },
  { id: 'varc', title: 'VARC question types', section: 'VARC', groups: [
    { name: 'Reading comprehension', items: [
      ['Main idea', 'Must cover the whole arc; reject options that restate one paragraph'],
      ['Inference', 'One step beyond the text, never two; beware "always/never/only"'],
      ['Tone', 'Mixed signals ⇒ moderate tone (sceptical, qualified)'],
      ['Strengthen/weaken', 'Target the link between premise and conclusion'],
      ['EXCEPT/NOT', 'Verify every option against the text'],
    ] },
    { name: 'Verbal ability', items: [
      ['Para jumble', 'Find the opener (no back-reference), then mandatory pairs (this/such/however)'],
      ['Odd one out', 'Name the question the four sentences answer; the odd one answers a different one'],
      ['Summary', 'Keep the thesis + qualifiers; drop examples; reject intensified claims'],
      ['Completion/placement', 'Resolve pronouns and connectors in both neighbours'],
    ] },
  ] },
];
