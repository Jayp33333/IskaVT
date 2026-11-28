# Rendering pipeline

## Renderer
- R3F `<Canvas>` in `pages/ExperienceScene.tsx`: `dpr={[1, 1.5]}`, `shadows={shadowsEnabled}`, default `frameloop="always"`, default WebGLRenderer settings (antialias on, sRGB output, ACES not set explicitly). Canvas style `touchAction: none`.
- No postprocessing, no environment map; sky is drei `<Sky>`.

## Lighting
- `components/Experience/Lights.tsx`: one `directionalLight` at the sun position (`hooks/useSunPosition.ts`, updates every 60 s from real time) and one `ambientLight`. Intensities come from the user's light-intensity setting.
- Shadows (default **off**): 2048² map, orthographic shadow camera ±120 m, near 0.5, far 300, bias −0.0002. Campus GLB and ground box cast/receive when enabled.

## Geometry & assets
- `PUP_CAMPUS.glb` (19 MB): 82 meshes, 83 nodes, 20 materials, 15 PNG textures, `KHR_draco_mesh_compression`, no animations. Rendered whole through drei `<Gltf>`; frustum culling is three.js default per mesh.
- Avatars: VRM (Iska 4.7 MB, Isko 5.8 MB) via viverse, only in third-person. NPC GLBs: guard 0.2 MB, campus director 1.4 MB.
- Loading: `utils/modelCache.ts` — `GLTFLoader` + `DRACOLoader` (decoder from gstatic CDN), ArrayBuffers cached in IndexedDB (`iska-model-cache-v1`), `useGLTF.preload`; `hooks/useModelPreload.ts` warms them. URLs carry `?v=<build id>` (`data/modelRegistry.ts`).

## Per-frame work (`useFrame` users)
`Character` (teleport processing, store writes, camera rotation copy, fall check), `NPC` (range checks), `DistanceUpdater`, `Pin`/`LocationPin`, `CampusGraphDebug` (when on), and smooth look controls.

## Removed / unused
`DistanceMeshCull.tsx` (distance-based culling), `SceneFog.tsx`, `models/PUPCampus.tsx` (gltfjsx version of the campus), `MiniMap.tsx` (in-Canvas minimap; HUD uses `ui/MiniMapOverlay`). `r3f-perf` is commented out in `World.tsx`.
