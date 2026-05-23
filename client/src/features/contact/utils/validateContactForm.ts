import { isNonEmpty, isValidEmail } from "../../../utils/validation";
import type { ContactFormFields, ContactFormValidationResult } from "../types";

export function validateContactForm(
  fields: ContactFormFields
): ContactFormValidationResult {
  const name = fields.name.trim();
  const email = fields.email.trim();
  const message = fields.message.trim();

  if (!isNonEmpty(name) || !isNonEmpty(email) || !isNonEmpty(message)) {
    return {
      ok: false,
      message: "Please fill in your name, email, and message.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      ok: false,
      message: "Please enter a valid email address.",
    };
  }

  return { ok: true, data: { name, email, message } };
}
