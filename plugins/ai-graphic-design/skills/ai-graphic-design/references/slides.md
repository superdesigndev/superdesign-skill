# Slides / Presentations / PPT workflow

Use for slides, presentations, pitch decks, PPT or PowerPoint-style decks, reports, talks, lessons, and slide redesigns. Slides are designed as a coordinated set of 16:9 graphic drafts on the same Superdesign canvas; this workflow does not promise native `.pptx` export.

## 1. Establish the deck

Confirm in one round:

- audience, purpose, presentation context, and desired outcome;
- exact slide count and approximate speaking time;
- source material and facts that must not be changed;
- brand or visual references;
- output ratio. Default to 1600×900 only when the user has no requirement;
- whether the user wants a new narrative or only visual design of supplied content.

Do not fabricate facts or fill missing evidence. Separate narrative editing from visual design and obtain approval for materially rewritten claims.

## 2. Select one Presentation Library template

Use Superdesign's dedicated [Presentation & Slide Deck library](https://superdesign.dev/library?category=presentations) as the default visual starting point. Search the same library through the CLI:

```bash
npx --yes @superdesign/cli@latest search-prompts --tags "presentation" --limit 20
```

Shortlist up to three returned templates that fit the deck's audience and content. In the same brief confirmation round, recommend one by title and explain the fit in one sentence. If the user already specified a clear direction, choose the best matching returned template and state the choice without adding another question.

After selection, fetch its complete body immediately before generation:

```bash
npx --yes @superdesign/cli@latest get-prompts --slugs "<selected slug>" --full
```

Use exactly one selected template as the deck's primary visual system. Do not blend multiple library prompts. Include the complete selected prompt body in the base-slide generation prompt under `PRESENTATION SYSTEM REFERENCE`; repeat it in later generation batches when needed to prevent drift. Adapt its layouts to the user's content rather than copying demo copy.

If the library search returns nothing, proceed with a custom system and tell the user. Do not invent a template slug.

## 3. Write a slide map

Before generation, present a compact numbered map. Each slide gets one job, a proposed headline, required content, and a suggested visual form. Avoid repeating title-plus-bullets layouts. Use charts only when real quantitative data is available.

## 4. Build and upload the asset pack

Before creating any slide draft, collect and prepare the deck's visual material. Follow the canvas-first rule in [superdesign.md](superdesign.md) before generating these assets so the user can keep the project open and watch the material appear.

Build a per-slide asset plan from:

- user-provided images, logos, screenshots, documents, product captures, and brand files;
- facts, data, quotations, and source links that require attribution;
- existing relevant assets already on the selected Superdesign project;
- new key visuals, backgrounds, textures, or illustrations that the narrative still needs.

Use available Agent image-generation capability proactively for a new deck unless the user requests a text-only presentation or supplied assets already cover the visual plan. Create a coherent small set rather than unrelated decoration: normally a cover key visual, one or more section/background treatments, and only the supporting illustrations the slide map justifies. Load and follow the available image-generation tool's instructions before using it.

For every generated image:

- carry the selected Presentation Library template's visual character, palette, and image treatment across the set;
- match the intended slide composition and favor a landscape 16:9 aspect for full-slide backgrounds;
- reserve deliberate negative space for slide copy;
- include no words, letters, logos, watermarks, charts, UI chrome, or text-like marks—Superdesign renders those as editable HTML;
- do not fabricate documentary evidence, real product screenshots, real people, or quantitative charts when authoritative source material is required.

Upload every selected or generated local asset to the deck project:

```bash
npx --yes @superdesign/cli@latest upload-asset "/absolute/path/to/asset.png" \
  --project-id <id>
```

Keep default canvas placement. Record each returned URL together with a short visual description and its intended slide role. Reuse assets where continuity helps, but do not force the same background onto every slide. Render charts, diagrams, labels, and exact data in the editable slide layer rather than baking them into images.

## 5. Create the visual anchor

Generate the cover or the most representative slide as the base graphic:

```bash
npx --yes @superdesign/cli@latest create-design-draft \
  --project-id <id> --title "01 — <slide title>" --kind graphic \
  --width 1600 --height 900 \
  -p "PRESENTATION SYSTEM REFERENCE: <complete selected library prompt>. ASSET PACK: <relevant uploaded URLs, visual descriptions, and intended roles>. Design slide 1 of <count>. <exact content>. Adapt the reference into a reusable deck system: grid, type scale, palette, imagery treatment, page numbering, and safe margins. Use the supplied assets deliberately and crop without distortion. Render text as editable HTML. This is a presentation slide, not a webpage." \
  --user-request "<verbatim user request>"
```

Share the canvas and obtain approval when the user asked to review the direction first.

## 6. Generate the remaining slides

Branch related slides from the approved anchor so they inherit its design language. Generate at most four slides per command, one `-p` per slide:

```bash
npx --yes @superdesign/cli@latest iterate-design-draft \
  --draft-id <anchor draft id> --mode branch \
  -p "Using <selected template title> as the presentation system, create slide 2 of <count>: <exact headline, content, and visual form>. Use these relevant assets: <uploaded URLs and roles>. Keep the source deck system; create a distinct composition, not another cover." \
  -p "Using <selected template title> as the presentation system, create slide 3 of <count>: <exact headline, content, and visual form>. Use these relevant assets: <uploaded URLs and roles>. Keep the source deck system; create a distinct composition, not another cover." \
  --user-request "<verbatim user request>"
```

Do not use branch prompts as style alternatives: each branch represents a different numbered slide. Keep titles zero-padded so canvas order is easy to scan.

## 7. Deck-level review

Read all slides and check the deck as a sequence:

- narrative progression and one clear message per slide;
- exact copy, numbers, citations, and source labels;
- consistent grid, typography, palette, image treatment, and numbering;
- coherent asset use, intentional crops, and no accidental repetition or generic filler imagery;
- sufficient contrast and presentation-distance legibility;
- meaningful composition variety without breaking the system;
- no browser navigation, buttons, or webpage sections.

Correct objective defects before handoff. Tell the user clearly that the canvas contains slide designs and that native PowerPoint export is outside this version unless another available tool is explicitly used afterward.
