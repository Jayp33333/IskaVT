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
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5 }}
          className="fixed left-1/2 top-[clamp(54px,8vh,86px)] z-200 max-w-[min(46vw,440px)] -translate-x-1/2 whitespace-normal break-words rounded-3xl border-[3px] border-slate-900 bg-[#FFFDF9]/95 px-[clamp(12px,3vw,28px)] py-[clamp(5px,1.2vw,10px)] text-center text-[clamp(12px,2.2vw,22px)] font-black italic leading-tight tracking-wide text-[#660B05] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] pointer-events-none select-none backdrop-blur-sm [@media(max-width:768px)]:max-w-[62vw] [@media(max-width:480px)]:top-[calc(18vh+2rem)] [@media(max-width:480px)]:max-w-[72vw] [@media(max-height:500px)]:top-[3.4rem] [@media(max-height:500px)]:max-w-[52vw] [@media(max-height:500px)]:border-2 [@media(max-height:500px)]:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] [@media(orientation:landscape)_and_(max-height:600px)]:top-2 [@media(orientation:landscape)_and_(max-height:600px)]:max-w-[44vw] [@media(orientation:landscape)_and_(max-height:600px)]:rounded-xl [@media(orientation:landscape)_and_(max-height:600px)]:border-2 [@media(orientation:landscape)_and_(max-height:600px)]:px-3 [@media(orientation:landscape)_and_(max-height:600px)]:py-1.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-[11px] [@media(orientation:landscape)_and_(max-height:600px)]:leading-none [@media(orientation:landscape)_and_(max-height:600px)]:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
          style={{
            textShadow: "0 1px 0 rgba(255,255,255,0.85)",
          }}
        >
          {currentZone}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
