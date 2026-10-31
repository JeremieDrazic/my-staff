/**
 * Shape detectors, not a word list.
 *
 * The terms that are actually private cannot live in a public repository: committing
 * them would publish exactly what the check exists to protect. So this file detects
 * *shapes* — an address, a number, a key — and names are left to an optional local
 * denylist at ~/.config/staff/denylist.txt, which never leaves the machine.
 */
export const PRIVACY_PATTERNS = [
  {
    code: 'privacy/email',
    pattern: /[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[A-Za-z]{2,}\b/g,
    message: 'Looks like an email address.',
  },
  {
    code: 'privacy/phone',
    pattern: /(?:\+\d{1,3}[\s.-]?)?(?:\(\d{1,4}\)[\s.-]?)?\d{2}(?:[\s.-]\d{2}){3,4}\b/g,
    message: 'Looks like a phone number.',
  },
  {
    code: 'privacy/iban',
    pattern: /\b[A-Z]{2}\d{2}(?:[\s]?[A-Z0-9]{4}){3,7}\b/g,
    message: 'Looks like an IBAN.',
  },
  {
    code: 'privacy/token-in-url',
    pattern: /https?:\/\/[^\s)'"]*[?&](?:token|key|api_key|apikey|access_token|secret|password|pwd)=[^\s&)'"]+/gi,
    message: 'URL carries a credential in its query string.',
  },
  {
    code: 'privacy/home-path',
    pattern: /\/(?:Users|home)\/(?!<|\$|\{)[a-z][\w.-]*/g,
    message: 'Absolute path to somebody’s home directory. Write it with ~ or a placeholder.',
  },
]

export const SAFETY_PATTERNS = [
  {
    code: 'safety/pipe-to-shell',
    pattern: /\b(?:curl|wget)\b[^\n|]*\|\s*(?:sudo\s+)?(?:ba|z|fi|da)?sh\b/g,
    message: 'Downloads a script and runs it. Never in a skill other people install.',
  },
  {
    code: 'safety/decode-to-shell',
    pattern: /\bbase64\s+(?:-d|--decode|-D)\b[^\n|]*\|\s*(?:ba|z)?sh\b/g,
    message: 'Decodes and executes. Obfuscated execution has no place in a skill.',
  },
  {
    code: 'safety/credential-read',
    pattern: /(?:cat|less|head|tail|cp|scp|grep)\s+[^\n]*(?:\.ssh\/id_|\.aws\/credentials|\.netrc|\.npmrc|id_rsa|\.env\b)/g,
    message: 'Reads a credential file.',
  },
  {
    code: 'safety/recursive-delete',
    pattern: /\brm\s+(?:-[a-zA-Z]*[rR][a-zA-Z]*\s+)+(?:-[a-zA-Z]+\s+)*(?:\/|~|\$HOME|\*)/g,
    message: 'Recursive delete against a root, a home directory or a glob.',
  },
  {
    code: 'safety/exfiltration',
    pattern: /\bcurl\b[^\n]*(?:-X\s*POST|--data(?:-binary|-raw)?|-F\b|-T\b|--upload-file)[^\n]*(?:@|\$\()/g,
    message: 'Posts local file contents to a remote host.',
  },
  {
    code: 'safety/history-harvest',
    pattern: /(?:cat|grep|cp)\s+[^\n]*(?:\.bash_history|\.zsh_history|Keychains|login\.keychain)/g,
    message: 'Harvests shell history or the keychain.',
  },
]

/** Lines that only describe a pattern, so the check does not flag its own documentation. */
const WAIVER = /\b(?:staff-allow|never-run|example-only)\b/
const CODE_FENCE = /^(?:\s{0,3}```|\s{4,}\S)/

export function scanText(text, patterns, { skipIndentedCode = false } = {}) {
  const findings = []
  const lines = text.split(/\r?\n/)
  lines.forEach((line, index) => {
    if (WAIVER.test(line)) return
    if (skipIndentedCode && CODE_FENCE.test(line)) return
    for (const { code, pattern, message } of patterns) {
      const matches = line.match(new RegExp(pattern.source, pattern.flags))
      if (!matches) continue
      findings.push({ code, line: index + 1, message, excerpt: matches[0].slice(0, 60) })
    }
  })
  return findings
}
