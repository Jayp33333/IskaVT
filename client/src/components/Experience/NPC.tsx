import { Gltf } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useWorld from "../../hooks/useWorld";

type DialogStep = {
  message: string;
  options?: { label: string; next: number | null }[];
};

type NPCProps = {
  id: string;
  position: [number, number, number];
  model?: string;
  name?: string;
  scale?: number | [number, number, number];
  rotation?: [number, number, number]; // degrees (x, y, z)
  dialogs: DialogStep[];
  color?: string;
};

const INTERACT_DISTANCE = 1.5;

export const NPC = ({
  id,
  position,
  model,
  name = "NPC",
  scale = 1,
  rotation = [0, 0, 0],
  dialogs,
  color = "#D43F3F",
}: NPCProps) => {
  const npcRef = useRef<THREE.Group>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogStep, setDialogStep] = useState<number | null>(0);

  const {
    characterPosition,
    registerNPCInRange,
    unregisterNPCInRange,
    setActiveNPCDialog,
    shadowsEnabled,
  } = useWorld((state: any) => ({
    characterPosition: state.characterPosition,
    registerNPCInRange: state.registerNPCInRange,
    unregisterNPCInRange: state.unregisterNPCInRange,
    setActiveNPCDialog: state.setActiveNPCDialog,
    shadowsEnabled: state.shadowsEnabled,
  }));

  const npcWorldPos = useRef(new THREE.Vector3());
  const handleTalk = () => {
    setDialogStep(0);
    setShowDialog(true);
  };

  useFrame(() => {
    if (!npcRef.current || !characterPosition) return;
    npcRef.current.getWorldPosition(npcWorldPos.current);
    const distance = npcWorldPos.current.distanceTo(characterPosition);
    const inRange = distance < INTERACT_DISTANCE;

    if (inRange) {
      registerNPCInRange(id, npcWorldPos.current.clone(), handleTalk, name);
    } else {
      unregisterNPCInRange(id);
      setShowDialog(false);
      setDialogStep(0); // reset when you walk away
    }
  });
  const handleCloseDialog = () => {
    setShowDialog(false);
    setDialogStep(0);
    setActiveNPCDialog(null);
  };

  const handleOptionClick = (nextStep: number | null) => {
    if (nextStep === null) {
      handleCloseDialog();
    } else {
      setDialogStep(nextStep);
    }
  };

  const currentDialog = dialogStep !== null ? dialogs[dialogStep] : null;

  // Sync dialog to global overlay (fixed at bottom like WelcomeDialog)
  useEffect(() => {
    if (showDialog && currentDialog) {
      setActiveNPCDialog({
        title: name,
        message: currentDialog.message,
        options: currentDialog.options?.map((opt) => ({
          label: opt.label,
          onClick: () => handleOptionClick(opt.next),
        })),
        onClose: handleCloseDialog,
      });
    } else {
      setActiveNPCDialog(null);
    }
    return () => setActiveNPCDialog(null);
  }, [showDialog, currentDialog, name]);

  return (
    <group
      ref={npcRef}
      position={position}
      scale={scale}
      rotation={[
        THREE.MathUtils.degToRad(rotation[0]),
        THREE.MathUtils.degToRad(rotation[1]),
        THREE.MathUtils.degToRad(rotation[2]),
      ]}
    >
      {model ? (
        <Gltf
          src={model}
          castShadow={shadowsEnabled}
          receiveShadow={shadowsEnabled}
        />
      ) : (
        <group>
          <mesh castShadow={shadowsEnabled} position={[0, 0.95, 0]}>
            <capsuleGeometry args={[0.28, 0.8, 8, 16]} />
            <meshStandardMaterial color={color} roughness={0.55} />
          </mesh>
          <mesh castShadow={shadowsEnabled} position={[0, 1.62, 0]}>
            <sphereGeometry args={[0.28, 24, 24]} />
            <meshStandardMaterial color="#f2c4a3" roughness={0.5} />
          </mesh>
          <mesh castShadow={shadowsEnabled} position={[0, 1.9, 0]}>
            <sphereGeometry args={[0.3, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#1f2937" roughness={0.7} />
          </mesh>
        </group>
      )}

    </group>
  );
};
