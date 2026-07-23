# Graphic Generation Workflow (posters, covers, social & marketing assets)

Use this workflow when the user asks for a **static poster-like artwork** — poster, flyer, cover art, album/book cover, event visual, social media graphic, banner artwork — rather than a web page or app screen. It replaces the EXISTING UI / BRAND NEW PROJECT SOPs.

CLI setup and login live in [SKILL.md](../SKILL.md) (the "Superdesign CLI" and "When a command fails" sections) — follow those. From [SUPERDESIGN.md](SUPERDESIGN.md), only these sections apply to graphics: the COMMAND CONTRACT, `upload-asset`, VERSION HISTORY & REVERT, the canvas-URL surfacing, TOOL USE RULE, and USER REQUEST PASSING. The init/design-system gates do NOT apply here: a standalone poster/marketing asset needs no repo init, no `.superdesign/init/` files, and no `design-system.md`/`globals.css` context — the brief carries the style. (Only run init and pass the design system if the user explicitly asks for on-brand output matching an existing codebase.)

Core idea: **you** produce the key visual with your own image-generation tool, upload it to Superdesign, and let Superdesign compose the graphic as pixel-perfect HTML on a fixed canvas. Text is always rendered by the HTML layer, never baked into images — that is what keeps graphics sharp, editable, and iterable.

A graphic lives in a project like any draft. Reuse the current project or `create-project --title "<topic> Graphics"` first.

## Overview

1. Confirm the brief (copy, canvas, layout, style, asset plan) — ONE confirmation round
2. Generate the key visual with your own image tool (only if the layout needs one)
3. `upload-asset` → public URL
4. `create-design-draft --kind graphic` with the assembled prompt
5. Share the canvas link, iterate on feedback

## Step 1 — Confirm the brief (one round, not three)

Draft a concrete proposal yourself, then confirm it with the user in a SINGLE round using your question/confirmation mechanism. Skip confirmation entirely when the user already gave full specs or says to generate directly.

**Folding in diverge-first:** for an open-ended request, SKILL.md's "diverge first" default (propose three distinct directions) is merged INTO this one brief-confirmation round — it is NOT a separate round. Present three distinct directions, each carrying its own **layout + style + asset plan**, while the shared items (purpose, verbatim copy, canvas) are confirmed once for all three. If the user accepts trying all three, that counts as an explicit request for three variants (generate them with `--mode branch`). For requests that already carry a clear spec, skip the divergence and confirm the single brief.

Cover these five items:

- **Purpose**: what the poster announces/sells and where it will be shown.
- **Verbatim copy**: the exact headline, subhead, info lines (date/venue/price/URL), and footer. Write them out and get them locked — the generator reproduces these strings EXACTLY, so typos and missing lines here become typos on the poster.
- **Canvas**: pick from the presets below (user-given dimensions always win).
- **Layout**: recommend ONE from the menu with a one-line reason; let the user swap.
- **Style + asset plan**: 2-3 style adjectives with a rough palette, and the asset plan implied by the layout (AI-generate / user provides a file / no imagery).

### Canvas presets

| Use case                     | Canvas (`--width`x`--height`) | Image-gen aspect for assets |
| ---------------------------- | ----------------------------- | --------------------------- |
| Portrait poster / print-like | 900x1200                      | portrait (e.g. 1024x1536)   |
| Square social post           | 1080x1080                     | square (1024x1024)          |
| Story / vertical social      | 1080x1920                     | portrait (1024x1536)        |
| Landscape banner / header    | 1500x750                      | landscape (1536x1024)       |

Image tools only offer fixed size steps — match the nearest **aspect**, not exact pixels; the poster layer crops with `object-cover`.

### Platform-specific marketing assets

When the poster is a marketing asset for a specific platform (feed post, story, cover, thumbnail, ad creative), use the exact platform dimension instead of the generic presets — and MUST confirm the dimension with the user before creating; do NOT assume it. The "recommended" size for a platform with multiple options is a starting suggestion, not a default you may skip confirming.

