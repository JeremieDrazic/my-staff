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

Then ask where it belongs — which domain, and whether it is for this project or every project.
Both are the author's call, not yours, and a skill written to the wrong scope gets rewritten
rather than moved. Propose a domain with a reason if the answer is obvious; ask if it is not.

**2. Run the task once with no skill, and write the eval from what went wrong.** Give the real
prompt to a fresh agent, record verbatim what it got wrong, and save that as the baseline in
`evals/<case>.md`. Then write only what closes that gap. This is the step most authors skip,
and skipping it is why skills end up full of advice the agent did not need: without a baseline
you are guessing at the gap, and you cannot show afterwards that the skill changed anything.

**3. Say when not to use it.** Name the neighbouring skills that own the adjacent cases. This
section is what stops the skill from being loaded for work it does badly, and it is the first
thing reviewers find missing. When nothing adjacent exists yet, name the adjacent *case* and the
real tool that owns it — never invent a plausible skill name, because a reader will try to load
it and find nothing.

**4. Write the procedure, and only the procedure.** Numbered steps in the imperative, each one
ending on a criterion that is checkable *and* demanding: "every file in the diff accounted for"
is a criterion, "review the diff" is a topic. Check each one against the *failing* case too: a
criterion can be perfectly verifiable and still impossible to meet — "cite the line number of
the `USER` instruction" cannot be satisfied by the file that has none. The body answers *what to
do*; everything that answers *why* or *in which exotic case* goes into `references/`.

Two things decide how a step should be written:

- **Match the form to how much freedom the step can take.** Many valid paths → prose. One
  preferred pattern → a parameterised command. Fragile, or it must come out identical every
  time → the exact command, verbatim. If the baseline run wrote a throwaway helper the next run
  would write again, write it once into `scripts/`, say whether to **run** it or **read** it, and
  give the path as relative to this skill's own directory — the agent has to locate that
  directory itself, so the step says so in words rather than assuming a working directory.
- **Say what to do, not what to avoid.** A prohibition puts the behaviour you do not want into
  the agent's context and makes it more available, not less. Keep prohibitions for the case
  where the agent knows the rule and breaks it anyway under pressure; everywhere else a positive
  instruction wins.

**5. Hold the budget, and order the page.** The page an agent loads every time must stay small —
the validator refuses over ~5000 tokens and warns at 3500. Three levels, each loaded only if the
one before it was not enough:

| Level | What it holds | Cost |
| :- | :- | :- |
| `description` | when to use it | always read |
| `SKILL.md` | the procedure | read when the skill triggers |
| `references/*.md` | the detail, the edge cases, the tables | read only when a step says to |
| `scripts/*` | work no agent should redo by hand | runs, never read into context |

If a step needs 300 words of nuance, the step is one line and the nuance is a reference. Group
references by mechanism, not by step: two steps that turn on the same mechanism share one file,
which is also what keeps a reference from being an orphan nothing links to. Order matters as much
as size: after a context compaction only the top of an invoked skill comes back, so whatever must
survive goes first.

**Keep references one level deep.** A file reached from another referenced file is read
partially, not whole — so a reference that is only an index to other references delivers nothing.
Each `references/*.md` is linked from the body and complete on its own.

**6. Keep the frontmatter spec-pure.** Only `name`, `description`, `license`, `compatibility`,
`metadata`, `allowed-tools` survive everywhere; anything else makes a claude.ai upload fail
outright. Use a Claude Code key only when the skill genuinely needs it, and then declare
`compatibility`. Same for the body: command injection and plugin-root variables do nothing
outside Claude Code. The table is in
[frontmatter-matrix.md](references/frontmatter-matrix.md).

Leave `allowed-tools` out unless the skill has to run unattended. A grant wide enough to run the
skill's own script is unconstrained in all but name, and one drawn too tight blocks a step
silently — the step is skipped, not reported. Read-only intent stated in the body costs nothing
and breaks nothing.

A complete minimal skill, for shape:

```md
---
name: check-migration-safety
description: Audit a database migration for the changes that take a lock or lose data. Use when a
  pull request adds or edits a migration file, before it is approved. Not for writing one — that
  is write-a-migration.
---

Migrations fail in production in two ways: they hold a lock long enough to time out requests, or
they drop something nothing told you was still read.

## Procedure

1. List every statement that rewrites a table or takes an exclusive lock.
2. For each, state the row count it runs against and the lock it takes, from the schema — not
   from the migration's own comments.
```

**7. Run `staff validate`, then run the skill for real.** Each run starts from a clean context —
a fresh session or a subagent — or you are measuring your own conversation, not the skill. Run
the eval case from step 2 and record the result next to the baseline. The validator catches the
shape; only a real run catches a procedure that reads well and cannot be followed.

## The checklist

[skill-quality](references/skill-quality.md) is the pass to run before calling a skill
finished — and the pass to run on this one. In audit mode it also works on somebody else's skill.

## What makes a skill fail

- **A description that describes.** "This skill helps with code review." Nothing retrieves that.
- **A body that teaches.** Background the agent already has, and conventions it will read in the
  repo anyway.
- **Instructions with no observable end.** "Ensure quality" cannot be done or checked.
- **A rule stated in prose that a script could enforce.** It belongs in the linter, the validator
  or a hook. A rule outside the linter does not exist: under pressure it is the first one dropped.
- **One skill for a whole subject.** `frontend` is a domain. `review-react-component` is a skill.
