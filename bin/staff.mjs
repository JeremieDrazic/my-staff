#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { loadRepo, repoRoot, FAMILY_LABELS } from '../src/model.mjs'
import { validateRepo } from '../src/validate.mjs'
import { writeManifests, checkManifests } from '../src/manifest.mjs'
import { writeSync, checkSync } from '../src/sync.mjs'
import { writeReadmes, checkReadmes } from '../src/readme.mjs'
import { runDoctor } from '../src/doctor.mjs'
import { build } from '../src/build.mjs'

const COLOUR = process.stdout.isTTY && !process.env.NO_COLOR
const paint = (code, text) => (COLOUR ? `\u001b[${code}m${text}\u001b[0m` : text)
const red = (text) => paint('31', text)
const yellow = (text) => paint('33', text)
const blue = (text) => paint('34', text)
const green = (text) => paint('32', text)
const dim = (text) => paint('2', text)

const USAGE = `staff — the toolkit's own tooling

  staff validate            schemas, frontmatter, token budgets, links, evals
  staff manifest [--check]  regenerate the marketplace and plugin manifests
  staff sync [--check]      materialise checklist copies inside the skills that declare them
  staff readme [--check]    regenerate the README tables and every domain README
  staff build <target>      claude-ai | chatgpt | codex-prompts | all → dist/
  staff doctor              everything above, read-only, plus privacy, safety and dependencies
  staff list                what the repository contains
  staff new <kind> <name>   scaffold a domain, skill, agent or checklist

Flags
  --json                    machine-readable output, for an agent
  --check                   fail instead of writing, for CI
  --domain <name>           target domain for \`staff new\`
  --shape <builder|reviewer|advisor>
`

function parseArguments(argv) {
  const positional = []
  const flags = {}
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) {
      positional.push(token)
      continue
    }
    const key = token.slice(2)
    const next = argv[index + 1]
    if (next && !next.startsWith('--')) {
      flags[key] = next
      index += 1
    } else {
      flags[key] = true
    }
  }
  return { positional, flags }
}

const RANK = { error: 0, warn: 1, info: 2 }
const LABEL = { error: red('error'), warn: yellow('warn'), info: blue('info') }

function report(findings, { json, title }) {
  if (json) {
    process.stdout.write(`${JSON.stringify({ findings, ok: !findings.some((f) => f.level === 'error') }, null, 2)}\n`)
    return findings.some((finding) => finding.level === 'error') ? 1 : 0
  }

  const sorted = [...findings].sort(
    (a, b) => RANK[a.level] - RANK[b.level] || String(a.file).localeCompare(String(b.file)),
  )
  let current = null
  for (const finding of sorted) {
    if (finding.file !== current) {
      current = finding.file
      process.stdout.write(`\n${dim(current)}\n`)
    }
    const where = finding.line ? dim(`:${finding.line}`) : ''
    process.stdout.write(`  ${LABEL[finding.level]}${where} ${finding.message} ${dim(finding.code)}\n`)
  }

  const errors = findings.filter((finding) => finding.level === 'error').length
  const warnings = findings.filter((finding) => finding.level === 'warn').length
  const infos = findings.filter((finding) => finding.level === 'info').length
  const summary = [
    errors ? red(`${errors} error${errors > 1 ? 's' : ''}`) : green('0 errors'),
    `${warnings} warning${warnings === 1 ? '' : 's'}`,
    infos ? `${infos} note${infos === 1 ? '' : 's'}` : null,
  ]
    .filter(Boolean)
    .join(' · ')
  process.stdout.write(`\n${title}: ${summary}\n`)
  return errors > 0 ? 1 : 0
}

function reportWrites(written, { label, json }) {
  if (json) {
    process.stdout.write(`${JSON.stringify({ written }, null, 2)}\n`)
    return 0
  }
  if (written.length === 0) {
    process.stdout.write(`${green('✔')} ${label}: already up to date\n`)
    return 0
  }
  for (const path of written) process.stdout.write(`  ${green('updated')} ${path}\n`)
  process.stdout.write(`${green('✔')} ${label}: ${written.length} file(s) written\n`)
  return 0
}

