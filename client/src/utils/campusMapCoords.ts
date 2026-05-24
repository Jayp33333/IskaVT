// Campus map bounds (world-space X / Z) for Map2D / MiniMap in the 3D experience.
// Tweak these to align markers with CampusMap.png. They should match the area
// of the 3D world captured in the map.
// Homepage View Map pin positions are edited separately in viewMapPins.ts.
export const CAMPUS = {
  minX: -85,
  maxX: 85,
  minZ: -120,
  maxZ: 120,
};

// Calibration offsets (in % of the map image).
// Positive x moves markers right; positive y moves markers down.
export const START_OFFSET_X = -8.7;
export const START_OFFSET_Y = 45;

const clampPercent = (n: number) => Math.max(0, Math.min(100, n));

/** Convert world X/Z to normalized map position (% within the image, 0..100). */
export function worldToMapPercent(x: number, z: number) {
  const width = CAMPUS.maxX - CAMPUS.minX;
  const height = CAMPUS.maxZ - CAMPUS.minZ;
  return {
    x: clampPercent(((x - CAMPUS.minX) / width) * 100 + START_OFFSET_X),
    y: clampPercent(((z - CAMPUS.minZ) / height) * 100 + START_OFFSET_Y),
  };
}

/** Convert normalized map position (% within the image) back to world X/Z. */
export function mapPercentToWorld(xPct: number, yPct: number) {
  const width = CAMPUS.maxX - CAMPUS.minX;
  const height = CAMPUS.maxZ - CAMPUS.minZ;
  return {
    worldX: ((xPct - START_OFFSET_X) / 100) * width + CAMPUS.minX,
    worldZ: ((yPct - START_OFFSET_Y) / 100) * height + CAMPUS.minZ,
  };
}
