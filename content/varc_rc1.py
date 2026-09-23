"""VARC reading comprehension, passages 1-6. All passages are original.
Every question lists `evidence`: exact substrings of the passage that
support the keyed answer; build_data.py verifies each quote verbatim."""
from common import add, add_set

S = "VARC"
RC = "Reading Comprehension"


def passage(pid, title, genre, body):
    add_set(pid, S, RC, genre, title, body)


def rc(pid, sub, diff, secs, text, options, ans, solution, fast, hint, trap, note, evidence):
    return add(S, RC, sub, diff, secs, text, ans, solution, fast, hint, trap, note,
               options=options, set_id=pid, evidence=evidence)


# ---------------------------------------------------------------- P01
passage("R01", "The trained viewer", "Economics & technology", """
For most of history, the scarce resource in communication was information itself. A pamphlet, a sermon or a letter arrived in a life that was, by modern standards, starved of messages, and the recipient could afford to give each one a patient hearing. Cheap printing, then broadcasting, and finally networked screens inverted this condition. Information is now so abundant that it is almost ambient, and what has become scarce is the capacity to attend to it. The economist Herbert Simon anticipated the point decades ago: a wealth of information creates a poverty of attention.

Once attention is understood as the scarce input, a great deal of contemporary commerce becomes legible. Platforms that charge users nothing are not charities; they are brokers who acquire attention cheaply and sell it dearly to advertisers. The product being refined is not the content but the user's time, and the refinement consists of learning precisely which stimulus will keep a particular person looking a little longer.

Critics often describe this arrangement as theft, but the metaphor is imperfect. Theft implies that the owner would have used the thing better. It is not obvious that the hours now spent scrolling would otherwise have gone to reading philosophy or tending gardens; some would have gone to television, which made similar bargains with far cruder tools. The stronger objection is not that attention is taken but that it is shaped. A system built to maximise time spent will, over millions of iterations, favour whatever reliably holds the eye—outrage, novelty, the unfinished story—regardless of whether the viewer, on reflection, endorses the hours so spent. The user is not robbed so much as trained.

This distinction matters for remedies. If the problem were theft, the answer would be restitution: give people back their time through limits and timers. If the problem is training, time limits treat the symptom while leaving the trainer at work. A more durable remedy would change what the system is rewarded for—measuring, say, whether users report that their time was well spent, rather than how much of it was spent. Such measures are harder to game and harder to monetise, which is precisely why they are rarely adopted voluntarily.

None of this requires treating users as helpless. People have always sought distraction, and a person who chooses an evening of light entertainment is exercising, not surrendering, autonomy. The concern is narrower: that the menu from which people choose is increasingly composed by systems whose interests diverge quietly from their own.
""")

rc("R01", "Main idea", "M", 90,
   "Which of the following best captures the central argument of the passage?",
   ["Attention platforms steal time that users would otherwise spend productively.",
    "The deeper harm of attention-driven platforms lies in how they shape behaviour, so remedies must change what these systems are rewarded for.",
    "Time limits and timers are the most practical remedy for excessive screen use.",
    "Users of free platforms are helpless before the advertisers who fund them."],
   1,
   """The author rejects 'theft' as the key problem and says 'The stronger objection is not that attention is taken but that it is shaped.'
   The remedy follows: 'A more durable remedy would change what the system is rewarded for'.
   ⟦A⟧ is the view the author calls an imperfect metaphor. ⟦C⟧ is dismissed as treating 'the symptom'. ⟦D⟧ contradicts 'None of this requires treating users as helpless.'""",
   "Main-idea answers must cover both the diagnosis (shaping) and the prescription (change the reward).",
   "Look for the sentence where the author says which objection is 'stronger'.",
   "Option ⟦A⟧ borrows the critics' word 'theft', which the author explicitly qualifies.",
   "In CAT, the author's position often appears right after 'but' or 'the stronger objection'.",
   ["The stronger objection is not that attention is taken but that it is shaped.",
    "A more durable remedy would change what the system is rewarded for"])
