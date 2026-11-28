---
description: Plan an IskaVT feature or change without modifying code
argument-hint: <feature or change to plan>
---

Plan this for IskaVT: $ARGUMENTS

Do **not** modify any files. Steps:

1. **Inspect** the existing implementation related to the request (search `client/src` and `backend/`; read the relevant files fully). Check `docs/` and `.claude/skills/` for the area. State what already exists — don't assume.
2. **Affected files**: list each file to change or create, with why.
3. **Dependencies**: store fields/actions in `useWorld`, data files, services/API routes, assets, npm packages (flag any new dependency — needs approval).
4. **Architectural impact**: does it fit `.claude/rules/architecture.md`? Scene vs HUD split, gameplay vs UI, backend layering. Performance cost on mobile (draw calls, per-frame work, asset size).
5. **Implementation steps**: ordered, small, each verifiable.
6. **Risks**: regressions (controls feel, teleport, avatar swap, PWA cache), tuned values touched, model files touched, things that can't be tested locally.
7. **Validation plan**: `yarn build`, lint, and the manual walkthrough needed.

End with any decisions the user must make.
