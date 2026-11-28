---
paths:
  - "client/src/components/Experience/**"
  - "client/src/utils/**"
  - "client/src/data/**"
  - "client/src/hooks/useWorld.ts"
---
# Gameplay rules

- Gameplay state (destination, pin, NPC dialog, arrival pause, teleport flags) lives in `useWorld`. UI components read it and call its actions; they don't own gameplay logic.
- Movement is viverse `SimpleCharacter` inside `BvhPhysicsWorld`. Pause movement by setting speeds to 0 (existing `movementPaused` pattern), not by unmounting the character.
- Teleports go through `utils/pinTeleport.ts` (`completePinTeleport`, registered applier) and `utils/teleportTransition.ts`. Don't set `character.position` from anywhere else.
- Zones and routes are data: enter/exit areas in `data/enterAreas.ts`, wayfinding in `data/campusGraph.ts` + `data/guidePaths.ts`. Add content there; keep logic in utils/components.
- Use the frame `delta` for anything time-based in `useFrame`; never assume 60 fps.
- Keep the fall-through safety net (respawn when `y < -0.1` in `Character.tsx`).
- Tuned values (walk 3 / run 5 / jump 4, joystick dead zone, sensitivity curves) are not changed as a side effect — ask first.
