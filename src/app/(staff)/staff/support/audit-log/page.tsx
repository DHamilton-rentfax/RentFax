import { requireRole } from "@/lib/requireRole";
import { ROLES } from "@/types/roles";

export default async function SupportAuditLogPage() {
  await requireRole([ROLES.SUPPORT_ADMIN, ROLES.COMPLIANCE_AGENT]);

  const auditEvents = [
    { id: "A-98765", actor: "Alice (Agent)", action: "Viewed Dispute D-12345", target: "Dispute: D-12345", date: "2024-07-28 10:30 AM" },
    { id: "A-98766", actor: "Bob (Agent)", action: "Changed Dispute Status", target: "Dispute: D-12346", date: "2024-07-28 10:32 AM" },
    { id: "A-98767", actor: "Charlie (Admin)", action: "Exported User Data", target: "User: U-54321", date: "2024-07-28 10:35 AM" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Audit Log</h1>
        <p className="text-sm text-gray-500">Track and review all system activities</p>
      </header>
      <div className="border rounded-xl bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {auditEvents.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.actor}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.action}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.target}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-.500">{event.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
