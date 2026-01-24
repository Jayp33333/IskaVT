import { useEffect, useMemo, useState } from "react";
import { enterKioskLandscape } from "../../../utils/kiosk";

function useIsPortrait() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia?.("(orientation: portrait)");

    const update = () => {
      setIsPortrait(mq ? mq.matches : window.innerHeight > window.innerWidth);
    };

    update();

    window.addEventListener("resize", update, { passive: true } as any);
    window.addEventListener("orientationchange", update, { passive: true } as any);

    if (mq) {
      // Safari fallback: addListener/removeListener
      if (mq.addEventListener) mq.addEventListener("change", update);
      else mq.addListener(update);
    }

    return () => {
      window.removeEventListener("resize", update as any);
      window.removeEventListener("orientationchange", update as any);
      if (mq) {
        if (mq.removeEventListener) mq.removeEventListener("change", update);
        else mq.removeListener(update);
      }
    };
  }, []);

  return isPortrait;
}

/**
 * Blocks the tour UI in portrait orientation.
 * This enforces "landscape only" even on browsers that can't truly lock orientation.
 */
export const OrientationGuard = () => {
  const isPortrait = useIsPortrait();

  const isMobileLike = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(pointer: coarse)").matches ?? false;
  }, []);

  if (!isPortrait) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 px-6 text-center">
      <div className="max-w-md">
        <h2 className="text-white text-2xl font-bold mb-3">Rotate your device</h2>
        <p className="text-white/80 text-sm leading-relaxed mb-6">
          This tour works in <span className="font-semibold text-white">landscape</span> only.
          {isMobileLike ? " Please rotate your phone/tablet to continue." : " Please resize your window to landscape to continue."}
        </p>
        <button
          type="button"
          onClick={() => {
            // Give the user a gesture to re-attempt fullscreen + orientation lock.
            void enterKioskLandscape();
          }}
          className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90 active:bg-white/80 transition-colors"
        >
          Go fullscreen &amp; try landscape
        </button>
      </div>
    </div>
  );
};

