import { createContext, useContext } from "react";
import type { useAdminNotifications } from "../hooks/useAdminNotifications";
import type { useAdminSettings } from "../hooks/useAdminSettings";
import type { useDashboardData } from "../hooks/useDashboardData";
import type { useFeedback } from "../hooks/useFeedback";
import type { useMessages } from "../hooks/useMessages";
import type { useToast } from "../hooks/useToast";
import type { useVisitors } from "../hooks/useVisitors";
import type { AdminTab, VisitorPeriod } from "../types";

type DashboardDataHook = ReturnType<typeof useDashboardData>;
type VisitorsHook = ReturnType<typeof useVisitors>;
type MessagesHook = ReturnType<typeof useMessages>;
type FeedbackHook = ReturnType<typeof useFeedback>;
type SettingsHook = ReturnType<typeof useAdminSettings>;
type ToastHook = ReturnType<typeof useToast>;
type NotificationsHook = ReturnType<typeof useAdminNotifications>;

export type AdminContextValue = {
  tab: AdminTab;
  setTab: (tab: AdminTab) => void;

  loading: boolean;
  error: string | null;

  visitorPeriod: VisitorPeriod;
  setVisitorPeriod: (p: VisitorPeriod) => void;

  data: DashboardDataHook;
  visitors: VisitorsHook;
  messages: MessagesHook;
  feedback: FeedbackHook;
  settings: SettingsHook;
  toast: ToastHook;
  notifications: NotificationsHook;

  logout: () => void;
  reloadAll: () => Promise<void>;
};

export const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return ctx;
}