rc("R01", "Purpose / analogy", "M", 75,
   "The author mentions television primarily in order to:",
   ["show that television was more harmful than today's platforms.",
    "argue that platforms add no new risks beyond those television posed.",
    "question the assumption that the time now spent on platforms would otherwise have been used better.",
    "describe how advertisers refined their tools over the decades."],
   2,
   """The mention appears inside the argument against the theft metaphor: 'It is not obvious that the hours now spent scrolling would otherwise have gone to reading philosophy or tending gardens; some would have gone to television'.
   ⟦B⟧ overreaches: the author says television used 'far cruder tools', implying today's systems are more powerful. ⟦A⟧ and ⟦D⟧ are not claimed.""",
   "Ask what claim the example is attached to — here, the claim that 'theft' is imperfect.",
   "Read the sentence before the television reference.",
   "Option ⟦B⟧ sounds balanced but ignores 'far cruder tools'.",
   "Purpose-of-example questions: the example serves the sentence around it.",
   ["It is not obvious that the hours now spent scrolling would otherwise have gone to reading philosophy or tending gardens; some would have gone to television, which made similar bargains with far cruder tools."])
rc("R01", "Application", "H", 90,
   "Which of the following measures would the author most likely regard as a durable remedy?",
   ["A two-hour daily cap on app usage enforced by the phone's operating system.",
    "Paying users a small amount for every hour they spend on a platform.",
    "Judging a recommendation system by how many users later say their session was worthwhile.",
    "Requiring platforms to display a running timer on every screen."],
   2,
   """The author's durable remedy is to change the reward: 'measuring, say, whether users report that their time was well spent, rather than how much of it was spent.' Option ⟦C⟧ is exactly this.
   ⟦A⟧ and ⟦D⟧ are 'limits and timers', which 'treat the symptom'. ⟦B⟧ still rewards time spent.""",
   "Match the option to the author's own example of a durable remedy.",
   "Which option changes what the system is rewarded for?",
   "Choosing ⟦A⟧ or ⟦D⟧ because they sound protective; the author calls them symptomatic.",
   "Application questions: map each option onto the author's explicit criteria.",
   ["measuring, say, whether users report that their time was well spent, rather than how much of it was spent",
    "time limits treat the symptom while leaving the trainer at work"])
rc("R01", "Tone / attitude", "E", 45,
   "The author's attitude towards people who choose an evening of light entertainment is best described as:",
   ["contemptuous", "respectful of their autonomy", "anxious about their well-being", "indifferent"],
   1,
   """The author says such a person 'is exercising, not surrendering, autonomy'. That is respect, not contempt or anxiety.""",
   "Find the one sentence about these people and read its verb.",
   "Look at the final paragraph.",
   "Picking 'anxious' because the passage overall is critical of platforms.",
   "Tone questions are about a specific target; don't transfer the passage's general mood.",
   ["a person who chooses an evening of light entertainment is exercising, not surrendering, autonomy"])

# ---------------------------------------------------------------- P02
passage("R02", "Shade as infrastructure", "Ecology & cities", """
City planners have long treated street trees as ornaments: pleasant, occasionally troublesome, and the first line in the budget to be cut when money is short. That view is increasingly hard to defend. On a hot afternoon, the surface of an exposed asphalt road can be dramatically hotter than the air above it, and the heat it stores is released well into the night, when the human body most needs to cool down. A canopy of mature trees intercepts sunlight before it reaches the pavement and, through the evaporation of water from its leaves, cools the air around it. In a warming climate this is not decoration; it is a public health service.

The difficulty is that the service is distributed unevenly. Neighbourhoods that were planned generously decades ago tend to have wide pavements, gardens and old trees. Denser, poorer districts were often built with little room for either, and the residents who most need relief—those who work outdoors, live in poorly ventilated housing or cannot afford air conditioning—are frequently the ones with the least shade. Heat, in other words, maps onto older inequalities.

The obvious response is to plant, and many cities have announced ambitious targets measured in millions of saplings. Counting saplings, however, is a poor proxy for shade. A newly planted tree offers little cooling for a decade or more, and in harsh urban conditions a large share of saplings die within their first few years. A city that plants a million trees and loses half of them has spent heavily to create a statistic. What delivers shade is canopy, and canopy is the product of years of watering, pruning and protection from construction trenches and careless paving.

This shifts attention from planting to maintenance, a far less photogenic activity. It also suggests that the most valuable urban trees may be the ones that already exist. Felling a mature tree to widen a road and replacing it with five saplings may look like a net gain on paper while leaving the street measurably hotter for a generation.

None of this means that new planting is futile. It means that urban forestry should be judged by the canopy it sustains over time rather than by the numbers it announces at a ceremony.
""")

