import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { Toast } from "./common/Toast";
import { DashboardTab } from "./dashboard/DashboardTab";
import { AdminMobileNav } from "./layout/AdminMobileNav";
import { AdminSidebar } from "./layout/AdminSidebar";
import { AdminTopBar } from "./layout/AdminTopBar";
import { FeedbackTab } from "./feedback/FeedbackTab";
import { MessagesTab } from "./messages/MessagesTab";
import { HelpModal } from "./modals/HelpModal";
import { SettingsModal } from "./modals/SettingsModal";
import { VisitorsTab } from "./visitors/VisitorsTab";

export function AdminPage() {
  const { tab, loading, error, toast } = useAdmin();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-stone-100/80 text-gray-900">
      <AdminSidebar />
      <AdminMobileNav />

      <div className="flex min-h-screen flex-col md:ml-[272px]">
        <AdminTopBar
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenHelp={() => setHelpOpen(true)}
        />

        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-4 pb-24 sm:px-6 sm:py-6 md:pb-6">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin text-[#660B05]" />
              <span className="text-sm font-medium">Loading admin data…</span>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && tab === "dashboard" && <DashboardTab />}
          {!loading && !error && tab === "visitors" && (
            <VisitorsTab onChangeExportDefault={() => setSettingsOpen(true)} />
          )}
          {!loading && !error && tab === "messages" && <MessagesTab />}
          {!loading && !error && tab === "feedback" && <FeedbackTab />}
        </main>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />

      <Toast toast={toast.toast} onClose={toast.hideToast} />
    </div>
  );
}
