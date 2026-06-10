import { motion } from "framer-motion";

type EnterTransitionOverlayProps = {
  /** Use a higher z-index when overlaying the 2D map modal (z-[2200]). */
  zIndexClass?: string;
};

export const EnterTransitionOverlay = ({
  zIndexClass = "z-[340]",
}: EnterTransitionOverlayProps) => {
  return (
    <motion.div
      className={`fixed inset-0 ${zIndexClass} flex items-center justify-center bg-ink/25 backdrop-blur-[2px] pointer-events-auto`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div className="flex items-end justify-center gap-2.5 h-8">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-3.5 w-3.5 rounded-full border-2 border-ink bg-gold shadow-[2px_2px_0_0_rgba(15,23,42,1)] loading-dot-wave"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
};
