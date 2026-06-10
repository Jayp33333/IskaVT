import { useState, useEffect, useRef, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Star, X } from "lucide-react";
import { feedbackAPI, logbookAPI } from "../../../services/api";
import { getErrorMessage } from "../../../utils/errors";
import {
  LOGBOOK_ENTRY_ID_KEY,
  getSessionFullName,
  setSessionFullName,
} from "../../../constants/logbookSession";
import useWorld from "../../../hooks/useWorld";

const AUTO_PROMPT_DELAY_MS = 60_000;

type FeedbackNativeProps = {
  tourStarted: boolean;
};

function StarRating({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-center gap-1 [@media(max-height:500px)]:gap-0.5 [@media(orientation:landscape)_and_(max-height:768px)]:gap-0.5"
      role="group"
      aria-label="Rating"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          className="rounded-md border-2 border-transparent p-0.5 transition-colors hover:scale-105 disabled:opacity-50"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          aria-pressed={value >= star}
        >
          <Star
            className={`h-6 w-6 sm:h-7 sm:w-7 [@media(max-height:500px)]:h-5 [@media(max-height:500px)]:w-5 [@media(orientation:landscape)_and_(max-height:768px)]:h-[1.125rem] [@media(orientation:landscape)_and_(max-height:768px)]:w-[1.125rem] ${
              value >= star ? "fill-gold text-gold" : "text-ink/20"
            }`}
            strokeWidth={2.5}
          />
        </button>
      ))}
    </div>
  );
}