rc("R02", "Main idea", "E", 60,
   "The passage is primarily concerned with arguing that:",
   ["cities should stop planting new trees and focus only on existing ones.",
    "street trees are a public-health asset whose value depends on sustained canopy rather than planting counts.",
    "poorer neighbourhoods suffer more from heat because of bad planning decisions made recently.",
    "air conditioning is a better solution to urban heat than trees."],
   1,
   """The passage reframes trees as 'a public health service' and concludes they 'should be judged by the canopy it sustains over time rather than by the numbers it announces'.
   ⟦A⟧ contradicts 'None of this means that new planting is futile.' ⟦C⟧ distorts 'planned generously decades ago' (older, not recent). ⟦D⟧ is never argued.""",
   "The last paragraph usually restates the thesis in balanced form.",
   "Read the final sentence.",
   "Option ⟦A⟧ takes the maintenance argument to an extreme the author rejects.",
   "Watch for extreme options ('only', 'stop') in main-idea questions.",
   ["it is a public health service",
    "urban forestry should be judged by the canopy it sustains over time rather than by the numbers it announces at a ceremony"])
rc("R02", "Inference", "M", 75,
   "Which of the following can be inferred about a city that fells mature trees to widen a road and plants five saplings for each tree removed?",
   ["The city will have more shade within a few years.",
    "The street is likely to be hotter for many years despite the higher tree count.",
    "The city has violated its planting targets.",
    "The saplings will certainly die within a few years."],
   1,
   """The author says such a swap 'may look like a net gain on paper while leaving the street measurably hotter for a generation.'
   ⟦A⟧ contradicts the decade-long delay. ⟦C⟧ is irrelevant. ⟦D⟧ overstates: 'a large share' die, not all.""",
   "The passage states this almost directly.",
   "Find the 'five saplings' sentence.",
   "Option ⟦D⟧ turns 'a large share' into 'certainly'.",
   "Inference answers stay within what the text supports; beware absolute words.",
   ["Felling a mature tree to widen a road and replacing it with five saplings may look like a net gain on paper while leaving the street measurably hotter for a generation."])
rc("R02", "Detail", "E", 45,
   "According to the passage, why is the heat stored by asphalt particularly harmful?",
   ["It damages the roots of nearby trees.",
    "It is released at night, when the body most needs to cool down.",
    "It evaporates water from leaves.",
    "It raises the cost of air conditioning in wealthy areas."],
   1,
   """'the heat it stores is released well into the night, when the human body most needs to cool down.'""",
   "Detail question: locate and match.",
   "First paragraph.",
   "Option ⟦C⟧ confuses the cooling mechanism of trees with the heating of asphalt.",
   "For detail questions, paraphrase the exact line.",
   ["the heat it stores is released well into the night, when the human body most needs to cool down"])
rc("R02", "Author's view", "M", 60,
   "The author's comment that a city may 'spend heavily to create a statistic' suggests that the author regards large planting targets as:",
   ["a sensible first step that guarantees future shade.",
    "potentially more useful for publicity than for actual cooling.",
    "fraudulent attempts to mislead citizens.",
    "irrelevant to the problem of urban heat."],
   1,
   """The author contrasts announced numbers with real canopy: planting targets can yield a statistic without shade, and maintenance is 'a far less photogenic activity'.
   ⟦C⟧ ('fraudulent') is too strong; ⟦D⟧ contradicts 'None of this means that new planting is futile.'""",
   "Pick the moderate reading of the author's irony.",
   "Note the contrast with 'less photogenic' maintenance.",
   "Choosing 'fraudulent' — the author is sceptical, not accusatory.",
   "CAT tone answers are usually moderate: sceptical > hostile.",
   ["A city that plants a million trees and loses half of them has spent heavily to create a statistic.",
    "a far less photogenic activity"])

