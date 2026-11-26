import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ADMIN_AUTH_SESSION_KEY } from "../constants";
import { apiRequest } from "../../../services/apiClient";
import {
  ADMIN_AUTH_NOTICE_KEY,
  expireStoredSession,
  getAdminSession,
  getTokenExpiry,
  handleUnauthorized,
  isAdminAuthenticated,
  sanitizeRedirectPath,
  validateSession,
} from "./adminAuth";

function base64url(value: string): string {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function makeToken(payload: Record<string, unknown>): string {
  return [
    base64url(JSON.stringify({ alg: "HS256", typ: "JWT" })),
    base64url(JSON.stringify(payload)),
    "signature",
  ].join(".");
}

const nowSeconds = () => Math.floor(Date.now() / 1000);
const nextTick = () => new Promise((resolve) => setTimeout(resolve, 0));

function storeSession(token: string, overrides: Record<string, unknown> = {}) {
  sessionStorage.setItem(
    ADMIN_AUTH_SESSION_KEY,
    JSON.stringify({
      id: "u1",
      username: "jdoe",
      email: "jdoe@example.com",
      role: "admin",
      token,
      authenticatedAt: Date.now(),
      ...overrides,
    }),
  );
}

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("getTokenExpiry", () => {
  it("decodes the exp claim from a base64url payload", () => {
    // "~~~" style characters force '-' / '_' in base64url output.
    const token = makeToken({ exp: 1_900_000_000, note: "~~~???>>>" });
    expect(getTokenExpiry(token)).toBe(1_900_000_000);
  });

  it.each([
    ["empty", ""],
    ["not a jwt", "abc"],
    ["bad base64", "a.!!!.c"],
    ["non-json payload", `a.${base64url("hello")}.c`],
    ["no exp", makeToken({ sub: "u1" })],
    ["string exp", makeToken({ exp: "soon" })],
  ])("returns null for %s", (_label, token) => {
    expect(getTokenExpiry(token)).toBeNull();
  });
});

describe("getAdminSession", () => {
  it("returns null for an expired token without side effects (render-safe)", () => {
    storeSession(makeToken({ exp: nowSeconds() - 60 }));
    const onChange = vi.fn();
    window.addEventListener("iska-admin-session-change", onChange);

    expect(getAdminSession()).toBeNull();
    expect(isAdminAuthenticated()).toBe(false);
    expect(sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY)).not.toBeNull();
    expect(sessionStorage.getItem(ADMIN_AUTH_NOTICE_KEY)).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
    window.removeEventListener("iska-admin-session-change", onChange);
  });

  it("keeps a session whose token has not expired", () => {
    const token = makeToken({ exp: nowSeconds() + 3600 });
    storeSession(token);

    const session = getAdminSession();
    expect(session?.username).toBe("jdoe");
    expect(session?.token).toBe(token);
    expect(sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY)).not.toBeNull();
    expect(isAdminAuthenticated()).toBe(true);
  });

  it("tolerates a malformed token (server decides validity)", () => {
    storeSession("not-a-jwt");

    expect(getAdminSession()?.token).toBe("not-a-jwt");
    expect(sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY)).not.toBeNull();
  });

  it("returns null for corrupt stored JSON", () => {
    sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, "{oops");
    expect(getAdminSession()).toBeNull();
  });
});

describe("expireStoredSession", () => {
  it("clears an expired session and sets the notice", () => {
    storeSession(makeToken({ exp: nowSeconds() - 60 }));

    expect(expireStoredSession()).toBe(true);
    expect(sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY)).toBeNull();
    expect(sessionStorage.getItem(ADMIN_AUTH_NOTICE_KEY)).toBe("expired");
  });

  it("leaves a valid session alone", () => {
    storeSession(makeToken({ exp: nowSeconds() + 3600 }));

    expect(expireStoredSession()).toBe(false);
    expect(sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY)).not.toBeNull();
    expect(sessionStorage.getItem(ADMIN_AUTH_NOTICE_KEY)).toBeNull();
  });
});

