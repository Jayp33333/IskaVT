import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAdmin } from "../../context/AdminContext";
import {
  ChartEmpty,
  ChartSummary,
  ChartTooltip,
  MODERN_CHART_PALETTE,
} from "./chartShared";

type VisitorTypeRow = {
  visitorType: string;
  count: number;
  percent: number;
};

export function VisitorTypePieChart() {
  const { data } = useAdmin();
  const raw = data.stats?.visitsByVisitorType ?? [];

  const { chartData, total } = useMemo(() => {
    const sum = raw.reduce((s, v) => s + v.count, 0);
    const rows: VisitorTypeRow[] = [...raw]
      .sort((a, b) => b.count - a.count)
      .map((v) => ({
        visitorType: v.visitorType,
        count: v.count,
        percent: sum > 0 ? (v.count / sum) * 100 : 0,
      }));
    return { chartData: rows, total: sum };
  }, [raw]);

  const topType = chartData[0];

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white/90 p-5 shadow-sm shadow-gray-200/50 backdrop-blur-sm sm:p-6">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900">Visitor Types</h2>
        <p className="text-xs text-gray-500">Distribution by category</p>
      </div>

      {chartData.length === 0 ? (
        <ChartEmpty message="No visitor type data yet." />
      ) : (
        <>
          <ChartSummary
            label="Total categorized"
            value={total.toLocaleString()}
            hint={
              topType
                ? `Top: ${topType.visitorType} (${topType.percent.toFixed(1)}%)`
                : undefined
            }
          />
          <ResponsiveContainer
            width="100%"
            height={Math.max(220, chartData.length * 44)}
          >
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 48, left: 4, bottom: 4 }}
              barCategoryGap="28%"
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#f3f4f6"
                horizontal={false}
              />
              <XAxis
                type="number"
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                stroke="#9ca3af"
                fontSize={11}
                tick={{ fill: "#6b7280" }}
              />
              <YAxis
                type="category"
                dataKey="visitorType"
                axisLine={false}
                tickLine={false}
                width={88}
                stroke="#9ca3af"
                fontSize={11}
                tick={{ fill: "#374151" }}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "rgba(102, 11, 5, 0.06)", radius: 4 }}
                formatter={(value, _name, item) => {
                  const row = item?.payload as VisitorTypeRow | undefined;
                  const count = typeof value === "number" ? value : Number(value) || 0;
                  const pct = row?.percent ?? 0;
                  return [`${count.toLocaleString()} (${pct.toFixed(1)}%)`, "Count"];
                }}
              />
              <Bar
                dataKey="count"
                radius={[0, 6, 6, 0]}
                maxBarSize={22}
                animationDuration={500}
                animationEasing="ease-out"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      MODERN_CHART_PALETTE[index % MODERN_CHART_PALETTE.length]
                    }
                  />
                ))}
                <LabelList
                  dataKey="count"
                  position="right"
                  className="fill-gray-600 text-[11px] font-medium"
                  formatter={(v) =>
                    typeof v === "number" ? v.toLocaleString() : String(v ?? "")
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4">
            {chartData.map((row, index) => (
              <li
                key={row.visitorType}
                className="flex items-center gap-2 text-xs"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{
                    backgroundColor:
                      MODERN_CHART_PALETTE[index % MODERN_CHART_PALETTE.length],
                  }}
                />
                <span className="min-w-0 flex-1 truncate font-medium text-gray-700">
                  {row.visitorType}
                </span>
                <span className="tabular-nums text-gray-500">
                  {row.percent.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