# ---------------------------------------------------------------- P03
passage("R03", "The untranslatable", "Language & literature", """
Every few years a list circulates of words that supposedly cannot be translated: a term in one language for the particular melancholy of a rainy Sunday, another for the pleasure of a first sip of coffee. Such lists are charming, and they flatter a widely held intuition that each language encloses a private world its speakers alone can inhabit. Translators tend to be less impressed. Their daily work consists of carrying meaning across exactly these supposed walls, and they know that almost anything can be rendered if one is willing to use a phrase where the original used a word.

What cannot be carried over intact is not meaning but economy. A single word that packs a situation, a mood and a social judgement into two syllables will usually become a clause, and the clause will lack the original's lightness. The reader of the translation understands what is meant but does not feel it arrive with the same speed. The loss, in other words, is rhythmic and textural rather than conceptual.

This distinction has consequences for how translation is judged. A critic who complains that a translated novel 'misses something' is often right, but usually wrong about what. The missing element is rarely an idea the translator failed to grasp; it is the pace at which ideas were delivered, the way a sentence in the original turned on a pun, a register shift or a borrowed word from a neighbouring dialect. These are the parts of a text most tied to the physical material of the language, and they are the parts a translator must reinvent rather than transfer.

Good translators therefore behave less like engineers building an exact replica and more like musicians transposing a piece into a different key. Some notes must move; a few passages must be rewritten so that they can be played at all on the new instrument. The test of success is not whether every element survives but whether the whole still moves the listener as the original did.

It follows that the romance of the untranslatable word gets the matter backwards. Single words are the easy part. The difficult part is everything that happens between words.
""")

rc("R03", "Main idea", "M", 75,
   "Which of the following best expresses the main point of the passage?",
   ["Some words in every language are genuinely impossible to translate.",
    "Translation mainly loses the economy, rhythm and texture of the original, not its meaning, so translators must recreate those qualities.",
    "Critics of translated novels are usually mistaken when they say something is missing.",
    "Translators should aim to produce exact replicas of the original text."],
   1,
   """'What cannot be carried over intact is not meaning but economy', and the loss 'is rhythmic and textural rather than conceptual'. Translators must 'reinvent rather than transfer' such features.
   ⟦A⟧ is the view the author debunks. ⟦C⟧ distorts: critics are 'often right, but usually wrong about what'. ⟦D⟧ contradicts the musician analogy.""",
   "The thesis is the reversal of the popular view in paragraph 1.",
   "Find what, according to the author, is actually lost.",
   "Option ⟦C⟧ misreads 'often right, but usually wrong about what'.",
   "Contrarian passages: the main idea is the author's correction, not the view being corrected.",
   ["What cannot be carried over intact is not meaning but economy.",
    "The loss, in other words, is rhythmic and textural rather than conceptual."])
rc("R03", "Inference", "H", 90,
   "The author would most likely agree that a critic who says a translated novel 'misses something':",
   ["is usually correct that the translator misunderstood key ideas.",
    "is usually correct that something is lost, though mistaken about what it is.",
    "is always wrong, because meaning can always be carried over.",
    "should read the novel only in the original language."],
   1,
   """'A critic who complains that a translated novel "misses something" is often right, but usually wrong about what.' The missing element is 'the pace at which ideas were delivered', not an idea.""",
   "Near-quotation from paragraph 3.",
   "Read the sentence about the critic closely.",
   "Option ⟦A⟧ is exactly what the author says the critic gets wrong.",
   "Two-part claims ('right, but wrong about what') are favourite CAT traps.",
   ["is often right, but usually wrong about what",
    "The missing element is rarely an idea the translator failed to grasp"])
rc("R03", "Purpose / analogy", "M", 60,
   "The comparison of translators to musicians transposing a piece into a different key is used to suggest that:",
   ["translation requires technical skill similar to engineering.",
    "a good translation may alter individual elements so that the whole produces an equivalent effect.",
    "translated texts should be read aloud to be appreciated.",
    "music is easier to translate than literature."],
   1,
   """'Some notes must move... The test of success is not whether every element survives but whether the whole still moves the listener as the original did.'
   ⟦A⟧ inverts the contrast: translators are 'less like engineers'.""",
   "The analogy's point is stated in the next sentence.",
   "Look at 'The test of success is...'.",
   "Option ⟦A⟧ picks the rejected half of the comparison.",
   "When an analogy has two halves (engineer vs musician), note which one the author endorses.",
   ["The test of success is not whether every element survives but whether the whole still moves the listener as the original did.",
    "less like engineers building an exact replica"])
