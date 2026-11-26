import { useCallback, useEffect, useRef } from "react";
import type { AdminTab } from "../types";
import type { UseDashboardDataValue } from "./useDashboardData";
import type { UseFeedbackValue } from "./useFeedback";
import type { UseMessagesValue } from "./useMessages";
import type { UseToastValue } from "./useToast";
import type { UseVisitorsValue } from "./useVisitors";

type UseAdminLifecycleParams = {
  tab: AdminTab;
  data: UseDashboardDataValue;
  visitors: UseVisitorsValue;
  messages: UseMessagesValue;
  feedback: UseFeedbackValue;
  toast: UseToastValue;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export type UseAdminLifecycleValue = {
  /** Reloads dashboard + visitors + unread badges. Never throws. */
  reloadAll: () => Promise<void>;
  /** One auto-refresh pass for whatever is on screen. Never throws. */
  refreshTick: () => void;
};

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

/**
 * Initial load, auto-refresh pass and per-tab loads.
 *
 * Messages/Feedback list loads are owned by their hooks (`enabled` flag), so
 * they are intentionally not triggered here on tab change.
 */
export function useAdminLifecycle({
  tab,
  data,
  visitors,
  messages,
  feedback,
  toast,
  setLoading,
  setError,
}: UseAdminLifecycleParams): UseAdminLifecycleValue {
  const { loadDashboard } = data;
  const { loadVisitors, visitorsPage } = visitors;
  const {
    loadMessages,
    messagesPage,
    refreshUnreadCount: refreshMessagesUnread,
  } = messages;
  const {
    loadFeedback,
    feedbackPage,
    refreshUnreadCount: refreshFeedbackUnread,
  } = feedback;
  const { showToast } = toast;

  // The full-page spinner is only for the very first load; Retry and later
  // reloads keep the current content on screen.
  const initialLoadStartedRef = useRef(false);

  const reloadAll = useCallback(async () => {
    const isInitial = !initialLoadStartedRef.current;
    initialLoadStartedRef.current = true;

    try {
      if (isInitial) setLoading(true);
      await Promise.all([
        loadDashboard(),
        loadVisitors(1),
        refreshMessagesUnread(),
        refreshFeedbackUnread(),
      ]);
      setError(null);
    } catch (err) {
      setError(errorMessage(err, "Failed to load admin data"));
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [
    loadDashboard,
    loadVisitors,
    refreshMessagesUnread,
    refreshFeedbackUnread,
    setLoading,
    setError,
  ]);

  const refreshTick = useCallback(() => {
    loadDashboard().then(
      () => setError(null),
      (err: unknown) =>
        setError(errorMessage(err, "Failed to refresh admin data"))
    );

    if (tab === "visitors") {
      loadVisitors(visitorsPage).catch(() => {});
    } else if (tab === "messages") {
      // Uses the hook's current search/filter.
      loadMessages(messagesPage).catch(() => {});
    } else if (tab === "feedback") {
      loadFeedback(feedbackPage).catch(() => {});
    }

    // Badges for inboxes that weren't just reloaded as a list.
    if (tab !== "messages") refreshMessagesUnread().catch(() => {});
    if (tab !== "feedback") refreshFeedbackUnread().catch(() => {});
  }, [
    tab,
    loadDashboard,
    loadVisitors,
    visitorsPage,
    loadMessages,
    messagesPage,
    loadFeedback,
    feedbackPage,
    refreshMessagesUnread,
    refreshFeedbackUnread,
    setError,
  ]);

  useEffect(() => {
    void reloadAll();
    // Mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab !== "visitors") return;
    loadVisitors(visitorsPage).catch((err: unknown) => {
      showToast(errorMessage(err, "Failed to load visitors"), "error");
    });
    // Only when the Visitors tab is opened, not on every page change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return { reloadAll, refreshTick };
}
