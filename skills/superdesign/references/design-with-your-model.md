# Design with your model

Use this path when the user explicitly asks the current Agent to design, when `create-design-draft` / `iterate-design-draft` still fails after one retry, or when [SUPERDESIGN.md](SUPERDESIGN.md) **CORRECTION METHOD ROUTING** selects a deterministic direct edit. It replaces only the draft generation/correction step; keep the selected SOP, repo init, design-system context, assets, and canvas handoff unchanged.

1. Run `npx --yes @superdesign/cli@latest import-design-draft --help` and follow its HTML contract.
2. Author one complete draft document in `.superdesign/tmp/<name>.html` using the context already gathered for the normal design path. Resolve all JSX/React residue to literal HTML. Every embedded asset must use its uploaded public `https://` URL (or an intentional `data:` URL), never `/logo.svg`, `./image.png`, `file://...`, or another local path.
3. For a new draft, import it with an explicit viewport:

   ```bash
   npx --yes @superdesign/cli@latest import-design-draft \
     --project-id <id> --title "<title>" --device desktop \
     --html-file .superdesign/tmp/<name>.html \
     --generated-by <your-real-model-id> --user-request "<verbatim-user-request>"
   ```

4. To revise an existing draft, fetch it into a temporary working file with `get-design --output`, make only the intended deterministic changes, then import a revertible version:

   ```bash
   npx --yes @superdesign/cli@latest get-design --draft-id <draft-id> \
     --output .superdesign/tmp/<name>.html

   npx --yes @superdesign/cli@latest import-design-draft --into <draft-id> \
     --html-file .superdesign/tmp/<name>.html \
     --generated-by <your-real-model-id> --user-request "<verbatim-user-request>"
   ```

5. If import returns `invalid_html`, correct every reported issue exactly and retry once; never weaken or bypass the contract. Act on every returned `warnings[]` item or disclose any warning that genuinely requires user judgment.
6. Refetch with `get-design --draft-id <draft-id> --json` and verify the same draft id, the advanced current version, and the intended literal HTML/content changes. Do not claim visual verification from source inspection; surface the returned canvas URL for the user's rendered review.
7. For a real-codebase UI target, record the imported draft/version as the active result in `.superdesign/resume.json` per [RESUME.md](RESUME.md). Preserve the already-selected context bundle and fingerprints; graphics do not use this resume state.

Use the real model identifier exposed by the harness. If none is available, omit `--generated-by` instead of inventing one. Use `--width`/`--height` for a custom viewport and add `--kind graphic` for fixed-canvas graphics; read `--help` rather than guessing other flags.

For presentation HTML, read [PRESENTATION.md](PRESENTATION.md) first. A new presentation import uses `--kind presentation` plus the approved `--outline-file`, navigation, transition, and Brand Assets settings. An imported version preserves stored presentation metadata by default; pass `--outline-file` only after an approved structural slide edit, and pass `--navigation-controls` only when that preference changed.