rc("R03", "Tone / attitude", "M", 60,
   "The author's attitude towards lists of 'untranslatable' words is best described as:",
   ["enthusiastic endorsement", "gently sceptical", "openly hostile", "neutral and uncommitted"],
   1,
   """The author calls the lists 'charming' but says they 'get the matter backwards' — sceptical without hostility.""",
   "'Charming' + 'gets the matter backwards' = mild scepticism.",
   "Note both the compliment and the criticism.",
   "'Openly hostile' ignores 'charming'.",
   "Mixed signals usually point to a moderate tone.",
   ["Such lists are charming", "the romance of the untranslatable word gets the matter backwards"])

# ---------------------------------------------------------------- P04
passage("R04", "Whose objects?", "Culture & history", """
Large museums in former imperial capitals hold objects that were acquired, in many cases, under conditions their original owners did not freely accept: purchases made under duress, gifts extracted by treaty, or outright seizure during military campaigns. For much of the twentieth century these institutions defended their collections with an argument about universality. A great museum, they said, allows a visitor to see the art of many civilisations side by side, and this comparative encounter is itself a public good that would be lost if collections were dispersed.

The argument is not empty. Comparison does reveal things that isolated viewing cannot, and many objects have been preserved and studied with a care that might not otherwise have been available. But the universal museum's defence has a peculiar structure. It asks the communities from which objects were taken to accept that the objects are best appreciated far from them, by audiences who are mostly not them. Universality, in practice, has often meant that one set of cities hosts the world while the rest of the world must travel, obtain visas and pay admission to see its own past.

Recent debates have therefore moved from the question of whether an acquisition was legal at the time to the question of whether continued possession is just now. The shift matters because the first question can often be answered in the museum's favour—the laws of the period frequently permitted what would be condemned today—while the second cannot be settled by consulting old documents. It requires a judgement about relationships in the present.

Some institutions have responded by returning specific objects, others by long-term loans, joint custody or collaborative research. Each arrangement has critics. Returns can be derided as symbolic if they involve only a handful of items; loans can seem to confirm the museum's ownership even as they appear to share it. Yet the range of experiments suggests that the old binary—keep everything or give everything back—no longer describes the actual field of possibilities.

What seems to be emerging is a view of museums less as owners of objects than as custodians of relationships, answerable to more than one public.
""")

rc("R04", "Main idea", "M", 90,
   "Which of the following best summarises the passage?",
   ["Museums in former imperial capitals acquired their collections illegally and must return them.",
    "The universal-museum defence is being challenged by a focus on present justice, producing a range of arrangements beyond simple keeping or returning.",
    "Comparative viewing of art from many civilisations is the main public benefit of large museums.",
    "Loans of disputed objects are a disguised way for museums to keep ownership."],
   1,
   """The passage moves from the universality defence, to its 'peculiar structure', to the shift towards 'whether continued possession is just now', and to experiments showing 'the old binary... no longer describes' the options.
   ⟦A⟧ contradicts the point that acquisitions were often legal at the time. ⟦C⟧ and ⟦D⟧ are single details.""",
   "A summary must span the defence, the critique and the new range of responses.",
   "Track the passage's movement paragraph by paragraph.",
   "Option ⟦A⟧ — the passage explicitly separates legality then from justice now.",
   "Summary answers cover the arc of the passage, not one paragraph.",
   ["whether continued possession is just now",
    "the old binary—keep everything or give everything back—no longer describes the actual field of possibilities"])
rc("R04", "Inference", "H", 90,
   "Why, according to the passage, has the debate shifted from legality at the time of acquisition to justice in the present?",
   ["Because historical records of acquisitions have been lost.",
    "Because the legality question often favours museums, while present justice cannot be settled by old documents and requires a current judgement.",
    "Because international law now forbids museums from holding foreign objects.",
    "Because museums have admitted that all their acquisitions were illegal."],
   1,
   """'the first question can often be answered in the museum's favour... while the second cannot be settled by consulting old documents. It requires a judgement about relationships in the present.'""",
   "Paraphrase paragraph 3.",
   "Why does the shift 'matter'?",
   "Option ⟦C⟧ invents a legal change never mentioned.",
   "Causal questions: find 'because/therefore/the shift matters because'.",
   ["the first question can often be answered in the museum's favour",
    "the second cannot be settled by consulting old documents"])
