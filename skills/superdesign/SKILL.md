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

If you are in the ChatGPT/Codex web app (or network requests to Superdesign repeatedly time out), stop there and send the user to the desktop app.

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
- Recommend trying all three — generated as parallel variants for side-by-side comparison on the canvas — while noting that picking just one (or two) is a fine choice if they prefer. Only generate after the user responds. **When the user accepts the "try all three" recommendation, that counts as explicitly asking for 3 variants** (this is the sanctioned way to exceed the default 2 — see the VARIANT COUNT rule in `references/SUPERDESIGN.md`); generate the three as parallel variants.
- When the request already carries detailed constraints or an explicit style, SKIP the divergence and follow the user's spec directly — this default is only for underspecified asks.

This applies across every scenario (pages, flows, posters/graphics), on both entry paths. It pairs with the after-generation follow-up: diverge before the first generation, offer to go further after it.

**On the graphic path the divergence is NOT a separate round.** The graphic workflow confirms its brief in ONE round (`references/GRAPHIC.md` Step 1), so fold the three directions INTO that single brief-confirmation round: present three distinct directions — each carrying its own layout/style/asset-plan — while the shared copy and canvas are confirmed once. Do not add a second confirmation round.

# Init: Repo Analysis (real-codebase path)

When a real codebase is present (per Step 1) and init is NOT complete, you MUST automatically:

1. Create the `.superdesign/init/` directory
2. Read `references/INIT.md` relative to this selected `SKILL.md`
3. Follow its instructions to analyze the repo and write context files

**Init-complete test (one decidable rule, used everywhere):** init is complete only if all six init slots below are satisfied AND non-empty. Five are files in `.superdesign/init/`; the sixth is the DESIGN.md slot — a valid `DESIGN.md` available (the project's own, or the one init generated) plus its `theme-raw.md` sidecar (see `references/INIT.md` step 5 for the full rule). A slot that is missing, or an empty file (e.g. an interrupted init), is NOT complete — rerun the full init, which regenerates our own files; overwriting them is expected and fine, but init NEVER overwrites a pre-existing valid project `DESIGN.md` (it consumes that read-only).

Do NOT ask the user to do this manually — just do it.

# Mandatory Init Files

If init is complete (all six files present and non-empty), you MUST read ALL of them FIRST before any design task:

- `components.md` — shared UI primitives with full source code
- `layouts.md` — shared layout components (nav, sidebar, header, footer)
- `routes.md` — page/route mapping
- `DESIGN.md` — normative design tokens (YAML front matter) + design rationale, in the interoperable DESIGN.md format (detection order: repo root, then `docs/`, then `.superdesign/init/`); its `theme-raw.md` sidecar holds the raw CSS/Tailwind dumps. See `references/DESIGNMD-SPEC.md`.
- `pages.md` — page component dependency trees (which files each page needs)
- `extractable-components.md` — components that can be extracted as reusable DraftComponents

**When designing for an existing page**: First check `pages.md` for the page's dependency tree — the candidate set of `--context-file` files. Pass them under the PAYLOAD BUDGET rules in `references/SUPERDESIGN.md` (line-range ~900+ line files to their render/token sections; drop files with no visual bearing) so the payload does not 400. Then also add the design tokens (the `DESIGN.md` YAML front matter, or the globals.css `:root`/`.dark` block), tailwind.config, and design-system.md.

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

> **Never assume the user is already logged in.** There is no separate "verify login" command — your `--version` check plus reacting to an auth/login error on the first real command IS the verification. Do not try to run a whoami/status check; just run the intended command and handle an auth error per the failure block below.

## When a command fails

- **Auth/login error** (the CLI ran but rejected the session): run `login` (above), then retry the intended command ONCE. If login itself fails (headless/no-browser auth, expired flow, user declines), tell the user plainly and STOP — do not keep retrying or improvise.
- **`search-prompts` returns zero results**: proceed WITHOUT a library style prompt (note that to the user) — do not keep searching; the flow works fine without one.
- **`extract-website` fails or times out** (it can take ~60–120s): retry ONCE. If it still fails, offer to continue WITHOUT the extraction (design from the conversation / existing design system) rather than blocking.
- **General rule:** retry a failed command at most once, then report the failure to the user and stop — never silently loop or fall back to inventing output.

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

When you are running **inside Codex with the built-in Browser side panel available**, drop the finished design straight into that panel so the user can view and hand-tweak it immediately — no login step for them. After completing design work (a draft/flow the user is ready to look at), use this flow only when the capability test below passes.

**Browser capability test (decidable — all must hold):** use the in-app Browser embedded flow ONLY if you have a host-provided in-app-browser tool that (a) explicitly controls the user-visible Codex Browser side panel (not an external/headless browser), AND (b) can navigate to a URL, AND (c) can inspect the selected tab's URL and its rendered page (screenshot or page inspection). If any of these is missing or fails, do NOT mint or open the embed link — fall back: surface the clean `canvasUrl` (from `canvas-link`, or the `canvas:` link in any command's output) to the user as a clickable link and continue with the normal non-embedded review flow. Also fall back this way if `canvas-link` itself is unavailable in the CLI — surface the clean `canvas:` URL from the command output instead.

