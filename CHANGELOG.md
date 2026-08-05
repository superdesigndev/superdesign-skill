# Changelog

Notable changes to the Superdesign skill and its plugin packaging.

Both plugin manifests carry an explicit `version`, so marketplaces only hand users an update when that
field is bumped — every release entry below corresponds to a `chore(plugin): bump to X.Y.Z` commit that
bumps `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` together.

## Unreleased

- Package the repo as a Claude Code plugin: `.claude-plugin/plugin.json` manifest, plus a self-hosted
  `.claude-plugin/marketplace.json` so it installs with
  `/plugin marketplace add superdesigndev/superdesign-skill` +
  `/plugin install superdesign@superdesign`.
- Preflight: the ChatGPT-specific "switch to the Work tab" message is now scoped to ChatGPT chat. Other
  harnesses that cannot run shell commands get a harness-neutral message instead.
- README and INSTALL.md document the Claude Code plugin install path alongside `npx skills add`.

## 0.4.1 and earlier

Not tracked here. See the git history (`git log --grep "bump to"`) for prior releases.
