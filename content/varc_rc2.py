"""VARC reading comprehension, passages 7-11 (original)."""
from varc_rc1 import passage, rc

# ---------------------------------------------------------------- P07
passage("R07", "Moral luck", "Philosophy", """
Two drivers leave the same party having drunk the same amount. Both drive home equally carelessly along similar roads. One arrives safely; the other, rounding a corner, strikes a child who has run into the street. Most people judge the second driver far more harshly than the first, and the law usually agrees. Yet the two differed in nothing they controlled. What separated them was a child's presence on one road and not the other.

Philosophers call this the problem of moral luck. We tend to hold two beliefs that sit uneasily together. The first is that people should be judged only for what is within their control. The second is that outcomes matter to judgement—that a careless act which kills is worse than a careless act which does not. Each belief is persuasive on its own; together they generate a contradiction, because outcomes are almost never entirely within anyone's control.

One response is to bite the bullet and insist that the two drivers are equally blameworthy, whatever the law and ordinary feeling say. On this view our harsher judgement of the unlucky driver is an understandable but irrational reaction, a kind of emotional arithmetic that confuses harm with guilt. Another response accepts that luck does shape moral standing and treats this as a sobering truth about the human condition: we are exposed not only to what happens to us but to what happens through us.

A third, more modest position distinguishes between blame and responsibility. Both drivers, it holds, are equally blameworthy for the reckless choice. But only the second is responsible for a death, and responsibility brings obligations—to acknowledge, to grieve, to make amends—that the lucky driver does not have. This preserves the intuition that something different has happened to the second driver without claiming that he is a worse person.

Whatever position one takes, the problem has a practical edge. Legal systems that punish outcomes rather than choices will always distribute penalties partly by chance. That may be defensible—the law must respond to harms, not only intentions—but it should be acknowledged rather than disguised as a precise measure of guilt.
""")

rc("R07", "Main idea", "M", 90,
   "The passage is primarily concerned with:",
   ["arguing that drunk driving should be punished more severely.",
    "explaining the problem of moral luck and outlining different responses to it, along with a practical implication.",
    "proving that outcomes should never affect moral judgement.",
    "criticising philosophers for ignoring legal practice."],
   1,
   """The passage defines moral luck, sets out three responses, and ends with 'the problem has a practical edge' for legal systems.
   ⟦C⟧ is only one of the responses, which the author does not endorse. ⟦A⟧ and ⟦D⟧ are not the passage's concern.""",
   "Descriptive/survey passages: the answer names the problem and the range of responses.",
   "Count how many positions the passage presents.",
   "Picking ⟦C⟧, which is one position, not the author's thesis.",
   "Survey passages rarely endorse one extreme view.",
   ["Philosophers call this the problem of moral luck.", "Whatever position one takes, the problem has a practical edge."])
rc("R07", "Inference", "H", 90,
   "According to the third position described in the passage, how do the two drivers differ?",
   ["The second driver is more blameworthy because his act caused harm.",
    "They are equally blameworthy, but only the second bears responsibility for a death, with obligations that follow from it.",
    "Neither driver is blameworthy, because outcomes are outside their control.",
    "The first driver is more blameworthy because he escaped consequences."],
   1,
   """'Both drivers, it holds, are equally blameworthy for the reckless choice. But only the second is responsible for a death, and responsibility brings obligations'.""",
   "Blame (same) vs responsibility (different).",
   "Find 'distinguishes between blame and responsibility'.",
   "Option ⟦A⟧ describes ordinary feeling, not the third position.",
   "Distinctions (blame vs responsibility) are prime CAT targets.",
   ["Both drivers, it holds, are equally blameworthy for the reckless choice.",
    "But only the second is responsible for a death"])
rc("R07", "Detail", "M", 60,
   "According to the passage, the contradiction at the heart of moral luck arises because:",
   ["the law and ordinary feeling disagree about careless drivers.",
    "people should be judged only for what they control, yet outcomes—which are rarely fully controlled—seem to matter to judgement.",
    "philosophers cannot agree on the definition of blame.",
    "careless acts are always punished by chance."],
   1,
   """The two beliefs: judge only what is controlled; outcomes matter. 'together they generate a contradiction, because outcomes are almost never entirely within anyone's control.'
   ⟦A⟧ is false — 'the law usually agrees' with ordinary feeling.""",
   "Name the two beliefs, then the reason they clash.",
   "Paragraph 2.",
   "Option ⟦A⟧ — the passage says the law usually agrees with people's harsher judgement.",
   "State the contradiction in your own words before looking at options.",
   ["The first is that people should be judged only for what is within their control.",
    "because outcomes are almost never entirely within anyone's control"])
