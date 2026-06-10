import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useWorld from "../../../hooks/useWorld";
import {
  getEnterAreaButtonLabel,
  getEnterTargetAtPosition,
  isEnterAreaLocked,
} from "../../../data/enterAreas";
import { enterButtonPosition } from "../../../data/enterInteractionConfig";
import { runTeleportTransition } from "../../../utils/teleportTransition";
import { completePinTeleport } from "../../../utils/pinTeleport";
import { CenterDot } from "./CenterDot";
import { EnterTransitionOverlay } from "./EnterTransitionOverlay";

type EnterButtonProps = {
  /** First-person only: show center crosshair when not at a door. */
  showCrosshair?: boolean;
};

export const EnterButton = ({ showCrosshair = true }: EnterButtonProps) => {
  const [transitioning, setTransitioning] = useState(false);
  const transitionLockRef = useRef(false);

  const {
    characterPositionOnFloorLabel,
    setPinPosition,
    setSelectedDestination,
  } = useWorld((s: any) => ({
    characterPositionOnFloorLabel: s.characterPositionOnFloorLabel,
    setPinPosition: s.setPinPosition,
    setSelectedDestination: s.setSelectedDestination,
  }));

  const enterTarget = useMemo(() => {
    if (!characterPositionOnFloorLabel) return null;
    return getEnterTargetAtPosition(characterPositionOnFloorLabel);
  }, [
    characterPositionOnFloorLabel?.x,
    characterPositionOnFloorLabel?.y,
    characterPositionOnFloorLabel?.z,
  ]);

  const locked = enterTarget ? isEnterAreaLocked(enterTarget.area) : false;
  const label = enterTarget ? getEnterAreaButtonLabel(enterTarget.area) : null;

  const handleClick = () => {
    if (!enterTarget || locked || transitioning || transitionLockRef.current) {
      return;
    }

    const { area, teleportPosition } = enterTarget;
    transitionLockRef.current = true;
    setTransitioning(true);

    void runTeleportTransition(() => {
      setPinPosition(teleportPosition.clone());
      setSelectedDestination(area.label);
      completePinTeleport({ keepDestination: true });
    }).then(() => {
      setTransitioning(false);
      transitionLockRef.current = false;
    });
  };

  if (transitioning) {
    return <EnterTransitionOverlay />;
  }

  if (!label) return showCrosshair ? <CenterDot /> : null;

  return (
    <AnimatePresence>
      <motion.button
        key={label}
        type="button"
        onClick={handleClick}
        disabled={locked}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 22, stiffness: 320 }}
        className={`fixed z-[330] rounded-full border-[3px] border-ink px-4 py-2 text-[10px] font-black uppercase tracking-wide shadow-brutal-sm sm:px-5 sm:py-2.5 sm:text-xs [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-1.5 [@media(max-height:500px)]:text-[9px] ${
          locked
            ? "cursor-not-allowed bg-slate-300 text-ink/60"
            : "bg-gold text-ink transition-transform active:scale-95"
        }`}
        style={enterButtonPosition}
        aria-label={label}
        title={locked ? `${label} — cannot enter` : label}
      >
        {label}
      </motion.button>
    </AnimatePresence>
  );
};
