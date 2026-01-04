import { Gltf, Sky } from "@react-three/drei";
import {
  SimpleCharacter,
  BvhPhysicsBody,
  PrototypeBox,
  usePointerLockRotateZoomActionBindings,
  FirstPersonCharacterCameraBehavior,
  useKeyboardLocomotionActionBindings,
} from "@react-three/viverse";
import useWorld from "../hooks/useWorld";
import { Suspense, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ArrowGuide } from "../components/Experience/ui/ArrowGuide";
import { NPC } from "../components/Experience/NPC";

const Experience = () => {
  usePointerLockRotateZoomActionBindings({ lockOnClick: true,  rotationSpeed: 0.1 });
  useKeyboardLocomotionActionBindings({ requiresPointerLock: false });
  const avatar = useWorld((state: any) => state.avatar);
  const setCharacterPosition = useWorld(
    (state: any) => state.setCharacterPosition
  );
  const setCameraRotation = useWorld((state: any) => state.setCameraRotation);
  const characterRef = useRef<any>(null);

  const pinPosition = useWorld((state: any) => state.pinPosition);
  const isPinTeleported = useWorld((state: any) => state.isPinTeleported);
  const setIsPinTeleported = useWorld((state: any) => state.setIsPinTeleported);
  const setPinPosition = useWorld((state: any) => state.setPinPosition);
  const isPinConfirmed = useWorld((state: any) => state.isPinConfirmed);
  const setCharacterPositionOnFloorLabel = useWorld(
    (state: any) => state.setCharacterPositionOnFloorLabel
  );
  const cameraMode = useWorld((state: any) => state.cameraMode);

  const teleportToPin = () => {
    if (characterRef.current && pinPosition && isPinTeleported) {
      const currentY = 10;
      characterRef.current.position.set(pinPosition.x, currentY, pinPosition.z);
      setCharacterPosition(characterRef.current.position);
      setIsPinTeleported(false);
      setPinPosition(null);
    }
  };

  const pinRef = useRef<any>(null);
  // Center geometry only for mesh children
  useEffect(() => {
    if (pinRef.current) {
      pinRef.current.traverse((child: any) => {
        if (child.isMesh && child.geometry) {
          child.geometry.center();
        }
      });
    }
  }, []);

  useFrame(() => {
    if (pinRef.current) {
      // Rotate around Y-axis
      pinRef.current.rotation.y += 0.01; // adjust speed here
    }
  });

  useFrame(({ camera }) => {
    // Sync character position
    if (characterRef.current) {
      // setCharacterPosition(characterRef.current.position.clone());
      setCharacterPosition(characterRef.current.position);
      setCharacterPositionOnFloorLabel(characterRef.current.position.clone());
      // console.log("Character Position: ", characterRef.current.position);
    }

    // Store camera rotation in state
    setCameraRotation(camera.rotation.clone());

    // Teleport automatically
    if (pinPosition && isPinTeleported) teleportToPin();
  });

  return (
    <>
      <Sky />
      {/* Soft ambient fill */}
      <ambientLight intensity={0.45} />

      {/* Main key light */}
      <directionalLight
        intensity={1.6}
        position={[10, 20, 10]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Rim / Back light (anime glow) */}
      <directionalLight
        intensity={2.2}
        position={[-15, 10, -10]}
        color={"white"}
      />

      {/* Light wrapping – gives soft anime bloom effect */}
      <hemisphereLight
        intensity={0.6}
        // skyColor={"#ffffff"}
        groundColor={"#c4bfbf"}
      />

      <Suspense>
        <SimpleCharacter
          ref={characterRef}
          position={[10, 3, 0]}
          model={
           cameraMode === 'third' ?
            avatar
              ? {
                  type: "vrm",
                  url: avatar.vrmUrl,
                  castShadow: true,
                  receiveShadow: true,
                }
              : undefined
              : false
          } 
          cameraBehavior={cameraMode === 'third' ? undefined : FirstPersonCharacterCameraBehavior}
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

      {/* NPC Character */}
      <Suspense>
        <NPC
          position={[12, 0, 1]}
          model="./avatars/guard.glb"
          name="Guard"
          scale={1.1}
          rotation={[0, -90, 0]} // facing backward
        />
      </Suspense>

      {/* Pin mesh */}
      {pinPosition && isPinConfirmed && (
        <>
          <Gltf
            ref={pinRef}
            src="./models/location.glb"
            position={[pinPosition.x, 3, pinPosition.z]}
            scale={0.5}
          >
            <meshStandardMaterial emissive="red" emissiveIntensity={0.8} />
          </Gltf>

          {/* Red circle on the floor */}
          <mesh
            position={[pinPosition.x, pinPosition.y, pinPosition.z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[1, 64]} />
            <meshStandardMaterial color="red" transparent opacity={0.5} />
          </mesh>

          {/* Arrow Guide */}
          <ArrowGuide />
        </>
      )}
    </>
  );
};

export default Experience;
