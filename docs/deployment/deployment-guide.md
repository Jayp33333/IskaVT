# Deployment guide

## Client → Vercel
- Root directory: `client/`. Build: `yarn build` (`tsc -b && vite build`), output `dist/`.
- `client/vercel.json`: SPA rewrite to `index.html`; immutable caching for `/assets/*` and `/models/*`; no-cache for `sw.js`, `workbox-*`, `manifest.webmanifest` and HTML.
- Build ID: `VERCEL_GIT_COMMIT_SHA` (first 7 chars) → `__APP_BUILD_ID__`, appended as `?v=` to model URLs so new deploys bust model caches.
- Env vars (Vercel project settings):
  - `VITE_API_BASE_URL` — Render backend URL incl. `/api` (**required**; defaults to `http://localhost:5000/api`).
  - `VITE_VIVERSE_APP_ID`, `VITE_FEEDBACK_GOOGLE_FORM_URL`.
  - `VITE_ADMIN_USERNAME` / `VITE_ADMIN_PASSWORD` — no longer used by the code; delete them from Vercel.
- PWA: users get an update prompt (`registerType: "prompt"`) on new deploys.

## Backend → Render
- Root directory: `backend/`. Build: `yarn install`. Start: `yarn start` (`node server.js`). Health check path: `/api/health`.
- Env vars: `MONGODB_URI` (Atlas), `JWT_SECRET`, `NODE_ENV=production`, `PORT` (Render provides), `SUPER_ADMIN_USERNAME`, `SUPER_ADMIN_PASSWORD`, `SUPER_ADMIN_EMAIL`.
- First deploy: run `yarn seed:super-admin` once (Render shell) to create the super admin.
- CORS is currently open (`cors()` with no origin list).

## Database → MongoDB Atlas
Allow Render's outbound IPs (or 0.0.0.0/0 with a strong password) in Atlas network access.

## Release checklist
`/build` command → push → check Vercel preview → open `/experience` on a phone → check admin login against the production API.

> `backend/README.md` still says npm/Vercel for the backend; this guide reflects the actual setup (yarn, Render).
