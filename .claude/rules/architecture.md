# Architecture rules

- Two independent apps: `client/` (Vite + React + R3F) and `backend/` (Express + Mongoose). The client talks to the backend **only** through `client/src/services/*Api.ts` → `apiClient.ts`. Never import across the two folders.
- Client dependency direction: `pages/` → `components/` / `features/` → `hooks/` → `utils/` / `services/` → `data/`. `data/` and `utils/` must not import React components. A feature in `features/*` must not import from another feature.
- Inside the Canvas (`pages/Experience.tsx`, `components/Experience/*` except `ui/`) renders 3D only. The HTML HUD lives in `components/Experience/ui/` and is rendered by `ExperienceScene.tsx` **outside** the Canvas.
- Shared 3D-experience state goes in `hooks/useWorld.ts` (zustand). Page/app state uses context + hooks. No new state libraries.
- Cross-component imperative calls (e.g. teleport) use the registered-callback pattern in `utils/pinTeleport.ts`; reuse it instead of threading refs through props.
- Backend: `routes/` → `controllers/` (thin, wrapped in `asyncHandler`) → `services/` (logic) → `models/`. Throw `HttpError` for expected failures.
- Don't add an abstraction (factory, generic manager, base class) until it has at least two real users. Extend existing modules before creating new ones.
- Don't move or rename existing files unless the task requires it.
