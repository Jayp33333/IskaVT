# IskaVT — PUP Lopez Campus Virtual Tour

A real-time 3D web tour of the campus (desktop + mobile) — not a normal React site. Visitors walk the campus, follow line/path guides to destinations, talk to NPCs, and sign a logbook. Admins and a super admin manage logbook, messages, feedback, users and site settings.

## Stack
- `client/` — Vite (rolldown-vite) + React 19 + TS, React Three Fiber / drei / three.js, `@react-three/viverse` (character, BVH physics, VRM avatars), zustand store `hooks/useWorld.ts`, Tailwind v4, react-router v7, PWA. Deployed on **Vercel**.
- `backend/` — Express 4 + Mongoose 8 (ESM JS), JWT + bcrypt. **Render** + **MongoDB Atlas**.
- Two independent apps, no root package.json. The client reaches the backend only via `src/services/*Api.ts` → `apiClient.ts` (`VITE_API_BASE_URL`).

Details: `docs/architecture/` (system, game, rendering), `docs/gameplay/`, `docs/environment/`, `docs/optimization/`, `docs/deployment/`. `backend/README.md` is outdated (npm/Vercel) — trust `docs/` and `routes/`.

## Commands (yarn only — don't regenerate package-lock.json)
```
cd client  && yarn dev | yarn build | yarn lint
cd backend && yarn dev            # port 5000, needs backend/.env
cd backend && yarn seed:super-admin | seed:logbook | reset:super-admin-password
```
Never read, print, or commit `.env` files.

## Workflow
- Inspect existing code before proposing changes; reuse, make minimal changes, don't refactor or move files unasked.
- **Verify:** no test suite exists. Client changes → `yarn build` (must pass, ~3 min) and no new `yarn lint` problems (lint already has ~170 pre-existing issues). Backend → `node --check`; say what you couldn't verify.
- **Git:** never commit, push, or create branches unless asked.
- Commands: `/plan`, `/implement`, `/optimize`, `/debug`, `/review`, `/test`, `/build`. Agents in `.claude/agents/`, procedures in `.claude/skills/`, scoped rules in `.claude/rules/`.

## Hard constraints
- **Mobile performance first** — low/mid Android phones. Watch draw calls, shadows (default off), lights, textures, `useFrame` allocations, re-renders inside the Canvas. Measure before optimizing; explain the cost of scene changes.
- **Don't touch `client/public/models/`** (or other large assets) without asking.
- **Load size matters** — no heavy new dependencies; keep the PWA precache small.
- **Controls feel is hand-tuned** — movement speeds, sensitivity, look controls, joystick, camera: ask before changing values.

## Conventions
- 3D-experience state → `useWorld` (single-value selectors). App/page state → context + hooks. No jotai or new state libs.
- HUD is DOM in `components/Experience/ui/`, outside the Canvas. Gameplay logic stays out of UI.
- Models only via `data/modelRegistry.ts`. API calls only via `services/*Api.ts`.
- Campus content should move to the admin panel/backend; `src/data/` stays plain data.
- Admin login goes through backend JWT only. `VITE_*` vars are public — never put secrets there. New backend routes are staff-only (`authenticate` + `requireRole`) unless a visitor flow needs them.
- Unused deps `jotai`, `socket.io-client`: don't build on them without asking. Multiplayer is not implemented.

## Working with me
I'm learning: briefly explain the *why* behind changes, especially three.js / R3F concepts (render loop, instancing, culling, materials). Short and practical.
