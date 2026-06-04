import type { FeedbackFilter, FeedbackRecord } from "../../types";
import { AdminPagination } from "../common/adminUi";
import { FeedbackListItem } from "./FeedbackListItem";

type FeedbackListProps = {
  feedbackList: FeedbackRecord[];
  loading: boolean;
  filter: FeedbackFilter;
  search: string;
  selectedId?: string;
  page: number;
  totalPages: number;
  onSelect: (f: FeedbackRecord) => void;
  onPrev: () => void;
  onNext: () => void;
};

function emptyMessage(filter: FeedbackFilter, search: string): string {
  if (search) return "No feedback matches your search.";
  if (filter === "unread") return "No unread feedback.";
  if (filter === "read") return "No read feedback yet.";
  return "No tour feedback yet.";
}

export function FeedbackList({
  feedbackList,
  loading,
  filter,
  search,
  selectedId,
  page,
  totalPages,
  onSelect,
  onPrev,
  onNext,
}: FeedbackListProps) {
  const showEmpty = !loading && feedbackList.length === 0;
  const showLoading = loading && feedbackList.length === 0;

  return (
    <div className="flex max-h-[70vh] flex-col lg:max-h-none lg:min-h-[min(70vh,640px)]">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-gray-50/90 px-4 py-3 backdrop-blur-sm">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Feedback
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
            {feedbackList.map((f) => (
              <FeedbackListItem
                key={f._id}
                feedback={f}
                active={selectedId === f._id}
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
