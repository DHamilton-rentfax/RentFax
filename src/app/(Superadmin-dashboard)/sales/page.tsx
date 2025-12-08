"use client";

import { BarChart3, TrendingUp, Filter } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useModal } from "@/context/ModalContext";

import RevenueAnalytics from "@/components/admin/analytics/RevenueAnalytics";
import RevenueComparisonChart from "@/components/admin/dashboard/RevenueComparisonChart";
import AnalyticsExportPanel from "@/components/dashboard/AnalyticsExportPanel";

export default function SalesDashboard() {
  const { openModal } = useModal();

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <BarChart3 size={32} className="text-blue-600" />
          Sales & Revenue Analytics
        </h1>
        <Button
          variant="outline"
          onClick={() => openModal("adminAnalyticsFilter")}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <RevenueAnalytics />
      <RevenueComparisonChart />
      <AnalyticsExportPanel />
    </div>
  );
}
