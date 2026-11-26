import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAdmin } from "../../context/adminContextValue";
import type { VisitorPeriod } from "../../types";
import {
  aggregateTimelineData,
  type TimelineBar,
} from "../../utils/aggregateTimeline";
import {
  ChartEmpty,
  ChartGradientDefs,
  ChartSummary,
  ChartTooltip,
  PeriodPills,
} from "./chartShared";
import { CHART_PRIMARY_MUTED } from "./chartTheme";

const PERIOD_OPTIONS: { value: VisitorPeriod; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const PERIOD_LABELS: Record<VisitorPeriod, string> = {
  daily: "Daily Visitors",
  weekly: "Weekly Visitors",
  monthly: "Monthly Visitors",
  yearly: "Yearly Visitors",
};

const PERIOD_SUBTITLES: Record<VisitorPeriod, string> = {
  daily: "Last 7 days, including today",
  weekly: "Last 12 weeks (Monday to Sunday)",
  monthly: "Last 12 months",
  yearly: "All years",
};

// An older backend only sends a ~30-day daily timeline, so monthly/yearly
// views derived from it are incomplete; say so instead of implying full data.
const LIMITED_DATA_NOTE = " · based on recent days only";

const EMPTY_PHRASE: Record<VisitorPeriod, string> = {
  daily: "the last 7 days",
  weekly: "the last 12 weeks",
  monthly: "the last 12 months",
  yearly: "any year",
};

const BAR_GRADIENT_ID = "visitorsBarGradient";

function isRotatedPeriod(period: VisitorPeriod): boolean {
  return period === "monthly" || period === "yearly";
}

export function VisitorsBarChart() {
  const { data, visitorPeriod, setVisitorPeriod } = useAdmin();
  const stats = data.stats;
  if (!stats) return null;

  const chartData = aggregateTimelineData(stats, visitorPeriod);
  const limitedData =
    (visitorPeriod === "monthly" && !Array.isArray(stats.visitsByMonth)) ||
    (visitorPeriod === "yearly" && !Array.isArray(stats.visitsByYear));
  const rotated = isRotatedPeriod(visitorPeriod);
  const periodTotal = chartData.reduce((sum, d) => sum + d.count, 0);
  const peak = chartData.reduce(
    (max, d) => (d.count > max.count ? d : max),
    chartData[0] ?? { count: 0, label: "" }
  );

  return (
    <div className="lg:col-span-2 rounded-2xl border border-gray-200/80 bg-white/90 p-5 shadow-sm shadow-gray-200/50 backdrop-blur-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {PERIOD_LABELS[visitorPeriod]}
          </h2>
          <p className="text-xs text-gray-500">
            {PERIOD_SUBTITLES[visitorPeriod]}
            {limitedData && LIMITED_DATA_NOTE}
          </p>
        </div>
        <PeriodPills
          value={visitorPeriod}
          options={PERIOD_OPTIONS}
          onChange={setVisitorPeriod}
        />
      </div>

      {periodTotal === 0 ? (
        <ChartEmpty
          message={`No visits recorded in ${EMPTY_PHRASE[visitorPeriod]}.`}
        />
      ) : (
        <>
          <ChartSummary
            label="Total in period"
            value={periodTotal.toLocaleString()}
            hint={
              peak.count > 0
                ? `Peak: ${peak.count.toLocaleString()} (${peak.label})`
                : undefined
            }
          />
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, left: -8, bottom: rotated ? 52 : 8 }}
              barCategoryGap="20%"
            >
              <ChartGradientDefs id={BAR_GRADIENT_ID} />
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#f3f4f6"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                stroke="#9ca3af"
                fontSize={11}
                tick={{ fill: "#6b7280" }}
                angle={rotated ? -40 : 0}
                textAnchor={rotated ? "end" : "middle"}
                height={rotated ? 52 : 28}
                interval={0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                stroke="#9ca3af"
                fontSize={11}
                tick={{ fill: "#6b7280" }}
                allowDecimals={false}
                width={36}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: CHART_PRIMARY_MUTED, radius: 6 }}
                labelFormatter={(label, payload) => {
                  const point = payload?.[0]?.payload as TimelineBar | undefined;
                  return point?.tooltipLabel ?? label;
                }}
                formatter={(value) => [
                  typeof value === "number" ? value : Number(value) || 0,
                  "Visits",
                ]}
              />
              <Bar
                dataKey="count"
                radius={[6, 6, 0, 0]}
                fill={`url(#${BAR_GRADIENT_ID})`}
                maxBarSize={48}
                animationDuration={500}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.count > 0
                        ? `url(#${BAR_GRADIENT_ID})`
                        : "#e5e7eb"
                    }
                    stroke={entry.count > 0 ? "transparent" : "#d1d5db"}
                    strokeWidth={entry.count > 0 ? 0 : 1}
                    strokeDasharray={entry.count > 0 ? "0" : "4 4"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
