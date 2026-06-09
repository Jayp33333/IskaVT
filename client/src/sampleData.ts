import * as THREE from "three";

export const IS_DEV = !import.meta.env.VITE_VIVERSE_APP_ID;

export type FixedLocationRoom = {
  id: string;
  name: string;
  position: THREE.Vector3;
  imageSrc?: string;
  floor?: number;
};

export type FixedLocationPin = {
  id: string;
  name: string;
  position: THREE.Vector3;
  imageSrc?: string;
  highlighted?: boolean;
  kind?: "poi" | "building";
  rooms?: FixedLocationRoom[];
};

export const SAMPLE_AVATAR_LIST = IS_DEV
  ? [
      {
        headIconUrl: "images/iska-head-icon.png",
        id: 1,
        vrmUrl: "models/avatars/Iska.vrm",
        displayName: "ISKA",
      },

      {
        headIconUrl: "images/isko-head-icon.png",
        id: 2,
        vrmUrl: "models/avatars/Isko.vrm",
        displayName: "ISKO",
      },
    ]
  : [
      {
        headIconUrl: "images/iska-head-icon.png",
        id: 1,
        vrmUrl: "models/avatars/Iska.vrm",
        displayName: "ISKA",
      },

      {
        headIconUrl: "images/isko-head-icon.png",
        id: 2,
        vrmUrl: "models/avatars/Isko.vrm",
        displayName: "ISKO",
      },
    ];

