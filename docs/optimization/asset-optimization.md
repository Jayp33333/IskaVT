# Asset optimization

## Current inventory (`client/public/`)
| Folder | Size | Notes |
|---|---|---|
| `models/` | 30 MB | `PUP_CAMPUS.glb` 19.3 MB (Draco, PNG textures), Iska/Isko VRM 4.7/5.8 MB, campus-director 1.4 MB, guard 0.2 MB |
| `images/administrations/` | 200 MB | staff photos; runtime-cached, excluded from precache |
| `images/buildings/` | 28 MB | |
| `images/faqs/` | 6.7 MB | |
| `audio/` | 3.2 MB | |

18 image files are over 2 MB.

## Highest-payoff opportunities (need approval — they replace assets)
1. **Administration photos** → resize to ≤ 800 px and WebP: likely 200 MB → under 20 MB.
2. **Campus textures** PNG → WebP/JPEG (or KTX2 with a loader change): smaller download; KTX2 also cuts GPU memory.
3. **VRM avatars**: reduce texture sizes (VRM textures are often 2048²+).
4. **Building images**: WebP at ≤ 1600 px.

## Tools
`gltf-transform` CLI (`npx @gltf-transform/cli inspect|resize|webp|draco`), https://gltf.report, Squoosh/`sharp` for images. Always output to a new file and compare before replacing.

Standards: `.claude/rules/asset-management.md`.
