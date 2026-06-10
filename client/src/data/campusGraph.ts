import * as THREE from "three";

/** Hand-placed walkable junctions — edit these while tuning routes. */
export const CAMPUS_NODES = {
  "main-gate": new THREE.Vector3(10, 0.18, 2),
  "gate-yumul": new THREE.Vector3(11, 0.18, -6.3),
  "comlab-1": new THREE.Vector3(4, 0.2, -12.5),
  "comlab-walkway-1": new THREE.Vector3(2.4, 0.3, -17.5),
  "comlab-walkway-2": new THREE.Vector3(2, 0.3, -25.6),
  "comlab-walkway-3": new THREE.Vector3(2.3, 0.3, -37),
  "comlab-walkway-4": new THREE.Vector3(8.3, 0.3, -36.5),
  "covered-bridge-lower-left-ramp1": new THREE.Vector3(8, 0.4, -43),
  "covered-bridge-upper-left-ramp1": new THREE.Vector3(5.36, 1, -43.5),
  "covered-bridge-upper-right-ramp1": new THREE.Vector3(-2.33, 1, -45.4),
  "covered-bridge-lower-right-ramp1": new THREE.Vector3(-5, 0.3, -46),
  "comlab-2-mid": new THREE.Vector3(13, 0.18, -15),
  "comlab-2": new THREE.Vector3(16, 0.18, -26),
  "bridge-west-lower-right-ramp": new THREE.Vector3(16, 0.18, -50),
  "bridge-west-upper-right-ramp": new THREE.Vector3(7, 1.24, -52.5),
  "bridge-west-upper-left-ramp": new THREE.Vector3(-0.13, 1.24, -54),
  "bridge-west-lower-left-ramp": new THREE.Vector3(-6.3, 0.3, -55),
  "hs-hallway-1": new THREE.Vector3(-15.4, 0.3, -56.5),
  "hs-hallway-2": new THREE.Vector3(-23.5, 0.3, -64.66),
  "hs-hallway-3": new THREE.Vector3(-34.4, 0.3, -75),
  "hs-hallway-4": new THREE.Vector3(-43, 0.3, -83.2),
  "hs-hallway-5": new THREE.Vector3(-45.61, 0.5, -86.0),
  "hs-lower-left-ramp": new THREE.Vector3(-18.2, 0.3, -53.3),
  "hs-top-left-ramp": new THREE.Vector3(-14.3, 0.7, -49.5),
  "hs-lower-left-stair-ramp": new THREE.Vector3(-16.2, 0.7, -48),
  "hs-mid1-left-stair-ramp": new THREE.Vector3(-19.8, 2.8, -44),
  "hs-mid2-left-stair-ramp": new THREE.Vector3(-20.7, 2.8, -45.4),
  "hs-top-left-stair-ramp": new THREE.Vector3(-18, 4.5, -48.2),
  "room-203": new THREE.Vector3(-20.5, 4.5, -52),
  "room-204": new THREE.Vector3(-28, 4.5, -59),
  "room-205": new THREE.Vector3(-35.2, 4.5, -66.4),
  "room-206": new THREE.Vector3(-42.38, 4.5, -73.43),
  "hs-top-right-stair-ramp": new THREE.Vector3(-50.94, 4.5, -80.47),
  "hs-mid2-right-stair-ramp": new THREE.Vector3(-54.16, 2.78, -77.21),
  "hs-mid1-right-stair-ramp": new THREE.Vector3(-55.34, 2.78, -78.6),
  "room-105": new THREE.Vector3(-20.5, 0.7, -52),
  "room-106": new THREE.Vector3(-27.6, 0.7, -59),
  "hs-building": new THREE.Vector3(-38, 0.5, -72.4),
  "room-107-mid-108": new THREE.Vector3(-39.5, 0.7, -70.3),
  "room-107": new THREE.Vector3(-35, 0.7, -66.3),
  "room-108": new THREE.Vector3(-42.3, 0.7, -73.5),
  "hs-lower-right-stair-ramp": new THREE.Vector3(-51.8, 0.7, -82.3),
  "hs-top-right-ramp": new THREE.Vector3(-50, 0.7, -84),
  "hs-lower-right-ramp": new THREE.Vector3(-46.5, 0.7, -80.5),
  "grandstand-approach": new THREE.Vector3(6, 0.18, -104),
  "grandstand-ramp": new THREE.Vector3(6, 2.5, -107),
  "field-east-0": new THREE.Vector3(6.04, 0.4, -101.31),
  "field-east-1": new THREE.Vector3(16.04, 0.4, -102.07),
  "field-east-2": new THREE.Vector3(32.09, 0.4, -102.68),
  "field-east-3": new THREE.Vector3(32.0, 0.29, -110.3),
  "field-east-4": new THREE.Vector3(32, 0.18, -118),
  "field-east-5": new THREE.Vector3(31.87, 0.4, -127.78),
  "nantes-building": new THREE.Vector3(31.5, 0.4, -137.54),
  "gym-approach": new THREE.Vector3(38, 0.18, -145),
  "bridge-east-lower-right-ramp": new THREE.Vector3(30.5, 0.2, -75),
  "bridge-east-upper-right-ramp": new THREE.Vector3(31.3, 1.2, -81.8),
  "bridge-east-upper-left-ramp": new THREE.Vector3(31.5, 1.3, -87),
  "bridge-east-lower-left-ramp": new THREE.Vector3(31.8, 0.2, -93.4),
  "field-south-1": new THREE.Vector3(19, 0.18, -33.3),
  "field-south-2": new THREE.Vector3(23.4, 0.18, -46.5),
  "field-south-3": new THREE.Vector3(26.4, 0.18, -58.7),
  "field-mid-south": new THREE.Vector3(27.5, 0.18, -34.3),
  "yumul-building": new THREE.Vector3(36.7, 0.18, -34.4),
  "admin-building": new THREE.Vector3(15, 0.29, -6),
  "accounting-office": new THREE.Vector3(19.1, 0.29, -5.5),
  "cashier's-office": new THREE.Vector3(27.6, 0.29, -5.1),
  "registrar's-office": new THREE.Vector3(29.4, 0.29, -4.8),
  "admission-office": new THREE.Vector3(39.7, 0.29, -4.1),
  "admin-stairs-left-ramp-bottom": new THREE.Vector3(51.8, 0.52, -3.5),
  "admin-stairs-left-ramp-top": new THREE.Vector3(52, 4, 4.4),
  "admin-left-way-1": new THREE.Vector3(49.4, 4, 4.4),
  "admin-left-way-2": new THREE.Vector3(49.9, 4, -3.72),
  "ojt-coordinator-office": new THREE.Vector3(39.74, 4, -4.26),
  "director office": new THREE.Vector3(29.4, 4, -4.9),
  OSAS: new THREE.Vector3(19.2, 4, -5.5),
  "admin-right-way-2": new THREE.Vector3(17, 4, -5.4),
  "admin-right-way-1": new THREE.Vector3(16.7, 4, 2.7),
  "admin-stairs-right-ramp-top": new THREE.Vector3(14.5, 4, 2.6),
  "engineering-doorway-bench": new THREE.Vector3(-51.29, 0.4, -86.58),
  "engineering-lower-left-stair": new THREE.Vector3(-48.31, 0.4, -88.2),
  "engineering-top-left-stair": new THREE.Vector3(-48.59, 4.16, -92.56),
  "engineering-left-extended-stair": new THREE.Vector3(-50.89, 4.08, -92.6),
  "room-207": new THREE.Vector3(-50.59, 4.08, -89.5),
  "room-208": new THREE.Vector3(-51.2, 4.08, -99.01),
  "engineering-office1": new THREE.Vector3(-51.87, 4.08, -115.22),
  "engineering-office2": new THREE.Vector3(-52.28, 4.08, -124.4),
  "engineering-mid-extended-stair": new THREE.Vector3(-52.4, 4.08, -127.08),
  "room-209": new THREE.Vector3(-52.6, 4.08, -130.98),
  "engineering-unknown-room": new THREE.Vector3(-53.07, 4.08, -140.21),
  "room-210": new THREE.Vector3(-53.36, 4.08, -149.67),
  "room-211": new THREE.Vector3(-54.15, 4.08, -163.58),
  "engineering-end-node": new THREE.Vector3(-54.43, 0.54, -172.83),
  "engineering-right-extended-stair": new THREE.Vector3(-54.28, 4.08, -170.34),
  "engineering-top-right-stair": new THREE.Vector3(-52.04, 4.16, -170.3),
  "engineering-lower-right-stair": new THREE.Vector3(-52.14, 0.4, -174.7),
  "engineering-lower-mid-stair": new THREE.Vector3(-52.41, 0.54, -128.88),
  "engineering-mid1-mid-stair": new THREE.Vector3(-59.52, 3.29, -128.73),
  "engineering-mid2-mid-stair": new THREE.Vector3(-59.47, 3.29, -126.39),
  "room-109": new THREE.Vector3(-50.84, 0.54, -89.86),
  "room-110": new THREE.Vector3(-50.96, 0.54, -98.93),
  "room-111": new THREE.Vector3(-51.53, 0.54, -108.1),
  "room-112": new THREE.Vector3(-51.99, 0.54, -117.26),
  "room-113": new THREE.Vector3(-52.53, 0.54, -131.12),
  "room-114": new THREE.Vector3(-53.02, 0.54, -140.49),
  "room-115": new THREE.Vector3(-53.69, 0.54, -149.62),
  "room-116": new THREE.Vector3(-54.29, 0.54, -163.49),
  "engineering-walkway1": new THREE.Vector3(-47.11, 0.5, -99.06),
  "engineering-walkway2": new THREE.Vector3(-47.5, 0.5, -108.34),
  "engineering-walkway3": new THREE.Vector3(-47.84, 0.5, -115.09),
  "engineering-walkway4": new THREE.Vector3(-48.49, 0.5, -128.38),
  "engineering-walkway5": new THREE.Vector3(-49.06, 0.5, -140.61),
  "engineering-walkway6": new THREE.Vector3(-49.3, 0.5, -149.42),
  "engineering-walkway7": new THREE.Vector3(-49.95, 0.5, -163.52),
  "engineering-walkway8": new THREE.Vector3(-50.38, 0.5, -172.86),
  "dirt-walkway1": new THREE.Vector3(-44.62, 0.4, -182.4),
  "dirt-walkway2": new THREE.Vector3(-39.77, 0.4, -191.31),
  "dirt-walkway3": new THREE.Vector3(-34.63, 0.4, -201.08),
  "educ-lower-left-ramp": new THREE.Vector3(-28.98, 0.4, -205.81),
  "educ-top-left-ramp": new THREE.Vector3(-32.69, 0.82, -208.95),
  "educ-lower-left-stair": new THREE.Vector3(-30.9, 0.82, -211.31),
  "educ-mid1-left-stair": new THREE.Vector3(-28.43, 2.78, -214.88),
  "educ-mid2-left-stair": new THREE.Vector3(-26.97, 2.78, -213.92),
  "educ-top-left-stair": new THREE.Vector3(-29.57, 4.5, -210.54),
  "room-212": new THREE.Vector3(-26.62, 4.5, -207.1),
  "room-213": new THREE.Vector3(-18.33, 4.5, -200.87),
  "guidance-councelor-office": new THREE.Vector3(-8.53, 4.5, -193.82),
  "room-214": new THREE.Vector3(-5.9, 4.5, -191.78),
  "room-215": new THREE.Vector3(2.25, 4.5, -185.64),
  "educ-top-right-stair": new THREE.Vector3(11.87, 4.5, -179.84),
  "educ-mid2-right-stair": new THREE.Vector3(14.26, 2.78, -183.36),
  "educ-mid1-right-stair": new THREE.Vector3(15.53, 2.78, -182.16),
  "educ-lower-right-stair": new THREE.Vector3(13.13, 0.82, -178.71),
  "quality-assurance-office": new THREE.Vector3(2.5, 0.82, -185.76),
  "room-119": new THREE.Vector3(-5.78, 0.82, -191.96),
  csc: new THREE.Vector3(-8.71, 0.82, -194.19),
  "room-118": new THREE.Vector3(-18.31, 0.82, -201.18),
  "room-117": new THREE.Vector3(-26.73, 0.82, -207.15),
  "educ-top-right-ramp": new THREE.Vector3(11.37, 0.82, -176.26),
  "educ-lower-right-ramp": new THREE.Vector3(7.42, 0.4, -179.16),
  "educ-walkway1": new THREE.Vector3(6.29, 0.4, -177.47),
  "educ-walkway2": new THREE.Vector3(0.16, 0.4, -182.77),
  "educ-walkway3": new THREE.Vector3(-8.07, 0.4, -188.98),
  "educ-walkway4": new THREE.Vector3(-15.85, 0.4, -194.41),
  "educ-mid-extended": new THREE.Vector3(-13.81, 0.82, -197.7),
  "educ-walkway5": new THREE.Vector3(-24.39, 0.4, -200.88),
  "north-center-field": new THREE.Vector3(13.49, 0.4, -172.59),
  "eco-park": new THREE.Vector3(9.87, 0.4, -171.91),
  "nantes-back-waywalk1": new THREE.Vector3(14.28, 0.4, -167.33),
  "nantes-back-waywalk2": new THREE.Vector3(14.49, 0.4, -159.33),
  "nantes-back-waywalk3": new THREE.Vector3(14.74, 0.4, -151.14),
  "nantes-back-waywalk4": new THREE.Vector3(15.25, 0.4, -140.82),
  "nantes-back-waywalk5": new THREE.Vector3(15.25, 0.4, -132.5),
  "unknown-office": new THREE.Vector3(15.57, 0.4, -119.47),
  "rotc-office": new THREE.Vector3(15.65, 0.4, -111.99),
  "nantes-back-waywalk6": new THREE.Vector3(15.95, 0.4, -104.63),
  "grandstand-ramp1": new THREE.Vector3(14.47, 0.4, -104.61),
  "grandstand-ramp2": new THREE.Vector3(8.57, 1.06, -104.51),
  "grandstand-ramp3": new THREE.Vector3(8.4, 1.06, -106.0),
  "grandstand-ramp4": new THREE.Vector3(13.94, 1.72, -105.87),
  "grandstand-ramp5": new THREE.Vector3(14.11, 1.72, -107.36),
  "grandstand-right-extended": new THREE.Vector3(6.2, 2.39, -112.09),
  grandstand: new THREE.Vector3(6.0, 2.39, -118.4),
  "grandstand-left-extended": new THREE.Vector3(5.73, 2.39, -124.8),
  "grandstand-top-left-stair": new THREE.Vector3(5.24, 2.39, -128.95),
  "grandstand-lower-left-stair": new THREE.Vector3(5.05, 0.4, -131.95),
  "covered-hallway1": new THREE.Vector3(26.58, 0.5, -102.47),
  "covered-hallway2": new THREE.Vector3(26.38, 0.5, -97.1),
  "covered-hallway3": new THREE.Vector3(26.08, 0.5, -91.71),
  "covered-hallway4": new THREE.Vector3(19.43, 0.5, -92.3),
  "covered-hallway5": new THREE.Vector3(12.68, 0.5, -93.09),
  "covered-hallway6": new THREE.Vector3(8.04, 0.5, -93.64),
  "new-canteen": new THREE.Vector3(4.17, 0.5, -94.49),
  "covered-hallway7": new THREE.Vector3(-0.03, 0.5, -95.46),
  "covered-hallway8": new THREE.Vector3(-1.65, 0.5, -88.49),
  "covered-hallway9": new THREE.Vector3(-2.99, 0.5, -82.5),
  "covered-hallway10": new THREE.Vector3(-4.19, 0.5, -76.92),
  "covered-hallway11": new THREE.Vector3(-5.53, 0.5, -71.04),
  "covered-hallway12": new THREE.Vector3(-6.86, 0.5, -65.42),
  "covered-hallway13": new THREE.Vector3(-8, 0.3, -60),
  "room-120": new THREE.Vector3(26.27, 0.82, -105.8),
  "room-121": new THREE.Vector3(25.95, 0.82, -115.8),
  "room-122": new THREE.Vector3(25.71, 0.82, -125.48),
  "faculty-room": new THREE.Vector3(25.42, 0.82, -140.99),
  "medical-room": new THREE.Vector3(24.84, 0.82, -150.7),
  "nantes-ramp1": new THREE.Vector3(24.62, 0.82, -160.67),
  "nantes-ramp2": new THREE.Vector3(16.95, 2.01, -160.43),
  "nantes-ramp3": new THREE.Vector3(16.68, 3.19, -168.34),
  "nantes-ramp4": new THREE.Vector3(24.39, 4.38, -168.35),
  "dental-clinic": new THREE.Vector3(24.8, 4.38, -166.53),
  library: new THREE.Vector3(25.18, 4.38, -150.67),
  "room-218": new THREE.Vector3(25.77, 4.38, -125.69),
  "room-217": new THREE.Vector3(25.93, 4.38, -115.51),
  "room-216": new THREE.Vector3(26.11, 4.38, -105.64),
  "nantes-top-left-stair": new THREE.Vector3(25.98, 4.38, -103.71),
  "nantes-lower-left-stair": new THREE.Vector3(20.61, 0.4, -103.91),
  "nantes-lower-left-stair-extended": new THREE.Vector3(20.51, 0.4, -102.19),
  "nantes-entrance": new THREE.Vector3(27.76, 0.82, -137.16),
  "nantes-gate": new THREE.Vector3(24.99, 0.82, -135.71),
  "nantes-lower-mid-stair": new THREE.Vector3(22.1, 0.82, -135.61),
  "nantes-mid1-mid-stair": new THREE.Vector3(17.31, 2.61, -135.59),
  "nantes-mid2-mid-stair": new THREE.Vector3(17.37, 2.61, -138.28),
  "nantes-top-mid-stair": new THREE.Vector3(22.04, 4.38, -138.38),
  "nantes-top-mid-stair-extended": new THREE.Vector3(25.45, 4.38, -138.42),
  "nantes-cr": new THREE.Vector3(24.58, 0.82, -166.62),
  "nantes-hallway1": new THREE.Vector3(23.78, 0.82, -170.47),
  "nantes-hallway2": new THREE.Vector3(20.74, 0.82, -172.88),
  "nantes-hallway3": new THREE.Vector3(17.75, 0.82, -175.24),
  "room-100": new THREE.Vector3(54.39, 0.78, -130.3),
  "room-101": new THREE.Vector3(53.67, 0.78, -120.91),
  "room-101-right": new THREE.Vector3(53.39, 0.78, -113.19),
  "room-101-ramp": new THREE.Vector3(49.87, 0.4, -113.19),
  "room-101-ramp-right": new THREE.Vector3(49.65, 0.4, -110.52),
  "hm-dirtway1": new THREE.Vector3(44.5, 0.4, -113.15),
  "hm-dirtway2": new THREE.Vector3(40.06, 0.4, -112.76),
  "hm-dirtway3": new THREE.Vector3(35.44, 0.4, -112.74),
  "room-102": new THREE.Vector3(53.13, 0.78, -103.71),
  "room-102-left": new THREE.Vector3(53.44, 0.78, -110.14),
  "field-north-center": new THREE.Vector3(36.95, 0.39, -135.6),
  "field-north-1": new THREE.Vector3(42.36, 0.39, -139.75),
  "field-north-2": new THREE.Vector3(44.88, 0.38, -132.86),
  "field-north-3": new THREE.Vector3(49.24, 0.4, -131.31),
  "field-north-4": new THREE.Vector3(39.37, 0.39, -129.97),
  "field-north-5": new THREE.Vector3(35.67, 0.4, -124.73),
} as const;

