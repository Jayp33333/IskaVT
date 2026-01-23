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
    // Enter fullscreen when Experience page loads
    const element = document.documentElement;

    if (!document.fullscreenElement) {
      element.requestFullscreen?.();
    }
  }, []);

  const handleLoadingFinished = () => {
    audioManager.unlock();
    audioManager.play("welcome");
    setShowWelcome(true);
  };

  return (
    <>
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
