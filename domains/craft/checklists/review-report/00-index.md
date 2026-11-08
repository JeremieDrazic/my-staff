# review-report — checklist

Two modes. **Create**: run it over a report before sending it. **Audit**: evaluate a report
someone else wrote — including one an agent wrote — and say what to change.

Priorities: **P0** the report cannot be acted on · **P1** expected on anything a human will
read · **P2** polish.

Every criterion traces to an entry in `field-notes.md`. Where a check is mechanical, it says so
instead of repeating the rule.

## Sections

- [01-shape.md](01-shape.md) — the verdict, the sections, and what makes a report aggregable
- [02-findings.md](02-findings.md) — what a single finding must carry to be actionable
- [03-scope.md](03-scope.md) — the boundary of the change, and where everything else goes

## Report format

```md
## <report under audit>
Score: P0 ✗ 0 · P1 ✗ 0 · P2 ✗ 0

| Prio | Section | Problem | Proposed fix |
| :- | :- | :- | :- |

Deliberately skipped: <item> — <reason>
```
