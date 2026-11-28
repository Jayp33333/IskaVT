# Building system

**Current state:** there is no per-building runtime system. All buildings, walkways and bridges are part of the single `PUP_CAMPUS.glb`.

What "buildings" mean in code today:
- **Geometry** — meshes inside the campus GLB (edited in Blender, see [blender-pipeline](../assets/blender-pipeline.md)).
- **Entry/exit** — `data/enterAreas.ts` zones + teleport targets (inside ↔ outside).
- **Floors** — polygon floor zones (`floorZones` in `sampleData.ts`) for `ui/FloorLabel`.
- **Info** — `data/locationDescriptions.ts`, `campusGuideContent.ts`, `campusGuideBook.ts`, building images in `public/images/buildings/` (28 MB).
- **Routes** — nodes in `data/campusGraph.ts`.

An earlier gltfjsx component (`components/Experience/models/PUPCampus.tsx`, per-mesh JSX) exists but is not used; `World.tsx` loads the GLB with drei `<Gltf>`.

**Adding a building's content**: geometry in Blender → enter area → floor zones → graph nodes/route → description/images. Long-term, the descriptive content should come from the admin panel/backend.
