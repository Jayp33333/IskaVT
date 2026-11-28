---
description: Measure IskaVT performance, then recommend and apply optimizations
argument-hint: [area or symptom, e.g. "mobile fps near covered bridge"]
---

Optimize IskaVT performance. Focus: $ARGUMENTS

Use `.claude/skills/threejs-optimization/SKILL.md` and `.claude/skills/mobile-optimization/SKILL.md`.

1. **Measure before changing anything** and record numbers:
   - FPS (in-app overlay) desktop and mobile emulation
   - `gl.info.render` calls / triangles and `gl.info.memory` geometries / textures at the main gate, covered bridge, HS hallway
   - Texture and model sizes (`client/public/models`, GLB JSON stats)
   - Render loop: every `useFrame` in `client/src` and what it does per frame
   - React re-renders inside the Canvas (store writes per frame, object selectors)
   - Build output chunk sizes from `yarn build`
2. Rank causes by measured impact.
3. Present recommendations with expected gain and risk. Implement the safe ones (code-only, no visual/feel change); ask before anything that touches models, tuned controls, or adds dependencies.
4. Re-measure and show before → after. Run `yarn build`.
