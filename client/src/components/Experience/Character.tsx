import { useRef, useCallback, useEffect } from "react";
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
  const pinPosition = useWorld((s: any) => s.pinPosition);
  const isPinTeleported = useWorld((s: any) => s.isPinTeleported);
  const setPinPosition = useWorld((s: any) => s.setPinPosition);
  const setIsPinTeleported = useWorld((s: any) => s.setIsPinTeleported);
  const setSelectedDestination = useWorld((s: any) => s.setSelectedDestination);
  const setQuery = useWorld((s: any) => s.setQuery);
  const setCharacterPosition = useWorld((s: any) => s.setCharacterPosition);
  const setCharacterPositionOnFloorLabel = useWorld(
    (s: any) => s.setCharacterPositionOnFloorLabel,
  );
  const setCameraRotation = useWorld((s: any) => s.setCameraRotation);
  const activeNPCDialog = useWorld((s: any) => s.activeNPCDialog);
  const cursorRevealedByAlt = useWorld((s: any) => s.cursorRevealedByAlt);

  const interactionLocked = !!activeNPCDialog;

  const characterRef = useRef<any>(null);

  usePointerLockRotateZoomActionBindings({
    // While talking to an NPC, do not allow acquiring pointer lock
    lockOnClick: !isMobile && !interactionLocked && !cursorRevealedByAlt,
    // Freeze camera rotation while in dialog or while Alt reveals the cursor
    rotationSpeed: interactionLocked || cursorRevealedByAlt ? 0 : 0.1,
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
    if (!characterRef.current || !pinPosition) return;

    characterRef.current.position.set(
      pinPosition.x,
      pinPosition.y,
      pinPosition.z,
    );
    setCharacterPosition(characterRef.current.position);
    setPinPosition(null);
    setIsPinTeleported(false);
    setSelectedDestination(null);
    setQuery("");
  }, [pinPosition]);

  useFrame(({ camera }) => {
    const character = characterRef.current;
    if (!character) return;

    // console.log("Character position:", character.position);

    setCharacterPosition(character.position);
    setCharacterPositionOnFloorLabel(character.position.clone());
    setCameraRotation(camera.rotation.clone());

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
      movement={{
        jump: { speed: 4 },
        walk: { speed: 3 },
        run: { speed: 5 },
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
