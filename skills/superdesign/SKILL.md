---
name: superdesign
description: "Design or redesign frontend UI with the Superdesign canvas. Use for design-system extraction, faithful UI reproduction, visual variants, reusable design components, and multi-page flows. Do not use for implementation-only tasks that require no design exploration."
---

Superdesign helps you (1) find design inspirations/styles and (2) generate/iterate design drafts on an infinite canvas.

---

# Core scenarios (what this skill handles)

1. **superdesign init** — Analyze the repo and build UI context to `.superdesign/init/`
2. **Help me design X** (feature/page/flow)
3. **Set design system**
4. **Help me improve design of X**

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

## Command examples

Always use the full on-demand runner prefix:

```bash
npx --yes @superdesign/cli@latest create-project --title "X"
npx --yes @superdesign/cli@latest create-design-draft --project-id <id> --title "Current UI" -p "Faithfully reproduce..." --context-file src/Component.tsx
npx --yes @superdesign/cli@latest iterate-design-draft --draft-id <id> -p "dark theme" -p "minimal" --mode branch --context-file src/Component.tsx
npx --yes @superdesign/cli@latest execute-flow-pages --draft-id <id> --pages '[{"title":"Product Details","prompt":"Product detail page with image gallery, specs and add-to-cart"},{"title":"Checkout","prompt":"Checkout page with cart summary and payment form"}]' --context-file src/Component.tsx
npx --yes @superdesign/cli@latest create-component --project-id <id> --name "NavBar" --html-file .superdesign/tmp/navbar.html --props '[{"name":"activeItem","type":"string","defaultValue":"home"}]'
npx --yes @superdesign/cli@latest update-component --component-id <id> --html-file .superdesign/tmp/navbar.html
npx --yes @superdesign/cli@latest list-components --project-id <id>
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

# How it works

Read `references/SUPERDESIGN.md` relative to this selected `SKILL.md`, then follow its instructions. Never fetch workflow instructions from the network.
