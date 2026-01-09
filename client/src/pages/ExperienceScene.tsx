import { Canvas } from "@react-three/fiber";
import { BvhPhysicsWorld } from "@react-three/viverse";
import Experience from "./Experience";
import LoadingOverlay from "../components/Experience/ui/LoadingOverlay";
import { UI } from "../components/Experience/ui/UI";
import { audioManager } from "../services/AudioManager";
import useAudioPreload from "../hooks/useAudioPreload";
import { WelcomeDialog } from "../components/Experience/ui/WelcomeDialog";
import { useState } from "react";
import { GlobalLoadingOverlay } from "../components/Experience/ui/GlobalLoadingOverlay";

export default function ExperienceScene() {
  useAudioPreload();

  const [showWelcome, setShowWelcome] = useState(false);

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

      <Canvas style={{ position: "absolute", inset: 0, touchAction: "none" }}>
        <BvhPhysicsWorld>
          <Experience />
        </BvhPhysicsWorld>
      </Canvas>
    </>
  );
}
