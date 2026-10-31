# Working in this repository

This repository is a toolkit of agent skills, roles and checklists, installed into other
people's agents through three channels. Everything here is read by a machine before it is read
by a person, so the format is not cosmetic.

**Everything in this repository is written in English**, including comments, documentation and
commit messages.

## The three laws

1. **A rule outside the linter does not exist.** Anything a machine can check belongs in
   `staff validate`, a lint rule or a hook — not in prose. If you are about to write "remember
   to…", write a check instead.
2. **A skill whose quality is only asserted in prose has no quality.** Every skill in a `ready`
   domain has at least one eval case.
3. **Every criterion traces to an incident or a check.** Before adding a line to a checklist,
   add the incident to that domain's `field-notes.md`, or move the rule into the validator.

## Before you write

- Scaffold, do not copy: `staff new domain|skill|agent|checklist <name> [--domain <d>]`.
- Read `domains/ai-craft/skills/write-a-skill/SKILL.md` first. It is the authority on skill
  shape, and it applies to itself.
- One skill is one task with a trigger. One domain is one subject. A role is not a domain.

## Rules the validator enforces, so do not fight them

- **Frontmatter is spec-pure by default**: `name`, `description`, `license`, `compatibility`,
  `metadata`, `allowed-tools`. Any other key makes a claude.ai upload fail outright. Need a
  Claude Code key? Declare `compatibility: [claude-code]`.
- **A skill's name equals its directory name.** A domain's `name` equals its directory name, and
  the plugin install breaks when it does not.
- **Token budget**: a `SKILL.md` over ~5000 estimated tokens is refused. Detail goes in
  `references/`, loaded by a step that says when to read it.
- **Cross-domain reuse happens by skill name**, never by relative path: write "load the
  `craft:reviewer-contract` skill first". A plugin served from an install cache has no path to
  its neighbours.
- **A role's shape is its `tools:` list.** Edit or Write means builder, Bash without them means
  reviewer, neither means advisor. A builder must load `craft:builder-contract`; a reviewer must
  load `craft:reviewer-contract`.

## Generated files — never edit by hand

`staff manifest` owns `.claude-plugin/marketplace.json`, `skills.sh.json`, and both `plugin.json`
files in every domain. `staff sync` owns `skills/*/references/<checklist>/`. `staff readme` owns
the marked blocks in `README.md` and every `domains/*/README.md`. CI fails on a stale copy.

Edit the source: `domain.json`, the checklist at the domain level, the README outside the markers.

## One false friend

`domains/<d>/agents/` holds roles — Claude Code subagents.
`domains/<d>/skills/<s>/agents/openai.yaml` is per-skill Codex metadata. Same word, unrelated.

## Privacy and safety

This repository is public and its skills run on other people's machines with their files in
reach. No personal data, ever — the life domains ship **methods**, never data. No download piped
into a shell, no credential reads, no exfiltration. `staff doctor` refuses all of it; see
`SECURITY.md` and `docs/privacy.md`.

## Before you call it finished

```bash
pnpm ci    # tests, doctor, and --check on every generated artefact
```

Then run the skill you changed, once, for real. The validator catches the shape; only a real run
catches a procedure that reads well and cannot be followed.
