"""VARC verbal ability: 9 para-summary, 9 para-jumble (TITA), 9 odd-sentence
(TITA), 9 para-completion / sentence-placement. All original.

Checks: para-jumble answers must be a permutation of 1..n; odd-sentence
answers must be in 1..5; summary/completion questions carry evidence
phrases that must appear verbatim in the question text."""
from common import add

S = "VARC"
VA = "Verbal Ability"


def _ok_perm(q):
    n = len(q["sentences"])
    return (sorted(q["answer"]) == [str(i) for i in range(1, n + 1)], "answer is not a permutation")


def _ok_odd(q):
    return (q["answer"] in [str(i) for i in range(1, len(q["sentences"]) + 1)], "odd answer out of range")


def _ok_ev(q):
    missing = [e for e in q.get("evidence", []) if e not in q["text"]]
    return (not missing and bool(q.get("evidence")), f"evidence missing: {missing}")


def pj(diff, secs, sentences, answer, solution, fast, hint, trap, note):
    n = len(sentences)
    text = (f"The {['', '', '', '', 'four', 'five'][n]} sentences given below, when properly sequenced, form a coherent paragraph. "
            f"Decide on the proper order and key in the sequence of {n} numbers as your answer.\n\n"
            + "\n".join(f"{i}. {s}" for i, s in enumerate(sentences, 1)))
    return add(S, VA, "Para jumble", diff, secs, text, answer, solution, fast, hint, trap, note,
               extra={"sentences": sentences, "vcheck": _ok_perm})


def odd(diff, secs, sentences, answer, solution, fast, hint, trap, note):
    text = ("Five jumbled-up sentences are given below. Four of them can be put together to form a coherent paragraph. "
            "Identify the odd one out and key in the number of that sentence as your answer.\n\n"
            + "\n".join(f"{i}. {s}" for i, s in enumerate(sentences, 1)))
    return add(S, VA, "Odd sentence out", diff, secs, text, answer, solution, fast, hint, trap, note,
               extra={"sentences": sentences, "vcheck": _ok_odd})


def summ(diff, secs, para, options, ans, solution, fast, hint, trap, note, evidence):
    text = ("The passage given below is followed by four summaries. Choose the option that best captures the essence of the passage.\n\n" + para)
    return add(S, VA, "Para summary", diff, secs, text, ans, solution, fast, hint, trap, note,
               options=options, extra={"evidence": evidence, "vcheck": _ok_ev})


def comp(diff, secs, para, options, ans, solution, fast, hint, trap, note, evidence):
    text = ("Choose the sentence that most appropriately fills the blank (______) in the paragraph below.\n\n" + para)
    return add(S, VA, "Para completion", diff, secs, text, ans, solution, fast, hint, trap, note,
               options=options, extra={"evidence": evidence, "vcheck": _ok_ev})


def place(diff, secs, sentence, para, ans, solution, fast, hint, trap, note, evidence):
    text = ("There is a sentence that is missing in the paragraph below. Look at the paragraph and decide in which blank "
            "(option 1, 2, 3 or 4) the following sentence would best fit.\n\n"
            f"Sentence: {sentence}\n\nParagraph: {para}")
    return add(S, VA, "Sentence placement", diff, secs, text, ans, solution, fast, hint, trap, note,
               options=["Option 1", "Option 2", "Option 3", "Option 4"],
               extra={"evidence": evidence, "vcheck": _ok_ev, "noshuffle": True})


# ======================= PARA SUMMARY (9) =======================
summ("M", 90,
     "In complex fields such as surgery and aviation, experienced professionals sometimes fail not because they lack knowledge but because they skip a step they know perfectly well. Under pressure, attention narrows, and routine tasks that have been performed thousands of times are the easiest to overlook. Simple checklists, which experts often resent as insulting to their skill, have been found to reduce such errors substantially. Their value lies not in teaching anything new but in guarding against the predictable lapses of people who already know what to do.",
     ["Checklists help experts mainly by preventing lapses in steps they already know, especially under pressure.",
      "Experts resent checklists because checklists teach them nothing new.",
      "Surgery and aviation are the professions most prone to error.",
      "Experience makes professionals more likely to lack essential knowledge."],
     0,
     """The core: failures come from skipped known steps; checklists guard against 'predictable lapses of people who already know what to do'.
     ⟦B⟧ is a side detail; ⟦C⟧ is not claimed; ⟦D⟧ contradicts 'not because they lack knowledge'.""",
     "Summaries keep the cause (lapses under pressure) and the remedy (checklists).",
     "What is the checklist's 'value', according to the last line?",
     "Picking ⟦B⟧ because it repeats a vivid detail.",
     "A summary is not the most memorable line; it is the argument in brief.",
     ["guarding against the predictable lapses of people who already know what to do"])
