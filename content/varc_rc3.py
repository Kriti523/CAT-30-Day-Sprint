"""VARC reading comprehension, passages 12-16 (original)."""
from varc_rc1 import passage, rc

# ---------------------------------------------------------------- P12
passage("R12", "Memory without paper", "Anthropology", """
Societies that relied on oral transmission are often imagined as fragile archives, their histories distorted a little more with every retelling until only legend remains. The image owes more to the habits of literate cultures than to evidence. Where oral traditions have been studied closely, they turn out to use a range of techniques that make certain kinds of information remarkably durable.

Rhythm and formula are the most familiar. A line that must fit a metre resists casual alteration, because a substituted word will often break the pattern and be noticed by listeners who know how the line should sound. Genealogies are frequently recited in fixed sequences, sometimes accompanied by gestures or tied to features of the landscape, so that walking a route becomes a way of rehearsing a lineage. Public performance adds a further check: an audience that has heard a story many times acts as a distributed editor, correcting errors in real time.

None of this means that oral traditions preserve everything unchanged. They are selective in ways that reflect their purpose. Details that serve a community's present needs—claims to land, obligations between families, the origins of a ritual—are guarded closely, while details that no longer matter may drift or disappear. A tradition can therefore be highly accurate about who owes what to whom and quite unreliable about the order of events centuries ago.

This selectivity is sometimes treated as a defect, a failure to meet the standards of a written archive. But written archives are selective too. They preserve what institutions chose to record, in the language of those institutions, and they fall silent about people who did not write or were not written about. The difference is that the selectivity of an archive is less visible, because documents carry an air of neutrality that a spoken performance does not claim.

For historians, the practical lesson is not to rank oral and written sources on a single scale of reliability but to ask of each what it was designed to remember—and therefore what it was likely to forget.
""")

rc("R12", "Main idea", "M", 90,
   "The author's main purpose in the passage is to:",
   ["show that oral traditions preserve all information perfectly.",
    "argue that written archives are useless to historians.",
    "challenge the view of oral traditions as fragile, while showing that both oral and written sources are selective in ways historians must account for.",
    "describe the use of rhythm in poetry."],
   2,
   """Paragraph 1 challenges the 'fragile archives' image; paragraph 3 notes selectivity; paragraph 4 says 'written archives are selective too'; the conclusion asks what each source 'was designed to remember'.
   ⟦A⟧ contradicts 'None of this means that oral traditions preserve everything unchanged.'""",
   "The answer must include both the challenge and the balancing point.",
   "Read the first and last paragraphs together.",
   "Option ⟦A⟧ overstates the author's defence.",
   "Balanced conclusions usually beat extreme ones.",
   ["The image owes more to the habits of literate cultures than to evidence.",
    "But written archives are selective too."])
rc("R12", "Detail", "E", 45,
   "According to the passage, how does an audience help preserve an oral tradition?",
   ["By writing the story down after each performance.",
    "By correcting errors in real time, acting as a distributed editor.",
    "By inventing new details to keep the story interesting.",
    "By paying the performer to memorise the text."],
   1,
   """'an audience that has heard a story many times acts as a distributed editor, correcting errors in real time.'""",
   "Direct match.",
   "Paragraph 2, last sentence.",
   "Option ⟦C⟧ is the opposite of preservation.",
   "Detail: find the sentence, paraphrase, match.",
   ["acts as a distributed editor, correcting errors in real time"])
rc("R12", "Inference", "H", 90,
   "Which of the following would the author most likely expect an oral tradition to preserve most accurately?",
   ["The exact sequence of battles fought many centuries ago.",
    "The rights of particular families to use a piece of land.",
    "The weather on the day a village was founded.",
    "The names of foreign traders who once passed through."],
   1,
   """'Details that serve a community's present needs—claims to land, obligations between families... —are guarded closely', while the tradition may be 'quite unreliable about the order of events centuries ago.'""",
   "Present use ⇒ preserved.",
   "What does a community still need?",
   "Option ⟦A⟧ is precisely what the author says may be unreliable.",
   "Selective preservation follows present purpose.",
   ["claims to land, obligations between families", "quite unreliable about the order of events centuries ago"])
