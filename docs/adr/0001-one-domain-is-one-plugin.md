# 0001 — One domain is one plugin

**Status:** accepted · 2026-10-31

## Context

The same material has to reach Claude Code, claude.ai, Codex, ChatGPT and whatever comes next.
Each has its own layout: Claude Code reads `.claude-plugin/plugin.json` with components beside
it, the portable OpenAI format reads a root `plugin.json` with a `skills/` directory, and the
`skills` CLI reads nested directories plus either manifest. The obvious move is to author in a
neutral shape and generate one tree per platform.

## Decision

Author directly in the shape all of them already accept. A domain directory holds
`skills/`, `agents/`, `checklists/`, `field-notes.md`, both plugin manifests, and its
`domain.json`. The directory *is* the plugin, for both vendors at once.

## Consequences

- Three of the four channels need no build step: they read the authored files.
- `domain.json` is the only hand-written manifest. `staff manifest` generates the rest and CI
  refuses a stale copy, so the two vendor manifests cannot disagree.
- A domain is therefore the unit of installation, which forces domains to be coherent subjects
  rather than convenient folders.
- The repository carries two `plugin.json` files per domain. They have different paths and each
  runtime ignores what it does not know; `claude plugin validate` passes on the result.

## Alternatives rejected

- **Neutral source plus generated per-platform trees.** Every install path would then read
  generated output, so a generation bug would be invisible until an install failed.
- **One plugin for the whole repository.** Installing the theology domain to get a frontend
  reviewer is not a toolkit, it is a bundle.
