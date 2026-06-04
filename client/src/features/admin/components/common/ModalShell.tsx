import { X } from "lucide-react";
import type { ReactNode } from "react";

type ModalShellProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  maxWidthClassName?: string;
  disableClose?: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function ModalShell({
  open,
  title,
  subtitle,
  icon,
  maxWidthClassName = "max-w-lg",
  disableClose = false,
  onClose,
  children,
  footer,
}: ModalShellProps) {
  if (!open) return null;

  const handleClose = () => {
    if (!disableClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />
      <div
        className={`relative max-h-[92vh] w-full overflow-hidden rounded-t-2xl border border-gray-200/80 bg-white shadow-2xl sm:rounded-2xl ${maxWidthClassName}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {icon}
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-gray-900">{title}</div>
              {subtitle && (
                <div className="truncate text-[11px] text-gray-500">{subtitle}</div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={disableClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-[#660B05]/10 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto">{children}</div>

        {footer && (
          <div className="border-t border-gray-100 bg-gray-50/80 px-5 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
