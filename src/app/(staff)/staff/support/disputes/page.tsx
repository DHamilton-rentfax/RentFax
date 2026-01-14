import { requireRole } from "@/lib/requireRole";
import { ROLES } from "@/types/roles";

/**
 * Support Disputes Dashboard
 *
 * NOTE:
 * - This page intentionally uses mock data for launch stability
 * - Firestore integration will replace `mockDisputes` in Step 5+
 */

type SupportDispute = {
  id: string;
  renter: string;
  company: string;
  status: "Open" | "In Progress" | "Closed";
  date: string;
  assigned: string;
};

export default async function SupportDisputesPage() {
  await requireRole([ROLES.SUPPORT_ADMIN, ROLES.SUPPORT_AGENT]);

  // 🚧 Mock data — safe for launch, replace with Firestore later
  const mockDisputes: SupportDispute[] = [
    {
      id: "D-12345",
      renter: "John Doe",
      company: "Metro Property",
      status: "Open",
      date: "2024-07-28",
      assigned: "Alice",
    },
    {
      id: "D-12346",
      renter: "Jane Smith",
      company: "Skyline Realty",
      status: "In Progress",
      date: "2024-07-27",
      assigned: "Bob",
    },
    {
      id: "D-12347",
      renter: "Peter Jones",
      company: "Greenleaf Apartments",
      status: "Closed",
      date: "2024-07-26",
      assigned: "Alice",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Dispute Resolution Center</h1>
        <p className="text-sm text-gray-500">
          Review and manage renter disputes
        </p>
      </header>

      <div className="border rounded-xl bg-white overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Case ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Renter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Assigned To
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {mockDisputes.map((dispute) => (
              <tr key={dispute.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {dispute.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {dispute.renter}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {dispute.company}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {dispute.status}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {dispute.date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {dispute.assigned}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {mockDisputes.length === 0 && (
          <div className="p-6 text-sm text-gray-500">
            No disputes found.
          </div>
        )}
      </div>
    </main>
  );
}
