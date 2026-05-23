export type ContactFormFields = {
  name: string;
  email: string;
  message: string;
};

export type ContactFormStatus =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export type ContactFormValidationResult =
  | { ok: true; data: ContactFormFields }
  | { ok: false; message: string };
