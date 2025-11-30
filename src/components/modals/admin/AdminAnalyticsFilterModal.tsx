"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Filter } from "lucide-react";

export interface AdminAnalyticsFilterProps {
  filters: {
    startDate: string;
    endDate: string;
  };
  close: () => void;
  onApply: (filters: { startDate: string; endDate: string }) => void;
}

export default function AdminAnalyticsFilterModal({
  filters,
  close,
  onApply,
}: AdminAnalyticsFilterProps) {
  // fallback ensures modal never crashes from undefined props  
  const safeFilters = filters ?? { startDate: "", endDate: "" };

  const [localFilters, setLocalFilters] = useState({
    startDate: safeFilters.startDate,
    endDate: safeFilters.endDate,
  });

  const apply = () => {
    onApply(localFilters);
    close();
  };

  return (
    <div className="space-y-6" role="dialog" aria-modal="true">
      {/* Header */}
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Filter className="h-5 w-5 text-blue-600" />
        Analytics Filters
      </h2>

      {/* Date Range */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex gap-2 items-center">
          <Calendar size={16} />
          Date Range
        </label>

        <div className="grid grid-cols-1 gap-3">
          <input
            type="date"
            className="border rounded-lg p-2 w-full"
            value={localFilters.startDate}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                startDate: e.target.value,
              }))
            }
          />

          <input
            type="date"
            className="border rounded-lg p-2 w-full"
            value={localFilters.endDate}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                endDate: e.target.value,
              }))
            }
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <Button className="w-full" onClick={apply}>
          Apply Filters
        </Button>

        <Button variant="outline" className="w-full" onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
