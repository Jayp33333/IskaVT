import { useState, useEffect } from "react";
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:h-9 rounded-2xl [@media(max-height:500px)]:rounded-xl border-[3px] border-slate-900 bg-yellow-300 text-[#660B05] hover:bg-yellow-200 transition-all flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] [@media(max-height:500px)]:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
        title="Open log history"
        aria-label="Open log history"
        aria-expanded={isOpen}
        type="button"
      >
        <FileText className="w-4 h-4 [@media(max-height:500px)]:w-3.5 [@media(max-height:500px)]:h-3.5" strokeWidth={3} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-[1500] backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Container */}
            <motion.div
              className="fixed inset-0 z-[1501] flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="bg-[#FFFBEB] w-full max-w-6xl h-[85vh] border-[4px] border-black rounded-[24px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="bg-[#4D94FF] border-b-[4px] border-black p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 border-[3px] border-black rounded-xl">
                      <FileText className="w-6 h-6 text-black" />
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Visitor Archives</h2>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="bg-white border-[3px] border-black p-1 rounded-lg hover:bg-[#FF6B6B] transition-colors"
                  >
                    <X className="w-6 h-6" strokeWidth={3} />
                  </button>
                </div>

                {/* Main Table Area */}
                <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#fdfdfd]">
                  {error ? (
                    <div className="h-full flex items-center justify-center font-black italic text-xl uppercase tracking-widest text-red-500">
                      {error}
                    </div>
                  ) : loading ? (
                    <div className="h-full flex items-center justify-center font-black italic text-xl uppercase tracking-widest text-gray-400">Loading Records...</div>
                  ) : (
                    <div className="border-[3px] border-black rounded-xl overflow-hidden bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-black text-white">
                            <th className="px-4 py-3 text-left text-xs font-black uppercase border-r border-white/20">Visitor</th>
                            <th className="px-4 py-3 text-left text-xs font-black uppercase border-r border-white/20">Destination</th>
                            <th className="px-4 py-3 text-left text-xs font-black uppercase border-r border-white/20">Purpose</th>
                            <th className="px-4 py-3 text-left text-xs font-black uppercase border-r border-white/20">Timeline</th>
                            <th className="px-4 py-3 text-left text-xs font-black uppercase">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entries.map((entry, idx) => (
                            <tr key={entry._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-4 py-4 border-t-[2px] border-black border-r-[2px]">
                                <p className="font-bold text-black">{entry.fullName}</p>
                                <span className="text-[10px] font-black uppercase bg-yellow-300 border border-black px-1.5 py-0.5 rounded">
                                  {entry.visitorType}
                                </span>
                              </td>
                              <td className="px-4 py-4 border-t-[2px] border-black border-r-[2px]">
                                <div className="flex items-center gap-1.5 font-bold text-sm">
                                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                                  {entry.destination}
                                </div>
                              </td>
                              <td className="px-4 py-4 border-t-[2px] border-black border-r-[2px]">
                                <p className="text-sm text-gray-600 italic leading-snug line-clamp-2">
                                  "{entry.purpose}"
                                </p>
                              </td>
                              <td className="px-4 py-4 border-t-[2px] border-black border-r-[2px]">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-1 text-xs font-bold">
                                    <Calendar className="w-3 h-3" /> {new Date(entry.date).toLocaleDateString()}
                                  </div>
                                  <div className="text-[11px] font-mono font-bold bg-gray-100 border border-black/10 rounded px-1 w-fit">
                                    {new Date(entry.timeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                                    - {entry.timeOut ? new Date(entry.timeOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "..."}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 border-t-[2px] border-black">
                                <span className={`font-black text-sm ${!entry.timeOut ? 'text-blue-600 animate-pulse' : 'text-black'}`}>
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
                <div className="p-6 bg-[#f0f0f0] border-t-[4px] border-black flex items-center justify-between">
                  <button
                    onClick={() => fetchEntries(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1 bg-white border-[3px] border-black px-4 py-2 rounded-xl font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-30 active:translate-y-0.5 active:shadow-none transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>

                  <div className="font-black text-sm uppercase tracking-tighter">
                    Page {page} <span className="text-gray-400">/</span> {totalPages}
                  </div>

                  <button
                    onClick={() => fetchEntries(page + 1)}
                    disabled={page >= totalPages}
                    className="flex items-center gap-1 bg-[#4DFF88] border-[3px] border-black px-4 py-2 rounded-xl font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-30 active:translate-y-0.5 active:shadow-none transition-all"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};