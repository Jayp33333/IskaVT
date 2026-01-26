import { Settings } from "lucide-react";
import useWorld from "../../../hooks/useWorld";

export const SettingsButton = () => {
  const showMiniMap = useWorld((s: any) => s.showMiniMap);
  const showLogHistory = useWorld((s: any) => s.showLogHistory);
  const setShowSettings = useWorld((s: any) => s.setShowSettings);

  // Hide when minimap is open
  if (showMiniMap) return null;

  return (
    <button
      onClick={() => setShowSettings(true)}
      className={`w-10 h-10 rounded-xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center ${
        showLogHistory ? "blur-sm opacity-50 pointer-events-none" : ""
      }`}
      title="Settings"
      aria-label="Settings"
      type="button"
    >
      <Settings className="w-4 h-4 text-[#660B05]" />
    </button>
  );
};
