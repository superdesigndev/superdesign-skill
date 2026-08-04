# Draft HTML authoring contract (for `import-design-draft`)

Read this BEFORE authoring any HTML you will import with `import-design-draft`.
This is the same contract the platform's own generation follows; the backend
validates imports against it. Hard violations are rejected (400 with fix
guidance); lesser issues import anyway but come back as a `warnings[N]:` block -
fix them in your HTML and push the corrected version with `--into`.

## Document shell (hard rules - violations are REJECTED)

- ONE complete HTML document: starts with `<!DOCTYPE html>`, has `<html>`,
  `<head>`, `<body>`. Fragments are rejected - they break the preview proxy's
  head/body injection.
- Max 20MB. Reference images by URL (or `upload-asset`) instead of inlining
  huge base64 payloads.

## Page structure (warned if violated)

- `<body>` has NO class attribute. Create ONE root `<div>` as the only direct
  element child of `<body>` and put ALL layout/styling classes there
  (`min-h-screen`, `bg-*`, `flex`, ...). The canvas and platform iterations
  rely on a clean body.
- Exactly ONE page/screen per draft. No hidden alternate views, no JS that
  swaps "pages" inside one file. More pages = more import calls.

## Styling

- Tailwind utility classes for ALL styling; no inline style attributes where a
  utility exists. Include `<script src="https://cdn.tailwindcss.com"></script>`
  in `<head>` (the preview proxy auto-injects it if missing, but including it
  keeps your local preview truthful).
- Fonts: `@import` from Fontshare or Google Fonts in a `<style>` block. If the
  project has FONT assets, import and apply those instead.

## Icons (warned if violated)

Use Iconify, prefer the `lucide` set:

```html
<script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
...
<iconify-icon icon="lucide:home"></iconify-icon>
```

The Iconify CDN script is NOT auto-injected - without it every icon renders
empty.

## Anchors and links (warned if violated; page kind only)

- Every `<a>` gets a unique descriptive id (`id="nav-home-link"`) - visual
  editing targets links by id.
- NEVER nest an `<a>` inside another `<a>` - browsers force-close the outer
  anchor and corrupt the DOM.
- No relative hrefs (`/products`): each draft is a standalone page on its own
  URL, so relative routes 404. Use full `https://` preview URLs for pages that
  exist, hash placeholders (`#settings`) for pages that don't.
- Never block native `<a>` navigation (`onclick="event.preventDefault()"` etc.).

## Images

- Real logo/brand assets from the project; placeholders for decorative photos.
  The proxy adds an automatic placeholder fallback to broken `<img>` URLs.

## Page vs graphic

- `--kind page` (default): responsive layout, Tailwind breakpoints, mobile-first
  where sensible. No phone-frame/device mockup around the UI.
- `--kind graphic` (posters, covers, social/ad creatives): one fixed canvas -
  root container `w-full h-screen overflow-hidden relative`, NO responsive
  prefixes, no interactive UI, no hotlinked stock images (pure CSS/SVG or
  provided assets only). Pair with `--width`/`--height`. Anchor/link rules do
  not apply.

## Viewport (required at import)

The platform cannot infer which viewport your HTML was designed for - you must
state it: `--device <mobile|tablet|desktop>` for a preset, or
`--width <px> --height <px>` (20-10000) for custom. There is no default.

## Minimal conformant skeleton

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
    <style>
      @import url("https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap");
    </style>
  </head>
  <body>
    <div class="min-h-screen bg-white text-neutral-900">
      <!-- the entire page lives inside this single root div -->
      <a id="nav-home-link" href="#home">Home</a>
    </div>
  </body>
</html>
```
