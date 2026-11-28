---
name: campus-environment
description: How the PUP Lopez campus world is organized in IskaVT (campus GLB, coordinates, wayfinding graph, enter/exit areas, floor zones, NPC placement, map calibration) and how to add or move campus content. Use when adding locations, routes, buildings, props, NPCs, or fixing map alignment.
---

# Campus environment in IskaVT

## Where things live
| Concern | File |
|---|---|
| Campus model + ground/collision | `components/Experience/World.tsx` (GLB at `[10, 0.1, 0]`) |
| Model paths | `data/modelRegistry.ts` |
| Walkable nodes / edges for routing | `data/campusGraph.ts` (`CAMPUS_NODES`, hand-placed `Vector3`s) |
| Destination routes | `data/guidePaths.ts` |
| Enter/exit building buttons + teleport targets | `data/enterAreas.ts` (box zones), `data/enterInteractionConfig.ts` |
| Floor labels | polygon zones used by `ui/FloorLabel.tsx` / `ui/AreaInfo.tsx` |
| Location text | `data/locationDescriptions.ts`, `campusGuideContent.ts`, `campusGuideBook.ts` |
| NPCs | `components/Experience/NPCs.tsx` (guard, campus director) |
| 2D map calibration | `utils/campusMapCoords.ts` (bounds X −85..85, Z −120..120 + offsets), homepage pins `utils/viewMapPins.ts` |
| Sun / sky | `hooks/useSunPosition.ts`, `utils/experienceSunPosition.ts` |

Coordinates are world-space meters; Y is height (ground ≈ 0.18–0.3, bridges ≈ 1.0–1.24).

## Finding coordinates
1. Enable the campus graph debug (`showCampusGraph`, `showCampusGraphLabels`) and `CampusNodeAddTool` in settings/debug.
2. Walk to the spot; the node tool gives the current position to paste into `campusGraph.ts`.

## Adding a destination
1. Add nodes along the walkway to `CAMPUS_NODES` (kebab-case ids, by area: `hs-hallway-6`).
2. Connect edges; add the route to `guidePaths.ts`.
3. Add description text; test via the destination picker that the line guide follows walkable ground.

## Adding an enter/exit area
Add an `EnterArea` (`id`, `label`, `action`, `showArea` box, `teleport`). Test both directions and the locked state.

## Props and buildings
Geometry changes belong in Blender (see `blender-pipeline` skill), not runtime meshes. Repeated props → instancing. Keep collision floors continuous.

## Direction
Campus content is meant to move to the admin panel/backend over time. New content-type features should be designed backend-driven; `data/` stays plain data with no logic.
