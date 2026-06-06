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

export { useAdmin } from "./adminContextValue";

type AdminProviderProps = {
  children: ReactNode;
};

export function AdminProvider({ children }: AdminProviderProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [visitorPeriod, setVisitorPeriod] = useState<VisitorPeriod>("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();
  const settings = useAdminSettings();
  const data = useDashboardData();
  const visitors = useVisitors();
  const messages = useMessages();
  const feedback = useFeedback();

  const handleNewActivity = useCallback(
    (incoming: AdminNotification[]) => {
      const newest = incoming[0];
      const extra = incoming.length - 1;
      const message =
        extra > 0 ? `${newest.title} (and ${extra} more)` : newest.title;
      toast.showToast(message, "success", TOAST_ACTIVITY_DURATION_MS);
    },
    [toast]
  );

  const notifications = useAdminNotifications({
    latestEntries: data.latestEntries,
    recentMessages: data.recentMessages,
    alertsEnabled: settings.settings.alertsEnabled,
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

