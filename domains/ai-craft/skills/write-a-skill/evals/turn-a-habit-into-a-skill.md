# Eval — write-a-skill — turning a habit into a skill

The ordinary case: a person describes something they do by hand every week and wants it to
become a skill. The prompt deliberately never says the word "skill" first, so the trigger is
part of what is being tested.

## Task

> Every time I open a pull request I check the same things on the Dockerfile — pinned base
> image, no secrets in build args, non-root user, layer order. I'd like the agent to do that
> pass itself. Can you set that up?

## Baseline

Run 2026-11-08, fresh agent, no skill, outside this repository. It confirmed it had no authoring
guidance of any kind: *"Effectively none on authoring mechanics."*

What it got **right** unaided, and which therefore proves nothing about this skill:

- A description that names the situation, not the subject: *"Use when reviewing a pull request or
  diff that touches a Dockerfile…"*.
- Frontmatter with `name` and `description` only — spec-pure, though only because those are the
  two keys it knew.
- Progressive disclosure, unprompted: the long fix snippets went into
  `references/patterns.md`, with the instruction *"Read it when writing a fix, not before."*
- All four of the requested checks, in a scoped review pass rather than one skill for Docker.

What it got **wrong** — the measured gap, and the only thing this skill has to close:

- **The criteria stayed in the body**, 134 lines of them, where no other skill can reuse them.
- **No eval, and it said so**: *"it has no eval or test fixture, so there's nothing proving it
  catches what it claims."*
- **It never asked where the skill should live.** It wrote to `.claude/skills/` and filed the
  question under what it had decided for itself.

A second baseline, taken during the same exercise on the *produced* skill rather than on the
authoring task, found the same shape of failure one level down: the agent found all four checks
but ranked the two the user cared about 9th and 10th of twelve, missed one of two credentials,
and wrote "also confirm a `.dockerignore` exists" instead of looking. The gap in a recurring
review is never coverage; it is priority, enumeration and a stable report shape.

## Expected behaviour

- [ ] `write-a-skill` loads without being named.
- [ ] A baseline is run, or its absence is stated — not silently skipped.
- [ ] The description is drafted **before** the body, and it names the situation ("use when a
      branch changes a Dockerfile"), not the subject ("for Docker").
- [ ] It asks which domain the skill belongs to, or proposes one with a reason, rather than
      dropping the skill at the repository root.
- [ ] The four checks become a domain checklist, not four paragraphs inside the body, because
      they are criteria rather than a procedure.
- [ ] Frontmatter stays spec-pure: `name`, `description`, and `metadata.checklists`.
- [ ] Every criterion is satisfiable on a file that fails the check, not only on one that passes.
- [ ] It ends by running `staff validate`.

## Traps

- Writing one `docker` skill that covers the whole subject instead of one pass with a trigger.
- Putting the four criteria in the body, where no other skill can reuse them.
- Adding `user-invocable: true` by reflex, which costs the claude.ai upload for nothing.
- Declaring the checklist in `metadata.checklists` without creating it, which `staff validate`
  refuses — the correct order is checklist first, then `staff sync`.
- Teaching what the baseline already knew: why a build arg leaks, how to reorder layers. Those
  words are the ones the measured gap says to spend elsewhere.

## Trigger set

Three prompts that must load the skill without naming it, three near-misses that must not. The
near-misses share its keywords; an unrelated prompt tests nothing. Not yet run — a real
retrieval test needs the skill installed, not pasted.

| Prompt | Should load |
| :- | :- |
| "Every time I open a PR I check the same four things on the Dockerfile. Can the agent do that pass itself?" | yes |
| "Our frontend reviewer keeps getting ignored — it never seems to fire when it should." | yes |
| "I want this review procedure to work in Codex too, not just here." | yes |
| "Review this Dockerfile for me." | no — one review, not a reusable pass |
| "Write me a subagent that refactors a component and reports what it changed." | no — `write-an-agent` |
| "Have a look at this skill someone sent me and tell me if it is any good." | no — `review-a-skill` |

## Run log

Each run starts from a clean context — a new session or a subagent.

| Date | Platform | Baseline | Result | Note |
| :- | :- | :- | :- | :- |
| 2026-11-08 | Claude Code, subagent, skill pasted in full | the three failures above | pass | Found five gaps in this skill: no `allowed-tools` guidance, no rule for resolving a `scripts/` path, no `scripts/` row in the budget table, no escape when no neighbouring skill exists, no rule for grouping references. All five fixed. Also surfaced the collision between "name the work, never its steps" and "list the surfaces as nouns", now resolved in favour of the nouns. |
