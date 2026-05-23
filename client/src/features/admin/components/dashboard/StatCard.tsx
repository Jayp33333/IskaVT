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
      className={`rounded-xl shadow-sm p-6 flex flex-col gap-3 ${
        isPrimary
          ? "bg-[#660B05] text-white"
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-medium uppercase tracking-wide ${
            isPrimary ? "text-white/80" : "text-gray-500"
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
            <ArrowUp className="w-3 h-3" />
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
        className={`font-bold ${
          isPrimary ? "text-4xl" : "text-3xl text-gray-900"
        }`}
      >
        {value}
      </div>
      <p
        className={`text-xs ${isPrimary ? "text-white/70" : "text-gray-500"}`}
      >
        {description}
      </p>
    </div>
  );
}
