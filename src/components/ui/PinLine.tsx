import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useWorld from "../../hooks/useWorld";

export const PinLine = () => {
  const characterPosition = useWorld((state: any) => state.characterPosition);
  const pinPosition = useWorld((state: any) => state.pinPosition);
  const isPinConfirmed = useWorld((state: any) => state.isPinConfirmed);

  const lineRef = useRef<THREE.Line>(null);

  useFrame(() => {
    if (!isPinConfirmed) return;
    if (lineRef.current && characterPosition && pinPosition) {
      const positions = lineRef.current.geometry.attributes.position.array;
      positions[0] = characterPosition.x;
      positions[1] = characterPosition.y + 0.5; // slight offset above ground
      positions[2] = characterPosition.z;

      positions[3] = pinPosition.x;
      positions[4] = pinPosition.y + 0.5;
      positions[5] = pinPosition.z;

      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!characterPosition || !pinPosition || !isPinConfirmed) return null;

  const points = [
    new THREE.Vector3(
      characterPosition.x,
      characterPosition.y + 0.5,
      characterPosition.z
    ),
    new THREE.Vector3(pinPosition.x, pinPosition.y + 0.5, pinPosition.z),
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const LineBasicMaterial = new THREE.LineBasicMaterial({
    color: "red",
    linewidth: 5,
  });
  const Line = new THREE.Line(geometry, LineBasicMaterial);

  return <primitive object={Line} ref={lineRef} />;
};
