import * as THREE from "three";

export type CampusNodeId = keyof typeof CAMPUS_NODES;

/** Walkable junctions merged from all campus routes (gate, comlabs, field, gym). */
export const CAMPUS_NODES = {
  "main-gate": new THREE.Vector3(10, 0.18, 2),
  "gate-yumul": new THREE.Vector3(11, 0.18, -6.3),
  "comlab-1": new THREE.Vector3(4, 0.18, -12.5),
  "comlab-2-mid": new THREE.Vector3(13, 0.18, -15),
  "comlab-2": new THREE.Vector3(16, 0.18, -26),
  "bridge-west-lower-right-ramp": new THREE.Vector3(16, 0.18, -50),
  "bridge-west-upper-right-ramp": new THREE.Vector3(7, 1.24, -52.5),
  "bridge-west-upper-left-ramp": new THREE.Vector3(-0.13, 1.24, -54),
  "bridge-west-lower-left-ramp": new THREE.Vector3(-6.3, 0.3, -55),
  "canteen-north-hallway": new THREE.Vector3(-0.3, 0.3, -94),
  "canteen-mid-hallway": new THREE.Vector3(-5.2, 0.3, -72),
  "canteen-south-hallway": new THREE.Vector3(-8, 0.3, -60),
  "grandstand-approach": new THREE.Vector3(6, 0.18, -104),
  "grandstand-ramp": new THREE.Vector3(6, 2.5, -107),
  "field-east-1": new THREE.Vector3(15, 0.18, -100),
  "field-east-2": new THREE.Vector3(32, 0.18, -100),
  "field-east-3": new THREE.Vector3(32, 0.18, -118),
  "gym-approach": new THREE.Vector3(38, 0.18, -145),
  "bridge-east-lower-right-ramp": new THREE.Vector3(30.5, 0.2, -75),
  "bridge-east-upper-right-ramp": new THREE.Vector3(31.3, 1.2, -81.8),
  "bridge-east-upper-left-ramp": new THREE.Vector3(31.5, 1.3, -87),
  "bridge-east-lower-left-ramp": new THREE.Vector3(31.8, 0.2, -93.4),
  "field-south-1": new THREE.Vector3(19, 0.18, -33.3),
  "field-south-2": new THREE.Vector3(23.4, 0.18, -46.5),
  "field-south-3": new THREE.Vector3(26.4, 0.18, -58.7),
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
connectChain([
  "main-gate",
  "gate-yumul",
  "comlab-2-mid",
  "comlab-2",
  "bridge-west-lower-right-ramp",
]);
connectChain([
  "bridge-west-lower-right-ramp",
  "bridge-west-upper-right-ramp",
  "bridge-west-upper-left-ramp",
  "bridge-west-lower-left-ramp",
]);
connectChain([
  "bridge-west-lower-left-ramp",
  "canteen-south-hallway",
  "canteen-mid-hallway",
  "canteen-north-hallway",
  "grandstand-approach",
  "grandstand-ramp",
]);


// Gate → gym
connectChain(["field-east-1", "field-east-2", "field-east-3", "gym-approach"]);
connectChain([
  "field-south-1",
  "field-south-2",
  "field-south-3",
  "bridge-east-lower-right-ramp",
  "bridge-east-upper-right-ramp",
  "bridge-east-upper-left-ramp",
  "bridge-east-lower-left-ramp",
  "field-east-2",
]);

// Cross-links between parallel routes
addEdge("bridge-west-lower-right-ramp", "bridge-west-upper-right-ramp");
addEdge("grandstand-approach", "field-east-1");
addEdge("comlab-2", "field-south-1");

export type CampusPathResult = {
  nodeIds: CampusNodeId[];
  graphDistance: number;
  totalDistance: number;
};

/** Line segments for dev visualization of walkable edges. */
export function getCampusGraphSegments(): [THREE.Vector3, THREE.Vector3][] {
  const segments: [THREE.Vector3, THREE.Vector3][] = [];
  const seen = new Set<string>();

  for (const from of nodeIds) {
    for (const edge of adjacency.get(from) ?? []) {
      const key = [from, edge.to].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      segments.push([
        CAMPUS_NODES[from].clone(),
        CAMPUS_NODES[edge.to].clone(),
      ]);
    }
  }

  return segments;
}

function nearestNode(pos: THREE.Vector3): CampusNodeId {
  let bestId = nodeIds[0];
  let bestDist = Infinity;

  for (const id of nodeIds) {
    const dist = pos.distanceTo(CAMPUS_NODES[id]);
    if (dist < bestDist) {
      bestDist = dist;
      bestId = id;
    }
  }

  return bestId;
}

function runDijkstra(source: CampusNodeId) {
  const dist = new Map<CampusNodeId, number>();
  const prev = new Map<CampusNodeId, CampusNodeId | null>();

  for (const id of nodeIds) {
    dist.set(id, Infinity);
    prev.set(id, null);
  }

  dist.set(source, 0);
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

  return { dist, prev };
}

function trimPassedNodes(
  start: THREE.Vector3,
  ids: CampusNodeId[],
): CampusNodeId[] {
  if (ids.length === 0) return [];

  let nearestIdx = 0;
  let nearestDist = Infinity;

  for (let i = 0; i < ids.length; i++) {
    const dist = start.distanceTo(CAMPUS_NODES[ids[i]]);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearestIdx = i;
    }
  }

  return ids.slice(nearestIdx);
}

/**
 * Shortest walkable route along graph edges only.
 * Player snaps to the nearest node, walks the graph, then hops to the pin.
 */
export function findShortestCampusPath(
  start: THREE.Vector3,
  goal: THREE.Vector3,
  preferredGoalNode?: CampusNodeId,
): CampusPathResult | null {
  const startNode = nearestNode(start);
  const goalNode = preferredGoalNode ?? nearestNode(goal);
  const { dist, prev } = runDijkstra(startNode);
  const graphDistance = dist.get(goalNode) ?? Infinity;

  if (!Number.isFinite(graphDistance)) {
    return null;
  }

  const path: CampusNodeId[] = [];
  let cursor: CampusNodeId | null = goalNode;

  while (cursor !== null) {
    path.unshift(cursor);
    cursor = prev.get(cursor) ?? null;
  }

  const totalDistance =
    start.distanceTo(CAMPUS_NODES[startNode]) +
    graphDistance +
    CAMPUS_NODES[goalNode].distanceTo(goal);

  return {
    nodeIds: trimPassedNodes(start, path),
    graphDistance,
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

  points.push(goal.clone());

  return points;
}
