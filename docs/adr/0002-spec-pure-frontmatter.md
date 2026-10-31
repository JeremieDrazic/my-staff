# 0002 — Spec-pure frontmatter by default

**Status:** accepted · 2026-10-31

## Context

A claude.ai upload follows the Agent Skills spec and accepts exactly six frontmatter keys:
`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. Any other key
fails the packaging outright with `Unexpected key(s) in SKILL.md frontmatter`. Claude Code
accepts roughly fifteen more, several of them genuinely useful. Codex requires two and ignores
the rest.

## Decision

Author inside the six keys by default. A Claude Code key is allowed only in a skill that
declares `compatibility: [claude-code]`, and the same rule covers body features that silently
do nothing elsewhere — command injection and the plugin path variables. `staff validate`
refuses an undeclared use; `staff build claude-ai` strips what it can and refuses what it cannot.

## Consequences

- A skill is portable unless someone decided otherwise, and the decision is in the file.
- The failure mode that was actually dangerous — a skill that uploads cleanly and then skips a
  step, with no error anywhere — is now a build failure instead.
- `user-invocable: true` is left out everywhere: in Claude Code a skill is already invocable, so
  the key costs portability for nothing.

## Alternatives rejected

- **Authoring with the full Claude Code set and stripping on the way out.** Stripping a key is
  easy; stripping a body that depends on it is not, and the result would be a quietly broken
  skill on the platform used from a phone.
