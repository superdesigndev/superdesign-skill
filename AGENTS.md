# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

## What this repo is

A published agent **skill** (`skills/superdesign/`) that drives the SuperDesign design canvas via its CLI. The skill is prose, not code - there is no build/test suite. Files:
- `skills/superdesign/SKILL.md` - entry point (front-matter + core workflow)
- `skills/superdesign/references/SUPERDESIGN.md` - main design workflow (always read) + `COMMAND CONTRACT`
- `skills/superdesign/references/INIT.md` - repo-analysis (init) instructions
- `skills/superdesign/references/GRAPHIC.md` - poster/marketing-asset workflow (loaded only for graphics)
- `skills/superdesign/references/WEBSITE.md` - live-site extraction recipes (loaded only for reference-URL tasks)
- `skills/superdesign/references/COMPONENTS.md` - Petite-Vue template spec (loaded only before create/update-component conversions)
- `skills/superdesign/references/design-with-your-model.md` - caller-model HTML authoring/import path (loaded only when explicitly requested or after create/iterate retry failure)
- `skills/superdesign/{SUPERDESIGN,INIT}.md` - deprecated compatibility forwarders (do not add content)

## Skill flow invariant: two entry paths

`SKILL.md` branches on Step 1 into a **real-codebase path** (repo init is mandatory) and a **no-codebase path** (empty/scratch/sandbox workspace with no frontend code - skip init, gather design context conversationally, design via `SUPERDESIGN.md` "SOP: BRAND NEW PROJECT"). Within the real-codebase path, `SUPERDESIGN.md`'s UI TARGET ROUTING further splits by target: an **existing rendered page** goes reproduce-first (Step 3a ground truth), while a **new page in the codebase** skips reproduction entirely ("SOP: NEW TARGET IN EXISTING CODEBASE") - keep reproduction rules scoped to existing rendered targets. Any init/hard-gate rule you edit must stay scoped to the real-codebase path so it does not block the no-codebase path (see the HARD GATE and MANDATORY INIT rules in `SUPERDESIGN.md`). A separate Step 0 preflight halts when shell execution is unavailable (e.g. ChatGPT Chat mode) - distinct from the auth/login path, where the CLI actually ran.

## Ground truth for CLI behavior

The skill invokes `npx --yes @superdesign/cli@latest`. When editing any command example or the `COMMAND CONTRACT`, verify against the **published** CLI - do not trust memory. `@beta` is what `@latest` becomes, so use it to check upcoming surface:
- `npx --yes @superdesign/cli@beta <command> --help` for flags
- The bare command (no args) is the preflight surface: version, `auth:` status line (works logged-out too), recent projects
- Live-run read-only commands (search-prompts, get-prompts, list-design-systems) to see real output
- Valid `--model` values: run `list-models` (or pass a bogus `--model` to any generation command; the validation error prints the same list)
- Default (no `--json`) output is agent-optimized (compact TOON + `help[]` hints); add `--json` only for the full machine payload, `--full` only to expand truncated fields

## Plugin packaging & release

The repo root doubles as **three** plugins off one `skills/superdesign/` tree: `.codex-plugin/plugin.json` (Codex), `.claude-plugin/plugin.json` (Claude Code, alongside a self-hosted `.claude-plugin/marketplace.json` that lists the repo root as `"source": "./"`), and `.cursor-plugin/plugin.json` (Cursor marketplace, with a matching `.cursor-plugin/marketplace.json` in the same repo-root-as-source shape; Cursor listings are submitted manually to the Cursor team, see https://github.com/cursor/plugin-template). Releasing a new version is a single `chore(plugin): bump to X.Y.Z` commit editing the `version` in **all three** manifests plus the `## Unreleased` heading in `CHANGELOG.md`, merged via PR - there are **no git tags, no GitHub releases, and no CI/publish workflow** (verify with `git tag` / `gh release list` before assuming otherwise). Both marketplaces treat an explicit `version` as the update cache key, so pushing commits without bumping ships nothing to users.

Validate any manifest edit with `claude plugin validate ./.claude-plugin/plugin.json --strict` and `claude plugin validate ./.claude-plugin/marketplace.json --strict` (the bare `claude plugin validate .` resolves to the marketplace file, not the plugin one). The Claude Code review pipeline runs the same check on submission.

The marketplace-facing **display name** lives in three files. The two ChatGPT-facing ones must stay in sync with each other - `.codex-plugin/plugin.json` `interface.displayName` and `skills/superdesign/agents/openai.yaml` `display_name` - and carry the `01 ` listing-sort prefix. `.claude-plugin/plugin.json` `displayName` deliberately drops that prefix, since Claude Code's `/plugin` picker does not sort by name. All three are distinct from machine identity - the plugin slug (both `plugin.json` `name` fields), the skill dir/`SKILL.md` `name`, and the `$superdesign` / `superdesign:superdesign` invocations - which must never change on a rename.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
