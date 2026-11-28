---
name: mobile-optimization
description: Procedure for making IskaVT run well on low/mid-range phones — quality settings, DPR, device detection, touch controls, memory and thermal limits. Use when something is slow, hot, crashing, or awkward on mobile, or when adding a feature that must have a mobile path.
---

# Mobile optimization for IskaVT

## What exists
- DPR capped `[1, 1.5]` on the Canvas (`ExperienceScene.tsx`).
- Quality toggles in `ui/ExperienceSettings.tsx`, stored in `useWorld` + `localStorage`: shadows (default **off**), light intensity, FPS overlay (default off), audio.
- Detection: viverse `useIsMobile()` (scene), `hooks/useIsMobileDevice` (DOM).
- Controls: viverse joystick/jump, `useSmoothLookControls`, `MobileControlCustomizer`, `OrientationGuard`, kiosk/fullscreen (`utils/kiosk.ts`).
- Loading: models preloaded into IndexedDB (`utils/modelCache.ts`, `hooks/useModelPreload.ts`), PWA runtime cache for `/models/`.

## Not implemented (proposals need user approval)
Adaptive DPR (drei `PerformanceMonitor` / `AdaptiveDpr`), automatic quality tiers, low-res texture variants, KTX2.

## Procedure
1. Reproduce in the browser pane with mobile emulation (landscape ~812×375) **and** ask the user for a real-device check — emulation doesn't show GPU or thermal limits.
2. Measure FPS + `gl.info` (see `threejs-optimization` skill).
3. Pick the cheapest fix: remove per-frame React work → lower shadow cost → reduce DPR on mobile → texture size.
4. Any new visual feature must be gated (off on mobile or behind a setting), defaulting to the cheaper option.
5. Thermal: sustained 60 fps heats phones; if adding work, consider `frameloop="demand"` only for static views (not while walking).
6. Memory: low-end Android tabs crash around 1–1.5 GB of GPU+JS. Don't load both VRMs; dispose what you create; watch `gl.info.memory`.
7. UI: 44 px targets, don't overlap the joystick/jump zones, respect safe areas.

## Verify
`yarn build`, mobile-emulation walkthrough (move, look, jump, customizer, destination, NPC), report what still needs a real-device test.
