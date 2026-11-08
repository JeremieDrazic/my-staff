# Scope — does the report stay inside the change?

- [ ] **P0** Nothing true before the change appears in the findings or affects the verdict. It
      goes under `Out of scope`, or it goes nowhere.
- [ ] **P0** Code outside the diff was read where it was needed to judge the change, and the
      report says so when a finding depends on it. Read widely, report narrowly.
- [ ] **P1** `Out of scope` findings are one line each, with a location, and no severity — they
      are a handover, not a judgement on this change.
- [ ] **P1** When `blocking` plus `defect` passes ten, the report says the change needs splitting
      instead of listing all of them.
- [ ] **P1** Missing tooling (no test setup, no linter) is reported as a condition under `Not
      verified`, not as a defect in the change — unless the change was supposed to add it.
- [ ] **P2** Where the change is right in a way a future reader might undo, that is a `note`.

## Anti-patterns

- A review of the file instead of the change. The author will read the whole report as unfair,
  and will be right.
- Pre-existing debt promoted to a blocking finding because it is adjacent to the diff.
- An `Out of scope` section used to review the rest of the repository.
