"use client";

import { RoleGate } from "@/components/auth/RoleGate";
import CompanyDashboard from "@/components/dashboard/CompanyDashboard"; // shared companies/individuals UI

export default function CompanyDashboardPage() {
  return (
    <RoleGate allow={["COMPANY", "INDIVIDUAL", "ADMIN", "SUPER_ADMIN"]}>
      <CompanyDashboard />
    </RoleGate>
  );
}
