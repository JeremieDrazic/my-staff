# Contributing

The short version: scaffold it, write the trigger first, add an eval case, run `pnpm ci`.

## Setup

```bash
pnpm install
pnpm staff list        # what is already here — check before adding
```

## Adding a skill

```bash
pnpm staff new skill review-a-dockerfile --domain delivery
```

Then read `domains/ai-craft/skills/write-a-skill/SKILL.md` and follow it. It is the authority,
and it applies to itself. The checklist it carries, `skill-quality`, is the pass to run before
opening the pull request.

Order matters in one place: if the skill declares a checklist in `metadata.checklists`, create
the checklist at the domain level **first**, then run `pnpm staff sync`. The validator refuses a
declaration pointing at a checklist that does not exist.

## Adding a role

```bash
pnpm staff new agent api-reviewer --domain backend --shape reviewer
```

The shape decides the template, and the `tools:` list decides the shape. A reviewer that is
handed `Edit` is not a reviewer, and the validator says so.

## Promoting a domain to `ready`

Three valid skills, each with at least one eval case, and a `field-notes.md` that explains where
its checklist criteria came from. Then set `status` in `domain.json` and run `pnpm staff readme`.

## Before the pull request

```bash
pnpm ci
```

That runs the tests, `staff doctor`, and `--check` on every generated artefact. Then run the
skill you touched once, for real, on Claude Code and on one other platform if it claims to be
portable. Say in the pull request which platforms you ran it on — `docs/platform-matrix.md`
distinguishes what is verified from what is merely documented, and that distinction only holds
if people are honest in pull requests.

## What gets a pull request refused

- A generated file edited by hand. See the list in `AGENTS.md`.
- A new rule in a checklist with no matching entry in `field-notes.md` and no mechanical check.
- A skill with no eval case in a `ready` domain.
- Anything in French, outside this sentence.
