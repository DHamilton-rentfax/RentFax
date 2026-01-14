
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SuperAdminReportsIndexPage() {
  const links = [
    {
      title: "Company Reports (Legal)",
      description: "View report exports and related legal dashboards for companies.",
      href: "/superadmin/legal/company/reports",
    },
    {
      title: "Create Agency Report",
      description: "Create a new agency report flow.",
      href: "/superadmin/agency/reports/new",
    },
    {
      title: "Oversight",
      description: "System-level oversight dashboards.",
      href: "/superadmin/oversight",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500">
          Choose a reports module to view or manage.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-sm transition"
          >
            <div className="text-lg font-semibold text-gray-900">{l.title}</div>
            <div className="mt-1 text-sm text-gray-500">{l.description}</div>
            <div className="mt-4 text-sm font-medium text-blue-600">
              Open →
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
