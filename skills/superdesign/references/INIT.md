You are performing a **Superdesign Init** — analyzing this repository to build UI context files that Superdesign agent will use for design tasks.

## Output Directory
Write all context files to `.superdesign/init/` in the project root. The one exception is a generated `DESIGN.md`: when the project has NO `DESIGN.md` of its own, write it at the repo **root** (Case C in step 5) so other DESIGN.md-aware tooling can find it; only when the project already has an INVALID `DESIGN.md` do we keep ours inside `.superdesign/init/` (Case B). See step 5 for the full rule.

## Analysis Steps

### 1. Detect Framework & Component Library
Scan `package.json`, config files (`next.config.*`, `vite.config.*`, `rsbuild.config.*`, `nuxt.config.*`, etc.), and import patterns to determine:
- Framework: React, Vue, Svelte, Angular, etc.
- Meta-framework: Next.js, Nuxt, Remix, Astro, etc.
- Component library: shadcn/ui, Ant Design, MUI, Chakra, Radix, custom, etc.
- CSS approach: Tailwind, CSS Modules, styled-components, vanilla CSS, etc.

### 2. Write `components.md`
Identify the project's shared/reusable UI component directory (e.g., `src/components/ui/`, `components/`, `packages/ui/`).

**IMPORTANT**: Include FULL source code for each component, not just descriptions. Superdesign needs the actual implementation to reproduce accurately.

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

This is critical — Superdesign needs the actual layout code to reproduce pages accurately.

### 4. Write `routes.md`
Map out the page/route structure:
- For file-based routing (Next.js, Nuxt): list route files and their paths
- For config-based routing (React Router, Vue Router): read the router config
- For each route, include: URL path, component file path, layout used
- Include the FULL router config file if it exists (e.g., `router/index.ts`, `routes.ts`)

For key pages (home, dashboard, main features), include a brief summary of what the page renders.

### 5. Provide the design tokens as `DESIGN.md` (+ `theme-raw.md` sidecar)

