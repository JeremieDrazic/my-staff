# Field notes — craft

Every criterion in this domain's checklists traces back to one of two things: a real
incident, or a check a machine can run. Anything else is speculation, and a checklist
of speculations gets ignored.

This file is the record. Newest first.

## 2026-11-08 — (incident title)

**What happened.** The facts, in two or three sentences. What was expected, what shipped.

**Why nothing caught it.** The check that did not exist, or the rule that lived only in prose.

**What came out of it.** The criterion added, and where it now lives — a checklist section,
a lint rule, a hook, or a clause in a contract. A note that produced no rule is a note that
has not finished.

## 2026-11-08 — the reviewer was good, and its report was still unusable

**What happened.** A fresh agent was given a 28-line diff with three planted defects, one
pre-existing defect outside the diff, and one safe pattern that looks unsafe. It found all three,
refused the false positive and credited it as correct, quarantined the pre-existing one, wrote
nothing to disk, and reported what it could not verify. It also found three real defects nobody
had planted.

Then it headed its sections "Blockers / Bugs / Nits", gave no verdict, spent three findings on
things the type checker decides, and buried an authorization question in the middle of finding 6.

**Why nothing caught it.** Nothing had ever asked two reviews about the same change to be merged.
A single report that reads well hides the problem completely: the shape only fails when something
has to consume it.

**What came out of it.** `craft:reviewer-contract` — but a much shorter one than planned. The
clauses about reading widely, ordering by severity and staying in scope were dropped: a capable
agent does all three unaided, and the baseline proved it. What stayed is only what varies between
two equally good reviews — the four-level scale, the verdict as the first line, the caps, and
questions and unverified claims as named sections. Plus the rule that there is no style level,
because every style finding in the baseline was a missing lint rule.
