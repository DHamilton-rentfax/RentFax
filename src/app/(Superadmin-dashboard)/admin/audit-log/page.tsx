"use client";

import { RoleGate } from "@/components/auth/RoleGate";
import AuditTable from "@/components/admin/control/AuditTable";

export default function AuditLogPage() {
  return (
    <RoleGate allow={["SUPER_ADMIN"]}>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          System Audit Log
        </h1>
        <p className="text-gray-500 mb-6">
          Review every admin action, dispute flag, or system event recorded
          across RentFAX.
        </p>
        <AuditTable />
      </div>
    </RoleGate>
  );
}
