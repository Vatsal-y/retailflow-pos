import { Outlet, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard,
  Store,
  CreditCard,
  ClipboardCheck,
  Settings,
} from "lucide-react";

const superAdminSidebarItems = [
  { label: "Dashboard", href: "/superadmin/dashboard", icon: LayoutDashboard },
  { label: "Stores", href: "/superadmin/stores", icon: Store },
  { label: "Subscriptions", href: "/superadmin/subscriptions", icon: CreditCard },
  { label: "Requests", href: "/superadmin/requests", icon: ClipboardCheck, badge: "3" },
  { label: "Settings", href: "/superadmin/settings", icon: Settings },
];

export default function SuperAdminLayout() {
  // TODO: Add actual auth check
  const userRole = "superadmin";
  
  if (userRole !== "superadmin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <DashboardLayout
      sidebarItems={superAdminSidebarItems}
      title="Super Admin"
      subtitle="Platform Management"
      userRole="super_admin"
      userName="Super Admin"
      storeName="POS Pro Platform"
    >
      <Outlet />
    </DashboardLayout>
  );
}