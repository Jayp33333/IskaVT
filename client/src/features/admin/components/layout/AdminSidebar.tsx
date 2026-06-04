import { FileText, Inbox, LayoutDashboard, MessageSquare, Users } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import type { AdminTab } from "../../types";

type SidebarItem = {
  id: AdminTab;
  label: string;
  icon: typeof LayoutDashboard;
};

export const SIDEBAR_ITEMS: readonly SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "visitors", label: "Visitors", icon: Users },
  { id: "messages", label: "Messages", icon: Inbox },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
] as const;

export function AdminSidebar() {
  const { tab, setTab, messages, feedback } = useAdmin();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[272px] flex-col border-r border-gray-200/80 bg-white/95 shadow-sm backdrop-blur-md md:flex">
      <div className="border-b border-gray-100 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#660B05] to-[#8C1007] shadow-lg shadow-[#660B05]/25">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-gray-900">
              ISKA
            </div>
            <div className="text-[11px] font-medium text-gray-500">
              Visitor Monitor
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Menu
        </div>
        <nav className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            const badge =
              item.id === "messages"
                ? messages.messagesUnread
                : item.id === "feedback"
                  ? feedback.feedbackUnread
                  : 0;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#660B05] text-white shadow-md shadow-[#660B05]/20"
                    : "text-gray-600 hover:bg-[#660B05]/8 hover:text-[#660B05]"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    active ? "text-white" : "text-gray-500 group-hover:text-[#660B05]"
                  }`}
                />
                <span className="flex-1 text-left">{item.label}</span>
                {badge > 0 && (
                  <span
                    className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      active
                        ? "bg-white text-[#660B05]"
                        : "bg-[#660B05] text-white"
                    }`}
                  >
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-100 px-5 py-4">
        <p className="text-[11px] text-gray-400">PUP Virtual Tour Admin</p>
      </div>
    </aside>
  );
}
