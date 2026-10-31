# Evals — the case that proves it works

A skill whose quality is only asserted in prose has no quality. This is the same law as
"a rule outside the linter does not exist", applied to the skills themselves.

- [ ] **P0** At least one case in `evals/`. Required by `staff validate` for any skill in a
      domain marked `ready`.
- [ ] **P0** The case is a real task, with the prompt written verbatim as someone would send it.
- [ ] **P1** It lists expected behaviours as observable facts: the file that must be read, the
      question that must be asked instead of guessing, the output that must appear.
- [ ] **P1** It names the plausible wrong turn. If an agent takes it, the skill's wording is at
      fault — not the agent.
- [ ] **P1** The run log records the date, the platform and the result. A case that has never
      been run is a hypothesis.
- [ ] **P2** One case exercises the trigger itself: the prompt does not name the skill, and the
      skill should still load.

## Anti-patterns

- A case so narrow it only passes because the skill was written from it.
- A case that asserts an opinion rather than a behaviour.
