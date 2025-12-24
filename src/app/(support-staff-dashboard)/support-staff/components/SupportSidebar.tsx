"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  FileWarning,
  MessageSquare,
  BarChart3,
} from "lucide-react";

const links = [
  { href: "/support-staff", label: "Dashboard", icon: LayoutDashboard },
  { href: "/support-staff/tickets", label: "Tickets", icon: Mail },
  { href: "/support-staff/disputes", label: "Disputes", icon: FileWarning },
  { href: "/support-staff/chat", label: "Live Chat", icon: MessageSquare },
  { href: "/support-staff/analytics", label: "Analytics", icon: BarChart3 },
];

export function SupportSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white fixed inset-y-0 left-0 shadow-xl z-20">
      <div className="p-5 text-2xl font-bold border-b border-gray-700">
        Support Console
      </div>

      <nav className="p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center px-4 py-2 rounded-lg transition ${
              pathname.startsWith(href)
                ? "bg-gray-700"
                : "hover:bg-gray-800"
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
