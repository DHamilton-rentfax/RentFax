"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Bell } from "lucide-react";
import { useMemo } from "react";
import { ROLES, Role } from "@/types/roles";

type MenuItem = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

const ROLE_THEMES: Record<Role, string> = {
  [ROLES.SUPER_ADMIN]: "linear-gradient(90deg, #6C47FF, #00C6FF)",
  [ROLES.ADMIN]: "#6C47FF",

  [ROLES.SUPPORT_STAFF]: "#006CFF",
  [ROLES.FRAUD_TEAM]: "#D32F2F",
  [ROLES.DISPUTE_TEAM]: "#C77800",
  [ROLES.IDENTITY_TEAM]: "#009688",
  [ROLES.COMPLIANCE_TEAM]: "#2E7D32",
  [ROLES.ONBOARDING_TEAM]: "#0288D1",
  [ROLES.SALES_TEAM]: "#9C27B0",
  [ROLES.ENGINEERING]: "#455A64",

  [ROLES.RENTER]: "#111827",
  [ROLES.UNINITIALIZED]: "#111827",
};

interface InternalLayoutProps {
  children: React.ReactNode;
  menu: MenuItem[];
  roleKey: Role;
  title?: string;
}

export default function InternalLayout({
  children,
  menu,
  roleKey,
  title,
}: InternalLayoutProps) {
  const { user } = useAuth();
  const pathname = usePathname() ?? "";

  const bg = useMemo(() => {
    if (user?.role === ROLES.SUPER_ADMIN) {
      return ROLE_THEMES[ROLES.SUPER_ADMIN];
    }
    return ROLE_THEMES[roleKey] ?? "#111827";
  }, [user?.role, roleKey]);

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((seg) => !seg.startsWith("("));

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* SIDEBAR */}
      <aside
        className="w-64 flex flex-col text-white"
        style={{ background: bg }}
      >
        <div className="p-4 border-b border-white/10">
          <div className="text-xs uppercase tracking-wide opacity-80">
            Internal
          </div>
          <div className="text-xl font-bold">RentFAX</div>
          {title && <div className="text-sm mt-1 opacity-80">{title}</div>}
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menu.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || pathname.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                  active ? "bg-black/20" : "hover:bg-black/10"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 text-xs opacity-80">
          {user?.email && (
            <>
              Signed in as
              <br />
              <span className="font-medium">{user.email}</span>
            </>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {segments.map((seg, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                <span className="capitalize">
                  {seg.replace(/-/g, " ")}
                </span>
              </span>
            ))}
          </div>
          <button className="relative">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
