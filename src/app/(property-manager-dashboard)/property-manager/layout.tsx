import InternalLayout from "@/app/_components/internal/InternalLayout";
import { RoleGuard } from "@/app/_components/RoleGuard";
import {
  LayoutGrid,
  Building,
  Users,
  FileText,
  BellRing,
  MessageSquare,
  Siren,
  LifeBuoy,
} from "lucide-react";

const menu = [
  { href: "/property-manager", label: "Dashboard", icon: LayoutGrid },
  { href: "/property-manager/properties", label: "My Properties", icon: Building },
  { href: "/property-manager/renters", label: "My Renters", icon: Users },
  { href: "/property-manager/reports", label: "My Reports", icon: FileText },
  { href: "/property-manager/notifications", label: "Notifications", icon: BellRing },
  { href: "/property-manager/inbox", label: "Inbox", icon: MessageSquare },
  {
    href: "/property-manager/emergency-contacts",
    label: "Emergency Contacts",
    icon: Siren,
  },
  { href: "/property-manager/support", label: "Support", icon: LifeBuoy },
];

export default function PropertyManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowed={["property_manager", "admin"]}>
      <InternalLayout
        roleKey="property_manager"
        title="Property Manager Hub"
        menu={menu}
      >
        {children}
      </InternalLayout>
    </RoleGuard>
  );
}
