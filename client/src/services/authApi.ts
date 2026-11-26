import { apiRequest } from "./apiClient";

export type UserRole = "admin" | "super_admin";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
};

type LoginResponse = {
  success: boolean;
  data: {
    token: string;
    user: AuthUser;
  };
};

export const authAPI = {
  login(username: string, password: string) {
    return apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: { username, password },
      // Never send a stale token with a login attempt: a failed login must not
      // be treated as an expired session.
      skipAuth: true,
    });
  },

  me() {
    return apiRequest<{ success: boolean; data: AuthUser }>("/auth/me");
  },
};
