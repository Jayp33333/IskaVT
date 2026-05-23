import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import type { MessageRecord } from "../../types";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { MessageDetail } from "./MessageDetail";
import { MessageList } from "./MessageList";
import { MessagesToolbar } from "./MessagesToolbar";

export function MessagesTab() {
  const { messages, toast } = useAdmin();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<MessageRecord | null>(null);

  const handleToggleRead = async (m: MessageRecord) => {
    try {
      await messages.toggleMessageRead(m);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update message";
      toast.showToast(msg, "error");
    }
  };

  const requestDelete = (m: MessageRecord) => {
    setMessageToDelete(m);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;
    try {
      setDeleteLoading(true);
      await messages.deleteMessageById(messageToDelete._id, !messageToDelete.isRead);
      toast.showToast("Message deleted successfully!", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete message";
      toast.showToast(msg, "error");
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
      setMessageToDelete(null);
    }
  };

  return (
    <>
      <MessagesToolbar
        filter={messages.messageFilter}
        search={messages.messageSearch}
        unreadCount={messages.messagesUnread}
        onFilterChange={messages.setMessageFilter}
        onSearchChange={messages.setMessageSearch}
        onRefresh={() => messages.loadMessages(messages.messagesPage).catch(() => {})}
      />

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] min-h-[60vh]">
          <MessageList
            messages={messages.messages}
            loading={messages.messagesLoading}
            filter={messages.messageFilter}
            search={messages.messageSearch}
            selectedId={messages.selectedMessage?._id}
            page={messages.messagesPage}
            totalPages={messages.messagesTotalPages}
            onSelect={(m) => messages.openMessage(m).catch(() => {})}
            onPrev={() =>
              messages.loadMessages(Math.max(1, messages.messagesPage - 1)).catch(() => {})
            }
            onNext={() =>
              messages
                .loadMessages(
                  Math.min(messages.messagesTotalPages, messages.messagesPage + 1)
                )
                .catch(() => {})
            }
          />

          <MessageDetail
            message={messages.selectedMessage}
            onToggleRead={handleToggleRead}
            onDelete={requestDelete}
          />
        </div>
      </section>

      <ConfirmDialog
        open={deleteOpen && !!messageToDelete}
        title="Delete Message"
        prompt="Are you sure you want to delete this message?"
        confirmLabel={deleteLoading ? "Deleting…" : "Delete Message"}
        loading={deleteLoading}
        detail={
          messageToDelete && (
            <>
              <div className="text-sm font-semibold text-gray-900">
                {messageToDelete.name}
              </div>
              <div className="text-xs text-gray-600 mt-1">{messageToDelete.email}</div>
              <div className="text-xs text-gray-500 mt-2 line-clamp-3">
                {messageToDelete.message}
              </div>
            </>
          )
        }
        onCancel={() => {
          setDeleteOpen(false);
          setMessageToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </>
  );
}
