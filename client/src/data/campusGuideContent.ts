import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Map as MapIcon,
  MessageCircle,
  MousePointer2,
  Move,
  Navigation,
  UserRound,
  Zap,
} from "lucide-react";

export type CampusGuideTip = {
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
};

export type CampusGuidePage = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  tips: CampusGuideTip[];
  guideQuote?: string;
};

export const CAMPUS_GUIDE_PORTRAIT = "/images/headIconGirl.png";

export const campusGuidePages: CampusGuidePage[] = [
  {
    id: "welcome",
    title: "PUP Lopez Virtual Campus",
    image: "/images/campus-renderer.png",
    imageAlt: "3D preview of PUP Lopez campus",
    tips: [
      {
        label: "Your Avatar",
        description: "Third-person view as ISKA. Change style from the toolbar.",
        icon: UserRound,
        color: "bg-gold",
      },
      {
        label: "Visitor Logbook",
        description: "Your sign-in is saved for this session.",
        icon: Building2,
        color: "bg-blue-400",
      },
      {
        label: "Explore Freely",
        description: "Walk the campus and read area info near buildings.",
        icon: Navigation,
        color: "bg-emerald-400",
      },
    ],
    guideQuote: "Hi! I'm ISKA — let's explore PUP Lopez together.",
  },
  {
    id: "controls",
    title: "How to Move Around",
    image: "/images/campus-image.jpg",
    imageAlt: "PUP Lopez campus pylon landmark",
    tips: [
      {
        label: "Movement",
        description: "WASD or Arrow keys. Touch controls on mobile.",
        icon: Move,
        color: "bg-blue-400",
      },
      {
        label: "Camera",
        description: "Mouse or drag on screen to look around.",
        icon: MousePointer2,
        color: "bg-purple-400",
      },
      {
        label: "Sprint",
        description: "Hold Shift to run.",
        icon: Zap,
        color: "bg-orange-400",
      },
    ],
  },
  {
    id: "explore",
    title: "Campus Tools",
    image: "/images/CampusMap.png",
    imageAlt: "PUP Lopez campus map",
    tips: [
      {
        label: "Campus Map",
        description: "Press M to open the map and teleport to locations.",
        icon: MapIcon,
        color: "bg-emerald-400",
      },
      {
        label: "Talk to NPCs",
        description: "Press F near guards or staff for campus info.",
        icon: MessageCircle,
        color: "bg-pink-400",
      },
      {
        label: "Destinations",
        description: "Search buildings from the toolbar.",
        icon: Building2,
        color: "bg-amber-400",
      },
    ],
  },
];
