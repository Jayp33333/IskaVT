import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useWorld from "../../../hooks/useWorld";

export type DialogOption = {
  label: string;
  onClick: () => void;
};

type NPCDialogProps = {
  open: boolean;
  title: string;
  message: string;
  options?: DialogOption[];
  onClose: () => void;
};

const TYPING_INTERVAL_MS = 40;

export const NPCDialog = ({
  open,
  title,
  message,
  options,
  onClose,
}: NPCDialogProps) => {
  const showLogHistory = useWorld((state: any) => state.showLogHistory);
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Typewriter effect: reset and type when message changes
  useEffect(() => {
    if (!open || !message) {
      setDisplayedText("");
      setTypingDone(false);
      indexRef.current = 0;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setDisplayedText("");
    setTypingDone(false);
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      const nextIndex = indexRef.current + 1;
      setDisplayedText(message.slice(0, nextIndex));
      indexRef.current = nextIndex;

      if (nextIndex >= message.length) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setTypingDone(true);
      }
    }, TYPING_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [open, message]);

  const hasOptions = options && options.length > 0;

  return (
    <AnimatePresence>
      {open && !showLogHistory && (
        <>
          {/* Options – top right, above the message (Genshin-style); only after NPC finishes */}
          {typingDone && (
            <motion.div
              className="
                fixed bottom-28 right-4 sm:right-6 z-50 w-full max-w-[280px] sm:max-w-xs
                flex flex-col gap-2 rounded-lg bg-black/85 px-3 py-3
                shadow-xl border border-white/15
              "
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-white/70 text-xs font-medium uppercase tracking-wider px-1">
                Reply
              </span>
              {hasOptions ? (
                options!.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    className="
                      bg-white/10 hover:bg-white/20 border border-white/20
                      hover:border-white/40 text-white text-left px-3 py-2.5
                      rounded-lg cursor-pointer font-medium text-sm
                      transition-all duration-200
                    "
                    onClick={opt.onClick}
                  >
                    {opt.label}
                  </button>
                ))
              ) : (
                <button
                  type="button"
                  className="
                    bg-white/15 border border-white/25 text-white
                    px-4 py-2 rounded-lg cursor-pointer font-semibold
                    hover:bg-white/25 transition-colors
                  "
                  onClick={onClose}
                >
                  Close
                </button>
              )}
            </motion.div>
          )}

          {/* NPC message – wide at bottom, full width left to right (Genshin: dialogue box) */}
          <motion.div
            className="
              fixed bottom-0 left-0 right-0 z-40 rounded-t-xl bg-black/90
              px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-2
              shadow-xl border-t border-white/10
            "
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-[#e8d5b7] text-base font-semibold m-0">{title}</h3>
            <p className="text-white text-sm sm:text-base leading-relaxed m-0 min-h-[2.4em]">
              {displayedText}
              <span className={typingDone ? "opacity-0" : "animate-pulse"}>|</span>
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
