import { ChevronDown } from "lucide-react";
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

import { useAdmin } from "../../context/AdminContext";
import { aggregateTimelineData } from "../../utils/aggregateTimeline";
import type { VisitorPeriod } from "../../types";

const PERIOD_LABELS: Record<VisitorPeriod, string> = {
  daily: "Daily Visitors",
  weekly: "Weekly Visitors",
  monthly: "Monthly Visitors",
  yearly: "Yearly Visitors",
};

const PERIOD_SUBTITLES: Record<VisitorPeriod, string> = {
  daily: "Last 7 days",
  weekly: "Last 12 weeks",
  monthly: "Last 12 months",
  yearly: "All years",
};

const EMPTY_PHRASE: Record<VisitorPeriod, string> = {
  daily: "the last 7 days",
  weekly: "the last 12 weeks",
  monthly: "the last 12 months",
  yearly: "any year",
};

function isRotatedPeriod(period: VisitorPeriod): boolean {
  return period === "monthly" || period === "yearly";
}

export function VisitorsBarChart() {
  const { data, visitorPeriod, setVisitorPeriod } = useAdmin();
  const stats = data.stats;
  if (!stats) return null;

  const chartData = aggregateTimelineData(stats.visitsTimeline, visitorPeriod);
  const rotated = isRotatedPeriod(visitorPeriod);

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {PERIOD_LABELS[visitorPeriod]}
          </h2>
          <span className="text-xs text-gray-500">
            {PERIOD_SUBTITLES[visitorPeriod]}
          </span>
        </div>
        <div className="relative">
          <select
            value={visitorPeriod}
            onChange={(e) => setVisitorPeriod(e.target.value as VisitorPeriod)}
            className="px-4 py-2 rounded-lg text-sm font-medium border-2 border-gray-200 bg-white text-gray-700 transition-all duration-200 hover:border-[#660B05] hover:text-[#660B05] focus:outline-none focus:ring-0 focus:border-[#660B05] appearance-none pr-8 cursor-pointer"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
        </div>
      </div>

      {stats.visitsTimeline.length === 0 ? (
        <p className="text-sm text-gray-400">
          No data available for {EMPTY_PHRASE[visitorPeriod]}.
        </p>
      ) : chartData.length === 0 ? (
        <p className="text-sm text-gray-400">
          No data available for the selected period.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={450}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 15, left: 5, bottom: rotated ? 60 : 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              stroke="#666"
              fontSize={11}
              tick={{ fill: "#666" }}
              angle={rotated ? -45 : 0}
              textAnchor={rotated ? "end" : "middle"}
              height={rotated ? 60 : undefined}
            />
            <YAxis stroke="#666" fontSize={11} tick={{ fill: "#666" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              cursor={{ fill: "rgba(102, 11, 5, 0.1)" }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${value ?? 0} visits`, "Count"]}
              labelFormatter={(label) => {
                if (visitorPeriod === "daily") {
                  const match = chartData.find((d) => d.label === label);
                  if (match) {
                    return new Date(match.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    });
                  }
                }
                return label;
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#660B05">
              {chartData.map((entry, index) => {
                const isActive = entry.count > 0;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isActive ? "#660B05" : "#e5e7eb"}
                    stroke={isActive ? "#8C1007" : "#d1d5db"}
                    strokeWidth={isActive ? 0 : 1}
                    strokeDasharray={isActive ? "0" : "4 4"}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
