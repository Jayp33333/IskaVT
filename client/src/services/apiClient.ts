export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

let authTokenGetter: (() => string | null) | null = null;
let unauthorizedHandler: (() => void) | null = null;
// The token that last triggered the unauthorized handler. Parallel requests
// that fail with the same (expired/revoked) token only trigger it once; a new
// token (after signing in again) re-arms the handler.
let lastUnauthorizedToken: string | null = null;

export function setAuthTokenGetter(getter: () => string | null) {
  authTokenGetter = getter;
}

/**
 * Registers a callback invoked when an authenticated request (one that sent a
 * bearer token) comes back 401. Called at most once per token, so a burst of
 * parallel failing requests triggers a single redirect.
 */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
  lastUnauthorizedToken = null;
}

export class ApiError extends Error {
  status: number;
  details?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    details?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    if (details) this.details = details;
  }
}

type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  headers?: Record<string, string>;
  /** Do not attach the stored bearer token (e.g. for the login request). */
  skipAuth?: boolean;
};

function parseDetails(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  const details: Record<string, string> = {};
  for (const [key, message] of Object.entries(value)) {
    if (typeof message === "string" && message) details[key] = message;
  }
  return Object.keys(details).length > 0 ? details : undefined;
}

function notifyUnauthorized(token: string) {
  if (!unauthorizedHandler || lastUnauthorizedToken === token) return;
  lastUnauthorizedToken = token;
  try {
    unauthorizedHandler();
  } catch {
    // A failing handler must not mask the original ApiError.
  }
}

export async function apiRequest<TResponse>(
  path: string,
  options: RequestOptions = {}
): Promise<TResponse> {
  const { body, headers, skipAuth, ...rest } = options;

  const hasJsonBody = body !== undefined && body !== null;

  const token = skipAuth ? null : (authTokenGetter?.() ?? null);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: hasJsonBody ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let payload: { error?: string; message?: string; details?: unknown } = {};
    try {
      payload = await response.json();
    } catch {
      // Ignore JSON parse errors; we'll fall back to a generic message below.
    }
    const message =
      payload.error || payload.message || `Request failed (${response.status})`;

    if (response.status === 401 && token) {
      notifyUnauthorized(token);
    }

    throw new ApiError(message, response.status, parseDetails(payload.details));
  }

  // 204 No Content fast-path
  if (response.status === 204) return undefined as TResponse;
  return (await response.json()) as TResponse;
}

export function buildQuery(
  params: Record<string, string | number | boolean | undefined>
): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query.set(key, String(value));
  }
  const str = query.toString();
  return str ? `?${str}` : "";
}
