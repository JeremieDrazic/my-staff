# Field notes — ai-craft

Every criterion in this domain's checklists traces back to one of two things: a real incident,
or a check a machine can run. Anything else is speculation, and a checklist of speculations gets
ignored.

Newest first.

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

**What came out of it.** The token budget in `staff validate` (refuse over ~5000, warn at 3500),
the three levels of disclosure in `02-body.md`, and the rule that a checklist is split by section
so a skill can load only the sections a diff touches.
