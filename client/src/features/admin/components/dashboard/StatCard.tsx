import { ArrowDown, ArrowUp } from "lucide-react";
import type { ReactNode } from "react";

export type StatTrend = "up" | "down" | "neutral";

type StatCardProps = {
  label: string;
  value: ReactNode;
  description: string;
  variant?: "primary" | "default";
  trend?: StatTrend;
  /** Visible trend text, e.g. "+12% vs yesterday" or "In Progress". */
  trendLabel?: string;
  /** Screen-reader / tooltip text for the trend; defaults to `trendLabel`. */
  trendDescription?: string;
};

const TREND_SR_PREFIX: Record<StatTrend, string> = {
  up: "Up",
  down: "Down",
  neutral: "",
};

export function StatCard({
  label,
  value,
  description,
  variant = "default",
  trend = "neutral",
  trendLabel,
  trendDescription,
}: StatCardProps) {
  const isPrimary = variant === "primary";

  const trendColor = isPrimary
    ? "text-white/80"
    : trend === "up"
      ? "text-[#660B05]"
      : trend === "down"
        ? "text-amber-700"
        : "text-gray-500";

  const srText = [TREND_SR_PREFIX[trend], trendDescription ?? trendLabel]
    .filter(Boolean)
    .join(": ");

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
        {trendLabel && (
          <div
            className={`flex items-center gap-1 text-xs ${trendColor}`}
            title={trendDescription}
          >
            {trend === "up" && <ArrowUp className="h-3 w-3" aria-hidden="true" />}
            {trend === "down" && <ArrowDown className="h-3 w-3" aria-hidden="true" />}
            <span aria-hidden="true">{trendLabel}</span>
            <span className="sr-only">{srText}</span>
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