export const FeedbackNative = ({ tourStarted }: FeedbackNativeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sessionFullName, setSessionFullNameState] = useState<string | null>(null);

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
    if (!isOpen) return;

    let cancelled = false;

    const loadFullName = async () => {
      const entryId =
        typeof window !== "undefined"
          ? localStorage.getItem(LOGBOOK_ENTRY_ID_KEY)
          : null;

      if (entryId) {
        try {
          const res = await logbookAPI.getEntry(entryId);
          const name = res.data?.fullName?.trim();
          if (!cancelled && name) {
            setSessionFullName(name);
            setSessionFullNameState(name);
            return;
          }
        } catch {
          // Fall back to cached session name
        }
      }

      if (!cancelled) {
        setSessionFullNameState(getSessionFullName());
      }
    };

    void loadFullName();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

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

  const openModal = () => {
    setError(null);
    setSubmitted(false);
    setIsOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsOpen(false);
    if (submitted) {
      setRating(0);
      setComment("");
      setSubmitted(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please share your feedback in a few words.");
      return;
    }

    setIsSubmitting(true);
    try {
      const logbookEntryId =
        typeof window !== "undefined"
          ? localStorage.getItem(LOGBOOK_ENTRY_ID_KEY)
          : null;
      const fullName = sessionFullName ?? getSessionFullName();

      await feedbackAPI.submitFeedback({
        rating,
        comment: comment.trim(),
        fullName,
        logbookEntryId,
      });

      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setRating(0);
        setComment("");
        setSubmitted(false);
      }, 1800);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not send feedback. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showMiniMap) return null;

  const displayFullName = sessionFullName ?? "Guest";
  const profileInitial = displayFullName.charAt(0).toUpperCase();

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
                    className="pointer-events-auto mx-auto flex h-[min(92dvh,34rem)] w-full max-w-[26rem] shrink-0 flex-col overflow-hidden rounded-t-2xl border-[4px] border-ink bg-cream text-ink shadow-brutal-lg max-sm:max-w-none max-sm:rounded-b-none max-sm:border-b-0 sm:rounded-2xl [@media(max-height:500px)]:h-[min(96dvh,30rem)] [@media(max-height:500px)]:max-w-[min(92vw,20rem)] [@media(max-height:500px)]:rounded-t-2xl [@media(orientation:landscape)_and_(max-height:768px)]:h-[min(96dvh,28rem)] [@media(orientation:landscape)_and_(max-height:768px)]:max-w-[min(92vw,22rem)] [@media(orientation:landscape)_and_(max-height:768px)]:rounded-xl [@media(orientation:landscape)_and_(max-height:500px)]:max-w-[min(88vw,18rem)]"
                    initial={{ scale: 0.98, opacity: 0, y: 24 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.98, opacity: 0, y: 24 }}
                    transition={{ type: "spring", damping: 20, stiffness: 250 }}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="feedback-dialog-title"
                  >
                    <div className="flex shrink-0 items-center justify-between gap-2 border-b-[3px] border-ink bg-maroon px-3.5 py-3 sm:px-4 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2.5 [@media(orientation:landscape)_and_(max-height:768px)]:px-3 [@media(orientation:landscape)_and_(max-height:768px)]:py-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-white p-1 [@media(max-height:500px)]:h-8 [@media(max-height:500px)]:w-8 [@media(orientation:landscape)_and_(max-height:768px)]:h-7 [@media(orientation:landscape)_and_(max-height:768px)]:w-7">
                          <img
                            src="/images/pup-logo.png"
                            alt="PUP Logo"
                            className="h-full w-full object-contain"
                          />
                        </span>
                        <h2
                          id="feedback-dialog-title"
                          className="truncate text-base font-black italic text-white sm:text-lg [@media(max-height:500px)]:text-sm [@media(orientation:landscape)_and_(max-height:768px)]:text-xs"
                        >
                          Feedback
                        </h2>
                      </div>
                      <button
                        onClick={closeModal}
                        disabled={isSubmitting}
                        className="shrink-0 rounded-xl border-2 border-ink bg-white p-1.5 text-ink transition-colors hover:bg-cream active:scale-95 disabled:opacity-50 [@media(max-height:500px)]:p-1"
                        aria-label="Close feedback"
                        type="button"
                      >
                        <X className="h-4 w-4" strokeWidth={3} />
                      </button>
                    </div>

                    {submitted ? (
                      <div className="flex min-h-0 flex-1 items-center justify-center p-4 sm:p-6 [@media(max-height:500px)]:p-3">
                        <div className="text-center">
                          <p className="text-base font-black italic text-maroon sm:text-xl [@media(max-height:500px)]:text-sm">
                            Thank you!
                          </p>
                          <p className="mt-2 text-xs font-bold text-ink/60 sm:text-sm [@media(max-height:500px)]:text-[10px]">
                            Your feedback helps us improve the virtual tour.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleSubmit}
                        className="flex min-h-0 flex-1 flex-col overflow-hidden"
                      >
                        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden p-3.5 sm:p-4 [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:p-3 [@media(orientation:landscape)_and_(max-height:768px)]:gap-1.5 [@media(orientation:landscape)_and_(max-height:768px)]:p-2.5">
                          <div
                            className="flex shrink-0 items-center gap-2 rounded-xl border-2 border-ink bg-muted px-2.5 py-2 shadow-brutal-sm [@media(max-height:500px)]:px-2 [@media(max-height:500px)]:py-1.5 [@media(orientation:landscape)_and_(max-height:768px)]:py-1"
                            aria-label={`Profile: ${displayFullName}`}
                          >
                            <div
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-maroon text-sm font-black text-white [@media(max-height:500px)]:h-7 [@media(max-height:500px)]:w-7 [@media(max-height:500px)]:text-xs [@media(orientation:landscape)_and_(max-height:768px)]:h-6 [@media(orientation:landscape)_and_(max-height:768px)]:w-6"
                              aria-hidden
                            >
                              {profileInitial}
                            </div>
                            <p className="min-w-0 flex-1 truncate text-xs font-black text-ink sm:text-sm [@media(max-height:500px)]:text-[11px] [@media(orientation:landscape)_and_(max-height:768px)]:text-[10px]">
                              {displayFullName}
                            </p>
                          </div>

                          <div className="shrink-0">
                            <p className="mb-1 text-center text-[10px] font-black uppercase tracking-wider text-ink/80 sm:text-xs [@media(max-height:500px)]:mb-0.5 [@media(orientation:landscape)_and_(max-height:768px)]:text-[9px]">
                              How was your experience?
                            </p>
                            <StarRating
                              value={rating}
                              onChange={setRating}
                              disabled={isSubmitting}
                            />
                          </div>

                          <div className="flex min-h-0 flex-1 flex-col">
                            <label
                              htmlFor="feedback-comment"
                              className="mb-1 block shrink-0 text-[10px] font-black uppercase tracking-wider text-ink/80 sm:text-xs [@media(orientation:landscape)_and_(max-height:768px)]:text-[9px]"
                            >
                              Your feedback
                            </label>
                            <textarea
                              id="feedback-comment"
                              value={comment}
                              onChange={(e) => {
                                setComment(e.target.value);
                                setError(null);
                              }}
                              disabled={isSubmitting}
                              maxLength={2000}
                              placeholder="Share your experience…"
                              className="min-h-0 w-full flex-1 resize-none rounded-xl border-2 border-ink bg-white px-3 py-2 text-xs font-bold leading-snug text-ink shadow-brutal-sm outline-none placeholder:text-ink/40 focus:bg-cream disabled:opacity-60 sm:text-sm [@media(max-height:500px)]:px-2.5 [@media(max-height:500px)]:py-1.5 [@media(max-height:500px)]:text-[11px] [@media(orientation:landscape)_and_(max-height:768px)]:text-[10px]"
                            />
                            <p className="mt-0.5 shrink-0 text-right text-[9px] font-bold text-ink/40 sm:text-[10px]">
                              {comment.length}/2000
                            </p>
                          </div>

                          {error && (
                            <p className="shrink-0 rounded-xl border-2 border-ink bg-red-50 px-2.5 py-1.5 text-center text-[10px] font-black italic text-maroon sm:text-xs [@media(orientation:landscape)_and_(max-height:768px)]:py-1 [@media(orientation:landscape)_and_(max-height:768px)]:text-[9px]">
                              {error}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 border-t-[3px] border-ink bg-muted px-3.5 py-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-3 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 [@media(orientation:landscape)_and_(max-height:768px)]:py-2">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex w-full items-center justify-center rounded-xl border-[3px] border-ink bg-maroon py-2.5 text-xs font-black uppercase italic tracking-wide text-white shadow-brutal-md transition-all hover:bg-maroon/90 active:translate-y-1 active:shadow-none disabled:opacity-50 sm:py-3 sm:text-sm [@media(max-height:500px)]:py-2 [@media(max-height:500px)]:text-[11px]"
                          >
                            {isSubmitting ? "Sending…" : "Submit"}
                          </button>
                        </div>
                      </form>
                    )}
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