export type AnchorNodeId = keyof typeof CAMPUS_NODES;
export type CampusNodeId = AnchorNodeId | `${string}--${string}-mid`;

/** Preferred graph anchors for known destinations (sampleData ids). */
export const DESTINATION_NODES: Partial<Record<string, AnchorNodeId>> = {
  grandstand: "grandstand",
  gymnasium: "gym-approach",
  "room-103": "comlab-1",
  "room-104": "comlab-2",
  "room-105": "room-105",
  "room-106": "room-106",
  "room-107": "room-107",
  "room-108": "room-108",
  "room-203": "room-203",
  "room-204": "room-204",
  "room-205": "room-205",
  "room-206": "room-206",
  "room-109": "room-109",
  "room-110": "room-110",
  "room-111": "room-111",
  "room-112": "room-112",
  "room-113": "room-113",
  "room-114": "room-114",
  "room-115": "room-115",
  "room-116": "room-116",
  "room-207": "room-207",
  "room-208": "room-208",
  "room-209": "room-209",
  "room-210": "room-210",
  "room-211": "room-211",
  "engineering-building": "engineering-walkway4",
  "room-117": "room-117",
  "room-118": "room-118",
  "room-119": "room-119",
  "quality-assurance-office": "quality-assurance-office",
  csc: "csc",
  "room-212": "room-212",
  "room-213": "room-213",
  "room-214": "room-214",
  "room-215": "room-215",
  "guidance-counselor-office": "guidance-councelor-office",
  "room-120": "room-120",
  "room-121": "room-121",
  "room-122": "room-122",
  "faculty-room": "faculty-room",
  "medical-room": "medical-room",
  "room-216": "room-216",
  "room-217": "room-217",
  "room-218": "room-218",
  library: "library",
  "dental-clinic": "dental-clinic",
  "admin-building": "admin-building",
  "accounting-office": "accounting-office",
  "cashiers-office": "cashier's-office",
  "registrars-office": "registrar's-office",
  "admission-office": "admission-office",
  "ojt-coordinator-office": "ojt-coordinator-office",
  "director-office": "director office",
  osas: "OSAS",
};

