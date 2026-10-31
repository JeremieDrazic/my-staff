# 0006 — Delegate to external tools, never vendor them

**Status:** accepted · 2026-10-31

## Context

Some of the work is already done better elsewhere. `impeccable` ships 62 code checks for
AI-slop visual patterns, hooks, and a live element picker; `mattpocock/skills` ships a
per-repository setup flow and a codebase-improvement pass. Copying either into this repository
would be quick, would look impressive, and would be wrong: one has no stated licence, and both
would then be frozen at the version that was copied.

## Decision

A domain declares an external dependency in `domain.json` under `requires`, with its install
command and an explicit list of what it **owns**. The domain then covers only what the external
tool does not. `staff doctor` reports a declared dependency that is not installed and prints the
command. `docs/credits.md` records the licence and what was learned.

## Consequences

- `design` is deliberately smaller: the visual pass belongs to `impeccable`, and the domain keeps
  the brief, the critique rubric and the handoff.
- A dependency can be missing without breaking anything, because the dependency is declared and
  reported rather than assumed.
- The repository stays honest about what is its own work, which matters more here than looking
  comprehensive.

## Alternatives rejected

- **Vendor and attribute.** Attribution does not grant a licence, and a vendored copy stops
  receiving fixes.
- **Reimplement.** Sixty-two checks already exist and are maintained.
