# Security

A public skills repository is an injection surface. Installed through any of the three channels,
a skill in this repository runs inside somebody else's agent, with their files and their
credentials within reach. That is the threat this file is about.

## What is checked mechanically

`staff doctor` runs on every pull request and refuses:

- a download piped straight into a shell, and decode-then-execute patterns;
- reads of credential files — SSH keys, cloud credentials, `.env`, `.netrc`, shell history, the keychain;
- a recursive delete aimed at a home directory, a root, or a glob;
- local file contents sent to a remote host;
- an `allowed-tools` grant of bare `Bash` (warning: constrain it, e.g. `Bash(git diff *)`);
- personal data of any shape: email addresses, phone numbers, account numbers, absolute home paths.

## What is not checked

A check that detects shapes cannot detect intent. Nothing here proves a skill is well behaved —
it proves it does not match a known-bad shape. **Read a skill before installing it**, as the
`skills` CLI itself says on every install.

No skill in this repository is designed to need network access or credentials. If one ever does,
it will say so in its own body, at the step that needs it.

## Reporting something

Open an issue describing the class of problem. Do not include a working exploit. If the issue
would expose someone's data by being public, say so in the issue title and leave the details out;
a maintainer will ask for them privately.
