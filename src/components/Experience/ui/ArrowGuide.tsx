import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import useWorld from "../../../hooks/useWorld";
import { TextureLoader } from "three";

export const ArrowGuide = () => {
  const characterPosition = useWorld((state: any) => state.characterPosition);
  const pinPosition = useWorld((state: any) => state.pinPosition);
  const isPinConfirmed = useWorld((state: any) => state.isPinConfirmed);

  const lineRef = useRef<THREE.Line>(null);
  const arrowRef = useRef<THREE.Mesh>(null);

  const arrowTexture = useLoader(TextureLoader, "/textures/arrow.png");

  useFrame(() => {
    if (!isPinConfirmed || !characterPosition || !pinPosition) return;

    // Update line
    if (lineRef.current) {
      const positions = lineRef.current.geometry.attributes.position.array;
      positions[0] = characterPosition.x;
      positions[1] = characterPosition.y + 0.5;
      positions[2] = characterPosition.z;

      positions[3] = pinPosition.x;
      positions[4] = pinPosition.y + 2;
      positions[5] = pinPosition.z;

      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Update arrow position and rotation
    if (arrowRef.current) {
      const start = new THREE.Vector3(characterPosition.x, characterPosition.y + 0.5, characterPosition.z);
      const end = new THREE.Vector3(pinPosition.x, pinPosition.y + 1.5, pinPosition.z);
      const dir = new THREE.Vector3().subVectors(end, start);
      const length = dir.length();
      dir.normalize();

      // place arrow at 10% along the line
      arrowRef.current.position.copy(start.clone().add(dir.clone().multiplyScalar(length * 0.1)));

      // rotate plane to face the direction
      arrowRef.current.lookAt(end);
      // optional: rotate 90 degrees around X if plane is vertical by default
     arrowRef.current.rotateX(-Math.PI / 2); 
    }
  });

  if (!characterPosition || !pinPosition || !isPinConfirmed) return null;

  // const points = [
  //   new THREE.Vector3(characterPosition.x, characterPosition.y + 0.5, characterPosition.z),
  //   new THREE.Vector3(pinPosition.x, pinPosition.y + 0.5, pinPosition.z),
  // ];

  // const geometry = new THREE.BufferGeometry().setFromPoints(points);
  // const material = new THREE.LineBasicMaterial({ color: "red", linewidth: 5 });
  // const line = new THREE.Line(geometry, material);

  return (
    <>
      {/* <primitive object={line} ref={lineRef} /> */}
      <mesh ref={arrowRef}>
        <planeGeometry args={[1, 2]} /> {/* flat plane for arrow */}
        <meshStandardMaterial map={arrowTexture} transparent />
      </mesh>
    </>
  );
};
