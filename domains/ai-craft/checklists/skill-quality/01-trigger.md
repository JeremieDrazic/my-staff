# Trigger — can anything find this skill?

A skill nobody loads is worse than no skill: it costs the review that wrote it and returns
nothing. Everything in this section is about the one sentence an agent reads before deciding.

- [ ] **P0** The description names the **situation**, not the subject. A reader can finish the
      sentence "I should load this when…".
- [ ] **P0** It uses the words a person would actually type, not internal vocabulary.
- [ ] **P0** It does not start by naming itself ("This skill…"). Refused by `staff validate`.
- [ ] **P0** No first or second person — not "I can help you…", not "You can use this to…". The
      description is injected into the system prompt, where both read as the wrong speaker. A bare
      imperative is fine.
- [ ] **P1** It says what the skill is **not** for, naming the skill that owns the adjacent
      case — or, when nothing adjacent exists yet, the case itself and the real tool that owns
      it. An invented skill name is worse than none: a reader tries to load it.
- [ ] **P1** The surfaces the skill covers are listed as nouns, because each one is a retrieval hook.
- [ ] **P1** It names the work, never its steps. A description that summarises the procedure gets
      followed *instead of* the body, and the agent does the three-line version of a nine-step pass.
- [ ] **P1** The body has a `## When not to use this` section, and it names other skills.
- [ ] **P1** Three prompts that should load it and three near-misses that should not, recorded in
      an eval case. The near-misses share the skill's keywords — an obviously unrelated prompt
      tests nothing.
- [ ] **P2** Read aloud, the first clause alone would make someone open it.

## Anti-patterns

- A description that is a summary of the body.
- A description that only a person who already knows the skill exists would match.
- Two skills whose descriptions overlap, so neither is reliably chosen. Merge them or draw
  the line explicitly in both.
