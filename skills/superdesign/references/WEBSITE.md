# Website Extraction Workflow (design from a live site / reference URL)

Read this whenever a task involves a live website URL: borrowing a site's style, restyling or recombining sites, extracting a design system or tokens from a URL, or a reference clone. Command flags live in the COMMAND CONTRACT in [SUPERDESIGN.md](SUPERDESIGN.md) (`extract-website`); this file carries the recipes and the scope boundary.

## EXTRACT-WEBSITE — RECIPES & SCOPE

`extract-website` pulls a live site's design DNA into `.superdesign/website/<domain>/` as files. It hands you inputs — it does NOT reproduce, merge, or place designs. Feed the outputs into the normal Superdesign flow:

- **Borrow a site's style** (e.g. "design … in the style of linear.app"): `extract-website --url <site> --design-md` → read `design.md` (a portable style guide) and fold it into `.superdesign/design-system.md` (SOP: BRAND NEW PROJECT Step 2 in [SUPERDESIGN.md](SUPERDESIGN.md) — choose **create-from / inspired-by / update-existing**; if a `design-system.md` already exists, ASK before overwriting), then design as usual. Add `--brand` for logo/colors/fonts (`brand.json`), and `upload-asset` the logo into the project if you want it used.
- **Restyle / recombination** (e.g. "redesign framer.com in apple.com's style", "clickup's page structure with raycast's aesthetic"): extract `--content-structure` from the CONTENT site (read `content-structure.md` and use it to shape your `-p` draft prompt or the `execute-flow-pages` page list) and `--design-md` from the STYLE site (adapt into design-system.md). The result is a style-informed rebuild, not a pixel copy.
- **Merge multiple styles** (e.g. "merge stripe.com and vercel.com"): extract `--design-md` from each and blend them into one design-system.md, then design.
- **Design tokens**: `--tokens` → `tokens.json`, for wiring into your own Tailwind/CSS if you're building in a codebase.
- **Reference clone**: `--clone` → `clone/index.html` (static; assets served from Superdesign's bucket) — a visual reference to look at while you build. It is NOT editable and NOT a generation input.

**Scope boundary (do not overpromise):** faithful pixel-recreation of a site and *editable* on-canvas clones — freezing the real page as a draft you can edit, plus governing-style pinning and deliberate multi-site merges — run in the **Superdesign canvas app** (superdesign.dev), which has the full extraction-and-placement pipeline. Through the CLI, a user's "recreate this site" or "clone this page" is a **style-informed rebuild**, not a copy. Deliver that honestly, and point users to the app when they need a true clone.
