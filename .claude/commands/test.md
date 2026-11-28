---
description: Run IskaVT validation (build, lint, syntax checks, manual walkthrough)
argument-hint: [area to focus on]
---

Validate IskaVT. Focus: $ARGUMENTS

There is no automated test suite (see `.claude/rules/testing.md`). Run what exists and report honestly:

1. `cd client && yarn build` — TypeScript + Vite build.
2. `cd client && yarn lint`.
3. Backend: `node --check` every changed `backend/**/*.js` (from `git status`).
4. If the focus area involves the Experience or UI: start the dev server, walk through the relevant flows from `.claude/agents/qa-tester.md` in the built-in browser (desktop and mobile emulation), and check console/network.

Report each check as pass/fail with the key output lines. List what was not tested (e.g. real-device performance, backend without `.env`). Don't fix failures unless asked — summarize them.
