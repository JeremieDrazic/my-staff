# Privacy

This repository is public, and some of its domains are about life rather than code — study
method, learning, decisions, training. That combination is only safe under one rule.

## The rule

**The life domains ship methods, never data.**

A method is "how to work through a passage", "how to run a weekly review", "how to build a
training block". Data is which passage, which week, which injury. The method belongs here. The
data belongs in a private vault, or in a private companion repository installed through the same
channels.

The same rule applies to the technical domains: the checklist belongs here, the incident that
produced it is summarised in `field-notes.md` with no names and no customer, and the codebase it
happened in is not identified.

## What is enforced

`staff doctor` refuses a pull request that introduces an email address, a phone number, an
account number, a URL carrying a credential, or an absolute path into somebody's home directory.
Those are shapes, and shapes are all a machine can see.

Names are different: the terms that are actually private cannot be listed here, because listing
them would publish exactly what the check protects. So the check reads an optional local file at
`~/.config/staff/denylist.txt`, one term per line, which never leaves the machine. If you work
on this repository, write your own.

## What is not enforced

Judgement. A sentence can be perfectly shaped and still say too much about a real person. Before
committing anything in a life domain, read it as a stranger would and ask whether it describes a
method or a person. If it describes a person, it goes in the vault.
