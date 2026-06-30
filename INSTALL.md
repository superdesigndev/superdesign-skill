# Superdesign — one-paste setup (for AI coding agents)

The user wants to start designing on the Superdesign canvas. Do EVERY step below in order, automatically.
Pause only where login needs the browser. You MUST finish by generating a first design and returning its
preview link. Do NOT stop at login.

The flow is simple and sequential: **install → log in → init → ask what to design → design.** Do NOT
propose design ideas, and do NOT run things in parallel — just init, then ask the user what they want.

> ⛔ **Hard gate:** do NOT create a project, create a draft, or run ANY `superdesign` design command until
> `init` has finished (`.superdesign/init/` written with all files).

## Step 1 — Install the Superdesign skill into yourself

Run (non-interactive), substituting **your own agent's slug**:

```
npx skills add superdesigndev/superdesign-skill -g -a <your-agent-slug> -y
```

- `-g` persistent (global) · `-a` target agent · `-y` skip prompts.
- The skills CLI ([vercel-labs/skills](https://github.com/vercel-labs/skills)) supports **70+ coding agents**
  and writes the skill to the correct directory for each. Use the slug for the agent you are. Common slugs:
  `claude-code`, `cursor`, `codex`, `opencode`, `cline`, `windsurf`, `gemini-cli`, `github-copilot`, `zed`,
  `aider`, `continue`, `amp`, `warp`, `kilo`, `goose`, `crush`, `droid`, `junie`, `trae`, `qoder`, `devin`,
  `augment`, `roo`. Full list: <https://github.com/vercel-labs/skills#supported-agents>.

**Fallback** — if `npx skills` is unavailable or fails, install manually. Fetch **all three** skill files and
write them into a `superdesign/` folder inside your agent's skills directory:

- `https://raw.githubusercontent.com/superdesigndev/superdesign-skill/main/skills/superdesign/SKILL.md`
- `https://raw.githubusercontent.com/superdesigndev/superdesign-skill/main/skills/superdesign/INIT.md`
- `https://raw.githubusercontent.com/superdesigndev/superdesign-skill/main/skills/superdesign/SUPERDESIGN.md`

Typical skills dirs: `~/.claude/skills/superdesign/` (Claude Code) · `.agents/skills/superdesign/` (Cursor,
Codex, Cline, Gemini CLI, GitHub Copilot, Zed, Warp) · or your agent's documented skills path.

## Step 2 — Auth

Ensure the CLI is installed (`superdesign --version`; if missing, `npm install -g @superdesign/cli@latest`),
then run `superdesign login` (opens a browser — ask the user to click to authenticate, then wait for success).

## Step 3 — Run `init` (the repo design-system extraction)

Run the Superdesign init analysis — it scans the repo and writes the UI context files to `.superdesign/init/`
(per the INIT skill). **This is the one-time slow step** (~3–5 min the first time; instant on every run after).

Then move to Step 4. Do NOT propose designs and do NOT start any design command until init is complete.

## Step 4 — Ask the user what they want to design

Ask **one short, open question** and wait for their answer:

> What would you like to design? (a page, a component, a flow — name it, or paste a task/spec)

⛔ Do NOT propose options, do NOT pick a target for them, and do NOT list "high-leverage ideas." Just ask, and
use their answer as the design target. (Proposing has produced worse results — let the user say what they want.)

If their answer is ambiguous about WHICH page/screen (e.g. a feature that spans several), ask one quick
clarifying question to pin the exact target. Otherwise proceed.

## Step 5 — Design

Once `init` is complete AND you have the user's target, follow the SuperDesign design SOP (see `SUPERDESIGN.md`):
read the init files, gather the real source context for the target page (mind the payload budget — line-range
1000+ line files to their render section; never thin-retry on a 400), create the project, produce the
pixel-perfect reproduction, then branch variations. Return the **preview / canvas URL**.

If a generate fails with a 400 (payload), trim the big files to their render sections and retry the SAME
faithful call — never retry with thinned context, which makes the model invent a generic page. If it genuinely
cannot fit, stop and report the exact error. Never stop silently, and never leave the user without the preview link.
