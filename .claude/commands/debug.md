---
description: Systematically investigate and fix an IskaVT bug
argument-hint: <bug description>
---

Debug: $ARGUMENTS

For 3D issues follow `.claude/skills/debugging-3d/SKILL.md`.

1. **Reproduce** — exact steps, environment (desktop / mobile emulation, route). Use the dev server + built-in browser; collect console and network evidence. If it can't be reproduced, say so and list what you tried.
2. **Root cause** — trace to the specific code (`file:line`). Distinguish cause from symptom; don't patch the symptom.
3. **Affected files** — what the fix touches and what else uses that code.
4. **Fix** — minimal change consistent with the existing patterns.
5. **Regression risk** — what could break (controls, teleport, avatar swap, loading, PWA cache, auth).
6. **Validation** — `yarn build`, re-run the reproduction steps, check the regression areas.

Remove any temporary logging before finishing. Explain the cause in plain terms.
