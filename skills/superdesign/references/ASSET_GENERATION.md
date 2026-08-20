# Image & Video Asset Generation

Read this when a design needs a new image or video asset. Decide what visual role the asset serves before choosing a generator. CLI flags and model capabilities change; discover the current surface with `list-models` and `<command> --help` rather than carrying a static parameter manual here.

## Decide whether to generate

Use an existing asset when the user or product already has the right logo, product image, illustration, screenshot, brand artwork, or footage. Do not regenerate identity assets or replace deliberate product content with synthetic substitutes.

Generate an image when the design needs original pixels that cannot be produced well by HTML/CSS alone, such as:

- a hero or campaign key visual
- a product/lifestyle scene or editorial still life
- an illustration, atmospheric background, texture, or empty-state artwork
- a poster, cover, social creative, or ad visual that will be composed with text separately

Do not generate ordinary UI controls, icons, logos, readable interface screenshots, or text-heavy artwork. Build UI and typography in the design draft; generated images should normally contain no text. For posters and marketing graphics, follow [GRAPHIC.md](GRAPHIC.md): generate only the key visual, leave deliberate negative space for copy, and compose all text in the HTML layer.

Generate video when motion itself is the asset, such as:

- a short hero/background loop
- a product or environment reveal
- image-to-video animation of a selected still or first frame
- a social clip, campaign motion asset, or cinematic transition

Do not generate video when a static image, CSS animation, or normal UI motion communicates the same thing more clearly and cheaply.

## Choose the generation path

### Image: prefer the host's native generator

If the host agent already has image generation (for example, the Codex harness), use it for ordinary image assets. It is the shortest path, avoids Superdesign generation credits, and gives the agent direct control over iteration. Import the selected result as project content:

```bash
npx --yes @superdesign/cli@latest upload-asset <file> \
  --project-id <project-id> --purpose content \
  --key "<stable-key>" --description "<visual role>"
```

Use `--purpose reference` instead when the generated image is only inspiration and must not appear in the final design. Reuse the returned public URL and canvas node id; do not re-upload unchanged bytes.

### Image: use Superdesign for a deliberate reason

Use `generate-image` when one or more of these apply:

- the user requests a specific Superdesign model
- the user wants to compare outputs from different models
- the desired model is better suited to the task than the host-native generator
- the generation should be tracked in the Superdesign asset ledger
- the host has no native image-generation capability

Inspect the live catalog before choosing. Tell the user which model you picked and the task-specific reason, such as stronger reference following, better textural detail, faster ideation, or higher output resolution:

```bash
npx --yes @superdesign/cli@latest list-models --type image
npx --yes @superdesign/cli@latest list-models <model-id>
npx --yes @superdesign/cli@latest generate-image --help
```

Then quote with `generate-image`. Shape the prompt around the asset's role in the design: subject and composition first, intended crop/aspect, location of negative space, lighting/material/style, and any supplied visual reference. Avoid asking the image model to solve page layout or render final UI copy.

### Video: use Superdesign

Superdesign is the generation path for video in this skill:

```bash
npx --yes @superdesign/cli@latest list-models --type video
npx --yes @superdesign/cli@latest list-models <model-id>
npx --yes @superdesign/cli@latest generate-video --help
```

Choose text-to-video when the scene can be described from scratch. Choose image-to-video when composition, subject identity, product appearance, or the opening frame must be controlled; use the selected canvas node, Brand Asset key, or public image URL as the source image. The source image determines the frame ratio, so an explicit aspect ratio belongs only to text-to-video.

In the prompt, describe the action over time: subject motion, camera behavior, environmental movement, pacing, and what must remain stable. Prefer short, focused clips over several unrelated actions in one generation. Inspect the selected model's schema for its actual duration, resolution, source-image, camera, seed, and prompt-optimizer support.

## Quote and confirm

`generate-image` and `generate-video` create a free quote and print the exact confirmation command. Relay the model, important output settings, quoted credits, and balance to the user. Run `confirm-generation` only after the user explicitly confirms that quoted price in this conversation; its `--credits` value must match the quote exactly.

Use the CLI response as the procedural guide instead of restating every flag here:

```bash
npx --yes @superdesign/cli@latest confirm-generation --help
npx --yes @superdesign/cli@latest get-generation --help
npx --yes @superdesign/cli@latest list-generations --help
```

One recovery rule is load-bearing: image/video confirmation is idempotent. If a host timeout interrupts `confirm-generation`, re-run the exact same command or continue with `get-generation <id> --wait`. Never request a replacement quote after confirmation has started; the original generation may still be running and retrying the same id will not double-charge.

## Put the result into the design

Keep the successful result's public asset URL and canvas node id. Use the URL in the design prompt or final HTML when the asset must visibly render, and pass the node id so the design model sees the actual pixels:

```bash
npx --yes @superdesign/cli@latest create-design-draft \
  --project-id <project-id> --title "<title>" \
  --reference-id <generated-node-id> \
  -p "Use the supplied image as <specific visual role>."
```

The same reference id can guide an iteration or flow generation where those commands accept `--reference-id`. A generated image intended for the final design is project content, not a Brand Asset merely because it appears prominently. Preserve logos, fonts, and reusable identity under the normal Brand Asset workflow.