rc("R04", "Author's view", "M", 75,
   "The author's treatment of the 'universality' argument can best be described as:",
   ["dismissive, since the argument has no merit.",
    "acknowledging its partial validity while exposing an imbalance in how it works in practice.",
    "fully supportive, since comparison is a public good.",
    "neutral, since the author does not evaluate it."],
   1,
   """'The argument is not empty' (partial validity) but it 'has a peculiar structure' in which one set of cities 'hosts the world while the rest of the world must travel'.""",
   "'Not empty… But…' signals a concession followed by a critique.",
   "Read the opening of paragraph 2.",
   "Choosing 'dismissive' by ignoring the concession.",
   "Concession + critique = balanced but critical.",
   ["The argument is not empty.", "one set of cities hosts the world while the rest of the world must travel"])
rc("R04", "Strengthen / weaken", "H", 90,
   "Which of the following, if true, would most weaken the universal museum's defence as presented in the passage?",
   ["Visitors to large museums report that side-by-side displays deepened their understanding.",
    "Digital high-resolution displays let viewers anywhere compare objects from many civilisations as effectively as seeing them together in one building.",
    "Many objects in large museums were acquired legally under the laws of the time.",
    "Some returned objects have been displayed in newly built local museums."],
   1,
   """The defence rests on the comparative encounter being 'a public good that would be lost if collections were dispersed'. If comparison no longer requires physical co-location, dispersal would not lose that good.
   ⟦A⟧ strengthens the defence. ⟦C⟧ concerns legality, not universality. ⟦D⟧ is about returns, not the defence's premise.""",
   "Attack the premise: 'would be lost if collections were dispersed'.",
   "What does the defence assume must stay together?",
   "Option ⟦C⟧ is true per the passage but does not bear on universality.",
   "Weaken = break the link between premise and conclusion.",
   ["this comparative encounter is itself a public good that would be lost if collections were dispersed"])

# ---------------------------------------------------------------- P05
passage("R05", "What the sugar pill knows", "Psychology & medicine", """
In a clinical trial, the group that receives an inert pill is usually there to be forgotten. Its purpose is to absorb everything that is not the drug—the passage of time, the attention of doctors, the natural tendency of many symptoms to fluctuate—so that the drug's specific effect can be isolated. Yet researchers have long noticed that placebo groups often improve by margins that are hard to dismiss, especially for conditions in which symptoms are reported by the patient, such as pain, nausea or fatigue.

Part of this improvement is statistical rather than psychological. Patients tend to enrol in trials when their symptoms are at their worst, and symptoms that are unusually severe tend, on average, to become less severe on their own. A group measured at its worst and then again later will appear to improve even if nothing at all has been done. Any honest account of the placebo effect must subtract this regression before crediting the mind.

What remains, however, is not nothing. Expectation seems to alter how the brain processes certain signals, particularly pain. The ritual of treatment—the consultation, the prescription, the tablet taken at a set hour—appears to contribute to relief independently of the pill's contents. Some studies have even reported benefits when patients were told openly that their pills contained no active ingredient, though such findings are modest and still debated.

These observations invite two opposite errors. One is to treat the placebo effect as a kind of mind-over-matter cure, capable of shrinking tumours or repairing tissue; the evidence for effects on objective measures of disease is thin. The other is to dismiss it as mere illusion, as if relief from pain that a patient genuinely feels were somehow less real because its cause was an expectation. For conditions defined largely by experience, a change in experience is not a side issue.

The practical lesson may be modest but important. The manner in which care is delivered is itself part of the treatment, and a system that shortens every consultation in the name of efficiency may be discarding an ingredient it never learned to measure.
""")

rc("R05", "Main idea", "M", 75,
   "The passage is best described as:",
   ["an argument that placebos can cure serious diseases through the power of the mind.",
    "a demonstration that placebo effects are entirely statistical illusions.",
    "a balanced account that separates statistical artefacts from genuine expectation effects and draws a lesson about how care is delivered.",
    "a criticism of clinical trials for using placebo groups."],
   2,
   """The author subtracts regression ('Part of this improvement is statistical'), affirms a residue ('What remains, however, is not nothing'), warns against 'two opposite errors', and concludes that 'The manner in which care is delivered is itself part of the treatment'.
   ⟦A⟧ and ⟦B⟧ are the two errors. ⟦D⟧ is not argued.""",
   "The 'two opposite errors' paragraph tells you the author sits in the middle.",
   "Which options match the two errors the author rejects?",
   "Picking ⟦B⟧ after reading only paragraph 2.",
   "Balanced passages: eliminate both extremes.",
   ["Part of this improvement is statistical rather than psychological.",
    "What remains, however, is not nothing.",
    "The manner in which care is delivered is itself part of the treatment"])
