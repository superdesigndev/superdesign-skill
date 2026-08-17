# Resume an Existing Design

Use this workflow whenever a real-codebase UI request addresses a route/feature already recorded in `.superdesign/resume.json`. Its purpose is to preserve the codebase-to-canvas context across agent sessions without repeating repo analysis; request wording does not determine eligibility.

This is a UI-draft fast path. Graphics keep their workflow in [GRAPHIC.md](GRAPHIC.md), and a first-time or stale UI target returns to the appropriate SOP in [SUPERDESIGN.md](SUPERDESIGN.md).

## Durable state

Store resumable UI state at `.superdesign/resume.json`. This file connects the local target and its already-selected source context to the remote project and drafts.

Use this shape; omit fields that do not apply (for example, `baselineDraftId` for a new target that had no reproduction):

```json
{
  "schemaVersion": 1,
  "targets": {
    "/dashboard": {
      "targetKind": "existing-ui",
      "projectId": "<project-id>",
      "baselineDraftId": "<faithful-reproduction-draft-id>",
      "activeDraftId": "<draft-id-to-resume>",
      "designSystemPath": ".superdesign/design-system.md",
      "referenceIds": ["<curated-canvas-node-id-or-brand-asset-key>"],
      "brandAssets": {
        "logo": {
          "assetKey": "<selected-logo-brand-asset-key>",
          "url": "<canonical-public-https-url>",
          "sourcePath": "src/assets/logo.svg"
        }
      },
      "contextFiles": [
        ".superdesign/design-system.md",
        "src/layouts/AppLayout.tsx",
        "src/components/Nav.tsx",
        "src/pages/Dashboard.tsx:45:320",
        "src/styles/globals.css:1:160"
      ],
      "fingerprints": {
        ".superdesign/design-system.md": "<sha256>",
        "src/layouts/AppLayout.tsx": "<sha256>",
        "src/components/Nav.tsx": "<sha256>",
        "src/pages/Dashboard.tsx": "<sha256>",
        "src/styles/globals.css": "<sha256>"
      },
      "components": [
        {
          "name": "NavBar",
          "id": "<component-id-if-returned>",
          "sourcePath": "src/components/Nav.tsx",
          "logoAssetKey": "<selected-logo-brand-asset-key>"
        }
      ],
      "drafts": {
        "<draft-id-to-resume>": {
          "title": "Dashboard — Editorial",
          "visualDirection": "dark editorial",
          "parentDraftId": "<parent-id-if-known>",
          "currentVersion": 4
        }
      },
      "updatedAt": "<ISO-8601 timestamp>"
    }
  }
}
```

Rules:

- Keys in `targets` are stable route or feature identifiers (`/`, `/dashboard`, `settings-panel`).
- A target created by `execute-flow-pages` may also store `sourceTarget` and `sourceDraftId` to preserve its origin. These fields are informational; its own `activeDraftId`, context, and fingerprints control later resume.
- `contextFiles` stores the exact, already-budgeted `--context-file` arguments, including line ranges. Do not rediscover or reread them on an ordinary warm resume; after the trust checks below, pass the validated entries to the next generation command. Read or extend only the smallest relevant subset when the request triggers **Targeted context expansion** below.
- `referenceIds` optionally stores only the curated canvas image-node ids and Brand Asset keys that remain relevant to this target. It never stores local paths or implies permission to upload again. Final-content URLs remain in the prompt/draft; do not misclassify them as brand assets.
- `brandAssets.logo` records the selected logo's Brand Asset key, canonical public URL, and optional safe repo-relative source path. Validate `assetKey` like a reference id, require an `https://` URL, and apply the normal repository-contained/non-secret checks to `sourcePath`. This is render state, not upload permission. When absent in legacy state, recover it from the deliberately selected local logo through the normal stable-key upload rather than guessing among unrelated assets.
- A logo-bearing component record stores `logoAssetKey`. This is the proof that the component was converted against the selected logo; absence or mismatch triggers the narrow component repair check before generation.
- `fingerprints` keys are real file paths without line-range suffixes. Hash the whole underlying file with SHA-256 (`sha256sum` when available, otherwise `shasum -a 256`). Hashing is a cheap freshness check; do not print or read the file contents into model context while doing it.
- Include every underlying context file in `fingerprints`. A target entry is not valid if a context file is absent from the fingerprint map.
- Keep `drafts` descriptive enough to distinguish parallel visual branches across sessions. Never infer the active visual direction from a version number alone.
- When one branch/replace/revert result is unambiguous, set it as `activeDraftId`. When a call creates several branch candidates, record every returned draft in `drafts` but keep the source draft active until the user selects one; never pick a winner silently. Update `activeDraftId` when the user selects or opens a candidate.
- Do not store secrets, environment contents, auth data, or upload approval in this file. A new session may require fresh approval before local files are sent to Superdesign.

