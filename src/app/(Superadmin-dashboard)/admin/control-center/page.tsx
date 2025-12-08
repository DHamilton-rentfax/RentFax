"use client";

import { RoleGate } from "@/components/auth/RoleGate";

import BillingInsights from "@/components/billing/BillingInsights";
import UsageLineChart from "@/components/billing/UsageLineChart";
import OverageRiskMeter from "@/components/billing/OverageRiskMeter";
import CreditBurnChart from "@/components/billing/CreditBurnChart";

import SystemStats from "@/components/admin/control/SystemStats";
import VerifyCompanyPanel from "@/components/admin/dashboard/VerifyCompanyPanel";

export default function ControlCenterPage() {
  return (
    <RoleGate allowedRoles={["SUPER_ADMIN"]}>
      <div className="p-8 space-y-12">

        {/* PAGE HEADER */}
        <header>
          <h1 className="text-3xl font-bold text-[#1A2540]">
            RentFAX Control Center
          </h1>
          <p className="text-gray-600 mt-1">
            System-wide analytics, metrics, and administration tools.
          </p>
        </header>

        {/* SYSTEM METRICS */}
        <SystemStats />

        {/* BILLING METRICS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <BillingInsights />
          <OverageRiskMeter />
          <CreditBurnChart />
          <UsageLineChart />
        </div>

        {/* VERIFICATION QUEUE */}
        <section className="mt-10 p-6 border rounded-xl bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-[#1A2540] mb-4">
            Companies Awaiting Verification
          </h2>

          {/* Panel expects props; we will wire this up later */}
          <VerifyCompanyPanel company={null} />
        </section>

      </div>
    </RoleGate>
  );
}
