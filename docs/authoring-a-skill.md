# Authoring a skill — the short version

The authority is [`ai-craft:write-a-skill`](../domains/ai-craft/skills/write-a-skill/SKILL.md),
and it applies to itself. This page is the five-line summary for someone who just wants to start.

```bash
pnpm staff new skill review-a-dockerfile --domain delivery
```

1. **Write the description first.** It is the only text an agent sees before deciding to load
   the skill, so it must name the *situation*, in the words someone would type. If you cannot
   name the situation, you have a note, not a skill.
2. **Say when not to use it**, naming the skills that own the adjacent cases.
3. **Write the procedure, and only the procedure.** Numbered, imperative, each step checkable.
   Detail goes to `references/`, loaded by the step that needs it.
4. **Keep the frontmatter spec-pure.** Six keys travel everywhere; a seventh breaks the
   claude.ai upload unless you declare `compatibility: [claude-code]`.
5. **Write one eval case, then run `pnpm check`.** Then run the skill for real once — the validator
   catches the shape, not a procedure that reads well and cannot be followed.

If what you have is a set of criteria rather than a procedure, it is a checklist: it lives at the
domain level, a skill declares it in `metadata.checklists`, and `staff sync` copies it into the
skills that use it.
