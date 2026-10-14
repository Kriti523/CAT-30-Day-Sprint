import type { Section } from '../types';

/** A short lesson for a Must-Master topic: the idea, a method, one worked example, and the usual traps.
 *  `topic` matches the topic names on the Topic priorities page. Examples are original and checked by hand. */
export interface Primer {
  topic: string;
  section: Section;
  idea: string;
  method: string[];
  example: { problem: string; steps: string[] };
  traps: string[];
}

export const PRIMERS: Primer[] = [
  {
    topic: 'Set selection (meta-skill)', section: 'DILR',
    idea: 'DILR rewards choosing well more than solving fast. Each slot mixes one or two approachable sets with long, trap-heavy ones; two sets solved completely beat four sets half done.',
    method: [
      'Spend the first 3–4 minutes reading only the first paragraph and the questions of every set.',
      'Rate each set on three things: how clearly the data is given, how many conditions there are, and how much calculation the questions need.',
      'Prefer sets where several questions are TITA (no negative marking) and where the questions ask about the same arrangement or table.',
      'Commit to your best set and finish it before starting the next.',
      'Stop-loss: six minutes without a foothold means move on; come back only with eight or more minutes left.',
    ],
    example: {
      problem: 'Set 1: a table of five companies with two missing values and four direct questions. Set 2: seven people in a circle with nine conditions, three of them "either/or". Which do you start with?',
      steps: [
        'Set 1: the data is given, the gaps are fillable from totals, and questions are mostly read-offs: low risk.',
        'Set 2: nine conditions with three branches means several cases to carry; one misread clue wastes the whole set.',
        'Start with Set 1; open Set 2 only after finishing Set 1 and a second easy set.',
      ],
    },
    traps: ['Solving sets in the order shown.', 'Sunk cost: staying on a set because you have already spent ten minutes on it.', 'Skipping the scan "to save time"; the scan is where the time is saved.'],
  },
  {
    topic: 'RC – main idea & inference', section: 'VARC',
    idea: 'Main-idea questions ask what the whole passage argues; inference questions ask what must be true given the text. Both reward reading for the argument, not for details.',
    method: [
      'After each paragraph, write a five-word note of what it does (claims, objects, gives an example, concedes).',
      'Find the author’s own position, usually where the passage turns ("but", "yet", "the stronger objection is").',
      'Main idea: pick the option that covers every paragraph and matches the author’s position, not a view the author reports.',
      'Inference: the right option must be true from the text; reject anything that is merely possible.',
    ],
    example: {
      problem: '"Cities that added bike lanes saw fewer car trips, but only where the lanes connected to train stations." Which is a valid inference? (a) Bike lanes reduce car trips. (b) Where bike lanes reach transit matters for their effect.',
      steps: [
        '(a) drops the condition "only where the lanes connected"; it overgeneralises.',
        '(b) restates that condition as a general point: it must be true given the sentence.',
        'Answer (b).',
      ],
    },
    traps: ['Choosing an option that is true but covers one paragraph only.', 'Picking the critics’ view that the author later rejects.', 'Inference options that go one step beyond the text ("therefore cities should…").'],
  },
  {
    topic: 'Percentages, profit, loss & discount', section: 'QA',
    idea: 'Almost every percentage problem is a chain of multipliers. Turning "+20%, then −10%" into × 1.2 × 0.9 removes most errors.',
    method: [
      'Convert each change to a multiplier: +x% → (1 + x/100), −x% → (1 − x/100).',
      'Multiply along the chain; never add percentages that apply to different bases.',
      'Profit and loss are on cost price; discount is on marked price. Link them with MP × (1 − d) = CP × (1 + p).',
      'Know the fraction table (1/6 = 16.67%, 1/7 ≈ 14.29%, 1/8 = 12.5%) to multiply mentally.',
    ],
    example: {
      problem: 'An article is marked 50% above cost and sold at a 20% discount. What is the profit percentage?',
      steps: ['Marked price = 1.5 × CP.', 'Selling price = 0.8 × 1.5 × CP = 1.2 × CP.', 'Profit = 20%.'],
    },
    traps: ['Adding successive changes (+50% and −20% is not +30%).', 'Taking the discount on cost price.', 'Base confusion: "A is 25% more than B" means B is 20% less than A.'],
  },
  {
    topic: 'Ratio, proportion, averages & mixtures', section: 'QA',
    idea: 'Ratios, averages and mixtures are the same idea in different clothes: a weighted average. Alligation is the fastest way to work with it.',
    method: [
      'Write ratios as parts (3 : 5 → 3k and 5k) and find k from one known quantity.',
      'For averages, work with totals: total = average × count.',
      'For mixing two things, use alligation: cheaper : dearer = (dearer − mean) : (mean − cheaper).',
      'For repeated removal and replacement, the pure part left = original × (1 − removed/total)ⁿ.',
    ],
    example: {
      problem: 'Tea at ₹40/kg is mixed with tea at ₹70/kg to get a blend worth ₹50/kg. In what ratio are they mixed?',
      steps: ['Distances from the mean: 70 − 50 = 20 and 50 − 40 = 10.', 'Cheaper : dearer = 20 : 10 = 2 : 1.', 'Check: (2 × 40 + 1 × 70)/3 = 150/3 = 50 ✓'],
    },
    traps: ['Swapping the alligation distances (getting 1 : 2).', 'Averaging averages of groups of different sizes.', 'Forgetting that adding a constant to both terms changes a ratio.'],
  },
  {
    topic: 'Tables & charts DI (incl. missing values)', section: 'DILR',
    idea: 'DI tests careful reading and quick approximate arithmetic, not heavy calculation. Most questions need two or three numbers from the table.',
    method: [
      'Read the units, the totals and any notes before the questions.',
      'Fill missing values only when a question needs them, using totals or given percentages.',
      'Approximate first; calculate exactly only to separate close options.',
      'For growth questions, compare ratios (new/old) instead of computing every percentage.',
    ],
    example: {
      problem: 'Revenue was 120 in 2022, 150 in 2023 and 180 in 2024. Which year had the higher growth rate?',
      steps: ['2023: 150/120 = 1.25 ⇒ 25% growth.', '2024: 180/150 = 1.20 ⇒ 20% growth.', 'The same +30 absolute rise is a smaller percentage on a bigger base: 2023 grew faster.'],
    },
    traps: ['Equal absolute increases read as equal growth.', 'Mixing up "percentage of total" with "percentage change".', 'Calculating everything before reading what is asked.'],
  },
  {
    topic: 'Linear equations, inequalities & modulus', section: 'QA',
    idea: 'Read |x − a| as the distance from x to a on the number line. Many modulus and inequality questions then become a picture.',
    method: [
      'Turn |x − a| + |x − b| into "the sum of distances from a and b".',
      'For inequalities, find the boundary points, then test one value in each region.',
      'Multiplying or dividing by a negative number flips the inequality sign.',
      'For two linear equations, eliminate one variable; check that the solution satisfies any integer or sign conditions.',
    ],
    example: {
      problem: 'How many integers x satisfy |x − 1| + |x − 5| = 4?',
      steps: ['The sum of distances from 1 and 5 can never be less than the gap between them, 4.', 'It equals 4 exactly when x is between 1 and 5 (inclusive).', 'Integers 1, 2, 3, 4, 5 ⇒ 5 solutions.'],
    },
    traps: ['Squaring both sides and creating extra roots.', 'Forgetting to flip the sign when dividing by a negative.', 'Checking only the endpoints and missing the whole interval.'],
  },
  {
    topic: 'Arrangements (linear, circular, grid)', section: 'DILR',
    idea: 'Arrangement sets are solved by placing what is certain first and branching only when you must. Most sets collapse to one or two cases.',
    method: [
      'Draw the slots (a row, a circle with a fixed reference person, or a grid).',
      'Place fixed clues first ("A is at an end", "C is third").',
      'Use adjacency clues next; write "either/or" clues as two short cases side by side.',
      'Use the remaining clues to eliminate cases. Answer the questions only once one case is left.',
    ],
    example: {
      problem: 'P, Q, R and S sit in a row. P is at one end, Q sits next to R, and S does not sit next to P. Who sits at the other end?',
      steps: [
        'Put P in seat 1 (the other end is a mirror image).',
        'Seat 2 cannot be S, so it is Q or R; the other of Q and R must then be in seat 3 to stay next to it.',
        'That leaves S in seat 4. Answer: S always sits at the other end.',
      ],
    },
    traps: ['Not fixing a reference in a circle, which creates rotations of the same answer.', 'Forgetting the mirror image in a row.', 'Reading "between" as "immediately between".'],
  },
  {
    topic: 'Time, speed, distance & work', section: 'QA',
    idea: 'Distance = speed × time and work = rate × time are the same equation. Picking convenient units (LCM of the times) turns most work problems into simple arithmetic.',
    method: [
      'For work, set total work = LCM of the individual times; each person’s rate is units per day.',
      'Opposite directions add speeds; the same direction subtracts them.',
      'For equal distances at two speeds, average speed = 2ab/(a + b), not (a + b)/2.',
      'Convert km/h to m/s by × 5/18 before mixing with metres or seconds.',
    ],
    example: {
      problem: 'A finishes a job in 12 days and B in 18 days. How long do they take together?',
      steps: ['Total work = LCM(12, 18) = 36 units.', 'A does 3 units a day and B 2, so together 5 units a day.', 'Time = 36/5 = 7.2 days.'],
    },
    traps: ['Averaging speeds for equal distances.', 'Adding times instead of rates.', 'Using unconverted units for a train crossing a platform.'],
  },
  {
    topic: 'Para summary', section: 'VARC',
    idea: 'A good summary keeps the paragraph’s main claim and its key qualifier, and adds nothing new.',
    method: [
      'Find the main claim: usually the sentence the others support or illustrate.',
      'Note the qualifier that limits it ("only when", "in the short run", "for most").',
      'Reject options that add new information, focus on one example, or drop the qualifier.',
      'Between two close options, choose the one that would satisfy the author.',
    ],
    example: {
      problem: 'Paragraph: "Remote work raises productivity for focused tasks, but it weakens the informal learning that junior staff rely on." Which summary is best? (a) Remote work raises productivity. (b) Remote work helps focused work but costs junior staff informal learning.',
      steps: ['(a) keeps only half of the claim and drops the trade-off.', '(b) keeps both sides and the group affected.', 'Answer (b).'],
    },
    traps: ['A summary that is true but one-sided.', 'Options with a stronger tone than the paragraph ("always", "must").', 'Choosing the option that repeats the paragraph’s words over the one that keeps its meaning.'],
  },
  {
    topic: 'Geometry (triangles, circles, polygons)', section: 'QA',
    idea: 'CAT geometry rewards a handful of facts used well: Pythagorean triples, similarity ratios, the angle and tangent properties of circles, and area formulas.',
    method: [
      'Draw the figure to rough scale and mark everything given.',
      'Look for right angles: a radius meets a tangent at 90°, and an angle in a semicircle is 90°.',
      'Spot triples (3-4-5, 5-12-13, 8-15-17, 7-24-25) before calculating square roots.',
      'Similar triangles: lengths scale by k and areas by k².',
    ],
    example: {
      problem: 'What is the inradius of a triangle with sides 6, 8 and 10?',
      steps: ['6² + 8² = 10², so it is right-angled: area = ½ × 6 × 8 = 24.', 'Semi-perimeter s = 12.', 'Inradius = area/s = 2.'],
    },
    traps: ['Using the diameter where the radius is needed.', 'Scaling areas by k instead of k² in similar figures.', 'Assuming a figure is drawn to scale.'],
  },
  {
    topic: "RC – tone & author's view", section: 'VARC',
    idea: 'Tone questions ask how the author feels about the subject. The evidence is in a few loaded words and in what the author concedes.',
    method: [
      'Underline judgement words: adjectives and adverbs ("merely", "rightly", "naive").',
      'Separate the author’s voice from views the author reports ("critics argue…").',
      'Notice concessions ("although", "admittedly"); they usually mean a balanced or qualified tone.',
      'Prefer moderate options; extreme tones (scathing, euphoric) are rarely right in CAT passages.',
    ],
    example: {
      problem: '"The proposal is ambitious and, in places, admirably clear; its cost estimates, however, rest on assumptions few economists would accept." What is the author’s tone?',
      steps: ['Praise: "ambitious", "admirably clear".', 'Criticism: the cost assumptions "few economists would accept".', 'Tone: appreciative but sceptical, not hostile or enthusiastic.'],
    },
    traps: ['Reporting the tone of a view the author quotes.', 'Choosing an extreme word because of one strong sentence.', 'Ignoring the concession that balances the tone.'],
  },
];

export const PRIMER_BY_TOPIC = Object.fromEntries(PRIMERS.map((p) => [p.topic, p]));
