'use client';
import { useState } from "react";
import { Info } from "lucide-react";

import ManageAddOnsSidebar from "./ManageAddOnsSidebar";

export default function PlanSwitcherBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Starter");

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Current Plan:</span>
        <select
          value={currentPlan}
          onChange={(e) => setCurrentPlan(e.target.value)}
          className="border rounded-md text-sm px-2 py-1 focus:outline-none"
        >
          <option>Pay as You Go</option>
          <option>Starter</option>
          <option>Pro</option>
          <option>Enterprise</option>
        </select>

        <div className="text-sm text-gray-500 flex items-center gap-1">
          <Info size={14} className="text-emerald-500" />
          <span>Identity $4.99 • Report Unlock $20</span>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="text-sm font-medium text-emerald-600 border border-emerald-200 px-3 py-1 rounded-md hover:bg-emerald-50"
      >
        Manage Add-Ons
      </button>

      <ManageAddOnsSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
