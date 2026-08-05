# Design with your model

Use this path only when the user explicitly asks the current Agent to design, or when `create-design-draft` / `iterate-design-draft` still fails after one retry. It replaces only the draft-generation step; keep the selected SOP, repo init, design-system context, assets, and canvas handoff unchanged.

1. Run `npx --yes @superdesign/cli@latest import-design-draft --help` and follow its HTML contract.
2. Author one complete draft document in `.superdesign/tmp/<name>.html` using the context already gathered for the normal design path.
3. For a new draft, import it with an explicit viewport:

   ```bash
   npx --yes @superdesign/cli@latest import-design-draft \
     --project-id <id> --title "<title>" --device desktop \
     --html-file .superdesign/tmp/<name>.html \
     --generated-by <your-real-model-id> --user-request "<verbatim-user-request>"
   ```

4. To revise an existing draft, fetch it with `get-design`, edit its HTML, then import a revertible version:

   ```bash
   npx --yes @superdesign/cli@latest import-design-draft --into <draft-id> \
     --html-file .superdesign/tmp/<name>.html \
     --generated-by <your-real-model-id> --user-request "<verbatim-user-request>"
   ```

5. Act on any returned `warnings[]`, then surface the returned `canvas` URL as usual.

Use the real model identifier exposed by the harness. If none is available, omit `--generated-by` instead of inventing one. Use `--width`/`--height` for a custom viewport and add `--kind graphic` for fixed-canvas graphics; read `--help` rather than guessing other flags.
