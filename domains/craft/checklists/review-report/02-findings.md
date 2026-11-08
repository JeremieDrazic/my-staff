# Findings — is each one actionable on its own?

A finding is a unit of work for someone else. It is finished when that person can act without
asking a question.

- [ ] **P0** Every finding carries `path:line`. A finding with no location is skipped.
- [ ] **P0** Every finding states the consequence, not only the observation. "`catch {}` swallows
      the audit failure, so a cancelled order has no audit record" is a finding; "empty catch
      block" is a lint rule.
- [ ] **P0** The level matches the definition in `craft:reviewer-contract`, not the reviewer's
      sense of how annoying it is.
- [ ] **P1** A suggested fix is the smallest change that resolves the finding. Past a short
      snippet it is a design, and a design belongs in a question.
- [ ] **P1** No finding asserts behaviour the reviewer did not verify without saying so. A guess
      presented as a fact costs the whole report its credibility once found.
- [ ] **P1** Two findings with the same cause are one finding, with both locations.
- [ ] **P2** A finding that is cheap to fix and a finding that is expensive to fix say which.

## Anti-patterns

- A finding that is a question in disguise ("is this intentional?") placed in the findings table.
- Repeating the same finding once per occurrence, which inflates the count and buries the rest.
- A fix suggestion that rewrites code the finding does not concern.
