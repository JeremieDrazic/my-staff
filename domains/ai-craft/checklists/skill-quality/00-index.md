# skill-quality — checklist

Two modes. **Create**: every item passes before the skill is called finished.
**Audit**: evaluate an existing skill, report, then fix by priority.

Priorities: **P0** the skill will not work or will not be found · **P1** expected on anything
published · **P2** polish.

Every criterion traces to an entry in `field-notes.md` or to a check in `staff validate`. Where
the validator already refuses something, this file says so instead of repeating the rule — a
rule a machine enforces does not need a human reader.

## Sections

- [01-trigger.md](01-trigger.md) — the description, and whether anything can find the skill
- [02-body.md](02-body.md) — the procedure, the budget, what belongs in a reference
- [03-portability.md](03-portability.md) — frontmatter and body features, per platform
- [04-evals.md](04-evals.md) — the case that proves it works
- [05-safety.md](05-safety.md) — what a skill installed by someone else must never do

## Report format

```md
## <skill-name> — `domains/<d>/skills/<name>/SKILL.md`
Score: P0 ✗ 0 · P1 ✗ 0 · P2 ✗ 0

| Prio | Section | Problem | Proposed fix |
| :- | :- | :- | :- |

Deliberately skipped: <item> — <reason>
```
