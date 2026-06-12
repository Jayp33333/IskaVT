import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Hand,
  MousePointer2,
} from "lucide-react";
import {
  getTourCoachStepTts,
  getTourCoachSteps,
  type CoachDemo,
  type CoachPlacement,
} from "../../../data/tourCoachSteps";
import { useFaqSpeech } from "../../../features/contact/hooks/useFaqSpeech";
import { useIsMobileDevice } from "../../../hooks/useIsMobileDevice";
import { TOUR_MAP_DEMO_PIN_POSITION } from "../../../sampleData";
import useWorld from "../../../hooks/useWorld";

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type Viewport = {
  width: number;
  height: number;
  margin: number;
};

type CalloutLayout = {
  top: number;
  left: number;
  width: number;
  arrow?: "up" | "down" | "left" | "right";
};

interface TourCoachOverlayProps {
  open: boolean;
  onClose: () => void;
}

const CALLOUT_HEIGHT_ESTIMATE = 132;
const CALLOUT_HEIGHT_SHORT = 112;
/** Space reserved so callout text does not cover the pointer badge */
const POINTER_CLEARANCE_DEFAULT = 34;
const POINTER_CLEARANCE_SHORT = 28;

export function TourCoachOverlay({ open, onClose }: TourCoachOverlayProps) {
  const isMobile = useIsMobileDevice();
  const initialStep = useWorld((s) => s.tourCoachInitialStep);
  const singleStep = useWorld((s) => s.tourCoachSingleStep);
  const setMap2DOpen = useWorld((s) => s.setMap2DOpen);
  const setPinPosition = useWorld((s) => s.setPinPosition);
  const setIsPinConfirmed = useWorld((s) => s.setIsPinConfirmed);
  const setIsPinTeleported = useWorld((s) => s.setIsPinTeleported);
  const steps = useMemo(() => getTourCoachSteps(isMobile), [isMobile]);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const { speak, stop, isSupported } = useFaqSpeech();

  const step = steps[stepIndex];
  const isLast = singleStep || stepIndex >= steps.length - 1;

  useEffect(() => {
    if (open) setStepIndex(initialStep);
  }, [open, initialStep]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("tour-coach-active");
    return () => document.body.classList.remove("tour-coach-active");
  }, [open]);

  useEffect(() => {
    if (!open || !step || !isSupported) return;
    speak(`tour-coach-${step.id}`, getTourCoachStepTts(step));
  }, [open, step, stepIndex, isSupported, speak]);

  useEffect(() => {
    if (!open) stop();
  }, [open, stop]);

  useEffect(() => {
    if (!open) {
      setMap2DOpen(false);
      return;
    }
    setMap2DOpen(!!step?.openMap);
  }, [open, step?.id, step?.openMap, setMap2DOpen]);

  useEffect(() => {
    if (!open || !step?.mapDemoPin) return;

    const {
      pinPosition: prevPin,
      isPinConfirmed: prevConfirmed,
      isPinTeleported: prevTeleported,
    } = useWorld.getState();

    setPinPosition(TOUR_MAP_DEMO_PIN_POSITION.clone());
    setIsPinConfirmed(false);
    setIsPinTeleported(false);

    return () => {
      setPinPosition(prevPin);
      setIsPinConfirmed(prevConfirmed);
      setIsPinTeleported(prevTeleported);
    };
  }, [
    open,
    step?.id,
    step?.mapDemoPin,
    setPinPosition,
    setIsPinConfirmed,
    setIsPinTeleported,
  ]);

  const measureTarget = useCallback(() => {
    if (!step?.target) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(step.target);
    if (!el) {
      setTargetRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setTargetRect({
      top: r.top,
      left: r.left,
      width: r.width,
      height: r.height,
    });
  }, [step?.target]);

  useEffect(() => {
    if (!open || !step) return;

    measureTarget();
    window.addEventListener("resize", measureTarget);
    window.addEventListener("scroll", measureTarget, true);

    const pollId = step.pollTarget
      ? window.setInterval(measureTarget, 250)
      : undefined;

    return () => {
      window.removeEventListener("resize", measureTarget);
      window.removeEventListener("scroll", measureTarget, true);
      if (pollId) window.clearInterval(pollId);
    };
  }, [open, step, measureTarget]);

  const handleNext = () => {
    if (isLast) handleClose();
    else setStepIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (singleStep) {
      handleClose();
      return;
    }
    setStepIndex((i) => Math.max(0, i - 1));
  };
  const handleSkip = () => {
    stop();
    onClose();
  };

  const handleClose = () => {
    stop();
    onClose();
  };

  if (typeof document === "undefined" || !open || !step) return null;

  const viewport = getViewport(isMobile);
  const pad = step.padding ?? 10;
  const rawSpotlight = targetRect
    ? {
        top: targetRect.top - pad,
        left: targetRect.left - pad,
        width: targetRect.width + pad * 2,
        height: targetRect.height + pad * 2,
      }
    : null;
  const spotlight = rawSpotlight
    ? clampRectToViewport(rawSpotlight, viewport.margin)
    : null;

  const calloutPos = getCalloutPosition(
    spotlight,
    step.placement ?? "center",
    viewport,
    isShortViewport(),
    step.demo,
  );

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[2300] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-coach-title"
        >
          {!spotlight && (
            <div className="absolute inset-0 bg-ink/84" aria-hidden />
          )}

          {spotlight && (
            <div
              className="pointer-events-none absolute tour-coach-spotlight rounded-2xl border-[3px] border-gold [@media(max-height:500px)]:rounded-xl [@media(max-height:500px)]:border-2"
              style={{
                top: spotlight.top,
                left: spotlight.left,
                width: spotlight.width,
                height: spotlight.height,
              }}
              aria-hidden
            />
          )}

          {spotlight && calloutPos.arrow && (
            <CoachPointer
              spotlight={spotlight}
              direction={calloutPos.arrow}
              viewport={viewport}
            />
          )}

          {spotlight && step.demo === "joystick" && (
            <JoystickDemo rect={spotlight} />
          )}
          {spotlight && (step.demo === "jump" || step.demo === "tap") && (
            <TapDemo rect={spotlight} />
          )}
          {step.demo === "wasd" && <WasdDemo viewport={viewport} />}
          {step.demo === "mouse" && <MouseDemo />}
          {step.demo === "drag" && <DragDemo />}

          <motion.div
            key={step.id}
            className="pointer-events-auto absolute z-[2302] max-h-[min(40dvh,12rem)] overflow-y-auto overscroll-contain break-words [@media(max-height:500px)]:max-h-[min(36dvh,10rem)]"
            style={{
              top: calloutPos.top,
              left: calloutPos.left,
              width: calloutPos.width,
              maxWidth: `calc(100vw - ${viewport.margin * 2}px)`,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-[9px] font-black uppercase tracking-widest text-gold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] [@media(max-height:500px)]:text-[8px]">
              {singleStep ? "Guide topic" : `${stepIndex + 1} / ${steps.length}`}
            </p>
            <h2
              id="tour-coach-title"
              className="mt-0.5 text-sm font-black leading-snug text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] sm:text-base [@media(max-height:500px)]:text-xs"
            >
              {step.title}
            </h2>
            <p className="mt-1.5 text-xs font-semibold leading-relaxed text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] [@media(max-height:500px)]:mt-1 [@media(max-height:500px)]:text-[11px]">
              {step.body}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 [@media(max-height:500px)]:mt-2.5 [@media(max-height:500px)]:gap-x-2">
              {!singleStep && (
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={stepIndex === 0}
                  className="text-[10px] font-black uppercase tracking-wide text-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] transition-opacity enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-30 [@media(max-height:500px)]:text-[9px]"
                >
                  Back
                </button>
              )}
              {singleStep ? (
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-[10px] font-bold uppercase tracking-wide text-white/55 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] transition-colors hover:text-white/80 [@media(max-height:500px)]:text-[9px]"
                >
                  Close
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-[10px] font-bold uppercase tracking-wide text-white/55 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] transition-colors hover:text-white/80 [@media(max-height:500px)]:text-[9px]"
                >
                  Skip
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="text-[10px] font-black uppercase tracking-wide text-gold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] transition-colors hover:text-gold/85 [@media(max-height:500px)]:text-[9px]"
              >
                {isLast ? "Done" : "Next"}
              </button>
            </div>
          </motion.div>

          <div className="absolute inset-0 z-[2299]" aria-hidden />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function isShortViewport() {
  if (typeof window === "undefined") return false;
  return window.innerHeight <= 500;
}

function getViewport(isMobile: boolean): Viewport {
  if (typeof window === "undefined") {
    return { width: 400, height: 300, margin: 12 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    margin: isMobile ? 10 : 12,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function clampRectToViewport(rect: Rect, margin: number): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxW = vw - margin * 2;
  const maxH = vh - margin * 2;
  const width = Math.min(rect.width, maxW);
  const height = Math.min(rect.height, maxH);
  return {
    width,
    height,
    left: clamp(rect.left, margin, vw - width - margin),
    top: clamp(rect.top, margin, vh - height - margin),
  };
}

function clampBox(
  top: number,
  left: number,
  width: number,
  height: number,
  viewport: Viewport,
): { top: number; left: number } {
  return {
    top: clamp(top, viewport.margin, viewport.height - height - viewport.margin),
    left: clamp(left, viewport.margin, viewport.width - width - viewport.margin),
  };
}

function layoutForPlacement(
  spotlight: Rect,
  placement: CoachPlacement,
  cardW: number,
  cardH: number,
  gap: number,
  pointerClearance: number,
): CalloutLayout {
  const cx = spotlight.left + spotlight.width / 2;
  const cy = spotlight.top + spotlight.height / 2;

  switch (placement) {
    case "below":
      return {
        top: spotlight.top + spotlight.height + gap + pointerClearance,
        left: cx - cardW / 2,
        width: cardW,
        arrow: "up",
      };
    case "above":
      return {
        top: spotlight.top - cardH - gap - pointerClearance,
        left: cx - cardW / 2,
        width: cardW,
        arrow: "down",
      };
    case "right":
      return {
        top: cy - cardH / 2,
        left: spotlight.left + spotlight.width + gap + pointerClearance,
        width: cardW,
        arrow: "left",
      };
    case "left":
      return {
        top: cy - cardH / 2,
        left: spotlight.left - cardW - gap - pointerClearance,
        width: cardW,
        arrow: "right",
      };
    case "above-right":
      return {
        top: spotlight.top - cardH - gap - pointerClearance,
        left: spotlight.left + spotlight.width - cardW,
        width: cardW,
        arrow: "down",
      };
    case "above-left":
      return {
        top: spotlight.top - cardH - gap - pointerClearance,
        left: spotlight.left,
        width: cardW,
        arrow: "down",
      };
    case "center":
    default:
      return {
        top: (viewportHeight() - cardH) / 2,
        left: (viewportWidth() - cardW) / 2,
        width: cardW,
      };
  }
}

function viewportWidth() {
  return typeof window !== "undefined" ? window.innerWidth : 400;
}

function viewportHeight() {
  return typeof window !== "undefined" ? window.innerHeight : 300;
}

function fitsInViewport(
  layout: CalloutLayout,
  cardH: number,
  viewport: Viewport,
): boolean {
  return (
    layout.left >= viewport.margin &&
    layout.top >= viewport.margin &&
    layout.left + layout.width <= viewport.width - viewport.margin &&
    layout.top + cardH <= viewport.height - viewport.margin
  );
}

function getDemoAnchorBottom(
  demo: CoachDemo,
  viewport: Viewport,
  shortViewport: boolean,
): number | null {
  switch (demo) {
    case "mouse": {
      const orbitSize = shortViewport ? 56 : 64;
      const labelHeight = shortViewport ? 14 : 16;
      return viewport.height * 0.5 + orbitSize / 2 + 4 + labelHeight;
    }
    case "drag": {
      const top = viewport.height * (shortViewport ? 0.24 : 0.28);
      const handSize = shortViewport ? 28 : 40;
      const rowHeight = shortViewport ? 18 : 22;
      return top + handSize + 8 + rowHeight;
    }
    default:
      return null;
  }
}

function getCalloutPosition(
  spotlight: Rect | null,
  preferred: CoachPlacement,
  viewport: Viewport,
  shortViewport: boolean,
  demo?: CoachDemo,
): CalloutLayout {
  const cardH = shortViewport ? CALLOUT_HEIGHT_SHORT : CALLOUT_HEIGHT_ESTIMATE;
  const cardW = Math.min(shortViewport ? 248 : 288, viewport.width - viewport.margin * 2);
  const gap = shortViewport ? 10 : 14;
  const pointerClearance = shortViewport
    ? POINTER_CLEARANCE_SHORT
    : POINTER_CLEARANCE_DEFAULT;

  if (!spotlight || preferred === "center") {
    const demoBottom = demo ? getDemoAnchorBottom(demo, viewport, shortViewport) : null;
    const top =
      demoBottom != null
        ? demoBottom + gap
        : (viewport.height - cardH) / 2;
    const centered = clampBox(
      top,
      (viewport.width - cardW) / 2,
      cardW,
      cardH,
      viewport,
    );
    return { ...centered, width: cardW };
  }

  const fallbacks: CoachPlacement[] = [
    preferred,
    "below",
    "above",
    "right",
    "left",
    "above-right",
    "above-left",
    "center",
  ];

  const seen = new Set<CoachPlacement>();
  for (const placement of fallbacks) {
    if (seen.has(placement)) continue;
    seen.add(placement);

    const layout = layoutForPlacement(
      spotlight,
      placement,
      cardW,
      cardH,
      gap,
      pointerClearance,
    );
    const clamped = clampBox(layout.top, layout.left, cardW, cardH, viewport);

    if (placement === "center" || fitsInViewport({ ...layout, ...clamped }, cardH, viewport)) {
      return {
        top: clamped.top,
        left: clamped.left,
        width: cardW,
        arrow: placement === "center" ? undefined : layout.arrow,
      };
    }
  }

  const fallback = clampBox(
    (viewport.height - cardH) / 2,
    (viewport.width - cardW) / 2,
    cardW,
    cardH,
    viewport,
  );
  return { ...fallback, width: cardW };
}

function CoachPointer({
  spotlight,
  direction,
  viewport,
}: {
  spotlight: Rect;
  direction: "up" | "down" | "left" | "right";
  viewport: Viewport;
}) {
  const short = viewport.height <= 500;
  const size = short ? 22 : 26;
  const cx = spotlight.left + spotlight.width / 2;
  const cy = spotlight.top + spotlight.height / 2;

  let top = cy - size / 2;
  let left = cx - size / 2;

  if (direction === "up") {
    top = spotlight.top + spotlight.height + 2;
    left = cx - size / 2;
  } else if (direction === "down") {
    top = spotlight.top - size - 2;
    left = cx - size / 2;
  } else if (direction === "left") {
    left = spotlight.left + spotlight.width + 2;
    top = cy - size / 2;
  } else if (direction === "right") {
    left = spotlight.left - size - 2;
    top = cy - size / 2;
  }

  const clamped = clampBox(top, left, size, size, viewport);
  const iconSize = short ? 13 : 15;

  const Icon =
    direction === "up"
      ? ArrowUp
      : direction === "down"
        ? ArrowDown
        : direction === "left"
          ? ArrowLeft
          : ArrowRight;

  return (
    <motion.div
      className="pointer-events-none absolute z-[2301] flex items-center justify-center rounded-full border-2 border-ink bg-gold text-maroon [@media(max-height:500px)]:border-[1.5px]"
      style={{ top: clamped.top, left: clamped.left, width: size, height: size }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      <Icon size={iconSize} strokeWidth={3.5} />
    </motion.div>
  );
}

function JoystickDemo({ rect }: { rect: Rect }) {
  const short = rect.height <= 72;
  const arrowClass = short
    ? "h-2.5 w-2.5 [@media(max-height:500px)]:h-2 [@media(max-height:500px)]:w-2"
    : "h-3.5 w-3.5 [@media(max-height:500px)]:h-3 [@media(max-height:500px)]:w-3";

  return (
    <div
      className="pointer-events-none absolute z-[2301] overflow-hidden rounded-2xl [@media(max-height:500px)]:rounded-xl"
      style={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }}
      aria-hidden
    >
      <div className="absolute inset-[14%] flex items-center justify-center">
        <div
          className={`rounded-full border-2 border-ink bg-maroon tour-coach-joystick-nudge [@media(max-height:500px)]:border-[1.5px] ${
            short ? "h-[42%] w-[42%] min-h-3 min-w-3" : "h-[38%] w-[38%] min-h-4 min-w-4"
          }`}
        />
      </div>
      <ArrowUp
        className={`absolute left-1/2 top-[10%] -translate-x-1/2 text-gold tour-coach-fade-pulse ${arrowClass}`}
        strokeWidth={3}
      />
      <ArrowDown
        className={`absolute bottom-[10%] left-1/2 -translate-x-1/2 text-gold tour-coach-fade-pulse [animation-delay:0.3s] ${arrowClass}`}
        strokeWidth={3}
      />
      <ArrowLeft
        className={`absolute left-[10%] top-1/2 -translate-y-1/2 text-gold tour-coach-fade-pulse [animation-delay:0.15s] ${arrowClass}`}
        strokeWidth={3}
      />
      <ArrowRight
        className={`absolute right-[10%] top-1/2 -translate-y-1/2 text-gold tour-coach-fade-pulse [animation-delay:0.45s] ${arrowClass}`}
        strokeWidth={3}
      />
    </div>
  );
}

function TapDemo({ rect }: { rect: Rect }) {
  const short = rect.height <= 56;
  const handSize = short ? 16 : 22;

  return (
    <div
      className="pointer-events-none absolute z-[2301] overflow-hidden rounded-2xl"
      style={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }}
      aria-hidden
    >
      <span className="absolute inset-[18%] rounded-full border-2 border-gold tour-coach-tap-ring [@media(max-height:500px)]:inset-[20%]" />
      <Hand
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white tour-coach-tap-hand"
        size={handSize}
        strokeWidth={2.5}
      />
    </div>
  );
}

function WasdDemo({ viewport }: { viewport: Viewport }) {
  const short = viewport.height <= 500;
  const keySize = short ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

  const keys = [
    { label: "W", className: "col-start-2" },
    { label: "A", className: "col-start-1 row-start-2" },
    { label: "S", className: "col-start-2 row-start-2" },
    { label: "D", className: "col-start-3 row-start-2" },
  ];

  return (
    <div
      className="pointer-events-none absolute left-1/2 z-[2301] max-w-[calc(100vw-2rem)] -translate-x-1/2 bottom-[max(12%,4.5rem)] [@media(max-height:500px)]:bottom-[max(10%,3.5rem)]"
      aria-hidden
    >
      <div className="grid grid-cols-3 gap-1 [@media(max-height:500px)]:gap-0.5">
        {keys.map((key, i) => (
          <span
            key={key.label}
            className={`flex items-center justify-center rounded-lg border-[3px] border-ink bg-gold font-black text-maroon tour-coach-key-pulse [@media(max-height:500px)]:rounded-md [@media(max-height:500px)]:border-2 ${keySize} ${key.className}`}
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            {key.label}
          </span>
        ))}
      </div>
      <p className="mt-1.5 text-center text-[8px] font-black uppercase tracking-widest text-gold [@media(max-height:500px)]:mt-1 [@media(max-height:500px)]:text-[7px]">
        + Shift to sprint
      </p>
    </div>
  );
}

function MouseDemo() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-[2301] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2"
      aria-hidden
    >
      <div className="relative mx-auto flex h-16 w-16 items-center justify-center [@media(max-height:500px)]:h-14 [@media(max-height:500px)]:w-14">
        <span className="absolute inset-0 rounded-full border-2 border-dashed border-gold/60 tour-coach-mouse-orbit" />
        <MousePointer2
          className="h-6 w-6 text-gold tour-coach-mouse-move [@media(max-height:500px)]:h-5 [@media(max-height:500px)]:w-5"
          strokeWidth={2.5}
        />
      </div>
      <p className="mt-1 text-center text-[8px] font-black uppercase tracking-widest text-gold [@media(max-height:500px)]:text-[7px]">
        Click campus to lock
      </p>
    </div>
  );
}

function DragDemo() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[28%] z-[2301] flex max-w-full flex-col items-center px-4 [@media(max-height:500px)]:top-[24%] [@media(max-height:500px)]:px-3"
      aria-hidden
    >
      <Hand
        className="h-8 w-8 text-gold tour-coach-drag-hand [@media(max-height:500px)]:h-7 [@media(max-height:500px)]:w-7"
        strokeWidth={2}
      />
      <div className="mt-1.5 flex max-w-full flex-wrap items-center justify-center gap-2">
        <ArrowLeft
          className="h-4 w-4 shrink-0 text-gold/80 tour-coach-fade-pulse [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5"
          strokeWidth={3}
        />
        <span className="text-center text-[8px] font-black uppercase tracking-widest text-gold [@media(max-height:500px)]:text-[7px]">
          Drag to look
        </span>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-gold/80 tour-coach-fade-pulse [animation-delay:0.4s] [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5"
          strokeWidth={3}
        />
      </div>
    </div>
  );
}
