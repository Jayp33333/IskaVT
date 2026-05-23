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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div
        className={`relative w-full ${maxWidthClassName} bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden`}
      >
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <div>
              <div className="text-sm font-bold text-gray-800">{title}</div>
              {subtitle && (
                <div className="text-[11px] text-gray-500">{subtitle}</div>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={disableClose}
            className="w-9 h-9 rounded-lg hover:bg-[#660B05]/10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {children}

        {footer && (
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
