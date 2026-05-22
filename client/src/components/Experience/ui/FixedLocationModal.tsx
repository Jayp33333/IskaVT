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
  onVisit: (target: { name: string; position: Vector3 }) => void;
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
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="
              relative w-full max-w-[460px]
              bg-[#FFFDF9] text-slate-800
              rounded-[2rem] sm:rounded-[2.5rem]
              border-[4px] sm:border-[6px] border-slate-900
              shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]
              flex flex-col max-h-[90vh] overflow-hidden
            "
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header image with gradient overlay and title */}
            <div className="relative border-b-[4px] sm:border-b-[6px] border-slate-900">
              <img
                src={pin.imageSrc ?? "/images/campus-image.jpg"}
                alt={pin.name}
                className="w-full h-44 sm:h-52 object-cover block"
                loading="lazy"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent pointer-events-none" />

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close"
                type="button"
                className="absolute top-3 right-3 bg-white border-[3px] border-slate-900 p-1.5 rounded-xl hover:bg-slate-100 transition-transform active:scale-90 shadow-[3px_3px_0_0_rgba(15,23,42,1)]"
              >
                <IoClose size={18} strokeWidth={2} />
              </button>

              {/* Kind badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-yellow-400 border-[3px] border-slate-900 px-2 py-0.5 rounded-full shadow-[3px_3px_0_0_rgba(15,23,42,1)]">
                {isBuilding ? (
                  <HiBuildingOffice2 size={12} className="text-slate-900" />
                ) : (
                  <MdPlace size={12} className="text-slate-900" />
                )}
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-900">
                  {isBuilding ? "Building" : "Location"}
                </p>
              </div>

              {/* Title block */}
              <div className="absolute bottom-3 left-4 right-4">
                <h2 className="text-xl sm:text-2xl font-black italic text-white leading-tight uppercase drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
                  {pin.name}
                </h2>
                {isBuilding && rooms.length > 0 && (
                  <p className="text-[10px] sm:text-xs font-bold text-white/90 mt-0.5">
                    {rooms.length} room{rooms.length === 1 ? "" : "s"}
                    {floorKeys.length > 1
                      ? ` · ${floorKeys.length} floors`
                      : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {rooms.length > 0 ? (
                <div className="p-4 sm:p-5 space-y-4">
                  {/* Floor tabs (only when there are multiple floors) */}
                  {roomsByFloor && floorKeys.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-1">
                      {floorKeys.map((floor) => {
                        const active = activeFloor === floor;
                        return (
                          <button
                            key={floor}
                            type="button"
                            onClick={() => setActiveFloor(floor)}
                            className={`shrink-0 px-3 py-1.5 rounded-xl border-[3px] border-slate-900 text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all active:translate-y-0.5 ${
                              active
                                ? "bg-[#D43F3F] text-white shadow-[3px_3px_0_0_rgba(15,23,42,1)] active:shadow-none"
                                : "bg-white text-slate-700 hover:bg-slate-100 shadow-[2px_2px_0_0_rgba(15,23,42,1)] active:shadow-none"
                            }`}
                          >
                            Floor {floor}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Room list */}
                  <div className="space-y-2">
                    {(roomsByFloor && activeFloor
                      ? roomsByFloor[activeFloor] ?? []
                      : rooms
                    ).map((room) => (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => onVisit(room)}
                        className="
                          group w-full flex items-center justify-between gap-3
                          px-3 py-2.5 rounded-xl
                          bg-white border-[3px] border-slate-900
                          shadow-[3px_3px_0_0_rgba(15,23,42,1)]
                          hover:bg-slate-50
                          active:translate-y-0.5 active:shadow-none
                          transition-all
                        "
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="bg-blue-400 border-[2px] border-slate-900 p-1.5 rounded-lg shrink-0 shadow-[2px_2px_0_0_rgba(15,23,42,1)]">
                            <MdPlace size={14} className="text-slate-900" />
                          </div>
                          <span className="text-xs sm:text-sm font-extrabold text-slate-800 truncate">
                            {room.name}
                          </span>
                        </div>
                        <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-400 border-[2px] border-slate-900 text-[10px] sm:text-[11px] font-black italic uppercase text-slate-900 group-hover:bg-yellow-300 transition">
                          <FaLocationCrosshairs size={10} />
                          Visit
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-5 sm:p-6">
                  <div className="bg-slate-100 border-[3px] border-slate-900 rounded-2xl p-4 flex items-start gap-3">
                    <div className="bg-blue-400 border-[3px] border-slate-900 p-2 rounded-xl shrink-0 shadow-[3px_3px_0_0_rgba(15,23,42,1)]">
                      <MdPlace size={18} className="text-slate-900" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] sm:text-xs font-black uppercase text-slate-500 tracking-wider">
                        Point of Interest
                      </p>
                      <p className="text-sm sm:text-base font-extrabold text-slate-800 leading-tight mt-0.5">
                        Tap "Visit" to teleport instantly to this location.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 bg-white border-t-[4px] sm:border-t-[6px] border-slate-900 flex items-center gap-3">
              <button
                onClick={onClose}
                type="button"
                className="
                  flex-1 sm:flex-none py-2.5 px-4
                  bg-white text-slate-900
                  border-[3px] border-slate-900 rounded-xl
                  text-xs sm:text-sm font-black italic uppercase tracking-wide
                  shadow-[3px_3px_0_0_rgba(15,23,42,1)]
                  hover:bg-slate-100
                  active:translate-y-0.5 active:shadow-none
                  transition-all
                "
              >
                Close
              </button>

              {!isBuilding && (
                <button
                  onClick={() => onVisit(pin)}
                  type="button"
                  className="
                    flex-1 py-2.5 px-4
                    bg-[#D43F3F] text-white
                    border-[3px] border-slate-900 rounded-xl
                    text-xs sm:text-sm font-black italic uppercase tracking-wide
                    shadow-[3px_3px_0_0_rgba(15,23,42,1)]
                    hover:bg-[#B83434]
                    active:translate-y-0.5 active:shadow-none
                    transition-all
                    flex items-center justify-center gap-2
                  "
                >
                  <FaLocationCrosshairs size={14} />
                  Teleport
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
