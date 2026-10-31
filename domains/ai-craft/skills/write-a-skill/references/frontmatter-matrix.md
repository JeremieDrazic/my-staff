# Frontmatter, per platform

A skill that stays inside the first group installs everywhere unchanged, with no build step.
That is the default, and departing from it is a decision to record in `compatibility`.

## The keys

| Key | claude.ai upload | Claude Code | Codex | Notes |
| :- | :- | :- | :- | :- |
| `name` | yes | yes | yes | kebab-case, equal to the directory name |
| `description` | yes | yes | yes | required everywhere; the retrieval mechanism |
| `license` | yes | yes | ignored | |
| `compatibility` | yes | yes | ignored | our own declaration of where the skill is platform-bound |
| `metadata` | yes | yes | ignored | our own fields: `checklists`, `inspired-by`, `status` |
| `allowed-tools` | yes | yes | ignored | constrain it: `Bash(git diff *)`, never bare `Bash` |
| `user-invocable`, `argument-hint`, `model`, `effort`, `hooks`, `paths`, `context`, `agent`, `background`, `arguments`, `when_to_use`, `shell`, `disable-model-invocation`, `disallowed-tools` | **refused** | yes | ignored | a claude.ai upload fails outright: `Unexpected key(s) in SKILL.md frontmatter` |

Codex requires `name` and `description` and ignores the rest. Per-skill Codex metadata goes in
`agents/openai.yaml` **inside the skill directory** — not to be confused with the domain's
`agents/` directory, which holds roles.

## Body features that are not portable

These work in Claude Code and silently do nothing on claude.ai, through the API, or in Codex:

- command injection in the body (a backtick command prefixed with `!`)
- `${CLAUDE_PLUGIN_ROOT}` and `${CLAUDE_PROJECT_DIR}`

Use them only in a skill that declares `compatibility: [claude-code]`. The validator refuses an
undeclared use, because the failure is otherwise invisible: the skill loads and quietly skips a step.

## What the build does

`staff build claude-ai` strips every key outside the first group and fails on an undeclared
body feature, so the zip it produces is accepted on upload. Nothing is stripped for the other
channels: they read the file as authored.

## Sources

Verified against the Claude Code skills reference and the Codex Agent Skills documentation.
`docs/platform-matrix.md` records which rows were tested on this machine and which are taken
from the documentation.
