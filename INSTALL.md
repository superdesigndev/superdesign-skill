# Superdesign — one-paste setup (for AI coding agents)

The user wants to start designing on the Superdesign canvas. Do EVERY step below in order, automatically.
Pause only where login needs the browser. You MUST finish by generating a first design and returning its
preview link. Do NOT stop at login, and do NOT ask the user a blank "what do you want to design?" — propose
concrete options for them.

**Key to a good first run:** `init` builds only the **design-system layer** (tokens, component variants,
conventions) — small, reusable, one-time (~1–2 min). Run it in the **background** and talk to the user **in
parallel**, so their decision overlaps the wait. Page structure is NOT extracted now; it's read just-in-time
from the real page once the user picks a target (Step 4) — that's what keeps reproductions faithful. And:

> ⛔ **Hard gate:** do NOT create a project, create a draft, or run ANY `superdesign` design command until the
> design-system layer has finished (`.superdesign/init/theme.md`, `components.md`, `.superdesign/design-system.md`
> written). The proposal (Step 3) is plain conversation only — and it doubles as **confirming the target page**,
> which scopes the page reproduction in Step 4.

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

**Kick off the design-system-layer `init` in the BACKGROUND** — spawn a sub-agent / background task that runs
the Superdesign init analysis and writes the design-system layer (`.superdesign/init/theme.md`, `components.md`,
`extractable-components.md`, `.superdesign/design-system.md`). One-time, ~1–2 min. Do NOT wait for it here. It
does NOT analyze pages/layouts — that happens per-target in Step 4.

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

## Step 4 — Wait for `init` (prep silently), then generate

Once the user picks, send **EXACTLY this one short, calm standby message** — filled in with their choice, and
**nothing else**. This is the whole message:

> ✅ Superdesign skill installed + logged in
> ⏳ Building your repo's design-system context now — one-time, ~1–2 min (instant every run after)
> ⏭️ The moment it's ready, I'll generate **\<the design they picked\>** and send you the canvas preview link
>
> Nothing needed from you — I'll ping you when your draft is ready.

⛔ Do NOT append anything to that message: no "here's the plan", no list of files you traced, no `--context-file`
set, no "two-step generation" breakdown, no target/context recap. All of that is INTERNAL. A rambling standby is
a failure — the user should see only the four lines above.

**While you wait, do the targeted page prep SILENTLY** (do not narrate it): open the chosen page's real source,
find the branch that actually renders on that route (watch for responsive branches like `if (!isMobile) {…}` —
pick the one that renders, not a fallback), trace its imports, and assemble the exact `--context-file` list.
NEVER pass a line range you haven't read — a wrong branch is the #1 cause of a wrong reproduction.

**🚨 BUDGET THE PAYLOAD (the #1 cause of garbage):** the design API 400s on oversized context. A shell-dependent
page can pull in a 1000+ line header + 1000+ line page + 900+ line `globals.css` — that WILL 400. So **line-range
every >1000-line file to its render section** (header → its `<header>` JSX block; page → the render branch you
chose; and prefer `.superdesign/init/theme.md` over the whole `globals.css`). Pass complete files only for
normal-sized ones.

ONLY after the design-system layer is complete: **create the project → pixel-perfect reproduction draft →
branch variations → return the preview / canvas URL.** The reproduction prompt must describe the page's REAL
structure/content from the branch you read — NOT design-system adjectives ("premium / amber gradient / Playfair"),
which make the model invent a generic page. Do not narrate intermediate steps; the next thing the user hears is
the finished preview link (or a blocking question / error).

**On a 400 / failure: trim the BIG files to their render sections and retry the SAME faithful call.** NEVER retry
with a thinned/simpler-prompt/minimal context to force it through — a reproduction off thin context is invention,
not reproduction, and produces a garbage on-brand page. If you genuinely cannot fit the real page, STOP and tell
the user the exact error — do not ship an invented draft. Never stop silently, and
never leave the user without the preview link.
