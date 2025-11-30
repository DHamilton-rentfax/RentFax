"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Users, Home, BrainCircuit, Bell, CreditCard, Search, Shield } from "lucide-react";

export default function DemoSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/demo", label: "Dashboard", icon: <Home size={18} /> },
    { href: "/demo/search", label: "Renter Search", icon: <Search size={18} /> },
    { href: "/demo/ai-insights", label: "AI Insights", icon: <BrainCircuit size={18} /> },
    { href: "/demo/notifications", label: "Notifications", icon: <Bell size={18} /> },
    { href: "/demo/billing", label: "Billing", icon: <CreditCard size={18} /> },
    { href: "/demo/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    { href: "/demo/team", label: "Team", icon: <Users size={18} /> },
    { href: "/demo/admin-dashboard", label: "Admin", icon: <Shield size={18} /> },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 h-full md:h-screen shadow-sm">
      <div className="font-semibold text-gray-700 text-lg px-6 py-4 tracking-tight border-b border-gray-100">
        Demo Dashboard
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        {links.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium transition ${
              pathname === href
                ? "bg-emerald-100 text-emerald-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {icon} {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
