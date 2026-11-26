import type { AdminSettings, RefreshOption } from "./types";

/**
 * Re-exported from the shared logbook options so the admin forms offer the
 * same values the public logbook form records. Keep these names: other admin
 * modules import them from here.
 */
export {
  LOGBOOK_DESTINATIONS as DESTINATIONS,
  LOGBOOK_VISITOR_TYPES as VISITOR_TYPES,
} from "../../constants/logbookOptions";

export const LATEST_VISITOR_COLORS = [
  "#2196F3",
  "#4CAF50",
  "#FFC107",
  "#FF9800",
  "#9C27B0",
];

export const SETTINGS_STORAGE_KEY = "admin_settings";

export const ADMIN_AUTH_SESSION_KEY = "iska_admin_auth";

export const NOTIFICATIONS_SEEN_KEY = "admin_notifications_last_seen_at";

export const DEFAULT_SETTINGS: AdminSettings = {
  alertsEnabled: true,
  refreshInterval: "30s",
  defaultExportFormat: "pdf",
};

export const REFRESH_INTERVAL_MS: Record<RefreshOption, number> = {
  off: 0,
  "15s": 15_000,
  "30s": 30_000,
  "1m": 60_000,
  "5m": 5 * 60_000,
};

export const REFRESH_LABELS: Record<RefreshOption, string> = {
  off: "Never (manual only)",
  "15s": "Every 15 seconds",
  "30s": "Every 30 seconds",
  "1m": "Every 1 minute",
  "5m": "Every 5 minutes",
};

export const TOAST_DEFAULT_DURATION_MS = 3000;
export const TOAST_ACTIVITY_DURATION_MS = 4000;
export const TOAST_SHORT_DURATION_MS = 2500;
