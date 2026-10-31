# Eval — write-a-skill — turning a habit into a skill

The ordinary case: a person describes something they do by hand every week and wants it to
become a skill. The prompt deliberately never says the word "skill" first, so the trigger is
part of what is being tested.

## Task

> Every time I open a pull request I check the same things on the Dockerfile — pinned base
> image, no secrets in build args, non-root user, layer order. I'd like the agent to do that
> pass itself. Can you set that up?

## Expected behaviour

- [ ] `write-a-skill` loads without being named.
- [ ] The description is drafted **before** the body, and it names the situation ("use when a
      branch changes a Dockerfile"), not the subject ("for Docker").
- [ ] It asks which domain the skill belongs to, or proposes one with a reason, rather than
      dropping the skill at the repository root.
- [ ] The four checks become a domain checklist, not four paragraphs inside the body, because
      they are criteria rather than a procedure.
- [ ] Frontmatter stays spec-pure: `name`, `description`, and `metadata.checklists`.
- [ ] An eval case is written before the skill is called finished.
- [ ] It ends by running `staff validate`.

## Traps

- Writing one `docker` skill that covers the whole subject instead of one pass with a trigger.
- Putting the four criteria in the body, where no other skill can reuse them.
- Adding `user-invocable: true` by reflex, which costs the claude.ai upload for nothing.
- Declaring the checklist in `metadata.checklists` without creating it, which `staff validate`
  refuses — the correct order is checklist first, then `staff sync`.

## Run log

| Date | Platform | Result | Note |
| :- | :- | :- | :- |