function list(repo, json) {
  if (json) {
    const payload = repo.domains.map((domain) => ({
      name: domain.name,
      status: domain.manifest?.status ?? 'unknown',
      family: domain.manifest?.family,
      summary: domain.manifest?.summary,
      skills: domain.skills.filter((skill) => skill.exists).map((skill) => skill.name),
      roles: domain.agents.map((agent) => ({ name: agent.name, shape: agent.shape })),
      checklists: domain.checklists.map((checklist) => checklist.name),
    }))
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`)
    return 0
  }
  if (repo.domains.length === 0) {
    process.stdout.write('No domain yet. Start one with `staff new domain <name>`.\n')
    return 0
  }
  for (const domain of repo.domains) {
    const status = domain.manifest?.status ?? 'no manifest'
    const family = domain.manifest?.family ? FAMILY_LABELS[domain.manifest.family] : '—'
    process.stdout.write(`\n${green(domain.name)} ${dim(`${family} · ${status}`)}\n`)
    for (const skill of domain.skills.filter((candidate) => candidate.exists)) {
      process.stdout.write(`  skill      ${skill.name}${skill.evals.length ? '' : dim('  (no eval)')}\n`)
    }
    for (const agent of domain.agents) process.stdout.write(`  ${agent.shape.padEnd(9)} ${agent.name}\n`)
    for (const checklist of domain.checklists) {
      process.stdout.write(`  checklist  ${checklist.name} ${dim(`${checklist.sections.length} sections`)}\n`)
    }
  }
  process.stdout.write('\n')
  return 0
}

function scaffold(root, kind, name, flags) {
  if (!name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
    throw new Error('Name must be kebab-case, e.g. review-react-component.')
  }
  const templates = join(root, 'shared', 'templates')
  const render = (file, values) => {
    const raw = readFileSync(join(templates, file), 'utf8')
    return raw.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? `{{${key}}}`)
  }
  const values = {
    name,
    domain: flags.domain ?? '',
    shape: flags.shape ?? 'reviewer',
    date: new Date().toISOString().slice(0, 10),
  }

  const write = (path, content) => {
    const target = join(root, path)
    if (existsSync(target)) throw new Error(`${path} already exists.`)
    mkdirSync(join(target, '..'), { recursive: true })
    writeFileSync(target, content)
    process.stdout.write(`  ${green('created')} ${path}\n`)
  }

  if (kind === 'domain') {
    write(`domains/${name}/domain.json`, render('domain.json', values))
    write(`domains/${name}/field-notes.md`, render('field-notes.md', values))
    process.stdout.write(`\nNext: \`staff new skill <skill-name> --domain ${name}\`, then \`staff manifest\`.\n`)
    return 0
  }

  if (!flags.domain) throw new Error(`A ${kind} belongs to a domain. Pass --domain <name>.`)
  const domainDir = join(root, 'domains', String(flags.domain))
  if (!existsSync(domainDir)) throw new Error(`Unknown domain "${flags.domain}".`)

  if (kind === 'skill') {
    write(`domains/${flags.domain}/skills/${name}/SKILL.md`, render('SKILL.md', values))
    write(`domains/${flags.domain}/skills/${name}/evals/first-case.md`, render('eval.md', values))
    return 0
  }
  if (kind === 'agent') {
    write(`domains/${flags.domain}/agents/${name}.md`, render(`agent.${values.shape}.md`, values))
    return 0
  }
  if (kind === 'checklist') {
    write(`domains/${flags.domain}/checklists/${name}/00-index.md`, render('checklist-index.md', values))
    write(`domains/${flags.domain}/checklists/${name}/01-first-section.md`, render('checklist-section.md', values))
    return 0
  }
  throw new Error(`Unknown kind "${kind}". Use domain, skill, agent or checklist.`)
}

function main() {
  const { positional, flags } = parseArguments(process.argv.slice(2))
  const [command, ...rest] = positional
  const json = flags.json === true
  const check = flags.check === true

  if (!command || command === 'help' || flags.help) {
    process.stdout.write(USAGE)
    return 0
  }

  const root = repoRoot()
  const repo = loadRepo(root)

  switch (command) {
    case 'validate':
      return report(validateRepo(repo), { json, title: 'validate' })
    case 'doctor':
      return report(runDoctor(repo), { json, title: 'doctor' })
    case 'manifest':
      return check
        ? report(checkManifests(repo), { json, title: 'manifest' })
        : reportWrites(writeManifests(repo), { label: 'manifest', json })
    case 'readme':
      return check
        ? report(checkReadmes(repo), { json, title: 'readme' })
        : reportWrites(writeReadmes(repo), { label: 'readme', json })
    case 'sync': {
      if (check) return report(checkSync(repo), { json, title: 'sync' })
      const { written, removed } = writeSync(repo)
      for (const path of removed) process.stdout.write(`  ${yellow('removed')} ${path}\n`)
      return reportWrites(written, { label: 'sync', json })
    }
    case 'build': {
      const result = build(repo, rest[0] ?? 'all')
      if (json) {
        process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
        return result.refused.length > 0 ? 1 : 0
      }
      for (const entry of result.built) {
        const extra = entry.dropped?.length ? dim(`  stripped: ${entry.dropped.join(', ')}`) : ''
        const size = entry.tokens ? dim(`  ~${entry.tokens} tokens`) : ''
        process.stdout.write(`  ${green('built')} ${entry.file}${extra}${size}${entry.warn ? yellow('  over the paste budget') : ''}\n`)
      }
      for (const entry of result.refused) {
        process.stdout.write(`  ${red('refused')} ${entry.skill} — ${entry.reason}\n`)
      }
      if (result.note) process.stdout.write(`\n${dim(result.note)}\n`)
      process.stdout.write(`\n${result.refused.length ? red('✗') : green('✔')} build: ${result.built.length} file(s), ${result.refused.length} refused\n`)
      return result.refused.length > 0 ? 1 : 0
    }
    case 'list':
      return list(repo, json)
    case 'new':
      return scaffold(root, rest[0], rest[1], flags)
    default:
      process.stderr.write(`Unknown command "${command}".\n\n${USAGE}`)
      return 2
  }
}

try {
  process.exit(main())
} catch (error) {
  process.stderr.write(`${red('staff:')} ${error.message}\n`)
  process.exit(2)
}
