# 0003 — Canonical checklists, generated copies

**Status:** accepted · 2026-10-31

## Context

A checklist is a document: it is read by people, argued about in a pull request, and shared by
several skills in a domain. It also has to be *inside* each skill that uses it, because a
claude.ai zip and a `skills` CLI install carry only the skill's own folder. Both are true at the
same time.

A sibling constraint settles the easy answer: a skill cannot reach a checklist by relative path,
because a plugin served from an install cache has no path to its neighbours.

## Decision

The checklist lives once at `domains/<d>/checklists/<name>/`, split into sections. A skill
declares it in `metadata.checklists`. `staff sync` materialises a copy into the skill's
`references/<name>/`, each file prefixed with a header naming its source. `staff sync --check`
fails CI on a stale or orphaned copy.

## Consequences

- One place to edit, one place to review, and a copy that cannot silently drift.
- Generated files are committed, which is normally a smell. It is accepted here because the
  install channels read the repository directly, and it is made safe by the `--check`.
- Splitting by section is now load-bearing, not cosmetic: a skill can load the three sections a
  diff touches instead of all nineteen.

## Alternatives rejected

- **The checklist is a skill.** Zero duplication, and the obvious answer — but it stops being a
  document and becomes an agent call, which is not reviewable as a document.
- **A symlink farm.** Git carries symlinks; zip archives and file copies do not.
