import { IoLocation } from "react-icons/io5";
import { AiOutlineDrag } from "react-icons/ai";
import useWorld from "../../../hooks/useWorld";
import { audioManager } from "../../../services/AudioManager";

export const PinControls = () => {
  const {
    selectPin,
    setSelectPin,
    pinPosition,
    setPinPosition,
    isPinConfirmed,
    setIsPinConfirmed,
    setCharacterPosition,
    setIsPinTeleported,
    setSelectedDestination,
    setQuery,
  } = useWorld((s: any) => s);

  const teleportToPin = () => {
    if (!pinPosition) return;
    setCharacterPosition({ x: pinPosition.x, y: 0.2, z: pinPosition.z });
    setIsPinConfirmed(false);
    useWorld.getState().setShowMiniMap(false);
    setIsPinTeleported(true);
    audioManager.play("teleported");
  };

  const handlePinModeToggle = () => {
    setSelectPin(!selectPin);
  };

  const handleUnpin = () => {
    setPinPosition(null);
    setIsPinConfirmed(false);
    setSelectedDestination(null);
    setSelectPin(true);
    setIsPinTeleported(false);
    setQuery("");
  };

  return (
    <>
      {/* Pin Mode / Drag Mode Toggle - Always Visible */}
      <button
        onClick={handlePinModeToggle}
        className="absolute top-4 left-4 z-101 flex min-w-16 flex-col items-center justify-center gap-1 rounded-md bg-black/70 p-2 text-white"
      >
        {selectPin ? <IoLocation size={28} /> : <AiOutlineDrag size={28} />}
        <span className="text-xs">{selectPin ? "Pin Mode" : "Drag Mode"}</span>
      </button>

      {/* Pin Confirmation Panel */}
      {pinPosition && !isPinConfirmed && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 left-1/2 z-200 w-[220px] -translate-x-1/2 rounded-lg bg-black/70 p-3 text-white shadow-lg flex gap-2 justify-center"
        >
          <button
            onClick={() => {
              setIsPinConfirmed(true);
              useWorld.getState().setShowMiniMap(false);
            }}
            className="rounded-md bg-[#7A0019] px-3 py-1"
          >
            Pin It
          </button>
          <button
            onClick={teleportToPin}
            className="rounded-md bg-[#7A0019] px-3 py-1"
          >
            Teleport
          </button>
        </div>
      )}

      {/* Pinned Info Panel */}
      {pinPosition && isPinConfirmed && (
        <div className="absolute top-16 left-1/2 z-200 w-40 -translate-x-1/2 rounded-lg bg-black/70 p-3 text-white shadow-lg text-center">
          <p className="text-sm font-semibold">Pinned Position</p>
          <div className="flex justify-center gap-2 text-xs">
            <span>X: {pinPosition.x.toFixed(2)}</span>
            <span>Z: {pinPosition.z.toFixed(2)}</span>
          </div>
          <button
            onClick={handleUnpin}
            className="mt-2 rounded-md bg-[#7A0019] px-3 py-1"
          >
            Unpin
          </button>
        </div>
      )}
    </>
  );
};
