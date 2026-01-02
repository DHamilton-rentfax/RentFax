"use client";

import { useState } from "react";
import SuperAdminSidebar from "@/components/superadmin/SuperAdminSidebar";
import SuperAdminHeader from "@/components/superadmin/SuperAdminHeader";
import SuperAdminContainer from "@/components/superadmin/SuperAdminContainer";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      <SuperAdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* RIGHT SIDE */}
      <div className="flex flex-1 flex-col">

        {/* HEADER */}
        <SuperAdminHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* CONTENT */}
        <SuperAdminContainer>{children}</SuperAdminContainer>
      </div>
    </div>
  );
}
