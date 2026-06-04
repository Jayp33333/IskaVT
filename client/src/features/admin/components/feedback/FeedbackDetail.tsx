import { Mail, MailOpen, MessageSquare, Trash2 } from "lucide-react";
import type { FeedbackRecord } from "../../types";
import { StarRatingDisplay } from "../common/StarRatingDisplay";
import { AdminButton, DetailBackBar } from "../common/adminUi";

type FeedbackDetailProps = {
  feedback: FeedbackRecord | null;
  onToggleRead: (f: FeedbackRecord) => void;
  onDelete: (f: FeedbackRecord) => void;
  onBack?: () => void;
};

export function FeedbackDetail({
  feedback,
  onToggleRead,
  onDelete,
  onBack,
}: FeedbackDetailProps) {
  if (!feedback) {
    return (
      <div className="flex max-h-[70vh] flex-col items-center justify-center p-6 py-16 text-center text-gray-500 lg:max-h-none lg:min-h-[min(70vh,640px)]">
        <MessageSquare className="mb-3 h-12 w-12 text-gray-300" />
        <p className="text-sm font-semibold text-gray-700">Select feedback</p>
        <p className="mt-1 text-xs text-gray-500">
          Choose an entry from the list to view the full rating and comment.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-6 lg:max-h-none lg:min-h-[min(70vh,640px)]">
      {onBack && <DetailBackBar onBack={onBack} />}

      <article>
        <header className="mb-4 border-b border-gray-100 pb-4">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="mb-2 text-lg font-bold text-gray-900">
                {feedback.fullName || "Guest"}
              </h2>
              <StarRatingDisplay rating={feedback.rating} size="md" showLabel />
              <div className="mt-2 text-xs text-gray-400">
                Submitted {new Date(feedback.createdAt).toLocaleString()}
              </div>
              {feedback.logbookEntryId && (
                <div className="mt-2 text-xs text-gray-500">
                  Visitor log ID:{" "}
                  <span className="font-mono text-gray-700">
                    {feedback.logbookEntryId}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => onToggleRead(feedback)}
              >
                {feedback.isRead ? (
                  <>
                    <Mail className="h-4 w-4" />
                    Unread
                  </>
                ) : (
                  <>
                    <MailOpen className="h-4 w-4" />
                    Read
                  </>
                )}
              </AdminButton>
              <AdminButton
                variant="danger"
                size="sm"
                onClick={() => onDelete(feedback)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </AdminButton>
            </div>
          </div>
        </header>

        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            Comment
          </h3>
          <p className="whitespace-pre-wrap leading-relaxed text-gray-800">
            {feedback.comment}
          </p>
        </div>
      </article>
    </div>
  );
}
