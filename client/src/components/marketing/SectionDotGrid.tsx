type SectionDotGridProps = {
  /** Light backgrounds use dark dots; dark/maroon sections use light dots */
  tone?: "light" | "dark";
};

export function SectionDotGrid({ tone = "light" }: SectionDotGridProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${isDark ? "opacity-[0.12]" : "opacity-[0.09]"}`}
      aria-hidden
      style={{
        backgroundImage: isDark
          ? "radial-gradient(circle at center, rgba(255,255,255,0.45) 1.25px, transparent 1.25px)"
          : "radial-gradient(circle at center, #000 1.25px, transparent 1.25px)",
        backgroundSize: "26px 26px",
      }}
    />
  );
}
