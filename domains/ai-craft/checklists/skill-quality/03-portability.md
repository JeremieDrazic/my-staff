# Portability — will it survive the other platforms?

Default is spec-pure. Departing from it is allowed, declared, and paid for by a build step.

- [ ] **P0** Frontmatter uses only `name`, `description`, `license`, `compatibility`,
      `metadata`, `allowed-tools` — unless `compatibility` declares otherwise. Any other key
      makes a claude.ai upload fail outright.
- [ ] **P0** The body uses no Claude Code-only feature (command injection, plugin-root
      variables) without declaring `compatibility: [claude-code]`. The failure is otherwise
      invisible: the skill loads and quietly skips a step.
- [ ] **P0** `name` equals the directory name. Both are kebab-case.
- [ ] **P1** `allowed-tools`, if present, is constrained — `Bash(git diff *)`, not bare `Bash`.
- [ ] **P1** Paths referenced in the body are relative to the skill directory, so they survive
      being copied into another agent's skills folder.
- [ ] **P1** No cross-domain reference by relative path. Another domain's material is reached by
      skill name — "load the `craft:reviewer-contract` skill" — because a plugin served from an
      install cache has no path to its neighbours.
- [ ] **P2** If the skill is genuinely platform-bound, the README of its domain says so.

## Anti-patterns

- `user-invocable: true` added by reflex. It costs portability and, in Claude Code, a skill is
  already invocable.
- A reference loaded with an absolute path.
