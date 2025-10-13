// src/app/(app)/admin/disputes/page.tsx
"use client";

import Link from "next/link";

const disputes = [
  { id: "123", subject: "Incorrect Charge", status: "Open" },
  { id: "456", subject: "Product Not Received", status: "Closed" },
  { id: "789", subject: "Damaged Item", status: "Open" },
];

export default function AdminDisputesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Disputes</h1>
      <div className="mt-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-2">ID</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((dispute) => (
              <tr key={dispute.id} className="border-b">
                <td className="p-2">{dispute.id}</td>
                <td className="p-2">{dispute.subject}</td>
                <td className="p-2">{dispute.status}</td>
                <td className="p-2">
                  <Link
                    href={`/admin/disputes/${dispute.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
