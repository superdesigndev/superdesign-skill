SuperDesign helps you (1) find design inspirations/styles and (2) optionally generate/iterate design drafts on an infinite canvas.

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
- Fetch specific design draft

> Pixel-perfect replica_html_template is ONLY required for Canvas workflows.

---

## Always-on rules

- Design system should live at: `.superdesign/design-system.md`
- If `.superdesign/design-system.md` is missing, run **Design System Setup** first.
- Use `askQuestion` to ask high-signal questions (constraints, taste, tradeoffs).
- For Canvas workflows: if we are designing on top of existing UI, build a pixel-perfect replica html of the page to provide starting context for design:
  - `.superdesign/replica_html_template/<name>.html`
- Always use `--json` for machine parsing.

---

## replica_html_template rules (Canvas only)

The purpose of replica html template is creating a lightweight version of existing UI so design agent can iterate on top of it (Since superdesign doesn't have access to your codebase directly, this is important context)

Overall process for designing features on top of existing app:
1. Identify & understand existing UI of page related
2. Create/update a pixel perfect replica html in `.superdesign/replica_html_template/<name>.html` (Only replicate how UI look now, do NOT design)
  - If design task is redesign Profile page, then the replica should just replicate how profile page look now
  - If design task is add a new 
3. Create project with this replica html + design system guide, then start designing by creating design draft based on designDraft ID returned

**replica_html_template = BEFORE state (what exists now).** It provides context for SuperDesign agent.
**Prompt = DESIRED CHANGE (what to add/modify).**

The replica_html_template must contain **ONLY UI that currently exists in the codebase**. 

- **DO NOT** design or improve anything in the replica_html_template
- **DO NOT** add placeholder sections like `<!-- NEW FEATURE - DESIGN THIS -->`
- **DO** create pixel-perfect replica of current UI state
- Save to: `.superdesign/replica_html_template/<name>.html`

### Naming & Reuse

**Naming convention** 
Name replica_html_template for reusability: Use the page route (e.g., `home.html`, `settings-profile.html`, `dashboard.html`)
This makes it easy to identify if a page_template already exists.

**Before creating a replica_html_template:**
1. Check if `.superdesign/replica_html_template/` already contains a matching file
2. If exists: reuse it or update to reflect the latest existing UI
3. If not exists: create the neww file

### Example: Adding a "Book Demo" section to home page

**BAD approach:**

```html
<!-- replica_html_template includes a sketched Book Demo section -->
<section class="book-demo">
  <!-- DESIGN THIS - Add CTA here -->
  <h3>Book a Demo</h3>
  <button>Schedule</button>
</section>
```

**GOOD approach:**

```html
<!-- replica_html_template is pure replica of existing home page (hero + projects) -->
```

Then in the iterate command:
1/ create project passing this replica html
2/ create design draft based on design draft id

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
2. Identify page most relevant, and build a pixel-perfect replica in replica_html_template:
   - `.superdesign/replica_html_template/<page>-<feature>.html`
3. Ask targeted questions (`askQuestion`) about requirements + taste
4. Create project with replica_html_template (returns `draftId`):
   ```bash
   superdesign create-project \
     --title "<feature>" \
     --html-file .superdesign/replica_html_template/<file>.html \
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

Same as above, but replica_html_template should include shared UI shell:
- nav, layout container, spacing rhythm, shared components

### Canvas workflow — Improve current UI
1. Investigate product + current UI states
2. Ensure design system exists
3. Propose improvement options:
   - big restructure
   - style uplift
   - low-hanging polish
4. Pick one → build replica_html_template → create project (prompt-file design system) → branch drafts
5. Share `previewUrl` → iterate

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