describe("token getter", () => {
  it("signs out and redirects when the token expired while the page was open", async () => {
    const assign = vi.fn();
    vi.stubGlobal("location", { pathname: "/admin", search: "", assign });
    storeSession(makeToken({ exp: nowSeconds() - 60 }));
    const fetchMock = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(
      async () =>
        new Response(JSON.stringify({ error: "Authentication required" }), {
          status: 401,
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiRequest("/logbook")).rejects.toBeTruthy();
    await nextTick();

    expect(sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY)).toBeNull();
    expect(sessionStorage.getItem(ADMIN_AUTH_NOTICE_KEY)).toBe("expired");
    expect(assign).toHaveBeenCalledWith("/admin/login?from=%2Fadmin");
    const headers = new Headers(fetchMock.mock.calls[0]?.[1]?.headers);
    expect(headers.get("Authorization")).toBeNull();
  });
});

describe("handleUnauthorized", () => {
  it("skips the fallback when the router already moved to the login page", async () => {
    const assign = vi.fn();
    const location = { pathname: "/admin", search: "", assign };
    vi.stubGlobal("location", location);

    handleUnauthorized();
    location.pathname = "/admin/login"; // guard's <Navigate> ran
    await nextTick();

    expect(assign).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(ADMIN_AUTH_NOTICE_KEY)).toBe("expired");
  });

  it("sets the notice before the session-change event fires", () => {
    vi.stubGlobal("location", { pathname: "/", search: "", assign: vi.fn() });
    storeSession(makeToken({ exp: nowSeconds() + 3600 }));
    let noticeAtEvent: string | null = null;
    const onChange = () => {
      noticeAtEvent = sessionStorage.getItem(ADMIN_AUTH_NOTICE_KEY);
    };
    window.addEventListener("iska-admin-session-change", onChange);

    handleUnauthorized();

    window.removeEventListener("iska-admin-session-change", onChange);
    expect(noticeAtEvent).toBe("expired");
  });

  it("does not redirect visitors on the public site", async () => {
    const assign = vi.fn();
    vi.stubGlobal("location", { pathname: "/", search: "", assign });
    storeSession(makeToken({ exp: nowSeconds() + 3600 }));

    handleUnauthorized();
    await nextTick();

    expect(sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY)).toBeNull();
    expect(assign).not.toHaveBeenCalled();
  });

  it("clears the session, sets the notice and redirects with `from`", async () => {
    const assign = vi.fn();
    vi.stubGlobal("location", {
      pathname: "/super-admin",
      search: "?tab=accounts",
      assign,
    });
    storeSession(makeToken({ exp: nowSeconds() + 3600 }));

    handleUnauthorized();
    await nextTick();

    expect(sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY)).toBeNull();
    expect(sessionStorage.getItem(ADMIN_AUTH_NOTICE_KEY)).toBe("expired");
    expect(assign).toHaveBeenCalledWith(
      `/super-admin/login?from=${encodeURIComponent("/super-admin?tab=accounts")}`,
    );
  });

  it("uses the admin login for non-super-admin paths", async () => {
    const assign = vi.fn();
    vi.stubGlobal("location", { pathname: "/admin", search: "", assign });

    handleUnauthorized();
    await nextTick();

    expect(assign).toHaveBeenCalledWith("/admin/login?from=%2Fadmin");
  });
});

describe("validateSession", () => {
  it("refreshes stored user fields from /auth/me", async () => {
    storeSession(makeToken({ exp: nowSeconds() + 3600 }));
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            success: true,
            data: {
              id: "u1",
              username: "jdoe2",
              email: "new@example.com",
              role: "super_admin",
            },
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(validateSession()).resolves.toBe(true);
    const session = getAdminSession();
    expect(session?.username).toBe("jdoe2");
    expect(session?.email).toBe("new@example.com");
    expect(session?.role).toBe("super_admin");
  });

  it("resolves false on 401", async () => {
    vi.stubGlobal("location", { pathname: "/admin", search: "", assign: vi.fn() });
    storeSession(makeToken({ exp: nowSeconds() + 3600, jti: "for-401" }));
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
      ),
    );

    await expect(validateSession()).resolves.toBe(false);
    expect(sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY)).toBeNull();
  });

  it("keeps the session on network errors", async () => {
    storeSession(makeToken({ exp: nowSeconds() + 3600 }));
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );

    await expect(validateSession()).resolves.toBe(true);
    expect(getAdminSession()).not.toBeNull();
  });
});

describe("sanitizeRedirectPath", () => {
  it.each([
    ["/admin", "/admin"],
    ["/super-admin?x=1", "/super-admin?x=1"],
    ["//evil.example", null],
    ["https://evil.example", null],
    ["/\\evil.example", null],
    ["/\t/evil.example", null],
    ["/\n/evil.example", null],
    ["", null],
    [null, null],
  ])("%s -> %s", (input, expected) => {
    expect(sanitizeRedirectPath(input)).toBe(expected);
  });
});
