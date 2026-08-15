/**
 * Superdesign as a DeepSeek Harness (dsh) plugin.
 *
 * Registers one `ctx.skills` provider that publishes the packaged
 * `skills/superdesign/` tree. It deliberately does NOT reuse
 * `@deepseek-ai/dsh-skill-filesystem`: depending on an in-box package from an
 * out-of-tree bundle would install a second copy that drifts from the host's.
 * The provider contract (`list` / `get`) is the stable seam, so this file
 * implements it directly — the shape `@deepseek-ai/dsh-skill-badge` uses for
 * the bundled badge skill.
 *
 * Plain ESM with no build step, on purpose: `dsh plugin add github:...` fetches
 * sources, not build output, and a `prepare` script would make every user
 * allowlist a build before the first install succeeds.
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const PROVIDER_NAME = 'superdesign'
const SKILL_NAME = 'superdesign'
/** Rank of the `bundled` discovery source in dsh's own skill provider. */
const BUNDLED_SKILL_RANK = 600

const SKILL_DIR_URL = new URL('../skills/superdesign/', import.meta.url)
const SKILL_BODY_URL = new URL('SKILL.md', SKILL_DIR_URL)
const RESOURCE_BASE = { kind: 'directory', path: fileURLToPath(SKILL_DIR_URL) }
const INVOCATION = { modelInvocable: true, userInvocable: true }

/**
 * Read the one-line `description` from SKILL.md's frontmatter.
 *
 * SKILL.md is the single source of truth for how the skill routes; copying its
 * description into this file would be a second copy that silently rots. The
 * frontmatter is two flat keys, so a full YAML parser (and its dependency)
 * would be more surface than the job needs.
 *
 * @param {string} body - the raw SKILL.md contents.
 * @returns {string | undefined} the description, or undefined when absent.
 */
function readDescription(body) {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(body)
  if (!frontmatter) return undefined
  const line = /^description:[ \t]*(.+)$/m.exec(frontmatter[1])
  if (!line) return undefined
  const raw = line[1].trim()
  if (raw.startsWith('"') && raw.endsWith('"') && raw.length > 1) {
    return raw.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\')
  }
  if (raw.startsWith("'") && raw.endsWith("'") && raw.length > 1) {
    return raw.slice(1, -1).replace(/''/g, "'")
  }
  return raw
}

/**
 * Load the packaged skill, or `undefined` when it cannot be read.
 *
 * @param {AbortSignal | undefined} signal - lookup cancellation.
 * @returns {Promise<{ description: string, content: string } | undefined>}
 */
async function loadSkill(signal) {
  const content = await readFile(SKILL_BODY_URL, { encoding: 'utf8', signal })
  const description = readDescription(content)
  if (description === undefined) return undefined
  return { description, content }
}

const provider = {
  name: PROVIDER_NAME,
  async list(options = {}) {
    const skill = await loadSkill(options.signal)
    if (skill === undefined) return []
    return [{
      name: SKILL_NAME,
      description: skill.description,
      invocation: INVOCATION,
      provider: PROVIDER_NAME,
      source: 'bundled',
      resourceBase: RESOURCE_BASE,
      rank: BUNDLED_SKILL_RANK,
      locator: SKILL_BODY_URL,
    }]
  },
  async get(_candidate, options = {}) {
    const skill = await loadSkill(options.signal)
    if (skill === undefined) return undefined
    return {
      name: SKILL_NAME,
      description: skill.description,
      invocation: INVOCATION,
      provider: PROVIDER_NAME,
      source: 'bundled',
      resourceBase: RESOURCE_BASE,
      content: skill.content,
    }
  },
}

/** Cordis plugin name. */
export const name = 'superdesign-skill'
/** The registry this plugin contributes to. */
export const inject = ['skills']

/**
 * Register the packaged Superdesign skill on `ctx.skills`.
 *
 * @param {import('@deepseek-ai/cordis').Context} ctx - the plugin context.
 */
export function apply(ctx) {
  ctx.skills.registerProvider(() => provider)
}
