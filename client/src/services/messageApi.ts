import { apiRequest, buildQuery } from "./apiClient";
import type { Pagination } from "./logbookApi";

export type ContactMessageInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactMessageRecord = {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MessageListResponse = {
  success: boolean;
  data: ContactMessageRecord[];
  unreadCount: number;
  pagination: Pagination;
};

export type MessageResponse = {
  success: boolean;
  data: ContactMessageRecord;
};

export const messageAPI = {
  sendMessage(payload: ContactMessageInput) {
    return apiRequest<MessageResponse>("/messages", {
      method: "POST",
      body: payload,
    });
  },

  getMessages(
    page = 1,
    limit = 50,
    opts: { isRead?: boolean; search?: string } = {}
  ) {
    return apiRequest<MessageListResponse>(
      `/messages${buildQuery({
        page,
        limit,
        isRead: opts.isRead,
        search: opts.search,
      })}`
    );
  },

  getUnreadCount() {
    return apiRequest<{ success: boolean; unreadCount: number }>(
      "/messages/unread-count"
    );
  },

  updateMessage(id: string, patch: { isRead?: boolean }) {
    return apiRequest<MessageResponse>(`/messages/${id}`, {
      method: "PATCH",
      body: patch,
    });
  },

  deleteMessage(id: string) {
    return apiRequest<{ success: boolean; data: ContactMessageRecord }>(
      `/messages/${id}`,
      { method: "DELETE" }
    );
  },
};
