import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'

export const OWNER = { name: 'Jérémie Drazic', url: 'https://github.com/jeremiedrazic' }
const REPO_URL = 'https://github.com/jeremiedrazic/my-staff'

const stringify = (value) => `${JSON.stringify(value, null, 2)}\n`

const installable = (repo) =>
  repo.domains.filter((domain) => domain.manifest && domain.manifest.status !== 'deprecated')

/**
 * Three manifests, all generated from the domain.json files so they cannot drift:
 * one marketplace for Claude Code and the skills CLI, one Claude Code plugin manifest
 * per domain, and one portable OpenAI plugin manifest per domain.
 */
export function buildManifests(repo) {
  const domains = installable(repo)

  const marketplace = {
    name: 'my-staff',
    description: 'Agent skills, roles and checklists for engineering, product and life. One source, every platform.',
    owner: OWNER,
    metadata: { pluginRoot: './domains' },
    plugins: domains.map((domain) => ({
      name: domain.name,
      source: `./domains/${domain.name}`,
      description: domain.manifest.summary,
      version: domain.manifest.version,
      ...(domain.manifest.keywords ? { keywords: domain.manifest.keywords } : {}),
    })),
  }

  const skillsSh = {
    paths: domains
      .filter((domain) => domain.skills.some((skill) => skill.exists))
      .map((domain) => `./domains/${domain.name}/skills`),
  }

  const files = [
    { path: '.claude-plugin/marketplace.json', content: stringify(marketplace) },
    { path: 'skills.sh.json', content: stringify(skillsSh) },
  ]

  for (const domain of domains) {
    const { name, version, summary, keywords } = domain.manifest
    files.push({
      path: `domains/${name}/.claude-plugin/plugin.json`,
      content: stringify({
        name,
        version,
        description: summary,
        author: OWNER,
        homepage: `${REPO_URL}/tree/main/domains/${name}`,
        license: 'Apache-2.0',
        ...(keywords ? { keywords } : {}),
      }),
    })
    files.push({
      path: `domains/${name}/plugin.json`,
      content: stringify({ name, version, description: summary }),
    })
  }
  return files
}

export function writeManifests(repo) {
  const written = []
  for (const file of buildManifests(repo)) {
    const target = join(repo.root, file.path)
    const current = existsSync(target) ? readFileSync(target, 'utf8') : null
    if (current === file.content) continue
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, file.content)
    written.push(file.path)
  }
  return written
}

export function checkManifests(repo) {
  return buildManifests(repo)
    .filter((file) => {
      const target = join(repo.root, file.path)
      return !existsSync(target) || readFileSync(target, 'utf8') !== file.content
    })
    .map((file) => ({
      level: 'error',
      code: 'manifest/stale',
      file: file.path,
      message: 'Out of date. Run `staff manifest`.',
    }))
}
