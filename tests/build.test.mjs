import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { loadRepo } from '../src/model.mjs'
import { buildClaudeAi, buildChatgpt } from '../src/build.mjs'
import { makeFixture, domainManifest, skillFile } from './helpers.mjs'

const outDir = () => mkdtempSync(join(tmpdir(), 'my-staff-build-'))

test('the claude.ai zip carries only the keys an upload accepts', () => {
  const root = makeFixture({
    'domains/craft/domain.json': domainManifest('craft'),
    'domains/craft/skills/do-a-thing/SKILL.md': skillFile('do-a-thing', {
      extra: 'user-invocable: true\nargument-hint: "[branch]"\ncompatibility: [claude-code, claude-ai]\n',
    }),
  })
  const out = outDir()
  const { built, refused } = buildClaudeAi(loadRepo(root), { outDir: out })

  assert.deepEqual(refused, [])
  assert.deepEqual(built[0].dropped.sort(), ['argument-hint', 'user-invocable'])

  const unpacked = outDir()
  execFileSync('unzip', ['-q', join(out, 'do-a-thing.zip'), '-d', unpacked])
  const shipped = readFileSync(join(unpacked, 'do-a-thing', 'SKILL.md'), 'utf8')
  assert.match(shipped, /name: do-a-thing/)
  assert.doesNotMatch(shipped, /user-invocable/)
  assert.doesNotMatch(shipped, /argument-hint/)
})

test('a skill using a Claude Code body feature is refused rather than shipped broken', () => {
  const root = makeFixture({
    'domains/craft/domain.json': domainManifest('craft'),
    'domains/craft/skills/do-a-thing/SKILL.md': skillFile('do-a-thing', {
      body: 'Run ${CLAUDE_PLUGIN_ROOT}/scripts/x.mjs.\n',
    }),
  })
  const { built, refused } = buildClaudeAi(loadRepo(root), { outDir: outDir() })
  assert.deepEqual(built, [])
  assert.equal(refused.length, 1)
  assert.match(refused[0].reason, /claude-code compatibility/)
})

test('the ChatGPT pack leads each skill with when to use it', () => {
  const root = makeFixture({
    'domains/craft/domain.json': domainManifest('craft'),
    'domains/craft/skills/do-a-thing/SKILL.md': skillFile('do-a-thing'),
  })
  const out = outDir()
  buildChatgpt(loadRepo(root), { outDir: out })
  assert.deepEqual(readdirSync(out).sort(), ['craft-do-a-thing.md', 'craft.md'])
  assert.match(readFileSync(join(out, 'craft.md'), 'utf8'), /\*\*Use this when:\*\* Does the fixture thing/)
})
