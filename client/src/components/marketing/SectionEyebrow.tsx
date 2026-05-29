import { motion } from "framer-motion";

type SectionEyebrowProps = {
  children: React.ReactNode;
  animated?: boolean;
  className?: string;
};

export function SectionEyebrow({
  children,
  animated = false,
  className = "",
}: SectionEyebrowProps) {
  const content = (
    <span
      className={`mb-3 block text-xs font-black uppercase tracking-[0.18em] text-maroon italic sm:mb-4 sm:text-sm ${className}`}
    >
      {children}
    </span>
  );

  if (animated) {
    return (
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="block"
      >
        {content}
      </motion.span>
    );
  }

  return content;
}
