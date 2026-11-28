# World chunking

> **Planned / Not currently implemented.**

**Today:** the whole campus is one 19 MB GLB loaded up front (cached in IndexedDB and by the service worker). There is no streaming, no LOD, and no distance culling (an experiment, `DistanceMeshCull.tsx`, was removed from `World.tsx`).

**When it would be worth it:** if the campus grows enough that first-load time on mobile data or GPU memory on low-end phones becomes the bottleneck — measure first (see [performance-budget](../optimization/performance-budget.md)).

**Constraints any future design must respect:**
- Collision uses viverse BVH over `BvhPhysicsBody`; streamed chunks need collision added/removed without the player falling through.
- Teleports (`utils/pinTeleport.ts`) can land anywhere — the target chunk must be loaded first.
- Model URLs go through `data/modelRegistry.ts` and the `iska-models` runtime cache.
- Cheaper steps first: texture compression and mesh merging in Blender before splitting the world.
