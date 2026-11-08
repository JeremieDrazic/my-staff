# Field notes — ai-craft

Every criterion in this domain's checklists traces back to one of two things: a real incident,
or a check a machine can run. Anything else is speculation, and a checklist of speculations gets
ignored.

Newest first.

## 2026-11-08 — the first real run: the gap was never coverage

**What happened.** `write-a-skill` was run for the first time, on a real request (a recurring
Dockerfile review pass), against a baseline: the same prompt given to a fresh agent with no
skill. The baseline produced a well-shaped skill — trigger-first description, spec-pure
frontmatter, long snippets already split into a reference. It found all four of the checks the
user asked for. What it got wrong was priority: it ranked the two findings the user cared about
9th and 10th of 12, missed one of the two credentials entirely, and wrote "also confirm a
`.dockerignore` exists" instead of looking.

**Why nothing caught it.** Nothing had ever been compared. The skill's seven steps were written
from what seemed worth saying, and progressive disclosure and description shape — two of them —
turn out to be things a capable agent already does unaided.

**What came out of it.** The baseline moved from the last step to the second and became P0 in
`04-evals.md`: run it first, and write only what closes the measured gap. The run also reshaped
the skill it produced — the second run spent no words teaching what the baseline already knew,
and spent them on enumeration, ranking and a fixed report shape instead.

## 2026-11-08 — a criterion that could be verified but not met

**What happened.** A step written during that run read "say with a line number which uid the
image runs as". It is observable, it is demanding, and it is impossible to satisfy on the file
the pass exists for: an image with no `USER` instruction has no line to cite. The skill shipped
with it and only the real run surfaced it.

**Why nothing caught it.** The rule in `02-body.md` asked for criteria that were checkable and
demanding. Both properties hold here. Neither implies the criterion can be met.

**What came out of it.** The third property, P0 in `02-body.md`: a criterion is tested against
the **failing** case, not only the passing one.

## 2026-11-08 — a skill that pointed at skills that did not exist

**What happened.** The same run had to write a `## When not to use this` section for a standalone
skill with no neighbours. The rule said to name the skill that owns the adjacent case. It
declined to invent names, on the grounds that a reader would try to load them, and named the
adjacent cases and the real tools instead — knowingly failing the criterion as written.

**Why nothing caught it.** The rule was written from a repository that already had a catalogue,
and assumed one.

**What came out of it.** The sanctioned escape, in `01-trigger.md` and step 3: name the case and
the tool that owns it. An invented skill name is worse than none.

## 2026-11-08 — the checklist nobody could have read in full

**What happened.** `skill-quality` was materialised into the skill as `references/skill-quality/`
— an index linking six section files. An agent reading a file reached from another referenced
file reads only part of it, so the checklist that gates every skill was unreadable by the agent
it gates. `staff sync` reproduced that shape into every skill declaring any checklist.

**Why nothing caught it.** The shape was chosen for selective loading, which is a real benefit,
and nothing measured whether the sections were reachable at all.

**What came out of it.** `staff sync` now generates one file per checklist, with the sections
joined and the index's list turned into in-page anchors. The unit of loading became the checklist
itself, so `staff validate` budgets it — and the remedy for an oversized one is a second
checklist, not more sections.

## 2026-10-31 — the same reviewer, twice, saying two different things

**What happened.** `frontend-reviewer.md` existed in two projects. Both started from the same
idea; within a few months they disagreed about what a component may receive as props. Neither
copy was wrong on its own terms, and nobody noticed, because nothing compared them.

**Why nothing caught it.** There was no single copy to compare against, and no mechanism that
would have made a second copy visible. The duplication was the normal way of working.

**What came out of it.** The rule that cross-domain material is reached **by skill name**, never
copied — and the one mechanism that is allowed to copy, `staff sync`, generates its copies and
the CI refuses a stale one. In `03-portability.md`.

## 2026-10-31 — a 600-line checklist loaded to review a button

**What happened.** A component checklist grew to around 600 lines and 9000 tokens. Every review
loaded all of it, including the sections about internationalisation and server rendering, to
look at a button with two props.

**Why nothing caught it.** Nothing measured the cost of a document before it was loaded.

**What came out of it.** The token budget in `staff validate` (refuse over ~5000, warn at 3500)
and the three levels of disclosure in `02-body.md`. The first answer — split the checklist by
section so a skill loads only what a diff touches — was withdrawn on 2026-11-08: the sections
were not reachable. A checklist is now budgeted whole, and an oversized one becomes two.
