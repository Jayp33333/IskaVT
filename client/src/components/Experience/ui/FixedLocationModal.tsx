import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, MapPin, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Vector3 } from "three";
import type { FixedLocationPin, FixedLocationRoom } from "../../../sampleData";

const landscapeShort =
  "[@media(orientation:landscape)_and_(max-height:768px)]";
const panelPadX =
  "px-4 sm:px-5 [@media(max-height:500px)]:px-3.5 [@media(orientation:landscape)_and_(max-height:768px)]:px-3";

type FixedLocationModalProps = {
  pin: FixedLocationPin | null;
  onClose: () => void;
  onVisit: (target: { id?: string; name: string; position: Vector3 }) => void;
};

function splitRoomName(name: string): { title: string; subtitle?: string } {
  const match = name.match(/^(.+?)\s*\((.+)\)$/);
  if (!match) return { title: name };
  return { title: match[1].trim(), subtitle: match[2].trim() };
}

function floorLabel(floor: string): string {
  const n = Number(floor);
  if (n === 1) return "1st Floor";
  if (n === 2) return "2nd Floor";
  if (n === 3) return "3rd Floor";
  if (Number.isFinite(n)) return `${n}th Floor`;
  return floor;
}

function roomBadgeLabel(title: string): string {
  const num = title.match(/Room\s+(\d+)/i);
  if (num) return num[1];
  const words = title.trim().split(/\s+/);
  if (words.length >= 2) return words.map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return title.slice(0, 2).toUpperCase();
}

function HeroImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-maroon ${className}`}>
      <img
        src={src}
        alt={alt}
        className="block h-full w-full scale-[1.02] object-cover"
        loading="lazy"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-maroon/95 via-maroon/45 to-white/55" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-transparent" />
    </div>
  );
}

export function FixedLocationModal({
  pin,
  onClose,
  onVisit,
}: FixedLocationModalProps) {
  const rooms: FixedLocationRoom[] = pin?.rooms ?? [];
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

  const visibleRooms =
    roomsByFloor && activeFloor ? roomsByFloor[activeFloor] ?? [] : rooms;

  const imageSrc = pin?.imageSrc ?? "/images/campus-image.jpg";
  const hasRooms = rooms.length > 0;

  return createPortal(
    <AnimatePresence>
      {pin && (
        <motion.div
          className={`pointer-events-auto fixed inset-0 z-[2210] flex items-center justify-center bg-ink/85 p-3 sm:p-4 [@media(max-height:500px)]:p-2 ${landscapeShort}:p-2`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`relative flex w-full max-w-[26rem] flex-col overflow-hidden rounded-2xl border-[4px] border-ink bg-cream text-ink shadow-brutal-lg ${landscapeShort}:max-w-[min(92vw,22rem)] ${landscapeShort}:rounded-xl ${
              hasRooms
                ? `h-[min(92dvh,34rem)] [@media(max-height:500px)]:h-[min(96dvh,30rem)] ${landscapeShort}:h-[min(96dvh,28rem)]`
                : "h-auto max-h-[min(92dvh,28rem)]"
            }`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 340 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="fixed-location-dialog-title"
          >
            {/* Hero */}
            <div
              className={`relative w-full shrink-0 border-b-[3px] border-ink ${
                hasRooms
                  ? `h-40 sm:h-44 [@media(max-height:500px)]:h-36 ${landscapeShort}:h-32`
                  : `aspect-[16/10] sm:aspect-[16/9] [@media(max-height:500px)]:aspect-[3/2] ${landscapeShort}:aspect-[2/1]`
              }`}
            >
              <HeroImage
                src={imageSrc}
                alt={pin.name}
                className="h-full w-full"
              />

              <button
                onClick={onClose}
                aria-label="Close"
                type="button"
                className="absolute right-3 top-3 rounded-xl border-2 border-ink bg-white/95 p-1.5 text-ink shadow-brutal-sm backdrop-blur-sm transition-all hover:bg-cream active:scale-95 [@media(max-height:500px)]:right-2.5 [@media(max-height:500px)]:top-2.5 [@media(max-height:500px)]:p-1"
              >
                <X className="h-4 w-4" strokeWidth={3} />
              </button>

              <div
                className={`absolute bottom-0 left-0 right-0 ${panelPadX} pb-3 pt-8 [@media(max-height:500px)]:pb-2.5 ${landscapeShort}:pb-2`}
              >
                <div className="flex items-end gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-white p-1 shadow-brutal-sm [@media(max-height:500px)]:h-8 [@media(max-height:500px)]:w-8 ${landscapeShort}:h-7 ${landscapeShort}:w-7">
                    <img
                      src="/images/pup-logo.png"
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <h2
                    id="fixed-location-dialog-title"
                    className={`min-w-0 flex-1 font-black italic leading-tight text-white drop-shadow-sm ${hasRooms ? "text-base sm:text-lg [@media(max-height:500px)]:text-sm" : "text-lg sm:text-xl [@media(max-height:500px)]:text-base"} ${landscapeShort}:text-sm`}
                  >
                    {pin.name}
                  </h2>
                </div>
              </div>
            </div>

            {hasRooms ? (
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {roomsByFloor && floorKeys.length > 1 && (
                  <div
                    className={`shrink-0 border-b-2 border-ink/10 bg-muted/60 py-2.5 ${panelPadX} [@media(max-height:500px)]:py-2 ${landscapeShort}:py-1.5`}
                  >
                    <div className="flex rounded-xl border-2 border-ink bg-white p-0.5 shadow-brutal-sm">
                      {floorKeys.map((floor) => {
                        const active = activeFloor === floor;
                        return (
                          <button
                            key={floor}
                            type="button"
                            onClick={() => setActiveFloor(floor)}
                            className={`min-w-0 flex-1 rounded-lg px-2 py-1.5 text-center text-[10px] font-black uppercase tracking-wide transition-all sm:text-[11px] [@media(max-height:500px)]:py-1 [@media(max-height:500px)]:text-[9px] ${landscapeShort}:text-[8px] ${
                              active
                                ? "bg-maroon text-white shadow-sm"
                                : "text-ink/60 hover:bg-cream hover:text-ink"
                            }`}
                          >
                            {floorLabel(floor)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <ul
                  className={`flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto custom-scrollbar py-3 ${panelPadX} pb-[max(0.75rem,env(safe-area-inset-bottom))] [@media(max-height:500px)]:gap-1.5 [@media(max-height:500px)]:py-2.5 ${landscapeShort}:gap-1 ${landscapeShort}:py-2`}
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    {visibleRooms.map((room, index) => {
                      const { title, subtitle } = splitRoomName(room.name);
                      return (
                        <motion.li
                          key={room.id}
                          layout
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15, delay: index * 0.02 }}
                        >
                          <button
                            type="button"
                            onClick={() => onVisit(room)}
                            className="group flex w-full items-center gap-3 rounded-xl border-2 border-ink/15 bg-white px-2.5 py-2.5 text-left transition-all hover:border-ink/40 hover:bg-cream active:scale-[0.99] [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:px-2 [@media(max-height:500px)]:py-2 ${landscapeShort}:gap-2 ${landscapeShort}:py-1.5"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-gold text-[11px] font-black text-maroon shadow-brutal-sm transition-transform group-hover:scale-105 [@media(max-height:500px)]:h-8 [@media(max-height:500px)]:w-8 [@media(max-height:500px)]:text-[10px] ${landscapeShort}:h-7 ${landscapeShort}:w-7 ${landscapeShort}:text-[9px]">
                              {roomBadgeLabel(title)}
                            </span>
                            <span className="min-w-0 flex-1 leading-snug">
                              <span
                                className={`block truncate font-black text-ink ${subtitle ? "text-xs sm:text-sm [@media(max-height:500px)]:text-[11px]" : "text-sm sm:text-base [@media(max-height:500px)]:text-xs"} ${landscapeShort}:text-[10px]`}
                              >
                                {title}
                              </span>
                              {subtitle && (
                                <span
                                  className={`mt-0.5 block truncate text-[10px] font-bold text-ink/50 sm:text-xs [@media(max-height:500px)]:text-[9px] ${landscapeShort}:text-[8px]`}
                                >
                                  {subtitle}
                                </span>
                              )}
                            </span>
                            <ChevronRight
                              className="h-4 w-4 shrink-0 text-maroon/40 transition-transform group-hover:translate-x-0.5 group-hover:text-maroon [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5"
                              strokeWidth={3}
                            />
                          </button>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              </div>
            ) : (
              <div
                className={`shrink-0 bg-muted ${panelPadX} py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] [@media(max-height:500px)]:py-2.5 ${landscapeShort}:py-2`}
              >
                <button
                  type="button"
                  onClick={() => onVisit(pin)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-[3px] border-ink bg-maroon py-2.5 text-sm font-black uppercase italic tracking-wide text-white shadow-brutal-md transition-all hover:bg-maroon/90 active:translate-y-1 active:shadow-none [@media(max-height:500px)]:py-2 [@media(max-height:500px)]:text-xs ${landscapeShort}:py-2 ${landscapeShort}:text-[11px]"
                >
                  <MapPin className="h-4 w-4" strokeWidth={2.5} />
                  Visit Location
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
