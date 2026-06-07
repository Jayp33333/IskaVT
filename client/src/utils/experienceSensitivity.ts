export type SensitivityLevel = "low" | "medium" | "high";

export const SENSITIVITY_STORAGE_KEY = "experience-sensitivity";
export const DEFAULT_SENSITIVITY: SensitivityLevel = "medium";

export const LOOK_SPEED: Record<SensitivityLevel, number> = {
  low: 0.06,
  medium: 0.1,
  high: 0.16,
};

export const MOVE_SPEED_MULT: Record<SensitivityLevel, number> = {
  low: 0.85,
  medium: 1,
  high: 1.2,
};

export const SENSITIVITY_LABELS: Record<SensitivityLevel, string> = {
  low: "Low",
  medium: "Med",
  high: "High",
};

export function readSensitivityPreference(): SensitivityLevel {
  if (typeof window === "undefined") return DEFAULT_SENSITIVITY;

  const stored = localStorage.getItem(SENSITIVITY_STORAGE_KEY);
  if (stored === "low" || stored === "medium" || stored === "high") return stored;
  return DEFAULT_SENSITIVITY;
}