type GraphEdge = { to: CampusNodeId; cost: number };

const runtimeNodes = new Map<CampusNodeId, THREE.Vector3>();
const adjacency = new Map<CampusNodeId, GraphEdge[]>();

for (const [id, position] of Object.entries(CAMPUS_NODES)) {
  runtimeNodes.set(id as AnchorNodeId, position);
}

function midpointId(a: AnchorNodeId, b: AnchorNodeId): CampusNodeId {
  const [left, right] = [a, b].sort();
  return `${left}--${right}-mid`;
}

function getNodePosition(id: CampusNodeId): THREE.Vector3 {
  const position = runtimeNodes.get(id);
  if (!position) {
    throw new Error(`Unknown campus node: ${id}`);
  }
  return position;
}

function ensureMidpoint(a: AnchorNodeId, b: AnchorNodeId): CampusNodeId {
  const id = midpointId(a, b);
  if (!runtimeNodes.has(id)) {
    const midpoint = new THREE.Vector3()
      .addVectors(CAMPUS_NODES[a], CAMPUS_NODES[b])
      .multiplyScalar(0.5);
    runtimeNodes.set(id, midpoint);
  }
  return id;
}

function edgeCost(from: CampusNodeId, to: CampusNodeId): number {
  return getNodePosition(from).distanceTo(getNodePosition(to));
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

function connectChain(chain: AnchorNodeId[]) {
  for (let i = 0; i < chain.length - 1; i++) {
    const from = chain[i];
    const to = chain[i + 1];
    const mid = ensureMidpoint(from, to);
    addEdge(from, mid);
    addEdge(mid, to);
  }
}

function connectAnchors(a: AnchorNodeId, b: AnchorNodeId) {
  const mid = ensureMidpoint(a, b);
  addEdge(a, mid);
  addEdge(mid, b);
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
  "covered-hallway13",
  "covered-hallway12",
  "covered-hallway11",
  "covered-hallway10",
  "covered-hallway9",
  "covered-hallway8",
  "covered-hallway7",
  "field-east-0",
  "grandstand-approach",
  "grandstand-ramp",
]);

