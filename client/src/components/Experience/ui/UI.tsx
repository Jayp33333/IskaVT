import { Canvas } from "@react-three/fiber";
import useWorld from "../../../hooks/useWorld";

import { AvatarPicker } from "./AvatarPicker";
import { DestinationPicker } from "./DestinationPicker";
import { DestinationChecker } from "./DestinationChecker";
import { FloorLabel } from "./FloorLabel";
import { CenterDot } from "./CenterDot";
import { DistanceHUD } from "./DistanceHUD";

import { MiniMapOverlay } from "./MiniMapOverlay";
import { PinControls } from "./PinControls";
import { MiniMapEdgePin } from "./MiniMapEdgePin";
import DistanceUpdater from "./DistanceUpdater";
import { ArrowGuide } from "./ArrowGuide";
import { MiniMap } from "../MiniMap";
import { CameraModeToggle } from "./CameraModeToggle";

export const UI = () => {
  const { cameraMode, showMiniMap, pinPosition, isPinConfirmed } = useWorld(
    (s: any) => s
  );

  return (
    <>
      {/* First-Person Center Dot */}
      {cameraMode === "first" && !showMiniMap && <CenterDot />}

      {!showMiniMap && <MiniMapEdgePin />}

      {/* Top-left Controls */}
      {!showMiniMap && (
        <div className="fixed top-[1.5vh] left-[1.5vw] z-300 flex flex-col gap-2">
          <AvatarPicker />
          <CameraModeToggle />
          {pinPosition && isPinConfirmed && <DistanceHUD />}
        </div>
      )}

      {!showMiniMap && <DestinationPicker />}

      {/* MiniMap Canvas */}
      <div
        className="fixed z-100"
        style={{
          top: "2%",
          right: "2%",
          width: "clamp(100px, 15vw, 120px)",
          height: "clamp(100px, 15vw, 120px)",
        }}
      >
        <Canvas
          onClick={() =>
            !showMiniMap && useWorld.getState().setShowMiniMap(true)
          }
          style={{
            position: "fixed",
            width: showMiniMap ? "100vw" : "clamp(100px, 15vw, 120px)",
            maxWidth: showMiniMap ? "100%" : "200px",
            height: showMiniMap ? "100vh" : "clamp(100px, 15vw, 120px)",
            maxHeight: showMiniMap ? "100%" : "200px",
            border: "2px solid white",
            borderRadius: showMiniMap ? 0 : "50%",
            zIndex: 100,
            top: showMiniMap ? 0 : "2%",
            right: showMiniMap ? 0 : "2%",
            overflow: "hidden",
            touchAction: "none",
          }}
        >
          <MiniMap />
          <DistanceUpdater />
          <ArrowGuide />
        </Canvas>

        {!showMiniMap && <FloorLabel />}
      </div>

      {/* Cone Vision */}
      {!showMiniMap && (
        <div
          className="fixed top-[2%] right-[2%] z-101 pointer-events-none rounded-full border-2 border-white"
          style={{
            width: "clamp(100px, 15vw, 120px)",
            height: "clamp(100px, 15vw, 120px)",
            maxWidth: "200px",
            maxHeight: "200px",
            background: `conic-gradient(
        from ${-useWorld.getState().cameraRotation.y}rad, 
        rgba(255,255,255,0.3) 0deg 60deg, 
        transparent 60deg 360deg
      )`,
          }}
        />
      )}  

      {/* Modular Components */}
      {showMiniMap && <MiniMapOverlay />}
      {showMiniMap && <PinControls />}
      {!showMiniMap && pinPosition && isPinConfirmed && <DistanceHUD />}

      {/* Global Components */}
      <DestinationChecker />
    </>
  );
};
