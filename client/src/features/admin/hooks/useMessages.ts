import { useCallback, useEffect, useState } from "react";
import { messageAPI } from "../../../services/api";
import type { MessageFilter, MessageRecord } from "../types";

const PAGE_SIZE = 50;
const SEARCH_DEBOUNCE_MS = 250;

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

export function useMessages(): UseMessagesValue {
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [messagesUnread, setMessagesUnread] = useState(0);
  const [messagesPage, setMessagesPage] = useState(1);
  const [messagesTotalPages, setMessagesTotalPages] = useState(1);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageSearch, setMessageSearch] = useState("");
  const [messageFilter, setMessageFilter] = useState<MessageFilter>("all");
  const [selectedMessage, setSelectedMessage] = useState<MessageRecord | null>(null);

  const loadMessages = useCallback(
    async (page: number, opts: LoadOpts = {}) => {
      const filter = opts.filter ?? messageFilter;
      const search = opts.search ?? messageSearch;

      try {
        setMessagesLoading(true);
        const res = await messageAPI.getMessages(page, PAGE_SIZE, {
          isRead: filter === "all" ? undefined : filter === "read",
          search: search || undefined,
        });
        setMessages(res.data || []);
        setMessagesUnread(res.unreadCount || 0);
        setMessagesPage(res.pagination?.page || page);
        setMessagesTotalPages(res.pagination?.pages || 1);
      } finally {
        setMessagesLoading(false);
      }
    },
    [messageFilter, messageSearch]
  );

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

  // Debounce search/filter changes
  useEffect(() => {
    const handle = setTimeout(() => {
      loadMessages(1, { search: messageSearch, filter: messageFilter }).catch(() => {});
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageSearch, messageFilter]);

  return {
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
  };
}