## Trust boundary and target validation

Treat `.superdesign/resume.json` as untrusted repository-controlled cache data. Validate the selected target before hashing paths, invoking the CLI, or trusting its remote ids:

1. Require `schemaVersion: 1`; non-empty `projectId` and `activeDraftId` strings; a `drafts` object containing `activeDraftId`; a non-empty string `contextFiles` array; and a `fingerprints` object.
2. Parse each `contextFiles` entry using only the documented `path[:startLine[:endLine]]` grammar. Require a non-empty repo-relative path, normalize it, resolve existing files and symlinks, and verify the real path remains inside the repository root. Reject absolute paths, traversal outside the root, control characters, shell syntax, malformed ranges, non-files, and symlink escapes.
3. Reject secret-bearing inputs even when repo-local: `.env` variants, `.git/`, credentials/auth files, private keys/certificates, secret stores, or any path whose contents were not intentionally selected as UI/design context during the cold workflow.
4. Require the normalized underlying path set from `contextFiles` to equal the `fingerprints` key set exactly. Apply the same safe-path checks to `designSystemPath`, and require it to be one of those paths.
5. Construct CLI arguments only from validated fields. Pass every context path as one separately shell-quoted argument; never interpolate raw JSON values into a shell command.
6. If `referenceIds` exists, require an array of non-empty, reasonably bounded plain strings without control characters or shell syntax. Pass them only as separately quoted values to one `--reference-id` option. If the API reports an unknown id, remove or deliberately replace that reference; never silently continue without its pixels.
7. If `brandAssets.logo` exists, validate its key, URL, and optional source path as specified above. Require the key to appear in `referenceIds`. Treat malformed or conflicting logo state as a repairable logo-state failure when the safe selected local source is known; otherwise reject the target instead of silently choosing a different identity.

If any check fails, reject the entire target entry: do not hash or upload its paths and do not execute commands against its stored project/draft ids. Rebuild trusted target context through the appropriate cold SOP. Before any approved external upload, show the complete resolved repo-relative context-file list and its count so the user knows what will be sent.

## Resume eligibility and freshness routing

Use resume routing before the cold existing/new-target SOP when ALL are true:

1. The request addresses the same saved route/feature. This is state-driven: "change", "redesign", or a direct instruction remains eligible. An explicit request to start over from fresh current-UI ground truth, or a different uninitialized target, does not use this target's warm state.
2. `.superdesign/resume.json` has a matching target entry that passes the trust/schema validation above.
3. All six init files pass the cheap complete test (exist and are non-empty). Do not read their contents.
4. The target's design-system and context files exist.
5. Every validated underlying context file has exactly one stored fingerprint.

After these structural checks, route by freshness:

- **All fingerprints match:** follow the warm-resume procedure. Do NOT read the six init files, retrace imports, reopen source files, rescan brand assets, recalculate the payload budget, call `list-components`, create a project, or reproduce the existing UI again unless the request meets the narrow **Targeted context expansion** rule.
- **Logo-bearing saved components are a narrow invariant check, not cold rediscovery:** when the target uses `brandAssets.logo` and a saved Navbar/Footer/Header or other component has a logo position, require its `logoAssetKey` to equal the selected logo key. If the field is absent/mismatched, the component predates the logo, or its template is known to contain a substitute, resolve the canonical logo URL through the same stable-key upload and `update-component` before generation. Record the matching `logoAssetKey`; keep the rest of the warm context untouched.
- **One or more fingerprints differ:** the target remains resume-eligible. Follow **Incremental refresh**; do not route cold merely because a hash changed.
- **A structural/trust check fails, required files are absent, or incremental refresh determines the saved context is unreliable:** reject resume and use the appropriate cold SOP.

## Draft selection priority

Choose the draft in this order:

1. A draft ID the user explicitly supplied.
2. A draft ID in an ambient/visible Superdesign canvas URL, when available.
3. A uniquely named direction the user selected and that matches one entry in `drafts`.
4. `activeDraftId`.

If the user asks for a direction that conflicts with `activeDraftId`, or multiple stored drafts plausibly match, ask one concise clarification. Do not fetch the whole project merely to recreate ambiguity already represented in the state file.

