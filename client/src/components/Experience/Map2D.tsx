import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IoClose, IoLocationSharp } from "react-icons/io5";
import { FaLocationArrow, FaLocationCrosshairs } from "react-icons/fa6";
import { FiPlus, FiMinus, FiMaximize2, FiCompass } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { Vector3 } from "three";
import GameState from "../../hooks/useWorld";
import { FIXED_LOCATION_PINS, type FixedLocationPin } from "../../sampleData";
import { FixedLocationModal } from "./ui/FixedLocationModal";
import { EnterTransitionOverlay } from "./ui/EnterTransitionOverlay";
import { runTeleportTransition } from "../../utils/teleportTransition";
import { completePinTeleport } from "../../utils/pinTeleport";

// Expanded-map zoom limits + step
const MAP_MIN_ZOOM = 1;
const MAP_MAX_ZOOM = 5;
const MAP_ZOOM_STEP = 0.4;
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const mapBackdropVariants = {
  hidden: { opacity: 0, pointerEvents: "none" as const },
  visible: { opacity: 1, pointerEvents: "auto" as const },
};

// Campus map bounds (world-space X / Z). Tweak these to align the player
// marker with the CampusMap.png image. They should match the area of the
// 3D world that is captured in the map render.
const CAMPUS = {
  minX: -85,
  maxX: 85,
  minZ: -120,
  maxZ: 120,
};

const MAP_SRC = "/images/CampusMap.png";

// Zoom factor for the small circular minimap preview.
// The map image is scaled to MINIMAP_ZOOM x its container size and
// shifted so the player stays centered inside the circle.
const MINIMAP_ZOOM = 5;

// --- Calibration offsets (in % of the map image) ---
// Use these to nudge where the player marker appears on the map without
// changing the world bounds above.
//   - Positive START_OFFSET_X moves the marker to the RIGHT
//   - Positive START_OFFSET_Y moves the marker DOWN
// Tip: walk to your actual spawn point in-game, then tweak these until
// the red arrow lines up with the same spot on CampusMap.png.
const START_OFFSET_X = -8.7;
const START_OFFSET_Y = 45;

// Convert a normalized map position (% within the image, 0..100)
// back into world-space X/Z coords (inverse of the marker math).
const mapPercentToWorld = (xPct: number, yPct: number) => {
  const width = CAMPUS.maxX - CAMPUS.minX;
  const height = CAMPUS.maxZ - CAMPUS.minZ;
  const worldX = ((xPct - START_OFFSET_X) / 100) * width + CAMPUS.minX;
  const worldZ = ((yPct - START_OFFSET_Y) / 100) * height + CAMPUS.minZ;
  return { worldX, worldZ };
};

