# 0004 — No personal data in a public repository

**Status:** accepted · 2026-10-31

## Context

The catalogue deliberately spans code and life — study method, learning, decisions, training.
Those domains are only publishable if they contain method and never subject matter. Intent is
not enough: a single careless commit is permanent.

## Decision

The life domains ship methods, never data; the technical domains summarise an incident without
identifying the codebase or the people. `staff doctor` refuses the shapes a machine can see —
addresses, phone numbers, account numbers, credentials in URLs, absolute home paths — and reads
an optional denylist from `~/.config/staff/denylist.txt` for the names it must not contain.

## Consequences

- The denylist cannot live in the repository: committing the private terms would publish exactly
  what the check protects. It is per-machine, and `docs/privacy.md` says so plainly.
- Private material is not forbidden, it is relocated — a private vault, or a private companion
  repository installed through the same channels.
- Shape detection has false positives. A lockfile's `package@version` reads as an address, so
  lockfiles are excluded, and documentation of a pattern can be waived on its line.

## Alternatives rejected

- **A private repository.** It solves the leak and loses the point: the toolkit is also meant to
  be read.
- **Trusting review.** The only rule that holds is the one a machine enforces (see 0005).
