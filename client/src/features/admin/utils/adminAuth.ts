import { ADMIN_AUTH_SESSION_KEY } from "../constants";
import { authAPI, type AuthUser, type UserRole } from "../../../services/authApi";
import {
  ApiError,
  setAuthTokenGetter,
  setUnauthorizedHandler,
} from "../../../services/apiClient";

export type AdminSession = AuthUser & {
  token: string;
  authenticatedAt: number;
};

/** One-shot notice shown on the login form after a forced sign-out. */
export const ADMIN_AUTH_NOTICE_KEY = "iska_admin_auth_notice";
export type AdminAuthNotice = "expired";

/** Fired on `window` whenever the stored session is written or cleared. */
export const ADMIN_SESSION_CHANGE_EVENT = "iska-admin-session-change";

export const ADMIN_LOGIN_PATH = "/admin/login";
export const SUPER_ADMIN_LOGIN_PATH = "/super-admin/login";

function emitSessionChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ADMIN_SESSION_CHANGE_EVENT));
  }
}

/**
 * Reads the `exp` claim (seconds since epoch) from a JWT without verifying it.
 * Returns null for malformed tokens or tokens without a numeric `exp`.
 */
export function getTokenExpiry(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3 || !parts[1]) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad === 1) return null;
    if (pad) base64 += "=".repeat(4 - pad);
    const payload: unknown = JSON.parse(atob(base64));
    if (!payload || typeof payload !== "object") return null;
    const exp = (payload as { exp?: unknown }).exp;
    return typeof exp === "number" && Number.isFinite(exp) ? exp : null;
  } catch {
    return null;
  }
}

/** True only when the token carries an `exp` claim that has passed. */
export function isTokenExpired(token: string, now = Date.now()): boolean {
  const exp = getTokenExpiry(token);
  return exp !== null && exp * 1000 <= now;
}

export function setAuthNotice(notice: AdminAuthNotice): void {
  try {
    sessionStorage.setItem(ADMIN_AUTH_NOTICE_KEY, notice);
  } catch {
    // Storage unavailable; the notice is a nicety.
  }
}

export function peekAuthNotice(): AdminAuthNotice | null {
  try {
    const value = sessionStorage.getItem(ADMIN_AUTH_NOTICE_KEY);
    return value === "expired" ? value : null;
  } catch {
    return null;
  }
}

export function clearAuthNotice(): void {
  try {
    sessionStorage.removeItem(ADMIN_AUTH_NOTICE_KEY);
  } catch {
    // ignore
  }
}

type ParsedSession =
  | { status: "none" }
  | { status: "expired" }
  | { status: "valid"; session: AdminSession };

function parseSession(raw: string | null): ParsedSession {
  if (!raw) return { status: "none" };

  let parsed: AdminSession;
  try {
    parsed = JSON.parse(raw) as AdminSession;
  } catch {
    return { status: "none" };
  }

  if (!parsed || !parsed.username || !parsed.token || !parsed.role) {
    return { status: "none" };
  }

  if (isTokenExpired(parsed.token)) return { status: "expired" };
  return { status: "valid", session: parsed };
}

/**
 * Side-effect-free read of a raw stored session (expired = null). Safe to call
 * during render; use getAdminSession() elsewhere so expiry clears storage.
 */
export function parseAdminSession(raw: string | null): AdminSession | null {
  const result = parseSession(raw);
  return result.status === "valid" ? result.session : null;
}

function readStoredSession(): ParsedSession {
  try {
    return parseSession(sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY));
  } catch {
    return { status: "none" };
  }
}

/**
 * The stored session, or null when missing or expired. Side-effect free, so
 * it is safe during render. Expired sessions are cleaned up by
 * expireStoredSession() (route guards) and by the API token getter.
 */
export function getAdminSession(): AdminSession | null {
  const result = readStoredSession();
  return result.status === "valid" ? result.session : null;
}

/**
 * If the stored session has expired, clears it and leaves the "expired"
 * notice for the login form. Call from effects/event handlers, not render.
 * Returns true when an expired session was cleared.
 */
export function expireStoredSession(): boolean {
  if (readStoredSession().status !== "expired") return false;
  clearAdminSession();
  setAuthNotice("expired");
  return true;
}

export function isAdminAuthenticated(): boolean {
  const session = getAdminSession();
  return (
    session !== null &&
    (session.role === "admin" || session.role === "super_admin")
  );
}

