import { Vector3 } from "three";
import useWorld from "../hooks/useWorld";

type PinTeleportOptions = {
  /** Keep the destination label after teleport (e.g. fixed-location visit). */
  keepDestination?: boolean;
};

let applyCharacterTeleport: ((position: Vector3) => boolean) | null = null;

/** Registered by Character.tsx so map teleports can move the avatar immediately. */
export function registerCharacterTeleportApplier(
  fn: ((position: Vector3) => boolean) | null,
) {
  applyCharacterTeleport = fn;
}

function clearPinNavigationState(keepDestination: boolean) {
  const state = useWorld.getState();
  state.setPinPosition(null);
  state.setIsPinConfirmed(false);
  state.setIsPinTeleported(false);
  if (!keepDestination) {
    state.setSelectedDestination(null);
    state.setSelectedDestinationId(null);
    state.setQuery("");
  }
}

/**
 * Teleport the avatar to the current pin.
 * Tries synchronously first; if the 3D character is not ready yet, leaves
 * `isPinTeleported` true so Character can finish on the next frame.
 */
export function completePinTeleport(options: PinTeleportOptions = {}): boolean {
  const state = useWorld.getState();
  const pin = state.pinPosition;

  if (!pin) {
    state.setIsPinTeleported(false);
    return false;
  }

  const destination = pin.clone();
  state.setIsPinConfirmed(false);

  const moved = applyCharacterTeleport?.(destination) ?? false;
  if (moved) {
    clearPinNavigationState(options.keepDestination ?? false);
    return true;
  }

  state.setIsPinTeleported(true);
  return false;
}

/** Fallback for when the character ref was not ready during the loading overlay. */
export function processPendingPinTeleport(): boolean {
  const state = useWorld.getState();

  if (!state.isPinTeleported) return false;

  if (!state.pinPosition) {
    state.setIsPinTeleported(false);
    return false;
  }

  const moved = applyCharacterTeleport?.(state.pinPosition) ?? false;
  if (!moved) return false;

  clearPinNavigationState(false);
  return true;
}
