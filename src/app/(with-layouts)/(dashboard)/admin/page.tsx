import type { Metadata } from "next";
import AdminDashboardView from "./_components/admin-dashboard-view";

export const metadata: Metadata = {
  title: "Resumen general",
};

export default function AdminPage() {
  return <AdminDashboardView />;
}