rc("R05", "Inference", "H", 90,
   "According to the passage, why might a group of trial patients appear to improve even if they receive no treatment at all?",
   ["Because doctors pay more attention to patients in trials.",
    "Because patients often enrol when symptoms are at their worst, and extreme symptoms tend on average to become less severe on their own.",
    "Because placebos contain small amounts of active ingredients.",
    "Because patients are told that their pills are inert."],
   1,
   """Paragraph 2: 'Patients tend to enrol in trials when their symptoms are at their worst, and symptoms that are unusually severe tend, on average, to become less severe on their own.'""",
   "This is regression to the mean.",
   "Paragraph 2.",
   "Option ⟦A⟧ is a real factor but the question says 'no treatment at all'.",
   "Know regression to the mean: extreme first measurements drift back toward average.",
   ["Patients tend to enrol in trials when their symptoms are at their worst"])
rc("R05", "Author's view", "M", 60,
   "Which of the following statements would the author most likely reject?",
   ["Relief from pain caused by expectation is still real relief.",
    "Evidence that placebos change objective measures of disease is thin.",
    "Shorter consultations may remove part of what makes treatment work.",
    "Because placebo relief comes from expectation, it should not count as genuine improvement."],
   3,
   """The author calls dismissing placebo relief 'as mere illusion' an error: relief a patient 'genuinely feels' is not 'less real because its cause was an expectation'. ⟦A⟧, ⟦B⟧, ⟦C⟧ are all endorsed.""",
   "'Reject' questions: find the option matching an error the author names.",
   "Look at the 'two opposite errors'.",
   "Rushing and picking ⟦B⟧, which the author actually asserts.",
   "EXCEPT/reject questions: verify each option against the text.",
   ["The other is to dismiss it as mere illusion",
    "the evidence for effects on objective measures of disease is thin"])
rc("R05", "Vocabulary in context", "E", 45,
   "In the passage, the phrase 'an ingredient it never learned to measure' refers to:",
   ["an undisclosed chemical in placebo pills.",
    "the contribution that the manner of care makes to treatment outcomes.",
    "the natural fluctuation of symptoms over time.",
    "the costs of running clinical trials."],
   1,
   """It follows 'The manner in which care is delivered is itself part of the treatment'; shortening consultations discards that ingredient.""",
   "Read the sentence the phrase completes.",
   "What would 'shortening every consultation' discard?",
   "Taking 'ingredient' literally (option A).",
   "Metaphors in the last line usually point back to the passage's thesis.",
   ["The manner in which care is delivered is itself part of the treatment"])

# ---------------------------------------------------------------- P06
passage("R06", "The repair question", "Society & economy", """
A generation ago, a household appliance that stopped working was usually taken to a repair shop. Today it is more likely to be replaced. The shift is often blamed on manufacturers who design products to fail—so-called planned obsolescence—and there are documented cases of firms doing exactly that. But the fuller explanation is less conspiratorial and in some ways more troubling, because it involves decisions that are individually reasonable.

Consider the economics of a small repair. Manufacturing has become astonishingly cheap as production has been automated and moved to low-cost locations. Labour in the places where products are used has not become cheap in the same way. A technician's hour may now cost a large fraction of the price of a new device, and that is before the time spent diagnosing the fault, sourcing a part and returning the item. For many goods the arithmetic simply favours replacement, even when nothing about the product was designed to fail.

Design choices then reinforce the arithmetic. Components glued rather than screwed together are cheaper to assemble and make devices thinner, which consumers reward. They also make repair slower and riskier. Proprietary parts and diagnostic software protect firms' revenues and, they argue, their customers' safety; they also limit who is able to fix things. Each choice has a defensible rationale. Together they produce a world in which repair is gradually designed out.

The costs of this world are not paid at the till. They appear as electronic waste, as the energy and materials embodied in products discarded early, and as the slow loss of a practical skill that was once widespread. Because these costs fall on no single buyer or seller, markets tend to ignore them.

The recent movement for a 'right to repair' is best understood in this light. Its most effective proposals do not try to make repair cheaper than replacement by decree. They aim instead at the design and information choices—requiring access to manuals, spare parts and diagnostic tools—that determine whether repair is possible at all. The aim is to restore an option, not to mandate a behaviour.
""")

