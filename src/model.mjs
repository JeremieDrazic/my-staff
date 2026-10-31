import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, dirname, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseFrontmatter } from './frontmatter.mjs'

/** The six keys claude.ai accepts. A skill using only these travels everywhere unchanged. */
export const SPEC_KEYS = ['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']

/** Accepted by Claude Code, refused by a claude.ai upload. Allowed, but they cost portability. */
export const CLAUDE_CODE_KEYS = [
  'user-invocable', 'disable-model-invocation', 'argument-hint', 'arguments', 'when_to_use',
  'model', 'effort', 'context', 'agent', 'background', 'hooks', 'paths', 'shell', 'disallowed-tools',
]

export const FAMILY_ORDER = ['meta', 'engineering', 'product-and-people', 'life']

export const FAMILY_LABELS = {
  meta: 'Meta',
  engineering: 'Engineering',
  'product-and-people': 'Product & people',
  life: 'Life',
}

export function repoRoot() {
  let dir = dirname(fileURLToPath(import.meta.url))
  while (dir !== dirname(dir)) {
    const manifest = join(dir, 'package.json')
    if (existsSync(manifest)) {
      const { name } = JSON.parse(readFileSync(manifest, 'utf8'))
      if (name === 'my-staff') return dir
    }
    dir = dirname(dir)
  }
  throw new Error('Could not find the my-staff repository root.')
}

const directories = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
        .map((entry) => entry.name)
        .sort()
    : []

const markdownFiles = (dir) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((name) => name.endsWith('.md'))
        .sort()
    : []

/**
 * A role's shape is read from its tools list, never from its prose.
 * Edit or Write means it builds; Bash without them means it reads and reports;
 * neither means it only advises.
 */
export function shapeFromTools(tools) {
  const list = Array.isArray(tools)
    ? tools
    : String(tools ?? '')
        .split(',')
        .map((tool) => tool.trim())
        .filter(Boolean)
  const names = list.map((tool) => tool.replace(/\(.*$/, '').trim())
  if (names.some((tool) => tool === 'Edit' || tool === 'Write' || tool === 'NotebookEdit')) return 'builder'
  if (names.some((tool) => tool === 'Bash')) return 'reviewer'
  return 'advisor'
}

function loadMarkdown(root, file) {
  const raw = readFileSync(file, 'utf8')
  return { raw, relPath: relative(root, file).split(sep).join('/'), ...parseFrontmatter(raw) }
}

function loadSkill(root, domainDir, name) {
  const dir = join(domainDir, 'skills', name)
  const skillFile = join(dir, 'SKILL.md')
  const skill = {
    name,
    dir,
    file: skillFile,
    exists: existsSync(skillFile),
    evals: markdownFiles(join(dir, 'evals')),
    references: existsSync(join(dir, 'references')) ? readdirSync(join(dir, 'references')).sort() : [],
  }
  if (skill.exists) Object.assign(skill, loadMarkdown(root, skillFile))
  return skill
}

function loadChecklist(root, domainDir, name) {
  const dir = join(domainDir, 'checklists', name)
  const sections = markdownFiles(dir)
  return {
    name,
    dir,
    sections,
    index: sections.includes('00-index.md') ? loadMarkdown(root, join(dir, '00-index.md')) : null,
  }
}

function loadDomain(root, name) {
  const dir = join(root, 'domains', name)
  const manifestFile = join(dir, 'domain.json')
  const domain = {
    name,
    dir,
    manifestFile,
    hasManifest: existsSync(manifestFile),
    manifest: null,
    manifestError: null,
    skills: directories(join(dir, 'skills')).map((skill) => loadSkill(root, dir, skill)),
    checklists: directories(join(dir, 'checklists')).map((checklist) => loadChecklist(root, dir, checklist)),
    agents: markdownFiles(join(dir, 'agents')).map((file) => {
      const loaded = loadMarkdown(root, join(dir, 'agents', file))
      return { file, name: file.replace(/\.md$/, ''), ...loaded, shape: shapeFromTools(loaded.data?.tools) }
    }),
    hasFieldNotes: existsSync(join(dir, 'field-notes.md')),
  }
  if (domain.hasManifest) {
    try {
      domain.manifest = JSON.parse(readFileSync(manifestFile, 'utf8'))
    } catch (error) {
      domain.manifestError = error.message
    }
  }
  return domain
}

export function loadRepo(root = repoRoot()) {
  const domains = directories(join(root, 'domains')).map((name) => loadDomain(root, name))
  return { root, domains }
}

export function allSkills(repo) {
  return repo.domains.flatMap((domain) => domain.skills.map((skill) => ({ domain, skill })))
}

export function isDirectory(path) {
  return existsSync(path) && statSync(path).isDirectory()
}
