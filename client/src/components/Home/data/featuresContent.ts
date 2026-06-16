import type { LucideIcon } from "lucide-react";
import {
  MapPin,
  UserCircle,
  Map,
  Navigation,
  Info,
  MessageSquare,
} from "lucide-react";

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string;
  color: "gold" | "maroon" | "white";
};

export const featuresPageIntro = {
  title: "Tour Features",
  description:
    "ISKA Virtual Tour is packed with tools that make campus exploration intuitive, interactive, and fun. Browse every capability below and see how each one helps you navigate PUP Lopez.",
};

export const featureItems: FeatureItem[] = [
  {
    icon: MapPin,
    title: "Interactive 3D Campus",
    description:
      "Fully modeled 3D representation of PUP Lopez. Explore buildings and walk through an immersive environment.",
    details:
      "Buildings, pathways, and landmarks are reconstructed in 3D so you can orient yourself before visiting in person. The environment supports free movement across open areas and building exteriors.",
    color: "gold",
  },
  {
    icon: UserCircle,
    title: "Playable Tour Guide",
    description:
      "Toggle between first and third-person views with a customizable character leading your journey.",
    details:
      "Control a character avatar as you explore. Switch camera perspectives to get a closer look at surroundings or a wider view while navigating between destinations.",
    color: "maroon",
  },
  {
    icon: Map,
    title: "Mini-Map Navigation",
    description:
      "Real-time position tracking with clickable teleportation icons and pinned destinations.",
    details:
      "The mini-map shows your live position on campus. Click pinned locations to jump directly to key buildings and points of interest without walking the full distance.",
    color: "white",
  },
  {
    icon: Navigation,
    title: "Guided Wayfinding",
    description:
      "Dynamic guide lines and distance meters help you find any building with precision.",
    details:
      "Select a destination and follow the glowing path line with distance readouts. Wayfinding keeps you on track even when exploring large areas like the gymnasium or Nantes Building.",
    color: "white",
  },
  {
    icon: Info,
    title: "Area Detection",
    description:
      "Automatic landmark identification. The system displays building names as you approach them.",
    details:
      "When you enter a mapped zone, the tour recognizes your location and surfaces building names and descriptions. Tap for more details about offices, labs, and facilities nearby.",
    color: "maroon",
  },
  {
    icon: MessageSquare,
    title: "NPC Dialog System",
    description:
      "Interact with characters across campus to receive helpful information and instructions.",
    details:
      "Campus NPCs provide contextual tips about buildings, services, and navigation. They act as friendly guides for first-time visitors and new students.",
    color: "gold",
  },
];

export const featureCategories = [
  {
    title: "Navigation",
    summary:
      "Find your way with maps, guide lines, and teleport pins designed for quick orientation.",
    items: ["Mini-Map Navigation", "Guided Wayfinding", "Area Detection"],
  },
  {
    title: "Exploration",
    summary:
      "Walk the campus in 3D with a playable character and discover landmarks at your own pace.",
    items: ["Interactive 3D Campus", "Playable Tour Guide"],
  },
  {
    title: "Information",
    summary:
      "Learn about each location through automatic area labels and NPC conversations.",
    items: ["Area Detection", "NPC Dialog System"],
  },
];