summ("M", 90,
     "The popular idea that ten thousand hours of practice will make anyone an expert misreads the research on which it is based. What distinguished top performers in those studies was not simply the quantity of practice but its quality: focused work on specific weaknesses, immediate feedback and gradual increases in difficulty. Hours spent repeating what one already does comfortably add little. Practice, in other words, improves performance mainly when it is designed to be uncomfortable.",
     ["Anyone who practises for ten thousand hours will become an expert.",
      "Top performers practise fewer hours than average performers.",
      "Improvement comes mainly from focused, feedback-rich practice aimed at weaknesses, not from accumulated hours alone.",
      "Comfortable practice is harmful and should be avoided."],
     2,
     """The passage corrects the 'ten thousand hours' myth: quality ('focused work on specific weaknesses, immediate feedback') matters more than quantity.
     ⟦A⟧ is the misreading; ⟦B⟧ is unsupported; ⟦D⟧ overstates 'add little' as 'harmful'.""",
     "Correction passages: summarise the correction, not the myth.",
     "What distinguished top performers?",
     "⟦D⟧ — 'add little' is not 'harmful'.",
     "Watch for summaries that intensify the author's claims.",
     ["not simply the quantity of practice but its quality"])
summ("E", 75,
     "Gross domestic product measures the market value of goods and services produced in an economy, and it has become the default yardstick of national progress. Yet it counts some things that make lives worse—the cost of cleaning up after a disaster raises it—and ignores others that make lives better, such as unpaid care within families or the value of clean air. GDP was designed to measure production, not well-being, and problems arise when it is treated as a measure of the latter.",
     ["GDP should be abolished as a statistic.",
      "GDP is a sound measure of production but misleading as a measure of well-being, because it counts some harms and omits some goods.",
      "Unpaid care is the most important economic activity.",
      "Disasters are good for the economy because they raise GDP."],
     1,
     """'GDP was designed to measure production, not well-being, and problems arise when it is treated as a measure of the latter.'
     ⟦A⟧ is extreme; ⟦C⟧ and ⟦D⟧ distort examples.""",
     "The last sentence states the thesis.",
     "What was GDP 'designed to measure'?",
     "⟦D⟧ twists an example into a claim.",
     "Examples illustrate; they are not the summary.",
     ["GDP was designed to measure production, not well-being"])
summ("M", 90,
     "A forest with many tree species may grow no faster in an ordinary year than a plantation of a single species. The difference appears in bad years. When a pest or drought strikes, some species in a diverse forest are likely to cope better than others, and the forest as a whole recovers. A monoculture has no such reserve: a threat that harms one tree harms them all. Diversity, in this sense, functions less like a source of extra yield than like insurance.",
     ["Diverse forests grow faster than single-species plantations.",
      "Monoculture plantations should be banned.",
      "Pests and droughts are becoming more common.",
      "The main value of species diversity lies in resilience to shocks rather than in higher output in normal times."],
     3,
     """'Diversity... functions less like a source of extra yield than like insurance.'
     ⟦A⟧ contradicts the first line; ⟦B⟧ is extreme; ⟦C⟧ is not stated.""",
     "Insurance = protection in bad times.",
     "Read the metaphor in the last line.",
     "⟦A⟧ ignores 'may grow no faster in an ordinary year'.",
     "Summaries often paraphrase a closing metaphor.",
     ["functions less like a source of extra yield than like insurance"])
summ("H", 105,
     "Children are often said to learn languages effortlessly, while adults struggle. The comparison is less fair than it seems. Children spend years immersed in a language, surrounded by patient speakers and free of the fear of embarrassment; adults usually study a few hours a week in classrooms. Adults, in fact, often learn vocabulary and grammar faster in the early stages. Where children clearly excel is in acquiring a native-like accent, which becomes harder to achieve later in life.",
     ["Adults can never match children in learning languages.",
      "Children's apparent advantage largely reflects immersive conditions; adults may learn faster at first, though children have an edge in accent.",
      "Children learn grammar faster than adults in every stage.",
      "Classroom teaching is useless for adult learners."],
     1,
     """Three points: the comparison is unfair (conditions differ), adults 'often learn vocabulary and grammar faster in the early stages', children excel at accent. Only ⟦B⟧ keeps all three.
     ⟦A⟧ and ⟦D⟧ are extreme; ⟦C⟧ contradicts the passage.""",
     "Complex summaries must keep the qualification about accent.",
     "Where do children 'clearly excel'?",
     "Choosing an option that drops the accent point or the conditions point.",
     "Complete summaries preserve contrasts and qualifications.",
     ["The comparison is less fair than it seems.", "Where children clearly excel is in acquiring a native-like accent"])
