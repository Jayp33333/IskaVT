import type { LucideIcon } from "lucide-react";
import { Building2, Footprints, Map, MonitorPlay } from "lucide-react";

export const homeWelcomeContent = {
  headline:
    "Get to know PUP Lopez before your first day—explore the campus online, at your own pace.",
  image: "/images/campus-renderer.png",
  imageAlt: "ISKA Virtual Tour 3D campus preview",
  projectTitle: "About Our Project",
  projectIntro:
    "ISKA Virtual Tour (ISKA VT) is a 3D campus tour of PUP Lopez created by students in the Diploma in Information Technology program. You can walk through major areas, check building details, and learn where things are before you visit in person.",
  projectPurpose: {
    title: "Purpose",
    body: "Starting at a new school can feel overwhelming when you do not know where classrooms, offices, or landmarks are yet. ISKA VT helps prospective students, fresh enrollees, parents, alumni, and guests feel prepared with clear maps, routes, and location info in one place.",
  },
  projectVision: {
    title: "Vision",
    body: "We want ISKA VT to be the go-to online guide for PUP Lopez—friendly, easy to follow, and open to anyone who wants an honest preview of the campus, whether you are nearby or miles away.",
  },
  projectMission: {
    title: "Mission",
    body: "We keep the tour accurate and easy to use by combining 3D exploration with tools you can rely on—the mini-map, location pins, building info, tour guides, and avatars that help you find your way step by step.",
  },
  projectCard: {
    role: "PUP Lopez Virtual Campus Tour",
    bio: "Built by DIT students who wanted future Iskolar ng Bayan to feel at home on campus even before day one.",
    credit: "DIT Students",
  },
  projectDevelopers: {
    title: "Developed By",
    intro:
      "ISKA VT was designed and built by students from the Diploma in Information Technology (DIT) program at Polytechnic University of the Philippines Lopez.",
    program: "Diploma in Information Technology (DIT)",
    institution: "Polytechnic University of the Philippines — Lopez, Quezon",
    members: [
      {
        name: "John Paul Jamito",
        role: "Lead Developer",
        slug: "john-paul-jamito",
        image: "/images/developers/JohnPaulJamito.jpg",
        bio: "Leads the overall development of ISKA VT, coordinating frontend, 3D, and backend work to keep the platform stable and on track.",
        focus: ["System architecture", "Integration", "Code review"],
        socials: [
          {
            platform: "facebook",
            url: "https://www.facebook.com/johnpaul.jamito.585",
          },
        ],
      },
      {
        name: "Jaz Mostoles",
        role: "3D Developer",
        slug: "jaz-mostoles",
        image: "/images/developers/JazMostoles.jpg",
        bio: "Develops the 3D campus experience — character movement, building models, mini-map, and in-tour interactions.",
        focus: ["Three.js", "3D campus", "Tour mechanics"],
        socials: [
          { platform: "facebook", url: "https://www.facebook.com/jaz.selotsom" },
        ],
      },
      {
        name: "John Rainer Espineda",
        role: "Frontend Developer",
        slug: "john-rainer-espineda",
        image: "/images/developers/JohnRainerEspineda.jpg",
        bio: "Builds the marketing pages, UI components, and user-facing flows that make the virtual tour easy to discover and navigate.",
        focus: ["React UI", "Responsive design", "User experience"],
        socials: [
          { platform: "facebook", url: "https://www.facebook.com/rainier.69" },
        ],
      },
      {
        name: "Gilbert Velarde",
        role: "Backend Developer",
        slug: "gilbert-velarde",
        image: "/images/developers/GilbertVelarde.jpg",
        bio: "Handles the server, database, and APIs that power the logbook, feedback, contact messages, and admin dashboard.",
        focus: ["Node.js APIs", "Database", "Admin tools"],
        socials: [
          {
            platform: "facebook",
            url: "https://www.facebook.com/gilbertdandan.velarde",
          },
        ],
      },
    ],
  },
};

export type HomeHowItWorksStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const homeHowItWorksSteps: HomeHowItWorksStep[] = [
  {
    title: "Launch the Tour",
    description:
      'Click "Launch 3D Tour" in the navigation bar to enter the virtual campus. No login required for the public preview.',
    icon: MonitorPlay,
  },
  {
    title: "Explore Freely",
    description:
      "Move around using keyboard or on-screen controls. Switch between first-person and third-person views anytime.",
    icon: Footprints,
  },
  {
    title: "Use the Mini-Map",
    description:
      "Open the mini-map to see your position, teleport to pinned destinations, and plan your route across campus.",
    icon: Map,
  },
  {
    title: "Discover Landmarks",
    description:
      "Approach buildings to see area details and read location information as you explore.",
    icon: Building2,
  },
];

