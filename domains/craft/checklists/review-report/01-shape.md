# Shape — can this report be aggregated and acted on?

A report is read once and acted on by someone who was not there. Everything here exists so two
reports about the same change can be merged without being rewritten.

- [ ] **P0** The first line is `Verdict: block | approve with comments | clean`, one of those
      three words exactly. Anything else cannot gate a merge.
- [ ] **P0** The verdict follows the findings: `block` if any finding is blocking, `approve with
      comments` if there is anything at all, `clean` if there is nothing.
- [ ] **P0** Severity uses the four levels of `craft:reviewer-contract` — blocking, defect, risk,
      note — and no others. An invented scale aggregates with nothing.
- [ ] **P0** No style findings. Anything a linter, formatter or type checker decides is a missing
      rule, routed to `craft:rule-to-lint`, not a line in the report.
- [ ] **P1** `Not verified` is present and names the tool that was not run, with the findings
      that depend on it. "I read it" and "I ran it" are different claims.
- [ ] **P1** Questions to the author are their own section, each with the assumption made
      meanwhile. A question inside a finding is answered by nobody.
- [ ] **P1** `risk` and `note` are capped at three each, highest first, with one line saying how
      many were dropped.
- [ ] **P1** At least one `note` where a correct-looking-wrong pattern exists, saying why it is
      right. This is the level reviewers skip, and the one that prevents a future regression.
- [ ] **P2** The report would still be legible if the diff were not open next to it.

## Anti-patterns

- A verdict phrased as an opinion ("looks good to me, two things though").
- Findings grouped by file instead of by severity, so the reader has to rank them.
- A summary paragraph above the verdict. The verdict is the summary.
