import { useEffect, useState } from "react";
import { API_BASE_URL } from "../services/apiClient";

const PING_INTERVAL_MS = 5000;
const PING_TIMEOUT_MS = 5000;

async function measureLatency(): Promise<number | null> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
  const start = performance.now();

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) return null;
    return Math.round(performance.now() - start);
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function useConnectionLatency() {
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const ping = async () => {
      const ms = await measureLatency();
      if (!cancelled) setLatencyMs(ms);
    };

    void ping();
    const intervalId = window.setInterval(() => {
      void ping();
    }, PING_INTERVAL_MS);

    const handleOnline = () => {
      void ping();
    };
    const handleOffline = () => {
      setLatencyMs(null);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return latencyMs;
}

export function getLatencyColorClass(ms: number | null): string {
  if (ms === null) return "text-ink/45";
  if (ms >= 300) return "text-red-600";
  if (ms >= 150) return "text-orange-500";
  return "text-emerald-600";
}

export function getLatencyTooltip(ms: number | null): string {
  if (ms === null) {
    return "API response time — server unreachable. Logbook, feedback, and other features may not work.";
  }

  const status = ms >= 300 ? "very slow" : ms >= 150 ? "slow" : "good";
  return `API response time to ISKA server (${status}). Lower is better. Green < 150ms, orange 150–299ms, red 300ms+. Updates every 5 seconds.`;
}
