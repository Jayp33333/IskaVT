import { useRef, useEffect } from "react";
import { Gltf } from "@react-three/drei";
import useWorld from "../../hooks/useWorld";
import { ArrowGuide } from "./ui/ArrowGuide";

const Pin = () => {
  const { pinPosition } = useWorld((s: any) => s);
  const pinRef = useRef<any>(null);

  useEffect(() => {
    if (!pinRef.current) return;
    pinRef.current.traverse((child: any) => {
      if (child.isMesh && child.geometry) child.geometry.center();
    });
  }, []);

  return (
    <>
      <Gltf ref={pinRef} src="./models/location.glb" position={[pinPosition.x, 3, pinPosition.z]} scale={0.5} />
      <mesh position={[pinPosition.x, pinPosition.y, pinPosition.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1, 64]} />
        <meshStandardMaterial color="red" transparent opacity={0.5} />
      </mesh>
      <ArrowGuide />
    </>
  );
};

export default Pin;
