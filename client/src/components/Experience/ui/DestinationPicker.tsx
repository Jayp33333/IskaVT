import { useState, useMemo, useEffect } from "react";
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
    setQuery("");
  };

  if (showMiniMap) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`w-10 h-10 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:h-9 rounded-2xl [@media(max-height:500px)]:rounded-xl border-[3px] border-slate-900 transition-all flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] [@media(max-height:500px)]:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none ${
          selectedDestination
            ? "bg-[#D43F3F] text-white"
            : "bg-yellow-300 text-[#660B05] hover:bg-yellow-200"
        } ${showLogHistory ? "blur-sm opacity-50 pointer-events-none" : ""}`}
        title={selectedDestination ? `Destination: ${selectedDestination}` : "Select destination"}
        aria-label="Select destination"
        aria-expanded={open}
        type="button"
      >
        <MapPin className="w-4 h-4 [@media(max-height:500px)]:w-3.5 [@media(max-height:500px)]:h-3.5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[1400] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 [@media(max-height:500px)]:p-2 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="relative w-full max-w-[460px] [@media(max-height:500px)]:max-w-[92vw] [@media(orientation:landscape)_and_(max-height:500px)]:max-w-[min(92vw,560px)] bg-[#FFFDF9] text-slate-800 rounded-[2rem] sm:rounded-[2.5rem] [@media(max-height:500px)]:rounded-2xl border-[4px] sm:border-[6px] [@media(max-height:500px)]:border-[4px] border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] [@media(max-height:500px)]:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] flex flex-col max-h-[88vh] [@media(max-height:500px)]:max-h-[96dvh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 20, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#D43F3F] border-b-[4px] sm:border-b-[6px] [@media(max-height:500px)]:border-b-[4px] border-slate-900 px-5 py-4 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 [@media(max-height:500px)]:p-1.5 rounded-2xl bg-yellow-300 border-[3px] border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] shrink-0">
                      <Navigation className="w-5 h-5 [@media(max-height:500px)]:w-4 [@media(max-height:500px)]:h-4 text-slate-900" strokeWidth={3.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="inline-block rounded-full bg-yellow-300 border-[3px] border-slate-900 px-2 py-0.5 text-[9px] [@media(max-height:500px)]:hidden font-black uppercase tracking-wider text-slate-900">
                        Campus Navigation
                      </p>
                      <h2 className="mt-1 text-xl sm:text-2xl [@media(max-height:500px)]:text-base font-black italic text-white leading-tight truncate">
                        Choose Destination
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={close}
                    className="bg-white border-[3px] border-slate-900 p-1.5 [@media(max-height:500px)]:p-1 rounded-xl hover:bg-slate-100 transition-transform active:scale-90 shrink-0"
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
                <div className="mx-4 mt-4 [@media(max-height:500px)]:mx-3 [@media(max-height:500px)]:mt-2 flex items-center justify-between gap-3 p-3 [@media(max-height:500px)]:p-2 rounded-2xl bg-emerald-300 border-[3px] border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPinned className="w-4 h-4 [@media(max-height:500px)]:w-3.5 [@media(max-height:500px)]:h-3.5 text-slate-900 shrink-0" strokeWidth={3} />
                    <div className="min-w-0">
                      <p className="text-[10px] [@media(max-height:500px)]:text-[8px] font-black uppercase text-emerald-950 tracking-wide">
                        Pinned
                      </p>
                      <p className="text-sm [@media(max-height:500px)]:text-xs font-black text-slate-900 truncate">
                        {selectedDestination}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleUnpin}
                    className="shrink-0 px-3 py-1.5 [@media(max-height:500px)]:px-2 [@media(max-height:500px)]:py-1 text-xs [@media(max-height:500px)]:text-[10px] font-black uppercase rounded-xl bg-white border-[3px] border-slate-900 text-slate-800 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none transition-all"
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 [@media(max-height:500px)]:w-3.5 [@media(max-height:500px)]:h-3.5 text-[#D43F3F] pointer-events-none"
                    strokeWidth={3}
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search buildings, rooms, facilities..."
                    autoFocus
                    className="w-full pl-10 pr-10 py-2.5 [@media(max-height:500px)]:py-1.5 text-sm [@media(max-height:500px)]:text-xs font-bold text-slate-800 bg-white border-[3px] border-slate-900 rounded-2xl outline-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:bg-yellow-50 placeholder:text-slate-400"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-xl hover:bg-slate-100 text-slate-700"
                      title="Clear search"
                      type="button"
                    >
                      <X className="w-4 h-4" strokeWidth={3} />
                    </button>
                  )}
                </div>
                <p className="mt-3 [@media(max-height:500px)]:mt-2 text-xs [@media(max-height:500px)]:text-[10px] font-black uppercase tracking-wide text-slate-500 px-0.5">
                  {filteredDestinations.length} location
                  {filteredDestinations.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {/* List */}
              <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:pb-2 custom-scrollbar">
                {filteredDestinations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 [@media(max-height:500px)]:py-4 text-center">
                    <div className="p-4 [@media(max-height:500px)]:p-2 rounded-2xl bg-yellow-100 border-[3px] border-dashed border-slate-900 mb-3 [@media(max-height:500px)]:mb-2">
                      <MapPin className="w-7 h-7 [@media(max-height:500px)]:w-5 [@media(max-height:500px)]:h-5 text-[#D43F3F]" strokeWidth={3} />
                    </div>
                    <p className="text-sm [@media(max-height:500px)]:text-xs font-black text-slate-800">No locations found</p>
                    <p className="text-xs [@media(max-height:500px)]:text-[10px] font-bold text-slate-500 mt-1">Try a different search term</p>
                  </div>
                ) : (
                  <ul className="space-y-2 [@media(max-height:500px)]:space-y-1.5">
                    {filteredDestinations.map((d) => {
                      const isActive = selectedDestination === d.name;
                      return (
                        <li key={d.id}>
                          <button
                            onClick={() => handleSelect(d)}
                            className={`w-full flex items-center gap-3 [@media(max-height:500px)]:gap-2 p-3 [@media(max-height:500px)]:p-2 rounded-2xl border-[3px] border-slate-900 text-left transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none ${
                              isActive ? "bg-yellow-300" : "bg-white hover:bg-yellow-50"
                            }`}
                            type="button"
                          >
                            <span
                              className={`flex items-center justify-center w-9 h-9 [@media(max-height:500px)]:w-7 [@media(max-height:500px)]:h-7 rounded-xl border-[3px] border-slate-900 shrink-0 ${
                                isActive ? "bg-[#D43F3F] text-white" : "bg-pink-100 text-[#D43F3F]"
                              }`}
                            >
                              <MapPin className="w-4 h-4 [@media(max-height:500px)]:w-3.5 [@media(max-height:500px)]:h-3.5" strokeWidth={3.5} />
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm [@media(max-height:500px)]:text-xs font-black text-slate-900 leading-snug">
                                {d.name}
                              </span>
                              {isActive && (
                                <span className="text-[10px] [@media(max-height:500px)]:text-[8px] font-black uppercase text-[#D43F3F] tracking-wide">
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
      </AnimatePresence>
    </>
  );
};
