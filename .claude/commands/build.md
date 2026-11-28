---
description: Validate the IskaVT production build — TypeScript, lint, build output, asset loading, production config
---

Validate the production build:

1. **TypeScript + build**: `cd client && yarn build`. Report errors and the largest output chunks.
2. **Lint**: `cd client && yarn lint`.
3. **PWA**: confirm `dist/sw.js` exists; check workbox warnings about files over the 3 MB precache limit; confirm no `.glb`/`.vrm` landed in the precache manifest.
4. **Asset loading**: every path in `client/src/data/modelRegistry.ts` exists under `client/public/`; flag images over 1 MB that are referenced from `src/`.
5. **Production config**:
   - `client/vercel.json` SPA rewrite and cache headers intact.
   - `VITE_API_BASE_URL` is used by `services/apiClient.ts` (defaults to localhost — production must set it in Vercel).
   - No secrets in `VITE_*` variables (they are public in the bundle).
   - Backend: `node --check backend/server.js`; required env vars listed in `backend/README.md`/CLAUDE.md for Render.
6. Optionally `yarn preview` and load `/experience` in the browser to confirm models load from the built output.

Report pass/fail per item. Don't change config unless asked.
