import { redirect } from "next/navigation";

import { verifySessionServer } from "@/lib/verifySessionServer";

export default async function CompanyDashboardPage() {
  const session = await verifySessionServer();

  if (!session) {
    redirect("/auth/login");
  }

  if (session.role !== "COMPANY" && session.role !== "SUPER_ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Company Dashboard
      </h1>
      <p className="text-gray-600 mb-6">
        Logged in as: <span className="font-semibold">{session.email}</span>
      </p>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium mb-2">Renter Reports</h2>
          <p className="text-sm text-gray-500">
            Secure company data rendered server-side.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium mb-2">Fraud Analytics</h2>
          <p className="text-sm text-gray-500">
            All protected data verified through Firebase session cookie.
          </p>
        </div>
      </div>
    </main>
  );
}
