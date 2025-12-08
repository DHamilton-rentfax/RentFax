"use client";

import { X, LayoutDashboard, Users, Building2, Settings, Database, ShieldCheck, FileText } from "lucide-react";
import Link from "next/link";

export default function SuperAdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[998] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static z-[999] top-0 left-0 h-full w-72 bg-white shadow-lg transition-transform duration-300 
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* TOP */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h1 className="font-bold text-lg">RentFAX Admin</h1>
          <button
            className="lg:hidden text-gray-600 hover:text-black"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NAV */}
        <nav className="mt-3 px-3 space-y-1 text-sm">

          <MenuItem icon={<LayoutDashboard />} label="Dashboard" href="/superadmin-dashboard" />

          <MenuItem icon={<Users />} label="Users" href="/superadmin-dashboard/users" />

          <MenuItem icon={<Building2 />} label="Companies" href="/superadmin-dashboard/companies" />

          <MenuItem icon={<Database />} label="Search & Verification Logs" href="/superadmin-dashboard/search" />

          <MenuItem icon={<ShieldCheck />} label="Risk Engine" href="/superadmin-dashboard/risk" />

          <MenuItem icon={<FileText />} label="Reports" href="/superadmin-dashboard/reports" />

          <MenuItem icon={<Settings />} label="System Settings" href="/superadmin-dashboard/settings" />

        </nav>
      </aside>
    </>
  );
}

function MenuItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
    >
      {icon}
      {label}
    </Link>
  );
}
