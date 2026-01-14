
import { requireRole } from "@/lib/requireRole";
import { ROLES } from "@/types/roles";

type Incident = {
  id: string;
  rentalId: string;
  type: "Damage" | "Late Return" | "Non-Payment" | "Smoking" | "Other";
  description: string;
  date: string;
  amount: number;
  resolved: boolean;
};

export default async function SupportIncidentsPage() {
  await requireRole([ROLES.SUPPORT_ADMIN, ROLES.SUPPORT_AGENT]);

  // 🚧 Mock data — safe for launch, replace with Firestore later
  const mockIncidents: Incident[] = [
    { id: "I-1", rentalId: "R-123", type: "Damage", description: "Scratches on the driver side door.", date: "2024-07-25", amount: 250.00, resolved: false },
    { id: "I-2", rentalId: "R-456", type: "Late Return", description: "Vehicle returned 2 days late.", date: "2024-07-26", amount: 150.00, resolved: true },
    { id: "I-3", rentalId: "R-789", type: "Non-Payment", description: "User has an outstanding balance.", date: "2024-07-27", amount: 500.00, resolved: false },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Incident Reports</h1>
        <p className="text-sm text-gray-500">Review and manage reported incidents</p>
      </header>
      <div className="border rounded-xl bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockIncidents.map((incident) => (
              <tr key={incident.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{incident.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{incident.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.resolved ? "Resolved" : "Open"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${incident.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
