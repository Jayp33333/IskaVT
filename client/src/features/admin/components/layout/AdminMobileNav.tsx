import { Inbox, LayoutDashboard, MessageSquare, Users } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import type { AdminTab } from "../../types";

type NavItem = {
  id: AdminTab;
  label: string;
  icon: typeof LayoutDashboard;
};

const ITEMS: readonly NavItem[] = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "visitors", label: "Visitors", icon: Users },
  { id: "messages", label: "Inbox", icon: Inbox },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
] as const;

export function AdminMobileNav() {
  const { tab, setTab, messages, feedback } = useAdmin();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200/90 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md md:hidden"
      aria-label="Admin navigation"
    >
      <ul className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          const badge =
            item.id === "messages"
              ? messages.messagesUnread
              : item.id === "feedback"
                ? feedback.feedbackUnread
                : 0;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setTab(item.id)}
                className={`relative flex w-full flex-col items-center gap-0.5 px-2 py-2.5 text-[10px] font-semibold transition-colors ${
                  active ? "text-[#660B05]" : "text-gray-500"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                    active
                      ? "bg-[#660B05] text-white shadow-md shadow-[#660B05]/25"
                      : "bg-transparent"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {badge > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  )}
                </span>
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
