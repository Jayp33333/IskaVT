import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Move, Check } from "lucide-react";
import useWorld from "../../../hooks/useWorld";

export function MobileControlCustomizer() {
  const customizeMode = useWorld((s) => s.mobileControlsCustomize);
  const setMobileControlsCustomize = useWorld((s) => s.setMobileControlsCustomize);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {customizeMode && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[2500] flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] [@media(max-height:500px)]:p-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
        >
          <div className="pointer-events-auto flex w-[min(22rem,calc(100vw-1.5rem))] flex-col gap-2 rounded-2xl border-[3px] border-ink bg-cream/95 p-3 shadow-brutal-sm backdrop-blur-sm [@media(max-height:500px)]:gap-1.5 [@media(max-height:500px)]:rounded-xl [@media(max-height:500px)]:border-2 [@media(max-height:500px)]:p-2">
            <div className="flex items-start gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-[2px] border-ink bg-gold [@media(max-height:500px)]:h-7 [@media(max-height:500px)]:w-7">
                <Move
                  className="h-3.5 w-3.5 text-maroon [@media(max-height:500px)]:h-3 [@media(max-height:500px)]:w-3"
                  strokeWidth={3}
                />
              </span>
              <p className="text-[10px] font-bold leading-snug text-ink/80 [@media(max-height:500px)]:text-[9px]">
                Drag the joystick and jump button to your preferred spots.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileControlsCustomize(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-[3px] border-ink bg-maroon px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-white shadow-brutal-sm transition-all active:translate-y-0.5 [@media(max-height:500px)]:py-2 [@media(max-height:500px)]:text-[9px]"
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
              Done
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
