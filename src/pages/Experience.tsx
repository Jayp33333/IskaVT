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
import * as THREE from "three";

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

  const avatar = useWorld((s: any) => s.avatar);
  const cameraMode = useWorld((s: any) => s.cameraMode);

  const pinPosition = useWorld((s: any) => s.pinPosition);
  const isPinConfirmed = useWorld((s: any) => s.isPinConfirmed);
  const isPinTeleported = useWorld((s: any) => s.isPinTeleported);

  const setPinPosition = useWorld((s: any) => s.setPinPosition);
  const setIsPinTeleported = useWorld((s: any) => s.setIsPinTeleported);
  const setCharacterPosition = useWorld((s: any) => s.setCharacterPosition);
  const setCharacterPositionOnFloorLabel = useWorld(
    (s: any) => s.setCharacterPositionOnFloorLabel
  );
  const setCameraRotation = useWorld((s: any) => s.setCameraRotation);

  const characterRef = useRef<any>(null);
  const pinRef = useRef<any>(null);

  const introAnimating = useRef(true);
  const introProgress = useRef(0);

  const CAMERA_START = new THREE.Vector3(10, 10, 10); // top view
  const CAMERA_TARGET_OFFSET = new THREE.Vector3(0, 2, 5); // behind character

  const handleTeleport = () => {
    if (!characterRef.current || !pinPosition || !isPinTeleported) return;

    characterRef.current.position.set(pinPosition.x, 3, pinPosition.z);

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

  useFrame(({ camera }, delta) => {
    const character = characterRef.current;
    if (!character) return;

    /* ---------- INTRO CAMERA ---------- */
    if (introAnimating.current) {
      introProgress.current += delta * 0.25; // speed
      const t = Math.min(introProgress.current, 1);

      // Smoothstep easing (game-quality)
      const eased = t * t * (3 - 2 * t);

      const targetPos = character.position.clone().add(CAMERA_TARGET_OFFSET);

      camera.position.lerpVectors(CAMERA_START, targetPos, eased);

      camera.lookAt(
        character.position.x,
        character.position.y + 1.5,
        character.position.z
      );

      // Optional cinematic zoom
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = THREE.MathUtils.lerp(75, 60, eased);
        camera.updateProjectionMatrix();
      }

      if (t >= 1) {
        introAnimating.current = false;
      }

      return; 
    }

    setCharacterPosition(character.position);
    setCharacterPositionOnFloorLabel(character.position.clone());
    setCameraRotation(camera.rotation.clone());

    if (pinRef.current) {
      pinRef.current.rotation.y += delta;
    }

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
      />

      <directionalLight
        position={[-15, 10, -10]}
        intensity={2.4}
        color="#e6f0ff"
      />

      <hemisphereLight intensity={0.5} groundColor="#b0c4de" />

      <Suspense fallback={null}>
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
            introAnimating.current
              ? undefined
              : cameraMode === "third"
              ? undefined
              : FirstPersonCharacterCameraBehavior
          }
          actionBindings={introAnimating.current ? [] : undefined} // disable input during intro
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
          rotation={[0, -Math.PI / 2, 0]}
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
            <meshStandardMaterial color="red" transparent opacity={0.5} />
          </mesh>

          <ArrowGuide />
        </>
      )}
    </>
  );
};

export default Experience;
