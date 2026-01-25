import { useEffect, useMemo, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlineZoomIn, MdOutlineZoomOut } from "react-icons/md";
import { Vector3 } from "three";
import useWorld from "../../../hooks/useWorld";
import { audioManager } from "../../../services/AudioManager";
import { FIXED_LOCATION_PINS, type FixedLocationPin } from "../../../sampleData";
import { FixedLocationModal } from "./FixedLocationModal";

// Reuse the old minimap bounds so the image aligns to world coordinates.
// If your map image uses different bounds, update these values.
const MAP_BOUNDS = {
  minX: -170,
  maxX: 150,
  minZ: -230,
  maxZ: 30,
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function worldToMapPercent(pos: { x: number; z: number }) {
  const u = (pos.x - MAP_BOUNDS.minX) / (MAP_BOUNDS.maxX - MAP_BOUNDS.minX);
  const v = (pos.z - MAP_BOUNDS.minZ) / (MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ);
  return {
    xPct: clamp(u, 0, 1) * 100,
    // Map Z directly to CSS top (so higher Z is lower on the image).
    yPct: clamp(v, 0, 1) * 100,
  };
}

function mapPercentToWorld(u: number, vTop: number) {
  const uu = clamp(u, 0, 1);
  const vv = clamp(vTop, 0, 1);
  const x = MAP_BOUNDS.minX + uu * (MAP_BOUNDS.maxX - MAP_BOUNDS.minX);
  const z = MAP_BOUNDS.minZ + vv * (MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ);
  return { x, z };
}

export function Map2D() {
  const characterPosition = useWorld((s: any) => s.characterPositionOnFloorLabel);
  const pinPosition = useWorld((s: any) => s.pinPosition);
  const isPinConfirmed = useWorld((s: any) => s.isPinConfirmed);

  const setCharacterPosition = useWorld((s: any) => s.setCharacterPosition);
  const setPinPosition = useWorld((s: any) => s.setPinPosition);
  const setIsPinConfirmed = useWorld((s: any) => s.setIsPinConfirmed);
  const setIsPinTeleported = useWorld((s: any) => s.setIsPinTeleported);
  const setSelectedDestination = useWorld((s: any) => s.setSelectedDestination);
  const setQuery = useWorld((s: any) => s.setQuery);

  const [open, setOpen] = useState(false);
  const [selectedFixedPin, setSelectedFixedPin] = useState<FixedLocationPin | null>(null);
  const [zoom, setZoom] = useState(1); // 1..3
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // px pan when zoomed
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [imageAspect, setImageAspect] = useState(1); // width/height

  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startOffsetX: number;
    startOffsetY: number;
  }>({ active: false, startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0 });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInnerRef = useRef<HTMLDivElement>(null);

  // Multi-touch pinch support (pointer events).
  const activePointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{
    active: boolean;
    startDistance: number;
    startZoom: number;
    startOffset: { x: number; y: number };
    startInnerW: number;
    startInnerH: number;
    startCenterLocal: { x: number; y: number };
  }>({
    active: false,
    startDistance: 0,
    startZoom: 1,
    startOffset: { x: 0, y: 0 },
    startInnerW: 0,
    startInnerH: 0,
    startCenterLocal: { x: 0, y: 0 },
  });

  const characterMarker = useMemo(() => {
    if (!characterPosition) return null;
    const { xPct, yPct } = worldToMapPercent({ x: characterPosition.x, z: characterPosition.z });
    return { xPct, yPct };
  }, [characterPosition]);

  const pinMarker = useMemo(() => {
    if (!pinPosition) return null;
    const { xPct, yPct } = worldToMapPercent({ x: pinPosition.x, z: pinPosition.z });
    return { xPct, yPct };
  }, [pinPosition]);

  // Small-map should behave like the old minimap: zoomed and centered on the player.
  // We render the image larger than the circle, then shift it so the character stays centered.
  const miniZoom = 2.25;
  const miniPan = useMemo(() => {
    const min = 100 - 100 * miniZoom; // keep map covering viewport
    const max = 0;

    // Default: center of the map
    const center = (100 - 100 * miniZoom) / 2;
    if (!characterMarker) return { leftPct: center, topPct: center };

    const desiredLeft = 50 - characterMarker.xPct * miniZoom;
    const desiredTop = 50 - characterMarker.yPct * miniZoom;

    return {
      leftPct: clamp(desiredLeft, min, max),
      topPct: clamp(desiredTop, min, max),
    };
  }, [characterMarker]);

  const fixedPins = useMemo(() => {
    return FIXED_LOCATION_PINS.map((p) => {
      const { xPct, yPct } = worldToMapPercent({ x: p.position.x, z: p.position.z });
      return { pin: p, xPct, yPct };
    });
  }, []);

  const placePinFromPointer = (clientX: number, clientY: number) => {
    const el = mapInnerRef.current ?? mapContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const u = (clientX - rect.left) / rect.width;
    const vTop = (clientY - rect.top) / rect.height;
    const { x, z } = mapPercentToWorld(u, vTop);

    setPinPosition(new Vector3(x, 0.2, z));
    setIsPinConfirmed(false);
    setSelectedDestination(null);
    setQuery("");
  };

  const teleportToPin = () => {
    if (!pinPosition) return;
    setIsPinTeleported(true);
    setOpen(false);
  };

  const unpin = () => {
    setPinPosition(null);
    setIsPinConfirmed(false);
    setSelectedDestination(null);
    setIsPinTeleported(false);
    setQuery("");
  };

  const handleZoom = (factor: number) => {
    setZoom((z) => clamp(z * factor, 1, 3));
  };

  // Your 2D map image (placed in client/public/images/)
  // Note: file name is case-sensitive on many deploy hosts.
  const mapImageSrc = "/images/2DMap.png";

  // Load the image dimensions so we can preserve aspect ratio (no stretching).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const img = new Image();
    img.src = mapImageSrc;
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        setImageAspect(img.naturalWidth / img.naturalHeight);
      }
    };
  }, [mapImageSrc]);

  // Measure viewport size when the full map is open (for mobile drag bounds).
  useEffect(() => {
    if (!open) return;
    const measure = () => {
      const el = mapContainerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setViewport({ w: rect.width, h: rect.height });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open]);

  // Size of the inner map (at zoom=1) that "covers" the viewport while keeping image aspect ratio.
  const baseSize = useMemo(() => {
    const w = viewport.w;
    const h = viewport.h;
    if (w <= 0 || h <= 0) return { baseW: 0, baseH: 0 };

    const viewportAspect = w / h;
    if (viewportAspect >= imageAspect) {
      return { baseW: w, baseH: w / imageAspect };
    }
    return { baseW: h * imageAspect, baseH: h };
  }, [viewport.w, viewport.h, imageAspect]);

  const panBounds = useMemo(() => {
    const innerW = baseSize.baseW * zoom;
    const innerH = baseSize.baseH * zoom;
    const maxX = Math.max(0, (innerW - viewport.w) / 2);
    const maxY = Math.max(0, (innerH - viewport.h) / 2);
    return { innerW, innerH, maxX, maxY };
  }, [baseSize.baseW, baseSize.baseH, zoom, viewport.w, viewport.h]);

  const clampOffsetToBounds = (next: { x: number; y: number }) => {
    return {
      x: clamp(next.x, -panBounds.maxX, panBounds.maxX),
      y: clamp(next.y, -panBounds.maxY, panBounds.maxY),
    };
  };

  const clampOffsetForZoom = (next: { x: number; y: number }, nextZoom: number) => {
    const innerW = baseSize.baseW * nextZoom;
    const innerH = baseSize.baseH * nextZoom;
    const maxX = Math.max(0, (innerW - viewport.w) / 2);
    const maxY = Math.max(0, (innerH - viewport.h) / 2);
    return {
      x: clamp(next.x, -maxX, maxX),
      y: clamp(next.y, -maxY, maxY),
    };
  };

  // Keep offset valid when zoom/viewport changes.
  useEffect(() => {
    if (!open) return;
    setOffset((o) => clampOffsetToBounds(o));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, zoom, viewport.w, viewport.h, baseSize.baseW, baseSize.baseH]);

  const visitFixedLocation = (target: { name: string; position: Vector3 }) => {
    setCharacterPosition({ x: target.position.x, y: target.position.y, z: target.position.z } as any);
    setPinPosition(target.position.clone());
    setIsPinConfirmed(true);
    setSelectedDestination(target.name);
    setIsPinTeleported(true);
    audioManager.play("teleported");
    setSelectedFixedPin(null);
    setOpen(false);
  };

  // --- Collapsed (small) ---
  if (!open) {
    return (
      <button
        type="button"
        className="fixed z-100 rounded-full border-2 border-white overflow-hidden shadow-lg bg-black/30"
        style={{
          top: "2%",
          right: "2%",
          width: "clamp(100px, 15vw, 120px)",
          height: "clamp(100px, 15vw, 120px)",
          maxWidth: "200px",
          maxHeight: "200px",
        }}
        onClick={() => setOpen(true)}
        title="Open map"
        aria-label="Open map"
      >
        <div className="relative w-full h-full">
          {/* Zoomed mini view, centered on the character */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute"
              style={{
                width: `${miniZoom * 100}%`,
                height: `${miniZoom * 100}%`,
                left: `${miniPan.leftPct}%`,
                top: `${miniPan.topPct}%`,
              }}
            >
            <img
              src={mapImageSrc}
              alt="Map"
              className="absolute inset-0 w-full h-full object-fill"
              draggable={false}
            />

            {/* Fixed locations (only highlighted in mini mode) */}
            {fixedPins
              .filter((p) => p.pin.highlighted)
              .map(({ pin, xPct, yPct }) => (
                <button
                  key={pin.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFixedPin(pin);
                    setOpen(true);
                  }}
                  className="absolute"
                  style={{
                    left: `${xPct}%`,
                    top: `${yPct}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  title={pin.name}
                  aria-label={pin.name}
                >
                  <div className="w-2 h-2 rounded-full bg-yellow-400 ring-2 ring-white shadow" />
                </button>
              ))}

            {characterMarker && (
              <div
                className="absolute"
                style={{
                  left: `${characterMarker.xPct}%`,
                  top: `${characterMarker.yPct}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="w-2 h-2 rounded-full bg-[#7A0019] ring-2 ring-white shadow" />
              </div>
            )}
            {pinMarker && (
              <div
                className="absolute"
                style={{
                  left: `${pinMarker.xPct}%`,
                  top: `${pinMarker.yPct}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-white shadow" />
              </div>
            )}
            </div>
          </div>
        </div>
      </button>
    );
  }

  // --- Expanded (full screen) ---
  return (
    <div className="fixed inset-0 z-1000 bg-black/70 backdrop-blur-sm pointer-events-auto">
      {/* Close */}
      <button
        onClick={() => setOpen(false)}
        className="absolute z-101 rounded-md bg-black/70 text-white flex items-center justify-center"
        style={{
          top: "clamp(8px, 2vw, 16px)",
          right: "clamp(8px, 2vw, 16px)",
          padding: "clamp(6px, 1.5vw, 10px)",
          fontSize: "clamp(16px, 2.5vw, 24px)",
        }}
        type="button"
        aria-label="Close map"
      >
        <IoClose />
      </button>

      {/* Zoom */}
      <div
        className="absolute flex flex-col items-center z-101"
        style={{
          top: "clamp(80px, 20vh, 200px)",
          right: "clamp(8px, 2vw, 16px)",
          gap: "clamp(6px, 1.5vw, 12px)",
        }}
      >
        <button
          onClick={() => handleZoom(1.15)}
          className="rounded-lg bg-black/70 text-white flex items-center justify-center"
          style={{
            padding: "clamp(6px, 1.5vw, 10px)",
            fontSize: "clamp(16px, 2.5vw, 20px)",
          }}
          type="button"
          aria-label="Zoom in"
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
          {Math.round(zoom * 100)}%
        </div>

        <button
          onClick={() => handleZoom(0.87)}
          className="rounded-lg bg-black/70 text-white flex items-center justify-center"
          style={{
            padding: "clamp(6px, 1.5vw, 10px)",
            fontSize: "clamp(16px, 2.5vw, 20px)",
          }}
          type="button"
          aria-label="Zoom out"
        >
          <MdOutlineZoomOut />
        </button>
      </div>

      {/* Instructions + Pin controls */}
      <div className="absolute bottom-4 left-4 z-200 max-w-xs rounded-lg bg-black/70 p-3 text-white text-sm font-medium shadow-md">
        <p className="font-semibold text-yellow-300">Map Tip</p>
        <p>Double-click / double-tap to drop a pin.</p>
        {pinPosition && !isPinConfirmed && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setIsPinConfirmed(true)}
              className="rounded-md bg-[#7A0019] px-3 py-1"
              type="button"
            >
              Pin It
            </button>
            <button
              onClick={teleportToPin}
              className="rounded-md bg-[#7A0019] px-3 py-1"
              type="button"
            >
              Teleport
            </button>
            <button
              onClick={unpin}
              className="rounded-md bg-white/10 px-3 py-1"
              type="button"
            >
              Cancel
            </button>
          </div>
        )}

        {pinPosition && isPinConfirmed && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={teleportToPin}
              className="rounded-md bg-[#7A0019] px-3 py-1"
              type="button"
            >
              Teleport
            </button>
            <button
              onClick={unpin}
              className="rounded-md bg-white/10 px-3 py-1"
              type="button"
            >
              Unpin
            </button>
          </div>
        )}
      </div>

      {/* Map surface */}
      <div className="absolute inset-0 flex items-center justify-center p-2">
        <div
          ref={mapContainerRef}
          className="relative w-full h-full rounded-2xl overflow-hidden border border-white/20 bg-black/30"
          style={{ touchAction: "none" }}
          onDoubleClick={(e) => {
            e.preventDefault();
            placePinFromPointer(e.clientX, e.clientY);
          }}
          onPointerDown={(e) => {
            if (e.pointerType === "touch") e.preventDefault();

            activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
            (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);

            const pointers = Array.from(activePointersRef.current.values());
            if (pointers.length >= 2) {
              // Start pinch
              dragRef.current.active = false;
              pinchRef.current.active = true;
              pinchRef.current.startZoom = zoom;
              pinchRef.current.startOffset = { x: offset.x, y: offset.y };
              pinchRef.current.startInnerW = baseSize.baseW * zoom;
              pinchRef.current.startInnerH = baseSize.baseH * zoom;

              const dx = pointers[0].x - pointers[1].x;
              const dy = pointers[0].y - pointers[1].y;
              pinchRef.current.startDistance = Math.max(1, Math.hypot(dx, dy));

              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              pinchRef.current.startCenterLocal = {
                x: (pointers[0].x + pointers[1].x) / 2 - rect.left,
                y: (pointers[0].y + pointers[1].y) / 2 - rect.top,
              };
              return;
            }

            // Start drag (single pointer)
            dragRef.current.active = true;
            dragRef.current.startX = e.clientX;
            dragRef.current.startY = e.clientY;
            dragRef.current.startOffsetX = offset.x;
            dragRef.current.startOffsetY = offset.y;
          }}
          onPointerMove={(e) => {
            if (e.pointerType === "touch") e.preventDefault();

            if (activePointersRef.current.has(e.pointerId)) {
              activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
            }

            const pointers = Array.from(activePointersRef.current.values());
            if (pinchRef.current.active && pointers.length >= 2) {
              const dx = pointers[0].x - pointers[1].x;
              const dy = pointers[0].y - pointers[1].y;
              const dist = Math.max(1, Math.hypot(dx, dy));

              const rawZoom = pinchRef.current.startZoom * (dist / pinchRef.current.startDistance);
              const nextZoom = clamp(rawZoom, 1, 3);

              // Keep content under pinch center stable while zooming.
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const centerLocal = {
                x: (pointers[0].x + pointers[1].x) / 2 - rect.left,
                y: (pointers[0].y + pointers[1].y) / 2 - rect.top,
              };

              const startInnerW = pinchRef.current.startInnerW;
              const startInnerH = pinchRef.current.startInnerH;
              const nextInnerW = baseSize.baseW * nextZoom;
              const nextInnerH = baseSize.baseH * nextZoom;

              const scaleX = nextInnerW / Math.max(1, startInnerW);
              const scaleY = nextInnerH / Math.max(1, startInnerH);

              const startLeft = (viewport.w - startInnerW) / 2 + pinchRef.current.startOffset.x;
              const startTop = (viewport.h - startInnerH) / 2 + pinchRef.current.startOffset.y;

              const nextLeft = centerLocal.x - (centerLocal.x - startLeft) * scaleX;
              const nextTop = centerLocal.y - (centerLocal.y - startTop) * scaleY;

              const nextOffset = {
                x: nextLeft - (viewport.w - nextInnerW) / 2,
                y: nextTop - (viewport.h - nextInnerH) / 2,
              };

              setZoom(nextZoom);
              setOffset(clampOffsetForZoom(nextOffset, nextZoom));
              return;
            }

            if (!dragRef.current.active) return;
            const ddx = e.clientX - dragRef.current.startX;
            const ddy = e.clientY - dragRef.current.startY;
            setOffset(
              clampOffsetToBounds({
                x: dragRef.current.startOffsetX + ddx,
                y: dragRef.current.startOffsetY + ddy,
              })
            );
          }}
          onPointerUp={(e) => {
            activePointersRef.current.delete(e.pointerId);
            pinchRef.current.active = activePointersRef.current.size >= 2;
            dragRef.current.active = false;
            (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
          }}
          onPointerCancel={(e) => {
            activePointersRef.current.delete(e.pointerId);
            pinchRef.current.active = false;
            dragRef.current.active = false;
          }}
          onWheel={(e) => {
            e.preventDefault();
            const factor = e.deltaY > 0 ? 0.92 : 1.08;
            setZoom((z) => clamp(z * factor, 1, 3));
          }}
        >
          <div
            ref={mapInnerRef}
            className="absolute"
            style={{
              width: `${panBounds.innerW}px`,
              height: `${panBounds.innerH}px`,
              left: `${(viewport.w - panBounds.innerW) / 2 + offset.x}px`,
              top: `${(viewport.h - panBounds.innerH) / 2 + offset.y}px`,
            }}
          >
            <img
              src={mapImageSrc}
              alt="Map"
              className="absolute inset-0 w-full h-full object-fill select-none"
              draggable={false}
            />

            {/* Fixed locations */}
            {fixedPins.map(({ pin, xPct, yPct }) => (
              <button
                key={pin.id}
                type="button"
                className="absolute group"
                style={{
                  left: `${xPct}%`,
                  top: `${yPct}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFixedPin(pin);
                }}
                title={pin.name}
                aria-label={pin.name}
              >
                <div
                  className={`rounded-full ring-2 ring-white shadow-lg ${
                    pin.highlighted ? "bg-yellow-400 w-5 h-5" : "bg-yellow-300 w-4 h-4"
                  }`}
                />
                {pin.highlighted && (
                  <div className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/70 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition">
                    {pin.name}
                  </div>
                )}
              </button>
            ))}

            {/* Character marker */}
            {characterMarker && (
              <div
                className="absolute"
                style={{
                  left: `${characterMarker.xPct}%`,
                  top: `${characterMarker.yPct}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="w-4 h-4 rounded-full bg-[#7A0019] ring-2 ring-white shadow-lg" />
              </div>
            )}

            {/* Pin marker */}
            {pinMarker && (
              <div
                className="absolute"
                style={{
                  left: `${pinMarker.xPct}%`,
                  top: `${pinMarker.yPct}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="w-5 h-5 rounded-full bg-red-600 ring-2 ring-white shadow-lg" />
              </div>
            )}
          </div>
        </div>
      </div>

      <FixedLocationModal
        pin={selectedFixedPin}
        onClose={() => setSelectedFixedPin(null)}
        onVisit={visitFixedLocation}
      />
    </div>
  );
}

