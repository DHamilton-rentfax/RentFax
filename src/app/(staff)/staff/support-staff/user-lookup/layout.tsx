
import InternalLayout from "@/components/internal/InternalLayout";
import { withRoleGuard } from "@/lib/guards/withRoleGuard";
import { ROLES } from "@/types/roles";
import { HelpCircle, BookOpen, MessageSquare, UserCheck } from "lucide-react";
import type { ReactNode } from "react";

const menu = [
  { href: "/support-staff", label: "Tickets", icon: HelpCircle },
  { href: "/support-staff/knowledge-base", label: "Knowledge Base", icon: BookOpen },
  { href: "/support-staff/live-chat", label: "Live Chat", icon: MessageSquare },
  { href: "/support-staff/user-lookup", label: "User Lookup", icon: UserCheck },
];

function SupportStaffLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
      <InternalLayout menu={menu}>
        {children}
      </InternalLayout>
  );
}

export default withRoleGuard(SupportStaffLayout, [ROLES.SUPPORT_STAFF]);
