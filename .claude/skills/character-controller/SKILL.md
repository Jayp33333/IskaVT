---
name: character-controller
description: How the IskaVT player character, camera, collision, avatars, and desktop/mobile controls work and how to change them safely. Use for any change to Character.tsx, sensitivity, look controls, joystick, camera mode, avatar swap, or teleport behaviour.
---

# Character controller in IskaVT

## How it works today
- `components/Experience/Character.tsx` renders viverse **`SimpleCharacter`** (spawn `[10, 3, 0]`) inside `BvhPhysicsWorld`. Collision is BVH against everything in `World`'s `BvhPhysicsBody` (campus GLB + 1000×1000 ground box).
- **Speeds**: walk 3, run 5, jump 4, each × `sensitivityPercentToMoveMult` (`utils/experienceSensitivity.ts`). Paused (speed 0) while an NPC dialog is open or the arrival banner is showing.
- **Desktop look**: `usePointerLockRotateZoomActionBindings` (pointer lock on click; Alt reveals the cursor via `useAltCursorReveal`). **Mobile look**: `hooks/useSmoothLookControls`. Speed from `sensitivityPercentToLookSpeed`.
- **Mobile move**: `Vanilla.ScreenJoystickLocomotionActionBindings` + `ScreenButtonJumpActionBindings`, dead zone 0 px, run at 36 px. Layout customizable and saved (`utils/experienceMobileControls.ts`, `hooks/useMobileControlLayout.ts`).
- **Camera**: `cameraMode` `"first"` → `FirstPersonCharacterCameraBehavior`, no model; `"third"` → VRM avatar (`avatar.vrmUrl`, Iska/Isko). Avatar swap readiness: `markAvatarSwapReady` + `utils/avatarSwap.ts`.
- **Teleport**: Character registers an applier with `utils/pinTeleport.ts`; `processPendingPinTeleport()` runs each frame to finish teleports requested before the character mounted.
- **Safety**: falls below `y < -0.1` → respawn at `[10, 1, 0]`.

## Changing it safely
1. Read `Character.tsx`, `useSmoothLookControls.ts`, `experienceSensitivity.ts` fully first. Don't replace `SimpleCharacter` with a custom controller without a written plan the user approved.
2. **Tuned values** (speeds, dead zone, run distance, sensitivity curves) — ask before changing; state old → new.
3. New lock conditions: add to `interactionLocked` / `movementPaused` instead of new mechanisms.
4. Moving the player: always via `completePinTeleport` / the registered applier, never direct `position.set` elsewhere.
5. Per-frame work stays allocation-free (note: the existing `position.clone()` per frame is a known cost).

## Test checklist
Desktop: click to lock, WASD/Shift/Space, Alt cursor, NPC dialog releases lock. Mobile emulation (landscape): joystick, jump, drag-look, customizer. Both camera modes, avatar swap, teleport from map/destination, ramps/stairs on the covered bridge.
