import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, MapPin, Search, X } from "lucide-react";
import useWorld from "../../../hooks/useWorld";
import { DESTINATIONS } from "../../../sampleData";
import { computeGuideDistance } from "../../../data/guidePaths";

const landscapeShort =
  "[@media(orientation:landscape)_and_(max-height:768px)]";
const panelPadX =
  "px-4 sm:px-5 [@media(max-height:500px)]:px-3.5 [@media(orientation:landscape)_and_(max-height:768px)]:px-3";

export const DestinationPicker = () => {
  const [open, setOpen] = useState(false);

  const showMiniMap = useWorld((s: any) => s.showMiniMap);
  const query = useWorld((s: any) => s.query);
  const selectedDestination = useWorld((s: any) => s.selectedDestination);
  const characterPosition = useWorld((s: any) => s.characterPosition);
  const setPinPosition = useWorld((s: any) => s.setPinPosition);
  const setIsPinConfirmed = useWorld((s: any) => s.setIsPinConfirmed);
  const setIsPinTeleported = useWorld((s: any) => s.setIsPinTeleported);
  const setDistance = useWorld((s: any) => s.setDistance);
  const setSelectedDestination = useWorld((s: any) => s.setSelectedDestination);
  const setSelectedDestinationId = useWorld((s: any) => s.setSelectedDestinationId);
  const setQuery = useWorld((s: any) => s.setQuery);

  const filteredDestinations = useMemo(
    () => DESTINATIONS.filter((d) => d.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  useEffect(() => {
    return () => {
      useWorld.getState().setShowDestinationPicker(false);
    };
  }, []);

  const close = () => {
    setOpen(false);
    useWorld.getState().setShowDestinationPicker(false);
    setQuery("");
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleSelect = (destination: (typeof DESTINATIONS)[number]) => {
    const destinationPosition = destination.position.clone();

    setPinPosition(destinationPosition);
    setIsPinConfirmed(true);
    setIsPinTeleported(false);
    setDistance(
      computeGuideDistance(characterPosition, destinationPosition, destination.id),
    );
    setSelectedDestination(destination.name);
    setSelectedDestinationId(destination.id);
    close();
  };

  const handleUnpin = () => {
    setPinPosition(null);
    setIsPinConfirmed(false);
    setSelectedDestination(null);
    setSelectedDestinationId(null);
    setIsPinTeleported(false);
  };

  if (showMiniMap) return null;

  return (
    <>
      <button
        data-tour="destinations"
        onClick={() => {
          setOpen(true);
          useWorld.getState().setShowDestinationPicker(true);
        }}
        className={`flex h-10 w-10 items-center justify-center rounded-2xl border-[3px] border-ink shadow-brutal-sm transition-all active:translate-y-1 active:shadow-none [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:rounded-xl ${
          selectedDestination
            ? "bg-maroon text-white"
            : "bg-gold text-maroon hover:bg-gold/90"
        }`}
        title={selectedDestination ?? "Destinations"}
        aria-label="Destinations"
        aria-expanded={open}
        type="button"
      >
        <MapPin className="h-4 w-4 [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5" />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className={`pointer-events-auto fixed inset-0 z-[2200] flex items-end justify-center bg-ink/85 p-0 sm:items-center sm:p-4 [@media(max-height:500px)]:p-0 ${landscapeShort}:p-2`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={`relative flex h-[min(92dvh,34rem)] w-full max-w-[26rem] flex-col overflow-hidden rounded-t-2xl border-[4px] border-ink bg-cream text-ink max-sm:max-w-none max-sm:rounded-b-none max-sm:border-b-0 sm:rounded-2xl sm:border-[4px] [@media(max-height:500px)]:h-[min(96dvh,30rem)] [@media(max-height:500px)]:rounded-t-2xl ${landscapeShort}:h-[min(96dvh,28rem)] ${landscapeShort}:max-w-[min(92vw,400px)] ${landscapeShort}:rounded-xl`}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 28, stiffness: 340 }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Destinations"
              >
                <div
                  className={`mx-auto mt-2.5 h-1 w-12 shrink-0 rounded-full border border-ink/20 bg-ink/15 sm:hidden ${landscapeShort}:hidden`}
                  aria-hidden
                />

                <div
                  className={`flex shrink-0 items-center justify-between gap-3 border-b-[3px] border-ink bg-maroon py-4 ${panelPadX} [@media(max-height:500px)]:py-3 ${landscapeShort}:py-2.5`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-white p-1 [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:p-0.5">
                      <img
                        src="/images/pup-logo.png"
                        alt="PUP Logo"
                        className="h-full w-full object-contain"
                      />
                    </span>
                    <h2 className="truncate text-lg font-black italic text-white sm:text-xl [@media(max-height:500px)]:text-base">
                      Choose Destination
                    </h2>
                  </div>
                  <button
                    onClick={close}
                    className="shrink-0 rounded-xl border-2 border-ink bg-white p-1.5 text-ink transition-colors hover:bg-cream active:scale-95 [@media(max-height:500px)]:p-1"
                    aria-label="Close"
                    type="button"
                  >
                    <X className="h-4 w-4" strokeWidth={3} />
                  </button>
                </div>

                <div
                  className={`shrink-0 space-y-3 pt-4 ${panelPadX} [@media(max-height:500px)]:space-y-2 [@media(max-height:500px)]:pt-3 ${landscapeShort}:space-y-2 ${landscapeShort}:pt-2.5`}
                >
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5"
                      strokeWidth={3}
                    />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search campus..."
                      className="w-full rounded-xl border-2 border-ink bg-white py-2.5 pl-10 pr-10 text-sm font-bold text-ink outline-none placeholder:text-ink/40 focus:bg-cream [@media(max-height:500px)]:py-2 [@media(max-height:500px)]:text-xs"
                    />
                    {query && (
                      <button
                        onClick={() => setQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink/70 hover:bg-muted"
                        aria-label="Clear search"
                        type="button"
                      >
                        <X className="h-4 w-4" strokeWidth={3} />
                      </button>
                    )}
                  </div>

                  {selectedDestination && (
                    <div className="flex items-center gap-2 rounded-xl border-2 border-ink bg-gold px-3 py-2 [@media(max-height:500px)]:px-2.5 [@media(max-height:500px)]:py-1.5">
                      <MapPin
                        className="h-4 w-4 shrink-0 text-maroon"
                        strokeWidth={2.5}
                        fill="currentColor"
                      />
                      <p className="min-w-0 flex-1 truncate text-sm font-black text-ink [@media(max-height:500px)]:text-xs">
                        {selectedDestination}
                      </p>
                      <button
                        onClick={handleUnpin}
                        className="shrink-0 rounded-lg border-2 border-ink bg-white px-2 py-1 text-[10px] font-black uppercase text-maroon transition-colors hover:bg-cream active:scale-95 [@media(max-height:500px)]:px-1.5 [@media(max-height:500px)]:text-[9px]"
                        type="button"
                      >
                        Unpin
                      </button>
                    </div>
                  )}
                </div>

                <div
                  className={`flex min-h-0 flex-1 flex-col overflow-y-auto custom-scrollbar pb-4 pt-3 ${panelPadX} pb-[max(1rem,env(safe-area-inset-bottom))] [@media(max-height:500px)]:pb-3 [@media(max-height:500px)]:pt-2 ${landscapeShort}:pb-2.5`}
                >
                  {filteredDestinations.length === 0 ? (
                    <div className="flex min-h-full flex-1 flex-col items-center justify-center py-12 text-center [@media(max-height:500px)]:py-8">
                      <MapPin
                        className="mb-3 h-10 w-10 text-maroon/35 [@media(max-height:500px)]:mb-2 [@media(max-height:500px)]:h-8 [@media(max-height:500px)]:w-8"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <p className="text-sm font-black text-ink [@media(max-height:500px)]:text-xs">
                        No locations found
                      </p>
                    </div>
                  ) : (
                    <ul className="flex min-h-full flex-1 flex-col gap-2 [@media(max-height:500px)]:gap-1.5">
                      {filteredDestinations.map((d) => {
                        const isActive = selectedDestination === d.name;
                        return (
                          <li key={d.id}>
                            <button
                              onClick={() => handleSelect(d)}
                              className={`flex w-full items-center gap-3 rounded-xl border-2 px-3 py-3 text-left transition-all active:scale-[0.99] [@media(max-height:500px)]:gap-2.5 [@media(max-height:500px)]:px-2.5 [@media(max-height:500px)]:py-2.5 ${landscapeShort}:py-2 ${
                                isActive
                                  ? "border-ink bg-maroon text-white shadow-brutal-sm"
                                  : "border-ink/20 bg-white hover:border-ink/40 hover:bg-cream"
                              }`}
                              type="button"
                            >
                              <span
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 [@media(max-height:500px)]:h-8 [@media(max-height:500px)]:w-8 ${
                                  isActive
                                    ? "border-white/30 bg-white/10"
                                    : "border-ink bg-gold"
                                }`}
                              >
                                {isActive ? (
                                  <Check
                                    className="h-4 w-4 text-white"
                                    strokeWidth={3}
                                  />
                                ) : (
                                  <MapPin
                                    className="h-4 w-4 text-maroon"
                                    strokeWidth={2.5}
                                  />
                                )}
                              </span>
                              <span className="min-w-0 flex-1 text-sm font-bold leading-snug [@media(max-height:500px)]:text-xs">
                                {d.name}
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
        document.body,
      )}
    </>
  );
};
