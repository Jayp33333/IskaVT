import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { feedbackAPI } from "../../../services/api";
import type { FeedbackFilter, FeedbackRecord } from "../types";

const PAGE_SIZE = 50;
const SEARCH_DEBOUNCE_MS = 250;

export type UseFeedbackOptions = {
  /**
   * Load the list only while enabled (i.e. while its tab is open). Turning it
   * on triggers one immediate page-1 load; search/filter changes while enabled
   * are debounced. Unread-count refreshes are independent of this flag.
   */
  enabled?: boolean;
  /** Called when an automatic (enable/search/filter) load fails. */
  onLoadError?: (err: unknown) => void;
};

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

export function useFeedback({
  enabled = true,
  onLoadError,
}: UseFeedbackOptions = {}): UseFeedbackValue {
  const [feedbackList, setFeedbackList] = useState<FeedbackRecord[]>([]);
  const [feedbackUnread, setFeedbackUnread] = useState(0);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [feedbackTotalPages, setFeedbackTotalPages] = useState(1);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [feedbackFilter, setFeedbackFilter] = useState<FeedbackFilter>("all");
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRecord | null>(null);

  // Current search/filter for calls that don't pass them explicitly
  // (pagination, Refresh). Kept in refs so `loadFeedback` stays stable.
  const searchRef = useRef(feedbackSearch);
  const filterRef = useRef(feedbackFilter);
  const onLoadErrorRef = useRef(onLoadError);
  // Only the most recent request may write state; older responses are dropped.
  const requestIdRef = useRef(0);
  // search/filter of the most recent list load (see the load function).
  const lastQueryKeyRef = useRef<string | null>(null);

  useEffect(() => {
    searchRef.current = feedbackSearch;
    filterRef.current = feedbackFilter;
  }, [feedbackSearch, feedbackFilter]);

  useEffect(() => {
    onLoadErrorRef.current = onLoadError;
  }, [onLoadError]);

  const loadFeedback = useCallback(async (page: number, opts: LoadOpts = {}) => {
    const filter = opts.filter ?? filterRef.current;
    const search = opts.search ?? searchRef.current;
    // A page number only means something for the query it was shown with: if
    // search/filter changed since the last load (e.g. a refresh tick lands
    // inside the search debounce), start from page 1.
    const queryKey = `${filter}|${search}`;
    if (queryKey !== lastQueryKeyRef.current) page = 1;
    lastQueryKeyRef.current = queryKey;
    const requestId = ++requestIdRef.current;
    const isLatest = () => requestId === requestIdRef.current;

    try {
      setFeedbackLoading(true);
      const res = await feedbackAPI.getFeedback(page, PAGE_SIZE, {
        isRead: filter === "all" ? undefined : filter === "read",
        search: search || undefined,
      });
      if (!isLatest()) return;
      setFeedbackList(res.data || []);
      setFeedbackUnread(res.unreadCount || 0);
      setFeedbackPage(res.pagination?.page || page);
      setFeedbackTotalPages(res.pagination?.pages || 1);
    } catch (err) {
      if (isLatest()) throw err;
    } finally {
      if (isLatest()) setFeedbackLoading(false);
    }
  }, []);

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

  // Single owner of the list load: once immediately when enabled (tab opens),
  // then debounced on search/filter changes while it stays enabled.
  const wasEnabledRef = useRef(false);
  useEffect(() => {
    if (!enabled) {
      wasEnabledRef.current = false;
      return;
    }
    const delay = wasEnabledRef.current ? SEARCH_DEBOUNCE_MS : 0;
    wasEnabledRef.current = true;

    const handle = setTimeout(() => {
      loadFeedback(1, { search: feedbackSearch, filter: feedbackFilter }).catch(
        (err: unknown) => onLoadErrorRef.current?.(err)
      );
    }, delay);
    return () => clearTimeout(handle);
  }, [enabled, feedbackSearch, feedbackFilter, loadFeedback]);

  return useMemo(
    () => ({
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
    }),
    [
      feedbackList,
      feedbackPage,
      feedbackTotalPages,
      feedbackUnread,
      feedbackLoading,
      feedbackSearch,
      feedbackFilter,
      selectedFeedback,
      loadFeedback,
      refreshUnreadCount,
      openFeedback,
      toggleFeedbackRead,
      deleteFeedbackById,
    ]
  );
}
