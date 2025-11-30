"use client";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import type { AppUser } from "@/types/user";
import React from "react";

export default function ProfileMenu({ user }: { user: AppUser | null }) {
  const router = useRouter();

  const menuItems = [
    { label: "Profile Settings", onClick: () => router.push("/settings/profile") },
    { label: "Company Settings", onClick: () => router.push("/settings/company") },
    { label: "Audit Log", onClick: () => router.push("/admin/audit-log") },
    { label: "Sign Out", onClick: () => router.push("/logout") },
  ];

  return (
    <DropdownMenu
      trigger={
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar src={user?.photoURL} alt={user?.displayName} size={36} />
          <span className="hidden md:block text-sm font-medium text-gray-800">
            {user?.displayName || user?.email?.split("@")[0] || "User"}
          </span>
        </div>
      }
      items={menuItems}
    />
  );
}