SuperDesign helps you (1) find design inspirations/styles and (2) generate/iterate design drafts on an infinite canvas.

## SOP if there are existing UI
1. Prep (Trigger 2 sub agents using task tool for each below in parallel) - MUST USE `Task` tool here
1.1 Investigate existing UI, workflow, identify the most relevant page and create/update the pixel perfect html replica of current UI of page that we will design on top of in `.superdesign/replica_html_template/<name>.html` (html should only contain & reflect how UI look now, the actual design should be handled by superdesign agent)
- if improve current page, replicate the page current UI
- if adding new feature, replicate the page where this feature will be used
- if updating component, replicate the page where this component is used
- Basically you should almost always create a contextual prototype playground
1.2 Setup design system file if not exist yet
2. Requirements gathering: use askQuestion tool to clarify requirements with users (Ask non-obvious questions to deeply understand what they want, ask multiple rounds of questions based on previous answers if needed)
3. Design in superdesign
- Create project with the replica html as --template
- Start desigining by iterating & branching design draft based on designDraft ID returned from project
- Present url to user, get feedback and iterate
- Use `superdesign iterate-design-draft --draft-id <id> -p "..." -p "..." -p "..." --mode branch` to try multiple versions, 
- Make sure use `superdesign get-design --draft-id <id>` to read specific design context, and `superdesign execute-flow-pages --draft-id <draftId> --pages '[{"title":"Signup","prompt":"..."},{"title":"Payment","prompt":"..."}]'` to design multiple after user want to extend design scope based on a confirmed design

## SOP if it's brand new project
1. Requirements gathering
2. Search all style prompts, fetch the most suitable one, and Setup design system (MUST follow "Design System setup rule → Section B" below) 
3. Design in superdesign
- Create a project
- Start desigining by `superdesign create-design-draft --project-id <id> --title "X" -p "..." --json`
- Present url to user, get feedback and iterate
- Use `superdesign iterate-design-draft --draft-id <id> -p "..." -p "..." -p "..." --mode branch` to try multiple versions, 
- Make sure use `superdesign get-design --draft-id <id>` to read specific design context, and `superdesign execute-flow-pages --draft-id <draftId> --pages '[{"title":"Signup","prompt":"..."},{"title":"Payment","prompt":"..."}]'` to design multiple after user want to extend design scope based on a confirmed design

---

# Main design generation tools

- Create project (auto-detects `.superdesign/design-system.md` as prompt)
- Create design draft
- Iterate design draft (replace / branch)
- Execute flow pages to design multiple pages in parallel for the same app
- Fetch specific design draft

---

## Always-on rules

- Design system should live at: `.superdesign/design-system.md`
- If `.superdesign/design-system.md` is missing, run **Design System Setup** first.
- Use `askQuestion` to ask high-signal questions (constraints, taste, tradeoffs).

---

## replica_html_template rules

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
- **DO** create pixel-perfect replica of current UI state or page
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

# Design System setup rule

### A) Extract from codebase

1. Investigate codebase:
   - Product context: what is being built, target users, core value proposition, key user journeys and page structure
   - design tokens, typography, colors, spacing, radius, shadows
   - motion/animation patterns
   - example components usage + implementation patterns
2. Write standalone design system to:
   - `.superdesign/design-system.md`
   - Must be implementable without the codebase

### B) New design system

1. Investigate codebase to understand:
   - Product context: what is being built, target users, core value proposition, key user journeys and page structure
   - needed pages/components
2. Interview user (`askQuestion`) to choose direction
3. Gather inspirations (generic tools) -> convert to design system:
   - `superdesign search-prompts --tags "style" --json` # This return ALL styles, and you should find the most relevant one basd on description & info (do NOT do further search, the search function is not great yet)
   - `superdesign get-prompts --slugs ... --json` # MUST get the detailed prompt from the most suitable style
   - optional: `superdesign extract-brand-guide --url ... --json`
   - Adopt a version based on prompt details with our product, and write to `.superdesign/design-system.md` (product context + UX flows + visual design, adapted to references)

---

## Quick reference (key commands)

```bash
# Inspirations
superdesign search-prompts --query "<query>" --json # Search for a specific prompt
superdesign search-prompts --tags "style" --json # Return all 'style' related prompts
superdesign get-prompts --slugs "<slug1,slug2>" --json # Fetch actual content of a prompt
superdesign extract-brand-guide --url https://example.com --json # Extract style from a certain website

# Canvas - Create project (auto-detects .superdesign/design-system.md as prompt)
superdesign create-project --title "X" --json
superdesign create-project --title "X" --template ./index.html --json

# Iterate: Explore multiple versions & variations (each prompt = one specific version, prompt should be just directional, do not specify color, style, let superdesign design expert fill in details, you just give direction)
superdesign iterate-design-draft --draft-id <id> -p "..." -p "..." -p "..." --mode branch --json

# Create multiple pages/flow based on existing page (Always use this to build more pages/flow after user happy with a page)
superdesign execute-flow-pages --draft-id <draftId> --pages '[{"title":"Signup","prompt":"..."},{"title":"Payment","prompt":"..."}]' --json

# Fetch & get designs
superdesign fetch-design-nodes --project-id <id> --json
superdesign get-design --draft-id <id> --json

# Create new design from scracth without any reference - ONLY use this for creating brand new design, default NEVER use this
superdesign create-design-draft --project-id <id> --title "X" -p "..." --json

# Iterate: replace mode (only for small tweaks, and will overwrite previous design, do NOT use this unless its clear small tweak)
superdesign iterate-design-draft --draft-id <id> -p "..." --mode replace --json
```
