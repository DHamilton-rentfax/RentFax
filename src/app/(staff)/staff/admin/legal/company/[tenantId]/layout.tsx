"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useTenantTheme } from "@/hooks/use-tenant-theme";
import Image from "next/image";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { tenantId } = useParams();
  const { loading, error, tenant, theme } = useTenantTheme(tenantId);

  const nav = [
    { label: "Dashboard", href: `/company/${tenantId}/dashboard` },
    { label: "Renters", href: `/company/${tenantId}/renters` },
    { label: "Incidents", href: `/company/${tenantId}/incidents` },
    { label: "Reports", href: `/company/${tenantId}/reports` },
    { label: "Settings", href: `/company/${tenantId}/settings` },
  ];

  // While loading, show a simple skeleton
  if (loading) {
    return (
      <div
        className="flex min-h-screen"
        style={{ backgroundColor: theme.background, color: theme.text }}
      >
        <aside className="w-64 border-r bg-white p-6">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 bg-gray-100 rounded animate-pulse"
              />
            ))}
          </div>
        </aside>
        <main className="flex-1 p-8">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </main>
      </div>
    );
  }

  // If there's an error or no tenant, show fallback
  if (error || !tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="bg-white shadow rounded-lg p-8 max-w-md text-center">
          <h1 className="text-xl font-semibold mb-2">Company not found</h1>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t load the company workspace. It might have been removed
            or you may not have access.
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-black text-white rounded-md"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const primary = theme.primary || "#111827";
  const textColor = theme.text || "#111827";
  const backgroundColor = theme.background || "#FFFFFF";

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor, color: textColor }}
    >
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="px-6 py-5 flex items-center gap-3 border-b">
          {tenant.logoUrl ? (
            <Image
              src={tenant.logoUrl}
              alt={`${tenant.name} logo`}
              width={40}
              height={40}
              className="rounded-md object-contain"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: primary }}
            >
              {tenant.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <div className="font-semibold text-sm">{tenant.name}</div>
            <div className="text-xs text-gray-500">
              Company Workspace
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                style={active ? { backgroundColor: primary } : {}}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
