'use client';
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function RenterLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white shadow p-4">
        <h2 className="font-bold text-lg mb-6">RentFAX Portal</h2>
        <nav className="space-y-2">
          <Link href="/renter/dashboard" className="block">Dashboard</Link>
          <Link href="/renter/profile" className="block">My Profile</Link>
          <Link href="/renter/disputes/new" className="block">Submit Dispute</Link>
          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-red-500 mt-4"
          >
            Sign Out
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
