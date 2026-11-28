# Multiplayer architecture

> **Planned / Not currently implemented.**

**Today:** IskaVT is single-player. `socket.io-client` is listed in `client/package.json` but nothing imports it, and the backend has no socket server (plain Express REST). No multiplayer agent or skill exists in `.claude/` for this reason.

**If multiplayer is added later, decide first:**
- Hosting: Render supports WebSockets, but the backend sleeps/scales per Render plan — check before committing.
- What is shared: avatar position/rotation only, or also chat/emotes.
- Interest management: only send nearby players (campus is ~170 × 240 m).
- Mobile cost: remote avatars are VRMs (≈5 MB each, skinned) — need a lightweight remote-avatar representation.
- State boundary: remote players must not go through `useWorld` per-frame updates (re-render cost); keep them in refs.

Remove `socket.io-client` if multiplayer isn't on the roadmap.
