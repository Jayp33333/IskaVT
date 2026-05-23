import { useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { Toast } from "./common/Toast";
import { DashboardTab } from "./dashboard/DashboardTab";
import { AdminSidebar } from "./layout/AdminSidebar";
import { AdminTopBar } from "./layout/AdminTopBar";
import { MessagesTab } from "./messages/MessagesTab";
import { HelpModal } from "./modals/HelpModal";
import { SettingsModal } from "./modals/SettingsModal";
import { VisitorsTab } from "./visitors/VisitorsTab";

export function AdminPage() {
  const { tab, loading, error, toast } = useAdmin();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="flex-1 md:ml-[260px]">
          <AdminTopBar
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenHelp={() => setHelpOpen(true)}
          />

          <main className="px-6 py-6">
            {loading && (
              <div className="w-full flex justify-center py-10 text-gray-500 text-sm">
                Loading…
              </div>
            )}

            {error && (
              <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {!loading && !error && tab === "dashboard" && <DashboardTab />}
            {!loading && !error && tab === "visitors" && (
              <VisitorsTab onChangeExportDefault={() => setSettingsOpen(true)} />
            )}
            {!loading && !error && tab === "messages" && <MessagesTab />}
          </main>
        </div>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />

      <Toast toast={toast.toast} onClose={toast.hideToast} />
    </div>
  );
}
