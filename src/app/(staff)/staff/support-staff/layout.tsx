import InternalLayout from "@/app/_components/internal/InternalLayout";
import { RoleGuard } from "@/app/_components/RoleGuard";
import {
  MessageSquare,
  LifeBuoy,
  BookOpenText,
  HelpCircle,
  Users,
  BarChart3,
  FileText,
} from "lucide-react";

const menu = [
  { href: "/support-staff", label: "Live Chat", icon: MessageSquare },
  { href: "/support-staff/tickets", label: "Tickets", icon: LifeBuoy },
  { href: "/support-staff/help-center", label: "Help Center Articles", icon: BookOpenText },
  { href: "/support-staff/faq-manager", label: "FAQ Manager", icon: HelpCircle },
  { href: "/support-staff/user-lookup", label: "User Lookup", icon: Users },
  { href: "/support-staff/company-lookup", label: "Company Lookup", icon: FileText },
  { href: "/support-staff/analytics", label: "Support Analytics", icon: BarChart3 },
];

export default function SupportStaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowed={["support_staff", "admin"]}>
      <InternalLayout
        roleKey="support_staff"
        title="Support Staff"
        menu={menu}
      >
        {children}
      </InternalLayout>
    </RoleGuard>
  );
}