import { useState, useMemo } from "react";
import useWorld from "../../../hooks/useWorld";
import { DESTINATIONS } from "../../../sampleData";
import { IoChevronDown, IoLocationSharp, IoClose } from "react-icons/io5";

export const DestinationPicker = () => {
  const [open, setOpen] = useState(false);

  const query = useWorld((s: any) => s.query);
  const selectedDestination = useWorld((s: any) => s.selectedDestination);
  const setPinPosition = useWorld((s: any) => s.setPinPosition);
  const setIsPinConfirmed = useWorld((s: any) => s.setIsPinConfirmed);
  const setSelectPin = useWorld((s: any) => s.setSelectPin);
  const setIsPinTeleported = useWorld((s: any) => s.setIsPinTeleported);
  const setSelectedDestination = useWorld((s: any) => s.setSelectedDestination);
  const setQuery = useWorld((s: any) => s.setQuery);

  const filteredDestinations = useMemo(
    () =>
      DESTINATIONS.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const handleSelect = (destination: any) => {
    setPinPosition(destination.position.clone());
    setIsPinConfirmed(true);
    setSelectPin(false);
    setIsPinTeleported(false);
    setSelectedDestination(destination.name);
    setOpen(false);
    setQuery("");
  };

  const handleUnpin = () => {
    setPinPosition(null);
    setIsPinConfirmed(false);
    setSelectedDestination(null);
    setSelectPin(true);
    setIsPinTeleported(false);
    setQuery("");
  };

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <div
        className="hidden md:block fixed top-6 left-1/2 z-300 pointer-events-auto"
        style={{
          width: "clamp(250px, 30vw, 350px)",
          transform: "translateX(-50%)",
        }}
      >
        <div className="rounded-xl bg-black/50 backdrop-blur-xl border border-white/15 shadow-lg overflow-hidden">
          <button
            onClick={() => !selectedDestination && setOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-white/10 transition"
            style={{ fontSize: "clamp(8px, 1.5vw, 12px)" }}
          >
            <div className="flex items-center gap-2 truncate">
              <IoLocationSharp
                className="text-red-400"
                style={{ fontSize: "clamp(10px, 1.5vw, 12px)" }}
              />
              <span className="truncate">
                {selectedDestination ?? "Select Destination"}
              </span>
            </div>

            {selectedDestination ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnpin();
                }}
                className="p-1 rounded hover:bg-white/10 transition cursor-pointer"
                title="Unpin destination"
              >
                <IoClose
                  className="text-white"
                  style={{ fontSize: "clamp(10px, 1.2vw, 14px)" }}
                />
              </span>
            ) : (
              <IoChevronDown
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {open && !selectedDestination && (
            <div className="border-t border-white/10">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search location..."
                className="w-full bg-black/60 text-white outline-none"
                style={{
                  fontSize: "clamp(10px, 1.5vw, 12px)",
                  padding: "clamp(6px, 1vw, 10px)",
                }}
              />

              <div
                style={{
                  maxHeight: "clamp(180px, 35vh, 220px)",
                  overflowY: "auto",
                }}
              >
                {filteredDestinations.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleSelect(d)}
                    className="w-full text-left flex items-center gap-2 hover:bg-white/10 text-white"
                    style={{
                      padding: "clamp(6px, 1vw, 10px)",
                      fontSize: "clamp(10px, 1.5vw, 12px)",
                    }}
                  >
                    <IoLocationSharp
                      className="text-red-400"
                      style={{ fontSize: "clamp(10px, 1.5vw, 12px)" }}
                    />
                    {d.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div
        className="md:hidden fixed top-6 left-1/2 z-300 pointer-events-auto"
        style={{ transform: "translateX(-50%)" }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => !selectedDestination && setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl bg-black/50 backdrop-blur-lg shadow-lg text-white"
            style={{
              padding: "clamp(8px, 1.5vw, 10px)",
              fontSize: "clamp(8px, 1.5vw, 12px)",
            }}
          >
            <IoLocationSharp
              className="text-red-400"
              style={{ fontSize: "clamp(8px, 1.5vw, 10px)" }}
            />
            {selectedDestination ?? "Select Destination"}

            {selectedDestination ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnpin();
                }}
                className="p-1 rounded hover:bg-white/10 transition cursor-pointer"
                title="Unpin destination"
              >
                <IoClose
                  className="text-white"
                  style={{ fontSize: "clamp(10px, 1.2vw, 14px)" }}
                />
              </span>
            ) : (
              <IoChevronDown
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      {open && (
        <div className="md:hidden fixed inset-0 z-400 bg-black/50 backdrop-blur-sm pointer-events-auto">
          <div
            className="absolute bottom-0 w-full rounded-t-2xl bg-black/80 backdrop-blur-xl overflow-hidden"
            style={{ maxHeight: "85vh" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span
                style={{ fontSize: "clamp(14px, 3vw, 18px)" }}
                className="text-white font-medium"
              >
                Select Destination
              </span>
              <button onClick={() => setOpen(false)}>
                <IoClose
                  className="text-white"
                  style={{ fontSize: "clamp(20px, 4vw, 24px)" }}
                />
              </button>
            </div>

            <div className="p-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search location..."
                className="w-full rounded-lg bg-black/60 text-white outline-none"
                style={{
                  padding: "clamp(8px, 2vw, 12px)",
                  fontSize: "clamp(14px, 2.5vw, 18px)",
                }}
              />
            </div>

            <div
              style={{
                maxHeight: "clamp(200px, 60vh, 400px)",
                overflowY: "auto",
              }}
            >
              {filteredDestinations.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSelect(d)}
                  className="w-full text-left flex items-center gap-3 border-t border-white/10 text-white"
                  style={{
                    padding: "clamp(8px, 2vw, 12px)",
                    fontSize: "clamp(14px, 2.5vw, 18px)",
                  }}
                >
                  <IoLocationSharp
                    className="text-red-400"
                    style={{ fontSize: "clamp(16px, 3vw, 20px)" }}
                  />
                  {d.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
