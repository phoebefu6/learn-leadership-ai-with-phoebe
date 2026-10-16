# Agent brief - shared by every fan-out page of learn-leadership-ai-with-phoebe

You are writing ONE static HTML session page. No servers, no npm. **If your target file already
exists on disk, do not write it; report that and stop.** Write the file, return its path and one
line of coverage. No HTML in your reply.

## Read first, in this order

1. The template page. Copy its structure, classes, SVG grammar and quiz markup EXACTLY, including
   how many options each question has (FOUR, labelled "A · ", "B · ", "C · ", "D · "):
   - `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-leadership-ai-with-phoebe/courses/01-bundle-of-tasks.html`
   - For rhythm only (the bench page, do not copy its widget): `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-leadership-ai-with-phoebe/courses/04-role-redesign-bench.html`
2. The source map: every verified number, its evidence tier, per-session coverage, the seams, the
   bench assumptions and the bench canon. Use ONLY its numbers; never invent a statistic; if a fact
   is missing, teach the uncertainty.
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-leadership-ai-with-phoebe/materials/official-course-map.md`
3. The stylesheet `:root` block for the palette tokens (first 30 lines):
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-leadership-ai-with-phoebe/assets/style.css`

## Page skeleton (keep every component)

toolbar (crumb EXACTLY as the template: linked "learn-leadership-ai-with-phoebe" / "Session N of 6",
#toggle-all, #zoom-toggle) · masthead (eyebrow "Leadership in the Age of AI · Session N of 6", h1
with one `<span class="accent">`, .sub, .chip-row with the level chip (🟡 Core for sessions 2 and 3,
🟠 Deeper for 5 and 6) plus two .chip.audience (first one "C-suite and board") and the .chip.time
"45 min", .agenda a1-a4) · main.wrap · section#intro (Part 0: kicker, .lede, .legend pills as in the
template, .callout.win "★ What you walk out with tonight") · 3 Parts, each `section.section#part-N`
with section-kicker (klabel "Part N · covers ...", h2, `.tag.concept "N min live"`), a `.lede`, ONE
figure, `details.card` accordions (summary: `.mode.live` or `.mode.self`, title, `.mini`, `.caret ▶`),
at least one `.callout.example` with `span.ex-pill` "Real world" on the page · section#demo-1
Build-along (kicker `.tag.demo "★ 22 min · everyone builds"`, .lede, ONE figure, `.steps > .step`, each
with a `.prompt-box.good` carrying a `span.label`; the build-along is plain-text board-paper
templates the learner fills for their own firm, with Marlowe's constructed version as the worked
example) · section#exercise Homework (ol, 4 items) · section#quiz (3 x `.quiz-q data-answer="0-based"`,
`p.qtext`, four `button.qopt` "A · ..." as in the template, `p.qwhy`; one `p.quiz-score` after the
last) · section#official, h2 EXACTLY "What this session teaches, and where it came from",
`.covered > .covered-row` (pill solid ✓ / light ◐ + name + note), then the `.mono` line EXACTLY
"Every fact on this page, and its verification tier, is recorded in the course's source map." ·
section.cheat#cheatsheet (h3 "Session N cheat sheet <span>· pin this</span>", .grid-2 of six
.cheat-item) · `.callout.next` with `.nx-pill` "Next session" · footer.pagefoot ·
`<script src="../assets/app.js?v=1"></script>`.

Head: the template's social meta block with this page's own title/description/url;
`<title>Session N · <Title> - learn leadership ai with phoebe</title>`;
`<link rel="stylesheet" href="../assets/style.css?v=1">`. Nothing else external.

First `details.card` in the FIRST Part is `open`; no other. Sentence case headings. Warm, direct
voice for a chief executive: concrete, numerate, never breathless, never dry. Inside prompt-boxes
escape `&` `<` `>`. 450 to 650 lines is guidance about depth, never a target.

Quiz answer letters must VARY. Session 1 uses C, A, D; session 4 uses B, D, A. Use these:
session 2: D, B, C · session 3: A, C, B · session 5: B, A, D · session 6: C, D, A.

## Hard rules (a violation is rework)

- NEVER an em dash or en dash, anywhere (prose, code, aria-labels, comments). Hyphen only.
- No meta text: never "this course", "in this course", "the course teaches", "banned here". State
  the professional norm directly with its reason. The two exact estate phrases above are the only
  self-references; "session 5" cross-references are fine.
- Attribution "by Phoebe Fu". Never "built with" a tool.
- Every number comes from the map or is labelled constructed. Bench numbers come ONLY from the
  "Bench canon" section of the map, and only as the widget prints them (assumptions labelled
  assumptions). Marlowe numbers are constructed and say so ("your numbers will differ").
