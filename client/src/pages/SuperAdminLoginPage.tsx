import { Navigate } from "react-router-dom";
import { SuperAdminLoginForm } from "../features/super-admin/components/SuperAdminLoginForm";
import { isSuperAdminAuthenticated } from "../features/admin/utils/adminAuth";

export default function SuperAdminLoginPage() {
  if (isSuperAdminAuthenticated()) {
    return <Navigate to="/super-admin" replace />;
  }

  return <SuperAdminLoginForm />;
}
