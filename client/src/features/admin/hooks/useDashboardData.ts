import { useCallback, useMemo, useRef, useState } from "react";
import {
  feedbackAPI,
  logbookAPI,
  messageAPI,
  type FeedbackStatsSummary,
  type LogbookStatsSummary,
} from "../../../services/api";
import type { FeedbackRecord, MessageRecord, VisitorRecord } from "../types";

const RECENT_MESSAGES_LIMIT = 10;
const LATEST_ENTRIES_LIMIT = 10;
const RECENT_FEEDBACK_LIMIT = 8;

export type UseDashboardDataValue = {
  stats: LogbookStatsSummary | null;
  latestEntries: VisitorRecord[];
  recentMessages: MessageRecord[];
  recentFeedback: FeedbackRecord[];
  feedbackStats: FeedbackStatsSummary | null;
  messagesUnreadFromDashboard: number | null;
  /** True once the first dashboard load has completed successfully. */
  hasLoaded: boolean;
  loadDashboard: () => Promise<void>;
};

export function useDashboardData(): UseDashboardDataValue {
  const [stats, setStats] = useState<LogbookStatsSummary | null>(null);
  const [latestEntries, setLatestEntries] = useState<VisitorRecord[]>([]);
  const [recentMessages, setRecentMessages] = useState<MessageRecord[]>([]);
  const [recentFeedback, setRecentFeedback] = useState<FeedbackRecord[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStatsSummary | null>(null);
  const [messagesUnreadFromDashboard, setMessagesUnreadFromDashboard] =
    useState<number | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Drops out-of-order responses (e.g. a slow auto-refresh landing after a
  // post-mutation reload).
  const requestIdRef = useRef(0);

  const loadDashboard = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    const request = Promise.all([
      logbookAPI.getStatsSummary(),
      logbookAPI.getEntries(1, LATEST_ENTRIES_LIMIT),
      messageAPI
        .getMessages(1, RECENT_MESSAGES_LIMIT, { isRead: false })
        .catch(() => ({ data: [] as MessageRecord[], unreadCount: 0 } as const)),
      feedbackAPI
        .getFeedback(1, RECENT_FEEDBACK_LIMIT)
        .catch(() => ({ data: [] as FeedbackRecord[] } as const)),
      feedbackAPI
        .getStatsSummary()
        .catch(() => ({ data: { averageRating: null, totalCount: 0 } } as const)),
    ]);

    let results: Awaited<typeof request>;
    try {
      results = await request;
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      throw err;
    }
    const [statsRes, entriesRes, recentMsgRes, recentFeedbackRes, feedbackStatsRes] =
      results;

    if (requestId !== requestIdRef.current) return;

    setStats(statsRes.data);
    setLatestEntries(entriesRes.data || []);
    setRecentMessages(recentMsgRes.data || []);
    setRecentFeedback(recentFeedbackRes.data || []);
    setFeedbackStats(feedbackStatsRes.data ?? null);
    setHasLoaded(true);

    if (typeof (recentMsgRes as { unreadCount?: number }).unreadCount === "number") {
      setMessagesUnreadFromDashboard(
        (recentMsgRes as { unreadCount: number }).unreadCount
      );
    }
  }, []);

  return useMemo(
    () => ({
      stats,
      latestEntries,
      recentMessages,
      recentFeedback,
      feedbackStats,
      messagesUnreadFromDashboard,
      hasLoaded,
      loadDashboard,
    }),
    [
      stats,
      latestEntries,
      recentMessages,
      recentFeedback,
      feedbackStats,
      messagesUnreadFromDashboard,
      hasLoaded,
      loadDashboard,
    ]
  );
}
