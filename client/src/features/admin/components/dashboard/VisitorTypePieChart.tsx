import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CHART_COLORS } from "../../constants";
import { useAdmin } from "../../context/AdminContext";

type LabelEntry = {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  visitorType: string;
  count: number;
};

function makeLabelRenderer(total: number) {
  return (entry: LabelEntry) => {
    const percent = total > 0 ? (entry.count / total) * 100 : 0;
    const RADIAN = Math.PI / 180;
    const midAngle = (entry.startAngle + entry.endAngle) / 2;
    const radius =
      entry.innerRadius + (entry.outerRadius - entry.innerRadius) * 0.5;
    const x = entry.cx + radius * Math.cos(-midAngle * RADIAN);
    const y = entry.cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#333"
        fontSize="8"
        fontWeight="500"
      >
        <tspan x={x} dy="-5" fontSize="8">
          {entry.visitorType}
        </tspan>
        <tspan x={x} dy="9" fontSize="8" fill="#660B05">
          {percent.toFixed(1)}%
        </tspan>
      </text>
    );
  };
}

export function VisitorTypePieChart() {
  const { data } = useAdmin();
  const visitorTypes = data.stats?.visitsByVisitorType ?? [];

  const total = visitorTypes.reduce((sum, v) => sum + v.count, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Visitor Types</h2>
      {visitorTypes.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={visitorTypes}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={140}
              fill="#8884d8"
              dataKey="count"
              nameKey="visitorType"
              labelLine={false}
              label={makeLabelRenderer(total) as unknown as never}
            >
              {visitorTypes.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#660B05" : CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "12px",
                padding: "8px 12px",
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any) => {
                const numeric = Number(value) || 0;
                const percent =
                  total > 0 ? ((numeric / total) * 100).toFixed(1) : "0";
                return [`${name}: ${percent}%`, "Visitor Type"];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-sm text-gray-400">No visitor type data yet.</p>
      )}
    </div>
  );
}
