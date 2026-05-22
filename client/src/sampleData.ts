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
      },

      {
        headIconUrl: "images/isko-head-icon.png",
        id: 2,
        vrmUrl: "models/avatars/Isko.vrm",
      },
    ]
  : [
      {
        headIconUrl: "images/iska-head-icon.png",
        id: 1,
        vrmUrl: "models/avatars/Iska.vrm",
      },

      {
        headIconUrl: "images/isko-head-icon.png",
        id: 2,
        vrmUrl: "models/avatars/Isko.vrm",
      },
    ];

export const DESTINATIONS = [
  // ===== GENERAL FACILITIES =====
  // { id: "canteen", name: "Canteen", position: new THREE.Vector3(0, 0, 0) },
  // { id: "enrollment", name: "Enrollment", position: new THREE.Vector3(0, 0, 0) },
  // { id: "library", name: "Library", position: new THREE.Vector3(0, 0, 0) },
  // { id: "gymnasium", name: "Gymnasium", position: new THREE.Vector3(-59.93, 0, 20) },
  {
    id: "grandstand",
    name: "Grandstand",
    position: new THREE.Vector3(-4.93, 0.1, -101.34),
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
    name: "Room 103 (ICT Laboratory 1)",
    position: new THREE.Vector3(1.65, 0.1, -6.5),
  },
  {
    id: "room-104",
    name: "Room 104 (ICT Laboratory 2)",
    position: new THREE.Vector3(11.56, 0.1, -19.84),
  },
  // { id: "room-105", name: "Room 105 (Food Laboratory)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-106", name: "Room 106 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-107", name: "Room 107 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-108", name: "Room 108 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-109", name: "Room 109 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-110", name: "Room 110 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-111", name: "Room 111 (CE Laboratory)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-112", name: "Room 112 (EE Laboratory)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-113", name: "Room 113 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-114", name: "Room 114 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-115", name: "Room 115 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-116", name: "Room 116 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-117", name: "Room 117 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-118", name: "Room 118 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-119", name: "Room 119 (EdTech)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-120", name: "Room 120 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-121", name: "Room 121 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-122", name: "Room 122 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },

  // ===== SECOND FLOOR =====
  // { id: "room-200", name: "Room 200", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-201", name: "Room 201", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-202", name: "Room 202", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-203", name: "Room 203 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-204", name: "Room 204 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-205", name: "Room 205 (Physics Laboratory)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-206", name: "Room 206 (Chemistry Laboratory)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-207", name: "Room 207 (ICT Laboratory 3)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-208", name: "Room 208 (Drafting Laboratory)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-209", name: "Room 209 (CEA Function Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-210", name: "Room 210 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-211", name: "Room 211 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-212", name: "Room 212 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-213", name: "Room 213 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-214", name: "Room 214 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },
  // { id: "room-215", name: "Room 215 (Lecture Room)", position: new THREE.Vector3(0, 0, 0) },

  // ===== SPECIAL ROOMS =====
  // { id: "avr", name: "AVR", position: new THREE.Vector3(0, 0, 0) },
  // { id: "simulation", name: "Simulation Room", position: new THREE.Vector3(0, 0, 0) },
  // { id: "keyboard-lab", name: "Keyboard Laboratory", position: new THREE.Vector3(0, 0, 0) },
  // { id: "speech-lab", name: "Speech Laboratory", position: new THREE.Vector3(0, 0, 0) },

  // ===== AGRI & OTHERS =====
  // { id: "agri", name: "Agri Business Farm", position: new THREE.Vector3(0, 0, 0) },
];

