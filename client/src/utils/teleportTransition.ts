import { enterTransitionDurationMs } from "../data/enterInteractionConfig";

const teleportTransitionPostDelayMs = 150;

/** Shows loading duration, then runs teleport, then a short settle delay. */
export function runTeleportTransition(performTeleport: () => void): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      try {
        performTeleport();
      } finally {
        window.setTimeout(resolve, teleportTransitionPostDelayMs);
      }
    }, enterTransitionDurationMs);
  });
}
