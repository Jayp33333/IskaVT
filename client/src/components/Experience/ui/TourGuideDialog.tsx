import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TourGuideDialogProps {
  open: boolean;
  onClose: () => void;
  portraitSrc?: string;
}

export const TourGuideDialog = ({
  open,
  onClose,
  portraitSrc,
}: TourGuideDialogProps) => {
  const [page, setPage] = useState(0);

  // Whenever the dialog is reopened, start from the first page
  useEffect(() => {
    if (open) {
      setPage(0);
    }
  }, [open]);

  const maxPage = 1;
  const isLastPage = page === maxPage;
  const isFirstPage = page === 0;

  const handleNext = () => {
    if (isLastPage) {
      onClose();
      return;
    }
    setPage((prev) => Math.min(prev + 1, maxPage));
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const primaryLabel = isLastPage ? "Start Tour" : "Next";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="
              w-[90%] max-w-xl rounded-md bg-[#1c1c1c] text-white shadow-2xl
              border border-white/15 overflow-hidden
            "
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header bar */}
            <div className="bg-gradient-to-r from-[#6b1111] to-[#b52222] px-4 py-2">
              <p className="text-xs font-semibold tracking-[0.2em] text-gray-200">
                TOUR GUIDE
              </p>
              <h2 className="text-lg font-semibold">
                Virtual Tour Guide Tips
              </h2>
            </div>

            {/* Content */}
            <div className="px-4 py-4 space-y-4 text-sm leading-relaxed">
              {page === 0 && (
                <>
                  <p className="text-gray-100">
                    This short guide will help you get started with the{" "}
                    <span className="font-semibold">
                      PUP Lopez Campus Virtual Tour
                    </span>
                    . Read through the basic controls below, then press{" "}
                    <span className="font-semibold">Next</span> to see more tips.
                  </p>

                  {/* Basic controls / instructions */}
                  <div className="rounded-sm border border-white/15 bg-black/30 px-3 py-3 space-y-2 text-xs text-gray-200">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold tracking-[0.18em] uppercase text-[10px] text-gray-100">
                          Movement
                        </p>
                        <p className="text-gray-300">
                          Use <span className="font-semibold">W A S D</span> or the{" "}
                          <span className="font-semibold">arrow keys</span> to walk
                          around the campus.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold tracking-[0.18em] uppercase text-[10px] text-gray-100">
                          Looking Around
                        </p>
                        <p className="text-gray-300">
                          Move your <span className="font-semibold">mouse</span> or{" "}
                          <span className="font-semibold">trackpad</span> to look
                          around. You can adjust sensitivity in{" "}
                          <span className="font-semibold">Settings</span>.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold tracking-[0.18em] uppercase text-[10px] text-gray-100">
                          Jump & Sprint
                        </p>
                        <p className="text-gray-300">
                          Press <span className="font-semibold">Space</span> to jump and{" "}
                          <span className="font-semibold">Shift</span> to move faster
                          where available.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold tracking-[0.18em] uppercase text-[10px] text-gray-100">
                          Mobile Controls
                        </p>
                        <p className="text-gray-300">
                          On mobile, use the on-screen{" "}
                          <span className="font-semibold">joystick</span> to move.
                          Drag on the right side (or swipe) to{" "}
                          <span className="font-semibold">look around</span>. Tap
                          on-screen buttons to jump/sprint and interact when they
                          appear.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {page === 1 && (
                <>
                  <p className="text-gray-100">
                    Here are a few more tips so you can make the most of your{" "}
                    <span className="font-semibold">
                      PUP Lopez Campus Virtual Tour
                    </span>
                    .
                  </p>

                  <div className="rounded-sm border border-white/15 bg-black/30 px-3 py-3 space-y-2 text-xs text-gray-200">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold tracking-[0.18em] uppercase text-[10px] text-gray-100">
                          Mini Map & Destinations
                        </p>
                        <p className="text-gray-300">
                          Click the <span className="font-semibold">mini map</span>{" "}
                          on the top-right to expand it, pick a building, and
                          follow the guide to your destination.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold tracking-[0.18em] uppercase text-[10px] text-gray-100">
                          Talk To NPCs
                        </p>
                        <p className="text-gray-300">
                          When you see friendly characters around campus, press{" "}
                          <span className="font-semibold">F</span> to talk and get
                          information about nearby locations.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold tracking-[0.18em] uppercase text-[10px] text-gray-100">
                          Settings & Help
                        </p>
                        <p className="text-gray-300">
                          Open <span className="font-semibold">Settings</span> from
                          the top-left to adjust camera mode, sensitivity, and
                          full-screen, or to exit the tour.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Optional portrait / guide avatar */}
              {portraitSrc && (
                <div className="mt-3 flex items-center gap-3 text-xs text-gray-300">
                  <img
                    src={portraitSrc}
                    alt="Virtual tour guide"
                    className="h-10 w-10 rounded-full border border-white/25 object-cover"
                  />
                  <p>
                    Hi! I will guide you around the virtual campus. Use the{" "}
                    <span className="font-semibold">arrow buttons</span> below to
                    browse tips and then{" "}
                    <span className="font-semibold">Start Tour</span> when you&apos;re
                    ready.
                  </p>
                </div>
              )}
            </div>

            {/* Footer with controls */}
            <div className="flex items-center justify-between border-t border-white/10 bg-black/50 px-4 py-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isFirstPage}
                  className="rounded-sm border border-white/25 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition"
                >
                  ←
                </button>
                <div className="flex items-center gap-1">
                  <span
                    className={`inline-flex h-1.5 w-1.5 rounded-full ${
                      page === 0 ? "bg-white/80" : "bg-white/25"
                    }`}
                  />
                  <span
                    className={`inline-flex h-1.5 w-1.5 rounded-full ${
                      page === 1 ? "bg-white/80" : "bg-white/25"
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-sm border border-white/25 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] hover:bg-white/10 transition"
                >
                  →
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    rounded-sm border border-white/25 px-3 py-1
                    text-[11px] font-semibold uppercase tracking-[0.16em]
                    hover:bg-white/10 transition
                  "
                >
                  Exit
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="
                    rounded-sm bg-[#8f1616] px-4 py-1
                    text-[11px] font-semibold uppercase tracking-[0.16em]
                    hover:bg-[#b52222] transition
                  "
                >
                  {primaryLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

