import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import useWorld from "../../../hooks/useWorld";
import type { FixedLocationPin } from "../../../sampleData";

import { AvatarPicker } from "./AvatarPicker";
import { DestinationPicker } from "./DestinationPicker";
import { DestinationChecker } from "./DestinationChecker";
import { FloorLabel } from "./FloorLabel";
import { DistanceHUD } from "./DistanceHUD";

import { MiniMapOverlay } from "./MiniMapOverlay";
import { PinControls } from "./PinControls";
import { MiniMapEdgePin } from "./MiniMapEdgePin";
import DistanceUpdater from "./DistanceUpdater";
import { ArrowGuide } from "./ArrowGuide";
import { MiniMap } from "../MiniMap";
import { LogHistory } from "./LogHistory";
import { SettingsButton } from "./SettingsButton";
import { SettingsPanel } from "./SettingsPanel";
import { FixedLocationModal } from "./FixedLocationModal";
import { NPCDialog } from "./NPCDialog";
import { audioManager } from "../../../services/AudioManager";

interface UIProps {
  /** When true, hide main HUD controls (avatar, settings, logbook, destination picker, minimap) */
  overlayBlocked?: boolean;
}

export const UI = ({ overlayBlocked = false }: UIProps) => {
  const {
    showMiniMap,
    pinPosition,
    isPinConfirmed,
    activeNPCDialog,
  } = useWorld((s: any) => ({
    showMiniMap: s.showMiniMap,
    pinPosition: s.pinPosition,
    isPinConfirmed: s.isPinConfirmed,
    activeNPCDialog: s.activeNPCDialog,
  }));

  const [selectedFixedPin, setSelectedFixedPin] =
    useState<FixedLocationPin | null>(null);

  return (
    <>
      {!showMiniMap && !overlayBlocked && <MiniMapEdgePin />}

      {/* Top-left Controls */}
      {!showMiniMap && !overlayBlocked && (
        <div className="fixed top-[1.5vh] left-[1.5vw] z-300 flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <AvatarPicker />
            <SettingsButton />
            <LogHistory />
          </div>
          {pinPosition && isPinConfirmed && <DistanceHUD />}
        </div>
      )}

      {!showMiniMap && !overlayBlocked && <DestinationPicker />}

      {/* MiniMap Canvas */}
      {!overlayBlocked && (
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
            <MiniMap onFixedPinClick={(pin) => setSelectedFixedPin(pin)} />
            <DistanceUpdater />
            <ArrowGuide />
          </Canvas>

          {!showMiniMap && !activeNPCDialog && <FloorLabel />}
        </div>
      )}

      {/* Cone Vision */}
      {!showMiniMap && !overlayBlocked && (
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
      {showMiniMap && !overlayBlocked && <MiniMapOverlay />}
      {showMiniMap && !overlayBlocked && <PinControls />}
      {!showMiniMap && !overlayBlocked && pinPosition && isPinConfirmed && (
        <DistanceHUD />
      )}

      {/* Global Components */}
      <DestinationChecker />

      {/* NPC Dialog - fixed at bottom like WelcomeDialog */}
      {activeNPCDialog && (
        <NPCDialog
          open
          title={activeNPCDialog.title}
          message={activeNPCDialog.message}
          options={activeNPCDialog.options}
          onClose={activeNPCDialog.onClose}
        />
      )}

      {/* Settings Panel */}
      <SettingsPanel />

      <FixedLocationModal
        pin={selectedFixedPin}
        onClose={() => setSelectedFixedPin(null)}
        onVisit={(target) => {
          // Teleport only - no pin or destination picker display (those show only when user chooses destination or pins on map)
          useWorld.getState().setCharacterPosition({
            x: target.position.x,
            y: target.position.y,
            z: target.position.z,
          } as any);
          useWorld.getState().setPinPosition(target.position.clone());
          useWorld.getState().setIsPinTeleported(true);
          useWorld.getState().setShowMiniMap(false);
          audioManager.play("teleported");
          setSelectedFixedPin(null);
        }}
      />
    </>
  );
};
