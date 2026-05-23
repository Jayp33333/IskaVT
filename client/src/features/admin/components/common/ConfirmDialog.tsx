import { Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { ModalShell } from "./ModalShell";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  prompt: ReactNode;
  detail?: ReactNode;
  warning?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDialog({
  open,
  title,
  subtitle = "This action cannot be undone",
  prompt,
  detail,
  warning = "⚠️ This action is permanent and cannot be undone.",
  confirmLabel,
  cancelLabel = "Cancel",
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <ModalShell
      open={open}
      title={title}
      subtitle={subtitle}
      maxWidthClassName="max-w-md"
      disableClose={loading}
      onClose={onCancel}
      icon={
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <Trash2 className="w-5 h-5 text-red-600" />
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white hover:bg-[#660B05]/10 hover:border-[#660B05]/30 hover:text-[#660B05] disabled:opacity-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Working…" : confirmLabel}
          </button>
        </div>
      }
    >
      <div className="p-5">
        <p className="text-sm text-gray-700 mb-4">{prompt}</p>
        {detail && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">{detail}</div>
        )}
        {warning && (
          <p className="text-xs text-red-600 font-medium">{warning}</p>
        )}
      </div>
    </ModalShell>
  );
}
