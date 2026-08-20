---
name: ai-graphic-design
description: "Create and iterate visual work on the Superdesign infinite canvas. Use for graphic design such as posters, social posts, ads, covers, flyers, banners, thumbnails, and campaign assets; for slides, presentations, presentation design, pitch decks, slide decks, PPT, or PowerPoint-style deck design; and for finding or creating a persistent Moodboard project, uploading and viewing AI-generated images, screenshots, brand assets, and visual references on its infinite canvas, or creating an exhibition-style webpage from selected assets when explicitly requested."
---

# AI Graphic Design

AI Graphic Design is powered by Superdesign. Use its CLI to turn briefs and references into editable visual drafts on an infinite browser canvas.

## Route the request

Choose exactly one primary workflow. A request may continue into another workflow after the first output is approved.

- **Graphic** — read [references/graphic.md](references/graphic.md).
- **Slides / Presentations / PPT** — read [references/slides.md](references/slides.md).
- **Moodboard project / AI asset collection / exhibition webpage** — read [references/moodboard.md](references/moodboard.md).

Always read [references/superdesign.md](references/superdesign.md) before running the CLI. Do not run repo analysis: these are standalone visual artifacts, not frontend implementation tasks.

## Shared product principles

- Treat the Superdesign project as the user's durable visual space, not a throwaway generation job. Reuse the relevant project when the user refers to earlier work.
- Before generating any image asset or design draft, resolve the project, attempt to open its canvas, and tell the user that the canvas is ready to remain open while content appears.
- Keep text in the generated HTML design layer. Do not bake headlines, labels, or slide copy into AI-generated images.
- Preserve exact user copy. Do not silently rewrite locked text.
- Upload user-provided or generated images to the project canvas and reference their returned public URLs in later design prompts.
- Put related outputs in one project so the canvas shows their relationships and variations side by side.
- Every generation spends credits. Confirm the number of directions, graphics, or slides before generating when it is not explicit.
- Keep the live canvas available during generation, then invite the user to inspect and comment on completed work. Do not claim visual success without reading the returned design or receiving user feedback.

## Completion

Return the clickable `canvas:` URL printed by the CLI, summarize what is on it, and offer 2–3 concrete next moves relevant to the artifact. Never construct project or preview URLs manually.