summ("M", 90,
     "Open-plan offices were promoted as a way to encourage collaboration by removing the walls between colleagues. Studies that tracked actual behaviour after firms moved to open layouts, however, have sometimes found that face-to-face interaction fell while email and messaging rose. Deprived of privacy, workers appear to create it in other ways—by wearing headphones, avoiding conversation and retreating to digital channels. The removal of physical barriers does not automatically remove social ones.",
     ["Open-plan offices always destroy collaboration.",
      "Workers prefer email to conversation.",
      "Removing walls can reduce face-to-face interaction as workers seek privacy in other ways, so open layouts do not guarantee collaboration.",
      "Firms should return to closed offices immediately."],
     2,
     """The finding (interaction fell), the mechanism (workers create privacy other ways) and the moral ('does not automatically remove social ones') are in ⟦C⟧.
     ⟦A⟧ turns 'sometimes' into 'always'; ⟦D⟧ is a recommendation the passage does not make.""",
     "Keep 'can/does not automatically' — avoid 'always'.",
     "What do workers do when deprived of privacy?",
     "⟦A⟧ overgeneralises 'sometimes'.",
     "Hedged passages need hedged summaries.",
     ["The removal of physical barriers does not automatically remove social ones."])
summ("H", 105,
     "Offering a reward for an activity can increase how often people do it, at least while the reward lasts. But when the activity was already enjoyable, a reward can change how people understand their own behaviour: they begin to see themselves as doing it for the reward. When the reward is withdrawn, their interest may fall below its original level. Incentives, then, can crowd out the very motivation they were meant to reinforce.",
     ["Rewards always reduce motivation.",
      "For activities people already enjoy, rewards can undermine interest once removed by changing why people think they act.",
      "People should never be paid for work they enjoy.",
      "Rewards increase activity permanently."],
     1,
     """Rewards raise activity 'while the reward lasts'; for enjoyable activities they can shift self-understanding so interest falls after withdrawal.
     ⟦A⟧ drops the condition ('already enjoyable'); ⟦D⟧ contradicts 'while the reward lasts'.""",
     "Keep the condition: 'when the activity was already enjoyable'.",
     "Under what condition does crowding out occur?",
     "Dropping the condition (⟦A⟧).",
     "Conditional claims must stay conditional in the summary.",
     ["when the activity was already enjoyable", "Incentives, then, can crowd out the very motivation they were meant to reinforce."])
summ("E", 75,
     "A single study showing a surprising result is often reported as a discovery. Scientists are more cautious, because an unexpected finding is also more likely than a routine one to be a statistical fluke. Only when independent teams repeat the study and obtain similar results does the finding become part of accepted knowledge. Replication is slow and rarely makes headlines, but it is the mechanism by which science corrects its own mistakes.",
     ["Surprising results are usually false and should be ignored.",
      "Newspapers report science inaccurately.",
      "Surprising single findings need independent replication before acceptance; replication, though unglamorous, is how science corrects itself.",
      "Replication is too slow to be useful."],
     2,
     """⟦C⟧ combines caution about single surprising results with the role of replication.
     ⟦A⟧ overstates 'more likely... to be a statistical fluke'; ⟦D⟧ contradicts the last sentence.""",
     "Caution + mechanism.",
     "What makes a finding 'accepted knowledge'?",
     "⟦A⟧ turns 'more likely' into 'usually false'.",
     "Probabilistic language should not become certainty.",
     ["it is the mechanism by which science corrects its own mistakes"])
summ("M", 90,
     "Tourism can sustain traditions that might otherwise disappear: craft skills find buyers, festivals find audiences, and old buildings find money for repair. Yet the same demand can reshape what it preserves. Dances are shortened to fit tour schedules, crafts are simplified for souvenir markets, and rituals are staged at convenient hours. Whether tourism protects a culture or turns it into a performance depends less on the number of visitors than on who controls the terms of the encounter.",
     ["Tourism destroys traditional cultures.",
      "Tourism can both sustain and distort traditions, and which it does depends mainly on who controls the terms rather than on visitor numbers.",
      "The number of tourists should be strictly limited.",
      "Crafts sold to tourists are always of poor quality."],
     1,
     """The passage balances benefits and distortions and concludes the outcome 'depends less on the number of visitors than on who controls the terms of the encounter.'
     ⟦C⟧ contradicts that conclusion by focusing on numbers.""",
     "Both sides + the deciding factor.",
     "What does the outcome depend on?",
     "⟦C⟧ picks the factor the author downplays.",
     "Include the author's deciding criterion.",
     ["depends less on the number of visitors than on who controls the terms of the encounter"])

