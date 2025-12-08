import BusinessDashboardHome from "@/components/business-dashboard/BusinessDashboardHome";
import { RoleGate } from "@/components/auth/RoleGate";

export default function LandlordDashboardPage() {
  return (
    <RoleGate allowedRoles={["COMPANY", "LANDLORD"]}>
      <BusinessDashboardHome />
    </RoleGate>
  );
}
