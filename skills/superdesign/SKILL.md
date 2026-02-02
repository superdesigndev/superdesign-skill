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


# Superdesign CLI (MUST run before any command)

**IMPORTANT: Before running ANY superdesign command, you MUST ensure the CLI is installed and logged in.**

Follow these steps in order — do NOT skip any step:

1. Install (or update) the CLI:
   ```
   npm install -g @superdesign/cli@latest
   ```
2. Check login status by running any command (e.g. `superdesign --help`). If you see an auth/login error, run:
   ```
   superdesign login
   ```
   Wait for login to complete successfully before proceeding.
3. Only after login succeeds, run your intended superdesign commands.

> **Never assume the user is already logged in.** Always verify login first.

# How it works
MUST MANDATORY Fetch fresh guidelines below:
```
https://raw.githubusercontent.com/superdesigndev/superdesign-skill/main/skills/superdesign/SUPERDESIGN.md
```

Action accordingly based on instruction in the SUPERDESIGN.md