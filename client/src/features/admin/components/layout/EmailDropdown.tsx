import { Mail } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import type { MessageRecord } from "../../types";

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

  const openMessageFromPreview = (m: MessageRecord) => {
    onToggle(false);
    setTab("messages");
    messages.openMessage(m).catch(() => {});
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="relative p-2 hover:bg-[#660B05]/10 rounded-lg transition-all duration-200 group"
        aria-label={`Messages${unreadCount ? `, ${unreadCount} unread` : ""}`}
      >
        <Mail className="w-5 h-5 text-gray-600 group-hover:text-[#660B05] transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold rounded-full bg-[#660B05] text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => onToggle(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Messages</h3>
              {unreadCount > 0 && (
                <span className="text-[11px] font-semibold text-[#660B05] bg-[#660B05]/10 px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="p-2">
              {previewSource.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
                  {messages.messagesLoading ? "Loading messages…" : "No messages yet"}
                </div>
              ) : (
                previewSource.slice(0, PREVIEW_LIMIT).map((m) => {
                  const initial = (m.name || m.email || "?").charAt(0).toUpperCase();
                  return (
                    <button
                      key={m._id}
                      onClick={() => openMessageFromPreview(m)}
                      className="w-full text-left p-3 hover:bg-[#660B05]/10 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                            m.isRead ? "bg-gray-400" : "bg-[#660B05]"
                          }`}
                        >
                          {initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {m.name}
                            </div>
                            {!m.isRead && (
                              <span className="inline-block w-2 h-2 rounded-full bg-[#660B05]" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{m.message}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(m.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="p-3 border-t border-gray-200">
              <button
                onClick={() => {
                  onToggle(false);
                  setTab("messages");
                }}
                className="w-full text-center text-sm text-[#660B05] hover:underline"
              >
                View All Messages
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
