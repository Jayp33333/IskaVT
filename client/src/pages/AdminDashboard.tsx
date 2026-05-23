import { AdminPage } from "../features/admin/components/AdminPage";
import { AdminProvider } from "../features/admin/context/AdminContext";

export default function AdminDashboard() {
  return (
    <AdminProvider>
      <AdminPage />
    </AdminProvider>
  );
}
