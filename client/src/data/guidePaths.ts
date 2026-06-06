import * as THREE from "three";
import { DESTINATIONS } from "../sampleData";

export const GUIDE_Y = 0.18;

/**
 * Hand-placed route corners keyed by destination id (see sampleData / FIXED_LOCATION_PINS).
 *
 * Edit tips:
 * - Walk the route in-game and read X/Z from the pin panel or browser console.
 * - Keep GUIDE_Y (~0.18) unless the line needs to sit higher on stairs/ramps.
 * - Add one Vector3 per turn; the guide smooths between them automatically.
 *
 * Reference positions (world X, Y, Z):
 * - Main Gate spawn  ~ (10, 0, 0)
 * - PUP Gymnasium    ~ (41, 0.2, -148)
 */
export const GUIDE_PATH_WAYPOINTS: Record<string, THREE.Vector3[]> = {
  /** Main Gate area → south past canteen → east → Gymnasium */
  // gymnasium: [
  //   new THREE.Vector3(10, GUIDE_Y, 2), // 1. step out from Main Gate
  //   new THREE.Vector3(8, GUIDE_Y, -18), // 2. south toward Comlab / inner campus
  //   new THREE.Vector3(6, GUIDE_Y, -55), // 3. continue south
  //   new THREE.Vector3(7, GUIDE_Y, -88), // 4. New Canteen / open field edge
  //   new THREE.Vector3(18, GUIDE_Y, -108), // 5. bend east (west of Grandstand)
  //   new THREE.Vector3(32, GUIDE_Y, -118), // 6. cross east across field
  //   new THREE.Vector3(41, GUIDE_Y, -135), // 7. final approach to Gymnasium
  // ],
  grandstand: [
    new THREE.Vector3(16, GUIDE_Y, -28), // Main Gate → south
    new THREE.Vector3(16, GUIDE_Y, -50),
    new THREE.Vector3(7, 1.24, -52.5),
    new THREE.Vector3(-2, 1.24, -54),
    new THREE.Vector3(-8.5, 0.3, -58),
    new THREE.Vector3(-1, 0.3, -94),
    new THREE.Vector3(6, GUIDE_Y, -104), 
    new THREE.Vector3(6, 2.5, -107), // near Grandstand (~6, 2, -119)
  ],
  "room-103": [
    new THREE.Vector3(8, GUIDE_Y, -4), // from gate toward Yumul wing
    new THREE.Vector3(5, GUIDE_Y, -8), // Comlab 1 corridor (~3.5, 0.1, -12.5)
  ],
  "room-104": [
    new THREE.Vector3(12, GUIDE_Y, -15),
    new THREE.Vector3(14, GUIDE_Y, -22), // Comlab 2 (~13.5, 0.1, -26)
  ],
};

export function getGuideWaypointsForDestinationId(
  id: string | null | undefined,
): THREE.Vector3[] | null {
  if (!id) return null;
  return GUIDE_PATH_WAYPOINTS[id] ?? null;
}

export function findDestinationIdForPin(pin: THREE.Vector3): string | null {
  for (const destination of DESTINATIONS) {
    if (destination.position.distanceTo(pin) < 1.5) {
      return destination.id;
    }
  }
  return null;
}

function toGuidePoint(v: THREE.Vector3, y = GUIDE_Y): THREE.Vector3 {
  return new THREE.Vector3(v.x, v.y ?? y, v.z);
}

function trimPassedWaypoints(
  start: THREE.Vector3,
  waypoints: THREE.Vector3[],
): THREE.Vector3[] {
  let skipUntil = 0;
  for (let i = 0; i < waypoints.length; i++) {
    if (start.distanceTo(waypoints[i]) < 5) {
      skipUntil = i + 1;
    }
  }
  return waypoints.slice(skipUntil);
}

function dedupeClosePoints(points: THREE.Vector3[], minDist: number): THREE.Vector3[] {
  if (points.length <= 1) return points.map((p) => p.clone());

  const result = [points[0].clone()];
  for (let i = 1; i < points.length; i++) {
    if (result[result.length - 1].distanceTo(points[i]) >= minDist) {
      result.push(points[i].clone());
    }
  }

  const last = points[points.length - 1];
  if (result[result.length - 1].distanceTo(last) < minDist) {
    result[result.length - 1] = last.clone();
  } else {
    result.push(last.clone());
  }

  return result;
}

export function buildGuidePath(
  character: THREE.Vector3,
  pin: THREE.Vector3,
  waypoints: THREE.Vector3[] | null | undefined,
): THREE.Vector3[] {
  const start = toGuidePoint(character);
  const end = new THREE.Vector3(
    pin.x,
    Math.max(GUIDE_Y, pin.y + 0.05),
    pin.z,
  );

  if (!waypoints?.length) {
    return [start, end];
  }

  const mids = waypoints.map((waypoint) => toGuidePoint(waypoint));
  const remaining = trimPassedWaypoints(start, mids);
  return dedupeClosePoints([start, ...remaining, end], 0.3);
}

export function createGuideCurve(points: THREE.Vector3[]): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.35);
}
