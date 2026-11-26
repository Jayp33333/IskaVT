import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { messageAPI } from "../../../services/api";
import type { MessageFilter, MessageRecord } from "../types";

const PAGE_SIZE = 50;
const SEARCH_DEBOUNCE_MS = 250;

export type UseMessagesOptions = {
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
  filter?: MessageFilter;
};

export type UseMessagesValue = {
  messages: MessageRecord[];
  messagesPage: number;
  messagesTotalPages: number;
  messagesUnread: number;
  messagesLoading: boolean;
  messageSearch: string;
  messageFilter: MessageFilter;
  selectedMessage: MessageRecord | null;
  setMessageSearch: (q: string) => void;
  setMessageFilter: (f: MessageFilter) => void;
  setSelectedMessage: (m: MessageRecord | null) => void;
  setMessagesUnread: (
    next: number | ((prev: number) => number)
  ) => void;
  loadMessages: (page: number, opts?: LoadOpts) => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  openMessage: (m: MessageRecord) => Promise<void>;
  toggleMessageRead: (m: MessageRecord) => Promise<MessageRecord>;
  deleteMessageById: (id: string, wasUnread: boolean) => Promise<void>;
};

export function useMessages({
  enabled = true,
  onLoadError,
}: UseMessagesOptions = {}): UseMessagesValue {
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [messagesUnread, setMessagesUnread] = useState(0);
  const [messagesPage, setMessagesPage] = useState(1);
  const [messagesTotalPages, setMessagesTotalPages] = useState(1);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageSearch, setMessageSearch] = useState("");
  const [messageFilter, setMessageFilter] = useState<MessageFilter>("all");
  const [selectedMessage, setSelectedMessage] = useState<MessageRecord | null>(null);

  // Current search/filter for calls that don't pass them explicitly
  // (pagination, Refresh). Kept in refs so `loadMessages` stays stable.
  const searchRef = useRef(messageSearch);
  const filterRef = useRef(messageFilter);
  const onLoadErrorRef = useRef(onLoadError);
  // Only the most recent request may write state; older responses are dropped.
  const requestIdRef = useRef(0);
  // search/filter of the most recent list load (see the load function).
  const lastQueryKeyRef = useRef<string | null>(null);

  useEffect(() => {
    searchRef.current = messageSearch;
    filterRef.current = messageFilter;
  }, [messageSearch, messageFilter]);

  useEffect(() => {
    onLoadErrorRef.current = onLoadError;
  }, [onLoadError]);

  const loadMessages = useCallback(async (page: number, opts: LoadOpts = {}) => {
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
      setMessagesLoading(true);
      const res = await messageAPI.getMessages(page, PAGE_SIZE, {
        isRead: filter === "all" ? undefined : filter === "read",
        search: search || undefined,
      });
      if (!isLatest()) return;
      setMessages(res.data || []);
      setMessagesUnread(res.unreadCount || 0);
      setMessagesPage(res.pagination?.page || page);
      setMessagesTotalPages(res.pagination?.pages || 1);
    } catch (err) {
      if (isLatest()) throw err;
    } finally {
      if (isLatest()) setMessagesLoading(false);
    }
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const res = await messageAPI.getUnreadCount();
      setMessagesUnread(res.unreadCount || 0);
    } catch {
      // Badge errors are non-critical
    }
  }, []);

  const openMessage = useCallback(async (m: MessageRecord) => {
    setSelectedMessage(m);
    if (m.isRead) return;

    try {
      const res = await messageAPI.updateMessage(m._id, { isRead: true });
      const updated = res.data;
      setMessages((prev) => prev.map((x) => (x._id === m._id ? updated : x)));
      setSelectedMessage(updated);
      setMessagesUnread((n) => Math.max(0, n - 1));
    } catch {
      // Selection still works even if the persisting read fails.
    }
  }, []);

  const toggleMessageRead = useCallback(async (m: MessageRecord) => {
    const res = await messageAPI.updateMessage(m._id, { isRead: !m.isRead });
    const updated = res.data;
    setMessages((prev) => prev.map((x) => (x._id === m._id ? updated : x)));
    setSelectedMessage((prev) => (prev?._id === m._id ? updated : prev));
    setMessagesUnread((n) => (updated.isRead ? Math.max(0, n - 1) : n + 1));
    return updated;
  }, []);

  const deleteMessageById = useCallback(
    async (id: string, wasUnread: boolean) => {
      await messageAPI.deleteMessage(id);
      setMessages((prev) => prev.filter((x) => x._id !== id));
      setSelectedMessage((prev) => (prev?._id === id ? null : prev));
      if (wasUnread) setMessagesUnread((n) => Math.max(0, n - 1));
    },
    []
  );

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
      loadMessages(1, { search: messageSearch, filter: messageFilter }).catch(
        (err: unknown) => onLoadErrorRef.current?.(err)
      );
    }, delay);
    return () => clearTimeout(handle);
  }, [enabled, messageSearch, messageFilter, loadMessages]);

  return useMemo(
    () => ({
      messages,
      messagesPage,
      messagesTotalPages,
      messagesUnread,
      messagesLoading,
      messageSearch,
      messageFilter,
      selectedMessage,
      setMessageSearch,
      setMessageFilter,
      setSelectedMessage,
      setMessagesUnread,
      loadMessages,
      refreshUnreadCount,
      openMessage,
      toggleMessageRead,
      deleteMessageById,
    }),
    [
      messages,
      messagesPage,
      messagesTotalPages,
      messagesUnread,
      messagesLoading,
      messageSearch,
      messageFilter,
      selectedMessage,
      loadMessages,
      refreshUnreadCount,
      openMessage,
      toggleMessageRead,
      deleteMessageById,
    ]
  );
}
