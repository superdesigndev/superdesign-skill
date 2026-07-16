# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

## What this repo is

A published agent **skill** (`skills/superdesign/`) that drives the SuperDesign design canvas via its CLI. The skill is prose, not code - there is no build/test suite. Files:
- `skills/superdesign/SKILL.md` - entry point (front-matter + core workflow)
- `skills/superdesign/references/SUPERDESIGN.md` - full design workflow + `COMMAND CONTRACT`
- `skills/superdesign/references/INIT.md` - repo-analysis (init) instructions
- `skills/superdesign/{SUPERDESIGN,INIT}.md` - deprecated compatibility forwarders (do not add content)

## Skill flow invariant: two entry paths

`SKILL.md` branches on Step 1 into a **real-codebase path** (repo init is mandatory) and a **no-codebase path** (empty/scratch/sandbox workspace with no frontend code - skip init, gather design context conversationally, design via `SUPERDESIGN.md` "SOP: BRAND NEW PROJECT"). Any init/hard-gate rule you edit must stay scoped to the real-codebase path so it does not block the no-codebase path (see the HARD GATE and MANDATORY INIT rules in `SUPERDESIGN.md`). A separate Step 0 preflight halts when shell execution is unavailable (e.g. ChatGPT Chat mode) - distinct from the auth/login path, where the CLI actually ran.

## Ground truth for CLI behavior

The skill invokes `npx --yes @superdesign/cli@latest`. When editing any command example or the `COMMAND CONTRACT`, verify against the **published** CLI - do not trust memory. `@beta` is what `@latest` becomes, so use it to check upcoming surface:
- `npx --yes @superdesign/cli@beta <command> --help` for flags
- Live-run read-only commands (search-prompts, get-prompts, list-design-systems) to see real output
- Valid `--model` values: pass a bogus `--model` to any generation command; the CLI prints the supported list
- Default (no `--json`) output is agent-optimized (compact TOON + `help[]` hints); add `--json` only for the full machine payload, `--full` only to expand truncated fields

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
