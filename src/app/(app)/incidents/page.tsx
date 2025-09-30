
"use client";

import Link from "next/link";

const incidents = [
  { id: "abc", description: "Suspicious login attempt", priority: "High" },
  { id: "def", description: "Service outage in EU region", priority: "Medium" },
  { id: "ghi", description: "Payment processing failed", priority: "High" },
];

export default function AdminIncidentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Incidents</h1>
      <div className="mt-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-2">ID</th>
              <th className="p-2">Description</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.id} className="border-b">
                <td className="p-2">{incident.id}</td>
                <td className="p-2">{incident.description}</td>
                <td className="p-2">{incident.priority}</td>
                <td className="p-2">
                  <Link href={`/incidents/${incident.id}`} className="text-blue-500 hover:underline">
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
