
import InternalLayout from "@/components/internal/InternalLayout";
import { withRoleGuard } from "@/lib/guards/withRoleGuard";
import { ROLES } from "@/types/roles";
import { AlertTriangle, ShieldCheck, Clock, UserX } from "lucide-react";

const menu = [
  { href: "/fraud-team", label: "Alerts", icon: AlertTriangle },
  { href: "/fraud-team/rules", label: "Rules", icon: ShieldCheck },
  { href: "/fraud-team/history", label: "History", icon: Clock },
  { href: "/fraud-team/blocked-users", label: "Blocked Users", icon: UserX },
];

function FraudTeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <InternalLayout menu={menu} role={ROLES.FRAUD_TEAM}>
      {children}
    </InternalLayout>
  );
}

export default withRoleGuard(FraudTeamLayout, [ROLES.FRAUD_TEAM]);
