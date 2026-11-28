# System overview

IskaVT is a 3D virtual tour of PUP Lopez campus plus an informational site and admin dashboards.

```
Browser (PWA, Vercel)                         Render                 MongoDB Atlas
┌───────────────────────────────┐   HTTPS   ┌──────────────────┐    ┌───────────┐
│ client/ React 19 + Vite       │ ───────▶ │ backend/ Express │ ──▶│ users,    │
│  • site pages (/home, /about…)│  /api/*   │  routes→ctrl→svc │    │ logbook,  │
│  • /experience (R3F scene)    │  JWT      │  →Mongoose models│    │ messages, │
│  • /admin, /super-admin       │           └──────────────────┘    │ feedback, │
│ static assets: public/models, │                                   │ settings  │
│ images, audio (SW-cached)     │                                   └───────────┘
└───────────────────────────────┘
```

## Client (`client/`)
- **Routing** (`App.tsx`, react-router v7): `/home`, `/features`, `/programs`, `/about[/:section]`, `/contact`, `/resources/faq/:variant`, `/resources/handbook`, `/resources/developers`, `/experience`, `/admin[/login]`, `/super-admin[/login]`.
- **Experience**: see [game-architecture.md](game-architecture.md) and [rendering-pipeline.md](rendering-pipeline.md).
- **State**: `hooks/useWorld.ts` (zustand, experience state + persisted settings); React context for app/page state (`context/FeedbackSettingsContext.tsx`, `features/admin/context`). `zustand` comes in transitively via drei/viverse and is not declared in `package.json`.
- **API layer**: `services/apiClient.ts` (`apiRequest`, `ApiError`, `setAuthTokenGetter`, base `VITE_API_BASE_URL`) + per-domain `*Api.ts`. `apiRequest` adds `Authorization: Bearer …` automatically and throws `ApiError(message, status)` using the `error`/`message` field of the JSON body (the shape `errorHandler.js` returns).
- **Admin auth**: `features/admin/utils/adminAuth.ts` stores the JWT session in `sessionStorage` and registers it with `setAuthTokenGetter`; routes guarded by `AdminProtectedRoute` / `SuperAdminProtectedRoute`. Login is backend-only (`/api/auth`).
- **PWA**: `vite-plugin-pwa` (`registerType: "prompt"`, `components/UpdatePrompt.tsx`). Precache: js/css/html/images ≤ 3 MB; runtime caches `iska-models` and `iska-administration-photos`.
- **Analytics**: `@vercel/analytics`, `@vercel/speed-insights`.

## Backend (`backend/`)
- Express 4, ESM. `server.js` mounts `/api/auth`, `/api/users`, `/api/settings`, `/api/logbook`, `/api/messages`, `/api/feedback`, `/api/health`.
- Layers: `routes/` → `controllers/` (via `middleware/asyncHandler.js`) → `services/` → `models/` (`User`, `Logbook`, `Message`, `Feedback`, `SiteSettings`). Errors: `utils/HttpError.js` → `middleware/errorHandler.js`.
- Auth: `middleware/auth.js` — `authenticate` (JWT with `sub`, `role`, `username`) and `requireRole('super_admin')`. Roles: `admin`, `super_admin`. `/users` and `/settings` require `super_admin`; `/auth/me` requires login. Logbook, messages and feedback require `admin`/`super_admin` except the visitor endpoints: `POST /logbook`, `GET /logbook/:id`, `PATCH /logbook/:id/timeout`, `POST /messages`, `POST /feedback`.
- Scripts: `seed:super-admin`, `seed:logbook`, `reset:super-admin-password`.

## Not present
No multiplayer/realtime (`socket.io-client` is installed but unused), no test suite, no world streaming.
