import { useCallback, useEffect, useRef, useState } from "react";
import { TOAST_DEFAULT_DURATION_MS } from "../constants";
import type { ToastKind, ToastState } from "../types";

export type UseToastValue = {
  toast: ToastState | null;
  showToast: (message: string, type?: ToastKind, durationMs?: number) => void;
  hideToast: () => void;
};

export function useToast(): UseToastValue {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const hideToast = useCallback(() => {
    clearTimer();
    setToast(null);
  }, [clearTimer]);

  const showToast = useCallback(
    (
      message: string,
      type: ToastKind = "success",
      durationMs: number = TOAST_DEFAULT_DURATION_MS
    ) => {
      clearTimer();
      setToast({ message, type });
      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, durationMs);
    },
    [clearTimer]
  );

  useEffect(() => clearTimer, [clearTimer]);

  return { toast, showToast, hideToast };
}
