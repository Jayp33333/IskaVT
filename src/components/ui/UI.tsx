import { Canvas, useFrame } from "@react-three/fiber";
import { AvatarPicker } from "./AvatarPicker";
import { MiniMap } from "../MiniMap";
import { useState } from "react";
import useWorld from "../../hooks/useWorld";
import { IoClose, IoAdd } from "react-icons/io5";
import { BiMinus } from "react-icons/bi";

const DistanceUpdater = () => {
  const characterPosition = useWorld((state: any) => state.characterPosition);
  const pinPosition = useWorld((state: any) => state.pinPosition);
  const setDistance = useWorld((state: any) => state.setDistance);

  useFrame(() => {
    if (characterPosition && pinPosition) {
      const dist = characterPosition.distanceTo(pinPosition);
      setDistance(dist);
    }
  });

  return null;
};

export const UI = () => {
  const [showMiniMap, setShowMiniMap] = useState(false);
  const setSelectPin = useWorld((state: any) => state.setSelectPin);
  const selectPin = useWorld((state: any) => state.selectPin);
  const pinPosition = useWorld((state: any) => state.pinPosition);
  const setPinPosition = useWorld((state: any) => state.setPinPosition);
  const isPinConfirmed = useWorld((state: any) => state.isPinConfirmed);
  const setIsPinConfirmed = useWorld((state: any) => state.setIsPinConfirmed);
  const setCharacterPosition = useWorld(
    (state: any) => state.setCharacterPosition
  );
  const setIsPinTeleported = useWorld((state: any) => state.setIsPinTeleported);
  const setCurrentZoom = useWorld((state: any) => state.setCurrentZoom);

  const distance = useWorld((state: any) => state.distance);

  const handleMapClick = () => {
    if (!showMiniMap) setShowMiniMap(true);
  };

  const handlePinClick = () => {
    if (pinPosition) {
      setPinPosition(null);
      setIsPinConfirmed(false);
    }
    setSelectPin(!selectPin);
  };

  const handleClose = (e: any) => {
    e.stopPropagation();
    setShowMiniMap(false);
  };

  const teleportToPin = () => {
    if (pinPosition) {
      setCharacterPosition({ x: pinPosition.x, y: 10, z: pinPosition.z });
      // setPinPosition(null);
      setIsPinConfirmed(false);
      setSelectPin(false);
      setShowMiniMap(false);
      setIsPinTeleported(true);
    }
  };

  const handleZoomIn = () => {
    setCurrentZoom(1.1);
  };

  const handleZoomOut = () => {
    setCurrentZoom(0.9);
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 300,
        }}
      >
        <AvatarPicker />
      </div>

      <div>
        {/* Overlay minimap */}
        <Canvas
          onClick={handleMapClick}
          style={{
            position: "absolute",
            width: showMiniMap ? "auto" : 200,
            height: showMiniMap ? "auto" : 200,
            border: "2px solid white",
            borderRadius: showMiniMap ? "0" : "50%",
            zIndex: 100,
            transition: "0.3s ",
            inset: showMiniMap ? 0 : "none",
            top: showMiniMap ? 0 : 10,
            left: showMiniMap ? 0 : 10,
            overflow: "hidden",
            touchAction: "none"
          }}
          
        >
          <MiniMap showMiniMap={showMiniMap} />
          <DistanceUpdater />
        </Canvas>

        {/* Close button (only when zoomed) */}
        {showMiniMap && (
          <>
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 101,
                background: "rgba(0,0,0,0.7)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <IoClose />
            </button>

            {/* Zoom in and zoom out button */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "10px",
                zIndex: 101,
              }}
            >
              <button
                onClick={handleZoomOut}
                style={{
                  background: "rgba(0,0,0,0.7)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                <IoAdd />
              </button>

              <button
                onClick={handleZoomIn}
                style={{
                  background: "rgba(0,0,0,0.7)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                <BiMinus />
              </button>
            </div>
          </>
        )}

        {showMiniMap && !isPinConfirmed && (
          <button
            onClick={handlePinClick}
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 101,
              background: "rgba(0,0,0,0.7)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <img
              src={selectPin ? "/textures/pin.png" : "/textures/drag.png"}
              alt="Pin"
              style={{ width: 50, height: 50 }}
            />
          </button>
        )}

        {showMiniMap && pinPosition && !isPinConfirmed && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 220,
              padding: 12,
              background: "white",
              borderRadius: 8,
              zIndex: 200,
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              color: "black",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ marginBottom: 10 }}>Pin Location Selected</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPinConfirmed(true);
              }}
              style={{ marginRight: 10 }}
            >
              Pin It
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                teleportToPin();
              }}
            >
              Teleport
            </button>
          </div>
        )}

        {showMiniMap && pinPosition && isPinConfirmed && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 250,
              background: "white",
              padding: "12px",
              borderRadius: "8px",
              zIndex: 200,
              color: "black",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
          >
            <p>Pinned Position:</p>
            <p>X: {pinPosition.x.toFixed(2)}</p>
            <p>Z: {pinPosition.z.toFixed(2)}</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setPinPosition(null);
                setIsPinConfirmed(false);
              }}
            >
              Unpin
            </button>
          </div>
        )}
      </div>

      {/* distance container */}
      {!showMiniMap && pinPosition && isPinConfirmed && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "12px",
            borderRadius: "8px",
            zIndex: 200,
            color: "black",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          }}
        >
          <p>Distance: {distance.toFixed(2)}m</p>
        </div>
      )}
    </>
  );
};
