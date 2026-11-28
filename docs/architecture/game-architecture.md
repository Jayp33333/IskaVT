# Game architecture (Experience)

## Component tree
```
pages/ExperienceScene.tsx              (route /experience)
├─ loading overlays, audio (useExperienceAudio, AudioManager), logbook modal
├─ ui/UI.tsx  ← HTML HUD, outside the Canvas
│   DestinationPicker, ArrowGuide, DistanceHUD, MiniMapOverlay, Map2D, EnterButton,
│   NPCDialog/NPCTalkButton, ExperienceSettings, TourCoachOverlay, CampusGuideBook,
│   FloorLabel, AreaInfo, ArrivalBanner, OrientationGuard, …
└─ <Canvas dpr={[1,1.5]} shadows={shadowsEnabled}>
    └─ <BvhPhysicsWorld>                (viverse)
        └─ pages/Experience.tsx
            ├─ <Sky>  (sun from useSunPosition)
            ├─ Lights  (1 directional + 1 ambient)
            ├─ World   (BvhPhysicsBody: PUP_CAMPUS.glb + 1000×1000 ground box)
            ├─ Character (viverse SimpleCharacter)
            ├─ NPCs    (guard, campus director)
            ├─ DistanceUpdater
            ├─ CampusGraphDebug (debug flag)
            └─ Pin     (when a pin is confirmed)
```

## State flow
- `hooks/useWorld.ts` (zustand) is the hub between scene and HUD: character position, camera rotation/mode, avatar, NPCs in range, active dialog, pin/destination, UI panel visibility, tour coach/guide book, and settings (sensitivity, audio, light intensity, shadows, mobile layout, debug flags).
- Settings are loaded/saved by `utils/experience*.ts` helpers (`localStorage`).
- Scene → HUD: `Character` writes position/rotation into the store every frame; HUD reads it.
- HUD → scene: HUD calls store actions (select destination, open dialog) or `utils/pinTeleport.ts`.
- Imperative bridge: `Character` registers a teleport applier in `utils/pinTeleport.ts`.

## Systems (details in `docs/gameplay/`)
| System | Main files |
|---|---|
| Character & camera | `components/Experience/Character.tsx` → [character-system](../gameplay/character-system.md) |
| Movement & controls | viverse bindings, `useSmoothLookControls`, `experienceSensitivity.ts` → [movement-system](../gameplay/movement-system.md) |
| NPCs, enter areas, destinations | `NPC.tsx`, `enterAreas.ts`, `campusGraph.ts` → [interaction-system](../gameplay/interaction-system.md) |
| Teleport | `pinTeleport.ts`, `teleportTransition.ts` → [teleport-system](../gameplay/teleport-system.md) |

## Known design costs
- Per-frame store writes from `Character` (see [performance-budget](../optimization/performance-budget.md)).
- `characterPosition` is a mutable `Vector3` shared through the store.
