---
paths:
  - "client/src/components/Experience/**"
  - "client/src/pages/Experience*.tsx"
---
# three.js performance rules

- **Measure first.** Use the in-app FPS overlay (`showFps` setting, `hooks/useFps.ts`) and `gl.info.render` (calls / triangles) before and after a change, and report both numbers.
- Target hardware is a low/mid Android phone. Canvas DPR is capped at `[1, 1.5]` — don't raise it.
- Shadows are off by default. The sun uses a 2048² shadow map over a 240 m frustum; don't add more shadow-casting lights.
- Don't add lights; adjust the existing directional + ambient in `Lights.tsx`.
- Repeated identical objects (roughly ≥ 10) use `<Instances>` / `instancedMesh` (as `CampusGraphDebug` does), not N separate meshes.
- Create geometries and materials once (`useMemo` or module scope), share them, and `dispose()` anything you create imperatively.
- Prefer merging static meshes in Blender over runtime work. The campus GLB already has 82 meshes / 20 materials — new props should share existing materials.
- Distance culling and fog were tried and removed (`DistanceMeshCull.tsx`, `SceneFog.tsx` are unused). Don't re-enable them without measured evidence.
- No postprocessing, real-time reflections, or large transparent overdraw on mobile unless behind a quality setting.
