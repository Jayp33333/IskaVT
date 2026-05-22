import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import useWorld from "../../../hooks/useWorld";
import { audioManager } from "../../../services/AudioManager";

export const DestinationChecker = () => {
  const characterPosition = useWorld((state: any) => state.characterPosition);
  const pinPosition = useWorld((state: any) => state.pinPosition);
  const isPinConfirmed = useWorld((state: any) => state.isPinConfirmed);
  const isPinTeleported = useWorld((state: any) => state.isPinTeleported);
  const selectedDestination = useWorld((state: any) => state.selectedDestination);
  const setIsPinConfirmed = useWorld((state: any) => state.setIsPinConfirmed);
  const setPinPosition = useWorld((state: any) => state.setPinPosition);
  const setSelectedDestination = useWorld((state: any) => state.setSelectedDestination);

  const [showDestinationText, setShowDestinationText] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [arrivedDestination, setArrivedDestination] = useState<string | null>(null);

  useEffect(() => {
    if (!isPinConfirmed || !characterPosition || !pinPosition) return;

    const THRESHOLD = 1.5; 
    const interval = setInterval(() => {
      const distance = characterPosition.distanceTo(pinPosition);

      if (distance <= THRESHOLD && !isPinTeleported) {
        setArrivedDestination(selectedDestination || "your destination");
        setPinPosition(null);
        setIsPinConfirmed(false);
        setShowDestinationText(true);
        setSelectedDestination(null);
        audioManager.play("arrived");
        setTimeout(() => setFadeOut(true), 3000);
        setTimeout(() => {
          setShowDestinationText(false);
          setFadeOut(false);
        }, 3500);

        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [
    characterPosition,
    pinPosition,
    isPinConfirmed,
    isPinTeleported,
    selectedDestination,
    setIsPinConfirmed,
    setPinPosition,
    setSelectedDestination,
  ]);

  const dismiss = () => {
    setFadeOut(true);
    window.setTimeout(() => {
      setShowDestinationText(false);
      setFadeOut(false);
    }, 250);
  };

  return (
    <AnimatePresence>
      {showDestinationText && (
        <motion.div
          className="fixed top-5 left-1/2 z-[1500] w-[min(90vw,380px)] -translate-x-1/2 pointer-events-auto [@media(orientation:landscape)_and_(max-height:500px)]:top-2 [@media(orientation:landscape)_and_(max-height:500px)]:w-[min(82vw,340px)]"
          initial={{ opacity: 0, y: -18, scale: 0.94, rotate: -1 }}
          animate={{
            opacity: fadeOut ? 0 : 1,
            y: fadeOut ? -10 : 0,
            scale: fadeOut ? 0.96 : 1,
            rotate: fadeOut ? -1 : 0,
          }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ type: "spring", damping: 18, stiffness: 260 }}
        >
          <div className="flex items-center gap-3 rounded-[1.35rem] border-[4px] border-slate-900 bg-[#FFFDF9] px-4 py-3 text-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] [@media(orientation:landscape)_and_(max-height:500px)]:gap-2 [@media(orientation:landscape)_and_(max-height:500px)]:rounded-2xl [@media(orientation:landscape)_and_(max-height:500px)]:border-[3px] [@media(orientation:landscape)_and_(max-height:500px)]:px-3 [@media(orientation:landscape)_and_(max-height:500px)]:py-2 [@media(orientation:landscape)_and_(max-height:500px)]:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-[3px] border-slate-900 bg-emerald-300 [@media(orientation:landscape)_and_(max-height:500px)]:h-8 [@media(orientation:landscape)_and_(max-height:500px)]:w-8 [@media(orientation:landscape)_and_(max-height:500px)]:rounded-xl [@media(orientation:landscape)_and_(max-height:500px)]:border-[2px]">
              <CheckCircle2 className="h-5 w-5 text-slate-900 [@media(orientation:landscape)_and_(max-height:500px)]:h-4 [@media(orientation:landscape)_and_(max-height:500px)]:w-4" strokeWidth={3.25} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-base font-black leading-tight text-[#D43F3F] [@media(orientation:landscape)_and_(max-height:500px)]:text-sm">
                Destination reached
              </p>
              <p className="mt-0.5 truncate text-xs font-bold text-slate-600 [@media(orientation:landscape)_and_(max-height:500px)]:text-[10px]">
                {arrivedDestination}
              </p>
            </div>

            <button
              onClick={dismiss}
              className="shrink-0 rounded-full border-[2px] border-slate-900 bg-white p-1 text-slate-900 transition hover:bg-yellow-100 active:scale-90 [@media(orientation:landscape)_and_(max-height:500px)]:border [@media(orientation:landscape)_and_(max-height:500px)]:p-0.5"
              type="button"
              aria-label="Dismiss destination message"
            >
              <X className="h-4 w-4 [@media(orientation:landscape)_and_(max-height:500px)]:h-3.5 [@media(orientation:landscape)_and_(max-height:500px)]:w-3.5" strokeWidth={3} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
