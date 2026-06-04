import { useAdmin } from "../../context/AdminContext";
import { AdminCard, AdminCardHeader } from "../common/adminUi";

const RANK_STYLES = [
  "bg-gradient-to-br from-[#660B05] to-[#8C1007] text-white",
  "bg-gray-400 text-white",
  "bg-amber-600 text-white",
] as const;

const DEFAULT_RANK_STYLE = "bg-gray-100 text-gray-600";

export function TopDestinationsList() {
  const { data } = useAdmin();
  const destinations = data.stats?.visitsPerDestination ?? [];
  const maxCount = destinations[0]?.count ?? 1;

  return (
    <AdminCard>
      <AdminCardHeader
        title="Top Destinations"
        subtitle="Most visited campus locations"
      />

      {destinations.length === 0 ? (
        <p className="text-sm text-gray-400">No visitor data yet.</p>
      ) : (
        <div className="space-y-4">
          {destinations.slice(0, 8).map((d, index) => {
            const pct = Math.round((d.count / maxCount) * 100);
            return (
              <div key={d.destination}>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        RANK_STYLES[index] ?? DEFAULT_RANK_STYLE
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="truncate text-sm font-medium text-gray-800">
                      {d.destination}
                    </span>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-[#660B05]">
                    {d.count}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#660B05] to-[#B45309] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminCard>
  );
}
