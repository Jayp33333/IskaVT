import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Move, 
  MousePointer2, 
  Zap, 
  Map as MapIcon, 
  MessageCircle, 
  LogOut, 
  Maximize2,
  ArrowRight, 
  ArrowLeft,
  X
} from "lucide-react";

interface TourGuideDialogProps {
  open: boolean;
  onClose: () => void;
  portraitSrc?: string;
}

export const TourGuideDialog = ({ open, onClose, portraitSrc }: TourGuideDialogProps) => {
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (open) setPage(0);
  }, [open]);

  const maxPage = 1;
  const isLastPage = page === maxPage;

  const handleNext = () => (isLastPage ? onClose() : setPage(1));
  const handlePrev = () => setPage(0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1300] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 [@media(max-height:500px)]:p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="
              relative w-full max-w-[440px] [@media(max-height:500px)]:max-w-[440px] rounded-[2rem] sm:rounded-[2.5rem] [@media(max-height:500px)]:rounded-2xl
              bg-[#FFFDF9] text-slate-800 
              border-[4px] sm:border-[6px] [@media(max-height:500px)]:border-[4px] border-slate-900 
              shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] [@media(max-height:500px)]:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]
              flex flex-col max-h-[85vh] sm:max-h-[90vh] [@media(max-height:500px)]:max-h-[96dvh] overflow-hidden
            "
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
          >
            {/* Header - Resizes font and padding for mobile */}
            <div className="bg-[#D43F3F] border-b-[4px] sm:border-b-[6px] [@media(max-height:500px)]:border-b-[4px] border-slate-900 p-4 sm:p-5 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="bg-yellow-400 border-[3px] border-slate-900 px-2 py-0.5 rounded-full mb-1 [@media(max-height:500px)]:hidden inline-block">
                    <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-slate-900">Tutorial</p>
                  </div>
                  <h2 className="text-xl sm:text-2xl [@media(max-height:500px)]:text-sm font-black italic text-white leading-tight">CAMPUS GUIDE</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="bg-white border-[3px] border-slate-900 p-1.5 [@media(max-height:500px)]:p-1 rounded-xl hover:bg-slate-100 transition-transform active:scale-90"
                >
                  <X size={20} strokeWidth={4} />
                </button>
              </div>
            </div>

            {/* Content Area - Scrollable for small screens */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 [@media(max-height:500px)]:p-3 space-y-4 sm:space-y-6 [@media(max-height:500px)]:space-y-2 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={page}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-3 sm:space-y-4 [@media(max-height:500px)]:space-y-1.5"
                >
                  {page === 0 ? (
                    <>
                      <p className="text-xs sm:text-sm [@media(max-height:500px)]:text-[9px] font-bold text-slate-500 px-1 uppercase tracking-tight">Basic Controls</p>
                      <ControlCard label="Movement" desc="WASD / Arrows" color="bg-blue-400">
                        <Move size={20} strokeWidth={3} />
                      </ControlCard>
                      <ControlCard label="Camera" desc="Mouse / Touch" color="bg-purple-400">
                        <MousePointer2 size={20} strokeWidth={3} />
                      </ControlCard>
                      <ControlCard label="Sprint" desc="Hold Shift" color="bg-orange-400">
                        <Zap size={20} strokeWidth={3} />
                      </ControlCard>
                    </>
                  ) : (
                    <>
                      <p className="text-xs sm:text-sm [@media(max-height:500px)]:text-[9px] font-bold text-slate-500 px-1 uppercase tracking-tight">Special Features</p>
                      <ControlCard label="Navigation" desc="Mini-Map Teleport" color="bg-emerald-400">
                        <MapIcon size={20} strokeWidth={3} />
                      </ControlCard>
                      <ControlCard label="Social" desc="'F' Key Interaction" color="bg-pink-400">
                        <MessageCircle size={20} strokeWidth={3} />
                      </ControlCard>
                      <ControlCard label="Exit / Fullscreen" desc="Top-left toolbar" color="bg-amber-400">
                        <div className="flex items-center gap-1">
                          <LogOut size={16} strokeWidth={3} />
                          <Maximize2 size={16} strokeWidth={3} />
                        </div>
                      </ControlCard>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Avatar Dialogue - Shrinks on mobile */}
              {portraitSrc && (
                <div className="bg-slate-100 border-[3px] border-slate-900 p-3 [@media(max-height:500px)]:p-2 rounded-2xl flex items-center gap-3 [@media(max-height:500px)]:gap-2">
                  <img 
                    src={portraitSrc} 
                    className="h-10 w-10 sm:h-12 sm:w-12 [@media(max-height:500px)]:h-8 [@media(max-height:500px)]:w-8 rounded-xl border-[3px] border-slate-900 bg-white shrink-0" 
                    alt="Guide" 
                  />
                  <p className="text-[11px] sm:text-[12px] [@media(max-height:500px)]:text-[9px] font-bold italic text-slate-700 leading-tight">
                    Check the map to find buildings faster!
                  </p>
                </div>
              )}
            </div>

            {/* Footer Buttons - Full width stack on tiny screens if needed */}
            <div className="p-4 sm:p-5 [@media(max-height:500px)]:p-2.5 bg-white border-t-[4px] sm:border-t-[6px] [@media(max-height:500px)]:border-t-[4px] border-slate-900 flex items-center gap-3 [@media(max-height:500px)]:gap-2 shrink-0">
              {page === 1 && (
                <button
                  onClick={handlePrev}
                  className="p-3 [@media(max-height:500px)]:p-2 bg-white border-[3px] border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none transition-all shrink-0"
                >
                  <ArrowLeft size={20} strokeWidth={4} />
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="flex-1 py-3 [@media(max-height:500px)]:py-2 bg-[#D43F3F] text-white border-[3px] border-slate-900 rounded-xl text-sm sm:text-lg [@media(max-height:500px)]:text-[11px] font-black italic shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                {isLastPage ? "Start Tour!" : "Next Tip"}
                {!isLastPage && <ArrowRight size={18} strokeWidth={4} />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* Mini Component for Responsive Cards */
const ControlCard = ({ label, desc, children, color }: { label: string; desc: string; children: React.ReactNode; color: string }) => (
  <div className="flex items-center gap-3 [@media(max-height:500px)]:gap-2 p-1 [@media(max-height:500px)]:p-0.5">
    <div className={`${color} border-[3px] border-slate-900 p-2 sm:p-2.5 [@media(max-height:500px)]:p-1.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] shrink-0`}>
      {children}
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[9px] [@media(max-height:500px)]:text-[7px] font-black uppercase text-slate-400 tracking-wider truncate">{label}</span>
      <span className="text-xs sm:text-sm [@media(max-height:500px)]:text-[10px] font-extrabold text-slate-800 truncate">{desc}</span>
    </div>
  </div>
);