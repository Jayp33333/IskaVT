import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { BvhPhysicsWorld } from "@react-three/viverse";
import Experience from "./Experience";
import LoadingOverlay from "../components/Experience/ui/LoadingOverlay";
import { UI } from "../components/Experience/ui/UI";
import { audioManager } from "../services/AudioManager";
import useAudioPreload from "../hooks/useAudioPreload";
import { TourGuideDialog } from "../components/Experience/ui/TourGuideDialog.tsx";
import { GlobalLoadingOverlay } from "../components/Experience/ui/GlobalLoadingOverlay";
import { useLogbookTimeout } from "../hooks/useLogbookTimeout";
import { OrientationGuard } from "../components/Experience/ui/OrientationGuard";
import { enterKioskLandscape } from "../utils/kiosk";
import { LogbookFormDialog } from "../components/Home/LogbookFormDialog";
import useWorld from "../hooks/useWorld";
import { useAltCursorReveal } from "../hooks/useAltCursorReveal";
import { useModelPreload } from "../hooks/useModelPreload";
import { useExperienceAudio } from "../hooks/useExperienceAudio";
import { useCustomAmbientMusic } from "../hooks/useCustomAmbientMusic";


const LOGBOOK_ENTRY_ID_KEY = 'logbookEntryId';

export default function ExperienceScene() {
  useAudioPreload();
  useCustomAmbientMusic();
  useModelPreload();
  const [showWelcome, setShowWelcome] = useState(false);
  const [logbookOpen, setLogbookOpen] = useState(false);
  const [loadingFinished, setLoadingFinished] = useState(false);

  const isTouring = loadingFinished && !logbookOpen;
  useExperienceAudio(isTouring);

  // Global NPC dialog / arrival pause — temporarily lock movement/camera
  const activeNPCDialog = useWorld((s: any) => s.activeNPCDialog);
  const isArrivalPaused = useWorld((s: any) => s.isArrivalPaused);
  const movementBlocked = !!activeNPCDialog || isArrivalPaused;

  const hasLogbookEntry = useMemo(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(LOGBOOK_ENTRY_ID_KEY) !== null;
  }, [logbookOpen]);
  
  // Initialize logbook timeout handling (automatic cleanup on unmount)
  useLogbookTimeout();
  useAltCursorReveal();

  useEffect(() => {
    // Attempt fullscreen + landscape lock on load (may require a user gesture in some browsers)
    void enterKioskLandscape();
  }, []);

  useEffect(() => {
    document.body.classList.add("experience-no-shadow");
    return () => document.body.classList.remove("experience-no-shadow");
  }, []);

  // Browsers block autoplay until the user interacts with the page.
  useEffect(() => {
    if (!loadingFinished) return;

    const unlockOnGesture = () => {
      audioManager.unlock();
    };

    window.addEventListener("pointerdown", unlockOnGesture, { once: true });
    window.addEventListener("keydown", unlockOnGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockOnGesture);
      window.removeEventListener("keydown", unlockOnGesture);
    };
  }, [loadingFinished]);

  // Keyboard shortcuts:
  // - F: talk to nearest NPC in range (if any, and no overlay conflicts)
  // - M: toggle campus minimap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input field
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        if (!loadingFinished || logbookOpen || showWelcome) return;

        const {
          showLogHistory,
          showFeedback,
          activeNPCDialog,
          showDestinationPicker,
          map2DOpen,
          setMap2DOpen,
        } = useWorld.getState() as any;

        if (showLogHistory || showFeedback || activeNPCDialog || showDestinationPicker) return;

        e.preventDefault();
        setMap2DOpen(!map2DOpen);
        return;
      }

      // Press F to talk to nearest NPC in range
      if (e.key === 'f' || e.key === 'F') {
        const {
          showMiniMap,
          showLogHistory,
          showFeedback,
          activeNPCDialog,
          npcsInRange,
          triggerNearestNPCTalk,
        } = useWorld.getState() as any;

        if (showMiniMap || showLogHistory || showFeedback || activeNPCDialog) return;

        if (npcsInRange && npcsInRange.size > 0) {
          e.preventDefault();
          triggerNearestNPCTalk();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [loadingFinished, logbookOpen, showWelcome]);

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

  // While an NPC dialog is open or arrival celebration is pausing, block movement keys.
  useEffect(() => {
    if (!movementBlocked) return;

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
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
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
  }, [movementBlocked]);

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

      <TourGuideDialog
        open={showWelcome}
        onClose={() => {
          setShowWelcome(false);
          audioManager.unlock();
        }}
        portraitSrc="/images/headIconGirl.png"
      />

      <LogbookFormDialog
        open={loadingFinished && (!hasLogbookEntry || logbookOpen)}
        required
        onClose={() => setLogbookOpen(false)}
        onSuccess={handleLogbookSuccess}
      />

      <UI tourGuideDialogOpen={showWelcome} experienceStarted={loadingFinished} />

      {/* <Map2D /> */}
      

      <Canvas
        dpr={[1, 1.5]}
        style={{
          position: "absolute",
          inset: 0,
          touchAction: "none",
        }}
      >
        <BvhPhysicsWorld>
          <Experience />
        </BvhPhysicsWorld>
      </Canvas>
    </>
  );
}
