export const MASTER_VOLUME_KEY = "experience-master-volume";
export const AMBIENT_ENABLED_KEY = "experience-ambient-enabled";
export const AMBIENT_VOLUME_KEY = "experience-ambient-volume";

export const DEFAULT_AMBIENT_VOLUME = 80;

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function readLegacyMasterVolume(): number {
  if (typeof window === "undefined") return 100;
  const stored = localStorage.getItem(MASTER_VOLUME_KEY);
  if (stored === null) return 100;
  const value = Number(stored);
  if (!Number.isFinite(value)) return 100;
  return clampPercent(value);
}

export function readMasterEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(MASTER_VOLUME_KEY);
  if (stored === null) return true;
  if (stored === "true" || stored === "false") {
    return stored === "true";
  }
  return readLegacyMasterVolume() > 0;
}

export function readAmbientVolume(): number {
  if (typeof window === "undefined") return DEFAULT_AMBIENT_VOLUME;

  const storedVolume = localStorage.getItem(AMBIENT_VOLUME_KEY);
  if (storedVolume !== null) {
    const value = Number(storedVolume);
    if (Number.isFinite(value)) return clampPercent(value);
  }

  const storedEnabled = localStorage.getItem(AMBIENT_ENABLED_KEY);
  if (storedEnabled === "false") return 0;
  return DEFAULT_AMBIENT_VOLUME;
}
