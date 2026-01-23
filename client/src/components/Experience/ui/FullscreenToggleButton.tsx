import { useCallback, useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import useWorld from "../../../hooks/useWorld";

export const FullscreenToggleButton = () => {
  const showMiniMap = useWorld((s: any) => s.showMiniMap);
  const showLogHistory = useWorld((s: any) => s.showLogHistory);

  const [isFullscreen, setIsFullscreen] = useState<boolean>(
    typeof document !== "undefined" && !!document.fullscreenElement
  );

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    onChange();
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen toggle failed:", err);
    }
  }, []);

  // Safety: UI already hides controls when minimap is open
  if (showMiniMap) return null;

  return (
    <button
      onClick={toggleFullscreen}
      className={`w-10 h-10 rounded-xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center ${
        showLogHistory ? "blur-sm opacity-50 pointer-events-none" : ""
      }`}
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      type="button"
    >
      {isFullscreen ? (
        <Minimize2 className="w-4 h-4 text-[#660B05]" />
      ) : (
        <Maximize2 className="w-4 h-4 text-[#660B05]" />
      )}
    </button>
  );
};

