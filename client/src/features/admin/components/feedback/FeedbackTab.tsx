import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import type { FeedbackRecord } from "../../types";
import { AdminCard } from "../common/adminUi";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { FeedbackDetail } from "./FeedbackDetail";
import { FeedbackList } from "./FeedbackList";
import { FeedbackToolbar } from "./FeedbackToolbar";

export function FeedbackTab() {
  const { feedback, toast } = useAdmin();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<FeedbackRecord | null>(null);

  const showDetailMobile = !!feedback.selectedFeedback;

  const handleToggleRead = async (f: FeedbackRecord) => {
    try {
      await feedback.toggleFeedbackRead(f);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update feedback";
      toast.showToast(msg, "error");
    }
  };

  const requestDelete = (f: FeedbackRecord) => {
    setFeedbackToDelete(f);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!feedbackToDelete) return;
    try {
      setDeleteLoading(true);
      await feedback.deleteFeedbackById(
        feedbackToDelete._id,
        !feedbackToDelete.isRead
      );
      toast.showToast("Feedback deleted successfully!", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete feedback";
      toast.showToast(msg, "error");
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
      setFeedbackToDelete(null);
    }
  };

  return (
    <>
      <FeedbackToolbar
        filter={feedback.feedbackFilter}
        search={feedback.feedbackSearch}
        unreadCount={feedback.feedbackUnread}
        onFilterChange={feedback.setFeedbackFilter}
        onSearchChange={feedback.setFeedbackSearch}
        onRefresh={() => feedback.loadFeedback(feedback.feedbackPage).catch(() => {})}
      />

      <AdminCard padding="none" className="overflow-hidden">
        <div className="grid min-h-[min(70vh,640px)] grid-cols-1 lg:grid-cols-[minmax(0,340px)_1fr] xl:grid-cols-[minmax(0,380px)_1fr]">
          <div className={showDetailMobile ? "hidden lg:block" : "block"}>
            <FeedbackList
              feedbackList={feedback.feedbackList}
              loading={feedback.feedbackLoading}
              filter={feedback.feedbackFilter}
              search={feedback.feedbackSearch}
              selectedId={feedback.selectedFeedback?._id}
              page={feedback.feedbackPage}
              totalPages={feedback.feedbackTotalPages}
              onSelect={(f) => feedback.openFeedback(f).catch(() => {})}
              onPrev={() =>
                feedback.loadFeedback(Math.max(1, feedback.feedbackPage - 1)).catch(() => {})
              }
              onNext={() =>
                feedback
                  .loadFeedback(
                    Math.min(feedback.feedbackTotalPages, feedback.feedbackPage + 1)
                  )
                  .catch(() => {})
              }
            />
          </div>

          <div
            className={`border-gray-200 lg:border-l ${
              showDetailMobile ? "block" : "hidden lg:block"
            }`}
          >
            <FeedbackDetail
              feedback={feedback.selectedFeedback}
              onToggleRead={handleToggleRead}
              onDelete={requestDelete}
              onBack={() => feedback.setSelectedFeedback(null)}
            />
          </div>
        </div>
      </AdminCard>

      <ConfirmDialog
        open={deleteOpen && !!feedbackToDelete}
        title="Delete Feedback"
        prompt="Are you sure you want to delete this feedback?"
        confirmLabel={deleteLoading ? "Deleting…" : "Delete Feedback"}
        loading={deleteLoading}
        detail={
          feedbackToDelete && (
            <>
              <div className="text-sm font-semibold text-gray-900">
                {feedbackToDelete.fullName || "Guest"}
              </div>
              <div className="mt-1 text-xs text-gray-600">
                {feedbackToDelete.rating} / 5 stars
              </div>
              <div className="mt-2 line-clamp-3 text-xs text-gray-500">
                {feedbackToDelete.comment}
              </div>
            </>
          )
        }
        onCancel={() => {
          setDeleteOpen(false);
          setFeedbackToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </>
  );
}
