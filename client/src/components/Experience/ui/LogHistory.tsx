import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { logbookAPI } from "../../../services/api";
import { X, MapPin, Calendar, ChevronLeft, ChevronRight, ScrollText } from "lucide-react";
import useWorld from "../../../hooks/useWorld";

export const LogHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const showMiniMap = useWorld((state: any) => state.showMiniMap);
  const setShowLogHistory = useWorld((state: any) => state.setShowLogHistory);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEntries = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await logbookAPI.getEntries(pageNum, 10);
      setEntries(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch log history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEntries(1);
      setShowLogHistory(true);
    } else {
      setShowLogHistory(false);
    }
  }, [isOpen, setShowLogHistory]);

  const calculateDuration = (timeIn: string, timeOut: string | null) => {
    if (!timeOut) return "In Progress";
    const diffMs = new Date(timeOut).getTime() - new Date(timeIn).getTime();
    const diffMins = Math.ceil(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${Math.max(1, minutes)}m`;
  };

  if (showMiniMap) return null;

  const modal =
    typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  className="fixed inset-0 z-[2000] bg-ink/85"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                />

                <motion.div
                  className="fixed inset-0 z-[2001] flex items-center justify-center p-4 [@media(max-height:500px)]:p-2 [@media(orientation:landscape)_and_(max-height:600px)]:p-2 pointer-events-none"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div
                    className="pointer-events-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border-[4px] border-ink bg-cream text-ink shadow-brutal-lg h-[85vh] max-h-[90dvh] [@media(max-height:500px)]:max-h-[94dvh] [@media(orientation:landscape)_and_(max-height:600px)]:h-auto [@media(orientation:landscape)_and_(max-height:600px)]:max-h-[92dvh] [@media(orientation:landscape)_and_(max-height:600px)]:w-[min(96vw,56rem)] [@media(orientation:landscape)_and_(max-height:600px)]:rounded-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="flex shrink-0 items-center justify-between border-b-[4px] border-ink bg-maroon px-4 py-4 sm:px-6 sm:py-5 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-3 [@media(orientation:landscape)_and_(max-height:600px)]:px-3 [@media(orientation:landscape)_and_(max-height:600px)]:py-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex shrink-0 items-center justify-center rounded-2xl border-[3px] border-ink bg-surface p-1.5 shadow-brutal-sm sm:p-2 [@media(orientation:landscape)_and_(max-height:600px)]:p-1">
                          <img
                            src="/images/pup-logo.png"
                            alt="PUP Logo"
                            className="h-8 w-8 object-contain sm:h-9 sm:w-9 [@media(orientation:landscape)_and_(max-height:600px)]:h-7 [@media(orientation:landscape)_and_(max-height:600px)]:w-7"
                          />
                        </div>
                        <div className="min-w-0">
                          <h2 className="truncate text-base font-black italic text-white sm:text-xl [@media(orientation:landscape)_and_(max-height:600px)]:text-sm">
                            Visitor Log History
                          </h2>
                          <p className="mt-0.5 text-[10px] font-bold text-white/80 sm:text-xs [@media(orientation:landscape)_and_(max-height:600px)]:hidden">
                            Recent campus visitor records
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="shrink-0 rounded-xl border-[3px] border-ink bg-surface p-1.5 transition-transform hover:bg-muted active:scale-90 [@media(orientation:landscape)_and_(max-height:600px)]:p-1"
                        aria-label="Close log history"
                        type="button"
                      >
                        <X className="h-5 w-5 sm:h-6 sm:w-6 [@media(orientation:landscape)_and_(max-height:600px)]:h-4 [@media(orientation:landscape)_and_(max-height:600px)]:w-4" strokeWidth={3} />
                      </button>
                    </div>

                    {/* Main content */}
                    <div className="min-h-0 flex-1 overflow-auto bg-cream p-3 sm:p-5 [@media(max-height:500px)]:p-2 [@media(orientation:landscape)_and_(max-height:600px)]:p-2">
                      {error ? (
                        <div className="flex h-full min-h-[8rem] items-center justify-center rounded-2xl border-[3px] border-ink bg-red-50 p-4 text-center text-xs font-black italic text-maroon sm:text-sm">
                          {error}
                        </div>
                      ) : loading ? (
                        <div className="flex h-full min-h-[8rem] flex-col items-center justify-center gap-3">
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
                            Loading records…
                          </p>
                        </div>
                      ) : entries.length === 0 ? (
                        <div className="flex h-full min-h-[8rem] flex-col items-center justify-center gap-2 rounded-2xl border-[3px] border-dashed border-ink/30 bg-muted/50 p-6 text-center">
                          <ScrollText className="h-8 w-8 text-ink/30" strokeWidth={2.5} />
                          <p className="text-xs font-black uppercase tracking-wider text-ink/40 sm:text-sm">
                            No visitor records yet
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-2xl border-[3px] border-ink bg-surface shadow-brutal-sm">
                          <table className="w-full table-fixed border-collapse text-[10px] leading-tight sm:text-[11px]">
                            <thead>
                              <tr className="bg-maroon text-white">
                                <th className="border-r border-white/20 px-2 py-2 text-left text-[8px] font-black uppercase tracking-wider sm:text-[9px]">
                                  Visitor
                                </th>
                                <th className="border-r border-white/20 px-2 py-2 text-left text-[8px] font-black uppercase tracking-wider sm:text-[9px]">
                                  Destination
                                </th>
                                <th className="hidden border-r border-white/20 px-2 py-2 text-left text-[8px] font-black uppercase tracking-wider sm:table-cell sm:text-[9px]">
                                  Purpose
                                </th>
                                <th className="border-r border-white/20 px-2 py-2 text-left text-[8px] font-black uppercase tracking-wider sm:text-[9px]">
                                  Timeline
                                </th>
                                <th className="px-2 py-2 text-left text-[8px] font-black uppercase tracking-wider sm:text-[9px]">
                                  Duration
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {entries.map((entry, idx) => (
                                <tr
                                  key={entry._id}
                                  className={idx % 2 === 0 ? "bg-surface" : "bg-muted"}
                                >
                                  <td className="border-r-[2px] border-t-[2px] border-ink px-2 py-2 align-top">
                                    <p className="break-words font-bold text-[10px] text-ink sm:text-[11px]">
                                      {entry.fullName}
                                    </p>
                                    <span className="mt-1 inline-block rounded-full border-[2px] border-ink bg-gold px-1.5 py-px text-[7px] font-black uppercase text-ink sm:text-[8px]">
                                      {entry.visitorType}
                                    </span>
                                  </td>
                                  <td className="border-r-[2px] border-t-[2px] border-ink px-2 py-2 align-top">
                                    <div className="flex items-start gap-1 text-[9px] font-bold text-ink sm:text-[10px]">
                                      <MapPin className="mt-0.5 h-2.5 w-2.5 shrink-0 text-maroon sm:h-3 sm:w-3" strokeWidth={3} />
                                      <span className="break-words line-clamp-3">{entry.destination}</span>
                                    </div>
                                  </td>
                                  <td className="hidden border-r-[2px] border-t-[2px] border-ink px-2 py-2 align-top sm:table-cell">
                                    <p className="break-words line-clamp-3 text-[9px] italic leading-snug text-ink/60 sm:text-[10px]">
                                      &ldquo;{entry.purpose}&rdquo;
                                    </p>
                                  </td>
                                  <td className="border-r-[2px] border-t-[2px] border-ink px-2 py-2 align-top">
                                    <div className="flex flex-col gap-1">
                                      <div className="flex items-center gap-1 text-[8px] font-bold text-ink sm:text-[9px]">
                                        <Calendar className="h-2.5 w-2.5 shrink-0 text-maroon" strokeWidth={3} />
                                        <span className="truncate">
                                          {new Date(entry.date).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <div className="break-all rounded-lg border-[2px] border-ink/15 bg-cream px-1.5 py-0.5 font-mono text-[8px] font-bold text-ink sm:text-[9px]">
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
                                      </div>
                                    </div>
                                  </td>
                                  <td className="border-t-[2px] border-ink px-2 py-2 align-top">
                                    <span
                                      className={`inline-block rounded-full border-[2px] px-1.5 py-px text-[9px] font-black sm:text-[10px] ${
                                        !entry.timeOut
                                          ? "animate-pulse border-ink bg-gold text-ink"
                                          : "border-transparent text-maroon"
                                      }`}
                                    >
                                      {calculateDuration(entry.timeIn, entry.timeOut)}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Footer / Pagination */}
                    <div className="flex shrink-0 flex-col items-stretch justify-between gap-2 border-t-[4px] border-ink bg-muted px-3 py-3 sm:flex-row sm:items-center sm:px-5 sm:py-4 [@media(max-height:500px)]:p-3 [@media(orientation:landscape)_and_(max-height:600px)]:flex-row [@media(orientation:landscape)_and_(max-height:600px)]:items-center [@media(orientation:landscape)_and_(max-height:600px)]:gap-3 [@media(orientation:landscape)_and_(max-height:600px)]:p-2">
                      <button
                        onClick={() => fetchEntries(page - 1)}
                        disabled={page === 1}
                        className="flex items-center justify-center gap-1 rounded-xl border-[3px] border-ink bg-surface px-3 py-1.5 text-[9px] font-black uppercase italic text-ink shadow-brutal-sm transition-all hover:bg-cream active:translate-y-0.5 active:shadow-none disabled:opacity-30 sm:text-[10px]"
                        type="button"
                      >
                        <ChevronLeft className="h-4 w-4" strokeWidth={3} /> Prev
                      </button>

                      <div className="rounded-full border-[2px] border-ink bg-gold px-3 py-1 text-center text-[10px] font-black uppercase tracking-tighter text-ink sm:text-[11px]">
                        Page {page} <span className="text-ink/40">/</span> {totalPages}
                      </div>

                      <button
                        onClick={() => fetchEntries(page + 1)}
                        disabled={page >= totalPages}
                        className="flex items-center justify-center gap-1 rounded-xl border-[3px] border-ink bg-maroon px-3 py-1.5 text-[9px] font-black uppercase italic text-white shadow-brutal-sm transition-all hover:bg-maroon/90 active:translate-y-0.5 active:shadow-none disabled:opacity-30 sm:text-[10px]"
                        type="button"
                      >
                        Next <ChevronRight className="h-4 w-4" strokeWidth={3} />
                      </button>
                    </div>
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
        title="Open log history"
        aria-label="Open log history"
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
