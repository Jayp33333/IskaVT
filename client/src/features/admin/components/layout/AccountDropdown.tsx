import { ChevronDown, HelpCircle, LogOut, Settings, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminSession } from "../../auth/useAdminSession";
import { useAdmin } from "../../context/adminContextValue";
import { AdminDropdownPanel } from "./AdminDropdownPanel";

type AccountDropdownProps = {
  open: boolean;
  onToggle: (next: boolean) => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
};

export function AccountDropdown({
  open,
  onToggle,
  onOpenSettings,
  onOpenHelp,
}: AccountDropdownProps) {
  const { logout } = useAdmin();
  const session = useAdminSession();
  const close = () => onToggle(false);

  const isSuperAdmin = session?.role === "super_admin";
  const roleLabel = isSuperAdmin ? "Super Admin" : "Admin";
  const username = session?.username?.trim() || roleLabel;
  const secondary = session?.email?.trim() || roleLabel;
  const initial = username.charAt(0).toUpperCase() || "A";

  const roleBadge = (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none tracking-wide ${
        isSuperAdmin
          ? "bg-[#660B05] text-white"
          : "bg-[#660B05]/10 text-[#660B05]"
      }`}
    >
      {roleLabel}
    </span>
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onToggle(!open)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Account menu for ${username}`}
        className="flex items-center gap-2 rounded-xl border border-gray-200/80 bg-white/80 py-1.5 pl-1.5 pr-2 transition-all hover:border-[#660B05]/30 hover:shadow-sm sm:gap-3 sm:pl-2 sm:pr-3 md:border-l md:rounded-none md:border-0 md:bg-transparent md:pl-4 md:shadow-none"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#660B05] to-[#8C1007] text-sm font-semibold text-white shadow-sm">
          {initial}
        </div>
        <div className="hidden min-w-0 max-w-[12rem] text-left sm:block">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-gray-900">
              {username}
            </span>
            {roleBadge}
          </div>
          <div className="truncate text-xs text-gray-500">{secondary}</div>
        </div>
        <ChevronDown className="hidden h-4 w-4 text-gray-600 sm:block" />
      </button>

      {open && (
        <AdminDropdownPanel
          title="Account"
          onClose={close}
          desktopWidthClass="sm:w-64"
        >
          <div className="px-2 pb-2">
            <div className="mb-2 flex items-center gap-3 rounded-xl bg-gray-50 p-3 sm:hidden">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#660B05] text-sm font-semibold text-white">
                {initial}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-semibold text-gray-900">
                    {username}
                  </span>
                  {roleBadge}
                </div>
                <div className="truncate text-xs text-gray-500">{secondary}</div>
              </div>
            </div>
            {isSuperAdmin && (
              <Link
                to="/super-admin"
                onClick={close}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-[#660B05]/10 hover:text-[#660B05]"
              >
                <Shield className="h-4 w-4 shrink-0" />
                Admin accounts & site settings
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                onOpenSettings();
                close();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-[#660B05]/10 hover:text-[#660B05]"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenHelp();
                close();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-[#660B05]/10 hover:text-[#660B05]"
            >
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </button>
            <div className="my-1 border-t border-gray-100" />
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </AdminDropdownPanel>
      )}
    </div>
  );
}
