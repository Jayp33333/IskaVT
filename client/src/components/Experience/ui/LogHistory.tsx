import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { logbookAPI } from "../../../services/api";
import {
  LOGBOOK_ENTRY_ID_KEY,
  clearLogbookSession,
} from "../../../constants/logbookSession";
import {
  getDeviceVisitHistory,
  markDeviceVisitCheckedOut,
  upsertDeviceVisit,
  type DeviceVisitRecord,
} from "../../../constants/logbookDeviceHistory";
import {
  X,
  MapPin,
  Calendar,
  Clock,
  ScrollText,
  LogOut,
} from "lucide-react";
import useWorld from "../../../hooks/useWorld";

function formatDuration(
  timeIn: string,
  timeOut: string | null,
  nowMs: number
) {
  const endMs = timeOut ? new Date(timeOut).getTime() : nowMs;
  const diffMs = Math.max(0, endMs - new Date(timeIn).getTime());
  const diffMins = Math.ceil(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;
  const label = hours > 0 ? `${hours}h ${minutes}m` : `${Math.max(1, minutes)}m`;
  return timeOut ? label : `${label} · on campus`;
}

function VisitCard({
  entry,
  isActive,
  nowMs,
}: {
  entry: DeviceVisitRecord;
  isActive: boolean;
  nowMs: number;
}) {
  return (
    <article
      className={`rounded-2xl border-[3px] border-ink p-3.5 shadow-brutal-sm sm:p-4 ${
        isActive ? "bg-gold/20" : "bg-surface"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="break-words text-sm font-black text-ink sm:text-base">
            {entry.fullName}
          </p>
          <span className="mt-1 inline-block rounded-full border-[2px] border-ink bg-gold px-1.5 py-px text-[8px] font-black uppercase text-ink sm:text-[9px]">
            {entry.visitorType}
          </span>
        </div>
        <span
          className={`shrink-0 rounded-full border-[2px] px-1.5 py-px text-[9px] font-black sm:text-[10px] ${
            isActive
              ? "animate-pulse border-ink bg-gold text-ink"
              : "border-transparent bg-muted text-maroon"
          }`}
        >
          {isActive ? "Active" : "Done"}
        </span>
      </div>

      <div className="mt-3 space-y-2 border-t-2 border-ink/10 pt-3">
        <div className="flex items-start gap-1.5">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-maroon" strokeWidth={3} />
          <p className="text-xs font-bold text-ink sm:text-sm">{entry.destination}</p>
        </div>
        <p className="line-clamp-2 text-[11px] italic leading-snug text-ink/60 sm:text-xs">
          &ldquo;{entry.purpose}&rdquo;
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-ink/70 sm:text-[11px]">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3 text-maroon" strokeWidth={3} />
            {new Date(entry.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="inline-flex items-center gap-1 font-mono">
            <Clock className="h-3 w-3 text-maroon" strokeWidth={3} />
            {new Date(entry.timeIn).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" – "}
            {entry.timeOut
              ? new Date(entry.timeOut).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "…"}
          </span>
        </div>
        <p className="text-[11px] font-black text-maroon sm:text-xs">
          {formatDuration(entry.timeIn, entry.timeOut, nowMs)}
        </p>
      </div>
    </article>
  );
}

export const LogHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const showMiniMap = useWorld((state: any) => state.showMiniMap);
  const setShowLogHistory = useWorld((state: any) => state.setShowLogHistory);
  const [visits, setVisits] = useState<DeviceVisitRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

  const loadVisits = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const entryId = localStorage.getItem(LOGBOOK_ENTRY_ID_KEY);
      setActiveEntryId(entryId);

      if (entryId) {
        try {
          const response = await logbookAPI.getEntry(entryId);
          upsertDeviceVisit(response.data);
        } catch {
          // Session may be stale; still show saved device history.
        }
      }

      setVisits(getDeviceVisitHistory());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your visits");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadVisits();
      setShowLogHistory(true);
    } else {
      setShowLogHistory(false);
    }
  }, [isOpen, setShowLogHistory, loadVisits]);

  useEffect(() => {
    if (!isOpen || !visits.some((visit) => !visit.timeOut)) return;

    setNowMs(Date.now());
    const interval = window.setInterval(() => setNowMs(Date.now()), 30_000);
    return () => window.clearInterval(interval);
  }, [isOpen, visits]);

  const handleCheckOut = async () => {
    const entryId = localStorage.getItem(LOGBOOK_ENTRY_ID_KEY);
    if (!entryId || checkingOut) return;

    setCheckingOut(true);
    setError(null);

    try {
      const response = await logbookAPI.updateTimeout(entryId);
      const timeOut = response.data.timeOut ?? new Date().toISOString();
      markDeviceVisitCheckedOut(entryId, timeOut);
      clearLogbookSession();
      setActiveEntryId(null);
      setVisits(getDeviceVisitHistory());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check-out failed");
    } finally {
      setCheckingOut(false);
    }
  };

  if (showMiniMap) return null;

  const hasActiveVisit = visits.some(
    (visit) => visit._id === activeEntryId && !visit.timeOut
  );

  const modal =
    typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  className="fixed inset-0 z-[2200] bg-ink/85"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                />

                <motion.div
                  className="pointer-events-none fixed inset-0 z-[2201] flex items-end justify-center p-0 sm:items-center sm:p-4 [@media(max-height:500px)]:p-0 [@media(orientation:landscape)_and_(max-height:768px)]:p-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div
                    className="pointer-events-auto flex h-[min(92dvh,34rem)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border-[4px] border-ink bg-cream text-ink shadow-brutal-lg max-sm:max-w-none max-sm:rounded-b-none max-sm:border-b-0 sm:rounded-2xl [@media(orientation:landscape)_and_(max-height:768px)]:max-w-[min(92vw,28rem)] [@media(orientation:landscape)_and_(max-height:768px)]:rounded-xl"
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-label="My visit history"
                  >
                    <div
                      className="mx-auto mt-2.5 h-1 w-12 shrink-0 rounded-full border border-ink/20 bg-ink/15 sm:hidden [@media(orientation:landscape)_and_(max-height:768px)]:hidden"
                      aria-hidden
                    />

                    <div className="flex shrink-0 items-center justify-between gap-3 border-b-[3px] border-ink bg-maroon px-4 py-4 sm:px-5 [@media(max-height:500px)]:px-3.5 [@media(max-height:500px)]:py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-gold [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9">
                          <ScrollText
                            className="h-[1.125rem] w-[1.125rem] text-maroon"
                            strokeWidth={2.75}
                          />
                        </span>
                        <div className="min-w-0">
                          <h2 className="truncate text-lg font-black italic text-white sm:text-xl [@media(max-height:500px)]:text-base">
                            My Visit History
                          </h2>
                          <p className="truncate text-[10px] font-bold uppercase tracking-wider text-white/70 sm:text-[11px]">
                            Saved on this device
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="shrink-0 rounded-xl border-2 border-ink bg-white p-1.5 text-ink transition-colors hover:bg-cream active:scale-95 [@media(max-height:500px)]:p-1"
                        aria-label="Close visit history"
                        type="button"
                      >
                        <X className="h-4 w-4" strokeWidth={3} />
                      </button>
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-cream p-3 sm:p-4 [@media(max-height:500px)]:p-2.5">
                      {error ? (
                        <div className="rounded-2xl border-2 border-ink bg-red-50 p-4 text-center text-xs font-black italic text-maroon sm:text-sm">
                          {error}
                        </div>
                      ) : loading ? (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
                          <div className="flex items-end justify-center gap-2">
                            {[0, 1, 2].map((i) => (
                              <span
                                key={i}
                                className="block h-2.5 w-2.5 rounded-full border-2 border-ink bg-maroon loading-dot-wave"
                                style={{ animationDelay: `${i * 0.18}s` }}
                              />
                            ))}
                          </div>
                          <p className="text-xs font-black uppercase tracking-wider text-ink/50 sm:text-sm">
                            Loading…
                          </p>
                        </div>
                      ) : visits.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink/30 bg-muted/50 p-6 text-center">
                          <ScrollText className="h-8 w-8 text-ink/30" strokeWidth={2.5} />
                          <p className="text-sm font-black text-ink/60">No visits yet</p>
                          <p className="text-xs font-bold leading-relaxed text-ink/45">
                            Sign in from the home page. Your past tours on this
                            device will appear here.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {visits.map((visit) => (
                            <VisitCard
                              key={visit._id}
                              entry={visit}
                              isActive={
                                visit._id === activeEntryId && !visit.timeOut
                              }
                              nowMs={nowMs}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {hasActiveVisit && (
                      <div className="shrink-0 border-t-[3px] border-ink bg-muted px-4 py-3 sm:px-5 sm:py-4">
                        <button
                          onClick={handleCheckOut}
                          disabled={checkingOut}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border-[3px] border-ink bg-maroon px-4 py-2.5 text-xs font-black uppercase italic text-white shadow-brutal-sm transition-all hover:bg-maroon/90 active:translate-y-0.5 active:shadow-none disabled:opacity-50 sm:text-sm"
                          type="button"
                        >
                          <LogOut className="h-4 w-4" strokeWidth={3} />
                          {checkingOut ? "Checking out…" : "Check out"}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-2xl border-[3px] border-ink bg-gold text-maroon shadow-brutal-sm transition-all hover:bg-gold/90 active:translate-y-1 active:shadow-none [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:rounded-xl"
        title="My visit history"
        aria-label="My visit history"
        aria-expanded={isOpen}
        type="button"
      >
        <ScrollText
          className="h-4 w-4 [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5"
          strokeWidth={3}
        />
      </button>

      {modal}
    </>
  );
};
