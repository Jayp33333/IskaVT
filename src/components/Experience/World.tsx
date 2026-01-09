import { Gltf } from "@react-three/drei";
import { BvhPhysicsBody, PrototypeBox  } from "@react-three/viverse";

const World = () => (
  <BvhPhysicsBody>
    <Gltf src="./models/PUPCampus.glb" position={[10, 0.1, 0]} castShadow receiveShadow />
    <PrototypeBox scale={[1000, 1, 1000]} position={[0, -0.5, 0]} color="gray" />
  </BvhPhysicsBody>
);

export default World;
