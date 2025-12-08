"use client";

import { Menu } from "lucide-react";
import Image from "next/image";

export default function SuperAdminHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <header className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6 sticky top-0 z-[900]">

      {/* LEFT: Mobile Menu */}
      <button
        className="lg:hidden text-gray-700 hover:text-black"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* CENTER: Title or Breadcrumb */}
      <h2 className="font-semibold text-gray-800 hidden sm:block">
        Super Admin Panel
      </h2>

      {/* RIGHT: User Avatar */}
      <Image
        src="/avatar.png"
        alt="User"
        width={32}
        height={32}
        className="rounded-full border"
      />
    </header>
  );
}
