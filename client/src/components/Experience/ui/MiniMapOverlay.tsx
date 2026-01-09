import { IoClose } from "react-icons/io5";
import { MdOutlineZoomIn, MdOutlineZoomOut } from "react-icons/md";
import useWorld from "../../../hooks/useWorld";

export const MiniMapOverlay = () => {
  const { setShowMiniMap, currentZoom, setCurrentZoom } = useWorld((s: any) => s);

  const MIN_ZOOM = 20;
  const MAX_ZOOM = 100;
  const STEP = (MAX_ZOOM - MIN_ZOOM) / 10;
  const zoomPercent = Math.round((currentZoom - MIN_ZOOM) / STEP) * 10;

  return (
    <>
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMiniMap(false);
        }}
        className="absolute z-101 rounded-md bg-black/70 text-white flex items-center justify-center"
        style={{
          top: "clamp(8px, 2vw, 16px)",
          right: "clamp(8px, 2vw, 16px)",
          padding: "clamp(6px, 1.5vw, 10px)",
          fontSize: "clamp(16px, 2.5vw, 24px)",
        }}
      >
        <IoClose />
      </button>

      {/* Zoom Controls */}
      <div
        className="absolute flex flex-col items-center z-101"
        style={{
          top: "clamp(80px, 20vh, 200px)",
          right: "clamp(8px, 2vw, 16px)",
          gap: "clamp(6px, 1.5vw, 12px)",
        }}
      >
        <button
          onClick={() => setCurrentZoom(0.9)}
          className="rounded-lg bg-black/70 text-white flex items-center justify-center"
          style={{
            padding: "clamp(6px, 1.5vw, 10px)",
            fontSize: "clamp(16px, 2.5vw, 20px)",
          }}
        >
          <MdOutlineZoomIn />
        </button>

        <div
          className="rounded-md bg-black/70 text-white font-semibold text-center"
          style={{
            minWidth: "clamp(50px, 10vw, 80px)",
            padding: "clamp(4px, 1vw, 8px) clamp(6px, 1.5vw, 10px)",
            fontSize: "clamp(12px, 2vw, 16px)",
          }}
        >
          {zoomPercent}%
        </div>

        <button
          onClick={() => setCurrentZoom(1.1)}
          className="rounded-lg bg-black/70 text-white flex items-center justify-center"
          style={{
            padding: "clamp(6px, 1.5vw, 10px)",
            fontSize: "clamp(16px, 2.5vw, 20px)",
          }}
        >
          <MdOutlineZoomOut />
        </button>
      </div>
    </>
  );
};
