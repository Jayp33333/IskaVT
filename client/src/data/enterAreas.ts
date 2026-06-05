import * as THREE from "three";

/** Box zone in world space (X / Z, optional Y). */
export type EnterZone = {
  xMin: number;
  xMax: number;
  zMin: number;
  zMax: number;
  yMin?: number;
  yMax?: number;
};

export type EnterAreaAction = "enter" | "exit";

export type EnterArea = {
  id: string;
  /** Building or area name shown on the button */
  label: string;
  /** Whether the button reads "Enter …" or "Exit …" */
  action?: EnterAreaAction;
  /** When true, shows "Locked" and blocks teleport */
  locked?: boolean;
  /** Player must be inside this zone to see the button */
  showArea: EnterZone;
  /** Where the player is moved when the button is clicked */
  teleport: { x: number; y: number; z: number };
};

export function getEnterAreaButtonLabel(area: EnterArea): string {
  if (area.locked) return "Locked";
  const action = area.action ?? "enter";
  return action === "exit" ? `Exit ${area.label}` : `Enter ${area.label}`;
}

export function isEnterAreaLocked(area: EnterArea): boolean {
  return area.locked === true;
}

export const ENTER_AREAS: EnterArea[] = [
  // {
  //   id: "administration-building-entrance",
  //   label: "Administration Building",
  //   showArea: { xMin: 17, xMax: 26, zMin: 2, zMax: 8, yMin: 0, yMax: 3 },
  //   teleport: { x: 22, y: 0.2, z: -1 },
  // },
  // {
  //   id: "nantes-building-entrance",
  //   label: "Nantes Building",
  //   showArea: { xMin: 22, xMax: 30, zMin: -108, zMax: -100, yMin: 0, yMax: 3 },
  //   teleport: { x: 24, y: 0.2, z: -120 },
  // },
  // {
  //   id: "yumul-building-entrance",
  //   label: "Yumul Building",
  //   showArea: { xMin: 34, xMax: 42, zMin: -18, zMax: -10, yMin: 0, yMax: 3 },
  //   teleport: { x: 38.4, y: 0.2, z: -30 },
  // },
  // {
  //   id: "health-sciences-entrance",
  //   label: "Health and Sciences Building",
  //   showArea: { xMin: -20, xMax: -12, zMin: -48, zMax: -40, yMin: 0, yMax: 3 },
  //   teleport: { x: -30, y: 0.2, z: -58 },
  // },
  // {
  //   id: "education-building-entrance",
  //   label: "Education Building",
  //   showArea: { xMin: -12, xMax: -4, zMin: -178, zMax: -172, yMin: 0, yMax: 3 },
  //   teleport: { x: -8, y: 0.2, z: -180 },
  // },
  // {
  //   id: "engineering-building-entrance",
  //   label: "Engineering Building",
  //   showArea: { xMin: -48, xMax: -40, zMin: -118, zMax: -110, yMin: 0, yMax: 3 },
  //   teleport: { x: -45, y: 0.2, z: -120 },
  // },
  // {
  //   id: "gymnasium-entrance",
  //   label: "PUP Gymnasium",
  //   showArea: { xMin: 38, xMax: 46, zMin: -142, zMax: -134, yMin: 0, yMax: 3 },
  //   teleport: { x: 41, y: 0.2, z: -145 },
  // },
  // {
  //   id: "grandstand-entrance",
  //   label: "Grandstand",
  //   showArea: { xMin: 4, xMax: 10, zMin: -108, zMax: -100, yMin: 0, yMax: 3 },
  //   teleport: { x: 6, y: 2, z: -115 },
  // },
  {
    id: "comlab-1-entrance",
    label: "Comlab 1",
    locked: false,
    showArea: { xMin: 1.38, xMax: 2, zMin: -13, zMax: -12, yMin: 0, yMax: 3 },
    teleport: { x: -0.26, y: 0.4, z: -12.5 },
  },
  {
    id: "comlab-1-exit",
    label: "Comlab 1",
    action: "exit",
    showArea: { xMin: 0.01, xMax: 0.34, zMin: -14, zMax: -8, yMin: 0, yMax: 3 },
    teleport: { x: 2.2, y: 0.4, z: -12.7},
  },
  {
    id: "comlab-2-entrance",
    label: "Comlab 2",
    locked: true,
    showArea: { xMin: 11.63, xMax: 12.5, zMin: -26.5, zMax: -25.5, yMin: 0, yMax: 3 },
    teleport: { x: 10.23, y: 0.4, z: -26 },
  },
  {
    id: "comlab-2-exit",
    label: "Comlab 2",
    action: "exit",
    showArea: { xMin: 9, xMax: 10.56, zMin: -26.5, zMax: -25.5, yMin: 0, yMax: 3 },
    teleport: { x: 11.63, y: 0.4, z: -26 },
  },
];

function enterZoneVolume(zone: EnterZone): number {
  return (
    (zone.xMax - zone.xMin) *
    (zone.zMax - zone.zMin) *
    ((zone.yMax ?? 10) - (zone.yMin ?? 0))
  );
}

export function isPositionInEnterZone(
  position: { x: number; y: number; z: number },
  zone: EnterZone,
): boolean {
  return (
    position.x >= zone.xMin &&
    position.x <= zone.xMax &&
    position.z >= zone.zMin &&
    position.z <= zone.zMax &&
    position.y >= (zone.yMin ?? 0) &&
    position.y <= (zone.yMax ?? 10)
  );
}

export type EnterTarget = {
  area: EnterArea;
  teleportPosition: THREE.Vector3;
};

/** How close (world units) the player must be to the teleport spot before Enter hides. */
export const enterArrivalDistance = 1.5;
 
/**
 * Returns the enter interaction for the player's position, if any.
 * When multiple show areas overlap, the smallest (most specific) zone wins.
 */
export function getEnterTargetAtPosition(position: {
  x: number;
  y: number;
  z: number;
}): EnterTarget | null {
  const pos = new THREE.Vector3(position.x, position.y, position.z);

  const matches = ENTER_AREAS.filter((area) =>
    isPositionInEnterZone(position, area.showArea),
  ).sort((a, b) => enterZoneVolume(a.showArea) - enterZoneVolume(b.showArea));

  for (const area of matches) {
    const teleportPosition = new THREE.Vector3(
      area.teleport.x,
      area.teleport.y,
      area.teleport.z,
    );
    if (pos.distanceTo(teleportPosition) > enterArrivalDistance) {
      return { area, teleportPosition };
    }
    return null;
  }

  return null;
}
