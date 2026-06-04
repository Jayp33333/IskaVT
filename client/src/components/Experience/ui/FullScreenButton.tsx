import { useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import useWorld from "../../../hooks/useWorld";

export const FullScreenButton = () => {
  const showMiniMap = useWorld((s: any) => s.showMiniMap);
  const showLogHistory = useWorld((s: any) => s.showLogHistory);
  const [isFullScreen, setIsFullScreen] = useState(
    typeof document !== "undefined" && !!document.fullscreenElement
  );

  useEffect(() => {
    const onFullscreenChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullScreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("Full screen not supported or denied:", err);
    }
  };

  if (showMiniMap) return null;

  return (
    <button
      onClick={toggleFullScreen}
      className={`w-10 h-10 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:h-9 rounded-2xl [@media(max-height:500px)]:rounded-xl border-[3px] border-ink bg-gold text-maroon hover:bg-gold/90 transition-all flex items-center justify-center shadow-brutal-sm [@media(max-height:500px)]:shadow-brutal-sm active:translate-y-1 active:shadow-none ${
        showLogHistory ? "blur-sm opacity-50 pointer-events-none" : ""
      }`}
      title={isFullScreen ? "Exit full screen" : "Enter full screen"}
      aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
      type="button"
    >
      {isFullScreen ? (
        <Minimize2 className="w-4 h-4 [@media(max-height:500px)]:w-3.5 [@media(max-height:500px)]:h-3.5" strokeWidth={3} />
      ) : (
        <Maximize2 className="w-4 h-4 [@media(max-height:500px)]:w-3.5 [@media(max-height:500px)]:h-3.5" strokeWidth={3} />
      )}
    </button>
  );
};
