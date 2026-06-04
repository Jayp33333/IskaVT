import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import type { MessageRecord } from "../../types";
import { AdminCard } from "../common/adminUi";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { MessageDetail } from "./MessageDetail";
import { MessageList } from "./MessageList";
import { MessagesToolbar } from "./MessagesToolbar";

export function MessagesTab() {
  const { messages, toast } = useAdmin();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<MessageRecord | null>(null);

  const showDetailMobile = !!messages.selectedMessage;

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

      <AdminCard padding="none" className="overflow-hidden">
        <div className="grid min-h-[min(70vh,640px)] grid-cols-1 lg:grid-cols-[minmax(0,340px)_1fr] xl:grid-cols-[minmax(0,380px)_1fr]">
          <div className={showDetailMobile ? "hidden lg:block" : "block"}>
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
          </div>

          <div
            className={`border-gray-200 lg:border-l ${
              showDetailMobile ? "block" : "hidden lg:block"
            }`}
          >
            <MessageDetail
              message={messages.selectedMessage}
              onToggleRead={handleToggleRead}
              onDelete={requestDelete}
              onBack={() => messages.setSelectedMessage(null)}
            />
          </div>
        </div>
      </AdminCard>

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
              <div className="mt-1 text-xs text-gray-600">{messageToDelete.email}</div>
              <div className="mt-2 line-clamp-3 text-xs text-gray-500">
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
