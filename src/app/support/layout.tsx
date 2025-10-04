"use client";

import RoleSidebar from "@/components/RoleSidebar";

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <RoleSidebar />
      <main className="flex-1 bg-gray-50 min-h-screen ml-64">{children}</main>
    </div>
  );
}
