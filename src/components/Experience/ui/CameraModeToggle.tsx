import { useGlobalLoading } from "../../../hooks/useGlobalLoading";
import useWorld from "../../../hooks/useWorld";
import { FaUser, FaStreetView } from "react-icons/fa";

export const CameraModeToggle = () => {
  const { cameraMode, setCameraMode } = useWorld((s: any) => ({
    cameraMode: s.cameraMode,
    setCameraMode: s.setCameraMode,
  }));
  const { withLoading } = useGlobalLoading();

  const switchCamera = (mode: "first" | "third") => {
    if (mode === cameraMode) return;

    withLoading(async () => {
      setCameraMode(mode);
      await new Promise((r) => setTimeout(r, 300));
    }, "Switching camera…");
  };

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
          onClick={() => switchCamera("first")}
          className="flex items-center gap-1 rounded-md transition"
          style={{
            padding: "clamp(2px,0.8vw,6px) clamp(4px,1vw,8px)",
            fontSize: "clamp(8px,1.5vw,10px)",
            background: cameraMode === "first" ? "#7A0019" : "transparent",
            color: cameraMode === "first" ? "#fff" : "rgba(255,255,255,.7)",
          }}
        >
          <FaUser size={14} />
          First
        </button>

        {/* Third Person */}
        <button
          onClick={() => switchCamera("third")}
          className="flex items-center gap-1 rounded-md transition"
          style={{
            padding: "clamp(2px,0.8vw,6px) clamp(4px,1vw,8px)",
            fontSize: "clamp(8px,1.5vw,10px)",
            background: cameraMode === "third" ? "#7A0019" : "transparent",
            color: cameraMode === "third" ? "#fff" : "rgba(255,255,255,.7)",
          }}
        >
          <FaStreetView size={14} />
          Third
        </button>
      </div>
    </div>
  );
};
