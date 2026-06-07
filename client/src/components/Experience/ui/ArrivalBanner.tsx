import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import useWorld from "../../../hooks/useWorld";

const BANNER_FADE_OUT_MS = 5500;
const BANNER_HIDE_MS = 6000;

export const ArrivalBanner = () => {
  const arrivalBannerDestination = useWorld((s: any) => s.arrivalBannerDestination);
  const setArrivalBannerDestination = useWorld((s: any) => s.setArrivalBannerDestination);
  const setIsArrivalPaused = useWorld((s: any) => s.setIsArrivalPaused);

  const [fadeOut, setFadeOut] = useState(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  const dismiss = () => {
    clearTimers();
    setIsArrivalPaused(false);
    setFadeOut(true);
    window.setTimeout(() => {
      setArrivalBannerDestination(null);
      setFadeOut(false);
    }, 250);
  };

  useEffect(() => {
    if (!arrivalBannerDestination) {
      clearTimers();
      setFadeOut(false);
      return;
    }

    clearTimers();
    setFadeOut(false);
    timersRef.current = [
      window.setTimeout(() => setFadeOut(true), BANNER_FADE_OUT_MS),
      window.setTimeout(() => {
        setArrivalBannerDestination(null);
        setFadeOut(false);
        setIsArrivalPaused(false);
      }, BANNER_HIDE_MS),
    ];

    return clearTimers;
  }, [arrivalBannerDestination, setArrivalBannerDestination, setIsArrivalPaused]);

  useEffect(() => () => clearTimers(), []);

  return (
    <AnimatePresence>
      {arrivalBannerDestination && (
        <motion.div
          className="w-[min(82vw,210px)] pointer-events-auto [@media(max-width:360px)]:w-[min(76vw,180px)] [@media(orientation:landscape)_and_(max-height:500px)]:w-[min(58vw,180px)]"
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{
            opacity: fadeOut ? 0 : 1,
            y: fadeOut ? -4 : 0,
            scale: fadeOut ? 0.98 : 1,
          }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ type: "spring", damping: 18, stiffness: 260 }}
        >
          <div className="rounded-xl border-[2px] border-ink bg-cream p-2 text-ink shadow-brutal-sm [@media(max-width:360px)]:p-1.5 [@media(orientation:landscape)_and_(max-height:500px)]:p-1.5">
            <div className="flex items-center gap-1.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-[2px] border-ink bg-emerald-300 [@media(max-width:360px)]:h-6 [@media(max-width:360px)]:w-6 [@media(orientation:landscape)_and_(max-height:500px)]:h-6 [@media(orientation:landscape)_and_(max-height:500px)]:w-6">
                <CheckCircle2
                  className="h-3.5 w-3.5 text-ink [@media(max-width:360px)]:h-3 [@media(max-width:360px)]:w-3 [@media(orientation:landscape)_and_(max-height:500px)]:h-3 [@media(orientation:landscape)_and_(max-height:500px)]:w-3"
                  strokeWidth={3.25}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[8px] font-black uppercase tracking-wide text-maroon [@media(max-width:360px)]:text-[7px] [@media(orientation:landscape)_and_(max-height:500px)]:text-[7px]">
                  Destination reached
                </p>
                <p className="truncate text-xs font-black leading-tight text-ink [@media(max-width:360px)]:text-[10px] [@media(orientation:landscape)_and_(max-height:500px)]:text-[10px]">
                  {arrivalBannerDestination}
                </p>
              </div>

              <button
                onClick={dismiss}
                className="shrink-0 rounded-full border-[2px] border-ink bg-white p-0.5 text-ink transition hover:bg-gold/25 active:scale-90"
                type="button"
                aria-label="Dismiss destination message"
              >
                <X
                  className="h-3.5 w-3.5 [@media(max-width:360px)]:h-3 [@media(max-width:360px)]:w-3"
                  strokeWidth={3}
                />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
