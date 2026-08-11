# Changelog

Notable changes to the Superdesign skill and its plugin packaging.

All plugin manifests carry an explicit `version`, so marketplaces only hand users an update when that
field is bumped — every release entry below corresponds to a `chore(plugin): bump to X.Y.Z` commit that
bumps `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, and `.cursor-plugin/plugin.json` together.

## Unreleased

- Add Cursor plugin packaging (`.cursor-plugin/plugin.json` + `.cursor-plugin/marketplace.json`) for the
  Cursor marketplace, off the same `skills/superdesign/` tree.

## Unreleased

- Add durable `.superdesign/resume.json` state and a warm cross-session UI iteration path that reuses
  project/draft ids, extracted components, and the previously budgeted context-file bundle without
  rereading all init/source files or repeating baseline reproduction when fingerprints are unchanged.
  For changed fingerprints, use a path-scoped Git diff when available and pass only its verified
  semantic delta into the iteration prompt. Without Git or a matching baseline, continue with a
  hash-based incremental refresh without inferring unrelated source changes. Treat persisted state
  as untrusted cache data: validate schema and repository-contained, non-secret context paths before
  use, and route fingerprint mismatches explicitly to incremental repair rather than cold discovery.
  Refresh the reproduction baseline only for deterministic target/render-structure changes, and save
  every `execute-flow-pages` result as an independent resumable target without changing its source.

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
