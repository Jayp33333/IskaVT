import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { MdPlace } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import type { Vector3 } from "three";
import type { FixedLocationPin, FixedLocationRoom } from "../../../sampleData";

type FixedLocationModalProps = {
  pin: FixedLocationPin | null;
  onClose: () => void;
  onVisit: (target: { id?: string; name: string; position: Vector3 }) => void;
};

export function FixedLocationModal({
  pin,
  onClose,
  onVisit,
}: FixedLocationModalProps) {
  const rooms: FixedLocationRoom[] =
    pin?.kind === "building" ? pin.rooms ?? [] : [];
  const hasFloors = rooms.some((r) => typeof r.floor === "number");

  const roomsByFloor = hasFloors
    ? rooms.reduce<Record<string, FixedLocationRoom[]>>((acc, r) => {
        const key = typeof r.floor === "number" ? String(r.floor) : "Other";
        (acc[key] ??= []).push(r);
        return acc;
      }, {})
    : null;

  const floorKeys = roomsByFloor
    ? Object.keys(roomsByFloor).sort((a, b) => Number(a) - Number(b))
    : [];

  const [activeFloor, setActiveFloor] = useState<string | null>(null);

  // Keep the active floor in sync with which pin is open: reset to the first
  // available floor whenever a new pin is shown (or the floor list changes).
  useEffect(() => {
    if (!pin) {
      setActiveFloor(null);
      return;
    }
    if (floorKeys.length === 0) {
      setActiveFloor(null);
      return;
    }
    if (!activeFloor || !floorKeys.includes(activeFloor)) {
      setActiveFloor(floorKeys[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin?.id, floorKeys.join("|")]);

  const isBuilding = pin?.kind === "building";

  return (
    <AnimatePresence>
      {pin && (
        <motion.div
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-ink/85 p-4 pointer-events-auto [@media(max-height:500px)]:p-2 [@media(orientation:landscape)_and_(max-height:768px)]:p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="
              relative w-full max-w-[460px]
              bg-cream text-ink
              rounded-[2rem] sm:rounded-[2.5rem]
              border-[4px] sm:border-[6px] border-ink
              flex flex-col max-h-[90vh] overflow-hidden
              [@media(max-height:500px)]:max-h-[94dvh] [@media(max-height:500px)]:rounded-2xl [@media(max-height:500px)]:border-[3px]
              [@media(orientation:landscape)_and_(max-height:768px)]:max-w-[min(92vw,400px)] [@media(orientation:landscape)_and_(max-height:768px)]:max-h-[96dvh] [@media(orientation:landscape)_and_(max-height:768px)]:rounded-xl [@media(orientation:landscape)_and_(max-height:768px)]:border-[3px]
              [@media(orientation:landscape)_and_(max-height:500px)]:max-w-[min(88vw,360px)] [@media(orientation:landscape)_and_(max-height:500px)]:max-h-[98dvh] [@media(orientation:landscape)_and_(max-height:500px)]:rounded-xl [@media(orientation:landscape)_and_(max-height:500px)]:border-2
            "
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header image with gradient overlay and title */}
            <div className="relative border-b-[4px] sm:border-b-[6px] border-ink [@media(max-height:500px)]:border-b-[3px] [@media(orientation:landscape)_and_(max-height:768px)]:border-b-[3px] [@media(orientation:landscape)_and_(max-height:500px)]:border-b-2">
              <img
                src={pin.imageSrc ?? "/images/campus-image.jpg"}
                alt={pin.name}
                className="w-full h-44 sm:h-52 object-cover block [@media(max-height:500px)]:h-32 [@media(orientation:landscape)_and_(max-height:768px)]:h-24 [@media(orientation:landscape)_and_(max-height:500px)]:h-[4.5rem]"
                loading="lazy"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent pointer-events-none" />

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close"
                type="button"
                className="absolute top-3 right-3 bg-white border-[3px] border-ink p-1.5 rounded-xl hover:bg-muted transition-transform active:scale-90 shadow-brutal-sm [@media(max-height:500px)]:top-2 [@media(max-height:500px)]:right-2 [@media(max-height:500px)]:p-1 [@media(max-height:500px)]:rounded-lg [@media(max-height:500px)]:border-2 [@media(orientation:landscape)_and_(max-height:768px)]:top-1.5 [@media(orientation:landscape)_and_(max-height:768px)]:right-1.5 [@media(orientation:landscape)_and_(max-height:768px)]:p-1 [@media(orientation:landscape)_and_(max-height:768px)]:rounded-lg [@media(orientation:landscape)_and_(max-height:768px)]:border-2"
              >
                <IoClose className="h-[18px] w-[18px] [@media(max-height:500px)]:h-4 [@media(max-height:500px)]:w-4 [@media(orientation:landscape)_and_(max-height:768px)]:h-3.5 [@media(orientation:landscape)_and_(max-height:768px)]:w-3.5" strokeWidth={2} />
              </button>

              {/* Kind badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-gold border-[3px] border-ink px-2 py-0.5 rounded-full shadow-brutal-sm [@media(max-height:500px)]:top-2 [@media(max-height:500px)]:left-2 [@media(max-height:500px)]:gap-1 [@media(max-height:500px)]:px-1.5 [@media(max-height:500px)]:border-2 [@media(orientation:landscape)_and_(max-height:768px)]:top-1.5 [@media(orientation:landscape)_and_(max-height:768px)]:left-1.5 [@media(orientation:landscape)_and_(max-height:768px)]:gap-1 [@media(orientation:landscape)_and_(max-height:768px)]:px-1.5 [@media(orientation:landscape)_and_(max-height:768px)]:py-0 [@media(orientation:landscape)_and_(max-height:768px)]:border-2">
                {isBuilding ? (
                  <HiBuildingOffice2 className="h-3 w-3 text-ink [@media(orientation:landscape)_and_(max-height:768px)]:h-2.5 [@media(orientation:landscape)_and_(max-height:768px)]:w-2.5" />
                ) : (
                  <MdPlace className="h-3 w-3 text-ink [@media(orientation:landscape)_and_(max-height:768px)]:h-2.5 [@media(orientation:landscape)_and_(max-height:768px)]:w-2.5" />
                )}
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-ink [@media(max-height:500px)]:text-[8px] [@media(orientation:landscape)_and_(max-height:768px)]:text-[7px]">
                  {isBuilding ? "Building" : "Location"}
                </p>
              </div>

              {/* Title block */}
              <div className="absolute bottom-3 left-4 right-4 [@media(max-height:500px)]:bottom-2 [@media(max-height:500px)]:left-3 [@media(max-height:500px)]:right-3 [@media(orientation:landscape)_and_(max-height:768px)]:bottom-1.5 [@media(orientation:landscape)_and_(max-height:768px)]:left-2.5 [@media(orientation:landscape)_and_(max-height:768px)]:right-2.5">
                <h2 className="text-xl sm:text-2xl font-black italic text-white leading-tight uppercase drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] [@media(max-height:500px)]:text-lg [@media(orientation:landscape)_and_(max-height:768px)]:text-sm [@media(orientation:landscape)_and_(max-height:500px)]:text-xs">
                  {pin.name}
                </h2>
                {isBuilding && rooms.length > 0 && (
                  <p className="text-[10px] sm:text-xs font-bold text-white/90 mt-0.5 [@media(max-height:500px)]:text-[9px] [@media(orientation:landscape)_and_(max-height:768px)]:text-[8px] [@media(orientation:landscape)_and_(max-height:768px)]:mt-0 [@media(orientation:landscape)_and_(max-height:500px)]:hidden">
                    {rooms.length} room{rooms.length === 1 ? "" : "s"}
                    {floorKeys.length > 1
                      ? ` · ${floorKeys.length} floors`
                      : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
              {rooms.length > 0 ? (
                <div className="p-4 sm:p-5 space-y-4 [@media(max-height:500px)]:p-3 [@media(max-height:500px)]:space-y-2.5 [@media(orientation:landscape)_and_(max-height:768px)]:p-2.5 [@media(orientation:landscape)_and_(max-height:768px)]:space-y-2 [@media(orientation:landscape)_and_(max-height:500px)]:p-2 [@media(orientation:landscape)_and_(max-height:500px)]:space-y-1.5">
                  {/* Floor tabs (only when there are multiple floors) */}
                  {roomsByFloor && floorKeys.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-1 [@media(orientation:landscape)_and_(max-height:768px)]:gap-1 [@media(orientation:landscape)_and_(max-height:768px)]:pb-0">
                      {floorKeys.map((floor) => {
                        const active = activeFloor === floor;
                        return (
                          <button
                            key={floor}
                            type="button"
                            onClick={() => setActiveFloor(floor)}
                            className={`shrink-0 px-3 py-1.5 rounded-xl border-[3px] border-ink text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all active:translate-y-0.5 [@media(max-height:500px)]:px-2.5 [@media(max-height:500px)]:py-1 [@media(max-height:500px)]:text-[10px] [@media(orientation:landscape)_and_(max-height:768px)]:px-2 [@media(orientation:landscape)_and_(max-height:768px)]:py-0.5 [@media(orientation:landscape)_and_(max-height:768px)]:rounded-lg [@media(orientation:landscape)_and_(max-height:768px)]:border-2 [@media(orientation:landscape)_and_(max-height:768px)]:text-[9px] [@media(orientation:landscape)_and_(max-height:500px)]:px-1.5 [@media(orientation:landscape)_and_(max-height:500px)]:text-[8px] ${
                              active
                                ? "bg-maroon text-white shadow-brutal-sm active:shadow-none [@media(orientation:landscape)_and_(max-height:768px)]:shadow-brutal-sm"
                                : "bg-white text-ink/80 hover:bg-muted shadow-brutal-sm active:shadow-none"
                            }`}
                          >
                            Floor {floor}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Room list */}
                  <div className="space-y-2 [@media(orientation:landscape)_and_(max-height:768px)]:space-y-1 [@media(orientation:landscape)_and_(max-height:500px)]:space-y-0.5">
                    {(roomsByFloor && activeFloor
                      ? roomsByFloor[activeFloor] ?? []
                      : rooms
                    ).map((room) => (
                      <div
                        key={room.id}
                        className="
                          w-full flex items-center justify-between gap-3
                          px-3 py-2.5 rounded-xl
                          bg-white border-[3px] border-ink
                          shadow-brutal-sm
                          [@media(max-height:500px)]:px-2.5 [@media(max-height:500px)]:py-2 [@media(max-height:500px)]:gap-2
                          [@media(orientation:landscape)_and_(max-height:768px)]:px-2 [@media(orientation:landscape)_and_(max-height:768px)]:py-1.5 [@media(orientation:landscape)_and_(max-height:768px)]:gap-1.5 [@media(orientation:landscape)_and_(max-height:768px)]:rounded-lg [@media(orientation:landscape)_and_(max-height:768px)]:border-2 [@media(orientation:landscape)_and_(max-height:768px)]:shadow-brutal-sm
                          [@media(orientation:landscape)_and_(max-height:500px)]:px-1.5 [@media(orientation:landscape)_and_(max-height:500px)]:py-1 [@media(orientation:landscape)_and_(max-height:500px)]:gap-1
                        "
                      >
                        <div className="flex items-center gap-2 min-w-0 [@media(orientation:landscape)_and_(max-height:768px)]:gap-1.5">
                          <div className="bg-blue-400 border-[2px] border-ink p-1.5 rounded-lg shrink-0 shadow-brutal-sm [@media(orientation:landscape)_and_(max-height:768px)]:p-1 [@media(orientation:landscape)_and_(max-height:768px)]:rounded-md [@media(orientation:landscape)_and_(max-height:500px)]:p-0.5">
                            <MdPlace className="h-3.5 w-3.5 text-ink [@media(orientation:landscape)_and_(max-height:768px)]:h-3 [@media(orientation:landscape)_and_(max-height:768px)]:w-3 [@media(orientation:landscape)_and_(max-height:500px)]:h-2.5 [@media(orientation:landscape)_and_(max-height:500px)]:w-2.5" />
                          </div>
                          <span className="text-xs sm:text-sm font-extrabold text-ink truncate [@media(max-height:500px)]:text-[11px] [@media(orientation:landscape)_and_(max-height:768px)]:text-[10px] [@media(orientation:landscape)_and_(max-height:500px)]:text-[9px]">
                            {room.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onVisit(room)}
                          className="
                            shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg
                            bg-gold border-[2px] border-ink
                            text-[10px] sm:text-[11px] font-black italic uppercase text-ink
                            hover:bg-gold
                            active:translate-y-0.5 active:shadow-none
                            transition-all
                            [@media(max-height:500px)]:px-2 [@media(max-height:500px)]:py-0.5 [@media(max-height:500px)]:text-[9px]
                            [@media(orientation:landscape)_and_(max-height:768px)]:gap-0.5 [@media(orientation:landscape)_and_(max-height:768px)]:px-1.5 [@media(orientation:landscape)_and_(max-height:768px)]:py-0.5 [@media(orientation:landscape)_and_(max-height:768px)]:rounded-md [@media(orientation:landscape)_and_(max-height:768px)]:text-[8px]
                            [@media(orientation:landscape)_and_(max-height:500px)]:px-1 [@media(orientation:landscape)_and_(max-height:500px)]:text-[7px]
                          "
                        >
                          <FaLocationCrosshairs className="h-2.5 w-2.5 [@media(orientation:landscape)_and_(max-height:768px)]:h-2 [@media(orientation:landscape)_and_(max-height:768px)]:w-2" />
                          Visit
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-5 sm:p-6 [@media(max-height:500px)]:p-3 [@media(orientation:landscape)_and_(max-height:768px)]:p-2.5 [@media(orientation:landscape)_and_(max-height:500px)]:p-2">
                  <div className="bg-muted border-[3px] border-ink rounded-2xl p-4 flex items-center justify-between gap-3 [@media(max-height:500px)]:p-3 [@media(max-height:500px)]:gap-2 [@media(orientation:landscape)_and_(max-height:768px)]:rounded-xl [@media(orientation:landscape)_and_(max-height:768px)]:border-2 [@media(orientation:landscape)_and_(max-height:768px)]:p-2.5 [@media(orientation:landscape)_and_(max-height:768px)]:gap-2 [@media(orientation:landscape)_and_(max-height:500px)]:p-2 [@media(orientation:landscape)_and_(max-height:500px)]:gap-1.5">
                    <div className="flex items-start gap-3 min-w-0 [@media(orientation:landscape)_and_(max-height:768px)]:gap-2">
                      <div className="bg-blue-400 border-[3px] border-ink p-2 rounded-xl shrink-0 shadow-brutal-sm [@media(orientation:landscape)_and_(max-height:768px)]:p-1.5 [@media(orientation:landscape)_and_(max-height:768px)]:rounded-lg [@media(orientation:landscape)_and_(max-height:768px)]:border-2 [@media(orientation:landscape)_and_(max-height:500px)]:p-1">
                        <MdPlace className="h-[18px] w-[18px] text-ink [@media(orientation:landscape)_and_(max-height:768px)]:h-3.5 [@media(orientation:landscape)_and_(max-height:768px)]:w-3.5 [@media(orientation:landscape)_and_(max-height:500px)]:h-3 [@media(orientation:landscape)_and_(max-height:500px)]:w-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] sm:text-xs font-black uppercase text-ink/50 tracking-wider [@media(orientation:landscape)_and_(max-height:768px)]:text-[9px] [@media(orientation:landscape)_and_(max-height:500px)]:text-[8px]">
                          Point of Interest
                        </p>
                        <p className="text-sm sm:text-base font-extrabold text-ink leading-tight mt-0.5 [@media(max-height:500px)]:text-xs [@media(orientation:landscape)_and_(max-height:768px)]:text-[10px] [@media(orientation:landscape)_and_(max-height:768px)]:mt-0 [@media(orientation:landscape)_and_(max-height:500px)]:text-[9px]">
                          Teleport instantly to this location.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onVisit(pin)}
                      className="
                        shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg
                        bg-gold border-[2px] border-ink
                        text-[10px] sm:text-[11px] font-black italic uppercase text-ink
                        hover:bg-gold
                        active:translate-y-0.5 active:shadow-none
                        transition-all
                        [@media(max-height:500px)]:px-2 [@media(max-height:500px)]:py-0.5 [@media(max-height:500px)]:text-[9px]
                        [@media(orientation:landscape)_and_(max-height:768px)]:gap-0.5 [@media(orientation:landscape)_and_(max-height:768px)]:px-1.5 [@media(orientation:landscape)_and_(max-height:768px)]:py-0.5 [@media(orientation:landscape)_and_(max-height:768px)]:rounded-md [@media(orientation:landscape)_and_(max-height:768px)]:text-[8px]
                        [@media(orientation:landscape)_and_(max-height:500px)]:px-1 [@media(orientation:landscape)_and_(max-height:500px)]:text-[7px]
                      "
                    >
                      <FaLocationCrosshairs className="h-2.5 w-2.5 [@media(orientation:landscape)_and_(max-height:768px)]:h-2 [@media(orientation:landscape)_and_(max-height:768px)]:w-2" />
                      Visit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
