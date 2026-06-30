# Superdesign — one-paste setup (for AI coding agents)

The user wants to start designing on the Superdesign canvas. Do EVERY step below in order, automatically.
Pause only where login needs the browser. You MUST finish by generating a first design and returning its
preview link. Do NOT stop at login, and do NOT ask the user a blank "what do you want to design?" — propose
concrete options for them.

**Key to a good first run:** the design-system extraction (`init`) is SLOW the first time (~3–5 min). Run it
in the **background** and talk to the user **in parallel**, so their decision time overlaps the wait. And:

> ⛔ **Hard gate:** do NOT create a project, create a draft, or run ANY `superdesign` design command until
> `init` has finished (`.superdesign/init/` written). The proposal (Step 3) is plain conversation only.

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

## Step 2 — Auth only (no design work yet)

Ensure the CLI is installed (`superdesign --version`; if missing, `npm install -g @superdesign/cli@latest`),
then run `superdesign login` (opens a browser — ask the user to click to authenticate, then wait for success).
Do NOT start the design flow yet.

## Step 3 — Start `init` in the background + propose in parallel (conversation only)

**Kick off the design-system extraction (`init`) in the BACKGROUND** — spawn a sub-agent / background task
that runs the Superdesign init analysis and writes `.superdesign/init/` (slow the first time, ~3–5 min). Do
NOT wait for it here.

Meanwhile, in the main thread, take a QUICK glance at the repo (file tree + the main page/route) — only enough
to talk to the user:

- **If the user already gave a clear design need**: restate it as ONE concrete, scoped first design (a single
  page/screen, named), confirm in one line.
- **If they gave no design task**: propose **2–4 concrete, EASY, high-success** options and let them pick:
  - **Polish an existing page/component** you spotted (reproduce → improve) — name the real file/page.
  - **Rewrite the landing-page hero copy & layout** to drive higher conversion.
  - **Restyle one section** (pricing, nav, a card) as a quick experiment.
  - A small fresh screen (login, settings, empty state) if there's no obvious page.

⛔ This step is conversation ONLY. Do NOT run `superdesign create-project`, `create-design-draft`, or invoke
the superdesign design SOP here — the project and design are created in Step 4, after init finishes.

## Step 4 — Wait for `init`, then generate

Once the user has picked, send ONE short status message that makes clear what's done, what you're waiting on,
and what happens next. Fill in their actual choice. Template:

> Here's where we are:
> ✅ Superdesign skill installed + logged in
> ⏳ Extracting your repo's design system now — this is the one-time slow step (~3–5 min; instant on every run after)
> ⏭️ The moment it finishes, I'll generate **\<the design they picked\>** and send you the canvas preview link
>
> Nothing for you to do — I'll ping you when your draft is ready.

Then **wait for the background `init` to finish**. ONLY after `.superdesign/init/` is complete, run the
create flow for the chosen design (create the project → generate the first draft) and return the
**preview / canvas URL**. If a generate fails, retry once with a simpler prompt, then report the exact error.
Never stop silently, and never leave the user without the preview link.
