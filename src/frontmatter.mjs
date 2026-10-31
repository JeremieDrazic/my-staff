import { parse } from 'yaml'

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

/**
 * Split a markdown file into its YAML frontmatter and its body.
 * Returns `data: null` when the file has no frontmatter at all, which callers
 * report as an error rather than silently treating as an empty object.
 */
export function parseFrontmatter(raw) {
  const match = raw.match(FENCE)
  if (!match) return { data: null, body: raw, yaml: null }

  const yaml = match[1]
  const body = raw.slice(match[0].length)
  try {
    const data = parse(yaml) ?? {}
    return { data, body, yaml }
  } catch (error) {
    return { data: null, body, yaml, error: error.message }
  }
}

/** Rough token estimate. Four characters per token is close enough to hold a budget. */
export function estimateTokens(text) {
  return Math.ceil(text.length / 4)
}
