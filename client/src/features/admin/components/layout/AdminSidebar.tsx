import { FileText, Inbox, LayoutDashboard, Users } from "lucide-react";
import { useMemo } from "react";
import { useAdmin } from "../../context/AdminContext";
import type { AdminTab } from "../../types";

type SidebarItem = {
  id: AdminTab;
  label: string;
  icon: typeof LayoutDashboard;
};

const SIDEBAR_ITEMS: readonly SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "visitors", label: "Visitors", icon: Users },
  { id: "messages", label: "Messages", icon: Inbox },
] as const;

export function AdminSidebar() {
  const { tab, setTab, messages } = useAdmin();
  const items = useMemo(() => SIDEBAR_ITEMS, []);

  return (
    <aside className="w-[260px] hidden md:flex flex-col border-r border-gray-200 bg-white fixed left-0 top-0 h-screen overflow-y-auto">
      <div className="px-5 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#660B05] flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-base font-bold text-gray-900">ISKA</div>
            <div className="text-[11px] text-gray-500">Visitor Monitor</div>
          </div>
        </div>
      </div>

      <div className="px-3 py-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
          MENU
        </div>
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            const showBadge =
              item.id === "messages" && messages.messagesUnread > 0;

            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  active
                    ? "bg-[#660B05] text-white shadow-sm"
                    : "hover:bg-[#660B05]/10 hover:text-[#660B05] text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {showBadge && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full ${
                      active ? "bg-white text-[#660B05]" : "bg-[#660B05] text-white"
                    }`}
                  >
                    {messages.messagesUnread > 99 ? "99+" : messages.messagesUnread}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
