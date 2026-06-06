import { Navigate } from "react-router-dom";
import { AdminLoginForm } from "../features/admin/components/AdminLoginForm";
import { isAdminAuthenticated } from "../features/admin/utils/adminAuth";

export default function AdminLoginPage() {
  if (isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  return <AdminLoginForm />;
}
