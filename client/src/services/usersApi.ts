import { apiRequest } from "./apiClient";
import type { AuthUser } from "./authApi";

export type AdminAccount = AuthUser & {
  isActive: boolean;
  createdAt: string;
};

export const usersAPI = {
  list() {
    return apiRequest<{ success: boolean; data: AdminAccount[] }>("/users");
  },

  create(body: { username: string; password: string; email?: string }) {
    return apiRequest<{ success: boolean; data: AdminAccount }>("/users", {
      method: "POST",
      body,
    });
  },

  update(id: string, body: { isActive?: boolean; password?: string }) {
    return apiRequest<{ success: boolean; data: AdminAccount }>(`/users/${id}`, {
      method: "PATCH",
      body,
    });
  },

  delete(id: string) {
    return apiRequest<{ success: boolean }>(`/users/${id}`, {
      method: "DELETE",
    });
  },
};
