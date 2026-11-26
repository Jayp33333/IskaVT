import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  clearAuthNotice,
  peekAuthNotice,
  sanitizeRedirectPath,
} from "../utils/adminAuth";

export const SESSION_EXPIRED_MESSAGE =
  "Your session has expired. Please sign in again.";

/**
 * One-shot login notice (e.g. after a forced sign-out). Read during the first
 * render and removed from storage after mount, so it shows once.
 */
export function useAuthNotice(): string | null {
  const [notice] = useState(() =>
    peekAuthNotice() === "expired" ? SESSION_EXPIRED_MESSAGE : null,
  );

  useEffect(() => {
    clearAuthNotice();
  }, []);

  return notice;
}

/**
 * Where to go after signing in: router state `from` (set by the protected
 * routes) or the `?from=` query (set by the 401 handler), else the fallback.
 */
export function useLoginRedirect(fallback: string): string {
  const location = useLocation();
  const fromState = (location.state as { from?: string } | null)?.from;
  const fromQuery = new URLSearchParams(location.search).get("from");
  return (
    sanitizeRedirectPath(fromState) ??
    sanitizeRedirectPath(fromQuery) ??
    fallback
  );
}
