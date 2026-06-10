import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Shield,
  User,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SectionDotGrid } from "../../../components/marketing/SectionDotGrid";
import { loginWithApi } from "../../admin/utils/adminAuth";

const INPUT_CLASS =
  "w-full rounded-xl border-2 border-ink bg-muted/80 px-4 py-3 pl-11 text-sm font-semibold transition-all placeholder:font-medium placeholder:text-ink/30 focus:border-maroon focus:bg-white focus:outline-none disabled:opacity-60 sm:py-3.5 sm:text-base";

export function SuperAdminLoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? "/super-admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await loginWithApi(username.trim(), password, ["super_admin"]);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid username or password."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4 py-10 text-ink sm:px-6">
      <SectionDotGrid tone="light" />
      <div className="pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-maroon/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 bottom-20 h-48 w-48 rounded-full bg-gold/25 blur-[90px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-3xl"
      >
        <div className="overflow-hidden rounded-2xl border-2 border-ink bg-white sm:rounded-[2rem]">
          <div className="grid lg:grid-cols-5">
            <motion.aside
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="relative flex flex-col justify-center border-b-2 border-ink bg-ink px-6 py-8 text-white sm:px-8 sm:py-10 lg:col-span-2 lg:border-b-0 lg:border-r-2"
            >
              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 sm:h-16 sm:w-16">
                  <Shield className="h-8 w-8 text-gold" strokeWidth={2.5} />
                </div>
                <h1 className="text-2xl font-black uppercase leading-tight tracking-tighter sm:text-3xl">
                  Super Admin
                </h1>
                <p className="mt-2 text-sm font-medium text-white/70">
                  ISKA Virtual Tour
                </p>
              </div>
            </motion.aside>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              className="px-6 py-8 sm:px-8 sm:py-10 lg:col-span-3"
            >
              <h2 className="mb-7 text-2xl font-black uppercase tracking-tighter sm:text-3xl">
                Sign in
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="super-admin-username"
                    className="text-[11px] font-black uppercase tracking-[0.14em] text-ink/55 sm:text-xs"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                    <input
                      id="super-admin-username"
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      autoComplete="username"
                      placeholder="Username"
                      disabled={submitting}
                      required
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="super-admin-password"
                    className="text-[11px] font-black uppercase tracking-[0.14em] text-ink/55 sm:text-xs"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                    <input
                      id="super-admin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      placeholder="Password"
                      disabled={submitting}
                      required
                      className={`${INPUT_CLASS} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-ink/10 text-ink/50 transition-colors hover:border-ink/25 hover:bg-muted hover:text-ink"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5 rounded-xl border-2 border-ink bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-ink bg-ink px-4 py-3.5 text-sm font-black uppercase tracking-tighter text-white transition-colors hover:bg-maroon disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <Link
                to="/home"
                className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-maroon transition-colors hover:text-ink sm:text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to site
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
