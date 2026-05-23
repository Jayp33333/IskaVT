import { useEffect } from "react";
import { REFRESH_INTERVAL_MS } from "../constants";
import type { RefreshOption } from "../types";

export type UseAutoRefreshParams = {
  intervalKey: RefreshOption;
  onTick: () => void;
};

export function useAutoRefresh({ intervalKey, onTick }: UseAutoRefreshParams): void {
  useEffect(() => {
    const intervalMs = REFRESH_INTERVAL_MS[intervalKey];
    if (!intervalMs) return;

    const handle = setInterval(() => {
      onTick();
    }, intervalMs);

    return () => clearInterval(handle);
  }, [intervalKey, onTick]);
}
