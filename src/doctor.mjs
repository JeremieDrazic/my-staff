import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, relative, extname } from 'node:path'
import { validateRepo } from './validate.mjs'
import { checkManifests } from './manifest.mjs'
import { checkSync } from './sync.mjs'
import { checkReadmes } from './readme.mjs'
import { checkPrivacy } from './checks/privacy.mjs'
import { checkSafety, checkToolGrants } from './checks/safety.mjs'

const SCANNED = ['.md', '.json', '.mjs', '.js', '.sh', '.yml', '.yaml']
const SKIPPED = new Set(['node_modules', '.git', 'dist'])
/** Lockfiles are generated and full of `package@version`, which looks like an address to a shape detector. */
const SKIPPED_FILES = new Set(['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock'])

export function collectFiles(root, directories = ['domains', 'docs', 'shared', 'src', 'bin', '.github']) {
  const files = []
  const walk = (dir) => {
    if (!existsSync(dir)) return
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (SKIPPED.has(entry.name) || SKIPPED_FILES.has(entry.name)) continue
      const path = join(dir, entry.name)
      if (entry.isDirectory()) walk(path)
      else if (SCANNED.includes(extname(entry.name))) {
        files.push({ relPath: relative(root, path).split('\\').join('/'), text: readFileSync(path, 'utf8') })
      }
    }
  }
  for (const directory of directories) walk(join(root, directory))
  for (const name of readdirSync(root)) {
    const path = join(root, name)
    if (SKIPPED_FILES.has(name)) continue
    if (statSync(path).isFile() && SCANNED.includes(extname(name))) {
      files.push({ relPath: name, text: readFileSync(path, 'utf8') })
    }
  }
  return files
}

/** Where the install channels put a skill, so we can tell whether a declared dependency is present. */
const SKILL_HOMES = [
  join(homedir(), '.claude', 'skills'),
  join(homedir(), '.agents', 'skills'),
  join(homedir(), '.claude', 'plugins', 'marketplaces'),
]

export function checkDependencies(repo) {
  const installed = new Set()
  for (const home of SKILL_HOMES) {
    if (!existsSync(home)) continue
    for (const entry of readdirSync(home)) installed.add(entry.toLowerCase())
  }
  const findings = []
  for (const domain of repo.domains) {
    for (const dependency of domain.manifest?.requires ?? []) {
      if (installed.has(dependency.name.toLowerCase())) continue
      findings.push({
        level: 'info',
        code: 'deps/not-installed',
        file: `domains/${domain.name}/domain.json`,
        message: `${domain.name} delegates to "${dependency.name}", which is not installed here. Install: ${dependency.install}`,
      })
    }
  }
  return findings
}

export function runDoctor(repo, { files = collectFiles(repo.root) } = {}) {
  return [
    ...validateRepo(repo),
    ...checkManifests(repo),
    ...checkSync(repo),
    ...checkReadmes(repo),
    ...checkPrivacy(files),
    ...checkSafety(files),
    ...checkToolGrants(repo),
    ...checkDependencies(repo),
  ]
}
