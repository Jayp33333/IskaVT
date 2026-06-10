import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useWorld from "../../../hooks/useWorld";
import { resolveGuidePath } from "../../../data/guidePaths";

const DistanceUpdater = () => {
  const characterPosition = useWorld((s: any) => s.characterPosition);
  const pinPosition = useWorld((s: any) => s.pinPosition);
  const selectedDestinationId = useWorld((s: any) => s.selectedDestinationId);
  const setDistance = useWorld((s: any) => s.setDistance);
  const lastRoundedDistanceRef = useRef<number | null>(null);

  useFrame(() => {
    if (characterPosition && pinPosition) {
      const resolved = resolveGuidePath(
        characterPosition,
        pinPosition,
        selectedDestinationId,
      );
      const nextDistance = resolved?.length ?? 0;
      const rounded = Math.max(0, Math.round(nextDistance));

      if (rounded !== lastRoundedDistanceRef.current) {
        lastRoundedDistanceRef.current = rounded;
        setDistance(nextDistance);
      }
    }
  });

  return null;
};

export default DistanceUpdater;
