import Link from "next/link";

export default function SuperAdminDashboard() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Super Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            System-level oversight and controls
          </p>
        </div>

        <Link
          href="/superadmin/system-health"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View system health →
        </Link>
      </header>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          label="Renters"
          value={0} // Placeholder
          href="/superadmin/renters"
        />
        <KpiCard
          label="Reports"
          value={0} // Placeholder
          href="/superadmin/reports"
        />
        <KpiCard
          label="Disputes"
          value={0} // Placeholder
          href="/superadmin/disputes"
        />
        <KpiCard
          label="Companies"
          value={0} // Placeholder
          href="/superadmin/companies"
        />
      </section>

      {/* Navigation Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NavCard
          title="Risk & Oversight"
          description="Fraud signals, system risk, compliance."
          links={[
            { label: "Risk Dashboard", href: "/superadmin/risk" },
            { label: "Audit Logs", href: "/superadmin/audit" },
            { label: "Resolutions", href: "/superadmin/resolutions" },
          ]}
        />

        <NavCard
          title="Operations"
          description="Day-to-day platform management."
          links={[
            { label: "Disputes", href: "/superadmin/disputes" },
            { label: "Incidents", href: "/superadmin/incidents" },
            { label: "Reports", href: "/superadmin/reports" },
          ]}
        />

        <NavCard
          title="Business"
          description="Revenue, partners, growth."
          links={[
            { label: "Billing", href: "/superadmin/billing" },
            { label: "Partners", href: "/superadmin/partners" },
            { label: "Sales", href: "/superadmin/sales" },
          ]}
        />

        <NavCard
          title="Configuration"
          description="System rules and platform settings."
          links={[
            { label: "Rules", href: "/superadmin/rules" },
            { label: "Settings", href: "/superadmin/settings" },
            { label: "Legal", href: "/superadmin/legal" },
          ]}
        />
      </section>
    </main>
  );
}

function KpiCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-sm transition"
    >
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">
        {value}
      </div>
    </Link>
  );
}

function NavCard({
  title,
  description,
  links,
}: {
  title: string;
  description: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              {link.label} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