| Category  | Platform               | Asset Type            | Aspect Ratio | Recommended Size (px) |
| --------- | ---------------------- | --------------------- | ------------ | --------------------- |
| Feed      | Instagram              | Feed Post (Square)    | 1:1          | 1080 × 1080 (recommended, still confirm) |
| Feed      | Instagram              | Feed Post (Portrait)  | 4:5          | 1080 × 1350           |
| Feed      | Instagram              | Feed Post (Landscape) | 1.91:1       | 1080 × 566            |
| Feed      | Facebook               | Feed Post             | 1.91:1       | 1200 × 630            |
| Feed      | LinkedIn               | Feed Post             | 1:1          | 1200 × 1200 (recommended, still confirm) |
| Feed      | LinkedIn               | Feed Post (Landscape) | 1.91:1       | 1200 × 627            |
| Feed      | X / Twitter            | Post Image            | 16:9         | 1200 × 675            |
| Feed      | Threads                | Post Image            | 1:1          | 1080 × 1080           |
| Vertical  | Instagram              | Story                 | 9:16         | 1080 × 1920           |
| Vertical  | Instagram              | Reel Cover            | 9:16         | 1080 × 1920           |
| Vertical  | TikTok                 | Video / Cover         | 9:16         | 1080 × 1920           |
| Vertical  | YouTube                | Shorts                | 9:16         | 1080 × 1920           |
| Carousel  | Instagram              | Carousel Slide        | 4:5          | 1080 × 1350           |
| Carousel  | LinkedIn               | Carousel (PDF slides) | 1:1          | 1080 × 1080           |
| Cover     | LinkedIn               | Profile Cover         | 4:1          | 1584 × 396            |
| Cover     | Facebook               | Page Cover            | ~1.9:1       | 1640 × 856            |
| Cover     | X / Twitter            | Header                | 3:1          | 1500 × 500            |
| Cover     | YouTube                | Channel Art           | 16:9         | 2560 × 1440           |
| Thumbnail | YouTube                | Video Thumbnail       | 16:9         | 1280 × 720            |
| Ads       | Google Display Ads     | Medium Rectangle      | 4:3          | 300 × 250             |
| Ads       | Google Display Ads     | Large Rectangle       |              | 336 × 280             |
| Ads       | Google Display Ads     | Leaderboard           |              | 728 × 90              |
| Ads       | Google Display Ads     | Large Leaderboard     |              | 970 × 90              |
| Ads       | Google Display Ads     | Billboard             |              | 970 × 250             |
| Ads       | Google Display Ads     | Half Page             |              | 300 × 600             |
| Ads       | Google Display Ads     | Large Mobile Banner   |              | 320 × 100             |
| Ads       | Google Display Ads     | Mobile Banner         |              | 320 × 50              |
| Ads       | Google Display Ads     | Square                |              | 250 × 250             |
| Ads       | Google Display Ads     | Small Square          |              | 200 × 200             |
| Ads       | Google Performance Max | Landscape Image       | 1.91:1       | 1200 × 628            |
| Ads       | Google Performance Max | Square Image          | 1:1          | 1200 × 1200           |
| Ads       | Google Performance Max | Portrait Image        | 4:5          | 960 × 1200            |
| Ads       | Google App Ads         | App Landscape         | 1.91:1       | 1200 × 628            |
| Ads       | Google App Ads         | App Square            | 1:1          | 1200 × 1200           |

Small ad units (leaderboards, banners, squares under ~400px) are micro-layouts: default to the type-hero or split layout at reduced scale, skip generated key visuals below 300px on the short side, and keep copy to a headline + CTA.

### Layout menu (pick exactly one)

