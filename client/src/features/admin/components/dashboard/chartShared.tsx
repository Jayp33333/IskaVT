import type { ReactNode } from "react";

export const CHART_PRIMARY = "#660B05";
export const CHART_PRIMARY_LIGHT = "#8C1007";
export const CHART_PRIMARY_MUTED = "rgba(102, 11, 5, 0.12)";

export const MODERN_CHART_PALETTE = [
  "#660B05",
  "#B45309",
  "#D97706",
  "#CA8A04",
  "#65A30D",
  "#0D9488",
  "#0284C7",
  "#4F46E5",
  "#7C3AED",
  "#C026D3",
  "#DB2777",
  "#E11D48",
];

type ChartTooltipPayload = {
  name?: string;
  value?: number;
  color?: string;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string | number;
};

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const items = payload;

  return (
    <div className="rounded-lg border border-gray-200/80 bg-white/95 px-3 py-2.5 shadow-lg backdrop-blur-sm">
      {label != null && label !== "" && (
        <p className="mb-1.5 text-xs font-semibold text-gray-900">{label}</p>
      )}
      <ul className="space-y-1">
        {items.map((entry, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
            {entry.color && (
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
            )}
            <span className="font-medium text-gray-800">{entry.name ?? "Count"}</span>
            <span className="ml-auto tabular-nums text-gray-900">
              {typeof entry.value === "number"
                ? entry.value.toLocaleString()
                : entry.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type PeriodPillsProps<T extends string> = {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
};

export function PeriodPills<T extends string>({
  value,
  options,
  onChange,
}: PeriodPillsProps<T>) {
  return (
    <div
      className="inline-flex rounded-lg border border-gray-200 bg-gray-50/80 p-0.5"
      role="group"
      aria-label="Chart period"
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              active
                ? "bg-white text-[#660B05] shadow-sm ring-1 ring-gray-200/80"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

type ChartEmptyProps = {
  message: string;
};

export function ChartEmpty({ message }: ChartEmptyProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/50 px-6 py-12 text-center">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

type ChartGradientDefsProps = {
  id: string;
  from?: string;
  to?: string;
};

export function ChartGradientDefs({
  id,
  from = CHART_PRIMARY,
  to = CHART_PRIMARY_LIGHT,
}: ChartGradientDefsProps) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={from} stopOpacity={1} />
        <stop offset="100%" stopColor={to} stopOpacity={0.85} />
      </linearGradient>
    </defs>
  );
}

type ChartSummaryProps = {
  label: string;
  value: ReactNode;
  hint?: string;
};

export function ChartSummary({ label, value, hint }: ChartSummaryProps) {
  return (
    <div className="mb-4 flex flex-wrap items-end gap-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <p className="text-2xl font-bold tabular-nums text-gray-900">{value}</p>
      </div>
      {hint && <p className="pb-0.5 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
