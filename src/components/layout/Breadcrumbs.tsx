"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  let path = "";

  return (
    <div className="text-sm text-gray-500 flex gap-2">
      <Link href="/dashboard" className="text-gray-700 hover:text-black">Dashboard</Link>
      {parts.slice(1).map((part, i) => {
        path += `/${part}`;
        return (
          <span key={i} className="flex gap-2 items-center">
            <span>/</span>
            <Link href={path} className="capitalize hover:text-black">
              {part.replace("-", " ")}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
