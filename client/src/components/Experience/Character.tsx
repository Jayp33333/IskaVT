import { useRef, useCallback, useEffect } from "react";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import {
  SimpleCharacter,
  usePointerLockRotateZoomActionBindings,
  useKeyboardLocomotionActionBindings,
  FirstPersonCharacterCameraBehavior,
  useIsMobile,
} from "@react-three/viverse";
import useWorld from "../../hooks/useWorld";
import {
  sensitivityPercentToLookSpeed,
  sensitivityPercentToMoveMult,
} from "../../utils/experienceSensitivity";

const Character = () => {
  const isMobile = useIsMobile();
  const avatar = useWorld((s: any) => s.avatar);
  const cameraMode = useWorld((s: any) => s.cameraMode);
  const pinPosition = useWorld((s: any) => s.pinPosition);
  const isPinTeleported = useWorld((s: any) => s.isPinTeleported);
  const setPinPosition = useWorld((s: any) => s.setPinPosition);
  const setIsPinTeleported = useWorld((s: any) => s.setIsPinTeleported);
  const setSelectedDestination = useWorld((s: any) => s.setSelectedDestination);
  const setSelectedDestinationId = useWorld((s: any) => s.setSelectedDestinationId);
  const setQuery = useWorld((s: any) => s.setQuery);
  const setCharacterPosition = useWorld((s: any) => s.setCharacterPosition);
  const setCharacterPositionOnFloorLabel = useWorld(
    (s: any) => s.setCharacterPositionOnFloorLabel,
  );
  const setCameraRotation = useWorld((s: any) => s.setCameraRotation);
  const activeNPCDialog = useWorld((s: any) => s.activeNPCDialog);
  const isArrivalPaused = useWorld((s: any) => s.isArrivalPaused);
  const mobileControlsCustomize = useWorld((s: any) => s.mobileControlsCustomize);
  const cursorRevealedByAlt = useWorld((s: any) => s.cursorRevealedByAlt);
  const sensitivity = useWorld((s: any) => s.sensitivity) as number;

  const interactionLocked =
    !!activeNPCDialog || isArrivalPaused || mobileControlsCustomize;
  const lookLocked = interactionLocked || (!isMobile && cursorRevealedByAlt);
  const lookSpeed = lookLocked ? 0 : sensitivityPercentToLookSpeed(sensitivity);
  const moveMult = sensitivityPercentToMoveMult(sensitivity);

  const characterRef = useRef<any>(null);
  const cameraRotationRef = useRef(new Vector3());

  usePointerLockRotateZoomActionBindings({
    // While talking to an NPC, do not allow acquiring pointer lock
    lockOnClick: !isMobile && !interactionLocked && !cursorRevealedByAlt,
    rotationSpeed: lookSpeed,
  });
  useKeyboardLocomotionActionBindings({ requiresPointerLock: false });

  // When an NPC dialog opens, immediately release pointer lock so the user
  // regains the cursor and cannot rotate the camera by moving the mouse.
  useEffect(() => {
    if (interactionLocked && typeof document !== "undefined") {
      if (document.pointerLockElement) {
        document.exitPointerLock?.();
      }
    }
  }, [interactionLocked]);

  const handleTeleport = useCallback(() => {
    if (!characterRef.current) return;
    if (!pinPosition) {
      setIsPinTeleported(false);
      return;
    }

    characterRef.current.position.set(
      pinPosition.x,
      pinPosition.y,
      pinPosition.z,
    );
    setCharacterPosition(characterRef.current.position);
    setPinPosition(null);
    setIsPinTeleported(false);
    setSelectedDestination(null);
    setSelectedDestinationId(null);
    setQuery("");
  }, [pinPosition]);

  useFrame(({ camera }) => {
    const character = characterRef.current;
    if (!character) return;

    setCharacterPosition(character.position);
    setCharacterPositionOnFloorLabel(character.position.clone());

    const rot = camera.rotation;
    cameraRotationRef.current.set(rot.x, rot.y, rot.z);
    setCameraRotation(cameraRotationRef.current);

    if (character.position.y < -10) {
      character.position.set(0, 1, 0);
      setCharacterPosition(character.position);
    }

    if (isPinTeleported) handleTeleport();
  });

  return (
    <SimpleCharacter
      ref={characterRef}
      position={[10, 3, 0]}
      actionBindingOptions={{
        pointerCaptureRotationSpeed: lookSpeed,
        pointerLockRotationSpeed: lookSpeed,
      }}
      movement={{
        jump: { speed: isArrivalPaused ? 0 : 4 * moveMult },
        walk: { speed: isArrivalPaused ? 0 : 3 * moveMult },
        run: { speed: isArrivalPaused ? 0 : 5 * moveMult },
      }}
      model={
        cameraMode === "third" && avatar
          ? {
              type: "vrm",
              url: avatar.vrmUrl,
            }
          : false
      }
      cameraBehavior={
        cameraMode === "first" ? FirstPersonCharacterCameraBehavior : undefined
      }
    />
  );
};

export default Character;
