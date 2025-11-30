"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export default function ReportFoundModal({ renterId, close }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <ShieldCheck className="h-12 w-12 text-green-600" />
        <h2 className="text-xl font-semibold mt-3">Report Found</h2>
        <p className="text-gray-600 mt-1">
          This renter has an active profile in the RentFAX Network.
        </p>

        {renterId && (
          <p className="text-xs mt-2 text-gray-400 font-mono">
            ID: {renterId}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Button className="w-full" onClick={close}>
          View Full Report
        </Button>

        <Button variant="outline" className="w-full" onClick={close}>
          Close
        </Button>
      </div>
    </div>
  );
}