export function isSuperAdminAuthenticated(): boolean {
  const session = getAdminSession();
  return session !== null && session.role === "super_admin";
}

export function setAdminSession(user: AuthUser, token: string): void {
  const session: AdminSession = {
    ...user,
    token,
    authenticatedAt: Date.now(),
  };
  sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, JSON.stringify(session));
  emitSessionChange();
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
  emitSessionChange();
}

export async function loginWithApi(
  username: string,
  password: string,
  allowedRoles: UserRole[],
): Promise<AdminSession> {
  const response = await authAPI.login(username, password);
  const { token, user } = response.data;

  if (!allowedRoles.includes(user.role)) {
    throw new Error("You do not have access to this portal.");
  }

  clearAuthNotice();
  setAdminSession(user, token);
  return getAdminSession()!;
}

/**
 * Only same-origin, absolute app paths are accepted as post-login redirect
 * targets (prevents `?from=//evil.example` open redirects).
 */
export function sanitizeRedirectPath(
  value: string | null | undefined,
): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  if (value.includes("\\")) return null;
  // URL parsing strips tabs/newlines, so "/<TAB>/evil.com" would become
  // "//evil.com". Reject all control characters.
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(value)) return null;
  return value;
}

/** Login page for the current location: super-admin pages use their own. */
export function getLoginPathFor(pathname: string): string {
  return pathname.startsWith("/super-admin")
    ? SUPER_ADMIN_LOGIN_PATH
    : ADMIN_LOGIN_PATH;
}

function isLoginPath(pathname: string): boolean {
  return pathname === ADMIN_LOGIN_PATH || pathname === SUPER_ADMIN_LOGIN_PATH;
}

/**
 * Clears the session, leaves a one-shot "expired" notice and sends the browser
 * to the matching login page, remembering where the user was.
 *
 * The protected routes subscribe to the session, so clearing it normally
 * redirects in-app; the full-page navigation is only a fallback for when that
 * didn't happen (e.g. a page outside the guards).
 */
export function handleUnauthorized(): void {
  // Notice first: clearing the session synchronously re-renders the guards,
  // and the login form reads (then consumes) the notice when it mounts.
  setAuthNotice("expired");
  clearAdminSession();

  if (typeof window === "undefined") return;
  const { pathname, search } = window.location;
  if (isLoginPath(pathname)) return;
  // A stale admin session on the public site (e.g. a kiosk) is just dropped;
  // only admin pages are sent to the login screen.
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/super-admin")) {
    return;
  }
  const loginPath = getLoginPathFor(pathname);
  const from = `${pathname}${search}`;
  setTimeout(() => {
    if (isLoginPath(window.location.pathname)) return;
    window.location.assign(`${loginPath}?from=${encodeURIComponent(from)}`);
  }, 0);
}

let validationInFlight: Promise<boolean> | null = null;

/**
 * Confirms the stored session with `GET /auth/me` and refreshes the stored
 * username/email/role. Resolves false when there is no session or the server
 * rejects the token (401; the unauthorized handler has already cleared the
 * session and redirected). Network or other errors resolve true (kept).
 */
export function validateSession(): Promise<boolean> {
  if (validationInFlight) return validationInFlight;

  const session = getAdminSession();
  if (!session) return Promise.resolve(false);

  validationInFlight = (async () => {
    try {
      const response = await authAPI.me();
      const user = response?.data;
      const current = getAdminSession();
      if (user && current && current.token === session.token) {
        const next: AdminSession = {
          ...current,
          id: user.id ?? current.id,
          username: user.username ?? current.username,
          email: user.email ?? current.email,
          role: user.role ?? current.role,
        };
        sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, JSON.stringify(next));
        emitSessionChange();
      }
      return true;
    } catch (err) {
      return !(err instanceof ApiError && err.status === 401);
    } finally {
      validationInFlight = null;
    }
  })();

  return validationInFlight;
}

// Runs per request (never during render). A token that expired while the
// dashboard sat open triggers the same sign-out + redirect as a server 401;
// otherwise the request would go out without a token and the 401 handler
// (which only fires for requests that sent one) would never run.
setAuthTokenGetter(() => {
  const result = readStoredSession();
  if (result.status === "expired") {
    handleUnauthorized();
    return null;
  }
  return result.status === "valid" ? result.session.token : null;
});
setUnauthorizedHandler(handleUnauthorized);
