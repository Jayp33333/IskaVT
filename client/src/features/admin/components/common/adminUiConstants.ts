import type { AdminTab } from "../../types";

export const ADMIN_BRAND = "#660B05";
export const ADMIN_BRAND_HOVER = "#8C1007";

export const adminCardClass =
  "rounded-2xl border border-gray-200/80 bg-white/90 shadow-sm shadow-gray-200/50 backdrop-blur-sm";

export const ADMIN_TAB_META: Record<
  AdminTab,
  { title: string; subtitle: string }
> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview and analytics",
  },
  visitors: {
    title: "Visitors",
    subtitle: "Logbook records",
  },
  messages: {
    title: "Messages",
    subtitle: "Contact inbox",
  },
  feedback: {
    title: "Tour Feedback",
    subtitle: "Tour ratings & comments",
  },
};
