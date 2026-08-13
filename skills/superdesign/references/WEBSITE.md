# Website Extraction Workflow (design from a live site / reference URL)

Read this whenever a task involves a URL: a direct public image, borrowing a live site's style, restyling or recombining sites, extracting a design system or tokens, or a reference clone.

## URL ROUTING

Classify the URL before choosing a tool:

- **Direct public image URL** — materialize it as an external temporary file, then use the normal `upload-asset` purpose routing. Accept only an explicit `http://` or `https://` URL whose final response is a supported raster image or safe SVG within 10 MB. Do not send cookies, credentials, authorization headers, or repository data. Follow redirects only while every destination remains public HTTP(S); reject loopback, private, link-local, and cloud-metadata destinations. Bound the download while streaming rather than downloading an unlimited body, verify the actual response bytes/type instead of trusting the extension or `Content-Type`, and stop if the environment cannot perform these checks safely. Use an isolated temporary directory outside the repository and remove it after upload. If the response is HTML or another non-image, treat it as a webpage URL or ask the user what visual they mean.
- **Webpage URL** — use `extract-website` through the recipes below. Run `extract-website --help` for its flags; see the COMMAND CONTRACT in [SUPERDESIGN.md](SUPERDESIGN.md) for crawl time and output gotchas.
- **PDF URL/file** — first-class PDF reference ingestion is not part of this workflow. Do not upload the raw PDF or silently render every page. Ask the user for the relevant pages as images, or explain that PDF-to-reference support is deferred.

For a downloaded direct image, classify its purpose exactly like a local image: `reference` for temporary inspiration, `content` when it must appear in the result, and `brand` only for reusable identity. Pass the returned node id or Brand Asset key through `--reference-id`; for content also use the returned public URL in the prompt/HTML.

## EXTRACT-WEBSITE — RECIPES & SCOPE

`extract-website` pulls a live site's design DNA into `.superdesign/website/<domain>/` as files. It hands you inputs — it does NOT reproduce, merge, or place designs. Feed the outputs into the normal Superdesign flow:

- **Borrow a site's style** (e.g. "design … in the style of linear.app"): `extract-website --url <site> --design-md` → read `design.md` (a portable style guide) and fold it into `.superdesign/design-system.md` (SOP: BRAND NEW PROJECT Step 2 in [SUPERDESIGN.md](SUPERDESIGN.md) — choose **create-from / inspired-by / update-existing**; if a `design-system.md` already exists, ASK before overwriting), then design as usual. Add `--brand` for logo/colors/fonts (`brand.json`). When the site's appearance itself is a selected visual reference, add `--brand-assets` to download its screenshot, upload that screenshot with `--purpose reference` (never brand), and pass its canvas node id through `--reference-id`. Upload only approved reusable identity files with `--purpose brand --type <logo|font|image> --key <stable-key> --description <use>`; pass the returned Brand Asset key when its pixels must guide generation.
- **Restyle / recombination** (e.g. "redesign framer.com in apple.com's style", "clickup's page structure with raycast's aesthetic"): extract `--content-structure` from the CONTENT site (read `content-structure.md` and use it to shape your `-p` draft prompt or the `execute-flow-pages` page list) and `--design-md` from the STYLE site (adapt into design-system.md). The result is a style-informed rebuild, not a pixel copy.
- **Merge multiple styles** (e.g. "merge stripe.com and vercel.com"): extract `--design-md` from each and blend them into one design-system.md, then design.
- **Design tokens**: `--tokens` → `tokens.json`, for wiring into your own Tailwind/CSS if you're building in a codebase.
- **Reference clone**: `--clone` → `clone/index.html` (static; assets served from Superdesign's bucket) — a visual reference to look at while you build. It is NOT editable and NOT a generation input.

**Scope boundary (do not overpromise):** faithful pixel-recreation of a site and *editable* on-canvas clones — freezing the real page as a draft you can edit, plus governing-style pinning and deliberate multi-site merges — run in the **Superdesign canvas app** (superdesign.dev), which has the full extraction-and-placement pipeline. Through the CLI, a user's "recreate this site" or "clone this page" is a **style-informed rebuild**, not a copy. Deliver that honestly, and point users to the app when they need a true clone.
