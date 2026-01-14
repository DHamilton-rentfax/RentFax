import InternalLayout from "@/app/_components/internal/InternalLayout";
import { RoleGuard } from "@/app/_components/RoleGuard";
import { AlertTriangle, ShieldCheck, Clock, UserX } from "lucide-react";

const menu = [
  { href: "/fraud-team", label: "Alerts", icon: AlertTriangle },
  { href: "/fraud-team/rules", label: "Rules", icon: ShieldCheck },
  { href: "/fraud-team/history", label: "History", icon: Clock },
  { href: "/fraud-team/blocked-users", label: "Blocked Users", icon: UserX },
];

export default function FraudTeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowed={["fraud_team"]}>
      <InternalLayout menu={menu} role="fraud_team">
        {children}
      </InternalLayout>
    </RoleGuard>
  );
}
