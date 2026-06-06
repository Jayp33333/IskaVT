import { ADMIN_AUTH_SESSION_KEY } from "../constants";

type AdminSession = {
  username: string;
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
  const { username, password } = getExpectedCredentials();
  return Boolean(username && password);
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
    if (!parsed.username || !parsed.authenticatedAt) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}

export function setAdminSession(username: string): void {
  const session: AdminSession = {
    username,
    authenticatedAt: Date.now(),
  };
  sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
}
