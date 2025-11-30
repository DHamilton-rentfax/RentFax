'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import DemoSidebar from "@/components/demo/DemoSidebar";
import PlanSwitcherBar from "@/components/demo/PlanSwitcherBar";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-md border text-gray-600 hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="RentFAX Logo" width={28} height={28} />
            <span className="font-semibold text-lg text-gray-800">RentFAX Demo</span>
          </div>
        </div>

        <Link href="/" className="text-sm text-gray-600 hover:text-emerald-600 transition">
          ← Back to Main Site
        </Link>
      </header>
      
      {/* Plan Switcher Bar */}
      <PlanSwitcherBar />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 bg-white shadow-lg border-r transform transition-transform duration-300 ease-in-out z-30 lg:static lg:translate-x-0 lg:w-64 ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}`}>
          <DemoSidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
