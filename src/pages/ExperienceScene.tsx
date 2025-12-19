import { Canvas } from "@react-three/fiber";
import { BvhPhysicsWorld } from "@react-three/viverse";
import Experience from "./Experience";
import LoadingOverlay from "../components/Experience/ui/LoadingOverlay";
import { UI } from "../components/Experience/ui/UI";
import { audioManager } from "../services/AudioManager";
import useAudioPreload from "../hooks/useAudioPreload";

export default function ExperienceScene() {
   useAudioPreload();

  const playWelcomeAudio = () => {
    audioManager.unlock();
    audioManager.play("welcome");
  };

  return (
    <>
      <LoadingOverlay onFinished={playWelcomeAudio} />
      <UI />
      <Canvas style={{ position: "absolute", inset: 0, touchAction: "none" }}>
        <BvhPhysicsWorld>
          <Experience />
        </BvhPhysicsWorld>
      </Canvas>
    </>
  );
}
