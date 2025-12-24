import { RoleGuard } from "@/app/_components/RoleGuard";
import { InternalLayout } from "@/app/_components/internal/InternalLayout";

const navItems = [
  { name: "Dashboard", href: "/sales" },
  { name: "Leads", href: "/sales/leads" },
  { name: "Proposals", href: "/sales/proposals" },
  { name: "Demos", href: "/sales/demos" },
];

export default function SalesTeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowed={["sales_team"]}>
      <InternalLayout navItems={navItems}>{children}</InternalLayout>
    </RoleGuard>
  );
}
