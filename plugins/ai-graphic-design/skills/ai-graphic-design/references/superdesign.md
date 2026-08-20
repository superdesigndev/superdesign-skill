# Superdesign CLI contract

Use the published CLI on demand with the full prefix `npx --yes @superdesign/cli@latest`.

## Preflight and authentication

1. Confirm shell execution is available. If it is unavailable, stop: this plugin requires the CLI.
2. Run the bare command once. Read its `auth:` line and recent projects.
3. If logged out, run `login`, wait for success, and then continue.
4. Reuse a recent project only when it clearly holds the visual work the user referenced. Otherwise create one:

```bash
npx --yes @superdesign/cli@latest create-project --title "<project title>"
```

`create-project` opens the canvas by default. Use `--no-open` only in a headless environment.

## Canvas first — before any design work

As soon as the brief is clear enough to resolve or name a project, open its canvas before generating new image assets, uploading a newly generated asset, or calling `create-design-draft` / `iterate-design-draft`. This rule covers Graphic, Slides, and exhibition design; simple Moodboard collection keeps its intentional upload-then-open sequence in [moodboard.md](moodboard.md).

For a newly created project, keep `create-project`'s default browser-opening behavior and read the returned `canvas:` URL. For an existing project, mint current links:

```bash
npx --yes @superdesign/cli@latest canvas-link <project-id> --json
```

Attempt the handoff with the available browser surface:

- Open `embedCanvasUrl` only in an agent-embedded browser; never share this temporary sign-in URL with the user.
- Open `canvasUrl` in the user's normal browser when that capability is available, and always provide it as a clickable link.
- If automatic opening is unavailable or fails, provide `canvasUrl` and ask the user to open it manually. This does not block generation.

Before starting asset or design generation, send the user a progress update equivalent to: “The Superdesign canvas is open. You can keep it open and wait—new assets and designs will appear there as they are generated.” If automatic opening failed, state that accurately instead of claiming the canvas opened.

Do not wait until the first draft finishes to surface the canvas. For a long Slides or Graphic workflow, keep the user oriented while asset generation and uploads populate it.

## Command rules

- Verify uncertain flags with `<command> --help`; the published CLI is the source of truth.
- Use `create-design-draft` only for a new base artifact. Static visual work uses `--kind graphic` plus explicit `--width` and `--height`.
- Use `iterate-design-draft` from an existing draft for variations and related artifacts. Use `--mode branch` to preserve the source and `--mode replace` for an approved in-place revision.
- Pass the user's verbatim request through `--user-request` on generation and iteration commands.
- Use multiple `-p` flags only for the number of outputs the user requested. Keep batches to at most four outputs.
- Use `fetch-design-nodes --project-id <id>` to recover draft IDs from an earlier session.
- Read a draft with `get-design --draft-id <id> --json` before revising it.
- Upload local PNG, JPEG, WebP, or GIF assets under 10 MB with `upload-asset <file> --project-id <id>` and use the returned URL. Uploads are placed on the project canvas by default; never pass `--no-canvas` when the user wants to collect or view the asset there.
- Default output is agent-optimized. Add `--json` only when the full payload is needed and `--full` only for truncated fields.

## Failure handling

- For an authentication error, run `login` and retry the intended command once.
- Retry any other failed command at most once after correcting its specific cause.
- If generation still fails, report the command error and stop. Do not invent draft IDs, canvas links, or a successful result.

## Canvas review handoff

Read `canvas:` and `preview:` links from command output. The canvas has already been surfaced before generation; share it again at natural review points after the first draft or iteration completes. Appending `?live=1` to the returned canvas URL is allowed for watching drafts stream in; do not otherwise hand-construct URLs.
