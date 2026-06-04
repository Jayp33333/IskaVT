import { useCallback, useEffect } from "react";
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
  reloadAll: () => Promise<void>;
  refreshTick: () => void;
};

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
  const reloadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        data.loadDashboard(),
        visitors.loadVisitors(1),
        messages.refreshUnreadCount(),
        feedback.refreshUnreadCount(),
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load admin data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [data, visitors, messages, feedback, setLoading, setError]);

  const refreshTick = useCallback(() => {
    data.loadDashboard().catch(() => {});
    if (tab === "visitors") {
      visitors.loadVisitors(visitors.visitorsPage).catch(() => {});
    } else if (tab === "messages") {
      messages
        .loadMessages(messages.messagesPage, {
          search: messages.messageSearch,
          filter: messages.messageFilter,
        })
        .catch(() => {});
    } else if (tab === "feedback") {
      feedback
        .loadFeedback(feedback.feedbackPage, {
          search: feedback.feedbackSearch,
          filter: feedback.feedbackFilter,
        })
        .catch(() => {});
    } else {
      messages.refreshUnreadCount().catch(() => {});
      feedback.refreshUnreadCount().catch(() => {});
    }
  }, [data, tab, visitors, messages, feedback]);

  useEffect(() => {
    void reloadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab === "visitors") {
      visitors.loadVisitors(visitors.visitorsPage).catch(() => {});
    } else if (tab === "messages") {
      messages
        .loadMessages(1, {
          search: messages.messageSearch,
          filter: messages.messageFilter,
        })
        .catch((err: unknown) => {
          const msg =
            err instanceof Error ? err.message : "Failed to load messages";
          toast.showToast(msg, "error");
        });
    } else if (tab === "feedback") {
      feedback
        .loadFeedback(1, {
          search: feedback.feedbackSearch,
          filter: feedback.feedbackFilter,
        })
        .catch((err: unknown) => {
          const msg =
            err instanceof Error ? err.message : "Failed to load feedback";
          toast.showToast(msg, "error");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return { reloadAll, refreshTick };
}
