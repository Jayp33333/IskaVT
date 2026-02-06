import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { BvhPhysicsWorld } from "@react-three/viverse";
import Experience from "./Experience";
import LoadingOverlay from "../components/Experience/ui/LoadingOverlay";
import { UI } from "../components/Experience/ui/UI";
import { audioManager } from "../services/AudioManager";
import useAudioPreload from "../hooks/useAudioPreload";
import { WelcomeDialog } from "../components/Experience/ui/WelcomeDialog";
import { GlobalLoadingOverlay } from "../components/Experience/ui/GlobalLoadingOverlay";
import { useLogbookTimeout } from "../hooks/useLogbookTimeout";
import { OrientationGuard } from "../components/Experience/ui/OrientationGuard";
import { enterKioskLandscape } from "../utils/kiosk";
import { LogbookFormDialog } from "../components/Home/LogbookFormDialog";
import useWorld from "../hooks/useWorld";

const LOGBOOK_ENTRY_ID_KEY = 'logbookEntryId';

export default function ExperienceScene() {
  useAudioPreload();
  const [showWelcome, setShowWelcome] = useState(false);
  const [logbookOpen, setLogbookOpen] = useState(false);
  const [loadingFinished, setLoadingFinished] = useState(false);
  const [pointerLocked, setPointerLocked] = useState(false);
  const [hasPointerLockedOnce, setHasPointerLockedOnce] = useState(false);
  const sceneContainerRef = useRef<HTMLDivElement>(null);

  const hasLogbookEntry = useMemo(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(LOGBOOK_ENTRY_ID_KEY) !== null;
  }, [logbookOpen]);

  const experienceReady =
    loadingFinished && !logbookOpen && !showWelcome;

  // Initialize logbook timeout handling (automatic cleanup on unmount)
  useLogbookTimeout();

  useEffect(() => {
    // Attempt fullscreen + landscape lock on load (may require a user gesture in some browsers)
    void enterKioskLandscape();
  }, []);

  // Get main scene canvas for pointer lock
  const getMainCanvas = () =>
    sceneContainerRef.current?.querySelector("canvas") ?? null;

  // Alt key: show cursor (exit pointer lock) when Alt held, re-lock when Alt released
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        e.preventDefault();
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.altKey) {
        const canvas = getMainCanvas();
        if (canvas && experienceReady && !document.pointerLockElement) {
          canvas.requestPointerLock();
          canvas.focus(); // Restore focus so WASD works again
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [experienceReady]);

  // Track pointer lock state; only show "Click to enter" before first lock (so Alt doesn't block UI)
  useEffect(() => {
    const handleChange = () => {
      const locked = !!document.pointerLockElement;
      setPointerLocked(locked);
      if (locked) setHasPointerLockedOnce(true);
    };
    document.addEventListener("pointerlockchange", handleChange);
    return () => document.removeEventListener("pointerlockchange", handleChange);
  }, []);

  // When NPC dialog opens: exit pointer lock so cursor is visible for clicking options.
  // When dialog closes: auto re-lock after a short delay so control returns to the game.
  const activeNPCDialog = useWorld((s: any) => s.activeNPCDialog);
  const prevNPCDialogRef = useRef(activeNPCDialog);
  useEffect(() => {
    if (activeNPCDialog) {
      prevNPCDialogRef.current = activeNPCDialog;
      if (document.pointerLockElement) {
        document.exitPointerLock(); // Show cursor for clickable options
      }
      return;
    }
    // Dialog just closed: re-lock after dialog UI has finished closing (so click isn't stolen)
    const wasOpen = !!prevNPCDialogRef.current;
    prevNPCDialogRef.current = null;
    if (!wasOpen) return;

    const t = setTimeout(() => {
      const canvas = getMainCanvas();
      if (canvas && experienceReady && !document.pointerLockElement) {
        canvas.requestPointerLock();
        canvas.focus();
      }
    }, 100);
    return () => clearTimeout(t);
  }, [activeNPCDialog, experienceReady]);

  // F key: talk to nearest NPC when in range
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        useWorld.getState().triggerNearestNPCTalk();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const blockMovement = logbookOpen || !!activeNPCDialog;

  // Block movement and camera keys when logbook is open or NPC dialog is open.
  useEffect(() => {
    if (!blockMovement) return;

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
  }, [blockMovement]);

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

      {/* Click-to-enter overlay: only before first lock; when Alt is held, UI stays clickable */}
      {experienceReady && !pointerLocked && !hasPointerLockedOnce && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 z-5000 flex cursor-default items-center justify-center bg-black/20"
          onClick={() => {
            const canvas = getMainCanvas();
            if (canvas?.requestPointerLock) {
              canvas.requestPointerLock();
              canvas.focus(); // Focus canvas so WASD keyboard bindings receive input
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              const canvas = getMainCanvas();
              if (canvas?.requestPointerLock) {
                canvas.requestPointerLock();
                canvas.focus(); // Focus canvas so WASD keyboard bindings receive input
              }
            }
          }}
          aria-label="Click to enter"
        >
          <p className="text-white/90 text-sm font-medium">
            Click anywhere to enter
          </p>
        </div>
      )}

      <div
        ref={sceneContainerRef}
        className="absolute inset-0"
        style={{ touchAction: "none" }}
      >
        <Canvas
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
      </div>
    </>
  );
}
