import { mkdtempSync, mkdirSync, writeFileSync, cpSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { repoRoot } from '../src/model.mjs'

/**
 * A throwaway repository on disk, so the validator runs its real file-system paths
 * instead of a mocked model. Schemas are copied from the real repository: the tests
 * check the rules, not a second copy of them.
 */
export function makeFixture(files = {}) {
  const root = mkdtempSync(join(tmpdir(), 'my-staff-test-'))
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'my-staff' }))
  mkdirSync(join(root, 'shared'), { recursive: true })
  cpSync(join(repoRoot(), 'shared', 'schemas'), join(root, 'shared', 'schemas'), { recursive: true })
  for (const [path, content] of Object.entries(files)) {
    const target = join(root, path)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, content)
  }
  return root
}

export const domainManifest = (name, extra = {}) =>
  `${JSON.stringify(
    {
      name,
      family: 'engineering',
      summary: 'A fixture domain used by the test suite, long enough to pass the schema.',
      status: 'draft',
      version: '0.1.0',
      ...extra,
    },
    null,
    2,
  )}\n`

export const skillFile = (name, { description, body = 'Body.\n', extra = '' } = {}) =>
  `---\nname: ${name}\ndescription: ${description ?? `Does the fixture thing. Use when a test needs a valid skill that says when to use it.`}\n${extra}---\n\n${body}`

export const codes = (findings) => findings.map((finding) => finding.code)
