---
paths:
  - "client/src/**/*.ts"
  - "client/src/**/*.tsx"
---
# TypeScript rules (client)

- `tsconfig.app.json` is `strict` with `noUnusedLocals` / `noUnusedParameters`; `yarn build` runs `tsc -b` and must pass.
- No new `any`. Existing code has `useWorld((s: any) => …)` in many places — in code you touch, drop the `: any` (the store is typed as `WorldState`) instead of adding more. Use `unknown` + narrowing for untyped external data.
- Type props with `type XProps = { … }` next to the component (existing style). Shared feature types go in that feature's `types.ts`.
- three.js refs: `useRef<THREE.Group>(null)` / `useRef<THREE.Mesh>(null)`, null-checked before use. The viverse character ref is currently `any`; leave it unless you can type it properly.
- Handle nullable state explicitly (`pinPosition`, `selectedDestination`, `activeNPCDialog` can be `null`). Prefer early returns over `!` assertions.
- Naming: components `PascalCase.tsx`, hooks `useX.ts`, utils/data `camelCase.ts`, constants `UPPER_SNAKE` (`CAMPUS_NODES`, `MODEL_PATHS`).
- The backend is plain ESM JavaScript; don't convert it to TypeScript unprompted.
