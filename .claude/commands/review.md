---
description: Review IskaVT changes or files for bugs, architecture, performance, TypeScript, maintainability, security
argument-hint: [files, branch, or blank for uncommitted changes]
---

Review: $ARGUMENTS (if blank, review uncommitted changes: `git diff` + `git diff --staged` + untracked files).

Use the code-reviewer agent's checklist (`.claude/agents/code-reviewer.md`) against `CLAUDE.md` and `.claude/rules/`:
- bugs and edge cases
- architecture (scene/HUD split, gameplay vs UI, services layer, backend layering)
- performance (useFrame work, store subscriptions, lights/shadows, asset size)
- TypeScript (`any`, unsafe assertions)
- maintainability (duplication, dead code)
- security (`VITE_*` secrets, auth middleware on routes, input validation)

Report findings ranked by severity with `file:line`, a concrete failure scenario, and a suggested fix. **Do not edit code** — ask which findings to fix.
