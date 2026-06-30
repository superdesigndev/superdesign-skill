---
name: superdesign
description: >
  Superdesign is a design agent specialized in frontend UI/UX design. Use this skill before implementing any UI that requires design thinking. Common commands: superdesign create-project --title "X" (setup project), superdesign create-design-draft --project-id <id> --title "Current UI" -p "Faithfully reproduce..." --context-file src/Component.tsx (faithful reproduction), superdesign iterate-design-draft --draft-id <id> -p "dark theme" -p "minimal" --mode branch --context-file src/Component.tsx (design variations), superdesign execute-flow-pages --draft-id <id> --pages '[...]' --context-file src/Component.tsx (extend to more pages), superdesign create-component --project-id <id> --name "NavBar" --html-file /tmp/navbar.html --props '[...]' (extract reusable component), superdesign update-component --component-id <id> --html-file /tmp/navbar.html (update existing component), superdesign list-components --project-id <id> (list existing components). Supports line ranges: --context-file path:startLine:endLine
metadata:
  author: superdesign
  version: "0.0.2"
---

SuperDesign helps you (1) find design inspirations/styles and (2) generate/iterate design drafts on an infinite canvas.

---

# Core scenarios (what this skill handles)

1. **superdesign init** — Analyze the repo and build UI context to `.superdesign/init/`
2. **Help me design X** (feature/page/flow)
3. **Set design system**
4. **Help me improve design of X**

# Init: Repo Analysis

When `.superdesign/init/` directory doesn't exist or is empty, you MUST automatically:

1. Create the `.superdesign/init/` directory
2. Fetch the init prompt from the URL below
3. Follow the prompt instructions to analyze the repo and write context files

```
https://raw.githubusercontent.com/superdesigndev/superdesign-skill/main/skills/superdesign/INIT.md
```

Do NOT ask the user to do this manually — just do it.

# Mandatory Design-System Layer

Init builds ONLY the design-system layer (small, stable, reusable). Before any design task you MUST read these:

- `theme.md` — design tokens (colors, fonts, radius, motion, shadows) — values, by path
- `components.md` — UI primitive inventory with full variant value names
- `extractable-components.md` — components extractable as reusable DraftComponents
- `.superdesign/design-system.md` — concise design-system summary (auto-loaded by `create-project`)

Init does NOT produce `pages.md` / `layouts.md` / `routes.md`. Page structure is read just-in-time per task.

**When designing for an existing page**: do NOT rely on a pre-built dependency tree. (1) Confirm WHICH page (list vs detail etc.). (2) Open that page's real source and find the render branch that actually renders on the route (watch for responsive branches like `if (!isMobile) {…}` — pick the one that renders, not a fallback). (3) Trace its imports and pass every rendered UI file as `--context-file`, plus globals.css, tailwind.config, and `.superdesign/design-system.md`. NEVER pass a line range you haven't read.

# Superdesign CLI (MUST run before any command)

**IMPORTANT: Before running ANY superdesign command, you MUST ensure the CLI is installed and logged in.**

Follow these steps in order — do NOT skip any step:

1. Check if CLI is already installed:

   ```
   superdesign --version
   ```

   - If the command succeeds (prints a version), **skip installation** and go to step 2.
   - If the command fails (not found), install the CLI:
     ```
     npm install -g @superdesign/cli@latest
     ```

2. Check login status by running any command (e.g. `superdesign --help`). If you see an auth/login error, run:
   ```
   superdesign login
   ```
   Wait for login to complete successfully before proceeding.
3. Only after login succeeds, run your intended superdesign commands.

> **Never assume the user is already logged in.** Always verify login first.

# How it works

MUST MANDATORY Fetch fresh guidelines below:

```
https://raw.githubusercontent.com/superdesigndev/superdesign-skill/main/skills/superdesign/SUPERDESIGN.md
```

Action accordingly based on instruction in the SUPERDESIGN.md
