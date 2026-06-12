import type { LucideIcon } from "lucide-react";
import {
  ArrowBigUp,
  DoorOpen,
  Hand,
  Map as MapIcon,
  MapPin,
  MessageCircle,
  MessageSquare,
  MousePointer2,
  Move,
  ScrollText,
  Search,
  Settings,
  UserRound,
  Zap,
} from "lucide-react";

export type GuideToolbarItem = {
  id: string;
  label: string;
  shortLabel: string;
  action: string;
  result: string;
  icon: LucideIcon;
  /** Optional avatar image instead of icon */
  imageSrc?: string;
  accent: string;
};

export type CampusGuideTip = {
  label: string;
  action: string;
  result: string;
  icon: LucideIcon;
  color: string;
  keys?: string[];
  touchHints?: string[];
};

export type GuideFlowStep = {
  title: string;
  description: string;
};

export type CampusGuidePage = {
  id: string;
  title: string;
  subtitle: string;
  intro?: string;
  layout: "hero" | "toolbar" | "controls" | "flow";
  image?: string;
  imageAlt?: string;
  toolbarItems?: GuideToolbarItem[];
  flowSteps?: GuideFlowStep[];
  tips: CampusGuideTip[];
  guideQuote?: string;
};

export const CAMPUS_GUIDE_PORTRAIT = "/images/headIconGirl.png";

export function getWelcomeTtsMessage(isMobile: boolean) {
  if (isMobile) {
    return "Welcome to the PUP Lopez Virtual Campus Tour. I'm ISKA, your guide. Use the toolbar on the top left to pick destinations and settings. Drag the joystick to move, and follow the on-screen prompts as you explore. Let's begin!";
  }
  return "Welcome to the PUP Lopez Virtual Campus Tour. I'm ISKA, your guide. Use the toolbar on the top left to pick destinations and settings. Use WASD to move, and follow the distance tracker as you explore. Let's begin!";
}

/** @deprecated Use getWelcomeTtsMessage(isMobile) */
export const WELCOME_TTS_MESSAGE = getWelcomeTtsMessage(false);

export function getArrivalTtsMessage(destinationLabel: string) {
  return `You have arrived at ${destinationLabel}. Feel free to explore this area and open Area Info for more details.`;
}

const toolbarItems: GuideToolbarItem[] = [
  {
    id: "avatar",
    label: "Avatar",
    shortLabel: "Avatar",
    action: "Tap your character portrait",
    result: "Choose ISKA or ISKO — your avatar updates in the 3D world.",
    icon: UserRound,
    imageSrc: "/images/iska-head-icon.png",
    accent: "bg-gold",
  },
  {
    id: "settings",
    label: "Settings",
    shortLabel: "Settings",
    action: "Open the gear icon",
    result: "Adjust camera, sensitivity, audio, and mobile control layout.",
    icon: Settings,
    accent: "bg-gold",
  },
  {
    id: "destinations",
    label: "Destinations",
    shortLabel: "Pin",
    action: "Tap the map-pin icon",
    result: "Search a building, select it, and a waypoint guides you there.",
    icon: MapPin,
    accent: "bg-gold",
  },
  {
    id: "logbook",
    label: "Visit History",
    shortLabel: "Log",
    action: "Open the scroll icon",
    result: "See past tours, visit times, and check out when you're done.",
    icon: ScrollText,
    accent: "bg-gold",
  },
  {
    id: "feedback",
    label: "Feedback",
    shortLabel: "Rate",
    action: "Tap the chat bubble icon",
    result: "Rate your tour and send comments to help us improve.",
    icon: MessageSquare,
    accent: "bg-gold",
  },
];

