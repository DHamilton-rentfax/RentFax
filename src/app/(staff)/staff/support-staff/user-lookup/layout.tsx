import InternalLayout from "@/app/_components/internal/InternalLayout";
import { RoleGuard } from "@/app/_components/RoleGuard";
import { HelpCircle, BookOpen, MessageSquare, UserCheck } from "lucide-react";
import type { ReactNode } from "react";

const menu = [
  { href: "/support-staff", label: "Tickets", icon: HelpCircle },
  { href: "/support-staff/knowledge-base", label: "Knowledge Base", icon: BookOpen },
  { href: "/support-staff/live-chat", label: "Live Chat", icon: MessageSquare },
  { href: "/support-staff/user-lookup", label: "User Lookup", icon: UserCheck },
];

export default function SupportStaffLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard allowed={["support_staff"]}>
      <InternalLayout menu={menu}>
        {children}
      </InternalLayout>
    </RoleGuard>
  );
}
