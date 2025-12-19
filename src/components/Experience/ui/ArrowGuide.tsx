import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import useWorld from "../../../hooks/useWorld";

export const ArrowGuide = () => {
  const characterPosition = useWorld((state: any) => state.characterPosition);
  const pinPosition = useWorld((state: any) => state.pinPosition);
  const isPinConfirmed = useWorld((state: any) => state.isPinConfirmed);

  const arrowRef = useRef<THREE.Object3D>(null);

  // Load GLB model
  const { scene: arrowScene } = useGLTF("/models/ArrowGuide.glb");

  useFrame(() => {
    if (!isPinConfirmed || !characterPosition || !pinPosition) return;

    if (arrowRef.current) {
      const start = new THREE.Vector3(characterPosition.x, characterPosition.y + 0, characterPosition.z);
      const end = new THREE.Vector3(pinPosition.x, pinPosition.y, pinPosition.z);
      const dir = new THREE.Vector3().subVectors(end, start);
      const length = dir.length();
      dir.normalize();

      // place arrow at 10% along the line
      arrowRef.current.position.copy(start.clone().add(dir.clone().multiplyScalar(length * 0.05)));

      arrowRef.current.lookAt(end);
    }
  });

  if (!characterPosition || !pinPosition || !isPinConfirmed) return null;

  return (
    <primitive ref={arrowRef} object={arrowScene} />
  );
};
