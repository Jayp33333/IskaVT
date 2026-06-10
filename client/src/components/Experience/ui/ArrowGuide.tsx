import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useWorld from "../../../hooks/useWorld";
import { resolveGuidePath } from "../../../data/guidePaths";

const FLOW_DOT_COUNT = 7;

function assignTubeGeometry(
  mesh: THREE.Mesh | null,
  geometryRef: React.MutableRefObject<THREE.BufferGeometry | null>,
  curve: THREE.CatmullRomCurve3,
  radius: number,
) {
  if (!mesh) return;

  geometryRef.current?.dispose();
  const tubularSegments = Math.max(16, Math.ceil(curve.getLength() * 3));
  const next = new THREE.TubeGeometry(curve, tubularSegments, radius, 10, false);
  mesh.geometry = next;
  geometryRef.current = next;
}

const GuideLine = () => {
  const guideRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const destinationRingRef = useRef<THREE.Mesh>(null);
  const flowDots = useRef<THREE.Mesh[]>([]);
  const glowGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const coreGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const lastBuiltPathKeyRef = useRef<string | null>(null);

  const dotIndexes = useMemo(
    () => Array.from({ length: FLOW_DOT_COUNT }, (_, index) => index),
    [],
  );

  useEffect(() => {
    return () => {
      glowGeometryRef.current?.dispose();
      coreGeometryRef.current?.dispose();
      lastBuiltPathKeyRef.current = null;
    };
  }, []);

  useFrame(({ clock }) => {
    const {
      characterPosition,
      pinPosition,
      isPinConfirmed,
      selectedDestinationId,
    } = useWorld.getState();
    const guide = guideRef.current;

    if (!guide) return;

    guide.visible = !!characterPosition && !!pinPosition && isPinConfirmed;
    if (!guide.visible || !characterPosition || !pinPosition) {
      lastBuiltPathKeyRef.current = null;
      return;
    }

    const resolved = resolveGuidePath(
      characterPosition,
      pinPosition,
      selectedDestinationId,
    );

    if (!resolved || resolved.length < 0.5) {
      guide.visible = false;
      lastBuiltPathKeyRef.current = null;
      return;
    }

    const { points, curve, pathKey } = resolved;
    if (pathKey !== lastBuiltPathKeyRef.current) {
      assignTubeGeometry(glowRef.current, glowGeometryRef, curve, 0.18);
      assignTubeGeometry(coreRef.current, coreGeometryRef, curve, 0.055);
      lastBuiltPathKeyRef.current = pathKey;
    }

    const elapsed = clock.getElapsedTime();
    flowDots.current.forEach((dot, index) => {
      if (!dot) return;
      const progress = (elapsed * 0.35 + index / FLOW_DOT_COUNT) % 1;
      const easedProgress = 0.06 + progress * 0.88;
      dot.position.copy(curve.getPointAt(easedProgress));
      dot.scale.setScalar(0.75 + Math.sin(elapsed * 5 + index) * 0.15);
    });

    if (destinationRingRef.current) {
      const pulse = 1 + Math.sin(elapsed * 4) * 0.18;
      destinationRingRef.current.position.copy(points[points.length - 1]);
      destinationRingRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={guideRef} visible={false}>
      <mesh ref={glowRef} renderOrder={2}>
        <tubeGeometry args={[new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3(0, 1, 0)), 2, 0.18, 8, false]} />
        <meshBasicMaterial
          color="#38bdf8"
          depthWrite={false}
          transparent
          opacity={0.2}
        />
      </mesh>

      <mesh ref={coreRef} renderOrder={3}>
        <tubeGeometry args={[new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3(0, 1, 0)), 2, 0.055, 8, false]} />
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
