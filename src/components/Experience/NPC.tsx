import { Gltf, Html } from "@react-three/drei";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useWorld from "../../hooks/useWorld";

type NPCProps = {
  position: [number, number, number];
  model: string;
  name?: string;
  scale?: number | [number, number, number];
  rotation?: [number, number, number]; // degrees (x, y, z)
};

const INTERACT_DISTANCE = 3;

export const NPC = ({
  position,
  model,
  name = "NPC",
  scale = 1,
  rotation = [0, 0, 0], // default
}: NPCProps) => {
  const npcRef = useRef<THREE.Group>(null);
  const [canTalk, setCanTalk] = useState(false);

  const characterPosition = useWorld(
    (state: any) => state.characterPosition
  );

  const npcWorldPos = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!npcRef.current || !characterPosition) return;

    npcRef.current.getWorldPosition(npcWorldPos.current);
    const distance = npcWorldPos.current.distanceTo(characterPosition);
    setCanTalk(distance < INTERACT_DISTANCE);
  });

  const handleTalk = () => {
    alert(`Hello! I am ${name}. Welcome to PUP Lopez Campus.`);
  };

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

      {canTalk && (
        <Html position={[0, 2.2, 0]} center>
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
    </group>
  );
};
