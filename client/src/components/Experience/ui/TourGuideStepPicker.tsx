import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronRight, PlayCircle, X } from "lucide-react";
import { getTourCoachMenuItems } from "../../../data/tourCoachSteps";
import { useIsMobileDevice } from "../../../hooks/useIsMobileDevice";
import useWorld from "../../../hooks/useWorld";

export function TourGuideStepPicker() {
  const isMobile = useIsMobileDevice();
  const tourCoachPickerOpen = useWorld((s) => s.tourCoachPickerOpen);
  const closeTourCoach = useWorld((s) => s.closeTourCoach);
  const openTourCoachFull = useWorld((s) => s.openTourCoachFull);
  const openTourCoachStep = useWorld((s) => s.openTourCoachStep);

  const items = getTourCoachMenuItems(isMobile);

  useEffect(() => {
    if (!tourCoachPickerOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeTourCoach();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [tourCoachPickerOpen, closeTourCoach]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {tourCoachPickerOpen && (
        <motion.div
          className="fixed inset-0 z-[2250] flex items-center justify-center bg-ink/80 p-3 sm:p-4 [@media(max-height:500px)]:p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-picker-title"
        >
          <motion.div
            className="flex max-h-[min(88dvh,32rem)] w-full max-w-sm flex-col overflow-hidden rounded-2xl border-[3px] border-ink bg-cream shadow-brutal-md [@media(max-height:500px)]:max-h-[92dvh] [@media(max-height:500px)]:rounded-xl [@media(max-height:500px)]:border-2"
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8 }}
            transition={{ type: "spring", damping: 24, stiffness: 320 }}
          >
            <div className="flex shrink-0 items-center justify-between gap-2 border-b-[3px] border-ink bg-maroon px-3 py-2.5 [@media(max-height:500px)]:px-2.5 [@media(max-height:500px)]:py-2">
              <div className="flex min-w-0 items-center gap-2">
                <BookOpen
                  className="h-4 w-4 shrink-0 text-gold"
                  strokeWidth={2.5}
                  aria-hidden
                />
                <h2
                  id="guide-picker-title"
                  className="truncate text-sm font-black italic text-white [@media(max-height:500px)]:text-xs"
                >
                  Campus Guide
                </h2>
              </div>
              <button
                type="button"
                onClick={closeTourCoach}
                className="shrink-0 rounded-lg border-2 border-ink bg-white p-1 text-ink transition-transform active:scale-90"
                aria-label="Close guide menu"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2.5 custom-scrollbar [@media(max-height:500px)]:p-2">
              <button
                type="button"
                onClick={openTourCoachFull}
                className="mb-2 flex w-full items-center gap-2.5 rounded-xl border-[3px] border-ink bg-gold px-3 py-2.5 text-left transition-transform active:scale-[0.99] [@media(max-height:500px)]:mb-1.5 [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:px-2.5 [@media(max-height:500px)]:py-2"
              >
                <PlayCircle
                  className="h-5 w-5 shrink-0 text-maroon [@media(max-height:500px)]:h-4 [@media(max-height:500px)]:w-4"
                  strokeWidth={2.5}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-ink [@media(max-height:500px)]:text-[11px]">
                    Full tour
                  </p>
                  <p className="text-[10px] font-semibold text-ink/65 [@media(max-height:500px)]:text-[9px]">
                    Walk through every step from the beginning
                  </p>
                </div>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-ink/50"
                  strokeWidth={3}
                />
              </button>

              <p className="mb-1.5 px-1 text-[9px] font-black uppercase tracking-widest text-ink/45 [@media(max-height:500px)]:mb-1 [@media(max-height:500px)]:text-[8px]">
                Or pick a topic
              </p>

              <ul className="space-y-1.5 [@media(max-height:500px)]:space-y-1">
                {items.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => openTourCoachStep(item.stepIndex)}
                      className="flex w-full items-start gap-2.5 rounded-xl border-[3px] border-ink bg-white px-3 py-2.5 text-left transition-colors hover:bg-muted/80 active:scale-[0.99] [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:px-2.5 [@media(max-height:500px)]:py-2"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-maroon text-[9px] font-black text-white [@media(max-height:500px)]:h-4 [@media(max-height:500px)]:w-4 [@media(max-height:500px)]:text-[8px]">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-ink [@media(max-height:500px)]:text-[11px]">
                          {item.label}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-[10px] font-semibold leading-snug text-ink/60 [@media(max-height:500px)]:text-[9px]">
                          {item.hint}
                        </p>
                      </div>
                      <ChevronRight
                        className="mt-0.5 h-4 w-4 shrink-0 text-ink/35"
                        strokeWidth={3}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
