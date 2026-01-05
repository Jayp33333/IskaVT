import { Gltf, Sky } from "@react-three/drei";
import {
  SimpleCharacter,
  BvhPhysicsBody,
  PrototypeBox,
  usePointerLockRotateZoomActionBindings,
  useKeyboardLocomotionActionBindings,
  FirstPersonCharacterCameraBehavior,
} from "@react-three/viverse";
import { Suspense, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useWorld from "../hooks/useWorld";
import { ArrowGuide } from "../components/Experience/ui/ArrowGuide";
import { NPC } from "../components/Experience/NPC";


const Experience = () => {
  usePointerLockRotateZoomActionBindings({
    lockOnClick: true,
    rotationSpeed: 0.1,
  });

  useKeyboardLocomotionActionBindings({
    requiresPointerLock: false,
  });

  const {
    avatar,
    cameraMode,
    pinPosition,
    isPinConfirmed,
    isPinTeleported,
    setPinPosition,
    setIsPinTeleported,
    setCharacterPosition,
    setCharacterPositionOnFloorLabel,
    setCameraRotation,
  } = useWorld((s: any) => ({
    avatar: s.avatar,
    cameraMode: s.cameraMode,
    pinPosition: s.pinPosition,
    isPinConfirmed: s.isPinConfirmed,
    isPinTeleported: s.isPinTeleported,
    setPinPosition: s.setPinPosition,
    setIsPinTeleported: s.setIsPinTeleported,
    setCharacterPosition: s.setCharacterPosition,
    setCharacterPositionOnFloorLabel: s.setCharacterPositionOnFloorLabel,
    setCameraRotation: s.setCameraRotation,
  }));

  const characterRef = useRef<any>(null);
  const pinRef = useRef<any>(null);

  const handleTeleport = () => {
    if (!characterRef.current || !pinPosition || !isPinTeleported) return;

    characterRef.current.position.set(
      pinPosition.x,
      10,
      pinPosition.z
    );

    setCharacterPosition(characterRef.current.position);
    setIsPinTeleported(false);
    setPinPosition(null);
  };

  useEffect(() => {
    if (!pinRef.current) return;

    pinRef.current.traverse((child: any) => {
      if (child.isMesh && child.geometry) {
        child.geometry.center();
      }
    });
  }, []);

  useFrame(({ camera }) => {
    const character = characterRef.current;

    if (character) {
      setCharacterPosition(character.position);
      setCharacterPositionOnFloorLabel(character.position.clone());
    }

    if (pinRef.current) {
      pinRef.current.rotation.y += 0.01;
    }

    setCameraRotation(camera.rotation.clone());

    if (isPinTeleported) handleTeleport();
  });

  return (
    <>
      <Sky />

      <ambientLight intensity={0.3} />

      <directionalLight
        position={[10, 20, 10]}
        intensity={1.8}
        color="#fff1e0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <directionalLight
        position={[-15, 10, -10]}
        intensity={2.4}
        color="#e6f0ff"
      />

      <hemisphereLight
        intensity={0.5}
        groundColor="#b0c4de"
      />

      <Suspense>
        <SimpleCharacter
          ref={characterRef}
          position={[10, 3, 0]}
          model={
            cameraMode === "third" && avatar
              ? {
                  type: "vrm",
                  url: avatar.vrmUrl,
                  castShadow: true,
                  receiveShadow: true,
                }
              : false
          }
          cameraBehavior={
            cameraMode === "third"
              ? undefined
              : FirstPersonCharacterCameraBehavior
          }
        />
      </Suspense>

      <BvhPhysicsBody>
        <Gltf
          src="./models/PUPCampus.glb"
          position={[10, 0.1, 0]}
          castShadow
          receiveShadow
        />

        <PrototypeBox
          scale={[1000, 1, 1000]}
          position={[0, -0.5, 0]}
          color="gray"
        />
      </BvhPhysicsBody>

      <Suspense>
        <NPC
          position={[12, 0, 1]}
          model="./avatars/guard.glb"
          name="Guard"
          scale={1.1}
          rotation={[0, -90, 0]}
        />
      </Suspense>

      {pinPosition && isPinConfirmed && (
        <>
          <Gltf
            ref={pinRef}
            src="./models/location.glb"
            position={[pinPosition.x, 3, pinPosition.z]}
            scale={0.5}
          />

          <mesh
            position={[pinPosition.x, pinPosition.y, pinPosition.z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[1, 64]} />
            <meshStandardMaterial
              color="red"
              transparent
              opacity={0.5}
            />
          </mesh>

          <ArrowGuide />
        </>
      )}
    </>
  );
};

export default Experience;
