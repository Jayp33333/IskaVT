import { FaLocationCrosshairs } from "react-icons/fa6";
import useWorld from "../../../hooks/useWorld";

export const DistanceHUD = () => {
  const { pinPosition, isPinConfirmed, distance, selectedDestination } =
    useWorld((s: any) => s);

  if (!pinPosition || !isPinConfirmed) return null;

  return (
    <div
      className="
    flex flex-col
    bg-black/45 backdrop-blur-md
    rounded-xl text-white shadow-lg
  "
      style={{
        gap: "clamp(4px, 1.5vw, 10px)", 
        padding: "clamp(6px, 1.5vw, 12px)",
      }}
    >
      <span
        className="uppercase tracking-wide opacity-70"
        style={{ fontSize: "clamp(8px, 1.5vw, 10px)" }}
      >
        {selectedDestination || "Distance"}
      </span>

      <div
        className="flex items-center"
        style={{ gap: "clamp(4px, 1.5vw, 8px)" }}
      >
        <FaLocationCrosshairs
          style={{ fontSize: "clamp(10px, 2.5vw, 12px)" }}
        />
        <span style={{ fontSize: "clamp(8px, 1.5vw, 10px)", fontWeight: 600 }}>
          {distance.toFixed(1)} m
        </span>
      </div>
    </div>
  );
};
