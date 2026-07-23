---
name: superdesign
description: "Design or redesign frontend UI on the Superdesign canvas. Use whenever the user wants to design a page, feature, flow, or a brand-new product with no code yet; redesign or improve existing UI; faithfully reproduce current UI; explore visual variants; set or extract a design system (including borrowing a style from a live website URL); build reusable design components; design multi-page flows; or create static posters, flyers, cover art, or social/marketing graphics composed on canvas, even if they never say the word 'design tool'."
---

Superdesign helps you (1) find design inspirations/styles and (2) generate/iterate design drafts on an infinite canvas.

---

# Core scenarios (what this skill handles)

1. **superdesign init** — Analyze the repo and build UI context to `.superdesign/init/`
2. **Help me design X** (feature/page/flow) — the target decides the SOP: an existing rendered page is reproduced first (ground truth), while a brand-new page (in a real repo or from scratch) is designed directly with no reproduction step; see UI TARGET ROUTING in [SUPERDESIGN.md](references/SUPERDESIGN.md)
3. **Set design system** (optionally seed or refresh it from a live site via `extract-website --design-md` — you'll choose *create-from / inspired-by / update-existing*, asking first if a `design-system.md` already exists; see [SUPERDESIGN.md](references/SUPERDESIGN.md) SOP: BRAND NEW PROJECT Step 2)
4. **Help me improve design of X**
5. **Make a poster / marketing asset** (flyer, cover art, social feed post, story, channel cover, thumbnail, ad creative) — a static artwork, not a page. Skip repo init/analysis; read [GRAPHIC.md](references/GRAPHIC.md) and follow it (you generate the key visual with your own image tool, upload it, then compose the artwork on a fixed canvas; platform dimension table included).
6. **Design from a live website / reference URL** (borrow a style, restyle, recombine, or plan a rebuild) — extract a reference site's design DNA (style guide, design tokens, content structure, brand assets, a static reference clone) with `extract-website`, then design with it. Read [WEBSITE.md](references/WEBSITE.md) and follow its recipes. Note: via the CLI a "recreate"/"clone" is a **style-informed rebuild** — faithful pixel-recreation and *editable* on-canvas clones are done in the Superdesign app (superdesign.dev), not the CLI.

# Step 0 — Environment preflight (BEFORE any CLI step)

Superdesign runs entirely through its CLI, so you must be able to execute shell commands. Confirm that capability first, before any CLI verification.

If Superdesign is invoked in standard ChatGPT chat without Work Mode tools, do not start the workflow. Tell the user once:

```text
Chat isn't supported by the Superdesign plugin. Please switch to the Work tab and paste this prompt in for the full experience.
```

If you have no way to run shell commands in this environment (no terminal/execution tool at all), OR your very first `npx --yes @superdesign/cli@latest --version` attempt fails because command execution itself is unavailable (the harness reports it cannot run commands / there is no shell) then STOP. Do NOT keep retrying or improvise workarounds.

# Step 1 — Is there a codebase to analyze?

Two entry paths. Choose one with this cheap, deterministic check BEFORE any init or design work.

**No meaningful codebase** (empty workspace, scratch/sandbox dir, no frontend code) — treat the workspace as "no codebase" when ALL of these hold:

- No `.superdesign/init/` files already exist, AND
- No dependency manifest with frontend deps (no `package.json`, or a `package.json` whose deps include no frontend framework/UI library — react, vue, svelte, angular, next, nuxt, astro, etc.), AND
- No frontend source found (a quick scan for `.tsx`/`.jsx`/`.vue`/`.svelte` files, any `.html`/`.css` files such as a root `index.html` + `style.css`, or a `src/`/`app/`/`components/` dir with UI files, turns up nothing).

→ SKIP repo init entirely. Do NOT "analyze" an empty sandbox, and do NOT ask the user to point you at a repo they don't have. Instead, gather design context conversationally FIRST: ask what they want to build, the target audience/platform, style/brand preferences, and any reference designs or inspirations. Then design from that conversation via the **BRAND NEW PROJECT** path in [SUPERDESIGN.md](references/SUPERDESIGN.md).

**Real codebase present** (any frontend code, or an existing `.superdesign/init/`) — the repo-init path below is MANDATORY; run the full analysis before designing.

**Exception — standalone extraction:** if the task is ONLY to extract a site's design DNA or set/refresh `design-system.md` from a URL (`extract-website` → `design-system.md`, no design generation), run it WITHOUT repo init — extracting an external site's style doesn't require analyzing the user's codebase. Init is still required before generating designs FOR the existing codebase's UI (reproducing/redesigning an existing page).

# Default: diverge first on simple, open-ended requests

When the user makes a simple, open-ended design request — one sentence, no strong constraints — do NOT generate immediately. First propose THREE genuinely distinct creative directions and confirm the choice with the user:

- Each direction is 1-2 lines: a named style/concept plus what sets it apart (art direction, mood, composition, key visual idea). The three MUST differ substantially — not three shades of one idea.
- Recommend trying all three — generated as parallel variants for side-by-side comparison on the canvas — while noting that picking just one (or two) is a fine choice if they prefer. Only generate after the user responds. **When the user accepts the "try all three" recommendation, that counts as explicitly asking for 3 variants** (this is the sanctioned way to exceed the default 2 — see the VARIANT COUNT rule in [SUPERDESIGN.md](references/SUPERDESIGN.md)); generate the three as parallel variants.
- When the request already carries detailed constraints or an explicit style, SKIP the divergence and follow the user's spec directly — this default is only for underspecified asks.

This applies across every scenario (pages, flows, posters/graphics), on both entry paths. It pairs with the after-generation follow-up: diverge before the first generation, offer to go further after it.

**On the graphic path the divergence is NOT a separate round.** The graphic workflow confirms its brief in ONE round ([GRAPHIC.md](references/GRAPHIC.md) Step 1), so fold the three directions INTO that single brief-confirmation round: present three distinct directions — each carrying its own layout/style/asset-plan — while the shared copy and canvas are confirmed once. Do not add a second confirmation round.

# Init: Repo Analysis (real-codebase path)

When a real codebase is present (per Step 1) and init is NOT complete, you MUST automatically:

1. Create the `.superdesign/init/` directory
2. Read [INIT.md](references/INIT.md)
3. Follow its instructions to analyze the repo and write context files

**Init-complete test (one decidable rule, used everywhere):** init is complete only if all six named files below exist AND are non-empty. A directory that is missing any of them, or holds an empty one (e.g. an interrupted init), is NOT complete — rerun the full init, which regenerates all six; overwriting existing files is expected and fine.

Do NOT ask the user to do this manually — just do it.

# Mandatory Init Files

If init is complete (all six files present and non-empty), you MUST read ALL of them FIRST before any design task:

- `components.md` — shared UI primitives with full source code
- `layouts.md` — shared layout components (nav, sidebar, header, footer)
- `routes.md` — page/route mapping
- `theme.md` — design tokens, CSS variables, Tailwind config
- `pages.md` — page component dependency trees (which files each page needs)
- `extractable-components.md` — components that can be extracted as reusable DraftComponents

**When designing for an existing page**: First check `pages.md` for the page's dependency tree — the candidate set of `--context-file` files. Pass them under the PAYLOAD BUDGET rules in [SUPERDESIGN.md](references/SUPERDESIGN.md) (line-range ~900+ line files to their render/token sections; drop files with no visual bearing) so the payload does not 400. Then also add the globals.css tokens, tailwind.config, and design-system.md.

# Superdesign CLI (MUST use before any command)

**IMPORTANT: Run the CLI on demand with `npx --yes @superdesign/cli@latest`. Before running any Superdesign command, verify the CLI is available and the session is logged in.**

Follow these steps in order:

1. Verify the on-demand CLI runner:
   ```
   npx --yes @superdesign/cli@latest
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
- **`extract-website` fails or times out** (it can take ~60–120s): retry ONCE. If it still fails, offer to continue WITHOUT the extraction (design from the conversation / existing design system) rather than blocking.

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

`--context-file` supports `path:startLine:endLine`; see [SUPERDESIGN.md](references/SUPERDESIGN.md) for the complete workflow and current command contract.

# Surface the canvas URL

Every project/draft command's default output includes a `canvas:` link (the project canvas, `https://superdesign.dev/teams/<teamId>/projects/<projectId>`) and, for drafts, a `preview:` link (`https://superdesign.dev/preview/draft/<draftId>`). Read these from the command output — do NOT hand-construct them (the ids are server-generated).

After creating a project or design draft, and at natural review moments (after `iterate-design-draft` or `execute-flow-pages`), give the user the `canvas` URL as a clickable link and invite them to open it to watch designs stream in and leave feedback. Adding `?live=1` to the canvas URL opens the live view where drafts appear as they generate.

## Browser Choice

`create-project` auto-opens the canvas in user's browser by default. Leave it on, and tell the user the canvas was opened (with the `canvas` URL as a clickable link). Only pass `--no-open` when there's no user-facing browser (CI, headless).

### After generating: self-review, then offer to go further

**Visual self-review (when you can safely inspect).** If you can see the rendered result — a sandboxed screenshot/preview tool your host provides, OR a browser tool with vision that can open the draft's live artifact (served under `p.superdesign.dev`; take the `preview` URL from the command output) — treat every design generation round (`create-design-draft` / `iterate-design-draft` / `execute-flow-pages`) as unfinished until you have looked at it yourself:

1. **Look at it.** Open the artifact and inspect the rendered page. Judge it as a designer would: layout breakage, overflow or clipping, contrast and readability, typography scale, spacing rhythm, leftover placeholder or filler content, and image fit.
2. **Fix once if needed.** If you spot concrete issues, run EXACTLY ONE optimization iteration (`iterate-design-draft --mode replace`, correcting the just-generated draft in place — see the TOOL USE RULE exemption in [SUPERDESIGN.md](references/SUPERDESIGN.md)) that addresses them, then re-check the result. One round only: never keep looping on your own.
3. **Present.** Show the result to the user, preferring the `canvas` URL (the artifact/`preview` link is for your own inspection, not the primary thing you hand the user).

**Never self-review the Step 3a pixel-perfect reproduction draft.** A reproduction's job is to match the current UI, not to look "better" — "fixing" it toward your taste corrupts the ground truth. Reproduction problems mean missing/wrong context, not styling; address them by fixing the context files and regenerating, not by an optimization pass. This self-review is for design (Step 3b) and graphic drafts only.

**If you CANNOT safely inspect the rendered result**, do not guess and do not imply you checked. Give the user the `canvas` URL and say plainly that you have not visually verified it, inviting the user to review.

**Then always close with a short, warm follow-up that offers to go further** (on every surface). Ask one question with 2 to 3 concrete options tailored to what you just made, not a generic list. For example: try a different hero image or key visual direction, try an alternate layout or composition, or generate a few more variations or asset ideas as surprises. Only generate after the user picks, since every generation spends credits.

# How it works

Read [SUPERDESIGN.md](references/SUPERDESIGN.md), then follow its instructions.
