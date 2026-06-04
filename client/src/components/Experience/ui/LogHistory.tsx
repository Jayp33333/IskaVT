import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { logbookAPI } from "../../../services/api";
import { X, MapPin, FileText, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
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
                    className="pointer-events-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[24px] border-[4px] border-black bg-[#FFFBEB] shadow-brutal-lg h-[85vh] max-h-[90dvh] [@media(max-height:500px)]:max-h-[94dvh] [@media(orientation:landscape)_and_(max-height:600px)]:h-auto [@media(orientation:landscape)_and_(max-height:600px)]:max-h-[92dvh] [@media(orientation:landscape)_and_(max-height:600px)]:w-[min(96vw,56rem)] [@media(orientation:landscape)_and_(max-height:600px)]:rounded-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="flex shrink-0 items-center justify-between border-b-[4px] border-black bg-[#4D94FF] p-4 sm:p-6 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-3 [@media(orientation:landscape)_and_(max-height:600px)]:px-3 [@media(orientation:landscape)_and_(max-height:600px)]:py-2">
                      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        <div className="rounded-xl border-[3px] border-black bg-white p-1.5 sm:p-2 [@media(orientation:landscape)_and_(max-height:600px)]:p-1">
                          <FileText className="h-5 w-5 text-black sm:h-6 sm:w-6 [@media(orientation:landscape)_and_(max-height:600px)]:h-4 [@media(orientation:landscape)_and_(max-height:600px)]:w-4" />
                        </div>
                        <h2 className="truncate text-sm font-black uppercase italic tracking-tighter text-white sm:text-base [@media(orientation:landscape)_and_(max-height:600px)]:text-xs">
                          Visitor Archives
                        </h2>
                      </div>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="shrink-0 rounded-lg border-[3px] border-black bg-white p-1 transition-colors hover:bg-[#FF6B6B] [@media(orientation:landscape)_and_(max-height:600px)]:p-0.5"
                        aria-label="Close log history"
                        type="button"
                      >
                        <X className="h-5 w-5 sm:h-6 sm:w-6 [@media(orientation:landscape)_and_(max-height:600px)]:h-4 [@media(orientation:landscape)_and_(max-height:600px)]:w-4" strokeWidth={3} />
                      </button>
                    </div>

                    {/* Main Table Area */}
                    <div className="min-h-0 flex-1 overflow-auto bg-[#fdfdfd] p-3 sm:p-6 [@media(max-height:500px)]:p-2 [@media(orientation:landscape)_and_(max-height:600px)]:p-2">
                      {error ? (
                        <div className="flex h-full min-h-[8rem] items-center justify-center text-center text-xs font-black uppercase italic tracking-widest text-red-500 sm:text-sm">
                          {error}
                        </div>
                      ) : loading ? (
                        <div className="flex h-full min-h-[8rem] items-center justify-center text-xs font-black uppercase italic tracking-widest text-gray-400 sm:text-sm">
                          Loading Records...
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border-[3px] border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]">
                          <table className="w-full table-fixed border-collapse text-[10px] leading-tight sm:text-[11px]">
                            <thead>
                              <tr className="bg-black text-white">
                                <th className="border-r border-white/20 px-2 py-1.5 text-left text-[8px] font-black uppercase sm:text-[9px]">
                                  Visitor
                                </th>
                                <th className="border-r border-white/20 px-2 py-1.5 text-left text-[8px] font-black uppercase sm:text-[9px]">
                                  Destination
                                </th>
                                <th className="hidden border-r border-white/20 px-2 py-1.5 text-left text-[8px] font-black uppercase sm:table-cell sm:text-[9px]">
                                  Purpose
                                </th>
                                <th className="border-r border-white/20 px-2 py-1.5 text-left text-[8px] font-black uppercase sm:text-[9px]">
                                  Timeline
                                </th>
                                <th className="px-2 py-1.5 text-left text-[8px] font-black uppercase sm:text-[9px]">
                                  Duration
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {entries.map((entry, idx) => (
                                <tr
                                  key={entry._id}
                                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                  <td className="border-r-[2px] border-t-[2px] border-black px-2 py-1.5 align-top">
                                    <p className="break-words font-bold text-[10px] text-black sm:text-[11px]">
                                      {entry.fullName}
                                    </p>
                                    <span className="mt-0.5 inline-block rounded border border-black bg-gold px-1 py-px text-[7px] font-black uppercase sm:text-[8px]">
                                      {entry.visitorType}
                                    </span>
                                  </td>
                                  <td className="border-r-[2px] border-t-[2px] border-black px-2 py-1.5 align-top">
                                    <div className="flex items-start gap-1 text-[9px] font-bold sm:text-[10px]">
                                      <MapPin className="mt-0.5 h-2.5 w-2.5 shrink-0 text-red-500 sm:h-3 sm:w-3" />
                                      <span className="break-words line-clamp-3">{entry.destination}</span>
                                    </div>
                                  </td>
                                  <td className="hidden border-r-[2px] border-t-[2px] border-black px-2 py-1.5 align-top sm:table-cell">
                                    <p className="break-words line-clamp-3 text-[9px] italic leading-snug text-gray-600 sm:text-[10px]">
                                      "{entry.purpose}"
                                    </p>
                                  </td>
                                  <td className="border-r-[2px] border-t-[2px] border-black px-2 py-1.5 align-top">
                                    <div className="flex flex-col gap-0.5">
                                      <div className="flex items-center gap-0.5 text-[8px] font-bold sm:text-[9px]">
                                        <Calendar className="h-2.5 w-2.5 shrink-0" />
                                        <span className="truncate">
                                          {new Date(entry.date).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <div className="break-all rounded border border-black/10 bg-gray-100 px-1 py-px font-mono text-[8px] font-bold sm:text-[9px]">
                                        {new Date(entry.timeIn).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                        {" - "}
                                        {entry.timeOut
                                          ? new Date(entry.timeOut).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })
                                          : "..."}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="border-t-[2px] border-black px-2 py-1.5 align-top">
                                    <span
                                      className={`text-[9px] font-black sm:text-[10px] ${
                                        !entry.timeOut
                                          ? "animate-pulse text-blue-600"
                                          : "text-black"
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
                    <div className="flex shrink-0 flex-col items-stretch justify-between gap-2 border-t-[4px] border-black bg-[#f0f0f0] p-3 sm:flex-row sm:items-center sm:p-6 [@media(max-height:500px)]:p-3 [@media(orientation:landscape)_and_(max-height:600px)]:flex-row [@media(orientation:landscape)_and_(max-height:600px)]:items-center [@media(orientation:landscape)_and_(max-height:600px)]:gap-3 [@media(orientation:landscape)_and_(max-height:600px)]:p-2">
                      <button
                        onClick={() => fetchEntries(page - 1)}
                        disabled={page === 1}
                        className="flex items-center justify-center gap-1 rounded-xl border-[3px] border-black bg-white px-2.5 py-1 text-[9px] font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0.5 active:shadow-none disabled:opacity-30 sm:text-[10px]"
                        type="button"
                      >
                        <ChevronLeft className="h-4 w-4" /> Prev
                      </button>

                      <div className="text-center text-[10px] font-black uppercase tracking-tighter sm:text-[11px]">
                        Page {page} <span className="text-gray-400">/</span> {totalPages}
                      </div>

                      <button
                        onClick={() => fetchEntries(page + 1)}
                        disabled={page >= totalPages}
                        className="flex items-center justify-center gap-1 rounded-xl border-[3px] border-black bg-[#4DFF88] px-2.5 py-1 text-[9px] font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0.5 active:shadow-none disabled:opacity-30 sm:text-[10px]"
                        type="button"
                      >
                        Next <ChevronRight className="h-4 w-4" />
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
        className="flex h-10 w-10 items-center justify-center rounded-2xl border-[3px] border-ink bg-gold text-maroon shadow-brutal-sm transition-all hover:bg-gold/90 active:translate-y-1 active:shadow-none [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:rounded-xl [@media(max-height:500px)]:shadow-brutal-sm"
        title="Open log history"
        aria-label="Open log history"
        aria-expanded={isOpen}
        type="button"
      >
        <FileText
          className="h-4 w-4 [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5"
          strokeWidth={3}
        />
      </button>

      {modal}
    </>
  );
};
