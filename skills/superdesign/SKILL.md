---
name: superdesign
description: "Design or redesign frontend UI on the Superdesign canvas. Use whenever the user wants to design a page, feature, flow, or a brand-new product with no code yet; redesign or improve existing UI; faithfully reproduce current UI; explore visual variants; set or extract a design system (including borrowing a style from a live website URL); build reusable design components; design multi-page flows; or create static posters, flyers, cover art, or social/marketing graphics composed on canvas, even if they never say the word 'design tool'."
---

Superdesign helps you (1) find design inspirations/styles and (2) generate/iterate design drafts on an infinite canvas.

---

# Core scenarios (what this skill handles)

1. **"superdesign init"** (the user asking for repo analysis) — analyze the repo and build UI context to `.superdesign/init/`. This is this skill's own analysis pass; the CLI's `init` command is a different thing entirely (it installs skill files) — never run it to build `.superdesign/init/`.
2. **Help me design X** (feature/page/flow) — the target decides the SOP: an existing rendered page is reproduced first (ground truth), while a brand-new page (in a real repo or from scratch) is designed directly with no reproduction step; see UI TARGET ROUTING in [SUPERDESIGN.md](references/SUPERDESIGN.md)
3. **Set design system** (optionally seed or refresh it from a live site via `extract-website --design-md` — you'll choose *create-from / inspired-by / update-existing*, asking first if a `design-system.md` already exists; see [SUPERDESIGN.md](references/SUPERDESIGN.md) SOP: BRAND NEW PROJECT Step 2)
4. **Help me improve design of X**
5. **Make a poster / marketing asset** (flyer, cover art, social feed post, story, channel cover, thumbnail, ad creative) — a static artwork, not a page. Skip repo init/analysis; read [GRAPHIC.md](references/GRAPHIC.md) and follow it (you generate the key visual with your own image tool, upload it, then compose the artwork on a fixed canvas; platform dimension table included).
6. **Design from a live website / reference URL** (borrow a style, restyle, recombine, or plan a rebuild) — extract a reference site's design DNA (style guide, design tokens, content structure, brand assets, a static reference clone) with `extract-website`, then design with it. Read [WEBSITE.md](references/WEBSITE.md) and follow its recipes. Note: via the CLI a "recreate"/"clone" is a **style-informed rebuild** — faithful pixel-recreation and *editable* on-canvas clones are done in the Superdesign app (superdesign.dev), not the CLI.
7. **Design with your own model** — when the user explicitly asks, or `create-design-draft` / `iterate-design-draft` still fails after one retry, follow [design-with-your-model.md](references/design-with-your-model.md) to author and import the draft yourself.
8. **Work on an initialized target** — whenever a real-codebase UI request addresses a target already recorded in `.superdesign/resume.json`, try the durable path in [RESUME.md](references/RESUME.md) before any cold repo/context discovery. This is state-driven, not dependent on words such as "continue" or "refine".

# Step 0 — Environment preflight (BEFORE any CLI step)

Superdesign runs entirely through its CLI, so you must be able to execute shell commands. Confirm that capability first, before any CLI verification.

If you have no way to run shell commands in this environment (no terminal/execution tool at all), OR your very first bare `npx --yes @superdesign/cli@latest` preflight attempt fails because command execution itself is unavailable (the harness reports it cannot run commands / there is no shell) then STOP. Do NOT keep retrying or improvise workarounds. Tell the user once, and pick the message that matches where you are running:

- **Standard ChatGPT chat without Work Mode tools** — this exact copy, because the Work tab is the fix:

  ```text
  Chat isn't supported by the Superdesign plugin. Please switch to the Work tab and paste this prompt in for the full experience.
  ```

- **Any other harness** (a coding agent whose shell is unavailable or disabled) — do NOT send the ChatGPT copy; there is no Work tab to switch to. Say plainly that Superdesign drives its CLI over the shell, that this session cannot run shell commands, and that they can re-run it in a session with shell access or design in the web app at https://superdesign.dev.

# Step 1 — Is there a codebase to analyze?

Two entry paths. Choose one with this cheap, deterministic check BEFORE any init or design work.

**No meaningful codebase** (empty workspace, scratch/sandbox dir, no frontend code) — treat the workspace as "no codebase" when ALL of these hold:

- No `.superdesign/init/` files already exist, AND
- No dependency manifest with frontend deps (no `package.json`, or a `package.json` whose deps include no frontend framework/UI library — react, vue, svelte, angular, next, nuxt, astro, etc.), AND
- No frontend source found (a quick scan for `.tsx`/`.jsx`/`.vue`/`.svelte` files, any `.html`/`.css` files such as a root `index.html` + `style.css`, or a `src/`/`app/`/`components/` dir with UI files, turns up nothing).

→ SKIP repo init entirely. Do NOT "analyze" an empty sandbox, and do NOT ask the user to point you at a repo they don't have. Instead, gather design context conversationally FIRST: ask what they want to build, the target audience/platform, style/brand preferences, and any reference designs or inspirations. Then design from that conversation via the **BRAND NEW PROJECT** path in [SUPERDESIGN.md](references/SUPERDESIGN.md).

**Real codebase present** (any frontend code, or an existing `.superdesign/init/`) — repo init must have completed at least once before designing. Reuse a valid initialized target through Step 1.5; run the full analysis only when init is incomplete or warm state cannot be used.

**Exception — standalone extraction:** if the task is ONLY to extract a site's design DNA or set/refresh `design-system.md` from a URL (`extract-website` → `design-system.md`, no design generation; read [WEBSITE.md](references/WEBSITE.md) for the recipes), run it WITHOUT repo init — extracting an external site's style doesn't require analyzing the user's codebase. Init is still required before generating designs FOR the existing codebase's UI (reproducing/redesigning an existing page).

**Exception — graphics:** posters/marketing assets (scenario 5) skip init even in a real codebase — the brief carries the style, and most of init's output (components, layouts, routes, pages) has no bearing on a fixed-canvas artwork. The graphic brief round asks whether the artwork should be on-brand with this repo's product ([GRAPHIC.md](references/GRAPHIC.md) Step 1); only an on-brand "yes" pulls in the design-system/brand context — running init first only if that context doesn't already exist.

# Step 1.5 — Resume before rediscovery (real-codebase UI path)

Before reading init artifacts or source files, check `.superdesign/resume.json` for the requested route/feature. A matching target defaults to [RESUME.md](references/RESUME.md) regardless of whether the user says "continue", "change", "redesign", or gives only a direct instruction such as "make the dashboard darker". Intent phrasing never decides warm versus cold routing.

Apply the saved target's trust/structural checks FIRST. A safe, structurally valid target reuses the saved project, draft, component records, design direction, and exact `--context-file` bundle: matching hashes go to warm resume, while mismatches go to incremental refresh without cold rediscovery. If a request needs code understanding not captured by the active draft metadata, use RESUME.md's targeted context-expansion rule; do not rerun full discovery merely to understand that request.

Use the cold path only when no saved entry covers the requested target, the user explicitly asks to start over from fresh ground truth, the state is unsafe/structurally invalid, or targeted repair determines it is stale beyond incremental repair. A new agent session, different wording, or a fingerprint mismatch alone never forces cold routing.

# Init: Repo Analysis (real-codebase path)

When a real codebase is present (per Step 1, and neither Step 1 exception — standalone extraction, graphics — applies) and init is NOT complete, you MUST automatically:

1. Create the `.superdesign/init/` directory
2. Read [INIT.md](references/INIT.md)
3. Follow its instructions to analyze the repo and write context files

**Init-complete test (one decidable rule, used everywhere):** init is complete only if all six named files below exist AND are non-empty. A directory that is missing any of them, or holds an empty one (e.g. an interrupted init), is NOT complete — rerun the full init, which regenerates all six; overwriting existing files is expected and fine.

Do NOT ask the user to do this manually — just do it.

# Init Files (cold/stale context path)

For a first design of a target, or after [RESUME.md](references/RESUME.md) determines that saved context is stale/unusable, read all six files before collecting the target context:

- `components.md` — shared UI primitives with full source code
- `layouts.md` — shared layout components (nav, sidebar, header, footer)
- `routes.md` — page/route mapping
- `theme.md` — design tokens, CSS variables, Tailwind config
- `pages.md` — page component dependency trees (which files each page needs)
- `extractable-components.md` — components that can be extracted as reusable DraftComponents

On a valid warm resume, only check that all six files exist and are non-empty — do NOT read their contents. Reuse the target's saved context bundle; read only narrowly selected source files when [RESUME.md](references/RESUME.md) explicitly triggers targeted context expansion.

**When cold-designing an existing page**: First check `pages.md` for the page's dependency tree — the candidate set of `--context-file` files. Pass them under the PAYLOAD BUDGET rules in [SUPERDESIGN.md](references/SUPERDESIGN.md) so the payload does not 400. Then also add the globals.css tokens, tailwind.config, and design-system.md. Persist the final selection per [RESUME.md](references/RESUME.md).

# Superdesign CLI (MUST use before any command)

**IMPORTANT: Run the CLI on demand with `npx --yes @superdesign/cli@latest`. Start every session with the bare command — it IS the preflight.**

1. Preflight once:
   ```
   npx --yes @superdesign/cli@latest
   ```
   The bare command verifies everything in one shot: that the CLI runs at all, an `auth:` status line (`authenticated as team "…"` vs `not authenticated — run superdesign login`), and a list of recent projects. On a valid warm resume, use the saved `projectId`/`activeDraftId` directly. Otherwise read the recent-project list when deciding whether to reuse an existing project or `create-project`; `fetch-design-nodes --project-id <id>` is the fallback for recovering draft ids when durable resume state is unavailable or rejected.

2. If the `auth:` line says not authenticated, run login NOW, before any real command:
   ```
   npx --yes @superdesign/cli@latest login
   ```
   Wait for login to complete successfully before proceeding.

3. Run the intended commands with the same `npx --yes @superdesign/cli@latest` prefix. A session can still expire mid-flow — handle a later auth/login error per the failure block below.

> **Never assume the user is already logged in** — read the preflight's `auth:` line instead of guessing or probing with real commands.

## When a command fails

- **Auth/login error** (the CLI ran but rejected the session): run `login` (above), then retry the intended command ONCE. If login itself fails (headless/no-browser auth, expired flow, user declines), tell the user plainly and STOP — do not keep retrying or improvise.
- **`extract-website` fails or times out** (it can take ~60–120s): retry ONCE. If it still fails, offer to continue WITHOUT the extraction (design from the conversation / existing design system) rather than blocking.
- **General rule:** retry a failed command at most once. If `create-design-draft` or `iterate-design-draft` still fails, continue via [design-with-your-model.md](references/design-with-your-model.md); otherwise report the failure and stop.

## Command examples

Always use the full on-demand runner prefix, e.g.:

```bash
npx --yes @superdesign/cli@latest create-project --title "X"
```

Full invocations live at their use sites — the SOPs in [SUPERDESIGN.md](references/SUPERDESIGN.md) and the graphic steps in [GRAPHIC.md](references/GRAPHIC.md); flag sets come from `<command> --help`, and the COMMAND CONTRACT in [SUPERDESIGN.md](references/SUPERDESIGN.md) covers the traps help leaves out.

The CLI defaults to an agent-optimized output (compact TOON plus `help[]` next-step hints); add `--json` only when you need the full machine-readable payload.

# Surface the canvas URL

Every project/draft command's default output includes a `canvas:` link (the project canvas, `https://superdesign.dev/teams/<teamId>/projects/<projectId>`) and, for drafts, a `preview:` link (`https://superdesign.dev/preview/draft/<draftId>`). Read these from the command output — do NOT hand-construct them (the ids are server-generated).

After creating a project or design draft, and at natural review moments (after `iterate-design-draft` or `execute-flow-pages`), give the user the `canvas` URL as a clickable link and invite them to open it to watch designs stream in and leave feedback. Adding `?live=1` to the canvas URL opens the live view where drafts appear as they generate.

## Browser Choice

`create-project` auto-opens the canvas in user's browser by default. Leave it on, and tell the user the canvas was opened (with the `canvas` URL as a clickable link). Only pass `--no-open` when there's no user-facing browser (CI, headless).

# After generating: offer to go further

Always close with a short, warm follow-up that offers to go further (on every surface). Ask one question with 2 to 3 concrete options tailored to what you just made, not a generic list. For example: try a different hero image or key visual direction, try an alternate layout or composition, or generate a few more variations or asset ideas as surprises. Only generate after the user picks, since every generation spends credits.

(Graphics get a dedicated one-round visual self-review before this close — [GRAPHIC.md](references/GRAPHIC.md) Step 5. UI drafts are reviewed by the user on the canvas.)

# How it works

Read [SUPERDESIGN.md](references/SUPERDESIGN.md), then follow its instructions.
