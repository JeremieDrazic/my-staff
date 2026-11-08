import { readFileSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import Ajv from 'ajv'
import { estimateTokens } from './frontmatter.mjs'
import { CLAUDE_CODE_KEYS, SPEC_KEYS } from './model.mjs'

const SKILL_TOKEN_BUDGET = 5000
const SKILL_TOKEN_WARN = 3500

/**
 * A checklist travels into every skill that declares it, as one file read whole.
 * Sections are how a human reviews it, not how an agent loads it, so the budget
 * applies to the checklist and the remedy is a second checklist.
 */
const CHECKLIST_TOKEN_BUDGET = 6000
const CHECKLIST_TOKEN_WARN = 4000

/** Body features that work in Claude Code and silently do nothing anywhere else. */
const CLAUDE_CODE_BODY = [
  { pattern: /!`[^`]+`/, what: 'command injection (!`…`)' },
  { pattern: /\$\{CLAUDE_PLUGIN_ROOT\}/, what: '${CLAUDE_PLUGIN_ROOT}' },
  { pattern: /\$\{CLAUDE_PROJECT_DIR\}/, what: '${CLAUDE_PROJECT_DIR}' },
]

const LINK = /\[[^\]]*\]\((?!https?:|mailto:|#)([^)\s]+)\)/g

/**
 * A path inside a fenced block or inline code is documentation, not a link.
 * Blanking those spans keeps the link check honest on prose only.
 */
function withoutCode(text) {
  return text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')
}

function loadSchemas(root) {
  const ajv = new Ajv({ allErrors: true, strict: false })
  const read = (name) => JSON.parse(readFileSync(join(root, 'shared', 'schemas', name), 'utf8'))
  return {
    domain: ajv.compile(read('domain.schema.json')),
    skill: ajv.compile(read('skill.schema.json')),
    agent: ajv.compile(read('agent.schema.json')),
  }
}

const schemaErrors = (validator) =>
  (validator.errors ?? []).map((error) => `${error.instancePath || '/'} ${error.message}`)

export function validateRepo(repo) {
  const findings = []
  const schemas = loadSchemas(repo.root)
  const add = (level, code, file, message) => findings.push({ level, code, file, message })

  if (repo.domains.length === 0) add('warn', 'repo/no-domains', 'domains/', 'No domain yet.')

  for (const domain of repo.domains) {
    validateDomain(domain, schemas, add)
    for (const skill of domain.skills) validateSkill(domain, skill, schemas, add)
    for (const agent of domain.agents) validateAgent(domain, agent, schemas, add)
    for (const checklist of domain.checklists) validateChecklist(domain, checklist, add)
  }
  return findings
}

function validateDomain(domain, schemas, add) {
  const where = `domains/${domain.name}/domain.json`
  if (!domain.hasManifest) return add('error', 'domain/no-manifest', where, 'Missing domain.json.')
  if (domain.manifestError) return add('error', 'domain/bad-json', where, domain.manifestError)

  if (!schemas.domain(domain.manifest)) {
    for (const message of schemaErrors(schemas.domain)) add('error', 'domain/schema', where, message)
  }
  if (domain.manifest.name !== domain.name) {
    add('error', 'domain/name-mismatch', where, `name is "${domain.manifest.name}" but the directory is "${domain.name}". The plugin install breaks on this.`)
  }

  const ready = domain.manifest.status === 'ready'
  const usable = domain.skills.filter((skill) => skill.exists)
  if (ready && usable.length < 3) {
    add('error', 'domain/not-ready', where, `status is "ready" with ${usable.length} skill(s). Three valid skills is the bar; use "draft" until then.`)
  }
  if (ready) {
    for (const skill of usable) {
      if (skill.evals.length === 0) {
        add('error', 'domain/eval-missing', skill.relPath, 'A skill in a ready domain needs at least one eval case under evals/.')
      }
    }
  }
  if (domain.checklists.length > 0 && !domain.hasFieldNotes) {
    add('warn', 'domain/no-field-notes', `domains/${domain.name}/`, 'This domain owns checklists but has no field-notes.md. Every criterion should trace back to an incident or a mechanical check.')
  }
}

function validateSkill(domain, skill, schemas, add) {
  const where = skill.relPath ?? `domains/${domain.name}/skills/${skill.name}/SKILL.md`
  if (!skill.exists) return add('error', 'skill/no-file', where, 'Skill directory without a SKILL.md.')
  if (skill.data === null) {
    return add('error', 'skill/no-frontmatter', where, skill.error ?? 'Missing or unparseable YAML frontmatter.')
  }

  if (!schemas.skill(skill.data)) {
    for (const message of schemaErrors(schemas.skill)) add('error', 'skill/schema', where, message)
  }
  if (skill.data.name !== skill.name) {
    add('error', 'skill/name-mismatch', where, `name is "${skill.data.name}" but the directory is "${skill.name}".`)
  }

  const declared = new Set(skill.data.compatibility ?? [])
  const extras = Object.keys(skill.data).filter((key) => CLAUDE_CODE_KEYS.includes(key))
  if (extras.length > 0 && !declared.has('claude-code')) {
    add('error', 'skill/undeclared-extras', where, `Uses Claude Code keys (${extras.join(', ')}) that a claude.ai upload refuses. Add "claude-code" to compatibility.`)
  }
  for (const { pattern, what } of CLAUDE_CODE_BODY) {
    if (pattern.test(skill.body) && !declared.has('claude-code')) {
      add('error', 'skill/undeclared-body-feature', where, `Body uses ${what}, which does nothing outside Claude Code. Add "claude-code" to compatibility.`)
    }
  }
  const nonSpec = Object.keys(skill.data).filter((key) => !SPEC_KEYS.includes(key))
  if (nonSpec.length === 0 && declared.size > 0 && !declared.has('universal')) {
    add('warn', 'skill/needless-compatibility', where, 'Frontmatter is spec-pure, so compatibility is noise. Drop it.')
  }

  const tokens = estimateTokens(skill.raw)
  if (tokens > SKILL_TOKEN_BUDGET) {
    add('error', 'skill/over-budget', where, `~${tokens} tokens, over the ${SKILL_TOKEN_BUDGET} budget. Move detail into references/ and load it on demand.`)
  } else if (tokens > SKILL_TOKEN_WARN) {
    add('warn', 'skill/near-budget', where, `~${tokens} tokens, close to the ${SKILL_TOKEN_BUDGET} budget.`)
  }

  const description = String(skill.data.description ?? '')
  if (/^(?:this skill|a skill|skill (?:that|for|to))/i.test(description.trim())) {
    add('warn', 'skill/description-preamble', where, 'Description starts by naming itself. It is the retrieval mechanism: start with what it does and when to use it.')
  }
  if (!/\b(?:use (?:it )?(?:when|for|after|before)|when the user|when you|trigger)/i.test(description)) {
    add('warn', 'skill/description-no-trigger', where, 'Description never says when to use the skill, so nothing can retrieve it reliably.')
  }

  for (const name of skill.data.metadata?.checklists ?? []) {
    if (!domain.checklists.some((checklist) => checklist.name === name)) {
      add('error', 'skill/unknown-checklist', where, `Declares checklist "${name}", which this domain does not have.`)
    }
  }

  if (skill.evals.length === 0) {
    add('warn', 'skill/no-evals', where, 'No eval case. A skill whose quality is only asserted in prose has no quality.')
  }

  for (const match of withoutCode(skill.body).matchAll(LINK)) {
    const target = match[1].split('#')[0]
    if (!target) continue
    if (!existsSync(resolve(dirname(skill.file), target))) {
      add('error', 'skill/dead-link', where, `Link target does not exist: ${target}`)
    }
  }
}

function validateAgent(domain, agent, schemas, add) {
  const where = agent.relPath
  if (agent.data === null) {
    return add('error', 'agent/no-frontmatter', where, agent.error ?? 'Missing or unparseable YAML frontmatter.')
  }
  if (!schemas.agent(agent.data)) {
    for (const message of schemaErrors(schemas.agent)) add('error', 'agent/schema', where, message)
  }
  if (agent.data.name !== agent.name) {
    add('error', 'agent/name-mismatch', where, `name is "${agent.data.name}" but the file is "${agent.file}".`)
  }

  const contract = { builder: 'craft:builder-contract', reviewer: 'craft:reviewer-contract' }[agent.shape]
  if (contract && !agent.body.includes(contract) && domain.name !== 'craft') {
    add('error', 'agent/no-contract', where, `Its tools make it a ${agent.shape}, so it must load ${contract} first.`)
  }
  if (agent.shape === 'builder' && !/##\s*Learned/i.test(agent.body)) {
    add('warn', 'agent/no-learned-section', where, 'A builder owes a Learned section in its report. Say so in the role, or rely on the contract and reference it.')
  }
}

function validateChecklist(domain, checklist, add) {
  const where = `domains/${domain.name}/checklists/${checklist.name}/`
  if (!checklist.index) {
    return add('error', 'checklist/no-index', where, 'Missing 00-index.md.')
  }
  const sections = checklist.sections.filter((name) => name !== '00-index.md')
  const text = withoutCode(checklist.index.raw)
  for (const section of sections) {
    if (!text.includes(section)) {
      add('error', 'checklist/section-not-listed', `${where}00-index.md`, `Section "${section}" exists but the index never links it.`)
    }
  }
  for (const match of text.matchAll(LINK)) {
    const target = match[1].split('#')[0]
    if (target && !existsSync(resolve(checklist.dir, target))) {
      add('error', 'checklist/dead-link', `${where}00-index.md`, `Link target does not exist: ${target}`)
    }
  }
  if (sections.length === 0) {
    add('warn', 'checklist/single-file', where, 'One file only. Split into sections so a reviewer can read one concern at a time; `staff sync` joins them back for the agent.')
  }
  const tokens = estimateTokens(
    [checklist.index.raw, ...sections.map((section) => readFileSync(join(checklist.dir, section), 'utf8'))].join('\n')
  )
  if (tokens > CHECKLIST_TOKEN_BUDGET) {
    add('error', 'checklist/over-budget', where, `~${tokens} tokens. A skill loads a checklist whole, so over ~${CHECKLIST_TOKEN_BUDGET} it stops being loadable. Split it into two checklists a skill can declare separately — not into more sections, which do not reduce the load.`)
  } else if (tokens > CHECKLIST_TOKEN_WARN) {
    add('warn', 'checklist/large', where, `~${tokens} tokens, loaded whole by every skill that declares it. Past ~${CHECKLIST_TOKEN_WARN}, consider two checklists scoped to different passes.`)
  }
}
