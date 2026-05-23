import { useAdmin } from "../../context/AdminContext";

const RANK_STYLES = [
  "bg-[#660B05] text-white",
  "bg-gray-400 text-white",
  "bg-amber-600 text-white",
] as const;

const DEFAULT_RANK_STYLE = "bg-gray-200 text-gray-700";

export function TopDestinationsList() {
  const { data } = useAdmin();
  const destinations = data.stats?.visitsPerDestination ?? [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Top Destinations</h2>
      {destinations.length === 0 ? (
        <p className="text-sm text-gray-400">No visitor data yet.</p>
      ) : (
        <div className="space-y-3">
          {destinations.slice(0, 8).map((d, index) => (
            <div
              key={d.destination}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-[#660B05]/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    RANK_STYLES[index] ?? DEFAULT_RANK_STYLE
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm font-medium text-gray-700 truncate">
                  {d.destination}
                </span>
              </div>
              <span className="text-sm font-semibold text-[#660B05]">
                {d.count} visits
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
