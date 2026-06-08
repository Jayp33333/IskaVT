import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { CAMPUS_NODES, getCampusGraphSegments } from "../../data/campusGraph";
import * as THREE from "three";

const SHOW_CAMPUS_GRAPH_DEBUG = import.meta.env.DEV;

function GraphEdge({ from, to }: { from: THREE.Vector3; to: THREE.Vector3 }) {
  return (
    <Line
      points={[from, to]}
      color="#facc15"
      transparent
      opacity={0.55}
    />
  );
}

export function CampusGraphDebug() {
  const segments = useMemo(() => getCampusGraphSegments(), []);
  const nodes = useMemo(() => Object.entries(CAMPUS_NODES), []);

  if (!SHOW_CAMPUS_GRAPH_DEBUG) return null;

  return (
    <group name="campus-graph-debug">
      {segments.map(([from, to], index) => (
        <GraphEdge key={`edge-${index}`} from={from} to={to} />
      ))}

      {nodes.map(([id, position]) => (
        <mesh key={id} position={position}>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
      ))}
    </group>
  );
}
