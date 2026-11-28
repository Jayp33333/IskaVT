# Performance budget

Targets (proposed — verify on a real mid-range Android phone; no device baseline has been recorded yet):

| Metric | Mobile target | Desktop target |
|---|---|---|
| FPS while walking | ≥ 30 sustained | ≥ 60 |
| Draw calls | ≤ 150 | ≤ 300 |
| Triangles in view | ≤ 500 k | ≤ 1.5 M |
| Textures in GPU memory | ≤ 200 MB | — |
| Initial model download | campus ≤ 20 MB (now 19 MB) | — |
| Shadows | off by default | user toggle |

## How to measure
FPS overlay (Settings → Show FPS), `gl.info.render` / `gl.info.memory`, React DevTools Profiler, `yarn build` chunk sizes. Measure at the main gate, covered bridge and HS hallway. Procedure: `.claude/skills/threejs-optimization/SKILL.md`.

## Measured facts (from the repo)
- Campus GLB: 19.3 MB, 82 meshes, 20 materials, 15 PNG textures, Draco.
- VRM avatars 4.7 / 5.8 MB; NPC GLBs 0.2 / 1.4 MB.
- `public/images/` 241 MB (administrations 200 MB, excluded from precache).
- Build: PWA precache 42 entries / ~13 MB; Vite warns about a large JS chunk; `yarn build` takes ~3 min locally.

## Known hotspots
1. `Character.tsx` writes position/rotation to the store every frame and clones a Vector3 per frame.
2. `NPC.tsx` uses an object selector on `useWorld` → re-renders on every store change (i.e. every frame).
3. 2048² shadow map when shadows are on.
4. PNG textures in the campus GLB.
