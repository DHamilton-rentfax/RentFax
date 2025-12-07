"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Users,
  Building2,
  FileText,
  AlertTriangle,
  CreditCard,
  Settings,
  MessageSquare,
  List,
} from "lucide-react";

const navItems = [
  { href: "/admin/super-dashboard", label: "Overview", icon: FileText },
  { href: "/admin/super-dashboard/users", label: "Users & Roles", icon: Users },
  {
    href: "/admin/super-dashboard/companies",
    label: "Companies",
    icon: Building2,
  },
  {
    href: "/admin/super-dashboard/incidents",
    label: "Incidents",
    icon: AlertTriangle,
  },
  {
    href: "/admin/super-dashboard/disputes",
    label: "Disputes",
    icon: FileText,
  },
  { href: "/admin/super-dashboard/blogs", label: "Blogs", icon: FileText },
  {
    href: "/admin/super-dashboard/fraud",
    label: "Fraud Monitor",
    icon: AlertTriangle,
  },
  {
    href: "/admin/super-dashboard/billing",
    label: "Billing",
    icon: CreditCard,
  },
  {
    href: "/admin/super-dashboard/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    href: "/admin/super-dashboard/chat",
    label: "Live Chat",
    icon: MessageSquare,
  },
  {
    href: "/admin/dashboard/logs",
    label: "System Logs",
    icon: List,
  },
  {
    href: "/admin/super-dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function Sidebar() {
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
