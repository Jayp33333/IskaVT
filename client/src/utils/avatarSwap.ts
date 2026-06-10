import useWorld from "../hooks/useWorld";

const AVATAR_SWAP_TIMEOUT_MS = 8_000;

export function waitForAvatarSwap(generation: number): Promise<void> {
  const { avatarSwapReadyGeneration } = useWorld.getState();
  if (avatarSwapReadyGeneration >= generation) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const startedAt = Date.now();

    const tick = () => {
      const state = useWorld.getState();
      if (
        state.avatarSwapReadyGeneration >= generation ||
        Date.now() - startedAt >= AVATAR_SWAP_TIMEOUT_MS
      ) {
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}
