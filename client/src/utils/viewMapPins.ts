import type { FixedLocationPin } from "../sampleData";

/** Map pin positions (% on CampusMap.png) for the homepage View Map dialog.
 *  Edit x/y here to nudge markers without affecting Map2D / MiniMap. */
export type ViewMapPinPosition = {
  /** Matches FixedLocationPin.id */
  id: string;
  /** Horizontal position on the map image (0 = left, 100 = right) */
  x: number;
  /** Vertical position on the map image (0 = top, 100 = bottom) */
  y: number;
};

export const VIEW_MAP_PIN_POSITIONS: ViewMapPinPosition[] = [
  { id: "grandstand", x: 47, y: 46 },
  { id: "gymnasium", x: 70, y: 33 },
  { id: "yumul-building", x: 65, y: 82 },
  { id: "administration-building", x: 60, y: 94 },
  { id: "nantes-building", x: 55, y: 38 },
  { id: "health-sciences", x: 20, y: 70 },
  { id: "education-building", x: 36, y: 13 },
  { id: "engineering-building", x: 10, y: 40 },
  { id: "pylon", x: 53, y: 65 },
  { id: "comlab-1", x: 40, y: 88 },
  { id: "comlab-2", x: 46, y: 82 },
  { id: "main-gate", x: 48, y: 96 },
];

const viewMapPositionById = new Map(
  VIEW_MAP_PIN_POSITIONS.map((p) => [p.id, p]),
);

/** Join fixed-location metadata with homepage-only map positions. */
export function getViewMapPinsWithPosition(pins: FixedLocationPin[]) {
  return pins.flatMap((pin) => {
    const pos = viewMapPositionById.get(pin.id);
    if (!pos) return [];
    return [{ pin, x: pos.x, y: pos.y }];
  });
}
