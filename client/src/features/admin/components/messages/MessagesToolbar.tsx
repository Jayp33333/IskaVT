import { Search, X } from "lucide-react";
import type { MessageFilter } from "../../types";

type MessagesToolbarProps = {
  filter: MessageFilter;
  search: string;
  unreadCount: number;
  onFilterChange: (filter: MessageFilter) => void;
  onSearchChange: (search: string) => void;
  onRefresh: () => void;
};

const FILTERS: readonly MessageFilter[] = ["all", "unread", "read"] as const;

export function MessagesToolbar({
  filter,
  search,
  unreadCount,
  onFilterChange,
  onSearchChange,
  onRefresh,
}: MessagesToolbarProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Messages</h1>
          <p className="text-sm text-gray-500">
            Messages submitted through the website contact form.
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-[#660B05] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#660B05]" />
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => onFilterChange(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
                  filter === f
                    ? "bg-white text-[#660B05] shadow-sm"
                    : "text-gray-600 hover:text-[#660B05]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05] min-w-[250px]"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#660B05]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-[#660B05]/10 hover:border-[#660B05]/30 hover:text-[#660B05] text-gray-700 transition-all duration-200"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
