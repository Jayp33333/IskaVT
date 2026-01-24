import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const LOGBOOK_ENTRY_ID_KEY = 'logbookEntryId';

export default function ExperienceScene() {
  const navigate = useNavigate();
  useAudioPreload();
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Check if logbook entry exists, redirect if not
  useEffect(() => {
    const entryId = localStorage.getItem(LOGBOOK_ENTRY_ID_KEY);
    if (!entryId) {
      navigate('/', { replace: true });
    }
  }, [navigate]);
  
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

  const handleLoadingFinished = () => {
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
        </BvhPhysicsWorld>
      </Canvas>
    </>
  );
}
