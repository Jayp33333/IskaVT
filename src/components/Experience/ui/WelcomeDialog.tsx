import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface WelcomeDialogProps {
  open: boolean;
  onClose: () => void;
  portraitSrc?: string; // optional character image
}

export const WelcomeDialog = ({ open, onClose, portraitSrc }: WelcomeDialogProps) => {
  const fullMessage = "Maligayang Pagdating sa PUP Lopez Campus";
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  const indexRef = useRef(0);        // track current character
  const intervalRef = useRef<number | null>(null);

  // Typewriter effect
  useEffect(() => {
    if (!open) {
      // Reset everything if dialog closes
      setDisplayedText("");
      setTypingDone(false);
      indexRef.current = 0;
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (indexRef.current < fullMessage.length) {
        setDisplayedText((prev) => prev + fullMessage[indexRef.current]);
        indexRef.current++;
      } else {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setTypingDone(true);
      }
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [open, fullMessage]);

  // Auto close 1s after typing finishes
  useEffect(() => {
    if (!typingDone) return;

    const timer = setTimeout(() => {
      onClose();
    }, 1000);

    return () => clearTimeout(timer);
  }, [typingDone, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="
            fixed bottom-8 left-1/2 z-50 w-full max-w-[90%] sm:max-w-xl
            -translate-x-1/2 rounded-lg bg-black/80 px-4 py-3
            flex items-center gap-4 shadow-lg border border-white/10
          "
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          {/* Portrait */}
          {portraitSrc && (
            <img
              src={portraitSrc}
              alt="Character"
              className="w-12 h-12 rounded-full object-cover border border-white/20 shrink-0"
            />
          )}

          {/* Text */}
          <p className="text-white text-base font-medium leading-relaxed wrap-break-word">
            {displayedText}
            <span className="animate-pulse">|</span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
