import { useCallback, useEffect, useState } from "react";
import { feedbackAPI } from "../../../services/api";
import type { FeedbackFilter, FeedbackRecord } from "../types";

const PAGE_SIZE = 50;
const SEARCH_DEBOUNCE_MS = 250;

type LoadOpts = {
  search?: string;
  filter?: FeedbackFilter;
};

export type UseFeedbackValue = {
  feedbackList: FeedbackRecord[];
  feedbackPage: number;
  feedbackTotalPages: number;
  feedbackUnread: number;
  feedbackLoading: boolean;
  feedbackSearch: string;
  feedbackFilter: FeedbackFilter;
  selectedFeedback: FeedbackRecord | null;
  setFeedbackSearch: (q: string) => void;
  setFeedbackFilter: (f: FeedbackFilter) => void;
  setSelectedFeedback: (f: FeedbackRecord | null) => void;
  loadFeedback: (page: number, opts?: LoadOpts) => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  openFeedback: (f: FeedbackRecord) => Promise<void>;
  toggleFeedbackRead: (f: FeedbackRecord) => Promise<FeedbackRecord>;
  deleteFeedbackById: (id: string, wasUnread: boolean) => Promise<void>;
};

export function useFeedback(): UseFeedbackValue {
  const [feedbackList, setFeedbackList] = useState<FeedbackRecord[]>([]);
  const [feedbackUnread, setFeedbackUnread] = useState(0);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [feedbackTotalPages, setFeedbackTotalPages] = useState(1);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [feedbackFilter, setFeedbackFilter] = useState<FeedbackFilter>("all");
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRecord | null>(null);

  const loadFeedback = useCallback(
    async (page: number, opts: LoadOpts = {}) => {
      const filter = opts.filter ?? feedbackFilter;
      const search = opts.search ?? feedbackSearch;

      try {
        setFeedbackLoading(true);
        const res = await feedbackAPI.getFeedback(page, PAGE_SIZE, {
          isRead: filter === "all" ? undefined : filter === "read",
          search: search || undefined,
        });
        setFeedbackList(res.data || []);
        setFeedbackUnread(res.unreadCount || 0);
        setFeedbackPage(res.pagination?.page || page);
        setFeedbackTotalPages(res.pagination?.pages || 1);
      } finally {
        setFeedbackLoading(false);
      }
    },
    [feedbackFilter, feedbackSearch]
  );

  const refreshUnreadCount = useCallback(async () => {
    try {
      const res = await feedbackAPI.getUnreadCount();
      setFeedbackUnread(res.unreadCount || 0);
    } catch {
      // Badge errors are non-critical
    }
  }, []);

  const openFeedback = useCallback(async (f: FeedbackRecord) => {
    setSelectedFeedback(f);
    if (f.isRead) return;

    try {
      const res = await feedbackAPI.updateFeedback(f._id, { isRead: true });
      const updated = res.data;
      setFeedbackList((prev) => prev.map((x) => (x._id === f._id ? updated : x)));
      setSelectedFeedback(updated);
      setFeedbackUnread((n) => Math.max(0, n - 1));
    } catch {
      // Selection still works even if the persisting read fails.
    }
  }, []);

  const toggleFeedbackRead = useCallback(async (f: FeedbackRecord) => {
    const res = await feedbackAPI.updateFeedback(f._id, { isRead: !f.isRead });
    const updated = res.data;
    setFeedbackList((prev) => prev.map((x) => (x._id === f._id ? updated : x)));
    setSelectedFeedback((prev) => (prev?._id === f._id ? updated : prev));
    setFeedbackUnread((n) => (updated.isRead ? Math.max(0, n - 1) : n + 1));
    return updated;
  }, []);

  const deleteFeedbackById = useCallback(async (id: string, wasUnread: boolean) => {
    await feedbackAPI.deleteFeedback(id);
    setFeedbackList((prev) => prev.filter((x) => x._id !== id));
    setSelectedFeedback((prev) => (prev?._id === id ? null : prev));
    if (wasUnread) setFeedbackUnread((n) => Math.max(0, n - 1));
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      loadFeedback(1, { search: feedbackSearch, filter: feedbackFilter }).catch(() => {});
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbackSearch, feedbackFilter]);

  return {
    feedbackList,
    feedbackPage,
    feedbackTotalPages,
    feedbackUnread,
    feedbackLoading,
    feedbackSearch,
    feedbackFilter,
    selectedFeedback,
    setFeedbackSearch,
    setFeedbackFilter,
    setSelectedFeedback,
    loadFeedback,
    refreshUnreadCount,
    openFeedback,
    toggleFeedbackRead,
    deleteFeedbackById,
  };
}
