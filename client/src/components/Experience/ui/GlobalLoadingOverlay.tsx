import { AnimatePresence, motion } from "framer-motion";
import useWorld from "../../../hooks/useWorld";

export const GlobalLoadingOverlay = () => {
  const { isLoading, loadingMessage } = useWorld((s: any) => s);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="
            fixed inset-0 z-9999
            flex items-center justify-center
            backdrop-blur-lg bg-black/40
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-4 text-white">
            <div className="flex h-8 items-end justify-center gap-2.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block h-3 w-3 rounded-full bg-white loading-dot-wave"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </div>
            <p className="text-xs opacity-80">
              {loadingMessage || "Loading…"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
