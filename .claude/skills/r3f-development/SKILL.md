---
name: r3f-development
description: Procedure for adding or changing React Three Fiber components in the IskaVT Experience scene (client/src/pages/Experience*.tsx, client/src/components/Experience). Use when writing scene components, useFrame logic, or wiring 3D to the useWorld store.
---

# R3F development in IskaVT

## Scene map
- `pages/ExperienceScene.tsx` — `<Canvas dpr={[1,1.5]} shadows={shadowsEnabled}>` → viverse `BvhPhysicsWorld` → `<Experience />`. Also owns loading overlays, audio, logbook modal and the HUD (`ui/UI.tsx`, outside the Canvas).
- `pages/Experience.tsx` — `Sky`, `Lights`, `World` (campus GLB in `BvhPhysicsBody`), `Character`, `NPCs`, `DistanceUpdater`, `CampusGraphDebug`, `Pin`.
- State: `hooks/useWorld.ts` (zustand). Settings persist via `utils/experience*.ts` helpers.

## Adding a scene component
1. Decide where it lives: 3D → `components/Experience/X.tsx`; HUD → `components/Experience/ui/X.tsx`.
2. If it needs a model, add the path to `MODEL_PATHS_BASE` in `data/modelRegistry.ts` and load it with drei `<Gltf src={MODEL_PATHS.key} />` or `useGLTF(MODEL_PATHS.key)`.
3. Mount it in `pages/Experience.tsx`; wrap in `<Suspense fallback={null}>` if it loads anything.
4. If the player should collide with it, put it inside a `BvhPhysicsBody`; otherwise keep it outside (cheaper).
5. Read settings with single-value selectors: `const shadows = useWorld((s) => s.shadowsEnabled)`.

## Per-frame logic
```tsx
const scratch = new THREE.Vector3();            // module scope: no per-frame allocation
function Thing() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    const obj = ref.current;
    if (!obj) return;
    const { characterPosition } = useWorld.getState(); // read, don't subscribe
    scratch.copy(characterPosition);
    obj.rotation.y += delta * 0.5;               // mutate, don't setState
  });
  return <group ref={ref}>…</group>;
}
```
- Only write to the store when a value crosses a threshold (e.g. NPC enters range), not every frame.
- Need a UI number that updates often (distance)? Throttle the store write (see `ui/DistanceUpdater`).

## Drei in use
`Gltf`, `useGLTF`, `Sky`. Prefer these over hand-rolled loaders; `utils/modelCache.ts` already configures Draco and IndexedDB blob caching.

## Before finishing
- No new `any`; selectors typed.
- `yarn build` passes.
- Explain to the user any render-loop or re-render implications of the change.
