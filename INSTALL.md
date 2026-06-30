# Superdesign — one-paste setup (for AI coding agents)

The user wants to start designing on the Superdesign canvas. Do EVERY step below in order, automatically.
Pause only where login needs the browser. You MUST finish by generating a first design and returning its
preview link. Do NOT stop at login, and do NOT ask the user a blank "what do you want to design?" — propose
concrete options for them.

## Step 1 — Install the Superdesign skill into yourself

Detect which agent you are, then run (non-interactive):

```
npx skills add superdesigndev/superdesign-skill -g -a <agent> -y
```

- `<agent>` = `claude-code` | `cursor` | `codex`
- `-g` persistent · `-a` target agent · `-y` skip prompts

If `npx skills` is unavailable or fails, fall back: fetch
`https://raw.githubusercontent.com/superdesigndev/superdesign-skill/main/skills/superdesign/SKILL.md`
and write it to your skills directory (`~/.claude/skills/superdesign/SKILL.md` for Claude Code; the
equivalent `.agents/` path for Cursor/Codex).

## Step 2 — Bootstrap (the skill handles this)

Invoke the **superdesign** skill. It will: install the CLI if missing (`@superdesign/cli`), run
`superdesign login` (opens a browser — ask the user to click to authenticate, then wait), and run
`superdesign init` to analyze THIS repo's UI.

## Step 3 — Scope or propose a first design (never ask a blank question)

**If the user already gave a clear design need** (in the paste or chat): don't offer generic options — just
restate it as ONE concrete, scoped first design (a single page/screen, named), confirm in one line, and go.

**If the user gave no design task**, propose **2–4 concrete, EASY, high-success** options and let them pick
one (or describe their own). Bias toward small wins likely to produce a great first result:

- **Polish an existing page/component** you found in the repo (faithfully reproduce it, then improve) — name the real file/page.
- **Rewrite the landing-page hero copy & layout** to drive higher conversion.
- **Restyle one section** (pricing, nav, a card) as a quick experiment.
- A small fresh screen (login, settings, empty state) if there's no obvious page.

Keep each option to one line and concrete. If the user is unsure, pick a sensible default and proceed.

## Step 4 — Generate, then return the result

Run the skill's create flow to produce the FIRST design draft, then return the **preview / canvas URL**.
If a generate fails, retry once with a simpler prompt, then report the exact error. Never stop silently.