1. **Mint the URL:** run `npx --yes @superdesign/cli@latest canvas-link <projectId>`. It mints a code and prints two URLs (with their own usage annotations): an `embedCanvasUrl` and a `canvasUrl`. (If `canvas-link` is not available, fall back to the clean `canvas:` URL as above.)
2. **Open `embedCanvasUrl` specifically in the Codex in-app Browser.** It auto-signs-in to a restricted embedded canvas — view + manual edit only, no chat/agent, no navigation — so the user can see and manually edit the design right away, no login needed.
   - Make the in-app Browser visible to the user.
   - Keep the canvas tab open as a user-facing deliverable.
   - Verify that the selected tab's URL is the embedded canvas URL.
3. **Do NOT use external Chrome, system `open`, Playwright launched from the shell, or Chrome DevTools automation for this step.** Those surfaces may navigate successfully without opening Codex's visible Browser panel — the navigation "succeeds" but the user sees nothing.

`create-project` always auto-opens the user's system browser by default (the canvas URL is printed either way). **Decidable rule: if you — the agent — are running the command rather than a human typing it at their own shell, pass `--no-open`** and surface the printed URL yourself. That covers Codex, Claude Code in a terminal, CI, and every agent-driven surface; it prevents an uncontrolled system-browser pop mid-session. In Codex specifically, after `--no-open` you then show the canvas through this embedded flow (`canvas-link`, then open `embedCanvasUrl` in the Browser panel) — THE way to surface the canvas in Codex.

Rules:

- **The embedded canvas has no chat/agent.** All generation and iteration keep happening from THIS coding-agent session (`create-design-draft` / `iterate-design-draft` / `execute-flow-pages` as usual); the panel is a view-and-manual-edit surface only.
- **Never surface `embedCanvasUrl` to a human or open it in a normal external browser.** It auto-signs-in whoever opens it, so it is an agent-surface-only link. Any link you give a person, or open outside the Browser panel, MUST be the clean, durable `canvasUrl` (it requires login, like every other canvas URL you surface).
- **The `embedCanvasUrl` stays valid for about an hour** and can be opened again from this conversation during that window — reopening it, or opening it in another tab, works fine. Once it expires, the embedded session shows a panel asking the user to have the agent re-open it; just re-run `canvas-link` and open the fresh `embedCanvasUrl`.

# After generating: self-review, then offer to go further

This applies on EVERY surface, not only the Codex embedded canvas.

**Visual self-review (when you can safely inspect).** If you have a safe visual-inspection capability for the rendered result — the Codex Browser panel's page inspection/screenshot, or any sandboxed screenshot/preview tool your host provides — treat every design generation round (`create-design-draft` / `iterate-design-draft` / `execute-flow-pages`) as unfinished until you have looked at it yourself:

1. **Look at it.** Inspect the rendered page. Judge it as a designer would: layout breakage, overflow or clipping, contrast and readability, typography scale, spacing rhythm, leftover placeholder or filler content, and image fit.
2. **Fix once if needed.** If you spot concrete issues, run EXACTLY ONE optimization iteration (`iterate-design-draft --mode replace`, correcting the just-generated draft in place — see the TOOL USE RULE exemption in `references/SUPERDESIGN.md`) that addresses them, then re-check the result. One round only: never keep looping on your own.
3. **Present.** Show the result to the user (with the canvas visible in the Browser panel when on the Codex embedded surface).

**Never self-review the Step 3a pixel-perfect reproduction draft.** A reproduction's job is to match the current UI, not to look "better" — "fixing" it toward your taste corrupts the ground truth. Reproduction problems mean missing/wrong context, not styling; address them by fixing the context files and regenerating, not by an optimization pass. This self-review is for design (Step 3b) and graphic drafts only.

**If you CANNOT safely inspect the rendered result**, do not guess and do not imply you checked. Present the preview/canvas link and say plainly that you have not visually verified it, inviting the user to review.

**Then always close with a short, warm follow-up that offers to go further** (on every surface). Ask one question with 2 to 3 concrete options tailored to what you just made, not a generic list. For example: try a different hero image or key visual direction, try an alternate layout or composition, or generate a few more variations or asset ideas as surprises. Only generate after the user picks, since every generation spends credits.

# How it works

Read `references/SUPERDESIGN.md` relative to this selected `SKILL.md`, then follow its instructions.
