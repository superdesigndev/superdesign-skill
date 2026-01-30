---
description: Analyze git changes and create a commit without Claude Code attribution
model: haiku
---

# Git Commit Task

Analyze the current git changes and create a commit following these instructions:

## Instructions

1. First, run `git status` to see all changes
2. Run `git diff` to review unstaged changes
3. Run `git diff --cached` to review staged changes
4. Analyze all changes and draft an appropriate commit message that:
   - Summarizes the nature of the changes (new feature, enhancement, bug fix, refactoring, etc.)
   - Uses conventional commit format (feat:, fix:, refactor:, docs:, style:, test:, chore:, etc.)
   - Focuses on the "why" rather than the "what"
   - Is concise (50 characters or less for the subject line)

5. Stage relevant files with `git add`
6. Create the commit using ONLY the user's git config (no Co-Authored-By or Claude attribution)
7. Use this exact format for the commit:
   ```bash
   git commit -m "your commit message here"
   ```

## Important Notes

- DO NOT include any Claude Code attribution
- DO NOT add Co-Authored-By headers
- DO NOT include any emoji or "Generated with Claude Code" text
- Use only the user's configured git author information
- Ensure the commit message accurately reflects the changes
- Follow the repository's existing commit message style based on recent commits

## Example

If the changes are about adding a new feature for user authentication, the commit might be:

```bash
git commit -m "feat: add user authentication with JWT tokens"
```

Now proceed to analyze the current changes and create an appropriate commit.

Notice，before OpenPR，you should change branch to main in https://raw.githubusercontent.com/superdesigndev/superdesign-skill/[branch]/skills/superdesign/SUPERDESIGN.md of SKILL.md.