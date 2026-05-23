import { Bell, Mail, Users } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { formatTimeAgo } from "../../utils/time";
import type { AdminNotification } from "../../types";

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

  const handleSelect = (n: AdminNotification) => {
    onToggle(false);
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
        onClick={handleClick}
        className="relative p-2 hover:bg-[#660B05]/10 rounded-lg transition-all duration-200 group"
        aria-label={`Notifications${
          unreadNotificationsCount ? `, ${unreadNotificationsCount} unread` : ""
        }`}
      >
        <Bell className="w-5 h-5 text-gray-600 group-hover:text-[#660B05] transition-colors" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold rounded-full bg-[#660B05] text-white">
            {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => onToggle(false)} />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-[28rem] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              {unreadNotificationsCount > 0 ? (
                <span className="text-[11px] font-semibold text-[#660B05] bg-[#660B05]/10 px-2 py-0.5 rounded-full">
                  {unreadNotificationsCount} new
                </span>
              ) : (
                <span className="text-[11px] font-medium text-gray-400">
                  All caught up
                </span>
              )}
            </div>

            <div className="p-2">
              {items.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
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
            </div>

            <div className="p-3 border-t border-gray-200">
              <button
                onClick={markAllNotificationsRead}
                disabled={unreadNotificationsCount === 0}
                className="w-full text-center text-sm text-[#660B05] hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
              >
                Mark All as Read
              </button>
            </div>
          </div>
        </>
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
      onClick={onSelect}
      className={`w-full text-left p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
        isUnread
          ? "bg-[#FFF7EC] hover:bg-[#FFEFD5] border-l-2 border-[#660B05]"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isVisitor ? "bg-[#660B05]/10" : "bg-blue-100"
          }`}
        >
          <Icon
            className={`w-4 h-4 ${isVisitor ? "text-[#660B05]" : "text-blue-600"}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div
              className={`text-sm truncate ${
                isUnread ? "font-bold text-gray-900" : "font-semibold text-gray-800"
              }`}
            >
              {notification.title}
            </div>
            {isUnread && (
              <span className="inline-block w-2 h-2 rounded-full bg-[#660B05] shrink-0" />
            )}
          </div>
          <div className="text-xs text-gray-500 line-clamp-2">
            {notification.description}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            {formatTimeAgo(notification.createdAt)}
          </div>
        </div>
      </div>
    </button>
  );
}