const welcomePage: CampusGuidePage = {
  id: "welcome",
  title: "Welcome to PUP Lopez",
  subtitle: "Start",
  layout: "hero",
  intro:
    "Walk a 3D replica of campus, visit buildings, talk to staff, and learn about each area — all from your browser.",
  image: "/images/campus-renderer.png",
  imageAlt: "3D preview of PUP Lopez campus",
  tips: [
    {
      label: "What you'll do",
      action: "Explore freely or pick a destination from the toolbar.",
      result: "A distance tracker guides you — follow it like an in-game quest marker.",
      icon: MapPin,
      color: "bg-emerald-400",
    },
    {
      label: "What you'll learn",
      action: "Walk near buildings and tap Area Info when it appears.",
      result: "Read descriptions, see photos, and hear narrated details.",
      icon: Search,
      color: "bg-blue-400",
    },
    {
      label: "Who you'll meet",
      action: "Approach guards and staff around campus.",
      result: "A Talk button appears — tap it (or press F on desktop) to chat.",
      icon: MessageCircle,
      color: "bg-pink-400",
    },
  ],
  guideQuote: "I'll walk you through the controls — it only takes a minute!",
};

const toolbarPage: CampusGuidePage = {
  id: "toolbar",
  title: "Your Game HUD",
  subtitle: "Toolbar",
  layout: "toolbar",
  intro:
    "Everything you need is in the gold toolbar at the top-left corner. Tap any button below to see what it does.",
  toolbarItems,
  tips: [],
  guideQuote: "The pin icon is your best friend — use it to jump to any building.",
};

const desktopControlsPage: CampusGuidePage = {
  id: "controls-desktop",
  title: "Move & Look",
  subtitle: "Controls",
  layout: "controls",
  intro: "Desktop controls work like a first-person game. Click the campus to lock your mouse, then explore.",
  image: "/images/campus-image.jpg",
  imageAlt: "PUP Lopez campus pylon landmark",
  tips: [
    {
      label: "Walk",
      action: "Press W A S D or the arrow keys.",
      result: "Your avatar moves in that direction across campus.",
      icon: Move,
      color: "bg-blue-400",
      keys: ["W", "A", "S", "D"],
    },
    {
      label: "Look around",
      action: "Move the mouse after clicking the scene.",
      result: "The camera follows your aim. Hold Alt to free the cursor for menus.",
      icon: MousePointer2,
      color: "bg-purple-400",
      keys: ["Mouse", "Alt"],
    },
    {
      label: "Sprint",
      action: "Hold Shift while moving.",
      result: "You run faster to reach destinations quicker.",
      icon: Zap,
      color: "bg-orange-400",
      keys: ["Shift"],
    },
    {
      label: "Campus map",
      action: "Press M or tap the circular map at the top-right.",
      result: "Pan, zoom, and teleport to any pinned location.",
      icon: MapIcon,
      color: "bg-emerald-400",
      keys: ["M"],
    },
  ],
  guideQuote: "Click the campus first — that locks your mouse so you can look around.",
};

const mobileControlsPage: CampusGuidePage = {
  id: "controls-mobile",
  title: "Move & Look",
  subtitle: "Controls",
  layout: "controls",
  intro: "Touch controls appear on screen while you play. You can drag them to new positions in Settings.",
  image: "/images/campus-image.jpg",
  imageAlt: "PUP Lopez campus pylon landmark",
  tips: [
    {
      label: "Walk",
      action: "Drag the gold joystick at the bottom-left.",
      result: "Push in any direction — your avatar walks that way.",
      icon: Move,
      color: "bg-blue-400",
      touchHints: ["Joystick"],
    },
    {
      label: "Look around",
      action: "Drag anywhere on the screen (not on a button).",
      result: "The camera turns so you can scan buildings and paths.",
      icon: Hand,
      color: "bg-purple-400",
      touchHints: ["Drag"],
    },
    {
      label: "Jump",
      action: "Tap the arrow button at the bottom-right.",
      result: "Hop over small obstacles or just have fun exploring.",
      icon: ArrowBigUp,
      color: "bg-orange-400",
      touchHints: ["Jump"],
    },
    {
      label: "Campus map",
      action: "Tap the circular map preview at the top-right.",
      result: "Open the full map, zoom in, and teleport to pins.",
      icon: MapIcon,
      color: "bg-emerald-400",
      touchHints: ["Map"],
    },
  ],
  guideQuote: "Tip: open Settings → Customize Layout if the joystick feels awkward to reach.",
};