connectChain([
  "covered-hallway7",
  "covered-hallway6",
  "covered-hallway5",
  "covered-hallway4",
  "covered-hallway3",
  "covered-hallway2",
  "covered-hallway1",
]);

// Gate → gym
connectChain([
  "field-east-0",
  "field-east-1",
  "nantes-lower-left-stair-extended",
  "covered-hallway1",
  "field-east-2",
  "field-east-3",
  "field-east-4",
  "field-east-5",
  "nantes-building",
  "gym-approach",
]);
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
connectChain(["field-mid-south", "yumul-building"]);

//admin building
connectChain([
  "admin-building",
  "accounting-office",
  "cashier's-office",
  "registrar's-office",
  "admission-office",
  "admin-stairs-left-ramp-bottom",
  "admin-stairs-left-ramp-top",
  "admin-left-way-1",
  "admin-left-way-2",
  "ojt-coordinator-office",
  "director office",
  "OSAS",
  "admin-right-way-2",
  "admin-right-way-1",
  "admin-stairs-right-ramp-top",
]);

connectChain([
  "comlab-walkway-1",
  "comlab-walkway-2",
  "comlab-walkway-3",
  "comlab-walkway-4",
  "covered-bridge-lower-left-ramp1",
  "covered-bridge-upper-left-ramp1",
  "covered-bridge-upper-right-ramp1",
  "covered-bridge-lower-right-ramp1",
  "hs-hallway-1",
  "hs-hallway-2",
  "hs-hallway-3",
  "hs-hallway-4",
  "hs-hallway-5",
  "engineering-walkway1",
  "engineering-walkway2",
  "engineering-walkway3",
  "engineering-walkway4",
  "engineering-walkway5",
  "engineering-walkway6",
  "engineering-walkway7",
  "engineering-walkway8",
]);

