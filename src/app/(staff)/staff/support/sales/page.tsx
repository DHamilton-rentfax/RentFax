import { requireRole } from "@/lib/requireRole";
import { ROLES } from "@/types/roles";
import { Lead } from "@/types/sales";

export default async function SalesPage() {
  await requireRole([ROLES.SALES_AGENT, ROLES.SUPPORT_ADMIN]);

  const leads: Lead[] = [
    { id: "L-001", name: "Big Corp", email: "contact@bigcorp.com", status: "qualified", assignedTo: "Sales Rep A", createdAt: Date.now(), updatedAt: Date.now(), vertical: 'housing' },
    { id: "L-002", name: "Startup Inc", email: "hello@startup.com", status: "demo", assignedTo: "Sales Rep B", createdAt: Date.now(), updatedAt: Date.now(), vertical: 'car rental' },
    { id: "L-003", name: "Small Biz LLC", email: "info@smallbiz.com", status: "new", assignedTo: "Sales Rep A", createdAt: Date.now(), updatedAt: Date.now(), vertical: 'equipment' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Sales Pipeline</h1>
        <p className="text-sm text-gray-500">Company onboarding & revenue tracking</p>
      </header>
      <div className="border rounded-xl bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vertical</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.assignedTo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.vertical}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
