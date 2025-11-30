
'use client';

import { useState } from "react";
import { RoleGate } from "@/components/auth/RoleGate";
import SystemStats from "@/components/admin/control/SystemStats";
import CompanyTable from "@/components/admin/control/CompanyTable";
import RenterTable from "@/components/admin/control/RenterTable";
import DisputeTable from "@/components/admin/control/DisputeTable";
import AdminTable from "@/components/admin/control/AdminTable";
import AuditLogViewer from "@/components/admin/control/AuditLogViewer"; // Import the new component
import { Button } from "@/components/ui/button";

export default function ControlCenterPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "companies", label: "Companies" },
    { id: "renters", label: "Renters" },
    { id: "disputes", label: "Disputes" },
    { id: "admins", label: "Admins" },
    { id: "audit-logs", label: "Audit Logs" }, // Add the new tab
  ];

  return (
    <RoleGate allow={["SUPER_ADMIN"]}>
      <div className="p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Super Admin Control Center</h1>

        <div className="flex gap-3 border-b pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === "overview" && <SystemStats />}
        {activeTab === "companies" && <CompanyTable />}
        {activeTab === "renters" && <RenterTable />}
        {activeTab === "disputes" && <DisputeTable />}
        {activeTab === "admins" && <AdminTable />}
        {activeTab === "audit-logs" && <AuditLogViewer />} // Render the new component
      </div>
    </RoleGate>
  );
}
