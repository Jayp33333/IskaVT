import { useCallback, useState } from "react";
import {
  logbookAPI,
  messageAPI,
  type LogbookStatsSummary,
} from "../../../services/api";
import type { MessageRecord, VisitorRecord } from "../types";

const RECENT_MESSAGES_LIMIT = 10;
const LATEST_ENTRIES_LIMIT = 10;

export type UseDashboardDataValue = {
  stats: LogbookStatsSummary | null;
  latestEntries: VisitorRecord[];
  recentMessages: MessageRecord[];
  messagesUnreadFromDashboard: number | null;
  loadDashboard: () => Promise<void>;
};

export function useDashboardData(): UseDashboardDataValue {
  const [stats, setStats] = useState<LogbookStatsSummary | null>(null);
  const [latestEntries, setLatestEntries] = useState<VisitorRecord[]>([]);
  const [recentMessages, setRecentMessages] = useState<MessageRecord[]>([]);
  const [messagesUnreadFromDashboard, setMessagesUnreadFromDashboard] =
    useState<number | null>(null);

  const loadDashboard = useCallback(async () => {
    const [statsRes, entriesRes, recentMsgRes] = await Promise.all([
      logbookAPI.getStatsSummary(),
      logbookAPI.getEntries(1, LATEST_ENTRIES_LIMIT),
      messageAPI
        .getMessages(1, RECENT_MESSAGES_LIMIT, { isRead: false })
        .catch(() => ({ data: [] as MessageRecord[], unreadCount: 0 } as const)),
    ]);

    setStats(statsRes.data);
    setLatestEntries(entriesRes.data || []);
    setRecentMessages(recentMsgRes.data || []);

    if (typeof (recentMsgRes as { unreadCount?: number }).unreadCount === "number") {
      setMessagesUnreadFromDashboard(
        (recentMsgRes as { unreadCount: number }).unreadCount
      );
    }
  }, []);

  return {
    stats,
    latestEntries,
    recentMessages,
    messagesUnreadFromDashboard,
    loadDashboard,
  };
}
