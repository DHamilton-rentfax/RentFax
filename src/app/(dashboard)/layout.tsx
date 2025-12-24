import InternalLayout from "@/app/_components/internal/InternalLayout";
import { RoleGuard } from "@/app/_components/RoleGuard";
import { LayoutDashboard, Settings, UserCircle, ShoppingCart } from "lucide-react";
import SupportChat from "@/components/support/SupportChat";

const menu = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowed={["customer"]}>
      <InternalLayout menu={menu} role="customer">
        {children}
        <SupportChat context="dashboard_main" />
      </InternalLayout>
    </RoleGuard>
  );
}
