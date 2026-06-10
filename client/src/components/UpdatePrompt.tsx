import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineArrowPath, HiOutlineXMark } from "react-icons/hi2";
import { useRegisterSW } from "virtual:pwa-register/react";

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

export function UpdatePrompt() {
  const [dismissed, setDismissed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      registrationRef.current = registration ?? null;
    },
  });

  useEffect(() => {
    const checkForUpdates = () => {
      if (document.visibilityState === "visible") {
        void registrationRef.current?.update();
      }
    };

    const intervalId = window.setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL_MS);
    document.addEventListener("visibilitychange", checkForUpdates);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", checkForUpdates);
    };
  }, []);

  useEffect(() => {
    if (needRefresh) {
      setDismissed(false);
    }
  }, [needRefresh]);

  const dismiss = useCallback(() => {
    setNeedRefresh(false);
    setOfflineReady(false);
    setDismissed(true);
  }, [setNeedRefresh, setOfflineReady]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await updateServiceWorker(true);
    } catch {
      setIsRefreshing(false);
    }
  }, [updateServiceWorker]);

  const visible = needRefresh && !dismissed;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[9999] flex justify-center p-4 sm:p-6"
        >
          <div className="pointer-events-auto flex w-full max-w-xl items-start gap-3 border-2 border-ink bg-cream p-4 shadow-brutal-md sm:items-center sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-gold">
              <HiOutlineArrowPath className="h-5 w-5 text-ink" aria-hidden />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-black uppercase tracking-tight text-ink">
                Update available
              </p>
              <p className="mt-0.5 text-sm text-ink/80">
                A newer version of the campus tour is ready. Refresh when you are
                finished — your current session will not be interrupted until you
                choose to update.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={refresh}
                disabled={isRefreshing}
                className="border-2 border-ink bg-maroon px-3 py-2 text-xs font-black uppercase tracking-tight text-cream shadow-brutal-sm transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:cursor-wait disabled:opacity-70"
              >
                {isRefreshing ? "Updating…" : "Refresh now"}
              </button>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss update notification"
                className="border-2 border-ink bg-cream p-2 text-ink transition-colors hover:bg-muted"
              >
                <HiOutlineXMark className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
