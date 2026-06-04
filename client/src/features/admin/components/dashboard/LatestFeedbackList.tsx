import { MessageSquare } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import type { FeedbackRecord } from "../../types";
import { StarRatingDisplay } from "../common/StarRatingDisplay";
import { AdminButton, AdminCard, AdminCardHeader } from "../common/adminUi";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

type LatestFeedbackRowProps = {
  feedback: FeedbackRecord;
  onSelect: () => void;
};

function LatestFeedbackRow({ feedback, onSelect }: LatestFeedbackRowProps) {
  const initial = (feedback.fullName || "G").charAt(0).toUpperCase();

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors sm:gap-4 ${
        !feedback.isRead
          ? "bg-amber-50/80 ring-1 ring-amber-100"
          : "hover:bg-gray-50/80"
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#660B05] to-[#8C1007] text-sm font-semibold text-white shadow-sm">
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-gray-900">
          {feedback.fullName || "Guest"}
        </div>
        <StarRatingDisplay rating={feedback.rating} size="md" showLabel />
        <div className="mt-1 truncate text-xs text-gray-500">{feedback.comment}</div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-xs font-medium text-gray-900">
          {formatDate(feedback.createdAt)}
        </div>
        <div className="text-xs text-gray-500">{formatTime(feedback.createdAt)}</div>
      </div>
    </button>
  );
}

export function LatestFeedbackList() {
  const { data, setTab, feedback } = useAdmin();
  const items = data.recentFeedback.slice(0, 5);
  const feedbackStats = data.feedbackStats;
  const hasAverage =
    feedbackStats &&
    feedbackStats.totalCount > 0 &&
    feedbackStats.averageRating != null;

  return (
    <AdminCard>
      <AdminCardHeader
        title="Latest Feedback"
        subtitle={hasAverage ? `Avg ${feedbackStats!.averageRating!.toFixed(1)} / 5` : undefined}
        action={
          <div className="flex items-center gap-2">
            {hasAverage && (
              <div className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-1.5 sm:flex">
                <MessageSquare className="h-4 w-4 text-[#660B05]" />
                <StarRatingDisplay
                  rating={Math.round(feedbackStats!.averageRating!)}
                  size="md"
                  showLabel
                />
              </div>
            )}
            <AdminButton variant="ghost" size="sm" onClick={() => setTab("feedback")}>
              View all
            </AdminButton>
          </div>
        }
      />

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No tour feedback yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <LatestFeedbackRow
              key={item._id}
              feedback={item}
              onSelect={() => {
                setTab("feedback");
                void feedback.openFeedback(item);
              }}
            />
          ))}
        </div>
      )}
    </AdminCard>
  );
}
