import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Megaphone, PartyPopper, Sparkles, type LucideIcon } from "lucide-react";

const CELEBRATION_EMOJIS = ["🎺", "📯", "🎉", "🎊", "✨", "🏆"];
const CELEBRATION_ICONS: LucideIcon[] = [PartyPopper, Megaphone, Sparkles];
const PARTICLE_COUNT = 18;
const CELEBRATION_DURATION_MS = 2800;

type Particle =
  | { id: number; kind: "emoji"; value: string; endX: number; endY: number; rotate: number; delay: number; size: number }
  | { id: number; kind: "icon"; value: LucideIcon; endX: number; endY: number; rotate: number; delay: number; size: number };

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.9;
    const distance = 100 + Math.random() * 180;
    const base = {
      id: i,
      endX: Math.cos(angle) * distance,
      endY: Math.sin(angle) * distance,
      rotate: (Math.random() - 0.5) * 720,
      delay: Math.random() * 0.2,
      size: 18 + Math.random() * 16,
    };

    if (i % 3 === 0) {
      return {
        ...base,
        kind: "emoji" as const,
        value: CELEBRATION_EMOJIS[i % CELEBRATION_EMOJIS.length],
      };
    }

    return {
      ...base,
      kind: "icon" as const,
      value: CELEBRATION_ICONS[i % CELEBRATION_ICONS.length],
    };
  });
}

type DestinationCelebrationProps = {
  active: boolean;
  burstKey: number;
};

export const DestinationCelebration = ({
  active,
  burstKey,
}: DestinationCelebrationProps) => {
  const [visible, setVisible] = useState(false);
  const particles = useMemo(() => createParticles(), [burstKey]);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const hideTimer = window.setTimeout(() => setVisible(false), CELEBRATION_DURATION_MS);
    return () => window.clearTimeout(hideTimer);
  }, [active, burstKey]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={burstKey}
          className="pointer-events-none fixed inset-0 z-[1490] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          <div className="relative h-0 w-0">
            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                className="absolute left-0 top-0 flex items-center justify-center"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.2, rotate: 0 }}
                animate={{
                  x: particle.endX,
                  y: particle.endY,
                  opacity: [0, 1, 1, 0],
                  scale: [0.2, 1.15, 1, 0.5],
                  rotate: particle.rotate,
                }}
                transition={{
                  duration: 1.9,
                  delay: particle.delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  fontSize: particle.kind === "emoji" ? particle.size : undefined,
                }}
              >
                {particle.kind === "emoji" ? (
                  particle.value
                ) : (
                  <particle.value
                    className="text-maroon"
                    style={{ width: particle.size, height: particle.size }}
                    strokeWidth={2.5}
                  />
                )}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
