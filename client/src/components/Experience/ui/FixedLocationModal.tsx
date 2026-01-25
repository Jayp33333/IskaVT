import { IoClose } from "react-icons/io5";
import type { Vector3 } from "three";
import type { FixedLocationPin, FixedLocationRoom } from "../../../sampleData";

type FixedLocationModalProps = {
  pin: FixedLocationPin | null;
  onClose: () => void;
  onVisit: (target: { name: string; position: Vector3 }) => void;
};

export function FixedLocationModal({ pin, onClose, onVisit }: FixedLocationModalProps) {
  if (!pin) return null;

  const rooms: FixedLocationRoom[] = pin.kind === "building" ? pin.rooms ?? [] : [];
  const hasFloors = rooms.some((r) => typeof r.floor === "number");
  const roomsByFloor = hasFloors
    ? rooms.reduce<Record<string, FixedLocationRoom[]>>((acc, r) => {
        const key = typeof r.floor === "number" ? String(r.floor) : "Other";
        (acc[key] ??= []).push(r);
        return acc;
      }, {})
    : null;

  return (
    <div
      className="fixed inset-0 z-1100 bg-black/60 backdrop-blur-sm pointer-events-auto flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-black/80 border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="text-white font-semibold truncate">{pin.name}</div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Close"
            type="button"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="rounded-xl overflow-hidden border border-white/10 bg-black/50">
            <img
              src={pin.imageSrc ?? "/images/campus-image.jpg"}
              alt={pin.name}
              className="w-full h-44 object-cover"
              loading="lazy"
            />
          </div>

          {rooms.length > 0 ? (
            <>
              <div className="text-white/80 text-sm">Select a room to visit:</div>
              <div className="max-h-72 overflow-y-auto rounded-xl border border-white/10">
                {roomsByFloor ? (
                  <div className="divide-y divide-white/10">
                    {Object.entries(roomsByFloor)
                      .sort(([a], [b]) => Number(a) - Number(b))
                      .map(([floor, items]) => (
                        <div key={floor} className="divide-y divide-white/10">
                          <div className="px-3 py-2 text-white/90 text-sm font-semibold bg-white/5">
                            Floor {floor}
                          </div>
                          {items.map((room) => (
                            <button
                              key={room.id}
                              onClick={() => onVisit(room)}
                              className="w-full flex items-center justify-between px-3 py-3 text-left hover:bg-white/10 transition"
                              type="button"
                            >
                              <span className="text-white font-medium">{room.name}</span>
                              <span className="rounded-md px-3 py-1 text-black font-semibold bg-yellow-400 hover:bg-yellow-300 transition">
                                Visit
                              </span>
                            </button>
                          ))}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {rooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => onVisit(room)}
                        className="w-full flex items-center justify-between px-3 py-3 text-left hover:bg-white/10 transition"
                        type="button"
                      >
                        <span className="text-white font-medium">{room.name}</span>
                        <span className="rounded-md px-3 py-1 text-black font-semibold bg-yellow-400 hover:bg-yellow-300 transition">
                          Visit
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end">
                <button
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-white/90 bg-white/10 hover:bg-white/15 transition"
                  type="button"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-white/90 bg-white/10 hover:bg-white/15 transition"
                type="button"
              >
                Close
              </button>
              <button
                onClick={() => onVisit(pin)}
                className="rounded-lg px-4 py-2 text-black font-semibold bg-yellow-400 hover:bg-yellow-300 transition"
                type="button"
              >
                Visit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

