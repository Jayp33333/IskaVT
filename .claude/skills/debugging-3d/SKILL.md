---
name: debugging-3d
description: Systematic debugging for IskaVT 3D problems — blank/black scene, model not loading, falling through floors, wrong collisions, avatar/NPC animation issues, teleport misplacement, WebGL context loss, and stutter. Use whenever the Experience scene misbehaves.
---

# Debugging 3D in IskaVT

Start every investigation with: `cd client && yarn dev`, open `/experience` in the browser pane, read the console (`read_console_messages`) and network (`read_network_requests`).

## Model / asset won't load
1. Network tab: 404 on `/models/...?v=<build>`? Check the path in `data/modelRegistry.ts` (note mixed `./`, `/`, and bare-relative prefixes there).
2. Draco errors → decoder comes from `https://www.gstatic.com/draco/...` (`utils/modelCache.ts`); offline or blocked network breaks it.
3. Stale model after an update → service worker cache `iska-models` / IndexedDB `iska-model-cache-v1`. Clear site data, or confirm the `?v=` build ID changed.
4. Suspense never resolves → loading overlay stuck; check `useGlobalLoading` / `GlobalLoadingOverlay` and the thrown promise.

## Black or empty scene
- Lights: `Lights.tsx` intensity from `lightIntensity` setting — is it 0?
- Camera inside geometry: spawn is `[10, 3, 0]`; check the campus offset `[10, 0.1, 0]`.
- WebGL context lost (console "CONTEXT_LOST") → GPU memory on mobile; reduce textures/shadows.

## Falling through / stuck on geometry
- Collision is viverse BVH over `World`'s `BvhPhysicsBody`. Missing floor = missing or non-manifold mesh in the GLB (fix in Blender).
- The respawn guard (`y < -0.1`) hides falls — log `character.position` in `useFrame` temporarily.
- Ramps/stairs: check the node Y values in `campusGraph.ts` match the mesh.

## Teleport lands wrong
`utils/pinTeleport.ts` → `completePinTeleport` → applier registered by `Character.tsx`. Check `enterAreas.ts` teleport coords, and whether `isPinTeleported` stayed true (pending teleport finishes next frame).

## Avatar / NPC animation
- VRM avatar only in third-person (`cameraMode`). Swap readiness polls up to 180 frames (`Character.tsx`).
- NPC range uses `INTERACT_DISTANCE = 1.5` in `NPC.tsx` and `registerNPCInRange`.

## Stutter / low FPS
Follow the `threejs-optimization` skill: FPS overlay → `gl.info` → React Profiler. Prime suspects: per-frame store writes in `Character.tsx`, object selector in `NPC.tsx`, shadows.

## Wayfinding / routes
Enable `showCampusGraph` + labels to draw nodes/edges (`CampusGraphDebug`), verify edges in `campusGraph.ts` / `guidePaths.ts`.

## Finish
State root cause, the fix, regression risk, and how it was verified. Remove temporary logs.
