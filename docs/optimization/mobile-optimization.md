# Mobile optimization

## Implemented
- DPR capped at `[1, 1.5]`.
- Shadows default off; FPS overlay default off; light intensity setting.
- Settings persisted in `localStorage` (`utils/experience*.ts`).
- Touch controls: viverse joystick/jump with 0 px dead zone, smoothed touch look, customizable layout, landscape orientation guard, kiosk fullscreen.
- Models cached in IndexedDB + service worker so repeat visits skip the 19 MB download.
- Only the selected avatar is loaded; first-person mode loads no avatar.

## Not implemented (candidates)
- Adaptive DPR / automatic quality tiers (drei `PerformanceMonitor`, `AdaptiveDpr`).
- Smaller shadow map on mobile.
- Compressed GPU textures (KTX2) — reduces GPU memory, the usual crash cause on low-end Android.
- Bundling the Draco decoder locally (currently from gstatic; fails offline).

Procedure for changes: `.claude/skills/mobile-optimization/SKILL.md`.
