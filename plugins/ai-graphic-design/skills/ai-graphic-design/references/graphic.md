# Graphic workflow

Use for posters, social posts, ads, covers, flyers, banners, thumbnails, invitations, and campaign assets.

## 1. Lock the brief

In one confirmation round, propose and confirm:

- purpose and destination platform;
- exact headline, supporting copy, metadata, and CTA;
- exact canvas dimensions;
- one composition direction, or 2–3 genuinely different directions when the request is open-ended;
- style, palette, brand constraints, and asset plan;
- exact number of outputs.

When the user names a platform but not a size, recommend its current standard size and confirm it before generation. User-provided dimensions always win.

## 2. Prepare assets

Use user assets when supplied. If the composition needs a new key visual and an image-generation tool is available, generate imagery without typography, logos, UI chrome, or other text-like marks. Upload every local asset to the Superdesign project and retain the returned URLs.

If no imagery is needed, use typography, shape, texture, and layout rather than generating filler imagery.

## 3. Create the graphic

Create one base draft per agreed direction. Use exact dimensions and `--kind graphic`:

```bash
npx --yes @superdesign/cli@latest create-design-draft \
  --project-id <id> --title "<title>" --kind graphic \
  --width <width> --height <height> \
  -p "<complete composition brief with exact copy and uploaded asset URLs>" \
  --user-request "<verbatim user request>"
```

The prompt must specify visual hierarchy, regions, alignment, safe margins, exact copy, and how uploaded assets are cropped or layered. Tell Superdesign to render all text as editable HTML.

For a coordinated campaign, approve the key visual first, then branch platform-specific assets from that draft with inherited style and explicit new dimensions.

## 4. Review once before handoff

Read each result with `get-design --json`. Check:

- exact copy and legibility;
- hierarchy, alignment, spacing, and balance;
- crop quality and contrast;
- absence of accidental UI controls or webpage chrome;
- correct fixed canvas size.

Make one `--mode replace` correction when there is an objective defect. Leave subjective choices for the user on the canvas.
