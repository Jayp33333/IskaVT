import { useEffect, useState } from "react";
import useWorld from "../../../hooks/useWorld";
import { audioManager } from "../../../services/AudioManager";

export const DestinationChecker = () => {
  const characterPosition = useWorld((state: any) => state.characterPosition);
  const pinPosition = useWorld((state: any) => state.pinPosition);
  const isPinConfirmed = useWorld((state: any) => state.isPinConfirmed);
  const isPinTeleported = useWorld((state: any) => state.isPinTeleported);
  const setIsPinConfirmed = useWorld((state: any) => state.setIsPinConfirmed);
  const setPinPosition = useWorld((state: any) => state.setPinPosition);

  const [showDestinationText, setShowDestinationText] = useState(false);

  useEffect(() => {
    if (!isPinConfirmed || !characterPosition || !pinPosition) return;

    const THRESHOLD = 1.5; // meters
    const interval = setInterval(() => {
      const distance = characterPosition.distanceTo(pinPosition);

      if (distance <= THRESHOLD && !isPinTeleported) {
        setPinPosition(null);
        setIsPinConfirmed(false);
        setShowDestinationText(true);
        audioManager.play("arrived");
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [characterPosition, pinPosition, isPinConfirmed, isPinTeleported]);

  if (!showDestinationText) return null;

  return (
    <div className="fixed top-[10vh] left-1/2 -translate-x-1/2 z-500
                    bg-black/75 text-white font-bold flex items-center gap-3 
                    px-6 py-4 rounded-lg max-w-[90vw] wrap-break-word text-[clamp(1em,2vw,1.2em)]">
      <span>You have reached your destination!</span>
      <button
        onClick={() => setShowDestinationText(false)}
        className="text-white bg-transparent text-[1.2em] cursor-pointer"
      >
        ✖
      </button>
    </div>
  );
};
