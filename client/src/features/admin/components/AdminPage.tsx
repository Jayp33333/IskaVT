import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "../context/adminContextValue";
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
  const { tab, loading, error, toast, reloadAll } = useAdmin();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await reloadAll();
    } finally {
      setRetrying(false);
    }
  };

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

          {/* Non-blocking: content (possibly stale) stays visible below. */}
          {error && !loading && (
            <div
              role="alert"
              className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  <span className="font-semibold">Couldn&rsquo;t load the latest data.</span>{" "}
                  {error}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                disabled={retrying}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${retrying ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                {retrying ? "Retrying…" : "Retry"}
              </button>
            </div>
          )}

          {!loading && tab === "dashboard" && <DashboardTab />}
          {!loading && tab === "visitors" && (
            <VisitorsTab onChangeExportDefault={() => setSettingsOpen(true)} />
          )}
          {!loading && tab === "messages" && <MessagesTab />}
          {!loading && tab === "feedback" && <FeedbackTab />}
        </main>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />

      <Toast toast={toast.toast} onClose={toast.hideToast} />
    </div>
  );
}
