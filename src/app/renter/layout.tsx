"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NotificationBell from "@/components/ui/NotificationBell";
import { useAuth } from "@/hooks/use-auth";

export default function RenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: "/renter/docs", label: "Documents" },
    { href: "/renter/disputes", label: "Disputes" },
    { href: "/renter/messages", label: "Messages" },
    { href: "/renter/history", label: "History" },
    { href: "/renter/payments", label: "Payments" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-3 bg-gray-800 text-white fixed top-2 left-2 z-50 rounded"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-900 text-white p-4 z-40 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform`}
      >
        <h1 className="text-xl font-bold mb-6">Renter Portal</h1>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded ${
                pathname === item.href ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-gray-50 p-6 ml-0 md:ml-0">
        <div className="flex justify-end mb-4">
          {user && <NotificationBell uid={user.uid} />}
        </div>
        {children}
      </main>
    </div>
  );
}
