import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { MdInfoOutline } from "react-icons/md";
import useWorld from "../../../hooks/useWorld";
import { getLocationDescription } from "../../../data/locationDescriptions";
import {
  FIXED_LOCATION_PINS,
  getFloorZonesAtPosition,
} from "../../../sampleData";
import { useFaqSpeech } from "../../../features/contact/hooks/useFaqSpeech";

const AREA_DESCRIPTIONS: Record<string, string> = {
  "Main Gate":
    "The main entrance of the campus and the usual starting point for visitors and students entering the school grounds.",
  Library:
    "A quiet learning area for reading, research, study sessions, and access to learning resources.",
  "Director's Office":
    "The director's office within the Administration Building, used for campus leadership and executive affairs.",
  Pylon:
    "A campus landmark and point of interest commonly used as a reference location around the grounds.",
  Grandstand:
    "An open campus area used for gatherings, events, outdoor activities, and large school programs.",
  "Tau Gamma":
    "A marked campus area included in the navigation map for location awareness.",
};

const normalizeAreaName = (name: string) => name.trim();

export const AreaInfo = () => {
  const characterPosition = useWorld(
    (state: any) => state.characterPositionOnFloorLabel
  );
  const [currentAreas, setCurrentAreas] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const { speak, stop, isSupported } = useFaqSpeech();
  const speechIdRef = useRef("area-info");

  useEffect(() => {
    if (!characterPosition) return;

    const zones = getFloorZonesAtPosition(characterPosition);
    const nextAreas = zones.map((zone) => normalizeAreaName(zone.name));
    setCurrentAreas((prev) => {
      if (prev.join("|") === nextAreas.join("|")) return prev;
      return nextAreas;
    });
    if (nextAreas.length === 0) setOpen(false);
  }, [characterPosition]);

  const currentArea = currentAreas[0] ?? null;
  const parentAreas = currentAreas.slice(1);

  useEffect(() => {
    setOpen(false);
  }, [currentAreas.join("|")]);

  const areaPin = useMemo(() => {
    if (currentAreas.length === 0) return null;
    for (const name of currentAreas) {
      const pin = FIXED_LOCATION_PINS.find(
        (p) => normalizeAreaName(p.name) === name
      );
      if (pin) return pin;
    }
    return null;
  }, [currentAreas]);

  const description = useMemo(() => {
    if (!currentArea) return "";
    return (
      getLocationDescription(currentArea) ??
      (areaPin ? getLocationDescription(areaPin.id) : undefined) ??
      AREA_DESCRIPTIONS[currentArea] ??
      "This area is part of the campus navigation map. Use it as a nearby landmark while exploring the virtual tour."
    );
  }, [areaPin, currentArea]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  useEffect(() => {
    if (!open) stop();
  }, [open, stop]);

  if (!currentArea) return null;

  const roomCount = areaPin?.rooms?.length ?? 0;
  const floorCount = areaPin?.rooms
    ? new Set(areaPin.rooms.map((room) => room.floor).filter(Boolean)).size
    : 0;
  const imageSrc = areaPin?.imageSrc ?? "/images/campus-image.jpg";

  const handleOpen = () => {
    setOpen(true);
    if (isSupported && description.trim()) {
      speak(speechIdRef.current, description);
    }
  };

  const handleClose = () => {
    stop();
    setOpen(false);
  };

  return (
    <>
      {!open && (
        <motion.button
          type="button"
          onClick={handleOpen}
          className="fixed right-4 top-1/2 z-[1300] flex -translate-y-1/2 items-center gap-1.5 rounded-full border-[3px] border-ink bg-gold px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-ink shadow-brutal-sm transition-all hover:bg-gold/90 active:translate-y-[calc(-50%+2px)] active:shadow-none [@media(max-width:768px)]:top-auto [@media(max-width:768px)]:right-3 [@media(max-width:768px)]:bottom-24 [@media(max-width:768px)]:translate-y-0 [@media(max-width:768px)]:active:translate-y-0.5 [@media(max-height:500px)]:px-2.5 [@media(max-height:500px)]:py-1 [@media(max-height:500px)]:text-[8px] [@media(orientation:landscape)_and_(max-height:600px)]:right-3 [@media(orientation:landscape)_and_(max-height:600px)]:gap-1 [@media(orientation:landscape)_and_(max-height:600px)]:border-2 [@media(orientation:landscape)_and_(max-height:600px)]:px-2 [@media(orientation:landscape)_and_(max-height:600px)]:py-1 [@media(orientation:landscape)_and_(max-height:600px)]:text-[8px] [@media(orientation:landscape)_and_(max-height:600px)]:shadow-brutal-sm"
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
            className="fixed right-4 top-1/2 z-[1310] w-[min(340px,calc(100vw-2rem))] -translate-y-1/2 overflow-hidden rounded-[1.75rem] border-[4px] border-ink bg-cream text-ink shadow-[7px_7px_0_0_rgba(15,23,42,1)] pointer-events-auto [@media(max-width:768px)]:right-1/2 [@media(max-width:768px)]:top-auto [@media(max-width:768px)]:bottom-4 [@media(max-width:768px)]:translate-x-1/2 [@media(max-width:768px)]:translate-y-0 [@media(orientation:landscape)_and_(max-height:600px)]:right-1/2 [@media(orientation:landscape)_and_(max-height:600px)]:top-1/2 [@media(orientation:landscape)_and_(max-height:600px)]:bottom-auto [@media(orientation:landscape)_and_(max-height:600px)]:max-h-[92dvh] [@media(orientation:landscape)_and_(max-height:600px)]:w-[min(300px,58vw)] [@media(orientation:landscape)_and_(max-height:600px)]:translate-x-1/2 [@media(orientation:landscape)_and_(max-height:600px)]:-translate-y-1/2 [@media(orientation:landscape)_and_(max-height:600px)]:rounded-2xl [@media(orientation:landscape)_and_(max-height:600px)]:border-[3px] [@media(orientation:landscape)_and_(max-height:600px)]:shadow-brutal-sm"
            initial={{ opacity: 0, x: 32, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 32, scale: 0.96 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
          >
            <div className="flex items-start justify-between gap-3 border-b-[4px] border-ink bg-maroon px-4 py-3 text-white [@media(orientation:landscape)_and_(max-height:600px)]:gap-2 [@media(orientation:landscape)_and_(max-height:600px)]:border-b-[3px] [@media(orientation:landscape)_and_(max-height:600px)]:px-3 [@media(orientation:landscape)_and_(max-height:600px)]:py-2">
              <div className="min-w-0">
                <h2 className="text-lg font-black italic leading-tight [@media(orientation:landscape)_and_(max-height:600px)]:text-sm">
                  {currentArea}
                </h2>
                {parentAreas.length > 0 && (
                  <p className="mt-0.5 text-xs font-bold not-italic text-white/90 [@media(orientation:landscape)_and_(max-height:600px)]:text-[10px]">
                    {parentAreas.join(" · ")}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center">
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close area information"
                  className="rounded-xl border-2 border-ink bg-white p-1.5 text-ink transition-colors hover:bg-cream active:scale-95 [@media(orientation:landscape)_and_(max-height:600px)]:rounded-lg [@media(orientation:landscape)_and_(max-height:600px)]:p-1"
                >
                  <IoClose size={16} />
                </button>
              </div>
            </div>

            <div className="relative h-36 border-b-[4px] border-ink bg-slate-200 [@media(orientation:landscape)_and_(max-height:600px)]:h-20 [@media(orientation:landscape)_and_(max-height:600px)]:border-b-[3px]">
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
              <div className="rounded-2xl border-[3px] border-ink bg-muted p-3 [@media(orientation:landscape)_and_(max-height:600px)]:rounded-xl [@media(orientation:landscape)_and_(max-height:600px)]:border-2 [@media(orientation:landscape)_and_(max-height:600px)]:p-2">
                <p className="text-sm font-bold leading-snug text-ink/80 [@media(orientation:landscape)_and_(max-height:600px)]:text-[11px] [@media(orientation:landscape)_and_(max-height:600px)]:leading-4">
                  {description}
                </p>
              </div>

              {(roomCount > 0 || areaPin?.kind) && (
                <div className="flex flex-wrap gap-2 [@media(orientation:landscape)_and_(max-height:600px)]:gap-1.5">
                  {areaPin?.kind && (
                    <span className="rounded-full border-[2px] border-ink bg-gold px-2.5 py-1 text-[10px] font-black uppercase text-ink [@media(orientation:landscape)_and_(max-height:600px)]:px-2 [@media(orientation:landscape)_and_(max-height:600px)]:py-0.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-[8px]">
                      {areaPin.kind === "building" ? "Building" : "Location"}
                    </span>
                  )}
                  {roomCount > 0 && (
                    <span className="rounded-full border-[2px] border-ink bg-white px-2.5 py-1 text-[10px] font-black uppercase text-ink [@media(orientation:landscape)_and_(max-height:600px)]:px-2 [@media(orientation:landscape)_and_(max-height:600px)]:py-0.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-[8px]">
                      {roomCount} Rooms
                    </span>
                  )}
                  {floorCount > 0 && (
                    <span className="rounded-full border-[2px] border-ink bg-white px-2.5 py-1 text-[10px] font-black uppercase text-ink [@media(orientation:landscape)_and_(max-height:600px)]:px-2 [@media(orientation:landscape)_and_(max-height:600px)]:py-0.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-[8px]">
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
