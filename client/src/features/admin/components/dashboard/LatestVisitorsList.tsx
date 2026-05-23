import { Plus } from "lucide-react";
import { LATEST_VISITOR_COLORS } from "../../constants";
import { useAdmin } from "../../context/AdminContext";
import type { VisitorRecord } from "../../types";

function formatDate(value?: string | null): string {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value?: string | null): string {
  if (!value) return "-";
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

type LatestVisitorRowProps = {
  visitor: VisitorRecord;
  index: number;
};

function LatestVisitorRow({ visitor, index }: LatestVisitorRowProps) {
  const color = LATEST_VISITOR_COLORS[index % LATEST_VISITOR_COLORS.length];

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#660B05]/5 transition-all duration-200 cursor-pointer">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
        style={{ backgroundColor: color }}
      >
        {visitor.fullName.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 truncate">{visitor.fullName}</div>
        <div className="text-xs text-gray-500 truncate">{visitor.destination}</div>
      </div>
      <div className="text-right">
        <div className="text-xs font-medium text-gray-900">
          {formatDate(visitor.timeIn)}
        </div>
        <div className="text-xs text-gray-500">{formatTime(visitor.timeIn)}</div>
      </div>
    </div>
  );
}

export function LatestVisitorsList() {
  const { data } = useAdmin();
  const visitors = data.latestEntries.slice(0, 5);

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Latest Visitors</h2>
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#660B05] hover:bg-[#660B05]/10 rounded-lg transition-all duration-200 hover:shadow-sm">
          <Plus className="w-4 h-4" />
          New
        </button>
      </div>

      {visitors.length === 0 ? (
        <p className="text-sm text-gray-400">No visitors logged yet.</p>
      ) : (
        <div className="space-y-3">
          {visitors.map((visitor, index) => (
            <LatestVisitorRow
              key={visitor._id}
              visitor={visitor}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
