import { Canvas } from "@react-three/fiber";
import { Viverse } from "@react-three/viverse";
import Experience from "./Experience";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { UI } from "../components/ui/UI";

export default function ExperienceScene() {
  return (
    <Viverse clientId={import.meta.env.VITE_VIVERSE_APP_ID}>
      <LoadingOverlay />
      <UI />
      <Canvas style={{ position: "absolute", inset: 0, touchAction: "none" }}>
        <Experience />
      </Canvas>
    </Viverse>
  );
}
