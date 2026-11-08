# Eval — {{name}} — (case name)

A real task, not a toy. If this case passes on a platform, the skill works there.

## Task

The prompt to give the agent, verbatim.

## Baseline

What a fresh agent did with this prompt and **no skill installed**, quoted rather than
summarised. This is what the skill exists to fix; without it, the expected behaviours below
are a guess at the gap and a pass proves nothing.

## Expected behaviour

- [ ] The observable thing that must happen.
- [ ] The file it must read before writing.
- [ ] The question it must ask instead of guessing, if the task is deliberately ambiguous.

## Traps

- The plausible wrong turn. If the agent takes it, the skill's wording is at fault, not the agent.

## Trigger set

Three prompts that must load the skill without naming it, and three near-misses that must not.
The near-misses share the skill's keywords; an unrelated prompt tests nothing.

| Prompt | Should load |
| :- | :- |
|  | yes |
|  | no |

## Run log

Each run starts from a clean context — a new session or a subagent.

| Date | Platform | Baseline | Result | Note |
| :- | :- | :- | :- | :- |
