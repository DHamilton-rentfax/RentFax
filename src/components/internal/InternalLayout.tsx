"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Bell } from "lucide-react";
import { useMemo } from "react";

type MenuItem = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

const ROLE_THEMES: Record<string, string> = {
  super_admin: "linear-gradient(90deg, #6C47FF, #00C6FF)",
  admin: "#6C47FF",
  support_staff: "#006CFF",
  fraud_team: "#D32F2F",
  dispute_team: "#C77800",
  identity_team: "#009688",
  compliance_team: "#2E7D32",
  onboarding_team: "#0288D1",
  sales_team: "#9C27B0",
  engineering: "#455A64",
};

interface InternalLayoutProps {
  children: React.ReactNode;
  menu: MenuItem[];
  roleKey: keyof typeof ROLE_THEMES;
  title?: string;
}

export default function InternalLayout({
  children,
  menu,
  roleKey,
  title,
}: InternalLayoutProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  const bg = useMemo(() => {
    if ((user as any)?.roles?.super_admin) return ROLE_THEMES.super_admin;
    return ROLE_THEMES[roleKey] ?? "#111827";
  }, [user, roleKey]);

  const segments = pathname.split("/").filter(Boolean);

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
            const active = pathname === href || pathname.startsWith(href + "/");
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