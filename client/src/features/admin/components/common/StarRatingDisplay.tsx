import { Star } from "lucide-react";

type StarRatingDisplayProps = {
  rating: number;
  size?: "sm" | "md";
  showLabel?: boolean;
};

export function StarRatingDisplay({
  rating,
  size = "sm",
  showLabel = false,
}: StarRatingDisplayProps) {
  const starClass = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  const clamped = Math.min(5, Math.max(0, Math.round(rating)));

  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${clamped} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${starClass} ${
            i < clamped ? "fill-yellow-400 text-yellow-500" : "text-gray-300"
          }`}
        />
      ))}
      {showLabel && (
        <span className="ml-1 text-xs font-semibold text-gray-500">{clamped}/5</span>
      )}
    </div>
  );
}
