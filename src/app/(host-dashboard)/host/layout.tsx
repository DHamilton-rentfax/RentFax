import InternalLayout from "@/app/_components/internal/InternalLayout";
import { RoleGuard } from "@/app/_components/RoleGuard";
import {
  LayoutGrid,
  Building,
  FileText,
  BellRing,
  MessageSquare,
  LifeBuoy,
} from "lucide-react";

const menu = [
  { href: "/host", label: "Dashboard", icon: LayoutGrid },
  { href: "/host/properties", label: "My Properties", icon: Building },
  {
    href: "/host/applications",
    label: "All Applications",
    icon: FileText,
  },
  { href: "/host/notifications", label: "Notifications", icon: BellRing },
  { href: "/host/inbox", label: "Inbox", icon: MessageSquare },
  { href: "/host/support", label: "Support Tickets", icon: LifeBuoy },
];

export default function HostLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowed={["host"]}>
      <InternalLayout roleKey="host" title="Host Hub" menu={menu}>
        {children}
      </InternalLayout>
    </RoleGuard>
  );
}
