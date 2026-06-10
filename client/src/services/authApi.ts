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
    });
  },

  me() {
    return apiRequest<{ success: boolean; data: AuthUser }>("/auth/me");
  },
};
