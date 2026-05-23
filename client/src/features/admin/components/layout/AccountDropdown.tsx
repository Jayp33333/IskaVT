import { ChevronDown, HelpCircle, LogOut, Settings } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";

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

  return (
    <div className="relative">
      <button
        onClick={() => onToggle(!open)}
        className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 rounded-full bg-[#660B05] flex items-center justify-center text-white text-sm font-semibold">
          A
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-semibold text-gray-900">Admin</div>
          <div className="text-xs text-gray-500">admin@iska.edu</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => onToggle(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#660B05] flex items-center justify-center text-white text-sm font-semibold">
                  A
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Admin User</div>
                  <div className="text-xs text-gray-500">admin@iska.edu</div>
                </div>
              </div>
            </div>
            <div className="py-1">
              <button
                onClick={() => {
                  onOpenSettings();
                  onToggle(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#660B05]/10 hover:text-[#660B05] transition-all duration-200 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={() => {
                  onOpenHelp();
                  onToggle(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#660B05]/10 hover:text-[#660B05] transition-all duration-200 flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                Help & Support
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
