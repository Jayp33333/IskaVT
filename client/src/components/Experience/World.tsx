import { Gltf } from "@react-three/drei";
import { BvhPhysicsBody, PrototypeBox  } from "@react-three/viverse";
import { MODEL_PATHS } from "../../data/modelRegistry";
// import { Perf } from "r3f-perf";


const World = () => (
  <BvhPhysicsBody>
    {/* <Perf position="top-left" /> */}
    <Gltf src={MODEL_PATHS.campus} position={[10, 0.1, 0]} />
    <PrototypeBox scale={[1000, 1, 1000]} position={[0, -0.5, 0]} color="gray" />
  </BvhPhysicsBody>
);

export default World;
