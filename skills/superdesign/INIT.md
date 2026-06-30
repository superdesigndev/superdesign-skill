You are performing a **SuperDesign Init**.

Init builds ONLY the **design-system layer** — the small, stable, reusable facts
that are the same for every design task (tokens, component variants, conventions).

Init does **NOT** analyze pages/layouts/routes. Page structure is gathered
just-in-time at design time, scoped to the one page the user confirms (see
"Layer B" at the bottom). This split is deliberate — see "Why two layers".

## Output Directory
Write to `.superdesign/init/` in the project root (plus `.superdesign/design-system.md`).

## Why two layers (read this first)

Init bundles two kinds of knowledge with **opposite economics**:

| | Layer A — Design system (THIS init) | Layer B — Page/layout structure (deferred) |
|---|---|---|
| Reused across tasks? | Yes, same every time | No — you design one page at a time |
| Safe to summarize? | **Yes, lossless** (a hex is a hex, a variant name is a variant name) | **No** — a lossy summary *mischaracterizes* layout |
| Goes stale? | Slowly (weeks) | Fast (every code change) |

Precomputing Layer B broadly is the #1 cause of bad reproductions: it's mostly
wasted (you only design one page), it goes stale, and **summarizing a layout
loses or fabricates the dominant structure** (e.g. calling a 30/70 master-detail
split a "card grid"). So init does Layer A only. Layer B is read fresh, from the
real source, when the target is known.

## Hard rules for init (Layer A)

1. **NO verbatim source dumps.** Do NOT paste full component/CSS/config file
   bodies. Record token *values* and variant *names* — reference full files by path.
   (The design CLI reads the real files fresh from disk via `--context-file`, so
   copying source into the init files buys nothing and wastes generation.)
2. **Extract from source, verify, never from memory.** Use `grep`/`sed`/`awk` to
   read actual values out of the real files. A guessed token or variant is a defect.
3. **Bounded sizes** (targets below). If a file runs long, tighten — don't pad.
4. **Active app only.** Detect the real frontend; never analyze legacy/duplicate apps.
5. You MAY build the two agents below **in parallel** (they touch different files).

## File 1 — `theme.md`  (target 80–120 lines)

Design tokens, extracted from the real token sources (e.g. `globals.css` /
`index.css` and `tailwind.config.*`). Include, concisely:

- **Color tokens** — full light + dark table, in the real format (HSL/hex/oklch as
  the source uses). Every semantic token: background, foreground, card, popover,
  primary, secondary, muted, accent, destructive/success/warning/info, border,
  input, ring, plus any sidebar/chart/skeleton sets and the `*-foreground` pairs.
- **Radius** — base + scale + the framework mapping.
- **Typography** — each font family + its CSS var + utility class.
- **Motion** — durations, easings (the actual cubic-beziers), and the LIST of
  animation names (names only — never paste keyframe bodies).
- **Shadows / elevation** — named shadows + their values.
- **Layout** — container width, padding.
- **Source paths** to the token files, for `--context-file` at design time.

Frame brand colors **precisely**: state what is core brand vs. what only appears
as an accent/glow/status. Don't over-claim an accent as the brand.

## File 2 — `design-system.md`  (at `.superdesign/`, NOT in init/, <55 lines)

A concise, human-readable base-prompt summary (palette, fonts, radius, motion,
component-style philosophy, conventions). `superdesign create-project` auto-loads
this file as the project base prompt, so keep it tight and accurate. No code dumps.

## File 3 — `components.md`  (≤150 lines)

Inventory of the shared UI primitive library + app-level shared components.
Compact table, one row per component: name · path · purpose · **variant value
names**.

**Accuracy bar — full variant sets, grep-extracted, verified:**
- For every variant-driven primitive (e.g. CVA/`cva(...)`), list the COMPLETE set
  of variant value names by reading the actual variant block, not from memory.
- **CAUTION:** a `dark:` / `hover:` / `focus:` token inside a className string is a
  utility prefix, NOT a variant key. Count only keys at the variant-object indent.
  (Mis-reading `dark:` as a "dark variant" is a real, recurring bug.)
- Separate variant-driven primitives from plain wrapper primitives.

## File 4 — `extractable-components.md`  (≤90 lines)

Components extractable as reusable `DraftComponent`s (recurring layout/shared
pieces — nav, cards, headers), with name · path · category · suggested extractable
props (state/nav/visibility/count props only). Names + paths, no source bodies.

---

## Layer B — Targeted page analysis (DESIGN TIME, NOT during init)

Do NOT produce `pages.md` / `layouts.md` / `routes.md` during init. When the user
confirms a specific design target, the design workflow performs a focused pass on
**that page only**:

1. **Confirm the target page first** (don't guess; a page can have list vs detail variants — design the right one).
2. **Read the real page source** and **identify the correct render branch.** Many
   components branch by responsive state (`if (!isMobile) {...}`), feature flag, or
   route. Find the branch that actually renders on the target route — do NOT trust
   a one-line description, and do NOT grab a line range you haven't read.
3. **Trace imports** from that branch to the real sub-components actually rendered.
4. **Build the exact `--context-file` list** and pass COMPLETE files (line-range
   only to skip pure logic or to slice a >1000-line file down to its render section).

This pass is fast (one page), always fresh (no staleness), and structurally
faithful (read, never summarized). It is the right place to spend effort.