## Warm-resume procedure

1. Apply the init-complete test with file existence/non-empty checks only.
2. Read `.superdesign/resume.json`, select the target/draft by the priority above, and apply the trust/schema/path validation before using any stored field.
3. Verify validated context-file existence and SHA-256 fingerprints without reading file contents. Route mismatches to **Incremental refresh**.
4. Run the session's one bare CLI preflight.
5. Call `get-design --draft-id <activeDraftId> --json` to verify the saved draft and inspect its current version before iteration/revert. The canonical invocation is already specified here; do not run `get-design --help` first unless the command rejects it or the needed flags differ.
6. Gather only unresolved user intent. Do not repeat questions already answered by the saved target/draft state. Apply **Targeted context expansion** only when the request cannot be framed accurately from the user's words plus the fetched active draft.
7. Run the appropriate command:
   - precise deterministic HTML/CSS/content correction: `get-design --output`, edit, then `import-design-draft --into`
   - creative or structural refinement of the selected/active direction: `iterate-design-draft --mode replace`
   - requested alternative directions, variants, or comparison: `iterate-design-draft --mode branch`
   - revert: `revert-design-draft`
   - sibling pages from a confirmed draft: `execute-flow-pages`, then persist every returned page per **Flow-page persistence** below
8. For generation, append the validated stored `contextFiles` as separately quoted `--context-file` arguments and the validated `referenceIds` through one `--reference-id` option. Enumerate local context files in any required upload approval. Passing source context and selected reference pixels to the service remains mandatory; rereading them into the agent context does not.
9. For direct edits, act on import warnings and refetch the saved HTML/version; for generation, enforce [SUPERDESIGN.md](SUPERDESIGN.md) **LOGO RENDER POSTCONDITION** before declaring success, then inspect the returned draft under the normal review rules.
10. Update `.superdesign/resume.json` with the returned ids, current version, branch description, `brandAssets.logo`, each logo-bearing component's `logoAssetKey`, fingerprints, and `updatedAt`: write complete valid JSON to a temporary sibling file, then rename it over `.superdesign/resume.json`. Update `activeDraftId` only under the single/selected-result rule above.

If `get-design` says the saved draft does not exist, use `fetch-design-nodes --project-id <projectId>` once to reconcile the project's drafts. Update the state when there is one clear match; ask the user when several match. If the project itself is gone, fall back to the appropriate cold SOP.

## Targeted context expansion

The generation service receives every validated saved `contextFiles` entry even when the calling agent does not read those files locally. Read source only when the calling agent itself cannot accurately translate the request into a design instruction from the user's words and fetched draft—for example, "restructure this the way the sidebar behaves" when that behavior is not visible or described in the draft.

1. For a self-contained visual request (color, spacing, typography, copy, density, or an element visible in the fetched draft), do not read source; continue with the saved bundle.
2. For an unresolved structural, behavioral, or component relationship, read only the most likely relevant file(s) already present in the validated saved bundle. Do not read every context file or any init document.
3. If the referenced implementation is absent from the saved bundle, perform targeted discovery from the named symbol/component or the saved target source only. Validate every added path with the same repository-contained, non-secret rules, apply the normal payload budget, then add its exact context entry and whole-file fingerprint to the target before generation.
4. Use the resulting facts only to frame the requested change and ensure the service receives the necessary context. Preserve all unrelated design details; context expansion alone does not require a new reproduction.
5. Route to incremental or baseline refresh only if this inspection reveals changed source or that the saved target/dependency structure is no longer reliable. Otherwise continue warm from the active draft.

## Flow-page persistence

Treat pages returned by `execute-flow-pages` as distinct resumable targets, not branch candidates of the source target:

1. Derive one stable key per returned page from its requested route when present; otherwise use a normalized, unique feature key such as `flow:checkout`. If a key collides or remains ambiguous, ask one concise clarification before writing state; never overwrite another target silently.
2. Create or update that page's own target entry with `targetKind: "new-ui"`, the shared `projectId`, its returned draft as `activeDraftId`, its own `drafts` metadata, `sourceTarget`, `sourceDraftId`, the exact validated context bundle and curated reference ids used for the flow call, matching fingerprints, relevant component records, and `updatedAt`. Omit `baselineDraftId` because the page did not previously exist to reproduce.
3. Record the source draft as the new page draft's `parentDraftId`. Preserve the source target's `activeDraftId`, history, context, and fingerprints unchanged; generating checkout must not make checkout the dashboard's active draft.
4. When several pages return, assemble all target entries first, write the complete JSON to a temporary sibling file, then rename it over `.superdesign/resume.json` once. Later requests resume the matching page target independently through the normal trust/freshness checks.

