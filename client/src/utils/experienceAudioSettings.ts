export const MASTER_VOLUME_KEY = "experience-master-volume";
export const SFX_ENABLED_KEY = "experience-sfx-enabled";
export const AMBIENT_ENABLED_KEY = "experience-ambient-enabled";

export const DEFAULT_MASTER_VOLUME = 80;

export function readMasterVolume(): number {
  if (typeof window === "undefined") return DEFAULT_MASTER_VOLUME;
  const stored = localStorage.getItem(MASTER_VOLUME_KEY);
  if (stored === null) return DEFAULT_MASTER_VOLUME;
  const value = Number(stored);
  if (!Number.isFinite(value)) return DEFAULT_MASTER_VOLUME;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function readSfxEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(SFX_ENABLED_KEY);
  return stored === null ? true : stored === "true";
}

export function readAmbientEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(AMBIENT_ENABLED_KEY);
  return stored === null ? true : stored === "true";
}
