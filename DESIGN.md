# DESIGN.md — a design system file for AI coding agents

Coding agents write great code and mediocre interfaces. One reason: they have no persistent sense of
*how this product is supposed to look*. `AGENTS.md` and `CLAUDE.md` tell an agent how your code
works. **A design system file does the same for how your product looks** — colors, typography,
spacing, motion, component patterns, and the product context behind them — so every UI the agent
ships is consistent with the last one instead of reinventing a generic look each time.

This is the design equivalent of `llms.txt` or `AGENTS.md`: a single, human-readable file an agent
reads before it designs.

## What goes in it

A good design system file is **implementable without the codebase** — an agent (or a person) should
be able to build on-brand UI from it alone:

- **Product context** — what's being built, who it's for, the core value, key user journeys.
- **Design tokens** — colors, typography, spacing, radius, shadows.
- **Motion** — animation and interaction patterns.
- **Components** — the real patterns your product uses, with usage notes.

## How Superdesign uses it

The [Superdesign skill](./README.md) reads and writes this file at
`.superdesign/design-system.md`. It can:

- **Extract** one from your existing codebase (tokens, components, patterns), or
- **Create** a new one from references when you're improving current UI.

If the file is missing, the skill runs **Design System Setup** first, then designs against it — so
every draft on the canvas inherits the same system. See the README for the full workflow.

## Why it matters

A design system file is the difference between an agent that produces *default-shadcn-everything* and
one that produces UI that looks considered. Capture it once; every design after that is consistent,
on-brand, and faster to ship.

---

Part of [Superdesign](https://superdesign.dev), the AI product design agent. Browse the
[prompt library](https://superdesign.dev/library) for ready-made style and component direction.
