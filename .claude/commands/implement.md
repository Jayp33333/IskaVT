---
description: Implement an approved IskaVT plan with minimal changes, then validate
argument-hint: <plan or feature to implement>
---

Implement: $ARGUMENTS

Rules:
- Follow the approved plan from this conversation. If there isn't one, inspect the code and state a short plan first; stop and ask if it touches tuned controls, `client/public/models/`, auth, or adds a dependency.
- Make the minimal change; reuse existing hooks, utils, components, store actions, and services.
- Keep the architecture in `.claude/rules/` (scene vs HUD, gameplay vs UI, `services/*Api.ts` for API, backend routes→controllers→services).
- No new `any`; no per-frame allocations or store writes.
- Don't commit.

Validate:
1. `cd client && yarn build` (TypeScript + Vite) — fix errors you introduced.
2. `cd client && yarn lint` — no new problems vs. before.
3. Backend files touched → `node --check <file>`.
4. If it changes the Experience, run the dev server and check the affected flow in the browser.

Report: files changed, what each change does and why (briefly explain any R3F/three.js concept), validation results, anything not verified.
