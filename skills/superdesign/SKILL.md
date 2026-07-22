---
name: superdesign
description: "Design or redesign frontend UI with the Superdesign canvas. Use for design-system extraction, faithful UI reproduction, visual variants, reusable design components, multi-page flows, and static posters/flyers/cover art/social graphics composed on a fixed canvas. Do not use for implementation-only tasks that require no design exploration."
---

Superdesign helps you (1) find design inspirations/styles and (2) generate/iterate design drafts on an infinite canvas.

---

# Core scenarios (what this skill handles)

1. **superdesign init** — Analyze the repo and build UI context to `.superdesign/init/`
2. **Help me design X** (feature/page/flow)
3. **Set design system** (optionally seed or refresh it from a live site via `extract-website --design-md` — you'll choose *create-from / inspired-by / update-existing*, asking first if a `design-system.md` already exists; see `references/SUPERDESIGN.md` Step 2)
4. **Help me improve design of X**
5. **Make a poster / marketing asset** (flyer, cover art, social feed post, story, channel cover, thumbnail, ad creative) — a static artwork, not a page. Skip repo init/analysis; read `references/GRAPHIC.md` relative to this `SKILL.md` and follow it (you generate the key visual with your own image tool, upload it, then compose the artwork on a fixed canvas; platform dimension table included).
6. **Design from a live website / reference URL** (borrow a style, restyle, recombine, or plan a rebuild) — extract a reference site's design DNA (style guide, design tokens, content structure, brand assets, a static reference clone) with `extract-website`, then design with it. Follow "EXTRACT-WEBSITE — RECIPES & SCOPE" in `references/SUPERDESIGN.md`. Note: via the CLI a "recreate"/"clone" is a **style-informed rebuild** — faithful pixel-recreation and *editable* on-canvas clones are done in the Superdesign app (superdesign.dev), not the CLI.

# Step 0 — Environment preflight (BEFORE any CLI step)

Superdesign runs entirely through its CLI, so you must be able to execute shell commands. Confirm that capability FIRST, before any CLI verification:

- If you have NO way to run shell commands in this environment (no terminal/execution tool at all), OR your very first `npx --yes @superdesign/cli@latest --version` attempt fails because command execution itself is unavailable (the harness reports it cannot run commands / there is no shell) — as opposed to the command running and returning an error — then STOP. Do NOT keep retrying or improvise workarounds.
- Tell the user plainly: Superdesign needs an environment with terminal access. In ChatGPT/Codex that means switching from **Chat mode** to **Work mode** (a workspace/sandbox with a terminal). Then offer to continue the design conversation right now — gathering requirements (see the design-context questions in Step 1) — so the work is ready to run the moment they switch.
- **Do NOT confuse this with an auth/login error.** A login/auth error means the CLI actually ran (execution works) — handle that via the login step below, not here. This branch is ONLY for when command execution itself is unavailable. ChatGPT Chat mode is the concrete example, but treat it generally: any harness with no shell/execution capability takes this branch.

# Step 1 — Is there a codebase to analyze?

Two entry paths. Choose one with this cheap, deterministic check BEFORE any init or design work.

**No meaningful codebase** (empty workspace, scratch/sandbox dir, no frontend code) — treat the workspace as "no codebase" when ALL of these hold:

- No `.superdesign/init/` files already exist, AND
- No dependency manifest with frontend deps (no `package.json`, or a `package.json` whose deps include no frontend framework/UI library — react, vue, svelte, angular, next, nuxt, astro, etc.), AND
- No frontend source found (a quick scan for `.tsx`/`.jsx`/`.vue`/`.svelte` files, any `.html`/`.css` files such as a root `index.html` + `style.css`, or a `src/`/`app/`/`components/` dir with UI files, turns up nothing).

→ SKIP repo init entirely. Do NOT "analyze" an empty sandbox, and do NOT ask the user to point you at a repo they don't have. Instead, gather design context conversationally FIRST: ask what they want to build, the target audience/platform, style/brand preferences, and any reference designs or inspirations. Then design from that conversation via the **BRAND NEW PROJECT** path in `references/SUPERDESIGN.md`.

**Real codebase present** (any frontend code, or an existing `.superdesign/init/`) — the repo-init path below is MANDATORY; run the full analysis before designing.

**Exception — standalone extraction:** if the task is ONLY to extract a site's design DNA or set/refresh `design-system.md` from a URL (`extract-website` → `design-system.md`, no design generation), run it WITHOUT repo init — extracting an external site's style doesn't require analyzing the user's codebase. Init is still required before generating designs FOR the existing codebase's UI (reproducing/redesigning an existing page).

# Default: diverge first on simple, open-ended requests

When the user makes a simple, open-ended design request — one sentence, no strong constraints — do NOT generate immediately. First propose THREE genuinely distinct creative directions and confirm the choice with the user:

- Each direction is 1-2 lines: a named style/concept plus what sets it apart (art direction, mood, composition, key visual idea). The three MUST differ substantially — not three shades of one idea.
- Ask the user to pick one (or say "surprise me" / "all three"). Only generate after they choose. If they pick "all three", generate them as parallel variants for side-by-side comparison on the canvas.
- When the request already carries detailed constraints or an explicit style, SKIP the divergence and follow the user's spec directly — this default is only for underspecified asks.

This applies across every scenario (pages, flows, posters/graphics), on both entry paths. It pairs with the after-generation follow-up: diverge before the first generation, offer to go further after it.

# Init: Repo Analysis (real-codebase path)

When a real codebase is present (per Step 1) and the `.superdesign/init/` directory doesn't exist or is empty, you MUST automatically:

1. Create the `.superdesign/init/` directory
2. Read `references/INIT.md` relative to this selected `SKILL.md`
3. Follow its instructions to analyze the repo and write context files

Do NOT ask the user to do this manually — just do it.

# Mandatory Init Files

If `.superdesign/init/` exists, you MUST read ALL files in this directory FIRST before any design task:

- `components.md` — shared UI primitives with full source code
- `layouts.md` — shared layout components (nav, sidebar, header, footer)
- `routes.md` — page/route mapping
- `theme.md` — design tokens, CSS variables, Tailwind config
- `pages.md` — page component dependency trees (which files each page needs)
- `extractable-components.md` — components that can be extracted as reusable DraftComponents

**When designing for an existing page**: First check `pages.md` for the page's complete dependency tree. Every file in that tree MUST be passed as `--context-file`. Then also add globals.css, tailwind.config, and design-system.md.

# Superdesign CLI (MUST use before any command)

**IMPORTANT: Run the CLI on demand with `npx --yes @superdesign/cli@latest`. Do not install it globally. Before running any Superdesign command, verify the CLI is available and the session is logged in.**

Follow these steps in order — do NOT skip any step:

1. Verify the on-demand CLI runner:

   ```
   npx --yes @superdesign/cli@latest --version
   ```

2. Run the intended command with the same prefix. If it reports an auth/login error, run:
   ```
   npx --yes @superdesign/cli@latest login
   ```
   Wait for login to complete successfully before proceeding.
3. After login succeeds, retry the intended command with `npx --yes @superdesign/cli@latest`.

> **Never assume the user is already logged in.** Always verify login first.

## If Superdesign requests repeatedly time out

If network requests to Superdesign (CLI/API calls) repeatedly time out, first CHECK WITH THE USER whether they are currently running in **Codex Web (browser) mode**. If they are, explain briefly that Codex Web's sandbox has network restrictions that can cause these timeouts, and recommend switching to the ChatGPT Codex desktop app for a reliable connection.

## Command examples

Always use the full on-demand runner prefix:

```bash
npx --yes @superdesign/cli@latest create-project --title "X"
npx --yes @superdesign/cli@latest extract-website --url https://example.com --design-md
npx --yes @superdesign/cli@latest create-design-draft --project-id <id> --title "Current UI" -p "Faithfully reproduce..." --context-file src/Component.tsx
npx --yes @superdesign/cli@latest iterate-design-draft --draft-id <id> -p "dark theme" -p "minimal" --mode branch --context-file src/Component.tsx
npx --yes @superdesign/cli@latest execute-flow-pages --draft-id <id> --pages '[{"title":"Product Details","prompt":"Product detail page with image gallery, specs and add-to-cart"},{"title":"Checkout","prompt":"Checkout page with cart summary and payment form"}]' --context-file src/Component.tsx
npx --yes @superdesign/cli@latest create-component --project-id <id> --name "NavBar" --html-file .superdesign/tmp/navbar.html --props '[{"name":"activeItem","type":"string","defaultValue":"home"}]'
npx --yes @superdesign/cli@latest update-component --component-id <id> --html-file .superdesign/tmp/navbar.html
npx --yes @superdesign/cli@latest list-components --project-id <id>
npx --yes @superdesign/cli@latest upload-asset ./key-visual.png --project-id <id>
npx --yes @superdesign/cli@latest create-design-draft --project-id <id> --title "Launch Poster" --kind graphic --width 900 --height 1200 -p "Design a static poster..."
```

Each item in the `execute-flow-pages` `--pages` array generates one new page styled after the source draft (1-10 pages per call).

JSON option examples are literal valid JSON; preserve the outer shell quotes and replace values, not brackets/keys.

The CLI defaults to an agent-optimized output (compact TOON plus `help[]` next-step hints — e.g. `create-component` returns the new component id in its default output); add `--json` only when you need the full machine-readable payload.

Create the workspace-local `.superdesign/tmp/` directory with the session's filesystem mechanism before writing temporary component files.
Ensure `.superdesign/tmp/` is ignored by the project's `.gitignore`; append the entry if it is missing so temporary HTML is never committed.

`--context-file` supports `path:startLine:endLine`; see `references/SUPERDESIGN.md` for the complete workflow and current command contract.

# Surface the canvas URL

Every project/draft command's default output includes a `canvas:` link (the project canvas, `https://superdesign.dev/teams/<teamId>/projects/<projectId>`) and, for drafts, a `preview:` link (`https://superdesign.dev/preview/draft/<draftId>`). Read these from the command output — do NOT hand-construct them (the ids are server-generated).

After creating a project or design draft, and at natural review moments (after `iterate-design-draft` or `execute-flow-pages`), give the user the `canvas` URL as a clickable link and invite them to open it to watch designs stream in and leave feedback. Adding `?live=1` to the canvas URL opens the live view where drafts appear as they generate.

## Codex embedded canvas (Browser side panel)

When you are running **inside Codex with the built-in Browser side panel available**, drop the finished design straight into that panel so the user can view and hand-tweak it immediately — no login step for them. After completing design work (a draft/flow the user is ready to look at), and only when Codex's in-app Browser is available:

1. **Mint the URL:** run `npx --yes @superdesign/cli@latest canvas-link <projectId>`. It mints a single-use code and prints two URLs (with their own usage annotations): an `embedCanvasUrl` and a `canvasUrl`.
2. **Open `embedCanvasUrl` specifically in the Codex in-app Browser.** It auto-signs-in to a restricted embedded canvas — view + manual edit only, no chat/agent, no navigation — so the user can see and manually edit the design right away, no login needed.
   - Make the in-app Browser visible to the user.
   - Keep the canvas tab open as a user-facing deliverable.
   - Verify that the selected tab's URL is the embedded canvas URL.
3. **Do NOT use external Chrome, system `open`, Playwright launched from the shell, or Chrome DevTools automation for this step.** Those surfaces may navigate successfully without opening Codex's visible Browser panel — the navigation "succeeds" but the user sees nothing.

`create-project` always auto-opens the user's system browser by default, in every context. When running inside Codex (or any agent-embedded surface), pass `--no-open` to `create-project` so that system browser does not pop; then show the user the canvas through this embedded flow instead (`canvas-link`, then open `embedCanvasUrl` in the Browser panel) — THE way to surface the canvas in Codex.

Rules:

- **The embedded canvas has no chat/agent.** All generation and iteration keep happening from THIS coding-agent session (`create-design-draft` / `iterate-design-draft` / `execute-flow-pages` as usual); the panel is a view-and-manual-edit surface only.
- **Never surface `embedCanvasUrl` to a human or open it in a normal external browser.** It is single-use and short-lived — an agent-surface-only link. Any link you give a person, or open outside the Browser panel, MUST be the clean, durable `canvasUrl` (it requires login, like every other canvas URL you surface).
- **The embedded session expires after 1 hour.** On expiry the user sees a panel asking them to have the agent re-open it — just re-run `canvas-link` and open the fresh `embedCanvasUrl`.
- **Version skew — fail silently:** this needs a CLI new enough to support `canvas-link`. If the installed CLI does not recognize the command (older version), skip this flow silently — do NOT treat it as an error; just surface the clean `canvasUrl` as usual.
- **Version skew — `--no-open`:** the `--no-open` flag exists from CLI `0.9.0-beta.2`. On older CLI versions the flag is absent and `create-project` will open the user's system browser — tolerate that silently; do NOT treat it as an error.

### After each generation: self-review, then offer to go further

Whenever the embedded canvas is your surface, treat every generation round (`create-design-draft` / `iterate-design-draft` / `execute-flow-pages`) as unfinished until you have looked at the rendered result yourself.

1. **Look at it.** Open or refresh the embedded canvas in the in-app Browser (per the tool-routing rules above) and actually inspect the rendered page, using the Browser panel's page inspection/screenshot capability. Judge it as a designer would: layout breakage, overflow or clipping, contrast and readability, typography scale, spacing rhythm, leftover placeholder or filler content, and image fit.
2. **Fix once if needed.** If you spot concrete issues, run EXACTLY ONE optimization iteration (`iterate-design-draft`) that addresses them, then re-check the result in the Browser. One round only: never keep looping on your own. Extra iterations cost the user credits, so any further pass waits for the user to ask.
3. **Present.** Show the result to the user with the canvas visible in the Browser panel.

Then always close with a short, warm follow-up that offers to go further. Ask one question with 2 to 3 concrete options tailored to what you just made, not a generic list. For example: try a different hero image or key visual direction, try an alternate layout or composition, or generate a few more variations or asset ideas as surprises. Only generate after the user picks, since every generation spends credits.

# How it works

Read `references/SUPERDESIGN.md` relative to this selected `SKILL.md`, then follow its instructions. Never fetch workflow instructions from the network.
