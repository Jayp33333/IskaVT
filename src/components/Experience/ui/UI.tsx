import { Canvas, useFrame } from "@react-three/fiber";
import { AvatarPicker } from "./AvatarPicker";
import { MiniMap } from "../MiniMap";
import { useState } from "react";
import useWorld from "../../../hooks/useWorld";
import { IoClose } from "react-icons/io5";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { MdOutlineZoomIn, MdOutlineZoomOut } from "react-icons/md";
import { IoLocation } from "react-icons/io5";
import { AiOutlineDrag } from "react-icons/ai";
import { DestinationChecker } from "./DestinationChecker";
import { ArrowGuide } from "./ArrowGuide";
import { MiniMapEdgePin } from "./MiniMapEdgePin";

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
  const cameraRotation = useWorld((state: any) => state.cameraRotation);

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
    {!showMiniMap && <MiniMapEdgePin radius={90} />}

      {!showMiniMap && (
        <div
          style={{
            position: "fixed",
            top: "1.5vh", 
            left: "1.5vw", 
            zIndex: 300,
            display: "flex",
            flexDirection: "column",
            gap: "1vh", 
            borderRadius: "12px",
            backdropFilter: "blur(6px)",
            background: "rgba(0, 0, 0, 0.35)",
            // width: "clamp(70px, 14vw, px)", // responsive width
          }}
        >
          <AvatarPicker />
        </div>
      )}

      <div>
        {/* Overlay minimap */}
        <Canvas
          onClick={handleMapClick}
          style={{
            position: "fixed", 
            width: showMiniMap ? "100vw" : "30vh", 
            maxWidth: showMiniMap ? "100%" : "200px", 
            height: showMiniMap ? "100vh" : "30vh", 
            maxHeight: showMiniMap ? "100%" : "200px", 
            border: "2px solid white",
            borderRadius: showMiniMap ? "0" : "50%",
            zIndex: 100,
            // transition: "all 0.3s ease-in-out",
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
            style={{
              position: "fixed",
              width: "30vh",
              maxWidth: "200px",
              height: "30vh",
              maxHeight: "200px",
              zIndex: 101,
              top: "2%",
              right: "2%",
              overflow: "hidden",
              touchAction: "none",
              background: "rgba(255, 255, 255, 0.3)", 
              borderRadius: "50%",
              clipPath: "polygon(50% 50%, 25% 0, 75% 0)",
              border: "2px solid white",
              transform: `rotate(${-cameraRotation.y}rad)`,
              transition: "transform 0.1s linear",
            }}
          ></div>
        )}

        {/* Close button (only when zoomed) */}
        {showMiniMap && (
          <>
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: "1em",
                right: "1em",
                zIndex: 101,
                background: "rgba(0,0,0,0.7)",
                color: "white",
                border: "none",
                borderRadius: "0.5em",
                padding: "0.5em 0.8em",
                cursor: "pointer",
                fontSize: "1em",
              }}
            >
              <IoClose />
            </button>

            {/* Zoom in and zoom out button */}
            <div
              style={{
                position: "absolute",
                right: "1em",
                top: "10em",
                // left: "50%",
                // transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
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
                <MdOutlineZoomIn />
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
                <MdOutlineZoomOut />
              </button>
            </div>
          </>
        )}

        {showMiniMap && !isPinConfirmed && (
          <button
            onClick={handlePinClick}
            style={{
              position: "absolute",
              top: "1em", 
              left: "1em", 
              zIndex: 101,
              background: "rgba(0,0,0,0.7)",
              color: "white",
              border: "none",
              borderRadius: "0.5em",
              padding: "0.5em", 
              cursor: "pointer",
              fontSize: "1em",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "4em", 
            }}
          >
            {selectPin ? <IoLocation size={30} /> : <AiOutlineDrag size={30} />}
            <p style={{ margin: 0, fontSize: "0.8em", textAlign: "center" }}>
              {selectPin ? "Pin Mode" : "Drag Mode"}
            </p>
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
              background: "rgba(0,0,0,0.7)",
              borderRadius: 8,
              zIndex: 200,
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            

            <div style={{}}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPinConfirmed(true);
                }}
                style={{ marginRight: 10, backgroundColor: "#7A0019" }}
              >
                Pin It
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  teleportToPin();
                }}
                style={{
                  backgroundColor: "#7A0019",
                }}
              >
                Teleport
              </button>
            </div>
          </div>
        )}

        {showMiniMap && pinPosition && isPinConfirmed && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 150,
              background: "rgba(0,0,0,0.7)",
              padding: "12px",
              borderRadius: "8px",
              zIndex: 200,
              color: "white",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ marginBottom: 0 }}>Pinned Position:</p>
            <div style={{ display: "flex", gap: 10 }}>
              <p>X: {pinPosition.x.toFixed(2)}</p>
              <p>Z: {pinPosition.z.toFixed(2)}</p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setPinPosition(null);
                setIsPinConfirmed(false);
              }}
              style={{
                background: "#7A0019",
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
            top: "20vh",
            left: "1vw",
            padding: "1em",
            borderRadius: "0.8em",
            zIndex: 200,
            color: "white",
            display: "flex",
            flexDirection: "column",
            gap: "0.5em",
            maxWidth: "80vw",
            backdropFilter: "blur(6px)",
            background: "rgba(0,0,0,0.45)",
            transition: "all 0.3s ease",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontSize: "clamp(0.5rem, 2.5vw, 1rem)", 
              margin: 0,
              fontWeight: 600,
            }}
          >
            Distance
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6em",
            }}
          >
            <FaLocationCrosshairs
              size={28}
              style={{
                width: "clamp(12px, 4vw, 24px)",
                height: "clamp(12px, 4vw, 24px)",
                color: "FFD700",
              }}
            />

            <p
              style={{
                margin: 0,
                fontSize: "clamp(0.4rem, 2.2vw, 0.9rem)", 
                fontWeight: 500,
              }}
            >
              {distance.toFixed(1)}m
            </p>
          </div>
        </div>
      )}

      <DestinationChecker />
    </>
  );
};
