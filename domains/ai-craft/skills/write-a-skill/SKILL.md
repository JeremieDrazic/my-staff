---
name: write-a-skill
description: Write a new agent skill, or rewrite one that never triggers. Use when the user wants to turn a repeated piece of work into something an agent can load on its own — a review pass, a build procedure, a study method — or when an existing skill is ignored, loads too much, or only works on one platform. Not for writing a role that gets delegated a task; that is write-an-agent.
metadata:
  checklists:
    - skill-quality
---

A skill is a procedure an agent can find on its own and follow once. It is finished when an
agent that has never seen it loads it at the right moment, follows it without asking what it
means, and produces the thing you wanted.

Two failures account for almost every bad skill. It never triggers, because the description
says what the skill *is* instead of when to use it. Or it triggers and costs too much, because
everything the author knew went on the front page instead of behind it.

## When not to use this

- Writing a role that gets handed a task — a reviewer, a builder, an advisor → `write-an-agent`.
- Auditing a skill that already exists, without rewriting it → `review-a-skill`.
- Making an existing skill work on another platform → `port-a-skill`.
- A set of criteria rather than a procedure → that is a checklist, not a skill. It lives at the
  domain level and a skill declares it.

## Procedure

**1. Write the trigger before anything else.** One sentence answering: what situation is
someone in when this should load? If you cannot name the situation, there is no skill here yet —
there is a note. The description is the only thing an agent sees before deciding, so it is the
whole retrieval mechanism, not a summary of the body. Read
[description-patterns.md](references/description-patterns.md) and write it from a pattern, not
from instinct.

**2. Say when not to use it.** Name the neighbouring skills that own the adjacent cases. This
section is what stops the skill from being loaded for work it does badly, and it is the first
thing reviewers find missing.

**3. Write the procedure, and only the procedure.** Numbered steps in the imperative, each one
checkable: a reader must be able to tell whether a step was done. The body answers *what to do*;
everything that answers *why* or *in which exotic case* goes into `references/`.

**4. Hold the budget.** The page an agent loads every time must stay small — the validator
refuses over ~5000 tokens and warns at 3500. Three levels, each loaded only if the one before
it was not enough:

| Level | What it holds | Cost |
| :- | :- | :- |
| `description` | when to use it | always read |
| `SKILL.md` | the procedure | read when the skill triggers |
| `references/*.md` | the detail, the edge cases, the tables | read only when a step says to |

If a step needs 300 words of nuance, the step is one line and the nuance is a reference.

**5. Keep the frontmatter spec-pure.** Only `name`, `description`, `license`, `compatibility`,
`metadata`, `allowed-tools` survive everywhere; anything else makes a claude.ai upload fail
outright. Use a Claude Code key only when the skill genuinely needs it, and then declare
`compatibility: [claude-code]`. Same for the body: command injection and plugin-root variables
do nothing outside Claude Code. The table is in
[frontmatter-matrix.md](references/frontmatter-matrix.md).

**6. Write one eval case before you call it done.** A real task, the behaviour you expect, and
the plausible wrong turn. A skill whose quality is only asserted in prose has no quality. Put it
in `evals/` — one file per case.

**7. Run `staff validate`, then run the skill for real once.** On Claude Code and on one other
platform if it claims to be portable. The validator catches the shape; only a real run catches
a procedure that reads well and cannot be followed.

## The checklist

[skill-quality](references/skill-quality/00-index.md) is the pass to run before calling a skill
finished — and the pass to run on this one. In audit mode it also works on somebody else's skill.

## What makes a skill fail

- **A description that describes.** "This skill helps with code review." Nothing retrieves that.
- **A body that teaches.** Background the agent already has, and conventions it will read in the
  repo anyway.
- **Instructions with no observable end.** "Ensure quality" cannot be done or checked.
- **A rule stated in prose that a script could enforce.** It belongs in the linter, the validator
  or a hook. A rule outside the linter does not exist: under pressure it is the first one dropped.
- **One skill for a whole subject.** `frontend` is a domain. `review-react-component` is a skill.
