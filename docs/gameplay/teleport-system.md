# Teleport system

**Files:** `client/src/utils/pinTeleport.ts`, `utils/teleportTransition.ts`, `data/enterAreas.ts`, `data/enterInteractionConfig.ts`, `components/Experience/Character.tsx`.

## Flow
1. A source requests a move: map/pin confirm, fixed-location visit, or an enter/exit button.
2. Enter/exit uses `runTeleportTransition(perform)`: shows the loading overlay for `enterTransitionDurationMs` (700 ms), runs the teleport, waits 150 ms to settle.
3. `completePinTeleport({ keepDestination? })` reads `pinPosition` from `useWorld` and calls the **applier** that `Character` registered (`registerCharacterTeleportApplier`), which sets the character position and updates the store.
4. If the character isn't mounted yet, `isPinTeleported` stays `true` and `processPendingPinTeleport()` (called every frame in `Character`) finishes it.
5. Pin/destination state is cleared unless `keepDestination`.

## Rules
- Never set `character.position` outside the applier.
- Teleport targets are world-space meters; get them with the campus-graph debug tools.
- Locked areas (`locked: true`) show "Locked" and don't teleport.
