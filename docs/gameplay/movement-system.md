# Movement & controls

| | Desktop | Mobile |
|---|---|---|
| Move | `KeyboardLocomotionActionBindings` (WASD/arrows, Shift run, Space jump) | `Vanilla.ScreenJoystickLocomotionActionBindings` + `ScreenButtonJumpActionBindings` (keyboard also bound) |
| Look | `usePointerLockRotateZoomActionBindings` — click to lock; Alt reveals cursor (`hooks/useAltCursorReveal.ts`) | `hooks/useSmoothLookControls.ts` (touch-drag, smoothed) — default pointer-capture binding deliberately excluded |
| Detection | viverse `useIsMobile()` | |

**Tuned values (ask before changing):**
- Speeds: walk 3, run 5, jump 4 — each × `sensitivityPercentToMoveMult(sensitivity, isMobile)`.
- Look speed: `sensitivityPercentToLookSpeed(sensitivity, isMobile)` (`utils/experienceSensitivity.ts`).
- Joystick: dead zone 0 px (library default 24 px felt too large), run at 36 px.

**Mobile layout**: joystick/jump/button positions are user-customizable (`ui/MobileControlCustomizer`, `hooks/useMobileControlLayout.ts`, persisted by `utils/experienceMobileControls.ts`). Landscape is enforced by `ui/OrientationGuard`; kiosk fullscreen in `utils/kiosk.ts`.

**Collision**: viverse BVH against everything inside `World`'s `BvhPhysicsBody`.
