import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { clearAdminSession } from "../utils/adminAuth";

import { TOAST_ACTIVITY_DURATION_MS } from "../constants";
import { useAdminLifecycle } from "../hooks/useAdminLifecycle";
import { useAdminNotifications } from "../hooks/useAdminNotifications";
import { useAdminSettings } from "../hooks/useAdminSettings";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import { useDashboardData } from "../hooks/useDashboardData";
import { useFeedback } from "../hooks/useFeedback";
import { useMessages } from "../hooks/useMessages";
import { useToast } from "../hooks/useToast";
import { useVisitors } from "../hooks/useVisitors";
import type { AdminNotification, AdminTab, VisitorPeriod } from "../types";
import { AdminContext, type AdminContextValue } from "./adminContextValue";

type AdminProviderProps = {
  children: ReactNode;
};

export function AdminProvider({ children }: AdminProviderProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [visitorPeriod, setVisitorPeriod] = useState<VisitorPeriod>("daily");
  // `loading` is only true during the very first load (full-page spinner).
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();
  const { showToast } = toast;
  const settings = useAdminSettings();
  const data = useDashboardData();
  const visitors = useVisitors();

  const handleMessagesLoadError = useCallback(
    (err: unknown) => {
      showToast(
        err instanceof Error && err.message ? err.message : "Failed to load messages",
        "error"
      );
    },
    [showToast]
  );
  const handleFeedbackLoadError = useCallback(
    (err: unknown) => {
      showToast(
        err instanceof Error && err.message ? err.message : "Failed to load feedback",
        "error"
      );
    },
    [showToast]
  );

  // Inbox lists only load while their tab is open; unread badges refresh
  // separately via refreshUnreadCount.
  const messages = useMessages({
    enabled: tab === "messages",
    onLoadError: handleMessagesLoadError,
  });
  const feedback = useFeedback({
    enabled: tab === "feedback",
    onLoadError: handleFeedbackLoadError,
  });

  const handleNewActivity = useCallback(
    (incoming: AdminNotification[]) => {
      const newest = incoming[0];
      const extra = incoming.length - 1;
      const message =
        extra > 0 ? `${newest.title} (and ${extra} more)` : newest.title;
      showToast(message, "success", TOAST_ACTIVITY_DURATION_MS);
    },
    [showToast]
  );

  const notifications = useAdminNotifications({
    latestEntries: data.latestEntries,
    recentMessages: data.recentMessages,
    alertsEnabled: settings.settings.alertsEnabled,
    ready: data.hasLoaded,
    onNewActivity: handleNewActivity,
  });

  const { reloadAll, refreshTick } = useAdminLifecycle({
    tab,
    data,
    visitors,
    messages,
    feedback,
    toast,
    setLoading,
    setError,
  });

  useAutoRefresh({
    intervalKey: settings.settings.refreshInterval,
    onTick: refreshTick,
  });

  const logout = useCallback(() => {
    clearAdminSession();
    navigate("/admin/login");
  }, [navigate]);

  const value = useMemo<AdminContextValue>(
    () => ({
      tab,
      setTab,
      loading,
      error,
      visitorPeriod,
      setVisitorPeriod,
      data,
      visitors,
      messages,
      feedback,
      settings,
      toast,
      notifications,
      logout,
      reloadAll,
    }),
    [
      tab,
      loading,
      error,
      visitorPeriod,
      data,
      visitors,
      messages,
      feedback,
      settings,
      toast,
      notifications,
      logout,
      reloadAll,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

