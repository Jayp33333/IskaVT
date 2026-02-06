import { Gltf, Html } from "@react-three/drei";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useWorld from "../../hooks/useWorld";
import { NPCDialog } from "./ui/NPCDialog"; // Your dialog component

type DialogStep = {
  message: string;
  options?: { label: string; next: number | null }[];
};

type NPCProps = {
  position: [number, number, number];
  model: string;
  name?: string;
  scale?: number | [number, number, number];
  rotation?: [number, number, number]; // degrees (x, y, z)
  dialogs: DialogStep[];
};

const INTERACT_DISTANCE = 3;

export const NPC = ({
  position,
  model,
  name = "NPC",
  scale = 1,
  rotation = [0, 0, 0],
  dialogs,
}: NPCProps) => {
  const npcRef = useRef<THREE.Group>(null);
  const [canTalk, setCanTalk] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogStep, setDialogStep] = useState<number | null>(0);

  const { characterPosition, showMiniMap, showLogHistory } = useWorld((state: any) => ({
    characterPosition: state.characterPosition,
    showMiniMap: state.showMiniMap,
    showLogHistory: state.showLogHistory,
  }));

  const npcWorldPos = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!npcRef.current || !characterPosition) return;
    npcRef.current.getWorldPosition(npcWorldPos.current);
    const distance = npcWorldPos.current.distanceTo(characterPosition);
    setCanTalk(distance < INTERACT_DISTANCE);

    if (distance >= INTERACT_DISTANCE) {
      setShowDialog(false);
      setDialogStep(0); // reset when you walk away
    }
  });

  const handleTalk = () => setShowDialog(true);
  const handleCloseDialog = () => {
    setShowDialog(false);
    setDialogStep(0);
  };

  const handleOptionClick = (nextStep: number | null) => {
    if (nextStep === null) {
      handleCloseDialog();
    } else {
      setDialogStep(nextStep);
    }
  };

  const currentDialog = dialogStep !== null ? dialogs[dialogStep] : null;

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
      <Gltf src={model} castShadow receiveShadow />

      {canTalk && !showMiniMap && !showDialog && !showLogHistory && (
        <Html position={[0, 1.2, 0]} center>
          <div
            style={{
              background: "rgba(0,0,0,0.75)",
              padding: "6px 10px",
              borderRadius: "6px",
              color: "#fff",
              fontSize: "13px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            onClick={handleTalk}
          >
            💬 Talk
          </div>
        </Html>
      )}

      {showDialog && currentDialog && (
        <NPCDialog
          open={showDialog}
          title={name}
          message={currentDialog.message}
          options={currentDialog.options?.map((opt) => ({
            label: opt.label,
            onClick: () => handleOptionClick(opt.next),
          }))}
          onClose={handleCloseDialog}
        />
      )}
    </group>
  );
};
