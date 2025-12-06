import { Gltf, Sky } from "@react-three/drei";
import { SimpleCharacter, BvhPhysicsBody, PrototypeBox } from "@react-three/viverse";
import useWorld from "../hooks/useWorld";
import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const Experience = () => {
  const avatar = useWorld((state: any) => state.avatar);
  const setCharacterPosition = useWorld((state: any) => state.setCharacterPosition);
  const characterRef = useRef<any>(null);

  // Get pinPosition from global state
  const pinPosition = useWorld((state: any) => state.pinPosition);
  // const isPinConfirmed = useWorld((state: any) => state.isPinConfirmed);
  const isPinTeleported = useWorld((state: any) => state.isPinTeleported);
  const setIsPinTeleported = useWorld((state: any) => state.setIsPinTeleported);
  const setPinPosition = useWorld((state: any) => state.setPinPosition);

  // Teleport function
  const teleportToPin = () => {
    if (characterRef.current && pinPosition && isPinTeleported) {
      const currentY = 10;
      characterRef.current.position.set(pinPosition.x, currentY, pinPosition.z);
      setCharacterPosition(characterRef.current.position);
      setIsPinTeleported(false);
      setPinPosition(null);
    }
  };

  // Sync character position to world state
  useFrame(() => {
    if (characterRef.current) {
      const pos = characterRef.current.position;
      setCharacterPosition(pos);
    }

    // Teleport automatically if pin is confirmed
    if (pinPosition && isPinTeleported) {
      teleportToPin();
    }
  });

  return (
    <>
      <Sky />
      <directionalLight intensity={1.2} position={[-10, 10, -10]} />
      <ambientLight intensity={1} />
      <Suspense>
        <SimpleCharacter
          ref={characterRef}
          position={[10, 3, 0]}
          model={
            avatar
              ? { type: "vrm", url: avatar.vrmUrl, castShadow: true, receiveShadow: true }
              : undefined
          }
        />
      </Suspense>

      <BvhPhysicsBody>
        <Gltf src="./models/de_dust_2_with_real_light.glb" position={[0, 3, 0]} />
        <PrototypeBox scale={[100, 1, 100]} position={[0, -0.5, 0]} color="gray" />
      </BvhPhysicsBody>
    </>
  );
};

export default Experience;
