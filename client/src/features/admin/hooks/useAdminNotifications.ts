import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NOTIFICATIONS_SEEN_KEY } from "../constants";
import type {
  AdminNotification,
  MessageRecord,
  VisitorRecord,
} from "../types";

const MAX_NOTIFICATIONS = 20;

function readSeenTimestamp(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(NOTIFICATIONS_SEEN_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

function persistSeenTimestamp(value: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTIFICATIONS_SEEN_KEY, String(value));
  } catch {
    // ignore storage errors
  }
}

function buildVisitorNotifications(
  entries: VisitorRecord[]
): AdminNotification[] {
  return entries.map((v) => ({
    id: `visitor:${v._id}`,
    kind: "visitor",
    title: `New visitor: ${v.fullName}`,
    description: `${v.visitorType} • ${v.destination}${
      v.purpose ? ` — ${v.purpose}` : ""
    }`,
    createdAt: v.createdAt || v.timeIn,
    tab: "visitors",
    recordId: v._id,
  }));
}

function buildMessageNotifications(
  messages: MessageRecord[]
): AdminNotification[] {
  return messages.map((m) => ({
    id: `message:${m._id}`,
    kind: "message",
    title: `New message from ${m.name}`,
    description: m.message,
    createdAt: m.createdAt,
    tab: "messages",
    recordId: m._id,
  }));
}

export type UseAdminNotificationsParams = {
  latestEntries: VisitorRecord[];
  recentMessages: MessageRecord[];
  alertsEnabled: boolean;
  onNewActivity: (notifications: AdminNotification[]) => void;
};

export type UseAdminNotificationsValue = {
  notifications: AdminNotification[];
  unreadNotificationsCount: number;
  lastSeenNotificationAt: number;
  markAllNotificationsRead: () => void;
};

export function useAdminNotifications({
  latestEntries,
  recentMessages,
  alertsEnabled,
  onNewActivity,
}: UseAdminNotificationsParams): UseAdminNotificationsValue {
  const [lastSeenNotificationAt, setLastSeenNotificationAt] =
    useState<number>(readSeenTimestamp);

  const notifications = useMemo<AdminNotification[]>(() => {
    const combined = [
      ...buildVisitorNotifications(latestEntries),
      ...buildMessageNotifications(recentMessages),
    ];
    return combined
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, MAX_NOTIFICATIONS);
  }, [latestEntries, recentMessages]);

  const unreadNotificationsCount = useMemo(
    () =>
      notifications.filter(
        (n) => new Date(n.createdAt).getTime() > lastSeenNotificationAt
      ).length,
    [notifications, lastSeenNotificationAt]
  );

  const markAllNotificationsRead = useCallback(() => {
    const now = Date.now();
    setLastSeenNotificationAt(now);
    persistSeenTimestamp(now);
  }, []);

  // Track new arrivals so the caller can show toast pings (when enabled).
  const knownIdsRef = useRef<Set<string> | null>(null);
  const alertsEnabledRef = useRef(alertsEnabled);
  const onNewActivityRef = useRef(onNewActivity);

  useEffect(() => {
    alertsEnabledRef.current = alertsEnabled;
  }, [alertsEnabled]);

  useEffect(() => {
    onNewActivityRef.current = onNewActivity;
  }, [onNewActivity]);

  useEffect(() => {
    if (knownIdsRef.current === null) {
      knownIdsRef.current = new Set(notifications.map((n) => n.id));
      return;
    }

    const known = knownIdsRef.current;
    const incoming = notifications.filter(
      (n) =>
        !known.has(n.id) &&
        new Date(n.createdAt).getTime() > lastSeenNotificationAt
    );

    if (incoming.length > 0 && alertsEnabledRef.current) {
      onNewActivityRef.current(incoming);
    }

    knownIdsRef.current = new Set(notifications.map((n) => n.id));
  }, [notifications, lastSeenNotificationAt]);

  return {
    notifications,
    unreadNotificationsCount,
    lastSeenNotificationAt,
    markAllNotificationsRead,
  };
}