rc("R06", "Main idea", "M", 90,
   "Which of the following best states the author's explanation for the decline of repair?",
   ["Manufacturers deliberately design most products to fail early.",
    "Consumers no longer value durability.",
    "A combination of cheap manufacturing, costly local labour and individually reasonable design choices has made repair uneconomic or impossible.",
    "Repair technicians have lost their skills because of automation."],
   2,
   """The author calls planned obsolescence only part of the story and offers a 'fuller explanation' involving 'decisions that are individually reasonable': cheap manufacturing vs costly labour (paragraph 2) and design choices that 'Together... produce a world in which repair is gradually designed out'.
   ⟦A⟧ is the partial explanation the author goes beyond. ⟦D⟧ reverses cause and effect.""",
   "The 'fuller explanation' has two parts: arithmetic + design.",
   "What does the author contrast with planned obsolescence?",
   "Option ⟦A⟧ — documented cases exist, but the author calls it the less complete account.",
   "When a passage says 'the fuller explanation', the answer is that fuller account.",
   ["the fuller explanation is less conspiratorial and in some ways more troubling, because it involves decisions that are individually reasonable",
    "Together they produce a world in which repair is gradually designed out."])
rc("R06", "Inference", "M", 75,
   "Why does the author describe the fuller explanation as 'more troubling' than planned obsolescence?",
   ["Because it implies that consumers are to blame.",
    "Because no single bad actor is responsible, so the problem cannot be fixed simply by punishing deceptive firms.",
    "Because it shows that repair was never economical.",
    "Because it proves that manufacturers lie about safety."],
   1,
   """The fuller explanation 'involves decisions that are individually reasonable' and costs that 'fall on no single buyer or seller'. With no villain, there is no simple target.""",
   "'Individually reasonable' is the key phrase.",
   "Why is a problem with no villain harder?",
   "Option ⟦A⟧ — the passage does not blame consumers.",
   "Inference questions often hinge on a single qualifying phrase.",
   ["decisions that are individually reasonable", "Because these costs fall on no single buyer or seller"])
rc("R06", "Detail", "E", 45,
   "According to the passage, the most effective right-to-repair proposals aim to:",
   ["make repair cheaper than replacement by law.",
    "ban glued components.",
    "require access to manuals, spare parts and diagnostic tools so that repair remains possible.",
    "require consumers to repair products before replacing them."],
   2,
   """'They aim instead at the design and information choices—requiring access to manuals, spare parts and diagnostic tools'. ⟦A⟧ and ⟦D⟧ are what they do not do ('not... by decree', 'not to mandate a behaviour').""",
   "Locate the last paragraph.",
   "What do they 'not try' to do?",
   "Option ⟦A⟧ is explicitly rejected.",
   "Detail questions often include the explicitly denied option as a trap.",
   ["requiring access to manuals, spare parts and diagnostic tools", "The aim is to restore an option, not to mandate a behaviour."])
rc("R06", "Strengthen / weaken", "H", 90,
   "Which of the following, if true, would most strengthen the author's claim that repair economics are driven largely by the gap between manufacturing and labour costs?",
   ["In countries where technicians' wages are low relative to product prices, small appliances are repaired far more often.",
    "Many consumers say they prefer new products to repaired ones.",
    "Some manufacturers have been fined for deliberately shortening product life.",
    "Electronic waste has grown rapidly in recent decades."],
   0,
   """If repair rates rise where labour is cheap relative to products, that directly supports the cost-gap explanation.
   ⟦B⟧ is about preference. ⟦C⟧ supports planned obsolescence, the rival explanation. ⟦D⟧ is a consequence, not a cause.""",
   "A strengthener shows the proposed cause varying with the effect.",
   "Look for an option that varies labour cost and observes repair.",
   "Option ⟦C⟧ supports the rival explanation.",
   "Natural experiments (cause varies → effect varies) are the strongest strengtheners.",
   ["Labour in the places where products are used has not become cheap in the same way.",
    "For many goods the arithmetic simply favours replacement"])
