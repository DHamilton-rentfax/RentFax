"use client";

import Link from "next/link";

export default function RenterVerifyStart() {
  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Step 1 — Upload Your ID</h1>
      <p className="text-gray-600 mb-6">
        Use a government-issued ID. Make sure the image is clear and well-lit.
      </p>

      <Link
        href="/renter/verify/upload-id"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block"
      >
        Continue
      </Link>
    </div>
  );
}
