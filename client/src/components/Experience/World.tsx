import { Gltf } from "@react-three/drei";
import { BvhPhysicsBody, PrototypeBox } from "@react-three/viverse";
import { MODEL_PATHS } from "../../data/modelRegistry";
import useWorld from "../../hooks/useWorld";
// import { PUPCampus } from "./models/PUPCampus";
// import { Perf } from "r3f-perf";

const World = () => {
  const shadowsEnabled = useWorld((s) => s.shadowsEnabled);

  return (
    <BvhPhysicsBody>
      {/* <Perf position="top-left" /> */}
       <Gltf
        src={MODEL_PATHS.campus}
        position={[10, 0.1, 0]}
        castShadow={shadowsEnabled}
        receiveShadow={shadowsEnabled}
      />
      {/* <PUPCampus
        position={[10, 0.1, 0]}
        shadowsEnabled={shadowsEnabled}
      /> */}
      <PrototypeBox
        scale={[1000, 1, 1000]}
        position={[0, -0.5, 0]}
        color="gray"
        receiveShadow={shadowsEnabled}
      />
    </BvhPhysicsBody>
  );
};

export default World;
