import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, LogOut, Maximize2, Minimize2 } from "lucide-react";
import useWorld from "../../../hooks/useWorld";
import { useGlobalLoading } from "../../../hooks/useGlobalLoading";
import { useLogbookTimeout } from "../../../hooks/useLogbookTimeout";

export const SettingsPanel = () => {
  const showSettings = useWorld((s: any) => s.showSettings);
  const setShowSettings = useWorld((s: any) => s.setShowSettings);
  const cameraMode = useWorld((s: any) => s.cameraMode);
  const setCameraMode = useWorld((s: any) => s.setCameraMode);
  const cameraSensitivity = useWorld((s: any) => s.cameraSensitivity);
  const setCameraSensitivity = useWorld((s: any) => s.setCameraSensitivity);
  const { withLoading } = useGlobalLoading();
  const { updateTimeout } = useLogbookTimeout();

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
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

  // Handle ESC key to close settings
  useEffect(() => {
    if (!showSettings) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSettings(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showSettings, setShowSettings]);

  const switchCamera = (mode: "first" | "third") => {
    if (mode === cameraMode) return;
    withLoading(async () => {
      setCameraMode(mode);
      await new Promise((r) => setTimeout(r, 300));
    }, "Switching camera…");
  };

  const handleExitTour = async () => {
    if (!showExitConfirm) {
      setShowExitConfirm(true);
      return;
    }

    setIsExiting(true);
    try {
      await updateTimeout(true); // Navigate to home after timeout
    } catch (error) {
      console.error('Error exiting tour:', error);
      // Still navigate even if API call fails
      window.location.href = '/';
    }
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
    setIsExiting(false);
  };


  if (!showSettings) return null;

  const getCameraModeLabel = () => {
    return cameraMode === "first" ? "First Person" : "Third Person";
  };

  // Check if there's an active logbook entry
  const hasActiveEntry = typeof window !== "undefined" && localStorage.getItem('logbookEntryId') !== null;

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          setShowSettings(false);
          setShowExitConfirm(false);
        }}
      />

      {/* Settings Panel */}
      <div className="relative w-full max-w-2xl mx-4 sm:mx-6 max-h-[80dvh] sm:max-h-[85dvh] md:max-h-[90dvh] overflow-x-hidden overflow-y-auto bg-[#1c1c1c]/95 backdrop-blur-md rounded-md border border-white/15 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-gradient-to-r from-[#6b1111] to-[#b52222]">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-[0.16em] uppercase">
            Settings
          </h2>
        </div>

        {/* Settings Content */}
        <div className="p-4 sm:p-6 text-sm text-gray-100">
          <div className="space-y-1">
            {/* Camera Mode */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 px-2">
              <span className="text-gray-200 text-sm">Camera Mode</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => switchCamera(cameraMode === "first" ? "third" : "first")}
                  className="text-gray-400 hover:text-[#ffb3b3] transition-colors"
                  aria-label="Previous option"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-white text-sm min-w-[100px] text-center">
                  {getCameraModeLabel()}
                </span>
                <button
                  onClick={() => switchCamera(cameraMode === "first" ? "third" : "first")}
                  className="text-gray-400 hover:text-[#ffb3b3] transition-colors"
                  aria-label="Next option"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Camera Sensitivity */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 px-2">
              <div className="flex flex-col">
                <span className="text-gray-200 text-sm">Camera Sensitivity</span>
                <span className="text-gray-400 text-xs">Adjust mouse/trackpad look speed</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-[260px] min-w-0 shrink-0">
                <input
                  type="range"
                  min={0.2}
                  max={3}
                  step={0.1}
                  value={cameraSensitivity}
                  onChange={(e) => setCameraSensitivity(Number(e.target.value))}
                  className="w-full min-w-0 accent-[#b52222]"
                  aria-label="Camera sensitivity"
                />
                <span className="text-white text-sm tabular-nums min-w-[52px] text-right shrink-0">
                  {cameraSensitivity.toFixed(1)}x
                </span>
              </div>
            </div>

            {/* Full Screen */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 px-2">
              <span className="text-gray-200 text-sm">Full Screen</span>
              <button
                onClick={toggleFullScreen}
                className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-[#8f1616] hover:bg-[#b52222] text-white text-sm font-medium transition-colors shadow-sm w-full sm:w-auto"
                aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
              >
                {isFullScreen ? (
                  <>
                    <Minimize2 className="w-4 h-4 shrink-0" />
                    <span>Exit Full Screen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 shrink-0" />
                    <span>Enter Full Screen</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className={`border-t border-white/10 bg-black/50 p-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 ${hasActiveEntry ? 'sm:justify-between' : 'sm:justify-end'}`}>
          {hasActiveEntry && (
            <button
              onClick={handleExitTour}
              disabled={isExiting}
              className="flex items-center gap-2 px-4 py-2 rounded-sm border border-white/25 text-white text-sm font-medium bg-transparent hover:bg-white/10 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4" />
              {isExiting ? "Exiting..." : "Exit Tour"}
            </button>
          )}
          <button
            onClick={() => {
              setShowSettings(false);
              setShowExitConfirm(false);
            }}
            className="px-5 py-2 rounded-sm bg-[#8f1616] hover:bg-[#b52222] text-white text-sm font-semibold tracking-[0.12em] uppercase border border-transparent transition-colors duration-200"
          >
            Resume Tour
          </button>
        </div>

      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="absolute inset-0 flex items-center justify-center z-401 p-4">
          <div className="w-full max-w-md rounded-md border border-white/15 bg-[#1c1c1c]/98 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10 bg-gradient-to-r from-[#6b1111] to-[#b52222]">
              <div className="p-2 rounded-md bg-black/20">
                <LogOut className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white tracking-[0.12em] uppercase">
                Exit Tour
              </h3>
            </div>
            <div className="px-5 py-4 text-sm text-gray-100 leading-relaxed">
              Are you sure you want to exit the tour? Your session will be ended and you&apos;ll be redirected to the home page.
            </div>
            <div className="flex gap-3 justify-end px-5 py-3 border-t border-white/10 bg-black/40">
              <button
                onClick={handleCancelExit}
                disabled={isExiting}
                className="px-4 py-1.5 rounded-sm border border-white/25 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExitTour}
                disabled={isExiting}
                className="px-4 py-1.5 rounded-sm bg-[#8f1616] hover:bg-[#b52222] text-xs sm:text-sm font-semibold text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isExiting ? "Exiting..." : "Exit Tour"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
