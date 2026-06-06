import type { AdminSettings, RefreshOption } from "./types";

export const VISITOR_TYPES = [
  "Student",
  "Faculty",
  "Staff",
  "Parent",
  "Visitor",
  "Alumni",
  "Other",
];

export const DESTINATIONS = [
  "Grandstand",
  "Lab 1",
  "Lab 2",
  "Lab 3",
  "Library",
  "Administration Building",
  "Classroom Building",
  "Cafeteria",
  "Gymnasium",
  "Auditorium",
  "Computer Lab",
  "Science Lab",
  "Main Building",
  "Student Center",
  "Other",
];

export const CHART_COLORS = [
  "#FFC107",
  "#F44336",
  "#FF9800",
  "#2196F3",
  "#4CAF50",
  "#9C27B0",
  "#009688",
  "#E91E63",
  "#00BCD4",
  "#FF5722",
  "#3F51B5",
  "#8BC34A",
  "#FFEB3B",
  "#795548",
  "#607D8B",
];

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
