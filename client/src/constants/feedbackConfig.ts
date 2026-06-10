/**
 * Default feedback settings used when the API is unavailable.
 * Runtime settings from /api/settings/public take precedence.
 */
export const DEFAULT_FEEDBACK_MODE: "native" | "google_form" = "google_form";

const DEFAULT_GOOGLE_FORM_ID =
  "1FAIpQLSf8WGN4fQOaYq4YO1eaUHOjjRN1v32b80BjURo-jOY4ytDl9Q";

const DEFAULT_GOOGLE_FORM_URL = `https://docs.google.com/forms/d/e/${DEFAULT_GOOGLE_FORM_ID}/viewform`;

export function getDefaultGoogleFormUrl(): string {
  return (
    import.meta.env.VITE_FEEDBACK_GOOGLE_FORM_URL?.trim() ||
    DEFAULT_GOOGLE_FORM_URL
  );
}

export function buildGoogleFormUrls(rawUrl: string) {
  const embedUrl = rawUrl.includes("embedded=true")
    ? rawUrl
    : `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}embedded=true`;

  const parsed = new URL(embedUrl);
  parsed.searchParams.delete("embedded");

  return {
    embedUrl,
    viewUrl: parsed.toString(),
  };
}
