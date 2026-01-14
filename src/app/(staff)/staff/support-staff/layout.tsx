
import InternalLayout from "@/components/internal/InternalLayout";
import { withRoleGuard } from "@/lib/guards/withRoleGuard";
import { ROLES } from "@/types/roles";
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

function SupportStaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <InternalLayout
        roleKey="support_staff"
        title="Support Staff"
        menu={menu}
      >
        {children}
      </InternalLayout>
  );
}

export default withRoleGuard(SupportStaffLayout, [ROLES.SUPPORT_STAFF, ROLES.SUPER_ADMIN, ROLES.SUPPORT_ADMIN]);