connectChain([
  "hs-lower-left-ramp",
  "hs-top-left-ramp",
  "hs-lower-left-stair-ramp",
  "room-105",
  "room-106",
  "room-107",
  "room-107-mid-108",
  "room-108",
  "hs-lower-right-stair-ramp",
  "hs-top-right-ramp",
  "hs-lower-right-ramp",
]);

connectChain([
  "hs-mid1-left-stair-ramp",
  "hs-mid2-left-stair-ramp",
  "hs-top-left-stair-ramp",
  "room-203",
  "room-204",
  "room-205",
  "room-206",
  "hs-top-right-stair-ramp",
  "hs-mid2-right-stair-ramp",
  "hs-mid1-right-stair-ramp",
]);

connectChain([
  "room-109",
  "room-110",
  "room-111",
  "room-112",
  "engineering-lower-mid-stair",
  "room-113",
  "room-114",
  "room-115",
  "room-116",
  "engineering-end-node",
]);

connectChain([
  "engineering-lower-mid-stair",
  "engineering-mid1-mid-stair",
  "engineering-mid2-mid-stair",
  "engineering-mid-extended-stair",
]);

connectChain([
  "engineering-lower-left-stair",
  "engineering-top-left-stair",
  "engineering-left-extended-stair",
  "room-208",
  "engineering-office1",
  "engineering-office2",
  "engineering-mid-extended-stair",
  "room-209",
  "engineering-unknown-room",
  "room-210",
  "room-211",
  "engineering-right-extended-stair",
  "engineering-top-right-stair",
  "engineering-lower-right-stair",
]);

