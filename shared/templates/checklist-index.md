# {{name}} — checklist

Two modes. **Create**: every item must pass before the work is called finished.
**Audit**: evaluate each item on something that already exists, report, then fix by priority.

Priorities: **P0** blocking (bug, broken accessibility, security hole, architecture violation) ·
**P1** expected on serious work · **P2** polish.

Every criterion here traces to an entry in `field-notes.md` or to a mechanical check. A rule
that a machine could enforce belongs in the linter, not in this file.

## Sections

- [01-first-section.md](01-first-section.md) — what it covers

## Report format

```md
## <subject> — `path/to/file`
Score: P0 ✗ 0 · P1 ✗ 0 · P2 ✗ 0

| Prio | Section | Problem | Proposed fix |
| :- | :- | :- | :- |

Deliberately skipped: <item> — <reason>
```
