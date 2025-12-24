
"use client";

import { useState } from "react";
import { updateGlobalCommissionSettings } from "@/actions/commission/settings";
import { CommissionSettingsForm } from "@/components/admin/commission/CommissionSettingsForm";

export default function CommissionSettings() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Global Commission Settings</h1>
      <CommissionSettingsForm />
    </div>
  );
}