# ======================= PARA JUMBLES (9, TITA) =======================
pj("E", 90,
   ["This is why the most useful maps are often the ones that leave the most out.",
    "A map that showed every tree, every lamppost and every crack in the pavement would be as large as the territory itself, and just as hard to read.",
    "Every map is an act of deliberate omission.",
    "The question is never whether to simplify, but which simplifications serve the traveller."],
   "3214",
   """3 states the thesis (maps omit).
   2 illustrates with the absurd complete map.
   1 draws the consequence ('This is why…').
   4 concludes with the real question.""",
   "Find the general claim, then the example, then 'This is why'.",
   "Which sentence can stand alone as an opener?",
   "Starting with 1 — 'This is why' needs a prior reason.",
   "Openers are general and need no back-reference; 'This/Such/These' never start a paragraph.")
pj("M", 90,
   ["Yet within a decade, the same firms were competing to hire the people they had once dismissed as eccentrics.",
    "When the first programmers asked for flexible hours and casual dress, established companies treated the requests as evidence of unseriousness.",
    "The lesson is that workplace norms often follow the scarcity of skills rather than any fixed idea of professionalism.",
    "What changed was not the programmers' behaviour but the market's need for what they could do."],
   "2143",
   """2 sets the scene. 1 ('Yet… the same firms') reverses it. 4 explains what changed. 3 draws the lesson.""",
   "'Yet… the same firms' must follow the firms' first reaction.",
   "Which sentence introduces 'the firms'?",
   "Placing 3 before 4 — the lesson follows the explanation.",
   "Contrast words (Yet) link to the immediately preceding situation.")
pj("M", 90,
   ["Such seeds may lie dormant for decades, waiting for a fire to crack their coats.",
    "In some forests, fire is not a disaster but a stage in the life cycle.",
    "Suppressing every fire, therefore, can threaten the very species a park was created to protect.",
    "Certain pines, for instance, produce cones that open only under intense heat, releasing seeds onto freshly cleared ground."],
   "2413",
   """2 claim → 4 example ('for instance', introduces seeds) → 1 ('Such seeds') → 3 ('therefore', conclusion).""",
   "'Such seeds' needs seeds mentioned earlier: 4 → 1.",
   "Find the pair linked by 'seeds'.",
   "Putting 1 before 4.",
   "Demonstratives (such, these) point back to a specific noun.")
pj("M", 90,
   ["Critics called it a gimmick, and for a few years sales seemed to prove them right.",
    "The first handheld calculators were expensive, fragile and limited to basic arithmetic.",
    "Then prices fell sharply, and within a generation the slide rule had all but vanished from classrooms.",
    "Few could have predicted that a device so modest would reshape how mathematics was taught."],
   "2134",
   """2 introduces the device. 1 ('it') gives early reaction. 3 ('Then') the turn. 4 reflects ('a device so modest' refers back to 2).""",
   "Chronology: invention → reception → change → reflection.",
   "What does 'it' in sentence 1 refer to?",
   "Opening with 4 — 'a device so modest' presumes the description in 2.",
   "Time markers (Then, within a generation) fix sequence.")
pj("H", 105,
   ["The result is a strange paradox: the more a language is studied, the less it may be spoken.",
    "When a language has only a few elderly speakers left, linguists often rush to record it.",
    "These recordings are invaluable, but they can also shift the language's centre of gravity from the village to the archive.",
    "Young people may come to see it as an object of scholarship rather than a means of everyday talk."],
   "2341",
   """2 situation → 3 ('These recordings') → 4 (consequence for young people) → 1 ('The result is…' paradox).""",
   "'These recordings' follows 'record it'.",
   "Which sentence summarises the outcome?",
   "Placing 1 second — 'The result' needs the process first.",
   "Summary/result sentences usually close the paragraph.")
pj("M", 90,
   ["The curators did not ask visitors which paintings they liked.",
    "The answer surprised them: the longest pauses were at small, unlabelled works in side rooms.",
    "Instead, they measured how long visitors stayed in front of each painting.",
    "They wanted to know what actually held attention, not what people thought they should admire."],
   "1342",
   """1 (did not ask) → 3 ('Instead') → 4 (why) → 2 (the answer).""",
   "'Instead' must follow a negated action.",
   "What does 'Instead' replace?",
   "Putting 4 before 3 breaks the not…instead pair.",
   "'Not X… Instead Y' is a tight pair.")
