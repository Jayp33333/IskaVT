import type { LucideIcon } from "lucide-react";
import { Building2, Footprints, Map, MonitorPlay } from "lucide-react";

export const homeWelcomeContent = {
  headline: "Explore PUP Lopez online before your visit.",
  image: "/images/campus-renderer.png",
  imageAlt: "ISKA Virtual Tour 3D campus preview",
  intro:
    "ISKA Virtual Tour (ISKA VT) is a 3D campus guide developed by DIT students at PUP Lopez. Navigate key buildings, view location details, and plan your route before arriving on campus.",
  highlights: [
    "Interactive 3D walkthrough of major campus areas",
    "Mini-map, location pins, and building information",
    "Free public access — no account required",
  ],
  projectCard: {
    role: "PUP Lopez Virtual Campus Tour",
    tagline: "For prospective students, parents, and visitors.",
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
        role: "Lead Dev · 3D Modeler",
        slug: "john-paul-jamito",
        image: "/images/developers/JohnPaulJamito.jpg",
        bio: "Leads overall development of ISKA VT and builds key 3D campus assets, coordinating frontend, backend, and modeling work to keep the platform stable and on track.",
        focus: ["System architecture", "3D modeling", "Integration"],
        socials: [
          {
            platform: "facebook",
            url: "https://www.facebook.com/johnpaul.jamito.585",
          },
        ],
      },
      {
        name: "Jaz Mostoles",
        role: "Co-Dev · 3D Modeler",
        slug: "jaz-mostoles",
        image: "/images/developers/JazMostoles.jpg",
        bio: "Co-develops the 3D campus experience and models buildings, characters, and tour assets — from movement mechanics to mini-map and in-tour interactions.",
        focus: ["Three.js", "3D modeling", "Tour mechanics"],
        socials: [
          { platform: "facebook", url: "https://www.facebook.com/jaz.selotsom" },
        ],
      },
      {
        name: "John Rainer Espineda",
        role: "Documentation · 3D Texturing",
        slug: "john-rainer-espineda",
        image: "/images/developers/JohnRainerEspineda.jpg",
        bio: "Prepares project documentation and applies textures to 3D campus models, helping keep guides, references, and in-tour visuals clear and polished.",
        focus: ["Technical writing", "3D texturing", "Project documentation"],
        socials: [
          { platform: "facebook", url: "https://www.facebook.com/rainier.69" },
        ],
      },
      {
        name: "Gilbert Velarde",
        role: "UI/UX · Documentation",
        slug: "gilbert-velarde",
        image: "/images/developers/GilbertVelarde.jpg",
        bio: "Shapes the look and feel of ISKA VT through UI/UX design and supports the team with clear documentation for pages, flows, and user-facing features.",
        focus: ["UI/UX design", "Visual design", "Documentation"],
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

export const homeExploreIntro = {
  headline: "Key buildings and landmarks available in the virtual tour.",
};

export const homeExploreLocations: HomeExploreLocation[] = [
  {
    name: "Administration Building",
    tag: "Offices",
    image: "/images/buildings/AdminBuilding.webp",
    highlights: ["Enrollment", "Registrar", "Accounting"],
    description:
      "Central offices for enrollment, registrar services, and student transactions.",
  },
  {
    name: "Pylon",
    tag: "Landmark",
    image: "/images/campus-image.jpg",
    highlights: ["Campus icon", "Photo spot", "Landmark"],
    description:
      "The iconic campus pylon at the heart of PUP Lopez.",
  },
  {
    name: "Yumul Building",
    tag: "Classrooms",
    image: "/images/buildings/YumulBuilding.png",
    highlights: ["Lectures", "Faculty offices", "Classrooms"],
    description:
      "Named after the Yumul family — home to classrooms and faculty offices.",
  },
  {
    name: "Comlab 1",
    tag: "Laboratories",
    image: "/images/buildings/Comlab1.jpg",
    highlights: ["Programming", "Research", "BSIT labs"],
    description:
      "Computer lab for programming, research, and IT coursework.",
  },
  {
    name: "Comlab 2",
    tag: "Laboratories",
    image: "/images/buildings/Comlab2.jpg",
    highlights: ["Digital projects", "Practical work", "Tech subjects"],
    description:
      "Additional lab space for digital projects and technology subjects.",
  },
  {
    name: "Engineering Building",
    tag: "Engineering",
    image: "/images/buildings/EngineeringBuilding.webp",
    highlights: ["Labs", "Drafting", "Technology programs"],
    description:
      "Engineering, architecture, and technology programs with specialized labs.",
  },
  {
    name: "Education Building",
    tag: "Education",
    image: "/images/buildings/EducationBuilding.png",
    highlights: ["Lectures", "Seminars", "Public admin"],
    description:
      "Education and public administration lectures, demos, and seminars.",
  },
  {
    name: "Health and Sciences Building",
    tag: "Sciences",
    image: "/images/buildings/HealthSciencesBuilding.webp",
    highlights: ["Science labs", "Major classes", "Research"],
    description:
      "Science laboratories, major program classes, and research activities.",
  },
  {
    name: "Nantes Building",
    tag: "Classrooms",
    image: "/images/buildings/NantesBuilding.webp",
    highlights: ["Lectures", "Minor subjects", "Study halls"],
    description:
      "Classrooms for lectures, minor subjects, and daily academic activities.",
  },
  {
    name: "Gymnasium",
    tag: "Events",
    image: "/images/buildings/Gymnasium.jpg",
    highlights: ["Sports", "PE classes", "Assemblies"],
    description:
      "Sports events, PE classes, assemblies, and campus gatherings.",
  },
  {
    name: "Grandstand",
    tag: "Outdoor",
    image: "/images/buildings/Grandstand.jpg",
    highlights: ["Events", "Assemblies", "Outdoor activities"],
    description:
      "Open-air venue for major events and outdoor campus activities.",
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
