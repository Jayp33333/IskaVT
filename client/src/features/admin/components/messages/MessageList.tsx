import type { MessageFilter, MessageRecord } from "../../types";
import { AdminPagination } from "../common/adminUi";
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
    <div className="flex max-h-[70vh] flex-col lg:max-h-none lg:min-h-[min(70vh,640px)]">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-gray-50/90 px-4 py-3 backdrop-blur-sm">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Inbox
        </span>
        <span className="text-xs tabular-nums text-gray-500">
          {page} / {totalPages}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
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
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/80 px-4 py-3">
        <AdminPagination
          page={page}
          totalPages={totalPages}
          onPrev={onPrev}
          onNext={onNext}
          size="sm"
        />
      </div>
    </div>
  );
}