pj("H", 120,
   ["A bridge designed for today's average traffic will fail on the one day that traffic is extreme.",
    "Engineers, therefore, design not for the average load but for the rare extreme.",
    "Averages are comforting, but they can be dangerous guides to design.",
    "Financial planners who build budgets around an average year make the same mistake in a different domain.",
    "Their plans work well until the year that is not average arrives, and then they fail all at once."],
   "31245",
   """3 general claim → 1 bridge example → 2 engineers' response ('therefore') → 4 parallel domain ('the same mistake') → 5 ('Their plans').""",
   "Build two blocks: 1-2 (bridges) and 4-5 (finance).",
   "Which sentence is general enough to open?",
   "Ending with 2 — 'the same mistake' in 4 refers to designing for averages, which is described before it.",
   "Identify mandatory pairs first, then order the blocks.")
pj("H", 120,
   ["Scholars today can sometimes trace the family tree of a manuscript by following these inherited mistakes.",
    "Before the printing press, the survival of a text depended on the patience of copyists.",
    "Because each copy was precious, errors were rarely corrected once made, and they were faithfully reproduced in later copies.",
    "In this way, a scribe's slip of the pen could become a clue for historians centuries later.",
    "The monks copied texts by hand, a process so slow that a single book could occupy a scribe for months."],
   "25314",
   """2 context → 5 (how copying worked) → 3 (errors reproduced) → 1 ('these inherited mistakes') → 4 ('In this way').""",
   "'These inherited mistakes' follows 'faithfully reproduced in later copies'.",
   "Link 3 → 1.",
   "Starting with 5 — 2 sets the general context 'before the printing press'.",
   "Back-references (these, in this way) chain sentences.")
pj("M", 105,
   ["It is this second function that makes a shared calendar so hard to change.",
    "A calendar does two jobs at once.",
    "It measures time, tracking the seasons and the movements of the sun and moon.",
    "It also coordinates people, allowing strangers to agree on when a market opens or a festival begins.",
    "A more accurate calendar is useless if no one else adopts it."],
   "23415",
   """2 announces two jobs → 3 first job → 4 ('also', second job) → 1 ('this second function') → 5 illustrates why change is hard.""",
   "'Two jobs' → first → 'also' → 'this second function'.",
   "Which sentence announces a list?",
   "Placing 5 before 1 — 5 explains 1.",
   "Enumeration signals (two jobs, also, second) give the skeleton.")

# ======================= ODD SENTENCE OUT (9, TITA) =======================
odd("E", 75,
    ["Honeybees communicate the location of food through a movement known as the waggle dance.",
     "The angle of the dance relative to vertical indicates the direction of the food relative to the sun.",
     "The duration of the waggle run conveys how far away the food is.",
     "Honey stored in sealed containers can remain edible for a very long time.",
     "Other bees follow the dancer closely, reading these signals through touch and vibration in the dark hive."],
    "4",
    """1, 2, 3, 5 explain the waggle dance as communication. 4 is about honey storage.""",
    "Find the common thread (the dance) and the sentence outside it.",
    "What topic do four sentences share?",
    "Keeping 4 because it mentions bees' product.",
    "Same broad topic ≠ same paragraph focus.")
odd("E", 75,
    ["Cities that invest in cycling infrastructure often see fewer traffic injuries.",
     "Separated lanes reduce the number of conflicts between cyclists and cars.",
     "The bicycle was invented in the nineteenth century and quickly became popular among the middle classes.",
     "As more people cycle, drivers become used to watching for them, which further improves safety.",
     "This 'safety in numbers' effect means that early investments can compound over time."],
    "3",
    """The paragraph is about infrastructure and safety; 3 is bicycle history.""",
    "Four sentences share 'safety'.",
    "Which sentence has no link to safety?",
    "Choosing 5 because it starts with 'This'.",
    "Look for the sentence that changes the question being answered.")
odd("M", 90,
    ["Meditation originated in ancient religious traditions across Asia.",
     "Meditation research has grown rapidly, but much of it relies on small samples.",
     "Many studies also lack an active control group, comparing meditators with people who did nothing at all.",
     "Without such controls, it is hard to separate the effects of meditation from the effects of simply expecting to benefit.",
     "Stronger studies, with larger samples and credible comparison activities, have tended to report more modest effects."],
    "1",
    """2–5 critique research methods. 1 is about origins.""",
    "The paragraph's focus is research quality.",
    "Which sentence is not about studies?",
    "Assuming the historical sentence must be the opener.",
    "A plausible opener can still be off-topic.")
