import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, X, Search, Navigation, MapPinned } from "lucide-react";
import useWorld from "../../../hooks/useWorld";
import { DESTINATIONS } from "../../../sampleData";

export const DestinationPicker = () => {
  const [open, setOpen] = useState(false);

  const showMiniMap = useWorld((s: any) => s.showMiniMap);
  const showLogHistory = useWorld((s: any) => s.showLogHistory);
  const query = useWorld((s: any) => s.query);
  const selectedDestination = useWorld((s: any) => s.selectedDestination);
  const characterPosition = useWorld((s: any) => s.characterPosition);
  const setPinPosition = useWorld((s: any) => s.setPinPosition);
  const setIsPinConfirmed = useWorld((s: any) => s.setIsPinConfirmed);
  const setIsPinTeleported = useWorld((s: any) => s.setIsPinTeleported);
  const setDistance = useWorld((s: any) => s.setDistance);
  const setSelectedDestination = useWorld((s: any) => s.setSelectedDestination);
  const setQuery = useWorld((s: any) => s.setQuery);

  const filteredDestinations = useMemo(
    () => DESTINATIONS.filter((d) => d.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  useEffect(() => {
    return () => {
      useWorld.getState().setShowDestinationPicker(false);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleSelect = (destination: (typeof DESTINATIONS)[number]) => {
    const destinationPosition = destination.position.clone();
    const dx = destinationPosition.x - characterPosition.x;
    const dy = destinationPosition.y - characterPosition.y;
    const dz = destinationPosition.z - characterPosition.z;

    setPinPosition(destinationPosition);
    setIsPinConfirmed(true);
    setIsPinTeleported(false);
    setDistance(Math.hypot(dx, dy, dz));
    setSelectedDestination(destination.name);
    setOpen(false);
    useWorld.getState().setShowDestinationPicker(false);
    setQuery("");
  };

  const handleUnpin = () => {
    setPinPosition(null);
    setIsPinConfirmed(false);
    setSelectedDestination(null);
    setIsPinTeleported(false);
    setQuery("");
  };

  const close = () => {
    setOpen(false);
    useWorld.getState().setShowDestinationPicker(false);
    setQuery("");
  };

  if (showMiniMap) return null;

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          useWorld.getState().setShowDestinationPicker(true);
        }}
        className={`w-10 h-10 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:h-9 rounded-2xl [@media(max-height:500px)]:rounded-xl border-[3px] border-ink transition-all flex items-center justify-center shadow-brutal-sm [@media(max-height:500px)]:shadow-brutal-sm active:translate-y-1 active:shadow-none ${
          selectedDestination
            ? "bg-maroon text-white"
            : "bg-gold text-maroon hover:bg-gold/90"
        } ${showLogHistory ? "blur-sm opacity-50 pointer-events-none" : ""}`}
        title={selectedDestination ? `Destination: ${selectedDestination}` : "Select destination"}
        aria-label="Select destination"
        aria-expanded={open}
        type="button"
      >
        <MapPin className="w-4 h-4 [@media(max-height:500px)]:w-3.5 [@media(max-height:500px)]:h-3.5" />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-[1600] flex items-end sm:items-center justify-center bg-ink/85 p-0 sm:p-4 [@media(max-height:500px)]:p-0 [@media(orientation:landscape)_and_(max-height:768px)]:p-2 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="relative w-full max-w-[460px] sm:max-w-[460px] max-sm:max-w-none max-sm:rounded-t-[1.75rem] max-sm:rounded-b-none bg-cream text-ink rounded-[2rem] sm:rounded-[2.5rem] [@media(max-height:500px)]:rounded-t-2xl [@media(max-height:500px)]:rounded-b-none border-[4px] sm:border-[6px] border-ink max-sm:border-b-0 flex flex-col max-h-[88vh] max-sm:max-h-[92dvh] [@media(max-height:500px)]:max-h-[96dvh] [@media(orientation:landscape)_and_(max-height:768px)]:max-w-[min(92vw,400px)] [@media(orientation:landscape)_and_(max-height:768px)]:max-h-[96dvh] [@media(orientation:landscape)_and_(max-height:768px)]:rounded-xl [@media(orientation:landscape)_and_(max-height:500px)]:max-w-[min(88vw,360px)] overflow-hidden"
              initial={{ scale: 0.98, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 24 }}
              transition={{ type: "spring", damping: 20, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-maroon border-b-[4px] sm:border-b-[6px] [@media(max-height:500px)]:border-b-[4px] border-ink px-5 py-4 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 [@media(max-height:500px)]:p-1.5 rounded-2xl bg-gold border-[3px] border-ink shadow-brutal-sm shrink-0">
                      <Navigation className="w-5 h-5 [@media(max-height:500px)]:w-4 [@media(max-height:500px)]:h-4 text-ink" strokeWidth={3.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="inline-block rounded-full bg-gold border-[3px] border-ink px-2 py-0.5 text-[9px] [@media(max-height:500px)]:hidden font-black uppercase tracking-wider text-ink">
                        Campus Navigation
                      </p>
                      <h2 className="mt-1 text-xl sm:text-2xl [@media(max-height:500px)]:text-base font-black italic text-white leading-tight truncate">
                        Choose Destination
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={close}
                    className="bg-white border-[3px] border-ink p-1.5 [@media(max-height:500px)]:p-1 rounded-xl hover:bg-muted transition-transform active:scale-90 shrink-0"
                    aria-label="Close"
                    type="button"
                  >
                    <X size={18} strokeWidth={4} />
                  </button>
                </div>
                <p className="mt-2 [@media(max-height:500px)]:mt-1 text-xs [@media(max-height:500px)]:text-[10px] font-bold text-white/90">
                  Pick a location to pin on the map and follow the distance guide.
                </p>
              </div>

              {/* Active pin */}
              {selectedDestination && (
                <div className="mx-4 mt-4 [@media(max-height:500px)]:mx-3 [@media(max-height:500px)]:mt-2 flex items-center justify-between gap-3 p-3 [@media(max-height:500px)]:p-2 rounded-2xl bg-emerald-300 border-[3px] border-ink shadow-brutal-sm shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPinned className="w-4 h-4 [@media(max-height:500px)]:w-3.5 [@media(max-height:500px)]:h-3.5 text-ink shrink-0" strokeWidth={3} />
                    <div className="min-w-0">
                      <p className="text-[10px] [@media(max-height:500px)]:text-[8px] font-black uppercase text-emerald-950 tracking-wide">
                        Pinned
                      </p>
                      <p className="text-sm [@media(max-height:500px)]:text-xs font-black text-ink truncate">
                        {selectedDestination}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleUnpin}
                    className="shrink-0 px-3 py-1.5 [@media(max-height:500px)]:px-2 [@media(max-height:500px)]:py-1 text-xs [@media(max-height:500px)]:text-[10px] font-black uppercase rounded-xl bg-white border-[3px] border-ink text-ink shadow-brutal-sm active:translate-y-1 active:shadow-none transition-all"
                    type="button"
                  >
                    Unpin
                  </button>
                </div>
              )}

              {/* Search */}
              <div className="px-4 pt-4 pb-2 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:pt-2 [@media(max-height:500px)]:pb-1 shrink-0">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 [@media(max-height:500px)]:w-3.5 [@media(max-height:500px)]:h-3.5 text-maroon pointer-events-none"
                    strokeWidth={3}
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search buildings, rooms, facilities..."
                    className="w-full pl-10 pr-10 py-2.5 [@media(max-height:500px)]:py-1.5 text-sm [@media(max-height:500px)]:text-xs font-bold text-ink bg-white border-[3px] border-ink rounded-2xl outline-none focus:bg-cream placeholder:text-ink/40"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-xl hover:bg-muted text-ink/80"
                      title="Clear search"
                      type="button"
                    >
                      <X className="w-4 h-4" strokeWidth={3} />
                    </button>
                  )}
                </div>
                <p className="mt-3 [@media(max-height:500px)]:mt-2 text-xs [@media(max-height:500px)]:text-[10px] font-black uppercase tracking-wide text-ink/50 px-0.5">
                  {filteredDestinations.length} location
                  {filteredDestinations.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {/* List */}
              <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 pb-4 pb-[max(1rem,env(safe-area-inset-bottom))] [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:pb-2 [@media(orientation:landscape)_and_(max-height:768px)]:px-2.5 custom-scrollbar">
                {filteredDestinations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 [@media(max-height:500px)]:py-4 text-center">
                    <MapPin
                      className="w-10 h-10 [@media(max-height:500px)]:w-8 [@media(max-height:500px)]:h-8 text-maroon/40 mb-3 [@media(max-height:500px)]:mb-2"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <p className="text-sm [@media(max-height:500px)]:text-xs font-black text-ink">No locations found</p>
                    <p className="text-xs [@media(max-height:500px)]:text-[10px] font-bold text-ink/50 mt-1">Try a different search term</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-ink/15">
                    {filteredDestinations.map((d) => {
                      const isActive = selectedDestination === d.name;
                      return (
                        <li key={d.id}>
                          <button
                            onClick={() => handleSelect(d)}
                            className={`w-full flex items-center gap-3 sm:gap-3.5 px-2 sm:px-2.5 py-3 sm:py-3.5 [@media(max-height:500px)]:gap-2.5 [@media(max-height:500px)]:py-2.5 [@media(orientation:landscape)_and_(max-height:768px)]:py-2 rounded-lg text-left transition-colors ${
                              isActive ? "bg-gold/40" : "hover:bg-muted active:bg-muted"
                            }`}
                            type="button"
                          >
                            <MapPin
                              className={`w-5 h-5 sm:w-[1.35rem] sm:h-[1.35rem] shrink-0 [@media(max-height:500px)]:w-4 [@media(max-height:500px)]:h-4 ${
                                isActive ? "text-maroon" : "text-maroon/70"
                              }`}
                              strokeWidth={2.25}
                              fill={isActive ? "currentColor" : "none"}
                              aria-hidden
                            />
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm sm:text-[0.9375rem] [@media(max-height:500px)]:text-xs font-bold text-ink leading-snug break-words">
                                {d.name}
                              </span>
                              {isActive && (
                                <span className="mt-0.5 block text-[10px] sm:text-[11px] [@media(max-height:500px)]:text-[8px] font-bold uppercase text-maroon tracking-wide">
                                  Currently pinned
                                </span>
                              )}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
