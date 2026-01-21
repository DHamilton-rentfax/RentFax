"use client";

import { useState } from "react";
import FinalRenterReportDrawer from "@/components/reports/FinalRenterReportDrawer";

export default function NewVehicleReportPage() {
  const [open, setOpen] = useState(true);

  // Temporary mock renter (until wired from SearchRenterModal)
  const renter = {
    renterId: "RENTER_123",
    fullName: "John Doe",
    memberId: "RFX-48291",
    verified: true,
    riskLevel: "LOW" as const,
    totalRentals: 22,
    cleanRentals: 22,
    lastRentalAt: "2025-12-18T00:00:00Z",
  };

  return (
    <>
      <FinalRenterReportDrawer
        open={open}
        onClose={() => setOpen(false)}
        renter={renter}
        onSave={async (draft) => {
          console.log("Final rental record:", draft);
        }}
      />
    </>
  );
}