odd("M", 90,
    ["A good editor reads a manuscript at least twice: once as a reader and once as a critic.",
     "Many famous authors were rejected by several publishers before finding success.",
     "On the first reading, the editor tries to experience the book as its audience will.",
     "On the second, the editor asks why certain passages worked and others did not.",
     "Only the combination of both readings produces advice that an author can use."],
    "2",
    """1, 3, 4, 5 describe the editor's two readings. 2 is about rejection of authors.""",
    "Follow 'twice → first → second → both'.",
    "Which sentence breaks the two-readings structure?",
    "Being drawn to 2 as a 'publishing' sentence that feels related.",
    "Structural skeletons expose intruders quickly.")
odd("M", 90,
    ["Price controls on essential goods are popular because they promise immediate relief.",
     "Share prices are a poor guide to the state of the real economy in the short run.",
     "When a price is held below what buyers are willing to pay, sellers have less reason to supply the good.",
     "Shortages then appear, and the good is rationed by queues or connections rather than by price.",
     "Governments sometimes pair controls with subsidies to producers to prevent such shortages."],
    "2",
    """1, 3, 4, 5 trace price controls → shortages → subsidies. 2 is about share prices.""",
    "Economics jargon can mask a topic change.",
    "Which sentence is not about price controls?",
    "Keeping 2 because it mentions 'prices'.",
    "Shared keywords can disguise an odd sentence.")
odd("H", 105,
    ["Early photographs required subjects to sit still for long exposures.",
     "This is one reason people in many nineteenth-century portraits look stiff and unsmiling.",
     "Head braces were sometimes used to keep sitters from moving during the exposure.",
     "Smiling was also often considered undignified in formal portraits, reinforcing the solemn style.",
     "Modern smartphone cameras can capture sharp images in a fraction of a second, even in low light."],
    "5",
    """The paragraph explains why old portraits look solemn (exposure time, braces, norms about smiling). 5 moves to modern cameras.""",
    "Ask what question the four sentences answer: why do old portraits look stiff?",
    "Which sentence does not explain the stiff portraits?",
    "Keeping 5 as a 'contrast'; nothing in the others sets it up.",
    "An odd sentence may be topically close but answer a different question.")
odd("M", 90,
    ["Most poetry today is read silently rather than aloud.",
     "Translating poetry forces choices between sound and sense.",
     "A translator who preserves the rhyme scheme may have to alter the meaning of a line.",
     "One who preserves the literal meaning may lose the music that made the poem memorable.",
     "Some translators respond by producing two versions, one faithful to sense and one to sound."],
    "1",
    """2–5 concern the sound-vs-sense dilemma in translation. 1 is about reading habits.""",
    "Topic = translation dilemma.",
    "Which sentence mentions no translator or translation?",
    "Linking 'silently' with 'sound' superficially.",
    "Word echoes (sound/silent) are not logical links.")
odd("M", 90,
    ["Terraced farming on hillsides slows the flow of rainwater down slopes.",
     "By holding water longer, the terraces allow more of it to soak into the soil.",
     "Hill tourism has grown rapidly in recent years, bringing new income to mountain villages.",
     "Terraces also reduce erosion, keeping fertile topsoil in place.",
     "Where terraces have been abandoned, landslides and soil loss have often increased."],
    "3",
    """1, 2, 4, 5 concern terraces' effects on water and soil. 3 is about tourism income.""",
    "Terraces appear in four sentences.",
    "Which sentence does not mention terraces?",
    "Thinking 'mountain villages' ties 3 in.",
    "Check the subject of each sentence.")
odd("H", 105,
    ["Negotiators often anchor on the first number mentioned, even when it is arbitrary.",
     "Some trust between the parties is necessary for any negotiation to succeed.",
     "An opening offer therefore shapes the range within which the final agreement is likely to fall.",
     "Making the first offer can thus be an advantage, provided it is ambitious but defensible.",
     "Experienced negotiators counter an extreme anchor by declining to discuss it and restating their own figure."],
    "2",
    """1, 3, 4, 5 develop the anchoring effect in negotiation. 2 is a general point about trust.""",
    "Follow 'anchor' through the sentences.",
    "Which sentence says nothing about first numbers or anchors?",
    "Treating 2 as a plausible general opener.",
    "Generic truths are common odd-one-out decoys.")

