"use client";

import { RoleGate } from "@/components/auth/RoleGate";
import CompanyDeepView from "@/components/admin/control/CompanyDeepView";

export default function CompanyDeepViewPage({ params }: { params: { companyId: string } }) {

  return (
    <RoleGate allow={["SUPER_ADMIN"]}>
      <div className="p-8">
        <CompanyDeepView companyId={params.companyId} />
      </div>
    </RoleGate>
  );
}