export type HomeExploreLocation = {
  name: string;
  tag: string;
  image: string;
  highlights: string[];
  description: string;
};

export const homeExploreLocations: HomeExploreLocation[] = [
  {
    name: "Administration Building",
    tag: "Offices",
    image: "/images/buildings/AdminBuilding.webp",
    highlights: ["Enrollment", "Registrar", "Accounting"],
    description:
      "The main hub for enrollment, registrar services, accounting, and student transactions.",
  },
  {
    name: "Pylon",
    tag: "Landmark",
    image: "/images/campus-image.jpg",
    highlights: ["Campus icon", "Photo spot", "Central landmark"],
    description:
      "The iconic campus pylon — a recognizable landmark at the heart of PUP Lopez.",
  },
  {
    name: "Yumul Building",
    tag: "Classrooms",
    image: "/images/buildings/YumulBuilding.png",
    highlights: ["Lectures", "Faculty offices", "Classrooms"],
    description:
      "A historically significant building named after the Yumul family, home to classrooms and academic offices.",
  },
  {
    name: "Comlab 1",
    tag: "Laboratories",
    image: "/images/buildings/Comlab1.jpg",
    highlights: ["Programming", "Research", "BSIT labs"],
    description:
      "Computer laboratory for programming, research, and IT-related coursework by BSIT and other programs.",
  },
  {
    name: "Comlab 2",
    tag: "Laboratories",
    image: "/images/buildings/Comlab2.jpg",
    highlights: ["Digital projects", "Practical work", "Tech subjects"],
    description:
      "Additional computer lab space for digital projects, practical exercises, and technology subjects.",
  },
  {
    name: "Engineering Building",
    tag: "Engineering",
    image: "/images/buildings/EngineeringBuilding.webp",
    highlights: ["Labs", "Drafting", "Technology programs"],
    description:
      "Home to engineering, architecture, and technology programs with labs, drafting areas, and specialized classes.",
  },
  {
    name: "Education Building",
    tag: "Education",
    image: "/images/buildings/EducationBuilding.png",
    highlights: ["Lectures", "Seminars", "Public admin"],
    description:
      "Used for education and public administration programs, lectures, demonstrations, and seminars.",
  },
  {
    name: "Health and Sciences Building",
    tag: "Sciences",
    image: "/images/buildings/HealthSciencesBuilding.webp",
    highlights: ["Science labs", "Major classes", "Research"],
    description:
      "Main venue for science-related subjects, laboratory activities, and major program classes.",
  },
  {
    name: "Nantes Building",
    tag: "Classrooms",
    image: "/images/buildings/NantesBuilding.webp",
    highlights: ["Lectures", "Minor subjects", "Study halls"],
    description:
      "Classroom building for regular lectures, minor subjects, and academic activities across programs.",
  },
  {
    name: "Gymnasium",
    tag: "Events",
    image: "/images/buildings/Gymnasium.jpg",
    highlights: ["Sports", "PE classes", "Assemblies"],
    description:
      "The main venue for sports, PE classes, assemblies, intramurals, and large campus gatherings.",
  },
  {
    name: "Grandstand",
    tag: "Outdoor",
    image: "/images/buildings/Grandstand.jpg",
    highlights: ["Events", "Assemblies", "Outdoor activities"],
    description:
      "Open-air space for major events, assemblies, and outdoor campus activities.",
  },
];

export const homeAudienceCards = [
  {
    title: "Prospective Students",
    description:
      "Preview campus facilities, locate buildings, and get a feel for student life before enrollment day.",
  },
  {
    title: "New Enrollees",
    description:
      "Find your classrooms, admin offices, and key services without getting lost on your first week.",
  },
  {
    title: "Parents & Visitors",
    description:
      "Tour the campus remotely and understand where your child studies, eats, and attends activities.",
  },
  {
    title: "Alumni & Partners",
    description:
      "Reconnect with campus landmarks and see how PUP Lopez continues to grow and modernize.",
  },
];

export const homeCtaContent = {
  title: "Ready to Walk the",
  highlight: "Campus?",
  description:
    "Start the 3D tour now, or explore features, campus info, and contact options before your visit.",
};
