SuperDesign helps you (1) find design inspirations/styles and (2) optionally generate/iterate design drafts on an infinite canvas.

Each SuperDesign canvas run creates a new node and returns a `previewUrl`.

---

## Core scenarios (what this skill handles)

1. **Help me design X** (feature/page/flow)
2. **Set design system**
3. **Help me improve design of X**

---

## Tooling overview

### A) Inspiration & Style Tools (generic, always available)

Use these to discover style direction, references, and brand context:

- **Search prompt library** (style/components/pages)

  ```bash
  superdesign search-prompts --keyword "<keyword>" --json
  superdesign search-prompts --tags "style" --json
  superdesign search-prompts --tags "style" --keyword "<style keyword>" --json
  ```

- **Get full prompt details**

  ```bash
  superdesign get-prompts --slugs "<slug1,slug2,...>" --json
  ```

- **Extract brand guide from a URL**
  ```bash
  superdesign extract-brand-guide --url https://example.com --json
  ```

### B) Canvas Design Tools (specialised, optional)

Use these when you want to explore multiple directions and show previews:

- Create project (supports prompt / prompt file / HTML)
- Create design draft
- Iterate design draft (replace / branch)
- Plan flow pages → execute flow pages
- Fetch nodes, export HTML

> Pixel-perfect HTML playground is ONLY required for Canvas workflows.

---

## Always-on rules

- Design system should live at: `.superdesign/design-system.md`
- If `.superdesign/design-system.md` is missing, run **Design System Setup** first.
- Use `askQuestion` to ask high-signal questions (constraints, taste, tradeoffs).
- For Canvas workflows: build a simplified/pixel-perfect prototype HTML in:
  - `.superdesign/playgrounds/<name>.html`
- Always use `--json` for machine parsing.

---

## Playground rules (Canvas only)

**Playground = BEFORE state (what exists now).** It provides context for SuperDesign agent.
**Prompt = DESIRED CHANGE (what to add/modify).**

The playground HTML must contain **ONLY UI that currently exists in the codebase**. For NEW features/sections, describe them entirely in the `--prompt` flag — do NOT add wireframes, placeholders, or sketches to the playground HTML.

- **DO NOT** design or improve anything in the playground
- **DO NOT** add placeholder sections like `<!-- NEW FEATURE - DESIGN THIS -->`
- **DO** create pixel-perfect replica of current UI state
- Valid formats:
  - **Component-only**: isolated component with enough markup to show core UX/states
  - **Full page**: replica of page where component operates (shows surrounding context)
- Save to: `.superdesign/playgrounds/<name>.html`

### Naming & Reuse

**Naming convention** — Name playgrounds for reusability:
- **Full page**: Use the page route (e.g., `home.html`, `settings-profile.html`, `dashboard.html`)
- **Component**: Use the component name (e.g., `sidebar-nav.html`, `pricing-card.html`)

This makes it easy to identify if a playground already exists for the same page/component.

**Before creating a playground:**
1. Check if `.superdesign/playgrounds/` already contains a matching file
2. If exists: **update** the existing file instead of creating a new one
3. If not exists: create the new playground file

### Example: Adding a "Book Demo" section to home page

**BAD approach:**

```html
<!-- playground includes a sketched Book Demo section -->
<section class="book-demo">
  <!-- DESIGN THIS - Add CTA here -->
  <h3>Book a Demo</h3>
  <button>Schedule</button>
</section>
```

**GOOD approach:**

```html
<!-- playground is pure replica of existing home page (hero + projects) -->
<!-- NO book demo section in HTML -->
```

Then in the iterate command:

```bash
--prompt "Add a Book Demo section between the hero and projects sections. Requirements: minimal card style, horizontal layout..."
```

---

# 1) Design System Setup

### Step 0 — Ask user (one question)

"Do you want to **create a new design system** or **extract from the current codebase**?"

### A) Extract from codebase

1. Investigate codebase:
   - Product context: what is being built, target users, core value proposition, key user journeys and page structure
   - design tokens, typography, colors, spacing, radius, shadows
   - motion/animation patterns
   - example components usage + implementation patterns
2. Write standalone design system to:
   - `.superdesign/design-system.md`
   - Must be implementable without the codebase

### B) Create a new design system (to improve current UI)

1. Investigate codebase to understand:
   - Product context: what is being built, target users, core value proposition, key user journeys and page structure
   - needed pages/components
