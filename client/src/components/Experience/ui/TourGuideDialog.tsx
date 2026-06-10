import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import {
  CAMPUS_GUIDE_PORTRAIT,
  campusGuidePages,
  type CampusGuideTip,
} from "../../../data/campusGuideContent";

interface TourGuideDialogProps {
  open: boolean;
  onClose: () => void;
  portraitSrc?: string;
}

export const TourGuideDialog = ({
  open,
  onClose,
  portraitSrc = CAMPUS_GUIDE_PORTRAIT,
}: TourGuideDialogProps) => {
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (open) setPage(0);
  }, [open]);

  const maxPage = campusGuidePages.length - 1;
  const currentPage = campusGuidePages[page];
  const isLastPage = page === maxPage;

  const handleNext = () => (isLastPage ? onClose() : setPage((p) => p + 1));
  const handlePrev = () => setPage((p) => Math.max(0, p - 1));

  return (
    <AnimatePresence>
      {open && currentPage && (
        <motion.div
          className="fixed inset-0 z-[2200] flex items-center justify-center bg-ink/85 p-4 [@media(max-height:500px)]:p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative flex max-h-[85vh] w-full max-w-[440px] flex-col overflow-hidden rounded-[2rem] border-[4px] border-ink bg-cream text-ink shadow-brutal-md sm:max-h-[90vh] sm:rounded-[2.5rem] sm:border-[6px] sm:shadow-brutal-lg [@media(max-height:500px)]:max-h-[96dvh] [@media(max-height:500px)]:max-w-[440px] [@media(max-height:500px)]:rounded-2xl [@media(max-height:500px)]:border-[4px] [@media(max-height:500px)]:shadow-brutal-md"
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
          >
            <div className="shrink-0 border-b-[4px] border-ink bg-maroon p-4 sm:border-b-[6px] sm:p-5 [@media(max-height:500px)]:border-b-[4px] [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-black italic leading-tight text-white sm:text-2xl [@media(max-height:500px)]:text-sm">
                    {currentPage.title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 rounded-xl border-[3px] border-ink bg-white p-1.5 transition-transform hover:bg-muted active:scale-90 [@media(max-height:500px)]:p-1"
                  aria-label="Close campus guide"
                  type="button"
                >
                  <X size={20} strokeWidth={4} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:space-y-6 sm:p-6 [@media(max-height:500px)]:space-y-2 [@media(max-height:500px)]:p-3 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4 sm:space-y-5 [@media(max-height:500px)]:space-y-2.5"
                >
                  <div className="overflow-hidden rounded-2xl border-[3px] border-ink bg-white shadow-brutal-sm">
                    <img
                      src={currentPage.image}
                      alt={currentPage.imageAlt}
                      className="h-36 w-full object-cover sm:h-44 [@media(max-height:500px)]:h-28"
                      loading="eager"
                    />
                  </div>

                  <div className="space-y-3 sm:space-y-4 [@media(max-height:500px)]:space-y-1.5">
                    {currentPage.tips.map((tip) => (
                      <GuideTipCard key={tip.label} tip={tip} />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {currentPage.guideQuote && (
                <div className="flex items-center gap-3 rounded-2xl border-[3px] border-ink bg-muted p-3 [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:p-2">
                  <img
                    src={portraitSrc}
                    className="h-10 w-10 shrink-0 rounded-xl border-[3px] border-ink bg-white sm:h-12 sm:w-12 [@media(max-height:500px)]:h-8 [@media(max-height:500px)]:w-8"
                    alt="ISKA campus guide"
                  />
                  <p className="text-[11px] font-bold italic leading-tight text-ink/80 sm:text-[12px] [@media(max-height:500px)]:text-[9px]">
                    {currentPage.guideQuote}
                  </p>
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-3 border-t-[4px] border-ink bg-white p-4 sm:border-t-[6px] sm:p-5 [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:border-t-[4px] [@media(max-height:500px)]:p-2.5">
              {page > 0 && (
                <button
                  onClick={handlePrev}
                  className="shrink-0 rounded-xl border-[3px] border-ink bg-white p-3 shadow-brutal-sm transition-all active:translate-y-1 active:shadow-none [@media(max-height:500px)]:p-2"
                  aria-label="Previous page"
                  type="button"
                >
                  <ArrowLeft size={20} strokeWidth={4} />
                </button>
              )}

              <div className="flex flex-1 items-center justify-center gap-1.5">
                {campusGuidePages.map((guidePage, index) => (
                  <span
                    key={guidePage.id}
                    className={`h-2 rounded-full border-2 border-ink transition-all ${
                      index === page
                        ? "w-5 bg-maroon"
                        : "w-2 bg-white"
                    }`}
                    aria-hidden
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-[3px] border-ink bg-maroon py-3 text-sm font-black uppercase italic tracking-wide text-white shadow-brutal-sm transition-all active:translate-y-1 active:shadow-none sm:text-lg [@media(max-height:500px)]:py-2 [@media(max-height:500px)]:text-[11px]"
                type="button"
              >
                {isLastPage ? "Start Tour!" : "Next"}
                {!isLastPage && <ArrowRight size={18} strokeWidth={4} />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function GuideTipCard({ tip }: { tip: CampusGuideTip }) {
  const Icon = tip.icon;

  return (
    <div className="flex items-start gap-3 p-1 [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:p-0.5">
      <div
        className={`${tip.color} shrink-0 rounded-xl border-[3px] border-ink p-2 shadow-brutal-sm sm:p-2.5 [@media(max-height:500px)]:p-1.5`}
      >
        <Icon size={20} strokeWidth={3} />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[9px] font-black uppercase tracking-wider text-ink/40 [@media(max-height:500px)]:text-[7px]">
          {tip.label}
        </span>
        <p className="text-xs font-extrabold leading-snug text-ink sm:text-sm [@media(max-height:500px)]:text-[10px]">
          {tip.description}
        </p>
      </div>
    </div>
  );
}
