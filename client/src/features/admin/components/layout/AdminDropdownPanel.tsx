import { X } from "lucide-react";
import type { ReactNode } from "react";

type AdminDropdownPanelProps = {
  title: string;
  badge?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  /** Tailwind width classes at sm+ breakpoint, e.g. sm:w-80 or sm:w-96 */
  desktopWidthClass?: string;
};

export function AdminDropdownPanel({
  title,
  badge,
  onClose,
  children,
  footer,
  desktopWidthClass = "sm:w-80",
}: AdminDropdownPanelProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none"
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`fixed z-50 flex max-h-[min(75dvh,560px)] w-auto flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl inset-x-3 top-[4.25rem] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-[28rem] ${desktopWidthClass}`}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-100 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-gray-900">{title}</h3>
            {badge}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 sm:hidden"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-gray-100 p-3">{footer}</div>
        )}
      </div>
    </>
  );
}
