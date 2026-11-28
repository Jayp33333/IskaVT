---
paths:
  - "client/public/**"
  - "client/src/data/modelRegistry.ts"
  - "client/vite.config.ts"
---
# Asset rules

- **Never edit, move, rename, re-export, or delete files in `client/public/models/` without asking.** Project settings require approval for writes there.
- Layout: `public/models/` (campus `PUP_CAMPUS.glb`, `avatars/*.glb|*.vrm`), `public/images/<section>/`, `public/audio/`, `public/icons/`.
- Every model is referenced through `data/modelRegistry.ts`. Adding a model = adding a key to `MODEL_PATHS_BASE`; the build ID is appended for cache-busting.
- GLB standard: Draco-compressed geometry (decoder wired in `utils/modelCache.ts`), meters, Y-up, origin at ground level, no stray cameras/lights/unused animations. File names `kebab-case.glb`.
- Textures: power-of-two, ≤ 2048 px (≤ 1024 for props), WebP/JPEG for color, PNG only when alpha is needed. The campus GLB currently embeds PNG textures — a known size cost.
- Images: WebP, ≤ 1920 px wide, ideally < 300 KB. `public/images/administrations/` is ~200 MB and excluded from the PWA precache; don't add full camera-resolution photos.
- The PWA precache (`vite.config.ts` workbox) allows ≤ 3 MB per file and excludes GLBs; models are runtime-cached in `iska-models`. Renaming a model URL invalidates returning users' caches.
- Before adding an asset, search `public/` for an existing one that fits.
