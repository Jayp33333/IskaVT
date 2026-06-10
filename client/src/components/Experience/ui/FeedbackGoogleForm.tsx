import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
import { GOOGLE_FORM_EMBED_URL } from "../../../constants/feedbackConfig";
import useWorld from "../../../hooks/useWorld";

const AUTO_PROMPT_DELAY_MS = 60_000;

type FeedbackGoogleFormProps = {
  tourStarted: boolean;
};

export const FeedbackGoogleForm = ({ tourStarted }: FeedbackGoogleFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const showMiniMap = useWorld((s: any) => s.showMiniMap);
  const setShowFeedback = useWorld((s: any) => s.setShowFeedback);

  const autoPromptShownRef = useRef(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setShowFeedback(true);
    } else {
      setShowFeedback(false);
    }
  }, [isOpen, setShowFeedback]);

  useEffect(() => {
    if (!tourStarted) return;

    autoTimerRef.current = setTimeout(() => {
      if (autoPromptShownRef.current) return;
      autoPromptShownRef.current = true;
      setIsOpen(true);
    }, AUTO_PROMPT_DELAY_MS);

    return () => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [tourStarted]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  if (showMiniMap) return null;

  const modal =
    typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  className="fixed inset-0 z-[2000] bg-ink/85"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeModal}
                />

                <motion.div
                  className="fixed inset-0 z-[2001] flex items-end sm:items-center justify-center p-0 sm:p-4 [@media(max-height:500px)]:p-0 [@media(orientation:landscape)_and_(max-height:768px)]:p-2 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="pointer-events-auto mx-auto flex h-[min(92dvh,40rem)] w-full max-w-[28rem] shrink-0 flex-col overflow-hidden rounded-t-2xl border-[4px] border-ink bg-cream text-ink shadow-brutal-lg max-sm:max-w-none max-sm:rounded-b-none max-sm:border-b-0 sm:rounded-2xl [@media(max-height:500px)]:h-[min(96dvh,34rem)] [@media(max-height:500px)]:max-w-[min(92vw,22rem)] [@media(orientation:landscape)_and_(max-height:768px)]:h-[min(96dvh,32rem)] [@media(orientation:landscape)_and_(max-height:768px)]:max-w-[min(92vw,24rem)]"
                    initial={{ scale: 0.98, opacity: 0, y: 24 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.98, opacity: 0, y: 24 }}
                    transition={{ type: "spring", damping: 20, stiffness: 250 }}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="feedback-dialog-title"
                  >
                    <div className="flex shrink-0 items-center justify-between gap-2 border-b-[3px] border-ink bg-maroon px-3.5 py-3 sm:px-4">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-white p-1">
                          <img
                            src="/images/pup-logo.png"
                            alt="PUP Logo"
                            className="h-full w-full object-contain"
                          />
                        </span>
                        <h2
                          id="feedback-dialog-title"
                          className="truncate text-base font-black italic text-white sm:text-lg"
                        >
                          Feedback
                        </h2>
                      </div>
                      <button
                        onClick={closeModal}
                        className="shrink-0 rounded-xl border-2 border-ink bg-white p-1.5 text-ink transition-colors hover:bg-cream active:scale-95"
                        aria-label="Close feedback"
                        type="button"
                      >
                        <X className="h-4 w-4" strokeWidth={3} />
                      </button>
                    </div>

                    <div className="min-h-0 flex-1 overflow-hidden bg-white">
                      <iframe
                        src={GOOGLE_FORM_EMBED_URL}
                        title="Feedback form"
                        className="h-full w-full border-0"
                        loading="lazy"
                      >
                        Loading…
                      </iframe>
                    </div>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <>
      <button
        onClick={openModal}
        className="flex h-10 w-10 items-center justify-center rounded-2xl border-[3px] border-ink bg-gold text-maroon shadow-brutal-sm transition-all hover:bg-gold/90 active:translate-y-1 active:shadow-none [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:rounded-xl [@media(max-height:500px)]:shadow-brutal-sm"
        title="Share feedback"
        aria-label="Share feedback"
        aria-expanded={isOpen}
        type="button"
      >
        <MessageSquare
          className="h-4 w-4 [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5"
          strokeWidth={3}
        />
      </button>

      {modal}
    </>
  );
};
