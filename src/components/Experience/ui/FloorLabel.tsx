import { useState, useEffect } from "react";
import useWorld from "../../../hooks/useWorld";
import { motion, AnimatePresence } from "framer-motion";
import { floorZones } from "../../../sampleData";

export const FloorLabel = () => {
  const characterPositionOnFloorLabel = useWorld(
    (state: any) => state.characterPositionOnFloorLabel
  );
  const [currentZone, setCurrentZone] = useState<string | null>(null);

  useEffect(() => {
    if (!characterPositionOnFloorLabel) return;
    let zoneFound: string | null = null;
    for (const zone of floorZones) {
      if (
        characterPositionOnFloorLabel.x >= zone.xMin &&
        characterPositionOnFloorLabel.x <= zone.xMax &&
        characterPositionOnFloorLabel.z >= zone.zMin &&
        characterPositionOnFloorLabel.z <= zone.zMax &&
        characterPositionOnFloorLabel.y >= (zone.yMin || 0) &&
        characterPositionOnFloorLabel.y <= (zone.yMax || 10)
      ) {
        zoneFound = zone.name;
        break;
      }
    }

    setCurrentZone(zoneFound);
  }, [characterPositionOnFloorLabel]);

  return (
    <AnimatePresence>
      {currentZone && (
        <motion.div
          key={currentZone}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5 }}
          className="fixed z-200 rounded-lg bg-black/70 text-white font-semibold pointer-events-none select-none"
          style={{
            top: "50%",
            right: "clamp(10px, 2vw, 20px)",
            transform: "translateY(-50%)",
            padding: "clamp(6px, 1.5vw, 12px) clamp(10px, 2vw, 16px)",
            fontSize: "clamp(14px, 2vw, 20px)",
          }}
        >
          {currentZone}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
