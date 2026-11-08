# Body — the procedure, and what it costs

- [ ] **P0** The body is a procedure. Numbered steps, imperative, each one checkable: a reader
      can tell whether the step was done.
- [ ] **P0** No step ends without an observable result. "Ensure quality" is not a step.
- [ ] **P0** Each step's criterion is demanding, not only checkable. "Every file in the diff
      accounted for" is a criterion; "review the diff" names a topic and lets the agent stop
      whenever it likes.
- [ ] **P0** Each criterion is satisfiable in the **failing** case, not only in the passing one.
      "Cite the line number of the `USER` instruction" is checkable and demanding, and cannot be
      met by the file that has no `USER` line — which is the file the pass exists for.
- [ ] **P0** Under the token budget. `staff validate` refuses over ~5000 estimated tokens and
      warns at 3500.
- [ ] **P0** References are one level deep. A file reached from another referenced file is read
      partially, so a reference that is an index to other references delivers nothing. Every
      `references/*.md` is linked from the body and complete on its own.
- [ ] **P1** Detail, edge cases and tables live in `references/`, each loaded by a step that
      says when to read it. Nothing in `references/` is unreachable from the body.
- [ ] **P1** The form of each step matches the freedom it can take: prose where several paths
      work, a parameterised command where one pattern is preferred, the exact command where the
      operation is fragile or must be identical every time.
- [ ] **P1** Work that would be rewritten on every run lives in `scripts/`, and the step says
      whether to **run** the file or **read** it, with the path given as relative to the skill's
      own directory and said in words — the agent has to find that directory itself.
- [ ] **P1** References are grouped by mechanism, not by step. Two steps turning on the same
      mechanism share one file; a file per step produces orphans and repetition.
- [ ] **P1** Steps say what to do rather than what to avoid. A prohibition makes the unwanted
      behaviour more available; keep it for the case where the agent knows the rule and breaks
      it anyway under pressure.
- [ ] **P1** What must survive a context compaction is near the top: only the first part of an
      invoked skill is re-attached afterwards.
- [ ] **P1** No background the agent already has, and no convention it will read in the repo.
- [ ] **P1** A rule a script could enforce is not stated here: it is in the validator, the
      linter or a hook, and the body points at it. A rule outside the linter does not exist.
- [ ] **P1** Criteria shared with other skills live in a domain checklist, declared through
      `metadata.checklists`, never copied by hand.
- [ ] **P2** The last step says how to know the work is finished.

## Anti-patterns

- A wall of prose with the procedure buried in it.
- A reference nothing links to, which means nobody will ever read it.
- One skill covering a whole domain. `frontend` is a domain; `review-react-component` is a skill.
- The same paragraph present in three skills: it wanted to be a checklist or a shared skill.
