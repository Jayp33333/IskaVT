import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { MdInfoOutline, MdPlace } from "react-icons/md";
import useWorld from "../../../hooks/useWorld";
import { FIXED_LOCATION_PINS, floorZones } from "../../../sampleData";

const AREA_DESCRIPTIONS: Record<string, string> = {
  "Main Gate":
    "The main entrance of the campus and the usual starting point for visitors and students entering the school grounds.",
  "Comlab 1":
    "A computer laboratory area used for hands-on technology classes, practical activities, and ICT-related sessions.",
  "Comlab 2":
    "An additional computer laboratory space for ICT classes, laboratory work, and computer-based learning activities.",
  "Yumul Building":
    "A campus building with classrooms and offices used for academic activities and student services.",
  Library:
    "A quiet learning area for reading, research, study sessions, and access to learning resources.",
  "Administration Building":
    "The administrative center of the campus where important offices and student service transactions are located.",
  Pylon:
    "A campus landmark and point of interest commonly used as a reference location around the grounds.",
  "Business and Accountancy Building":
    "A building used for business, accountancy, and related academic activities across multiple rooms and floors.",
  Grandstand:
    "An open campus area used for gatherings, events, outdoor activities, and large school programs.",
  "Health and Sciences Building":
    "A building dedicated to health, science, and related academic activities.",
  "Tau Gamma":
    "A marked campus area included in the navigation map for location awareness.",
};

const normalizeAreaName = (name: string) => name.trim();