| Layout             | Composition skeleton                                                                                          | Whitespace                 | Key visual                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------ |
| **type-hero**      | Giant headline dominates (~8-20% of canvas height), tight leading; small info block + footer on a strict grid | 60-70%                     | none — typography IS the poster            |
| **full-bleed**     | Key visual fills the whole canvas; text overlaid on a darkened/tinted zone or gradient scrim                  | 30-40% clear zone for text | background image (no text in it)           |
| **split**          | Canvas divided (top/bottom or left/right ~55/45): one zone pure imagery, the other a clean info panel         | 40-50% in info zone        | subject image (product, artwork, portrait) |
| **list**           | Title band + 3-7 numbered/bulleted entries on an aligned grid; compact footer                                 | 20-35%                     | optional small accent image or none        |
| **centered-badge** | Everything centered and symmetric like a certificate/invitation: ornament, headline, details stacked          | 50-60%                     | optional decorative motif                  |

Routing hints: slogan/quote/announcement → type-hero; concert/film/album/atmosphere → full-bleed; product/exhibition piece → split; agenda/ranking/menu → list; invitation/award → centered-badge.

## Step 2 — Key visual (your own image tool)

Only for layouts that need one (see menu). Rules for the image prompt:

- Subject + composition first, then style and palette (carry the confirmed style adjectives; name 2-3 hex-ish colors).
- Tell the model to **leave clear negative space** where the layout will place the headline (e.g. "upper third clean and uncluttered").
- **ABSOLUTELY NO TEXT in the image**: no letters, words, logos, watermarks, or UI. Text belongs to the poster layer.
- Use the aspect from the canvas table.

Show the generated image to the user and offer one regenerate/adjust round (more only if they ask). While looking at the image, write yourself a short **visual description** — dominant colors (approximate hex), composition, where the negative space is. You will paste this into the graphic prompt so the layout generator can match colors and place text without seeing the image.

If the user provides their own image file, skip generation and continue with upload.

## Step 3 — Upload the asset

```bash
npx --yes @superdesign/cli@latest upload-asset <file> --project-id <projectId>
```

Accepts png/jpeg/webp/gif up to 10MB and prints a public `url` — that URL is what goes into the graphic prompt. Upload each asset once and reuse the URL across drafts/iterations. The asset also appears on the project canvas as an image node next to the graphic drafts (pass `--no-canvas` to skip that).

## Step 4 — Generate the graphic

```bash
npx --yes @superdesign/cli@latest create-design-draft --project-id <id> \
  --title "<Poster title>" --kind graphic --width <W> --height <H> \
  -p "<assembled prompt>"
```

Assemble the single `-p` prompt from the confirmed brief:

```text
Design a static graphic. The canvas is EXACTLY <W>x<H>px — nothing may overflow or scroll.

LAYOUT — <layout name>: <composition skeleton from the menu, expanded with your art direction>

COPY (reproduce these strings EXACTLY — no rewording, no additions):
- Headline: "<...>"
- Subhead: "<...>"
- Info: <date / venue / price / URL lines>
- Footer: "<...>"

KEY VISUAL: use <asset url> as the <background / subject / accent per layout> — embed via <img> or CSS background-image with object-cover, never distort. The image is: <your visual description: palette hexes, composition, where the negative space is>. Match the poster's remaining colors and text placement to it.

STYLE: <style adjectives, palette, font character (e.g. heavy grotesque headline + light mono captions)>.
```

Omit the KEY VISUAL block for asset-less layouts.

## Step 5 — Review & iterate

- Give the user the `canvas` link from the command output (and the `preview` link).
- Iterate with `iterate-design-draft` as usual — drafts created with `--kind graphic` stay in graphic mode server-side, so plain instructions like "make the headline bigger" are safe.
- `--mode branch` works well for exploring 2-3 poster directions from the same brief and asset.

## Series (multiple graphics)

Never use flow pages for posters. One poster = one `create-design-draft` call; for a series, keep the copy per poster but reuse the same style direction and asset URLs so the set stays coherent, and generate the shared key visual once before the first poster.