connectChain([
  "dirt-walkway1",
  "dirt-walkway2",
  "dirt-walkway3",
  "educ-lower-left-ramp",
  "educ-top-left-ramp",
  "educ-lower-left-stair",
  "educ-mid1-left-stair",
  "educ-mid2-left-stair",
  "educ-top-left-stair",
  "room-212",
  "room-213",
  "guidance-councelor-office",
  "room-214",
  "room-215",
  "educ-top-right-stair",
  "educ-mid2-right-stair",
  "educ-mid1-right-stair",
  "educ-lower-right-stair",
  "quality-assurance-office",
  "room-119",
  "csc",
  "educ-mid-extended",
  "room-118",
  "room-117",
]);

connectChain([
  "educ-lower-left-ramp",
  "educ-walkway5",
  "educ-walkway4",
  "educ-walkway3",
  "educ-walkway2",
  "educ-walkway1",
  "educ-lower-right-ramp",
  "educ-top-right-ramp",
  "educ-lower-right-stair",
]);

connectChain([
  "north-center-field",
  "nantes-back-waywalk1",
  "nantes-back-waywalk2",
  "nantes-back-waywalk3",
  "nantes-back-waywalk4",
  "nantes-back-waywalk5",
  "unknown-office",
  "rotc-office",
  "nantes-back-waywalk6",
  "grandstand-ramp1",
  "grandstand-ramp2",
  "grandstand-ramp3",
  "grandstand-ramp4",
  "grandstand-ramp5",
  "grandstand-ramp",
  "grandstand-right-extended",
  "grandstand",
  "grandstand-left-extended",
  "grandstand-top-left-stair",
  "grandstand-lower-left-stair",
  "nantes-back-waywalk5",
]);

