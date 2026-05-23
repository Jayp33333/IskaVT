import { motion } from "framer-motion";

type CampusSubtitleProps = {
  animated?: boolean;
  className?: string;
};

export function CampusSubtitle({
  animated = false,
  className = "",
}: CampusSubtitleProps) {
  const content = (
    <div
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <img
        src="/images/pup-logo.png"
        alt="PUP Logo"
        className="h-9 w-9 shrink-0 object-contain"
      />
      <span className="text-[#800000] font-black uppercase tracking-[0.2em] text-sm italic">
        PUP Lopez Campus
      </span>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        {content}
      </motion.div>
    );
  }

  return <div className="mb-4">{content}</div>;
}
