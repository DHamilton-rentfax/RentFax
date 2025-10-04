"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Home, Users, FileText, MessageSquare, Shield, BarChart } from "lucide-react";
import { usePathname } from "next/navigation";

export default function RoleSidebar() {
  const { role } = useAuth();
  const pathname = usePathname();
  const currentRole = role || "VIEWER"; // ensure role is populated in auth claims

  const menus: Record<string, { href: string; label: string; icon: any }[]> = {
    SUPER_ADMIN: [
      { href: "/admin/super-dashboard", label: "Overview", icon: Home },
      { href: "/admin/super-dashboard/team", label: "Team Invites", icon: Users },
      { href: "/admin/super-dashboard/disputes", label: "Disputes", icon: FileText },
      { href: "/admin/super-dashboard/fraud", label: "Fraud Alerts", icon: Shield },
      { href: "/admin/super-dashboard/blogs", label: "Blog Management", icon: FileText },
      { href: "/admin/super-dashboard/billing", label: "Billing", icon: BarChart },
      { href: "/admin/super-dashboard/audit-log", label: "Audit Logs", icon: FileText },
      { href: "/admin/super-dashboard/alerts", label: "Alerts", icon: Shield },
      { href: "/admin/super-dashboard/critical-alerts", label: "Critical Alerts", icon: Shield }
    ],
    ADMIN: [
      { href: "/admin/dashboard", label: "Overview", icon: Home },
      { href: "/admin/dashboard/disputes", label: "Disputes", icon: FileText },
      { href: "/admin/dashboard/fraud", label: "Fraud Alerts", icon: Shield },
      { href: "/admin/dashboard/team", label: "Team Members", icon: Users },
      { href: "/admin/dashboard/blogs", label: "Blog Management", icon: FileText },
      { href: "/admin/dashboard/analytics", label: "Analytics", icon: BarChart }
    ],
    EDITOR: [
      { href: "/editor", label: "Overview", icon: Home },
      { href: "/editor/blogs", label: "Manage Blogs", icon: FileText },
      { href: "/editor/analytics", label: "Blog Analytics", icon: BarChart }
    ],
    SUPPORT: [
      { href: "/support", label: "Overview", icon: Home },
      { href: "/support/disputes", label: "Disputes", icon: FileText },
      { href: "/support/chats", label: "Live Chat", icon: MessageSquare }
    ],
    VIEWER: [
      { href: "/viewer", label: "Overview", icon: Home },
      { href: "/viewer/analytics", label: "Analytics", icon: BarChart },
      { href: "/viewer/reports", label: "Reports", icon: FileText }
    ]
  };

  const menu = menus[currentRole] || menus.VIEWER;

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex-col hidden md:flex fixed">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        {currentRole.replace('_', ' ')} Dashboard
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 p-2 rounded ${pathname.startsWith(item.href) ? "bg-gray-700" : "hover:bg-gray-700"}`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
