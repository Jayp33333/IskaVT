import { Bell, Mail, Users } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { formatTimeAgo } from "../../utils/time";
import type { AdminNotification } from "../../types";
import { AdminButton } from "../common/adminUi";
import { AdminDropdownPanel } from "./AdminDropdownPanel";

type NotificationsDropdownProps = {
  open: boolean;
  onToggle: (next: boolean) => void;
};

export function NotificationsDropdown({
  open,
  onToggle,
}: NotificationsDropdownProps) {
  const { notifications, data, messages, setTab } = useAdmin();
  const {
    notifications: items,
    unreadNotificationsCount,
    lastSeenNotificationAt,
    markAllNotificationsRead,
  } = notifications;

  const handleClick = () => {
    const next = !open;
    onToggle(next);
    if (next) {
      data.loadDashboard().catch(() => {});
    }
  };

  const close = () => onToggle(false);

  const handleSelect = (n: AdminNotification) => {
    close();
    markAllNotificationsRead();
    setTab(n.tab);

    if (n.kind === "message" && n.recordId) {
      const target =
        data.recentMessages.find((m) => m._id === n.recordId) ||
        messages.messages.find((m) => m._id === n.recordId);
      if (target) {
        messages.openMessage(target).catch(() => {});
      }
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className="group relative rounded-xl p-2 transition-all hover:bg-[#660B05]/10"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Notifications${
          unreadNotificationsCount ? `, ${unreadNotificationsCount} unread` : ""
        }`}
      >
        <Bell className="h-5 w-5 text-gray-600 transition-colors group-hover:text-[#660B05]" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#660B05] px-1 text-[10px] font-bold text-white">
            {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
          </span>
        )}
      </button>

      {open && (
        <AdminDropdownPanel
          title="Notifications"
          onClose={close}
          desktopWidthClass="sm:w-[min(24rem,calc(100vw-2rem))]"
          badge={
            unreadNotificationsCount > 0 ? (
              <span className="shrink-0 rounded-full bg-[#660B05]/10 px-2 py-0.5 text-[11px] font-semibold text-[#660B05]">
                {unreadNotificationsCount} new
              </span>
            ) : (
              <span className="shrink-0 text-[11px] font-medium text-gray-400">
                All caught up
              </span>
            )
          }
          footer={
            <AdminButton
              variant="ghost"
              className="w-full"
              disabled={unreadNotificationsCount === 0}
              onClick={markAllNotificationsRead}
            >
              Mark all as read
            </AdminButton>
          }
        >
          {items.length === 0 ? (
            <div className="px-2 py-8 text-center text-sm text-gray-500">
              No recent activity yet.
            </div>
          ) : (
            items.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                isUnread={
                  new Date(n.createdAt).getTime() > lastSeenNotificationAt
                }
                onSelect={() => handleSelect(n)}
              />
            ))
          )}
        </AdminDropdownPanel>
      )}
    </div>
  );
}

type NotificationItemProps = {
  notification: AdminNotification;
  isUnread: boolean;
  onSelect: () => void;
};

function NotificationItem({ notification, isUnread, onSelect }: NotificationItemProps) {
  const isVisitor = notification.kind === "visitor";
  const Icon = isVisitor ? Users : Mail;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`mb-1 w-full rounded-xl p-3 text-left transition-colors ${
        isUnread
          ? "border-l-2 border-[#660B05] bg-amber-50/80 hover:bg-amber-50"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            isVisitor ? "bg-[#660B05]/10" : "bg-blue-100"
          }`}
        >
          <Icon
            className={`h-4 w-4 ${isVisitor ? "text-[#660B05]" : "text-blue-600"}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div
              className={`truncate text-sm ${
                isUnread ? "font-bold text-gray-900" : "font-semibold text-gray-800"
              }`}
            >
              {notification.title}
            </div>
            {isUnread && (
              <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#660B05]" />
            )}
          </div>
          <div className="line-clamp-2 text-xs text-gray-500">
            {notification.description}
          </div>
          <div className="mt-1 text-[11px] text-gray-400">
            {formatTimeAgo(notification.createdAt)}
          </div>
        </div>
      </div>
    </button>
  );
}
