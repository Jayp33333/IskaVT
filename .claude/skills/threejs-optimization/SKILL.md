---
name: threejs-optimization
description: Step-by-step procedure to profile and optimize rendering performance in the IskaVT 3D campus (draw calls, triangles, textures, memory, re-renders). Use when FPS is low, the scene stutters, memory grows, or before adding heavy content.
---

# three.js optimization for IskaVT

## 1. Measure (always first)
1. `cd client && yarn dev`, open `/experience`.
2. Turn on the FPS overlay (Settings → Show FPS; `useWorld.showFps`).
3. Temporarily log renderer stats from a scene component (remove afterwards):
   ```tsx
   const gl = useThree((s) => s.gl);
   useEffect(() => { const id = setInterval(() => console.log(gl.info.render, gl.info.memory), 2000); return () => clearInterval(id); }, [gl]);
   ```
   Record `calls`, `triangles`, `geometries`, `textures` at 3 spots: main gate, covered bridge, high-school hallway.
4. React re-renders: React DevTools Profiler → record 5 s of walking. Any component re-rendering every frame is a bug.
5. Note shadows on/off and device (desktop vs mobile emulation).

## 2. Known hotspots in this codebase (check these first)
- `Character.tsx` `useFrame` calls `setCharacterPosition`, `setCharacterPositionOnFloorLabel(position.clone())`, `setCameraRotation` every frame → every subscriber re-renders per frame and a Vector3 is allocated per frame.
- `NPC.tsx` subscribes with an object selector (`useWorld((s) => ({ … }))`), which re-renders on every store change in zustand v4.
- `Lights.tsx` 2048² shadow map when shadows are on.
- `PUP_CAMPUS.glb`: 19 MB, 82 meshes, 20 materials, 15 PNG textures, Draco geometry.
- Draco decoder is fetched from gstatic (`utils/modelCache.ts`) — a network dependency on first load.

## 3. Fix in order of payoff
1. **Re-renders** — stop per-frame store writes; read via `getState()`; split object selectors.
2. **Draw calls** — merge static meshes sharing a material (Blender), instance repeated props.
3. **Textures** — resize to ≤ 2048 (≤ 1024 for props), convert PNG→WebP or KTX2 (KTX2 needs `KTX2Loader` + transcoder; ask before adding).
4. **Shadows** — smaller map (1024) on mobile, tighter shadow camera.
5. **Geometry** — decimate hidden/far detail in Blender.
6. **Culling** — three.js frustum culling is on by default; distance culling was tried and removed, only revisit with numbers.

## 4. Verify
Re-measure the same 3 spots, report before/after numbers, run `yarn build`. Never change tuned control values while optimizing. Never touch `public/models/` without asking.