rc("R12", "Author's view", "M", 75,
   "According to the author, why is the selectivity of written archives 'less visible'?",
   ["Because archives are stored in inaccessible places.",
    "Because documents carry an air of neutrality that spoken performances do not claim.",
    "Because historians refuse to study archives.",
    "Because archives record everything."],
   1,
   """'documents carry an air of neutrality that a spoken performance does not claim.' ⟦D⟧ contradicts the whole paragraph.""",
   "Direct 'because' clause.",
   "Paragraph 4, last sentence.",
   "Option ⟦D⟧ contradicts 'written archives are selective too'.",
   "Watch for options that deny the paragraph's premise.",
   ["documents carry an air of neutrality that a spoken performance does not claim"])

# ---------------------------------------------------------------- P13
passage("R13", "Four days, same work?", "Economics of work", """
Trials of a four-day working week, in which employees keep their full pay while working fewer hours, have produced results that surprise sceptics. Many participating firms report that output held steady or even rose, that staff took fewer sick days, and that fewer people resigned. Enthusiasts conclude that the five-day week is an industrial relic whose time has passed.

The results deserve attention, but they also deserve scrutiny. Firms that volunteer for such trials are not a random sample. They tend to be organisations whose managers already believe the idea might work and whose work can be reorganised without obvious loss: offices rather than hospitals, software rather than shift manufacturing. Their success shows that a shorter week can work in some settings; it does not show that it will work everywhere.

There is also the question of mechanism. If output holds steady with fewer hours, something must have changed in how the hours were used. Participating firms often report cutting meetings, reducing interruptions and dropping low-value tasks. These are real gains, but they raise an awkward possibility: the improvement may come from the reorganisation that the trial forced rather than from the shorter week itself. A firm that made the same changes while keeping five days might capture much of the benefit and bank the extra day's output.

Defenders reply that the reorganisation would never have happened without the pressure of a lost day. Organisations are slow to question their routines, and a hard constraint concentrates attention in a way that exhortation does not. On this view the shorter week is not merely a reward but a forcing device.

Both positions can be partly true. The practical questions are narrower than the slogans suggest: for which kinds of work, measured over what period, and with what effects on the people—customers, patients, colleagues in other firms—who depend on those workers being available.
""")

rc("R13", "Main idea", "M", 90,
   "Which of the following best summarises the author's position?",
   ["The four-day week has been proven to work in all industries.",
    "The four-day week is a failed experiment.",
    "Trial results are encouraging but limited by self-selection and an unclear mechanism, so the real questions concern which kinds of work, over what period and with what wider effects.",
    "Firms should cut meetings rather than working hours."],
   2,
   """'The results deserve attention, but they also deserve scrutiny.' The author cites non-random samples and the mechanism question, then concludes 'The practical questions are narrower than the slogans suggest'.""",
   "Look for the 'deserve attention, but…' framing.",
   "Paragraph 2 opening and the last paragraph.",
   "Option ⟦D⟧ is one possibility the author raises, not the thesis.",
   "Measured scepticism is a common CAT author stance.",
   ["The results deserve attention, but they also deserve scrutiny.",
    "The practical questions are narrower than the slogans suggest"])
rc("R13", "Inference", "H", 90,
   "The author's point about firms that volunteer for trials implies that:",
   ["trial results cannot be trusted at all.",
    "the success of the trials may not generalise to other kinds of organisations.",
    "hospitals have already adopted four-day weeks.",
    "managers who volunteer are dishonest about results."],
   1,
   """'Their success shows that a shorter week can work in some settings; it does not show that it will work everywhere.' ⟦A⟧ and ⟦D⟧ overstate.""",
   "Self-selection limits generalisation.",
   "What does a non-random sample prevent?",
   "Option ⟦A⟧ — the author says results 'deserve attention'.",
   "Self-selection bias: results true for volunteers may not transfer.",
   ["it does not show that it will work everywhere"])
