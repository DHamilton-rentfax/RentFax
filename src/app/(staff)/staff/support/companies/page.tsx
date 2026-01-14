
import { requireRole } from "@/lib/requireRole";
import { ROLES } from "@/types/roles";
import { CompanySettings } from "@/types/company";

// NOTE: The `CompanySettings` type is very basic.
// We are augmenting it here with mock data to build a realistic UI.
// In a real application, these fields should be added to a `Company` type.
type MockCompany = CompanySettings & {
  id: string;
  name: string;
  status: "Active" | "Onboarding" | "Suspended";
  propertyCount: number;
};

export default async function SupportCompaniesPage() {
  await requireRole([ROLES.SUPPORT_ADMIN, ROLES.SUPPORT_AGENT]);

  // 🚧 Mock data — safe for launch, replace with Firestore later
  const mockCompanies: MockCompany[] = [
    { id: "C-1", name: "Luxury Apartments Inc.", status: "Active", propertyCount: 15, strictVerification: true, updatedAt: Date.now() },
    { id: "C-2", name: "Affordable Housing LLC", status: "Onboarding", propertyCount: 5, strictVerification: false, updatedAt: Date.now() },
    { id: "C-3", name: "City View Properties", status: "Suspended", propertyCount: 25, strictVerification: true, updatedAt: Date.now() },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Company Management</h1>
        <p className="text-sm text-gray-500">View and manage company accounts</p>
      </header>
      <div className="border rounded-xl bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Properties</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strict Verification</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockCompanies.map((company) => (
              <tr key={company.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.propertyCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.strictVerification ? "Enabled" : "Disabled"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