const desktopPlayPage: CampusGuidePage = {
  id: "play-desktop",
  title: "How to Play",
  subtitle: "Explore",
  layout: "flow",
  intro: "Follow this loop to get the most out of your tour — it's the same flow every time.",
  image: "/images/CampusMap.png",
  imageAlt: "PUP Lopez campus map",
  flowSteps: [
    {
      title: "Pick a destination",
      description: "Toolbar → pin icon → search a building → select it.",
    },
    {
      title: "Follow the tracker",
      description: "A distance card appears top-left. Walk until it hits 0 m.",
    },
    {
      title: "Read Area Info",
      description: "An \"Area Info\" pill appears on the right when you're near a zone.",
    },
    {
      title: "Talk to NPCs",
      description: "Walk up to guards or staff — press F when the prompt appears.",
    },
    {
      title: "Enter buildings",
      description: "Stand at doorways — tap the gold Enter button to go inside.",
    },
  ],
  tips: [
    {
      label: "Quick map",
      action: "Press M anytime to open the full campus map.",
      result: "Pin a spot, then close the map and walk — or teleport instantly.",
      icon: MapIcon,
      color: "bg-emerald-400",
      keys: ["M"],
    },
    {
      label: "Arrival moment",
      action: "Reach your pinned destination.",
      result: "A celebration banner confirms you've arrived — explore the area!",
      icon: DoorOpen,
      color: "bg-amber-400",
    },
  ],
  guideQuote: "Try pinning the Pylon first — it's a great landmark to learn the controls.",
};

const mobilePlayPage: CampusGuidePage = {
  id: "play-mobile",
  title: "How to Play",
  subtitle: "Explore",
  layout: "flow",
  intro: "Follow this loop to get the most out of your tour — it's the same flow every time.",
  image: "/images/CampusMap.png",
  imageAlt: "PUP Lopez campus map",
  flowSteps: [
    {
      title: "Pick a destination",
      description: "Toolbar → pin icon → search a building → tap to select.",
    },
    {
      title: "Follow the tracker",
      description: "A distance card appears top-left. Walk until it hits 0 m.",
    },
    {
      title: "Read Area Info",
      description: "An \"Area Info\" button appears when you're inside a campus zone.",
    },
    {
      title: "Talk to NPCs",
      description: "Walk near guards or staff — tap Talk when the button appears.",
    },
    {
      title: "Enter buildings",
      description: "Stand at doorways — tap the gold Enter button to go inside.",
    },
  ],
  tips: [
    {
      label: "Quick map",
      action: "Tap the circular map at the top-right anytime.",
      result: "Pin a spot on the full map, then walk or teleport there.",
      icon: MapIcon,
      color: "bg-emerald-400",
      touchHints: ["Map"],
    },
    {
      label: "Arrival moment",
      action: "Reach your pinned destination.",
      result: "A celebration banner confirms you've arrived — look around!",
      icon: DoorOpen,
      color: "bg-amber-400",
    },
  ],
  guideQuote: "Try pinning the Pylon first — it's a great landmark to learn the controls.",
};

export function getCampusGuidePages(isMobile: boolean): CampusGuidePage[] {
  return [
    welcomePage,
    toolbarPage,
    isMobile ? mobileControlsPage : desktopControlsPage,
    isMobile ? mobilePlayPage : desktopPlayPage,
  ];
}

/** @deprecated Use getCampusGuidePages(isMobile) */
export const campusGuidePages = getCampusGuidePages(false);