rc("R07", "Author's view", "H", 90,
   "The author's view of legal systems that punish outcomes rather than choices is that such systems:",
   ["are indefensible and should be abolished.",
    "measure guilt precisely.",
    "may be defensible but should openly acknowledge that they distribute penalties partly by chance.",
    "should ignore harms and focus only on intentions."],
   2,
   """'That may be defensible—the law must respond to harms, not only intentions—but it should be acknowledged rather than disguised as a precise measure of guilt.'""",
   "Qualified approval + a demand for honesty.",
   "Last paragraph.",
   "Option ⟦D⟧ contradicts 'the law must respond to harms, not only intentions'.",
   "Look for 'may be… but…' constructions to identify qualified views.",
   ["That may be defensible", "it should be acknowledged rather than disguised as a precise measure of guilt"])

# ---------------------------------------------------------------- P08
passage("R08", "Mining the abyss", "Environment & policy", """
Scattered across parts of the deep ocean floor, thousands of metres below the surface, lie potato-sized lumps of rock rich in metals such as nickel, cobalt and manganese. They form over millions of years as minerals precipitate from seawater around a small nucleus—a shark's tooth, a fragment of shell. For decades they were a geological curiosity. The demand for batteries has turned them into a potential resource, and with that has come a debate about whether they should be collected at all.

Supporters of deep-sea mining make an argument that deserves to be taken seriously. Land-based mining often involves clearing forests, displacing communities and contaminating rivers. The nodules, by contrast, sit loose on the seabed and do not need to be blasted out of rock. If the metals needed for a low-carbon economy must come from somewhere, the argument goes, it may be better to take them from a remote plain with no human inhabitants than from a rainforest.

Critics respond that 'remote' is not the same as 'empty'. The abyssal plains host communities of organisms, many of them undescribed, some of which live on the nodules themselves. Because the nodules took millions of years to form, any species dependent on them would not recover on any timescale meaningful to humans. Mining would also stir up plumes of sediment that could drift far from the collection site and settle over areas never directly touched. The extent of these effects is uncertain precisely because so little of the deep sea has been studied.

This uncertainty is the crux of the dispute. Supporters tend to treat it as a reason to proceed carefully while learning; critics treat it as a reason not to begin. The disagreement is less about facts than about who should bear the burden of proof when facts are missing. In most environmental regulation, the default has been to permit an activity until harm is demonstrated. Deep-sea mining invites the reverse question: whether a practice that may cause irreversible damage should be required to demonstrate safety first.

There is also an argument that is sometimes overlooked. The case for mining depends on forecasts of demand, and those forecasts depend on assumptions about battery chemistry and recycling that may change. A decision taken now to open the deep sea would be difficult to reverse; a decision to wait could be revisited.
""")

rc("R08", "Main idea", "M", 90,
   "Which of the following best describes the structure of the passage?",
   ["It argues forcefully in favour of deep-sea mining.",
    "It presents the case for and against deep-sea mining, identifies the burden of proof under uncertainty as the core disagreement, and notes the asymmetry between acting and waiting.",
    "It describes how nodules form and why they contain metals.",
    "It argues that land-based mining is more harmful than any alternative."],
   1,
   """Paragraph 2 gives supporters' case, paragraph 3 critics', paragraph 4 says 'The disagreement is less about facts than about who should bear the burden of proof', and paragraph 5 notes a decision to open 'would be difficult to reverse; a decision to wait could be revisited.'""",
   "Structure questions: map each paragraph to a function.",
   "What does each paragraph do?",
   "Option ⟦C⟧ describes only paragraph 1.",
   "The 'crux' sentence usually anchors the structure answer.",
   ["The disagreement is less about facts than about who should bear the burden of proof when facts are missing.",
    "a decision to wait could be revisited"])
