"use client";

import Link from "next/link";

export default function LandlordVerifyHome() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Renter Verification</h1>

      <Link
        href="/landlord/verify/send"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Send Verification Link
      </Link>
    </div>
  );
}
