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

type FeedbackProps = {
  experienceStarted: boolean;
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
      className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 [@media(max-height:500px)]:gap-0.5 [@media(orientation:landscape)_and_(max-height:600px)]:gap-0.5"
      role="group"
      aria-label="Rating"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          className="rounded-lg border-[2px] border-transparent p-0.5 transition-colors hover:scale-105 disabled:opacity-50 [@media(max-height:500px)]:p-0 [@media(orientation:landscape)_and_(max-height:600px)]:p-0"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          aria-pressed={value >= star}
        >
          <Star
            className={`h-7 w-7 sm:h-8 sm:w-8 [@media(max-height:500px)]:h-6 [@media(max-height:500px)]:w-6 [@media(orientation:landscape)_and_(max-height:600px)]:h-5 [@media(orientation:landscape)_and_(max-height:600px)]:w-5 ${
              value >= star ? "fill-gold text-gold" : "text-ink/20"
            }`}
            strokeWidth={2.5}
          />
        </button>
      ))}
    </div>
  );
}

export const Feedback = ({ experienceStarted }: FeedbackProps) => {
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
    if (!experienceStarted) return;

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
  }, [experienceStarted]);

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
                    className="pointer-events-auto mx-auto flex w-full max-w-md max-sm:max-w-none flex-col overflow-hidden rounded-t-[1.75rem] rounded-b-none sm:rounded-[2rem] border-[4px] sm:border-[6px] max-sm:border-b-0 border-ink bg-cream text-ink shadow-brutal-lg sm:shadow-brutal-lg max-h-[92dvh] sm:max-h-[90dvh] [@media(max-height:500px)]:max-h-[96dvh] [@media(max-height:500px)]:rounded-t-2xl [@media(max-height:500px)]:rounded-b-none [@media(max-height:500px)]:w-[min(100%,20rem)] [@media(orientation:landscape)_and_(max-height:768px)]:max-h-[96dvh] [@media(orientation:landscape)_and_(max-height:768px)]:w-[min(92vw,22rem)] [@media(orientation:landscape)_and_(max-height:768px)]:rounded-xl [@media(orientation:landscape)_and_(max-height:500px)]:w-[min(88vw,18rem)] shrink-0 sm:w-[min(100%,22rem)]"
                    initial={{ scale: 0.98, opacity: 0, y: 24 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.98, opacity: 0, y: 24 }}
                    transition={{ type: "spring", damping: 20, stiffness: 250 }}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="feedback-dialog-title"
                  >
                    <div className="flex shrink-0 items-center justify-between border-b-[4px] sm:border-b-[6px] [@media(max-height:500px)]:border-b-[4px] border-ink bg-maroon px-5 py-4 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 [@media(orientation:landscape)_and_(max-height:600px)]:px-3 [@media(orientation:landscape)_and_(max-height:600px)]:py-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex shrink-0 items-center justify-center rounded-2xl border-[3px] border-ink bg-surface p-1.5 shadow-brutal-sm [@media(max-height:500px)]:p-1">
                          <img
                            src="/images/pup-logo.png"
                            alt="PUP Logo"
                            className="h-8 w-8 object-contain [@media(max-height:500px)]:h-7 [@media(max-height:500px)]:w-7"
                          />
                        </div>
                        <div className="min-w-0">
                          <h2
                            id="feedback-dialog-title"
                            className="truncate text-lg font-black italic text-white sm:text-2xl [@media(max-height:500px)]:text-sm [@media(orientation:landscape)_and_(max-height:600px)]:text-base"
                          >
                            Feedback
                          </h2>
                          <p className="mt-0.5 text-[10px] font-bold text-white/80 sm:text-xs max-sm:hidden [@media(max-height:500px)]:hidden">
                            Share your virtual tour experience
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={closeModal}
                        disabled={isSubmitting}
                        className="shrink-0 rounded-xl border-[3px] border-ink bg-surface p-1.5 transition-transform hover:bg-muted active:scale-90 disabled:opacity-50 [@media(max-height:500px)]:p-1"
                        aria-label="Close feedback"
                        type="button"
                      >
                        <X className="h-5 w-5" strokeWidth={3} />
                      </button>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto bg-cream p-4 sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom))] [@media(max-height:500px)]:p-3 [@media(orientation:landscape)_and_(max-height:600px)]:p-3 custom-scrollbar">
                      {submitted ? (
                        <div className="py-6 text-center sm:py-8 [@media(max-height:500px)]:py-4">
                          <p className="text-base font-black italic text-maroon sm:text-xl [@media(max-height:500px)]:text-sm">
                            Thank you!
                          </p>
                          <p className="mt-2 text-xs font-bold text-ink/60 sm:text-sm [@media(max-height:500px)]:text-[10px]">
                            Your feedback helps us improve the virtual tour.
                          </p>
                        </div>
                      ) : (
                        <form
                          onSubmit={handleSubmit}
                          className="space-y-4 sm:space-y-5 [@media(max-height:500px)]:space-y-3 [@media(orientation:landscape)_and_(max-height:600px)]:space-y-2.5"
                        >
                          <div
                            className="flex items-center gap-3 rounded-2xl border-[3px] border-ink bg-muted px-3 py-2.5 shadow-brutal-sm [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:px-2.5 [@media(max-height:500px)]:py-2"
                            aria-label={`Profile: ${displayFullName}`}
                          >
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-maroon text-base font-black text-white [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:text-sm"
                              aria-hidden
                            >
                              {profileInitial}
                            </div>
                            <p className="min-w-0 flex-1 truncate text-sm font-black text-ink [@media(max-height:500px)]:text-xs">
                              {displayFullName}
                            </p>
                          </div>

                          <div>
                            <p className="mb-2 text-center text-xs font-black uppercase tracking-wider text-ink/80 sm:mb-3 [@media(max-height:500px)]:mb-1.5 [@media(max-height:500px)]:text-[10px]">
                              How was your experience?
                            </p>
                            <StarRating
                              value={rating}
                              onChange={setRating}
                              disabled={isSubmitting}
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="feedback-comment"
                              className="mb-1.5 block text-xs font-black uppercase tracking-wider text-ink/80 sm:mb-2 [@media(max-height:500px)]:mb-1 [@media(max-height:500px)]:text-[9px]"
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
                              rows={4}
                              maxLength={2000}
                              placeholder="Tell us what you enjoyed or what we could do better…"
                              className="w-full min-h-[5.5rem] max-h-[10rem] resize-y rounded-2xl border-[3px] border-ink bg-surface px-4 py-3 text-sm font-bold text-ink shadow-brutal-sm outline-none placeholder:text-ink/40 focus:bg-cream disabled:opacity-60 [@media(max-height:500px)]:min-h-[4rem] [@media(max-height:500px)]:max-h-[6rem] [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 [@media(max-height:500px)]:text-[11px] [@media(orientation:landscape)_and_(max-height:600px)]:min-h-[3.25rem] [@media(orientation:landscape)_and_(max-height:600px)]:max-h-[5rem]"
                            />
                            <p className="mt-1 text-right text-[10px] font-bold text-ink/40 [@media(max-height:500px)]:text-[9px]">
                              {comment.length}/2000
                            </p>
                          </div>

                          {error && (
                            <p className="rounded-2xl border-[3px] border-ink bg-red-50 px-3 py-2 text-center text-xs font-black italic text-maroon [@media(max-height:500px)]:text-[10px] [@media(max-height:500px)]:py-1.5">
                              {error}
                            </p>
                          )}

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-2xl border-[3px] border-ink bg-maroon py-3 text-sm font-black uppercase italic tracking-wide text-white shadow-brutal-md transition-all hover:bg-maroon/90 active:translate-y-1 active:shadow-none disabled:opacity-50 [@media(max-height:500px)]:py-2 [@media(max-height:500px)]:text-[11px] [@media(orientation:landscape)_and_(max-height:600px)]:py-2"
                          >
                            {isSubmitting ? "Sending…" : "Submit Feedback"}
                          </button>
                        </form>
                      )}
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
