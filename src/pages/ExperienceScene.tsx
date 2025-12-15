import { Canvas } from "@react-three/fiber";
import { BvhPhysicsWorld} from "@react-three/viverse";
import Experience from "./Experience";
import LoadingOverlay from "../components/Experience/ui/LoadingOverlay";
import { UI } from "../components/Experience/ui/UI";

export default function ExperienceScene() {
  return (
    <>
      <LoadingOverlay />
      <UI />
      <Canvas style={{ position: "absolute", inset: 0, touchAction: "none" }}>
        <BvhPhysicsWorld>
          <Experience />
        </BvhPhysicsWorld>
      </Canvas>
    </>
  );
}
