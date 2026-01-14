import { getIdentityRequests } from "@/app/actions/identity-actions";
import { requireRole } from "@/lib/requireRole";
import { ROLES } from "@/types/roles";
import { IdentitySession } from "@/types/identity";
import Link from "next/link";

export default async function SupportIdentityPage() {
  await requireRole([ROLES.SUPPORT_ADMIN, ROLES.COMPLIANCE_AGENT]);

  const requests = await getIdentityRequests();

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Identity Verification</h1>
        <p className="text-sm text-gray-500">Review and manage renter identity checks</p>
      </header>
      <div className="border rounded-xl bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renter</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Review</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((req) => (
              <tr key={req.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.renter.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/support/identity-requests/${req.id}`} className="text-blue-600 hover:text-blue-900">Review</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}