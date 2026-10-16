# Official course map - learn-leadership-ai-with-phoebe

"Leadership in the Age of AI: Organising for AI". Bucket `lead`, single-track 6 sessions, 45 min
each, audience: the C-suite deciding company-wide workforce strategy. Skeleton approved by Phoebe
2026-10-16. Built 2026-10-16 by the foundations lead. Internal build document: never linked from
an audience page.

Angle: AI changes TASKS, not job titles, so the organisation is redesigned from the task up, with
the review load, the junior pipeline and the board's business case in view.

Running case: **Marlowe Group**, a CONSTRUCTED 4,000-person professional-services firm. Labelled
"constructed" on every page. Its headcount per role (34 roles, 3,660 people; the other 340 are
partners and roles outside the sample), its junior share per role and its cost bands are invented
for teaching and live in `materials/build-org-sample.py`. No real employer, no salary or pay
figure (costs are bands in FTE-years, labelled modelled), no layoff advice tied to a real company.

## Evidence tiers

- **read at source**: the primary page, paper, abstract or dataset was read by the lead on
  2026-10-16. Quote the numbers exactly as below.
- **reported**: the primary was blocked (403) or not read; the figure comes from a secondary
  source named in the row. Say "reported" on the page, or cut it.
- **constructed / modelled / assumption**: invented for teaching, or a stated rule. Labelled on
  the page and on the widget.

## Verified facts