export const floorZones = [
  { name: "Main Gate", xMin: 5, xMax: 12, zMin: -3, zMax: 8, yMin: 0, yMax: 3 },
  {
    name: "Comlab 1",
    xMin: -12,
    xMax: 1.6,
    zMin: -16.5,
    zMax: -4.4,
    yMin: 0,
    yMax: 3,
  },
  {
    name: "Comlab 2",
    xMin: -0.37,
    xMax: 11.37,
    zMin: -30.44,
    zMax: -18.59,
    yMin: 0,
    yMax: 3,
  },

  {
    name: "Yumul Building",
    xMin: 42.87,
    xMax: 60,
    zMin: -61,
    zMax: -6,
    yMin: 0,
    yMax: 3,
  },
  { name: "Library", xMin: -10, xMax: 0, zMin: 10, zMax: 20, yMin: 0, yMax: 3 },
  {
    name: "Administration Building",
    xMin: 13.5,
    xMax: 63.37,
    zMin: -1.87,
    zMax: 7.58,
    yMin: 0,
    yMax: 5,
  },
  {
    name: "Pylon",
    xMin: 10.7,
    xMax: 21.13,
    zMin: -77.56,
    zMax: -69.18,
    yMin: 0,
    yMax: 5,
  },
  {
    name: "Business and Accountancy Building",
    xMin: 10.7,
    xMax: 26.5,
    zMin: -178.4,
    zMax: -108.62,
    yMin: 0,
    yMax: 7,
  },

  // {
  //   name: "PUP Gymnasium",
  //   xMin: 10.7,
  //   xMax: 26.5,
  //   zMin: -178.40,
  //   zMax: -108.62,
  //   yMin: 0,
  //   yMax: 7,
  // },
  {
    name: "Grandstand",
    xMin: -7.3,
    xMax: 4.7,
    zMin: -137.71,
    zMax: -110.1,
    yMin: 0,
    yMax: 7,
  },
  {
    name: "Health and Sciences Building",
    xMin: -97.44,
    xMax: -30.85,
    zMin: -58.33,
    zMax: -37.75,
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
];

const DEFAULT_LOCATION_IMAGE = "/images/campus-image.jpg";

function withRoomOffsets(
  buildingId: string,
  center: THREE.Vector3,
  rooms: Array<{
    name: string;
    floor?: number;
    yOffset?: number; // Y offset relative to building center (per-building floor heights)
    y?: number; // override absolute Y directly if needed
    xOffset: number;
    zOffset: number;
    imageSrc?: string;
  }>,
): FixedLocationRoom[] {
  return rooms.map((r, idx) => {
    const y =
      typeof r.y === "number"
        ? r.y
        : center.y + (typeof r.yOffset === "number" ? r.yOffset : 0);

    return {
      id: `${buildingId}-room-${idx + 1}`,
      name: r.name,
      floor: r.floor,
      position: new THREE.Vector3(
        center.x + r.xOffset,
        y,
        center.z + r.zOffset,
      ),
      imageSrc: r.imageSrc ?? DEFAULT_LOCATION_IMAGE,
    };
  });
}

// Fixed location pins for minimap
// These represent points of interest that are always visible on the minimap
export const FIXED_LOCATION_PINS: FixedLocationPin[] = [
  {
    id: "grandstand",
    name: "Grandstand",
    position: new THREE.Vector3(-1.3, 0.2, -123.9), // Center of Grandstand zone
    highlighted: true, // Yellow pin with label
    imageSrc: DEFAULT_LOCATION_IMAGE,
    kind: "poi",
  },
  {
    id: "yumul-building",
    name: "Yumul Building",
    position: new THREE.Vector3(51.4, 0.2, -33.5), // Center of Yumul Building zone
    highlighted: false,
    imageSrc: DEFAULT_LOCATION_IMAGE,
    kind: "building",
    // 18 rooms total: 6 per floor (1st/2nd/3rd). Replace names + offsets as needed.
    rooms: withRoomOffsets(
      "yumul-building",
      new THREE.Vector3(51.4, 0.2, -33.5),
      [
        // 1st floor (yOffset relative to building center)
        {
          name: "Room 1 (set name)",
          floor: 1,
          yOffset: 0,
          xOffset: -3.2,
          zOffset: -1.6,
        },
        {
          name: "Room 2 (set name)",
          floor: 1,
          yOffset: 0,
          xOffset: 0,
          zOffset: -1.6,
        },
        {
          name: "CSC Office",
          floor: 1,
          yOffset: 0,
          xOffset: 3.2,
          zOffset: -1.6,
        },
        {
          name: "Room 4 (set name)",
          floor: 1,
          yOffset: 0,
          xOffset: -3.2,
          zOffset: 1.6,
        },
        {
          name: "Room 5 (set name)",
          floor: 1,
          yOffset: 0,
          xOffset: 0,
          zOffset: 1.6,
        },
        {
          name: "Room 6 (set name)",
          floor: 1,
          yOffset: 0,
          xOffset: 3.2,
          zOffset: 1.6,
        },

        // 2nd floor
        {
          name: "Room 7 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: -3.2,
          zOffset: -1.6,
        },
        {
          name: "Room 8 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: 0,
          zOffset: -1.6,
        },
        {
          name: "Room 9 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: 3.2,
          zOffset: -1.6,
        },
        {
          name: "Room 10 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: -3.2,
          zOffset: 1.6,
        },
        {
          name: "Room 11 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: 0,
          zOffset: 1.6,
        },
        {
          name: "Room 12 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: 3.2,
          zOffset: 1.6,
        },

        // 3rd floor
        {
          name: "Room 13 (set name)",
          floor: 3,
          yOffset: 8.4,
          xOffset: -3.2,
          zOffset: -1.6,
        },
        {
          name: "Room 14 (set name)",
          floor: 3,
          yOffset: 8.4,
          xOffset: 0,
          zOffset: -1.6,
        },
        {
          name: "Room 15 (set name)",
          floor: 3,
          yOffset: 8.4,
          xOffset: 3.2,
          zOffset: -1.6,
        },
        {
          name: "Room 16 (set name)",
          floor: 3,
          yOffset: 8.4,
          xOffset: -3.2,
          zOffset: 1.6,
        },
        {
          name: "Room 17 (set name)",
          floor: 3,
          yOffset: 8.4,
          xOffset: 0,
          zOffset: 1.6,
        },
        {
          name: "Room 18 (set name)",
          floor: 3,
          yOffset: 8.4,
          xOffset: 3.2,
          zOffset: 1.6,
        },
      ],
    ),
  },
  {
    id: "administration-building",
    name: "Administration Building",
    position: new THREE.Vector3(38.4, 0.2, 2.85), // Center of Administration Building zone
    highlighted: false,
    imageSrc: DEFAULT_LOCATION_IMAGE,
    kind: "building",
    rooms: withRoomOffsets(
      "administration-building",
      new THREE.Vector3(38.4, 0.2, 2.85),
      [
        // 1st floor
        {
          name: "Accounting Office",
          floor: 1,
          yOffset: 0,
          xOffset: -18,
          zOffset: -2.5,
        },
        {
          name: "Fund Management Office",
          floor: 1,
          yOffset: 0,
          xOffset: 2.5,
          zOffset: -2.5,
        },
        {
          name: "Office of the Registrar",
          floor: 1,
          yOffset: 0,
          xOffset: 0,
          zOffset: -2.5,
        },
        {
          name: "Admission Office",
          floor: 1,
          yOffset: 0,
          xOffset: 15,
          zOffset: -2.5,
        },
        // 2nd floor
        // Adjust yOffset (height) for your model's 2nd floor
        {
          name: "Office of Head",
          floor: 2,
          yOffset: 4.2,
          xOffset: -2.5,
          zOffset: -2.5,
        },
        {
          name: "Office of the Director",
          floor: 2,
          yOffset: 4,
          xOffset: 10,
          zOffset: -2.5,
        },
      ],
    ),
  },
  {
    id: "business-accountancy",
    name: "Business and Accountancy Building",
    position: new THREE.Vector3(20.6, 0.2, -143.5), // Center of Business and Accountancy Building zone
    highlighted: false,
    imageSrc: DEFAULT_LOCATION_IMAGE,
    kind: "building",
    // 2 floors: 4 rooms each (edit names + offsets as needed)
    rooms: withRoomOffsets(
      "business-accountancy",
      new THREE.Vector3(18.6, 0.2, -143.5),
      [
        // 1st floor
        {
          name: "Room 1 (set name)",
          floor: 1,
          yOffset: 1,
          xOffset: -2.4,
          zOffset: -1.6,
        },
        {
          name: "Room 2 (set name)",
          floor: 1,
          yOffset: 1,
          xOffset: 2.4,
          zOffset: -1.6,
        },
        {
          name: "Room 3 (set name)",
          floor: 1,
          yOffset: 1,
          xOffset: -2.4,
          zOffset: 1.6,
        },
        {
          name: "Room 4 (set name)",
          floor: 1,
          yOffset: 1,
          xOffset: 2.4,
          zOffset: 1.6,
        },

        // 2nd floor
        {
          name: "Room 5 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: -2.4,
          zOffset: -1.6,
        },
        {
          name: "Room 6 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: 2.4,
          zOffset: -1.6,
        },
        {
          name: "Room 7 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: -2.4,
          zOffset: 1.6,
        },
        {
          name: "Room 8 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: 2.4,
          zOffset: 1.6,
        },
      ],
    ),
  },
  {
    id: "health-sciences",
    name: "Health and Sciences Building",
    position: new THREE.Vector3(-64.1, 0.2, -48.0), // Center of Health and Sciences Building zone
    highlighted: false,
    imageSrc: DEFAULT_LOCATION_IMAGE,
    kind: "building",
    // 16 rooms total: 8 per floor (1st/2nd). Replace names + offsets as needed.
    rooms: withRoomOffsets(
      "health-sciences",
      new THREE.Vector3(-64.1, 0.2, -48.0),
      [
        // 1st floor
        {
          name: "Room 1 (set name)",
          floor: 1,
          yOffset: 0,
          xOffset: -4.8,
          zOffset: -1.6,
        },
        {
          name: "Room 2 (set name)",
          floor: 1,
          yOffset: 0,
          xOffset: -1.6,
          zOffset: -1.6,
        },
        {
          name: "Room 3 (set name)",
          floor: 1,
          yOffset: 0,
          xOffset: 1.6,
          zOffset: -1.6,
        },
        {
          name: "Room 4 (set name)",
          floor: 1,
          yOffset: 0,
          xOffset: 4.8,
          zOffset: -1.6,
        },
        {
          name: "Room 5 (set name)",
          floor: 1,
          yOffset: 0,
          xOffset: -4.8,
          zOffset: 1.6,
        },
        {
          name: "Room 6 (set name)",
          floor: 1,
          yOffset: 0,
          xOffset: -1.6,
          zOffset: 1.6,
        },
        {
          name: "Room 7 (set name)",
          floor: 1,
          yOffset: 0,
          xOffset: 1.6,
          zOffset: 1.6,
        },
        {
          name: "Room 8 (set name)",
          floor: 1,
          yOffset: 0,
          xOffset: 4.8,
          zOffset: 1.6,
        },

        // 2nd floor
        {
          name: "Room 9 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: -4.8,
          zOffset: -1.6,
        },
        {
          name: "Room 10 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: -1.6,
          zOffset: -1.6,
        },
        {
          name: "Room 11 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: 1.6,
          zOffset: -1.6,
        },
        {
          name: "Room 12 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: 4.8,
          zOffset: -1.6,
        },
        {
          name: "Room 13 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: -4.8,
          zOffset: 1.6,
        },
        {
          name: "Room 14 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: -1.6,
          zOffset: 1.6,
        },
        {
          name: "Room 15 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: 1.6,
          zOffset: 1.6,
        },
        {
          name: "Room 16 (set name)",
          floor: 2,
          yOffset: 4.2,
          xOffset: 4.8,
          zOffset: 1.6,
        },
      ],
    ),
  },
  {
    id: "pylon",
    name: "Pylon",
    position: new THREE.Vector3(15.9, 1.2, -73.4), // Center of Pylon zone
    highlighted: false,
    imageSrc: DEFAULT_LOCATION_IMAGE,
    kind: "poi",
  },
  {
    id: "comlab-1",
    name: "Comlab 1",
    position: new THREE.Vector3(-5.2, 0.2, -10.45), // Center of Comlab 1 zone
    highlighted: false,
    imageSrc: DEFAULT_LOCATION_IMAGE,
    kind: "poi",
  },
  {
    id: "comlab-2",
    name: "Comlab 2",
    position: new THREE.Vector3(5.5, 0.2, -24.5), // Center of Comlab 2 zone
    highlighted: false,
    imageSrc: DEFAULT_LOCATION_IMAGE,
    kind: "poi",
  },
  {
    id: "main-gate",
    name: "Main Gate",
    position: new THREE.Vector3(8.5, 0.2, 2.5), // Center of Main Gate zone
    highlighted: false,
    imageSrc: DEFAULT_LOCATION_IMAGE,
    kind: "poi",
  },
];
