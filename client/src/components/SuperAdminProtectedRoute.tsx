import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminSession } from "../features/admin/auth/useAdminSession";
import {
  expireStoredSession,
  validateSession,
} from "../features/admin/utils/adminAuth";

type SuperAdminProtectedRouteProps = {
  children: React.ReactNode;
};

export function SuperAdminProtectedRoute({
  children,
}: SuperAdminProtectedRouteProps) {
  const location = useLocation();
  // Reactive: a 401 sign-out or a role downgrade picked up by
  // validateSession() updates the stored session and re-renders into the
  // redirect below.
  const session = useAdminSession();
  const authenticated = session !== null && session.role === "super_admin";

  useEffect(() => {
    if (expireStoredSession()) return;
    if (authenticated) void validateSession();
    // Run once per mount of the protected shell.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authenticated) {
    return (
      <Navigate
        to="/super-admin/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <>{children}</>;
}