rc("R08", "Inference", "H", 90,
   "The author's final paragraph most strongly implies that:",
   ["demand forecasts for metals are certainly exaggerated.",
    "the irreversibility of opening the deep sea gives some extra weight to waiting when forecasts are uncertain.",
    "recycling will make mining unnecessary.",
    "battery chemistry has already changed enough to end demand for nickel and cobalt."],
   1,
   """The author contrasts a decision 'difficult to reverse' with one that 'could be revisited', given forecasts that 'may change'. That favours waiting under uncertainty without claiming the forecasts are wrong.
   ⟦A⟧, ⟦C⟧ and ⟦D⟧ overstate 'may change'.""",
   "The key word is 'reverse'.",
   "Compare the two decisions in the last sentence.",
   "Overstating 'may change' as 'certainly exaggerated'.",
   "Asymmetric reversibility is a classic argument pattern.",
   ["A decision taken now to open the deep sea would be difficult to reverse; a decision to wait could be revisited."])
rc("R08", "Author's view", "M", 60,
   "The author's attitude towards the supporters' argument is best described as:",
   ["dismissive", "respectful, treating it as serious though contested", "wholly persuaded", "sarcastic"],
   1,
   """'Supporters of deep-sea mining make an argument that deserves to be taken seriously.'""",
   "One sentence settles it.",
   "First line of paragraph 2.",
   "Choosing 'wholly persuaded' — the author gives the critics equal weight.",
   "Tone: 'deserves to be taken seriously' = respect, not agreement.",
   ["make an argument that deserves to be taken seriously"])
rc("R08", "Detail", "E", 45,
   "According to the passage, why would species dependent on nodules not recover on a human timescale?",
   ["Because mining would pollute the surface waters.",
    "Because the nodules took millions of years to form.",
    "Because the species are undescribed.",
    "Because sediment plumes settle only near the collection site."],
   1,
   """'Because the nodules took millions of years to form, any species dependent on them would not recover on any timescale meaningful to humans.'
   ⟦D⟧ contradicts 'drift far from the collection site'.""",
   "Direct 'because' clause.",
   "Paragraph 3.",
   "Option ⟦D⟧ reverses the sediment point.",
   "Detail answers often reuse the passage's 'because' clause.",
   ["Because the nodules took millions of years to form"])

# ---------------------------------------------------------------- P09
passage("R09", "The humble index", "History of ideas", """
We tend to think of reading as a continuous act: a person begins at the first page and proceeds to the last. For much of the history of the book, however, serious readers did something else. They consulted. They searched for the passage that bore on a question, compared it with another passage in another book, and moved on. The tools that made this possible—the table of contents, the running header, the alphabetical index—are so familiar that they have become invisible. Yet each was an invention, and each changed what it meant to know a text.

The index in particular embodies a quiet revolution. Before it, finding a topic in a long work required either memory or rereading. An index turned the book into something like a database, allowing a reader to arrive at page three hundred without passing through the preceding two hundred and ninety-nine. Critics at various times complained that this encouraged a superficial acquaintance with books—that people would quote works they had never read, having merely looked up what they needed. The complaint has a familiar ring.

The parallel with contemporary anxieties about search engines is instructive, though not in the way it is usually drawn. It is tempting to conclude that because earlier worries about indexes proved exaggerated, today's worries about search are equally misplaced. That inference is too quick. The index did change reading; it produced a new kind of reader, adept at retrieval, alongside the old kind who read from cover to cover. What the history suggests is not that nothing is lost when new tools arrive but that losses and gains are distributed unevenly and are hard to see from inside the transition.

There is also a difference of scale. An index is compiled by a person who has read the whole book and decided which topics matter. Its selections are visible and finite. A search engine ranks an effectively unlimited body of text according to criteria its users cannot inspect. The reader of an index is guided by a single mind that has done the reading; the user of a search engine is guided by a process that has done no reading at all, in any ordinary sense.

The history of the index, then, offers neither reassurance nor alarm. It offers a question worth asking of every tool that stands between readers and texts: whose judgement is it, and can we see it?
""")