- No real employer, client or named company as a case. No salary or pay figures anywhere: cost is
  in FTE-years as a modelled band. No layoff advice tied to a real company.
- Contested evidence (productivity uplift size, net job effects, demand rebound, the junior-rung
  effect) is taught as the disagreement, with both sides cited from the map. Never resolve it.
- Citations in the exact form of the map's appendix; anything marked reported says "reported".
- Never use "jagged frontier" as a heading (learn-ai-consulting owns it); cite Dell'Acqua et al. by
  authors.
- Workload content is planning, never medical or clinical advice.
- NEVER "lottery" or "lotteries"; say the mechanism. No Chinese terms.
- Never a cross mark glyph (✗, ×, ❌) anywhere, including figures: label a wrong way in words
  ("Wrong way", "Headcount on hours") and use the universal reds only for that panel.
- Titles, widget ids and class names must not collide with siblings: do not use the other session
  titles of this course, "A system you keep", "The one-page marketing plan", "Is it worth the
  time?", "Where your week actually goes", or any title in learn-ai-leadership, learn-team-management,
  learn-performance-management, learn-okr, learn-ai-hr, learn-ai-productivity. Do not use ids or
  classes starting `rrb-`, `mb-`, `ab-`, `org-`, `b1`, `b4` (those belong to other pages or widgets).
- Never use Phoebe's own employers, clients or career; the running case is Marlowe Group, constructed.
- Seams: one line and a link, never teach the neighbour's content (see Cross-links).

## Figure grammar (hand-drawn, every figure)

Palette, ONLY these hexes (no invented greys): #AE1941 (cranberry accent) #741029 (accent-deep)
#C0355A (mid) #F0C8D2 (soft) #FCEFF2 (accent-50) #2B1A1E (ink) #6B595D (muted) #DECCD1 (faint)
#F1E5E8 (hairline) #E9D8B4 (sand contrast, FILL ONLY, dark ink text on it) #6B4E1C (sand-ink, for
contrast TEXT) #F8F1E2 (sand-50) #FFFCFB (paper) · `#FFFFFF` · universal reds `#991B1B` `#FEF2F2`
`#FCA5A5` only for a wrong-way panel. White text only on #AE1941, #741029 or #C0355A fills.

- `<figure class="zoomable">` > `<svg viewBox="0 0 880 H" xmlns="http://www.w3.org/2000/svg" role="img"
  aria-label="the data, not the shape">` > `<defs>` + `<style>` + content, then
  `<figcaption>🔍 Click to zoom - takeaway</figcaption>`. Grow H, never W.
- Prefix unique per figure, used for every class and id: `s<session><letter>`, e.g. s2a, s2b, s2c,
  s2d for session 2 (s3a.. for session 3, s5a.., s6a..).