export const DESTINATIONS = [
  // ===== GENERAL FACILITIES =====
  // { id: "canteen", name: "Canteen", position: new THREE.Vector3(0, 0, 0) },
  // { id: "enrollment", name: "Enrollment", position: new THREE.Vector3(0, 0, 0) },
  // { id: "library", name: "Library", position: new THREE.Vector3(0, 0, 0) },
  {
    id: "gymnasium",
    name: "PUP Gymnasium",
    position: new THREE.Vector3(41, 0.2, -148),
  },
  {
    id: "grandstand",
    name: "Grandstand",
    position: new THREE.Vector3(6, 2.1  , -119),
  },
  {
    id: "admin-building",
    name: "Administration Building",
    position: new THREE.Vector3(15, 0.29, -6),
  },
  {
    id: "accounting-office",
    name: "Accounting Office",
    position: new THREE.Vector3(19.1, 0.29, -5.5),
  },
  {
    id: "cashiers-office",
    name: "Cashier's Office",
    position: new THREE.Vector3(27.6, 0.29, -5.1),
  },
  {
    id: "registrars-office",
    name: "Registrar's Office",
    position: new THREE.Vector3(29.4, 0.29, -4.8),
  },
  {
    id: "admission-office",
    name: "Admission Office",
    position: new THREE.Vector3(39.7, 0.29, -4.1),
  },
  {
    id: "ojt-coordinator-office",
    name: "OJT Coordinator's Office",
    position: new THREE.Vector3(39.74, 4, -4.26),
  },
  {
    id: "director-office",
    name: "Director Office",
    position: new THREE.Vector3(29.4, 4, -4.9),
  },
  {
    id: "osas",
    name: "OSAS",
    position: new THREE.Vector3(19.2, 4, -5.5),
  },
  // { id: "eco-park", name: "Eco Park", position: new THREE.Vector3(0, 0, 0) },
  // { id: "comfort-room", name: "Comfort Room", position: new THREE.Vector3(0, 0, 0) },

  // ===== BUILDINGS =====
  // { id: "yumul-building", name: "Yumul Building", position: new THREE.Vector3(0, 0, 0) },
  // { id: "nantes-building", name: "Nantes Building", position: new THREE.Vector3(0, 0, 0) },
  // { id: "accountancy-building", name: "Business and Accountancy Building", position: new THREE.Vector3(0, 0, 0) },
  // { id: "education-building", name: "Education and Public Administration Building", position: new THREE.Vector3(0, 0, 0) },
  // { id: "health-sciences", name: "Health and Sciences Building", position: new THREE.Vector3(0, 0, 0) },
  // { id: "hospitality-building", name: "Hospitality Management Building", position: new THREE.Vector3(0, 0, 0) },
  {
    id: "engineering-building",
    name: "Engineering Building",
    position: new THREE.Vector3(-48.49, 0.5, -128.38),
  },
  // {
  //   id: "aet-building",
  //   name: "Architecture, Engineering and Technology Building",
  //   position: new THREE.Vector3(0, 0, 0),
  // },

  // ===== OFFICES =====
  // { id: "osas", name: "OSAS", position: new THREE.Vector3(0, 0, 0) },
  // { id: "registrar", name: "Registrar", position: new THREE.Vector3(0, 0, 0) },
  // { id: "accounting", name: "Accounting Office", position: new THREE.Vector3(0, 0, 0) },
  // { id: "cashier", name: "Cashier", position: new THREE.Vector3(0, 0, 0) },
  // { id: "director-office", name: "Director and AO Office", position: new THREE.Vector3(0, 0, 0) },
  // { id: "academic-office", name: "Academic and OJT Office", position: new THREE.Vector3(0, 0, 0) },
  // { id: "admin-building", name: "Administration Building", position: new THREE.Vector3(0, 0, 0) },
  // { id: "icto", name: "ICTO", position: new THREE.Vector3(0, 0, 0) },
  // { id: "gs", name: "GS", position: new THREE.Vector3(0, 0, 0) },
  // { id: "psmo", name: "PSMO", position: new THREE.Vector3(0, 0, 0) },
  // { id: "hrmo", name: "HRMO", position: new THREE.Vector3(0, 0, 0) },
  // { id: "supply", name: "Supply and Property Maintenance Office", position: new THREE.Vector3(0, 0, 0) },
  // { id: "qa-office", name: "Quality Assurance Office", position: new THREE.Vector3(0, 0, 0) },
  // { id: "csc", name: "Central Student Council Office", position: new THREE.Vector3(0, 0, 0) },

  // ===== CLINICS =====
  // { id: "medical", name: "Medical Clinic", position: new THREE.Vector3(0, 0, 0) },
  // { id: "dental", name: "Dental Clinic", position: new THREE.Vector3(0, 0, 0) },

  // ===== ROTC =====
  // { id: "rotc", name: "ROTC", position: new THREE.Vector3(0, 0, 0) },
  // { id: "rotc-office", name: "ROTC Office", position: new THREE.Vector3(0, 0, 0) },

  // ===== LABORATORIES & ROOMS (YUMUL) =====
  // { id: "room-100", name: "Room 100 (Kitchen Laboratory)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-101", name: "Room 101 (Beverage Laboratory)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-102", name: "Room 102 (Tissue Laboratory)", position: new THREE.Vector3(0, 0, 0) },
  {
    id: "room-103",
    name: "ICT Laboratory 1 (Room 103)",
    position: new THREE.Vector3(3.5, 0.105, -12.5),
  },
  {
    id: "room-104",
    name: "ICT Laboratory 2 (Room 104)",
    position: new THREE.Vector3(13.5, 0.105, -26.05),
  },
  {
    id: "room-105",
    name: "Room 105 (Food Laboratory)",
    position: new THREE.Vector3(-20.5, 0.7, -52),
  },
  {
    id: "room-106",
    name: "Room 106 (Lecture Room)",
    position: new THREE.Vector3(-27.6, 0.7, -59),
  },
  {
    id: "room-107",
    name: "Room 107 (Lecture Room)",
    position: new THREE.Vector3(-35, 0.7, -66.3),
  },
  {
    id: "room-108",
    name: "Room 108 (Lecture Room)",
    position: new THREE.Vector3(-42.3, 0.7, -73.5),
  },
  {
    id: "room-109",
    name: "Room 109 (Lecture Room)",
    position: new THREE.Vector3(-50.84, 0.54, -89.86),
  },
  {
    id: "room-110",
    name: "Room 110 (Lecture Room)",
    position: new THREE.Vector3(-50.96, 0.54, -98.93),
  },
  {
    id: "room-111",
    name: "Room 111 (CE Laboratory)",
    position: new THREE.Vector3(-51.53, 0.54, -108.1),
  },
  {
    id: "room-112",
    name: "Room 112 (EE Laboratory)",
    position: new THREE.Vector3(-51.99, 0.54, -117.26),
  },
  {
    id: "room-113",
    name: "Room 113 (Lecture Room)",
    position: new THREE.Vector3(-52.53, 0.54, -131.12),
  },
  {
    id: "room-114",
    name: "Room 114 (Lecture Room)",
    position: new THREE.Vector3(-53.02, 0.54, -140.49),
  },
  {
    id: "room-115",
    name: "Room 115 (Lecture Room)",
    position: new THREE.Vector3(-53.69, 0.54, -149.62),
  },
  {
    id: "room-116",
    name: "Room 116 (Lecture Room)",
    position: new THREE.Vector3(-54.29, 0.54, -163.49),
  },
  {
    id: "room-117",
    name: "Room 117 (Lecture Room)",
    position: new THREE.Vector3(-26.73, 0.82, -207.15),
  },
  {
    id: "room-118",
    name: "Room 118 (Lecture Room)",
    position: new THREE.Vector3(-18.31, 0.82, -201.18),
  },
  {
    id: "room-119",
    name: "Room 119 (EdTech)",
    position: new THREE.Vector3(-5.78, 0.82, -191.96),
  },
  {
    id: "quality-assurance-office",
    name: "Quality Assurance Office",
    position: new THREE.Vector3(2.5, 0.82, -185.76),
  },
  {
    id: "csc",
    name: "Central Student Council Office",
    position: new THREE.Vector3(-8.71, 0.82, -194.19),
  },
  {
    id: "room-120",
    name: "Room 120 (Lecture Room)",
    position: new THREE.Vector3(26.27, 0.82, -105.8),
  },
  {
    id: "room-121",
    name: "Room 121 (Lecture Room)",
    position: new THREE.Vector3(25.95, 0.82, -115.8),
  },
  {
    id: "room-122",
    name: "Room 122 (Lecture Room)",
    position: new THREE.Vector3(25.71, 0.82, -125.48),
  },
  {
    id: "faculty-room",
    name: "Faculty Room",
    position: new THREE.Vector3(25.42, 0.82, -140.99),
  },
  {
    id: "medical-room",
    name: "Medical Room",
    position: new THREE.Vector3(24.84, 0.82, -150.7),
  },

  // ===== SECOND FLOOR =====
  // { id: "room-200", name: "Room 200", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-201", name: "Room 201", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-202", name: "Room 202", position: new THREE.Vector3(0, 0, 0) },
  {
    id: "room-203",
    name: "Room 203 (Lecture Room)",
    position: new THREE.Vector3(-20.5, 4.5, -52),
  },
  {
    id: "room-204",
    name: "Room 204 (Lecture Room)",
    position: new THREE.Vector3(-28, 4.5, -59),
  },
  {
    id: "room-205",
    name: "Room 205 (Physics Laboratory)",
    position: new THREE.Vector3(-35.2, 4.5, -66.4),
  },
  {
    id: "room-206",
    name: "Room 206 (Chemistry Laboratory)",
    position: new THREE.Vector3(-42.38, 4.5, -73.43),
  },
  {
    id: "room-207",
    name: "Room 207 (ICT Laboratory 3)",
    position: new THREE.Vector3(-50.59, 4.08, -89.5),
  },
  {
    id: "room-208",
    name: "Room 208 (Drafting Laboratory)",
    position: new THREE.Vector3(-51.2, 4.08, -99.01),
  },
  {
    id: "room-209",
    name: "Room 209 (CEA Function Room)",
    position: new THREE.Vector3(-52.6, 4.08, -130.98),
  },
  {
    id: "room-210",
    name: "Room 210 (Lecture Room)",
    position: new THREE.Vector3(-53.36, 4.08, -149.67),
  },
  {
    id: "room-211",
    name: "Room 211 (Lecture Room)",
    position: new THREE.Vector3(-54.15, 4.08, -163.58),
  },
  {
    id: "room-212",
    name: "Room 212 (Lecture Room)",
    position: new THREE.Vector3(-26.62, 4.5, -207.1),
  },
  {
    id: "room-213",
    name: "Room 213 (Lecture Room)",
    position: new THREE.Vector3(-18.33, 4.5, -200.87),
  },
  {
    id: "guidance-counselor-office",
    name: "Guidance Counselor Office",
    position: new THREE.Vector3(-8.53, 4.5, -193.82),
  },
  {
    id: "room-214",
    name: "Room 214 (Lecture Room)",
    position: new THREE.Vector3(-5.9, 4.5, -191.78),
  },
  {
    id: "room-215",
    name: "Room 215 (Lecture Room)",
    position: new THREE.Vector3(2.25, 4.5, -185.64),
  },
  {
    id: "room-216",
    name: "Room 216 (Speech Laboratory)",
    position: new THREE.Vector3(26.11, 4.38, -105.64),
  },
  {
    id: "room-217",
    name: "Room 217 (Computer Laboratory 1)",
    position: new THREE.Vector3(25.93, 4.38, -115.51),
  },
  {
    id: "room-218",
    name: "Room 218 (Computer Laboratory 2)",
    position: new THREE.Vector3(25.77, 4.38, -125.69),
  },
  {
    id: "library",
    name: "Library",
    position: new THREE.Vector3(25.18, 4.38, -150.67),
  },
  {
    id: "dental-clinic",
    name: "Dental Clinic",
    position: new THREE.Vector3(24.8, 4.38, -166.53),
  },

  // ===== SPECIAL ROOMS =====
  // { id: "avr", name: "AVR", position: new THREE.Vector3(0, 0, 0) },
  // { id: "simulation", name: "Simulation Room", position: new THREE.Vector3(0, 0, 0) },
  // { id: "keyboard-lab", name: "Keyboard Laboratory", position: new THREE.Vector3(0, 0, 0) },
  // { id: "speech-lab", name: "Speech Laboratory", position: new THREE.Vector3(0, 0, 0) },

  // ===== AGRI & OTHERS =====
  // { id: "agri", name: "Agri Business Farm", position: new THREE.Vector3(0, 0, 0) },
];