rc("R13", "Strengthen / weaken", "H", 90,
   "Which of the following findings would most weaken the defenders' claim that the shorter week acts as a 'forcing device'?",
   ["Firms that cut meetings while keeping a five-day week achieved productivity gains as large as those of four-day trial firms.",
    "Staff at four-day firms reported higher satisfaction.",
    "Four-day trial firms took fewer sick days.",
    "Hospitals find it hard to adopt a four-day week."],
   0,
   """The defenders say reorganisation 'would never have happened without the pressure of a lost day'. If five-day firms reorganised and gained as much, the lost day was not necessary.""",
   "Show the effect occurring without the supposed cause.",
   "What does 'would never have happened without' predict?",
   "Option ⟦B⟧ or ⟦C⟧ — benefits, but they don't address the mechanism.",
   "To weaken a necessity claim, show the outcome without the condition.",
   ["the reorganisation would never have happened without the pressure of a lost day"])
rc("R13", "Detail", "E", 45,
   "Which of the following is NOT reported in the passage as a result claimed by participating firms?",
   ["Output held steady or rose.",
    "Fewer sick days were taken.",
    "Fewer employees resigned.",
    "Customer complaints fell sharply."],
   3,
   """The passage lists output, sick days and resignations. Customer complaints are not mentioned (customers appear only as a question to consider).""",
   "Tick off the three listed results.",
   "Paragraph 1.",
   "Choosing a listed result by skimming.",
   "NOT questions: the right answer is absent from the text.",
   ["output held steady or even rose, that staff took fewer sick days, and that fewer people resigned"])

# ---------------------------------------------------------------- P14
passage("R14", "Descending to the water", "Architecture & history", """
In the dry regions of western India, communities for centuries built stepwells: deep, stone-lined shafts in which flights of steps lead down to water that sits far below the surface for much of the year. The practical logic is simple. Where the water table rises and falls sharply with the monsoon, a well that can be approached at any depth remains usable in every season. But practical logic does not explain why many stepwells are so elaborately carved, why they include shaded landings and pavilions, or why some were endowed by wealthy patrons as acts of public merit.

The answer lies in how water was experienced. Collecting it was a daily task, often performed by women, and the stepwell was one of the few spaces outside the home where they could gather, rest and talk. The cool air at lower levels offered relief from summer heat. The carvings of deities and everyday scenes turned a utilitarian descent into something closer to a procession. To build a stepwell was to build a public room organised around a shared necessity.

Many stepwells fell out of use during the colonial period and after, as piped water and tube wells made them seem obsolete. Some were filled in or became dumping grounds. Their decline is usually told as a story of technological progress, and in one sense it is: piped water spared people hours of labour. But the story leaves something out. The new systems delivered water to individual households and, in doing so, removed the reason for a daily public gathering. What was gained in convenience was partly paid for in a thinning of shared space.

Recent efforts to restore stepwells often present them as heritage monuments, cleaned and lit for visitors. This preserves the stone but not always the purpose. A restored stepwell that no one needs to visit is a museum of a social arrangement rather than the arrangement itself.

The more ambitious question is whether the principle behind stepwells—infrastructure that is also a civic space—can inform how water systems are designed today, especially as groundwater grows scarcer and communities look again at harvesting rain.
""")

rc("R14", "Main idea", "M", 90,
   "Which of the following best captures the central idea of the passage?",
   ["Stepwells were built mainly as religious monuments.",
    "Stepwells combined a practical water function with a civic and social role, and their decline and restoration raise questions about what modern infrastructure leaves out.",
    "Piped water was a mistake that should be reversed.",
    "Stepwell restoration projects have fully revived their original purpose."],
   1,
   """'To build a stepwell was to build a public room organised around a shared necessity.' The decline 'leaves something out', restoration 'preserves the stone but not always the purpose', and the final question is about 'infrastructure that is also a civic space'.
   ⟦C⟧ overstates: the author grants that piped water 'spared people hours of labour'.""",
   "The thesis connects past function, decline and a present question.",
   "Look for the 'public room' idea recurring.",
   "Option ⟦C⟧ ignores the concession about convenience.",
   "Nuanced passages concede a point before adding a cost.",
   ["To build a stepwell was to build a public room organised around a shared necessity.",
    "infrastructure that is also a civic space"])
