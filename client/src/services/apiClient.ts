export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  headers?: Record<string, string>;
};

export async function apiRequest<TResponse>(
  path: string,
  options: RequestOptions = {}
): Promise<TResponse> {
  const { body, headers, ...rest } = options;

  const hasJsonBody = body !== undefined && body !== null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
      ...(headers || {}),
    },
    body: hasJsonBody ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let payload: { error?: string; message?: string } = {};
    try {
      payload = await response.json();
    } catch {
      // Ignore JSON parse errors; we'll fall back to a generic message below.
    }
    const message =
      payload.error || payload.message || `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
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