export const floorZones = [
  {
    name: "ICT Laboratory 1",
    xMin: -8.2,
    xMax: 4.8,
    zMin: -23.65,
    zMax: -11.2,
    yMin: 0,
    yMax: 3,
  },
  {
    name: "ICT Laboratory 2",
    xMin: 1.5,
    xMax: 14,
    zMin: -38,
    zMax: -24.24,
    yMin: 0,
    yMax: 3,
  },

  {
    name: "Yumul Building",
    xMin: 35.5,
    xMax: 60,
    zMin: -61,
    zMax: -11,
    yMin: 0,
    yMax: 9,
  },
  {
    name: "Administration Building",
    xMin: 13.4,
    xMax: 54,
    zMin: -7.8,
    zMax: 6.5,
    yMin: 0,
    yMax: 5,
  },
  {
    name: "Accounting Office",
    xMin: 18,
    xMax: 20,
    zMin: -6,
    zMax: -4.1,
    yMin: 0,
    yMax: 2,
  },
  {
    name: "Cashier's Office",
    xMin: 26.4,
    xMax: 27.71,
    zMin: -6,
    zMax: -3.67,
    yMin: 0,
    yMax: 2,
  },
  {
    name: "Registrar's Office",
    xMin: 28.91,
    xMax: 29.92,
    zMin: -6,
    zMax: -3.5,
    yMin: 0,
    yMax: 2,
  },
  {
    name: "Admission Office",
    xMin: 39.16,
    xMax: 40.2,
    zMin: -6,
    zMax: -3,
    yMin: 0,
    yMax: 2,
  },
    {
    name: "OJT Coordinator's Office",
    xMin: 39.16,
    xMax: 40.2,
    zMin: -6,
    zMax: -3,
    yMin: 2,
    yMax: 4,
  },
      {
    name: "Director Office",
    xMin: 28.91,
    xMax: 29.92,
    zMin: -6,
    zMax: -3.5,
    yMin: 2,
    yMax: 4,
  },
  {
    name: "Office of Student Affairs and Services (OSAS)",
    xMin: 18,
    xMax: 20,
    zMin: -6,
    zMax: -4.1,
    yMin: 2,
    yMax: 4,
  },
  {
    name: "Pylon",
    xMin: 13,
    xMax: 24,
    zMin: -77.56,
    zMax: -66.18,
    yMin: 0,
    yMax: 5,
  },
  {
    name: "Nantes Building",
    xMin: 17.5,
    xMax: 29,
    zMin: -170.5,
    zMax: -102.7,
    yMin: 0,
    yMax: 7,
  },
   {
    name: "Education Building",
    xMin: -36,
    xMax: 16.5,
    zMin: -221,
    zMax: -174.5,
    yMin: 0,
    yMax: 7,
  },

  {
    name: "Gymnasium",
    xMin: 41.5,
    xMax: 97,
    zMin: -170,
    zMax: -137,
    yMin: 0,
    yMax: 7,
  },
  {
    name: "Grandstand",
    xMin: 2.2,
    xMax: 16,
    zMin: -132,
    zMax: -102,
    yMin: 0,
    yMax: 7,
  },
  {
    name: "Health and Sciences Building",
    xMin: -51,
    xMax: -12.31,
    zMin: -85.85,
    zMax: -38.5,
    yMin: 0,
    yMax: 7,
  },
  {
    name: "Engineering Building",
    xMin: -60,
    xMax: -48,
    zMin: -174.5,
    zMax: -88.14,
    yMin: 0,
    yMax: 7,
  },
  {
    name: "Tau Gamma ",
    xMin: -21.5,
    xMax: -16.44,
    zMin: -32,
    zMax: -24.25,
    yMin: 0,
    yMax: 7,
  },
  {
    name: "Old Canteen ",
    xMin: 34,
    xMax: 55,
    zMin: -80,
    zMax: -66.5,
    yMin: 0,
    yMax: 7,
  },
    {
    name: "New Canteen ",
    xMin: -2.8,
    xMax: 8.2,
    zMin: -96,
    zMax: -77,
    yMin: 0,
    yMax: 7,
  },
];

