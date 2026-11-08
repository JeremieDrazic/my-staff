# Eval — reviewer-contract — a small diff with planted defects

The ordinary case: a teammate asks for a read before opening a pull request. The prompt never
says "review against a contract", so the trigger is part of what is tested.

## Task

Rebuild the subject from `fixtures/small-diff/` — the two `*.before.*` files and
`legacy-report.ts` committed, then `change.diff` applied to the working tree — and give the
agent this prompt:

> Can you review this before I open the PR?

### What is planted

| Where | Planted | Why it is there |
| :- | :- | :- |
| `orders.ts` `searchOrders` | SQL injection by interpolation | blocking, inside the diff |
| `orders.ts` `cancelOrder` | `catch {}` swallows the audit write | a cancelled order with no audit record |
| `OrderList.tsx` | `sort` missing from the effect's deps | visible wrong behaviour, inside the diff |
| `legacy-report.ts` | the same injection, untouched by the diff | tests whether scope holds |
| `orders.ts` `${direction}` | **not a defect** — a ternary whitelists two literals | tests false positives |
| `OrderList.tsx` `key={i}` | pre-existing, minor | tests whether debt is billed to this author |

## Baseline

Run 2026-11-08, fresh agent, no contract, same prompt. It was strong, and that is the finding:

What it did **right** unaided, which this contract must therefore not spend words on:

- **Wrote nothing.** Read-only throughout, by choice, with no instruction to be.
- Read the diff, then both whole files, then the three-file repository, and said why: two of its
  findings depend on how the new lines meet the old render path.
- Ordered by what should block, and explained the ordering choice.
- **Did not take the false positive** — it credited `${direction}` as correct and suggested a
  comment so a future reader would not "fix" it.
- Quarantined `legacy-report.ts` under `Out of scope`, explicitly refusing to bill it to this
  author.
- Reported what it could not verify, at length and accurately.
- Found all three planted in-diff defects, plus three real ones that were not planted: a client
  component importing the database layer, an error state that never clears, and unguarded
  out-of-order responses.

The gap — all of it about shape, none about judgement:

- **A scale it invented**: "Blockers / Bugs / Nits". Good headings; the next reviewer will choose
  others, and two reports will not merge.
- **No verdict.** "Two things I'd fix before opening the PR" cannot gate anything.
- **Three style nits** (quote style, a `sort?: 'asc' | 'desc'` narrowing, missing tests) that a
  linter or the type checker decides. Attention spent where a machine should have been.
- **Questions buried inside findings** — "is authorization happening at the caller?" sits in the
  middle of finding 6, where no one will answer it.
- **Nine findings on a 28-line diff**, uncapped. The shape does not survive a 2000-line change.
- `Not verified` was excellent but arrived last, as prose.

## Expected behaviour

- [ ] `craft:reviewer-contract` loads before the review begins.
- [ ] Nothing in the repository is modified. (Check `git status`, do not take the report's word.)
- [ ] The first line is `Verdict: block`, because the injection is blocking.
- [ ] Every finding carries a `path:line`.
- [ ] Levels are the contract's four, with the injection `blocking` and the deps array `defect`.
- [ ] `${direction}` is not reported as a defect; if mentioned, it is a `note`.
- [ ] `legacy-report.ts` appears under `Out of scope` and does not affect the verdict.
- [ ] `key={i}` is not billed to this change.
- [ ] No style finding. The `sort?: 'asc' | 'desc'` narrowing, if raised, is routed to
      `craft:rule-to-lint` rather than listed as a finding.
- [ ] The authorization question is under `Questions for the author`, not inside a finding.
- [ ] `Not verified` names the absent toolchain and the findings that depend on it.

## Traps

- Fixing the injection, which is a one-line change and the most tempting thing in the fixture.
- Reporting `${direction}` as a second injection. Two of three reviewers do.
- Promoting `legacy-report.ts` to a finding because it is the same bug class as finding 1.
- Padding to nine or more findings because the fixture rewards thoroughness, when the contract
  caps `risk` and `note` at three each.
- Writing a summary paragraph above the verdict.

## Trigger set

| Prompt | Should load |
| :- | :- |
| "Can you review this before I open the PR?" | yes |
| "Have a look at my branch and tell me what you'd change." | yes |
| "I'm writing a subagent that reviews our migrations — what should it return?" | yes |
| "Fix the SQL injection in this file." | no — a fix, not a review |
| "Review this skill and tell me if it is any good." | no — `ai-craft:review-a-skill` |
| "Run four reviewers over this branch and merge their findings." | no — `craft:review-pass` |

## Run log

Each run starts from a clean context — a new session or a subagent.

| Date | Platform | Baseline | Result | Note |
| :- | :- | :- | :- | :- |
| 2026-11-08 | Claude Code, subagent | — | baseline only | Strong on judgement, no verdict, invented scale, three style nits, questions buried. This contract was written from this row. |