Capture the design system / theme tokens in the interoperable **DESIGN.md** format (Google Labs' open format for design systems). DESIGN.md is the **visual-identity layer**: normative design tokens in YAML front matter plus prose rationale, readable by any DESIGN.md-aware tool. It replaces the old `theme.md`. The other init files (`components.md`, `layouts.md`, `routes.md`, `pages.md`, `extractable-components.md`) remain the **code-context layer** with full source and dependency trees — do NOT fold them into DESIGN.md.

**Format authority:** follow `DESIGNMD-SPEC.md` in this `references/` directory (a pinned, verbatim snapshot of the upstream spec). Consult it locally; do NOT fetch the network or run any DESIGN.md CLI. Key rule from the spec: *the tokens are the normative values; the prose provides context for how to apply them.*

**Detection (in this order): project root `DESIGN.md`, then `docs/DESIGN.md`.** Then branch:

- **Case A — a project `DESIGN.md` exists and is valid per the spec** (front matter parses; no duplicate `##` section headings — a duplicate section heading is the one hard invalidity in the spec's "Consumer Behavior for Unknown Content" table): consume it **READ-ONLY** as the theme/token context. **NEVER overwrite or edit a pre-existing project `DESIGN.md`** — it may be hand-written or another tool's asset. Do NOT regenerate; the project's own valid file already satisfies the DESIGN.md slot.
- **Case B — a project `DESIGN.md` exists but is INVALID per the spec** (e.g. a duplicate section heading, which the spec says rejects the file): leave the file **UNTOUCHED**, note the specific problem to the user, and generate our own spec-compliant version at `.superdesign/init/DESIGN.md` (the context output dir — NOT the repo root, so we never shadow or fight the project's file).
- **Case C — no project `DESIGN.md` anywhere** (neither root nor `docs/`): generate a spec-compliant `DESIGN.md` at the repo **ROOT**, extracted from the project's actual code (tokens from `globals.css`/`index.css`, `tailwind.config`, CSS variable definitions, theme provider/token files). Tell the user we created it and that a root `DESIGN.md` benefits any other DESIGN.md-aware agent tooling too, not just Superdesign.

**Writing a spec-compliant `DESIGN.md` (Cases B and C only).** Follow `DESIGNMD-SPEC.md`. In brief:

- **YAML front matter = normative tokens.** Populate `name`, `colors`, `typography`, `spacing`, `rounded`, and `components` from the values extracted from the code — the actual palette entries (incl. `:root` and `.dark`), font families and type scale, spacing scale, and border-radii. Use `{path.to.token}` references (e.g. `{colors.primary}`) inside `components` where a value reuses another token.
- **Markdown body = rationale**, in the spec's canonical section order: **Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts.** Omit a section only if genuinely irrelevant; keep the sections you include in that order; NEVER emit a duplicate `##` section heading (that makes the file invalid).

**Components section ← `extractable-components.md` (linkage).** When generating DESIGN.md, summarize each extractable component's visual properties (background/text colors, padding, border-radius — as `{token.references}` where possible) into the `components` token group in the front matter. In the Components **prose** section, point back to our code-context files (`components.md`, `layouts.md`, `extractable-components.md`) for the full source — DESIGN.md carries visual identity, not implementation.

**Always also write `theme-raw.md`** to `.superdesign/init/` — the raw source dumps, kept OUT of DESIGN.md so the spec file stays clean. Pass this sidecar as context only when exact style reproduction is needed:
- Full `tailwind.config.ts/js` content (especially `theme.extend`)
- Full `globals.css` / `index.css` content
- Full CSS variable definitions (`:root`, `[data-theme]`, etc.)
- Any theme provider files and design token files

**This step's slot is satisfied when:** a valid `DESIGN.md` is available (the project's own valid one, or the one we generated) AND `.superdesign/init/theme-raw.md` exists. A pre-existing valid project `DESIGN.md` satisfies the slot without regeneration.

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

This tree is the **candidate set** of files to pass as `--context-file` when designing a page — the starting point for context selection. It is not an unconditional include-everything list: apply the PAYLOAD BUDGET rules in `SUPERDESIGN.md` when selecting (budget before the call, line-range ~900+ line files to their render/token sections, drop files with no visual bearing) so the payload does not 400.

Prioritize the most important/complex pages (home, dashboard, settings, etc.). Skip trivial pages (404, offline, status).

### 7. Write `extractable-components.md`
Catalog UI components from the codebase that **can be extracted** as reusable Superdesign `DraftComponent` entities. These are components that appear on multiple pages or define shared UI patterns (navigation, cards, headers, footers).

Organize by category:

#### Layout Components (appear on most pages)
- NavBar / TopNav / BottomNav
- Sidebar
- Header / AppBar
- Footer
- App Shell / Layout Wrapper

#### Basic Components (used across pages)
- Button variants
- Card components
- Input / Form fields
- Badge / Tag
- Avatar
- Tab components

For each extractable component, include:
- **Name** (PascalCase, e.g., `NavBar`, `HeroSection`)
- **Source file path** (e.g., `src/components/layout/NavBar.tsx`)
- **Category**: `layout` or `basic`
- **Brief description** (1 line)
- **Key props to extract** — ONLY state/navigation props that change per page:
  - Active state: `activeItem`, `currentTab`, `isActive`
  - Navigation URLs: `homeHref`, `searchHref`, `profileHref`
  - Visibility flags: `showNotification`, `showBadge`
  - Dynamic counts: `badgeCount`, `notificationCount`
- **Hardcoded elements** (NOT props): icon names, text labels, CSS classes, image sources

Format:
```
## NavBar
- Source: `src/components/layout/NavBar.tsx`
- Category: layout
- Description: Main top navigation with logo, search, and user menu
- Extractable props: activeItem (string, default: "home"), showNotification (boolean, default: false)
- Hardcoded: Logo SVG, menu items text, icon names, all CSS
```

This file serves as a "menu" — the design workflow reads it to decide which components to extract before generating drafts.

## Format Guidelines
- Use markdown with clear headings
- Include file paths as code spans
- **For `components.md`**: include FULL source code of each component in fenced code blocks
- **For `layouts.md`**: include FULL file contents in fenced code blocks
- **For `DESIGN.md`**: normative tokens in YAML front matter + prose rationale in the spec's canonical section order (see `DESIGNMD-SPEC.md`); never a duplicate `##` heading. **For `theme-raw.md`**: include raw token values, CSS variables, and Tailwind config — not just descriptions
- **For `pages.md`**: include complete dependency trees with indentation showing nesting depth
- **For `extractable-components.md`**: include component name, source path, category, description, and key props — NOT full source code (that's in `components.md` and `layouts.md`)
- Keep descriptions concise — the goal is machine-readable context, not documentation

## Key Principle: INCLUDE ACTUAL CODE
The init files should contain **actual implementation code** (.tsx, .css, .ts), not just documentation or descriptions. Superdesign needs real code to reproduce UI accurately. Be thorough and complete for the key pages and shared UI — but bounded and deduplicated, not padded. These files are the discovery layer; the actual design calls pass only the target page's necessary context under the PAYLOAD BUDGET (see `SUPERDESIGN.md`), so oversized dumps just raise reader/token cost without helping.
