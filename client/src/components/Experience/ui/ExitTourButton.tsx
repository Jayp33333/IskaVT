import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, X } from "lucide-react";
import useWorld from "../../../hooks/useWorld";
import { useLogbookTimeout } from "../../../hooks/useLogbookTimeout";

export function hasActiveTourEntry(): boolean {
  return (
    typeof window !== "undefined" &&
    localStorage.getItem("logbookEntryId") !== null
  );
}

type ExitTourConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ExitTourConfirmDialog({
  open,
  onOpenChange,
}: ExitTourConfirmDialogProps) {
  const { updateTimeout } = useLogbookTimeout();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!open) setIsExiting(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isExiting) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, isExiting, onOpenChange]);

  const handleExitTour = async () => {
    setIsExiting(true);
    try {
      await updateTimeout(true);
    } catch (error) {
      console.error("Error exiting tour:", error);
      window.location.href = "/";
    }
  };

  const handleCancelExit = () => {
    if (isExiting) return;
    onOpenChange(false);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[2220] bg-ink/85"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelExit}
          />

          <motion.div
            className="pointer-events-none fixed inset-0 z-[2221] flex items-end justify-center p-0 sm:items-center sm:p-4 [@media(max-height:500px)]:p-0 [@media(orientation:landscape)_and_(max-height:768px)]:p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pointer-events-auto mx-auto flex w-full max-w-md max-sm:max-w-none shrink-0 flex-col overflow-hidden rounded-t-[1.75rem] rounded-b-none border-[4px] border-ink border-b-0 bg-cream text-ink shadow-brutal-lg max-sm:border-b-0 sm:w-[min(100%,22rem)] sm:rounded-[2rem] sm:border-[6px] sm:shadow-brutal-lg max-h-[92dvh] sm:max-h-[90dvh] [@media(max-height:500px)]:max-h-[96dvh] [@media(max-height:500px)]:w-[min(100%,20rem)] [@media(max-height:500px)]:rounded-t-2xl [@media(max-height:500px)]:rounded-b-none [@media(orientation:landscape)_and_(max-height:768px)]:max-h-[96dvh] [@media(orientation:landscape)_and_(max-height:768px)]:w-[min(92vw,22rem)] [@media(orientation:landscape)_and_(max-height:768px)]:rounded-xl [@media(orientation:landscape)_and_(max-height:500px)]:w-[min(88vw,18rem)]"
              initial={{ scale: 0.98, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 24 }}
              transition={{ type: "spring", damping: 20, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="exit-tour-dialog-title"
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b-[4px] border-ink bg-maroon px-5 py-4 sm:border-b-[6px] [@media(max-height:500px)]:border-b-[4px] [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 [@media(orientation:landscape)_and_(max-height:600px)]:px-3 [@media(orientation:landscape)_and_(max-height:600px)]:py-2">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex shrink-0 items-center justify-center rounded-2xl border-[3px] border-ink bg-gold p-2 shadow-brutal-sm [@media(max-height:500px)]:p-1.5">
                    <LogOut
                      className="h-5 w-5 text-ink [@media(max-height:500px)]:h-4 [@media(max-height:500px)]:w-4"
                      strokeWidth={3.5}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="mb-1 hidden rounded-full border-[3px] border-ink bg-gold px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-ink sm:inline-block [@media(max-height:500px)]:hidden">
                      Leaving Campus
                    </p>
                    <h3
                      id="exit-tour-dialog-title"
                      className="truncate text-lg font-black italic leading-tight text-white sm:text-2xl [@media(max-height:500px)]:text-sm [@media(orientation:landscape)_and_(max-height:600px)]:text-base"
                    >
                      Exit Tour?
                    </h3>
                  </div>
                </div>
                <button
                  onClick={handleCancelExit}
                  disabled={isExiting}
                  className="shrink-0 rounded-xl border-[3px] border-ink bg-white p-1.5 transition-transform hover:bg-muted active:scale-90 disabled:opacity-50 [@media(max-height:500px)]:p-1"
                  aria-label="Close exit tour dialog"
                  type="button"
                >
                  <X className="h-5 w-5" strokeWidth={3} />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto bg-cream px-5 py-5 pb-[max(1rem,env(safe-area-inset-bottom))] [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-3 [@media(orientation:landscape)_and_(max-height:600px)]:px-3 [@media(orientation:landscape)_and_(max-height:600px)]:py-2.5 custom-scrollbar">
                <div className="rounded-2xl border-[3px] border-ink bg-cream p-4 text-sm font-bold leading-relaxed text-ink/80 shadow-brutal-sm [@media(max-height:500px)]:p-3 [@media(max-height:500px)]:text-xs [@media(orientation:landscape)_and_(max-height:600px)]:p-2.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-[11px]">
                  Are you sure you want to exit the tour? Your session will be ended and you&apos;ll
                  be redirected to the home page.
                </div>
              </div>

              <div className="flex shrink-0 flex-col-reverse gap-2 border-t-[4px] border-ink bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end sm:gap-3 sm:border-t-[6px] [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:border-t-[4px] [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2.5 [@media(orientation:landscape)_and_(max-height:600px)]:flex-row [@media(orientation:landscape)_and_(max-height:600px)]:justify-end [@media(orientation:landscape)_and_(max-height:600px)]:px-3 [@media(orientation:landscape)_and_(max-height:600px)]:py-2">
                <button
                  onClick={handleCancelExit}
                  disabled={isExiting}
                  className="w-full rounded-xl border-[3px] border-ink bg-white px-4 py-2.5 text-xs font-black uppercase text-ink shadow-brutal-sm transition-all active:translate-y-1 active:shadow-none disabled:opacity-50 sm:w-auto sm:py-2 sm:text-sm [@media(max-height:500px)]:py-2 [@media(orientation:landscape)_and_(max-height:600px)]:w-auto [@media(orientation:landscape)_and_(max-height:600px)]:px-3 [@media(orientation:landscape)_and_(max-height:600px)]:py-1.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-xs"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExitTour}
                  disabled={isExiting}
                  className="w-full rounded-xl border-[3px] border-ink bg-maroon px-4 py-2.5 text-xs font-black uppercase text-white shadow-brutal-sm transition-all hover:bg-maroon/90 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2 sm:text-sm [@media(max-height:500px)]:py-2 [@media(orientation:landscape)_and_(max-height:600px)]:w-auto [@media(orientation:landscape)_and_(max-height:600px)]:px-3 [@media(orientation:landscape)_and_(max-height:600px)]:py-1.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-xs"
                  type="button"
                >
                  {isExiting ? "Exiting..." : "Exit Tour"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

type ExitTourMenuItemProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function ExitTourMenuItem({ onClick, disabled }: ExitTourMenuItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-11 min-w-0 w-full items-center justify-center gap-2 rounded-xl border-2 border-ink bg-cream px-3 py-2.5 text-[10px] font-black uppercase tracking-wide text-ink transition-colors hover:bg-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 [@media(max-height:500px)]:min-h-10 [@media(max-height:500px)]:gap-1.5 [@media(max-height:500px)]:px-2.5 [@media(max-height:500px)]:py-2 [@media(max-height:500px)]:text-[9px] [@media(orientation:landscape)_and_(max-height:768px)]:min-h-9 [@media(orientation:landscape)_and_(max-height:768px)]:px-2 [@media(orientation:landscape)_and_(max-height:768px)]:py-1.5 [@media(orientation:landscape)_and_(max-height:768px)]:text-[8px]"
      type="button"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-[2px] border-ink bg-gold [@media(max-height:500px)]:h-6 [@media(max-height:500px)]:w-6">
        <LogOut
          className="h-3.5 w-3.5 text-maroon [@media(max-height:500px)]:h-3 [@media(max-height:500px)]:w-3"
          strokeWidth={2.75}
        />
      </span>
      Exit Tour
    </button>
  );
}

type ExitTourButtonProps = {
  variant?: "button" | "menuItem";
  onConfirmOpenChange?: (open: boolean) => void;
  onMenuClose?: () => void;
};

export const ExitTourButton = ({
  variant = "button",
  onConfirmOpenChange,
  onMenuClose,
}: ExitTourButtonProps) => {
  const showMiniMap = useWorld((s: any) => s.showMiniMap);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    onConfirmOpenChange?.(showExitConfirm);
  }, [showExitConfirm, onConfirmOpenChange]);

  if (!hasActiveTourEntry() || showMiniMap) return null;

  const handleOpenConfirm = () => {
    setShowExitConfirm(true);
    onMenuClose?.();
  };

  const trigger =
    variant === "menuItem" ? (
      <ExitTourMenuItem onClick={handleOpenConfirm} />
    ) : (
      <button
        onClick={handleOpenConfirm}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-[3px] border-ink bg-gold text-maroon shadow-brutal-sm transition-all hover:bg-gold/90 active:translate-y-1 active:shadow-none [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:rounded-xl [@media(max-height:500px)]:shadow-brutal-sm"
        title="Exit tour"
        aria-label="Exit tour"
        type="button"
      >
        <LogOut
          className="h-4 w-4 [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5"
          strokeWidth={3}
        />
      </button>
    );

  return (
    <>
      {trigger}
      <ExitTourConfirmDialog
        open={showExitConfirm}
        onOpenChange={setShowExitConfirm}
      />
    </>
  );
};
