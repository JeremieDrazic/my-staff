---
name: reviewer-contract
description: The obligations every reviewer owes — a fixed report shape, a shared severity scale, a verdict, and a scope that cannot widen. Use before reviewing a change, a diff, a pull request or a document, and when writing or auditing a reviewer role. Not for carrying out the review's own domain pass, which belongs to that domain's skill; not for routing several reviewers over one diff, which is craft:review-pass.
metadata:
  checklists:
    - review-report
---

A reviewer produces a report someone else acts on. One good report is not the goal: the goal is
reports that can be compared across runs, aggregated across reviewers, and acted on without
being re-read. That takes a fixed shape, a scale both reviewers mean the same thing by, and a
verdict.

A capable agent already reads the whole file around the diff, orders its findings by severity,
quarantines what is out of scope, and says what it could not verify. This contract does not ask
for those. It fixes the parts that vary between two equally good reviews, because variance is
what makes a review impossible to build on.

## What you are is your tool list

A reviewer has `Read`, `Grep`, `Glob` and `Bash`, and no `Edit` or `Write`. That is the contract,
not a promise in prose: a reviewer that can edit produces a report nobody can check against the
code, because the code moved. If you believe a finding needs fixing now, say so in the report and
stop. Someone else owns the fix.

Suggesting one is welcome. A suggestion is the smallest change that resolves the finding — a line,
or a short snippet. Past that you are designing, and a design belongs in a question.

## Scope

The change is what you review: the diff, plus as much of the surrounding code as you need to
judge it. Read widely, report narrowly.

Anything true before the change goes under `Out of scope`, never into the findings and never into
the verdict. A review that bills pre-existing debt to today's author gets dismissed whole, and
takes its real findings with it.

## The severity scale

Four levels, and they mean this:

| Level | What it means |
| :- | :- |
| **blocking** | shipping it causes harm that is hard to undo — data loss, an exposed credential, a security hole, a broken contract something else relies on |
| **defect** | it will behave wrongly, visibly and recoverably |
| **risk** | correct today, and fragile under a condition you can name |
| **note** | correct, and a future reader is likely to break it — say why it is right |

**There is no style level.** Anything a linter, a formatter or the type checker can decide is not
a finding: it is a missing rule, and it goes to `craft:rule-to-lint`. A rule outside the linter
does not exist, and a reviewer who spends attention on what a machine should have caught trains
the author to skim the whole report.

The `note` level is the one reviewers drop and should not. The pattern that looks wrong and is
right gets "fixed" into a bug six months later by someone who did not know why it was like that.

## The report

```md
Verdict: block | approve with comments | clean

## Findings
| # | Level | Where | What | Suggested fix |
| :- | :- | :- | :- | :- |
| 1 | blocking | src/orders.ts:21 | … | … |

## Questions for the author
- What you could not decide without them, and what you assumed meanwhile.

## Not verified
- What you could not run, and why. Name the finding that depends on it.

## Out of scope
- Findings outside this change. Not counted in the verdict.
```

Rules the shape carries:

- **The verdict is the first line**, and it is one of those three words. `block` if any finding is
  blocking; `approve with comments` if there is anything else; `clean` if there is nothing.
- **Every finding has a `path:line`.** A finding without one cannot be checked, and will not be.
- **Report every `blocking` and `defect`. Cap `risk` and `note` at three each**, highest first.
  Over the cap, the surplus is one line saying how many were dropped.
- **If `blocking` plus `defect` passes ten, stop reviewing and say so.** A change that fails in
  ten places needs splitting, not annotating, and a review that long will not be read.
- **`Not verified` is never empty** unless you really did run everything the findings depend on.
  Say which tool you could not run; "I read it" and "I ran it" are different claims.
- **Questions are a section, not asides.** A question buried in a finding gets answered by nobody.

## What makes a review fail

- **A scale the reviewer invented.** "Blockers / bugs / nits" reads well and aggregates with
  nothing, because the next reviewer draws the lines elsewhere.
- **No verdict**, so nothing can gate on it and a human has to read all of it to learn whether to
  merge.
- **A finding with no location.** It will be skipped, and the reviewer will be surprised.
- **Padding.** Volume lowers the price of every finding in the report, including the real one.
- **Fixing instead of reporting**, which leaves a report describing code that no longer exists.
