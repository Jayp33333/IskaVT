import { useRef, useEffect } from "react";
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
import {
  processPendingPinTeleport,
  registerCharacterTeleportApplier,
} from "../../utils/pinTeleport";

const Character = () => {
  const isMobile = useIsMobile();
  const avatar = useWorld((s: any) => s.avatar);
  const cameraMode = useWorld((s: any) => s.cameraMode);
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
  const markAvatarSwapReady = useWorld((s: any) => s.markAvatarSwapReady);

  const interactionLocked =
    !!activeNPCDialog || isArrivalPaused || mobileControlsCustomize;
  const movementPaused = !!activeNPCDialog || isArrivalPaused;
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

  useEffect(() => {
    if (cameraMode === "first" || !avatar?.vrmUrl) {
      markAvatarSwapReady();
      return;
    }

    let cancelled = false;
    let frames = 0;
    const maxFrames = 180;

    const poll = () => {
      if (cancelled) return;
      frames += 1;

      const character = characterRef.current;
      const hasModel =
        !!character &&
        character.children.length > 0 &&
        character.children.some(
          (child: { children?: unknown[] }) => (child.children?.length ?? 0) > 0,
        );

      if (hasModel || frames >= maxFrames) {
        markAvatarSwapReady();
        return;
      }

      requestAnimationFrame(poll);
    };

    requestAnimationFrame(poll);
    return () => {
      cancelled = true;
    };
  }, [avatar?.id, avatar?.vrmUrl, cameraMode, markAvatarSwapReady]);

  useEffect(() => {
    registerCharacterTeleportApplier((position) => {
      const character = characterRef.current;
      if (!character) return false;
      character.position.set(position.x, position.y, position.z);
      setCharacterPosition(character.position);
      return true;
    });
    return () => registerCharacterTeleportApplier(null);
  }, [setCharacterPosition]);

  useFrame(({ camera }) => {
    processPendingPinTeleport();

    const character = characterRef.current;
    if (!character) return;

    setCharacterPosition(character.position);
    setCharacterPositionOnFloorLabel(character.position.clone());

    const rot = camera.rotation;
    cameraRotationRef.current.set(rot.x, rot.y, rot.z);
    setCameraRotation(cameraRotationRef.current);

    if (character.position.y < -0.1) {
      character.position.set(10, 1, 0);
      setCharacterPosition(character.position);
    }
  });

  return (
    <SimpleCharacter
      ref={characterRef}
      position={[10, 3, 0]}
      actionBindingOptions={{
        pointerCaptureRotationSpeed: lookSpeed,
        pointerLockRotationSpeed: lookSpeed,
        // Default library dead zone is 24px (~43% of radius) — too large on our themed joystick.
        screenJoystickDeadZonePx: 0,
        screenJoystickRunDistancePx: 36,
      }}
      movement={{
        jump: { speed: movementPaused ? 0 : 4 * moveMult },
        walk: { speed: movementPaused ? 0 : 3 * moveMult },
        run: { speed: movementPaused ? 0 : 5 * moveMult },
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
