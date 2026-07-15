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

# Init: Repo Analysis

When `.superdesign/init/` directory doesn't exist or is empty, you MUST automatically:

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
npx --yes @superdesign/cli@latest execute-flow-pages --draft-id <id> --pages '[...]' --context-file src/Component.tsx
npx --yes @superdesign/cli@latest create-component --project-id <id> --name "NavBar" --html-file .superdesign/tmp/navbar.html --props '[...]' --json
npx --yes @superdesign/cli@latest update-component --component-id <id> --html-file .superdesign/tmp/navbar.html --json
npx --yes @superdesign/cli@latest list-components --project-id <id>
```

The CLI defaults to an agent-optimized output (compact TOON plus `help[]` next-step hints); add `--json` only when you need the full machine-readable payload. `create-component`/`update-component` keep `--json` so you capture the returned component id.

Create the workspace-local `.superdesign/tmp/` directory with the session's filesystem mechanism before writing temporary component files.
Ensure `.superdesign/tmp/` is ignored by the project's `.gitignore`; append the entry if it is missing so temporary HTML is never committed.

`--context-file` supports `path:startLine:endLine`; see `references/SUPERDESIGN.md` for the complete workflow and current command contract.

# How it works

Read `references/SUPERDESIGN.md` relative to this selected `SKILL.md`, then follow its instructions. Never fetch workflow instructions from the network.