# ======================= PARA COMPLETION / PLACEMENT (9) =======================
comp("M", 90,
     "Most people assume that a longer list of options makes it easier to find something they like. In experiments involving products such as jams and pension plans, however, larger choice sets have sometimes reduced the likelihood that people choose anything at all, and lowered satisfaction among those who do. Every additional option adds a comparison, and every comparison adds a small cost in effort and in the nagging sense that something better was missed. ______",
     ["Beyond a point, then, more choice can make choosing harder and less satisfying.",
      "This is why jam manufacturers have reduced the number of flavours they sell.",
      "People should therefore always be offered a single option.",
      "Pension plans are more complicated to compare than jams."],
     0,
     """The paragraph builds to a general conclusion about the costs of choice. ⟦A⟧ states it with the right hedge ('Beyond a point… can').
     ⟦B⟧ is unsupported; ⟦C⟧ is extreme; ⟦D⟧ is a side comparison.""",
     "Completions at the end usually conclude the argument.",
     "What does 'every comparison adds a small cost' lead to?",
     "Choosing ⟦C⟧ — 'always… a single option' overshoots.",
     "Match the conclusion's strength to the evidence.",
     ["larger choice sets have sometimes reduced the likelihood that people choose anything at all"])
comp("M", 90,
     "When a city widens a congested road, traffic usually improves for a while. Then the faster journeys attract drivers who previously took other routes, travelled at other times or did not travel at all. Within a few years the road is often as congested as before, only now it carries more cars. ______",
     ["Building roads is therefore the only reliable way to reduce congestion.",
      "Road capacity, in other words, tends to generate the traffic that fills it.",
      "Public transport is always cheaper than building roads.",
      "Drivers are irrational in the way they choose their routes."],
     1,
     """The paragraph describes induced demand; ⟦B⟧ names it. ⟦A⟧ contradicts it; ⟦C⟧ and ⟦D⟧ are off-topic or unsupported.""",
     "'In other words' + summary of the mechanism.",
     "What do the new drivers do to the widened road?",
     "⟦D⟧ — nothing suggests irrationality; drivers respond sensibly to faster journeys.",
     "Closing sentences often generalise the described mechanism.",
     ["the faster journeys attract drivers who previously took other routes"])
comp("H", 105,
     "Early maps of the world were not simply inaccurate; they were inaccurate in revealing ways. The mapmaker's homeland tended to sit near the centre, drawn large and detailed, while distant lands shrank to the margins or were filled with guesses. ______ Reading an old map, therefore, tells us as much about the people who made it as about the places it depicts.",
     ["The errors reflected what mattered to the makers and what they knew, not merely the limits of their instruments.",
      "Modern satellite maps have eliminated such distortions entirely.",
      "Some mapmakers were paid by kings to exaggerate their territory.",
      "Distant lands were often more fertile than the mapmakers' homelands."],
     0,
     """The blank must connect the described distortions to the conclusion 'tells us as much about the people who made it'. ⟦A⟧ provides that bridge.
     ⟦B⟧ breaks the flow; ⟦C⟧ is too specific and unsupported; ⟦D⟧ is irrelevant.""",
     "Middle blanks bridge the evidence and the 'therefore'.",
     "What must be true for 'therefore' to follow?",
     "⟦C⟧ sounds historical but explains only one kind of distortion.",
     "Bridge sentences supply the missing premise.",
     ["inaccurate in revealing ways", "tells us as much about the people who made it"])
place("M", 90,
      "That, however, is precisely what the data could not show.",
      "Observational studies can reveal striking patterns. ___(1)___ One study found that people who drank coffee daily lived, on average, slightly longer than those who did not. ___(2)___ Newspapers reported the finding under headlines suggesting that coffee extends life. ___(3)___ Coffee drinkers might differ from non-drinkers in income, health or habits, and any of these could explain the gap. ___(4)___ Only a controlled experiment could separate the effect of coffee from these other factors.",
      2,
      """'That' must refer to a claim the data could not show — the causal headline ('coffee extends life'). So the sentence goes at blank 3, after the headlines and before the explanation of confounders.
      At blank 2, 'That' would refer to the observed association, which the data did show; at blank 1 there is no claim yet.""",
      "Resolve what 'That' refers to.",
      "Which statement goes beyond the data?",
      "Placing it at blank 2 — the association itself was shown.",
      "Pronoun reference decides most placement questions.",
      ["Newspapers reported the finding under headlines suggesting that coffee extends life."])