| # | Fact (use this wording) | Tier | Source |
|---|---|---|---|
| F1 | O*NET 31.0 is the current O*NET database release; it is published by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA) under CC BY 4.0. Required attribution: "This page includes information from the O*NET 31.0 Database by USDOL/ETA. Used under the CC BY 4.0 license. O*NET is a trademark of USDOL/ETA." Modified data adds "USDOL/ETA has not approved, endorsed, or tested these modifications." | read at source | onetcenter.org/database.html; onetcenter.org/license_db.html |
| F2 | O*NET rates each task of an occupation for importance (IM, scale 1 to 5), relevance (RT) and frequency (FT), where frequency is a distribution over seven categories: yearly or less, more than yearly, more than monthly, more than weekly, daily, several times daily, hourly or more. Tasks are typed core or supplemental. O*NET does NOT record hours per task. | read at source | O*NET 31.0 Task Ratings dictionary page; Task Categories file (db_31_0) |
| F3 | Eloundou, Manning, Mishkin and Rock, "GPTs are GPTs: An Early Look at the Labor Market Impact Potential of Large Language Models", arXiv 2303.10130 (v5, 21 Aug 2023). Rubric: E0 no exposure; E1 direct exposure, an LLM via ChatGPT or the playground can cut the time to do the task "by at least half (50%)" at equivalent quality; E2 an LLM alone would not, but software built on top of it could. | read at source (PDF text) | arxiv.org/abs/2303.10130 |
| F4 | Eloundou et al. measures: alpha = E1; beta = E1 + 0.5 x E2 (the 0.5 weight on E2 accounts for the extra investment the software needs); zeta = E1 + E2, an upper bound. | read at source | same, section 3 |
| F5 | Eloundou et al. headline: about 80% of the U.S. workforce could have at least 10% of their tasks affected, and about 19% of workers may see at least 50% of their tasks impacted. Human annotators: only 3% of workers have over half their tasks exposed to an LLM alone; up to 49% with complementary tools. | read at source | abstract and introduction |
| F6 | Eloundou et al. say exposure "does not necessarily suggest that their tasks can be fully automated", that "technical feasibility does not guarantee labor productivity or automation outcomes", that the 50% threshold "is somewhat arbitrary", and that real-world time savings would likely be "slightly or significantly lower" than their estimates. They do not predict adoption timelines. | read at source | sections 1, 3, 4 |
| F7 | Eloundou et al. on their labels: human annotators were familiar with LLM capabilities but "not occupationally diverse"; GPT-4 classifications are sensitive to rubric wording; "none should be considered the definitive ground truth"; human labels are the primary results. | read at source | section 3.4 |
| F8 | The released data (github.com/openai/GPTs-are-GPTs, MIT licence, copyright 2024 OpenAI) includes `full_labelset.tsv`: one row per O*NET task, with human_exposure_agg and gpt4_exposure labels (19,265 task rows; human labels E0 10,256, E1 2,862, E2 6,147). | read at source (downloaded, read with python -I) | GitHub repo, data/ |
| F9 | Brynjolfsson, Li and Raymond, "Generative AI at Work", NBER WP 31161; published in The Quarterly Journal of Economics 140(2), 889-942, 2025. 5,179 customer-support agents. Access to an AI assistant raised issues resolved per hour by 14% on average, with a 34% improvement for novice and low-skilled workers and minimal impact on experienced and highly skilled workers. | read at source (NBER abstract) | nber.org/papers/w31161 |
| F10 | Dell'Acqua, McFowland, Mollick, Lifshitz, Kellogg, Rajendran, Krayer, Candelon and Lakhani, "Navigating the Jagged Technological Frontier", published Organization Science 37(2): 403-423 (DOI 10.1287/orsc.2025.21838); earlier HBS Working Paper 24-013. 758 BCG consultants. Inside the frontier: 12.2% more subtasks completed, roughly 25% faster, work rated about 32% higher quality (published-version summary). Outside the frontier (a brand-strategy task built so the AI would get it wrong): 84.5% correct without AI, 70.6% with GPT-4, 60% with GPT-4 plus a prompt overview. Bottom-half performers improved 31%, top-half 11%. | reported (HBS AI Institute summary page of the published paper; the paper and SSRN page returned 403) | aiinstitute.hbs.edu/back-to-the-beginnings-of-ai-at-work |
| F10b | The working-paper version is widely quoted as "40% higher quality" and "19 percentage points less likely to be correct" outside the frontier; the published-version summary gives about 32% and the 84.5 / 70.6 / 60 split. Teach the published numbers; if the 40% figure comes up, say it is the working paper's. | reported (learn-economics map records the WP read at source) | learn-economics-with-phoebe materials |
| F11 | Becker, Rush, Barnes and Rein (METR), "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity", arXiv 2507.09089: 16 experienced developers, 246 tasks in their own repositories. Developers forecast AI would cut completion time by 24%; afterwards they believed it had cut it by 20%; measured, AI made them 19% slower. | read at source (abstract) | arxiv.org/abs/2507.09089 |
| F12 | Acemoglu, "The Simple Macroeconomics of AI", NBER WP 32487 (May 2024); published Economic Policy 40(121), 13-58, 2025. Total factor productivity gain over 10 years "no more than" 0.66%, and "less than 0.53%" once hard-to-learn tasks are accounted for. Gains depend on the fraction of tasks impacted and average task-level cost savings. Predicts AI widens the gap between capital and labour income. | read at source (NBER abstract) | nber.org/papers/w32487 |
| F13 | Gmyrek, Berg and Bescond, "Generative AI and Jobs: A global analysis of potential effects on job quantity and quality", ILO Working Paper 96 (August 2023): the main effect is likely to "augment rather than automate jobs"; larger effects in higher-income countries and for women, through clerical work. | read at source (ILO publication page) | ilo.org publication page |
| F14 | Gmyrek, Berg, Kaminski, Konopczynski, Ladna, Nafradi, Roslaniec, Troszynski, "Generative AI and Jobs: A Refined Global Index of Occupational Exposure", ILO Working Paper 140 (20 May 2025): one in four workers are in an occupation with some GenAI exposure; 3.3% of global employment is in the highest exposure category (4.7% of female, 2.4% of male employment); 34% of employment in high-income countries vs 11% in low-income countries. | read at source (ILO publication page) | ilo.org publication page |
| F15 | Brynjolfsson, Chandar and Chen, "Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence", Stanford Digital Economy Lab (first 2025, revised 12 Aug 2026), ADP payroll data through June 2026: employment of workers aged 22 to 25 in the most AI-exposed occupations is 19% below where it would be had it kept pace with less-exposed peers; no comparable gap for experienced workers; declines concentrate where AI mainly substitutes, not where it complements. The authors call the facts descriptive, not causal; some trends predate generative AI; the gap weakens when controlling for education; no evidence of widespread economy-wide displacement. | read at source (Lab publication page) | digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine |
| F15b | The 2025 first version reported a smaller gap (its exact figure was not read at source); the August 2026 revision says 19%. Quote 19% with the revision date, never an older figure. | 19% read at source; older figure not read | same |
| F16 | Humlum and Vestergaard, "Still Waters, Rapid Currents: Early Labor Market Transformation under Generative AI", NBER WP 33777 (May 2025, revised March 2026), Danish adoption surveys linked to administrative records: precise null effects on earnings and recorded hours, ruling out effects larger than 2% two years after ChatGPT's launch; employers absorb AI through task reorganisation, including new tasks in content generation, AI oversight and AI integration. | read at source (NBER abstract) | nber.org/papers/w33777 |
| F17 | Felten, Raj and Seamans, AI Occupational Exposure (AIOE), Strategic Management Journal 42(12): 2195-2217 (2021): occupation-level scores by six-digit SOC, with a later language-modelling variant in the same repo. Occupation level only; the repo page states no licence. Not used on the bench; named as the occupation-level alternative. | read at source (GitHub repo page) | github.com/AIOE-Data/AIOE |
| F18 | WEF Future of Jobs Report 2025 (employer survey): about 170 million jobs created and 92 million displaced by 2030, net 78 million; about 39% of core skills expected to change. A survey of employers' expectations, not a measurement. | reported (WEF pages 403; figures as widely reproduced) | weforum.org Future of Jobs 2025 |
| F19 | Gartner, "Top Strategic Predictions for 2025 and Beyond" (21 Oct 2024): through 2026, 20% of organisations will use AI to flatten their structure, eliminating more than half of current middle-management positions; the same note flags disrupted mentoring paths and fewer development opportunities for junior employees. | reported (press coverage; Gartner page 403) | businessworld.in, networkworld.com coverage |
| F20 | "The right span of control is 5 to 7" and "Dunbar's number" as org-design rules: no primary source sets an org-wide span rule; treat as folklore. Team-level span belongs to learn-team-management. | folklore, no single source | n/a |

