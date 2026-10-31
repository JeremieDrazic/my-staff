import { readFileSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { PRIVACY_PATTERNS, scanText } from './patterns.mjs'

export const DENYLIST_PATH = join(homedir(), '.config', 'staff', 'denylist.txt')

/**
 * Terms the author considers private, read from outside the repository.
 * One per line, `#` comments allowed. Missing file is the normal case.
 */
export function loadDenylist(path = DENYLIST_PATH) {
  if (!existsSync(path)) return []
  return readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
}

export function checkPrivacy(files, { denylist = loadDenylist() } = {}) {
  const findings = []
  const extra = denylist.map((term) => ({
    code: 'privacy/denylisted-term',
    pattern: new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'),
    message: `Term from your local denylist: "${term}".`,
  }))
  const patterns = [...PRIVACY_PATTERNS, ...extra]

  for (const { relPath, text } of files) {
    for (const finding of scanText(text, patterns)) {
      findings.push({ level: 'error', file: relPath, ...finding })
    }
  }
  return findings
}
