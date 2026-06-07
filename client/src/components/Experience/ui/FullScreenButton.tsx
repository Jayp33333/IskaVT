import { useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import useWorld from "../../../hooks/useWorld";

type FullScreenButtonProps = {
  variant?: "button" | "menuItem";
  onMenuClose?: () => void;
};

export const FullScreenButton = ({
  variant = "button",
  onMenuClose,
}: FullScreenButtonProps) => {
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
    onMenuClose?.();
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

  const label = isFullScreen ? "Exit Full Screen" : "Full Screen";
  const Icon = isFullScreen ? Minimize2 : Maximize2;

  if (variant === "menuItem") {
    return (
      <button
        onClick={toggleFullScreen}
        className={`flex h-full min-w-0 w-full items-center gap-2.5 rounded-xl border-[2px] border-ink bg-white px-3 py-2.5 text-left text-[10px] font-black uppercase tracking-wide text-ink shadow-brutal-sm transition-all hover:bg-cream active:translate-y-0.5 [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:px-2.5 [@media(max-height:500px)]:py-2 [@media(max-height:500px)]:text-[9px] [@media(orientation:landscape)_and_(max-height:500px)]:px-2 [@media(orientation:landscape)_and_(max-height:500px)]:py-1.5 [@media(orientation:landscape)_and_(max-height:500px)]:text-[8px] ${
          showLogHistory ? "pointer-events-none blur-sm opacity-50" : ""
        }`}
        type="button"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-[2px] border-ink bg-gold [@media(max-height:500px)]:h-6 [@media(max-height:500px)]:w-6">
          <Icon
            className="h-3.5 w-3.5 text-maroon [@media(max-height:500px)]:h-3 [@media(max-height:500px)]:w-3"
            strokeWidth={3}
          />
        </span>
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={toggleFullScreen}
      className={`flex h-10 w-10 items-center justify-center rounded-2xl border-[3px] border-ink bg-gold text-maroon shadow-brutal-sm transition-all hover:bg-gold/90 active:translate-y-1 active:shadow-none [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:rounded-xl [@media(max-height:500px)]:shadow-brutal-sm ${
        showLogHistory ? "pointer-events-none blur-sm opacity-50" : ""
      }`}
      title={label}
      aria-label={label}
      type="button"
    >
      <Icon
        className="h-4 w-4 [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5"
        strokeWidth={3}
      />
    </button>
  );
};
