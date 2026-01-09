import { useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  SimpleCharacter,
  usePointerLockRotateZoomActionBindings,
  useKeyboardLocomotionActionBindings,
  FirstPersonCharacterCameraBehavior,
} from "@react-three/viverse";
import useWorld from "../../hooks/useWorld";

const CAMERA_START = new THREE.Vector3(10, 10, 10);
const CAMERA_TARGET_OFFSET = new THREE.Vector3(0, 2, 5);
const INTRO_SPEED = 0.25;

const Character = () => {
  const avatar = useWorld((s: any) => s.avatar);
  const cameraMode = useWorld((s: any) => s.cameraMode);
  const pinPosition = useWorld((s: any) => s.pinPosition);
  const isPinTeleported = useWorld((s: any) => s.isPinTeleported);
  const setPinPosition = useWorld((s: any) => s.setPinPosition);
  const setIsPinTeleported = useWorld((s: any) => s.setIsPinTeleported);
  const setCharacterPosition = useWorld((s: any) => s.setCharacterPosition);
  const setCharacterPositionOnFloorLabel = useWorld(
    (s: any) => s.setCharacterPositionOnFloorLabel
  );
  const setCameraRotation = useWorld((s: any) => s.setCameraRotation);

  const characterRef = useRef<any>(null);
  const introAnimating = useRef(true);
  const introProgress = useRef(0);

  usePointerLockRotateZoomActionBindings({ lockOnClick: true, rotationSpeed: 0.1 });
  useKeyboardLocomotionActionBindings({ requiresPointerLock: false });

  const handleTeleport = useCallback(() => {
    if (!characterRef.current || !pinPosition) return;

    characterRef.current.position.set(pinPosition.x, 3, pinPosition.z);
    setCharacterPosition(characterRef.current.position);
    setPinPosition(null);
    setIsPinTeleported(false);
  }, [pinPosition]);

  useFrame(({ camera }, delta) => {
    const character = characterRef.current;
    if (!character) return;

    // Intro camera animation
    if (introAnimating.current) {
      introProgress.current += delta * INTRO_SPEED;
      const t = Math.min(introProgress.current, 1);
      const eased = t * t * (3 - 2 * t);

      const targetPos = character.position.clone().add(CAMERA_TARGET_OFFSET);
      camera.position.lerpVectors(CAMERA_START, targetPos, eased);
      camera.lookAt(character.position.x, character.position.y + 1.5, character.position.z);

      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = THREE.MathUtils.lerp(75, 60, eased);
        camera.updateProjectionMatrix();
      }

      if (t >= 1) introAnimating.current = false;
      return;
    }

    setCharacterPosition(character.position);
    setCharacterPositionOnFloorLabel(character.position.clone());
    setCameraRotation(camera.rotation.clone());

    if (isPinTeleported) handleTeleport();
  });

  return (
    <SimpleCharacter
      ref={characterRef}
      position={[10, 3, 0]}
      model={
        cameraMode === "third" && avatar
          ? { type: "vrm", url: avatar.vrmUrl, castShadow: true, receiveShadow: true }
          : false
      }
      cameraBehavior={
        introAnimating.current
          ? undefined
          : cameraMode === "first"
          ? FirstPersonCharacterCameraBehavior
          : undefined
      }
      actionBindings={introAnimating.current ? [] : undefined}
    />
  );
};

export default Character;
