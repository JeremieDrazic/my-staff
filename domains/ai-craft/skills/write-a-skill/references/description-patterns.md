# Writing the description

The description is the only text an agent reads before it decides whether to load the skill.
It is matched against a situation, not against a topic, so it has to contain the situation.

## The shape that works

```
<What it does>. Use when <the situation, in the words someone would actually use>.
Not for <the adjacent case>; that is <other-skill>.
```

Three parts, in that order. The verb first so the match happens on the first clause, the
trigger second because that is what retrieval keys on, the exclusion last because it is what
stops a wrong load.

## Rules

- **Name the situation, not the subject.** "Use when a pull request touches the client and you
  want it read before merging" retrieves. "For frontend code review" does not.
- **Use the words the person will use.** Not your internal vocabulary. If people on the team
  say "passe de revue", the English description still has to carry *review a branch before
  merging*, because that is the phrasing that will arrive.
- **List the surfaces.** A skill that covers forms, settings, onboarding and empty states should
  say so. Each noun is a retrieval hook, and this is the one place where a list earns its cost.
- **Say what it is not for.** One clause, naming the skill that owns it.
- **No self-reference.** "This skill…" spends the most valuable words in the file on nothing.
- **Between 40 and 1024 characters.** Under 40 it cannot carry a trigger. Over ~400 it is doing
  the body's job, with one exception: a skill that deliberately covers a wide surface, where the
  list of nouns *is* the trigger.

## Before and after

| Before | After |
| :- | :- |
| `A skill for reviewing React components.` | `Reviews a React component against the house checklist — props, state, the four UI states, accessibility. Use after writing or changing a component, or when auditing one that already exists. Not for a whole-branch pass; that is craft:review-pass.` |
| `Helps you write ADRs.` | `Writes an architecture decision record: the decision, the forces, the alternatives rejected and why. Use when a choice has been made that someone will question in six months. Not for documenting how something works; that is writing:docs.` |

## The test

Give the description alone to an agent with no other context, with the sentence a person would
really type. If the agent cannot tell whether to load it, rewrite the description — not the body.
