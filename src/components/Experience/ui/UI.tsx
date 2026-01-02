import { Canvas } from "@react-three/fiber";
import { AvatarPicker } from "./AvatarPicker";
import { MiniMap } from "../MiniMap";
import { useState } from "react";
import useWorld from "../../../hooks/useWorld";
import { IoClose, IoLocation } from "react-icons/io5";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { MdOutlineZoomIn, MdOutlineZoomOut } from "react-icons/md";
import { AiOutlineDrag } from "react-icons/ai";
import { DestinationChecker } from "./DestinationChecker";
import { ArrowGuide } from "./ArrowGuide";
import { MiniMapEdgePin } from "./MiniMapEdgePin";
import { DestinationPicker } from "./DestinationPicker";
import DistanceUpdater from "./DistanceUpdater";
import { audioManager } from "../../../services/AudioManager";
import { FloorLabel } from "./FloorLabel";
import { CameraModeToggle } from "./CameraModeToggle";
import { CenterDot } from "./CenterDot";

export const UI = () => {
  const [showMiniMap, setShowMiniMap] = useState(false);

  const {
    selectPin,
    setSelectPin,
    pinPosition,
    setPinPosition,
    isPinConfirmed,
    setIsPinConfirmed,
    setCharacterPosition,
    setIsPinTeleported,
    setCurrentZoom,
    cameraRotation,
    currentZoom,
    distance,
  } = useWorld((s: any) => s);

  const MIN_ZOOM = 20;
  const MAX_ZOOM = 100;
  const STEP = (MAX_ZOOM - MIN_ZOOM) / 10;
  const zoomPercent = Math.round((currentZoom - MIN_ZOOM) / STEP) * 10;

  const teleportToPin = () => {
    if (!pinPosition) return;
    setCharacterPosition({ x: pinPosition.x, y: 0.2, z: pinPosition.z });
    setIsPinConfirmed(false);
    setShowMiniMap(false);
    setIsPinTeleported(true);
    audioManager.play("teleported");
  };

  const handlePinClick = () => {
    if (pinPosition) {
      setPinPosition(null);
      setIsPinConfirmed(false);
    }
    setSelectPin(!selectPin);
  };

  return (
    <>
    <CenterDot/>
      {!showMiniMap && <MiniMapEdgePin />}

      {/* Avatar Picker */}
      {!showMiniMap && (
        <div className="fixed top-[1.5vh] left-[1.5vw] z-300 flex flex-col gap-2 rounded-xlp-2">
          <AvatarPicker />
          <CameraModeToggle />
        </div>
      )}

      {!showMiniMap && <DestinationPicker />}

      {/* MiniMap */}
      <Canvas
        onClick={() => !showMiniMap && setShowMiniMap(true)}
        style={{
          position: "fixed",
          width: showMiniMap ? "100vw" : "30vh",
          maxWidth: showMiniMap ? "100%" : "200px",
          height: showMiniMap ? "100vh" : "30vh",
          maxHeight: showMiniMap ? "100%" : "200px",
          border: "2px solid white",
          borderRadius: showMiniMap ? "0" : "50%",
          zIndex: 100,
          top: showMiniMap ? "0" : "2%",
          right: showMiniMap ? "0" : "2%",
          overflow: "hidden",
          touchAction: "none",
        }}
      >
        <MiniMap showMiniMap={showMiniMap} />
        <DistanceUpdater />
        <ArrowGuide />
      </Canvas>

      {/* Cone Vision */}
      {!showMiniMap && (
        <div
          className="fixed top-[2%] right-[2%] z-101 w-[30vh] h-[30vh] max-w-[200px] max-h-[200px] 
                     rounded-full border-2 border-white bg-white/30 pointer-events-none"
          style={{
            clipPath: "polygon(50% 50%, 25% 0, 75% 0)",
            transform: `rotate(${-cameraRotation.y}rad)`,
          }}
        />
      )}

      {showMiniMap && (
        <>
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMiniMap(false);  
            }}
            className="absolute top-4 right-4 z-101 rounded-md bg-black/70 p-2 text-white"
          >
            <IoClose />
          </button>

          {/* Zoom Controls */}
          <div className="absolute right-4 top-40 z-101 flex flex-col items-center gap-2">
            <button
              onClick={() => setCurrentZoom(0.9)}
              className="rounded-lg bg-black/70 p-2 text-white"
            >
              <MdOutlineZoomIn />
            </button>

            <div className="min-w-[60px] rounded-md bg-black/70 px-2 py-1 text-center text-xs font-semibold text-white">
              {zoomPercent}%
            </div>

            <button
              onClick={() => setCurrentZoom(1.1)}
              className="rounded-lg bg-black/70 p-2 text-white"
            >
              <MdOutlineZoomOut />
            </button>
          </div>
        </>
      )}

      {/* Pin Mode Toggle */}
      {showMiniMap && !isPinConfirmed && (
        <button
          onClick={handlePinClick}
          className="absolute top-4 left-4 z-101 flex min-w-16 flex-col items-center 
                     justify-center gap-1 rounded-md bg-black/70 p-2 text-white"
        >
          {selectPin ? <IoLocation size={28} /> : <AiOutlineDrag size={28} />}
          <span className="text-xs">
            {selectPin ? "Pin Mode" : "Drag Mode"}
          </span>
        </button>
      )}

      {/* Pin Confirmation */}
      {showMiniMap && pinPosition && !isPinConfirmed && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 left-1/2 z-200 w-[220px] -translate-x-1/2 
                     rounded-lg bg-black/70 p-3 text-white shadow-lg flex gap-2 justify-center"
        >
          <button
            onClick={() => { setIsPinConfirmed(true), setShowMiniMap(false); }}
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

      {/* Pinned Info */}
      {showMiniMap && pinPosition && isPinConfirmed && (
        <div
          className="absolute top-3 left-1/2 z-200 w-40 -translate-x-1/2 
                        rounded-lg bg-black/70 p-3 text-white shadow-lg text-center"
        >
          <p className="text-sm font-semibold">Pinned Position</p>
          <div className="flex justify-center gap-2 text-xs">
            <span>X: {pinPosition.x.toFixed(2)}</span>
            <span>Z: {pinPosition.z.toFixed(2)}</span>
          </div>
          <button
            onClick={() => {
              setPinPosition(null);
              setIsPinConfirmed(false);
            }}
            className="mt-2 rounded-md bg-[#7A0019] px-3 py-1"
          >
            Unpin
          </button>
        </div>
      )}

      {/* Distance UI */}
      {!showMiniMap && pinPosition && isPinConfirmed && (
        <div
          className="absolute left-[1vw] top-[20vh] z-200 flex flex-col items-center 
                        gap-2 rounded-xl bg-black/45 p-4 backdrop-blur-md text-white"
        >
          <p className="text-sm font-semibold">Distance</p>
          <div className="flex items-center gap-2">
            <FaLocationCrosshairs size={24} />
            <span className="text-sm font-medium">{distance.toFixed(1)}m</span>
          </div>
        </div>
      )}

      <DestinationChecker />
      <FloorLabel />
    </>
  );
};
