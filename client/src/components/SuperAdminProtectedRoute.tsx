import { Navigate, useLocation } from "react-router-dom";
import { isSuperAdminAuthenticated } from "../features/admin/utils/adminAuth";

type SuperAdminProtectedRouteProps = {
  children: React.ReactNode;
};

export function SuperAdminProtectedRoute({
  children,
}: SuperAdminProtectedRouteProps) {
  const location = useLocation();

  if (!isSuperAdminAuthenticated()) {
    return (
      <Navigate
        to="/super-admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
}
