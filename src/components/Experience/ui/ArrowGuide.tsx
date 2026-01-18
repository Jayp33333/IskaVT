import { Suspense, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import useWorld from "../../../hooks/useWorld";

const ArrowModel = () => {
  const characterPosition = useWorld((state: any) => state.characterPosition);
  const pinPosition = useWorld((state: any) => state.pinPosition);
  const isPinConfirmed = useWorld((state: any) => state.isPinConfirmed);

  const arrowRef = useRef<THREE.Object3D>(null);

  // Suspense will wait until the model is loaded
  const { scene: arrowScene } = useGLTF("/models/ArrowGuide.glb") as any;
  const memoizedArrow = useMemo(() => arrowScene.clone(), [arrowScene]);

  useFrame(() => {
    if (!arrowRef.current) return;

    arrowRef.current.visible = !!pinPosition && isPinConfirmed;

    if (!pinPosition || !characterPosition || !isPinConfirmed) return;

    const start = new THREE.Vector3(characterPosition.x, characterPosition.y, characterPosition.z);
    const end = new THREE.Vector3(pinPosition.x, pinPosition.y, pinPosition.z);
    const dir = new THREE.Vector3().subVectors(end, start);
    const length = dir.length();
    dir.normalize();

    // place arrow at 5% along the line
    arrowRef.current.position.copy(start.clone().add(dir.clone().multiplyScalar(length * 0.05)));

    // make arrow face the destination
    arrowRef.current.lookAt(end);
  });

  return <primitive ref={arrowRef} object={memoizedArrow} visible={false} />;
};

// Wrap with Suspense in parent component or in Canvas
export const ArrowGuide = () => {
  return (
    <Suspense fallback={null}>
      <ArrowModel />
    </Suspense>
  );
};
