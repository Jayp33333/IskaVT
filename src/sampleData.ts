import * as THREE from "three";

export const IS_DEV = !import.meta.env.VITE_VIVERSE_APP_ID;

export const SAMPLE_AVATAR_LIST = IS_DEV
  ? [
      {
        headIconUrl:
          "https://avatar.viverse.com/api/meetingareaselector/v2/newgenavatar/avatars/408f3f59f9c088b2e5c1634ffb35fec3ad18ca294ef2e5eb6f418409a3f239ec294c/files?filetype=headicon",
        id: 184175,
        vrmUrl:
          "https://avatar.viverse.com/api/meetingareaselector/v2/newgenavatar/avatars/408f3f59f9c088b2e5c1634ffb35fec3ad18ca294ef2e5eb6f418409a3f239ec294c/files?filetype=model&lod=original",
      },

      {
        headIconUrl:
          "https://avatar.viverse.com/api/meetingareaselector/v2/newgenavatar/avatars/5c6b8578078c8e94f6361db9add7f541556c3dafdf3ff70c5fc99cbdc90116b865c1/files?filetype=headicon",
        id: 184207,
        vrmUrl:
          "https://avatar.viverse.com/api/meetingareaselector/v2/newgenavatar/avatars/5c6b8578078c8e94f6361db9add7f541556c3dafdf3ff70c5fc99cbdc90116b865c1/files?filetype=model&lod=original",
      },
    ]
  : [
      {
        headIconUrl:
          "https://avatar.viverse.com/api/meetingareaselector/v2/newgenavatar/avatars/408f3f59f9c088b2e5c1634ffb35fec3ad18ca294ef2e5eb6f418409a3f239ec294c/files?filetype=headicon",
        id: 184175,
        vrmUrl:
          "https://avatar.viverse.com/api/meetingareaselector/v2/newgenavatar/avatars/408f3f59f9c088b2e5c1634ffb35fec3ad18ca294ef2e5eb6f418409a3f239ec294c/files?filetype=model&lod=original",
      },
      {
        headIconUrl:
          "https://avatar.viverse.com/api/meetingareaselector/v2/newgenavatar/avatars/5c6b8578078c8e94f6361db9add7f541556c3dafdf3ff70c5fc99cbdc90116b865c1/files?filetype=headicon",
        id: 184207,
        vrmUrl:
          "https://avatar.viverse.com/api/meetingareaselector/v2/newgenavatar/avatars/5c6b8578078c8e94f6361db9add7f541556c3dafdf3ff70c5fc99cbdc90116b865c1/files?filetype=model&lod=original",
      },
    ];


export const DESTINATIONS = [
  // ===== GENERAL FACILITIES =====
  // { id: "canteen", name: "Canteen", position: new THREE.Vector3(0, 0, 0) },
  // { id: "enrollment", name: "Enrollment", position: new THREE.Vector3(0, 0, 0) },
  // { id: "library", name: "Library", position: new THREE.Vector3(0, 0, 0) },
  // { id: "gymnasium", name: "Gymnasium", position: new THREE.Vector3(-59.93, 0, 20) },
  { id: "grandstand", name: "Grandstand", position: new THREE.Vector3(-4.93, 0.1, -101.34) },
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
  { id: "room-103", name: "Room 103 (ICT Laboratory 1)", position: new THREE.Vector3(1.65, 0.1, -6.50) },
  { id: "room-104", name: "Room 104 (ICT Laboratory 2)", position: new THREE.Vector3(11.56, 0.1, -19.84) },
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
