# Character system

**File:** `client/src/components/Experience/Character.tsx`

- Built on viverse **`SimpleCharacter`** (physics-driven capsule over the BVH world). Spawn `[10, 3, 0]`.
- **Camera modes** (`useWorld.cameraMode`):
  - `"first"` — `FirstPersonCharacterCameraBehavior`, no visible model.
  - `"third"` — default viverse third-person camera with the selected VRM avatar (`useWorld.avatar.vrmUrl`; Iska or Isko, chosen in `ui/AvatarPicker`).
- **Avatar swap**: after the avatar/camera mode changes, `Character` polls (up to 180 frames) until the VRM is in the scene graph, then calls `markAvatarSwapReady()`; `utils/avatarSwap.ts` awaits that.
- **Locks**: `interactionLocked` = NPC dialog open, arrival pause, or mobile-controls customizing. Movement speed → 0 while locked; look speed → 0; pointer lock released.
- **Each frame**: finishes pending teleports, writes `characterPosition`, `characterPositionOnFloorLabel` (clone) and `cameraRotation` to the store, respawns at `[10, 1, 0]` if `y < -0.1`.
- **Teleport hook-in**: registers an applier with `utils/pinTeleport.ts` (see [teleport-system](teleport-system.md)).

Changing it: see `.claude/skills/character-controller/SKILL.md`.
