import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ApiError,
  apiRequest,
  setAuthTokenGetter,
  setUnauthorizedHandler,
} from "./apiClient";

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

let token: string | null = null;
const handler = vi.fn();
const fetchMock = vi.fn();

beforeEach(() => {
  token = null;
  handler.mockReset();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  setAuthTokenGetter(() => token);
  setUnauthorizedHandler(handler);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("apiRequest unauthorized handling", () => {
  it("calls the handler once for parallel 401s that sent a token", async () => {
    token = "expired-token";
    fetchMock.mockImplementation(async () =>
      jsonResponse(401, { error: "Token expired" }),
    );

    const results = await Promise.allSettled([
      apiRequest("/logbook"),
      apiRequest("/messages"),
    ]);

    expect(handler).toHaveBeenCalledTimes(1);
    for (const result of results) {
      expect(result.status).toBe("rejected");
      const reason = (result as PromiseRejectedResult).reason;
      expect(reason).toBeInstanceOf(ApiError);
      expect((reason as ApiError).status).toBe(401);
    }
    const headers = fetchMock.mock.calls[0][1].headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer expired-token");
  });

  it("re-arms the handler for a new token", async () => {
    fetchMock.mockImplementation(async () => jsonResponse(401, {}));

    token = "first";
    await expect(apiRequest("/a")).rejects.toBeInstanceOf(ApiError);
    token = "second";
    await expect(apiRequest("/b")).rejects.toBeInstanceOf(ApiError);

    expect(handler).toHaveBeenCalledTimes(2);
  });

  it("does not call the handler for a 401 without a token", async () => {
    fetchMock.mockImplementation(async () =>
      jsonResponse(401, { error: "Invalid username or password" }),
    );

    await expect(apiRequest("/auth/login", { method: "POST" })).rejects.toThrow(
      "Invalid username or password",
    );
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not send the token or call the handler when skipAuth is set", async () => {
    token = "stale";
    fetchMock.mockImplementation(async () => jsonResponse(401, {}));

    await expect(
      apiRequest("/auth/login", { method: "POST", skipAuth: true }),
    ).rejects.toBeInstanceOf(ApiError);

    const headers = fetchMock.mock.calls[0][1].headers as Record<string, string>;
    expect(headers.Authorization).toBeUndefined();
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not call the handler for other error statuses", async () => {
    token = "valid";
    fetchMock.mockImplementation(async () => jsonResponse(403, {}));

    await expect(apiRequest("/users")).rejects.toBeInstanceOf(ApiError);
    expect(handler).not.toHaveBeenCalled();
  });
});

describe("ApiError details", () => {
  it("exposes string field messages from `details`", async () => {
    fetchMock.mockImplementation(async () =>
      jsonResponse(400, {
        error: "Validation failed",
        details: { password: "Must be at least 8 characters", bogus: 42 },
      }),
    );

    const error = await apiRequest("/users").catch((err: unknown) => err);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).message).toBe("Validation failed");
    expect((error as ApiError).details).toEqual({
      password: "Must be at least 8 characters",
    });
  });

  it("leaves details undefined when absent", async () => {
    fetchMock.mockImplementation(async () => jsonResponse(400, { error: "Bad" }));
    const error = (await apiRequest("/users").catch((err: unknown) => err)) as ApiError;
    expect(error.details).toBeUndefined();
  });
});
