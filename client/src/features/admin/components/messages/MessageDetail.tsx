import { Inbox, Mail, MailOpen, Trash2 } from "lucide-react";
import type { MessageRecord } from "../../types";
import { AdminButton, DetailBackBar } from "../common/adminUi";

type MessageDetailProps = {
  message: MessageRecord | null;
  onToggleRead: (m: MessageRecord) => void;
  onDelete: (m: MessageRecord) => void;
  onBack?: () => void;
};

export function MessageDetail({
  message,
  onToggleRead,
  onDelete,
  onBack,
}: MessageDetailProps) {
  if (!message) {
    return (
      <div className="flex max-h-[70vh] flex-col items-center justify-center p-6 py-16 text-center text-gray-500 lg:max-h-none lg:min-h-[min(70vh,640px)]">
        <Inbox className="mb-3 h-12 w-12 text-gray-300" />
        <p className="text-sm font-semibold text-gray-700">Select a message</p>
        <p className="mt-1 text-xs text-gray-500">
          Choose a message from the inbox to read its full contents.
        </p>
      </div>
    );
  }

  const replyHref = `mailto:${message.email}?subject=${encodeURIComponent(
    "Re: Your message to ISKA"
  )}`;

  return (
    <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-6 lg:max-h-none lg:min-h-[min(70vh,640px)]">
      {onBack && <DetailBackBar onBack={onBack} />}

      <article>
        <header className="mb-4 border-b border-gray-100 pb-4">
          <div className="flex flex-col gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900">{message.name}</h2>
              <a
                href={`mailto:${message.email}`}
                className="text-sm text-[#660B05] hover:underline"
              >
                {message.email}
              </a>
              <div className="mt-1 text-xs text-gray-400">
                Received {new Date(message.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => onToggleRead(message)}
              >
                {message.isRead ? (
                  <>
                    <Mail className="h-4 w-4" />
                    Unread
                  </>
                ) : (
                  <>
                    <MailOpen className="h-4 w-4" />
                    Read
                  </>
                )}
              </AdminButton>
              <a href={replyHref} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#660B05] px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[#8C1007]">
                <Mail className="h-4 w-4" />
                Reply
              </a>
              <AdminButton
                variant="danger"
                size="sm"
                onClick={() => onDelete(message)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </AdminButton>
            </div>
          </div>
        </header>
        <pre className="whitespace-pre-wrap rounded-xl border border-gray-100 bg-gray-50/80 p-4 font-sans text-sm leading-relaxed text-gray-800">
          {message.message}
        </pre>
      </article>
    </div>
  );
}
