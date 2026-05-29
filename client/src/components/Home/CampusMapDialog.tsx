import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, X, Building2, Compass } from "lucide-react";
import { IoLocationSharp } from "react-icons/io5";
import { FiPlus, FiMinus, FiMaximize2 } from "react-icons/fi";
import { getLocationDescription } from "../../data/locationDescriptions";
import { FIXED_LOCATION_PINS } from "../../sampleData";
import { getViewMapPinsWithPosition } from "../../utils/viewMapPins";

const MAP_SRC = "/images/CampusMap.png";

const MAP_MIN_ZOOM = 1;
const MAP_MAX_ZOOM = 4;
const MAP_ZOOM_STEP = 0.35;
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const LOCATION_HIGHLIGHTS: Record<string, string[]> = {
  grandstand: ["Events", "Assemblies", "Outdoor venue"],
  pylon: ["Landmark", "Photo spot"],
  "main-gate": ["Entrance", "Visitor access"],
};

function getLocationDetails(pinId: string) {
  const description = getLocationDescription(pinId);
  if (!description) return null;
  return {
    description,
    highlights: LOCATION_HIGHLIGHTS[pinId],
  };
}

type CampusMapDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function CampusMapDialog({ open, onClose }: CampusMapDialogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const mapViewportRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);
  const panLimitsRef = useRef({ maxX: 0, maxY: 0 });
  const dragStateRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    panX: 0,
    panY: 0,
    moved: false,
  });
  const pinchRef = useRef<{ startDist: number; startZoom: number } | null>(null);

  const clearSelectedPin = useCallback(() => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    setSelectedId(null);
  }, []);

  useEffect(() => {
    if (open) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setSelectedId(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selectedId) {
        clearSelectedPin();
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, selectedId, clearSelectedPin]);

  const pinsWithPercent = useMemo(
    () => getViewMapPinsWithPosition(FIXED_LOCATION_PINS),
    [],
  );

  const selectedPin = useMemo(
    () => FIXED_LOCATION_PINS.find((p) => p.id === selectedId) ?? null,
    [selectedId],
  );

  const selectedDetails = selectedId ? getLocationDetails(selectedId) : null;

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
    if (!open) return;
    applyPanLimits();
  }, [zoom, open]);

  useEffect(() => {
    if (!open) return;
    const viewport = mapViewportRef.current;
    if (!viewport) return;

    const ro = new ResizeObserver(() => applyPanLimits());
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [open, zoom]);

  // Reset zoom when rotating so pins stay aligned with the resized map image.
  useEffect(() => {
    if (!open) return;
    const onOrientationChange = () => {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      requestAnimationFrame(() => applyPanLimits());
    };
    window.addEventListener("orientationchange", onOrientationChange);
    return () => window.removeEventListener("orientationchange", onOrientationChange);
  }, [open]);

  const zoomIn = () =>
    setZoom((z) => clamp(z + MAP_ZOOM_STEP, MAP_MIN_ZOOM, MAP_MAX_ZOOM));
  const zoomOut = () =>
    setZoom((z) => {
      const next = clamp(z - MAP_ZOOM_STEP, MAP_MIN_ZOOM, MAP_MAX_ZOOM);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getTouchDistance = (
    touches: ArrayLike<{ clientX: number; clientY: number }>,
  ) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

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

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) pinchRef.current = null;
  };

  useEffect(() => {
    if (!open) return;
    const viewport = mapViewportRef.current;
    if (!viewport) return;

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    viewport.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      viewport.removeEventListener("wheel", handleWheel);
      viewport.removeEventListener("touchmove", handleTouchMove);
    };
  }, [open, handleWheel, handleTouchMove]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!canPan) return;
    if (e.button !== undefined && e.button !== 0) return;

    dragStateRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
      moved: false,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!canPan || !dragStateRef.current.dragging) return;

    const dx = e.clientX - dragStateRef.current.startX;
    const dy = e.clientY - dragStateRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragStateRef.current.moved = true;
    }
    setPan(
      clampPan(
        dragStateRef.current.panX + dx,
        dragStateRef.current.panY + dy,
      ),
    );
  };

  const handlePointerUp = () => {
    dragStateRef.current.dragging = false;
  };

  const handlePinSelect = (pinId: string) => {
    setSelectedId((prev) => {
      if (prev === pinId) {
        (document.activeElement as HTMLElement | null)?.blur?.();
        return null;
      }
      return pinId;
    });
  };

  const renderDescriptionPanel = () => {
    if (!selectedPin) return null;

    const isBuilding = selectedPin.kind === "building";
    const roomCount = selectedPin.rooms?.length ?? 0;
    const floorCount = selectedPin.rooms
      ? new Set(selectedPin.rooms.map((r) => r.floor).filter(Boolean)).size
      : 0;

    return (
      <motion.div
        key={selectedPin.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#FFFDF5]"
      >
        <div className="relative h-36 shrink-0 border-b-2 border-black bg-slate-200 sm:h-40 [@media(orientation:landscape)_and_(max-height:768px)]:h-28">
          <img
            src={selectedPin.imageSrc ?? "/images/campus-image.jpg"}
            alt={selectedPin.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/25 to-transparent" />

          <button
            type="button"
            onClick={clearSelectedPin}
            aria-label="Close location details"
            className="absolute right-2.5 top-2.5 rounded-lg border-2 border-black bg-white p-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all hover:bg-slate-100 active:translate-y-0.5 active:shadow-none sm:right-3 sm:top-3 sm:rounded-xl sm:border-4 sm:p-1.5"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border-2 border-black bg-[#FFD700] px-2 py-0.5 sm:border-4">
            {isBuilding ? (
              <Building2 className="h-3 w-3 text-black" />
            ) : (
              <MapPin className="h-3 w-3 text-black" />
            )}
            <span className="text-[9px] font-black uppercase tracking-wider text-black sm:text-[10px]">
              {isBuilding ? "Building" : "Location"}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-12">
            <h3 className="text-base font-black uppercase leading-tight text-white sm:text-lg">
              {selectedPin.name}
            </h3>
            {isBuilding && roomCount > 0 && (
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-white/85 sm:text-[11px]">
                {roomCount} room{roomCount === 1 ? "" : "s"}
                {floorCount > 1 ? ` · ${floorCount} floors` : ""}
              </p>
            )}
          </div>
        </div>

        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {selectedDetails ? (
            <p className="text-xs font-medium leading-relaxed text-black/75 sm:text-sm">
              {selectedDetails.description}
            </p>
          ) : (
            <p className="text-xs font-medium leading-relaxed text-black/55 sm:text-sm">
              Explore this location in the 3D campus tour.
            </p>
          )}

          {selectedDetails?.highlights && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedDetails.highlights.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border-2 border-black bg-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-black sm:text-[11px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[5000] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[5001] flex items-center justify-center p-3 sm:p-6 [@media(max-height:500px)]:p-2 [@media(orientation:landscape)_and_(max-height:768px)]:p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border-2 border-black bg-[#FFFDF5] sm:rounded-3xl sm:border-4 lg:h-[min(88dvh,760px)] lg:min-h-[28rem] [@media(orientation:landscape)_and_(max-height:768px)]:h-[94dvh] [@media(orientation:landscape)_and_(max-height:768px)]:max-h-[94dvh] [@media(orientation:landscape)_and_(max-height:768px)]:w-[min(98vw,56rem)]"
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-b-2 border-black bg-[#800000] px-4 py-3 sm:gap-4 sm:border-b-4 sm:px-6 sm:py-4 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 [@media(orientation:landscape)_and_(max-height:768px)]:px-3 [@media(orientation:landscape)_and_(max-height:768px)]:py-1.5">
                <div className="min-w-0">
                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-[#FFD700] px-2.5 py-0.5 sm:border-4 [@media(orientation:landscape)_and_(max-height:768px)]:hidden">
                    <Compass className="h-3 w-3 text-black" />
                    <span className="text-[9px] font-black uppercase tracking-wider text-black sm:text-[10px]">
                      Campus Overview
                    </span>
                  </div>
                  <h2 className="text-lg font-black uppercase leading-tight text-white sm:text-2xl [@media(max-height:500px)]:text-base [@media(orientation:landscape)_and_(max-height:768px)]:text-base">
                    PUP Lopez Campus Map
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close map"
                  className="shrink-0 rounded-lg border-2 border-black bg-white p-2 transition-all hover:bg-black hover:text-white sm:rounded-xl sm:border-4 [@media(orientation:landscape)_and_(max-height:768px)]:p-1.5"
                >
                  <X className="h-5 w-5 [@media(orientation:landscape)_and_(max-height:768px)]:h-4 [@media(orientation:landscape)_and_(max-height:768px)]:w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row [@media(orientation:landscape)_and_(max-height:768px)]:flex-row">
                {/* Map panel */}
                <div
                  ref={mapViewportRef}
                  className="relative flex min-h-[200px] min-w-0 flex-1 items-center justify-center touch-none select-none overflow-hidden bg-slate-100 p-2 sm:min-h-[260px] sm:p-3 md:min-h-[20rem] md:p-4 [@media(max-height:500px)]:min-h-[180px] [@media(max-height:500px)]:p-1.5 [@media(orientation:landscape)_and_(max-height:768px)]:min-h-0 [@media(orientation:landscape)_and_(max-height:768px)]:p-2"
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
                  <div
                    ref={mapContentRef}
                    className="relative inline-block max-w-full"
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                      transformOrigin: "center center",
                      transition: dragStateRef.current.dragging
                        ? "none"
                        : "transform 0.15s ease-out",
                    }}
                  >
                    <img
                      src={MAP_SRC}
                      alt="PUP Lopez Campus Map"
                      className="block h-auto w-auto max-h-[34dvh] max-w-[min(92vw,calc(100%-0.5rem))] rounded-lg border-2 border-black sm:max-h-[38dvh] sm:max-w-[min(90vw,calc(100%-1rem))] sm:border-4 md:max-h-[min(calc(88dvh-11rem),640px)] md:max-w-full [@media(max-height:500px)]:max-h-[calc(94dvh-10rem)] [@media(orientation:landscape)_and_(max-height:768px)]:max-h-[calc(94dvh-4rem)] [@media(orientation:landscape)_and_(max-height:768px)]:max-w-full"
                      draggable={false}
                      onLoad={applyPanLimits}
                    />

                    {/* Pin overlay — matches image bounds exactly */}
                    <div className="pointer-events-none absolute inset-0 overflow-visible">
                      {pinsWithPercent.map(({ pin, x, y }) => {
                        const isSelected = selectedId === pin.id;
                        return (
                          <button
                            key={pin.id}
                            type="button"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!dragStateRef.current.moved) {
                                handlePinSelect(pin.id);
                              }
                            }}
                            title={pin.name}
                            aria-label={`Select ${pin.name}`}
                            aria-pressed={isSelected}
                            className="pointer-events-auto absolute flex flex-col items-center gap-0.5"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              transform: `translate(-50%, -100%) scale(${1 / zoom})`,
                              transformOrigin: "bottom center",
                            }}
                          >
                            <span
                              className={`whitespace-nowrap rounded-md border-2 border-black px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tight shadow-[2px_2px_0_0_rgba(0,0,0,1)] sm:text-[9px] [@media(orientation:landscape)_and_(max-height:768px)]:text-[7px] ${
                                isSelected
                                  ? "bg-[#FFD700] opacity-100"
                                  : "bg-white opacity-0 group-hover:opacity-100"
                              } ${isSelected ? "opacity-100" : ""}`}
                            >
                              {pin.name}
                            </span>
                            <IoLocationSharp
                              className={`text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)] transition-transform sm:text-2xl [@media(orientation:landscape)_and_(max-height:768px)]:text-lg ${
                                isSelected
                                  ? "scale-125 text-[#FFD700]"
                                  : pin.highlighted
                                    ? "text-yellow-400"
                                    : "text-blue-500"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Zoom controls */}
                  <div
                    className="absolute right-3 top-3 flex flex-col gap-1.5 sm:right-4 sm:top-4 sm:gap-2 [@media(orientation:landscape)_and_(max-height:768px)]:right-2 [@media(orientation:landscape)_and_(max-height:768px)]:top-2 [@media(orientation:landscape)_and_(max-height:768px)]:gap-1"
                    onPointerDown={(e) => e.stopPropagation()}
                    onWheel={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={zoomIn}
                      disabled={zoom >= MAP_MAX_ZOOM}
                      aria-label="Zoom in"
                      className="rounded-lg border-2 border-black bg-white p-1.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all hover:bg-slate-100 disabled:opacity-40 sm:rounded-xl sm:border-4 sm:p-2 [@media(orientation:landscape)_and_(max-height:768px)]:p-1"
                    >
                      <FiPlus size={16} strokeWidth={3} />
                    </button>
                    <button
                      type="button"
                      onClick={zoomOut}
                      disabled={zoom <= MAP_MIN_ZOOM}
                      aria-label="Zoom out"
                      className="rounded-lg border-2 border-black bg-white p-1.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all hover:bg-slate-100 disabled:opacity-40 sm:rounded-xl sm:border-4 sm:p-2 [@media(orientation:landscape)_and_(max-height:768px)]:p-1"
                    >
                      <FiMinus size={16} strokeWidth={3} />
                    </button>
                    <button
                      type="button"
                      onClick={resetView}
                      aria-label="Reset view"
                      className="rounded-lg border-2 border-black bg-[#FFD700] p-1.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all hover:bg-yellow-300 sm:rounded-xl sm:border-4 sm:p-2 [@media(orientation:landscape)_and_(max-height:768px)]:p-1"
                    >
                      <FiMaximize2 size={16} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                {/* Right description panel — fades in when a pin is selected */}
                <aside
                  className={`flex min-h-0 shrink-0 flex-col overflow-hidden border-black transition-[width,opacity,max-height] duration-[280ms] ease-out md:border-l-2 [@media(orientation:landscape)_and_(max-height:768px)]:border-l-2 ${
                    selectedPin
                      ? "pointer-events-auto opacity-100 max-md:max-h-[min(42dvh,22rem)] max-md:border-t-2 md:w-[380px] md:border-t-0 [@media(orientation:landscape)_and_(max-height:768px)]:w-[min(42vw,20rem)]"
                      : "pointer-events-none opacity-0 max-md:max-h-0 max-md:border-t-0 md:w-0"
                  }`}
                  {...(!selectedPin ? { inert: true } : {})}
                >
                  <AnimatePresence mode="wait">
                    {selectedPin && renderDescriptionPanel()}
                  </AnimatePresence>
                </aside>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
