import * as THREE from "three";

export type CampusNodeId = keyof typeof CAMPUS_NODES;

/** Walkable junctions merged from all campus routes (gate, comlabs, field, gym). */
export const CAMPUS_NODES = {
  "main-gate": new THREE.Vector3(10, 0.18, 2),
  "gate-yumul": new THREE.Vector3(8, 0.18, -4),
  "comlab-1": new THREE.Vector3(5, 0.18, -8),
  "comlab-2-mid": new THREE.Vector3(12, 0.18, -15),
  "comlab-2": new THREE.Vector3(14, 0.18, -22),
  "inner-south": new THREE.Vector3(8, 0.18, -18),
  "south-corridor": new THREE.Vector3(16, 0.18, -28),
  "south-mid": new THREE.Vector3(16, 0.18, -50),
  "ramp-west": new THREE.Vector3(7, 1.24, -52.5),
  "ramp-center": new THREE.Vector3(-2, 1.24, -54),
  "ramp-east": new THREE.Vector3(-8.5, 0.3, -58),
  "canteen-edge": new THREE.Vector3(6, 0.18, -55),
  "canteen-field": new THREE.Vector3(7, 0.18, -88),
  "field-west": new THREE.Vector3(-1, 0.3, -94),
  "grandstand-approach": new THREE.Vector3(6, 0.18, -104),
  "grandstand-ramp": new THREE.Vector3(6, 2.5, -107),
  "field-east-1": new THREE.Vector3(15, 0.18, -100),
  "field-east-2": new THREE.Vector3(32, 0.18, -118),
  "gym-approach": new THREE.Vector3(38, 0.18, -145),
} as const;

/** Preferred graph anchors for known destinations (sampleData ids). */
export const DESTINATION_NODES: Partial<Record<string, CampusNodeId>> = {
  grandstand: "grandstand-ramp",
  gymnasium: "gym-approach",
  "room-103": "comlab-1",
  "room-104": "comlab-2",
};

type GraphEdge = { to: CampusNodeId; cost: number };

const nodeIds = Object.keys(CAMPUS_NODES) as CampusNodeId[];
const adjacency = new Map<CampusNodeId, GraphEdge[]>();

function edgeCost(from: CampusNodeId, to: CampusNodeId): number {
  return CAMPUS_NODES[from].distanceTo(CAMPUS_NODES[to]);
}

function addEdge(from: CampusNodeId, to: CampusNodeId) {
  if (from === to) return;

  const cost = edgeCost(from, to);
  const fromEdges = adjacency.get(from) ?? [];
  if (!fromEdges.some((edge) => edge.to === to)) {
    fromEdges.push({ to, cost });
    adjacency.set(from, fromEdges);
  }

  const toEdges = adjacency.get(to) ?? [];
  if (!toEdges.some((edge) => edge.to === from)) {
    toEdges.push({ to: from, cost });
    adjacency.set(to, toEdges);
  }
}

function connectChain(chain: CampusNodeId[]) {
  for (let i = 0; i < chain.length - 1; i++) {
    addEdge(chain[i], chain[i + 1]);
  }
}

// Gate → comlabs
connectChain(["main-gate", "gate-yumul", "comlab-1"]);
connectChain(["comlab-1", "comlab-2-mid", "comlab-2"]);

// Gate → inner campus → south corridor / grandstand ramp
connectChain(["main-gate", "inner-south", "south-corridor", "south-mid"]);
connectChain(["south-mid", "ramp-west", "ramp-center", "ramp-east"]);
connectChain(["ramp-east", "field-west", "grandstand-approach", "grandstand-ramp"]);

// Gate → canteen → field → gym
connectChain(["inner-south", "canteen-edge", "canteen-field"]);
connectChain(["canteen-field", "field-east-1", "field-east-2", "gym-approach"]);

// Cross-links between parallel routes
addEdge("gate-yumul", "inner-south");
addEdge("south-mid", "canteen-edge");
addEdge("canteen-field", "field-west");
addEdge("grandstand-approach", "field-east-1");

export type CampusPathResult = {
  nodeIds: CampusNodeId[];
  graphDistance: number;
  totalDistance: number;
};

/**
 * Shortest walkable route using multi-source Dijkstra from the player position.
 * Any node can be reached directly from the player; the best goal node minimizes
 * graph cost plus the final hop to the pin.
 */
export function findShortestCampusPath(
  start: THREE.Vector3,
  goal: THREE.Vector3,
  preferredGoalNode?: CampusNodeId,
): CampusPathResult | null {
  const dist = new Map<CampusNodeId, number>();
  const prev = new Map<CampusNodeId, CampusNodeId | null>();

  for (const id of nodeIds) {
    dist.set(id, start.distanceTo(CAMPUS_NODES[id]));
    prev.set(id, null);
  }

  const visited = new Set<CampusNodeId>();

  while (visited.size < nodeIds.length) {
    let current: CampusNodeId | null = null;
    let best = Infinity;

    for (const id of nodeIds) {
      if (visited.has(id)) continue;
      const d = dist.get(id) ?? Infinity;
      if (d < best) {
        best = d;
        current = id;
      }
    }

    if (current === null || best === Infinity) break;
    visited.add(current);

    for (const edge of adjacency.get(current) ?? []) {
      const alt = best + edge.cost;
      if (alt < (dist.get(edge.to) ?? Infinity)) {
        dist.set(edge.to, alt);
        prev.set(edge.to, current);
      }
    }
  }

  let goalNode: CampusNodeId | null = preferredGoalNode ?? null;
  let totalDistance = Infinity;

  const candidates = preferredGoalNode ? [preferredGoalNode, ...nodeIds] : nodeIds;

  for (const id of candidates) {
    const graphDistance = dist.get(id) ?? Infinity;
    if (!Number.isFinite(graphDistance)) continue;

    const total = graphDistance + CAMPUS_NODES[id].distanceTo(goal);
    if (total < totalDistance) {
      totalDistance = total;
      goalNode = id;
    }
  }

  if (goalNode === null || !Number.isFinite(totalDistance)) {
    return null;
  }

  const path: CampusNodeId[] = [];
  let cursor: CampusNodeId | null = goalNode;

  while (cursor !== null) {
    path.unshift(cursor);
    cursor = prev.get(cursor) ?? null;
  }

  return {
    nodeIds: path,
    graphDistance: dist.get(goalNode) ?? 0,
    totalDistance,
  };
}

export function campusPathToPoints(
  start: THREE.Vector3,
  goal: THREE.Vector3,
  path: CampusPathResult,
): THREE.Vector3[] {
  const points = [start.clone()];

  for (const id of path.nodeIds) {
    points.push(CAMPUS_NODES[id].clone());
  }

  points.push(
    new THREE.Vector3(goal.x, goal.y, goal.z),
  );

  return points;
}
