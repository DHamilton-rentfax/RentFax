"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Header } from "@/components/layout/header";
import { Loader2 } from "lucide-react";
import Protected from "@/components/protected";
import NotificationBell from "@/components/notifications/NotificationBell";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Renters",
    href: "/dashboard/renters",
  },
  {
    title: "Incidents",
    href: "/dashboard/incidents",
  },
  {
    title: "Disputes",
    href: "/dashboard/disputes",
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
  },
  {
    title: "Audit",
    href: "/dashboard/audit",
  },
  {
    title: "Settings",
    href: "/dashboard/settings/billing",
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Redirect if not logged in
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Protected>
      <Header />
      <div className="flex justify-end p-4">
        <NotificationBell />
      </div>
      <div className="container mx-auto flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <SidebarNav items={sidebarNavItems} />
          </div>
        </aside>
        <main className="relative py-6 lg:py-8">{children}</main>
      </div>
    </Protected>
  );
}
