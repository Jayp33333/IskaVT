import { Mail } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import type { MessageRecord } from "../../types";
import { AdminButton } from "../common/adminUi";
import { AdminDropdownPanel } from "./AdminDropdownPanel";

type EmailDropdownProps = {
  open: boolean;
  onToggle: (next: boolean) => void;
};

const PREVIEW_LIMIT = 5;

export function EmailDropdown({ open, onToggle }: EmailDropdownProps) {
  const { messages, data, setTab } = useAdmin();
  const unreadCount = messages.messagesUnread;

  const previewSource: MessageRecord[] =
    messages.messages.length > 0 ? messages.messages : data.recentMessages;

  const handleClick = () => {
    const next = !open;
    onToggle(next);
    if (next) {
      data.loadDashboard().catch(() => {});
    }
  };

  const close = () => onToggle(false);

  const openMessageFromPreview = (m: MessageRecord) => {
    close();
    setTab("messages");
    messages.openMessage(m).catch(() => {});
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className="group relative rounded-xl p-2 transition-all hover:bg-[#660B05]/10"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Messages${unreadCount ? `, ${unreadCount} unread` : ""}`}
      >
        <Mail className="h-5 w-5 text-gray-600 transition-colors group-hover:text-[#660B05]" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#660B05] px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <AdminDropdownPanel
          title="Messages"
          onClose={close}
          desktopWidthClass="sm:w-[min(20rem,calc(100vw-2rem))]"
          badge={
            unreadCount > 0 ? (
              <span className="shrink-0 rounded-full bg-[#660B05]/10 px-2 py-0.5 text-[11px] font-semibold text-[#660B05]">
                {unreadCount} unread
              </span>
            ) : undefined
          }
          footer={
            <AdminButton
              variant="ghost"
              className="w-full"
              onClick={() => {
                close();
                setTab("messages");
              }}
            >
              View all messages
            </AdminButton>
          }
        >
          {previewSource.length === 0 ? (
            <div className="px-2 py-8 text-center text-sm text-gray-500">
              {messages.messagesLoading ? "Loading messages…" : "No messages yet"}
            </div>
          ) : (
            previewSource.slice(0, PREVIEW_LIMIT).map((m) => {
              const initial = (m.name || m.email || "?").charAt(0).toUpperCase();
              return (
                <button
                  key={m._id}
                  type="button"
                  onClick={() => openMessageFromPreview(m)}
                  className="w-full rounded-xl p-3 text-left transition-colors hover:bg-[#660B05]/8"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${
                        m.isRead ? "bg-gray-400" : "bg-[#660B05]"
                      }`}
                    >
                      {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="truncate text-sm font-semibold text-gray-900">
                          {m.name}
                        </div>
                        {!m.isRead && (
                          <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#660B05]" />
                        )}
                      </div>
                      <div className="truncate text-xs text-gray-500">{m.message}</div>
                      <div className="mt-1 text-[11px] text-gray-400">
                        {new Date(m.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </AdminDropdownPanel>
      )}
    </div>
  );
}