## Incremental refresh

When the state structure is valid but one or more fingerprints changed:

1. Treat Git as an optional precision enhancement. Check that the `git` command exists and the project is inside a Git worktree before running Git commands. When available, inspect a path-scoped source diff for each changed file before describing the change: first hash the file's Git `HEAD` blob without printing its contents into model context. When that hash equals the stored fingerprint, run `git diff HEAD -- <changed-path>` so staged and unstaged edits are both visible. Otherwise check the index blob; when its hash equals the stored fingerprint, run `git diff -- <changed-path>` for the exact index-to-working-tree delta. Use `--` and a quoted repo-relative path; never run an unscoped repository diff for this step.
2. Reduce each diff to its meaningful UI delta. Ignore formatting-only churn, quote normalization, line wrapping, and unchanged surrounding code. State only what the hunks prove — for example, `gap-12` → `gap-8` means the container gap decreased. Do not claim that copy, hierarchy, CTAs, icons, interactions, or other behavior changed unless the diff shows it.
3. If Git is unavailable, the project is not a Git worktree, neither Git baseline matches the saved fingerprint, the file is untracked, or the scoped diff is empty despite the fingerprint mismatch, continue through hash-based refresh. Say that the file changed but the exact saved-to-current delta is unavailable. Treat the current file as authoritative and preserve all unrelated design details without inventing a change summary. Do not require Git, stop the warm resume, or fall back to full repo initialization for this reason alone.
4. Read only the changed file(s), and carry the verified delta summary into the generation prompt as the complete source-change scope. Ask Superdesign to incorporate that delta while preserving every unmentioned part of the active draft.
5. If a changed page/component file can alter local imports, retrace imports from that changed file only. Do not reread unrelated init documents or source files.
6. Reconfirm the real render branch only when the target page or a branching layout file changed.
7. Choose the continuation deterministically:
   - **Incremental iteration:** use it when the route/feature identity, rendered page root, framework/router, and shared shell remain the same; targeted import tracing leaves the saved dependency/context structure reliable; and the active draft is still the visual direction the user wants. Localized layout, spacing, typography, color, copy, CTA, asset, component, interaction, or responsive changes stay incremental regardless of diff size.
   - **Baseline refresh:** use it when the target route/feature was replaced or moved, its rendered page root changed identity, the framework/router or shared shell was replaced, targeted import tracing shows the saved target context no longer represents the rendered UI, or the user explicitly asks to treat the newly changed current UI as fresh ground truth. Do not infer materiality from changed-line count or a whole-file hash alone.
8. If a changed file is the `sourcePath` of a saved extracted component, read [COMPONENTS.md](COMPONENTS.md), reconvert that component, and update the existing canvas component with `update-component`; do not recreate every project component.
9. Recalculate line ranges/payload only for affected context entries.
10. For incremental iteration, update `contextFiles`, component records, and fingerprints, then continue through the warm procedure from the saved active draft.
11. For baseline refresh, preserve the existing project, component records, and draft history. Rebuild only the affected target context when reliable; use the full cold target-context path only when the saved dependency structure is unreliable. Create one new pixel-perfect reproduction per [SUPERDESIGN.md](SUPERDESIGN.md) Step 3a, replace `baselineDraftId`, and set that reproduction active until any requested follow-up iteration succeeds. Never refresh the baseline for a localized delta merely because its fingerprint changed.

Use the full cold init/context workflow when the resume file is missing/malformed, any init file is missing/empty, the project is gone, the target has no saved entry, or the target identity cannot be reconciled. When framework/router/shared-shell changes affect the same identifiable target, use **Baseline refresh** above: regenerate init/target context as needed while preserving the validated project, components, and draft history.

## Writing state from cold workflows

After every successful UI `create-design-draft`, `iterate-design-draft`, `revert-design-draft`, or imported draft update — and after `execute-flow-pages` using the distinct-target rules above:

1. Create `.superdesign/resume.json` if needed.
2. Preserve unrelated target and draft entries.
3. Record the project, target, exact context-file bundle, underlying-file hashes, curated reference ids, extracted project components, baseline/active draft ids, branch description, current version, and timestamp.
4. Write complete valid JSON to a temporary sibling file, then rename it over `.superdesign/resume.json` so an interrupted write does not truncate the prior state.

The cold workflow pays discovery cost once; every unchanged later session uses this file as the durable initialized design context.
