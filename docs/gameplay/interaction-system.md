# Interaction system

## NPCs
- `components/Experience/NPCs.tsx` defines NPCs (guard, campus director) with position, model (`MODEL_PATHS`), dialog steps and voice profile.
- `NPC.tsx`: each frame checks distance to the player (`INTERACT_DISTANCE = 1.5`); in range → `registerNPCInRange`, shows `ui/NPCTalkButton`. Talking → `setActiveNPCDialog` → `ui/NPCDialog` (branching steps), voice via the speech hook from `features/contact/hooks/useFaqSpeech`. Dialog open locks movement and look.

## Destinations & path guide
- Picker: `ui/DestinationPicker` (search `query`, `selectedDestination`).
- Route: `data/campusGraph.ts` (hand-placed nodes/edges) + `data/guidePaths.ts`; drawn by `ui/ArrowGuide` as a line/path guide.
- Progress: `ui/DistanceUpdater` / `DistanceHUD`; arrival: `ui/DestinationChecker` → `ArrivalBanner` (pauses movement) → `DestinationCelebration`.
- Map pins: `ui/PinControls`, `Pin`/`LocationPin`, `ui/WaypointMarker`; fixed locations `FIXED_LOCATION_PINS` (`sampleData.ts`) with `ui/FixedLocationModal`.

## Enter / exit areas
- `data/enterAreas.ts` — box zones (`showArea`) that show `ui/EnterButton` ("Enter …"/"Exit …"/"Locked") and a `teleport` target; transition timing in `data/enterInteractionConfig.ts`.

## Floor & area labels
- Polygon floor zones `floorZones` + `getFloorZonesAtPosition` (`sampleData.ts`) feed `ui/FloorLabel` and `ui/AreaInfo` from `characterPositionOnFloorLabel`.

## Onboarding & info
- `data/tourCoachSteps.ts` → `ui/TourCoachOverlay`; `data/campusGuideBook.ts` → `ui/CampusGuideBook`; logbook sign-in modal in `ExperienceScene.tsx`.