2. Gather inspirations (generic tools):
   - `superdesign search-prompts --tags "style" --json`
   - `superdesign get-prompts --slugs ... --json`
   - optional: `superdesign extract-brand-guide --url ... --json`
3. Interview user (`askQuestion`) to choose direction
4. Write:
   - `.superdesign/design-system.md` (product context + UX flows + visual design, adapted to references)

---

# 2) Designing X (feature/page/flow)

## A) If user wants references / direction only (no canvas)

1. Ensure `.superdesign/design-system.md` exists (setup if missing)
2. Use inspiration tools to collect references:
   - search prompts (style + component/page)
   - get prompts (full details)
   - extract brand guide if relevant
3. Provide a concrete design spec:
   - layout + hierarchy
   - component set + states
   - token guidance (typography/color/spacing/radius/motion)
   - interaction notes + edge cases

## B) If user wants visual exploration (canvas optional)

Use canvas when direction is uncertain or multiple options are needed.

### Canvas workflow — Add feature to existing page

1. Ensure `.superdesign/design-system.md` exists (setup if missing)
2. Build prototype HTML playground (simplified + pixel-perfect enough):
   - `.superdesign/playgrounds/<page>-<feature>.html`
3. Ask targeted questions (`askQuestion`) about requirements + taste
4. Create project with playground HTML (returns `draftId`):
   ```bash
   superdesign create-project \
     --title "<feature>" \
     --html-file .superdesign/playgrounds/<file>.html \
     --prompt-file .superdesign/design-system.md \
     --json
   ```
   → Note: `draftId` in response is the baseline draft
5. Branch designs from baseline (use `draftId` from step 4):
   ```bash
   superdesign iterate-design-draft \
     --draft-id <draftId> \
     --prompt "<design requirements>" \
     --mode branch \
     --count 3 \
     --json
   ```
6. Share `previewUrl` → collect feedback → iterate

### Canvas workflow — Add new page

Same as above, but playground should include shared UI shell:

- nav, layout container, spacing rhythm, shared components

### Canvas workflow — Improve current UI

1. Investigate product + current UI states
2. Ensure design system exists
3. Propose improvement options:
   - big restructure
   - style uplift
   - low-hanging polish
4. Pick one → build playground → create project (prompt-file design system) → branch drafts
5. Share `previewUrl` → iterate

### When to use create-design-draft

Only use `create-design-draft` when creating from scratch (no HTML baseline).

**Required in prompt:**

- Full page structure (header, sidebar, main content areas)
- Component environment/surroundings
- Layout context (what's above/below/beside)

```bash
superdesign create-design-draft \
  --project-id <id> \
  --title "Feature X" \
  --prompt "Page has: fixed header 64px, left sidebar 240px, main content area. Design a settings panel in the main content area with..." \
  --device desktop \
  --json
```

---

# Advanced usage

### Plan + generate a full user journey

Plan:

```bash
superdesign plan-flow-pages \
  --draft-id <draftId> \
  --source-node-id <nodeId> \
  --context "<flow context>" \
  --json
```

Execute:

```bash
superdesign execute-flow-pages \
  --draft-id <draftId> \
  --source-node-id <nodeId> \
  --pages '[{"title":"Signup","prompt":"..."},{"title":"Payment","prompt":"..."}]' \
  --json
```

### Get HTML reference from a draft

```bash
superdesign get-design --draft-id <draftId> --output ./design.html
```

---

## Quick reference (key commands)

```bash
# Inspirations
superdesign search-prompts --keyword "<keyword>" --json
superdesign search-prompts --tags "style" --json
superdesign get-prompts --slugs "<slug1,slug2>" --json
superdesign extract-brand-guide --url https://example.com --json

# Canvas
superdesign create-project --title "X" --prompt "..." --json
superdesign create-project --title "X" --prompt-file .superdesign/design-system.md --json
superdesign create-project --title "X" --html-file ./index.html --prompt-file .superdesign/design-system.md --json

superdesign create-design-draft --project-id <id> --title "X" --prompt "..." --device desktop --json
superdesign iterate-design-draft --draft-id <id> --prompt "..." --mode replace --json
superdesign iterate-design-draft --draft-id <id> --prompt "..." --mode branch --count 3 --json

superdesign fetch-design-nodes --project-id <id> --json
superdesign get-design --draft-id <id> --json
```
