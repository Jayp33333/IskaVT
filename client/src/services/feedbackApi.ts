import { apiRequest, buildQuery } from "./apiClient";
import type { Pagination } from "./logbookApi";

export type FeedbackInput = {
  rating: number;
  comment: string;
  fullName?: string | null;
  logbookEntryId?: string | null;
};

export type FeedbackRecord = {
  _id: string;
  rating: number;
  comment: string;
  fullName: string;
  logbookEntryId: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FeedbackListResponse = {
  success: boolean;
  data: FeedbackRecord[];
  unreadCount: number;
  pagination: Pagination;
};

export type FeedbackResponse = {
  success: boolean;
  data: FeedbackRecord;
};

export type FeedbackStatsSummary = {
  averageRating: number | null;
  totalCount: number;
};

export const feedbackAPI = {
  submitFeedback(payload: FeedbackInput) {
    return apiRequest<FeedbackResponse>("/feedback", {
      method: "POST",
      body: payload,
    });
  },

  getFeedback(
    page = 1,
    limit = 50,
    opts: { isRead?: boolean; search?: string } = {}
  ) {
    return apiRequest<FeedbackListResponse>(
      `/feedback${buildQuery({
        page,
        limit,
        isRead: opts.isRead,
        search: opts.search,
      })}`
    );
  },

  getUnreadCount() {
    return apiRequest<{ success: boolean; unreadCount: number }>(
      "/feedback/unread-count"
    );
  },

  getStatsSummary() {
    return apiRequest<{ success: boolean; data: FeedbackStatsSummary }>(
      "/feedback/stats/summary"
    );
  },

  updateFeedback(id: string, patch: { isRead?: boolean }) {
    return apiRequest<FeedbackResponse>(`/feedback/${id}`, {
      method: "PATCH",
      body: patch,
    });
  },

  deleteFeedback(id: string) {
    return apiRequest<{ success: boolean; data: FeedbackRecord }>(
      `/feedback/${id}`,
      { method: "DELETE" }
    );
  },
};
