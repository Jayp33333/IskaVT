import { useLayoutEffect, useMemo, useRef } from "react";
import { Html, Line } from "@react-three/drei";
import {
  CAMPUS_NODES,
  getAllCampusNodeEntries,
  getCampusGraphSegments,
  type AnchorNodeId,
} from "../../data/campusGraph";
import useWorld from "../../hooks/useWorld";
import * as THREE from "three";

const GRID_STEP = 1;
const GRID_Y = 0.06;
const GRID_PADDING = 6;

type GridBounds = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

function computeGridBounds(positions: THREE.Vector3[]): GridBounds {
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  for (const pos of positions) {
    minX = Math.min(minX, pos.x);
    maxX = Math.max(maxX, pos.x);
    minZ = Math.min(minZ, pos.z);
    maxZ = Math.max(maxZ, pos.z);
  }

  return {
    minX: Math.floor(minX - GRID_PADDING),
    maxX: Math.ceil(maxX + GRID_PADDING),
    minZ: Math.floor(minZ - GRID_PADDING),
    maxZ: Math.ceil(maxZ + GRID_PADDING),
  };
}

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

function DotGrid({ bounds }: { bounds: GridBounds }) {
  const minorRef = useRef<THREE.InstancedMesh>(null);
  const majorRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { minor, major } = useMemo(() => {
    const minorDots: THREE.Vector3[] = [];
    const majorDots: THREE.Vector3[] = [];

    for (let x = bounds.minX; x <= bounds.maxX; x += GRID_STEP) {
      for (let z = bounds.minZ; z <= bounds.maxZ; z += GRID_STEP) {
        const point = new THREE.Vector3(x, GRID_Y, z);
        if (x % 5 === 0 && z % 5 === 0) {
          majorDots.push(point);
        } else {
          minorDots.push(point);
        }
      }
    }

    return { minor: minorDots, major: majorDots };
  }, [bounds]);

  useLayoutEffect(() => {
    const mesh = minorRef.current;
    if (!mesh || minor.length === 0) return;

    minor.forEach((point, index) => {
      dummy.position.copy(point);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy, minor]);

  useLayoutEffect(() => {
    const mesh = majorRef.current;
    if (!mesh || major.length === 0) return;

    major.forEach((point, index) => {
      dummy.position.copy(point);
      dummy.scale.setScalar(2.2);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy, major]);

  return (
    <group name="campus-graph-dot-grid">
      <instancedMesh
        ref={minorRef}
        args={[undefined, undefined, minor.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.045, 6, 6]} />
        <meshBasicMaterial
          color="#94a3b8"
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      </instancedMesh>

      <instancedMesh
        ref={majorRef}
        args={[undefined, undefined, major.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.045, 6, 6]} />
        <meshBasicMaterial
          color="#475569"
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}

function GridAxes({ bounds }: { bounds: GridBounds }) {
  const y = GRID_Y + 0.02;

  return (
    <group name="campus-graph-axes">
      <Line
        points={[
          new THREE.Vector3(bounds.minX, y, 0),
          new THREE.Vector3(bounds.maxX, y, 0),
        ]}
        color="#ef4444"
        transparent
        opacity={0.45}
      />
      <Line
        points={[
          new THREE.Vector3(0, y, bounds.minZ),
          new THREE.Vector3(0, y, bounds.maxZ),
        ]}
        color="#3b82f6"
        transparent
        opacity={0.45}
      />
    </group>
  );
}

function isAnchorNode(id: string): id is AnchorNodeId {
  return id in CAMPUS_NODES;
}

function NodeMarker({
  id,
  position,
  showNode,
  showLabel,
}: {
  id: string;
  position: THREE.Vector3;
  showNode: boolean;
  showLabel: boolean;
}) {
  const coordLabel = `(${position.x.toFixed(1)}, ${position.y.toFixed(2)}, ${position.z.toFixed(1)})`;
  const anchor = isAnchorNode(id);

  return (
    <group position={position}>
      {showNode && (
        <mesh>
          <sphereGeometry args={[anchor ? 0.35 : 0.22, 12, 12]} />
          <meshBasicMaterial color={anchor ? "#0f172a" : "#38bdf8"} />
        </mesh>
      )}

      {showLabel && (
        <Html position={[0, 0.85, 0]} center distanceFactor={14}>
          <div
            style={{
              pointerEvents: "none",
              whiteSpace: "nowrap",
              fontSize: "10px",
              fontWeight: 600,
              lineHeight: 1.25,
              color: "#0f172a",
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              padding: "3px 6px",
              borderRadius: "4px",
              border: "1px solid rgba(15, 23, 42, 0.15)",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.15)",
              textAlign: "center",
            }}
          >
            <div>{id}</div>
            <div style={{ fontWeight: 500, opacity: 0.75 }}>{coordLabel}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

export function CampusGraphDebug() {
  const showCampusGraph = useWorld((s) => s.showCampusGraph);
  const showCampusGraphLabels = useWorld((s) => s.showCampusGraphLabels);
  const segments = useMemo(() => getCampusGraphSegments(), []);
  const nodes = useMemo(() => getAllCampusNodeEntries(), []);
  const bounds = useMemo(
    () => computeGridBounds(nodes.map(([, position]) => position)),
    [nodes],
  );

  if (
    !import.meta.env.DEV ||
    (!showCampusGraph && !showCampusGraphLabels)
  ) {
    return null;
  }

  return (
    <group name="campus-graph-debug">
      {showCampusGraph && (
        <>
          <DotGrid bounds={bounds} />
          <GridAxes bounds={bounds} />

          {segments.map(([from, to], index) => (
            <GraphEdge key={`edge-${index}`} from={from} to={to} />
          ))}
        </>
      )}

      {nodes.map(([id, position]) => (
        <NodeMarker
          key={id}
          id={id}
          position={position}
          showNode={showCampusGraph}
          showLabel={showCampusGraphLabels}
        />
      ))}
    </group>
  );
}