connectChain([
  "educ-lower-right-stair",
  "nantes-hallway3",
  "nantes-hallway2",
  "nantes-hallway1",
  "nantes-cr",
  "nantes-ramp1",
  "medical-room",
  "faculty-room",
  "nantes-gate",
  "room-122",
  "room-121",
  "room-120",
  "covered-hallway1",
]);

connectChain([
  "nantes-building",
  "nantes-entrance",
  "nantes-gate",
  "nantes-lower-mid-stair",
  "nantes-mid1-mid-stair",
  "nantes-mid2-mid-stair",
  "nantes-top-mid-stair",
  "nantes-top-mid-stair-extended",
]);

connectChain([
  "nantes-ramp1",
  "nantes-ramp2",
  "nantes-ramp3",
  "nantes-ramp4",
  "dental-clinic",
  "library",
  "nantes-top-mid-stair-extended",
  "room-218",
  "room-217",
  "room-216",
  "nantes-top-left-stair",
  "nantes-lower-left-stair",
  "nantes-lower-left-stair-extended",
]);

connectChain([
  "field-east-3",
  "hm-dirtway3",
  "hm-dirtway2",
  "hm-dirtway1",
  "room-101-ramp",
  "room-101-right",
  "room-101",
  "room-100",
  "field-north-3",
  "field-north-2",
  "field-north-1",
  "gym-approach",
])

connectChain([
  "hm-dirtway3", 
  "field-north-5",
  "field-north-4",
  "field-north-2",
])

connectChain([
  "room-101-ramp",
  "room-101-ramp-right",
  "room-102-left",
  "room-102",
])

