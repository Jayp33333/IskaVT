import { FileText } from "lucide-react";
import { useState } from "react";
import { AccountDropdown } from "./AccountDropdown";
import { EmailDropdown } from "./EmailDropdown";
import { NotificationsDropdown } from "./NotificationsDropdown";

type AdminTopBarProps = {
  onOpenSettings: () => void;
  onOpenHelp: () => void;
};

type ActiveDropdown = "email" | "notifications" | "account" | null;

export function AdminTopBar({ onOpenSettings, onOpenHelp }: AdminTopBarProps) {
  const [active, setActive] = useState<ActiveDropdown>(null);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1">
          <div className="md:hidden">
            <div className="w-8 h-8 rounded-full bg-[#660B05] flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
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