## The disagreement to teach (never resolve)

- **How big is the productivity uplift?** Field studies: +14% throughput (Brynjolfsson et al.),
  roughly 25% faster inside the frontier (Dell'Acqua et al.); METR: 19% SLOWER for experienced
  developers on their own code; outside the frontier, correctness fell (84.5% to 70.6%). Macro:
  Acemoglu's no more than 0.66% TFP over ten years. Exposure is not uplift (F6).
- **What happens to jobs?** ILO: mostly augmentation (F13, F14). Canaries: early-career
  employment in exposed occupations 19% below trend, descriptive not causal (F15). Humlum and
  Vestergaard: precise nulls on earnings and hours in Denmark (F16). WEF: employers expect net
  growth (F18, reported). These disagree and all can be partly right: averages, timing, country,
  and the age of the worker differ.
- **Does freed time become output or slack?** Humlum and Vestergaard find reorganisation and new
  tasks (F16); no study gives a firm-level "absorbed share". The bench's demand-rebound slider is
  an assumption.

## Bench assumptions and their basis (defaults the pages may quote only as assumptions)

| Assumption | Default | Range on the board rung | Basis |
|---|---|---|---|
| Time saved on an E1 task | 25% | 14% to 50% | 25% ~ Dell'Acqua "roughly 25% faster" inside the frontier (read as about a quarter less time, an approximation); 14% = Brynjolfsson et al. average throughput gain; 50% = Eloundou's E1 threshold, which the authors expect real savings to fall below |
| Time saved on an E2 task | half the E1 value | follows E1 | Eloundou et al.'s 0.5 weight on E2 in beta |
| Review and verification time per exposed task | 10% of the task's original time | 5% to 15% | No study measures it at firm scale. METR shows checking can exceed the saving (19% slower); Dell'Acqua shows unchecked output outside the frontier is wrong more often. Pure assumption, labelled |
| Freed capacity absorbed by demand | 25% | 0% to 50% | No firm-level estimate exists; Humlum and Vestergaard find reorganisation and new tasks. Pure assumption, labelled |
| Time shares per task | importance x mean frequency, normalised | leader edits per task | A PROXY: O*NET has no hours per task (F2). Eloundou et al. themselves weight tasks equally and report that importance weighting did not change results much |
| Reskill cost per person in the role | 0.03 to 0.08 FTE-years | the band itself | Modelled band, constructed; no salary used |
| Anti-lever cut order | junior grade first | n/a | A stated model: exposed tasks skew to entry-level work (consistent with F9, F15), so a cut "on the hours" lands there |

## Seams with siblings (link with absolute URLs, never reteach; say this side out loud)

- https://phoebefu6.github.io/learn-ai-leadership-with-phoebe/ owns culture, change adoption,
  ethics and manager-level delegation.
- https://phoebefu6.github.io/learn-team-management-with-phoebe/ owns team-level size, span of
  control within one team, rhythm. We own org-level layers and how AI shifts ratios across the firm.
- https://phoebefu6.github.io/learn-performance-management-with-phoebe/ owns parting well and exits.
- https://phoebefu6.github.io/learn-ai-hr-with-phoebe/ owns hiring, screening, adverse impact.
- https://phoebefu6.github.io/learn-economics-with-phoebe/courses/p7-labour-economics-of-ai.html
  owns the labour economics of AI (displacement and reinstatement, the three task studies).
- https://phoebefu6.github.io/learn-ai-consulting-with-phoebe/ a1 owns the "jagged frontier"
  heading: cite the study, never use it as a heading.
- https://phoebefu6.github.io/learn-strategic-thinking-with-phoebe/ owns generic frameworks;
  https://phoebefu6.github.io/learn-okr-with-phoebe/ owns goal-setting.

## Sessions (exact titles, files, coverage)

| # | File | Title | Covers | Key facts |
|---|---|---|---|---|
| 01 | courses/01-bundle-of-tasks.html | The org chart is a bundle of tasks | a role as tasks; O*NET task statements; exposure E0/E1/E2; exposure is not automation; label disagreement; Marlowe's task inventory build-along | F1-F8, F13, F14 |
| 02 | courses/02-where-freed-hours-go.html | Where the freed hours actually go | time shares vs task counts; speed-up evidence and its spread; review and verification load; demand rebound and new tasks; the four destinations of a freed hour | F9-F12, F16 |
| 03 | courses/03-spans-layers-junior-rung.html | New shapes: spans, layers and the missing junior rung | org-level layers and ratios; what AI does to the coordination layer; the junior rung as the pipeline to senior; span folklore | F9, F15, F19, F20 |
| 04 | courses/04-role-redesign-bench.html | The role-redesign bench | the computed ladder on real task rows; anti-lever; break button; board range | F1-F8 + canon below |
| 05 | courses/05-build-buy-reskill-wait.html | Build, buy, reskill or wait | four options per role; reskill cost and payback as ranges; option value of waiting; E2 needs software someone builds or buys | F4, F6, F12, F18 |
| 06 | courses/06-governing-the-transition.html | Governing the transition | a board-level decision record; tripwires on review load and the junior rung; what to measure after; ethics and adoption handed to learn-ai-leadership | F6, F11, F15, F16 |

Health and wellbeing: workload content is planning, never medical or clinical advice; stated once
on the landing page and session 1.

## Not covered (honest list)

- Culture, change adoption, AI ethics, manager-level delegation (learn-ai-leadership).
- Hiring, screening, adverse impact (learn-ai-hr); exits and parting well (learn-performance-management).
- Labour-market theory (learn-economics p7); team-level spans and rhythm (learn-team-management).
- Country-specific employment law, consultation duties and works councils: the course names that
  they exist and sends leaders to counsel; it gives no legal advice.
- Real hours-per-task data: O*NET has none; the bench's time shares are a proxy the leader replaces.
- Firm-level evidence on review time and absorbed demand: none found; both are assumptions.
- Productivity numbers for agents acting autonomously across whole workflows: the studies above
  are assistant-style tools.

## Citation appendix (use these forms)

- O*NET 31.0 Database, U.S. Department of Labor, Employment and Training Administration (USDOL/ETA), CC BY 4.0. onetcenter.org/database.html
- Eloundou, T., Manning, S., Mishkin, P., Rock, D. (2023). GPTs are GPTs: An Early Look at the Labor Market Impact Potential of Large Language Models. arXiv 2303.10130. Released data: github.com/openai/GPTs-are-GPTs (MIT).
- Brynjolfsson, E., Li, D., Raymond, L. (2025). Generative AI at Work. Quarterly Journal of Economics 140(2), 889-942. (NBER WP 31161.)
- Dell'Acqua, F., et al. (2026). Navigating the Jagged Technological Frontier. Organization Science 37(2), 403-423. (HBS WP 24-013, 2023.)
- Becker, J., Rush, N., Barnes, E., Rein, D. (2025). Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity. arXiv 2507.09089.
- Acemoglu, D. (2025). The Simple Macroeconomics of AI. Economic Policy 40(121), 13-58. (NBER WP 32487, 2024.)
- Gmyrek, P., Berg, J., Bescond, D. (2023). Generative AI and Jobs. ILO Working Paper 96.
- Gmyrek, P., et al. (2025). Generative AI and Jobs: A Refined Global Index of Occupational Exposure. ILO Working Paper 140.
- Brynjolfsson, E., Chandar, B., Chen, R. (2025, rev. 2026). Canaries in the Coal Mine? Stanford Digital Economy Lab.
- Humlum, A., Vestergaard, E. (2025, rev. 2026). Still Waters, Rapid Currents. NBER WP 33777.
- Felten, E., Raj, M., Seamans, R. (2021). Strategic Management Journal 42(12), 2195-2217.
- World Economic Forum (2025). Future of Jobs Report 2025 (reported).
- Gartner (2024). Top Strategic Predictions for 2025 and Beyond (reported).

## Bench canon (run 2026-10-16; pages may quote ONLY these, as the widget prints them)

Data: `assets/org-sample.js` (100,342 bytes), built by `materials/build-org-sample.py` from O*NET
31.0 text release (`db_31_0_text.zip`: Task Statements.txt, Task Ratings.txt) and
`full_labelset.tsv` from github.com/openai/GPTs-are-GPTs. 34 roles, 624 task statements, 3,660 of
Marlowe's 4,000 people (constructed). Join coverage: every role ships all its labelled tasks except
where O*NET 31.0 has no IM/FT rating for a task (accountants 30/30, analysts 11/11; e.g. secretaries
31/32, compliance officers 12/16). 13-2051.00 Financial and Investment Analysts was dropped: O*NET 31.0
publishes no task ratings for it (analyst-sourced tasks); 15-2031.00 Operations Research Analysts
replaces it.

Verification: `node materials/org-node.js` runs `assets/org-live.js` (the browser file) and exits 0
only if `selfTest()` passes AND fails with the planted fault (`review-sign`). `python3
materials/compare-ladder.py` compares node against the independent `materials/org_reference.py` by
VALUE: **938 values compared, 0 mismatches (tolerance 1e-6 on 6-decimal canon), planted 0.1% fault
caught.** Both exit 0.

Defaults: E1 saves 25%, E2 12.5%, review 10% per exposed task, 25% absorbed; human labels.

### Management analyst (13-1111.00), the bench's default role, 900 people, junior grade 405

| Rung | Freed share | FTE of 900 |
|---|---|---|
| 1 naive (9 of 11 tasks exposed) | 81.8% | 736.4 |
| 2 + time shares and speed-up | 11.8% | 106.6 |
| 3 + review load | 3.9% | 34.9 |
| 4 + demand rebound | 2.9% | 26.1 |
| 5 board range (slow to fast) | -5.3% to 19.7% | -48.0 to 177.4 |
| payback (fast to slow) | | 2 months to never |
| Anti-lever: cut on rung 2 hours | | cut 106; shortfall 79.9 FTE = 71.8 review + 8.7 absorbed; junior grade 405 to 299 |
| Break button (review = 0), rung 4 | 8.9% | 80.0 |
| GPT-4 labels, rung 1 / rung 4 | 72.7% / 1.9% | |

Task mix: 2 E1, 7 E2, 2 E0 (human labels); 1 task flips exposed/not exposed between raters
(7283 "Prepare manuals and train workers": human E2, GPT-4 E0). 7285 "Plan study of work problems":
human E1, GPT-4 E2.

### Marlowe firm totals, 34 roles, 3,660 people

| Rung | Human labels, FTE | GPT-4 labels, FTE |
|---|---|---|
| 1 naive | 3,034.7 | 3,285.9 |
| 2 + time shares | 474.7 | 509.3 |
| 3 + review | 171.5 | 180.7 |
| 4 + rebound | 128.7 | 135.5 |
| 5 range | -188.9 to 797.8 | -207.7 to 854.4 |
| Anti-lever cut / shortfall | 453 cut / 324.3 FTE | 489 / 353.5 |
| Break button, rung 4 | 356.0 | 382.0 |

Label disagreement (exposed vs not exposed, human vs GPT-4): 108 of 624 tasks.

Other roles at rung 4 (FTE): accountants 15.8 of 520; operations research analysts 11.0 of 260;
customer service 6.7 of 90; secretaries 6.4 of 120. Full per-role canon: run `node
materials/org-node.js`.

Reading notes for page authors: the biggest drop is rung 1 to 2 (tasks to time). Review eats E2: on
the defaults an E2 task saves 12.5% and costs 10% to check. A negative slow case means review costs
more than the tool saves; payback then prints "never".

## Palette and corrections to the course block (foundations lead, 2026-10-16)

- Palette: primary #AE1941, deep #741029, mid #C0355A, soft #F0C8D2, 50 #FCEFF2, ink #2B1A1E,
  muted #6B595D, faint #DECCD1, hairline #F1E5E8, sand #E9D8B4 (fill only, ink text), sand-ink
  #6B4E1C, sand-50 #F8F1E2, paper #FFFCFB. White on primary 6.96:1. The suggested #9F1D4B is a
  near-twin of learn-bayesian #9D174D (CIEDE2000 1.6); the cranberry region is crowded and no
  cranberry reaches dE00 >= 10 from every estate primary (best possible about 8.7). Chosen #AE1941:
  nearest estate primaries ai-marketing #C2185B (6.8) and bayesian (6.9); vs time-management plum
  #7A3B69 17.9; vs ai-hr 15.5, cyber-security 18.2.
- Sand cannot carry white text, so every template rule that drew white on --amber now draws --ink.
- 13-2051.00 Financial and Investment Analysts has no O*NET 31.0 task ratings; replaced by
  15-2031.00 Operations Research Analysts.
- Dell'Acqua et al.: the published version's summary gives about 32% quality and 84.5 / 70.6 / 60%
  correct outside the frontier, not the working paper's 40% and 19 points. Pages use the published
  figures, tiered reported.
- Canaries in the Coal Mine: the August 2026 revision says 19% (the 2025 version's figure differs).
