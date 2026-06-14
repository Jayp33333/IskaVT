import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Compass,
  Map,
  Settings,
} from "lucide-react";
import { getTourCoachSteps } from "./tourCoachSteps";

export type GuideSettingsTab = "display" | "controls" | "audio";

export type GuideArticle = {
  id: string;
  title: string;
  body: string;
  /** In-world spotlight tour step */
  tourStepId?: string;
  /** Opens settings panel on this tab */
  settingsTab?: GuideSettingsTab;
  mobileOnly?: boolean;
};

export type GuideCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
  articles: GuideArticle[];
};

const displayArticles: GuideArticle[] = [
  {
    id: "settings-overview",
    title: "Settings Menu",
    body: "Open the gear icon on the toolbar to adjust display, controls, and audio. Use the tabs inside to switch sections.",
    tourStepId: "settings",
    settingsTab: "display",
  },
  {
    id: "show-fps",
    title: "Show FPS",
    body: "Turn this on to see your frame rate in the corner. Helpful if the tour feels slow on your device.",
    settingsTab: "display",
  },
  {
    id: "shadows",
    title: "Shadows",
    body: "Toggle real-time shadows on buildings and characters. Off by default — turn on for a richer look if your device handles it well.",
    settingsTab: "display",
  },
  {
    id: "light-intensity",
    title: "Light Intensity",
    body: "Slide to brighten or dim the campus lighting. Lower it if the scene looks too bright; raise it for a sunnier feel.",
    settingsTab: "display",
  },
  {
    id: "camera",
    title: "Camera View",
    body: "Pick 1st Person to explore through your eyes, or 3rd Person to see your avatar walk the campus.",
    settingsTab: "display",
  },
];

const controlsArticles: GuideArticle[] = [
  {
    id: "sensitivity",
    title: "Sensitivity",
    body: "Adjust how fast you look around. Lower for precise control; higher for quicker turns. On desktop, hold Alt to free the cursor for menus.",
    settingsTab: "controls",
  },
  {
    id: "mobile-controls",
    title: "Mobile Controls",
    body: "Customize where the joystick and buttons sit, switch to a left-handed layout, or reset to the default positions.",
    settingsTab: "controls",
    mobileOnly: true,
  },
];

const audioArticles: GuideArticle[] = [
  {
    id: "volume",
    title: "Volume",
    body: "Master switch for all tour sounds — background music, NPC voices, and guide narration.",
    settingsTab: "audio",
  },
  {
    id: "custom-music",
    title: "Custom Music",
    body: "Upload your own audio file to replace the default campus background music. Use Default to switch back anytime.",
    settingsTab: "audio",
  },
  {
    id: "background-music",
    title: "Background Music",
    body: "Set how loud the ambient campus music plays. Works with the default track or your custom upload.",
    settingsTab: "audio",
  },
  {
    id: "fullscreen",
    title: "Full Screen",
    body: "Expand the tour to fill your screen for a more immersive visit. Use the same control again to exit full screen.",
    settingsTab: "audio",
  },
];

function tourArticles(isMobile: boolean): GuideArticle[] {
  const skip = new Set(["welcome", "finish", "settings"]);
  return getTourCoachSteps(isMobile)
    .filter((step) => !skip.has(step.id))
    .map((step) => ({
      id: step.id,
      title: step.title,
      body: step.body,
      tourStepId: step.id,
    }));
}

export function getGuideCategories(isMobile: boolean): GuideCategory[] {
  const tour = tourArticles(isMobile);

  const basics = tour.filter((a) =>
    ["toolbar", "avatar", "destinations", "logbook", "feedback"].includes(a.id),
  );
  const movement = tour.filter((a) =>
    ["joystick", "look", "jump", "wasd", "mouse"].includes(a.id),
  );
  const map = tour.filter((a) =>
    a.id.startsWith("map-") || a.id === "minimap",
  );

  const filterArticles = (articles: GuideArticle[]) =>
    articles.filter((a) => !a.mobileOnly || isMobile);

  const settingsArticles = filterArticles([
    ...displayArticles,
    ...controlsArticles,
    ...audioArticles,
  ]);

  return [
    {
      id: "basics",
      label: "Basics",
      icon: BookOpen,
      articles: basics,
    },
    {
      id: "movement",
      label: "Movement",
      icon: Compass,
      articles: movement,
    },
    {
      id: "map",
      label: "Map",
      icon: Map,
      articles: map,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      articles: settingsArticles,
    },
  ].filter((category) => category.articles.length > 0);
}

export function getTourStepIndex(stepId: string, isMobile: boolean): number {
  const steps = getTourCoachSteps(isMobile);
  const index = steps.findIndex((step) => step.id === stepId);
  return index >= 0 ? index : 0;
}

export function findGuideArticle(
  isMobile: boolean,
  categoryId?: string,
  articleId?: string,
): { categoryId: string; article: GuideArticle } | null {
  const categories = getGuideCategories(isMobile);
  if (categoryId) {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return null;
    if (articleId) {
      const article = category.articles.find((a) => a.id === articleId);
      if (article) return { categoryId, article };
    }
    if (category.articles[0]) {
      return { categoryId, article: category.articles[0] };
    }
    return null;
  }
  const first = categories[0];
  if (!first?.articles[0]) return null;
  return { categoryId: first.id, article: first.articles[0] };
}
