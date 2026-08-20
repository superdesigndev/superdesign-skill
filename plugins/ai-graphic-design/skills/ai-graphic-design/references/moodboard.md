# Moodboard project workflow

Treat the Superdesign project canvas itself as the user's moodboard: a persistent infinite workspace where visual assets can accumulate and remain available for viewing and reuse. Do not generate a separate moodboard graphic merely because the user says "moodboard."

## 1. Find or create the Moodboard project

Use a project the user explicitly names. Otherwise use a project named `Moodboard`.

List the available projects:

```bash
npx --yes @superdesign/cli@latest list-design-systems --json
```

Inspect `otherProjects` for a case-insensitive exact name match. Then:

- Reuse the single matching project.
- If there is no match, create it without opening the canvas prematurely:

  ```bash
  npx --yes @superdesign/cli@latest create-project \
    --title "Moodboard" --no-open --json
  ```

- If multiple projects have the exact target name, ask the user which one to use before uploading anything.

Do not create a new project for every upload. Use a topic-specific name such as `Moodboard — Campaign` only when the user asks for a separate moodboard.

## 2. Upload assets to the project canvas

Accept locally available user uploads, AI-generated images, screenshots, brand assets, and visual references. When the current session generates images, upload the resulting local files when the user asks to save or collect them.

Upload each local PNG, JPEG, WebP, or GIF under 10 MB:

```bash
npx --yes @superdesign/cli@latest upload-asset "/absolute/path/to/image.png" \
  --project-id <id>
```

Keep the default canvas placement. Never pass `--no-canvas` in this workflow. Record the returned public URL with the source filename or user description so the asset can be reused later.

Uploading is the moodboard action. Do not automatically generate a fixed-size board, reorganize the assets into a new composition, search for more references, critique the collection, or consume design-generation credits. Never imply that third-party work is owned by the user.

## 3. Open the canvas for the user

After all requested uploads finish, mint current canvas links:

```bash
npx --yes @superdesign/cli@latest canvas-link <project-id> --json
```

- Open `embedCanvasUrl` only in an available agent-embedded browser. Never share this temporary sign-in URL with the user.
- Share `canvasUrl` with the user and open it in their normal browser when that capability is available.
- Summarize which assets were added and report any upload failures.

If the user only asks to view their moodboard, skip uploading and open the existing project in the same way. Stop after the canvas handoff unless the user requested additional work.

## 4. Create an exhibition webpage only when requested

When the user explicitly asks to present selected moodboard assets, create a gallery, showcase, lookbook, portfolio, or other exhibition-style webpage in the same project. Treat this as a separate generated artifact, not as the moodboard itself.

Use the uploaded asset URLs and the user's requested narrative or interaction logic:

```bash
npx --yes @superdesign/cli@latest create-design-draft \
  --project-id <id> --title "<exhibition title>" --device desktop \
  -p "Design a single exhibition-style webpage using these selected moodboard assets: <URLs>. Follow the requested content, sequence, and interactions. Preserve the images as the primary material and avoid generic app or dashboard chrome." \
  --user-request "<verbatim user request>"
```

Only add sections, captions, filtering, navigation, motion, or other behavior the user's goal supports. Keep the uploaded source assets on the project canvas, and share the resulting preview together with the project canvas.
