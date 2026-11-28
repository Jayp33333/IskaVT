# Campus map & coordinates

- World units are meters, Y up. The campus GLB is placed at `[10, 0.1, 0]` (`World.tsx`); a 1000×1000 gray ground box sits at `y = -0.5`.
- Ground walk height ≈ 0.18–0.3; covered bridges ≈ 1.0–1.24; stair ramps up to ~2.8+.
- Map bounds used by the 2D map and minimap (`utils/campusMapCoords.ts`): X −85…85, Z −120…120, with calibration offsets so markers align with `public/images/CampusMap.png`. Homepage map pins are separate (`utils/viewMapPins.ts`).

## Wayfinding graph
`data/campusGraph.ts` holds hand-placed nodes (`CAMPUS_NODES`, kebab-case ids grouped by area: `main-gate`, `comlab-*`, `covered-bridge-*`, `bridge-west-*`, `hs-hallway-*`, `hs-*-ramp`, …) and edges; `data/guidePaths.ts` defines destination routes.

## Tools
Debug flags in `useWorld`: `showCampusGraph`, `showCampusGraphLabels` (draws nodes/edges via `CampusGraphDebug`, instanced) and `showCampusNodeAddTool` (`ui/CampusNodeAddTool`, for capturing positions).

## Keeping things aligned
When the GLB or its offset changes, re-check: graph nodes, enter-area zones/targets, floor polygons, NPC positions, fixed-location pins, and the 2D map calibration.
