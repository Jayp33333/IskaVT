import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { BvhPhysicsWorld } from "@react-three/viverse";
import Experience from "./Experience";
import LoadingOverlay from "../components/Experience/ui/LoadingOverlay";
import { UI } from "../components/Experience/ui/UI";
import DistanceUpdater from "../components/Experience/ui/DistanceUpdater";
import { audioManager } from "../services/AudioManager";
import useAudioPreload from "../hooks/useAudioPreload";
import { WelcomeDialog } from "../components/Experience/ui/WelcomeDialog";
import { GlobalLoadingOverlay } from "../components/Experience/ui/GlobalLoadingOverlay";
import { useLogbookTimeout } from "../hooks/useLogbookTimeout";
import { OrientationGuard } from "../components/Experience/ui/OrientationGuard";
import { enterKioskLandscape } from "../utils/kiosk";
import { LogbookFormDialog } from "../components/Home/LogbookFormDialog";

const LOGBOOK_ENTRY_ID_KEY = 'logbookEntryId';

export default function ExperienceScene() {
  useAudioPreload();
  const [showWelcome, setShowWelcome] = useState(false);
  const [logbookOpen, setLogbookOpen] = useState(false);
  const [loadingFinished, setLoadingFinished] = useState(false);

  const hasLogbookEntry = useMemo(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(LOGBOOK_ENTRY_ID_KEY) !== null;
  }, [logbookOpen]);
  
  // Initialize logbook timeout handling (automatic cleanup on unmount)
  useLogbookTimeout();

  useEffect(() => {
    // Attempt fullscreen + landscape lock on load (may require a user gesture in some browsers)
    void enterKioskLandscape();
  }, []);

  // Keyboard shortcut for fullscreen (F key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input field
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Press F to toggle fullscreen
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        const toggleFullscreen = async () => {
          try {
            if (!document.fullscreenElement) {
              await document.documentElement.requestFullscreen();
            } else {
              await document.exitFullscreen();
            }
          } catch (err) {
            console.error("Fullscreen toggle failed:", err);
          }
        };
        toggleFullscreen();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // While logbook is required, block movement keys so the user can't "tour" early.
  useEffect(() => {
    if (!logbookOpen) return;

    const blockedCodes = new Set([
      "KeyW",
      "KeyA",
      "KeyS",
      "KeyD",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Space",
      "ShiftLeft",
      "ShiftRight",
    ]);

    const shouldIgnoreTarget = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
    };

    const handler = (e: KeyboardEvent) => {
      if (shouldIgnoreTarget(e.target)) return;
      if (!blockedCodes.has(e.code)) return;
      e.preventDefault();
      e.stopPropagation();
      // Some libs listen on document/window; stop them as well.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any).stopImmediatePropagation?.();
    };

    window.addEventListener("keydown", handler, true);
    window.addEventListener("keyup", handler, true);
    return () => {
      window.removeEventListener("keydown", handler, true);
      window.removeEventListener("keyup", handler, true);
    };
  }, [logbookOpen]);

  const handleLoadingFinished = () => {
    setLoadingFinished(true);

    const entryId = typeof window !== "undefined" ? localStorage.getItem(LOGBOOK_ENTRY_ID_KEY) : null;
    if (!entryId) {
      setLogbookOpen(true);
      return;
    }

    audioManager.unlock();
    audioManager.play("welcome");
    setShowWelcome(true);
  };

  const handleLogbookSuccess = () => {
    setLogbookOpen(false);
    audioManager.unlock();
    audioManager.play("welcome");
    setShowWelcome(true);
  };

  return (
    <>
      <OrientationGuard />
      <LoadingOverlay onFinished={handleLoadingFinished} />
      <GlobalLoadingOverlay />

      <WelcomeDialog
        open={showWelcome}
        onClose={() => setShowWelcome(false)}
        portraitSrc="/images/headIconGirl.png"
      />

      <LogbookFormDialog
        open={loadingFinished && (!hasLogbookEntry || logbookOpen)}
        required
        onClose={() => setLogbookOpen(false)}
        onSuccess={handleLogbookSuccess}
      />

      <UI />

      <Canvas
        style={{
          position: "absolute",
          inset: 0,
          touchAction: "none",
        }}
      >
        <BvhPhysicsWorld>
          <Experience />
          <DistanceUpdater />
        </BvhPhysicsWorld>
      </Canvas>
    </>
  );
}
