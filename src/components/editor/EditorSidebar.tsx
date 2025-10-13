"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";

const navItems = [
  { href: "/editor", label: "Dashboard", icon: FileText },
  { href: "/editor/posts", label: "Blog Posts", icon: FileText },
  { href: "/editor/analytics", label: "Analytics", icon: FileText },
];

export function EditorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 flex flex-col">
      <div className="p-4 text-2xl font-bold">RentFAX Editor</div>
      <nav className="flex-1 space-y-2 p-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center px-4 py-2 rounded-md transition ${
              pathname === href ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
