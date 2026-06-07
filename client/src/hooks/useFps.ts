import { useEffect, useState } from "react";

const SAMPLE_INTERVAL_MS = 1000;

export function useFps(enabled = true) {
  const [fps, setFps] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setFps(null);
      return;
    }

    let frameCount = 0;
    let lastSample = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      frameCount += 1;
      const elapsed = now - lastSample;

      if (elapsed >= SAMPLE_INTERVAL_MS) {
        setFps(Math.round((frameCount * 1000) / elapsed));
        frameCount = 0;
        lastSample = now;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [enabled]);

  return fps;
}

export function getFpsColorClass(fps: number | null): string {
  if (fps === null) return "text-ink/45";
  if (fps >= 55) return "text-emerald-600";
  if (fps >= 30) return "text-orange-500";
  return "text-red-600";
}

export function getFpsTooltip(fps: number | null): string {
  if (fps === null) {
    return "Frames per second — measuring performance…";
  }

  const status = fps >= 55 ? "smooth" : fps >= 30 ? "moderate" : "low";
  return `Frames per second (${status}). Higher is smoother. Green 55+, orange 30–54, red below 30. Updates every second.`;
}
