import type { FeedbackRecord } from "../../types";
import { StarRatingDisplay } from "../common/StarRatingDisplay";

type FeedbackListItemProps = {
  feedback: FeedbackRecord;
  active: boolean;
  onSelect: (feedback: FeedbackRecord) => void;
};

export function FeedbackListItem({ feedback, active, onSelect }: FeedbackListItemProps) {
  const initial = (feedback.fullName || "G").charAt(0).toUpperCase();

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(feedback)}
        className={`flex w-full gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors ${
          active
            ? "bg-[#660B05]/10 ring-1 ring-inset ring-[#660B05]/20"
            : "hover:bg-gray-50/80"
        } ${!feedback.isRead && !active ? "bg-amber-50/60" : ""}`}
      >
        <div
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
            feedback.isRead ? "bg-gray-400" : "bg-[#660B05]"
          }`}
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div
              className={`text-sm truncate ${
                !feedback.isRead
                  ? "font-bold text-gray-900"
                  : "font-semibold text-gray-800"
              }`}
            >
              {feedback.fullName || "Guest"}
            </div>
            {!feedback.isRead && (
              <span className="inline-block w-2 h-2 rounded-full bg-[#660B05] shrink-0" />
            )}
          </div>
          <div className="mt-0.5">
            <StarRatingDisplay rating={feedback.rating} showLabel />
          </div>
          <div className="text-xs text-gray-600 truncate mt-1">{feedback.comment}</div>
          <div className="text-[11px] text-gray-400 mt-1">
            {new Date(feedback.createdAt).toLocaleString()}
          </div>
        </div>
      </button>
    </li>
  );
}
