import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
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

  const clearTypingInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Typewriter effect: reset and type when message changes
  useEffect(() => {
    if (!open || !message) {
      setDisplayedText("");
      setTypingDone(false);
      indexRef.current = 0;
      clearTypingInterval();
      return;
    }

    setDisplayedText("");
    setTypingDone(false);
    indexRef.current = 0;
    clearTypingInterval();

    intervalRef.current = setInterval(() => {
      const nextIndex = indexRef.current + 1;
      setDisplayedText(message.slice(0, nextIndex));
      indexRef.current = nextIndex;

      if (nextIndex >= message.length) {
        clearTypingInterval();
        setTypingDone(true);
      }
    }, TYPING_INTERVAL_MS);

    return clearTypingInterval;
  }, [open, message]);

  const hasOptions = options && options.length > 0;
  const speakerInitial = title.trim().charAt(0).toUpperCase() || "?";

  const handleMessageClick = () => {
    if (typingDone) return;
    clearTypingInterval();
    setDisplayedText(message);
    indexRef.current = message.length;
    setTypingDone(true);
  };

  return (
    <AnimatePresence>
      {open && !showLogHistory && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[1200] pointer-events-none px-3 pb-3 sm:px-6 sm:pb-5 [@media(orientation:landscape)_and_(max-height:600px)]:px-4 [@media(orientation:landscape)_and_(max-height:600px)]:pb-2"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ type: "spring", damping: 24, stiffness: 260 }}
        >
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-2.5 pointer-events-auto sm:gap-3 [@media(orientation:landscape)_and_(max-height:600px)]:max-w-3xl [@media(orientation:landscape)_and_(max-height:600px)]:gap-1.5">
            {typingDone && (
              <motion.div
                className="ml-auto flex w-full max-w-[20rem] flex-col gap-1.5 rounded-2xl border-[3px] border-ink bg-white p-2.5 shadow-brutal-sm sm:border-[4px] sm:p-3 sm:shadow-brutal-md [@media(orientation:landscape)_and_(max-height:600px)]:max-w-[20rem] [@media(orientation:landscape)_and_(max-height:600px)]:gap-1.5 [@media(orientation:landscape)_and_(max-height:600px)]:rounded-xl [@media(orientation:landscape)_and_(max-height:600px)]:border-[3px] [@media(orientation:landscape)_and_(max-height:600px)]:p-2"
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-1.5 px-1 text-[9px] font-black uppercase leading-none tracking-widest text-ink/50 [@media(orientation:landscape)_and_(max-height:600px)]:text-[8px]">
                  <MessageCircle size={14} strokeWidth={4} />
                  Your Reply
                </div>
                {hasOptions ? (
                  options!.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      className="rounded-xl border-[3px] border-ink bg-gold px-3 py-2 text-left text-xs font-extrabold leading-snug text-ink shadow-brutal-sm transition-all hover:bg-gold active:translate-x-0.5 active:translate-y-0.5 active:shadow-none [@media(orientation:landscape)_and_(max-height:600px)]:px-2.5 [@media(orientation:landscape)_and_(max-height:600px)]:py-1.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-[10px]"
                      onClick={opt.onClick}
                    >
                      {opt.label}
                    </button>
                  ))
                ) : (
                  <button
                    type="button"
                    className="rounded-xl border-[3px] border-ink bg-maroon px-3 py-2 text-xs font-black uppercase tracking-wide text-white shadow-brutal-sm transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none [@media(orientation:landscape)_and_(max-height:600px)]:px-2.5 [@media(orientation:landscape)_and_(max-height:600px)]:py-1.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-[10px]"
                    onClick={onClose}
                  >
                    Close
                  </button>
                )}
              </motion.div>
            )}

            <div
              className="relative overflow-hidden rounded-[1.5rem] border-[4px] border-ink bg-cream shadow-brutal-md sm:rounded-[1.75rem] sm:border-[5px] sm:shadow-brutal-md [@media(orientation:landscape)_and_(max-height:600px)]:rounded-2xl [@media(orientation:landscape)_and_(max-height:600px)]:border-[3px] [@media(orientation:landscape)_and_(max-height:600px)]:shadow-brutal-sm"
              onClick={handleMessageClick}
              role="dialog"
              aria-label={`${title} dialog`}
            >
              <div className="flex items-center gap-3 border-b-[4px] border-ink bg-maroon px-3.5 py-2.5 text-white sm:gap-4 sm:px-5 sm:py-3.5 [@media(orientation:landscape)_and_(max-height:600px)]:gap-2 [@media(orientation:landscape)_and_(max-height:600px)]:border-b-[3px] [@media(orientation:landscape)_and_(max-height:600px)]:px-3 [@media(orientation:landscape)_and_(max-height:600px)]:py-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-ink bg-gold text-lg font-black leading-none text-ink shadow-brutal-sm sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl sm:shadow-brutal-sm [@media(orientation:landscape)_and_(max-height:600px)]:h-8 [@media(orientation:landscape)_and_(max-height:600px)]:w-8 [@media(orientation:landscape)_and_(max-height:600px)]:rounded-lg [@media(orientation:landscape)_and_(max-height:600px)]:text-sm">
                  {speakerInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-black italic leading-none tracking-tight text-white sm:text-xl [@media(orientation:landscape)_and_(max-height:600px)]:text-sm">
                    {title}
                  </h3>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-xl border-[3px] border-ink bg-white p-1.5 text-ink transition-transform active:scale-95 [@media(orientation:landscape)_and_(max-height:600px)]:rounded-lg [@media(orientation:landscape)_and_(max-height:600px)]:p-1"
                  onClick={(event) => {
                    event.stopPropagation();
                    onClose();
                  }}
                  aria-label="Close NPC dialog"
                >
                  <X size={20} strokeWidth={4} />
                </button>
              </div>

              <div className="px-4 py-3.5 sm:px-6 sm:py-5 [@media(orientation:landscape)_and_(max-height:600px)]:px-4 [@media(orientation:landscape)_and_(max-height:600px)]:py-2.5">
                <p className="min-h-[3rem] text-[13px] font-bold leading-6 text-ink sm:min-h-[3.25rem] sm:text-sm sm:leading-7 [@media(orientation:landscape)_and_(max-height:600px)]:min-h-[2rem] [@media(orientation:landscape)_and_(max-height:600px)]:text-[11px] [@media(orientation:landscape)_and_(max-height:600px)]:leading-4">
                  {displayedText}
                  <span className={typingDone ? "opacity-0" : "animate-pulse"}>|</span>
                </p>
                <p className="mt-2.5 text-[10px] font-black uppercase leading-none tracking-wider text-ink/40 sm:mt-3 [@media(orientation:landscape)_and_(max-height:600px)]:mt-1.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-[8px]">
                  {typingDone ? "Choose a reply to continue" : "Click dialog to skip typing"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
