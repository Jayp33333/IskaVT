import { ArrowUp } from "lucide-react";
import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: ReactNode;
  description: string;
  variant?: "primary" | "default";
  trend?: "up" | "neutral";
  trendLabel?: string;
};

export function StatCard({
  label,
  value,
  description,
  variant = "default",
  trend = "neutral",
  trendLabel,
}: StatCardProps) {
  const isPrimary = variant === "primary";

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl p-5 sm:p-6 ${
        isPrimary
          ? "bg-gradient-to-br from-[#660B05] to-[#8C1007] text-white shadow-lg shadow-[#660B05]/20"
          : "border border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[10px] font-bold uppercase tracking-widest ${
            isPrimary ? "text-white/75" : "text-gray-500"
          }`}
        >
          {label}
        </span>
        {trend === "up" && (
          <div
            className={`flex items-center gap-1 text-xs ${
              isPrimary ? "text-white/80" : "text-[#660B05]"
            }`}
          >
            <ArrowUp className="h-3 w-3" />
            <span>{trendLabel ?? "Increased"}</span>
          </div>
        )}
        {trend === "neutral" && trendLabel && (
          <div
            className={`text-xs ${isPrimary ? "text-white/80" : "text-gray-500"}`}
          >
            {trendLabel}
          </div>
        )}
      </div>
      <div
        className={`font-bold tabular-nums ${
          isPrimary ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl text-gray-900"
        }`}
      >
        {value}
      </div>
      <p className={`text-xs ${isPrimary ? "text-white/70" : "text-gray-500"}`}>
        {description}
      </p>
    </div>
  );
}
