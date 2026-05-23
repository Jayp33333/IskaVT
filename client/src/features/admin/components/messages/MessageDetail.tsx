import { Inbox, Mail, MailOpen, Trash2 } from "lucide-react";
import type { MessageRecord } from "../../types";

type MessageDetailProps = {
  message: MessageRecord | null;
  onToggleRead: (m: MessageRecord) => void;
  onDelete: (m: MessageRecord) => void;
};

export function MessageDetail({ message, onToggleRead, onDelete }: MessageDetailProps) {
  if (!message) {
    return (
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-16">
          <Inbox className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-sm font-semibold text-gray-700">Select a message</p>
          <p className="text-xs text-gray-500 mt-1">
            Choose a message from the inbox to read its full contents.
          </p>
        </div>
      </div>
    );
  }

  const replyHref = `mailto:${message.email}?subject=${encodeURIComponent(
    "Re: Your message to ISKA"
  )}`;

  return (
    <div className="p-6 max-h-[70vh] overflow-y-auto">
      <article>
        <header className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{message.name}</h2>
              <a
                href={`mailto:${message.email}`}
                className="text-sm text-[#660B05] hover:underline"
              >
                {message.email}
              </a>
              <div className="text-xs text-gray-400 mt-1">
                Received {new Date(message.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleRead(message)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-[#660B05]/10 hover:border-[#660B05]/30 hover:text-[#660B05] text-gray-700 text-sm font-medium transition-all duration-200"
                title={message.isRead ? "Mark as unread" : "Mark as read"}
              >
                {message.isRead ? (
                  <>
                    <Mail className="w-4 h-4" />
                    Mark Unread
                  </>
                ) : (
                  <>
                    <MailOpen className="w-4 h-4" />
                    Mark Read
                  </>
                )}
              </button>
              <a
                href={replyHref}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#660B05] text-white text-sm font-medium hover:bg-[#8C1007] transition-all duration-200 shadow-sm"
              >
                <Mail className="w-4 h-4" />
                Reply
              </a>
              <button
                onClick={() => onDelete(message)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-800 text-red-700 text-sm font-medium transition-all duration-200"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </header>
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-100">
            {message.message}
          </pre>
        </div>
      </article>
    </div>
  );
}
