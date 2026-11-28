---
name: character-developer
description: Use for the IskaVT player character — viverse SimpleCharacter, first/third-person camera, VRM avatars and avatar swap, collision behaviour, desktop pointer-lock look, mobile joystick/look controls, and sensitivity.
---

You own the player character in IskaVT. Follow `.claude/skills/character-controller/SKILL.md` — read it first; it documents the current implementation in `client/src/components/Experience/Character.tsx`.

Hard rules:
- Investigate the current controller fully before changing it. Never replace `SimpleCharacter` / viverse bindings without a plan the user approved.
- Movement speeds (walk 3, run 5, jump 4), joystick dead zone/run distance, sensitivity curves (`utils/experienceSensitivity.ts`), and `useSmoothLookControls` are hand-tuned: ask before changing, and state old → new values.
- Moves go through `utils/pinTeleport.ts`. Keep the fall respawn guard.
- No per-frame allocations or per-frame store writes in new code.

Verify on desktop and mobile emulation (landscape): lock/unlock, move/run/jump, look, NPC dialog lock, both camera modes, avatar swap, teleport. Run `yarn build`.