export type FloorZone = (typeof floorZones)[number];

export function isPositionInFloorZone(
  position: { x: number; y: number; z: number },
  zone: FloorZone
): boolean {
  return (
    position.x >= zone.xMin &&
    position.x <= zone.xMax &&
    position.z >= zone.zMin &&
    position.z <= zone.zMax &&
    position.y >= (zone.yMin ?? 0) &&
    position.y <= (zone.yMax ?? 10)
  );
}

function floorZoneVolume(zone: FloorZone): number {
  return (
    (zone.xMax - zone.xMin) *
    (zone.zMax - zone.zMin) *
    ((zone.yMax ?? 10) - (zone.yMin ?? 0))
  );
}

/** All zones containing the position, most specific (smallest) first. */
export function getFloorZonesAtPosition(position: {
  x: number;
  y: number;
  z: number;
}): FloorZone[] {
  return floorZones
    .filter((zone) => isPositionInFloorZone(position, zone))
    .sort((a, b) => floorZoneVolume(a) - floorZoneVolume(b));
}

const PYLON_IMAGE = "/images/campus-image.jpg";
const ADMIN_BUILDING_IMAGE = "/images/buildings/AdminBuilding.webp";
const GYM_IMAGE = "/images/buildings/Gymnasium.jpg";
const GRANDSTAND_IMAGE = "/images/buildings/Grandstand.jpg";
const YUMUL_IMAGE = "/images/buildings/YumulBuilding.png";
const NANTES_IMAGE = "/images/buildings/NantesBuilding.webp";
const HEALTH_SCIENCES_BUILDING_IMAGE = "/images/buildings/HealthSciencesBuilding.jpg";
const ENGINEERING_BUILDING_IMAGE = "/images/buildings/EngineeringBuilding.jpg";
const EDUCATION_BUILDING_IMAGE = "/images/buildings/EducationBuilding.png";
const COMLAB1_IMAGE = "/images/buildings/Comlab1.jpg";
const COMLAB2_IMAGE = "/images/buildings/Comlab2.jpg";
const HM_ROOMS_IMAGE = "/images/buildings/HMRooms.jpg";

