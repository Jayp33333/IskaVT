import { useRef } from "react";
import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GOLD = "#f5c84c";
const GOLD_CORE = "#fff6c8";
const BEAM_COLOR = "#fff8dc";

type WaypointMarkerProps = {
  position: THREE.Vector3;
};

export function WaypointMarker({ position }: WaypointMarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const diamondRef = useRef<THREE.Group>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const bob = Math.sin(t * 2.8) * 0.1;

    if (diamondRef.current) {
      diamondRef.current.position.y = 2.75 + bob;
    }

    [ringARef, ringBRef].forEach((ref, index) => {
      const mesh = ref.current;
      if (!mesh) return;

      const phase = (t * 0.9 + index * 0.75) % 1.6;
      const progress = phase / 1.6;
      mesh.scale.setScalar(0.55 + progress * 1.65);
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = 0.55 * (1 - progress);
    });
  });

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      name="waypoint-marker"
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} renderOrder={5}>
        <circleGeometry args={[0.28, 32]} />
        <meshBasicMaterial
          color={GOLD}
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={ringARef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.04, 0]}
        renderOrder={4}
      >
        <ringGeometry args={[0.32, 0.46, 48]} />
        <meshBasicMaterial
          color={GOLD}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={ringBRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.04, 0]}
        renderOrder={4}
      >
        <ringGeometry args={[0.32, 0.46, 48]} />
        <meshBasicMaterial
          color={GOLD_CORE}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 1.35, 0]} renderOrder={3}>
        <cylinderGeometry args={[0.03, 0.16, 2.7, 16, 1, true]} />
        <meshBasicMaterial
          color={BEAM_COLOR}
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 1.35, 0]} renderOrder={2}>
        <cylinderGeometry args={[0.01, 0.05, 2.7, 8, 1, true]} />
        <meshBasicMaterial
          color={GOLD_CORE}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <group ref={diamondRef} position={[0, 2.75, 0]}>
        <Billboard follow lockX={false} lockY={false} lockZ={false}>
          <group rotation={[0, 0, Math.PI / 4]} scale={[1, 1.35, 1]}>
            <mesh renderOrder={6}>
              <planeGeometry args={[0.95, 0.95]} />
              <meshBasicMaterial
                color={GOLD}
                transparent
                opacity={0.92}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            <mesh scale={0.55} renderOrder={7}>
              <planeGeometry args={[0.95, 0.95]} />
              <meshBasicMaterial
                color={GOLD_CORE}
                transparent
                opacity={0.95}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </group>
        </Billboard>
      </group>
    </group>
  );
}
