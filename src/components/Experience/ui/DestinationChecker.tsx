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
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isPinConfirmed || !characterPosition || !pinPosition) return;

    const checkDistance = () => {
      const charPos = characterPosition.clone();
      charPos.y = 0; // ignore vertical difference
      const pinPos = pinPosition.clone();
      pinPos.y = 0;

      const distance = charPos.distanceTo(pinPos);

      if (distance <= 1.5 && !isPinTeleported) {
        setShowDestinationText(true);
        audioManager.play("arrived");

        setTimeout(() => setFadeOut(true), 3000);
        setTimeout(() => {
          setShowDestinationText(false);
          setFadeOut(false);
        }, 3500);

        setPinPosition(null);
        setIsPinConfirmed(false);
      }
    };

    checkDistance();
  }, [characterPosition, pinPosition, isPinConfirmed, isPinTeleported]);

  if (!showDestinationText) return null;

  return (
    <div
      className={`fixed top-[10vh] left-1/2 -translate-x-1/2 z-500
                  bg-black/75 text-white font-bold flex items-center gap-3 
                  px-6 py-4 rounded-lg max-w-[90vw] wrap-break-word
                  text-[clamp(1em,2vw,1.2em)]
                  transition-opacity duration-500
                  ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <span>You have reached your destination!</span>
    </div>
  );
};
