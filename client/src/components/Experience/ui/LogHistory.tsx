import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { logbookAPI } from "../../../services/api";
import { X, Clock, MapPin, FileText, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import useWorld from "../../../hooks/useWorld";

interface LogbookEntryData {
  _id: string;
  fullName: string;
  visitorType: string;
  purpose: string;
  destination: string;
  date: string;
  timeIn: string;
  timeOut: string | null;
  createdAt: string;
  updatedAt: string;
}

export const LogHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const setShowLogHistory = useWorld((state: any) => state.setShowLogHistory);
  const showSettings = useWorld((state: any) => state.showSettings);
  const [entries, setEntries] = useState<LogbookEntryData[]>([]);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (timeIn: string, timeOut: string | null) => {
    if (!timeOut) return "In Progress";
    const start = new Date(timeIn);
    const end = new Date(timeOut);
    const diffMs = end.getTime() - start.getTime();
    // Round up to the next minute (ceil) so any partial minute counts as a full minute
    const diffMins = Math.ceil(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    // Ensure at least 1 minute is shown
    return `${Math.max(1, minutes)}m`;
  };

  return (
    <>
      {/* Log History Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setShowLogHistory(true);
        }}
        className={`w-10 h-10 rounded-xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center ${
          showSettings ? "blur-sm opacity-50 pointer-events-none" : ""
        }`}
        aria-label="View Log History"
        title="Logbook"
        type="button"
      >
        <FileText className="w-4 h-4 text-[#660B05]" />
      </button>

      {/* Notebook Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-1000 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsOpen(false);
                setShowLogHistory(false);
              }}
            />

            {/* Notebook Container */}
            <motion.div
              className="fixed inset-0 z-1001 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="
                  relative
                  w-full max-w-[95vw] max-h-[90vh] h-full
                  bg-white
                  rounded-xl
                  shadow-2xl
                  flex flex-col
                  border-2 border-gray-200
                  overflow-hidden
                "
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.3 }}
              >
                {/* Notebook Header */}
                <div className="px-6 py-4 border-b-2 border-gray-300 bg-linear-to-r from-[#660B05] to-[#8C1007] rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-white" />
                      <h2 className="text-2xl font-bold text-white">Visitor Logbook</h2>
                    </div>
                    <button
              onClick={() => {
                setIsOpen(false);
                setShowLogHistory(false);
              }}
              className="
                text-white/80 hover:text-white
                w-8 h-8 flex items-center justify-center
                rounded-full hover:bg-white/20
                transition-colors
              "
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
                  </div>
                </div>

                {/* Notebook Pages with Table Layout */}
                <div className="relative bg-[#fefefe] flex-1 min-h-0 overflow-hidden">
                  {/* Lined Paper Background */}
                  <div 
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        transparent,
                        transparent 31px,
                        #e0e0e0 31px,
                        #e0e0e0 32px
                      )`,
                      backgroundPosition: '0 0',
                      backgroundSize: '100% 32px'
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 px-2 sm:px-4 py-4 h-full overflow-y-auto">
                    {loading && (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-gray-500">Loading records...</div>
                      </div>
                    )}

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4">
                        {error}
                      </div>
                    )}

                    {!loading && !error && entries.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <FileText className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No entries found</p>
                        <p className="text-sm mt-2">Visitor logs will appear here</p>
                      </div>
                    )}

                    {!loading && !error && entries.length > 0 && (
                      <div className="overflow-x-auto w-full">
                        <table className="w-full border-collapse bg-white shadow-sm table-auto">
                          {/* Table Header */}
                          <thead>
                            <tr className="bg-linear-to-r from-[#660B05] to-[#8C1007] text-white">
                              <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-bold min-w-[100px] sm:min-w-[120px] border-r border-white/20">
                                Full Name
                              </th>
                              <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-bold min-w-20 sm:min-w-[100px] border-r border-white/20">
                                Visitor Type
                              </th>
                              <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-bold min-w-[100px] sm:min-w-[120px] border-r border-white/20">
                                Destination
                              </th>
                              <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-bold min-w-[120px] sm:min-w-[150px] max-w-[200px] border-r border-white/20">
                                Purpose
                              </th>
                              <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-bold min-w-20 sm:min-w-[100px] border-r border-white/20">
                                Date
                              </th>
                              <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-bold min-w-[70px] sm:min-w-[90px] border-r border-white/20">
                                Time In
                              </th>
                              <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-bold min-w-[70px] sm:min-w-[90px] border-r border-white/20">
                                Time Out
                              </th>
                              <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-bold min-w-[60px] sm:min-w-20">
                                Duration
                              </th>
                            </tr>
                          </thead>
                          {/* Table Body */}
                          <tbody>
                            {entries.map((entry, index) => (
                              <motion.tr
                                key={entry._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.02 }}
                                className="hover:bg-amber-50/50 transition-colors border-b border-gray-200 last:border-b-0"
                              >
                                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm font-semibold text-gray-900 border-r border-gray-200">
                                  {entry.fullName}
                                </td>
                                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-gray-700 border-r border-gray-200">
                                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                    {entry.visitorType}
                                  </span>
                                </td>
                                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-gray-700 border-r border-gray-200">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-gray-500 shrink-0" />
                                    <span className="truncate">{entry.destination}</span>
                                  </div>
                                </td>
                                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-gray-700 border-r border-gray-200" style={{ maxWidth: '200px', wordBreak: 'break-word' }}>
                                  <div 
                                    className="wrap-break-word" 
                                    title={entry.purpose}
                                    style={{ 
                                      wordBreak: 'break-word',
                                      overflowWrap: 'break-word',
                                      maxHeight: '4.5em',
                                      overflow: 'hidden',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 3,
                                      WebkitBoxOrient: 'vertical',
                                      lineHeight: '1.5em'
                                    }}
                                  >
                                    {entry.purpose}
                                  </div>
                                </td>
                                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-gray-700 border-r border-gray-200">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-gray-500 shrink-0" />
                                    <span className="whitespace-nowrap">{formatDate(entry.date)}</span>
                                  </div>
                                </td>
                                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-gray-700 font-mono border-r border-gray-200">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-gray-500 shrink-0" />
                                    <span className="whitespace-nowrap">{formatTime(entry.timeIn)}</span>
                                  </div>
                                </td>
                                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-gray-700 font-mono border-r border-gray-200">
                                  {entry.timeOut ? (
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-gray-500 shrink-0" />
                                      <span className="whitespace-nowrap">{formatTime(entry.timeOut)}</span>
                                    </div>
                                  ) : (
                                    <span className="text-amber-600 italic text-xs">In Progress</span>
                                  )}
                                </td>
                                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-gray-700 font-semibold">
                                  {entry.timeOut ? (
                                    <span className="text-[#660B05] whitespace-nowrap">{calculateDuration(entry.timeIn, entry.timeOut)}</span>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notebook Footer with Pagination */}
                {!loading && !error && entries.length > 0 && (
                  <div className="px-6 py-4 border-t-2 border-gray-300 bg-gray-50 rounded-b-xl">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => fetchEntries(page - 1)}
                        disabled={page === 1}
                        className="
                          flex items-center gap-2
                          px-4 py-2
                          bg-white hover:bg-gray-100
                          text-gray-700 font-medium
                          rounded-lg
                          border border-gray-300
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition-colors
                        "
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 font-medium">
                          Page {page} of {totalPages}
                        </span>
                        <span className="text-gray-400 text-sm">
                          ({entries.length} entries)
                        </span>
                      </div>
                      
                      <button
                        onClick={() => fetchEntries(page + 1)}
                        disabled={page >= totalPages}
                        className="
                          flex items-center gap-2
                          px-4 py-2
                          bg-[#660B05] hover:bg-[#8C1007]
                          text-white font-semibold
                          rounded-lg
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition-colors
                        "
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
