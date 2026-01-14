import InternalLayout from "@/components/internal/InternalLayout";
import { withRoleGuard } from "@/lib/guards/withRoleGuard";
import { ROLES } from "@/types/roles";
import { UserCheck } from "lucide-react";

const menu = [
  { href: "/support-staff/user-lookup", label: "User Lookup", icon: UserCheck },
];

function SupportStaffUserLookupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InternalLayout menu={menu} roleKey="support_staff">
      {children}
    </InternalLayout>
  );
}

export default withRoleGuard(SupportStaffUserLookupLayout, [ROLES.SUPPORT_STAFF]);
