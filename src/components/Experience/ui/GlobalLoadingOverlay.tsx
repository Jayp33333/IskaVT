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
          <div className="flex flex-col items-center gap-3 text-white">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <p className="text-xs opacity-80">
              {loadingMessage || "Loading…"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