rc("R09", "Main idea", "M", 90,
   "Which of the following best captures the author's use of the history of the index?",
   ["To prove that worries about search engines are exaggerated.",
    "To show that the index destroyed deep reading.",
    "To caution against drawing simple reassurance from the past while raising the question of whose judgement guides our tools.",
    "To argue that search engines should be replaced by indexes."],
   2,
   """The author calls the reassuring inference 'too quick' and concludes the history 'offers neither reassurance nor alarm' but a question: 'whose judgement is it, and can we see it?'
   ⟦A⟧ is the inference rejected. ⟦B⟧ contradicts 'alongside the old kind'.""",
   "The conclusion explicitly says 'neither reassurance nor alarm'.",
   "Read the final paragraph.",
   "Option ⟦A⟧ is the 'too quick' inference.",
   "When the author labels an argument 'too quick', it's a trap option.",
   ["That inference is too quick.", "offers neither reassurance nor alarm"])
rc("R09", "Inference", "H", 90,
   "Which of the following differences between an index and a search engine does the author emphasise?",
   ["An index is faster to use than a search engine.",
    "An index reflects the visible, finite choices of someone who has read the whole book, whereas a search engine ranks text by criteria users cannot inspect.",
    "Search engines are compiled by experts, indexes by amateurs.",
    "Indexes cover more topics than search engines."],
   1,
   """'An index is compiled by a person who has read the whole book... Its selections are visible and finite. A search engine ranks... according to criteria its users cannot inspect.'""",
   "Visible & finite vs uninspectable & unlimited.",
   "Paragraph 4.",
   "Option ⟦D⟧ reverses the scale point.",
   "Comparison questions: match both halves.",
   ["Its selections are visible and finite.", "according to criteria its users cannot inspect"])
rc("R09", "Author's view", "M", 60,
   "What does the author suggest about the effect of the index on readers?",
   ["It eliminated cover-to-cover reading entirely.",
    "It had no real effect on how people read.",
    "It created a new kind of reader skilled at retrieval, alongside readers who still read whole books.",
    "It made readers more likely to memorise texts."],
   2,
   """'it produced a new kind of reader, adept at retrieval, alongside the old kind who read from cover to cover.'""",
   "'Alongside' rules out 'eliminated'.",
   "Paragraph 3.",
   "Option ⟦B⟧ — the author says 'The index did change reading'.",
   "Watch for 'alongside' vs 'replaced'.",
   ["it produced a new kind of reader, adept at retrieval, alongside the old kind who read from cover to cover"])
rc("R09", "Vocabulary in context", "E", 45,
   "In the passage, the phrase 'The complaint has a familiar ring' suggests that:",
   ["the complaint was made in a musical form.",
    "similar complaints are heard today about newer tools.",
    "the complaint was repeated by the same critics many times.",
    "the complaint was correct."],
   1,
   """The next paragraph draws 'The parallel with contemporary anxieties about search engines'.""",
   "The following sentence explains the ring.",
   "What does the next paragraph compare it with?",
   "Option ⟦D⟧ — familiarity says nothing about correctness.",
   "Idioms are clarified by the sentences that follow them.",
   ["The parallel with contemporary anxieties about search engines is instructive"])

# ---------------------------------------------------------------- P10
passage("R10", "Fair by design?", "Technology & society", """
Employers screening thousands of applications have increasingly turned to software that ranks candidates. Its promoters make a plausible case: human recruiters are inconsistent, easily swayed by a confident handshake or a familiar surname, and tired by the fortieth résumé of the afternoon. A system that applies the same criteria to every applicant, they argue, should be fairer than people who cannot.

The difficulty lies in where the criteria come from. Many screening systems learn what a good candidate looks like by studying the organisation's past hiring decisions. If those decisions favoured graduates of certain institutions, speakers of a certain dialect or people with uninterrupted careers, the system will learn to favour them too—not because anyone instructed it to, but because those features predicted success in the only data it was given. Consistency, in this setting, is not the same as fairness. A system can apply a biased standard with perfect regularity.

It is tempting to solve the problem by removing sensitive attributes from the data: delete gender, age and caste, and the system cannot use them. This helps less than one might hope. Other features—a gap in employment, a particular hobby, a postal code—may correlate with the removed attributes and allow the system to reconstruct them indirectly. Blindness to a category does not guarantee neutrality towards the people in it.

None of this shows that automated screening is worse than human judgement. Human recruiters carry the same biases, and theirs are harder to audit. A system's decisions, by contrast, can in principle be tested: one can submit matched applications that differ in a single feature and observe whether the ranking changes. The real advantage of automation, then, is not that it is fair by default but that its unfairness can be measured—if anyone is permitted to look.

That condition is often not met. Vendors frequently treat their models as trade secrets, and employers may have little incentive to discover problems they would then be obliged to fix. The promise of auditable fairness is real, but it is a promise about what could be done, not about what is being done.
""")

