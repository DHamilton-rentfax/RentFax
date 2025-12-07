"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, AlertTriangle, Users } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FileText },
  { href: "/admin/dashboard/disputes", label: "Disputes", icon: FileText },
  {
    href: "/admin/dashboard/fraud",
    label: "Fraud Monitor",
    icon: AlertTriangle,
  },
  { href: "/admin/dashboard/invites", label: "Team Invites", icon: Users },
  { href: "/admin/dashboard/blogs", label: "Blogs", icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 flex flex-col">
      <div className="p-4 text-2xl font-bold">RentFAX Admin</div>
      <nav className="flex-1 space-y-2 p-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center px-4 py-2 rounded-md transition ${
              pathname === href ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
