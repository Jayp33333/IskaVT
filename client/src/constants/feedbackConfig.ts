/**
 * Temporary Google Form feedback.
 * Set USE_GOOGLE_FORM_FEEDBACK to false to restore the built-in feedback form.
 */
export const USE_GOOGLE_FORM_FEEDBACK = true;

/** Google Form → Send → embed → copy the iframe `src` URL */
export const GOOGLE_FORM_EMBED_URL =
  import.meta.env.VITE_FEEDBACK_GOOGLE_FORM_URL ??
  "https://docs.google.com/forms/d/e/1FAIpQLSf8WGN4fQOaYq4YO1eaUHOjjRN1v32b80BjURo-jOY4ytDl9Q/viewform?embedded=true";