place("M", 90,
      "The same logic applies, with even greater force, to institutions.",
      "A person who never admits a mistake cannot learn from one. ___(1)___ Admitting error requires a willingness to look foolish in the short term for the sake of improving in the long term. ___(2)___ Organisations that punish those who report problems soon stop hearing about them, and small failures grow unnoticed into large ones. ___(3)___ The most reliable organisations are often those that treat reported errors as information rather than as grounds for blame. ___(4)___",
      1,
      """The sentence shifts from individuals to institutions. The first sentence about organisations follows blank 2, so it fits there.""",
      "Find where the subject changes from 'a person' to 'organisations'.",
      "Where do organisations first appear?",
      "Placing it at blank 3 — organisations have already been introduced by then.",
      "Transition sentences sit exactly at the change of subject.",
      ["Organisations that punish those who report problems soon stop hearing about them"])
comp("E", 75,
     "For centuries, the only way to preserve a piece of music was to write it down or to teach it to someone else. Recording changed this. A performance could now be kept exactly as it happened, including the hesitations and accidents that notation leaves out. ______",
     ["As a result, musicians stopped writing music down altogether.",
      "For the first time, a particular performance, and not only the composition, could become the lasting work.",
      "Recordings are always better than live performances.",
      "Teaching music to others soon became unnecessary."],
     1,
     """The paragraph contrasts preserving compositions (notation) with preserving performances (recording). ⟦B⟧ draws that consequence.
     ⟦A⟧, ⟦C⟧, ⟦D⟧ are extreme.""",
     "Complete the contrast notation vs recording.",
     "What could be preserved that notation leaves out?",
     "Extreme consequences (stopped altogether, always better).",
     "Eliminate absolute options first.",
     ["A performance could now be kept exactly as it happened"])
comp("M", 90,
     "The fastest-growing plants are not always the ones that dominate a landscape in the long run. ______ Slower-growing species that invest in deep roots and tough wood may be overtaken at first, but they survive the droughts and storms that eventually cut the fast growers down.",
     ["Rapid growth often comes at the cost of durability, leaving fast growers vulnerable when hard times arrive.",
      "Farmers prefer fast-growing crops for obvious economic reasons.",
      "Plant growth is controlled mainly by the amount of sunlight received.",
      "Deep roots are found only in desert plants."],
     0,
     """The blank must explain why fast growers may lose: a trade-off between speed and durability. ⟦A⟧ provides it and sets up the next sentence.""",
     "Look for the trade-off that the next sentence illustrates.",
     "What do slow growers invest in instead?",
     "⟦B⟧ drifts to agriculture.",
     "Middle blanks must fit both neighbours.",
     ["invest in deep roots and tough wood"])
place("H", 105,
      "Amid this generosity, however, few of the people receiving the aid were ever asked what they actually needed.",
      "After the flood, aid arrived quickly from many directions. ___(1)___ Trucks brought blankets, bottled water and tinned food, and volunteers set up kitchens in school buildings. ___(2)___ Villagers who had lost their seed stock and tools found themselves with more blankets than they could use and nothing with which to replant their fields. ___(3)___ Relief that is generous but uninformed can leave the most important losses untouched. ___(4)___",
      1,
      """'This generosity' refers to the specific aid described (trucks, kitchens), so the sentence must come after it. It then explains the mismatch that follows (blankets but no seeds). Blank 2.""",
      "'This generosity' needs the detailed description first.",
      "What does 'this generosity' point back to?",
      "Blank 1 — the generosity has not yet been described in detail.",
      "Demonstratives need a concrete antecedent just before them.",
      ["Trucks brought blankets, bottled water and tinned food"])
comp("M", 90,
     "Many ancient buildings have survived earthquakes that destroyed newer structures nearby. Engineers studying them have found that their builders often used techniques that allowed walls to shift slightly without collapsing: layers of flexible material between stones, interlocking joints, and foundations that could slide. ______",
     ["Ancient builders must therefore have understood modern physics.",
      "Rigidity, it seems, is not always the best defence against shaking ground; controlled flexibility can be safer.",
      "All new buildings should therefore be made of stone.",
      "Earthquakes were probably less powerful in ancient times."],
     1,
     """The evidence (techniques allowing walls to shift) supports ⟦B⟧. ⟦A⟧ overreaches; ⟦C⟧ misidentifies the key factor (flexibility, not stone); ⟦D⟧ is unsupported.""",
     "Generalise the mechanism described.",
     "What did the techniques allow walls to do?",
     "⟦C⟧ fixes on the material instead of the principle.",
     "The completion should generalise, not overreach.",
     ["allowed walls to shift slightly without collapsing"])
