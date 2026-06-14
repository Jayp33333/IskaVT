import type { LucideIcon } from "lucide-react";
import {
  ArrowUp,
  BookOpen,
  Camera,
  FolderOpen,
  Gauge,
  Headphones,
  Map,
  MapPin,
  Maximize2,
  MessageCircle,
  Monitor,
  MousePointer2,
  Move,
  Music,
  ScrollText,
  Settings,
  SlidersHorizontal,
  Sun,
  SunDim,
  Upload,
  User,
  UserRound,
  Users,
  Volume2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export type ToolbarHighlight =
  | "avatar"
  | "settings"
  | "destinations"
  | "guide"
  | "logbook"
  | "feedback";

export type GuidePreviewKind =
  | "toolbar"
  | "avatar-picker"
  | "settings-panel"
  | "settings-tabs"
  | "settings-card"
  | "camera-picker"
  | "map-controls"
  | "movement-touch"
  | "movement-keys"
  | "slider"
  | "icon";

export type GuideSettingsDetail = "tabs-only" | "card" | "slider" | "camera";

export type GuidePreview = {
  icon: LucideIcon;
  kind: GuidePreviewKind;
  toolbarHighlight?: ToolbarHighlight;
  settingsTab?: "display" | "controls" | "audio";
  settingsDetail?: GuideSettingsDetail;
  showToggle?: boolean;
  showSlider?: boolean;
};

export const TOOLBAR_PREVIEW_ITEMS: {
  id: ToolbarHighlight;
  icon: LucideIcon;
}[] = [
  { id: "avatar", icon: UserRound },
  { id: "settings", icon: Settings },
  { id: "destinations", icon: MapPin },
  { id: "guide", icon: BookOpen },
  { id: "logbook", icon: ScrollText },
  { id: "feedback", icon: MessageCircle },
];

const CATEGORY_PREVIEWS: Record<string, GuidePreview> = {
  basics: { icon: BookOpen, kind: "toolbar", toolbarHighlight: "guide" },
  movement: { icon: Move, kind: "movement-touch" },
  map: { icon: Map, kind: "map-controls" },
  settings: {
    icon: Settings,
    kind: "settings-panel",
    settingsTab: "display",
    settingsDetail: "tabs-only",
  },
};

const ARTICLE_PREVIEWS: Record<string, GuidePreview> = {
  toolbar: { icon: BookOpen, kind: "toolbar", toolbarHighlight: "guide" },
  avatar: { icon: UserRound, kind: "avatar-picker" },
  destinations: { icon: MapPin, kind: "toolbar", toolbarHighlight: "destinations" },
  logbook: { icon: ScrollText, kind: "toolbar", toolbarHighlight: "logbook" },
  feedback: { icon: MessageCircle, kind: "toolbar", toolbarHighlight: "feedback" },
  "settings-overview": {
    icon: Settings,
    kind: "settings-panel",
    settingsTab: "display",
    settingsDetail: "tabs-only",
  },
  "show-fps": {
    icon: Gauge,
    kind: "settings-panel",
    settingsTab: "display",
    settingsDetail: "card",
    showToggle: true,
  },
  shadows: {
    icon: Sun,
    kind: "settings-panel",
    settingsTab: "display",
    settingsDetail: "card",
    showToggle: true,
  },
  "light-intensity": {
    icon: SunDim,
    kind: "settings-panel",
    settingsTab: "display",
    settingsDetail: "slider",
    showSlider: true,
  },
  camera: {
    icon: Camera,
    kind: "settings-panel",
    settingsTab: "display",
    settingsDetail: "camera",
  },
  sensitivity: {
    icon: MousePointer2,
    kind: "settings-panel",
    settingsTab: "controls",
    settingsDetail: "slider",
    showSlider: true,
  },
  "mobile-controls": {
    icon: Move,
    kind: "settings-panel",
    settingsTab: "controls",
    settingsDetail: "card",
  },
  volume: {
    icon: Volume2,
    kind: "settings-panel",
    settingsTab: "audio",
    settingsDetail: "card",
    showToggle: true,
  },
  "custom-music": {
    icon: FolderOpen,
    kind: "settings-panel",
    settingsTab: "audio",
    settingsDetail: "card",
  },
  "background-music": {
    icon: Music,
    kind: "settings-panel",
    settingsTab: "audio",
    settingsDetail: "slider",
    showSlider: true,
  },
  fullscreen: {
    icon: Maximize2,
    kind: "settings-panel",
    settingsTab: "audio",
    settingsDetail: "card",
  },
  joystick: { icon: Move, kind: "movement-touch" },
  look: { icon: Move, kind: "movement-touch" },
  jump: { icon: ArrowUp, kind: "icon" },
  wasd: { icon: Move, kind: "movement-keys" },
  mouse: { icon: MousePointer2, kind: "icon" },
  minimap: { icon: Map, kind: "map-controls" },
  "map-fixed-locations": { icon: MapPin, kind: "map-controls" },
  "map-zoom-in": { icon: ZoomIn, kind: "map-controls" },
  "map-zoom-out": { icon: ZoomOut, kind: "map-controls" },
  "map-reset-view": { icon: Maximize2, kind: "map-controls" },
  "map-drop-pin": { icon: MapPin, kind: "map-controls" },
  "map-pin-actions": { icon: Upload, kind: "map-controls" },
};

export function getGuideArticlePreview(
  articleId: string,
  categoryId: string,
): GuidePreview {
  return (
    ARTICLE_PREVIEWS[articleId] ??
    CATEGORY_PREVIEWS[categoryId] ?? {
      icon: BookOpen,
      kind: "icon",
    }
  );
}

export const SETTINGS_TAB_PREVIEW = [
  { id: "display" as const, label: "Display", icon: Monitor },
  { id: "controls" as const, label: "Controls", icon: SlidersHorizontal },
  { id: "audio" as const, label: "Audio", icon: Headphones },
];

export const CAMERA_PREVIEW_OPTIONS = [
  { id: "first", label: "1st Person", icon: User },
  { id: "third", label: "3rd Person", icon: Users },
];

export const AVATAR_PICKER_PREVIEW = [
  {
    id: "iska",
    label: "ISKA",
    imageSrc: "/images/iska-head-icon.png",
    selected: true,
  },
  {
    id: "isko",
    label: "ISKO",
    imageSrc: "/images/isko-head-icon.png",
    selected: false,
  },
] as const;

export const MAP_CONTROL_PREVIEW = [
  { icon: ZoomIn },
  { icon: ZoomOut },
  { icon: Maximize2 },
];

export const MOVEMENT_KEYS_PREVIEW = ["W", "A", "S", "D"];
