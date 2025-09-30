// src/app/(app)/admin/layout.tsx
"use client";

import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 border-r p-4">
        <h2 className="text-lg font-bold mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="block hover:underline">
            Dashboard
          </Link>
          <Link href="/admin/disputes" className="block hover:underline">
            Disputes
          </Link>
          <Link href="/admin/incidents" className="block hover:underline">
            Incidents
          </Link>
          <Link href="/admin/users" className="block hover:underline">
            Users
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}