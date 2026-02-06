You are performing a **SuperDesign Init** — analyzing this repository to build UI context files that SuperDesign agent will use for design tasks.

## Output Directory
Write all files to `.superdesign/init/` in the project root.

## Analysis Steps

### 1. Detect Framework & Component Library
Scan `package.json`, config files (`next.config.*`, `vite.config.*`, `rsbuild.config.*`, `nuxt.config.*`, etc.), and import patterns to determine:
- Framework: React, Vue, Svelte, Angular, etc.
- Meta-framework: Next.js, Nuxt, Remix, Astro, etc.
- Component library: shadcn/ui, Ant Design, MUI, Chakra, Radix, custom, etc.
- CSS approach: Tailwind, CSS Modules, styled-components, vanilla CSS, etc.

### 2. Write `components.md`
Identify the project's shared/reusable UI component directory (e.g., `src/components/ui/`, `components/`, `packages/ui/`).

**IMPORTANT**: Include FULL source code for each component, not just descriptions. SuperDesign needs the actual implementation to reproduce accurately.

For each component, include:
- File path
- Component name
- Brief description (1 line)
- Key props if obvious from the export
- **FULL source code** in fenced code blocks

Focus on **shared UI primitives** (Button, Input, Dialog, Card, Select, Checkbox, Table, Tabs, etc.), not page-specific components.

⚠️ This file should contain the ACTUAL CODE of components, not just a list of names.

### 3. Write `layouts.md`
Find and READ all shared layout components. These are the components that appear on every page or across multiple pages:
- App shell / root layout
- Navigation bar (top nav, bottom nav)
- Sidebar
- Header / top bar
- Footer
- Breadcrumb
- Layout wrappers / HOCs

For each, include:
- File path
- Full source code (copy the entire file content)
- Brief description of what it renders

This is critical — SuperDesign needs the actual layout code to reproduce pages accurately.

### 4. Write `routes.md`
Map out the page/route structure:
- For file-based routing (Next.js, Nuxt): list route files and their paths
- For config-based routing (React Router, Vue Router): read the router config
- For each route, include: URL path, component file path, layout used
- Include the FULL router config file if it exists (e.g., `router/index.ts`, `routes.ts`)

For key pages (home, dashboard, main features), include a brief summary of what the page renders.

### 5. Write `theme.md`
Extract the design system / theme tokens. **Include FULL file contents**, not summaries:
- Read and include FULL CSS variable definitions (`:root`, `[data-theme]`, etc.)
- Read and include FULL Tailwind config (`tailwind.config.*`) — especially `theme.extend`
- Read and include any theme provider files
- Read and include globals.css, index.css, or equivalent
- Capture: colors, fonts, spacing scale, border radius, shadows, breakpoints

**IMPORTANT**: Include the COMPLETE raw files in fenced code blocks:
- Full `tailwind.config.ts/js` content
- Full `globals.css` / `index.css` content
- Full CSS variable definitions
- Any design token files

### 6. Write `pages.md`
For each key page/route in the app (home, dashboard, main features — up to 10 pages), build a **complete component dependency tree** by tracing imports recursively.

For each page:
1. Start from the page component file
2. Trace ALL local imports (relative `./Foo`, `../Bar`, alias `@/components/Baz` — skip node_modules)
3. For each import, trace ITS imports recursively
4. Present as an indented tree showing every file the page depends on

Format:
```
## / (Home Page)
Entry: src/app/(home)/home-page.tsx
Dependencies:
- src/components/home-ui/elegant-header.tsx
  - src/components/team/create-team-modal.tsx
- src/components/home-ui/elegant-hero-section.tsx
  - src/components/home-ui/home-hero-input.tsx
  - src/components/home-ui/persona-selector.tsx
  - src/components/home-ui/dev-workflow-view.tsx
  - src/components/home-ui/import-site-modal.tsx
- src/components/home-ui/elegant-project-grid.tsx
  - src/components/home-ui/elegant-project-card.tsx
- src/app/(home)/components/template-browse-section.tsx
  - src/app/(home)/components/template-card.tsx
- src/components/layout/Footer.tsx
```

This tree is the **SINGLE SOURCE OF TRUTH** for which files to pass as `--context-file` when designing a page. If a file appears in the tree, it MUST be included.

Prioritize the most important/complex pages (home, dashboard, settings, etc.). Skip trivial pages (404, offline, status).

## Format Guidelines
- Use markdown with clear headings
- Include file paths as code spans
- **For `components.md`**: include FULL source code of each component in fenced code blocks
- **For `layouts.md`**: include FULL file contents in fenced code blocks
- **For `theme.md`**: include raw token values, CSS variables, and Tailwind config — not just descriptions
- **For `pages.md`**: include complete dependency trees with indentation showing nesting depth
- Keep descriptions concise — the goal is machine-readable context, not documentation

## Key Principle: INCLUDE ACTUAL CODE
The init files should contain **actual implementation code** (.tsx, .css, .ts), not just documentation or descriptions. SuperDesign needs real code to reproduce UI accurately. Be generous with the content — more context is always better than less.