rc("R14", "Inference", "M", 75,
   "The author's comment that a restored stepwell may be 'a museum of a social arrangement rather than the arrangement itself' suggests that:",
   ["restoration is pointless.",
    "preserving the structure does not recreate the everyday use that gave it social meaning.",
    "stepwells should be closed to visitors.",
    "museums are the best way to preserve heritage."],
   1,
   """'This preserves the stone but not always the purpose. A restored stepwell that no one needs to visit...' — the social use is missing.""",
   "Stone vs purpose.",
   "Read the preceding sentence.",
   "Option ⟦A⟧ is too extreme ('not always').",
   "Metaphors are usually explained by the adjacent sentence.",
   ["This preserves the stone but not always the purpose."])
rc("R14", "Detail", "E", 45,
   "According to the passage, why did stepwells allow water to be used in every season?",
   ["Because they stored rainwater in covered tanks.",
    "Because their steps let people reach water at whatever depth it stood as the water table rose and fell.",
    "Because patrons refilled them in summer.",
    "Because they were connected to rivers."],
   1,
   """'a well that can be approached at any depth remains usable in every season.'""",
   "Direct.",
   "Paragraph 1.",
   "Options invent mechanisms not in the passage.",
   "Detail answers restate the text.",
   ["a well that can be approached at any depth remains usable in every season"])
rc("R14", "Tone / attitude", "M", 60,
   "The author's attitude towards the usual account of stepwells' decline as technological progress is best described as:",
   ["complete agreement", "outright rejection", "qualified acceptance that points to an overlooked cost", "amused indifference"],
   2,
   """'in one sense it is... But the story leaves something out.'""",
   "'In one sense… But…' = qualified.",
   "Paragraph 3.",
   "Choosing 'outright rejection' by skipping the concession.",
   "Concession markers signal a qualified stance.",
   ["in one sense it is", "But the story leaves something out."])

# ---------------------------------------------------------------- P15
passage("R15", "The compass within", "Science", """
Many migratory birds travel thousands of kilometres between breeding and wintering grounds, often at night and over featureless ocean. How they find their way has puzzled naturalists for centuries. Experiments over the past several decades have shown that birds draw on several cues: the position of the sun, the rotation of the night sky around the celestial pole, landmarks such as coastlines, and—most mysteriously—the Earth's magnetic field.

The evidence for a magnetic sense is strong even though its mechanism is not settled. Birds held in cages during the migratory season tend to hop in the direction they would fly; when the magnetic field around the cage is artificially rotated, the direction of hopping often rotates with it. Such experiments show that birds can use magnetic information. They do not show how that information is detected.

Two broad hypotheses have been proposed. One suggests that tiny particles of a magnetic iron mineral act like compass needles somewhere in the bird's body. The other proposes that certain light-sensitive molecules in the eye undergo chemical reactions whose outcome depends subtly on the direction of the magnetic field, so that a bird might, in some sense, see the field as a pattern overlaid on its vision. The second hypothesis is supported by findings that magnetic orientation in some species depends on light of particular wavelengths, though it remains difficult to demonstrate directly in a living animal.

The two hypotheses need not be rivals. A bird might use one system to sense the direction of the field and another to sense its strength, which varies with latitude and could serve as a kind of map. Redundancy of this sort is common in navigation, biological or otherwise: a system that can cross-check several cues is less likely to be led astray when one of them fails.

What makes the question hard is not a shortage of ingenuity but the subtlety of the effect being studied. The Earth's field is weak, and any biological sensor for it must work reliably amid the noise of a living body. That birds manage this at all is a reminder of how much sensory experience lies outside the human range.
""")

