# 0007 — Three agent shapes, enforced by the tools list

**Status:** accepted · 2026-10-31

## Context

The first catalogue draft had only reviewers and checkers: it could judge work nobody had done.
Delegating construction needs a different role, and construction is itself not one discipline —
creating something new, changing something that exists, and removing something are three risk
profiles, the last one inverted.

A role's discipline was also written as prose at the top of its file, which is a promise rather
than a constraint.

## Decision

Three shapes, and the shape is read from `tools:`, never from the prose. `Edit` or `Write` means
**builder**; `Bash` without them means **reviewer**; neither means **advisor**. `staff validate`
derives the shape and refuses a role that does not load the matching contract.

The builder contract carries the clause that matters most — if the brief is insufficient, the
builder stops and returns its questions instead of guessing — and three modes: `create`,
`change`, `remove`, each adding its own clauses. It ends with a `## Learned` section: the one or
two things in the change worth understanding, and the trade-off that was settled.

## Consequences

- "A reviewer never edits" is a fact about its tool grant, not a sentence it might ignore.
- A builder needs two formats, not one: a report going out and a brief coming in. Both live in
  `craft`, and a skill writes the brief.
- The `Learned` section serves two purposes for the price of one. It teaches the reader, and it
  forces the agent to name its trade-offs — which makes them reviewable. A report with no
  trade-off in it either decided nothing or is hiding what it decided.
- Every mature domain is expected to have all three: someone who builds, someone who judges,
  someone who advises.

## Alternatives rejected

- **Builder as two shapes, create and change.** The tools are identical and most clauses are
  shared; the mode belongs in the brief.
- **A `shape:` field in the frontmatter.** A second source of truth that can disagree with the
  tool grant, which is the thing that actually constrains the agent.
