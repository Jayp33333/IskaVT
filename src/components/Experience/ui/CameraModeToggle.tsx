import useWorld from "../../../hooks/useWorld";
import { FaUser, FaStreetView } from "react-icons/fa";

export const CameraModeToggle = () => {
  const cameraMode = useWorld((s: any) => s.cameraMode);
  const setCameraMode = useWorld((s: any) => s.setCameraMode);

  return (
    <div className="flex gap-1 rounded-lg bg-black/60 p-1">
      {/* First Person */}
      <button
        onClick={() => setCameraMode("first")}
        className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition
          ${
            cameraMode === "first"
              ? "bg-[#7A0019] text-white"
              : "text-white/70 hover:bg-white/10"
          }`}
      >
        <FaUser size={12} />
        First
      </button>

      {/* Third Person */}
      <button
        onClick={() => setCameraMode("third")}
        className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition
          ${
            cameraMode === "third"
              ? "bg-[#7A0019] text-white"
              : "text-white/70 hover:bg-white/10"
          }`}
      >
        <FaStreetView size={12} />
        Third
      </button>
    </div>
  );
};
