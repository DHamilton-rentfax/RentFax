import InternalLayout from "@/app/_components/internal/InternalLayout";
import { RoleGuard } from "@/app/_components/RoleGuard";
import { HelpCircle, BookOpen, MessageSquare, UserCheck } from "lucide-react";

const menu = [
  { href: "/support", label: "Tickets", icon: HelpCircle },
  { href: "/support/knowledge-base", label: "Knowledge Base", icon: BookOpen },
  { href: "/support/live-chat", label: "Live Chat", icon: MessageSquare },
  { href: "/support/user-lookup", label: "User Lookup", icon: UserCheck },
];

export default function SupportStaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowed={["support_staff"]}>
      <InternalLayout menu={menu} role="support_staff">
        {children}
      </InternalLayout>
    </RoleGuard>
  );
}
