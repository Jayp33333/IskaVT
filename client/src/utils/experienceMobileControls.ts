export const MOBILE_CONTROL_LAYOUT_KEY = "experience-mobile-control-layout";

export type MobileControlPosition = {
  left: number;
  bottom: number;
};

export type MobileControlLayout = {
  joystick: MobileControlPosition;
  jump: MobileControlPosition;
};

export const DEFAULT_MOBILE_CONTROL_LAYOUT: MobileControlLayout = {
  joystick: { left: 5, bottom: 6 },
  jump: { left: 80, bottom: 7 },
};

export const LEFT_HANDED_MOBILE_CONTROL_LAYOUT: MobileControlLayout = {
  joystick: { left: 80, bottom: 6 },
  jump: { left: 5, bottom: 7 },
};

function isValidPosition(value: unknown): value is MobileControlPosition {
  if (!value || typeof value !== "object") return false;
  const pos = value as MobileControlPosition;
  return (
    typeof pos.left === "number" &&
    typeof pos.bottom === "number" &&
    Number.isFinite(pos.left) &&
    Number.isFinite(pos.bottom)
  );
}

export function clampControlPosition(
  pos: MobileControlPosition,
  widthPx = 88,
  heightPx = 88,
): MobileControlPosition {
  if (typeof window === "undefined") return pos;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const marginLeft = (widthPx / vw) * 100;
  const marginBottom = (heightPx / vh) * 100;

  return {
    left: Math.max(0, Math.min(100 - marginLeft, pos.left)),
    bottom: Math.max(3, Math.min(50 - marginBottom, pos.bottom)),
  };
}

export function readMobileControlLayout(): MobileControlLayout {
  if (typeof window === "undefined") return DEFAULT_MOBILE_CONTROL_LAYOUT;

  try {
    const stored = localStorage.getItem(MOBILE_CONTROL_LAYOUT_KEY);
    if (!stored) return DEFAULT_MOBILE_CONTROL_LAYOUT;

    const parsed = JSON.parse(stored) as Partial<MobileControlLayout>;
    if (!isValidPosition(parsed.joystick) || !isValidPosition(parsed.jump)) {
      return DEFAULT_MOBILE_CONTROL_LAYOUT;
    }

    return {
      joystick: clampControlPosition(parsed.joystick),
      jump: clampControlPosition(parsed.jump, 60, 60),
    };
  } catch {
    return DEFAULT_MOBILE_CONTROL_LAYOUT;
  }
}

export function saveMobileControlLayout(layout: MobileControlLayout) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOBILE_CONTROL_LAYOUT_KEY, JSON.stringify(layout));
}

function applyControlPosition(
  element: HTMLElement,
  position: MobileControlPosition,
) {
  element.style.setProperty("position", "fixed", "important");
  element.style.setProperty("left", `${position.left}%`, "important");
  element.style.setProperty("bottom", `${position.bottom}%`, "important");
  element.style.setProperty("right", "auto", "important");
}

export function applyMobileControlLayout(layout: MobileControlLayout) {
  const joystick = document.querySelector<HTMLElement>(".viverse-joystick");
  const jump = document.querySelector<HTMLElement>(".viverse-button.viverse-jump");

  if (joystick) applyControlPosition(joystick, layout.joystick);
  if (jump) applyControlPosition(jump, layout.jump);
}
