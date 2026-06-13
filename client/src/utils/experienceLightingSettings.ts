export const LIGHT_INTENSITY_KEY = "experience-light-intensity";
export const SHADOWS_ENABLED_KEY = "experience-shadows-enabled";

export const DEFAULT_LIGHT_INTENSITY_PERCENT = 50;
export const DEFAULT_DIRECTIONAL_INTENSITY = 1;
export const DEFAULT_AMBIENT_INTENSITY = 1.3;

export function clampLightIntensityPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function readLightIntensityPreference(): number {
  if (typeof window === "undefined") return DEFAULT_LIGHT_INTENSITY_PERCENT;

  const stored = localStorage.getItem(LIGHT_INTENSITY_KEY);
  if (stored === null) return DEFAULT_LIGHT_INTENSITY_PERCENT;

  const parsed = Number(stored);
  if (Number.isFinite(parsed)) return clampLightIntensityPercent(parsed);
  return DEFAULT_LIGHT_INTENSITY_PERCENT;
}

export function readShadowsEnabledPreference(): boolean {
  if (typeof window === "undefined") return true;

  const stored = localStorage.getItem(SHADOWS_ENABLED_KEY);
  return stored === null ? true : stored === "true";
}

export function lightIntensityPercentToDirectional(percent: number): number {
  const scale =
    clampLightIntensityPercent(percent) / DEFAULT_LIGHT_INTENSITY_PERCENT;
  return DEFAULT_DIRECTIONAL_INTENSITY * scale;
}

export function lightIntensityPercentToAmbient(percent: number): number {
  const scale =
    clampLightIntensityPercent(percent) / DEFAULT_LIGHT_INTENSITY_PERCENT;
  return DEFAULT_AMBIENT_INTENSITY * scale;
}
