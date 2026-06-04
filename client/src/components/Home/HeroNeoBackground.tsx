import { SectionDotGrid } from "../marketing/SectionDotGrid";

/** Subtle neo-brutalism hero backdrop — pointer-events-none, no shadows */
export function HeroNeoBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <SectionDotGrid tone="light" />
    </div>
  );
}
