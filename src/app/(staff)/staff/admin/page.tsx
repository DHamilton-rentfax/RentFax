import Link from "next/link";
import { adminDb } from "@/firebase/server";

export const dynamic = "force-dynamic";

async function getAdminStats() {
  const [disputes, incidents, reports, renters] = await Promise.all([
    adminDb.collection("disputes").limit(1).get(),
    adminDb.collection("incidents").limit(1).get(),
    adminDb.collection("reports").limit(1).get(),
    adminDb.collection("renters").limit(1).get(),
  ]);

  return {
    disputes: disputes.size,
    incidents: incidents.size,
    reports: reports.size,
    renters: renters.size,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Case management and operational oversight
        </p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat label="Disputes" value={stats.disputes} href="/admin-dashboard/disputes" />
        <Stat label="Incidents" value={stats.incidents} href="/admin-dashboard/incidents" />
        <Stat label="Reports" value={stats.reports} href="/admin-dashboard/reports" />
        <Stat label="Renters" value={stats.renters} href="/admin-dashboard/renters" />
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Nav
          title="Case Work"
          links={[
            ["Disputes", "/admin-dashboard/disputes"],
            ["Incidents", "/admin-dashboard/incidents"],
            ["Resolutions", "/admin-dashboard/resolutions"],
          ]}
        />
        <Nav
          title="Administration"
          links={[
            ["Audit Logs", "/admin-dashboard/audit"],
            ["Notifications", "/admin-dashboard/notifications"],
            ["Settings", "/admin-dashboard/settings"],
          ]}
        />
      </section>
    </main>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="border rounded-xl p-4 hover:shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </Link>
  );
}

function Nav({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div className="border rounded-xl p-6 space-y-3">
      <h2 className="font-semibold">{title}</h2>
      {links.map(([label, href]) => (
        <Link key={href} href={href} className="block text-blue-600 hover:underline">
          {label} →
        </Link>
      ))}
    </div>
  );
}
