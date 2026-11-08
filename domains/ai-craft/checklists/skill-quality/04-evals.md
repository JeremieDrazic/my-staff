# Evals — the case that proves it works

A skill whose quality is only asserted in prose has no quality. This is the same law as
"a rule outside the linter does not exist", applied to the skills themselves.

- [ ] **P0** At least one case in `evals/`. Required by `staff validate` for any skill in a
      domain marked `ready`.
- [ ] **P0** The case is a real task, with the prompt written verbatim as someone would send it.
- [ ] **P0** The case records a **baseline**: what a fresh agent did with this prompt and no
      skill, quoted. A case with no baseline cannot show the skill changed anything, and the
      skill it justifies was written against a guess at the gap.
- [ ] **P1** Each run starts from a clean context — a new session or a subagent. A second run in
      the same conversation measures the conversation.
- [ ] **P1** Three cases before the skill is shared, one of them a trigger case (see below).
- [ ] **P1** It lists expected behaviours as observable facts: the file that must be read, the
      question that must be asked instead of guessing, the output that must appear.
- [ ] **P1** It names the plausible wrong turn. If an agent takes it, the skill's wording is at
      fault — not the agent.
- [ ] **P1** The run log records the date, the platform, the baseline and the result. A case that
      has never been run is a hypothesis.
- [ ] **P2** One case exercises the trigger itself: the prompt does not name the skill, and the
      skill should still load.

## Anti-patterns

- A case so narrow it only passes because the skill was written from it.
- A case that asserts an opinion rather than a behaviour.
- A pass with nothing to compare it to. Without the baseline, "the agent did the right thing"
  may mean the skill worked, or that the task was never hard.
