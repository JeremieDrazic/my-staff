# 0005 — A rule outside the linter does not exist

**Status:** accepted · 2026-10-31

## Context

The rule comes from a component checklist written for another project. Its last section argued
that an agent under task pressure violates first the rules that are written nowhere executable —
and that the checklist's own authority depended on moving everything mechanically checkable into
the linter. Five hand-written lists in that project had already drifted.

## Decision

Make it the first law of this repository. Anything a machine can check lives in `staff validate`,
a lint rule or a hook. Prose covers only what no script can see. When a review finding turns out
to be mechanically detectable, the fix is a check, not a sentence.

## Consequences

- The validator carries the rules that would otherwise be advice: token budget, name agreement,
  frontmatter portability, dead links, a checklist section nothing links to, an eval case missing
  from a skill in a `ready` domain.
- Checklist sections point at the validator instead of repeating it. A rule enforced by a machine
  does not need a human reader.
- `field-notes.md` exists for the same reason in reverse: a criterion with no incident and no
  check behind it is speculation, and gets ignored.
- The repository pays for this in tooling. That is the cost, and it is the reason the tooling is
  tested.

## Alternatives rejected

- **A thorough CONTRIBUTING file.** Tried everywhere, by everyone. It describes the rules that
  are about to be broken.
