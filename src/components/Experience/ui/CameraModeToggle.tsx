import useWorld from "../../../hooks/useWorld";
import { FaUser, FaStreetView } from "react-icons/fa";

export const CameraModeToggle = () => {
  const cameraMode = useWorld((s: any) => s.cameraMode);
  const setCameraMode = useWorld((s: any) => s.setCameraMode);

  return (
    <div className="flex gap-1 rounded-lg">
      <div
      className="flex gap-1 rounded-lg bg-black/60"
      style={{
        padding: "clamp(2px, 0.5vw, 6px)",
      }}
    >
      {/* First Person */}
      <button
        onClick={() => setCameraMode("first")}
        className={`flex items-center gap-1 rounded-md transition`}
        style={{
          gap: "clamp(2px, 0.5vw, 4px)",
          padding: "clamp(2px, 0.8vw, 6px) clamp(4px, 1vw, 8px)",
          fontSize: "clamp(8px, 1.5vw, 10px)",
          backgroundColor:
            cameraMode === "first" ? "#7A0019" : "transparent",
          color: cameraMode === "first" ? "#fff" : "rgba(255,255,255,0.7)",
        }}
      >
        <FaUser style={{ width: "clamp(12px, 1.5vw, 16px)", height: "clamp(8px, 1.5vw, 10px)" }} />
        First
      </button>

      {/* Third Person */}
      <button
        onClick={() => setCameraMode("third")}
        className={`flex items-center gap-1 rounded-md transition`}
        style={{
          gap: "clamp(2px, 0.5vw, 4px)",
          padding: "clamp(2px, 0.8vw, 6px) clamp(4px, 1vw, 8px)",
          fontSize: "clamp(8px, 1.5vw, 10px)",
          backgroundColor:
            cameraMode === "third" ? "#7A0019" : "transparent",
          color: cameraMode === "third" ? "#fff" : "rgba(255,255,255,0.7)",
        }}
      >
        <FaStreetView style={{ width: "clamp(12px, 1.5vw, 16px)", height: "clamp(8px, 1.5vw, 10px)" }} />
        Third
      </button>
       </div>
    </div>
  );
};
