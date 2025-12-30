import { useState, useEffect } from "react";
import useWorld from "../../../hooks/useWorld";
import { motion, AnimatePresence } from "framer-motion";
import { floorZones } from "../../../sampleData";

export const FloorLabel = () => {
  const characterPosition = useWorld((state: any) => state.characterPosition);
  const [currentZone, setCurrentZone] = useState<string | null>(null);

  useEffect(() => {
    if (!characterPosition) return;

    let zoneFound: string | null = null;
    for (const zone of floorZones) {
      if (
        characterPosition.x >= zone.xMin &&
        characterPosition.x <= zone.xMax &&
        characterPosition.z >= zone.zMin &&
        characterPosition.z <= zone.zMax &&
        characterPosition.y >= (zone.yMin || 0) &&
        characterPosition.y <= (zone.yMax || 10)
      ) {
        
        zoneFound = zone.name;
        break;
      }
    }

    setCurrentZone(zoneFound);
  }, [characterPosition]);

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
