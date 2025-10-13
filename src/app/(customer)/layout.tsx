"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Loader2 } from "lucide-react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import AiAssistant from "@/components/renter/AiAssistant";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/renter/dashboard",
  },
  {
    title: "Start Resolution",
    href: "/renter/start-resolution",
  },
  {
    title: "Settings",
    href: "/renter/settings",
  },
];

export default function RenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <SidebarNav items={sidebarNavItems} />
          </div>
        </aside>
        <main className="relative py-6 lg:py-8">{children}</main>
      </div>
      <AiAssistant />
      <Footer />
    </>
  );
}