rc("R15", "Main idea", "M", 90,
   "Which of the following best describes the passage?",
   ["A proof that birds navigate using iron particles in their beaks.",
    "An account of evidence that birds sense the magnetic field, the competing hypotheses about how, and why the question is hard.",
    "A description of the routes taken by migratory birds.",
    "An argument that birds rely only on the sun and stars."],
   1,
   """The passage reports strong evidence for a magnetic sense, sets out 'Two broad hypotheses', notes they 'need not be rivals', and explains why the question is hard.
   ⟦A⟧ overstates; the mechanism 'is not settled'. ⟦D⟧ contradicts the magnetic evidence.""",
   "Evidence → hypotheses → difficulty.",
   "Map the paragraphs.",
   "Option ⟦A⟧ presents a hypothesis as proved.",
   "Science passages: separate what is shown from what is hypothesised.",
   ["The evidence for a magnetic sense is strong even though its mechanism is not settled.",
    "Two broad hypotheses have been proposed."])
rc("R15", "Inference", "H", 90,
   "The caged-bird experiments described in the passage establish that birds:",
   ["detect the magnetic field through their eyes.",
    "can use magnetic information to orient themselves, though not how they detect it.",
    "prefer to migrate at night.",
    "use magnetic iron particles as compass needles."],
   1,
   """'Such experiments show that birds can use magnetic information. They do not show how that information is detected.'""",
   "What vs how.",
   "Paragraph 2, last two sentences.",
   "Picking one of the mechanism hypotheses (⟦A⟧ or ⟦D⟧).",
   "Distinguish what an experiment shows from what it cannot show.",
   ["Such experiments show that birds can use magnetic information.", "They do not show how that information is detected."])
rc("R15", "Author's view", "M", 75,
   "The author suggests that the two hypotheses 'need not be rivals' because:",
   ["both have been conclusively proven.",
    "a bird might use one system for the field's direction and another for its strength, and redundancy helps navigation.",
    "neither hypothesis is supported by any evidence.",
    "birds do not actually use the magnetic field."],
   1,
   """'A bird might use one system to sense the direction of the field and another to sense its strength... a system that can cross-check several cues is less likely to be led astray'.""",
   "Two systems, two jobs.",
   "Paragraph 4.",
   "Option ⟦A⟧ contradicts 'not settled'.",
   "Complementary hypotheses are a common resolution in science passages.",
   ["A bird might use one system to sense the direction of the field and another to sense its strength"])
rc("R15", "Detail", "E", 45,
   "Which finding does the passage cite in support of the light-based hypothesis?",
   ["Birds hop in the direction they would fly.",
    "Magnetic orientation in some species depends on light of particular wavelengths.",
    "Birds use coastlines as landmarks.",
    "The Earth's field is weak."],
   1,
   """'The second hypothesis is supported by findings that magnetic orientation in some species depends on light of particular wavelengths'.""",
   "Direct.",
   "End of paragraph 3.",
   "Option ⟦A⟧ supports a magnetic sense in general, not the light mechanism.",
   "Match evidence to the specific claim it supports.",
   ["depends on light of particular wavelengths"])

# ---------------------------------------------------------------- P16
passage("R16", "The confident forecaster", "Decision science", """
Ask experts to forecast an uncertain quantity—next year's inflation, the date a project will be finished, the vote share of a party—and then ask them to give a range within which they are ninety per cent sure the true value will fall. Studies of such exercises have repeatedly found the same pattern: the true value lands outside the stated range far more often than one time in ten. The ranges are too narrow. People, including experts, are systematically overconfident about the precision of their knowledge.

Part of the explanation is psychological. A narrow range feels informative and a wide one feels evasive; forecasters who hedge widely may be seen as less competent even when they are more honest. Part is structural. Experts are often rewarded for bold predictions that happen to come true, and the costs of confident errors are diffuse or quickly forgotten. Over time, an environment of this kind selects for confidence rather than calibration.

Remedies exist, and some are surprisingly simple. Forecasters who are asked to imagine that their prediction has failed and to explain why tend to widen their ranges. Keeping score—recording forecasts and comparing them with outcomes—allows people to see their own patterns of error, which few otherwise notice. Averaging the independent estimates of several forecasters often beats the best individual, because their errors partly cancel.

These techniques share a feature: each introduces information that the forecaster's own intuition tends to suppress. Imagining failure brings alternative scenarios into view. Keeping score substitutes a record for a flattering memory. Averaging brings in perspectives that no single mind contains.

The broader lesson is not that experts should be ignored. Expertise often improves the centre of a forecast even when it fails to widen the range. The lesson is that a forecast is incomplete without an honest statement of its uncertainty, and that such honesty is more likely to be produced by procedures than by good intentions.
""")

