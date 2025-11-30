'use client';

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import MobileSidebar from "@/components/admin/MobileSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-slate-600" />
      </div>
    );
  }

  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
      >
        ☰
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed left-0 top-0 h-full border-r bg-white">
        <AdminSidebar />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar open={open} onClose={() => setOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6">
        {children}
      </main>
    </div>
  );
}
