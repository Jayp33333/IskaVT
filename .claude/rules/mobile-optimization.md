---
paths:
  - "client/src/components/Experience/**"
  - "client/src/pages/ExperienceScene.tsx"
  - "client/src/hooks/useIsMobileDevice.ts"
  - "client/src/hooks/useMobileControlLayout.ts"
  - "client/src/utils/experienceMobileControls.ts"
---
# Mobile rules

- Experience changes must work on a phone in landscape (`ui/OrientationGuard`, `utils/kiosk.ts`).
- Device detection: viverse `useIsMobile()` inside the scene, `hooks/useIsMobileDevice` in DOM UI. Don't add a third detector.
- Touch controls are the viverse screen joystick + jump button, plus `useSmoothLookControls` for look. The layout is user-customizable (`MobileControlCustomizer`, saved by `utils/experienceMobileControls.ts`) — new HUD elements must not overlap the joystick/jump areas.
- Heavy features (shadows, effects) default off and are user toggles in `ExperienceSettings`, persisted to `localStorage`.
- Assume 2–3 GB RAM devices: don't hold duplicate copies of large models, and don't load avatars that aren't selected.
- Touch targets ≥ 44 px; the Canvas keeps `touchAction: "none"`.
