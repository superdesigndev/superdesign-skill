---
name: superdesign
description: >
  Superdesign is a design agent, where it specialised in frontend UI/UX design; Use this skill before you implement any UI that require some design thinking. Common commands: superdesign create-project --title "X" --template .superdesign/replica_html_template/home.html --json (setup project), superdesign iterate-design-draft --draft-id <id> -p "dark theme" -p "minimal" -p "bold" --mode branch --json (design iterate based on template or existing draft)
metadata:
  author: superdesign
  version: "0.0.1"
---

SuperDesign helps you (1) find design inspirations/styles and (2) generate/iterate design drafts on an infinite canvas.

---

# Core scenarios (what this skill handles)

1. **Help me design X** (feature/page/flow)
2. **Set design system**
3. **Help me improve design of X**

# How it works
Fetch fresh guidelines below:
```
https://raw.githubusercontent.com/superdesigndev/superdesign-skill/feat/context-files/skills/superdesign/SUPERDESIGN.md
```

Action accordingly based on instruction in the guidelines

# Superdesign CLI

```
npm install -g @superdesign/cli@latest
superdesign login
superdesign --help
```