import { useState, useEffect } from "react";
import useWorld from "../../../hooks/useWorld";
import { motion, AnimatePresence } from "framer-motion";
import { floorZones } from "../../../sampleData";

export const FloorLabel = () => {
  const characterPositionOnFloorLabel = useWorld((state: any) => state.characterPositionOnFloorLabel);
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="fixed left-20 bottom-1/2 -translate-x-1/2 z-200 
                     rounded-lg bg-black/70 p-2 text-white text-lg font-semibold 
                     pointer-events-none select-none"
        >
          {currentZone}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
