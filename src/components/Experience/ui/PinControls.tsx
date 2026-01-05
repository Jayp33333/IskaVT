import useWorld from "../../../hooks/useWorld";
import { audioManager } from "../../../services/AudioManager";

export const PinControls = () => {
  const {
    pinPosition,
    setPinPosition,
    isPinConfirmed,
    setIsPinConfirmed,
    setCharacterPosition,
    setIsPinTeleported,
    setSelectedDestination,
    setQuery,
  } = useWorld((s: any) => s);

  // Teleport player to pinned location
  const teleportToPin = () => {
    if (!pinPosition) return;
    setCharacterPosition({ x: pinPosition.x, y: 0.2, z: pinPosition.z });
    setIsPinConfirmed(false);
    useWorld.getState().setShowMiniMap(false);
    setIsPinTeleported(true);
    audioManager.play("teleported");
  };

  // Remove pin
  const handleUnpin = () => {
    setPinPosition(null);
    setIsPinConfirmed(false);
    setSelectedDestination(null);
    setIsPinTeleported(false);
    setQuery("");
  };

  return (
    <>
      {/* Game-style instructions panel (top-left) */}
      <div className="absolute top-4 left-4 z-200 max-w-xs rounded-lg bg-black/70 p-3 text-white text-sm font-medium shadow-md">
        <p className="font-semibold text-yellow-300">Guide Tip</p>
        <p>Double-tap anywhere on the map to pin your location.</p>
        <p>Once pinned, you can:</p>
        <ul className="list-disc list-inside text-xs mt-1">
          <li>Confirm the pin for reference</li>
          <li>Teleport to the pinned location instantly</li>
          <li>Remove the pin anytime using the 'Unpin' button</li>
        </ul>
      </div>

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
