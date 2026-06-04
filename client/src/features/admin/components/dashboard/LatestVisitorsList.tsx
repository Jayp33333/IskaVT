import { LATEST_VISITOR_COLORS } from "../../constants";
import { useAdmin } from "../../context/AdminContext";
import type { VisitorRecord } from "../../types";
import { AdminButton, AdminCard, AdminCardHeader } from "../common/adminUi";

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

function isToday(value?: string | null): boolean {
  if (!value) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function isVisitorNew(visitor: VisitorRecord): boolean {
  return (
    isToday(visitor.timeIn) ||
    isToday(visitor.date) ||
    isToday(visitor.createdAt)
  );
}

type LatestVisitorRowProps = {
  visitor: VisitorRecord;
  index: number;
  isNew: boolean;
};

function LatestVisitorRow({ visitor, index, isNew }: LatestVisitorRowProps) {
  const color = LATEST_VISITOR_COLORS[index % LATEST_VISITOR_COLORS.length];

  return (
    <div
      className={`flex items-center gap-3 rounded-xl p-3 transition-colors sm:gap-4 ${
        isNew ? "bg-amber-50/80 ring-1 ring-amber-100" : "hover:bg-gray-50/80"
      }`}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-sm"
        style={{ backgroundColor: color }}
      >
        {visitor.fullName.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <div className="truncate font-semibold text-gray-900">
            {visitor.fullName}
          </div>
          {isNew && (
            <span className="shrink-0 rounded-full bg-[#660B05]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#660B05]">
              new
            </span>
          )}
        </div>
        <div className="truncate text-xs text-gray-500">{visitor.destination}</div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-xs font-medium text-gray-900">
          {formatDate(visitor.timeIn)}
        </div>
        <div className="text-xs text-gray-500">{formatTime(visitor.timeIn)}</div>
      </div>
    </div>
  );
}

export function LatestVisitorsList() {
  const { data, setTab } = useAdmin();
  const visitors = data.latestEntries.slice(0, 5);

  return (
    <AdminCard className="lg:col-span-1 xl:col-span-1">
      <AdminCardHeader
        title="Latest Visitors"
        action={
          <AdminButton variant="ghost" size="sm" onClick={() => setTab("visitors")}>
            View all
          </AdminButton>
        }
      />

      {visitors.length === 0 ? (
        <p className="text-sm text-gray-400">No visitors logged yet.</p>
      ) : (
        <div className="space-y-2">
          {visitors.map((visitor, index) => (
            <LatestVisitorRow
              key={visitor._id}
              visitor={visitor}
              index={index}
              isNew={isVisitorNew(visitor)}
            />
          ))}
        </div>
      )}
    </AdminCard>
  );
}
