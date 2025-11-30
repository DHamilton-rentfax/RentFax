"use client";
import Link from "next/link";

export default function UpgradePage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Upgrade Required</h1>
      <p className="mb-6">
        This feature is available only on the Pro plan and above.
      </p>
      <Link href="/pricing" className="bg-blue-600 text-white px-4 py-2 rounded">
        View Plans
      </Link>
    </div>
  );
}