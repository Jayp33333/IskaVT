import { Navigate, useLocation } from "react-router-dom";
import { isAdminAuthenticated } from "../features/admin/utils/adminAuth";

type AdminProtectedRouteProps = {
  children: React.ReactNode;
};

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const location = useLocation();

  if (!isAdminAuthenticated()) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  }

  return <>{children}</>;
}