rc("R10", "Main idea", "M", 90,
   "The central claim of the passage is that automated screening:",
   ["is inherently fairer than human recruitment because it is consistent.",
    "is inherently more biased than human recruitment.",
    "can reproduce past biases despite its consistency, and its real advantage—measurable unfairness—is realised only if it is actually audited.",
    "should be banned until sensitive attributes are removed from all data."],
   2,
   """'Consistency, in this setting, is not the same as fairness.' 'The real advantage of automation, then, is not that it is fair by default but that its unfairness can be measured—if anyone is permitted to look.'
   ⟦B⟧ contradicts 'None of this shows that automated screening is worse'. ⟦D⟧ — removing attributes 'helps less than one might hope'.""",
   "The thesis has a conditional: '…if anyone is permitted to look'.",
   "Read paragraph 4's 'The real advantage…'.",
   "Option ⟦A⟧ is the promoters' view the author challenges.",
   "Keep the author's qualifications in the answer.",
   ["Consistency, in this setting, is not the same as fairness.",
    "The real advantage of automation, then, is not that it is fair by default but that its unfairness can be measured"])
rc("R10", "Inference", "H", 90,
   "Why does removing sensitive attributes from the data help 'less than one might hope'?",
   ["Because the law requires those attributes to be kept.",
    "Because other features can correlate with the removed attributes and let the system reconstruct them indirectly.",
    "Because the system stops working without them.",
    "Because recruiters add the attributes back manually."],
   1,
   """'Other features... may correlate with the removed attributes and allow the system to reconstruct them indirectly.'""",
   "Proxy variables.",
   "Paragraph 3.",
   "Inventing reasons (law, manual re-entry) not in the passage.",
   "Proxy discrimination: blindness ≠ neutrality.",
   ["may correlate with the removed attributes and allow the system to reconstruct them indirectly"])
rc("R10", "Application", "H", 90,
   "Which of the following tests best fits the kind of audit the author describes?",
   ["Asking recruiters whether they trust the software.",
    "Comparing the software's hiring rate with last year's hiring rate.",
    "Submitting two applications identical except for the applicant's postal code and checking whether their rankings differ.",
    "Removing age and gender from the training data."],
   2,
   """'one can submit matched applications that differ in a single feature and observe whether the ranking changes.' Option ⟦C⟧ does exactly this.""",
   "Matched pairs, one difference.",
   "Look for the paired-test description.",
   "Option ⟦D⟧ is the attribute-removal fix, not an audit.",
   "Controlled comparisons isolate a single variable.",
   ["one can submit matched applications that differ in a single feature and observe whether the ranking changes"])
rc("R10", "Tone / attitude", "M", 60,
   "The tone of the final paragraph is best described as:",
   ["celebratory", "cautiously sceptical", "despairing", "indifferent"],
   1,
   """'The promise of auditable fairness is real, but it is a promise about what could be done, not about what is being done.' — measured scepticism.""",
   "'Real, but…' = cautious.",
   "Note both halves of the last sentence.",
   "'Despairing' overstates; the promise is called 'real'.",
   "Moderate tone words usually win.",
   ["The promise of auditable fairness is real, but it is a promise about what could be done, not about what is being done."])

