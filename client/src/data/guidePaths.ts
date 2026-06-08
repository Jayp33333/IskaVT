import * as THREE from "three";
import { DESTINATIONS } from "../sampleData";
import {
  campusPathToPoints,
  DESTINATION_NODES,
  findShortestCampusPath,
} from "./campusGraph";

export const GUIDE_Y = 0.18;

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
  destinationId?: string | null,
): THREE.Vector3[] {
  const start = toGuidePoint(character);
  const end = new THREE.Vector3(
    pin.x,
    Math.max(GUIDE_Y, pin.y + 0.05),
    pin.z,
  );

  const destId = destinationId ?? findDestinationIdForPin(pin);
  const goalNode = destId ? DESTINATION_NODES[destId] : undefined;
  const graphPath = findShortestCampusPath(character, end, goalNode);

  if (graphPath) {
    const points = campusPathToPoints(start, end, graphPath).map((point) =>
      toGuidePoint(point, point.y),
    );
    return dedupeClosePoints(points, 0.3);
  }

  return [start, end];
}

export function createGuideCurve(points: THREE.Vector3[]): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.35);
}

export function computeGuideDistance(
  character: THREE.Vector3,
  pin: THREE.Vector3,
  destinationId?: string | null,
): number {
  const pathPoints = buildGuidePath(character, pin, destinationId);
  if (pathPoints.length < 2) return 0;

  const curve = createGuideCurve(pathPoints);
  return curve.getLength();
}
