import type { MessageRecord } from "../../types";

type MessageListItemProps = {
  message: MessageRecord;
  active: boolean;
  onSelect: (message: MessageRecord) => void;
};

export function MessageListItem({ message, active, onSelect }: MessageListItemProps) {
  const initial = (message.name || message.email || "?").charAt(0).toUpperCase();

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(message)}
        className={`flex w-full gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors ${
          active
            ? "bg-[#660B05]/10 ring-1 ring-inset ring-[#660B05]/20"
            : "hover:bg-gray-50/80"
        } ${!message.isRead && !active ? "bg-amber-50/60" : ""}`}
      >
        <div
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
            message.isRead ? "bg-gray-400" : "bg-[#660B05]"
          }`}
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div
              className={`text-sm truncate ${
                !message.isRead
                  ? "font-bold text-gray-900"
                  : "font-semibold text-gray-800"
              }`}
            >
              {message.name}
            </div>
            {!message.isRead && (
              <span className="inline-block w-2 h-2 rounded-full bg-[#660B05] shrink-0" />
            )}
          </div>
          <div className="text-xs text-gray-500 truncate">{message.email}</div>
          <div className="text-xs text-gray-600 truncate mt-1">{message.message}</div>
          <div className="text-[11px] text-gray-400 mt-1">
            {new Date(message.createdAt).toLocaleString()}
          </div>
        </div>
      </button>
    </li>
  );
}
