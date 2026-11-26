import { useMemo, useSyncExternalStore } from "react";
import { ADMIN_AUTH_SESSION_KEY } from "../constants";
import {
  ADMIN_SESSION_CHANGE_EVENT,
  parseAdminSession,
  type AdminSession,
} from "../utils/adminAuth";

function subscribe(onChange: () => void) {
  window.addEventListener(ADMIN_SESSION_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(ADMIN_SESSION_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// The raw string is a stable snapshot; parsing happens in useMemo.
function getSnapshot() {
  return sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY);
}

/** The current admin session, re-rendering when it is refreshed or cleared. */
export function useAdminSession(): AdminSession | null {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null);
  return useMemo(() => parseAdminSession(raw), [raw]);
}
