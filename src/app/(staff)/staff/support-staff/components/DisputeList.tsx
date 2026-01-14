"use client";

import Link from "next/link";

const disputes = [
  { id: "disp_1", renterId: "user_abc" },
  { id: "disp_2", renterId: "user_def" },
];

export default function DisputeList() {
  return (
    <div className="space-y-3">
      {disputes.map((dispute) => (
        <Link
          key={dispute.id}
          href={`/support-staff/disputes/${dispute.id}`}
          className="p-4 border rounded-xl bg-white hover:bg-gray-50 shadow-sm block"
        >
          <div className="font-semibold">Dispute #{dispute.id}</div>
          <div className="text-gray-600 text-sm">Renter: {dispute.renterId}</div>
        </Link>
      ))}
    </div>
  );
}
