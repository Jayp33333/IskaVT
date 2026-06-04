import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import useWorld from "../../../hooks/useWorld";
import { useLogbookTimeout } from "../../../hooks/useLogbookTimeout";

type ExitTourButtonProps = {
  onConfirmOpenChange?: (open: boolean) => void;
};

export const ExitTourButton = ({ onConfirmOpenChange }: ExitTourButtonProps) => {
  const showMiniMap = useWorld((s: any) => s.showMiniMap);
  const showLogHistory = useWorld((s: any) => s.showLogHistory);
  const { updateTimeout } = useLogbookTimeout();

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    onConfirmOpenChange?.(showExitConfirm);
  }, [showExitConfirm, onConfirmOpenChange]);

  const hasActiveEntry =
    typeof window !== "undefined" && localStorage.getItem("logbookEntryId") !== null;

  const handleExitTour = async () => {
    if (!showExitConfirm) {
      setShowExitConfirm(true);
      return;
    }

    setIsExiting(true);
    try {
      await updateTimeout(true);
    } catch (error) {
      console.error("Error exiting tour:", error);
      window.location.href = "/";
    }
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
    setIsExiting(false);
  };

  if (!hasActiveEntry || showMiniMap) return null;

  return (
    <>
      <button
        onClick={() => setShowExitConfirm(true)}
        disabled={isExiting}
        className={`w-10 h-10 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:h-9 rounded-2xl [@media(max-height:500px)]:rounded-xl border-[3px] border-ink bg-gold text-maroon hover:bg-gold/90 transition-all flex items-center justify-center shadow-brutal-sm [@media(max-height:500px)]:shadow-brutal-sm active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed ${
          showLogHistory ? "blur-sm opacity-50 pointer-events-none" : ""
        }`}
        title="Exit tour"
        aria-label="Exit tour"
        type="button"
      >
        <LogOut className="w-4 h-4 [@media(max-height:500px)]:w-3.5 [@media(max-height:500px)]:h-3.5" strokeWidth={3} />
      </button>

      {showExitConfirm && (
        <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4 [@media(max-height:500px)]:p-2">
          <div
            className="absolute inset-0 bg-ink/85"
            onClick={handleCancelExit}
          />
          <div className="relative w-full max-w-[440px] [@media(max-height:500px)]:max-w-[92vw] rounded-[2rem] sm:rounded-[2.5rem] [@media(max-height:500px)]:rounded-2xl border-[4px] sm:border-[6px] [@media(max-height:500px)]:border-[4px] border-ink bg-cream text-ink shadow-brutal-md sm:shadow-brutal-lg [@media(max-height:500px)]:shadow-brutal-md overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 border-b-[4px] sm:border-b-[6px] [@media(max-height:500px)]:border-b-[4px] border-ink bg-maroon">
              <div className="p-2 [@media(max-height:500px)]:p-1.5 rounded-2xl bg-gold border-[3px] border-ink shadow-brutal-sm shrink-0">
                <LogOut className="w-5 h-5 [@media(max-height:500px)]:w-4 [@media(max-height:500px)]:h-4 text-ink" strokeWidth={3.5} />
              </div>
              <div className="min-w-0">
                <p className="inline-block rounded-full bg-gold border-[3px] border-ink px-2 py-0.5 text-[9px] [@media(max-height:500px)]:hidden font-black uppercase tracking-wider text-ink">
                  Leaving Campus
                </p>
                <h3 className="mt-1 text-xl sm:text-2xl [@media(max-height:500px)]:text-base font-black italic text-white leading-tight">
                  Exit Tour?
                </h3>
              </div>
            </div>
            <div className="px-5 py-5 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-3">
              <div className="rounded-2xl border-[3px] border-ink bg-cream p-4 [@media(max-height:500px)]:p-3 shadow-brutal-sm text-sm [@media(max-height:500px)]:text-xs font-bold text-ink/80 leading-relaxed">
                Are you sure you want to exit the tour? Your session will be ended and you&apos;ll be
                redirected to the home page.
              </div>
            </div>
            <div className="flex gap-3 [@media(max-height:500px)]:gap-2 justify-end px-5 py-4 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 border-t-[4px] sm:border-t-[6px] [@media(max-height:500px)]:border-t-[4px] border-ink bg-white">
              <button
                onClick={handleCancelExit}
                disabled={isExiting}
                className="px-4 py-2 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-1.5 rounded-xl border-[3px] border-ink bg-white text-xs sm:text-sm font-black uppercase text-ink shadow-brutal-sm active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExitTour}
                disabled={isExiting}
                className="px-4 py-2 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-1.5 rounded-xl border-[3px] border-ink bg-maroon hover:bg-maroon/90 text-xs sm:text-sm font-black uppercase text-white shadow-brutal-sm active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExiting ? "Exiting..." : "Exit Tour"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
