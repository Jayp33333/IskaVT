# Blender pipeline

Summary for humans; the step-by-step checklist Claude follows is `.claude/skills/blender-pipeline/SKILL.md`.

1. **Model** in meters, Y-up export, transforms applied, origins at ground level (NPCs at feet).
2. **Clean** hidden/interior faces, merge static meshes that share a material, keep floors/ramps continuous (the player collides with the real mesh).
3. **Materials** Principled BSDF only, reuse campus materials, power-of-two textures ≤ 2048 (props ≤ 1024), JPEG/WebP unless alpha.
4. **Export** glTF Binary (.glb), selected only, no cameras/lights, Draco on.
5. **Check** in gltf.report: size, mesh/material counts vs. the current file.
6. **Integrate** — get approval before replacing anything in `client/public/models/`; new files are registered in `client/src/data/modelRegistry.ts`; walk the area in the tour (floors, ramps, shadows on/off).

Current assets and their stats: [asset-optimization](../optimization/asset-optimization.md).
