
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SuperAdminPartnersIndexPage() {
  const links = [
    {
      title: "Partners List",
      description: "View and manage partner organizations.",
      href: "/superadmin/partners/list",
    },
    {
      title: "Partner Verification",
      description: "Review verification requests and statuses.",
      href: "/superadmin/partners/verification",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Partners</h1>
        <p className="text-sm text-gray-500">Partner management and verification.</p>
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