// Cross-links between parallel routes
connectAnchors("bridge-west-lower-right-ramp", "bridge-west-upper-right-ramp");
connectAnchors("comlab-2", "field-south-1");
connectAnchors("field-south-1", "field-mid-south");
connectAnchors("gate-yumul", "admin-building");
connectAnchors("admin-building", "admin-stairs-right-ramp-top");
connectAnchors("comlab-1", "comlab-walkway-1");
connectAnchors("hs-hallway-1", "hs-lower-left-ramp");
connectAnchors("hs-hallway-4", "hs-lower-right-ramp");
connectAnchors("hs-hallway-3", "hs-building");
connectAnchors("hs-building", "room-107-mid-108");
connectAnchors("hs-hallway-1", "covered-hallway13");
connectAnchors("hs-hallway-1", "bridge-west-lower-left-ramp");
connectAnchors("hs-hallway-2", "room-106");
connectAnchors("hs-lower-right-stair-ramp", "hs-mid1-right-stair-ramp");
connectAnchors("hs-lower-left-stair-ramp", "hs-mid1-left-stair-ramp");
connectAnchors("hs-top-right-ramp", "engineering-doorway-bench");
connectAnchors("engineering-doorway-bench", "room-109");
connectAnchors("engineering-doorway-bench", "engineering-lower-left-stair");
connectAnchors("engineering-end-node", "engineering-lower-right-stair");
connectAnchors("engineering-walkway8", "engineering-lower-right-stair");
connectAnchors("engineering-walkway8", "engineering-end-node");
connectAnchors("engineering-walkway7", "room-116");
connectAnchors("engineering-walkway6", "room-115");
connectAnchors("engineering-walkway5", "room-114");
connectAnchors("engineering-walkway4", "engineering-lower-mid-stair");
connectAnchors("engineering-walkway3", "room-112");
connectAnchors("engineering-walkway2", "room-111");
connectAnchors("hs-hallway-5", "engineering-lower-left-stair");
connectAnchors("engineering-left-extended-stair", "room-207");
connectAnchors("dirt-walkway1", "engineering-walkway8");
connectAnchors("dirt-walkway1", "engineering-lower-right-stair");
connectAnchors("room-117", "educ-lower-left-stair");
connectAnchors("educ-walkway4", "educ-mid-extended");
connectAnchors("educ-walkway3", "room-119");
connectAnchors("educ-walkway2", "educ-lower-right-ramp");
connectAnchors("educ-walkway1", "north-center-field");
connectAnchors("nantes-hallway3", "north-center-field");
connectAnchors("eco-park", "north-center-field");
connectAnchors("nantes-back-waywalk6", "field-east-1");
connectAnchors("field-east-4", "field-north-5");
connectAnchors("field-east-5", "field-north-5");
connectAnchors("field-north-center", "field-north-5");
connectAnchors("field-north-center", "field-east-5");
connectAnchors("field-north-center", "nantes-building");
connectAnchors("field-north-center", "gym-approach");
connectAnchors("field-north-center", "field-north-2");


const nodeIds = [...runtimeNodes.keys()];

export function formatCampusNodeSnippet(
  id: string,
  position: THREE.Vector3,
): string {
  return `  "${id}": new THREE.Vector3(${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}),`;
}

export function validateCampusNodeName(
  id: string,
): { ok: true; normalizedId: string } | { ok: false; reason: string } {
  const normalizedId = id.trim();
  if (!normalizedId) {
    return { ok: false, reason: "Node name is required." };
  }
  if (runtimeNodes.has(normalizedId as CampusNodeId)) {
    return { ok: false, reason: "A node with this name already exists." };
  }
  return { ok: true, normalizedId };
}

export type CampusPathResult = {
  nodeIds: CampusNodeId[];
  graphDistance: number;
  totalDistance: number;
};

/** All nodes including auto-generated edge midpoints (for dev debug view). */
export function getAllCampusNodeEntries(): [CampusNodeId, THREE.Vector3][] {
  return [...runtimeNodes.entries()];
}

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
        getNodePosition(from).clone(),
        getNodePosition(edge.to).clone(),
      ]);
    }
  }

  return segments;
}

function nearestNode(pos: THREE.Vector3): CampusNodeId {
  let bestId = nodeIds[0];
  let bestDist = Infinity;

  for (const id of nodeIds) {
    const dist = pos.distanceTo(getNodePosition(id));
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
    const dist = start.distanceTo(getNodePosition(ids[i]));
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
  preferredGoalNode?: AnchorNodeId,
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
    start.distanceTo(getNodePosition(startNode)) +
    graphDistance +
    getNodePosition(goalNode).distanceTo(goal);

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
    points.push(getNodePosition(id).clone());
  }

  points.push(goal.clone());

  return points;
}
