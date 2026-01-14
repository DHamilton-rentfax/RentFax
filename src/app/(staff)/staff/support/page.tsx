
import Link from "next/link";

export default function SupportDashboardPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Support Dashboard</h1>
        <p className="text-sm text-gray-500">
          Internal RentFAX operations & compliance
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NavCard
          title="Cases"
          links={[
            { label: "Disputes", href: "/support/disputes" },
            { label: "Incidents", href: "/support/incidents" },
            { label: "Resolutions", href: "/support/resolutions" },
          ]}
        />

        <NavCard
          title="Risk & Compliance"
          links={[
            { label: "Identity Requests", href: "/support/identity-requests" },
            { label: "Fraud Signals", href: "/support/risk" },
            { label: "Audit Log", href: "/support/audit-log" },
          ]}
        />

        <NavCard
          title="Platform"
          links={[
            { label: "Renters", href: "/support/renters" },
            { label: "Companies", href: "/support/companies" },
            { label: "Search Audit", href: "/support/search-audit" },
          ]}
        />

        <NavCard
          title="Growth (Restricted)"
          links={[
            { label: "Sales Pipeline", href: "/support/sales" },
            { label: "Onboarding", href: "/support/onboarding" },
          ]}
        />
      </section>
    </main>
  );
}

function NavCard({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="rounded-xl border bg-white p-6 space-y-3">
      <h2 className="font-semibold">{title}</h2>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-blue-600 hover:underline"
            >
              {l.label} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
