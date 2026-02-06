import { useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import {
  SimpleCharacter,
  usePointerLockRotateZoomActionBindings,
  useKeyboardLocomotionActionBindings,
  FirstPersonCharacterCameraBehavior,
  useIsMobile,
} from "@react-three/viverse";
import useWorld from "../../hooks/useWorld";

const Character = () => {
  const isMobile = useIsMobile();
  const avatar = useWorld((s: any) => s.avatar);
  const cameraMode = useWorld((s: any) => s.cameraMode);
  const cameraSensitivity = useWorld((s: any) => s.cameraSensitivity);
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

  usePointerLockRotateZoomActionBindings({
    lockOnClick: !isMobile,
    rotationSpeed: 0.1 * cameraSensitivity,
  });
  useKeyboardLocomotionActionBindings({ requiresPointerLock: false });

  const handleTeleport = useCallback(() => {
    if (!characterRef.current || !pinPosition) return;

    characterRef.current.position.set(pinPosition.x, pinPosition.y, pinPosition.z);
    setCharacterPosition(characterRef.current.position);
    setPinPosition(null);
    setIsPinTeleported(false);
  }, [pinPosition]);

  useFrame(({ camera }) => {
    const character = characterRef.current;
    if (!character) return;

    setCharacterPosition(character.position);
    setCharacterPositionOnFloorLabel(character.position.clone());
    setCameraRotation(camera.rotation.clone());

    if (isPinTeleported) handleTeleport();
  });

  return (
    <SimpleCharacter
      ref={characterRef}
      position={[10, 3, 0]}
      movement={{
        jump: { speed: 5 },
      }}
      model={
        cameraMode === "third" && avatar
          ? {
              type: "vrm",
              url: avatar.vrmUrl
            }
          : false
      }
      cameraBehavior={
        cameraMode === "first"
          ? FirstPersonCharacterCameraBehavior
          : undefined
      }
    />
  );
};

export default Character;
