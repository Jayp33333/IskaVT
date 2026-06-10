import { ADMIN_AUTH_SESSION_KEY } from "../constants";
import { authAPI, type AuthUser, type UserRole } from "../../../services/authApi";
import { setAuthTokenGetter } from "../../../services/apiClient";

export type AdminSession = AuthUser & {
  token: string;
  authenticatedAt: number;
};

function getExpectedCredentials() {
  const username =
    import.meta.env.VITE_ADMIN_USERNAME ??
    (import.meta.env.DEV ? "admin" : "");
  const password =
    import.meta.env.VITE_ADMIN_PASSWORD ??
    (import.meta.env.DEV ? "iska-admin" : "");

  return { username, password };
}

export function isAdminAuthConfigured(): boolean {
  return true;
}

export function validateAdminCredentials(
  username: string,
  password: string,
): boolean {
  const expected = getExpectedCredentials();
  if (!expected.username || !expected.password) {
    return false;
  }
  return username === expected.username && password === expected.password;
}

export function getAdminSession(): AdminSession | null {
  const raw = sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed.username || !parsed.token || !parsed.role) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
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
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
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

  setAdminSession(user, token);
  return getAdminSession()!;
}

setAuthTokenGetter(() => getAdminSession()?.token ?? null);
