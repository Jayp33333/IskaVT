---
name: blender-pipeline
description: How to prepare, optimize, and export Blender models (campus buildings, props, NPC avatars) as GLB for IskaVT. Use when creating or re-exporting a model, inspecting a .blend with the Blender MCP tools, or diagnosing a model that looks wrong in the tour.
---

# Blender → GLB pipeline for IskaVT

**Ask the user before writing anything into `client/public/models/`.** Export to a scratch folder first and let them approve the swap.

## Current assets
| File | Use | Size |
|---|---|---|
| `PUP_CAMPUS.glb` | whole campus, loaded at `position [10, 0.1, 0]`, collision via BVH | 19 MB, Draco, 82 meshes, 20 mats, PNG textures |
| `avatars/Iska.vrm`, `Isko.vrm` | player avatars (VRM, viverse) | 4.7 / 5.8 MB |
| `avatars/guard.glb`, `campus-director.glb` | NPCs | 0.2 / 1.4 MB |

## Preparation checklist
1. **Scale & axes**: 1 unit = 1 m, Y-up on export (glTF default), apply all transforms (Ctrl+A → All Transforms).
2. **Origin**: buildings/props at ground-center; NPCs at feet. The campus root stays at world origin — the app offsets it.
3. **Naming**: objects `area_part` in snake_case (`hs_hallway_floor`), materials by surface (`concrete_wall`). File names kebab-case.
4. **Geometry**: delete hidden faces and interior geometry, merge static meshes that share a material, keep collision-relevant floors/ramps clean (the character walks on the actual mesh via BVH — gaps make it fall through).
5. **Materials**: Principled BSDF only; reuse existing campus materials; no procedural nodes (they don't export).
6. **Textures**: power of two, ≤ 2048 (props ≤ 1024), JPEG/WebP for color, PNG only for alpha. Pack or keep beside the .blend.
7. **NPC animation**: one armature, actions named `idle`, `walk`, `talk`; remove unused actions.

## Export (File → Export → glTF 2.0)
- Format: **glTF Binary (.glb)**
- Include: selected objects only; no cameras, no lights
- Transform: +Y Up
- Mesh: Apply Modifiers, UVs, Normals; no vertex colors unless used
- Compression: **Draco** on, level 6, position quantization 14, normal 10, texcoord 12
- Animation: only for NPCs

## Validate
1. Drop into https://gltf.report or https://gltf-viewer.donmccurdy.com — check size, draw calls, texture sizes.
2. Compare against the current file (mesh/material counts must not jump without a reason).
3. Run the tour, walk the affected area (floors, ramps, stairs), check shadows on/off.
4. If the URL changes, update `data/modelRegistry.ts`; the build ID query busts caches.

## With the Blender MCP
Inspect first (`get_objects_summary`, `get_blendfile_summary_datablocks`), never destructively modify without confirmation, and report triangle/material counts before exporting.
