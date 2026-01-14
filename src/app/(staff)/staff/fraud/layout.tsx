import InternalLayout from "@/components/internal/InternalLayout";
import { withRoleGuard } from "@/lib/guards/withRoleGuard";
import { ROLES } from "@/types/roles";
import {
  AlertTriangle,
  ShieldCheck,
  Clock,
  UserX,
} from "lucide-react";

const menu = [
  { href: "/fraud", label: "Alerts", icon: AlertTriangle },
  { href: "/fraud/rules", label: "Rules", icon: ShieldCheck },
  { href: "/fraud/history", label: "History", icon: Clock },
  { href: "/fraud/blocked-users", label: "Blocked Users", icon: UserX },
];

function FraudTeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <InternalLayout menu={menu} roleKey="fraud_team">
      {children}
    </InternalLayout>
  );
}

export default withRoleGuard(FraudTeamLayout, [ROLES.FRAUD_TEAM]);