export const AreaInfo = () => {
  const characterPosition = useWorld(
    (state: any) => state.characterPositionOnFloorLabel
  );
  const [currentArea, setCurrentArea] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!characterPosition) return;

    const area = floorZones.find(
      (zone) =>
        characterPosition.x >= zone.xMin &&
        characterPosition.x <= zone.xMax &&
        characterPosition.z >= zone.zMin &&
        characterPosition.z <= zone.zMax &&
        characterPosition.y >= (zone.yMin || 0) &&
        characterPosition.y <= (zone.yMax || 10)
    );

    const nextArea = area ? normalizeAreaName(area.name) : null;
    setCurrentArea(nextArea);
    if (!nextArea) setOpen(false);
  }, [characterPosition]);

  useEffect(() => {
    setOpen(false);
  }, [currentArea]);

  const areaPin = useMemo(() => {
    if (!currentArea) return null;
    return FIXED_LOCATION_PINS.find(
      (pin) => normalizeAreaName(pin.name) === currentArea
    );
  }, [currentArea]);

  if (!currentArea) return null;

  const roomCount = areaPin?.rooms?.length ?? 0;
  const floorCount = areaPin?.rooms
    ? new Set(areaPin.rooms.map((room) => room.floor).filter(Boolean)).size
    : 0;
  const description =
    AREA_DESCRIPTIONS[currentArea] ??
    "This area is part of the campus navigation map. Use it as a nearby landmark while exploring the virtual tour.";
  const imageSrc = areaPin?.imageSrc ?? "/images/campus-image.jpg";

  return (
    <>
      {!open && (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed right-4 top-1/2 z-300 flex -translate-y-1/2 items-center gap-1.5 rounded-full border-[3px] border-slate-900 bg-yellow-300 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-900 shadow-[3px_3px_0_0_rgba(15,23,42,1)] transition-all hover:bg-yellow-200 active:translate-y-[calc(-50%+2px)] active:shadow-none [@media(max-width:768px)]:top-auto [@media(max-width:768px)]:right-3 [@media(max-width:768px)]:bottom-24 [@media(max-width:768px)]:translate-y-0 [@media(max-width:768px)]:active:translate-y-0.5 [@media(max-height:500px)]:px-2.5 [@media(max-height:500px)]:py-1 [@media(max-height:500px)]:text-[8px] [@media(orientation:landscape)_and_(max-height:600px)]:right-3 [@media(orientation:landscape)_and_(max-height:600px)]:gap-1 [@media(orientation:landscape)_and_(max-height:600px)]:border-2 [@media(orientation:landscape)_and_(max-height:600px)]:px-2 [@media(orientation:landscape)_and_(max-height:600px)]:py-1 [@media(orientation:landscape)_and_(max-height:600px)]:text-[8px] [@media(orientation:landscape)_and_(max-height:600px)]:shadow-[2px_2px_0_0_rgba(15,23,42,1)]"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          whileTap={{ scale: 0.96 }}
        >
          <MdInfoOutline size={14} />
          Area Info
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.aside
            className="fixed right-4 top-1/2 z-400 w-[min(340px,calc(100vw-2rem))] -translate-y-1/2 overflow-hidden rounded-[1.75rem] border-[4px] border-slate-900 bg-[#FFFDF9] text-slate-800 shadow-[7px_7px_0_0_rgba(15,23,42,1)] pointer-events-auto [@media(max-width:768px)]:right-1/2 [@media(max-width:768px)]:top-auto [@media(max-width:768px)]:bottom-4 [@media(max-width:768px)]:translate-x-1/2 [@media(max-width:768px)]:translate-y-0 [@media(orientation:landscape)_and_(max-height:600px)]:right-1/2 [@media(orientation:landscape)_and_(max-height:600px)]:top-1/2 [@media(orientation:landscape)_and_(max-height:600px)]:bottom-auto [@media(orientation:landscape)_and_(max-height:600px)]:max-h-[92dvh] [@media(orientation:landscape)_and_(max-height:600px)]:w-[min(300px,58vw)] [@media(orientation:landscape)_and_(max-height:600px)]:translate-x-1/2 [@media(orientation:landscape)_and_(max-height:600px)]:-translate-y-1/2 [@media(orientation:landscape)_and_(max-height:600px)]:rounded-2xl [@media(orientation:landscape)_and_(max-height:600px)]:border-[3px] [@media(orientation:landscape)_and_(max-height:600px)]:shadow-[4px_4px_0_0_rgba(15,23,42,1)]"
            initial={{ opacity: 0, x: 32, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 32, scale: 0.96 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
          >
            <div className="flex items-start justify-between gap-3 border-b-[4px] border-slate-900 bg-[#D43F3F] px-4 py-3 text-white [@media(orientation:landscape)_and_(max-height:600px)]:gap-2 [@media(orientation:landscape)_and_(max-height:600px)]:border-b-[3px] [@media(orientation:landscape)_and_(max-height:600px)]:px-3 [@media(orientation:landscape)_and_(max-height:600px)]:py-2">
              <div className="min-w-0">
                <h2 className="text-lg font-black italic leading-tight [@media(orientation:landscape)_and_(max-height:600px)]:text-sm">
                  {currentArea}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close area information"
                className="shrink-0 rounded-xl border-[3px] border-slate-900 bg-white p-1 text-slate-900 shadow-[2px_2px_0_0_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none [@media(orientation:landscape)_and_(max-height:600px)]:rounded-lg [@media(orientation:landscape)_and_(max-height:600px)]:border-2 [@media(orientation:landscape)_and_(max-height:600px)]:p-0.5"
              >
                <IoClose size={16} />
              </button>
            </div>

            <div className="relative h-36 border-b-[4px] border-slate-900 bg-slate-200 [@media(orientation:landscape)_and_(max-height:600px)]:h-20 [@media(orientation:landscape)_and_(max-height:600px)]:border-b-[3px]">
              <img
                src={imageSrc}
                alt={currentArea}
                className="h-full w-full object-cover"
                loading="lazy"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 to-transparent" />
            </div>

            <div className="space-y-3 p-4 [@media(orientation:landscape)_and_(max-height:600px)]:space-y-2 [@media(orientation:landscape)_and_(max-height:600px)]:p-2.5">
              <div className="flex items-start gap-3 rounded-2xl border-[3px] border-slate-900 bg-slate-100 p-3 [@media(orientation:landscape)_and_(max-height:600px)]:gap-2 [@media(orientation:landscape)_and_(max-height:600px)]:rounded-xl [@media(orientation:landscape)_and_(max-height:600px)]:border-2 [@media(orientation:landscape)_and_(max-height:600px)]:p-2">
                <div className="shrink-0 rounded-xl border-[3px] border-slate-900 bg-blue-400 p-2 shadow-[2px_2px_0_0_rgba(15,23,42,1)] [@media(orientation:landscape)_and_(max-height:600px)]:rounded-lg [@media(orientation:landscape)_and_(max-height:600px)]:border-2 [@media(orientation:landscape)_and_(max-height:600px)]:p-1.5">
                  <MdPlace size={18} className="text-slate-900" />
                </div>
                <p className="text-sm font-bold leading-snug text-slate-700 [@media(orientation:landscape)_and_(max-height:600px)]:text-[11px] [@media(orientation:landscape)_and_(max-height:600px)]:leading-4">
                  {description}
                </p>
              </div>

              {(roomCount > 0 || areaPin?.kind) && (
                <div className="flex flex-wrap gap-2 [@media(orientation:landscape)_and_(max-height:600px)]:gap-1.5">
                  {areaPin?.kind && (
                    <span className="rounded-full border-[2px] border-slate-900 bg-yellow-300 px-2.5 py-1 text-[10px] font-black uppercase text-slate-900 [@media(orientation:landscape)_and_(max-height:600px)]:px-2 [@media(orientation:landscape)_and_(max-height:600px)]:py-0.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-[8px]">
                      {areaPin.kind === "building" ? "Building" : "Location"}
                    </span>
                  )}
                  {roomCount > 0 && (
                    <span className="rounded-full border-[2px] border-slate-900 bg-white px-2.5 py-1 text-[10px] font-black uppercase text-slate-900 [@media(orientation:landscape)_and_(max-height:600px)]:px-2 [@media(orientation:landscape)_and_(max-height:600px)]:py-0.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-[8px]">
                      {roomCount} Rooms
                    </span>
                  )}
                  {floorCount > 0 && (
                    <span className="rounded-full border-[2px] border-slate-900 bg-white px-2.5 py-1 text-[10px] font-black uppercase text-slate-900 [@media(orientation:landscape)_and_(max-height:600px)]:px-2 [@media(orientation:landscape)_and_(max-height:600px)]:py-0.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-[8px]">
                      {floorCount} Floors
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