# ---------------------------------------------------------------- P11
passage("R11", "The beauty of proofs", "Philosophy of mathematics", """
Mathematicians often describe their work in aesthetic terms. A proof is called elegant, a theorem beautiful, an argument ugly but correct. Outsiders sometimes hear this as affectation, a way of dignifying technical labour with the vocabulary of art. But the language is used too consistently, and by too many people who are otherwise indifferent to art, to be dismissed so easily.

What, then, do mathematicians find beautiful? The answers tend to converge. A beautiful proof is usually short relative to what it establishes. It connects areas that seemed unrelated, revealing that a fact about numbers is secretly a fact about shapes. And it explains rather than merely verifies: after reading it, one understands why the result must be true, not only that it is. A proof that checks thousands of cases by computer may be entirely convincing and still be called unsatisfying, because it leaves the reason hidden.

This last criterion suggests that mathematical beauty is not merely decorative. Proofs that explain tend to generalise; the insight that makes one result inevitable often makes others inevitable too. A mathematician who prefers the elegant argument is therefore not indulging a private taste but following a reliable signal of where further understanding lies. Beauty, on this view, is a kind of compressed judgement about fruitfulness.

It would be a mistake, though, to treat aesthetic judgement as infallible. There are important results whose only known proofs are long and unlovely, and there have been elegant arguments that turned out to contain errors. Taste can also be conservative, favouring methods that resemble those already admired. The history of the subject includes approaches first dismissed as clumsy that later proved indispensable.

The most defensible position may be that beauty in mathematics works like intuition in any expert practice: a trained response that is usually right for good reasons, occasionally wrong for the same reasons, and never a substitute for checking.
""")

rc("R11", "Main idea", "M", 90,
   "Which of the following best states the author's position on mathematical beauty?",
   ["It is an affectation borrowed from art criticism.",
    "It is an infallible guide to truth.",
    "It is a trained, usually reliable signal of explanatory and fruitful ideas, though fallible and no substitute for checking.",
    "It matters only to mathematicians who are also interested in art."],
   2,
   """'Beauty, on this view, is a kind of compressed judgement about fruitfulness', but 'It would be a mistake... to treat aesthetic judgement as infallible', ending with 'never a substitute for checking'.
   ⟦A⟧ is the outsiders' view rejected in paragraph 1; ⟦D⟧ contradicts 'too many people who are otherwise indifferent to art'.""",
   "The final paragraph states the 'most defensible position'.",
   "Read the conclusion.",
   "Option ⟦B⟧ ignores paragraph 4.",
   "Final 'most defensible position' sentences are usually the thesis.",
   ["Beauty, on this view, is a kind of compressed judgement about fruitfulness.",
    "never a substitute for checking"])
rc("R11", "Inference", "M", 75,
   "According to the passage, why might a computer-assisted proof that checks thousands of cases be considered unsatisfying?",
   ["Because it may contain errors.",
    "Because it verifies the result without revealing why it is true.",
    "Because it is too short.",
    "Because computers cannot handle geometry."],
   1,
   """'A proof that checks thousands of cases by computer may be entirely convincing and still be called unsatisfying, because it leaves the reason hidden.'""",
   "Explain vs verify.",
   "Paragraph 2, last sentence.",
   "Option ⟦A⟧ — the passage says such a proof may be 'entirely convincing'.",
   "Contrast pairs (explain/verify) are frequent RC targets.",
   ["because it leaves the reason hidden"])
rc("R11", "Detail", "E", 45,
   "Which of the following is NOT mentioned in the passage as a feature of a beautiful proof?",
   ["It is short relative to what it establishes.",
    "It connects areas that seemed unrelated.",
    "It explains why a result must be true.",
    "It uses only methods that are already widely admired."],
   3,
   """Shortness, connection and explanation are listed. Relying on admired methods is mentioned only as a risk ('Taste can also be conservative').""",
   "Tick off the three listed features.",
   "Paragraph 2 lists the features.",
   "Choosing an option that is listed because it sounds less 'beautiful'.",
   "NOT questions: verify each option against the text.",
   ["A beautiful proof is usually short relative to what it establishes.", "Taste can also be conservative"])
rc("R11", "Strengthen / weaken", "H", 90,
   "Which of the following, if true, would most strengthen the claim that beauty is 'a kind of compressed judgement about fruitfulness'?",
   ["Most mathematicians enjoy music.",
    "Proofs rated as elegant by mathematicians are, on average, cited and extended in later work more often than proofs rated as inelegant.",
    "Some elegant proofs have contained errors.",
    "Computer proofs are becoming more common."],
   1,
   """If elegant proofs are more often extended later, elegance does track fruitfulness. ⟦C⟧ weakens (fallibility). ⟦A⟧ and ⟦D⟧ are irrelevant.""",
   "Find evidence that 'elegant' predicts 'fruitful'.",
   "Fruitfulness = leads to more results.",
   "Option ⟦C⟧ is in the passage but cuts the other way.",
   "Strengtheners show the claimed correlation actually holds.",
   ["Proofs that explain tend to generalise"])
