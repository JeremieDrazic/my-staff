import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadRepo } from '../src/model.mjs'
import { validateRepo } from '../src/validate.mjs'
import { makeFixture, domainManifest, skillFile, codes } from './helpers.mjs'

const findingsFor = (files) => validateRepo(loadRepo(makeFixture(files)))
const errors = (files) => codes(findingsFor(files).filter((finding) => finding.level === 'error'))
const warnings = (files) => codes(findingsFor(files).filter((finding) => finding.level === 'warn'))

test('a well-formed domain produces no error', () => {
  assert.deepEqual(
    errors({
      'domains/craft/domain.json': domainManifest('craft'),
      'domains/craft/skills/do-a-thing/SKILL.md': skillFile('do-a-thing'),
      'domains/craft/skills/do-a-thing/evals/case.md': '# Eval\n',
    }),
    [],
  )
})

test('a skill name that differs from its directory is refused', () => {
  assert.ok(
    errors({
      'domains/craft/domain.json': domainManifest('craft'),
      'domains/craft/skills/do-a-thing/SKILL.md': skillFile('something-else'),
    }).includes('skill/name-mismatch'),
  )
})

test('a domain name that differs from its directory is refused', () => {
  assert.ok(
    errors({ 'domains/craft/domain.json': domainManifest('other-name') }).includes('domain/name-mismatch'),
  )
})

test('a Claude Code key without a compatibility declaration is refused', () => {
  assert.ok(
    errors({
      'domains/craft/domain.json': domainManifest('craft'),
      'domains/craft/skills/do-a-thing/SKILL.md': skillFile('do-a-thing', { extra: 'user-invocable: true\n' }),
    }).includes('skill/undeclared-extras'),
  )
})

test('declaring claude-code compatibility makes the same key acceptable', () => {
  assert.deepEqual(
    errors({
      'domains/craft/domain.json': domainManifest('craft'),
      'domains/craft/skills/do-a-thing/SKILL.md': skillFile('do-a-thing', {
        extra: 'user-invocable: true\ncompatibility: [claude-code]\n',
      }),
      'domains/craft/skills/do-a-thing/evals/case.md': '# Eval\n',
    }),
    [],
  )
})

test('a body feature that only works in Claude Code must be declared', () => {
  assert.ok(
    errors({
      'domains/craft/domain.json': domainManifest('craft'),
      'domains/craft/skills/do-a-thing/SKILL.md': skillFile('do-a-thing', {
        body: 'Run ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs first.\n',
      }),
    }).includes('skill/undeclared-body-feature'),
  )
})

test('a skill over the token budget is refused', () => {
  assert.ok(
    errors({
      'domains/craft/domain.json': domainManifest('craft'),
      'domains/craft/skills/do-a-thing/SKILL.md': skillFile('do-a-thing', { body: 'word '.repeat(5000) }),
    }).includes('skill/over-budget'),
  )
})

test('declaring a checklist the domain does not have is refused', () => {
  assert.ok(
    errors({
      'domains/craft/domain.json': domainManifest('craft'),
      'domains/craft/skills/do-a-thing/SKILL.md': skillFile('do-a-thing', {
        extra: 'metadata:\n  checklists:\n    - nowhere\n',
      }),
    }).includes('skill/unknown-checklist'),
  )
})

test('a ready domain needs three skills and an eval case each', () => {
  const found = errors({
    'domains/craft/domain.json': domainManifest('craft', { status: 'ready' }),
    'domains/craft/skills/do-a-thing/SKILL.md': skillFile('do-a-thing'),
  })
  assert.ok(found.includes('domain/not-ready'))
  assert.ok(found.includes('domain/eval-missing'))
})

test('a reviewer that does not load the reviewer contract is refused', () => {
  const found = errors({
    'domains/backend/domain.json': domainManifest('backend'),
    'domains/backend/agents/api-reviewer.md':
      '---\nname: api-reviewer\ndescription: Reviews API contracts on a branch, and says when it should run so it is dispatched correctly.\ntools: Read, Grep, Bash\n---\n\nYou review APIs.\n',
  })
  assert.ok(found.includes('agent/no-contract'))
})

test('a reviewer that loads the contract is accepted', () => {
  const found = errors({
    'domains/backend/domain.json': domainManifest('backend'),
    'domains/backend/agents/api-reviewer.md':
      '---\nname: api-reviewer\ndescription: Reviews API contracts on a branch, and says when it should run so it is dispatched correctly.\ntools: Read, Grep, Bash\n---\n\nLoad the `craft:reviewer-contract` skill first.\n',
  })
  assert.deepEqual(found, [])
})

test('a description that describes itself is a warning, not an error', () => {
  const found = warnings({
    'domains/craft/domain.json': domainManifest('craft'),
    'domains/craft/skills/do-a-thing/SKILL.md': skillFile('do-a-thing', {
      description: 'This skill helps you do the thing when you want the thing done, use when needed.',
    }),
    'domains/craft/skills/do-a-thing/evals/case.md': '# Eval\n',
  })
  assert.ok(found.includes('skill/description-preamble'))
})

test('a dead link in a skill body is refused, but a path inside code is not a link', () => {
  const dead = errors({
    'domains/craft/domain.json': domainManifest('craft'),
    'domains/craft/skills/do-a-thing/SKILL.md': skillFile('do-a-thing', { body: 'See [detail](references/gone.md).\n' }),
  })
  assert.ok(dead.includes('skill/dead-link'))

  const inCode = errors({
    'domains/craft/domain.json': domainManifest('craft'),
    'domains/craft/skills/do-a-thing/SKILL.md': skillFile('do-a-thing', {
      body: 'Link them as `[detail](references/gone.md)` once they exist.\n',
    }),
    'domains/craft/skills/do-a-thing/evals/case.md': '# Eval\n',
  })
  assert.deepEqual(inCode, [])
})

test('a checklist without an index is refused, and every section must be linked', () => {
  const found = errors({
    'domains/craft/domain.json': domainManifest('craft'),
    'domains/craft/checklists/orphan/01-section.md': '# Section\n',
  })
  assert.ok(found.includes('checklist/no-index'))

  const unlisted = errors({
    'domains/craft/domain.json': domainManifest('craft'),
    'domains/craft/checklists/list/00-index.md': '# List\n\n- [01-a.md](01-a.md)\n',
    'domains/craft/checklists/list/01-a.md': '# A\n',
    'domains/craft/checklists/list/02-b.md': '# B\n',
  })
  assert.ok(unlisted.includes('checklist/section-not-listed'))
})

/**
 * A checklist travels into every skill that declares it and is read whole, so
 * the remedy for an oversized one is a second checklist, not more sections.
 */
test('a checklist too large to be loaded whole is refused', () => {
  const files = {
    'domains/craft/domain.json': domainManifest('craft'),
    'domains/craft/checklists/huge/00-index.md': '# Huge\n\n- [01-a.md](01-a.md)\n',
    'domains/craft/checklists/huge/01-a.md': `# A\n\n${'criterion '.repeat(3000)}\n`,
  }
  assert.ok(errors(files).includes('checklist/over-budget'))
  assert.ok(!warnings(files).includes('checklist/large'), 'the error replaces the warning')
})
