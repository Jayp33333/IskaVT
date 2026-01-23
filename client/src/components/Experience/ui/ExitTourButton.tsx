import { useState } from "react";
import { useLogbookTimeout } from "../../../hooks/useLogbookTimeout";
import { LogOut } from "lucide-react";
import useWorld from "../../../hooks/useWorld";

export const ExitTourButton = () => {
  const { updateTimeout } = useLogbookTimeout();
  const [isExiting, setIsExiting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const showLogHistory = useWorld((state: any) => state.showLogHistory);

  const handleExit = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
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

  const handleCancel = () => {
    setShowConfirm(false);
  };

  // Check if there's an active logbook entry
  const hasActiveEntry = localStorage.getItem('logbookEntryId') !== null;

  // Debug: Log to help identify why button might not show
  if (!hasActiveEntry) {
    console.log('ExitTourButton: No logbookEntryId in localStorage');
    return null;
  }

  return (
    <>
      <div className={`fixed bottom-[2vh] right-[2vw] z-500 transition-all ${
        showLogHistory ? "blur-sm opacity-50 pointer-events-none" : ""
      }`}>
        {!showConfirm ? (
          <button
            onClick={handleExit}
            disabled={isExiting}
            className="
              flex items-center gap-2
              px-4 py-3
              bg-[#660B05] hover:bg-[#8C1007]
              text-white font-semibold
              rounded-xl
              shadow-lg hover:shadow-xl
              transform hover:-translate-y-0.5 active:translate-y-0
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              border-2 border-white/20
            "
            aria-label="Exit Tour"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Tour</span>
          </button>
        ) : (
          <div className="
            bg-white/95 backdrop-blur-sm
            rounded-xl shadow-2xl
            p-4 border-2 border-[#660B05]/20
            min-w-[200px]
          ">
            <p className="text-sm font-semibold text-gray-800 mb-3 text-center">
              Are you sure you want to exit?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={isExiting}
                className="
                  flex-1 px-3 py-2
                  border-2 border-gray-300
                  text-gray-700 font-medium
                  rounded-lg
                  hover:bg-gray-50
                  transition-colors
                  disabled:opacity-50
                "
              >
                Cancel
              </button>
              <button
                onClick={handleExit}
                disabled={isExiting}
                className="
                  flex-1 px-3 py-2
                  bg-[#660B05] hover:bg-[#8C1007]
                  text-white font-semibold
                  rounded-lg
                  transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isExiting ? "Exiting..." : "Exit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
