// src/app/dev/final-renter-report/page.tsx
"use client";

import { useState } from "react";
import FinalRenterReportDrawer from "@/components/reports/FinalRenterReportDrawer";
import type { FinalRentalRecordDraft } from "@/types/rental-record";
import type { RentalHistoryItem } from "@/components/renters/RentalHistoryTimeline";

// Mock data for the renter prop
const mockRenter = {
  renterId: "RENTER_ID_123",
  fullName: "John Doe",
  memberId: "MEMBER_ID_456",
  verified: true,
  totalRentals: 12,
  cleanRentals: 10,
  lastRentalAt: "2023-10-26T10:00:00Z",
  riskLevel: "LOW" as const,
};

// Mock onSave function
const mockOnSave = async (draft: FinalRentalRecordDraft) => {
  console.log("Saving draft:", draft);
  // Simulate a network request
  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log("Draft saved!");
};

// Mock rental history data
const mockHistory: RentalHistoryItem[] = [
  {
    id: "1",
    outcome: "COMPLETED_NO_ISSUES",
    signals: ["ON_TIME_PAYMENTS", "NO_DAMAGE"],
    context: {
      rentalType: "Vehicle",
      rentalDuration: "1–6 months",
      paymentFrequency: "Monthly",
    },
    scoreSnapshot: { fri: 92, riskLevel: "LOW" },
    createdAt: "2025-01-05T10:00:00Z",
    orgName: "Urban Rentals NYC",
  },
  {
    id: "2",
    outcome: "COMPLETED_NO_ISSUES",
    signals: ["ON_TIME_PAYMENTS"],
    context: {
      rentalType: "Vehicle",
      rentalDuration: "<30 days",
      paymentFrequency: "Weekly",
    },
    scoreSnapshot: { fri: 90, riskLevel: "LOW" },
    createdAt: "2024-11-20T10:00:00Z",
  },
  {
    id: "3",
    outcome: "COMPLETED_MINOR_ISSUES",
    signals: ["LATE_PAYMENT"],
    context: {
      rentalType: "Apartment",
      rentalDuration: "6+ months",
      paymentFrequency: "Monthly",
    },
    scoreSnapshot: {
      fri: 720,
      riskLevel: "MODERATE",
    },
    createdAt: "2022-05-20T11:00:00Z",
  },
];

export default function TestFinalRenterReportPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Default to open for easy testing

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page for FinalRenterReportDrawer</h1>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Drawer
      </button>

      <FinalRenterReportDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        renter={mockRenter}
        history={mockHistory} // Pass the mock history
        onSave={mockOnSave}
      />
    </div>
  );
}
