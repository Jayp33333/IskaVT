import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { ADMIN_TAB_META } from "../common/adminUi";
import { AccountDropdown } from "./AccountDropdown";
import { EmailDropdown } from "./EmailDropdown";
import { NotificationsDropdown } from "./NotificationsDropdown";

type AdminTopBarProps = {
  onOpenSettings: () => void;
  onOpenHelp: () => void;
};

type ActiveDropdown = "email" | "notifications" | "account" | null;

export function AdminTopBar({ onOpenSettings, onOpenHelp }: AdminTopBarProps) {
  const { tab } = useAdmin();
  const [active, setActive] = useState<ActiveDropdown>(null);
  const meta = ADMIN_TAB_META[tab];

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/85 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <div className="min-w-0 md:hidden">
          <h1 className="truncate text-base font-bold text-gray-900">
            {meta.title}
          </h1>
          <p className="truncate text-xs text-gray-500">{meta.subtitle}</p>
        </div>

        <div className="hidden min-w-0 flex-1 md:block">
          <h1 className="text-lg font-bold tracking-tight text-gray-900">
            {meta.title}
          </h1>
          <p className="text-sm text-gray-500">{meta.subtitle}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <EmailDropdown
            open={active === "email"}
            onToggle={(next) => setActive(next ? "email" : null)}
          />
          <NotificationsDropdown
            open={active === "notifications"}
            onToggle={(next) => setActive(next ? "notifications" : null)}
          />
          <AccountDropdown
            open={active === "account"}
            onToggle={(next) => setActive(next ? "account" : null)}
            onOpenSettings={() => {
              setActive(null);
              onOpenSettings();
            }}
            onOpenHelp={() => {
              setActive(null);
              onOpenHelp();
            }}
          />
        </div>
      </div>
    </header>
  );
}
