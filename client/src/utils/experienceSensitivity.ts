export const SENSITIVITY_STORAGE_KEY = "experience-sensitivity";
export const DEFAULT_SENSITIVITY_PERCENT = 50;

const LOOK_SPEED_MIN = 0.06;
const LOOK_SPEED_MAX = 0.16;
const LOOK_SPEED_MIN_MOBILE = 0.1;
const LOOK_SPEED_MAX_MOBILE = 0.32;
const MOVE_SPEED_MULT_MIN = 0.85;
const MOVE_SPEED_MULT_MAX = 1.2;
const MOVE_SPEED_MULT_MIN_MOBILE = 0.9;
const MOVE_SPEED_MULT_MAX_MOBILE = 1.35;

export function clampSensitivityPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function readSensitivityPreference(): number {
  if (typeof window === "undefined") return DEFAULT_SENSITIVITY_PERCENT;

  const stored = localStorage.getItem(SENSITIVITY_STORAGE_KEY);
  if (stored === "low") return 25;
  if (stored === "medium") return 50;
  if (stored === "high") return 75;

  const parsed = Number(stored);
  if (Number.isFinite(parsed)) return clampSensitivityPercent(parsed);
  return DEFAULT_SENSITIVITY_PERCENT;
}

export function sensitivityPercentToLookSpeed(
  percent: number,
  isMobile = false,
): number {
  const t = clampSensitivityPercent(percent) / 100;
  if (isMobile) {
    return (
      LOOK_SPEED_MIN_MOBILE + t * (LOOK_SPEED_MAX_MOBILE - LOOK_SPEED_MIN_MOBILE)
    );
  }
  return LOOK_SPEED_MIN + t * (LOOK_SPEED_MAX - LOOK_SPEED_MIN);
}

export function sensitivityPercentToMoveMult(
  percent: number,
  isMobile = false,
): number {
  const t = clampSensitivityPercent(percent) / 100;
  if (isMobile) {
    return (
      MOVE_SPEED_MULT_MIN_MOBILE +
      t * (MOVE_SPEED_MULT_MAX_MOBILE - MOVE_SPEED_MULT_MIN_MOBILE)
    );
  }
  return MOVE_SPEED_MULT_MIN + t * (MOVE_SPEED_MULT_MAX - MOVE_SPEED_MULT_MIN);
}
