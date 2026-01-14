
import { requireRole } from "@/lib/requireRole";
import { ROLES } from "@/types/roles";
import { AppUser } from "@/types/user";

// NOTE: The `AppUser` type is very basic.
// We are augmenting it here with mock data to build a realistic UI.
// In a real application, these fields should be added to the `AppUser` type in `user.ts`.
type MockRenter = AppUser & {
  name: string;
  status: "Active" | "Inactive" | "Suspended";
  lastSeenAt: number;
};

export default async function SupportRentersPage() {
  await requireRole([ROLES.SUPPORT_ADMIN, ROLES.SUPPORT_AGENT]);

  // 🚧 Mock data — safe for launch, replace with Firestore later
  const mockRenters: MockRenter[] = [
    { uid: "U-1", name: "John Doe", email: "john.doe@example.com", status: "Active", lastSeenAt: Date.now() - 1 * 60 * 60 * 1000 },
    { uid: "U-2", name: "Jane Smith", email: "jane.smith@example.com", status: "Inactive", lastSeenAt: Date.now() - 3 * 24 * 60 * 60 * 1000 },
    { uid: "U-3", name: "Peter Jones", email: "peter.jones@example.com", status: "Suspended", lastSeenAt: Date.now() - 7 * 24 * 60 * 60 * 1000 },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Renter Management</h1>
        <p className="text-sm text-gray-500">View and manage renter accounts</p>
      </header>
      <div className="border rounded-xl bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockRenters.map((renter) => (
              <tr key={renter.uid}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{renter.uid}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renter.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renter.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renter.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(renter.lastSeenAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
