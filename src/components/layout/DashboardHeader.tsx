"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

import Breadcrumbs from "./Breadcrumbs";
import NotificationBell from "../notifications/NotificationBell";
import UserMenu from "./UserMenu";

const menuForRole = {
  LANDLORD: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Search", href: "/dashboard/search" },
    { label: "Reports", href: "/dashboard/reports" },
  ],
  AGENCY: [
    { label: "Clients", href: "/dashboard/clients" },
    { label: "Search", href: "/dashboard/search" },
    { label: "Audits", href: "/dashboard/audits" },
  ],
  SUPER_ADMIN: [
    { label: "Admin Panel", href: "/admin" },
    { label: "Users", href: "/admin/users" },
    { label: "Billing", href: "/admin/billing" },
  ],
};

export default function DashboardHeader({ user }: { user: any }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const activeMenu = menuForRole[user?.role] ?? menuForRole.LANDLORD;

  return (
    <header className="fixed top-0 left-0 w-full z-[200]">
      <div
        className={clsx(
          "bg-white/80 backdrop-blur-xl border-b border-gray-200/70 transition-all",
          scrollY > 2 ? "shadow-[0_2px_10px_rgba(0,0,0,0.07)]" : "shadow-none"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-2xl font-extrabold text-[#1A2540]">
              Rent<span className="text-[#D4AF37]">FAX</span>
            </Link>
            <div className="hidden lg:block mt-1">
              <Breadcrumbs />
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {activeMenu.map((item) => (
              <Link key={item.href} href={item.href} className="text-gray-700 hover:text-black">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserMenu user={user} />

            {/* Mobile Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-gray-700"
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.23 }}
            className="lg:hidden bg-white border-b shadow-xl px-6 py-4 space-y-4"
          >
            {activeMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-gray-700 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
