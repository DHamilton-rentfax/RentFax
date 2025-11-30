"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null; // hide on home page

  // Capitalize words and handle IDs
  const formatSegment = (segment: string) => {
    if (!isNaN(Number(segment))) return `#${segment}`;
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const paths = segments.map((segment, index) => ({
    name: formatSegment(segment),
    href: "/" + segments.slice(0, index + 1).join("/"),
  }));

  return (
    <nav
      className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-1"
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
      >
        <Home size={14} /> <span>Home</span>
      </Link>

      {paths.map((segment, i) => (
        <div key={segment.href} className="flex items-center">
          <ChevronRight size={14} className="mx-1 text-gray-400" />
          {i === paths.length - 1 ? (
            <span className="text-gray-800 dark:text-gray-200 font-medium">
              {segment.name}
            </span>
          ) : (
            <Link
              href={segment.href}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              {segment.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
