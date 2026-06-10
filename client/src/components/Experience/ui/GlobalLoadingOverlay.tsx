import { AnimatePresence, motion } from "framer-motion";
import useWorld from "../../../hooks/useWorld";

export const GlobalLoadingOverlay = () => {
  const { isLoading, loadingMessage } = useWorld((s: any) => s);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-ink/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex flex-col items-center gap-4 rounded-2xl border-[4px] border-ink bg-cream px-8 py-6 shadow-brutal-lg [@media(max-height:500px)]:px-6 [@media(max-height:500px)]:py-4">
            <div className="flex h-8 items-end justify-center gap-2.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block h-3.5 w-3.5 rounded-full border-2 border-ink bg-gold shadow-[2px_2px_0_0_rgba(15,23,42,1)] loading-dot-wave"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </div>
            <p className="text-xs font-black uppercase tracking-wider text-ink">
              {loadingMessage || "Loading…"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
