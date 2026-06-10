import {
  AlertCircle,
  Check,
  ExternalLink,
  Loader2,
  LogOut,
  MessageSquare,
  Plus,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFeedbackSettings } from "../../../context/FeedbackSettingsContext";
import { settingsAPI, type FeedbackMode } from "../../../services/settingsApi";
import { usersAPI, type AdminAccount } from "../../../services/usersApi";
import {
  clearAdminSession,
  getAdminSession,
} from "../../admin/utils/adminAuth";

const INPUT_CLASS =
  "w-full rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-sm font-semibold focus:border-maroon focus:outline-none disabled:opacity-60";

export function SuperAdminPage() {
  const navigate = useNavigate();
  const session = getAdminSession();
  const { refresh: refreshFeedbackSettings } = useFeedbackSettings();

  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [adminError, setAdminError] = useState<string | null>(null);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>("google_form");
  const [googleFormUrl, setGoogleFormUrl] = useState("");
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const loadAdmins = useCallback(async () => {
    setLoadingAdmins(true);
    setAdminError(null);
    try {
      const response = await usersAPI.list();
      setAdmins(response.data);
    } catch (err) {
      setAdminError(
        err instanceof Error ? err.message : "Failed to load admin accounts"
      );
    } finally {
      setLoadingAdmins(false);
    }
  }, []);

  const loadSettings = useCallback(async () => {
    setLoadingSettings(true);
    try {
      const response = await settingsAPI.get();
      setFeedbackMode(response.data.feedbackMode);
      setGoogleFormUrl(response.data.googleFormUrl);
    } catch (err) {
      setSettingsError(
        err instanceof Error ? err.message : "Failed to load settings"
      );
    } finally {
      setLoadingSettings(false);
    }
  }, []);

  useEffect(() => {
    void loadAdmins();
    void loadSettings();
  }, [loadAdmins, loadSettings]);

  const handleLogout = () => {
    clearAdminSession();
    navigate("/super-admin/login", { replace: true });
  };

  const handleCreateAdmin = async (event: FormEvent) => {
    event.preventDefault();
    setCreatingAdmin(true);
    setAdminError(null);

    try {
      await usersAPI.create({
        username: newUsername.trim(),
        password: newPassword,
        email: newEmail.trim() || undefined,
      });
      setNewUsername("");
      setNewPassword("");
      setNewEmail("");
      await loadAdmins();
    } catch (err) {
      setAdminError(
        err instanceof Error ? err.message : "Failed to create admin account"
      );
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleToggleActive = async (admin: AdminAccount) => {
    try {
      await usersAPI.update(admin.id, { isActive: !admin.isActive });
      await loadAdmins();
    } catch (err) {
      setAdminError(
        err instanceof Error ? err.message : "Failed to update admin account"
      );
    }
  };

  const handleDeleteAdmin = async (admin: AdminAccount) => {
    if (!window.confirm(`Delete admin account "${admin.username}"?`)) return;

    try {
      await usersAPI.delete(admin.id);
      await loadAdmins();
    } catch (err) {
      setAdminError(
        err instanceof Error ? err.message : "Failed to delete admin account"
      );
    }
  };

  const handleSaveSettings = async (event: FormEvent) => {
    event.preventDefault();
    setSavingSettings(true);
    setSettingsMessage(null);
    setSettingsError(null);

    try {
      await settingsAPI.update({
        feedbackMode,
        googleFormUrl: googleFormUrl.trim(),
      });
      await refreshFeedbackSettings();
      setSettingsMessage("Feedback settings saved. Changes apply to all visitors.");
    } catch (err) {
      setSettingsError(
        err instanceof Error ? err.message : "Failed to save settings"
      );
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="border-b-2 border-ink bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-ink text-gold">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tighter sm:text-xl">
                Super Admin
              </h1>
              <p className="text-xs font-semibold text-ink/55">
                Signed in as {session?.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-white px-3 py-2 text-xs font-black uppercase tracking-wide transition-colors hover:bg-muted sm:px-4 sm:text-sm"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <section className="rounded-2xl border-2 border-ink bg-white p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-gold/30">
              <MessageSquare className="h-5 w-5 text-maroon" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">
                Feedback Settings
              </h2>
              <p className="text-sm font-medium text-ink/60">
                Choose how visitors submit feedback during the virtual tour
              </p>
            </div>
          </div>

          {loadingSettings ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-ink/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading settings…
            </div>
          ) : (
            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
                    feedbackMode === "native"
                      ? "border-maroon bg-maroon/5"
                      : "border-ink/15 bg-muted/40 hover:border-ink/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="feedbackMode"
                    value="native"
                    checked={feedbackMode === "native"}
                    onChange={() => setFeedbackMode("native")}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-black uppercase tracking-tight">
                      Built-in feedback UI
                    </p>
                    <p className="mt-1 text-sm text-ink/60">
                      Star rating and comment form stored in the admin dashboard
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
                    feedbackMode === "google_form"
                      ? "border-maroon bg-maroon/5"
                      : "border-ink/15 bg-muted/40 hover:border-ink/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="feedbackMode"
                    value="google_form"
                    checked={feedbackMode === "google_form"}
                    onChange={() => setFeedbackMode("google_form")}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-black uppercase tracking-tight">
                      Google Form
                    </p>
                    <p className="mt-1 text-sm text-ink/60">
                      Embed a Google Form link for visitor feedback
                    </p>
                  </div>
                </label>
              </div>

              {feedbackMode === "google_form" && (
                <div className="space-y-2">
                  <label
                    htmlFor="google-form-url"
                    className="text-xs font-black uppercase tracking-[0.14em] text-ink/55"
                  >
                    Google Form link
                  </label>
                  <input
                    id="google-form-url"
                    type="url"
                    value={googleFormUrl}
                    onChange={(event) => setGoogleFormUrl(event.target.value)}
                    placeholder="https://docs.google.com/forms/d/e/.../viewform"
                    required
                    className={INPUT_CLASS}
                  />
                  {googleFormUrl && (
                    <a
                      href={googleFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-maroon hover:text-ink"
                    >
                      Preview form
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}

              {settingsError && (
                <div className="flex items-start gap-2 rounded-xl border-2 border-ink bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{settingsError}</span>
                </div>
              )}

              {settingsMessage && (
                <div className="flex items-start gap-2 rounded-xl border-2 border-ink bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{settingsMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-maroon px-4 py-2.5 text-sm font-black uppercase tracking-tighter text-white transition-colors hover:bg-ink disabled:opacity-70"
              >
                {savingSettings ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save feedback settings"
                )}
              </button>
            </form>
          )}
        </section>

        <section className="rounded-2xl border-2 border-ink bg-white p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-gold/30">
              <Users className="h-5 w-5 text-maroon" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">
                Admin Accounts
              </h2>
              <p className="text-sm font-medium text-ink/60">
                Create accounts for the admin dashboard at /admin
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCreateAdmin}
            className="mb-6 grid gap-3 rounded-xl border-2 border-dashed border-ink/20 bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <label
                htmlFor="new-admin-username"
                className="text-xs font-black uppercase tracking-[0.14em] text-ink/55"
              >
                Username
              </label>
              <input
                id="new-admin-username"
                type="text"
                value={newUsername}
                onChange={(event) => setNewUsername(event.target.value)}
                required
                minLength={3}
                placeholder="admin1"
                className={INPUT_CLASS}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <label
                htmlFor="new-admin-password"
                className="text-xs font-black uppercase tracking-[0.14em] text-ink/55"
              >
                Password
              </label>
              <input
                id="new-admin-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className={INPUT_CLASS}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <label
                htmlFor="new-admin-email"
                className="text-xs font-black uppercase tracking-[0.14em] text-ink/55"
              >
                Email (optional)
              </label>
              <input
                id="new-admin-email"
                type="email"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                placeholder="admin@iska.edu"
                className={INPUT_CLASS}
              />
            </div>
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <button
                type="submit"
                disabled={creatingAdmin}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-ink bg-ink px-4 py-2.5 text-sm font-black uppercase tracking-tighter text-white transition-colors hover:bg-maroon disabled:opacity-70"
              >
                {creatingAdmin ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                Create admin
              </button>
            </div>
          </form>

          {adminError && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border-2 border-ink bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{adminError}</span>
            </div>
          )}

          {loadingAdmins ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-ink/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading admin accounts…
            </div>
          ) : admins.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-ink/20 bg-muted/20 px-4 py-8 text-center">
              <Plus className="mx-auto mb-2 h-6 w-6 text-ink/30" />
              <p className="text-sm font-semibold text-ink/60">
                No admin accounts yet. Create one above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border-2 border-ink">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead className="border-b-2 border-ink bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-black uppercase tracking-wide">
                      Username
                    </th>
                    <th className="px-4 py-3 font-black uppercase tracking-wide">
                      Email
                    </th>
                    <th className="px-4 py-3 font-black uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3 font-black uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id} className="border-b border-ink/10">
                      <td className="px-4 py-3 font-semibold">{admin.username}</td>
                      <td className="px-4 py-3 text-ink/70">
                        {admin.email || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase ${
                            admin.isActive
                              ? "border-green-700 bg-green-50 text-green-800"
                              : "border-ink/20 bg-muted text-ink/50"
                          }`}
                        >
                          {admin.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => void handleToggleActive(admin)}
                            className="rounded-lg border border-ink/20 px-2.5 py-1 text-xs font-bold uppercase transition-colors hover:bg-muted"
                          >
                            {admin.isActive ? "Disable" : "Enable"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteAdmin(admin)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-bold uppercase text-red-700 transition-colors hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
