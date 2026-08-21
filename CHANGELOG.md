# Changelog

Notable changes to the Superdesign skill and its plugin packaging.

All plugin manifests carry an explicit `version`, so marketplaces only hand users an update when that
field is bumped — every release entry below corresponds to a `chore(plugin): bump to X.Y.Z` commit that
bumps `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `.cursor-plugin/plugin.json`, and the
root `package.json` (the DeepSeek Harness bundle) together.

## 0.6.0

- Add a presentation workflow with host-agent requirements reasoning, visual-direction selection, and
  editable outline approval before generation.
- Route presentation creation through the dedicated CLI contract with stored outline, navigation,
  transition, Brand Assets, and visual-reference inputs.
- Add presentation-aware targeted and structural iteration guidance that reads and updates stored deck
  metadata without changing normal UI or graphic workflows.
- Add a grouped presentation-preference questionnaire with explicit choices, browser-first website-reference
  inspection, and a full final approval block that confirms the outline, visual direction, controls,
  transition, and Brand Assets.
- Keep presentation creation, iteration, and visual branches on the backend draft-model default unless
  the user explicitly requests a named model or a model comparison.
- Add an editable PPTX export route that prefers a native Superdesign export and otherwise uses an
  available host presentation tool to reconstruct slides with editable objects and visual verification.

## 0.5.1

- Simplify the skill entrypoint into a concise capability catalog while keeping detailed workflows in
  their scenario-specific references.
- Highlight task-aware selection and comparison across leading design-generation models.
- Route supporting image and video generation from the skill entrypoint and align the Codex-facing
  description around creating the best UI and visuals.

## 0.5.0

- Add image and video asset generation guidance for the Superdesign CLI: prefer a host agent's native
  image generator for ordinary assets, use Superdesign when its model catalog or generation ledger is
  specifically useful, and route generated video through Superdesign.
- Add `ASSET_GENERATION.md` to decide when original pixels or motion improve a design, distinguish
  final content from temporary visual references and durable Brand Assets, and carry generated results
  into design drafts through their public URL and canvas node id.
- Keep the paid generation mechanics discoverable through live CLI help and returned hints, while
  preserving the explicit quote confirmation boundary and idempotent timeout recovery rule.

## 0.4.4

- Make local project assets visibly reliable: discover and upload relevant logos, fonts, screenshots,
  and images; place uploaded images predictably on the canvas; and use an available project logo
  wherever a design or reusable component calls for one.
- Route iteration by user intent: refine an accepted direction in place, reserve branches for genuine
  alternatives, use Superdesign replacement generation for creative recomposition, and use direct,
  reversible draft versions for exact local-model corrections.
- Carry selected visual references into generation and reuse existing assets before generating new
  imagery, while keeping caller-authored HTML imports conformant and recoverable.

- Add DeepSeek Harness (`dsh`) packaging off the same `skills/superdesign/` tree: a root `package.json`
  declaring `dsh.bundle`, plus `dsh/cordis.patch.yml` and a dependency-free `dsh/index.js` that publishes
  the skill on `ctx.skills`. Installs with
  `dsh plugin --profile <name> add github:superdesigndev/superdesign-skill`.

## 0.4.3

- Add Cursor plugin packaging (`.cursor-plugin/plugin.json` + `.cursor-plugin/marketplace.json`) for the
  Cursor marketplace, off the same `skills/superdesign/` tree.
- Reuse safe `.superdesign/resume.json` state across sessions so an initialized UI target keeps its
  project, drafts, components, and budgeted source context without repeating discovery or reproduction.
  Changed source is repaired incrementally with precise Git diffs when available; flow pages remain
  independent targets, and requests that need extra code understanding expand context narrowly.

## 0.4.2

- Add a `Design with your own model` path that imports caller-authored HTML when explicitly requested
  or after `create-design-draft` / `iterate-design-draft` exhausts its retry.
- Package the repo as a Claude Code plugin: `.claude-plugin/plugin.json` manifest, plus a self-hosted
  `.claude-plugin/marketplace.json` so it installs with
  `/plugin marketplace add superdesigndev/superdesign-skill` +
  `/plugin install superdesign@superdesign`.
- Preflight: the ChatGPT-specific "switch to the Work tab" message is now scoped to ChatGPT chat. Other
  harnesses that cannot run shell commands get a harness-neutral message instead.
- README and INSTALL.md document the Claude Code plugin install path alongside `npx skills add`.

## 0.4.1 and earlier

Not tracked here. See the git history (`git log --grep "bump to"`) for prior releases.
