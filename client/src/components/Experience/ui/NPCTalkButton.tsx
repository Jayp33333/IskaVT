import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import useWorld from "../../../hooks/useWorld";
import { enterButtonPosition } from "../../../data/enterInteractionConfig";

export const NPCTalkButton = () => {
  const {
    npcsInRange,
    characterPosition,
    showMiniMap,
    showLogHistory,
    activeNPCDialog,
    map2DOpen,
  } = useWorld((s: any) => ({
    npcsInRange: s.npcsInRange,
    characterPosition: s.characterPosition,
    showMiniMap: s.showMiniMap,
    showLogHistory: s.showLogHistory,
    activeNPCDialog: s.activeNPCDialog,
    map2DOpen: s.map2DOpen,
  }));

  const nearestNPC = useMemo(() => {
    if (!npcsInRange?.size || !characterPosition) return null;

    let closest: { id: string; name: string; onTalk: () => void } | null = null;
    let minDist = Infinity;

    for (const [id, { position, onTalk, name }] of npcsInRange.entries()) {
      const distance = position.distanceTo(characterPosition);
      if (distance < minDist) {
        minDist = distance;
        closest = { id, name, onTalk };
      }
    }

    return closest;
  }, [npcsInRange, characterPosition]);

  const visible =
    !!nearestNPC &&
    !showMiniMap &&
    !showLogHistory &&
    !activeNPCDialog &&
    !map2DOpen;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key={nearestNPC.id}
          type="button"
          onClick={() => nearestNPC.onTalk()}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 22, stiffness: 320 }}
          className="fixed z-[330] flex items-center gap-2 rounded-full border-[3px] border-ink bg-gold px-4 py-2 text-[10px] font-black uppercase tracking-wide text-ink shadow-brutal-sm transition-transform active:scale-95 sm:px-5 sm:py-2.5 sm:text-xs [@media(max-height:500px)]:gap-1.5 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-1.5 [@media(max-height:500px)]:text-[9px]"
          style={enterButtonPosition}
          aria-label={`Talk to ${nearestNPC.name}`}
          title={`Talk to ${nearestNPC.name} (F)`}
        >
          <MessageCircle
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 [@media(max-height:500px)]:h-3 [@media(max-height:500px)]:w-3"
            strokeWidth={3}
          />
          Talk to {nearestNPC.name}
        </motion.button>
      )}
    </AnimatePresence>
  );
};
