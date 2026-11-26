import { useEffect, useRef } from "react";
import { REFRESH_INTERVAL_MS } from "../constants";
import type { RefreshOption } from "../types";

export type UseAutoRefreshParams = {
  intervalKey: RefreshOption;
  onTick: () => void;
};

/**
 * Calls `onTick` every `REFRESH_INTERVAL_MS[intervalKey]`.
 *
 * - The interval only restarts when `intervalKey` changes; the latest `onTick`
 *   is read from a ref, so a new callback identity doesn't reset the timer.
 * - Ticks are skipped while the document is hidden. If at least one tick was
 *   skipped, a single refresh runs as soon as the tab becomes visible again.
 */
export function useAutoRefresh({ intervalKey, onTick }: UseAutoRefreshParams): void {
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    const intervalMs = REFRESH_INTERVAL_MS[intervalKey];
    if (!intervalMs) return;

    let missedWhileHidden = false;

    const handle = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) {
        missedWhileHidden = true;
        return;
      }
      onTickRef.current();
    }, intervalMs);

    const handleVisibility = () => {
      if (!document.hidden && missedWhileHidden) {
        missedWhileHidden = false;
        onTickRef.current();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(handle);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [intervalKey]);
}
