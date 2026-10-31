# Credits

What was learned from whom, and under which licence. The rule here is: **take the idea, cite the
source, never copy licensed content.**

## Tools this repository delegates to

| Project | Licence | What it owns, so no domain here duplicates it |
| :- | :- | :- |
| [impeccable](https://impeccable.style/) ([pbakaus/impeccable](https://github.com/pbakaus/impeccable)) | not stated on the site; third-party product | The visual pass itself: 62 code checks for AI-slop patterns with no model or API key, hooks, Live Mode, and the `PRODUCT.md` / `DESIGN.md` context files. The `design` domain declares it in `requires` and covers only what it does not: the brief, the critique rubric, the handoff. **Nothing of it is reproduced here.** |
| [mattpocock/skills](https://github.com/mattpocock/skills) | MIT | Prior art for a per-repository setup skill that asks where docs and issues live, and for a codebase-improvement skill that reads existing decision records. Adapted with attribution, not copied. |
| [vercel-labs/skills](https://github.com/vercel-labs/skills) | the `skills` CLI | The install channel for roughly seventy agents, including the nested discovery rules and the `skills.sh.json` manifest this repository publishes. Writing an installer here would have duplicated it. |
| [anthropics/skills](https://github.com/anthropics/skills) | Apache-2.0 | The Agent Skills format itself, the packaging path to claude.ai, and the convention of progressive disclosure through a references directory. |

## Ideas taken from elsewhere in the author's own work

- The **one-copy contract** that every reviewer loads first, rather than a paragraph repeated in
  each role file. It came from watching the repeated version drift.
- **Open the component before you open the diff** — a reviewer that reads only the hunks reports
  the shell and misses the thing that was actually changed.
- **Documenting the real failure that produced a rule**, which is now the `field-notes.md`
  requirement and the third law in the README.
- **"A rule outside the linter does not exist"**, from a component checklist whose last section
  argued that anything mechanically checkable belongs in the tooling. It is the first law here.

## How to add to this file

When a skill is shaped by an outside source, add a row and name the licence. When a rule comes
from an incident, it goes in the domain's `field-notes.md` instead — this file is for other
people's work.
