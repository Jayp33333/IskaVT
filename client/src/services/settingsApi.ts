import { apiRequest } from "./apiClient";

export type FeedbackMode = "native" | "google_form";

export type PublicSettings = {
  feedbackMode: FeedbackMode;
  googleFormUrl: string;
};

export const settingsAPI = {
  getPublic() {
    return apiRequest<{ success: boolean; data: PublicSettings }>(
      "/settings/public"
    );
  },

  get() {
    return apiRequest<{
      success: boolean;
      data: PublicSettings & { updatedAt: string };
    }>("/settings");
  },

  update(body: Partial<PublicSettings>) {
    return apiRequest<{
      success: boolean;
      data: PublicSettings & { updatedAt: string };
    }>("/settings", {
      method: "PATCH",
      body,
    });
  },
};
