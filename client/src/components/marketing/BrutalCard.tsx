type BrutalCardAccent = "black" | "maroon" | "gold";
type BrutalCardElevation = "sm" | "md" | "lg";

const accentShadow: Record<BrutalCardAccent, string> = {
  black: "shadow-brutal-md hover:shadow-brutal-lg",
  maroon: "shadow-brutal-md hover:shadow-brutal-maroon",
  gold: "shadow-brutal-md hover:shadow-brutal-gold",
};

type BrutalCardProps = {
  children: React.ReactNode;
  className?: string;
  accent?: BrutalCardAccent;
  elevation?: BrutalCardElevation;
  hover?: boolean;
};

export function BrutalCard({
  children,
  className = "",
  accent = "black",
  hover = true,
}: BrutalCardProps) {
  return (
    <div
      className={`rounded-2xl border-2 border-ink bg-white sm:rounded-3xl sm:border-4 ${accentShadow[accent]} ${
        hover ? "transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
