# Testing & validation rules

- **There is no test runner** in client or backend. Never claim tests passed.
- Client change → run `yarn build` (tsc + vite) and `yarn lint` in `client/`. Neither may get worse than before your change.
- Backend change → `node --check` the touched files; if a local `.env` exists, run `yarn dev` and hit `GET /api/health` plus the changed route. Say what you couldn't check.
- Experience/gameplay change → manual pass in the dev server: load `/experience`, walk, open the destination picker, follow the path guide, enter/exit a building, talk to an NPC, toggle settings. HUD changes also get a mobile-emulation check (812×375 landscape).
- Regression checklist when touching shared code: avatar swap (1st/3rd person), pin teleport, logbook modal, PWA update prompt, admin login.
- Adding a test framework (e.g. Vitest for pure functions in `utils/` and `data/`) is welcome but is a new dependency — ask first.