export default function Map2D() {
  const playerPosition = GameState((s: any) => s.characterPosition);
  const playerRotation = GameState((s: any) => s.cameraRotation);

  // Pin store integration (shared with the 3D minimap & teleport flow)
  const pinPosition = GameState((s: any) => s.pinPosition);
  const setPinPosition = GameState((s: any) => s.setPinPosition);
  const setIsPinConfirmed = GameState((s: any) => s.setIsPinConfirmed);
  const setIsPinTeleported = GameState((s: any) => s.setIsPinTeleported);
  const setSelectedDestination = GameState((s: any) => s.setSelectedDestination);
  const setSelectedDestinationId = GameState((s: any) => s.setSelectedDestinationId);
  const setQuery = GameState((s: any) => s.setQuery);
  const map2DOpen = GameState((s: any) => s.map2DOpen);
  const setMap2DOpen = GameState((s: any) => s.setMap2DOpen);

  useEffect(() => () => setMap2DOpen(false), [setMap2DOpen]);

  // Selected fixed location (shows the info modal with image / rooms / floors)
  const [selectedFixedPin, setSelectedFixedPin] = useState<FixedLocationPin | null>(null);
  const [teleporting, setTeleporting] = useState(false);
  const teleportLockRef = useRef(false);

  // Ref to the expanded-map <img> so pointerup can compute click position
  // against the actual rendered image rectangle (after any zoom/pan transform).
  const imageRef = useRef<HTMLImageElement>(null);
  const mapViewportRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);
  const panLimitsRef = useRef({ maxX: 0, maxY: 0 });

  // --- Pan & zoom state for the expanded map ---
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragStateRef = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    panX: number;
    panY: number;
    moved: boolean;
    pointerId: number;
    captured: boolean;
  }>({
    dragging: false,
    startX: 0,
    startY: 0,
    panX: 0,
    panY: 0,
    moved: false,
    pointerId: -1,
    captured: false,
  });
  const pinchRef = useRef<{ startDist: number; startZoom: number } | null>(null);

  // Reset zoom/pan whenever the modal is opened
  useEffect(() => {
    if (map2DOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [map2DOpen]);

  const zoomIn = () => setZoom((z) => clamp(z + MAP_ZOOM_STEP, MAP_MIN_ZOOM, MAP_MAX_ZOOM));
  const zoomOut = () =>
    setZoom((z) => {
      const next = clamp(z - MAP_ZOOM_STEP, MAP_MIN_ZOOM, MAP_MAX_ZOOM);
      // when zooming back out to 1, recenter
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const canPan = zoom > 1;

  const measurePanLimits = () => {
    const viewport = mapViewportRef.current;
    const content = mapContentRef.current;
    if (!viewport || !content) return { maxX: 0, maxY: 0 };

    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const cw = content.offsetWidth;
    const ch = content.offsetHeight;

    return {
      maxX: Math.max(0, (cw * zoom - vw) / 2),
      maxY: Math.max(0, (ch * zoom - vh) / 2),
    };
  };

  const clampPan = (
    x: number,
    y: number,
    limits = panLimitsRef.current,
  ) => ({
    x: clamp(x, -limits.maxX, limits.maxX),
    y: clamp(y, -limits.maxY, limits.maxY),
  });

  const applyPanLimits = () => {
    const limits = measurePanLimits();
    panLimitsRef.current = limits;
    setPan((current) => clampPan(current.x, current.y, limits));
  };

  useEffect(() => {
    if (!map2DOpen) return;
    applyPanLimits();
  }, [zoom, map2DOpen]);

  useEffect(() => {
    if (!map2DOpen) return;
    const viewport = mapViewportRef.current;
    if (!viewport) return;

    const ro = new ResizeObserver(() => applyPanLimits());
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [map2DOpen, zoom]);

  // Player marker position (in % of the map image) + rotation
  const { normX, normY, rotationY } = useMemo(() => {
    const width = CAMPUS.maxX - CAMPUS.minX;
    const height = CAMPUS.maxZ - CAMPUS.minZ;

    const x = ((playerPosition.x - CAMPUS.minX) / width) * 100 + START_OFFSET_X;
    const y = ((playerPosition.z - CAMPUS.minZ) / height) * 100 + START_OFFSET_Y;

    return {
      normX: Math.max(0, Math.min(100, x)),
      normY: Math.max(0, Math.min(100, y)),
      rotationY: -(playerRotation?.y ?? 0),
    };
  }, [playerPosition.x, playerPosition.z, playerRotation?.y]);

  // Pin marker position on the map image (in % of width/height)
  const pinPercent = useMemo(() => {
    if (!pinPosition) return null;
    const width = CAMPUS.maxX - CAMPUS.minX;
    const height = CAMPUS.maxZ - CAMPUS.minZ;
    const x = ((pinPosition.x - CAMPUS.minX) / width) * 100 + START_OFFSET_X;
    const y = ((pinPosition.z - CAMPUS.minZ) / height) * 100 + START_OFFSET_Y;
    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };
  }, [pinPosition?.x, pinPosition?.z]);

  // Pre-compute fixed location pin positions in % of the map image
  const fixedPinsWithPercent = useMemo(() => {
    const width = CAMPUS.maxX - CAMPUS.minX;
    const height = CAMPUS.maxZ - CAMPUS.minZ;
    return FIXED_LOCATION_PINS.map((pin) => {
      const x =
        ((pin.position.x - CAMPUS.minX) / width) * 100 + START_OFFSET_X;
      const y =
        ((pin.position.z - CAMPUS.minZ) / height) * 100 + START_OFFSET_Y;
      return {
        pin,
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      };
    });
  }, []);

  // Open the info modal (image + rooms/floors) for a fixed pin
  const openFixedPinInfo = (pin: FixedLocationPin) => {
    setSelectedFixedPin(pin);
  };

  const runMapTeleport = (performTeleport: () => void) => {
    if (teleportLockRef.current) return;
    teleportLockRef.current = true;
    setTeleporting(true);
    setSelectedFixedPin(null);
    setMap2DOpen(false);

    void runTeleportTransition(performTeleport).finally(() => {
      setTeleporting(false);
      teleportLockRef.current = false;
    });
  };

  // Visit a fixed location (or a specific room inside a building) — teleports
  const handleVisit = (target: { id?: string; name: string; position: Vector3 }) => {
    runMapTeleport(() => {
      setPinPosition(target.position.clone());
      completePinTeleport();
    });
  };

  // Drop a pin at the given client coords (computed against the image rect)
  const dropPinAt = (clientX: number, clientY: number) => {
    const img = imageRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    // Ignore clicks outside the actual image (e.g. on the gray border padding)
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return;
    }
    const xPct = ((clientX - rect.left) / rect.width) * 100;
    const yPct = ((clientY - rect.top) / rect.height) * 100;
    const { worldX, worldZ } = mapPercentToWorld(xPct, yPct);
    setPinPosition(new Vector3(worldX, 0.2, worldZ));
    setIsPinConfirmed(false);
    setIsPinTeleported(false);
  };

  // --- Pan handlers (mouse + touch) ---
  const releasePointerCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragStateRef.current;
    if (!s.captured) return;
    e.currentTarget.releasePointerCapture?.(s.pointerId);
    s.captured = false;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only left mouse / single touch
    if (e.button !== undefined && e.button !== 0) return;
    dragStateRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
      moved: false,
      pointerId: e.pointerId,
      captured: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragStateRef.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      s.moved = true;
      if (canPan && !s.captured) {
        e.currentTarget.setPointerCapture?.(s.pointerId);
        s.captured = true;
      }
    }
    if (!canPan || !s.moved) return;
    setPan(clampPan(s.panX + dx, s.panY + dy));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    releasePointerCapture(e);
    const s = dragStateRef.current;
    const wasDragging = s.dragging;
    const wasMoved = s.moved;
    dragStateRef.current = {
      dragging: false,
      startX: 0,
      startY: 0,
      panX: 0,
      panY: 0,
      moved: false,
      pointerId: -1,
      captured: false,
    };

    // If the pointer went down + up without meaningful movement, treat as a tap → drop a pin.
    if (wasDragging && !wasMoved) {
      dropPinAt(e.clientX, e.clientY);
    }
  };

  // --- Wheel zoom (native listener — React wheel handlers are passive) ---
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -MAP_ZOOM_STEP : MAP_ZOOM_STEP;
    setZoom((z) => {
      const next = clamp(z + delta, MAP_MIN_ZOOM, MAP_MAX_ZOOM);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // --- Pinch-to-zoom (touch) ---
  const getTouchDistance = (
    touches: ArrayLike<{ clientX: number; clientY: number }>,
  ) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      pinchRef.current = {
        startDist: getTouchDistance(e.touches),
        startZoom: zoom,
      };
      dragStateRef.current.dragging = false;
    }
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const dist = getTouchDistance(e.touches);
      const ratio = dist / pinchRef.current.startDist;
      const next = clamp(
        pinchRef.current.startZoom * ratio,
        MAP_MIN_ZOOM,
        MAP_MAX_ZOOM,
      );
      if (next === 1) setPan({ x: 0, y: 0 });
      setZoom(next);
    }
  }, []);

  useEffect(() => {
    const viewport = mapViewportRef.current;
    if (!viewport || !map2DOpen) return;

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    viewport.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      viewport.removeEventListener("wheel", handleWheel);
      viewport.removeEventListener("touchmove", handleTouchMove);
    };
  }, [map2DOpen, handleWheel, handleTouchMove]);

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) pinchRef.current = null;
  };

  const handleTeleport = () => {
    if (!pinPosition || teleporting) return;
    runMapTeleport(() => {
      const pin = GameState.getState().pinPosition ?? pinPosition;
      if (!pin) return;
      setPinPosition(new Vector3(pin.x, pin.y, pin.z));
      completePinTeleport();
    });
  };

  const handleUnpin = () => {
    setPinPosition(null);
    setIsPinConfirmed(false);
    setIsPinTeleported(false);
    setSelectedDestination(null);
    setSelectedDestinationId(null);
    setQuery("");
  };

  return (
    <>
      {/* Mini circular campus map preview (top-right corner) */}
      <button
        type="button"
        onClick={() => setMap2DOpen(true)}
        title="Open campus map"
        aria-label="Open campus map"
        className="
          fixed top-5 right-5 z-[2180]
          
          w-[18vh] h-[18vh] max-w-[180px] max-h-[180px]
          [@media(max-height:500px)]:top-3 [@media(max-height:500px)]:right-3
          [@media(max-height:500px)]:w-[18dvh] [@media(max-height:500px)]:h-[18dvh]
          [@media(max-height:500px)]:max-w-24 [@media(max-height:500px)]:max-h-24
          rounded-full overflow-hidden
          border-[3px] border-white
          shadow-[0_4px_14px_rgba(0,0,0,0.45)]
          bg-slate-800
          cursor-pointer
          transition-transform
          pointer-events-auto
        "
      >
        <div className="relative w-full h-full overflow-hidden">
          {/* Zoomed map slides underneath to keep the player centered */}
          <img
            src={MAP_SRC}
            alt="Campus Map"
            draggable={false}
            className="absolute"
            style={{
              width: `${MINIMAP_ZOOM * 100}%`,
              height: `${MINIMAP_ZOOM * 100}%`,
              left: `${50 - normX * MINIMAP_ZOOM}%`,
              top: `${50 - normY * MINIMAP_ZOOM}%`,
              transition: "left 0.15s linear, top 0.15s linear",
              maxWidth: "none",
            }}
          />

          {/* Destination guide line on minimap */}
          {pinPercent && (
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <line
                x1="50"
                y1="50"
                x2={50 + (pinPercent.x - normX) * MINIMAP_ZOOM}
                y2={50 + (pinPercent.y - normY) * MINIMAP_ZOOM}
                stroke="rgba(34, 211, 238, 0.35)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <motion.line
                x1="50"
                y1="50"
                x2={50 + (pinPercent.x - normX) * MINIMAP_ZOOM}
                y2={50 + (pinPercent.y - normY) * MINIMAP_ZOOM}
                stroke="#facc15"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="5 5"
                animate={{ strokeDashoffset: [10, 0] }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          )}

          {/* Pin marker on minimap (positioned in zoomed coordinate space) */}
          {pinPercent && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${50 + (pinPercent.x - normX) * MINIMAP_ZOOM}%`,
                top: `${50 + (pinPercent.y - normY) * MINIMAP_ZOOM}%`,
                transform: "translate(-50%, -100%)",
                transition: "left 0.15s linear, top 0.15s linear",
              }}
            >
              <IoLocationSharp className="text-yellow-400 text-lg sm:text-xl [@media(max-height:500px)]:text-base drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            </div>
          )}

          {/* Player marker stays centered in the circle */}
          <div
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              transform: `translate(-50%, -50%) rotate(${rotationY}rad)`,
              transition: "transform 0.1s linear",
            }}
          >
            <FaLocationArrow className="text-blue-400 text-base sm:text-lg [@media(max-height:500px)]:text-sm -rotate-45 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
          </div>
        </div>
      </button>

      {/* Expanded fullscreen map modal */}
      <AnimatePresence>
        {map2DOpen && (
          <motion.div
            className="fixed inset-0 z-[2200] flex items-center justify-center bg-ink/85 p-3 sm:p-4 [@media(max-height:500px)]:p-2 [@media(orientation:landscape)_and_(max-height:600px)]:p-3"
            variants={mapBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setMap2DOpen(false)}
          >
            <motion.div
              className="
                relative
                bg-cream rounded-[2rem] [@media(max-height:500px)]:rounded-2xl
                border-[4px] sm:border-[6px] border-ink
                shadow-brutal-md sm:shadow-brutal-lg
                flex flex-col overflow-hidden
                w-[min(95vw,56rem)] max-h-[90vh]
                [@media(max-height:500px)]:w-[min(92vw,52rem)]
                [@media(max-height:500px)]:max-h-[94dvh]
                [@media(orientation:landscape)_and_(max-height:600px)]:w-fit
                [@media(orientation:landscape)_and_(max-height:600px)]:max-w-[92vw]
                [@media(orientation:landscape)_and_(max-height:600px)]:max-h-[92dvh]
              "
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 22, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-maroon border-b-[4px] sm:border-b-[6px] border-ink p-3 sm:p-4 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 [@media(orientation:landscape)_and_(max-height:600px)]:px-3 [@media(orientation:landscape)_and_(max-height:600px)]:py-1.5 flex items-center justify-between gap-5 shrink-0">
                <div>
                  <div className="bg-gold border-[3px] border-ink px-2 py-0.5 rounded-full mb-1 [@media(max-height:500px)]:hidden inline-block">
                    <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-ink">
                      Map View
                    </p>
                  </div>
                  <h2 className="text-lg sm:text-2xl [@media(max-height:500px)]:text-base [@media(orientation:landscape)_and_(max-height:600px)]:text-base font-black italic text-white leading-tight uppercase">
                    PUP Lopez Campus
                  </h2>
                </div>
                <button
                  onClick={() => setMap2DOpen(false)}
                  className="bg-white border-[3px] border-ink p-1.5 [@media(max-height:500px)]:p-1 [@media(orientation:landscape)_and_(max-height:600px)]:p-1 rounded-xl hover:bg-muted transition-transform active:scale-90 shrink-0"
                  aria-label="Close map"
                  type="button"
                >
                  <IoClose size={20} />
                </button>
              </div>

              {/* Map body */}
              <div
                ref={mapViewportRef}
                className="relative p-3 sm:p-4 [@media(max-height:500px)]:p-2 [@media(orientation:landscape)_and_(max-height:600px)]:px-3 [@media(orientation:landscape)_and_(max-height:600px)]:py-2 flex-1 min-h-0 flex items-center justify-center bg-muted overflow-hidden touch-none select-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{
                  cursor: canPan
                    ? dragStateRef.current.dragging
                      ? "grabbing"
                      : "grab"
                    : "default",
                }}
              >
                {/* Inner transformed wrapper (pan + zoom) */}
                <div
                  ref={mapContentRef}
                  className="relative inline-block"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: "center center",
                    transition: dragStateRef.current.dragging
                      ? "none"
                      : "transform 0.15s ease-out",
                  }}
                >
                  <img
                    ref={imageRef}
                    src={MAP_SRC}
                    alt="Campus Map"
                    className="block max-h-[70vh] max-w-[85vw] [@media(max-height:500px)]:max-h-[calc(94dvh-7.5rem)] [@media(max-height:500px)]:max-w-[86vw] [@media(orientation:landscape)_and_(max-height:600px)]:max-h-[calc(92dvh-7.25rem)] [@media(orientation:landscape)_and_(max-height:600px)]:max-w-[min(72vw,46rem)] w-auto h-auto rounded-lg border-[3px] border-ink cursor-crosshair select-none pointer-events-none"
                    draggable={false}
                    onLoad={applyPanLimits}
                  />

                  {/* Pin overlay — matches image bounds exactly */}
                  <div className="pointer-events-none absolute inset-0 overflow-visible">
                  {/* Destination guide line */}
                  {pinPercent && (
                    <svg
                      className="absolute inset-0 h-full w-full pointer-events-none"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <line
                        x1={normX}
                        y1={normY}
                        x2={pinPercent.x}
                        y2={pinPercent.y}
                        stroke="rgba(34, 211, 238, 0.28)"
                        strokeWidth={1.8 / zoom}
                        strokeLinecap="round"
                      />
                      <motion.line
                        x1={normX}
                        y1={normY}
                        x2={pinPercent.x}
                        y2={pinPercent.y}
                        stroke="#facc15"
                        strokeWidth={0.8 / zoom}
                        strokeLinecap="round"
                        strokeDasharray={`${2.2 / zoom} ${2.2 / zoom}`}
                        animate={{ strokeDashoffset: [4 / zoom, 0] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <circle
                        cx={pinPercent.x}
                        cy={pinPercent.y}
                        r={1.1 / zoom}
                        fill="rgba(250, 204, 21, 0.24)"
                        stroke="#facc15"
                        strokeWidth={0.35 / zoom}
                      />
                    </svg>
                  )}

                  {/* Fixed location pins — click to instant-teleport */}
                  {fixedPinsWithPercent.map(({ pin, x, y }) => (
                    <button
                      key={`fixed-${pin.id}`}
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        openFixedPinInfo(pin);
                      }}
                      title={pin.name}
                      aria-label={`Open info for ${pin.name}`}
                      className="absolute group flex flex-col items-center gap-0.5 pointer-events-auto"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        // Keep fixed location pins readable while the map image zooms.
                        transform: `translate(-50%, -100%) scale(${1 / zoom})`,
                        transformOrigin: "bottom center",
                      }}
                    >
                      <span
                        className="px-1.5 py-0.5 rounded-md border-2 border-ink text-[8px] sm:text-[9px] font-black uppercase tracking-tight whitespace-nowrap shadow-brutal-sm bg-white text-ink opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {pin.name}
                      </span>
                      <IoLocationSharp className="text-blue-500 text-xl sm:text-2xl [@media(max-height:500px)]:text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)] transition-transform group-hover:scale-110" />
                    </button>
                  ))}

                  {/* Pin marker (drop-pin style, anchored at bottom tip) */}
                  {pinPercent && (
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        left: `${pinPercent.x}%`,
                        top: `${pinPercent.y}%`,
                        transform: `translate(-50%, -100%) scale(${1 / zoom})`,
                        transformOrigin: "bottom center",
                        transition: "left 0.15s linear, top 0.15s linear",
                      }}
                    >
                      <div className="relative flex items-center justify-center">
                        <span className="absolute -bottom-0.5 w-2.5 h-2.5 rounded-full bg-gold/40 animate-ping" />
                        <IoLocationSharp className="relative text-yellow-400 text-2xl sm:text-3xl [@media(max-height:500px)]:text-2xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]" />
                      </div>
                    </div>
                  )}

                  {/* Player position marker */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: `${normX}%`,
                      top: `${normY}%`,
                      transform: `translate(-50%, -50%) rotate(${rotationY}rad) scale(${
                        1 / zoom
                      })`,
                      transformOrigin: "center center",
                      transition:
                        "left 0.15s linear, top 0.15s linear, transform 0.1s linear",
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500/30 animate-ping" />
                      <FaLocationArrow className="relative text-red-500 text-lg sm:text-xl [@media(max-height:500px)]:text-lg -rotate-45 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]" />
                    </div>
                  </div>
                  </div>
                </div>

                {/* Floating zoom controls (top-right of map area) */}
                <div
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 [@media(max-height:500px)]:top-2 [@media(max-height:500px)]:right-2 flex flex-col gap-2 [@media(max-height:500px)]:gap-1 z-10"
                  onPointerDown={(e) => e.stopPropagation()}
                  onWheel={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={zoomIn}
                    disabled={zoom >= MAP_MAX_ZOOM}
                    aria-label="Zoom in"
                    title="Zoom in"
                    className="bg-white border-[3px] border-ink p-2 [@media(max-height:500px)]:p-1.5 rounded-xl shadow-brutal-sm hover:bg-muted active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:shadow-brutal-sm"
                  >
                    <FiPlus size={18} strokeWidth={3} />
                  </button>
                  <button
                    type="button"
                    onClick={zoomOut}
                    disabled={zoom <= MAP_MIN_ZOOM}
                    aria-label="Zoom out"
                    title="Zoom out"
                    className="bg-white border-[3px] border-ink p-2 [@media(max-height:500px)]:p-1.5 rounded-xl shadow-brutal-sm hover:bg-muted active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:shadow-brutal-sm"
                  >
                    <FiMinus size={18} strokeWidth={3} />
                  </button>
                  <button
                    type="button"
                    onClick={resetView}
                    aria-label="Reset view"
                    title="Reset view"
                    className="bg-gold border-[3px] border-ink p-2 [@media(max-height:500px)]:p-1.5 rounded-xl shadow-brutal-sm hover:bg-gold active:translate-y-0.5 active:shadow-none transition-all"
                  >
                    <FiMaximize2 size={18} strokeWidth={3} />
                  </button>
                </div>

                {/* Compass indicator (bottom-left) */}
                <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 [@media(max-height:500px)]:bottom-2 [@media(max-height:500px)]:left-2 bg-white border-[3px] border-ink rounded-xl w-16 h-16 [@media(max-height:500px)]:w-12 [@media(max-height:500px)]:h-12 shadow-brutal-sm text-ink pointer-events-none">
                  <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] [@media(max-height:500px)]:text-[8px] font-black leading-none">
                    N
                  </span>
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] [@media(max-height:500px)]:text-[8px] font-black leading-none">
                    S
                  </span>
                  <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] [@media(max-height:500px)]:text-[8px] font-black leading-none">
                    W
                  </span>
                  <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] [@media(max-height:500px)]:text-[8px] font-black leading-none">
                    E
                  </span>
                  <FiCompass className="absolute left-1/2 top-1/2 text-2xl [@media(max-height:500px)]:text-xl -translate-x-1/2 -translate-y-1/2 text-ink" strokeWidth={3} />
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 [@media(orientation:landscape)_and_(max-height:600px)]:px-3 [@media(orientation:landscape)_and_(max-height:600px)]:py-1.5 bg-white border-t-[4px] sm:border-t-[6px] border-ink flex flex-col sm:flex-row [@media(max-height:500px)]:flex-row items-stretch sm:items-center justify-between gap-3 [@media(max-height:500px)]:gap-2 [@media(orientation:landscape)_and_(max-height:600px)]:gap-4 shrink-0">
                <p className="text-[11px] sm:text-xs [@media(max-height:500px)]:text-[10px] [@media(orientation:landscape)_and_(max-height:600px)]:text-[10px] font-bold italic text-slate-600 leading-tight max-w-[34rem] [@media(orientation:landscape)_and_(max-height:600px)]:max-w-[18rem]">
                  {pinPosition ? (
                    "Pin placed! Teleport or remove it below."
                  ) : (
                    <>
                      <span className="[@media(orientation:landscape)_and_(max-height:600px)]:hidden">
                        Tap a location pin to view details · Click anywhere to drop a custom pin · Drag to pan · Scroll/pinch to zoom
                      </span>
                      <span className="hidden [@media(orientation:landscape)_and_(max-height:600px)]:inline">
                        Tap pins · Drag to pan · Pinch or scroll to zoom
                      </span>
                    </>
                  )}
                </p>

                <div className="flex items-center gap-2 [@media(orientation:landscape)_and_(max-height:600px)]:gap-1.5 shrink-0">
                  {pinPosition && (
                    <button
                      onClick={handleUnpin}
                      className="py-2 px-3 [@media(max-height:500px)]:py-1.5 [@media(orientation:landscape)_and_(max-height:600px)]:px-2.5 [@media(orientation:landscape)_and_(max-height:600px)]:py-1.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-[11px] bg-white text-ink border-[3px] border-ink rounded-xl text-xs sm:text-sm font-black italic shadow-brutal-sm active:translate-y-0.5 active:shadow-none transition-all uppercase tracking-wide"
                      type="button"
                    >
                      Remove Pin
                    </button>
                  )}

                  <button
                    onClick={handleTeleport}
                    disabled={!pinPosition || teleporting}
                    className={`py-2 px-3 sm:px-4 [@media(max-height:500px)]:py-1.5 [@media(orientation:landscape)_and_(max-height:600px)]:px-2.5 [@media(orientation:landscape)_and_(max-height:600px)]:py-1.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-[11px] border-[3px] border-ink rounded-xl text-xs sm:text-sm font-black italic shadow-brutal-sm active:translate-y-0.5 active:shadow-none transition-all uppercase tracking-wide flex items-center gap-1.5 ${
                      pinPosition
                        ? "bg-gold text-ink hover:bg-gold"
                        : "bg-slate-300 text-ink/50 opacity-60 cursor-not-allowed"
                    }`}
                    type="button"
                  >
                    <FaLocationCrosshairs size={14} />
                    Teleport
                  </button>

                  <button
                    onClick={() => setMap2DOpen(false)}
                    className="py-2 px-3 sm:px-4 [@media(max-height:500px)]:py-1.5 [@media(orientation:landscape)_and_(max-height:600px)]:px-2.5 [@media(orientation:landscape)_and_(max-height:600px)]:py-1.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-[11px] bg-maroon text-white border-[3px] border-ink rounded-xl text-xs sm:text-sm font-black italic shadow-brutal-sm active:translate-y-0.5 active:shadow-none transition-all uppercase tracking-wide"
                    type="button"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info modal for fixed location pins — shows image, name, rooms by floor */}
      <FixedLocationModal
        pin={selectedFixedPin}
        onClose={() => setSelectedFixedPin(null)}
        onVisit={handleVisit}
      />

      {teleporting && (
        <EnterTransitionOverlay
          zIndexClass="z-[2201]"
          key="map-teleport-overlay"
        />
      )}
    </>
  );
}
