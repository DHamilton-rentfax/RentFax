"use client";

import Link from "next/link";
import { useTenantTheme } from "@/context/TenantThemeContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  FileWarning,
  Scale,
  Settings,
  PlusSquare,
  Search,
} from "lucide-react";

export default function AdminSidebar() {
  const theme = useTenantTheme();

  const logo = theme?.logoUrl || "/logo-dark.png";
  const sidebarBg = theme?.colors?.sidebarBg || "#0f172a";
  const sidebarText = theme?.colors?.sidebarText || "white";

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/companies", label: "Companies", icon: Building2 },
    { href: "/admin/renters", label: "Renters", icon: Users },
    {
      href: "/admin/renters/new-company",
      label: "Create Company Renter",
      icon: PlusSquare,
    },
    { href: "/dashboard/search", label: "Search Renters", icon: Search },
    { href: "/admin/incidents", label: "Incidents", icon: FileWarning },
    { href: "/admin/disputes", label: "Dispute Review", icon: Scale },
    { href: "/admin/fraud", label: "Fraud Center", icon: ShieldCheck },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className="w-64 min-h-screen flex flex-col p-4"
      style={{ background: sidebarBg, color: sidebarText }}
    >
      <div className="flex items-center gap-3 mb-8">
        <img src={logo} alt="logo" className="h-10 w-auto" />
      </div>

      <nav className="space-y-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-white/10"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
