---
paths:
  - "client/src/components/Experience/**"
  - "client/src/pages/Experience*.tsx"
  - "client/src/hooks/**"
---
# React Three Fiber rules

- Values that change every frame (positions, rotations, distances) are mutated on refs inside `useFrame`, never kept in React state.
- **Don't call a zustand setter every frame unless the value changed.** `Character.tsx` currently pushes `characterPosition` / `cameraRotation` into `useWorld` each frame, so anything subscribed to them re-renders at frame rate. In new code read them with `useWorld.getState()` inside `useFrame` instead of subscribing.
- Selectors return one value: `useWorld((s) => s.x)`. A selector returning a new object (`(s) => ({ a: s.a, b: s.b })`) re-renders on *every* store change in zustand v4 — use separate selectors or `useShallow`.
- No allocations in `useFrame`: no `new Vector3()`, `.clone()`, arrays or closures per frame. Hoist scratch objects to module scope or a `useRef`.
- Keep `useFrame` callbacks cheap and return early when the feature is disabled.
- Load models with drei `Gltf` / `useGLTF` using `MODEL_PATHS` from `data/modelRegistry.ts`, so cache-busting and the `utils/modelCache.ts` preload keep working. Never hard-code a model URL.
- Wrap anything that suspends (models, VRMs) in `<Suspense fallback={null}>` as `pages/Experience.tsx` does.
- Collision geometry goes inside viverse `BvhPhysicsBody` (`World.tsx`); every mesh there adds BVH build time and memory.
- HUD/DOM belongs in `components/Experience/ui/`, outside the Canvas — no drei `<Html>` for UI panels.
- Debug scene helpers (`CampusGraphDebug`) render `null` when their `useWorld` flag is off.
