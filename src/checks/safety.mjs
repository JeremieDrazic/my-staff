import { SAFETY_PATTERNS, scanText } from './patterns.mjs'

/**
 * A public skills repository is an injection surface: installed into somebody
 * else's agent, a malicious skill runs on their machine. These checks are the
 * promise made in SECURITY.md, kept mechanically.
 */
export function checkSafety(files) {
  const findings = []
  for (const { relPath, text } of files) {
    for (const finding of scanText(text, SAFETY_PATTERNS)) {
      findings.push({ level: 'error', file: relPath, ...finding })
    }
  }
  return findings
}

/** An unconstrained Bash grant is the broadest permission a skill can ask for. */
export function checkToolGrants(repo) {
  const findings = []
  for (const domain of repo.domains) {
    for (const skill of domain.skills) {
      const granted = skill.data?.['allowed-tools']
      if (!granted) continue
      const list = Array.isArray(granted) ? granted : [granted]
      for (const tool of list) {
        if (/^Bash$/.test(String(tool).trim())) {
          findings.push({
            level: 'warn',
            code: 'safety/unconstrained-bash',
            file: skill.relPath,
            message: 'allowed-tools grants bare Bash. Constrain it, e.g. Bash(git diff *).',
          })
        }
      }
    }
  }
  return findings
}