rc("R16", "Main idea", "M", 90,
   "The central argument of the passage is that:",
   ["experts' forecasts are worthless and should be ignored.",
    "forecasters are systematically overconfident, and honest statements of uncertainty are best produced by procedures that supply information intuition suppresses.",
    "averaging forecasts is always better than consulting experts.",
    "psychology alone explains why forecasts fail."],
   1,
   """Paragraph 1 documents overconfidence; paragraphs 3–4 give procedural remedies that 'introduce information that the forecaster's own intuition tends to suppress'; the conclusion: honesty 'is more likely to be produced by procedures than by good intentions.'
   ⟦A⟧ contradicts 'The broader lesson is not that experts should be ignored.'""",
   "Problem + procedural remedy.",
   "Read the last sentence.",
   "Option ⟦A⟧ is explicitly denied.",
   "'The broader lesson is not X… The lesson is Y' — pick Y.",
   ["The ranges are too narrow.", "more likely to be produced by procedures than by good intentions"])
rc("R16", "Inference", "H", 90,
   "Why, according to the passage, does averaging several forecasters' estimates often beat the best individual?",
   ["Because the best individual is usually dishonest.",
    "Because their errors partly cancel out.",
    "Because groups are always wiser than individuals.",
    "Because averaging widens every range."],
   1,
   """'Averaging the independent estimates of several forecasters often beats the best individual, because their errors partly cancel.'
   ⟦C⟧ overstates ('always').""",
   "Direct 'because'.",
   "Paragraph 3.",
   "Option ⟦C⟧ turns 'often' into 'always'.",
   "Qualifiers (often/always) decide many RC answers.",
   ["because their errors partly cancel"])
rc("R16", "Application", "H", 90,
   "A project manager wants her team's completion-date estimates to be better calibrated. Based on the passage, which step is most likely to help?",
   ["Rewarding team members whose bold estimates turn out right.",
    "Asking each member to imagine the project has overrun and to explain why before giving a range.",
    "Asking only the most senior engineer for an estimate.",
    "Asking members to give the narrowest range they can defend."],
   1,
   """'Forecasters who are asked to imagine that their prediction has failed and to explain why tend to widen their ranges.'
   ⟦A⟧ reinforces the selection for confidence; ⟦D⟧ narrows ranges.""",
   "Pre-mortem technique.",
   "Which remedy in paragraph 3 fits?",
   "Option ⟦A⟧ recreates the structural problem.",
   "Application: map the scenario onto a named remedy.",
   ["asked to imagine that their prediction has failed and to explain why tend to widen their ranges"])
rc("R16", "Author's view", "M", 75,
   "The author would most likely agree that expertise:",
   ["is useless for forecasting.",
    "often improves the central estimate of a forecast even if it does not ensure an honest range.",
    "guarantees calibrated forecasts.",
    "should be replaced entirely by averaging."],
   1,
   """'Expertise often improves the centre of a forecast even when it fails to widen the range.'""",
   "Direct.",
   "Last paragraph.",
   "Options ⟦A⟧ and ⟦C⟧ are opposite extremes.",
   "Eliminate both extremes first.",
   ["Expertise often improves the centre of a forecast even when it fails to widen the range."])
