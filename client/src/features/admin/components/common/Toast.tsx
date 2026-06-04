import { Check, X } from "lucide-react";
import type { ToastState } from "../../types";

type ToastProps = {
  toast: ToastState | null;
  onClose: () => void;
};

export function Toast({ toast, onClose }: ToastProps) {
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div className="fixed left-4 right-4 top-4 z-[3000] sm:left-auto sm:right-4 sm:max-w-sm">
      <div
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md ${
          isSuccess
            ? "border-green-200/80 bg-green-50/95 text-green-800"
            : "border-red-200/80 bg-red-50/95 text-red-800"
        }`}
      >
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
            isSuccess ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isSuccess ? (
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          ) : (
            <X className="h-3 w-3 text-white" strokeWidth={3} />
          )}
        </div>
        <span className="flex-1 text-sm font-medium">{toast.message}</span>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-gray-400 hover:text-gray-700"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