function withRoomOffsets(
  buildingId: string,
  center: THREE.Vector3,
  rooms: Array<{
    id?: string;
    name: string;
    floor?: number;
    yOffset?: number; // Y offset relative to building center (per-building floor heights)
    y?: number; // override absolute Y directly if needed
    xOffset?: number;
    zOffset?: number;
    position?: THREE.Vector3; // absolute world position (overrides center + offsets)
    imageSrc?: string;
  }>,
): FixedLocationRoom[] {
  return rooms.map((r, idx) => {
    const position =
      r.position ??
      new THREE.Vector3(
        center.x + (r.xOffset ?? 0),
        typeof r.y === "number"
          ? r.y
          : center.y + (typeof r.yOffset === "number" ? r.yOffset : 0),
        center.z + (r.zOffset ?? 0),
      );

    return {
      id: r.id ?? `${buildingId}-room-${idx + 1}`,
      name: r.name,
      floor: r.floor,
      position,
      imageSrc: r.imageSrc ?? PYLON_IMAGE,
    };
  });
}

// Fixed location pins for minimap
// These represent points of interest that are always visible on the minimap
export const FIXED_LOCATION_PINS: FixedLocationPin[] = [
  {
    id: "grandstand",
    name: "Grandstand",
    position: new THREE.Vector3(6, 2, -119), // Center of Grandstand zone
    highlighted: false,
    imageSrc: GRANDSTAND_IMAGE,
    kind: "poi",
    rooms: withRoomOffsets(
      "grandstand",
      new THREE.Vector3(6, 2, -119),
      [
        {
          id: "grandstand",
          name: "Grandstand",
          yOffset: 0,
          xOffset: 0,
          zOffset: 0,
        },
        {
          id: "rotc-office",
          name: "ROTC Office",
          yOffset: 0,
          xOffset: 1.6,
          zOffset: 0,
        },
      ],
    ),
  },
  {
    id: "gymnasium",
    name: "PUP Gymnasium",
    position: new THREE.Vector3(41, 0.2, -148), // Center of PUP Gymnasium zone
    highlighted: false, // Yellow pin with label
    imageSrc: GYM_IMAGE,
    kind: "poi",
  },
  {
    id: "yumul-building",
    name: "Yumul Building",
    position: new THREE.Vector3(38.4, 0.2, -33.5), // Center of Yumul Building zone
    highlighted: false,
    imageSrc: YUMUL_IMAGE,
    kind: "building",
  },

  {
    id: "administration-building",
    name: "Administration Building",
    position: new THREE.Vector3(15, 0.29, -6),
    highlighted: false,
    imageSrc: ADMIN_BUILDING_IMAGE,
    kind: "building",
    rooms: withRoomOffsets("administration-building", new THREE.Vector3(15, 0.29, -6), [
      {
        id: "accounting-office",
        name: "Accounting Office",
        floor: 1,
        position: new THREE.Vector3(19.1, 0.29, -5.5),
      },
      {
        id: "cashiers-office",
        name: "Cashier's Office",
        floor: 1,
        position: new THREE.Vector3(27.6, 0.29, -5.1),
      },
      {
        id: "registrars-office",
        name: "Registrar's Office",
        floor: 1,
        position: new THREE.Vector3(29.4, 0.29, -4.8),
      },
      {
        id: "admission-office",
        name: "Admission Office",
        floor: 1,
        position: new THREE.Vector3(39.7, 0.29, -4.1),
      },
      {
        id: "ojt-coordinator-office",
        name: "OJT Coordinator's Office",
        floor: 2,
        position: new THREE.Vector3(39.74, 4, -4.26),
      },
      {
        id: "director-office",
        name: "Director Office",
        floor: 2,
        position: new THREE.Vector3(29.4, 4, -4.9),
      },
      {
        id: "osas",
        name: "OSAS",
        floor: 2,
        position: new THREE.Vector3(19.2, 4, -5.5),
      },
    ]),
  },
  {
    id: "nantes-building",
    name: "Nantes Building",
    position: new THREE.Vector3(28, 0.2, -138), // Center of Nantes Building zone
    highlighted: false,
    imageSrc: NANTES_IMAGE,
    kind: "building",
    rooms: withRoomOffsets(
      "nantes-building",
      new THREE.Vector3(28, 0.2, -138),
      [
        // 1st floor
        {
          id: "room-120",
          name: "Room 120 (Lecture Room)",
          floor: 1,
          position: new THREE.Vector3(26.27, 0.82, -105.8),
        },
        {
          id: "room-121",
          name: "Room 121 (Lecture Room)",
          floor: 1,
          position: new THREE.Vector3(25.95, 0.82, -115.8),
        },
        {
          id: "room-122",
          name: "Room 122 (Lecture Room)",
          floor: 1,
          position: new THREE.Vector3(25.71, 0.82, -125.48),
        },
        {
          id: "faculty-room",
          name: "Faculty Room",
          floor: 1,
          position: new THREE.Vector3(25.42, 0.82, -140.99),
        },
        {
          id: "medical-room",
          name: "Medical Room",
          floor: 1,
          position: new THREE.Vector3(24.84, 0.82, -150.7),
        },

        // 2nd floor
        {
          id: "room-216",
          name: "Room 216 (Speech Laboratory)",
          floor: 2,
          position: new THREE.Vector3(26.11, 4.38, -105.64),
        },
        {
          id: "room-217",
          name: "Room 217 (Computer Laboratory 1)",
          floor: 2,
          position: new THREE.Vector3(25.93, 4.38, -115.51),
        },
        {
          id: "room-218",
          name: "Room 218 (Computer Laboratory 2)",
          floor: 2,
          position: new THREE.Vector3(25.77, 4.38, -125.69),
        },
        {
          id: "library",
          name: "Library",
          floor: 2,
          position: new THREE.Vector3(25.18, 4.38, -150.67),
        },
        {
          id: "dental-clinic",
          name: "Dental Clinic",
          floor: 2,
          position: new THREE.Vector3(24.8, 4.38, -166.53),
        },
      ],
    ),
  },
  {
    id: "hm-rooms",
    name: "HM Laboratories",
    position: new THREE.Vector3(51.6, 0.2, -114),
    highlighted: false,
    imageSrc: HM_ROOMS_IMAGE,
    kind: "poi",
    rooms: withRoomOffsets(
      "hm-rooms",
      new THREE.Vector3(51.6, 0.2, -114),
      [
        {
          id: "room-100",
          name: "Room 100 (Kitchen Laboratory)",
          yOffset: 0,
          xOffset: -2.4,
          zOffset: 0,
        },
        {
          id: "room-101",
          name: "Room 101 (Beverage Laboratory)",
          yOffset: 0,
          xOffset: 0,
          zOffset: 0,
        },
        {
          id: "room-102",
          name: "Room 102 (Tissue Laboratory)",
          yOffset: 0,
          xOffset: 2.4,
          zOffset: 0,
        },
      ],
    ),
  },
  {
    id: "health-sciences",
    name: "Health and Sciences Building",
    position: new THREE.Vector3(-33, 0.2, -65), // Center of Health and Sciences Building zone
    highlighted: false,
    imageSrc: HEALTH_SCIENCES_BUILDING_IMAGE,
    kind: "building",
    rooms: withRoomOffsets(
      "health-sciences",
      new THREE.Vector3(-33, 0.2, -65),
      [
        // 1st floor
        {
          id: "room-105",
          name: "Room 105 (Food Laboratory)",
          floor: 1,
          position: new THREE.Vector3(-20.5, 0.7, -52),
        },
        {
          id: "room-106",
          name: "Room 106 (Lecture Room)",
          floor: 1,
          position: new THREE.Vector3(-27.6, 0.7, -59),
        },
        {
          id: "room-107",
          name: "Room 107 (Lecture Room)",
          floor: 1,
          position: new THREE.Vector3(-35, 0.7, -66.3),
        },
        {
          id: "room-108",
          name: "Room 108 (Lecture Room)",
          floor: 1,
          position: new THREE.Vector3(-42.3, 0.7, -73.5),
        },

        // 2nd floor
        {
          id: "room-203",
          name: "Room 203 (Lecture Room)",
          floor: 2,
          position: new THREE.Vector3(-20.5, 4.5, -52),
        },
        {
          id: "room-204",
          name: "Room 204 (Lecture Room)",
          floor: 2,
          position: new THREE.Vector3(-28, 4.5, -59),
        },
        {
          id: "room-205",
          name: "Room 205 (Physics Laboratory)",
          floor: 2,
          position: new THREE.Vector3(-35.2, 4.5, -66.4),
        },
        {
          id: "room-206",
          name: "Room 206 (Chemistry Laboratory)",
          floor: 2,
          position: new THREE.Vector3(-42.38, 4.5, -73.43),
        },
      ],
    ),
  },

  {
    id: "education-building",
    name: "Education Building",
    position: new THREE.Vector3(-10, 0.2, -197), // Center of Education Building zone
    highlighted: false,
    imageSrc: EDUCATION_BUILDING_IMAGE,
    kind: "building",
    rooms: withRoomOffsets(
      "education-building",
      new THREE.Vector3(-10, 0.2, -197),
      [
        // 1st floor
        {
          id: "room-117",
          name: "Room 117 (Lecture Room)",
          floor: 1,
          position: new THREE.Vector3(-26.73, 0.82, -207.15),
        },
        {
          id: "room-118",
          name: "Room 118 (Lecture Room)",
          floor: 1,
          position: new THREE.Vector3(-18.31, 0.82, -201.18),
        },
        {
          id: "room-119",
          name: "Room 119 (EdTech)",
          floor: 1,
          position: new THREE.Vector3(-5.78, 0.82, -191.96),
        },
        {
          id: "quality-assurance-office",
          name: "Quality Assurance Office",
          floor: 1,
          position: new THREE.Vector3(2.5, 0.82, -185.76),
        },
        {
          id: "csc",
          name: "Central Student Council Office",
          floor: 1,
          position: new THREE.Vector3(-8.71, 0.82, -194.19),
        },

        // 2nd floor
        {
          id: "room-212",
          name: "Room 212 (Lecture Room)",
          floor: 2,
          position: new THREE.Vector3(-26.62, 4.5, -207.1),
        },
        {
          id: "room-213",
          name: "Room 213 (Lecture Room)",
          floor: 2,
          position: new THREE.Vector3(-18.33, 4.5, -200.87),
        },
        {
          id: "room-214",
          name: "Room 214 (Lecture Room)",
          floor: 2,
          position: new THREE.Vector3(-5.9, 4.5, -191.78),
        },
        {
          id: "room-215",
          name: "Room 215 (Lecture Room)",
          floor: 2,
          position: new THREE.Vector3(2.25, 4.5, -185.64),
        },
        {
          id: "guidance-counselor-office",
          name: "Guidance Counselor Office",
          floor: 2,
          position: new THREE.Vector3(-8.53, 4.5, -193.82),
        },
      ],
    ),
  },
  
  {
    id: "engineering-building",
    name: "Engineering Building",
    position: new THREE.Vector3(-50, 0.2, -128), // Center of Engineering Building zone
    highlighted: false,
    imageSrc: ENGINEERING_BUILDING_IMAGE,
    kind: "building",
    rooms: withRoomOffsets(
      "engineering-building",
      new THREE.Vector3(-50, 0.2, -128),
      [
        // 1st floor
        {
          id: "room-109",
          name: "Room 109 (Lecture Room)",
          floor: 1,
          position: new THREE.Vector3(-50.84, 0.54, -89.86),
        },
        {
          id: "room-110",
          name: "Room 110 (Lecture Room)",
          floor: 1,
          position: new THREE.Vector3(-50.96, 0.54, -98.93),
        },
        {
          id: "room-111",
          name: "Room 111 (CE Laboratory)",
          floor: 1,
          position: new THREE.Vector3(-51.53, 0.54, -108.1),
        },
        {
          id: "room-112",
          name: "Room 112 (EE Laboratory)",
          floor: 1,
          position: new THREE.Vector3(-51.99, 0.54, -117.26),
        },
        {
          id: "room-113",
          name: "Room 113 (Lecture Room)",
          floor: 1,
          position: new THREE.Vector3(-52.53, 0.54, -131.12),
        },
        {
          id: "room-114",
          name: "Room 114 (Lecture Room)",
          floor: 1,
          position: new THREE.Vector3(-53.02, 0.54, -140.49),
        },
        {
          id: "room-115",
          name: "Room 115 (Lecture Room)",
          floor: 1,
          position: new THREE.Vector3(-53.69, 0.54, -149.62),
        },
        {
          id: "room-116",
          name: "Room 116 (Lecture Room)",
          floor: 1,
          position: new THREE.Vector3(-54.29, 0.54, -163.49),
        },

        // 2nd floor
        {
          id: "room-207",
          name: "Room 207 (ICT Laboratory 3)",
          floor: 2,
          position: new THREE.Vector3(-50.59, 4.08, -89.5),
        },
        {
          id: "room-208",
          name: "Room 208 (Drafting Laboratory)",
          floor: 2,
          position: new THREE.Vector3(-51.2, 4.08, -99.01),
        },
        {
          id: "room-209",
          name: "Room 209 (CEA Function Room)",
          floor: 2,
          position: new THREE.Vector3(-52.6, 4.08, -130.98),
        },
        {
          id: "room-210",
          name: "Room 210 (Lecture Room)",
          floor: 2,
          position: new THREE.Vector3(-53.36, 4.08, -149.67),
        },
        {
          id: "room-211",
          name: "Room 211 (Lecture Room)",
          floor: 2,
          position: new THREE.Vector3(-54.15, 4.08, -163.58),
        },
      ],
    ),
  },
  {
    id: "pylon",
    name: "Pylon",
    position: new THREE.Vector3(19, 1.2, -71), // Center of Pylon zone
    highlighted: false,
    imageSrc: PYLON_IMAGE,
    kind: "poi",
  },
  {
    id: "comlab-1",
    name: "ICT Laboratory 1",
    position: new THREE.Vector3(2, 0.2, -12.5), // Center of Comlab 1 zone
    highlighted: false,
    imageSrc: COMLAB1_IMAGE,
    kind: "poi",
  },
  {
    id: "comlab-2",
    name: "ICT Laboratory 2",
    position: new THREE.Vector3(12, 0.2, -26.2), // Center of Comlab 2 zone
    highlighted: false,
    imageSrc: COMLAB2_IMAGE,
    kind: "poi",
  },
];

/** Floor-zone names that differ from map pin display names. */
const FLOOR_ZONE_PIN_IDS: Record<string, string> = {
  Gymnasium: "gymnasium",
};

export function getPinForFloorZoneName(
  zoneName: string,
): FixedLocationPin | undefined {
  const normalized = zoneName.trim();
  return FIXED_LOCATION_PINS.find(
    (pin) =>
      pin.name.trim() === normalized ||
      pin.id === FLOOR_ZONE_PIN_IDS[normalized],
  );
}
