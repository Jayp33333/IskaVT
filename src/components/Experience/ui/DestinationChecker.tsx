import { useEffect, useState } from "react";
import useWorld from "../../../hooks/useWorld";

export const DestinationChecker = () => {
  const characterPosition = useWorld((state: any) => state.characterPosition);
  const pinPosition = useWorld((state: any) => state.pinPosition);
  const isPinConfirmed = useWorld((state: any) => state.isPinConfirmed);
  const isPinTeleported = useWorld((state: any) => state.isPinTeleported);
  const [showDestinationText, setShowDestinationText] = useState(false);
  const setIsPinConfirmed = useWorld((state: any) => state.setIsPinConfirmed);
  const setPinPosition = useWorld((state: any) => state.setPinPosition);

  useEffect(() => {
    if (!isPinConfirmed || !characterPosition || !pinPosition) return;

    const THRESHOLD = 1.5; // meters
    const interval = setInterval(() => {
      const distance = characterPosition.distanceTo(pinPosition);

      if (distance <= THRESHOLD && !isPinTeleported) {
        setPinPosition(null);
        setIsPinConfirmed(false);
        setShowDestinationText(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [characterPosition, pinPosition, isPinConfirmed, isPinTeleported]);

  if (!showDestinationText) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "10vh",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.75)",
        padding: "1em 1.5em",
        borderRadius: "0.8em",
        color: "white",
        fontSize: "clamp(1em, 2vw, 1.2em)", // responsive font
        fontWeight: "bold",
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        gap: "0.8em",
        maxWidth: "90vw", // prevent overflow on small screens
        wordBreak: "break-word", // handle long text
      }}
    >
      <span>You have reached your destination!</span>
      <button
        onClick={() => setShowDestinationText(false)}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "1.2em",
          cursor: "pointer",
        }}
      >
        ✖
      </button>
    </div>
  );
};
