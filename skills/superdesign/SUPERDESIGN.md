SuperDesign helps you (1) find design inspirations/styles and (2) generate/iterate design drafts on an infinite canvas.

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

### B) Canvas Design Tools

Use design agent to generate high quality design drafts:
- Create project (supports prompt / prompt file / HTML)
- Create design draft
- Iterate design draft (replace / branch)
- Plan flow pages → execute flow pages
- Fetch specific design draft

---

## Overall SOP for designing features on top of existing app:
1. Investigate existing UI, workflow
2. Setup design system file if not exist yet
3. Requirements gathering: use askQuestion tool to clarify requirements with users (Optionally use Inspiration tool to find inspiration when needed)
4. Ask user whether ready to design in superdesign OR implement UI directly
5. If yes to superdesign
  5.1 Create/update a pixel perfect html replica of current UI of page that we will design on top of in `.superdesign/replica_html_template/<name>.html` (html should only contain & reflect how UI look now, the actual design should be handled by superdesign agent)
  5.2 Create project with this replica html + design system guide
  5.3 Start desigining by iterating & branching design draft based on designDraft ID returned from project


## Always-on rules
- Design system should live at: `.superdesign/design-system.md`
- If `.superdesign/design-system.md` is missing, run **Design System Setup** first.
- Use `askQuestion` to ask high-signal questions (constraints, taste, tradeoffs).
- Always use `--json` for machine parsing.

---

## replica_html_template rules (Canvas only)

The purpose of replica html template is creating a lightweight version of existing UI so design agent can iterate on top of it (Since superdesign doesn't have access to your codebase directly, this is important context)

Overall process for designing features on top of existing app:
1. Identify & understand existing UI of page related
2. Create/update a pixel perfect replica html in `.superdesign/replica_html_template/<name>.html` (Only replicate how UI look now, do NOT design)
  - If design task is redesign profile page, then replicate current profile page UI pixel perfectly
  - If design task is add new button to side panel, identify which page side panel is using, then replicate that page UI pixel perfectly

**replica_html_template = BEFORE state (what exists now).** It provides context for SuperDesign agent.
Actual design will be done via superdesign agent, by passing the prompt

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

### Example workflow - Add feature to existing page

1. Investigate existing design and Ask targeted questions (`askQuestion`) about requirements + taste
2. After clarifying, Ask user whether ready to design in superdesign OR implement UI directly
3. If design in superdesign
  3.1 Ensure `.superdesign/design-system.md` exists (setup if missing)
  3.2 Identify page most relevant, and build a pixel-perfect replica in replica_html_template:
    - `.superdesign/replica_html_template/<page>-<feature>.html`
  3.3 Create project with replica_html_template (returns `draftId`):
    ```bash
    superdesign create-project \
      --title "<feature>" \
      --html-file .superdesign/replica_html_template/<file>.html \
      --prompt-file .superdesign/design-system.md \
      --json
    ```
    → Note: `draftId` in response is the baseline draft
  3.4 Branch designs from baseline (use `draftId` from step 3.3):

    **Option A: Single prompt + count** (AI generates different approaches)
    ```bash
    superdesign iterate-design-draft \
      --draft-id <draftId> \
      -p "<design requirements>" \
      --mode branch \
      --count 3 \
      --json
    ```

    **Option B: Multiple specific prompts** (each prompt = one variation)
    ```bash
    superdesign iterate-design-draft \
      --draft-id <draftId> \
      -p "Dark theme with neon accents" \
      -p "Minimal with more whitespace" \
      -p "Bold gradients and shadows" \
      --mode branch \
      --json
    ```
  3.5 Share design title & preview URL → collect feedback → iterate


### Advanced usage

#### Design multiple page OR a full user journey

Execute:

```bash
superdesign execute-flow-pages \
  --draft-id <draftId> \
  --source-node-id <nodeId> \
  --pages '[{"title":"Signup","prompt":"..."},{"title":"Payment","prompt":"..."}]' \
  --json
```

#### Get HTML reference from a draft

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

# Iterate: replace mode (single variation, updates in place)
superdesign iterate-design-draft --draft-id <id> -p "..." --mode replace --json

# Iterate: branch mode with count (AI generates N variations)
superdesign iterate-design-draft --draft-id <id> -p "..." --mode branch --count 3 --json

# Iterate: branch mode with multiple prompts (each prompt = one variation)
superdesign iterate-design-draft --draft-id <id> -p "dark theme" -p "minimal" -p "bold" --mode branch --json

superdesign fetch-design-nodes --project-id <id> --json
superdesign get-design --draft-id <id> --json
```
