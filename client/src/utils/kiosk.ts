type OrientationLockType = "any" | "natural" | "landscape" | "portrait" | "portrait-primary" | "portrait-secondary" | "landscape-primary" | "landscape-secondary";

function getFullscreenRequestFn(element: HTMLElement): ((options?: FullscreenOptions) => Promise<void>) | null {
  const anyEl = element as any;
  return (
    element.requestFullscreen?.bind(element) ??
    anyEl.webkitRequestFullscreen?.bind(element) ??
    anyEl.mozRequestFullScreen?.bind(element) ??
    anyEl.msRequestFullscreen?.bind(element) ??
    null
  );
}

async function requestFullscreenIfNeeded(element: HTMLElement) {
  if (document.fullscreenElement) return;
  const request = getFullscreenRequestFn(element);
  if (!request) return;
  await request();
}

async function lockOrientationIfPossible(lock: OrientationLockType) {
  const anyScreen = screen as any;
  const orientation = anyScreen.orientation;
  if (!orientation?.lock) return;
  await orientation.lock(lock);
}

/**
 * Attempts to enter fullscreen and lock to landscape.
 *
 * Notes:
 * - Many browsers require a user gesture for fullscreen/orientation lock.
 * - iOS Safari generally does not allow orientation locking from web apps.
 */
export async function enterKioskLandscape(element: HTMLElement = document.documentElement) {
  try {
    await requestFullscreenIfNeeded(element);
  } catch {
    // ignore
  }

  try {
    await lockOrientationIfPossible("landscape");
  } catch {
    // ignore
  }
}

