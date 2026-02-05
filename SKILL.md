---
name: superdesign
description: Design agent for UI/UX design - find inspirations, generate design drafts, iterate on infinite canvas
author: superdesigndev
version: 1.0.0
tags:
  - design
  - ui
  - ux
  - frontend
  - figma
  - prototyping
agents:
  - claude-code
  - cursor
  - codex
  - windsurf
  - cline
  - continue
  - github-copilot
  - universal
---

# SuperDesign

Design agent specialized in frontend UI/UX design. Use this skill before implementing any UI that requires design thinking.

## Core Capabilities

1. **Help me design X** - Design features, pages, or flows
2. **Set design system** - Create or extract design systems
3. **Help me improve design of X** - Iterate and refine existing designs

## Prerequisites

```bash
npm install -g @superdesign/cli@latest
superdesign login
```

## Quick Start

```bash
# Search for design inspiration
superdesign search-prompts --tags "style" --json

# Create a project
superdesign create-project --title "My App" --json

# Create design variations
superdesign iterate-design-draft --draft-id <id> -p "dark theme" -p "minimal" --mode branch --json
```

## Workflow for Existing Apps

1. Investigate existing UI and workflow
2. Setup design system at `.superdesign/design-system.md`
3. Gather requirements using `askQuestion`
4. Create pixel-perfect replica in `.superdesign/replica_html_template/<name>.html`
5. Create project with replica + design system
6. Iterate designs with branching

## Key Commands

```bash
# Inspiration & Style
superdesign search-prompts --keyword "<keyword>" --json
superdesign get-prompts --slugs "<slug1,slug2>" --json
superdesign extract-brand-guide --url https://example.com --json

# Canvas Design
superdesign create-project --title "X" --set-project-prompt-file .superdesign/design-system.md --json
superdesign iterate-design-draft --draft-id <id> -p "..." --mode branch --json
superdesign execute-flow-pages --draft-id <id> --pages '[...]' --json
superdesign get-design --draft-id <id> --json
```

## Design System

Design system lives at: `.superdesign/design-system.md`

Options:
- **Extract from codebase**: Analyze existing tokens, colors, typography
- **Create new**: Use `search-prompts --tags "style"` for inspiration

## Resources

- [Full Documentation](https://github.com/superdesigndev/superdesign-skill)
- [SuperDesign CLI](https://www.npmjs.com/package/@superdesign/cli)
