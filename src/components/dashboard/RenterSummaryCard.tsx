"use client";

import { Card } from "./ui/Card";
import { ShieldCheck, AlertTriangle } from "lucide-react";

export default function RenterSummaryCard({ renter }: { renter: any }) {
  return (
    <Card>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-800">{renter.name}</h3>
          <p className="text-xs text-gray-500">{renter.email}</p>
        </div>
        {renter.riskScore < 3 ? (
          <ShieldCheck className="h-6 w-6 text-green-500" />
        ) : (
          <AlertTriangle className="h-6 w-6 text-red-500" />
        )}
      </div>
      <p className="text-xs mt-2 text-gray-600">
        Behavior Score: <strong>{renter.behaviorScore ?? "N/A"}</strong>
      </p>
      <p className="text-xs text-gray-500">
        Last Verified: {new Date(renter.verifiedAt).toLocaleDateString()}
      </p>
    </Card>
  );
}
