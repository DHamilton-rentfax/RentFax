
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Redirect if not logged in
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 border-r flex flex-col gap-4">
        <Link href="/dashboard" className="font-bold text-lg">Dashboard</Link>
        <Link href="/dashboard/renters">Renters</Link>
        <Link href="/dashboard/incidents">Incidents</Link>
        <Link href="/dashboard/disputes">Disputes</Link>
        <Link href="/dashboard/settings">Settings</Link>

        {/* Show admin-only links */}
        {role === "SUPER_ADMIN" && (
          <div className="mt-6 border-t pt-4">
            <p className="text-xs uppercase text-gray-500">Admin</p>
            <Link href="/admin">Admin Dashboard</Link>
            <Link href="/admin/users">Users</Link>
            <Link href="/admin/disputes">Disputes</Link>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
