import type { MessageFilter, MessageRecord } from "../../types";
import { MessageListItem } from "./MessageListItem";

type MessageListProps = {
  messages: MessageRecord[];
  loading: boolean;
  filter: MessageFilter;
  search: string;
  selectedId?: string;
  page: number;
  totalPages: number;
  onSelect: (m: MessageRecord) => void;
  onPrev: () => void;
  onNext: () => void;
};

function emptyMessage(filter: MessageFilter, search: string): string {
  if (search) return "No messages match your search.";
  if (filter === "unread") return "No unread messages.";
  if (filter === "read") return "No read messages yet.";
  return "No messages yet.";
}

export function MessageList({
  messages,
  loading,
  filter,
  search,
  selectedId,
  page,
  totalPages,
  onSelect,
  onPrev,
  onNext,
}: MessageListProps) {
  const showEmpty = !loading && messages.length === 0;
  const showLoading = loading && messages.length === 0;

  return (
    <div className="border-r border-gray-200 max-h-[70vh] overflow-y-auto">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between sticky top-0 z-10">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Inbox
        </span>
        <span className="text-xs text-gray-500">
          Page {page} / {totalPages}
        </span>
      </div>

      {showLoading ? (
        <div className="p-8 text-center text-sm text-gray-500">Loading…</div>
      ) : showEmpty ? (
        <div className="p-8 text-center text-sm text-gray-500">
          {emptyMessage(filter, search)}
        </div>
      ) : (
        <ul>
          {messages.map((m) => (
            <MessageListItem
              key={m._id}
              message={m}
              active={selectedId === m._id}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}

      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
        <button
          onClick={onPrev}
          disabled={page <= 1 || loading}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white hover:bg-[#660B05]/10 hover:border-[#660B05]/30 hover:text-[#660B05] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Prev
        </button>
        <span className="text-xs text-gray-500">
          {page} / {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={page >= totalPages || loading}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white hover:bg-[#660B05]/10 hover:border-[#660B05]/30 hover:text-[#660B05] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}
