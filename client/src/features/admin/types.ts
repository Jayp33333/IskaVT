import type { LogbookRecord, ContactMessageRecord } from "../../services/api";

export type AdminTab = "dashboard" | "visitors" | "messages";

export type VisitorPeriod = "daily" | "weekly" | "monthly" | "yearly";

export type MessageFilter = "all" | "unread" | "read";

export type ToastKind = "success" | "error";

export type ToastState = {
  message: string;
  type: ToastKind;
};

export type RefreshOption = "off" | "15s" | "30s" | "1m" | "5m";

export type ExportFormat = "pdf" | "csv";

export type ExportRange = "today" | "week" | "month";

export type AdminSettings = {
  alertsEnabled: boolean;
  refreshInterval: RefreshOption;
  defaultExportFormat: ExportFormat;
};

export type AdminNotification = {
  id: string;
  kind: "visitor" | "message";
  title: string;
  description: string;
  createdAt: string;
  tab: "visitors" | "messages";
  recordId?: string;
};

export type AggregatedTimelinePoint = {
  date: string;
  count: number;
  label: string;
};

export type VisitorRecord = LogbookRecord;
export type MessageRecord = ContactMessageRecord;
