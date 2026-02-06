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
      <div className="relative w-full max-w-2xl bg-gray-800/90 backdrop-blur-md rounded-lg border border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-900/50">
          <h2 className="text-lg font-semibold text-white">Settings</h2>
        </div>

        {/* Settings Content */}
        <div className="p-6">
          <div className="space-y-1">
            {/* Camera Mode */}
            <div className="flex items-center justify-between py-3 px-2">
              <span className="text-gray-300 text-sm">Camera Mode</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => switchCamera(cameraMode === "first" ? "third" : "first")}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Previous option"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-white text-sm min-w-[100px] text-center">{getCameraModeLabel()}</span>
                <button
                  onClick={() => switchCamera(cameraMode === "first" ? "third" : "first")}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Next option"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Camera Sensitivity */}
            <div className="flex items-center justify-between py-3 px-2 gap-6">
              <div className="flex flex-col">
                <span className="text-gray-300 text-sm">Camera Sensitivity</span>
                <span className="text-gray-500 text-xs">Adjust mouse/trackpad look speed</span>
              </div>
              <div className="flex items-center gap-3 w-[260px]">
                <input
                  type="range"
                  min={0.2}
                  max={3}
                  step={0.1}
                  value={cameraSensitivity}
                  onChange={(e) => setCameraSensitivity(Number(e.target.value))}
                  className="w-full accent-white"
                  aria-label="Camera sensitivity"
                />
                <span className="text-white text-sm tabular-nums min-w-[52px] text-right">
                  {cameraSensitivity.toFixed(1)}x
                </span>
              </div>
            </div>

            {/* Full Screen */}
            <div className="flex items-center justify-between py-3 px-2">
              <span className="text-gray-300 text-sm">Full Screen</span>
              <button
                onClick={toggleFullScreen}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
                aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
              >
                {isFullScreen ? (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    Exit Full Screen
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4" />
                    Enter Full Screen
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className={`border-t border-gray-700 bg-gray-900/50 p-4 flex items-center gap-3 ${hasActiveEntry ? 'justify-between' : 'justify-end'}`}>
          {hasActiveEntry && (
            <button
              onClick={handleExitTour}
              disabled={isExiting}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded border border-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded border border-gray-600 transition-colors duration-200"
          >
            Resume Tour
          </button>
        </div>

      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="absolute inset-0 flex items-center justify-center z-401">
          <div className="bg-white/98 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-red-50">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Exit Tour</h3>
            </div>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Are you sure you want to exit the tour? Your session will be ended and you'll be redirected to the home page.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelExit}
                disabled={isExiting}
                className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExitTour}
                disabled={isExiting}
                className="px-5 py-2.5 bg-[#660B05] hover:bg-[#8C1007] text-white font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
