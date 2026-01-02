'use client';

import Link from "next/link";

export default function VerifyCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Verification canceled</h1>
        <p className="text-gray-600">
          No charge was made.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-black text-white px-4 py-2 text-sm"
        >
          Return to search
        </Link>
      </div>
    </div>
  );
}
