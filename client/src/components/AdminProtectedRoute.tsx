import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminSession } from "../features/admin/auth/useAdminSession";
import {
  expireStoredSession,
  validateSession,
} from "../features/admin/utils/adminAuth";

type AdminProtectedRouteProps = {
  children: React.ReactNode;
};

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const location = useLocation();
  // Reactive: re-renders (and redirects) when the session is cleared.
  const session = useAdminSession();
  const authenticated =
    session !== null &&
    (session.role === "admin" || session.role === "super_admin");

  // Expired token left in storage: clear it and leave the "expired" notice.
  // Otherwise run a non-blocking server check; if the token was revoked the
  // 401 handler clears the session and redirects to login.
  useEffect(() => {
    if (expireStoredSession()) return;
    if (authenticated) void validateSession();
    // Run once per mount of the protected shell.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <>{children}</>;
}
