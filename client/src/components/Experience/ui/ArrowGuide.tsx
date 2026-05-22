import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useWorld from "../../../hooks/useWorld";

const UP_AXIS = new THREE.Vector3(0, 1, 0);
const FLOW_DOT_COUNT = 7;

const GuideLine = () => {
  const guideRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const destinationRingRef = useRef<THREE.Mesh>(null);
  const flowDots = useRef<THREE.Mesh[]>([]);

  const dotIndexes = useMemo(
    () => Array.from({ length: FLOW_DOT_COUNT }, (_, index) => index),
    []
  );

  useFrame(({ clock }) => {
    const { characterPosition, pinPosition, isPinConfirmed } = useWorld.getState();
    const guide = guideRef.current;

    if (!guide) return;

    guide.visible = !!characterPosition && !!pinPosition && isPinConfirmed;
    if (!guide.visible || !characterPosition || !pinPosition) return;

    const start = new THREE.Vector3(characterPosition.x, 0.18, characterPosition.z);
    const end = new THREE.Vector3(pinPosition.x, 0.18, pinPosition.z);
    const direction = end.clone().sub(start);
    const length = direction.length();

    if (length < 0.5) {
      guide.visible = false;
      return;
    }

    direction.normalize();

    const midpoint = start.clone().lerp(end, 0.5);
    const rotation = new THREE.Quaternion().setFromUnitVectors(UP_AXIS, direction);

    for (const mesh of [glowRef.current, coreRef.current]) {
      if (!mesh) continue;
      mesh.position.copy(midpoint);
      mesh.quaternion.copy(rotation);
      mesh.scale.set(1, length, 1);
    }

    const elapsed = clock.getElapsedTime();
    flowDots.current.forEach((dot, index) => {
      if (!dot) return;
      const progress = (elapsed * 0.45 + index / FLOW_DOT_COUNT) % 1;
      const easedProgress = 0.08 + progress * 0.84;
      dot.position.copy(start).add(direction.clone().multiplyScalar(length * easedProgress));
      dot.scale.setScalar(0.75 + Math.sin(elapsed * 5 + index) * 0.15);
    });

    if (destinationRingRef.current) {
      const pulse = 1 + Math.sin(elapsed * 4) * 0.18;
      destinationRingRef.current.position.copy(end);
      destinationRingRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={guideRef} visible={false}>
      <mesh ref={glowRef} renderOrder={2}>
        <cylinderGeometry args={[0.18, 0.18, 1, 16]} />
        <meshBasicMaterial
          color="#38bdf8"
          depthWrite={false}
          transparent
          opacity={0.2}
        />
      </mesh>

      <mesh ref={coreRef} renderOrder={3}>
        <cylinderGeometry args={[0.055, 0.055, 1, 12]} />
        <meshBasicMaterial
          color="#67e8f9"
          depthWrite={false}
          transparent
          opacity={0.85}
        />
      </mesh>

      {dotIndexes.map((index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            if (mesh) flowDots.current[index] = mesh;
          }}
          renderOrder={4}
        >
          <sphereGeometry args={[0.23, 16, 16]} />
          <meshBasicMaterial
            color="#ecfeff"
            depthWrite={false}
            transparent
            opacity={0.95}
          />
        </mesh>
      ))}

      <mesh ref={destinationRingRef} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
        <torusGeometry args={[1.15, 0.08, 10, 48]} />
        <meshBasicMaterial
          color="#22d3ee"
          depthWrite={false}
          transparent
          opacity={0.75}
        />
      </mesh>
    </group>
  );
};

export const ArrowGuide = () => {
  return <GuideLine />;
};
