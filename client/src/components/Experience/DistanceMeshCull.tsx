import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type JSX,
  type ReactNode,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useWorld from "../../hooks/useWorld";

type DistanceMeshCullContextValue = {
  register: (mesh: THREE.Mesh) => () => void;
};

const DistanceMeshCullContext =
  createContext<DistanceMeshCullContextValue | null>(null);

type DistanceMeshCullProviderProps = {
  maxDistance?: number;
  children: ReactNode;
};

function cacheMeshBounds(mesh: THREE.Mesh): THREE.Box3 {
  const geometry = mesh.geometry;
  if (!geometry.boundingBox) {
    geometry.computeBoundingBox();
  }
  return geometry.boundingBox!.clone();
}

export function DistanceMeshCullProvider({
  maxDistance = 80,
  children,
}: DistanceMeshCullProviderProps) {
  const meshes = useRef(new Set<THREE.Mesh>());
  const boundsCache = useRef(new Map<THREE.Mesh, THREE.Box3>());
  const box = useRef(new THREE.Box3());
  const closest = useRef(new THREE.Vector3());
  const characterPosition = useWorld((s) => s.characterPosition);
  const maxDistSq = maxDistance * maxDistance;
  const restoreDistance = maxDistance * 0.95;
  const restoreDistSq = restoreDistance * restoreDistance;

  const register = useCallback((mesh: THREE.Mesh) => {
    meshes.current.add(mesh);
    boundsCache.current.set(mesh, cacheMeshBounds(mesh));
    return () => {
      meshes.current.delete(mesh);
      boundsCache.current.delete(mesh);
    };
  }, []);

  const value = useMemo(() => ({ register }), [register]);

  useFrame(() => {
    if (!characterPosition) return;

    const worldBox = box.current;
    const closestPoint = closest.current;

    for (const mesh of meshes.current) {
      const localBounds = boundsCache.current.get(mesh);
      if (!localBounds) continue;

      worldBox.copy(localBounds).applyMatrix4(mesh.matrixWorld);
      worldBox.clampPoint(characterPosition, closestPoint);
      const distSq = closestPoint.distanceToSquared(characterPosition);

      if (mesh.visible) {
        if (distSq > maxDistSq) {
          mesh.visible = false;
        }
      } else if (distSq < restoreDistSq) {
        mesh.visible = true;
      }
    }
  });

  return (
    <DistanceMeshCullContext.Provider value={value}>
      {children}
    </DistanceMeshCullContext.Provider>
  );
}

export function DistanceCulledMesh(props: JSX.IntrinsicElements["mesh"]) {
  const ctx = useContext(DistanceMeshCullContext);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || !ctx) return;
    return ctx.register(mesh);
  }, [ctx]);

  return <mesh ref={meshRef} {...props} />;
}