- `<defs>` holds with prefix P: a wobble filter `id="PSk"` (`feTurbulence type="fractalNoise"
  baseFrequency="0.02" numOctaves="2" seed="<int>"` + `feDisplacementMap scale="2.4"
  xChannelSelector="R" yChannelSelector="G"`, `x="-3%" y="-3%" width="106%" height="106%"`), a
  hachure pattern `id="PHc"` (7x7 userSpaceOnUse, rotate(-38), one #AE1941 line, opacity .5) if used,
  an open arrowhead `id="PAr"` (path `M1 1 L9 5 L1 9`, fill none, #2B1A1E stroke 1.6) if used. ALL
  shapes sit inside ONE `<g filter="url(#PSk)" fill="none" stroke="#2B1A1E" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round">`; rects carry a tiny rotation (-4 to 4 degrees for
  hand-placed items, under 1 for panels). Fills: white, #FCEFF2, the hachure for "the pile", and the
  sand #E9D8B4 ONLY for the one thing the figure is about. One doodle anchor per figure, simple
  strokes, never a mascot. Text classes (copy the template's `<style>` block, renamed): `.PH` 800
  12px ink heading · `.PL` 600 12px ink label · `.PS` 400 11px muted · `.PB` 800 11px #6B4E1C · `.PV`
  800 12-20px #741029 value · `.PW` 800 11-12px white on a cranberry fill · `.PA` 700 11px #AE1941
  caption · `.PN` 400 12px muted note. Hand-stacked items must not overlap as painted rects.
- ALL `<text>` OUTSIDE the filtered group, sans stack, never below 10.5px.
- Fit: max chars ≈ (box width - 20) / 7 at 12px, 6.4px/char at 11px; full-width note under 110 chars;
  40px between neighbouring point labels; bottom note 22px below the last row, H clears it by 8px.
  When in doubt, shorten. NO line, arrow or curve may pass through or touch a text label (the gate
  flags line-through-text): route arrows in the gaps and put edge labels clear of the path.
- Floor: one figure per Part plus one in the build-along (4 figures). Draw the MECHANISM (e.g. one
  freed hour splitting into review, new demand, slack and a smaller team; a layered org chart where
  a coordination layer thins and the junior rung empties; a four-way option tree per role with its
  cost and payback range; a decision record with tripwires on review load and the junior rung),
  never a metaphor literally, never decoration.

## Voice and honesty

Every Part gets a story: Marlowe (labelled constructed on first use per Part) or a generic "a
familiar pattern" with no invented numbers. People at Marlowe (all constructed): Hana Reyes, chief
executive; the board; the advisory practice's 900 management analysts. The `.callout.example` "Real
world" pill holds a study from the map with its exact numbers, or a familiar pattern described
without statistics.

## Cross-links (absolute URLs, one line each, never reteach)

- Culture, change adoption, ethics, manager-level delegation: https://phoebefu6.github.io/learn-ai-leadership-with-phoebe/
- Team-level size, span of control within one team, rhythm: https://phoebefu6.github.io/learn-team-management-with-phoebe/
- Parting well and exits: https://phoebefu6.github.io/learn-performance-management-with-phoebe/
- Hiring, screening, adverse impact: https://phoebefu6.github.io/learn-ai-hr-with-phoebe/
- Labour economics of AI: https://phoebefu6.github.io/learn-economics-with-phoebe/courses/p7-labour-economics-of-ai.html
- Consultant field experiment, in depth: https://phoebefu6.github.io/learn-ai-consulting-with-phoebe/
- Generic strategy frameworks: https://phoebefu6.github.io/learn-strategic-thinking-with-phoebe/ · goal-setting: https://phoebefu6.github.io/learn-okr-with-phoebe/
- Hub: https://phoebefu6.github.io/learn-with-phoebe/

## Footer chain and session titles

Footer left: "Session N of 6 · learn-leadership-ai-with-phoebe · by Phoebe Fu &nbsp;·&nbsp; 📚 <a href="https://phoebefu6.github.io/learn-with-phoebe/">Learn with Phoebe ↗</a>"
Footer right: "<a href="PREV">← Prev: <title></a> &nbsp;·&nbsp; <a href="NEXT">Next: <title> →</a>" (last page: "← Prev" and "<a href="../index.html">Course home →</a>").

Session titles and files (exact, sentence case, one accent span in h1, accent words in brackets):
1. 01-bundle-of-tasks.html · The org chart is a (bundle of tasks) (hand-authored)
2. 02-where-freed-hours-go.html · Where the (freed hours) actually go
3. 03-spans-layers-junior-rung.html · New shapes: spans, layers and the (missing junior rung)
4. 04-role-redesign-bench.html · The (role-redesign) bench (hand-authored)
5. 05-build-buy-reskill-wait.html · Build, buy, (reskill) or wait
6. 06-governing-the-transition.html · Governing the (transition)

## One-line outlines for the fan-out pages

- 02 Where the freed hours actually go: task count vs time share (O*NET has no hours; the
  importance x frequency proxy); the speed-up evidence as a spread (Brynjolfsson et al. +14%, 34%
  for novices; Dell'Acqua et al. about 25% faster inside, 84.5 to 70.6% correct outside; METR 19%
  slower against a forecast 24% faster); review and verification as work; demand rebound and new
  tasks (Humlum and Vestergaard nulls, reorganisation); the four destinations of a freed hour;
  build-along: a time-share sheet for the session 1 role with the bench's default assumptions.
- 03 New shapes: spans, layers and the missing junior rung: org-level layers and ratios (seam:
  team-level span is learn-team-management); what assistants do to coordination work; the junior
  rung as the pipeline (Brynjolfsson et al. novices gain most vs canaries: early-career employment
  in exposed occupations 19% below trend, descriptive not causal; teach both); Gartner's flattening
  prediction (reported) and span folklore (no source); build-along: a layer-and-rung map for Marlowe's
  advisory practice with the bench's anti-lever junior numbers from the canon.
- 05 Build, buy, reskill or wait: four options per role, chosen by the task mix (E1 tasks are
  available now; E2 tasks need software someone builds or buys, Eloundou's half-weight); reskill
  cost and payback as RANGES (the bench's board rung, cost band in FTE-years, modelled); the option
  value of waiting; macro context as the low side (Acemoglu, no more than 0.66% TFP over 10 years)
  vs employer expectations (WEF, reported); build-along: a one-page option memo per role.
- 06 Governing the transition: a board-level decision record; tripwires on review load (METR) and
  the junior rung (canaries), what to measure after (time shares re-surveyed, review hours, junior
  intake); evidence that adoption shows up as reorganisation not earnings yet (Humlum and
  Vestergaard); legal consultation duties named, not advised; ethics and adoption handed to
  learn-ai-leadership; build-along: the record and a quarterly review agenda.
