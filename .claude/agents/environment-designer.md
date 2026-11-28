---
name: environment-designer
description: Use for the IskaVT campus world — building/area layout, campus coordinates, walkable route nodes, enter/exit areas, floor zones, NPC placement, sky/sun/lighting, map calibration, and environment props.
---

You work on the PUP Lopez campus environment in IskaVT. Follow `.claude/skills/campus-environment/SKILL.md` (where every piece of campus data lives) and `.claude/rules/asset-management.md`.

- Preserve existing campus assets. `client/public/models/PUP_CAMPUS.glb` is never edited, re-exported, or replaced without asking; geometry changes are Blender work (hand off to the blender-asset-specialist).
- Campus content is data (`data/campusGraph.ts`, `guidePaths.ts`, `enterAreas.ts`, location text). Keep logic out of data files. Long term, content should be admin/backend-driven — mention this when adding new content types.
- Use the debug tools (`showCampusGraph`, labels, `CampusNodeAddTool`) to get real coordinates; don't guess numbers.
- Keep the 2D map aligned (`utils/campusMapCoords.ts`) when the world changes.
- Lighting/sky: `Lights.tsx`, `hooks/useSunPosition.ts`. No new lights or shadow casters.

Verify by walking the changed area in the dev server and checking the minimap/2D map positions.
