"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";

export default function CompanyLink({
  companyId,
  companyName,
}: {
  companyId: string;
  companyName: string;
}) {
  if (!companyId)
    return <span className="text-gray-500 italic">Unknown Company</span>;

  return (
    <Link
      href={`/admin/companies/${companyId}`}
      className="flex items-center gap-1 text-blue-600 hover:underline hover:text-blue-800 transition"
    >
      <Building2 className="h-4 w-4 text-blue-500" />
      {companyName || "Unnamed Company"}
    </Link>
  );
}
