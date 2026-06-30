# Superdesign — one-paste setup (for AI coding agents)

The user wants to start designing on the Superdesign canvas. Do EVERY step below in order, automatically.
Pause only where login needs the browser. You MUST finish by generating a first design and returning its
preview link. Do NOT stop at login, and do NOT ask the user a blank "what do you want to design?" — propose
concrete options for them.

**Key to a good first run:** the design-system extraction (`init`) is SLOW the first time (~3–5 min). Do NOT
make the user wait on a blank screen for it. Run `init` in the **background** and talk to the user **in
parallel** (Steps 3 + 4 below), so their decision time overlaps the wait.

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

## Step 2 — Auth, then kick off `init` in the background

Invoke the **superdesign** skill. It will install the CLI if missing (`@superdesign/cli`) and run
`superdesign login` (opens a browser — ask the user to click to authenticate, then wait for it).

**As soon as login succeeds, start the design-system extraction (`init`) running in the BACKGROUND** — spawn
a sub-agent / background task if your agent supports it; otherwise launch it non-blocking. Do NOT wait for it
here. Go straight to Step 3 while it runs.

## Step 3 — While `init` runs: scope or propose the first design (don't ask a blank question)

Do a QUICK glance at the repo (file tree + the main page/route) — only enough to propose relevant options.
Do NOT do a deep analysis here; `init` is already doing that in the background.

- **If the user already gave a clear design need**: don't offer generic options — restate it as ONE concrete,
  scoped first design (a single page/screen, named), confirm in one line, and proceed.
- **If they gave no design task**: propose **2–4 concrete, EASY, high-success** options and let them pick:
  - **Polish an existing page/component** you spotted (reproduce → improve) — name the real file/page.
  - **Rewrite the landing-page hero copy & layout** to drive higher conversion.
  - **Restyle one section** (pricing, nav, a card) as a quick experiment.
  - A small fresh screen (login, settings, empty state) if there's no obvious page.
  Keep each option to one line and concrete. If the user is unsure, pick a sensible default.

## Step 4 — Acknowledge, wait for `init`, then generate

Once the user picks, acknowledge and set expectations clearly, e.g.:

> "Roger that — I'm extracting the design system from your repo so the result matches your app. First time
> takes ~3–5 min (it's instant after that). I'll let you know the moment your first design draft is ready."

Then **wait for the background `init` to finish**, and run the skill's create flow for the chosen design.
Return the **preview / canvas URL** when it's ready. If a generate fails, retry once with a simpler prompt,
then report the exact error. Never stop silently, and never leave the user without the preview link.
