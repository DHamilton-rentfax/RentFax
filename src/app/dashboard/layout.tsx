"use client";

import UnifiedHeader from "@/components/UnifiedHeader";
import SidebarNav from "@/components/dashboard/SidebarNav";
import "../globals.css";
import BetaWidget from "@/components/BetaWidget";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav />

      <div className="flex-1 flex flex-col">
        <UnifiedHeader />

        <main className="flex-1 pt-[120px] px-4 sm:px-6">
          {children}
        </main>
      </div>
      <BetaWidget />
    </div>
  );
}
